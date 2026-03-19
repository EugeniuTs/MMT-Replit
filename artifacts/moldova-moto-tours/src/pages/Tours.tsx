import { useListTours } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Tours() {
  const { data: tours, isLoading } = useListTours();

  return (
    <div className="pt-24 min-h-screen bg-background pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-display mb-4">Our Expeditions</h1>
          <p className="text-lg text-muted-foreground">
            From quick escapes to comprehensive national tours, find the perfect route for your riding style and schedule.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-card rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {tours?.filter(t => t.isActive).map((tour) => (
              <Card key={tour.id} className="overflow-hidden bg-card border-border/50 grid grid-cols-1 md:grid-cols-12 gap-0 group hover:border-primary/50 transition-colors">
                <div className="md:col-span-5 h-64 md:h-full relative overflow-hidden">
                  <img 
                    src={tour.imageUrl || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80"} 
                    alt={tour.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground font-bold px-4 py-1 rounded-full shadow-lg">
                    €{tour.priceEur}
                  </div>
                </div>
                
                <CardContent className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-sm text-primary mb-3 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {tour.durationDays} Days</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Max {tour.maxRiders} Riders</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{tour.name}</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {tour.description}
                    </p>
                    
                    {tour.highlights && (
                      <div className="mb-8">
                        <h4 className="font-display tracking-wider text-foreground mb-3">Highlights</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {tour.highlights.split(',').map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <span>{highlight.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-border/50">
                    <Link href="/book">
                      <Button size="lg" className="font-display tracking-wider uppercase w-full md:w-auto px-10 shadow-lg shadow-primary/20">
                        Book This Tour
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
