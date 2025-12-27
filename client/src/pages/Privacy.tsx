import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, UserCheck } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">GDPR Compliant</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-300">
            Last Updated: December 27, 2024
          </p>
        </div>

        {/* GDPR Notice */}
        <Card className="bg-cyan-500/10 border-cyan-500/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-cyan-400 mb-2">Your Privacy Rights (GDPR)</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  UrbanPulse is committed to protecting your personal data in accordance with the EU General Data Protection Regulation (GDPR). 
                  You have the right to access, rectify, erase, restrict processing, object to processing, and port your data. 
                  Contact us at <a href="mailto:privacy@sky-mind.com" className="text-cyan-400 hover:text-cyan-300 underline">privacy@sky-mind.com</a> to exercise your rights.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Content */}
        <div className="space-y-8">
          {/* 1. Data Controller */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">1. Data Controller</h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                The data controller responsible for your personal data is:
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-300">
                  <strong>SkyMind</strong><br />
                  Email: <a href="mailto:privacy@sky-mind.com" className="text-cyan-400 hover:text-cyan-300">privacy@sky-mind.com</a><br />
                  Website: <a href="https://sky-mind.com" className="text-cyan-400 hover:text-cyan-300">https://sky-mind.com</a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Data We Collect */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">2. Data We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">2.1 Account Information</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    When you create an account using OAuth (Google or Manus), we collect:
                  </p>
                  <ul className="space-y-1 text-slate-300 text-sm ml-6">
                    <li>• Name and email address (from OAuth provider)</li>
                    <li>• Profile picture (optional)</li>
                    <li>• OAuth provider identifier</li>
                    <li>• Account creation timestamp</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">2.2 Usage Data</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    We automatically collect information about your interaction with the Service:
                  </p>
                  <ul className="space-y-1 text-slate-300 text-sm ml-6">
                    <li>• Pages viewed and features used</li>
                    <li>• Cities and districts browsed</li>
                    <li>• Saved cities and preferences</li>
                    <li>• Interpretation toggle settings</li>
                    <li>• Session duration and timestamps</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">2.3 Technical Data</h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    We collect technical information to ensure Service functionality:
                  </p>
                  <ul className="space-y-1 text-slate-300 text-sm ml-6">
                    <li>• IP address (anonymized after 7 days)</li>
                    <li>• Browser type and version</li>
                    <li>• Device type and operating system</li>
                    <li>• Referrer URL</li>
                    <li>• Cookies and local storage data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">2.4 Data We Do NOT Collect</h3>
                  <ul className="space-y-1 text-slate-300 text-sm ml-6">
                    <li>• Financial information or payment details</li>
                    <li>• Precise geolocation data</li>
                    <li>• Biometric data</li>
                    <li>• Health or medical information</li>
                    <li>• Political opinions or religious beliefs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Legal Basis for Processing */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-teal-400" />
                <h2 className="text-2xl font-bold text-white">3. Legal Basis for Processing (GDPR)</h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                We process your personal data under the following legal bases:
              </p>
              
              <div className="space-y-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-cyan-400 mb-2">Contract Performance (Art. 6(1)(b) GDPR)</h3>
                  <p className="text-slate-300 text-sm">
                    Processing necessary to provide the Service you requested (account creation, saved cities, preferences)
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-cyan-400 mb-2">Legitimate Interests (Art. 6(1)(f) GDPR)</h3>
                  <p className="text-slate-300 text-sm">
                    Analytics, security monitoring, and service improvement (balanced against your privacy rights)
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-cyan-400 mb-2">Consent (Art. 6(1)(a) GDPR)</h3>
                  <p className="text-slate-300 text-sm">
                    Optional features like email notifications (you can withdraw consent at any time)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. How We Use Your Data */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-orange-400" />
                <h2 className="text-2xl font-bold text-white">4. How We Use Your Data</h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use your personal data for the following purposes:
              </p>
              <ul className="space-y-2 text-slate-300 ml-6">
                <li>• <strong>Service Provision:</strong> Authenticate users, save preferences, and provide personalized features</li>
                <li>• <strong>Analytics:</strong> Understand usage patterns to improve the Service (anonymized data)</li>
                <li>• <strong>Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
                <li>• <strong>Communication:</strong> Send service updates and respond to inquiries (with your consent)</li>
                <li>• <strong>Legal Compliance:</strong> Comply with legal obligations and enforce our Terms of Service</li>
              </ul>
            </CardContent>
          </Card>

          {/* 5. Data Sharing */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing and Third Parties</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                <strong className="text-cyan-400">We do not sell your personal data.</strong> We may share data with:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Service Providers</h3>
                  <ul className="space-y-1 text-slate-300 text-sm ml-6">
                    <li>• <strong>Hosting:</strong> Manus Platform (data stored in EU/Singapore)</li>
                    <li>• <strong>Authentication:</strong> Google OAuth (subject to Google Privacy Policy)</li>
                    <li>• <strong>Analytics:</strong> Self-hosted analytics (no third-party tracking)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Legal Requirements</h3>
                  <p className="text-slate-300 text-sm">
                    We may disclose data if required by law, court order, or government request, or to protect our rights and safety.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Data Retention */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We retain your personal data only as long as necessary for the purposes outlined in this policy:
              </p>
              <ul className="space-y-2 text-slate-300 ml-6">
                <li>• <strong>Account Data:</strong> Until you delete your account</li>
                <li>• <strong>Usage Logs:</strong> 90 days (anonymized after 7 days)</li>
                <li>• <strong>IP Addresses:</strong> Anonymized after 7 days</li>
                <li>• <strong>Backup Data:</strong> 30 days after deletion request</li>
              </ul>
            </CardContent>
          </Card>

          {/* 7. Your Rights (GDPR) */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Your Privacy Rights (GDPR)</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Under GDPR, you have the following rights:
              </p>
              
              <div className="space-y-3">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-cyan-400 mb-1">Right to Access (Art. 15)</h3>
                  <p className="text-slate-300 text-sm">Request a copy of your personal data</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-cyan-400 mb-1">Right to Rectification (Art. 16)</h3>
                  <p className="text-slate-300 text-sm">Correct inaccurate or incomplete data</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-cyan-400 mb-1">Right to Erasure (Art. 17)</h3>
                  <p className="text-slate-300 text-sm">Request deletion of your personal data ("right to be forgotten")</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-cyan-400 mb-1">Right to Restrict Processing (Art. 18)</h3>
                  <p className="text-slate-300 text-sm">Limit how we use your data</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-cyan-400 mb-1">Right to Data Portability (Art. 20)</h3>
                  <p className="text-slate-300 text-sm">Receive your data in machine-readable format</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-cyan-400 mb-1">Right to Object (Art. 21)</h3>
                  <p className="text-slate-300 text-sm">Object to processing based on legitimate interests</p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <h3 className="text-base font-semibold text-cyan-400 mb-1">Right to Lodge a Complaint</h3>
                  <p className="text-slate-300 text-sm">Contact your local data protection authority if you believe your rights have been violated</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm mt-4">
                To exercise any of these rights, contact us at <a href="mailto:privacy@sky-mind.com" className="text-cyan-400 hover:text-cyan-300 underline">privacy@sky-mind.com</a>. 
                We will respond within 30 days.
              </p>
            </CardContent>
          </Card>

          {/* 8. Cookies */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Local Storage</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use cookies and browser local storage to:
              </p>
              <ul className="space-y-2 text-slate-300 ml-6">
                <li>• <strong>Authentication:</strong> Session cookies to keep you logged in</li>
                <li>• <strong>Preferences:</strong> Save your interpretation toggle and city preferences</li>
                <li>• <strong>Analytics:</strong> Understand usage patterns (anonymized)</li>
              </ul>
              <p className="text-slate-300 text-sm mt-4">
                You can disable cookies in your browser settings, but this may affect Service functionality.
              </p>
            </CardContent>
          </Card>

          {/* 9. International Transfers */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
              <p className="text-slate-300 leading-relaxed">
                Your data may be transferred to and processed in countries outside the European Economic Area (EEA). 
                We ensure adequate protection through Standard Contractual Clauses (SCCs) approved by the European Commission. 
                Data is primarily stored in EU data centers with backup in Singapore (GDPR-compliant hosting provider).
              </p>
            </CardContent>
          </Card>

          {/* 10. Security */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Data Security</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="space-y-2 text-slate-300 ml-6">
                <li>• HTTPS encryption for all data transmission</li>
                <li>• Encrypted database storage</li>
                <li>• Regular security audits and updates</li>
                <li>• Access controls and authentication</li>
                <li>• Automated backup and disaster recovery</li>
              </ul>
              <p className="text-slate-300 text-sm mt-4">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          {/* 11. Children's Privacy */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Children's Privacy</h2>
              <p className="text-slate-300 leading-relaxed">
                The Service is not intended for children under 16 years of age. 
                We do not knowingly collect personal data from children under 16. 
                If you believe we have collected data from a child, contact us immediately at <a href="mailto:privacy@sky-mind.com" className="text-cyan-400 hover:text-cyan-300 underline">privacy@sky-mind.com</a>.
              </p>
            </CardContent>
          </Card>

          {/* 12. Changes to Policy */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Policy</h2>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. 
                We will notify you of material changes by email or prominent notice on the Service. 
                Continued use after changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* 13. Contact */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                For privacy-related questions or to exercise your GDPR rights, contact:
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-300">
                  <strong>Data Protection Officer</strong><br />
                  Email: <a href="mailto:privacy@sky-mind.com" className="text-cyan-400 hover:text-cyan-300">privacy@sky-mind.com</a><br />
                  Website: <a href="https://sky-mind.com" className="text-cyan-400 hover:text-cyan-300">https://sky-mind.com</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-800">
          <Link href="/terms">
            <button className="text-cyan-400 hover:text-cyan-300 text-sm underline">
              ← Terms of Service
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
