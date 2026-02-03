import FunnelLayoutActivator from '@/components/FunnelLayoutActivator'

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FunnelLayoutActivator />
      {children}
    </>
  )
}





