import Link from 'next/link';
import { Calculator, TrendingUp, DollarSign, Home, Heart, Shield } from "lucide-react";
import Footer from "../Footer";


const Calculators = () => {
  const calculators = [
    {
      icon: Calculator,
      title: "Retirement Savings Calculator",
      description: "Calculate how much you need to save for retirement and track your progress.",
      features: ["Retirement goal planning", "Monthly savings recommendations", "Progress tracking"],
      link: "/assessment/retirement-planning",
      color: "text-trust-blue",
      popular: true
    },
    {
      icon: TrendingUp,
      title: "Investment Growth Calculator",
      description: "See how your investments could grow over time with compound interest.",
      features: ["Compound interest calculations", "Different investment scenarios", "Growth projections"],
      link: "/calculators/investment-growth",
      color: "text-trust-green"
    },
    {
      icon: DollarSign,
      title: "Social Security Benefits Calculator",
      description: "Estimate your Social Security benefits and find the optimal claiming strategy.",
      features: ["Benefit estimation", "Claiming strategies", "Break-even analysis"],
      link: "/calculators/social-security",
      color: "text-trust-gold"
    },
    {
      icon: Home,
      title: "Reverse Mortgage Calculator",
      description: "Determine how much you could receive from a reverse mortgage.",
      features: ["Loan amount estimation", "Payment options", "Cost analysis"],
      link: "/calculators/reverse-mortgage",
      color: "text-orange-600"
    },
    {
      icon: Heart,
      title: "Life Insurance Needs Calculator",
      description: "Calculate the right amount of life insurance coverage for your family.",
      features: ["Coverage needs analysis", "Premium estimates", "Policy comparisons"],
      link: "/assessment/life-insurance",
      color: "text-destructive"
    },
    {
      icon: Shield,
      title: "Medicare Cost Calculator",
      description: "Estimate your Medicare costs and compare different plan options.",
      features: ["Cost comparisons", "Plan selection", "Out-of-pocket estimates"],
      link: "/calculators/medicare-costs",
      color: "text-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#36596A] mb-4">
              Free Retirement Calculators
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful calculators to help you plan every aspect of your retirement finances.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {calculators.map((calculator, index) => {
              const IconComponent = calculator.icon;
              return (
                <div key={index} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${calculator.popular ? 'ring-2 ring-[#36596A]' : ''}`}>
                  <div className="text-center pb-4">
                    {calculator.popular && (
                      <div className="mb-2">
                        <span className="inline-block bg-[#36596A] text-white px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <IconComponent className={`h-12 w-12 mx-auto mb-4 text-[#36596A]`} />
                    <h3 className="text-xl font-semibold text-[#36596A] mb-2">{calculator.title}</h3>
                    <p className="text-gray-600">
                      {calculator.description}
                    </p>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#36596A] mb-3">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {calculator.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-[#36596A] rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={calculator.link} className="block">
                    <button className="w-full bg-[#36596A] hover:bg-[#2a4a5a] text-white py-2 px-4 rounded-lg transition-colors">
                      Use Calculator
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

export default Calculators;