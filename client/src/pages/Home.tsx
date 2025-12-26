import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, TrendingUp, Leaf, Car, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import InteractiveEuropeMap from "@/components/InteractiveEuropeMap";
import { useState, useEffect } from "react";

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
  const [userCountry, setUserCountry] = useState<string | null>(null);

  // Detect user's country via IP geolocation
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const country = data.country_name;
        setUserCountry(country);
        console.log('Detected country:', country);
      })
      .catch(err => {
        console.error('Failed to detect country:', err);
        setUserCountry('Germany'); // Default to Germany
      });
  }, []);

  // Sort cities: user's country first, then others
  const sortedCities = cities ? [...cities].sort((a, b) => {
    if (!userCountry) return 0; // No sorting if country not detected
    
    const aIsUserCountry = 
      (userCountry === 'Germany' && a.country === 'Germany') ||
      (userCountry === 'France' && a.country === 'France') ||
      ((userCountry === 'United Kingdom' || userCountry === 'UK') && a.country === 'United Kingdom') ||
      ((userCountry === 'United States' || userCountry === 'USA') && a.country === 'United States');
    
    const bIsUserCountry = 
      (userCountry === 'Germany' && b.country === 'Germany') ||
      (userCountry === 'France' && b.country === 'France') ||
      ((userCountry === 'United Kingdom' || userCountry === 'UK') && b.country === 'United Kingdom') ||
      ((userCountry === 'United States' || userCountry === 'USA') && b.country === 'United States');
    
    if (aIsUserCountry && !bIsUserCountry) return -1;
    if (!aIsUserCountry && bIsUserCountry) return 1;
    return 0;
  }) : [];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative py-20 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/urbanpulse-logo.png" 
              alt="UrbanPulse by SkyMind" 
              className="h-32 w-auto drop-shadow-2xl"
            />
          </div>
          
          {/* Tagline with Shocking Stats */}
          <div className="mb-8">
            <p className="text-3xl md:text-4xl text-white font-bold mb-4 max-w-4xl mx-auto leading-tight">
              <span className="text-rose-400">+52% Immigration</span> → <span className="text-orange-400">+35% Property Prices</span>
            </p>
            <p className="text-xl md:text-2xl text-slate-300 mb-6 max-w-4xl mx-auto font-light">
              Discover how <span className="text-cyan-400 font-semibold">government decisions</span> reshaped your neighborhood's value
            </p>
          </div>
          
          {/* CTA Button */}
          <Link href="/government">
            <button className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-lg text-lg mb-12 transition-all shadow-lg hover:shadow-xl hover:scale-105">
              <AlertTriangle className="inline-block w-5 h-5 mr-2 -mt-1" />
              See Government Impact Analysis →
            </button>
          </Link>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
              <MapPin className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">15</p>
              <p className="text-sm text-slate-400">Global Cities</p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">5</p>
              <p className="text-sm text-slate-400">Communities Tracked</p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-teal-500/50 transition-all">
              <TrendingUp className="w-8 h-8 text-teal-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">2020-2024</p>
              <p className="text-sm text-slate-400">Historical Data</p>
            </div>
          </div>
        </div>
      </div>

      {/* City Gallery */}
      <div className="container pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-100 mb-3">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Cities</span>
            {userCountry && <span className="text-slate-400 text-2xl ml-2">in {userCountry}</span>}
          </h2>
          <p className="text-slate-400">Interactive district analysis with real-time demographic insights</p>
        </div>
        
        {/* Interactive Europe Map */}
        <InteractiveEuropeMap cities={cities || []} userCountry={userCountry} />
      </div>

      {/* Critical Analysis Banner */}
      <div className="container pb-8">
        <Link href="/government">
          <Card className="bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-yellow-500/10 border-rose-500/30 hover:border-rose-500/50 transition-all cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-rose-500/20 rounded-lg shrink-0">
                  <AlertTriangle className="w-8 h-8 text-rose-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Влияние решений правительства</h3>
                  <p className="text-gray-300 text-sm">
                    Что обещали vs что получили: анализ экономических последствий иммиграционной политики. 
                    Безработица, налоги, социальные выплаты - цифры говорят сами за себя.
                  </p>
                </div>
                <div className="text-rose-400 font-semibold shrink-0">
                  Посмотреть →
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Features Section */}
      <div className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          <Card className="bg-slate-900/50 border-slate-800 border-rose-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-rose-500/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Government Impact</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Critical analysis of policy decisions and their real economic consequences
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
