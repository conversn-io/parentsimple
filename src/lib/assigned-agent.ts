// Agent shown on the post-quiz thank-you / results page (AgentAssignmentPage).
// Used by /quiz/life-insurance-us, /quiz/life-insurance-us-b and /quiz/mortgage-protection.
// To swap agents, edit this object only (WO-1493).
export const ASSIGNED_AGENT = {
  name: "Dillon O'Neill",
  title: 'Licensed Life Insurance Agent',
  headshot: '/images/team/dillon-oneill.webp',
  headshotAlt: "Dillon O'Neill, licensed life insurance agent",
  phoneDisplay: '(630) 200-9362',
  phoneE164: '+16302009362',
} as const;
