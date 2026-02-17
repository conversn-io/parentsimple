export type GamePlanV2QuestionType =
  | 'single_select'
  | 'multi_select'
  | 'slider'
  | 'form'
  | 'message';

export interface GamePlanV2Option {
  value: string;
  label: string;
}

interface GamePlanV2QuestionBase {
  id: string;
  type: GamePlanV2QuestionType;
  text: string;
  next?: string;
  tags?: Record<string, string[]>;
}

export interface GamePlanV2SingleSelectQuestion extends GamePlanV2QuestionBase {
  type: 'single_select';
  options: GamePlanV2Option[];
  branch?: Record<string, string>;
}

export interface GamePlanV2MultiSelectQuestion extends GamePlanV2QuestionBase {
  type: 'multi_select';
  options: GamePlanV2Option[];
}

export interface GamePlanV2SliderQuestion extends GamePlanV2QuestionBase {
  type: 'slider';
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface GamePlanV2FormQuestion extends GamePlanV2QuestionBase {
  type: 'form';
  fields: string[];
  cta_label: string;
}

export interface GamePlanV2MessageQuestion extends GamePlanV2QuestionBase {
  type: 'message';
  tag?: string[];
}

export type GamePlanV2Question =
  | GamePlanV2SingleSelectQuestion
  | GamePlanV2MultiSelectQuestion
  | GamePlanV2SliderQuestion
  | GamePlanV2FormQuestion
  | GamePlanV2MessageQuestion;

export const ELITE_UNIVERSITY_GAMEPLAN_V2_ID = 'elite_university_gameplan_v2';

export const ELITE_UNIVERSITY_GAMEPLAN_V2_SETTINGS = {
  mode: 'branched',
  scoring: true,
  lead_tagging: true,
} as const;

export const ELITE_UNIVERSITY_GAMEPLAN_V2_QUESTIONS: GamePlanV2Question[] = [
  {
    id: 'q1_top20_intent',
    type: 'single_select',
    text: 'Are you aiming for a Top 20 / highly selective university?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'unsure', label: 'Not sure' },
      { value: 'no', label: 'No' },
    ],
    tags: {
      yes: ['high_intent'],
      unsure: ['mid_intent'],
      no: ['low_intent'],
    },
    branch: {
      yes: 'q2_graduation_year',
      unsure: 'q2_graduation_year',
      no: 'q14_soft_exit',
    },
  },
  {
    id: 'q2_graduation_year',
    type: 'single_select',
    text: 'What year will your child graduate from high school?',
    options: [
      { value: '2026', label: '2026 (Current Senior)' },
      { value: '2027', label: '2027 (Current Junior)' },
      { value: '2028', label: '2028 (Current Sophomore)' },
      { value: '2029', label: '2029 (Current Freshman)' },
      { value: 'other', label: 'Other / Not sure' },
    ],
    next: 'q3_early_decision',
  },
  {
    id: 'q3_early_decision',
    type: 'single_select',
    text: 'Is your child considering Early Decision/Early Action?',
    options: [
      { value: 'early_decision_planned', label: 'Early Decision planned' },
      { value: 'early_action_planned', label: 'Early Action planned' },
      { value: 'considering_undecided', label: 'Considering / undecided' },
      { value: 'regular_decision_only', label: 'Regular decision only' },
      { value: 'unfamiliar', label: 'Unfamiliar' },
    ],
    tags: {
      early_decision_planned: ['high_strategy_intent'],
    },
    next: 'q4_financial_readiness',
  },
  {
    id: 'q4_financial_readiness',
    type: 'single_select',
    text: 'How prepared is your family for elite university financial planning?',
    options: [
      { value: 'fully_prepared', label: 'Fully prepared' },
      { value: 'somewhat_prepared', label: 'Somewhat prepared' },
      { value: 'beginning_to_explore', label: 'Beginning to explore' },
      { value: 'not_addressed', label: 'Not addressed' },
      { value: 'unfamiliar', label: 'Unfamiliar' },
    ],
    tags: {
      fully_prepared: ['financial_ready_high'],
      somewhat_prepared: ['financial_ready_mid'],
      beginning_to_explore: ['financial_ready_low'],
    },
    next: 'q5_household_income',
  },
  {
    id: 'q5_household_income',
    type: 'single_select',
    text: 'What is your household income?',
    options: [
      { value: 'below_100k', label: 'Below $100K' },
      { value: '100k_150k', label: '$100K-$150K' },
      { value: '150k_200k', label: '$150K-$200K' },
      { value: '200k_plus', label: '$200K+' },
    ],
    tags: {
      below_100k: ['income_low'],
      '100k_150k': ['income_mid'],
      '150k_200k': ['income_high'],
      '200k_plus': ['income_premium'],
    },
    next: 'q6_gpa',
  },
  {
    id: 'q6_gpa',
    type: 'slider',
    text: "What is your child's current unweighted GPA?",
    min: 2.5,
    max: 5.0,
    step: 0.1,
    default: 3.5,
    next: 'q7_ap_ib',
  },
  {
    id: 'q7_ap_ib',
    type: 'slider',
    text: 'How many AP or IB courses has your child completed or is enrolled in?',
    min: 0,
    max: 8,
    step: 1,
    default: 3,
    next: 'q8_test_scores',
  },
  {
    id: 'q8_test_scores',
    type: 'single_select',
    text: 'Has your child taken the SAT or ACT?',
    options: [
      { value: 'sat_1500plus_act_34plus', label: 'SAT 1500+ / ACT 34+' },
      { value: 'sat_1400_1499_act_32_33', label: 'SAT 1400-1499 / ACT 32-33' },
      { value: 'sat_1300_1399_act_30_31', label: 'SAT 1300-1399 / ACT 30-31' },
      { value: 'sat_below_1300_act_below_30', label: 'SAT below 1300 / ACT below 30' },
      { value: 'not_yet_taken', label: 'Not yet taken / Planning to take' },
      { value: 'test_optional_only', label: 'Test-optional only' },
    ],
    next: 'q9_extracurriculars',
  },
  {
    id: 'q9_extracurriculars',
    type: 'single_select',
    text: "How would you describe your child's extracurricular involvement?",
    options: [
      {
        value: 'deep_commitment_1_2_activities',
        label: 'Deep commitment (2+ years) to 1-2 activities with leadership roles and notable achievements',
      },
      {
        value: 'sustained_involvement_2_3_activities',
        label: 'Sustained involvement (1+ years) in 2-3 activities, some leadership',
      },
      {
        value: 'active_participation_3_4_activities',
        label: 'Active participation in 3-4 activities, minimal leadership',
      },
      {
        value: 'involvement_5plus_limited_depth',
        label: 'Involvement in 5+ activities, but limited depth or commitment',
      },
      { value: 'minimal_no_involvement', label: 'Minimal or no involvement' },
    ],
    next: 'q10_awards',
  },
  {
    id: 'q10_awards',
    type: 'single_select',
    text: 'Has your child received notable recognition or awards?',
    options: [
      { value: 'national_international', label: 'National/international' },
      { value: 'regional_state', label: 'Regional/state' },
      { value: 'local_school', label: 'Local/school' },
      { value: 'participation_only', label: 'Participation only' },
      { value: 'no_achievements', label: 'No notable achievements' },
    ],
    next: 'q11_research',
  },
  {
    id: 'q11_research',
    type: 'single_select',
    text: 'Has your child engaged in research, internships, or meaningful work?',
    options: [
      { value: 'significant_with_outcomes', label: 'Significant with outcomes' },
      { value: 'some_experience', label: 'Some experience' },
      { value: 'limited_interested', label: 'Limited but interested' },
      { value: 'considering', label: 'Considering' },
      { value: 'not_applicable', label: 'Not applicable' },
    ],
    next: 'q12_essays',
  },
  {
    id: 'q12_essays',
    type: 'single_select',
    text: 'How would you rate progress on essays and application components?',
    options: [
      { value: 'completed_reviewed', label: 'Completed and reviewed' },
      { value: 'drafted_seeking_feedback', label: 'Drafted and seeking feedback' },
      { value: 'started_early_stages', label: 'Started early stages' },
      { value: 'not_started_aware', label: 'Not started but aware' },
      { value: 'unfamiliar', label: 'Unfamiliar' },
    ],
    next: 'q13_recommendations',
  },
  {
    id: 'q13_recommendations',
    type: 'single_select',
    text: 'How strong are relationships for recommendations?',
    options: [
      { value: 'strong_3plus_recommenders', label: 'Strong (3+)' },
      { value: 'good_2_3_recommenders', label: 'Good (2-3)' },
      { value: 'adequate_1_2_recommenders', label: 'Adequate (1-2)' },
      { value: 'limited_relationships', label: 'Limited' },
      { value: 'no_relationships', label: 'No established relationships' },
    ],
    next: 'q14_background',
  },
  {
    id: 'q14_background',
    type: 'multi_select',
    text: "Which best describes your child's background?",
    options: [
      { value: 'first_generation', label: 'First-generation' },
      { value: 'low_middle_income', label: 'Low/middle income' },
      { value: 'underrepresented_minority', label: 'Underrepresented minority' },
      { value: 'unique_geographic_cultural', label: 'Unique geographic/cultural' },
      { value: 'none_prefer_not', label: 'None / prefer not to answer' },
    ],
    next: 'q15_contact',
  },
  {
    id: 'q15_contact',
    type: 'form',
    text: "Let's get your contact information",
    fields: [
      'First Name*',
      'Last Name*',
      'Student First Name (Optional)',
      'Email Address*',
      'Phone Number*',
    ],
    cta_label: 'Claim My Game Plan',
  },
  {
    id: 'q14_soft_exit',
    type: 'message',
    text: "We'll send you general university planning resources.",
    tag: ['non_selective_interest'],
  },
];

export const ELITE_UNIVERSITY_GAMEPLAN_V2_START_QUESTION_ID =
  'q1_top20_intent';

export const ELITE_UNIVERSITY_GAMEPLAN_V2_MAX_STEPS = 15;
