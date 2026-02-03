import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface TopicCardProps {
  title: string
  description: string
  icon: React.ReactNode
  imagePath?: string
  imageAlt?: string
  href?: string
}

export default function TopicCard({ 
  title, 
  description, 
  icon, 
  imagePath, 
  imageAlt, 
  href = "#" 
}: TopicCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#36596A] to-[#E4CDA1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon */}
      <div className="w-12 h-12 bg-[#E4CDA1] rounded-lg flex items-center justify-center mb-6 text-[#36596A] group-hover:scale-110 transition-transform duration-300 relative">
        {icon}
        <div className="absolute inset-0 bg-[#36596A] rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>
      
      {/* Optional Image */}
      {imagePath && (
        <div className="mb-6 relative h-48 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow duration-300">
          <Image
            src={imagePath}
            alt={imageAlt || `${title} illustration`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      {/* Content */}
      <h3 className="text-xl font-semibold mb-4 text-[#36596A] group-hover:text-[#2a4a5a] transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      {/* Link */}
      <a 
        href={href} 
        className="text-[#36596A] font-medium hover:underline inline-flex items-center gap-2 group/link"
      >
        Learn More 
        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
      </a>
    </div>
  )
}
