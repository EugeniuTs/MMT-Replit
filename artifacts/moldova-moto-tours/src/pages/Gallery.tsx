export default function Gallery() {
  const images = [
    { url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80", title: "Mountain Roads" },
    { url: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=800&q=80", title: "Group Ride" },
    { url: "https://images.unsplash.com/photo-1558980394-4c7c9299fe96?w=800&q=80", title: "Sunset Stop" },
    { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80", title: "Countryside Exploration" },
    { url: "https://images.unsplash.com/photo-1516214104703-d2a148edcbe3?w=800&q=80", title: "Off-road Trails" },
    { url: "https://images.unsplash.com/photo-1541336032412-2048a678540d?w=800&q=80", title: "Monastery Visit" },
  ];

  return (
    <div className="pt-24 min-h-screen bg-background pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-display mb-4">Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Glimpses of the rugged beauty, the camaraderie, and the open roads that define our expeditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="group relative h-72 md:h-80 overflow-hidden rounded-xl bg-card">
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <h3 className="text-white font-display text-xl tracking-wider">{img.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
