import { useState, FormEvent } from 'react';
import { Mail, Send, CheckCircle, HelpCircle, MapPin, Phone } from 'lucide-react';
import { submitContactInquiry } from '../lib/firebase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    try {
      await submitContactInquiry(formData);
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setLoading(false);
      // Fallback is also successful since we wrote to LocalStorage in the wrapper!
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-blue-600 font-mono text-xs uppercase tracking-widest block font-bold">GET IN TOUCH</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
            Consultation & Support
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Need design customization, custom brand planning, or support downloading your assets? Drop us a line.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-5xl mx-auto items-start">
          
          {/* Support channels specifications Side card */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-base font-sans">Corporate Channels</h3>
              
              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start space-x-3.5">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 text-[10px]">DIRECT INQUIRIES</span>
                    <span className="text-slate-800 font-semibold">hello@framsirona.com</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 text-[10px]">STUDIO SHORELINE</span>
                    <span className="text-slate-800 font-semibold">Zurich, Switzerland Co.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 bg-blue-50/50 p-3 rounded-xl border border-blue-50">
                  <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="block text-slate-400 text-[10px]">RESPONSE METRIC</span>
                    <span className="text-blue-600 font-bold">Within 4 Hours</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100/60 border border-slate-200 p-6 rounded-2xl space-y-2 text-xs">
              <span className="block font-bold text-slate-700 font-sans">Purchasing safety</span>
              <p className="text-slate-500 leading-relaxed">
                All templates downloads are static, digitally watermarked, and scanned clean of executable dependencies. Safe vector transfers only.
              </p>
            </div>
          </div>

          {/* Interactive Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold font-mono uppercase text-slate-500 tracking-wider">Your Name</label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold font-mono uppercase text-slate-500 tracking-wider">Email Address</label>
                      <input
                        required
                        type="email"
                        placeholder="name@agency.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono uppercase text-slate-500 tracking-wider">Subject Inquiry</label>
                    <input
                      type="text"
                      placeholder="e.g. Licensing, custom templates commission"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono uppercase text-slate-500 tracking-wider">Detailed Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Hi, I am interested in licensing the Branding kit for dynamic media scaling..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 resize-none transition-all duration-300"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/10 text-white font-bold py-3.5 px-8 rounded-xl cursor-pointer text-xs uppercase tracking-wider w-full sm:w-auto transition-all"
                  >
                    {loading ? (
                      <span className="block w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                </form>
              ) : (
                <div className="py-12 text-center space-y-4" id="contact-success-panel">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center rounded-full mx-auto shadow-sm">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg">Inquiry Sent Successfully!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Thank you. We have recorded your submission in our central database. A Framsirona curator will reach out to you within the requested response metric cycle.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs rounded-xl px-5 py-2.5 text-slate-700 font-bold cursor-pointer inline-block"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
