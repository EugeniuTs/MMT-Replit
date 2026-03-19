import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListBookings, useListTours } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { Users, Euro, Map, Calendar as CalIcon } from "lucide-react";

export default function Dashboard() {
  const { isAuthenticated, authHeaders } = useAuth();
  // Pass auth headers to requests
  const { data: bookings } = useListBookings({ request: { headers: authHeaders } });
  const { data: tours } = useListTours();

  if (!isAuthenticated) return <Redirect href="/admin/login" />;

  const totalRevenue = bookings?.reduce((acc, curr) => acc + (curr.paymentStatus === 'paid' ? curr.totalAmount : curr.depositAmount), 0) || 0;
  const pendingBookings = bookings?.filter(b => b.bookingStatus === 'pending').length || 0;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-display mb-8">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/20 p-4 rounded-xl"><Users className="w-8 h-8 text-primary" /></div>
              <div>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Total Bookings</p>
                <p className="text-3xl font-display">{bookings?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/20 p-4 rounded-xl"><CalIcon className="w-8 h-8 text-primary" /></div>
              <div>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Pending</p>
                <p className="text-3xl font-display">{pendingBookings}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/20 p-4 rounded-xl"><Euro className="w-8 h-8 text-primary" /></div>
              <div>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Revenue (Est)</p>
                <p className="text-3xl font-display">€{totalRevenue}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/20 p-4 rounded-xl"><Map className="w-8 h-8 text-primary" /></div>
              <div>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Active Tours</p>
                <p className="text-3xl font-display">{tours?.filter(t=>t.isActive).length || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings simplified view */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display tracking-wider">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings?.slice(0,5).map(b => (
                <div key={b.id} className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
                  <div>
                    <p className="font-bold">{b.fullName}</p>
                    <p className="text-sm text-muted-foreground">{b.tour?.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="px-2 py-1 rounded text-xs font-bold uppercase bg-secondary text-foreground">
                      {b.bookingStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
