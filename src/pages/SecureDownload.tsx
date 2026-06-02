import { useEffect, useMemo, useState } from 'react';
import { Download, ShieldCheck, Check, Calendar, ExternalLink, RefreshCw, Lock, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { verifyAndRecordDownload } from '../lib/firebase';

interface SecureDownloadProps {
  productId: string;
  productType: 'product' | 'website';
  allProducts: Product[];
  buyerEmail?: string;
  token?: string;
  onNavigate: (route: string, params?: any) => void;
}

export default function SecureDownload({ productId, productType, allProducts, buyerEmail, token, onNavigate }: SecureDownloadProps) {
  const [loading, setLoading] = useState(false);
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [secureDownloadUrl, setSecureDownloadUrl] = useState('');
  
  // Security State Verification
  const [verifying, setVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'ready' | 'expired' | 'invalid'>('pending');
  const [orderDetail, setOrderDetail] = useState<any>(null);

  useEffect(() => {
    let active = true;
    const conductVerification = async () => {
      if (!token) {
        setVerificationStatus('invalid');
        setVerifying(false);
        return;
      }
      try {
        const result = await verifyAndRecordDownload(token, {
          ipAddress: '194.22.181.5', // mock client IP for demo tracking logs
          userAgent: navigator.userAgent
        });
        if (active) {
          setOrderDetail(result.order);
          setVerificationStatus(result.status);
          if (result.downloadUrl) {
            setSecureDownloadUrl(result.downloadUrl);
          }
          setVerifying(false);
        }
      } catch (err) {
        if (active) {
          setVerificationStatus('invalid');
          setVerifying(false);
        }
      }
    };
    conductVerification();
    return () => {
      active = false;
    };
  }, [token]);

  const product = useMemo(() => {
    const pId = orderDetail ? orderDetail.productId : productId;
    return allProducts.find(p => p.id === pId) || null;
  }, [allProducts, orderDetail, productId]);

  const defaultEmail = orderDetail ? orderDetail.buyerEmail : (buyerEmail || 'visitor@framsirona.com');
  const itemTitle = product ? product.title : (orderDetail ? orderDetail.productTitle : 'Premium Digital Release');
  const itemFormat = product ? product.fileFormat || 'Instant ZIP package' : 'ZIP';
  const itemSize = product ? product.fileSize || 'N/A' : 'N/A';
  const downloadLink = secureDownloadUrl || '#';

  const handleDownloadTrigger = () => {
    if (verificationStatus !== 'ready') return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDownloadTriggered(true);
      
      // Navigate to download link directly
      window.open(downloadLink, '_blank', 'noopener,noreferrer');
    }, 1550);
  };

  // Rendering 1: Verification Pending State Loader
  if (verifying) {
    return (
      <div className="bg-slate-950 font-sans text-slate-100 min-h-screen py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">Running Cryptographic Token Verification...</p>
      </div>
    );
  }

  // Rendering 2: Invalid/Missing Token State
  if (verificationStatus === 'invalid') {
    return (
      <div className="bg-slate-950 font-sans text-slate-100 min-h-screen py-20 flex items-center justify-center px-4" id="secure-download-invalid">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-xl">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-[9.5px] font-mono font-bold uppercase text-red-400 tracking-wider bg-red-500/10 px-2.5 py-0.5 rounded">Security Protection</span>
            <h1 className="text-xl font-bold text-white m-0 tracking-tight">Invalid or Expired Download Link</h1>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              The provided secure download material token is invalid, missing, or has expired. Access to Framsirona digital assets requires a valid temporary purchase session.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold py-3 rounded-xl cursor-pointer text-xs uppercase tracking-wider font-mono text-center transition-all"
            >
              Back to Catalog Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rendering 3: Expired Token State (Mandatory Exponent Expiring Links)
  if (verificationStatus === 'expired') {
    return (
      <div className="bg-slate-950 font-sans text-slate-100 min-h-screen py-20 flex items-center justify-center px-4" id="secure-download-expired">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-xl">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <span className="text-[9.5px] font-mono font-bold uppercase text-amber-400 tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded">Access Decay</span>
            <h1 className="text-xl font-bold text-white m-0 tracking-tight">Invalid or Expired Download Link</h1>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              For security, material download keys are valid for exactly <strong className="text-white">1 hour</strong> following payment approval. Your link expired on:
            </p>
            <p className="text-xs font-mono text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
              {orderDetail ? new Date(orderDetail.tokenExpiresAt).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div className="pt-2 space-y-2">
            <button
              onClick={() => onNavigate('contact')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl cursor-pointer text-xs uppercase tracking-wider transition-all"
            >
              Submit Support Ticket
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="w-full bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold py-3 rounded-xl cursor-pointer text-xs uppercase tracking-wider font-mono text-center transition-all"
            >
              Back to Catalog Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rendering 4: Standard Verified Ready State
  return (
    <div className="bg-slate-950 font-sans text-slate-100 min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Title contextual notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-850 pb-6 gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full text-center inline-block">
              Authorized Payload Port
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
               Digital Material Retrieval Vault
            </h1>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <div className="font-mono text-[10px] text-left">
              <span className="text-slate-400 block font-bold leading-none">SECURE KEY MAPPED</span>
              <span className="text-slate-500 block leading-tight truncate max-w-[150px]">{defaultEmail}</span>
            </div>
          </div>
        </div>

        {/* Dashboard structure grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Main Release Panel Column */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Download Interface Frame card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">AUTHORIZED PAYLOAD TEMPLATE</span>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-tight m-0">{itemTitle}</h2>
              </div>

              {/* Grid of details inside box */}
              <div className="grid grid-cols-2 gap-4 font-mono text-[11px] bg-slate-950 p-4 border border-slate-850 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[10px] block uppercase">Material Format</span>
                  <span className="text-indigo-400 font-bold block">{itemFormat}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 text-[10px] block uppercase">Material Payload Size</span>
                  <span className="text-white font-bold block">{itemSize}</span>
                </div>
                <div className="space-y-0.5 col-span-2 pt-2 border-t border-slate-850/60 mt-2">
                  <span className="text-slate-500 text-[10px] block uppercase">Material Security Code</span>
                  <span className="text-emerald-400 font-semibold block font-mono uppercase truncate">{token}</span>
                </div>
              </div>

              {/* Direct download activation CTA */}
              <div className="space-y-3">
                <button
                  onClick={handleDownloadTrigger}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg hover:brightness-110 cursor-pointer text-xs uppercase tracking-widest transition-all hover:scale-101"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Generating secure package tokens...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-white" />
                      <span>Download Digital Files Payload</span>
                    </>
                  )}
                </button>

                {downloadTriggered && (
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>Download launched in separate tab! Check pop-up permit.</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 text-[10.5px] font-mono text-slate-400 bg-slate-950 border border-slate-850 p-3 rounded-xl">
                <Calendar className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>
                  Material key window decays on: <strong className="text-white">{orderDetail ? new Date(orderDetail.tokenExpiresAt).toLocaleString() : 'N/A'}</strong>
                </span>
              </div>

              <p className="text-[10px] text-center text-slate-500 leading-normal max-w-sm mx-auto font-mono">
                Clicking the dispatch trigger activates the delivery route safely. If you encounter speed throttling, utilize standard browser download resume logs.
              </p>

            </div>

            {/* Instruction workflow step checklist */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <span className="block text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">How to Utilize My Purchased Template</span>
              <ul className="space-y-3.5 text-xs text-slate-400">
                <li className="flex items-start space-x-2.5">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center text-blue-400 mt-0.5 font-bold">1</span>
                  <span>Unpack the delivery payload package (ZIP files) on your target device desktop.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center text-blue-400 mt-0.5 font-bold">2</span>
                  <span>In accordance with file formats, open your assets inside <strong className="text-slate-200 font-bold">Adobe Photoshop CC</strong>, <strong className="text-slate-200 font-bold">Canva</strong>, or standard document readers.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center text-blue-400 mt-0.5 font-bold">3</span>
                  <span>Amend branding aspects, edit text grids, overlay customized design matrices, and compile high-resolution exports.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Guidelines Sidebar Column */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Visual template preview cover (if available) */}
            {product && product.previewImages && product.previewImages.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                <div className="aspect-video w-full bg-slate-950 relative">
                  <img 
                    src={product.previewImages[0]} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">ACTIVE FILE INSTANCE</span>
                  <p className="text-xs text-slate-300 font-semibold truncate m-0">{product.title}</p>
                </div>
              </div>
            )}

            {/* Licensing Agreement Info card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5">
              <span className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Commercial Usage License</span>
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                By downloading this Framsirona Store material pack, you are granted a lifelong, worldwide, royalty-free standard professional usage permit.
              </p>
              <div className="space-y-1 text-[10px] font-mono text-slate-500">
                <div className="flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Unlimited commercial client designs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Personal studio/portfolio use</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span>Redistribution as templates is forbidden</span>
                </div>
              </div>
            </div>

            {/* Need Help card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase block">Encountered package errors?</span>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-sans">
                If the file download does not launch automatically or reports file corruption, submit a report ticket using of our unified contact form.
              </p>
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center space-x-1.5 text-[10.5px] font-mono text-blue-400 hover:text-white transition-colors cursor-pointer bg-transparent border-0 outline-none p-0 mt-2 underline"
              >
                <span>Navigate to Help Ticket Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
