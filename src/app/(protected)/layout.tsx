import AuthWrapper from "@/components/layouts/AccessWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {

  return <AuthWrapper>{children}</AuthWrapper>;
}