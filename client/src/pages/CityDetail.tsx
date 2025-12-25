import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Building2, Users, MapPin, DollarSign } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// City information database with history and cultural features
const cityInfo: Record<string, {
  description: string;
  history: string;
  culture: string;
  investment: string;
  highlights: string[];
}> = {
  "Berlin": {
    description: "Germany's capital and largest city, known for its cultural diversity, vibrant arts scene, and historical significance.",
    history: "Berlin has been at the center of European history for centuries. After the fall of the Berlin Wall in 1989, the city underwent massive transformation, becoming a symbol of reunification and modern European identity. Today, Berlin stands as a testament to resilience and cultural integration.",
    culture: "Berlin's cultural landscape is shaped by significant Turkish, Polish, and Syrian communities. The city boasts over 175 museums, three opera houses, and countless galleries. Neighborhoods like Kreuzberg and Neukölln showcase the city's multicultural character, with diverse cuisines, languages, and traditions coexisting harmoniously.",
    investment: "Berlin's real estate market has shown consistent growth, particularly in districts with strong community infrastructure. Areas with established immigrant communities often feature lower entry prices but demonstrate strong appreciation potential. The city's status as a tech hub and cultural capital continues to attract international investment.",
    highlights: ["Tech startup hub", "UNESCO World Heritage sites", "Vibrant nightlife", "Affordable compared to other capitals"]
  },
  "Munich": {
    description: "Bavaria's capital, renowned for its rich cultural heritage, economic strength, and high quality of life.",
    history: "Munich's history dates back to the 12th century, serving as the capital of Bavaria for over 850 years. The city played a pivotal role in German history and has evolved into one of Europe's most prosperous metropolitan areas, home to major corporations and world-class universities.",
    culture: "Munich blends traditional Bavarian culture with cosmopolitan diversity. The city hosts significant Turkish, Italian, and Greek communities, contributing to its rich cultural tapestry. Annual events like Oktoberfest attract millions, while year-round cultural offerings include opera, theater, and classical music.",
    investment: "Munich consistently ranks among Europe's most expensive real estate markets, reflecting its strong economy and high living standards. Districts with good infrastructure connectivity and proximity to corporate headquarters command premium prices. The market shows resilience and steady appreciation.",
    highlights: ["Economic powerhouse", "World-class universities", "Cultural festivals", "High quality of life"]
  },
  "Hamburg": {
    description: "Germany's second-largest city and Europe's third-largest port, combining maritime heritage with modern urban living.",
    history: "Hamburg's history as a major port city spans over 1,200 years. As a member of the medieval Hanseatic League, it became a center of trade and commerce. Today, Hamburg maintains its status as a global logistics hub while embracing cultural diversity and innovation.",
    culture: "Hamburg's port heritage has fostered a naturally diverse population. The city's Turkish, Polish, and Afghan communities have enriched its cultural landscape. The Reeperbahn entertainment district, Elbphilharmonie concert hall, and numerous museums reflect the city's blend of tradition and modernity.",
    investment: "Hamburg's real estate market benefits from its strong economy and port activities. Waterfront developments and renovated warehouse districts (Speicherstadt) have seen significant appreciation. The city offers a balanced market with opportunities across various price segments.",
    highlights: ["Major European port", "Maritime heritage", "Thriving media industry", "Architectural landmarks"]
  },
  "Cologne": {
    description: "A historic city on the Rhine River, famous for its Gothic cathedral and vibrant cultural scene.",
    history: "Founded by the Romans in 50 CE, Cologne is one of Germany's oldest cities. The iconic Cologne Cathedral, a UNESCO World Heritage site, dominates the skyline. Despite heavy bombing in World War II, the city rebuilt itself while preserving its historical character.",
    culture: "Cologne is known for its welcoming atmosphere and strong carnival tradition. The city's Turkish, Italian, and Polish communities contribute to its diverse cultural fabric. The city hosts numerous festivals, art galleries, and is a center for media and television production.",
    investment: "Cologne's central location in the Rhine-Ruhr metropolitan region makes it attractive for investment. The real estate market shows steady growth, with particular strength in well-connected districts. The city offers more affordable entry points compared to Munich or Frankfurt.",
    highlights: ["Gothic cathedral", "Carnival celebrations", "Media industry hub", "Rhine River location"]
  },
  "Paris": {
    description: "France's capital and most populous city, globally renowned for art, fashion, gastronomy, and culture.",
    history: "Paris has been a major European city for over two millennia, serving as France's capital since the 12th century. From the French Revolution to the Belle Époque, Paris has been at the forefront of political, artistic, and intellectual movements that shaped modern Europe.",
    culture: "Paris is one of the world's most diverse cities, with significant North African, Sub-Saharan African, and Asian communities. The city's 20 arrondissements each have distinct characters, from the bohemian Montmartre to the elegant Marais. Paris hosts world-class museums, theaters, and culinary institutions.",
    investment: "Paris real estate remains among the world's most prestigious and expensive. The market shows resilience even during economic downturns. Central arrondissements command premium prices, while outer districts offer growth potential. Strong rental demand from international students and professionals supports investment.",
    highlights: ["Global fashion capital", "World-class museums", "Architectural masterpieces", "Culinary excellence"]
  },
  "Vienna": {
    description: "Austria's capital, celebrated for its imperial palaces, classical music heritage, and high quality of life.",
    history: "Vienna served as the capital of the Habsburg Empire for over 600 years, becoming a center of European politics, culture, and science. The city's imperial legacy is visible in its grand architecture and cultural institutions. Today, Vienna consistently ranks as one of the world's most livable cities.",
    culture: "Vienna's cultural scene is enriched by Turkish, Serbian, and Polish communities. The city is synonymous with classical music, home to Mozart, Beethoven, and Strauss. Vienna's coffeehouse culture, opera houses, and museums attract millions of visitors annually.",
    investment: "Vienna's real estate market is characterized by stability and steady appreciation. The city's high quality of life and strong economy support property values. Districts near public transportation and cultural amenities are particularly sought after. The market offers opportunities for both residential and commercial investment.",
    highlights: ["Classical music heritage", "Imperial architecture", "Coffeehouse culture", "Most livable city rankings"]
  },
  "Rome": {
    description: "Italy's capital and a living museum of Western civilization, with nearly 3,000 years of history.",
    history: "Rome's history spans from its legendary founding in 753 BCE through the Roman Empire, Renaissance, and modern era. The city's archaeological sites, including the Colosseum and Roman Forum, attract millions of visitors. Rome serves as the capital of Italy and houses Vatican City, the center of the Catholic Church.",
    culture: "Rome's cultural identity is deeply rooted in its Italian heritage, with growing Romanian, Filipino, and Bangladeshi communities. The city's neighborhoods (rioni) each have distinct characters, from the ancient Trastevere to the elegant Parioli. Roman cuisine, art, and lifestyle influence global culture.",
    investment: "Rome's real estate market is complex, with historic center properties commanding premium prices due to preservation regulations. The market shows cyclical patterns tied to tourism and economic conditions. Investment opportunities exist in both historic renovations and modern developments in outer districts.",
    highlights: ["Ancient monuments", "Vatican City", "Renaissance art", "Culinary traditions"]
  },
  "Amsterdam": {
    description: "Netherlands' capital, famous for its artistic heritage, canal system, and progressive social policies.",
    history: "Amsterdam's Golden Age in the 17th century established it as a global trading center. The city's network of canals, built during this period, is now a UNESCO World Heritage site. Amsterdam has evolved into a modern European capital while preserving its historical character.",
    culture: "Amsterdam is one of Europe's most diverse cities, with significant Moroccan, Turkish, and Surinamese communities. The city is known for its tolerance, cycling culture, and world-class museums including the Rijksmuseum and Van Gogh Museum. The compact city center facilitates cultural exchange.",
    investment: "Amsterdam's real estate market is highly competitive, with limited supply driving prices upward. The city's strong economy, international appeal, and quality of life support property values. Canal-side properties command premium prices, while emerging neighborhoods offer growth potential.",
    highlights: ["Canal network", "Cycling culture", "Art museums", "Progressive policies"]
  },
  "Brussels": {
    description: "Belgium's capital and the de facto capital of the European Union, embodying European diversity and governance.",
    history: "Brussels has been a center of European politics since the Middle Ages. The city's Grand Place, a UNESCO World Heritage site, reflects its medieval prosperity. Today, Brussels hosts the European Union headquarters and NATO, making it a global diplomatic center.",
    culture: "Brussels is officially bilingual (French and Dutch) and hosts one of Europe's most diverse populations. Significant Moroccan, Turkish, and Congolese communities contribute to the city's multicultural character. The city is famous for chocolate, beer, and Art Nouveau architecture.",
    investment: "Brussels' real estate market benefits from EU institution presence and international corporate headquarters. The market shows steady growth, with particular strength in central districts and areas near European Quarter. The city offers more affordable entry points compared to other EU capitals.",
    highlights: ["EU headquarters", "Multicultural hub", "Art Nouveau architecture", "Culinary excellence"]
  },
  "Washington D.C.": {
    description: "The capital of the United States, center of American federal government and a symbol of democracy.",
    history: "Founded in 1790 as the nation's capital, Washington D.C. was designed by Pierre Charles L'Enfant with grand avenues and monumental architecture. The city has been at the center of American history, from the Civil War to the Civil Rights Movement. Today, it serves as the seat of all three branches of the federal government.",
    culture: "Washington D.C. is one of America's most diverse cities, with significant African American, Hispanic, and Asian communities. The city hosts world-class museums (many free), including the Smithsonian Institution. Neighborhoods like Adams Morgan and U Street showcase the city's multicultural character.",
    investment: "D.C.'s real estate market is supported by stable federal employment and a growing tech sector. The market shows resilience during economic downturns. Gentrification in historically African American neighborhoods has created both opportunities and challenges. Properties near Metro stations command premium prices.",
    highlights: ["Federal government center", "Free world-class museums", "Diverse neighborhoods", "Stable economy"]
  },
  "New York": {
    description: "America's largest city and global financial capital, epitomizing urban diversity and cultural dynamism.",
    history: "From its Dutch origins as New Amsterdam to becoming America's largest city, New York has been a gateway for immigrants and a center of commerce. The city's five boroughs each have distinct identities. New York's influence on finance, media, art, and fashion is unparalleled.",
    culture: "New York is arguably the world's most diverse city, with over 800 languages spoken. Significant Hispanic, Asian, African American, and European communities create a rich cultural mosaic. The city's neighborhoods—from Chinatown to Little Italy to Harlem—reflect this diversity. World-class museums, theaters, and restaurants make New York a global cultural capital.",
    investment: "New York's real estate market is one of the world's most expensive and competitive. Manhattan properties command premium prices, while Brooklyn and Queens offer growth opportunities. The market is cyclical but shows long-term appreciation. Strong rental demand from international professionals and students supports investment.",
    highlights: ["Global financial center", "Cultural diversity", "World-class arts scene", "Iconic skyline"]
  },
  "Toronto": {
    description: "Canada's largest city and financial capital, known for its multiculturalism and quality of life.",
    history: "Toronto evolved from a small colonial settlement to become Canada's economic engine. The city's growth accelerated in the 20th century, particularly after liberalized immigration policies in the 1960s. Today, Toronto is one of North America's most diverse and economically vibrant cities.",
    culture: "Toronto is one of the world's most multicultural cities, with over half of residents born outside Canada. Significant Asian, South Asian, African, and Middle Eastern communities create distinct neighborhoods like Chinatown, Little India, and Greektown. The city hosts major film festivals and has a thriving arts scene.",
    investment: "Toronto's real estate market has seen strong appreciation, driven by immigration, foreign investment, and limited supply. The market is cyclical but shows long-term growth. Condominiums dominate new construction. Government policies on foreign buyers and mortgage rules impact market dynamics.",
    highlights: ["Multicultural mosaic", "Financial center", "Film industry hub", "High quality of life"]
  },
  "Los Angeles": {
    description: "America's second-largest city, global entertainment capital, and a sprawling Pacific metropolis.",
    history: "Los Angeles grew from a Spanish mission to become America's second-largest city. The city's growth exploded in the 20th century, driven by the entertainment industry, aerospace, and international trade. L.A.'s car-centric development created a unique urban form of interconnected neighborhoods.",
    culture: "Los Angeles is extraordinarily diverse, with the largest Hispanic population of any U.S. city, plus significant Asian, African American, and Middle Eastern communities. The city's neighborhoods—from Beverly Hills to Koreatown to East L.A.—reflect this diversity. Hollywood's global influence makes L.A. synonymous with entertainment.",
    investment: "L.A.'s real estate market is expensive but varied, from beachfront properties to valley suburbs. The market shows strong long-term appreciation despite cyclical downturns. Tech industry growth in Silicon Beach and entertainment industry stability support property values. The market offers opportunities across various price segments.",
    highlights: ["Entertainment capital", "Beach lifestyle", "Tech growth", "Cultural diversity"]
  },
  "Chicago": {
    description: "America's third-largest city, architectural showcase, and Midwest economic powerhouse.",
    history: "Chicago rose from the ashes of the Great Fire of 1871 to become a center of innovation in architecture and urban planning. The city's strategic location made it a transportation and manufacturing hub. Chicago's history includes significant labor movements, jazz and blues music, and architectural innovation.",
    culture: "Chicago's neighborhoods reflect waves of immigration—Polish, Italian, Mexican, African American, and Asian communities have shaped the city's character. The city is famous for its architecture, deep-dish pizza, blues and jazz music, and vibrant theater scene. Chicago's museums and cultural institutions rival any global city.",
    investment: "Chicago's real estate market offers relative affordability compared to coastal cities while providing big-city amenities. The market shows steady appreciation in well-connected neighborhoods. Downtown condominiums and renovated industrial lofts attract young professionals. The market benefits from the city's strong economy and cultural offerings.",
    highlights: ["Architectural innovation", "Cultural institutions", "Affordable major city", "Transportation hub"]
  }
};

export default function CityDetail() {
  const { city: cityParam } = useParams<{ city: string }>();
  const [, setLocation] = useLocation();
  
  const cityName = cityParam ? decodeURIComponent(cityParam) : "";
  
  const { data: citySummary, isLoading: summaryLoading } = trpc.cities.getCitySummary.useQuery({ city: cityName });
  const { data: demographics, isLoading: demoLoading } = trpc.cities.getDemographics.useQuery({ city: cityName });
  const { data: infrastructure, isLoading: infraLoading } = trpc.cities.getInfrastructure.useQuery({ city: cityName });
  const { data: propertyPrices, isLoading: pricesLoading } = trpc.cities.getPropertyPrices.useQuery({ city: cityName });

  const info = cityInfo[cityName] || {
    description: "A vibrant city with rich cultural heritage and diverse communities.",
    history: "This city has a fascinating history spanning centuries.",
    culture: "The city's cultural landscape is shaped by diverse communities.",
    investment: "The real estate market shows potential for growth.",
    highlights: ["Cultural diversity", "Economic opportunities", "Quality of life"]
  };

  if (summaryLoading || demoLoading || infraLoading || pricesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading city data...</p>
        </div>
      </div>
    );
  }

  if (!citySummary || citySummary.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">City Not Found</h2>
          <p className="text-muted-foreground mb-4">No data available for {cityName}</p>
          <Button onClick={() => setLocation("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  const latestSummary = citySummary[citySummary.length - 1];
  const previousSummary = citySummary[citySummary.length - 2];

  // Calculate year-over-year changes
  const mosqueChange = previousSummary 
    ? ((latestSummary.mosquesCount - previousSummary.mosquesCount) / previousSummary.mosquesCount * 100).toFixed(1)
    : "0";
  const churchChange = previousSummary
    ? ((latestSummary.churchesCount - previousSummary.churchesCount) / previousSummary.churchesCount * 100).toFixed(1)
    : "0";
  const synagogueChange = previousSummary
    ? ((latestSummary.synagoguesCount - previousSummary.synagoguesCount) / previousSummary.synagoguesCount * 100).toFixed(1)
    : "0";

  // Prepare chart data
  const summaryChartData = citySummary.map(s => ({
    year: s.year,
    mosques: s.mosquesCount,
    churches: s.churchesCount,
    synagogues: s.synagoguesCount,
  }));

  // Aggregate demographics by community and year
  const demoByYear = demographics?.reduce((acc: Record<string, { year: number; community: string; population: number }>, d) => {
    const key = `${d.year}-${d.community}`;
    if (!acc[key]) {
      acc[key] = { year: d.year, community: d.community, population: 0 };
    }
    acc[key].population += d.population;
    return acc;
  }, {} as Record<string, { year: number; community: string; population: number }>);

  const demoChartData = Object.values(demoByYear || {}) as Array<{ year: number; community: string; population: number }>;
  const communities = Array.from(new Set(demoChartData.map(d => d.community)));

  // Top growing communities
  const communityGrowth = communities.map(community => {
    const communityData = demoChartData.filter(d => d.community === community).sort((a, b) => a.year - b.year);
    if (communityData.length < 2) return { community, growth: 0, latest: 0 };
    
    const earliest = communityData[0].population;
    const latest = communityData[communityData.length - 1].population;
    const growth = ((latest - earliest) / earliest * 100);
    
    return { community, growth, latest };
  }).sort((a, b) => b.growth - a.growth).slice(0, 5);

  // Property price trends
  const priceByYear = propertyPrices?.reduce((acc: Record<number, { year: number; avgPrice: number; count: number }>, p) => {
    if (!acc[p.year]) {
      acc[p.year] = { year: p.year, avgPrice: 0, count: 0 };
    }
    acc[p.year].avgPrice += p.averagePricePerSqm;
    acc[p.year].count += 1;
    return acc;
  }, {} as Record<number, { year: number; avgPrice: number; count: number }>) || {};

  const priceChartData = (Object.values(priceByYear) as Array<{ year: number; avgPrice: number; count: number }>).map(p => ({
    year: p.year,
    avgPrice: Math.round(p.avgPrice / p.count),
  })).sort((a, b) => a.year - b.year);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto py-6">
          <Button variant="ghost" onClick={() => setLocation("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold mb-2">{cityName}</h1>
          <p className="text-lg text-muted-foreground">{info.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {info.highlights.map((highlight, i) => (
              <Badge key={i} variant="secondary">{highlight}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>City Statistics</CardTitle>
                <CardDescription>Current year data for {cityName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Population</p>
                      <p className="text-2xl font-bold">{latestSummary.totalPopulation.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {latestSummary.foreignerPopulation.toLocaleString()} foreigners ({((latestSummary.foreignerPopulation / latestSummary.totalPopulation) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Building2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Religious Infrastructure</p>
                      <p className="text-2xl font-bold">
                        {latestSummary.mosquesCount + latestSummary.churchesCount + latestSummary.synagoguesCount}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {latestSummary.mosquesCount} mosques, {latestSummary.churchesCount} churches, {latestSummary.synagoguesCount} synagogues
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <MapPin className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Districts</p>
                      <p className="text-2xl font-bold">{infrastructure?.length || 0}</p>
                      <p className="text-sm text-muted-foreground mt-1">Diverse neighborhoods</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>History & Heritage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{info.history}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cultural Landscape</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{info.culture}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Growth (5-Year Trend)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={summaryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mosques" stroke="#3b82f6" name="Mosques" />
                    <Line type="monotone" dataKey="churches" stroke="#10b981" name="Churches" />
                    <Line type="monotone" dataKey="synagogues" stroke="#a855f7" name="Synagogues" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Growing Communities</CardTitle>
                <CardDescription>5-year population growth by community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communityGrowth.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{item.community}</p>
                        <p className="text-sm text-muted-foreground">Current population: {item.latest.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.growth > 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-500" />
                        )}
                        <span className={`text-lg font-bold ${item.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {item.growth > 0 ? '+' : ''}{item.growth.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Population Trends by Community</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={demoChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {communities.map((community, i) => {
                      const communityData = demoChartData.filter(d => d.community === community);
                      return (
                        <Line
                          key={community}
                          type="monotone"
                          dataKey="population"
                          data={communityData}
                          name={community}
                          stroke={`hsl(${(i * 360) / communities.length}, 70%, 50%)`}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-500/10 rounded">
                      <img src="/mosque-icon.png" alt="Mosque" className="h-6 w-6" />
                    </div>
                    <span>Mosques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{latestSummary.mosquesCount}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Number(mosqueChange) > 0 ? '+' : ''}{mosqueChange}% vs. last year
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-green-500/10 rounded">
                      <img src="/church-icon.png" alt="Church" className="h-6 w-6" />
                    </div>
                    <span>Churches</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{latestSummary.churchesCount}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Number(churchChange) > 0 ? '+' : ''}{churchChange}% vs. last year
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-500/10 rounded">
                      <img src="/synagogue-icon.png" alt="Synagogue" className="h-6 w-6" />
                    </div>
                    <span>Synagogues</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{latestSummary.synagoguesCount}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Number(synagogueChange) > 0 ? '+' : ''}{synagogueChange}% vs. last year
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Distribution</CardTitle>
                <CardDescription>Religious facilities across the city</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={summaryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mosques" fill="#3b82f6" name="Mosques" />
                    <Bar dataKey="churches" fill="#10b981" name="Churches" />
                    <Bar dataKey="synagogues" fill="#a855f7" name="Synagogues" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Tab */}
          <TabsContent value="investment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{info.investment}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Price Trends</CardTitle>
                <CardDescription>Average price per square meter over 5 years</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Line type="monotone" dataKey="avgPrice" stroke="#f59e0b" strokeWidth={2} name="Avg Price/sqm" />
                  </LineChart>
                </ResponsiveContainer>
                {priceChartData.length >= 2 && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">5-Year Appreciation</span>
                      <span className="text-lg font-bold text-green-500">
                        +{(((priceChartData[priceChartData.length - 1].avgPrice - priceChartData[0].avgPrice) / priceChartData[0].avgPrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Growing Communities</p>
                      <p className="text-sm text-muted-foreground">
                        Districts with rapidly growing immigrant communities often show strong appreciation potential.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Infrastructure Development</p>
                      <p className="text-sm text-muted-foreground">
                        Areas with new religious and cultural infrastructure indicate community establishment and stability.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-semibold">Location Strategy</p>
                      <p className="text-sm text-muted-foreground">
                        Properties near public transportation and community amenities tend to maintain value better.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button variant="outline" onClick={() => setLocation("/comparison")}>
            Compare with Other Cities
          </Button>
          <Button variant="outline" onClick={() => setLocation("/districts")}>
            Explore Districts
          </Button>
          <Button variant="outline" onClick={() => setLocation("/map")}>
            View on Map
          </Button>
        </div>
      </div>
    </div>
  );
}
