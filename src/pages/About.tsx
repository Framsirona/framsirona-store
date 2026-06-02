import { CheckCircle, Award, Hourglass, ShieldCheck, HeartCrack, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
        
        {/* Large visual heading */}
        <div className="text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">WHO IS BEHIND THE CURTAIN</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About{' '}
            <span className="bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
              Framsirona Store
            </span>
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Pioneering a unified digital standard for designers, agency planners, and independent mock publishers seeking premium asset layouts.
          </p>
        </div>

        {/* Narrative segments block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-sans">Our Unified Mission</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Framsirona Store was built out of frustration with low-quality, cluttered graphic marketplace assets. Standard platforms force designers to sift through thousands of obsolete, unorganized directories. 
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Our store operates as an elite design studio, hand-producing, vetting, and packaging only beautiful, flawless materials. Everything from typography layouts to layer hierarchies inside Photoshop is meticulously tested before publish.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-sans">Absolute Delivery Standards</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              We focus heavily on speed and immediate compliance. Digital purchases should never come with slow download channels, spam subscription gates, or complicated setup guidelines. 
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              With Framsirona Store, your payment yields a clean, high-speed direct static file, Figma component, or Canva browser access link immediately. Zero delays. Maximum visual quality. Guaranteed.
            </p>
          </div>
        </div>

        {/* Core Values / Stature */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
          <h3 className="text-center font-bold text-slate-800 text-base">The Core Pillars of Our Vault</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center">
            
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto border border-blue-100">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Designer Craft</h4>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                Meticulous layout alignment, color theories, and premium type selection.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto border border-blue-100">
                <TimelineShield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Instant Deliveries</h4>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                Get direct access to source materials as soon as checkout checks complete.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto border border-blue-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Lifetime Updates</h4>
              <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                All template additions and color edits are available free forever after acquisition.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Temporary internal helper representation of timeline indicator
function TimelineShield(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
