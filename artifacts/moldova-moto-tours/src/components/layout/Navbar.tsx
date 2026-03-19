import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Tours", path: "/tours" },
    { name: "Motorcycles", path: "/motorcycles" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  // Don't show public navbar on admin pages
  if (location.startsWith("/admin")) return null;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src={`${import.meta.env.BASE_URL}images/logo.png`} 
              alt="Moldova Moto Tours Logo" 
              className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="font-display text-xl tracking-wider text-foreground">
              Moldova Moto Tours
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary ${
                  location === link.path ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/book">
              <Button className="font-display tracking-wider uppercase shadow-lg shadow-primary/20">
                Book a Ride
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card border-b border-border shadow-xl">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-medium p-2 rounded-lg transition-colors ${
                  location === link.path ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full font-display tracking-wider uppercase mt-4">
                Book a Ride
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
