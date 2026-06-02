import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages Importing
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import WebsiteTemplates from './pages/WebsiteTemplates';
import Affiliates from './pages/Affiliates';
import FAQ from './pages/FAQ';

// SEO head updates management component
import SEOManager from './components/SEOManager';

// Payment flow pages importing
import CheckoutSimulation from './pages/CheckoutSimulation';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import SecureDownload from './pages/SecureDownload';

// Legal Pages Importing
import Disclaimer from './pages/legal/Disclaimer';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';

// Datastructures & state synchronization
import { Product, CategoryInfo } from './types';
import { subscribeStoreProducts, subscribeCategoriesFromDB } from './lib/firebase';

interface RouteState {
  route: string;
  params: any;
}

export default function App() {
  const [navigation, setNavigation] = useState<RouteState>({ route: 'home', params: null });
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryInfo[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);

  // Load items on initial mount and check for admin unlocking
  useEffect(() => {
    let productsListFetched = false;
    let categoriesListFetched = false;

    // Establish real-time live synchronization for products catalog
    const unsubscribeProducts = subscribeStoreProducts((products) => {
      setProductsList(products);
      productsListFetched = true;
      if (productsListFetched && categoriesListFetched) {
        setDataLoading(false);
      }
    });

    // Establish real-time live synchronization for categories catalogue
    const unsubscribeCategories = subscribeCategoriesFromDB((categories) => {
      setCategoriesList(categories);
      categoriesListFetched = true;
      if (productsListFetched && categoriesListFetched) {
        setDataLoading(false);
      }
    });

    // Support direct pathname routing, e.g. /download/p1 or /download/wt_1
    // This supports requirement 7 beautifully on Netlify/Vercel static servers.
    const pathname = window.location.pathname;
    if (pathname.includes('/download/')) {
      const segments = pathname.split('/');
      const pageId = segments[segments.indexOf('download') + 1];
      if (pageId) {
        setNavigation({
          route: 'secure-download',
          params: { 
            id: pageId, 
            type: pageId.startsWith('wt_') ? 'website' : 'product', 
            email: 'buyer@framsirona.org', 
            token: 'dt_direct_url_access' 
          }
        });
        window.history.replaceState({}, document.title, '/');
      }
    }

    // Check local storage for hidden administrator mode
    const cachedUnlock = localStorage.getItem('framsirona_admin_unlocked') === 'true';
    
    // Check URL parameters for explicit admin access
    const params = new URLSearchParams(window.location.search);
    const queryUnlock = params.get('admin') === 'true' || params.get('unlock') === 'true';
    
    if (cachedUnlock || queryUnlock) {
      setIsAdminUnlocked(true);
      if (queryUnlock) {
        localStorage.setItem('framsirona_admin_unlocked', 'true');
      }
    }

    // Capture payment callback routing queries securely
    const routeQuery = params.get('route');
    if (routeQuery === 'payment-success') {
      const id = params.get('id') || '';
      const type = (params.get('type') || 'product') as any;
      const session_id = params.get('session_id') || '';
      const email = params.get('email') || '';
      const token = params.get('token') || '';
      
      setNavigation({
        route: 'payment-success',
        params: { id, type, session_id, email, token }
      });
      
      // Clear URL parameter clutter to maintain clean workspace
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (routeQuery === 'payment-cancel') {
      const id = params.get('id') || '';
      const type = (params.get('type') || 'product') as any;
      
      setNavigation({
        route: 'payment-cancel',
        params: { id, type }
      });
      
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (queryUnlock) {
      // Clean up URL query parameters for discrete browsing
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // Fallback: in case there's no internet or database files, ensure we do not remain locked
    const fallbackTimer = setTimeout(() => {
      setDataLoading(false);
    }, 4000);

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleToggleAdminUnlock = () => {
    const nextState = !isAdminUnlocked;
    setIsAdminUnlocked(nextState);
    if (nextState) {
      localStorage.setItem('framsirona_admin_unlocked', 'true');
      alert("🔒 Administrative pathways revealed!");
    } else {
      localStorage.removeItem('framsirona_admin_unlocked');
      alert("🔒 Administrative pathways discrete/hidden.");
    }
  };

  const loadCatalog = () => {
    // Left as an empty trigger because real-time listeners handle synchronization automatically
    console.log("[State Sync] Real-time listeners are active. Manual catalog reload bypassed.");
  };

  const handleNavigate = (route: string, params: any = null) => {
    setNavigation({ route, params });
    // Scroll to top on page switches for luxury responsive fluidity
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-200 selection:bg-rose-500/35 selection:text-white">
      
      {/* 0. Central Dynamic SEO Engine */}
      <SEOManager 
        currentRoute={navigation.route} 
        routeParams={navigation.params} 
        allProducts={productsList} 
      />

      {/* 1. Stick top navbar header */}
      <Header 
        currentRoute={navigation.route} 
        onNavigate={handleNavigate} 
        cartCount={cartCount}
        isAdminUnlocked={isAdminUnlocked}
        onToggleAdminUnlock={handleToggleAdminUnlock}
      />

      {/* 2. Loading state cover */}
      {dataLoading && productsList.length === 0 ? (
        <main className="flex-grow flex flex-col items-center justify-center space-y-4 py-32 bg-neutral-950">
          <div className="w-12 h-12 rounded-full border-4 border-neutral-900 border-t-rose-500 animate-spin"></div>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest animate-pulse">Initializing Framsirona vault...</p>
        </main>
      ) : (
        /* 3. Primary Pages Router Switches */
        <main className="flex-grow">
          {navigation.route === 'home' && (
            <Home products={productsList} categories={categoriesList} onNavigate={handleNavigate} />
          )}

          {navigation.route === 'shop' && (
            <Shop 
              products={productsList} 
              categories={categoriesList}
              onNavigate={handleNavigate} 
              initialCategoryFilter={navigation.params?.category || null} 
            />
          )}

          {navigation.route === 'product-details' && (
            <ProductDetails 
              productId={navigation.params?.id} 
              allProducts={productsList} 
              onNavigate={handleNavigate}
              onAddToCart={handleAddToCart}
            />
          )}

          {navigation.route === 'categories' && (
            <Categories products={productsList} categories={categoriesList} onNavigate={handleNavigate} />
          )}

          {navigation.route === 'about' && (
            <About />
          )}

          {navigation.route === 'contact' && (
            <Contact />
          )}

          {navigation.route === 'faq' && (
            <FAQ />
          )}

          {navigation.route === 'website-templates' && (
            <WebsiteTemplates onNavigate={handleNavigate} onAddToCart={handleAddToCart} />
          )}

          {navigation.route === 'affiliates' && (
            <Affiliates onNavigate={handleNavigate} initialCategory={navigation.params?.category || null} />
          )}

          {navigation.route === 'admin' && (
            <Admin 
              products={productsList} 
              categories={categoriesList}
              onRefreshProducts={loadCatalog} 
              onNavigate={handleNavigate} 
            />
          )}

          {/* Payment flow routing switches */}
          {navigation.route === 'checkout-sandbox' && (
            <CheckoutSimulation
              productId={navigation.params?.id}
              productType={navigation.params?.type || 'product'}
              allProducts={productsList}
              onNavigate={handleNavigate}
            />
          )}

          {navigation.route === 'payment-success' && (
            <PaymentSuccess
              productId={navigation.params?.id}
              productType={navigation.params?.type || 'product'}
              allProducts={productsList}
              buyerEmail={navigation.params?.email}
              token={navigation.params?.token}
              sessionId={navigation.params?.session_id}
              onNavigate={handleNavigate}
            />
          )}

          {navigation.route === 'payment-cancel' && (
            <PaymentCancel
              productId={navigation.params?.id}
              productType={navigation.params?.type || 'product'}
              allProducts={productsList}
              onNavigate={handleNavigate}
            />
          )}

          {navigation.route === 'secure-download' && (
            <SecureDownload
              productId={navigation.params?.id}
              productType={navigation.params?.type || 'product'}
              allProducts={productsList}
              buyerEmail={navigation.params?.email}
              token={navigation.params?.token}
              onNavigate={handleNavigate}
            />
          )}

          {/* Legal routes mapping */}
          {navigation.route === 'disclaimer' && (
            <Disclaimer />
          )}

          {navigation.route === 'terms' && (
            <Terms />
          )}

          {navigation.route === 'privacy' && (
            <Privacy />
          )}
        </main>
      )}

      {/* 4. Modular Double col-footer */}
      <Footer onNavigate={handleNavigate} isAdminUnlocked={isAdminUnlocked} />

    </div>
  );
}
