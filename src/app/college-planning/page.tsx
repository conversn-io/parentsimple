import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "College Planning Paths | ParentSimple",
  description:
    "Choose the right path for your family’s education journey. Explore readiness assessments for elite college prep, legacy planning, and more.",
};

const quizOptions = [
  {
    title: "Elite College Preparation",
    description:
      "Assess your student’s readiness for top-tier universities with a data-backed look at academics, extracurriculars, and admissions strategy.",
    action: {
      label: "Take the Elite Readiness Quiz",
      href: "/quiz/elite-university-readiness",
    },
    status: "available",
  },
  {
    title: "Legacy Prepared",
    description:
      "Understand how life insurance and estate planning can support your student’s long-term financial security and educational goals.",
    action: {
      label: "Start Legacy Readiness",
      href: "/quiz/legacy-readiness",
    },
    status: "available",
  },
  {
    title: "College or Business?",
    description:
      "Help your student weigh the benefits of pursuing higher education versus launching an entrepreneurial path early.",
    status: "soon",
  },
  {
    title: "Early Education Path",
    description:
      "Discover the best-fit learning environments based on your child’s interests, strengths, and developmental stage.",
    status: "soon",
  },
];

export default function CollegePlanningPage() {
  return (
    <div className="bg-[#F9F6EF] min-h-screen w-full">
      <section className="py-16">
        <PageContainer className="max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-6">
          <p className="text-sm font-semibold tracking-[0.2em] text-[#9DB89D] uppercase">
            ParentSimple Planning Suite
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2B49]">
            Choose the right path for your family’s future
          </h1>
          <p className="text-lg text-gray-700">
            Whether you’re preparing for the Ivy League, building a lasting legacy, or planning your child’s earliest learning experiences, our assessments give you a roadmap created by educational and financial experts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {quizOptions.map((option) => (
            <div
              key={option.title}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between border border-[#E3E0D5]"
            >
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide font-semibold text-[#9DB89D]">
                  {option.status === "soon" ? "Coming Soon" : "Available Now"}
                </p>
                <h2 className="text-2xl font-semibold text-[#1A2B49]">
                  {option.title}
                </h2>
                <p className="text-gray-700">{option.description}</p>
              </div>
              <div className="mt-6">
                {option.status === "available" && option.action ? (
                  <Button
                    variant="primary"
                    className="w-full"
                    href={option.action.href}
                  >
                    {option.action.label}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div id="resources" className="mt-16 text-center bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-serif font-bold text-[#1A2B49] mb-4">Not sure where to start?</h2>
          <p className="text-gray-700 mb-6">
            Connect with our team for personalized guidance, access our free college-planning tools, or explore the latest parent resources.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary" href="/consultation">
              Book a Strategy Call
            </Button>
            <Button variant="outline" href="/resources">
              Browse Parent Resources
            </Button>
          </div>
        </div>
        </PageContainer>
      </section>
    </div>
  );
}

