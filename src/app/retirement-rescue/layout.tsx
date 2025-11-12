import FunnelLayoutActivator from "@/components/FunnelLayoutActivator";

export default function RetirementRescueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <FunnelLayoutActivator />
      {children}
    </>
  );
}
