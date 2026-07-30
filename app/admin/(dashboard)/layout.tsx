import "../admin.css";
import { AdminAuthProvider } from "@/components/admin/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

/**
 * Shared shell for every signed-in admin route (Overview, Enquiries,
 * Pricing, Tours): auth guard + sidebar. A route group (parens don't affect
 * the URL) so /admin/login stays outside it — this shell would otherwise
 * redirect an unauthenticated visitor away from the very page they need to
 * sign in on, and Tailwind/admin.css would leak into a page that doesn't use
 * it.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="admin-root flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden p-6 animate-in fade-in duration-500 md:p-8">
          {children}
        </main>
      </div>
    </AdminAuthProvider>
  );
}
