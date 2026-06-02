import { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, Search, ArrowRight, Shield, RefreshCw, Key, FileCode } from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'licenses' | 'canva-psd' | 'orders-download' | 'affiliates';
  question: string;
  answer: string;
}

const FAQ_DATABASE: FAQItem[] = [
  {
    id: 'lic-1',
    category: 'licenses',
    question: 'What items can I legally build with Framsirona Store templates?',
    answer: 'Our life-long commercial royalty-free license allows you to build templates, commercial clients presentation decks, printed merchandise, company social posts, banners, book covers, and business guides. The only restricted use case is reselling or redistributing our source files as standalone editable templates on competitive stocks.'
  },
  {
    id: 'lic-2',
    category: 'licenses',
    question: 'Do your Canva and Photoshop kits support lifetime updates?',
    answer: 'Absolutely! Our licenses include unlimited lifetime revision updates. Any time we publish structural improvements, typo corrections, or layout expansions to a kit, you can retrieve the updated version from your secured downloads list with no additional fees.'
  },
  {
    id: 'canva-1',
    category: 'canva-psd',
    question: 'How do I open and edit the Canva links?',
    answer: 'Upon payment verification, we provide a secure PDF or direct Canva dispatch link. Clicking it opens a custom template copy inside of your personal Canva account (free or Pro). Your adjustments do not affect other Framsirona customers and are saved instantly inside your workspace.'
  },
  {
    id: 'canva-2',
    category: 'canva-psd',
    question: 'What fonts do Framsirona templates utilize? Are they free?',
    answer: 'All typography layouts are styled with premium-grade Google Fonts or natively integrated Canva free typefaces. This guarantees that when you open a template layout, the structure renders perfectly with Zero broken text messages or paid font license requirements.'
  },
  {
    id: 'order-1',
    category: 'orders-download',
    question: 'How fast will my download key match and arrive after checking out?',
    answer: 'We utilize state-of-the-art Webhook dispatch interfaces. The absolute millisecond your payment clears via our Snippe secure checkout, the server logs and processes an automated delivery token, opening your payment-success dashboard with immediate asset access.'
  },
  {
    id: 'order-2',
    category: 'orders-download',
    question: 'Why do secure retrieval keys decay after exactly 24 hours?',
    answer: 'To prevent bandwidth harvesting and keep template licenses private, our database assigns a 24-hour decay timestamp to each unique token. If your link expires before you obtain your ZIP package files, simply submit a free support ticket or contact our helpdesk to refresh your access.'
  },
  {
    id: 'aff-1',
    category: 'affiliates',
    question: 'What are the commission payout percentages for partners?',
    answer: 'Our alliance and affiliate program pays a massive 45% bounty on every referred sale. Payouts are reconciled on the 1st and 15th of each calendar month using of our automated Snippe platform network.'
  },
  {
    id: 'aff-2',
    category: 'affiliates',
    question: 'Do you track customer referrals if they buy templates on a later date?',
    answer: 'Yes, our secure affiliate integration writes a 60-day cookie tracker. If a creator visits Framsirona Store via your partner referral link, you receive full credit for any template or Canva kit purchased anytime within the next 60 days.'
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'licenses' | 'canva-psd' | 'orders-download' | 'affiliates'>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'lic-1': true // default open the first FAQ
  });

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFAQs = useMemo(() => {
    return FAQ_DATABASE.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Banner with modern design */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center space-x-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
            <HelpCircle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>EXPERT HELPDESK & TROUBLESHOOTING</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Got questions about licenses, Canva configurations, decaying file links, or partner commissions? Find quick answers, tutorials, and support pathways.
          </p>
        </div>

        {/* Dynamic Search & Categorization Bar */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search through of our answers database (e.g. fonts, decay, licenses)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-xs font-mono text-white outline-none focus:border-rose-500 transition-all placeholder:text-slate-500 shadow-inner"
            />
          </div>

          {/* Tab Categories Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', title: '📂 All Topics' },
              { id: 'licenses', title: '⚖️ Usage Licenses' },
              { id: 'canva-psd', title: '🎨 Canva & PSD Kits' },
              { id: 'orders-download', title: '🔑 Delivery & Links' },
              { id: 'affiliates', title: '🤝 Affiliate Program' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`text-xs px-4 py-2.5 rounded-full cursor-pointer border font-medium transition-all ${
                  activeCategory === tab.id
                    ? 'bg-rose-500 border-rose-400 text-white shadow-md shadow-rose-500/10 scale-102'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Accordion Area */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item) => {
              const isOpen = !!expandedItems[item.id];
              return (
                <div 
                  key={item.id}
                  className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-800 shadow-sm"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between text-white font-semibold text-xs sm:text-sm hover:bg-slate-900/80 transition-colors gap-4 select-none cursor-pointer"
                  >
                    <span className="font-medium pr-2 leading-relaxed">{item.question}</span>
                    <ChevronDown className={`w-4 h-4 text-rose-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-950/60 transition-all duration-300">
                      <p className="m-0 select-text p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-slate-900/20 border border-slate-850 rounded-3xl space-y-4">
              <p className="text-slate-400 text-xs font-mono">No matching answers found for "{searchQuery}"</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="bg-slate-900 hover:bg-slate-800 text-[10.5px] font-mono text-rose-400 px-4 py-2 border border-slate-800 rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Quick troubleshooting boxes for SEO rating & index preparation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-slate-900">
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 p-6 rounded-2xl space-y-4 text-xs">
            <span className="block text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Commercial License Guarantee</span>
            </span>
            <p className="text-slate-400 leading-normal font-sans">
              Every Framsirona release is legally certified for high-tier freelancing and commercial project delivery. Source files are formatted correctly to preserve nested layouts perfectly.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 p-6 rounded-2xl space-y-4 text-xs">
            <span className="block text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <RefreshCw className="w-4 h-4 text-rose-400" />
              <span>Decayed Access Recovery</span>
            </span>
            <p className="text-slate-400 leading-normal font-sans">
              If your 24-hour key expired before retrieving your file, don't worry. Launch of our contact form, fill in your sandbox buyer email, and our server will instantly refresh your key.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
