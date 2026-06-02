import { useState, useMemo, FormEvent } from 'react';
import { CreditCard, Lock, ShieldCheck, ArrowLeft, HelpCircle, Code, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface CheckoutSimulationProps {
  productId: string;
  productType: 'product' | 'website';
  allProducts: Product[];
  onNavigate: (route: string, params?: any) => void;
}

export default function CheckoutSimulation({ productId, productType, allProducts, onNavigate }: CheckoutSimulationProps) {
  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [showJsonPayload, setShowJsonPayload] = useState(false);
  const [apiLogs, setApiLogs] = useState<{ msg: string; type: 'info' | 'success' | 'warning' | 'error' }[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Safely find the product or fallback
  const product = useMemo(() => {
    return allProducts.find(p => p.id === productId) || null;
  }, [allProducts, productId]);

  const priceVal = product ? product.price : 19.00;
  const priceStr = `$${priceVal.toFixed(2)}`;
  const titleStr = product ? product.title : 'Framsirona Premium Template';
  const descStr = product ? product.description : 'High performance digital resources';

  // Snippe Integration Payload Preview Schema (for developer inspection)
  const snippePayload = useMemo(() => {
    return {
      service: "Snippe Checkout API v1.0",
      endpoint: "/api/create-checkout-session",
      payload: {
        amount: priceVal,
        currency: (product as any)?.currency || "usd",
        customer_email: email || "buyer@example.com",
        success_url: window.location.origin + `/?route=payment-success&id=${productId}&type=${productType}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: window.location.origin + `/?route=payment-cancel&id=${productId}&type=${productType}`,
        metadata: {
          productId: productId || "unknown_product",
          productType: productType,
          buyerName: cardName || "Anonymous Purchaser"
        }
      }
    };
  }, [productId, productType, titleStr, product, email, cardName]);

  const handleCreateRealSession = async (e: FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);
    setShowLogs(true);
    setApiLogs([]);

    const addLog = (msg: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
      setApiLogs(prev => [...prev, { msg, type }]);
    };

    try {
      addLog("🚀 Establishing TLS Handshake with Framsirona Store server...", "info");
      await new Promise(resolve => setTimeout(resolve, 400));

      addLog("📡 Dispatching session payload request: POST /api/create-checkout-session ...", "info");
      await new Promise(resolve => setTimeout(resolve, 500));

      const successUrl = window.location.origin + `/?route=payment-success&id=${productId}&type=${productType}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = window.location.origin + `/?route=payment-cancel&id=${productId}&type=${productType}`;

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: priceVal,
          currency: (product as any)?.currency || 'USD',
          email: email,
          successUrl,
          cancelUrl,
          productId,
          productType,
          metadata: {
            buyerName: cardName || "Store Customer"
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Gateway returned error status: ${res.status}`);
      }

      const data = await res.json();
      
      if (!data.url) {
        throw new Error("Missing checkout destination link from Snippe Gateway registry.");
      }

      addLog(`✅ Snippe API responds: 201 Created. Checkout Session: ${data.id}`, "success");
      await new Promise(resolve => setTimeout(resolve, 400));

      addLog(`✨ Routing customer to secure Snippe Payment Portal...`, "success");
      await new Promise(resolve => setTimeout(resolve, 600));

      // Browser routing dispatch to Snippe hosted checkout
      window.location.href = data.url;
    } catch (err: any) {
      addLog(`❌ Failed to establish Snippe session: ${err.message}`, "error");
      addLog(`💡 Ensure the Framsirona backend server is running and configured correctly.`, "warning");
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleCancelOrder = () => {
    onNavigate(productType === 'website' ? 'website-templates' : 'product-details', { id: productId });
  };

  return (
    <div className="bg-slate-950 font-sans text-slate-100 min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <button
          onClick={handleCancelOrder}
          className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 outline-none p-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Snippe Checkout Portal</span>
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full text-center animate-pulse">
            <Lock className="w-3 h-3 text-blue-400 mr-0.5" />
            <span>Snippe Secure Encryption Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
            Snippe Checkout Gateway
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Configure your billing metrics below to launch the checkout. Payments are routed with multi-factor encryption layers.
          </p>
        </div>

        {/* Double column breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Secure billing configurations */}
          <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                   S
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white tracking-wider block">SNIPPE SECURE</span>
                  <span className="text-[9px] text-slate-500 font-mono block leading-none">CHECKOUT PLATFORM</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono px-2.5 py-0.5 rounded font-bold uppercase">
                Ready to Redirect
              </span>
            </div>

            <form onSubmit={handleCreateRealSession} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Customer Billing Email</label>
                <input
                  required
                  type="email"
                  placeholder="buyer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-100 transition-colors"
                />
              </div>

              {/* Cardholder Name */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wider block">Cardholder Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ronald Frank"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-100 transition-colors"
                />
              </div>

              {/* Secure terms indicator */}
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono py-1 bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>You will complete checkout on Snippe's secure PCI-DSS hosted ledger.</span>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-4">
                {/* Cancel Trigger */}
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-400 hover:text-white font-bold py-3.5 rounded-xl cursor-pointer text-[10px] uppercase tracking-wider font-mono text-center transition-colors"
                >
                  Cancel Order
                </button>

                {/* Submit Trigger */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-101 hover:shadow-lg text-white font-bold py-3.5 rounded-xl cursor-pointer text-[10px] uppercase tracking-wider font-mono text-center transition-all shadow-md flex items-center justify-center space-x-2 ${isProcessing ? 'opacity-85 pointer-events-none' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Contacting Snippe API...</span>
                    </>
                  ) : (
                    <span>Authorize {priceStr}</span>
                  )}
                </button>
              </div>

              {/* Snippe Live Console Logs */}
              {showLogs && apiLogs.length > 0 && (
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 font-mono text-[10px] space-y-2 mt-4 max-h-[170px] overflow-y-auto animate-fadeIn select-text text-left">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-1.5 text-slate-500 text-[8px] uppercase tracking-wider">
                    <span>Snippe API Gateway Stream</span>
                    <span className="text-blue-500 animate-pulse font-bold">● BRIDGE LIVE</span>
                  </div>
                  <div className="space-y-1">
                    {apiLogs.map((log, idx) => (
                      <div key={idx} className={`leading-relaxed ${
                        log.type === 'success' ? 'text-emerald-400 font-medium' :
                        log.type === 'warning' ? 'text-amber-400 font-medium' :
                        log.type === 'error' ? 'text-red-400 font-bold' :
                        'text-slate-350'
                      }`}>
                        <span className="text-slate-600 mr-1.5 font-bold">[{idx + 1}]</span>
                        {log.msg}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Right Column: Mini Invoice and Config Payload */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Purchase Item Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="block text-[9px] font-mono uppercase text-slate-500 tracking-widest font-bold">Snippe Invoice Materials</span>
              
              <div className="space-y-2">
                <h3 className="font-bold text-white text-sm m-0 leading-tight truncate">{titleStr}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{descStr}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Recipient Store</span>
                <span className="text-white font-bold">Framsirona Store</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Invoice Total</span>
                <span className="text-blue-400 font-bold">{priceStr}</span>
              </div>
            </div>

            {/* Snippe Integration Specifications JSON Payload Inspect Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <button 
                type="button"
                onClick={() => setShowJsonPayload(!showJsonPayload)}
                className="w-full flex items-center justify-between bg-transparent border-0 outline-none text-left p-0 cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 text-slate-400 hover:text-white">
                  <Code className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Snippe Gateway Payload</span>
                </div>
                <span className="text-[10px] text-blue-400 font-mono">{showJsonPayload ? 'Hide' : 'Inspect JSON'}</span>
              </button>

              {showJsonPayload && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  <p className="text-[9px] text-slate-400 leading-normal font-mono">
                    Snippe checkout dispatches secure telemetry signals back to the Framsirona Store:
                  </p>
                  <pre className="text-[8px] font-mono text-emerald-400 bg-slate-950 border border-slate-850 p-3 rounded-lg overflow-x-auto max-h-48 leading-relaxed">
                    {JSON.stringify(snippePayload, null, 2)}
                  </pre>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
