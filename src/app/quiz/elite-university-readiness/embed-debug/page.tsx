'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const EMBED_CONTEXT_STORAGE_KEY = 'elite_university_embed_context'

interface DebugFormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  graduationYear: string
  gpa: string
  apCourseLoad: string
  score: string
  category: string
}

export default function EmpowerlyEmbedDebugPage() {
  const router = useRouter()
  const [formState, setFormState] = useState<DebugFormState>({
    firstName: 'Avery',
    lastName: 'Parent',
    email: 'avery.parent@example.com',
    phone: '+14155550000',
    graduationYear: '2028',
    gpa: '3.8',
    apCourseLoad: '5',
    score: '91',
    category: 'Elite Ready',
  })
  const [status, setStatus] = useState<string>('')

  const handleChange = (field: keyof DebugFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('')

    const payload = {
      parent: {
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
        phone: formState.phone,
        consent: true,
      },
      student: {
        graduationYear: formState.graduationYear,
        gpa: Number(formState.gpa),
        apCourseLoad: Number(formState.apCourseLoad),
        testScores: 'sat_1500plus_act_34plus',
        extracurriculars: 'tier_one_leadership',
      },
      readiness: {
        score: Number(formState.score),
        category: formState.category,
        strengths: ['Academic rigor', 'Leadership impact'],
        improvements: ['Refine essay narrative'],
      },
      utm: { source: 'debug', campaign: 'embed-test' },
      sessionId: `debug_${Date.now()}`,
      timestamp: new Date().toISOString(),
    }

    try {
      const serialized = JSON.stringify(payload)
      sessionStorage.setItem(EMBED_CONTEXT_STORAGE_KEY, serialized)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(EMBED_CONTEXT_STORAGE_KEY, serialized)
      }
      console.log('🧪 Debug embed context stored:', payload)
      setStatus('stored')
    } catch (error) {
      console.error('❌ Failed to store debug embed context:', error)
      setStatus('error')
    }
  }

  const goToEmbed = () => {
    router.push(`/quiz/elite-university-readiness/results-embed?score=${formState.score}&category=${encodeURIComponent(formState.category)}`)
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF]">
      <section className="bg-gradient-to-br from-[#141F37] via-[#0F182C] to-[#1A2B49] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[#9DB89D] font-semibold">Empowerly Embed Debug</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold">
            Seed Embed Context without Running the Full Quiz
          </h1>
          <p className="text-lg text-white/80 max-w-3xl">
            Use this testing utility to mimic a completed quiz + OTP flow. We&apos;ll write the same payload that the live quiz
            stores, so you can load the embedded Empowerly scheduler in seconds.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-white/80">
            <div className="bg-white/10 rounded-2xl border border-white/10 px-4 py-3">
              <span className="font-semibold text-white">1.</span> Enter contact + readiness values below.
            </div>
            <div className="bg-white/10 rounded-2xl border border-white/10 px-4 py-3">
              <span className="font-semibold text-white">2.</span> Click &quot;Store Context&quot; to save in session/local storage.
            </div>
            <div className="bg-white/10 rounded-2xl border border-white/10 px-4 py-3">
              <span className="font-semibold text-white">3.</span> Launch `/results-embed` to verify the iframe auto-fills.
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-white rounded-2xl shadow-xl border border-[#E3E0D5] p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Parent First Name</label>
                <input
                  type="text"
                  value={formState.firstName}
                  onChange={handleChange('firstName')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#1A2B49]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Parent Last Name</label>
                <input
                  type="text"
                  value={formState.lastName}
                  onChange={handleChange('lastName')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#1A2B49]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={handleChange('email')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#1A2B49]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Phone (E.164)</label>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={handleChange('phone')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#1A2B49]"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Graduation Year</label>
                <select
                  value={formState.graduationYear}
                  onChange={handleChange('graduationYear')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#1A2B49]"
                >
                  <option value="2027">2027 (Senior)</option>
                  <option value="2028">2028 (Junior)</option>
                  <option value="2029">2029 (Sophomore)</option>
                  <option value="2030">2030 (Freshman)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">GPA</label>
                <input
                  type="number"
                  step="0.1"
                  value={formState.gpa}
                  onChange={handleChange('gpa')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#1A2B49]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">AP / IB Courses</label>
                <input
                  type="number"
                  value={formState.apCourseLoad}
                  onChange={handleChange('apCourseLoad')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#1A2B49]"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Readiness Score</label>
                <input
                  type="number"
                  value={formState.score}
                  onChange={handleChange('score')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#1A2B49]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Readiness Category</label>
                <select
                  value={formState.category}
                  onChange={handleChange('category')}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#1A2B49]"
                >
                  <option value="Elite Ready">Elite Ready</option>
                  <option value="Competitive">Competitive</option>
                  <option value="Developing">Developing</option>
                  <option value="Needs Improvement">Needs Improvement</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-4">
              <Button type="submit" className="bg-[#1A2B49] hover:bg-[#152238] text-white px-8">
                Store Context
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-[#1A2B49] text-[#1A2B49]"
                onClick={goToEmbed}
                disabled={status !== 'stored'}
              >
                Open Embed Variant
              </Button>
              <Link
                href="/quiz/elite-university-readiness"
                className="text-sm font-semibold text-[#1A2B49] underline-offset-4 hover:underline"
              >
                Run full quiz instead
              </Link>
            </div>

            {status === 'stored' && (
              <p className="text-sm text-green-700">
                ✅ Lead context stored in session/local storage. Click &quot;Open Embed Variant&quot; to test the iframe autofill.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-600">
                ⚠️ Something went wrong storing the context. Check console logs for details.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}


