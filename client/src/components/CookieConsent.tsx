import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Link } from "wouter";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
    // Initialize analytics if needed
    console.log("Cookie consent accepted");
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShow(false);
    // Disable analytics
    console.log("Cookie consent rejected");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none">
      <div className="container max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6">
          <div className="flex items-start gap-4">
            <Cookie className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Cookie Consent</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                We use essential cookies to ensure the website functions properly and optional analytics cookies to understand how you use our platform. 
                You can choose to accept or reject optional cookies. 
                <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 ml-1 underline">
                  Learn more in our Privacy Policy
                </Link>
              </p>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAccept}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-all"
                >
                  Accept All
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg border border-slate-700 transition-all"
                >
                  Reject Optional
                </button>
                <Link href="/privacy">
                  <button className="px-6 py-2 text-slate-400 hover:text-slate-200 font-medium transition-all">
                    Manage Preferences
                  </button>
                </Link>
              </div>
            </div>

            <button
              onClick={handleReject}
              className="text-slate-400 hover:text-slate-200 transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
