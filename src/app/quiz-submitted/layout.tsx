import FunnelLayoutActivator from '@/components/FunnelLayoutActivator'

export default function QuizSubmittedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <FunnelLayoutActivator />
      {children}
    </>
  )
}



