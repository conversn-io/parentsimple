import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedArticles } from '../lib/articles'
import TopicCard from '../components/TopicCard'
import NewsletterSignup from '../components/NewsletterSignup'
import { 
  CheckCircle, 
  Lightbulb, 
  Handshake, 
  PiggyBank, 
  Calculator, 
  FileText, 
  Home, 
  Heart, 
  MapPin, 
  TrendingUp, 
  ClipboardList,
  ArrowRight,
  Star,
  Shield,
  Users,
  Award,
  BookOpen,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Play,
  Download,
  ChevronRight,
  Check,
  Zap,
  Target,
  Eye,
  Globe,
  Lock
} from 'lucide-react'

export default async function HomePage() {
  // Fetch featured articles for the homepage
  const { articles: featuredArticles, error } = await getFeaturedArticles(3)

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Hero Section */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #36596A 0%, #82A6B1 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6 animate-fade-in">
                Simplify Your Retirement Journey
              </h1>
              <p className="text-xl mb-8 opacity-90 animate-fade-in-delay">
                No-cost education on annuities, taxes, estate planning, reverse mortgages, regenerative medicine, and housing.
              </p>
              <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-delay-2">
                <button className="bg-white text-[#36596A] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 group shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Take the Retirement Quiz
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-[#36596A] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  I&apos;m a Financial Advisor
                  <Users className="w-4 h-4" />
                </button>
              </div>
              {/* Trust Icons - Hidden for now */}
              {/* <div className="flex flex-wrap gap-6 text-sm opacity-90 animate-fade-in-delay-3">
                <div className="flex items-center gap-2 bg-white bg-opacity-90 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-opacity-100 transition-all duration-300 group shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[#36596A] font-medium">As seen on Forbes</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-90 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-opacity-100 transition-all duration-300 group shadow-sm">
                  <Shield className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[#36596A] font-medium">Partnered with AARP</span>
                </div>
                <div className="flex items-center gap-2 bg-white bg-opacity-90 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-opacity-100 transition-all duration-300 group shadow-sm">
                  <Award className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[#36596A] font-medium">Fiduciary Alliance Approved</span>
                </div>
              </div> */}
            </div>
            <div className="text-center animate-fade-in-delay-4">
              <div className="w-full h-96 bg-white bg-opacity-10 rounded-xl flex items-center justify-center text-lg opacity-70 relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                <Image
                  src="/images/webp/hero/couple-share-coffee-meeting-home-couch.webp"
                  alt="Senior couple sharing coffee and planning retirement at home"
                  fill
                  className="object-cover rounded-xl"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2336596A' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-semibold mb-4 text-[#36596A]">How It Works</h2>
            <div className="w-24 h-1 bg-[#E4CDA1] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get personalized retirement guidance in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-[#E4CDA1] to-transparent transform -translate-y-1/2"></div>
            <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-l from-[#E4CDA1] to-transparent transform -translate-y-1/2"></div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-lg transition-all duration-300 group relative">
              {/* Background Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#36596A] to-[#E4CDA1]"></div>
              
              {/* Number Badge */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-[#36596A] text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                1
              </div>
              
              <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-6 text-[#36596A] group-hover:scale-110 transition-transform duration-300 relative">
                <CheckCircle className="w-8 h-8" />
                <div className="absolute inset-0 bg-[#36596A] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#36596A]">Take a Quick Quiz</h3>
              <p className="text-gray-600">Answer 5–7 questions about your retirement needs and goals.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-lg transition-all duration-300 group relative">
              {/* Background Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#36596A] to-[#E4CDA1]"></div>
              
              {/* Number Badge */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-[#36596A] text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                2
              </div>
              
              <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-6 text-[#36596A] group-hover:scale-110 transition-transform duration-300 relative">
                <Lightbulb className="w-8 h-8" />
                <div className="absolute inset-0 bg-[#36596A] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#36596A]">Get Personalized Guidance</h3>
              <p className="text-gray-600">Receive educational content and resources tailored specifically to you.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-lg transition-all duration-300 group relative">
              {/* Background Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#36596A] to-[#E4CDA1]"></div>
              
              {/* Number Badge */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-[#36596A] text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                3
              </div>
              
              <div className="w-16 h-16 bg-[#E4CDA1] rounded-full flex items-center justify-center mx-auto mb-6 text-[#36596A] group-hover:scale-110 transition-transform duration-300 relative">
                <Handshake className="w-8 h-8" />
                <div className="absolute inset-0 bg-[#36596A] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#36596A]">Connect with Trusted Experts</h3>
              <p className="text-gray-600">Optionally speak with vetted professionals who act in your best interest.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="py-16 px-6 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2336596A' fill-opacity='0.05'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm0 0c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-semibold mb-4 text-[#36596A]">Explore Retirement Topics</h2>
            <div className="w-24 h-1 bg-[#E4CDA1] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover comprehensive resources on key retirement planning areas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Annuities', 
                icon: <PiggyBank className="w-6 h-6" />, 
                desc: 'Understand fixed index annuities and income options.',
                imagePath: '/images/topics/black-grey-hair-couple-beach.png',
                imageAlt: 'Senior couple planning financial security on the beach'
              },
              { 
                title: 'Tax Planning', 
                icon: <Calculator className="w-6 h-6" />, 
                desc: 'Explore tax-efficient retirement strategies.',
                imagePath: '/images/topics/elder-man-beard-laptop-cell-phone.png',
                imageAlt: 'Senior man using technology for tax planning'
              },
              { 
                title: 'Estate Planning', 
                icon: <FileText className="w-6 h-6" />, 
                desc: 'Discover how to protect your legacy.',
                imagePath: '/images/topics/happy-couple-gray-hard-back-embrace-meadow.png',
                imageAlt: 'Happy couple embracing in meadow - protecting family legacy'
              },
              { 
                title: 'Reverse Mortgage', 
                icon: <Home className="w-6 h-6" />, 
                desc: 'Find out if accessing home equity is right for you.',
                imagePath: '/images/topics/gray-hair-couple-walk-golden-retriever-park.png',
                imageAlt: 'Senior couple enjoying retirement lifestyle with their dog'
              },
              { 
                title: 'Regenerative Medicine', 
                icon: <Heart className="w-6 h-6" />, 
                desc: 'Learn about pain-free living with new treatments.',
                imagePath: '/images/topics/happy-senior-squat-fitness-class.png',
                imageAlt: 'Active senior participating in fitness class'
              },
              { 
                title: 'Housing', 
                icon: <MapPin className="w-6 h-6" />, 
                desc: 'Compare options for downsizing or relocating.',
                imagePath: '/images/topics/five-seniors-site-together-ipad.png',
                imageAlt: 'Group of seniors exploring housing options together'
              }
            ].map((topic, index) => (
              <TopicCard
                key={index}
                title={topic.title}
                description={topic.desc}
                icon={topic.icon}
                imagePath={topic.imagePath}
                imageAlt={topic.imageAlt}
                href="#"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why SeniorSimple */}
      <section className="py-16 px-6 bg-[#E4CDA1]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-serif font-semibold mb-8 text-[#36596A]">Why Choose SeniorSimple?</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#36596A] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#36596A] mb-2">Fiduciary-Aligned</h3>
                    <p className="text-gray-700">We only partner with licensed professionals who act in your best interest.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#36596A] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#36596A] mb-2">Senior-Centered Education</h3>
                    <p className="text-gray-700">Everything is built with the 55+ audience in mind—simple, jargon-free, and valuable.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#36596A] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#36596A] mb-2">No Obligation, Ever</h3>
                    <p className="text-gray-700">Our service is always free. You choose what happens next.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-full h-96 bg-white bg-opacity-30 rounded-xl flex items-center justify-center text-lg opacity-70 relative overflow-hidden">
                <Image
                  src="/images/webp/hero/gray-hair-short-brunette-beach-breeze.webp"
                  alt="Senior enjoying retirement with confidence and freedom"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Resources */}
      <section className="py-16 px-6 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2336596A' fill-opacity='0.05'%3E%3Cpath d='M30 30c0 16.569-13.431 30-30 30s-30-13.431-30-30 13.431-30 30-30 30 13.431 30 30zm0 0c0-16.569 13.431-30 30-30s30 13.431 30 30-13.431 30-30 30-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-semibold mb-4 text-[#36596A]">Tools & Resources</h2>
            <div className="w-24 h-1 bg-[#E4CDA1] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Interactive tools and downloadable resources to help you plan your retirement
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Retirement Income Estimator', desc: 'Get a sense of your monthly cash flow after retiring.', icon: <TrendingUp className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
              { title: 'Estate Planning Checklist', desc: 'Download your 10-step estate checklist today.', icon: <ClipboardList className="w-6 h-6" />, color: 'from-green-500 to-green-600' },
              { title: 'Reverse Mortgage Calculator', desc: 'See how much equity you can access.', icon: <Calculator className="w-6 h-6" />, color: 'from-purple-500 to-purple-600' }
            ].map((tool, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                {/* Background Accent */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {tool.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#36596A] group-hover:text-[#2a4a5a] transition-colors duration-300">{tool.title}</h3>
                <p className="text-gray-600 mb-6">{tool.desc}</p>
                <button className="text-[#36596A] font-medium hover:underline inline-flex items-center gap-2 group/btn">
                  Try Tool
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-6 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2336596A' fill-opacity='0.05'%3E%3Cpath d='M25 25c0 13.807-11.193 25-25 25s-25-11.193-25-25 11.193-25 25-25 25 11.193 25 25zm0 0c0-13.807 11.193-25 25-25s25 11.193 25 25-11.193 25-25 25-25-11.193-25-25z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-semibold mb-4 text-[#36596A]">
              Latest Retirement Insights
            </h2>
            <div className="w-24 h-1 bg-[#E4CDA1] mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed with our latest articles on retirement planning, annuities, and financial security.
            </p>
          </div>
          
          {/* Featured Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {error ? (
              <div className="col-span-full text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">Unable to load featured articles at this time.</p>
              </div>
            ) : featuredArticles && featuredArticles.length > 0 ? (
              featuredArticles.map((article) => (
                <article key={article.id} className="bg-[#F5F5F0] rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                  {/* Background Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#36596A] to-[#E4CDA1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#E4CDA1] text-[#36596A] text-sm font-medium rounded-full">
                      {article.category || 'Retirement'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-3 group-hover:text-[#2a4a5a] transition-colors duration-300">
                    <Link href={`/articles/${article.slug}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(article.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <Link href={`/articles/${article.slug}`} className="text-[#36596A] font-medium hover:underline inline-flex items-center gap-1 group/link">
                      Read More
                      <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              // Fallback articles when no featured articles are available
              <>
                <article className="bg-[#F5F5F0] rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#36596A] to-[#E4CDA1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#E4CDA1] text-[#36596A] text-sm font-medium rounded-full">
                      Annuities
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-3 group-hover:text-[#2a4a5a] transition-colors duration-300">
                    Understanding Fixed Index Annuities
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Learn how fixed index annuities can provide guaranteed income while protecting your principal from market downturns.
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Coming Soon</span>
                    <Link href="/articles" className="text-[#36596A] font-medium hover:underline inline-flex items-center gap-1 group/link">
                      Read More
                      <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </article>

                <article className="bg-[#F5F5F0] rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#36596A] to-[#E4CDA1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#E4CDA1] text-[#36596A] text-sm font-medium rounded-full">
                      Tax Planning
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-3 group-hover:text-[#2a4a5a] transition-colors duration-300">
                    Tax-Efficient Retirement Strategies
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Discover strategies to minimize taxes in retirement and maximize your income.
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Coming Soon</span>
                    <Link href="/articles" className="text-[#36596A] font-medium hover:underline inline-flex items-center gap-1 group/link">
                      Read More
                      <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </article>

                <article className="bg-[#F5F5F0] rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#36596A] to-[#E4CDA1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#E4CDA1] text-[#36596A] text-sm font-medium rounded-full">
                      Estate Planning
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#36596A] mb-3 group-hover:text-[#2a4a5a] transition-colors duration-300">
                    Protecting Your Legacy
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Essential steps to ensure your assets are protected and passed on according to your wishes.
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Coming Soon</span>
                    <Link href="/articles" className="text-[#36596A] font-medium hover:underline inline-flex items-center gap-1 group/link">
                      Read More
                      <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </article>
              </>
            )}
          </div>

          <div className="text-center">
            <Link 
              href="/articles"
              className="inline-block bg-[#36596A] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2a4a5a] transition-all duration-300 inline-flex items-center gap-2 group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 relative" style={{ background: 'linear-gradient(135deg, #36596A 0%, #82A6B1 100%)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M40 40c0 22.091-17.909 40-40 40s-40-17.909-40-40 17.909-40 40-40 40 17.909 40 40zm0 0c0-22.091 17.909-40 40-40s40 17.909 40 40-17.909 40-40 40-40-17.909-40-40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Heart className="w-8 h-8 text-[#36596A]" />
            </div>
            <h2 className="text-3xl font-serif font-semibold text-white mb-4">
              Join 50,000+ Seniors Getting Retirement Smart
            </h2>
            <div className="w-24 h-1 bg-white bg-opacity-30 mx-auto mb-6"></div>
            <p className="text-xl text-white mb-8 opacity-90">
              Weekly insights on income, taxes, healthcare, and more.
            </p>
          </div>
          
          <div className="max-w-md mx-auto mb-8">
            <NewsletterSignup />
          </div>
          
          <p className="text-sm text-white opacity-80 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Free download: The Retirement Planning Essentials Checklist
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2336596A' fill-opacity='0.05'%3E%3Cpath d='M50 50c0 27.614-22.386 50-50 50s-50-22.386-50-50 22.386-50 50-50 50 22.386 50 50zm0 0c0-27.614 22.386-50 50-50s50 22.386 50 50-22.386 50-50 50-50-22.386-50-50z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Get in Touch
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center gap-2 hover:text-[#36596A] transition-colors duration-300 cursor-pointer">
                  <Users className="w-4 h-4" />
                  Contact Us
                </p>
                <p className="flex items-center gap-2 hover:text-[#36596A] transition-colors duration-300 cursor-pointer">
                  <Phone className="w-4 h-4" />
                  Phone: 800-555-2040
                </p>
                <p className="flex items-center gap-2 hover:text-[#36596A] transition-colors duration-300 cursor-pointer">
                  <Mail className="w-4 h-4" />
                  Email: support@seniorsimple.org
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Resources
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className="hover:text-[#36596A] transition-colors duration-300 cursor-pointer">Annuities</p>
                <p className="hover:text-[#36596A] transition-colors duration-300 cursor-pointer">Estate Planning</p>
                <p className="hover:text-[#36596A] transition-colors duration-300 cursor-pointer">Health</p>
                <p className="hover:text-[#36596A] transition-colors duration-300 cursor-pointer">Housing</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                About
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className="hover:text-[#36596A] transition-colors duration-300 cursor-pointer">Mission</p>
                <p className="hover:text-[#36596A] transition-colors duration-300 cursor-pointer">Team</p>
                <p className="hover:text-[#36596A] transition-colors duration-300 cursor-pointer">Press</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#36596A] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Legal
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className="hover:text-[#36596A] transition-colors duration-300 cursor-pointer">Privacy Policy</p>
                <p className="hover:text-[#36596A] transition-colors duration-300 cursor-pointer">Terms of Service</p>
                <p className="hover:text-[#36596A] transition-colors duration-300 cursor-pointer">Disclaimers</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />
              © 2024 SeniorSimple. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
