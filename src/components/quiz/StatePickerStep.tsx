'use client'

import { useMemo, useState } from 'react'
import { MapPin, Search } from 'lucide-react'

const NAVY = '#1A2B49'
const PIN = '#9DB89D'

export interface SelectedState {
  name: string
  abbreviation: string
}

const ALL_STATES: SelectedState[] = [
  { name: 'Alabama', abbreviation: 'AL' },
  { name: 'Alaska', abbreviation: 'AK' },
  { name: 'Arizona', abbreviation: 'AZ' },
  { name: 'Arkansas', abbreviation: 'AR' },
  { name: 'California', abbreviation: 'CA' },
  { name: 'Colorado', abbreviation: 'CO' },
  { name: 'Connecticut', abbreviation: 'CT' },
  { name: 'Delaware', abbreviation: 'DE' },
  { name: 'Florida', abbreviation: 'FL' },
  { name: 'Georgia', abbreviation: 'GA' },
  { name: 'Hawaii', abbreviation: 'HI' },
  { name: 'Idaho', abbreviation: 'ID' },
  { name: 'Illinois', abbreviation: 'IL' },
  { name: 'Indiana', abbreviation: 'IN' },
  { name: 'Iowa', abbreviation: 'IA' },
  { name: 'Kansas', abbreviation: 'KS' },
  { name: 'Kentucky', abbreviation: 'KY' },
  { name: 'Louisiana', abbreviation: 'LA' },
  { name: 'Maine', abbreviation: 'ME' },
  { name: 'Maryland', abbreviation: 'MD' },
  { name: 'Massachusetts', abbreviation: 'MA' },
  { name: 'Michigan', abbreviation: 'MI' },
  { name: 'Minnesota', abbreviation: 'MN' },
  { name: 'Mississippi', abbreviation: 'MS' },
  { name: 'Missouri', abbreviation: 'MO' },
  { name: 'Montana', abbreviation: 'MT' },
  { name: 'Nebraska', abbreviation: 'NE' },
  { name: 'Nevada', abbreviation: 'NV' },
  { name: 'New Hampshire', abbreviation: 'NH' },
  { name: 'New Jersey', abbreviation: 'NJ' },
  { name: 'New Mexico', abbreviation: 'NM' },
  { name: 'New York', abbreviation: 'NY' },
  { name: 'North Carolina', abbreviation: 'NC' },
  { name: 'North Dakota', abbreviation: 'ND' },
  { name: 'Ohio', abbreviation: 'OH' },
  { name: 'Oklahoma', abbreviation: 'OK' },
  { name: 'Oregon', abbreviation: 'OR' },
  { name: 'Pennsylvania', abbreviation: 'PA' },
  { name: 'Rhode Island', abbreviation: 'RI' },
  { name: 'South Carolina', abbreviation: 'SC' },
  { name: 'South Dakota', abbreviation: 'SD' },
  { name: 'Tennessee', abbreviation: 'TN' },
  { name: 'Texas', abbreviation: 'TX' },
  { name: 'Utah', abbreviation: 'UT' },
  { name: 'Vermont', abbreviation: 'VT' },
  { name: 'Virginia', abbreviation: 'VA' },
  { name: 'Washington', abbreviation: 'WA' },
  { name: 'West Virginia', abbreviation: 'WV' },
  { name: 'Wisconsin', abbreviation: 'WI' },
  { name: 'Wyoming', abbreviation: 'WY' },
]

const POPULAR_STATE_NAMES = [
  'Florida', 'Texas', 'California', 'Arizona',
  'North Carolina', 'Georgia', 'Pennsylvania', 'Ohio',
  'Virginia', 'New Jersey', 'Tennessee', 'South Carolina',
]

const POPULAR_STATES = POPULAR_STATE_NAMES
  .map((name) => ALL_STATES.find((s) => s.name === name))
  .filter((s): s is SelectedState => !!s)

interface StatePickerStepProps {
  title?: string
  selectedAbbreviation?: string
  onSelect: (state: SelectedState) => void
}

export default function StatePickerStep({
  title = 'What state do you live in?',
  selectedAbbreviation,
  onSelect,
}: StatePickerStepProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return ALL_STATES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.abbreviation.toLowerCase().includes(q),
    )
  }, [query])

  const displayList = filtered ?? POPULAR_STATES
  const showPopularLabel = !filtered

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[#1A2B49] mb-2"
        style={{ fontSize: '1.5rem', lineHeight: 1.3 }}
      >
        {title}
      </h1>
      <p className="text-gray-600 mb-4 text-sm">
        We only work with licensed insurance providers in your state.
      </p>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your state name..."
          className="w-full pl-10 pr-4 py-3 md:py-4 border border-gray-300 rounded-xl text-base md:text-lg focus:outline-none focus:ring-2 focus:border-[#1A2B49]"
          style={{ '--tw-ring-color': NAVY } as React.CSSProperties}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {showPopularLabel && (
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">
          Popular States
        </p>
      )}
      {filtered && filtered.length === 0 && (
        <p className="text-sm text-gray-500 mb-3">
          No states match &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {displayList.map((state) => {
          const selected = selectedAbbreviation === state.abbreviation
          return (
            <button
              key={state.abbreviation}
              type="button"
              onClick={() => onSelect(state)}
              className={`flex items-center gap-2 px-4 py-3 md:py-4 rounded-xl text-left text-sm md:text-base font-medium transition-colors border-2 ${
                selected
                  ? 'border-[#1A2B49] bg-white text-[#1A2B49] shadow-md'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-[#1A2B49] hover:bg-[#1A2B49]/5'
              }`}
            >
              <MapPin
                className="w-4 h-4 flex-shrink-0"
                style={{ color: PIN }}
              />
              <span>{state.name}</span>
            </button>
          )
        })}
      </div>

      {showPopularLabel && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Don&rsquo;t see your state? Type above.
        </p>
      )}
    </div>
  )
}
