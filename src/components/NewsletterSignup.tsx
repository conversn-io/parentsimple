'use client'

import { useState } from 'react'
import { signUpForNewsletter } from '../lib/newsletter'
import { Mail, Check, AlertCircle, BookOpen } from 'lucide-react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<{ success?: boolean; message?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    setNewsletterStatus({})
    
    try {
      const result = await signUpForNewsletter(email, 'seniorsimple-homepage')
      setNewsletterStatus(result)
      
      if (result.success) {
        setEmail('')
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
      setNewsletterStatus({
        success: false,
        message: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white border-opacity-20">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#36596A] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-serif font-semibold mb-2 text-[#36596A]">
          Stay Informed
        </h3>
        <p className="text-[#36596A] text-opacity-80">
          Get the latest retirement insights and expert advice delivered to your inbox.
        </p>
      </div>
      
      <form onSubmit={handleNewsletterSignup} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 pl-12 border-2 border-[#36596A] border-opacity-30 rounded-lg bg-white bg-opacity-90 backdrop-blur-sm focus:ring-2 focus:ring-[#36596A] focus:border-[#36596A] focus:outline-none placeholder-gray-500 text-[#36596A] transition-all duration-300"
            required
            disabled={isSubmitting}
          />
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#36596A]" />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#36596A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2a4a5a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-[#36596A] border-t-transparent rounded-full animate-spin"></div>
              Subscribing...
            </>
          ) : (
            <>
              Subscribe to Newsletter
              <Mail className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {newsletterStatus.message && (
        <div className={`mt-4 p-4 rounded-lg text-sm flex items-center gap-3 transition-all duration-300 ${
          newsletterStatus.success 
            ? 'bg-green-100 bg-opacity-90 text-green-800 border border-green-200' 
            : 'bg-red-100 bg-opacity-90 text-red-800 border border-red-200'
        }`}>
          {newsletterStatus.success ? (
            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{newsletterStatus.message}</span>
        </div>
      )}
    </div>
  )
}
