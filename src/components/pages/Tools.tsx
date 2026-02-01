import Link from 'next/link';
import { Calculator, PiggyBank, Home, Heart, DollarSign, Shield } from "lucide-react";
import Footer from "../Footer";


const Tools = () => {
  const tools = [
    {
      icon: Calculator,
      title: "Retirement Calculator",
      description: "Calculate how much you need to retire comfortably and see if you're on track.",
      link: "/assessment/retirement-planning",
      category: "Retirement Planning",
      color: "text-trust-blue"
    },
    {
      icon: PiggyBank,
      title: "Financial Assessment",
      description: "Get a comprehensive analysis of your current financial situation.",
      link: "/assessment/financial-calculator",
      category: "Financial Planning",
      color: "text-trust-green"
    },
    {
      icon: Heart,
      title: "Life Insurance Calculator",
      description: "Determine the right amount of life insurance coverage for your family.",
      link: "/assessment/life-insurance",
      category: "Protection",
      color: "text-destructive"
    },
    {
      icon: Home,
      title: "Reverse Mortgage Calculator",
      description: "Explore if a reverse mortgage is right for your situation.",
      link: "/tools/reverse-mortgage",
      category: "Housing",
      color: "text-trust-gold"
    },
    {
      icon: DollarSign,
      title: "Social Security Optimizer",
      description: "Find the best time to claim Social Security benefits.",
      link: "/tools/social-security",
      category: "Retirement Planning",
      color: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Medicare Cost Estimator",
      description: "Estimate your Medicare costs and compare plan options.",
      link: "/tools/medicare",
      category: "Healthcare",
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#36596A] mb-4">
              Retirement Planning Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Free calculators and tools to help you plan every aspect of your retirement journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                  <div className="text-center pb-4">
                    <IconComponent className={`h-12 w-12 mx-auto mb-4 text-[#36596A]`} />
                    <h3 className="text-xl font-semibold text-[#36596A] mb-2">{tool.title}</h3>
                    <p className="text-gray-600">
                      {tool.description}
                    </p>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-[#E4CDA1] text-[#36596A] px-3 py-1 rounded-full text-sm font-medium">
                      {tool.category}
                    </span>
                  </div>
                  <Link href={tool.link} className="block">
                    <button className="w-full bg-[#36596A] hover:bg-[#2a4a5a] text-white py-2 px-4 rounded-lg transition-colors">
                      Use Tool
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Tools;