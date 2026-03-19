import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuth } from "@/lib/auth";
import { Redirect } from "wouter";
import { useListTours, useCreateTour, useDeleteTour, getListToursQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Edit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function ManageTours() {
  const { isAuthenticated, authHeaders } = useAuth();
  const queryClient = useQueryClient();
  const { data: tours, isLoading } = useListTours();
  const deleteMutation = useDeleteTour({ request: { headers: authHeaders } });

  if (!isAuthenticated) return <Redirect href="/admin/login" />;

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListToursQueryKey() })
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display">Manage Tours</h1>
          <Button className="font-display tracking-wider"><Plus className="w-4 h-4 mr-2"/> Add Tour</Button>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
                ) : tours?.map((tour) => (
                  <TableRow key={tour.id} className="border-border hover:bg-secondary/50">
                    <TableCell className="font-bold">{tour.name}</TableCell>
                    <TableCell>{tour.durationDays} Days</TableCell>
                    <TableCell>€{tour.priceEur}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${tour.isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {tour.isActive ? 'Active' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/20"
                        onClick={() => handleDelete(tour.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
