import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart3, Database, TrendingUp, BookOpen, Scale } from "lucide-react";
import { Link } from "wouter";

export default function Methodology() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Research Methodology</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            UrbanPulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Methodology</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Transparency in data collection, analysis methods, and interpretation limitations
          </p>
        </div>

        {/* Critical Disclaimer - Correlation ≠ Causation */}
        <Card className="bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-red-500/10 border-orange-500/30 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/20 rounded-lg shrink-0">
                <AlertTriangle className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Correlation Does Not Imply Causation</h2>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  This platform presents <strong>observable statistical correlations</strong> between demographic changes, policy decisions, and housing market dynamics. 
                  These correlations do not establish causation. Multiple confounding variables, unmeasured factors, and alternative explanations may account for observed patterns.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Users should interpret all findings as <strong>exploratory observations</strong> requiring further investigation, not as definitive causal relationships.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Hypotheses */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Alternative Hypotheses for Observed Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              Property price increases and demographic changes may be influenced by numerous factors beyond those presented in this analysis. 
              Alternative explanations include, but are not limited to:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Urban Planning & Zoning</h3>
                <p className="text-sm text-slate-400">
                  Changes in zoning laws, building permits, density restrictions, and land-use regulations directly impact housing supply and prices.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Monetary Policy</h3>
                <p className="text-sm text-slate-400">
                  Interest rate changes, mortgage availability, quantitative easing, and central bank policies significantly affect housing affordability.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Construction Dynamics</h3>
                <p className="text-sm text-slate-400">
                  Construction delays, material costs, labor shortages, and supply chain disruptions constrain housing supply independently of demographic factors.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Investment Activity</h3>
                <p className="text-sm text-slate-400">
                  Institutional investors, foreign capital inflows, speculative buying, and short-term rental markets (e.g., Airbnb) drive price dynamics.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Economic Growth</h3>
                <p className="text-sm text-slate-400">
                  Local employment growth, wage increases, industry clustering, and economic development attract residents and raise housing demand.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Infrastructure Development</h3>
                <p className="text-sm text-slate-400">
                  New transit lines, schools, parks, and amenities increase neighborhood desirability and property values independently of demographic composition.
                </p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mt-4">
              Any observed correlation between demographic indicators and housing prices may be partially or entirely explained by these confounding variables. 
              This platform does not control for these factors, and users should exercise caution when interpreting results.
            </p>
          </CardContent>
        </Card>

        {/* Data Granularity Disclaimer */}
        <Card className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-blue-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg shrink-0">
                <Scale className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-3">Data Granularity & Regional Proxies</h2>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Where city-level data is unavailable, regional (NUTS 2/3) or national indicators are used as contextual proxies and are not interpreted as direct city measurements.</strong>
                </p>
                <p className="text-slate-300 leading-relaxed mt-3">
                  For example, unemployment data is reported at NUTS 2 regional level (e.g., Berlin region DE30) rather than city-specific measurements. 
                  These regional indicators provide context for urban trends but do not represent precise city-level conditions.
                </p>
                <p className="text-slate-300 leading-relaxed mt-3">
                  <strong>City-to-region mapping follows Eurostat NUTS 2021 classification and administrative correspondence.</strong> 
                  See the <a href="/nuts-mapping" className="text-cyan-400 hover:text-cyan-300 underline">NUTS Mapping Reference</a> for complete city-region correspondence tables.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <Database className="w-6 h-6 text-purple-400" />
              Data Sources & Collection Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              UrbanPulse aggregates data from multiple public sources. Data quality, completeness, and accuracy vary by source and jurisdiction.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Data Category</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Primary Sources</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Update Frequency</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 font-medium">Demographics</td>
                    <td className="py-3 px-4">Eurostat, National Census Bureaus, Municipal Statistics Offices</td>
                    <td className="py-3 px-4">Annual / Biannual</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 font-medium">Property Prices</td>
                    <td className="py-3 px-4">National Real Estate Registries, Municipal Valuation Offices</td>
                    <td className="py-3 px-4">Quarterly</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 font-medium">Infrastructure</td>
                    <td className="py-3 px-4">OpenStreetMap, Municipal Planning Departments</td>
                    <td className="py-3 px-4">Continuous (OSM)</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 font-medium">Economic Indicators</td>
                    <td className="py-3 px-4">National Statistical Agencies, OECD, World Bank</td>
                    <td className="py-3 px-4">Quarterly / Annual</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-3 px-4 font-medium">Policy Decisions</td>
                    <td className="py-3 px-4">Government Gazettes, Legislative Records, News Archives</td>
                    <td className="py-3 px-4">As Published</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 mt-4">
              <h3 className="text-lg font-semibold text-orange-400 mb-2">Data Limitations</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• <strong>Reporting Delays:</strong> Official statistics may lag actual conditions by 6-24 months</li>
                <li>• <strong>Geographic Granularity:</strong> District-level data may mask intra-district variation</li>
                <li>• <strong>Definitional Changes:</strong> Statistical definitions and methodologies change over time, affecting comparability</li>
                <li>• <strong>Missing Data:</strong> Not all indicators are available for all cities and time periods</li>
                <li>• <strong>Self-Reported Data:</strong> Census and survey data rely on voluntary reporting and may contain biases</li>
                <li>• <strong>Community Categories:</strong> Community categories used in the platform are analytical groupings derived from multiple secondary sources and are not official Eurostat classifications</li>
                <li>• <strong>GDP as Proxy:</strong> GDP per capita is used as an economic proxy and does not represent individual income distribution</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Statistical Methods */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <BarChart3 className="w-6 h-6 text-teal-400" />
              Statistical Methods & Confidence Intervals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              Correlation coefficients presented on this platform are calculated using Pearson's r for linear relationships between variables. 
              These coefficients measure the strength of association but do not imply causation.
            </p>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-teal-400 mb-3">Interpreting Correlation Coefficients</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="font-mono bg-slate-700 px-2 py-1 rounded">r = 0.0 - 0.3</span>
                  <span>Weak or negligible correlation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono bg-slate-700 px-2 py-1 rounded">r = 0.3 - 0.7</span>
                  <span>Moderate correlation</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono bg-slate-700 px-2 py-1 rounded">r = 0.7 - 1.0</span>
                  <span>Strong correlation</span>
                </div>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed">
              <strong>Important:</strong> Even strong correlations (r &gt; 0.7) do not establish causation. 
              Spurious correlations, omitted variable bias, and reverse causality may produce misleading results. 
              Users should treat all correlations as hypotheses requiring further investigation through controlled studies.
            </p>
          </CardContent>
        </Card>

        {/* Educational Purpose Statement */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <Scale className="w-6 h-6 text-cyan-400" />
              Educational & Research Purpose
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              UrbanPulse is designed as an <strong>educational and research tool</strong> for exploring relationships between urban demographic change, policy decisions, and housing market dynamics. 
              The platform is intended for:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">✓ Appropriate Uses</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>• Academic research and hypothesis generation</li>
                  <li>• Urban planning education and training</li>
                  <li>• Exploratory data analysis for further study</li>
                  <li>• Public policy discussion and debate</li>
                </ul>
              </div>

              <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">✗ Inappropriate Uses</h3>
                <ul className="space-y-1 text-sm text-slate-400">
                  <li>• Sole basis for investment decisions</li>
                  <li>• Legal evidence or regulatory compliance</li>
                  <li>• Discriminatory housing practices</li>
                  <li>• Political advocacy without independent verification</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mt-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                <strong className="text-orange-400">Disclaimer:</strong> This platform is not financial advice, legal advice, or policy recommendation. 
                Users should consult qualified professionals (financial advisors, legal counsel, urban planners) before making decisions based on information presented here. 
                The creators of UrbanPulse assume no liability for decisions made using this tool.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Transparency */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Transparency & Accountability</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              UrbanPulse is committed to transparency in data sourcing, methodology, and limitations. 
              We welcome feedback, corrections, and suggestions for improvement from researchers, policymakers, and the public.
            </p>
            <p className="text-slate-400 text-sm">
              For questions about methodology, data sources, or to report errors, please contact: 
              <a href="mailto:research@sky-mind.com" className="text-cyan-400 hover:text-cyan-300 ml-1">research@sky-mind.com</a>
            </p>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <button className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
