import { useListMotorcycles } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Shield, Gauge } from "lucide-react";

export default function Motorcycles() {
  const { data: motorcycles, isLoading } = useListMotorcycles();

  return (
    <div className="pt-24 min-h-screen bg-background pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">The Fleet</span>
          <h1 className="text-4xl md:text-6xl font-display mb-6">Built for the Unknown</h1>
          <p className="text-lg text-muted-foreground">
            Our fleet consists of well-maintained, late-model adventure touring motorcycles equipped with everything you need to tackle both smooth tarmac and rugged unpaved trails safely.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="h-[500px] bg-card rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {motorcycles?.filter(m => m.isAvailable).map((bike) => (
              <Card key={bike.id} className="bg-card border-border overflow-hidden group">
                <div className="h-72 relative bg-secondary/50 p-8 flex items-center justify-center">
                  <img 
                    src={bike.imageUrl || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80"} 
                    alt={bike.name} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                  />
                </div>
                <CardContent className="p-8 border-t border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-primary font-bold text-sm uppercase tracking-wider">{bike.brand}</span>
                      <h2 className="text-3xl font-display">{bike.model}</h2>
                    </div>
                    <div className="bg-secondary px-3 py-1 rounded font-bold text-foreground">
                      {bike.year}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 h-20">
                    {bike.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 py-6 border-y border-border mb-6">
                    <div className="text-center">
                      <Gauge className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Engine</div>
                      <div className="font-bold">{bike.engineCC} cc</div>
                    </div>
                    <div className="text-center border-x border-border">
                      <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Safety</div>
                      <div className="font-bold">ABS / TC</div>
                    </div>
                    <div className="text-center">
                      <Wrench className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Equipped</div>
                      <div className="font-bold">Luggage</div>
                    </div>
                  </div>

                  {bike.specs && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">Key Specs:</span> {bike.specs}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
