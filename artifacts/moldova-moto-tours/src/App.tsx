import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Public Pages
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import Motorcycles from "./pages/Motorcycles";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import BookingWizard from "./pages/Booking";

// Admin Pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageTours from "./pages/admin/ManageTours";
import ManageDates from "./pages/admin/ManageDates";
import ManageMotorcycles from "./pages/admin/ManageMotorcycles";
import ManageBookings from "./pages/admin/ManageBookings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background pt-24">
      <h1 className="text-6xl font-display text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground">The road ends here. Page not found.</p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tours" component={Tours} />
      <Route path="/motorcycles" component={Motorcycles} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/book" component={BookingWizard} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/tours" component={ManageTours} />
      <Route path="/admin/dates" component={ManageDates} />
      <Route path="/admin/motorcycles" component={ManageMotorcycles} />
      <Route path="/admin/bookings" component={ManageBookings} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
