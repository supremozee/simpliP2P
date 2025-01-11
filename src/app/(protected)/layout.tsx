import AuthWrapper from "@/components/layouts/AuthWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {

  return <AuthWrapper>{children}</AuthWrapper>;
}