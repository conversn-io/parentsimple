/**
 * Elite University Readiness Assessment Scoring Function
 * 
 * Calculates readiness score (0-100) based on quiz answers
 * Includes graduation year context modifiers for accurate scoring
 * 
 * Based on 2025 admissions research and trends
 * Source: ELITE-UNIVERSITY-READINESS-ASSESSMENT-RESEARCH-2025.md
 */

export interface EliteUniversityReadinessResults {
  totalScore: number;
  category: 'Elite Ready' | 'Competitive' | 'Developing' | 'Needs Improvement';
  breakdown: {
    academics: number;
    testScores: number;
    extracurriculars: number;
    achievements: number;
    essays: number;
    recommendations: number;
    strategy: number;
    research: number;
    diversity: number;
  };
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

/**
 * Get graduation year modifiers for context-aware scoring
 */
function getGraduationYearModifiers(graduationYear: string): {
  testScores: { notTaken: number };
  essays: { notStarted: number };
  extracurriculars: { minimal: number };
  urgency: 'high' | 'medium' | 'low';
} {
  switch (graduationYear) {
    case '2027': // Senior
      return {
        testScores: { notTaken: 0.15 }, // 15% of max (major penalty)
        essays: { notStarted: 0.20 }, // 20% of max (critical)
        extracurriculars: { minimal: 0.30 }, // 30% of max (late to develop)
        urgency: 'high',
      };
    case '2028': // Junior
      return {
        testScores: { notTaken: 0.40 }, // 40% of max (should be planning)
        essays: { notStarted: 0.50 }, // 50% of max (concerning)
        extracurriculars: { minimal: 0.60 }, // 60% of max (still time)
        urgency: 'medium',
      };
    case '2029': // Sophomore
      return {
        testScores: { notTaken: 0.75 }, // 75% of max (early planning)
        essays: { notStarted: 0.80 }, // 80% of max (normal)
        extracurriculars: { minimal: 0.70 }, // 70% of max (developing)
        urgency: 'low',
      };
    case '2030': // Freshman
      return {
        testScores: { notTaken: 1.0 }, // 100% of max (no penalty)
        essays: { notStarted: 1.0 }, // 100% of max (normal)
        extracurriculars: { minimal: 0.80 }, // 80% of max (exploring)
        urgency: 'low',
      };
    default:
      // Default to junior year modifiers for "other" or unknown
      return {
        testScores: { notTaken: 0.40 },
        essays: { notStarted: 0.50 },
        extracurriculars: { minimal: 0.60 },
        urgency: 'medium',
      };
  }
}

/**
 * Calculate GPA (0-15 points) and AP/IB rigor (0-10 points)
 */
function calculateGPAScore(value?: number): number {
  if (value === undefined || Number.isNaN(value)) return 0;
  
  if (value >= 4.0) return 15;
  if (value >= 3.8) return 13;
  if (value >= 3.6) return 11;
  if (value >= 3.3) return 8;
  if (value >= 3.0) return 5;
  return 2;
}

function calculateAPCourseScore(value?: number): number {
  if (value === undefined || Number.isNaN(value)) return 0;
  
  if (value >= 8) return 10;
  if (value >= 6) return 8;
  if (value >= 4) return 6;
  if (value >= 2) return 4;
  if (value >= 1) return 2;
  return 0;
}

function calculateAcademicScore(gpaValue?: number, apValue?: number): number {
  const gpaScore = calculateGPAScore(gpaValue);
  const apScore = calculateAPCourseScore(apValue);
  return Math.min(25, gpaScore + apScore);
}

/**
 * Calculate test scores with graduation year modifiers (0-20 points)
 */
function calculateTestScore(answer: string, modifiers: { notTaken: number }): number {
  switch (answer) {
    case 'sat_1500plus_act_34plus':
      return 20; // Elite level - 75th percentile+
    case 'sat_1400_1499_act_32_33':
      return 15; // Strong - 50th-75th percentile
    case 'sat_1300_1399_act_30_31':
      return 10; // Good - 25th-50th percentile
    case 'sat_below_1300_act_below_30':
      return 5; // Below average
    case 'not_yet_taken':
      return Math.round(20 * modifiers.notTaken); // Context-aware
    case 'test_optional_only':
      return 3; // Test-optional only
    default:
      return 0;
  }
}

/**
 * Calculate extracurricular score (0-20 points)
 */
function calculateExtracurricularScore(answer: string, modifiers: { minimal: number }): number {
  switch (answer) {
    case 'deep_commitment_1_2_activities':
      return 20; // Elite level - depth + leadership
    case 'sustained_involvement_2_3_activities':
      return 15; // Strong - sustained involvement
    case 'active_participation_3_4_activities':
      return 10; // Good - active participation
    case 'involvement_5plus_limited_depth':
      return 5; // Adequate - breadth but limited depth
    case 'minimal_no_involvement':
      return Math.round(20 * modifiers.minimal); // Context-aware
    default:
      return 0;
  }
}

/**
 * Calculate achievements score (0-10 points)
 */
function calculateAchievementsScore(answer: string): number {
  switch (answer) {
    case 'national_international':
      return 10; // National/international recognition
    case 'regional_state':
      return 7; // Regional/state recognition
    case 'local_school':
      return 5; // Local/school recognition
    case 'participation_only':
      return 3; // Participation only
    case 'no_achievements':
      return 0; // No achievements
    default:
      return 0;
  }
}

/**
 * Calculate essays score with graduation year modifiers (0-10 points)
 */
function calculateEssaysScore(answer: string, modifiers: { notStarted: number }): number {
  switch (answer) {
    case 'completed_reviewed':
      return 10; // Completed and reviewed
    case 'drafted_seeking_feedback':
      return 7; // Drafted, seeking feedback
    case 'started_early_stages':
      return 5; // Started, early stages
    case 'not_started_aware':
      return Math.round(10 * modifiers.notStarted); // Context-aware
    case 'unfamiliar':
      return 1; // Unfamiliar
    default:
      return 0;
  }
}

/**
 * Calculate recommendations score (0-5 points)
 */
function calculateRecommendationsScore(answer: string): number {
  switch (answer) {
    case 'strong_3plus_recommenders':
      return 5; // Strong relationships, 3+ recommenders
    case 'good_2_3_recommenders':
      return 4; // Good relationships, 2-3 recommenders
    case 'adequate_1_2_recommenders':
      return 3; // Adequate, 1-2 recommenders
    case 'limited_relationships':
      return 2; // Limited relationships
    case 'no_relationships':
      return 1; // No established relationships
    default:
      return 0;
  }
}

/**
 * Calculate application strategy score (0-5 points)
 */
function calculateStrategyScore(answer: string): number {
  switch (answer) {
    case 'early_decision_planned':
      return 5; // Early Decision planned
    case 'early_action_planned':
      return 4; // Early Action planned
    case 'considering_undecided':
      return 3; // Considering early application
    case 'regular_decision_only':
      return 2; // Regular decision only
    case 'unfamiliar':
      return 1; // Unfamiliar
    default:
      return 0;
  }
}

/**
 * Calculate research/internships score (0-3 points)
 */
function calculateResearchScore(answer: string): number {
  switch (answer) {
    case 'significant_with_outcomes':
      return 3; // Significant experience with outcomes
    case 'some_experience':
      return 2; // Some experience
    case 'limited_interested':
      return 1; // Limited but interested
    case 'considering':
      return 0.5; // Considering
    case 'not_applicable':
      return 0; // Not applicable
    default:
      return 0;
  }
}

/**
 * Calculate diversity factors score (0-2 points)
 */
function calculateDiversityScore(answer: string | string[]): number {
  const selections = Array.isArray(answer)
    ? answer
    : answer
      ? [answer]
      : [];
  
  if (selections.length === 0) return 0;
  
  const valueMap: Record<string, number> = {
    first_generation: 1.2,
    low_middle_income: 0.8,
    underrepresented_minority: 1.0,
    unique_geographic_cultural: 0.6,
    none_prefer_not: 0,
  };
  
  const score = selections.reduce((total, key) => total + (valueMap[key] ?? 0), 0);
  return Math.min(2, score);
}

/**
 * Identify strengths based on breakdown
 */
function identifyStrengths(breakdown: EliteUniversityReadinessResults['breakdown']): string[] {
  const strengths: string[] = [];
  
  if (breakdown.academics >= 20) {
    strengths.push('Strong academic performance and course rigor');
  }
  if (breakdown.testScores >= 15) {
    strengths.push('Competitive standardized test scores');
  }
  if (breakdown.extracurriculars >= 15) {
    strengths.push('Meaningful extracurricular involvement with leadership');
  }
  if (breakdown.achievements >= 7) {
    strengths.push('Notable achievements and recognition');
  }
  if (breakdown.essays >= 7) {
    strengths.push('Good progress on application essays');
  }
  if (breakdown.recommendations >= 4) {
    strengths.push('Strong relationships with teachers/mentors');
  }
  if (breakdown.strategy >= 4) {
    strengths.push('Strategic application planning');
  }
  
  return strengths.length > 0 ? strengths : ['Building foundation in key areas'];
}

/**
 * Identify areas for improvement based on breakdown
 */
function identifyImprovements(breakdown: EliteUniversityReadinessResults['breakdown']): string[] {
  const improvements: string[] = [];
  
  if (breakdown.academics < 15) {
    improvements.push('Strengthen academic performance and increase AP/IB course enrollment');
  }
  if (breakdown.testScores < 10) {
    improvements.push('Focus on standardized test preparation and score improvement');
  }
  if (breakdown.extracurriculars < 10) {
    improvements.push('Develop deeper involvement in 1-2 activities with leadership roles');
  }
  if (breakdown.achievements < 5) {
    improvements.push('Seek opportunities for recognition and notable achievements');
  }
  if (breakdown.essays < 5) {
    improvements.push('Begin working on personal statements and application essays');
  }
  if (breakdown.recommendations < 3) {
    improvements.push('Build stronger relationships with teachers and mentors');
  }
  if (breakdown.strategy < 3) {
    improvements.push('Develop strategic application approach including early decision consideration');
  }
  if (breakdown.research < 1) {
    improvements.push('Explore research projects or internships related to academic interests');
  }
  
  return improvements.length > 0 ? improvements : ['Continue building overall profile'];
}

/**
 * Generate personalized recommendations based on score, category, and graduation year
 */
function generateRecommendations(
  totalScore: number,
  category: string,
  breakdown: EliteUniversityReadinessResults['breakdown'],
  graduationYear: string
): string[] {
  const recommendations: string[] = [];
  const urgency = getGraduationYearModifiers(graduationYear).urgency;
  
  // Category-based recommendations
  if (category === 'Elite Ready') {
    recommendations.push('Your child is well-positioned for elite university admissions');
    recommendations.push('Focus on strategic application approach and essay refinement');
    recommendations.push('Consider Early Decision to maximize acceptance odds');
    recommendations.push('Work with expert counselors to optimize school selection');
  } else if (category === 'Competitive') {
    recommendations.push('Your child has a strong foundation for elite admissions');
    recommendations.push('Strengthen specific areas to enhance competitiveness');
    if (breakdown.testScores < 15) {
      recommendations.push('Prioritize test preparation to reach 1500+ SAT / 34+ ACT');
    }
    if (breakdown.extracurriculars < 15) {
      recommendations.push('Develop leadership roles in top 1-2 activities');
    }
  } else if (category === 'Developing') {
    recommendations.push('Your child shows promise but needs focused development');
    if (urgency === 'high') {
      recommendations.push('Prioritize critical gaps: test scores, essays, and application strategy');
    } else {
      recommendations.push('Focus on academics, test preparation, and extracurricular depth');
    }
  } else {
    recommendations.push('Build a comprehensive improvement plan');
    recommendations.push('Focus on academics, test preparation, and meaningful extracurricular involvement');
    recommendations.push('Consider long-term development strategy over 2-3 years');
  }
  
  // Timeline-specific recommendations
  if (graduationYear === '2027' && urgency === 'high') {
    recommendations.push('IMMEDIATE: Finalize test scores, complete essays, decide on Early Decision strategy');
  } else if (graduationYear === '2028') {
    recommendations.push('THIS YEAR: Take SAT/ACT by spring, seek leadership roles, start essay brainstorming');
    recommendations.push('NEXT YEAR: Finalize essays, complete applications by October (ED/EA)');
  } else if (graduationYear === '2029' || graduationYear === '2030') {
    recommendations.push('FOUNDATION: Maintain strong GPA, explore interests deeply, plan AP/IB course selection');
    recommendations.push('DEVELOPMENT: Build leadership roles, prepare for standardized tests, start thinking about essays');
  }
  
  return recommendations;
}

/**
 * Main scoring function
 */
export function calculateEliteUniversityReadinessScore(
  answers: Record<string, any>,
  graduationYear: string
): EliteUniversityReadinessResults {
  // Get graduation year modifiers
  const modifiers = getGraduationYearModifiers(graduationYear);
  
  // Calculate scores for each category
  const academics = calculateAcademicScore(
    typeof answers.gpa_score === 'number' ? answers.gpa_score : undefined,
    typeof answers.ap_course_load === 'number' ? answers.ap_course_load : undefined
  );
  const testScores = calculateTestScore(answers.test_scores || '', modifiers.testScores);
  const extracurriculars = calculateExtracurricularScore(answers.extracurriculars || '', modifiers.extracurriculars);
  const achievements = calculateAchievementsScore(answers.achievements || '');
  const essays = calculateEssaysScore(answers.essays || '', modifiers.essays);
  const recommendations = calculateRecommendationsScore(answers.recommendations || '');
  const strategy = calculateStrategyScore(answers.application_strategy || '');
  const research = calculateResearchScore(answers.research_internships || '');
  const diversity = calculateDiversityScore(answers.diversity_factors || '');
  
  // Calculate total score
  const totalScore = Math.min(100, Math.max(0, Math.round(
    academics +
    testScores +
    extracurriculars +
    achievements +
    essays +
    recommendations +
    strategy +
    research +
    diversity
  )));
  
  // Determine category
  let category: 'Elite Ready' | 'Competitive' | 'Developing' | 'Needs Improvement';
  if (totalScore >= 85) {
    category = 'Elite Ready';
  } else if (totalScore >= 70) {
    category = 'Competitive';
  } else if (totalScore >= 55) {
    category = 'Developing';
  } else {
    category = 'Needs Improvement';
  }
  
  // Build breakdown
  const breakdown = {
    academics,
    testScores,
    extracurriculars,
    achievements,
    essays,
    recommendations,
    strategy,
    research,
    diversity,
  };
  
  // Identify strengths and improvements
  const strengths = identifyStrengths(breakdown);
  const improvements = identifyImprovements(breakdown);
  
  // Generate recommendations
  const recommendations_list = generateRecommendations(totalScore, category, breakdown, graduationYear);
  
  return {
    totalScore,
    category,
    breakdown,
    strengths,
    improvements,
    recommendations: recommendations_list,
  };
}

