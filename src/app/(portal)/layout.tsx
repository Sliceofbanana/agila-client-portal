// src/app/(portal)/layout.tsx
// Route protection is handled by middleware (src/proxy.ts).
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}