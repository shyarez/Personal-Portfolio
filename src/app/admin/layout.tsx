import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · Enquiries",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-svh bg-ink">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,61,139,0.12),transparent_50%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
