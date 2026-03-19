import { Link, useLocation } from "wouter";
import { LayoutDashboard, Map, CalendarDays, Bike, Users, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function AdminSidebar() {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();

  const links = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Map, label: "Manage Tours", href: "/admin/tours" },
    { icon: CalendarDays, label: "Manage Dates", href: "/admin/dates" },
    { icon: Bike, label: "Motorcycles", href: "/admin/motorcycles" },
    { icon: Users, label: "Bookings", href: "/admin/bookings" },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  return (
    <div className="w-64 bg-card border-r border-border min-h-screen flex flex-col hidden md:flex">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8" />
        <span className="font-display tracking-wider text-primary">ADMIN PANEL</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
