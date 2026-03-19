import { Link, useLocation } from "wouter";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const [location] = useLocation();
  if (location.startsWith("/admin")) return null;

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.png`} 
                alt="Logo" 
                className="w-8 h-8 opacity-80"
              />
              <span className="font-display text-xl tracking-wider">
                Moldova Moto Tours
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Discover the hidden gems, rugged landscapes, and rich culture of Moldova on our premium guided motorcycle expeditions.
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/tours" className="hover:text-primary transition-colors">Our Tours</Link></li>
              <li><Link href="/motorcycles" className="hover:text-primary transition-colors">The Bikes</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg mb-4 text-primary">Contact</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Chisinau, Republic of Moldova</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+373 60 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@moldovamototours.com</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="bg-secondary p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="bg-secondary p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Moldova Moto Tours. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/admin/login" className="hover:text-primary">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
