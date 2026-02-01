/**
 * Life Insurance CA Funnel - Question definitions
 * Built for Canadian parents; DQ path for non-Ontario. Structured to scale to US (region/state).
 * Control model: comparemyloans.io/life-insurance-ca
 */

export const ONTARIO_REGION_CODE = 'ON';

/** Canadian provinces (region_code) - Ontario is qualified; others DQ */
export const CA_PROVINCES = [
  { value: 'ON', label: 'Ontario', regionCode: 'ON' },
  { value: 'BC', label: 'British Columbia', regionCode: 'BC' },
  { value: 'AB', label: 'Alberta', regionCode: 'AB' },
  { value: 'SK', label: 'Saskatchewan', regionCode: 'SK' },
  { value: 'MB', label: 'Manitoba', regionCode: 'MB' },
  { value: 'QC', label: 'Quebec', regionCode: 'QC' },
  { value: 'NB', label: 'New Brunswick', regionCode: 'NB' },
  { value: 'NS', label: 'Nova Scotia', regionCode: 'NS' },
  { value: 'PE', label: 'Prince Edward Island', regionCode: 'PE' },
  { value: 'NL', label: 'Newfoundland and Labrador', regionCode: 'NL' },
] as const;

export const LIFE_INSURANCE_CA_STEPS = [
  {
    id: 'province',
    title: 'Which province do you live in?',
    subtitle: 'Select your province to see available options',
    type: 'multiple-choice' as const,
    options: CA_PROVINCES,
    required: true,
  },
  {
    id: 'purpose',
    title: "What's your main reason to get life insurance?",
    type: 'multiple-choice' as const,
    options: [
      { value: 'protect_family', label: 'Protect my family / kids' },
      { value: 'cover_mortgage', label: 'Cover my mortgage / home' },
      { value: 'final_expenses', label: 'Cover final expenses' },
      { value: 'legacy', label: 'Leave money behind / legacy' },
      { value: 'not_sure', label: 'Not sure yet' },
    ],
    required: true,
  },
  {
    id: 'coverage',
    title: 'How much coverage do you need?',
    subtitle: 'Select an amount',
    type: 'multiple-choice' as const,
    options: [
      { value: '500k', label: '$500K' },
      { value: '1m', label: '$1M' },
      { value: '1_5m', label: '$1.5M' },
      { value: '2m', label: '$2M' },
    ],
    required: true,
  },
  {
    id: 'age_range',
    title: 'What is your age range?',
    subtitle: 'Age affects insurance rates and options.',
    type: 'multiple-choice' as const,
    options: [
      { value: '18-25', label: '18-25', sublabel: 'Young adult' },
      { value: '26-35', label: '26-35', sublabel: 'Early career' },
      { value: '36-50', label: '36-50', sublabel: 'Mid career' },
      { value: '51-65', label: '51-65', sublabel: 'Pre-retirement' },
      { value: '65+', label: '65+', sublabel: 'Retirement age' },
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
    id: 'contact_info',
    title: 'Where should we send your free quote?',
    type: 'personal-info' as const,
    required: true,
  },
] as const;

export const TOTAL_STEPS = LIFE_INSURANCE_CA_STEPS.length;
