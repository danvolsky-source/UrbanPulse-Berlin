import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, TrendingUp, Leaf, Car, BarChart3 } from "lucide-react";
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
  const [userCountry, setUserCountry] = useState<string>("Germany");

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

  // Check if user's country has cities in database
  const hasUserCountryCities = cities ? cities.some(city => {
    return (
      (userCountry === 'Germany' && city.country === 'Germany') ||
      (userCountry === 'France' && city.country === 'France') ||
      ((userCountry === 'United Kingdom' || userCountry === 'UK') && city.country === 'United Kingdom') ||
      ((userCountry === 'United States' || userCountry === 'USA') && city.country === 'United States') ||
      (userCountry === 'Austria' && city.country === 'Austria') ||
      (userCountry === 'Italy' && city.country === 'Italy') ||
      (userCountry === 'Netherlands' && city.country === 'Netherlands') ||
      (userCountry === 'Belgium' && city.country === 'Belgium') ||
      (userCountry === 'Canada' && city.country === 'Canada')
    );
  }) : false;

  // Display country name for title
  const displayCountry = hasUserCountryCities ? userCountry : null;

  // Sort cities: user's country first, then others
  const sortedCities = cities ? [...cities].sort((a, b) => {
    if (!userCountry || !hasUserCountryCities) return 0; // No sorting if country not detected or not in DB
    
    const aIsUserCountry = 
      (userCountry === 'Germany' && a.country === 'Germany') ||
      (userCountry === 'France' && a.country === 'France') ||
      ((userCountry === 'United Kingdom' || userCountry === 'UK') && a.country === 'United Kingdom') ||
      ((userCountry === 'United States' || userCountry === 'USA') && a.country === 'United States') ||
      (userCountry === 'Austria' && a.country === 'Austria') ||
      (userCountry === 'Italy' && a.country === 'Italy') ||
      (userCountry === 'Netherlands' && a.country === 'Netherlands') ||
      (userCountry === 'Belgium' && a.country === 'Belgium') ||
      (userCountry === 'Canada' && a.country === 'Canada');
    
    const bIsUserCountry = 
      (userCountry === 'Germany' && b.country === 'Germany') ||
      (userCountry === 'France' && b.country === 'France') ||
      ((userCountry === 'United Kingdom' || userCountry === 'UK') && b.country === 'United Kingdom') ||
      ((userCountry === 'United States' || userCountry === 'USA') && b.country === 'United States') ||
      (userCountry === 'Austria' && b.country === 'Austria') ||
      (userCountry === 'Italy' && b.country === 'Italy') ||
      (userCountry === 'Netherlands' && b.country === 'Netherlands') ||
      (userCountry === 'Belgium' && b.country === 'Belgium') ||
      (userCountry === 'Canada' && b.country === 'Canada');
    
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
          {/* Logo - Professional placement with transparent background */}
          <div className="flex justify-center mb-8">
            <img 
              src="/urbanpulse-logo.png" 
              alt="UrbanPulse by SkyMind" 
              className="h-16 w-auto object-contain"
              style={{ 
                filter: 'drop-shadow(0 8px 24px rgba(6, 182, 212, 0.4))',
                mixBlendMode: 'normal'
              }}
            />
          </div>
          
          {/* Hero Message with Improved Value Proposition */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl text-white font-bold mb-6 max-w-4xl mx-auto leading-tight">
              <span className="text-cyan-400">Compare 15 Cities</span> <span className="text-white">(2015–2024)</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-4 max-w-4xl mx-auto font-normal leading-relaxed">
              Access 10 years of verified demographic and housing data from 15 global cities — free for researchers, policymakers, and citizens
            </p>
            <p className="text-base text-slate-400 max-w-2xl mx-auto">
              Explore correlations · No causation claims
            </p>
          </div>
          
          {/* Academic Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-400">Research & Educational Tool</span>
            </div>
          </div>

          {/* Clear CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => window.scrollTo({ top: document.getElementById('cities-section')?.offsetTop || 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold px-10 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Explore Cities →
            </button>
            <Link href="/methodology">
              <button className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-10 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl border border-slate-700">
                View Methodology
              </button>
            </Link>
          </div>

          {/* Featured Insight - Visual Proof */}
          <div className="max-w-3xl mx-auto mb-10">
            <Link href="/cities/Berlin">
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-2 border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-500/60 transition-all hover:scale-[1.02] cursor-pointer group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Featured Insight</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Berlin: Property prices rose 35% (2015–2024) while Muslim community grew 52%
                </h3>
                <p className="text-slate-300 mb-4">
                  Explore the full district-level analysis with interactive heatmaps, demographic breakdowns, and economic indicators across 200+ neighborhoods.
                </p>
                <div className="flex items-center gap-2 text-cyan-400 font-medium group-hover:gap-3 transition-all">
                  <span>Explore Berlin Data</span>
                  <span className="text-xl">→</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats Grid - Improved contrast and size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-8 hover:border-cyan-500/70 transition-all hover:scale-105">
              <MapPin className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
              <p className="text-5xl font-bold text-white mb-2">15</p>
              <p className="text-base text-slate-300 font-medium">Global Cities</p>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-8 hover:border-purple-500/70 transition-all hover:scale-105">
              <Users className="w-10 h-10 text-purple-400 mx-auto mb-4" />
              <p className="text-5xl font-bold text-white mb-2">5</p>
              <p className="text-base text-slate-300 font-medium">Communities Tracked</p>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-8 hover:border-teal-500/70 transition-all hover:scale-105">
              <TrendingUp className="w-10 h-10 text-teal-400 mx-auto mb-4" />
              <p className="text-5xl font-bold text-white mb-2">2015-2024</p>
              <p className="text-base text-slate-300 font-medium">Historical Data</p>
            </div>
          </div>
        </div>
      </div>

      {/* City Gallery */}
      <div id="cities-section" className="container pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-100 mb-3">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Cities</span>
            {displayCountry ? (
              <span className="text-slate-400 text-2xl ml-2">in {displayCountry}</span>
            ) : (
              <span className="text-slate-400 text-2xl ml-2">Worldwide</span>
            )}
          </h2>
          <p className="text-slate-400">Interactive district analysis with demographic and economic indicators</p>
        </div>
        
        {/* Interactive Europe Map */}
        <InteractiveEuropeMap cities={cities || []} userCountry={displayCountry || ''} />
      </div>

      {/* Urban Development Analysis Banner - Neutral Academic Tone */}
      <div className="container pb-8">
        <Link href="/methodology">
          <Card className="bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-blue-500/10 border-cyan-500/30 hover:border-cyan-500/50 transition-all cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-cyan-500/20 rounded-lg shrink-0">
                  <BarChart3 className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">City Data Explorer</h3>
                  <p className="text-gray-300 text-sm">
                    Analyzing correlations between demographic change, city context, and housing market dynamics. 
                    Explore distributional effects across employment, economic indicators, and urban development patterns.
                  </p>
                </div>
                <div className="text-cyan-400 font-semibold shrink-0">
                  Learn More →
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
                Explore districts with demographic composition and infrastructure data visualization
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
                Track community composition trends with 10 years of historical data
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Market Indicators</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Property price trends and housing market dynamics analysis
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">Development Patterns</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Observable relationships between demographic changes and urban development trends
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="container pb-12">
        <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 text-center">
          <p className="text-xs text-slate-500 max-w-4xl mx-auto leading-relaxed mb-3">
            <strong className="text-slate-400">Research & Educational Tool:</strong> This platform presents observable correlations in urban data for research and educational purposes. 
            Correlation does not imply causation. Multiple confounding variables may influence observed patterns. 
            Data is aggregated from public sources and should not be used as sole basis for financial, legal, or decision-making. 
            <Link href="/methodology" className="text-cyan-400 hover:text-cyan-300 ml-1">View full methodology →</Link>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <Link href="/terms" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms of Service</Link>
            <span className="text-slate-700">•</span>
            <Link href="/privacy" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-700">•</span>
            <Link href="/methodology" className="text-cyan-400 hover:text-cyan-300 transition-colors">Methodology</Link>
          <span className="text-slate-700">•</span>
          <Link href="/references" className="text-cyan-400 hover:text-cyan-300 transition-colors">References</Link>
          <span className="text-slate-700">•</span>
          <Link href="/about" className="text-cyan-400 hover:text-cyan-300 transition-colors">About</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
