import FunnelLayoutActivator from '@/components/FunnelLayoutActivator'

export default function LifeInsuranceWebinarLayout({
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
