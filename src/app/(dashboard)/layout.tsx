// src/app/(dashboard)/layout.tsx
// Route protection is handled by middleware (src/proxy.ts).
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
