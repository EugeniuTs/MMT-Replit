import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";

export default function ManageDates() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect href="/admin/login" />;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-display mb-8">Manage Tour Dates</h1>
        <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-xl">
          Tour Dates Management UI (Select tour, add date range, set spots)
        </div>
      </div>
    </div>
  );
}
