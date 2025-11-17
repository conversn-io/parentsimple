# Elite University Readiness Assessment Quiz - Technical Build Plan
## Comprehensive Technical Analysis & Implementation Guide

**Date:** November 2025  
**Project:** ParentSimple Elite University Readiness Assessment  
**Target:** Lead generation for Empowerly.com  
**Status:** Ready for Implementation

---

## Executive Summary

This document provides a complete technical analysis of existing quiz infrastructure and a detailed build plan for the Elite University Readiness Assessment quiz. The plan leverages proven components from SeniorSimple, SmallBizSimple, and RateRoots to ensure a fast, tested, and reliable implementation.

**Key Strategy:**
- ✅ Reuse 90% of existing infrastructure
- ✅ Adapt only quiz content and scoring logic
- ✅ Maintain CallReady CRM integration
- ✅ Preserve OTP verification flow
- ✅ Leverage database scoring configs (optional)

---

## 1. Technical Architecture Analysis

### 1.1 Existing Quiz Infrastructure

#### **Reusable Components (100% Reusable)**

**1. Quiz UI Components**
- **Location:** `02-Expansion-Operations-Planning/Publisher-Platforms/05-SmallBizSimple/src/components/quiz/`
- **Files:**
  - `BusinessFundingQuiz.tsx` - Main quiz orchestrator (adapt for ParentSimple)
  - `QuizProgress.tsx` - Progress bar component (100% reusable)
  - `QuizQuestion.tsx` - Question renderer (100% reusable)
  - `OTPVerification.tsx` - Phone verification (100% reusable)
  - `ProcessingState.tsx` - Loading state (100% reusable)

**2. API Routes (100% Reusable with Minor Adaptations)**
- **Location:** `02-Expansion-Operations-Planning/Publisher-Platforms/04-ParentSimple/src/app/api/leads/`
- **Files:**
  - `capture-email/route.ts` - Lead capture endpoint (update `site_key` and `funnel_type`)
  - `verify-otp-and-send-to-ghl/route.ts` - OTP verification + GHL webhook (update `site_key` and webhook URL)

**3. Database Integration (100% Reusable)**
- **Location:** `02-Expansion-Operations-Planning/Publisher-Platforms/04-ParentSimple/src/lib/callready-quiz-db.ts`
- **Status:** Already configured for ParentSimple
- **Tables Used:**
  - `contacts` - Contact information
  - `leads` - Lead records with quiz answers
  - `analytics_events` - Event tracking
  - `scoring_rules` - Optional: Database-driven scoring configs
  - `site_configs` - Site-specific configurations

**4. Tracking System (100% Reusable)**
- **Location:** `02-Expansion-Operations-Planning/Publisher-Platforms/04-ParentSimple/src/lib/temp-tracking.ts`
- **Status:** Already configured for ParentSimple
- **Features:**
  - GA4 integration
  - Meta Pixel integration
  - Supabase analytics events
  - UTM parameter tracking

**5. Utility Functions (100% Reusable)**
- **Location:** `02-Expansion-Operations-Planning/Publisher-Platforms/04-ParentSimple/src/utils/`
- **Files:**
  - `phone-utils.ts` - Phone formatting and validation
  - `utm-utils.ts` - UTM parameter extraction
  - `utm-tracker.ts` - UTM tracking

**6. CORS Headers (100% Reusable)**
- **Location:** `02-Expansion-Operations-Planning/Publisher-Platforms/04-ParentSimple/src/lib/cors-headers.ts`
- **Status:** Already configured

### 1.2 Lead Flow Architecture

```
User Interaction Flow:
┌─────────────────────────────────────────────────────────────┐
│ 1. User lands on quiz page                                  │
│    → Track page view (GA4, Meta, Supabase)                  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User answers quiz questions                              │
│    → Track each answer (GA4, Supabase analytics_events)      │
│    → Calculate readiness score (client-side)                │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. User submits contact info                                │
│    → POST /api/leads/capture-email                          │
│    → Upsert contact in CallReady CRM                        │
│    → Create/update lead record (status: 'email_captured')   │
│    → Fire Meta Lead event                                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. OTP Verification                                         │
│    → POST /api/send-otp (if not already sent)              │
│    → User enters OTP code                                   │
│    → POST /api/verify-otp                                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Lead Verification & GHL Delivery                         │
│    → POST /api/leads/verify-otp-and-send-to-ghl            │
│    → Update lead status to 'verified'                       │
│    → Send complete lead data to Empowerly GHL webhook       │
│    → Track conversion events                                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Results Page                                             │
│    → Display readiness score and category                   │
│    → Show personalized recommendations                      │
│    → Display Empowerly CTA                                  │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Database Schema

**CallReady CRM Tables (Already Configured):**

```sql
-- contacts table
{
  id: UUID (primary key)
  email: TEXT (unique, indexed)
  first_name: TEXT
  last_name: TEXT
  phone: TEXT (E.164 format)
  phone_hash: TEXT (SHA256 hash)
  source: TEXT ('parentsimple_quiz')
  created_at: TIMESTAMPTZ
  updated_at: TIMESTAMPTZ
}

-- leads table
{
  id: UUID (primary key)
  contact_id: UUID (foreign key → contacts.id)
  session_id: TEXT (indexed)
  site_key: TEXT ('parentsimple.org')
  funnel_type: TEXT ('college_consulting')
  status: TEXT ('email_captured' | 'phone_captured' | 'verified')
  is_verified: BOOLEAN
  verified_at: TIMESTAMPTZ
  zip_code: TEXT
  state: TEXT
  state_name: TEXT
  quiz_answers: JSONB {
    graduation_year: string
    academic_performance: string
    test_scores: string
    extracurriculars: string
    achievements: string
    essays: string
    recommendations: string
    application_strategy: string
    research_internships: string
    diversity_factors: string
    financial_planning: string
    calculated_results: {
      readiness_score: number (0-100)
      readiness_category: string
      category_breakdown: {
        academics: number
        test_scores: number
        extracurriculars: number
        achievements: number
        essays: number
        recommendations: number
        strategy: number
        research: number
        diversity: number
      }
      strengths: string[]
      improvements: string[]
      recommendations: string[]
    }
  }
  utm_parameters: JSONB
  created_at: TIMESTAMPTZ
  updated_at: TIMESTAMPTZ
}

-- analytics_events table
{
  id: UUID (primary key)
  event_name: TEXT ('quiz_start' | 'quiz_answer' | 'quiz_complete' | 'lead_form_submit' | 'otp_verified')
  event_category: TEXT ('quiz' | 'lead_capture' | 'otp')
  event_label: TEXT ('parentsimple_quiz')
  session_id: TEXT (indexed)
  user_id: TEXT
  properties: JSONB
  created_at: TIMESTAMPTZ
}

-- scoring_rules table (Optional - for database-driven scoring)
{
  id: UUID (primary key)
  rule_name: TEXT (unique)
  rule_type: TEXT ('academic' | 'test_score' | 'extracurricular' | etc.)
  condition: JSONB (rule conditions)
  score_adjustment: INTEGER (points to add/subtract)
  is_active: BOOLEAN
  priority: INTEGER
  description: TEXT
}

-- site_configs table (Optional - for site-specific configs)
{
  id: UUID (primary key)
  site_key: TEXT ('PARENTSIMPLE')
  config_key: TEXT ('min_lead_score' | 'scoring_weights' | etc.)
  config_value: JSONB
  is_active: BOOLEAN
}
```

---

## 2. Quiz Content Structure

### 2.1 Question Set (Based on Research Report)

**Total Questions:** 10 (including graduation year)

**Question 0: Graduation Year (Context Setter)**
```typescript
{
  id: 'graduation_year',
  title: 'What year will your child graduate from high school?',
  subtitle: 'This helps us provide timeline-specific recommendations',
  type: 'dropdown',
  options: [
    { value: '', label: '-- Select Graduation Year --' },
    { value: '2027', label: '2027 (Current Senior)' },
    { value: '2028', label: '2028 (Current Junior)' },
    { value: '2029', label: '2029 (Current Sophomore)' },
    { value: '2030', label: '2030 (Current Freshman)' },
    { value: 'other', label: 'Other / Not sure' }
  ],
  required: true
}
```

**Question 1-10:** See research report (`ELITE-UNIVERSITY-READINESS-ASSESSMENT-RESEARCH-2025.md`) for complete question definitions.

### 2.2 Scoring Logic

**Scoring Function Location:** `src/utils/elite-university-scoring.ts`

**Scoring Approach:**
1. **Client-Side Calculation** (Primary): Calculate score in quiz component
2. **Database Config** (Optional): Use `scoring_rules` table for dynamic adjustments
3. **Context-Aware Modifiers**: Adjust scoring based on graduation year

**Scoring Rubric:**
- Total Points: 100
- Weighted by question importance
- Context-adjusted by graduation year
- Categories: Elite Ready (85-100), Competitive (70-84), Developing (55-69), Needs Improvement (<55)

**Implementation Pattern:**
```typescript
// Based on SmallBizSimple pattern
export function calculateEliteUniversityReadinessScore(
  answers: Record<string, any>,
  graduationYear: string
): {
  totalScore: number;
  category: string;
  breakdown: Record<string, number>;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
} {
  // Base scoring logic with graduation year modifiers
  // Returns comprehensive results object
}
```

---

## 3. Implementation Plan

### Phase 1: Quiz Component Development (Days 1-2)

#### Step 1.1: Create Quiz Questions File
**File:** `src/data/elite-university-questions.ts`

**Action:**
- Copy question structure from research report
- Format as TypeScript array matching `BusinessFundingQuiz` pattern
- Include all 10 questions with proper types and options

**Reference:**
- `02-Expansion-Operations-Planning/Products-Services/1. Leads/03-SmallBizSimple-Lead-Gen/BUSINESS-LOAN-QUESTIONS-REFERENCE.ts`

#### Step 1.2: Create Scoring Function
**File:** `src/utils/elite-university-scoring.ts`

**Action:**
- Implement scoring logic from research report
- Add graduation year context modifiers
- Return comprehensive results object

**Reference:**
- `02-Expansion-Operations-Planning/Products-Services/1. Leads/03-SmallBizSimple-Lead-Gen/BUSINESS-LOAN-QUESTIONS-REFERENCE.ts` (lines 147-194)
- `05-Web-Applications/01-RateRoots-Platform/rateroots-platform/src/utils/quiz-results.ts`

**Key Features:**
- Weighted scoring (25% academics, 20% tests, 20% extracurriculars, etc.)
- Graduation year modifiers (freshman/sophomore get neutral scores for "not yet taken")
- Category breakdown (academics, test scores, extracurriculars, etc.)
- Strengths and improvements identification
- Personalized recommendations

#### Step 1.3: Create Main Quiz Component
**File:** `src/components/quiz/EliteUniversityReadinessQuiz.tsx`

**Action:**
- Copy `BusinessFundingQuiz.tsx` structure
- Adapt for ParentSimple branding (colors, fonts)
- Integrate scoring function
- Add graduation year context handling
- Update question flow

**Reference:**
- `02-Expansion-Operations-Planning/Publisher-Platforms/05-SmallBizSimple/src/components/quiz/BusinessFundingQuiz.tsx`

**Key Adaptations:**
- Replace business questions with university readiness questions
- Update scoring function call
- Update tracking event labels
- Update branding colors (Oxford Blue #1A2B49, Sage Green #9DB89D)
- Update funnel type to `'college_consulting'`

#### Step 1.4: Verify Reusable Components
**Files to Check (Should Already Exist):**
- `src/components/quiz/QuizProgress.tsx` ✅
- `src/components/quiz/QuizQuestion.tsx` ✅
- `src/components/quiz/OTPVerification.tsx` ✅
- `src/components/quiz/ProcessingState.tsx` ✅

**Action:**
- Verify components exist in ParentSimple
- If missing, copy from SmallBizSimple
- Update branding colors if needed

### Phase 2: API Route Updates (Day 2)

#### Step 2.1: Update Capture Email Route
**File:** `src/app/api/leads/capture-email/route.ts`

**Current Status:** Already exists for ParentSimple

**Required Updates:**
- Verify `site_key: 'parentsimple.org'` ✅ (should already be set)
- Verify `funnel_type: 'college_consulting'` ✅ (should already be set)
- Verify `source: 'parentsimple_quiz'` ✅ (should already be set)
- No changes needed if already configured

#### Step 2.2: Update OTP Verification Route
**File:** `src/app/api/leads/verify-otp-and-send-to-ghl/route.ts`

**Current Status:** Already exists for ParentSimple

**Required Updates:**
- Verify `PARENT_SIMPLE_GHL_WEBHOOK` environment variable is set
- Verify `site_key: 'parentsimple.org'` ✅
- Verify `funnel_type: 'college_consulting'` ✅
- Verify `source: 'ParentSimple Quiz'` in GHL payload ✅
- Verify `profit_center: 'ParentSimple.org'` (if field exists) ✅

**GHL Webhook Payload Structure:**
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: 'ParentSimple Quiz';
  quizAnswers: {
    graduation_year: string;
    academic_performance: string;
    test_scores: string;
    // ... all quiz answers
  };
  calculatedResults: {
    readiness_score: number;
    readiness_category: string;
    category_breakdown: Record<string, number>;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
  utmParams: Record<string, string>;
  site_key: 'parentsimple.org';
  funnel_type: 'college_consulting';
}
```

### Phase 3: Results Page Development (Day 3)

#### Step 3.1: Create Results Component
**File:** `src/components/quiz/EliteUniversityReadinessResults.tsx`

**Action:**
- Create results display component
- Show readiness score (0-100)
- Display readiness category (Elite Ready, Competitive, Developing, Needs Improvement)
- Show category breakdown (visual chart/table)
- List strengths and areas for improvement
- Display personalized recommendations
- Include Empowerly CTA based on score

**Reference:**
- `02-Expansion-Operations-Planning/Publisher-Platforms/05-SmallBizSimple/src/components/quiz/ProcessingState.tsx` (for structure)
- Research report for recommendation templates

**Key Features:**
- Timeline-specific recommendations (based on graduation year)
- Visual score display (progress bar, category badge)
- Category breakdown visualization
- Actionable recommendations
- Empowerly service recommendations by score range

#### Step 3.2: Create Results Page Route
**File:** `src/app/quiz/elite-university-readiness/results/page.tsx`

**Action:**
- Create Next.js page component
- Display results component
- Handle URL parameters (score, category, etc.)
- Include tracking for results page view

### Phase 4: Quiz Page Route (Day 3)

#### Step 4.1: Create Quiz Page Route
**File:** `src/app/quiz/elite-university-readiness/page.tsx`

**Action:**
- Create Next.js page component
- Import and render `EliteUniversityReadinessQuiz`
- Set up page metadata (SEO)
- Include tracking initialization

**Reference:**
- `02-Expansion-Operations-Planning/Publisher-Platforms/05-SmallBizSimple/src/app/quiz/business-funding/page.tsx`

### Phase 5: Tracking & Analytics (Day 3-4)

#### Step 5.1: Verify Tracking Configuration
**File:** `src/lib/temp-tracking.ts`

**Current Status:** Already configured for ParentSimple

**Required Updates:**
- Verify event labels use `'parentsimple_quiz'` ✅
- Verify `site_key: 'PARENTSIMPLE'` ✅
- Verify `funnel_type: 'college_consulting'` ✅
- No changes needed if already configured

#### Step 5.2: Add Quiz-Specific Tracking Events
**Events to Track:**
- `quiz_start` - When quiz begins
- `quiz_question_answer` - Each question answered
- `quiz_graduation_year_selected` - Graduation year captured
- `quiz_score_calculated` - Score calculated (include score value)
- `quiz_complete` - Quiz completed
- `lead_form_submit` - Contact info submitted
- `otp_verified` - Phone verified
- `results_page_view` - Results page viewed
- `empowerly_cta_click` - Empowerly CTA clicked

### Phase 6: Database Configuration (Optional - Day 4)

#### Step 6.1: Create Scoring Rules (Optional)
**Action:**
- Insert scoring rules into `scoring_rules` table
- Create site configs in `site_configs` table
- Enable database-driven scoring adjustments

**Reference:**
- `04-Data-Ops/callready-database/supabase/migrations/2025012910_phase3_scoring.sql`

**Example Scoring Rule:**
```sql
INSERT INTO scoring_rules (rule_name, rule_type, condition, score_adjustment, priority, description, is_active) VALUES
('elite_academic_performance', 'academic', '{"gpa": "3.9-4.0", "ap_courses": "8+"}', 25, 1, 'Elite academic performance', true),
('strong_test_scores', 'test_score', '{"sat": "1500+", "act": "34+"}', 20, 1, 'Strong standardized test scores', true);
```

**Note:** This is optional. Client-side scoring is sufficient for MVP.

### Phase 7: Environment Variables (Day 4)

#### Step 7.1: Verify Environment Variables
**File:** `.env.local` (or Vercel environment variables)

**Required Variables:**
```bash
# CallReady CRM
SUPABASE_QUIZ_URL=https://jqjftrlnyysqcwbbigpw.supabase.co
SUPABASE_QUIZ_ANON_KEY=...
SUPABASE_QUIZ_SERVICE_ROLE_KEY=...

# GHL Webhook
PARENT_SIMPLE_GHL_WEBHOOK=https://services.leadconnectorhq.com/...

# Analytics
NEXT_PUBLIC_GA4_MEASUREMENT_ID_PARENTSIMPLE=G-...
NEXT_PUBLIC_META_PIXEL_ID_PARENTSIMPLE=...

# Site Configuration
NEXT_PUBLIC_SITE_KEY=parentsimple.org
```

### Phase 8: Testing & Deployment (Day 4-5)

#### Step 8.1: Local Testing
**Test Checklist:**
- [ ] Quiz questions render correctly
- [ ] Scoring calculation works
- [ ] Graduation year modifiers apply correctly
- [ ] Lead capture API works
- [ ] OTP verification flow works
- [ ] GHL webhook receives complete data
- [ ] Results page displays correctly
- [ ] Tracking events fire correctly
- [ ] Mobile responsiveness
- [ ] Error handling

#### Step 8.2: Staging Deployment
**Action:**
- Deploy to Vercel staging
- Test end-to-end flow
- Verify GHL webhook delivery
- Check analytics events

#### Step 8.3: Production Deployment
**Action:**
- Deploy to production
- Monitor for errors
- Verify lead delivery
- Check analytics

---

## 4. File Structure

### New Files to Create

```
02-Expansion-Operations-Planning/Publisher-Platforms/04-ParentSimple/
├── src/
│   ├── components/
│   │   └── quiz/
│   │       ├── EliteUniversityReadinessQuiz.tsx        [NEW]
│   │       └── EliteUniversityReadinessResults.tsx     [NEW]
│   ├── app/
│   │   └── quiz/
│   │       └── elite-university-readiness/
│   │           ├── page.tsx                            [NEW]
│   │           └── results/
│   │               └── page.tsx                        [NEW]
│   ├── data/
│   │   └── elite-university-questions.ts               [NEW]
│   └── utils/
│       └── elite-university-scoring.ts                [NEW]
```

### Files to Update

```
02-Expansion-Operations-Planning/Publisher-Platforms/04-ParentSimple/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── leads/
│   │           ├── capture-email/route.ts             [VERIFY - should be OK]
│   │           └── verify-otp-and-send-to-ghl/route.ts [VERIFY - should be OK]
│   └── lib/
│       └── temp-tracking.ts                           [VERIFY - should be OK]
```

### Files to Reuse (No Changes)

```
02-Expansion-Operations-Planning/Publisher-Platforms/04-ParentSimple/
├── src/
│   ├── components/
│   │   └── quiz/
│   │       ├── QuizProgress.tsx                       [REUSE]
│   │       ├── QuizQuestion.tsx                        [REUSE]
│   │       ├── OTPVerification.tsx                     [REUSE]
│   │       └── ProcessingState.tsx                     [REUSE]
│   ├── lib/
│   │   ├── callready-quiz-db.ts                       [REUSE]
│   │   └── cors-headers.ts                            [REUSE]
│   └── utils/
│       ├── phone-utils.ts                            [REUSE]
│       ├── utm-utils.ts                               [REUSE]
│       └── utm-tracker.ts                             [REUSE]
```

---

## 5. Code Examples

### 5.1 Quiz Questions Structure

```typescript
// src/data/elite-university-questions.ts
export const ELITE_UNIVERSITY_QUESTIONS = [
  {
    id: 'graduation_year',
    title: 'What year will your child graduate from high school?',
    subtitle: 'This helps us provide timeline-specific recommendations',
    type: 'dropdown' as const,
    options: [
      { value: '', label: '-- Select Graduation Year --' },
      { value: '2027', label: '2027 (Current Senior)' },
      { value: '2028', label: '2028 (Current Junior)' },
      { value: '2029', label: '2029 (Current Sophomore)' },
      { value: '2030', label: '2030 (Current Freshman)' },
      { value: 'other', label: 'Other / Not sure' }
    ],
    required: true,
  },
  {
    id: 'academic_performance',
    title: 'What is your child\'s current GPA, and how many Advanced Placement (AP) or International Baccalaureate (IB) courses have they completed or are currently enrolled in?',
    subtitle: 'Academic excellence is the foundation of elite admissions',
    type: 'dropdown' as const,
    options: [
      { value: '', label: '-- Select --' },
      { value: 'gpa_3.9_4.0_ap_8plus', label: 'GPA 3.9-4.0, 8+ AP/IB courses' },
      { value: 'gpa_3.7_3.89_ap_5_7', label: 'GPA 3.7-3.89, 5-7 AP/IB courses' },
      { value: 'gpa_3.5_3.69_ap_3_4', label: 'GPA 3.5-3.69, 3-4 AP/IB courses' },
      { value: 'gpa_3.0_3.49_ap_1_2', label: 'GPA 3.0-3.49, 1-2 AP/IB courses' },
      { value: 'gpa_below_3.0_no_ap', label: 'GPA below 3.0, no AP/IB courses' }
    ],
    required: true,
  },
  // ... additional questions from research report
];
```

### 5.2 Scoring Function

```typescript
// src/utils/elite-university-scoring.ts
export function calculateEliteUniversityReadinessScore(
  answers: Record<string, any>,
  graduationYear: string
): {
  totalScore: number;
  category: string;
  breakdown: Record<string, number>;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
} {
  let totalScore = 0;
  const breakdown: Record<string, number> = {};
  
  // Graduation year modifiers
  const yearModifiers = getGraduationYearModifiers(graduationYear);
  
  // Question 1: Academic Performance (25 points)
  const academicScore = calculateAcademicScore(answers.academic_performance);
  breakdown.academics = academicScore;
  totalScore += academicScore;
  
  // Question 2: Test Scores (20 points)
  const testScore = calculateTestScore(answers.test_scores, yearModifiers);
  breakdown.test_scores = testScore;
  totalScore += testScore;
  
  // ... continue for all questions
  
  // Determine category
  const category = getReadinessCategory(totalScore);
  
  // Identify strengths and improvements
  const strengths = identifyStrengths(breakdown);
  const improvements = identifyImprovements(breakdown);
  
  // Generate recommendations
  const recommendations = generateRecommendations(
    totalScore,
    category,
    breakdown,
    graduationYear
  );
  
  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    category,
    breakdown,
    strengths,
    improvements,
    recommendations
  };
}
```

### 5.3 Main Quiz Component Structure

```typescript
// src/components/quiz/EliteUniversityReadinessQuiz.tsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { OTPVerification } from './OTPVerification';
import { ProcessingState } from './ProcessingState';
import { ELITE_UNIVERSITY_QUESTIONS } from '@/data/elite-university-questions';
import { calculateEliteUniversityReadinessScore } from '@/utils/elite-university-scoring';
import { 
  initializeTracking, 
  trackQuestionAnswer, 
  trackLeadFormSubmit, 
  trackQuizStart, 
  trackQuizComplete,
  LeadData
} from '@/lib/temp-tracking';

export function EliteUniversityReadinessQuiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [calculatedResults, setCalculatedResults] = useState<any>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId] = useState(() => `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  // Initialize tracking
  useEffect(() => {
    initializeTracking();
    trackQuizStart(sessionId, 'elite_university_readiness');
  }, []);
  
  // Calculate score when answers change
  useEffect(() => {
    if (answers.graduation_year && Object.keys(answers).length >= 2) {
      const results = calculateEliteUniversityReadinessScore(
        answers,
        answers.graduation_year
      );
      setCalculatedResults(results);
    }
  }, [answers]);
  
  const handleAnswer = async (answer: any) => {
    const currentQuestion = ELITE_UNIVERSITY_QUESTIONS[currentStep];
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    // Track answer
    trackQuestionAnswer(
      currentQuestion.id,
      answer,
      currentStep + 1,
      ELITE_UNIVERSITY_QUESTIONS.length,
      sessionId,
      'elite_university_readiness'
    );
    
    // Auto-advance for most questions
    if (currentStep < ELITE_UNIVERSITY_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleContactSubmit = async (contactData: any) => {
    // Capture email/phone
    const leadData: LeadData = {
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phoneNumber: contactData.phone,
      quizAnswers: { ...answers, ...contactData },
      sessionId,
      funnelType: 'college_consulting',
      leadScore: calculatedResults?.totalScore,
      // ... other fields
    };
    
    // Track form submit
    trackLeadFormSubmit(leadData);
    
    // Call capture-email API
    await fetch('/api/leads/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: contactData.email,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        phoneNumber: contactData.phone,
        quizAnswers: answers,
        sessionId,
        funnelType: 'college_consulting',
        calculatedResults,
        utmParams: getStoredUTMParameters()
      })
    });
    
    // Show OTP verification
    setShowOTP(true);
  };
  
  const handleOTPVerified = async () => {
    setIsProcessing(true);
    
    // Call verify-otp-and-send-to-ghl
    await fetch('/api/leads/verify-otp-and-send-to-ghl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: answers.phone,
        email: answers.email,
        firstName: answers.firstName,
        lastName: answers.lastName,
        quizAnswers: answers,
        sessionId,
        funnelType: 'college_consulting',
        calculatedResults,
        utmParams: getStoredUTMParameters()
      })
    });
    
    // Track completion
    trackQuizComplete(sessionId, 'elite_university_readiness', calculatedResults?.totalScore);
    
    // Redirect to results page
    router.push(`/quiz/elite-university-readiness/results?score=${calculatedResults?.totalScore}&category=${calculatedResults?.category}`);
  };
  
  // Render logic
  if (isProcessing) {
    return <ProcessingState />;
  }
  
  if (showOTP) {
    return (
      <OTPVerification
        phoneNumber={answers.phone}
        onVerificationComplete={handleOTPVerified}
        onBack={() => setShowOTP(false)}
      />
    );
  }
  
  const currentQuestion = ELITE_UNIVERSITY_QUESTIONS[currentStep];
  
  return (
    <div className="min-h-screen bg-[#F9F6EF]">
      <QuizProgress 
        currentStep={currentStep} 
        totalSteps={ELITE_UNIVERSITY_QUESTIONS.length} 
      />
      <QuizQuestion
        question={currentQuestion}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentQuestion.id]}
      />
    </div>
  );
}
```

---

## 6. Testing Checklist

### 6.1 Functional Testing

- [ ] Quiz questions render correctly
- [ ] All question types work (dropdown, text, personal-info)
- [ ] Progress bar updates correctly
- [ ] Scoring calculation is accurate
- [ ] Graduation year modifiers apply correctly
- [ ] Results calculation includes all categories
- [ ] Lead capture API accepts data
- [ ] OTP verification flow works
- [ ] GHL webhook receives complete payload
- [ ] Results page displays correctly
- [ ] Empowerly CTA appears based on score

### 6.2 Integration Testing

- [ ] CallReady CRM receives leads
- [ ] Analytics events fire correctly
- [ ] UTM parameters are captured
- [ ] Meta Pixel events fire
- [ ] GA4 events fire
- [ ] Supabase analytics_events table receives data

### 6.3 UI/UX Testing

- [ ] Mobile responsive design
- [ ] Brand colors applied correctly
- [ ] Typography matches brand guidelines
- [ ] Loading states display correctly
- [ ] Error handling works
- [ ] Form validation works

### 6.4 Performance Testing

- [ ] Page load time < 2 seconds
- [ ] Quiz interactions are smooth
- [ ] API calls complete quickly
- [ ] No console errors

---

## 7. Deployment Checklist

### 7.1 Pre-Deployment

- [ ] All code reviewed
- [ ] Environment variables set in Vercel
- [ ] GHL webhook URL configured
- [ ] Analytics IDs configured
- [ ] Database migrations applied (if using scoring_rules)

### 7.2 Deployment

- [ ] Deploy to Vercel staging
- [ ] Test end-to-end flow
- [ ] Verify GHL webhook delivery
- [ ] Check analytics events
- [ ] Deploy to production
- [ ] Monitor for errors

### 7.3 Post-Deployment

- [ ] Verify production site loads
- [ ] Test quiz flow in production
- [ ] Verify lead delivery to GHL
- [ ] Check analytics dashboard
- [ ] Monitor error logs

---

## 8. Success Metrics

### 8.1 Quiz Performance

- **Completion Rate:** Target 70%+
- **Average Time:** Target 5-7 minutes
- **Bounce Rate:** Target <30%

### 8.2 Lead Generation

- **Lead Capture Rate:** Target 60%+ of completions
- **Qualified Lead Rate:** Target 40%+ of leads (70+ points)
- **Empowerly Consultation Booking:** Target 15%+ of qualified leads
- **Conversion to Empowerly Client:** Target 10%+ of consultations

### 8.3 User Engagement

- **Email Open Rate:** Target 40%+
- **Resource Download Rate:** Track
- **Webinar Attendance:** Track
- **Return Visits:** Track

---

## 9. Future Enhancements

### 9.1 Phase 2 Features

- Database-driven scoring rules
- A/B testing different question orders
- Personalized question flow based on answers
- Save/resume quiz functionality
- Email results to user

### 9.2 Phase 3 Features

- Integration with Empowerly API
- Real-time consultation booking
- Advanced analytics dashboard
- Lead scoring ML model
- Automated follow-up sequences

---

## 10. Resources & References

### 10.1 Research Documents

- `ELITE-UNIVERSITY-READINESS-ASSESSMENT-RESEARCH-2025.md` - Complete research and question definitions

### 10.2 Code References

- `BusinessFundingQuiz.tsx` - Main quiz component pattern
- `BUSINESS-LOAN-QUESTIONS-REFERENCE.ts` - Question structure pattern
- `quiz-results.ts` - Scoring function pattern
- `capture-email/route.ts` - Lead capture API pattern
- `verify-otp-and-send-to-ghl/route.ts` - OTP verification pattern

### 10.3 Database References

- `callready-database/docs/architecture.md` - Database schema
- `2025012910_phase3_scoring.sql` - Scoring rules migration

---

## Conclusion

This technical plan provides a complete roadmap for building the Elite University Readiness Assessment quiz using proven, tested infrastructure. By reusing 90% of existing components and adapting only the quiz content and scoring logic, we can deliver a high-quality, reliable quiz in 4-5 days.

**Key Advantages:**
- ✅ Fast development (4-5 days vs. 2-3 weeks)
- ✅ Tested infrastructure (proven in production)
- ✅ Consistent user experience
- ✅ Reliable lead delivery
- ✅ Comprehensive analytics

**Next Steps:**
1. Review and approve this plan
2. Begin Phase 1: Quiz Component Development
3. Follow implementation steps sequentially
4. Test thoroughly before production deployment

---

**Document Status:** Ready for Implementation  
**Last Updated:** November 2025  
**Author:** Technical Architecture Team

