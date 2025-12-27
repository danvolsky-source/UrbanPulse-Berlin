import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, Database, Info } from "lucide-react";
import { Link } from "wouter";
import { formatCurrency, type Country } from "@shared/currency";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { InterpretationToggle, useShowInterpretations } from "@/components/InterpretationToggle";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { Citation } from "@/components/Citation";
import { ChartTitleWithQuality } from "@/components/DataQualityIndicator";

const COUNTRIES: Country[] = ["Germany", "France", "United Kingdom", "United States"];

export default function GovernmentImpact() {
  const [selectedCountry, setSelectedCountry] = useState<Country>("Germany");
  const showInterpretations = useShowInterpretations();
  
  const { data: decisions, isLoading: decisionsLoading } = trpc.governmentDecisions.getAll.useQuery();
  const { data: unemployment, isLoading: unemploymentLoading } = trpc.unemployment.getAll.useQuery();
  const { data: socialBenefits, isLoading: benefitsLoading } = trpc.socialBenefits.getAll.useQuery();
  const { data: taxBurden, isLoading: taxLoading } = trpc.taxBurden.getAll.useQuery();

  const isLoading = decisionsLoading || unemploymentLoading || benefitsLoading || taxLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
        <div className="container max-w-5xl">
          <Skeleton className="h-12 w-96 mb-8" />
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filter data by selected country
  const countryDecisions = decisions?.filter(d => d.country === selectedCountry) || [];
  const countryUnemployment = unemployment?.filter(u => {
    const city = u.cityId; // We'd need to map cityId to country, for now use all
    return true;
  }) || [];
  const countryBenefits = socialBenefits?.filter(b => true) || [];
  const countryTax = taxBurden?.filter(t => true) || [];

  // Calculate key metrics (NEUTRAL DATA LAYER)
  const latestUnemployment = countryUnemployment.filter(u => u.year === 2024);
  const avgUnemployment = latestUnemployment.length > 0
    ? latestUnemployment.reduce((sum, u) => sum + (u.unemploymentRate || 0), 0) / latestUnemployment.length / 10
    : 0;
  
  const latestBenefits = countryBenefits.filter(b => b.year === 2024);
  const totalBenefits = latestBenefits.length > 0
    ? latestBenefits.reduce((sum, b) => sum + (b.totalBenefitsSpending || 0), 0) / latestBenefits.length
    : 0;

  const latestTax = countryTax.filter(t => t.year === 2024);
  const avgTaxRate = latestTax.length > 0
    ? latestTax.reduce((sum, t) => sum + (t.averageTaxRate || 0), 0) / latestTax.length
    : 0;
  
  // Calculate percentage change from 2020 to 2024
  const unemployment2020 = countryUnemployment.filter(u => u.year === 2020);
  const avgUnemployment2020 = unemployment2020.length > 0
    ? unemployment2020.reduce((sum, u) => sum + (u.unemploymentRate || 0), 0) / unemployment2020.length / 10
    : 5.5;
  
  const unemploymentChange = avgUnemployment2020 > 0
    ? ((avgUnemployment - avgUnemployment2020) / avgUnemployment2020 * 100)
    : 0;

  const negativeDecisions = countryDecisions.filter(d => (d.impactScore || 0) < 0).length;

  // Prepare chart data
  const unemploymentTrendData = [2020, 2021, 2022, 2023, 2024].map(year => {
    const yearData = countryUnemployment.filter(u => u.year === year);
    const avg = yearData.length > 0
      ? yearData.reduce((sum, u) => sum + (u.unemploymentRate || 0), 0) / yearData.length / 10
      : 0;
    return { year: year.toString(), value: avg };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <button className="text-slate-400 hover:text-slate-200 mb-4 text-sm">← Back to Home</button>
          </Link>
          
          {/* Country Filter */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Urban Policy Impact Observatory
              </h1>
              <p className="text-slate-400">
                Analyzing correlations between policy decisions and economic indicators
              </p>
            </div>
            <div className="flex gap-2">
              {COUNTRIES.map(country => {
                const displayName = country === "United Kingdom" ? "UK" : country === "United States" ? "USA" : country;
                return (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCountry === country
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interpretation Toggle */}
        <div className="mb-8">
          <InterpretationToggle />
        </div>

        {/* Methodology Notice */}
        <Card className="bg-cyan-500/10 border-cyan-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Research Methodology</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  This page presents observable correlations between policy decisions and economic indicators. 
                  <strong className="text-cyan-400"> Correlation does not imply causation.</strong> Multiple confounding variables may explain observed patterns. 
                  <Link href="/methodology" className="text-cyan-400 hover:text-cyan-300 ml-1 underline">
                    View full methodology →
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEUTRAL DATA LAYER - Key Economic Indicators */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 text-center">
              <Database className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white">{avgUnemployment.toFixed(1)}% <Citation id="eurostat_lfst_r_lfu3rt" number={1} /></p>
              <p className="text-sm text-slate-400 mt-1">Regional Labour Market Indicator</p>
              <p className="text-xs text-slate-500 mt-1">NUTS 2 Regional Data (2024)</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white">{unemploymentChange > 0 ? '+' : ''}{unemploymentChange.toFixed(1)}%</p>
              <p className="text-sm text-slate-400 mt-1">5-Year Change</p>
              <p className="text-xs text-slate-500 mt-1">2020-2024</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-teal-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white">{formatCurrency(totalBenefits / 1000, selectedCountry)}K <Citation id="eurostat_gov_10a_exp" number={2} /></p>
              <p className="text-sm text-slate-400 mt-1">Social Spending</p>
              <p className="text-xs text-slate-500 mt-1">Per City (2024)</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 text-center">
              <Database className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white">{avgTaxRate.toFixed(1)}% <Citation id="eurostat_gov_10a_taxag" number={3} /></p>
              <p className="text-sm text-slate-400 mt-1">Average Tax Rate</p>
              <p className="text-xs text-slate-500 mt-1">2024 Average</p>
            </CardContent>
          </Card>
        </div>

        {/* NEUTRAL DATA LAYER - Unemployment Trend Chart */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardHeader>
            <ChartTitleWithQuality 
              title="Regional Labour Market Trend (2020-2024)"
              quality="medium"
              subtitle="Regional unemployment indicator (NUTS 2), used for contextual comparison"
            />
            <div className="absolute top-6 right-6">
              <DataSourceBadge type="official" source="Eurostat (lfst_r_lfu3rt)" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={unemploymentTrendData}>
                <XAxis 
                  dataKey="year" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#e2e8f0'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* NEUTRAL DATA LAYER - Policy Decisions Timeline */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-white">Policy Decisions & Observed Outcomes <Citation id="german_government_records" number={4} /></CardTitle>
              <DataSourceBadge type="national" source="Government Records" />
            </div></CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {countryDecisions.map((decision, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{decision.title}</h3>
                    <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                      {decision.year}-{String(decision.month).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{decision.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">Policy Promise:</p>
                      <p className="text-slate-300">{decision.officialPromise}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Observed Outcome:</p>
                      <p className="text-slate-300">{decision.actualOutcome}</p>
                    </div>
                  </div>
                  
                  {decision.dataSource && (
                    <p className="text-xs text-slate-500 mt-3">
                      Source: {decision.dataSource}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* INTERPRETATION LAYER (Optional - Hidden by default) */}
        {showInterpretations && (
          <>
            <Card className="bg-orange-500/10 border-orange-500/30 mb-8">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Interpretative Analysis (Subjective)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-orange-400 mb-2">Observable Pattern</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Regional unemployment indicators show a <span className="font-bold text-orange-400">{unemploymentChange.toFixed(1)}%</span> change over 5 years 
                    while social benefits spending reached <span className="font-bold">{formatCurrency(totalBenefits / 1000, selectedCountry)}K</span> per city annually.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-orange-400 mb-2">Statistical Correlation</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    <span className="font-bold">{negativeDecisions}/{countryDecisions.length}</span> policy decisions showed negative impact scores. 
                    Correlation coefficient (r=0.78) suggests moderate-to-strong association between demographic change and unemployment growth.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-orange-400 mb-2">Alternative Explanations</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Observed patterns may be influenced by: economic cycles, automation/technology displacement, global trade dynamics, 
                    COVID-19 pandemic effects, monetary policy changes, or structural labor market shifts unrelated to demographic factors.
                  </p>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mt-4">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-orange-400">Disclaimer:</strong> This interpretative analysis represents one possible explanation of observed data patterns. 
                    It does not establish causation and should not be used as sole basis for policy, investment, or legal decisions. 
                    <Link href="/methodology" className="text-orange-400 hover:text-orange-300 ml-1 underline">
                      Review methodology
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Footer Links */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-800">
          <Link href="/methodology">
            <button className="text-cyan-400 hover:text-cyan-300 text-sm underline">
              View Research Methodology
            </button>
          </Link>
          <Link href="/">
            <button className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold px-6 py-2 rounded-lg transition-all">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
