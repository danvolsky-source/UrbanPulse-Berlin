import { Card, CardContent } from "@/components/ui/card";
import { Scale, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Legal Terms</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-300">
            Last Updated: December 27, 2024
          </p>
        </div>

        {/* Critical Disclaimer */}
        <Card className="bg-orange-500/10 border-orange-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-orange-400 shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-orange-400 mb-2">Educational & Research Tool Only</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  UrbanPulse is provided as an educational and research tool for exploring urban data patterns. 
                  This platform <strong>does not provide financial advice, legal advice, or policy recommendations</strong>. 
                  By using this service, you acknowledge that all data and analysis are for informational purposes only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* 1. Acceptance of Terms */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                By accessing or using UrbanPulse (the "Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p className="text-slate-300 leading-relaxed">
                These Terms constitute a legally binding agreement between you and SkyMind ("we", "us", or "our"). 
                We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of modified Terms.
              </p>
            </CardContent>
          </Card>

          {/* 2. Educational Purpose */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Educational and Research Purpose</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                UrbanPulse is designed exclusively for <strong>educational and research purposes</strong>. 
                The Service presents observable correlations in publicly available urban data to facilitate academic inquiry and public policy discussion.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong className="text-cyan-400">The Service does not:</strong>
              </p>
              <ul className="space-y-2 text-slate-300 ml-6">
                <li>• Provide investment advice or financial recommendations</li>
                <li>• Offer legal counsel or regulatory compliance guidance</li>
                <li>• Make causal claims about demographic change and economic outcomes</li>
                <li>• Advocate for specific political positions or policy changes</li>
                <li>• Guarantee accuracy, completeness, or timeliness of data</li>
              </ul>
            </CardContent>
          </Card>

          {/* 3. Data Limitations */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Data Limitations and Disclaimers</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong className="text-orange-400">Correlation Does Not Imply Causation:</strong> All statistical relationships presented on this platform are observational correlations. 
                Multiple confounding variables, omitted variable bias, and reverse causality may explain observed patterns. 
                Users must not interpret correlations as causal relationships.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong className="text-orange-400">Data Accuracy:</strong> We aggregate data from public sources including Eurostat, OpenStreetMap, national statistical agencies, and government records. 
                We do not guarantee the accuracy, completeness, or timeliness of this data. 
                Reporting delays, definitional changes, and data gaps may affect results.
              </p>
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-orange-400">No Warranty:</strong> The Service is provided "as is" without warranties of any kind, express or implied. 
                We disclaim all warranties including merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </CardContent>
          </Card>

          {/* 4. Prohibited Uses */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Uses</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                You agree not to use the Service for:
              </p>
              <ul className="space-y-2 text-slate-300 ml-6">
                <li>• <strong>Discriminatory Practices:</strong> Housing discrimination, lending discrimination, or any practice violating fair housing laws</li>
                <li>• <strong>Financial Decisions:</strong> Using Service data as sole basis for investment, lending, or real estate transactions</li>
                <li>• <strong>Legal Proceedings:</strong> Submitting Service data as evidence in legal proceedings without independent verification</li>
                <li>• <strong>Misinformation:</strong> Misrepresenting correlations as causal relationships or making false claims about data</li>
                <li>• <strong>Automated Access:</strong> Scraping, crawling, or automated data extraction without written permission</li>
                <li>• <strong>Malicious Activity:</strong> Attempting to disrupt, damage, or gain unauthorized access to the Service</li>
              </ul>
            </CardContent>
          </Card>

          {/* 5. Intellectual Property */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                The Service, including its design, code, visualizations, and original analysis, is protected by copyright and other intellectual property laws. 
                You may not reproduce, distribute, modify, or create derivative works without written permission.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Underlying data is sourced from public datasets and remains subject to original licensing terms. 
                Citations and data sources are provided for transparency.
              </p>
            </CardContent>
          </Card>

          {/* 6. Limitation of Liability */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong className="text-orange-400">To the maximum extent permitted by law:</strong>
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                SkyMind and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="space-y-2 text-slate-300 ml-6">
                <li>• Your access to or use of (or inability to access or use) the Service</li>
                <li>• Any decisions made based on information obtained through the Service</li>
                <li>• Errors, inaccuracies, or omissions in data presented on the Service</li>
                <li>• Unauthorized access to or alteration of your data or transmissions</li>
                <li>• Any other matter relating to the Service</li>
              </ul>
            </CardContent>
          </Card>

          {/* 7. Indemnification */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Indemnification</h2>
              <p className="text-slate-300 leading-relaxed">
                You agree to indemnify, defend, and hold harmless SkyMind and its affiliates from any claims, liabilities, damages, losses, and expenses 
                (including reasonable attorneys' fees) arising out of or in any way connected with your access to or use of the Service, 
                your violation of these Terms, or your violation of any rights of another party.
              </p>
            </CardContent>
          </Card>

          {/* 8. Governing Law */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Governing Law and Jurisdiction</h2>
              <p className="text-slate-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Germany, without regard to its conflict of law provisions. 
                Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts located in Berlin, Germany.
              </p>
            </CardContent>
          </Card>

          {/* 9. Contact */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Contact Information</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                For questions about these Terms or the Service, please contact:
              </p>
              <p className="text-slate-300">
                <strong>Email:</strong> <a href="mailto:legal@sky-mind.com" className="text-cyan-400 hover:text-cyan-300">legal@sky-mind.com</a><br />
                <strong>Website:</strong> <a href="https://sky-mind.com" className="text-cyan-400 hover:text-cyan-300">https://sky-mind.com</a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-800">
          <Link href="/privacy">
            <button className="text-cyan-400 hover:text-cyan-300 text-sm underline">
              Privacy Policy →
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
