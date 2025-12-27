import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ExternalLink, Users, DollarSign, AlertTriangle, BookOpen, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img 
                src="/urbanpulse-logo.png" 
                alt="UrbanPulse" 
                className="h-20 cursor-pointer drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              />
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-slate-300 hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <Link href="/methodology" className="text-slate-300 hover:text-cyan-400 transition-colors">
                Methodology
              </Link>
              <Link href="/about" className="text-cyan-400 font-medium">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
            <BookOpen className="w-3 h-3 mr-1" />
            About UrbanPulse
          </Badge>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            About This Research Platform
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            UrbanPulse is an independent research platform exploring correlations between urban demographic patterns and housing market dynamics across major European and North American cities.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-8 bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Mission & Purpose
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              UrbanPulse was created to provide transparent, data-driven insights into urban development patterns for researchers, policymakers, and the public. Our platform aggregates publicly available demographic, economic, and housing market data to help users understand complex urban dynamics.
            </p>
            <p>
              <strong className="text-white">Core Principles:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Transparency:</strong> All data sources, methodologies, and limitations are fully documented</li>
              <li><strong>Neutrality:</strong> We present correlations, not causation, and acknowledge alternative explanations</li>
              <li><strong>Accessibility:</strong> Research-grade data visualization made available to the public free of charge</li>
              <li><strong>Academic Rigor:</strong> Following established statistical methods and data science best practices</li>
            </ul>
          </CardContent>
        </Card>

        {/* Research Team */}
        <Card className="mb-8 bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Research Team
            </CardTitle>
            <CardDescription className="text-slate-400">
              UrbanPulse is developed and maintained by Sky-Mind, an independent research organization
            </CardDescription>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Development Team</h3>
              <p>
                The platform is built by a multidisciplinary team combining expertise in urban studies, data science, and software engineering. Our team includes specialists in:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Urban demography and migration studies</li>
                <li>Housing economics and real estate analytics</li>
                <li>Statistical modeling and data visualization</li>
                <li>Geographic information systems (GIS)</li>
                <li>Full-stack web development</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Academic Affiliations</h3>
              <p>
                While UrbanPulse operates independently, team members have backgrounds from institutions including technical universities and research centers specializing in urban planning and demographic research. However, this platform does not represent the official position of any academic institution.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Contact for Academic Collaboration</h3>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                For research partnerships, data access requests, or academic inquiries:
                <a href="mailto:research@sky-mind.com" className="text-cyan-400 hover:text-cyan-300 underline">
                  research@sky-mind.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Funding Sources */}
        <Card className="mb-8 bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Funding & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Financial Independence</h3>
              <p>
                UrbanPulse is self-funded by Sky-Mind and does not receive grants, sponsorships, or financial support from government agencies, political organizations, real estate companies, or advocacy groups. This financial independence ensures our research remains unbiased and free from external influence.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Operational Model</h3>
              <p>
                The platform is provided <strong>free of charge</strong> for non-commercial educational and research purposes. We do not sell data, accept advertising, or monetize user information. All operational costs are covered internally by Sky-Mind.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Data Sources</h3>
              <p>
                All data used in UrbanPulse is sourced from publicly available government statistics and open data repositories. We do not purchase proprietary datasets or receive data from private entities. See our <Link href="/references" className="text-cyan-400 hover:text-cyan-300 underline">References</Link> page for complete source documentation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Conflicts of Interest */}
        <Card className="mb-8 bg-slate-900/50 border-yellow-500/20">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Conflicts of Interest & Disclosures
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">No Financial Conflicts</h3>
              <p>
                To the best of our knowledge, no member of the UrbanPulse research team has financial interests in real estate development, property management, migration services, or political consulting that could bias the analysis presented on this platform.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Political Neutrality</h3>
              <p>
                UrbanPulse is not affiliated with any political party, advocacy organization, or lobbying group. We do not endorse policy positions or political candidates. Our platform presents data and correlations for educational purposes, not to advance a political agenda.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Potential Biases</h3>
              <p>
                We acknowledge that all research involves subjective choices in methodology, data selection, and presentation. While we strive for objectivity, users should be aware of potential biases including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li><strong>Selection bias:</strong> Focus on 15 major cities may not represent smaller urban areas</li>
                <li><strong>Temporal bias:</strong> 10-year window (2015-2024) may not capture longer-term trends</li>
                <li><strong>Indicator bias:</strong> Choice of metrics (unemployment, property prices) reflects research priorities</li>
                <li><strong>Framing bias:</strong> Despite neutral language, data presentation can influence interpretation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Reporting Concerns</h3>
              <p className="flex items-center gap-2">
                If you believe you have identified a conflict of interest or bias in our research, please contact:
                <a href="mailto:info@sky-mind.com" className="text-yellow-400 hover:text-yellow-300 underline">
                  info@sky-mind.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Peer Review Status */}
        <Card className="mb-8 bg-slate-900/50 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Peer Review & Academic Status
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="font-semibold text-orange-400 mb-2">⚠️ Important Disclosure</p>
              <p>
                <strong>This platform has not undergone formal peer review.</strong> The data, methodologies, and analyses presented on UrbanPulse have not been evaluated by independent academic reviewers or published in peer-reviewed journals.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Verification & Reproducibility</h3>
              <p>
                While not peer-reviewed, we maintain transparency to enable independent verification:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>All data sources are cited with direct links to original datasets</li>
                <li>Statistical methods are documented in our <Link href="/methodology" className="text-cyan-400 hover:text-cyan-300 underline">Methodology</Link> page</li>
                <li>Data processing scripts are available in the project repository</li>
                <li>Users can contact us to request raw data or clarification on methods</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Citation Guidelines</h3>
              <p>
                If you use UrbanPulse data or insights in academic work, please cite as:
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded p-3 mt-2 font-mono text-sm">
                Sky-Mind Research Team. (2025). <em>UrbanPulse: Urban Development Patterns and Housing Market Dynamics</em>. Retrieved from https://urbanpulse.sky-mind.com
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Note: As an unreviewed web resource, UrbanPulse should be used as supplementary material, not as a primary source for academic claims.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Future Plans</h3>
              <p>
                We are exploring opportunities to submit findings from UrbanPulse to peer-reviewed urban studies and demographic research journals. Users will be notified if any components of this platform undergo formal peer review.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legal & Ethical Framework */}
        <Card className="mb-8 bg-slate-900/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400">Legal & Ethical Framework</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              UrbanPulse operates under the following legal and ethical commitments:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>GDPR Compliance:</strong> Full compliance with EU data protection regulations. See our <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">Privacy Policy</Link>.
              </li>
              <li>
                <strong>Terms of Service:</strong> Clear prohibited uses and limitations of liability. See <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 underline">Terms</Link>.
              </li>
              <li>
                <strong>Data Ethics:</strong> We do not collect, process, or display personally identifiable information (PII). All demographic data is aggregated at city or district level.
              </li>
              <li>
                <strong>Responsible Use:</strong> This platform is intended for educational and research purposes only. We explicitly prohibit use for discrimination, targeted advertising, or political manipulation.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-400">Get in Touch</CardTitle>
            <CardDescription className="text-slate-300">
              We welcome feedback, collaboration proposals, and questions from researchers and the public
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  General Inquiries
                </h3>
                <a href="mailto:info@sky-mind.com" className="text-cyan-400 hover:text-cyan-300">
                  info@sky-mind.com
                </a>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Research Collaboration
                </h3>
                <a href="mailto:research@sky-mind.com" className="text-cyan-400 hover:text-cyan-300">
                  research@sky-mind.com
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                Website
              </h3>
              <a href="https://sky-mind.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                https://sky-mind.com
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/20 mt-20">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© 2024 Sky-Mind. Research & Educational Tool.</p>
            <div className="flex gap-6">
              <Link href="/methodology" className="hover:text-cyan-400 transition-colors">Methodology</Link>
              <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
              <Link href="/references" className="hover:text-cyan-400 transition-colors">References</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
