import { useEffect } from 'react';
import { Product } from '../types';

interface SEOManagerProps {
  currentRoute: string;
  routeParams: any;
  allProducts: Product[];
}

export default function SEOManager({ currentRoute, routeParams, allProducts }: SEOManagerProps) {
  useEffect(() => {
    let titleStr = 'Framsirona Store | Premium Design Templates & Canva Kits';
    let descStr = 'A modern professional digital products marketplace specializing in premium template designs, Canva kits, ebook frameworks, and elite publisher assets.';
    let keywordsStr = 'design templates, Canva kits, ebook template, PSD mockups, flyers, branding layouts, Framsirona Store';
    let imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80';

    // Route-specific configurations
    switch (currentRoute) {
      case 'home':
        titleStr = 'Framsirona Store | Premium Design Templates & Canva Kits';
        break;
      case 'shop':
        const catFilter = routeParams?.category;
        titleStr = catFilter
          ? `Shop ${catFilter.charAt(0).toUpperCase() + catFilter.slice(1)} Assets | Framsirona`
          : 'High-Resolution Digital Assets Catalog | Framsirona Shop';
        descStr = 'Browse our hand-selected archive of professional, production-optimized, high-compatibility media layouts and templates with free instant downloads.';
        keywordsStr = 'buy design templates, editable design files, premium Canva kits, ebook layouts';
        break;
      case 'product-details':
        const selectedProd = allProducts.find(p => p.id === routeParams?.id);
        if (selectedProd) {
          titleStr = `${selectedProd.title} | Framsirona Asset Store`;
          descStr = selectedProd.description || descStr;
          keywordsStr = `${selectedProd.title.toLowerCase().replace(/[^a-z0-9 ]/g, '')}, editable graphic kits, ${selectedProd.fileFormat || 'custom asset'}, design templates`;
          if (selectedProd.previewImages && selectedProd.previewImages.length > 0) {
            imageUrl = selectedProd.previewImages[0];
          }
        } else {
          titleStr = 'Digital Asset Blueprint Details | Framsirona';
        }
        break;
      case 'categories':
        titleStr = 'Specialized Publisher Design Categories | Framsirona';
        descStr = 'Navigate our modular product categories spanning Canva sets, keynote grids, digital artwork, branding mockups, and corporate planners.';
        break;
      case 'about':
        titleStr = 'Our Mission & Elite Philosophy | Framsirona';
        descStr = 'Discover the legacy of Framsirona Store—empowering creators, agencies, and visual managers globally with instantly compatible material packs.';
        break;
      case 'contact':
        titleStr = 'Helpdesk Ticket Center & Customer Care | Framsirona Contact';
        descStr = 'Get round-the-clock professional assistance with download licenses, Canva compatibility, custom mockups, or transaction queries.';
        break;
      case 'faq':
        titleStr = 'Frequently Asked Questions & Support Desk | Framsirona';
        descStr = 'Find quick solutions with our FAQ archive on licensing rules, Canva templates customization, file formats, and decaying download windows.';
        keywordsStr = 'Framsirona FAQ, license rules, PSD mockups help, Canva tutorials, template support';
        break;
      case 'website-templates':
        titleStr = 'High-Speed Web Asset Frameworks | Framsirona';
        descStr = 'Explore pre-released ultra-responsive single-page design templates, portfolio components, and production-ready HTML layouts.';
        break;
      case 'affiliates':
        titleStr = 'Bounty Affiliate Partnership Program | Framsirona';
        descStr = 'Join our commission alliance system, promote premium creator tools, and earn up to 45% on every referred template acquisition.';
        keywordsStr = 'framsirona affiliate program, digital template referral, make money graphics, creator referral system';
        break;
      case 'admin':
        titleStr = 'Central Telemetry Control Console (Admin) | Framsirona';
        descStr = 'Admin console to handle inventory, transaction logs, message entries, categories, and webhook simulation nodes.';
        break;
      case 'checkout-sandbox':
        titleStr = 'Secured Snippe Checkout Portal | Framsirona';
        descStr = 'Complete your digital release order using our elegant Snippe secure checkout portal safely and instantly.';
        break;
      case 'payment-success':
        titleStr = 'Payment Authorized & Access Keys Generated';
        descStr = 'Congratulations! Your transaction has cleared. You can now unlock your secured expiring material catalog download codes.';
        break;
      case 'secure-download':
        titleStr = 'Secure Encrypted Retrieval Vault | Framsirona';
        descStr = 'Verified download terminal. Claim your digital template material payload packages inside of our 24-hour decaying key window.';
        break;
      case 'disclaimer':
        titleStr = 'Terms Disclaimer & Asset Usage Statement | Framsirona';
        break;
      case 'terms':
        titleStr = 'Master Terms of Use Service Agreement | Framsirona';
        break;
      case 'privacy':
        titleStr = 'Consumer Privacy Regulations and Protocols | Framsirona';
        break;
    }

    // Dynamic head modification
    document.title = titleStr;

    const setMetaTag = (selector: string, attributeName: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        // Create element dynamically if absent
        element = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const nameVal = selector.split('"')[1];
          element.setAttribute('name', nameVal);
        } else if (selector.startsWith('meta[property=')) {
          const propVal = selector.split('"')[1];
          element.setAttribute('property', propVal);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attributeName, value);
    };

    // 1. Description and Keywords
    setMetaTag('meta[name="description"]', 'content', descStr);
    setMetaTag('meta[name="keywords"]', 'content', keywordsStr);

    // 2. Open Graph tags
    setMetaTag('meta[property="og:title"]', 'content', titleStr);
    setMetaTag('meta[property="og:description"]', 'content', descStr);
    setMetaTag('meta[property="og:image"]', 'content', imageUrl);

    // 3. Twitter Card tags
    setMetaTag('meta[name="twitter:title"]', 'content', titleStr);
    setMetaTag('meta[name="twitter:description"]', 'content', descStr);
    setMetaTag('meta[name="twitter:image"]', 'content', imageUrl);

  }, [currentRoute, routeParams, allProducts]);

  return null; // pure headless side-effect component
}
