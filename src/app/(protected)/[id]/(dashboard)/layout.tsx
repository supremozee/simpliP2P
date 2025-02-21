import CheckIdValidity from "@/components/layouts/CheckIdValidity";
import DashboardLayout from "@/components/templates/DashboardLayout";


const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <CheckIdValidity>
        <DashboardLayout>
          {children}
        </DashboardLayout>
    </CheckIdValidity>
  );
};

export default Layout;