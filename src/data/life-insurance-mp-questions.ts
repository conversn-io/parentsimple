/**
 * ParentSimple Mortgage-Protection quiz question definitions.
 * Delivery stays on funnel_type = 'life_insurance_us'; this is the MP variant.
 */

export const LIFE_INSURANCE_MP_STEPS = [
  {
    id: 'homeownership',
    title: 'Do you own your home?',
    type: 'multiple-choice' as const,
    options: [
      { value: 'homeowner_mortgage', label: "Yes, with a mortgage" },
      { value: 'homeowner_paid', label: "Yes, it's paid off" },
      { value: 'buying_soon', label: 'Buying soon' },
      { value: 'renter', label: 'No, I rent' },
    ],
    required: true,
  },
  {
    id: 'mortgage_balance',
    title: 'About how much is left on your mortgage?',
    subtitle: 'A rough estimate is fine — we use this to size coverage.',
    type: 'multiple-choice' as const,
    conditional: (answers: Record<string, string>) =>
      answers.homeownership === 'homeowner_mortgage' ||
      answers.homeownership === 'buying_soon',
    options: [
      { value: 'under_150k', label: 'Under $150K' },
      { value: '150k_300k', label: '$150K – $300K' },
      { value: '300k_500k', label: '$300K – $500K' },
      { value: '500k_plus', label: '$500K+' },
    ],
    required: true,
  },
  {
    id: 'age_range',
    title: 'What is your age range?',
    subtitle: 'Age affects insurance rates and options.',
    type: 'multiple-choice' as const,
    options: [
      { value: '25-34', label: '25-34', sublabel: 'Young adult' },
      { value: '35-44', label: '35-44', sublabel: 'Early career' },
      { value: '45-54', label: '45-54', sublabel: 'Mid career' },
      { value: '55-64', label: '55-64', sublabel: 'Pre-retirement' },
      { value: '65+', label: '65+', sublabel: 'Retirement age' },
    ],
    required: true,
  },
  {
    id: 'health_screen',
    title: 'In the past 5 years, have you been diagnosed with or treated for cancer, a stroke, a heart attack, or dementia?',
    type: 'multiple-choice' as const,
    options: [
      { value: 'no', label: 'No' },
      { value: 'yes', label: 'Yes' },
    ],
    required: true,
  },
  {
    id: 'smoker',
    title: 'Do you smoke or vape?',
    subtitle: 'Includes tobacco, cigarettes, cigars, pipes, vapes, gum, or patches.',
    type: 'multiple-choice' as const,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    required: true,
  },
  {
    id: 'gender',
    title: 'What was your gender at birth?',
    type: 'multiple-choice' as const,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
    required: true,
  },
  {
    id: 'best_time',
    title: 'What is the best time to contact you?',
    subtitle: 'This helps us reach you at a convenient time',
    type: 'multiple-choice' as const,
    options: [
      { value: 'morning', label: 'Morning', sublabel: '8am - 12pm' },
      { value: 'afternoon', label: 'Afternoon', sublabel: '12pm - 5pm' },
      { value: 'evening', label: 'Evening', sublabel: '5pm - 8pm' },
      { value: 'anytime', label: 'Anytime', sublabel: 'Flexible schedule' },
    ],
    required: true,
  },
  {
    id: 'state',
    title: 'What state do you live in?',
    type: 'state-picker' as const,
    required: true,
  },
  {
    id: 'contact_info',
    title: 'Where should we send your free quote?',
    type: 'personal-info' as const,
    required: true,
  },
] as const

export const TOTAL_MP_STEPS = LIFE_INSURANCE_MP_STEPS.length

// Maps a mortgage balance bucket to a pre-selected coverage amount, per WO-1277.
export const MORTGAGE_BALANCE_TO_COVERAGE: Record<string, string> = {
  under_150k: '250k',
  '150k_300k': '500k',
  '300k_500k': '500k',
  '500k_plus': '1m',
}
