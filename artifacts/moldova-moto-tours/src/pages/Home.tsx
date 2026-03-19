import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, MapPin, Calendar, Star, Compass, ShieldCheck, Mountain } from "lucide-react";
import { useListTours } from "@workspace/api-client-react";

export default function Home() {
  const { data: tours, isLoading } = useListTours();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* hero background scenic motorcycle mountain */}
          <img 
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1920&q=80" 
            alt="Motorcycle on scenic road" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
          <div 
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-texture.png)`, backgroundSize: 'cover' }}
          ></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-medium tracking-widest mb-6 uppercase backdrop-blur-md">
            Uncharted Territory Awaits
          </span>
          <h1 className="text-5xl md:text-7xl font-display text-foreground mb-6 text-shadow-lg leading-tight">
            Ride the Hidden <br/><span className="text-primary">Roads of Moldova</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience Eastern Europe's best kept secret. Guided motorcycle expeditions through ancient monasteries, sprawling vineyards, and rugged countryside trails.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/book">
              <Button size="lg" className="w-full sm:w-auto font-display text-lg tracking-wider uppercase h-14 px-8 shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                Book a Tour
              </Button>
            </Link>
            <Link href="/tours">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-display text-lg tracking-wider uppercase h-14 px-8 border-2 backdrop-blur-sm bg-background/20 hover:bg-background/40">
                View Routes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Ride With Us */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display text-foreground mb-4">Why Ride Moldova?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Skip the crowded alpine passes and discover raw, authentic landscapes where every turn tells a story.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-background border-border/50 hover:border-primary/50 transition-colors group">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Compass className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Uncharted Routes</h3>
                <p className="text-muted-foreground">Navigate a mix of perfect tarmac, sweeping curves, and rugged unpaved paths that 99% of riders never see.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border/50 hover:border-primary/50 transition-colors group">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Mountain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Authentic Culture</h3>
                <p className="text-muted-foreground">Stay in traditional villages, visit massive underground wine cellars, and experience legendary hospitality.</p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border/50 hover:border-primary/50 transition-colors group">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Premium Fleet</h3>
                <p className="text-muted-foreground">Ride late-model, fully equipped adventure bikes perfectly suited for Moldovan terrain with expert guides.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-display text-foreground mb-4">Featured Expeditions</h2>
              <p className="text-muted-foreground">Select your next great adventure.</p>
            </div>
            <Link href="/tours" className="hidden md:flex items-center text-primary font-medium hover:underline">
              See All Tours <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-card rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {tours?.slice(0, 3).map((tour) => (
                <Card key={tour.id} className="overflow-hidden bg-card border-border/50 hover:border-primary/50 group transition-all duration-300">
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={tour.imageUrl || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80"} 
                      alt={tour.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary">
                      €{tour.priceEur}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 font-medium">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {tour.durationDays} Days</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Moldova</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 line-clamp-1">{tour.name}</h3>
                    <p className="text-muted-foreground mb-6 line-clamp-2 text-sm">{tour.shortDescription}</p>
                    <Link href="/book">
                      <Button className="w-full font-display tracking-wider uppercase">Book Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/tours">
              <Button variant="outline" className="w-full">View All Tours</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-primary text-primary" />)}
          </div>
          <h2 className="text-2xl md:text-4xl font-serif italic text-foreground mb-8 leading-relaxed">
            "The 5-day Grand Moldova tour was the highlight of my year. The roads are surprisingly diverse, the wine cellars are massive, and the guide knew every hidden path. A true raw adventure."
          </h2>
          <p className="font-display tracking-wider text-primary uppercase">— Marcus T., Germany</p>
        </div>
      </section>
    </div>
  );
}
