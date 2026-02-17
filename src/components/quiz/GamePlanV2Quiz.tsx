'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import {
  ELITE_UNIVERSITY_GAMEPLAN_V2_ID,
  ELITE_UNIVERSITY_GAMEPLAN_V2_MAX_STEPS,
  ELITE_UNIVERSITY_GAMEPLAN_V2_QUESTIONS,
  ELITE_UNIVERSITY_GAMEPLAN_V2_SETTINGS,
  ELITE_UNIVERSITY_GAMEPLAN_V2_START_QUESTION_ID,
  type GamePlanV2Question,
} from '@/data/elite-university-gameplan-v2';
import {
  initializeTracking,
  trackLeadFormSubmit,
  trackPageView,
  trackQuestionAnswer,
  trackQuizComplete,
  trackQuizStart,
  trackScoreCalculated,
  type LeadData,
} from '@/lib/temp-tracking';
import { trackQuizStepViewed } from '@/lib/unified-tracking';
import {
  extractUTMParameters,
  getStoredUTMParameters,
  hasUTMParameters,
  storeUTMParameters,
  type UTMParameters,
} from '@/utils/utm-utils';
import { trackUTMParameters } from '@/utils/utm-tracker';
import {
  calculateEliteUniversityReadinessScore,
  type EliteUniversityReadinessResults,
} from '@/utils/elite-university-scoring';
import { getMetaCookies } from '@/lib/meta-capi-cookies';
import { getLeadIdToken, getTrustedFormCertUrl, useTrustedForm } from '@/hooks/useTrustedForm';
import { useFunnelLayout } from '@/hooks/useFunnelFooter';

type QuizAnswer = Record<string, unknown>;

type ContactInfoAnswer = {
  firstName: string;
  lastName: string;
  studentFirstName?: string;
  email: string;
  phone: string;
};

const RESULTS_LAYOUT_VARIANT_KEY = 'results_layout_variant';

const getResultsRoute = (): string => {
  if (typeof window === 'undefined') return '/quiz/elite-university-readiness/results';

  const stored = sessionStorage.getItem(RESULTS_LAYOUT_VARIANT_KEY);
  if (stored === 'video') return '/quiz/elite-university-readiness/results-video';
  if (stored === 'simplified') return '/quiz/elite-university-readiness/results';

  const variant = Math.random() < 0.5 ? 'video' : 'simplified';
  sessionStorage.setItem(RESULTS_LAYOUT_VARIANT_KEY, variant);

  return variant === 'video'
    ? '/quiz/elite-university-readiness/results-video'
    : '/quiz/elite-university-readiness/results';
};

const parseJsonResponse = async (response: Response): Promise<Record<string, unknown>> => {
  try {
    const text = await response.text();
    if (!text) return {};
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { raw: text, success: false, error: 'Invalid JSON response' };
    }
  } catch (error) {
    return { success: false, error: `Failed to parse response: ${String(error)}` };
  }
};

const mapV2AnswersToLegacyScoringInput = (answers: QuizAnswer): QuizAnswer => ({
  graduation_year: answers.q2_graduation_year,
  gpa_score: answers.q6_gpa,
  ap_course_load: answers.q7_ap_ib,
  test_scores: answers.q8_test_scores,
  extracurriculars: answers.q9_extracurriculars,
  achievements: answers.q10_awards,
  essays: answers.q12_essays,
  recommendations: answers.q13_recommendations,
  application_strategy: answers.q3_early_decision,
  research_internships: answers.q11_research,
  diversity_factors: answers.q14_background,
  household_income: answers.q5_household_income,
  financial_planning: answers.q4_financial_readiness,
});

const getLeadPriority = (tags: Set<string>): 'high' | 'medium' | 'low' => {
  const has = (tag: string) => tags.has(tag);

  if (has('income_premium') && has('high_intent')) return 'high';
  if (has('income_high')) return 'medium';
  if (has('income_low')) return 'low';
  return 'medium';
};

const toQuizQuestionProps = (question: GamePlanV2Question) => {
  if (question.type === 'single_select') {
    return {
      id: question.id,
      title: question.text,
      type: 'multiple-choice' as const,
      options: question.options,
      required: true,
    };
  }

  if (question.type === 'multi_select') {
    return {
      id: question.id,
      title: question.text,
      type: 'multi-select' as const,
      options: question.options,
      required: true,
    };
  }

  if (question.type === 'slider') {
    const isGpa = question.id === 'q6_gpa';
    return {
      id: question.id,
      title: question.text,
      type: 'slider' as const,
      min: question.min,
      max: question.max,
      step: question.step,
      defaultValue: question.default,
      sliderFormat: isGpa ? ('gpa' as const) : ('number' as const),
      sliderDecimals: isGpa ? 2 : 0,
      sliderSuffix: isGpa ? '' : ' AP / IB Courses',
      sliderMinLabel: String(question.min),
      sliderMaxLabel: question.id === 'q7_ap_ib' ? '8+' : String(question.max),
      required: true,
    };
  }

  if (question.type === 'form') {
    return {
      id: question.id,
      title: question.text,
      type: 'personal-info' as const,
      required: true,
    };
  }

  return null;
};

export const GamePlanV2Quiz = () => {
  const router = useRouter();

  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());
  const [utmParams, setUtmParams] = useState<UTMParameters | null>(null);

  const [currentQuestionId, setCurrentQuestionId] = useState<string>(
    ELITE_UNIVERSITY_GAMEPLAN_V2_START_QUESTION_ID,
  );
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [calculatedResults, setCalculatedResults] = useState<EliteUniversityReadinessResults | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useTrustedForm({ enabled: true });
  useFunnelLayout();

  const questionsById = useMemo(() => {
    const entries = ELITE_UNIVERSITY_GAMEPLAN_V2_QUESTIONS.map((q) => [q.id, q] as const);
    return new Map(entries);
  }, []);

  const currentQuestion = questionsById.get(currentQuestionId) ?? null;
  const currentStep = answeredQuestionIds.length;

  useEffect(() => {
    const sessionId = `gameplan_v2_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    setQuizSessionId(sessionId);
    setQuizStartTime(Date.now());

    initializeTracking();
    trackPageView('Free Elite Admissions Game Plan | ParentSimple', '/gameplan');
    trackQuizStart(ELITE_UNIVERSITY_GAMEPLAN_V2_ID, sessionId);

    const extractAndTrackUTM = async () => {
      const alreadyTracked =
        typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('utm_tracked') : null;
      if (alreadyTracked === 'true') {
        const stored = getStoredUTMParameters();
        if (stored) setUtmParams(stored);
        return;
      }

      const extracted = extractUTMParameters();
      if (hasUTMParameters(extracted)) {
        setUtmParams(extracted);
        storeUTMParameters(extracted);
        const ok = await trackUTMParameters(sessionId, extracted);
        if (ok && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('utm_tracked', 'true');
        }
      } else {
        const stored = getStoredUTMParameters();
        if (stored) setUtmParams(stored);
      }
    };

    extractAndTrackUTM();
  }, []);

  useEffect(() => {
    if (!quizSessionId || !currentQuestion) return;

    const previousQuestionId =
      answeredQuestionIds.length > 0
        ? answeredQuestionIds[answeredQuestionIds.length - 1]
        : null;

    trackQuizStepViewed(
      currentStep + 1,
      currentQuestion.id,
      quizSessionId,
      ELITE_UNIVERSITY_GAMEPLAN_V2_ID,
      previousQuestionId,
      ELITE_UNIVERSITY_GAMEPLAN_V2_MAX_STEPS,
    );
  }, [currentStep, currentQuestion, quizSessionId, answeredQuestionIds]);

  useEffect(() => {
    if (!currentQuestion || currentQuestion.type !== 'message') return;

    const completionTime = Math.round((Date.now() - quizStartTime) / 1000);
    trackQuizComplete(
      ELITE_UNIVERSITY_GAMEPLAN_V2_ID,
      quizSessionId || 'unknown',
      'college_consulting',
      completionTime,
    );
  }, [currentQuestion, quizSessionId, quizStartTime]);

  const appendTagsFromQuestion = (
    question: GamePlanV2Question,
    answer: string | string[] | number | ContactInfoAnswer,
    existing: Set<string>,
  ): Set<string> => {
    const nextTags = new Set(existing);
    if (!question.tags) return nextTags;

    if (typeof answer === 'string') {
      (question.tags[answer] || []).forEach((tag) => nextTags.add(tag));
      return nextTags;
    }

    if (Array.isArray(answer)) {
      answer.forEach((value) => {
        (question.tags?.[value] || []).forEach((tag) => nextTags.add(tag));
      });
    }

    return nextTags;
  };

  const goToNextQuestion = (
    question: GamePlanV2Question,
    answer: string | string[] | number | ContactInfoAnswer,
    existingTags: Set<string>,
  ) => {
    let nextQuestionId: string | undefined = question.next;

    if (question.type === 'single_select' && typeof answer === 'string' && question.branch) {
      nextQuestionId = question.branch[answer] || question.next;
    }

    const tagsWithTerminal = new Set(existingTags);

    if (nextQuestionId) {
      const nextQuestion = questionsById.get(nextQuestionId);
      if (nextQuestion?.type === 'message' && nextQuestion.tag) {
        nextQuestion.tag.forEach((tag) => tagsWithTerminal.add(tag));
      }
    }

    setTags(tagsWithTerminal);

    if (!nextQuestionId) return;

    setAnsweredQuestionIds((prev) => [...prev, question.id]);
    setCurrentQuestionId(nextQuestionId);
  };

  const handleStandardAnswer = (
    question: GamePlanV2Question,
    answer: string | string[] | number,
  ) => {
    trackQuestionAnswer(
      question.id,
      answer,
      currentStep + 1,
      ELITE_UNIVERSITY_GAMEPLAN_V2_MAX_STEPS,
      quizSessionId || 'unknown',
      ELITE_UNIVERSITY_GAMEPLAN_V2_ID,
    );

    const updatedAnswers = { ...answers, [question.id]: answer };
    setAnswers(updatedAnswers);

    const mergedTags = appendTagsFromQuestion(question, answer, tags);

    const scoringInput = mapV2AnswersToLegacyScoringInput(updatedAnswers);
    if (ELITE_UNIVERSITY_GAMEPLAN_V2_SETTINGS.scoring && typeof scoringInput.graduation_year === 'string') {
      const score = calculateEliteUniversityReadinessScore(
        scoringInput,
        scoringInput.graduation_year,
      );
      setCalculatedResults(score);
      trackScoreCalculated(quizSessionId || 'unknown', score.totalScore, score.category);
    }

    goToNextQuestion(question, answer, mergedTags);
  };

  const submitLead = async (contactInfo: ContactInfoAnswer) => {
    if (!currentQuestion) return;

    setIsSubmitting(true);

    const updatedAnswers = { ...answers, [currentQuestion.id]: contactInfo };
    setAnswers(updatedAnswers);

    const scoringInput = mapV2AnswersToLegacyScoringInput(updatedAnswers);
    const scoringResults =
      ELITE_UNIVERSITY_GAMEPLAN_V2_SETTINGS.scoring && typeof scoringInput.graduation_year === 'string'
        ? calculateEliteUniversityReadinessScore(scoringInput, scoringInput.graduation_year)
        : null;

    if (scoringResults) {
      setCalculatedResults(scoringResults);
      trackScoreCalculated(
        quizSessionId || 'unknown',
        scoringResults.totalScore,
        scoringResults.category,
      );
    }

    const activeTags = Array.from(tags);
    const leadPriority = getLeadPriority(tags);

    const trustedFormCertUrl = getTrustedFormCertUrl() || null;
    const jornayaLeadId = getLeadIdToken() || null;
    const metaCookies = getMetaCookies();

    const payload = {
      email: contactInfo.email,
      phoneNumber: contactInfo.phone,
      firstName: contactInfo.firstName,
      lastName: contactInfo.lastName,
      studentFirstName: contactInfo.studentFirstName,
      quizAnswers: {
        ...updatedAnswers,
        quiz_id: ELITE_UNIVERSITY_GAMEPLAN_V2_ID,
        quiz_mode: ELITE_UNIVERSITY_GAMEPLAN_V2_SETTINGS.mode,
        scoring_enabled: ELITE_UNIVERSITY_GAMEPLAN_V2_SETTINGS.scoring,
        lead_tagging_enabled: ELITE_UNIVERSITY_GAMEPLAN_V2_SETTINGS.lead_tagging,
        lead_tags: activeTags,
        lead_priority: leadPriority,
      },
      calculatedResults: scoringResults,
      zipCode: null,
      state: null,
      stateName: null,
      licensingInfo: null,
      utmParams,
      sessionId: quizSessionId || 'unknown',
      funnelType: 'college_consulting',
      leadTags: activeTags,
      leadPriority,
      trustedFormCertUrl,
      trustedform_cert_url: trustedFormCertUrl,
      jornayaLeadId,
      jornaya_lead_id: jornayaLeadId,
      metaCookies,
    };

    try {
      const emailCaptureResponse = await fetch('/api/leads/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await parseJsonResponse(emailCaptureResponse);

      const leadResponse = await fetch('/api/leads/submit-without-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await parseJsonResponse(leadResponse);

      const leadData: LeadData = {
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phoneNumber: contactInfo.phone,
        zipCode: '',
        state: '',
        stateName: '',
        quizAnswers: updatedAnswers,
        sessionId: quizSessionId || 'unknown',
        funnelType: 'college_consulting',
        leadScore: scoringResults?.totalScore || 0,
        householdIncome:
          typeof updatedAnswers.q5_household_income === 'string'
            ? updatedAnswers.q5_household_income
            : undefined,
      };
      trackLeadFormSubmit(leadData);

      const completionTime = Math.round((Date.now() - quizStartTime) / 1000);
      trackQuizComplete(
        ELITE_UNIVERSITY_GAMEPLAN_V2_ID,
        quizSessionId || 'unknown',
        'college_consulting',
        completionTime,
      );

      if (typeof sessionStorage !== 'undefined' && scoringResults) {
        sessionStorage.setItem(
          'elite_university_readiness_results',
          JSON.stringify({
            ...scoringResults,
            graduationYear: updatedAnswers.q2_graduation_year,
          }),
        );
      }

      const resultsRoute = getResultsRoute();
      const readinessScore = scoringResults?.totalScore || 0;
      const category = scoringResults?.category || 'Needs Improvement';
      router.push(`${resultsRoute}?score=${readinessScore}&category=${encodeURIComponent(category)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = async (answer: string | string[] | number | ContactInfoAnswer) => {
    if (!currentQuestion) return;

    if (currentQuestion.type === 'form') {
      await submitLead(answer as ContactInfoAnswer);
      return;
    }

    if (
      currentQuestion.type === 'single_select' ||
      currentQuestion.type === 'multi_select' ||
      currentQuestion.type === 'slider'
    ) {
      handleStandardAnswer(currentQuestion, answer as string | string[] | number);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto p-6 min-h-screen bg-[#F9F6EF]">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-semibold text-[#1A2B49] mb-3">Quiz configuration error</h2>
          <p className="text-gray-700">Question not found.</p>
        </div>
      </div>
    );
  }

  if (currentQuestion.type === 'message') {
    return (
      <div className="max-w-2xl mx-auto p-6 min-h-screen bg-[#F9F6EF]">
        <QuizProgress currentStep={currentStep} totalSteps={ELITE_UNIVERSITY_GAMEPLAN_V2_MAX_STEPS} />
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center mt-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#1A2B49] mb-4">Thanks for sharing</h2>
          <p className="text-lg text-gray-700 mb-6">{currentQuestion.text}</p>
          <button
            type="button"
            className="quiz-button bg-[#36596A] text-white py-3 px-6 rounded-xl font-bold hover:bg-[#2a4a5a] transition-all"
            onClick={() => router.push('/college-planning')}
          >
            Browse College Planning
          </button>
        </div>
      </div>
    );
  }

  const quizQuestion = toQuizQuestionProps(currentQuestion);

  if (!quizQuestion) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen bg-[#F9F6EF]">
      <input type="hidden" name="xxTrustedFormCertUrl" id="xxTrustedFormCertUrl" />
      <input type="hidden" name="leadid_token" id="leadid_token" />
      <input type="hidden" name="universal_leadid" id="universal_leadid" />

      <QuizProgress currentStep={currentStep} totalSteps={ELITE_UNIVERSITY_GAMEPLAN_V2_MAX_STEPS} />

      <div className="mt-8">
        <QuizQuestion
          question={quizQuestion}
          onAnswer={handleAnswer}
          currentAnswer={answers[currentQuestion.id]}
          formVariant="gameplan"
          skipOTP={true}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};
