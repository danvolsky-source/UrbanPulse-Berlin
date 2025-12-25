import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, TrendingUp, Leaf, Car } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

// City poster mapping
const cityPosters: Record<string, string> = {
  "Berlin": "/city-posters/berlin.png",
  "Munich": "/city-posters/munich.png",
  "Hamburg": "/city-posters/hamburg.png",
  "Cologne": "/city-posters/cologne.png",
  "Paris": "/city-posters/paris.png",
  "Vienna": "/city-posters/vienna.png",
  "Rome": "/city-posters/rome.png",
  "Amsterdam": "/city-posters/amsterdam.png",
  "Brussels": "/city-posters/brussels.png",
  "London": "/city-posters/london.png",
  "Washington D.C.": "/city-posters/washington-dc.png",
  "New York": "/city-posters/new-york.png",
  "Toronto": "/city-posters/toronto.png",
  "Los Angeles": "/city-posters/los-angeles.png",
  "Chicago": "/city-posters/chicago.png",
};

export default function Home() {
  const { data: cities, isLoading } = trpc.cities.list.useQuery();
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-[600px] mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="container py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Real Estate Analytics Platform
        </h1>
        <p className="text-xl text-slate-300 mb-4 max-w-3xl mx-auto">
          Explore demographic insights, religious infrastructure, and property market analysis across 15 major cities
        </p>
        <div className="flex items-center justify-center gap-8 text-slate-400 text-sm mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>15 Cities</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>5 Communities</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>5 Years Data</span>
          </div>
        </div>
        
        {/* Quick Access Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Link href="/ecology">
            <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <Leaf className="w-5 h-5" />
              Environmental Analytics
            </button>
          </Link>
          <Link href="/vehicles">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Car className="w-5 h-5" />
              Vehicle Analytics
            </button>
          </Link>
        </div>
      </div>

      {/* City Gallery */}
      <div className="container pb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-100">
          Select a City to Explore
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cities?.map((city: any) => (
            <Link key={city.id} href={`/city/${city.name}`}>
              <Card 
                className="group relative overflow-hidden bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer h-full"
                onMouseEnter={() => setHoveredCity(city.name)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                <CardContent className="p-0">
                  {/* City Poster Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={cityPosters[city.name]}
                      alt={`${city.name} floating island`}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        hoveredCity === city.name ? "scale-110" : "scale-100"
                      }`}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {/* City Name Badge */}
                    <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-500/30">
                      <h3 className="text-lg font-bold text-cyan-400">{city.name}</h3>
                    </div>

                    {/* Stats Overlay - Shows on Hover */}
                    <div className={`absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
                      hoveredCity === city.name ? "opacity-100" : "opacity-0"
                    }`}>
                      <div className="text-center space-y-3">
                        <div>
                          <p className="text-slate-400 text-sm">Population</p>
                          <p className="text-2xl font-bold text-cyan-400">
                            {city.population.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Districts</p>
                          <p className="text-xl font-semibold text-slate-200">
                            {city.districtCount}
                          </p>
                        </div>
                        <div className="pt-2">
                          <span className="text-cyan-400 text-sm font-medium group-hover:underline">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info Bar */}
                  <div className="p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {city.country}
                      </span>
                      <span className="text-cyan-400 font-medium">
                        Explore →
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Interactive Maps</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Explore districts with color-coded community dominance and infrastructure markers
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Demographic Analysis</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Track community composition trends with 5 years of historical data
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Market Insights</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Property price trends and investment recommendations powered by AI
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
