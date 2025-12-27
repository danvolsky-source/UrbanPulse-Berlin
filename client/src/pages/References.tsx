import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCitationsSorted, formatCitationAPA } from "@shared/citations";
import { Citation } from "@/components/Citation";
import { BookOpen, ExternalLink } from "lucide-react";

export default function References() {
  const citations = getAllCitationsSorted();
  
  // Group citations by type
  const officialSources = citations.filter(c => c.type === "official");
  const nationalSources = citations.filter(c => c.type === "national");
  const governmentSources = citations.filter(c => c.type === "government");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">References & Data Sources</h1>
          </div>
          <p className="text-lg text-slate-300 leading-relaxed">
            Complete bibliography of all data sources used in UrbanPulse. All data points in the platform link to these official sources for transparency and verification.
          </p>
          <p className="text-sm text-slate-400 mt-3">
            Citations are formatted in APA style. Click any source to visit the official dataset page.
          </p>
        </div>

        {/* Official Statistical Sources (Eurostat) */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="inline-flex items-center border rounded-full font-medium text-xs px-2 py-1 bg-green-500/10 border-green-500/30 text-green-400">
                Official
              </span>
              Official EU Statistical Sources
            </CardTitle>
            <p className="text-slate-400 text-sm mt-2">
              Data from Eurostat, the statistical office of the European Union, providing harmonized statistics across member states.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {officialSources.map((citation, index) => (
              <Citation key={citation.id} id={citation.id} number={index + 1} inline={false} />
            ))}
          </CardContent>
        </Card>

        {/* National Statistical Offices */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="inline-flex items-center border rounded-full font-medium text-xs px-2 py-1 bg-blue-500/10 border-blue-500/30 text-blue-400">
                National
              </span>
              National Statistical Offices
            </CardTitle>
            <p className="text-slate-400 text-sm mt-2">
              Official statistics from national statistical authorities, used for country-specific data not available at EU level.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {nationalSources.map((citation, index) => (
              <Citation 
                key={citation.id} 
                id={citation.id} 
                number={officialSources.length + index + 1} 
                inline={false} 
              />
            ))}
          </CardContent>
        </Card>

        {/* Government Records */}
        <Card className="bg-slate-900/50 border-slate-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="inline-flex items-center border rounded-full font-medium text-xs px-2 py-1 bg-purple-500/10 border-purple-500/30 text-purple-400">
                Government
              </span>
              Government Policy Records
            </CardTitle>
            <p className="text-slate-400 text-sm mt-2">
              Official government documents, legislative records, and policy announcements used for policy analysis.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {governmentSources.map((citation, index) => (
              <Citation 
                key={citation.id} 
                id={citation.id} 
                number={officialSources.length + nationalSources.length + index + 1} 
                inline={false} 
              />
            ))}
          </CardContent>
        </Card>

        {/* Citation Guidelines */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Citation Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div>
              <h3 className="text-white font-semibold mb-2">How to Use These References</h3>
              <p className="text-sm leading-relaxed">
                Throughout the UrbanPulse platform, you'll see superscript numbers like <sup className="text-cyan-400 font-semibold">[1]</sup> next to data points. 
                Hover over these citations to see a preview of the source, or click to visit the official dataset page directly.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Data Granularity Notice</h3>
              <p className="text-sm leading-relaxed">
                Some indicators (e.g., unemployment) are only available at regional (NUTS 2/3) level, not city-specific. 
                See the <a href="/nuts-mapping" className="text-cyan-400 hover:text-cyan-300 underline">NUTS Mapping Reference</a> for complete city-region correspondence.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Citing UrbanPulse</h3>
              <p className="text-sm leading-relaxed mb-2">
                If you use data from UrbanPulse in your research or publications, please cite both UrbanPulse and the original data sources:
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded p-3 text-xs font-mono">
                <p>UrbanPulse. (2024). Urban Demographic Change × Housing Market Dynamics. Retrieved December 27, 2024, from https://urbanpulse.manus.space</p>
                <p className="mt-2 text-slate-500">+ Original data source citations (see above)</p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Data Access & Licensing</h3>
              <p className="text-sm leading-relaxed">
                All Eurostat data is freely available under the <a href="https://ec.europa.eu/eurostat/about-us/policies/copyright" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1">
                  Eurostat Copyright Policy <ExternalLink className="w-3 h-3" />
                </a>. 
                National statistical offices have their own licensing terms - please check individual source pages for details.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Contact for Data Inquiries</h3>
              <p className="text-sm leading-relaxed">
                For questions about data sources, methodology, or access: <a href="mailto:research@sky-mind.com" className="text-cyan-400 hover:text-cyan-300 underline">research@sky-mind.com</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
