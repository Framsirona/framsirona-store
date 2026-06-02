import { useState, useEffect, FormEvent } from 'react';
import { 
  Lock, Eye, ShieldAlert, Plus, Edit, Trash2, CheckCircle, Mail, Database, 
  Trash, List, FileText, FileUp, Sparkles, FolderLock, FileDigit, Info, Check, Trash2 as TrashIcon, Clock, Terminal, Activity, RefreshCw, Smartphone
} from 'lucide-react';
import { Product, CategoryType, ContactMessage, AffiliateProduct, CategoryInfo, DigitalOrder, DownloadLog, WebhookLog, WebsiteTemplate } from '../types';
import { INITIAL_CATEGORIES } from '../lib/initialData';
import { 
  addStoreProduct, 
  updateStoreProduct, 
  deleteStoreProduct, 
  fetchContactInquiries,
  uploadFileToStorage,
  addAffiliateProductInDB,
  deleteAffiliateProductFromDB,
  fetchAffiliateProductsFromDB,
  addCategoryInDB,
  deleteCategoryFromDB,
  updateCategoryInDB,
  fetchOrders,
  fetchWebhookLogs,
  fetchDownloadLogs,
  recordOrder,
  fetchWebsiteTemplates,
  addWebsiteTemplate,
  deleteWebsiteTemplate,
  updateWebsiteTemplate
} from '../lib/firebase';

interface AdminProps {
  products: Product[];
  categories?: CategoryInfo[];
  onRefreshProducts: () => void;
  onNavigate: (route: string) => void;
}

export default function Admin({ products, categories, onRefreshProducts, onNavigate }: AdminProps) {
  const categoriesToRender = categories && categories.length > 0 ? categories : INITIAL_CATEGORIES;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'inventory' | 'messages' | 'categories' | 'affiliates' | 'sales' | 'websites'>('inventory');

  // Website templates state
  const [websiteTemplates, setWebsiteTemplates] = useState<WebsiteTemplate[]>([]);
  const [editingWebsiteId, setEditingWebsiteId] = useState<string | null>(null);
  const [webLoading, setWebLoading] = useState(false);
  const [webSuccessMsg, setWebSuccessMsg] = useState('');
  const [webErrorMsg, setWebErrorMsg] = useState('');
  
  // Website Template creation form states
  const [webTitle, setWebTitle] = useState('');
  const [webDescription, setWebDescription] = useState('');
  const [webCategory, setWebCategory] = useState<WebsiteTemplate['category']>('Business website');
  const [webPrice, setWebPrice] = useState('');
  const [webLiveDemoUrl, setWebLiveDemoUrl] = useState('');
  const [webTechStackInput, setWebTechStackInput] = useState(''); // comma-separated
  const [webManualImageUrls, setWebManualImageUrls] = useState(''); // comma-separated
  const [webManualDownloadUrl, setWebManualDownloadUrl] = useState('');
  const [webBulletFeature, setWebBulletFeature] = useState('');
  const [webFeatures, setWebFeatures] = useState<string[]>([]);
  const [webPaymentLink, setWebPaymentLink] = useState('');
  const [webImageFiles, setWebImageFiles] = useState<FileList | null>(null);
  const [webDownloadFile, setWebDownloadFile] = useState<File | null>(null);

  // Contact inquiries log state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);

  // Affiliate state hooks
  const [affiliatesList, setAffiliatesList] = useState<AffiliateProduct[]>([]);
  const [affTitle, setAffTitle] = useState('');
  const [affDescription, setAffDescription] = useState('');
  const [affCategory, setAffCategory] = useState<'Recommended Tools' | 'Creator Essentials' | 'Office & Business Tools'>('Creator Essentials');
  const [affAmazonLink, setAffAmazonLink] = useState('');
  const [affManualImage, setAffManualImage] = useState('');
  const [affImageFile, setAffImageFile] = useState<File | null>(null);
  const [affLoading, setAffLoading] = useState(false);
  const [affSuccessMsg, setAffSuccessMsg] = useState('');

  // Core Form State (for Add and Edit states)
  const [isEditing, setIsEditing] = useState<string | null>(null); // houses Product ID if editing
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryType>('Poster templates');
  const [formPrice, setFormPrice] = useState('');
  const [formFileSize, setFormFileSize] = useState('');
  const [formFileFormat, setFormFileFormat] = useState('');
  const [formBulletFeature, setFormBulletFeature] = useState('');
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [formPaymentLink, setFormPaymentLink] = useState('');
  
  // Media Input States (handles File Uploads and manually typed source URLs)
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [manualImageUrls, setManualImageUrls] = useState('');
  const [manualAssetUrl, setManualAssetUrl] = useState('');
  
  // Dynamic File Upload Previews, Validation Feedbacks and Categories CRUD state
  const [previewSrcs, setPreviewSrcs] = useState<string[]>([]);
  const [assetFilePreviewName, setAssetFilePreviewName] = useState('');
  const [assetFilePreviewSize, setAssetFilePreviewSize] = useState('');
  const [fileValidationError, setFileValidationError] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sparkles');
  const [newCatImageUrl, setNewCatImageUrl] = useState('');
  const [newCatImageFile, setNewCatImageFile] = useState<File | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catLoading, setCatLoading] = useState(false);
  const [catSuccessMsg, setCatSuccessMsg] = useState('');
  const [catErrorMsg, setCatErrorMsg] = useState('');

  const [operationLoading, setOperationLoading] = useState(false);
  const [operationSuccessMsg, setOperationSuccessMsg] = useState('');

  // Digital monetization and delivery states
  const [orders, setOrders] = useState<DigitalOrder[]>([]);
  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);

  // Auto load messages if logged in
  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
      loadAffiliates();
      loadSalesData();
      loadWebsiteTemplates();
    }
  }, [isAuthenticated]);

  const loadWebsiteTemplates = async () => {
    setWebLoading(true);
    setWebErrorMsg('');
    try {
      const list = await fetchWebsiteTemplates();
      setWebsiteTemplates(list);
    } catch (e) {
      console.error("Failed to load website templates", e);
      setWebErrorMsg("Could not sync website templates.");
    } finally {
      setWebLoading(false);
    }
  };

  const loadSalesData = async () => {
    setSalesLoading(true);
    try {
      const [orderList, downloadList, webhookList] = await Promise.all([
        fetchOrders(),
        fetchDownloadLogs(),
        fetchWebhookLogs()
      ]);
      setOrders(orderList);
      setDownloadLogs(downloadList);
      setWebhookLogs(webhookList);
    } catch (e) {
      console.error("Monetization sales telemetry sync exception", e);
    } finally {
      setSalesLoading(false);
    }
  };

  const loadMessages = async () => {
    setMsgLoading(true);
    try {
      const list = await fetchContactInquiries();
      setMessages(list);
    } catch (e) {
      console.error(e);
    }
    setMsgLoading(false);
  };

  const loadAffiliates = async () => {
    try {
      const list = await fetchAffiliateProductsFromDB();
      setAffiliatesList(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveAffiliate = async (e: FormEvent) => {
    e.preventDefault();
    if (!affTitle || !affDescription || !affAmazonLink) return;

    setAffLoading(true);
    setAffSuccessMsg('');

    try {
      let finalImg = '';
      if (affImageFile) {
        finalImg = await uploadFileToStorage(affImageFile, 'previews');
      } else if (affManualImage.trim()) {
        finalImg = affManualImage.trim();
      } else {
        finalImg = 'https://images.unsplash.com/photo-1542744173-8e08562744ad?w=800';
      }

      await addAffiliateProductInDB({
        title: affTitle,
        description: affDescription,
        category: affCategory,
        image: finalImg,
        amazonLink: affAmazonLink
      });

      console.log("Firestore save success");
      setAffSuccessMsg('Affiliate product successfully registered and live!');
      
      // Reset affiliate fields
      setAffTitle('');
      setAffDescription('');
      setAffAmazonLink('');
      setAffManualImage('');
      setAffImageFile(null);
      
      // Reload lists
      loadAffiliates();
    } catch (err) {
      console.error(err);
    }
    setAffLoading(false);
  };

  const handleDeleteAffiliate = async (id: string) => {
    if (window.confirm('Delete this partner affiliate product from registry?')) {
      try {
        await deleteAffiliateProductFromDB(id);
        loadAffiliates();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const startEditWebsiteTemplate = (wt: WebsiteTemplate) => {
    setEditingWebsiteId(wt.id);
    setWebTitle(wt.title);
    setWebDescription(wt.description);
    setWebCategory(wt.category);
    setWebPrice(wt.price.toString());
    setWebLiveDemoUrl(wt.liveDemoUrl || '');
    setWebTechStackInput(wt.techStack ? wt.techStack.join(', ') : '');
    setWebManualImageUrls(wt.previewImages ? wt.previewImages.join(', ') : '');
    setWebManualDownloadUrl(wt.downloadFile || '');
    setWebFeatures(wt.features || []);
    setWebBulletFeature('');
    setWebPaymentLink(wt.paymentLink || '');
    
    // Scroll smoothly to form
    const container = document.getElementById('admin-websites-tab');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cancelEditWebsiteTemplate = () => {
    setEditingWebsiteId(null);
    setWebTitle('');
    setWebDescription('');
    setWebCategory('Business website');
    setWebPrice('');
    setWebLiveDemoUrl('');
    setWebTechStackInput('');
    setWebManualImageUrls('');
    setWebManualDownloadUrl('');
    setWebBulletFeature('');
    setWebFeatures([]);
    setWebPaymentLink('');
    setWebImageFiles(null);
    setWebDownloadFile(null);
  };

  const handleSaveWebsiteTemplate = async (e: FormEvent) => {
    e.preventDefault();
    if (!webTitle || !webDescription || !webPrice) return;

    setWebLoading(true);
    setWebSuccessMsg('');
    setWebErrorMsg('');

    try {
      // 1. Resolve preview images
      let imgUrls: string[] = [];
      if (webImageFiles && webImageFiles.length > 0) {
        setWebSuccessMsg(`Uploading 1 of ${webImageFiles.length} preview images...`);
        for (let i = 0; i < webImageFiles.length; i++) {
          const file = webImageFiles[i];
          setWebSuccessMsg(`Uploading preview image ${i + 1} of ${webImageFiles.length}...`);
          const uploadUrl = await uploadFileToStorage(file, 'previews');
          imgUrls.push(uploadUrl);
        }
      } else if (webManualImageUrls.trim()) {
        imgUrls = webManualImageUrls.split(',').map(url => url.trim()).filter(Boolean);
      } else {
        imgUrls = ['https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800'];
      }

      // 2. Resolve downloadable ZIP
      let dUrl = '';
      if (webDownloadFile) {
        setWebSuccessMsg(`Uploading template package "${webDownloadFile.name}"...`);
        dUrl = await uploadFileToStorage(webDownloadFile, 'digital_downloads');
      } else if (webManualDownloadUrl.trim()) {
        dUrl = webManualDownloadUrl.trim();
      } else {
        dUrl = 'https://assets.framsirona.org/default-template.zip';
      }

      const techStackArr = webTechStackInput
        ? webTechStackInput.split(',').map(s => s.trim()).filter(Boolean)
        : ['React', 'Tailwind CSS', 'Vite'];

      const finalPrice = parseFloat(webPrice) || 0;

      if (editingWebsiteId) {
        await updateWebsiteTemplate(editingWebsiteId, {
          title: webTitle,
          description: webDescription,
          category: webCategory,
          price: finalPrice,
          previewImages: imgUrls,
          liveDemoUrl: webLiveDemoUrl.trim() || 'https://framsirona-demo.web.app',
          techStack: techStackArr,
          downloadFile: dUrl,
          features: webFeatures.length > 0 ? webFeatures : ['Full Responsive Layout', 'Modern Aesthetic', 'Configured Vite Scripts'],
          paymentLink: webPaymentLink.trim() || ''
        });
        console.log("Firestore save success");
        setWebSuccessMsg('Website template updated successfully!');
        setEditingWebsiteId(null);
      } else {
        await addWebsiteTemplate({
          title: webTitle,
          description: webDescription,
          category: webCategory,
          price: finalPrice,
          previewImages: imgUrls,
          liveDemoUrl: webLiveDemoUrl.trim() || 'https://framsirona-demo.web.app',
          techStack: techStackArr,
          downloadFile: dUrl,
          features: webFeatures.length > 0 ? webFeatures : ['Full Responsive Layout', 'Modern Aesthetic', 'Configured Vite Scripts'],
          paymentLink: webPaymentLink.trim() || ''
        });
        console.log("Firestore save success");
        setWebSuccessMsg('Website template successfully cataloged and live!');
      }
      
      // Reset fields
      setWebTitle('');
      setWebDescription('');
      setWebCategory('Business website');
      setWebPrice('');
      setWebLiveDemoUrl('');
      setWebTechStackInput('');
      setWebManualImageUrls('');
      setWebManualDownloadUrl('');
      setWebBulletFeature('');
      setWebFeatures([]);
      setWebPaymentLink('');
      setWebImageFiles(null);
      setWebDownloadFile(null);

      loadWebsiteTemplates();
    } catch (err: any) {
      console.error(err);
      setWebErrorMsg(err.message || 'Failed to save website template.');
    } finally {
      setWebLoading(false);
    }
  };

  const handleDeleteWebsiteTemplate = async (id: string) => {
    if (window.confirm('Are you absolutely sure you want to delete this website template? This action cannot be undone.')) {
      try {
        await deleteWebsiteTemplate(id);
        if (editingWebsiteId === id) {
          cancelEditWebsiteTemplate();
        }
        loadWebsiteTemplates();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (passwordInput === '#Framsirona92') {
      setIsAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Access Denied. Incorrect administrator password token.');
    }
  };

  // Feature Bullet Point Handlers
  const handleAddFeature = () => {
    if (formBulletFeature.trim()) {
      setFormFeatures([...formFeatures, formBulletFeature.trim()]);
      setFormBulletFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormFeatures(formFeatures.filter((_, i) => i !== idx));
  };

  // TRIGGER EDIT FILL-IN
  const handleStartEdit = (product: Product) => {
    setIsEditing(product.id);
    setFormTitle(product.title);
    setFormDescription(product.description);
    setFormCategory(product.category as CategoryType);
    setFormPrice(product.price.toString());
    setFormFileSize(product.fileSize || '');
    setFormFileFormat(product.fileFormat || '');
    setFormFeatures(product.features || []);
    setFormPaymentLink(product.paymentLink || '');
    setManualImageUrls(product.previewImages.join(', '));
    setManualAssetUrl(product.downloadFile);
    
    // Clear uploads queue
    setImageFiles(null);
    setAssetFile(null);
    setActiveTab('create');
  };

  const validateAndPreviewImages = (files: FileList | null) => {
    setFileValidationError('');
    setPreviewSrcs([]);
    if (!files || files.length === 0) {
      setImageFiles(null);
      return;
    }

    const previewUrls: string[] = [];
    const allowedImageExts = ['png', 'jpg', 'jpeg'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      
      if (!allowedImageExts.includes(ext)) {
        setFileValidationError(`"${file.name}" is not a valid image format. Previews support: png, jpg, jpeg.`);
        setImageFiles(null);
        return;
      }
      
      const limitBytes = 10 * 1024 * 1024; // 10MB limit for previews
      if (file.size > limitBytes) {
        setFileValidationError(`"${file.name}" size exceeds 10MB preview limit.`);
        setImageFiles(null);
        return;
      }

      previewUrls.push(URL.createObjectURL(file));
    }

    setImageFiles(files);
    setPreviewSrcs(previewUrls);
  };

  const validateDigitalAsset = (file: File | null) => {
    setFileValidationError('');
    setAssetFilePreviewName('');
    setAssetFilePreviewSize('');
    if (!file) {
      setAssetFile(null);
      return;
    }

    const allowedAssetExts = ['png', 'jpg', 'jpeg', 'pdf', 'zip', 'psd'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (!allowedAssetExts.includes(ext)) {
      setFileValidationError(`"${file.name}" extension .${ext} is invalid. Allowed material payload formats are: png, jpg, jpeg, pdf, zip, psd.`);
      setAssetFile(null);
      return;
    }

    const limitBytes = 100 * 1024 * 1024; // 100MB limit for digital downloads
    if (file.size > limitBytes) {
      setFileValidationError(`"${file.name}" size exceeds the 100MB threshold.`);
      setAssetFile(null);
      return;
    }

    setAssetFile(file);
    setAssetFilePreviewName(file.name);
    setAssetFilePreviewSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    
    // Auto populate specs inputs
    setFormFileFormat(ext.toUpperCase());
    setFormFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
  };

  const handleSaveCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || !newCatDesc.trim()) return;

    setCatLoading(true);
    setCatSuccessMsg('');
    setCatErrorMsg('');

    try {
      let finalImg = '';
      if (newCatImageFile) {
        setCatSuccessMsg('Uploading category cover banner to Cloud Storage...');
        finalImg = await uploadFileToStorage(newCatImageFile, 'previews');
      } else if (newCatImageUrl.trim()) {
        finalImg = newCatImageUrl.trim();
      } else {
        // Default Unsplash placeholder or current image fallback
        finalImg = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80';
      }

      const formattedId = editingCategoryId || newCatName.trim();

      if (editingCategoryId) {
        const patchData: Partial<CategoryInfo> = {
          name: newCatName.trim(),
          description: newCatDesc.trim(),
          icon: newCatIcon,
        };
        if (newCatImageFile || newCatImageUrl.trim()) {
          patchData.imageUrl = finalImg;
        }

        await updateCategoryInDB(editingCategoryId, patchData);
        console.log("Firestore save success");
        setCatSuccessMsg(`Assortment Category "${formattedId}" updated successfully.`);
      } else {
        const existingCats = categories && categories.length > 0 ? categories : INITIAL_CATEGORIES;
        if (existingCats.some(c => c.id.toLowerCase() === formattedId.toLowerCase() || c.name.toLowerCase() === formattedId.toLowerCase())) {
          throw new Error(`Category "${formattedId}" is already registered in Framsirona archive.`);
        }

        await addCategoryInDB({
          id: formattedId,
          name: formattedId,
          description: newCatDesc.trim(),
          icon: newCatIcon,
          imageUrl: finalImg
        });
        console.log("Firestore save success");
        setCatSuccessMsg(`Assortment Category "${formattedId}" deployed live.`);
      }

      setNewCatName('');
      setNewCatDesc('');
      setNewCatIcon('Sparkles');
      setNewCatImageUrl('');
      setNewCatImageFile(null);
      setEditingCategoryId(null);
      onRefreshProducts(); // Synchronizes the central system list
    } catch (err: any) {
      setCatErrorMsg(err?.message || 'Firestore execution error on category write.');
    } finally {
      setCatLoading(false);
    }
  };

  const startEditCategory = (cat: CategoryInfo) => {
    setEditingCategoryId(cat.id);
    setNewCatName(cat.name);
    setNewCatDesc(cat.description);
    setNewCatIcon(cat.icon || 'Sparkles');
    setNewCatImageUrl(cat.imageUrl || '');
    setNewCatImageFile(null);
    setCatSuccessMsg('');
    setCatErrorMsg('');

    const element = document.getElementById('admin-categories-tab');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setNewCatName('');
    setNewCatDesc('');
    setNewCatIcon('Sparkles');
    setNewCatImageUrl('');
    setNewCatImageFile(null);
    setCatSuccessMsg('');
    setCatErrorMsg('');
  };

  const handleDeleteCategoryGroup = async (id: string) => {
    if (confirm(`Deprovision Category card "${id}"? All templates under this filter will be categorized fallback index.`)) {
      setCatLoading(true);
      setCatSuccessMsg('');
      setCatErrorMsg('');
      try {
        await deleteCategoryFromDB(id);
        setCatSuccessMsg(`Assortment Category "${id}" deprovisioned successfully.`);
        onRefreshProducts(); // Synchronizes the central system list
      } catch (err: any) {
        setCatErrorMsg(err?.message || 'Firestore execution error on category delete.');
      } finally {
        setCatLoading(false);
      }
    }
  };

  // CRUD RESETTERS
  const resetForm = () => {
    setIsEditing(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory(categories && categories.length > 0 ? categories[0].id as any : 'Poster templates');
    setFormPrice('');
    setFormFileSize('');
    setFormFileFormat('');
    setFormBulletFeature('');
    setFormFeatures([]);
    setFormPaymentLink('');
    setManualImageUrls('');
    setManualAssetUrl('');
    setImageFiles(null);
    setAssetFile(null);
    setPreviewSrcs([]);
    setAssetFilePreviewName('');
    setAssetFilePreviewSize('');
    setFileValidationError('');
  };

  // DISPATCH CREATE OR EDIT OPERATION
  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formPrice) return;

    setOperationLoading(true);
    setOperationSuccessMsg('');
    setErrorMessage('');

    try {
      // 1. Resolve preview images
      let imgUrls: string[] = [];
      if (imageFiles && imageFiles.length > 0) {
        setOperationSuccessMsg(`Uploading 1 of ${imageFiles.length} preview images to Cloud Storage...`);
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          setOperationSuccessMsg(`Uploading preview image ${i + 1} of ${imageFiles.length}...`);
          const uploadUrl = await uploadFileToStorage(file, 'previews');
          imgUrls.push(uploadUrl);
        }
      } else if (manualImageUrls.trim()) {
        imgUrls = manualImageUrls.split(',').map(url => url.trim()).filter(Boolean);
      } else {
        imgUrls = ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800'];
      }

      // 2. Resolve downloadable asset
      let dUrl = '';
      if (assetFile) {
        setOperationSuccessMsg(`Uploading payload material "${assetFile.name}" to Cloud Storage...`);
        dUrl = await uploadFileToStorage(assetFile, 'digital_downloads');
      } else if (manualAssetUrl.trim()) {
        dUrl = manualAssetUrl.trim();
      } else {
        dUrl = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800'; // fallback mock download Link
      }

      const pPrice = parseFloat(formPrice) || 0;
      
      const coreProductMeta = {
        title: formTitle,
        description: formDescription,
        category: formCategory,
        price: pPrice,
        previewImages: imgUrls,
        downloadFile: dUrl,
        fileSize: formFileSize || 'N/A',
        fileFormat: formFileFormat || 'Instant package',
        features: formFeatures,
        paymentLink: formPaymentLink,
        checkoutUrl: formPaymentLink || 'https://snippe.me/pay/framsirona-store',
        imageUrl: imgUrls[0] || '',
        downloadUrl: dUrl
      };

      setOperationSuccessMsg('Saving specifications configuration to Firestore database...');

      if (isEditing) {
        await updateStoreProduct(isEditing, coreProductMeta);
        console.log("Firestore save success");
        setOperationSuccessMsg('Product specifications amended successfully in Firestore!');
      } else {
        await addStoreProduct(coreProductMeta);
        console.log("Firestore save success");
        setOperationSuccessMsg('Digital product registered and deployed to Firestore catalogue successfully!');
      }

      onRefreshProducts();
      setTimeout(() => {
        resetForm();
        setOperationSuccessMsg('');
        setActiveTab('inventory');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : 'Database/Storage execution breach. Verify server connection.');
    }
    setOperationLoading(false);
  };

  // DELETE SINGLE Product
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you absolutely certain to delete this digital template? This action cannot be undone.')) {
      setOperationLoading(true);
      try {
        await deleteStoreProduct(id);
        onRefreshProducts();
        setOperationSuccessMsg('Item cataloged successfully terminated.');
        setTimeout(() => setOperationSuccessMsg(''), 1500);
      } catch (err) {
        console.error(err);
      }
      setOperationLoading(false);
    }
  };

  // 1. RENDER SECURE PASSWORD GATE SCREEN
  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 font-sans text-slate-800 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold font-sans text-slate-900 tracking-tight">Framsirona Store Admin Gate</h1>
            <p className="text-[11px] text-slate-500">
              Hidden credential endpoint mapping. Authorization security token verification required for backend editing accesses.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold font-mono tracking-wider text-slate-500">Security Key</label>
              <input
                required
                type="password"
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-mono tracking-widest text-slate-800 transition-colors"
              />
            </div>

            {errorMessage && (
              <div className="flex items-center space-x-2 text-[10px] font-mono text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl animate-bounce">
                <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 font-bold py-3.5 rounded-xl text-white hover:contrast-110 text-xs tracking-wider uppercase shadow-md hover:shadow-lg hover:shadow-blue-500/10 flex items-center justify-center space-x-2 cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Validate Admin Token</span>
            </button>
          </form>

          <button
            onClick={() => onNavigate('home')}
            className="block text-[11px] text-center mx-auto text-slate-400 hover:text-blue-600 font-mono underline cursor-pointer"
          >
            Cancel and abort login
          </button>
        </div>
      </div>
    );
  }

  // 2. RENDER THE PRIMARY ADMIN WORKSPACE PORTAL
  return (
    <div className="bg-slate-50 font-sans text-slate-800 min-h-screen py-10" id="admin-workspace">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Core Administrative Hero Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold font-sans text-slate-900 flex items-center gap-1.5 leading-none">
                <span>Framsirona Store Administrator Dashboard</span>
                <span className="text-[10px] text-blue-600 font-mono font-bold tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">Live CRUD Access</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Store state sync is active. Updates propagate automatically across simulated database components and Firestores.
            </p>
          </div>

          <div className="flex space-x-3 w-full sm:w-auto">
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPasswordInput('');
              }}
              className="bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-red-600 border border-slate-200 w-full sm:w-auto cursor-pointer transition-colors"
            >
              🔒 Terminate Session
            </button>
          </div>
        </div>

        {/* Dynamic Metric Blocks Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">Total Inventory</span>
              <span className="block text-xl font-mono font-bold text-slate-800">{products.length} Items</span>
            </div>
            <List className="w-8 h-8 text-blue-600 opacity-20" />
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">Categories Assorted</span>
              <span className="block text-xl font-mono font-bold text-slate-800">9 Channels</span>
            </div>
            <FolderLock className="w-8 h-8 text-indigo-600 opacity-20" />
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">Unresolved Inquiries</span>
              <span className="block text-xl font-mono font-bold text-slate-800">{messages.length} Records</span>
            </div>
            <Mail className="w-8 h-8 text-sky-600 opacity-20" />
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">Database Link</span>
              <span className="block text-xl font-mono font-bold text-blue-600 uppercase text-xs">Resilient Sync</span>
            </div>
            <Sparkles className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </div>

        {/* Tab Selection Navigation bar */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          {[
            { id: 'inventory', title: 'Inventory Listing', count: products.length },
            { id: 'websites', title: '🌐 Website Templates', count: websiteTemplates.length },
            { id: 'create', title: isEditing ? '✏️ Amendment Settings' : '➕ Register Template', count: null },
            { id: 'messages', title: 'Inbound Inquiries', count: messages.length },
            { id: 'categories', title: 'Category Metrics', count: null },
            { id: 'affiliates', title: '🤝 Affiliate Program', count: affiliatesList.length },
            { id: 'sales', title: '💰 Digital Sales & Webhooks', count: orders.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-xs font-bold uppercase tracking-wider font-sans border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-bold bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-blue-600'
              }`}
            >
              <span>{tab.title}</span>
              {tab.count !== null && <span className="ml-1.5 text-[9px] font-mono opacity-80 bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded">({tab.count})</span>}
            </button>
          ))}
        </div>

        {/* TAB WORKSPACE ROUTING CONDITIONAL */}
        
        {/* TAB A: INVENTORY LISTING */}
        {activeTab === 'inventory' && (
          <div className="space-y-6" id="admin-inventory-tab">
            
            {operationSuccessMsg && (
              <div className="flex items-center space-x-2 text-[11px] font-mono text-blue-600 bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{operationSuccessMsg}</span>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase tracking-widest font-mono text-[9px] border-b border-slate-200 font-bold">
                    <th className="p-4 pl-6">Cataloged Template</th>
                    <th className="p-4">Assortment Category</th>
                    <th className="p-4">Specs Metric</th>
                    <th className="p-4 text-blue-600">Price (USD)</th>
                    <th className="p-4 text-right pr-6">Database Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Title and metadata info block */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center space-x-3.5">
                            <img 
                              src={item.previewImages[0] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=120'} 
                              alt={item.title} 
                              referrerPolicy="no-referrer"
                              className="w-12 aspect-video rounded-lg object-cover border border-slate-200"
                            />
                            <div>
                              <span className="font-bold text-slate-800 block text-sm line-clamp-1">{item.title}</span>
                              <span className="block text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category badge */}
                        <td className="p-4">
                          <span className="bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-mono px-2.5 py-1 rounded-full">{item.category}</span>
                        </td>

                        {/* Metadata file characteristics */}
                        <td className="p-4">
                          <span className="block text-slate-600 font-mono text-[10px]">{item.fileFormat || 'Zip Pack'}</span>
                          <span className="block text-slate-400 text-[9px] font-mono">{item.fileSize || 'N/A'}</span>
                        </td>

                        {/* Stature value tag */}
                        <td className="p-4 font-mono font-bold text-blue-600">
                          ${item.price.toFixed(2)}
                        </td>

                        {/* Triggers list */}
                        <td className="p-4 text-right pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl text-blue-600 cursor-pointer transition-colors"
                              title="Amend Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item.id)}
                              className="p-2 border border-slate-200 bg-slate-50 hover:border-red-100 hover:bg-red-50 text-red-600 rounded-xl cursor-pointer transition-all"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-mono text-xs">
                        Active catalogue database operates empty. Use "Register Template" tab to configure templates.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB WEBSITES: WEBSITE TEMPLATES MANAGEMENT */}
        {activeTab === 'websites' && (
          <div className="space-y-8" id="admin-websites-tab">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-slate-900 text-base font-sans mt-0">Website Template Inventory Administration</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono mt-1">
                Directly catalog premium Jamstack, React, and HTML5 responsive website templates. Reconciled immediately with the public templates collection.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form to Create/Add Website Template */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mt-0">
                    {editingWebsiteId ? '✏️ Edit Website Template' : 'Deploy New Website Template'}
                  </h4>
                  <div className="h-0.5 w-10 bg-blue-600 mt-1 rounded"></div>
                </div>

                {webSuccessMsg && (
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-blue-600 bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{webSuccessMsg}</span>
                  </div>
                )}

                {webErrorMsg && (
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl shadow-sm font-bold">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{webErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveWebsiteTemplate} className="space-y-4 text-xs">
                  
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Template Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ascent Group - Tech Logistics Suite"
                      value={webTitle}
                      onChange={(e) => setWebTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 transition-all"
                    />
                  </div>

                  {/* Category select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Assortment Category Selection</label>
                    <select
                      value={webCategory}
                      onChange={(e) => setWebCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-3 cursor-pointer transition-all"
                    >
                      <option value="Business website">Business website</option>
                      <option value="Logistics company website">Logistics company website</option>
                      <option value="Accounting firm website">Accounting firm website</option>
                      <option value="Job board website">Job board website</option>
                      <option value="Church website">Church website</option>
                      <option value="Real estate website">Real estate website</option>
                      <option value="Creative agency website">Creative agency website</option>
                      <option value="Portfolio website">Portfolio website</option>
                      <option value="Barber shop website">Barber shop website</option>
                      <option value="Restaurant website">Restaurant website</option>
                      <option value="Ecommerce website">Ecommerce website</option>
                    </select>
                  </div>

                  {/* Price & Demo Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Pricing (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="29.00"
                        value={webPrice}
                        onChange={(e) => setWebPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-3 transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Live Demo Target URL</label>
                      <input
                        type="url"
                        placeholder="e.g. https://ascent-demo.com"
                        value={webLiveDemoUrl}
                        onChange={(e) => setWebLiveDemoUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-3 transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Tech Stack Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="React, Tailwind, Vite, TypeScript"
                      value={webTechStackInput}
                      onChange={(e) => setWebTechStackInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 transition-all font-mono"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Full Marketing Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe original specs, page variations, and custom developer adjustments..."
                      value={webDescription}
                      onChange={(e) => setWebDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-2.5 px-4 transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Built-in Features Bullets interactive List */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Bullet Features Checklist</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add high-conversion spec point..."
                        value={webBulletFeature}
                        onChange={(e) => setWebBulletFeature(e.target.value)}
                        className="flex-grow bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-2 px-3 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (webBulletFeature.trim()) {
                            setWebFeatures([...webFeatures, webBulletFeature.trim()]);
                            setWebBulletFeature('');
                          }
                        }}
                        className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl cursor-pointer block font-extrabold text-sm"
                      >
                        +
                      </button>
                    </div>
                    {webFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {webFeatures.map((feat, idx) => (
                          <span key={idx} className="inline-flex items-center space-x-1 font-mono text-[9px] bg-slate-100 text-slate-600 px-2 py-1 border border-slate-200 rounded-lg">
                            <span>{feat}</span>
                            <button
                              type="button"
                              onClick={() => setWebFeatures(webFeatures.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-700 font-bold ml-1.5 focus:outline-none bg-transparent border-none p-0 cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Images Upload block similar to regular templates */}
                  <div className="space-y-1.5 block bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Media Previews Selection</span>
                    
                    <div className="space-y-2 mt-2">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wide font-mono text-slate-500">A. Upload Native Preview Files</label>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => setWebImageFiles(e.target.files)}
                          className="w-full bg-white text-slate-600 border border-slate-200 rounded-lg py-1.5 px-3 font-mono text-[10px]"
                        />
                      </div>
                      
                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-2 text-[8px] font-mono text-slate-400 uppercase tracking-widest font-black">OR alternative URL</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wide font-mono text-slate-500">B. Key-in Fallback Images (comma-separated URLs)</label>
                        <input
                          type="text"
                          placeholder="https://ascent-assets/hero.jpg, https://ascent-assets/mockup.png"
                          value={webManualImageUrls}
                          onChange={(e) => setWebManualImageUrls(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-2 px-3 transition-colors font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Downloads upload file block */}
                  <div className="space-y-1.5 block bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Deliverable Zip Package File</span>
                    
                    <div className="space-y-2 mt-2">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wide font-mono text-slate-500">A. Upload Deliverable ZIP Archive File</label>
                        <input
                          type="file"
                          accept=".zip"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setWebDownloadFile(e.target.files[0]);
                            }
                          }}
                          className="w-full bg-white text-slate-600 border border-slate-200 rounded-lg py-1.5 px-3 font-mono text-[10px]"
                        />
                      </div>
                      
                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-2 text-[8px] font-mono text-slate-400 uppercase tracking-widest font-black">OR alternative URL</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-wide font-mono text-slate-500">B. Deliverable Download Link/URL</label>
                        <input
                          type="text"
                          placeholder="https://alternative-bucket.com/template-name.zip"
                          value={webManualDownloadUrl}
                          onChange={(e) => setWebManualDownloadUrl(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-2.5 px-3 transition-colors font-mono text-[10px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Snippe checkout link override */}
                  <div className="space-y-2 p-5 bg-blue-50/50 border border-blue-200 rounded-2xl">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600 tracking-wider block">Snippe Checkout Link</span>
                    <input
                      type="url"
                      placeholder="https://snippe.sh/p/website-template-name"
                      value={webPaymentLink}
                      onChange={(e) => setWebPaymentLink(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-blue-400 outline-none rounded-xl py-2.5 px-3 text-xs font-mono text-slate-800 transition-colors shadow-xs"
                    />
                    <p className="text-[9.5px] text-slate-500 font-mono leading-normal m-0">
                      Optional checkouts override. If provided, customers are redirected to this checkout link. If omitted, they access the high-conversion Snippe Interactive Simulator!
                    </p>
                  </div>

                  {/* Deploy button and Cancel button */}
                  <div className="space-y-2 mt-4">
                    <button
                      type="submit"
                      disabled={webLoading}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white font-bold py-3.5 rounded-xl cursor-pointer text-xs uppercase tracking-wider transition-all pt-3.5"
                    >
                      {webLoading ? (
                        <span className="block w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          <Database className="w-4 h-4" />
                          <span>{editingWebsiteId ? 'Save Template Changes' : 'Deploy Website Template'}</span>
                        </>
                      )}
                    </button>

                    {editingWebsiteId && (
                      <button
                        type="button"
                        onClick={cancelEditWebsiteTemplate}
                        className="w-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl cursor-pointer text-xs uppercase tracking-wider transition-all"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* Grid side: Table Registry List */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-xs">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-500 mt-0">Active Website Templates ({websiteTemplates.length})</span>
                  <button 
                    onClick={loadWebsiteTemplates} 
                    className="text-[9px] font-mono bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-bold"
                  >
                    Sync Grid
                  </button>
                </div>

                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[850px]">
                  {websiteTemplates.length > 0 ? (
                    websiteTemplates.map((wt) => (
                      <div key={wt.id} className="p-4 flex items-start space-x-4">
                        <img 
                          src={wt.previewImages[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800'} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 bg-slate-100 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                        />
                        <div className="flex-grow space-y-1 min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                            <span className="bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                              {wt.category}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-700">
                              ${wt.price.toFixed(2)}
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-900 truncate mt-1">{wt.title}</h5>
                          <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{wt.description}</p>
                          
                          <div className="flex items-center space-x-3 text-[10px] font-mono pt-1 text-slate-400">
                            {wt.liveDemoUrl && (
                              <a href={wt.liveDemoUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                Demo Link
                              </a>
                            )}
                            <span>•</span>
                            <span className="truncate max-w-[150px]" title={wt.downloadFile}>
                              Zip: {wt.downloadFile.substring(wt.downloadFile.lastIndexOf('/') + 1) || 'Link'}
                            </span>
                            {wt.paymentLink && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-600 font-bold" title={wt.paymentLink}>
                                  Snippe Link Attached
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 self-start flex-shrink-0">
                          <button
                            onClick={() => startEditWebsiteTemplate(wt)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              editingWebsiteId === wt.id
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-700'
                            }`}
                            title="Edit website template"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWebsiteTemplate(wt.id)}
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-xl transition-colors cursor-pointer"
                            title="Delete website template"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-slate-400 font-mono text-[11px]">
                      No custom website templates cataloged in Firestore. Fill out the deployment form to construct your inventory.
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB B: CREATE / REGISTER DIGITAL PRODUCT FORM */}
        {activeTab === 'create' && (
          <div className="space-y-6" id="admin-create-tab">
            
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isEditing ? '🔧 Amend Existing Template Specifications' : '✨ Register New Digital Resource'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Input files, specifications, descriptions, and tag configurations. Images & Downloads compile directly to Storage bucket.
                  </p>
                </div>
                {isEditing && (
                  <button onClick={resetForm} className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-mono text-[10px] px-3.5 py-1.5 rounded-lg cursor-pointer">
                    Abort Edit Adjustments
                  </button>
                )}
              </div>

              {operationSuccessMsg && (
                <div className="flex items-center space-x-2 text-[11px] font-mono text-blue-600 bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-xs mb-6 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>{operationSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-6">
                
                {/* Product Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black font-mono uppercase text-slate-500 tracking-wider">Template Title</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Modern Startup Pitch Slides"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 transition-colors"
                    />
                  </div>

                  {/* Category select menu for custom 9 templates classification */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black font-mono uppercase text-slate-500 tracking-wider">Classification Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-700 cursor-pointer"
                    >
                      {categoriesToRender.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black font-mono uppercase text-slate-500 tracking-wider">Functional Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide description specifications, recommended target audience, and layout guides..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 resize-none transition-colors"
                  ></textarea>
                </div>

                {/* Specs Block */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black font-mono uppercase text-slate-500 tracking-wider">Pricing (USD)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="19.00"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-mono text-slate-800 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black font-mono uppercase text-slate-500 tracking-wider">File Size (e.g. 12 MB / Link)</label>
                    <input
                      type="text"
                      placeholder="e.g. 45 MB / Links package"
                      value={formFileSize}
                      onChange={(e) => setFormFileSize(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black font-mono uppercase text-slate-500 tracking-wider">File Format Layout (e.g. PSD / Canva LINK)</label>
                    <input
                      type="text"
                      placeholder="e.g. Canva Template / Layered PSD"
                      value={formFileFormat}
                      onChange={(e) => setFormFileFormat(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 transition-colors"
                    />
                  </div>
                </div>

                {/* External Monetization Payment Link Override */}
                <div className="space-y-2 p-5 bg-blue-50/50 border border-blue-200 rounded-2xl">
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600 tracking-wider block">Snippe Checkout Link</span>
                  <input
                    type="url"
                    placeholder="https://snippe.sh/p/product-name"
                    value={formPaymentLink}
                    onChange={(e) => setFormPaymentLink(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-blue-400 outline-none rounded-xl py-2.5 px-3 text-xs font-mono text-slate-800 transition-colors shadow-xs"
                  />
                  <p className="text-[9.5px] text-slate-500 font-mono leading-normal m-0 whitespace-pre-line">
                    Paste your Snippe checkout/payment link here.
                    Example:
                    https://snippe.sh/p/product-name

                    Customers will securely complete payment through Snippe and automatically return to the secure download page after successful payment.
                  </p>
                </div>

                {/* FILE UPLOAD & STORAGE ROUTING PORTS */}
                <div className="space-y-4">
                  {fileValidationError && (
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-amber-600 bg-amber-50 border border-amber-200 p-3.5 rounded-xl shadow-xs">
                      <Info className="w-4 h-4 flex-shrink-0 animate-pulse text-amber-500" />
                      <span>{fileValidationError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    
                    {/* Image uploads to Storage */}
                    <div className="space-y-3.5">
                      <span className="block text-xs font-mono font-bold text-slate-600 uppercase tracking-widest flex items-center space-x-1">
                        <FileUp className="w-4 h-4 text-blue-600" />
                        <span>Preview Image Setup (Storage)</span>
                      </span>
                      
                      <div className="space-y-2">
                        <input
                          type="file"
                          multiple
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => validateAndPreviewImages(e.target.files)}
                          className="w-full text-xs text-slate-500 font-mono file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-slate-200 file:text-blue-600 hover:file:bg-slate-300 cursor-pointer"
                        />
                        <p className="text-[9px] text-slate-400 font-mono border-b border-dashed border-slate-100 pb-2">
                          Allowed types: <strong className="text-slate-600 text-[10px]">png, jpg, jpeg</strong> (max 10MB per image).
                        </p>
                      </div>

                      {/* LIVE THUMBNAIL PREVIEWS OF SELECTED IMAGES */}
                      {previewSrcs.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider block font-bold">Image Preview Before Upload</span>
                          <div className="grid grid-cols-4 gap-2 border border-slate-200 p-2 bg-white rounded-xl">
                            {previewSrcs.map((src, idx) => (
                              <div key={idx} className="relative aspect-square border border-slate-100 rounded-lg overflow-hidden group shadow-sm">
                                <img src={src} className="w-full h-full object-cover" alt="Upload target" />
                                <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[9px] text-white font-mono">#{idx+1}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase text-slate-500 tracking-wider block">Or manual absolute Image URLs (comma separated)</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/your-image, https://images.unsplash.com/your-image-2"
                          value={manualImageUrls}
                          onChange={(e) => setManualImageUrls(e.target.value)}
                          className="w-full bg-white border border-slate-200 outline-none rounded-xl py-2 px-3 text-[11px] text-slate-700 font-mono focus:border-blue-400"
                        />
                      </div>
                    </div>

                    {/* Digital materials payload upload to Storage */}
                    <div className="space-y-3.5">
                      <span className="block text-xs font-mono font-bold text-slate-600 uppercase tracking-widest flex items-center space-x-1">
                        <FileUp className="w-4 h-4 text-indigo-600" />
                        <span>Downloadable File Payload</span>
                      </span>

                      <div className="space-y-2">
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf,.zip,.psd"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              validateDigitalAsset(e.target.files[0]);
                            }
                          }}
                          className="w-full text-xs text-slate-500 font-mono file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-slate-200 file:text-indigo-600 hover:file:bg-slate-300 cursor-pointer"
                        />
                        <p className="text-[9px] text-slate-400 font-mono border-b border-dashed border-slate-100 pb-2">
                          Allowed payload formats: <strong className="text-slate-600 text-[10px]">png, jpg, jpeg, pdf, zip, psd</strong> (max 100MB).
                        </p>
                      </div>

                      {/* DISPLAY SELECTED DIGITAL PAYLOAD DETAILS */}
                      {assetFilePreviewName && (
                        <div className="border border-slate-200 bg-white p-3 rounded-xl flex items-center justify-between shadow-xs">
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <span className="text-[9px] font-mono font-bold text-indigo-500 block uppercase tracking-wider">File Selected</span>
                            <p className="text-[10px] font-mono font-bold text-slate-700 truncate">{assetFilePreviewName}</p>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded flex-shrink-0">
                            {assetFilePreviewSize}
                          </span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase text-slate-500 tracking-wider block">Or manual download absolute Link (e.g. Dropbox / Canva Share Link)</label>
                        <input
                          type="text"
                          placeholder="https://dropbox.com/s/your-file.zip or Canva Link"
                          value={manualAssetUrl}
                          onChange={(e) => setManualAssetUrl(e.target.value)}
                          className="w-full bg-white border border-slate-200 outline-none rounded-xl py-2 px-3 text-[11px] text-slate-700 font-mono focus:border-blue-400"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bullet template specifications setup */}
                <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <label className="text-xs font-mono font-bold text-slate-600 tracking-widest uppercase block">Configure Specific Highlights</label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Pre-mapped grids included, CMYK 300 DPI ready"
                      value={formBulletFeature}
                      onChange={(e) => setFormBulletFeature(e.target.value)}
                      className="flex-grow bg-white border border-slate-200 focus:border-blue-400 outline-none rounded-xl py-2.5 px-4 text-xs font-sans text-slate-800 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-5 rounded-xl border border-slate-200 font-bold cursor-pointer"
                    >
                      Add Spec
                    </button>
                  </div>

                  {formFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {formFeatures.map((feat, index) => (
                        <span key={index} className="inline-flex items-center space-x-1 text-[11px] font-mono bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-blue-600">
                          <span>{feat}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveFeature(index)}
                            className="text-red-600 hover:bg-red-50 font-black text-[12px] px-1 rounded-full ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Saving dispatcher */}
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/10 text-white font-bold py-4 rounded-xl cursor-pointer text-xs uppercase tracking-wider transition-all"
                >
                  {operationLoading ? (
                    <span className="block w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>{isEditing ? 'Commit Template Revision' : 'Register and Deploy to Store'}</span>
                    </>
                  )}
                </button>

              </form>
            </div>

          </div>
        )}

        {/* TAB C: INBOUND CONTACT INQUIRIES SUBMISSIONS VIEW */}
        {activeTab === 'messages' && (
          <div className="space-y-6" id="admin-messages-tab">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-slate-200 p-6 rounded-2xl gap-4 shadow-sm">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-sans">Contact Inquiries Database</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                  Logs incoming customer messages, licensing requests, and custom templates commissions.
                </p>
              </div>
              <button
                onClick={loadMessages}
                disabled={msgLoading}
                className="bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all font-mono text-[10px] px-4 py-2.5 text-slate-600 font-bold rounded-xl cursor-pointer"
              >
                {msgLoading ? 'Syncing...' : '🔄 Pull Live Inbound Messages'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm relative">
                    <span className="absolute top-4 right-4 text-[9px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono uppercase text-slate-400 tracking-wider">Inquirer Credentials</span>
                      <h4 className="font-bold text-slate-800 text-sm">{msg.name}</h4>
                      <span className="block text-xs font-mono text-blue-600 underline">{msg.email}</span>
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-1.5">
                      <span className="block text-[10px] font-mono uppercase text-slate-400 tracking-wider">Subject</span>
                      <p className="text-slate-800 text-xs font-sans font-bold">{msg.subject || '(None)'}</p>
                    </div>

                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl">
                      <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                        "{msg.message}"
                      </p>
                    </div>

                  </div>
                ))
              ) : (
                <div className="md:col-span-2 text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 font-mono text-xs">
                  Inbox empty. No client queries recorded.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB D: CATEGORY METRICS & TAXONOMY */}
        {activeTab === 'categories' && (
          <div className="space-y-6" id="admin-categories-tab">
            
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-slate-900 text-base font-sans mt-0">Strategic Classification Taxonomy</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono mt-1">
                Provision, modify, or deprovision product classification nodes live in Firebase Firestore. Customize card visual appearances, cover images, and scope descriptions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Create/Update Category Node */}
              <div className="lg:col-span-4 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mt-0 uppercase tracking-wider font-mono text-[10px]">
                    {editingCategoryId ? '✏️ Edit Category Node' : 'Deploy Category Node'}
                  </h4>
                  <div className="h-0.5 w-10 bg-blue-600 mt-1 rounded"></div>
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-4">
                  
                  {/* Category Name input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold font-mono tracking-wider text-slate-500 block">Category Identifier Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Video Overlays"
                      value={newCatName}
                      disabled={!!editingCategoryId}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 transition-colors disabled:opacity-50"
                    />
                    {editingCategoryId && <span className="text-[9px] text-slate-400 font-mono italic block mt-1">Classification route ID matches URL query route structure and cannot be modified after compilation.</span>}
                  </div>

                  {/* Category Description */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold font-mono tracking-wider text-slate-500 block">Scope Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. Asset kits with pre-rendered green screens..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 resize-none transition-colors"
                    />
                  </div>

                  {/* Icon Selector list */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold font-mono tracking-wider text-slate-500 block">Visual Motif Icon</label>
                    <select
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 outline-none rounded-xl py-3 px-4 text-xs font-sans text-slate-800 cursor-pointer"
                    >
                      <option value="Sparkles">✨ Sparkles</option>
                      <option value="Layers">🥞 Layers</option>
                      <option value="Compass">🧭 Compass</option>
                      <option value="Box">📦 Cargo Box</option>
                      <option value="Palette">🎨 Palette</option>
                      <option value="Ticket">🎟️ Ticket</option>
                      <option value="BookOpen">📖 Open Book</option>
                      <option value="FileCode">💻 File Code</option>
                      <option value="Receipt">🧾 Receipt</option>
                    </select>
                  </div>

                  {/* Category Banner Image inputs */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold font-mono tracking-wider text-slate-500 block">Category Cover Image</label>
                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="Manual cover image URL (Unsplash or direct link)"
                        value={newCatImageUrl}
                        onChange={(e) => setNewCatImageUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-400 focus:bg-white outline-none rounded-xl py-2.5 px-4 text-xs font-sans text-slate-800 transition-colors"
                      />
                      <div className="flex items-center justify-center p-3 border border-slate-200 bg-slate-50 border-dashed rounded-xl">
                        <label className="flex flex-col items-center justify-center cursor-pointer space-y-1 text-slate-500 hover:text-slate-700">
                          <FileUp className="w-4 h-4 text-slate-400" />
                          <span className="text-[10px] font-mono font-medium">
                            {newCatImageFile ? `Selected: ${newCatImageFile.name}` : "Upload banner image"}
                          </span>
                          <input
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setNewCatImageFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Feedback warnings */}
                  {catSuccessMsg && (
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                      <Check className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{catSuccessMsg}</span>
                    </div>
                  )}

                  {catErrorMsg && (
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl font-bold">
                      <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{catErrorMsg}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <button
                      type="submit"
                      disabled={catLoading}
                      className="w-full bg-slate-900 border border-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 text-[11px] tracking-widest uppercase shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all"
                    >
                      {catLoading ? (
                        <span className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        <>
                          {editingCategoryId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          <span>{editingCategoryId ? 'Save Specifications' : 'Deploy Category Node'}</span>
                        </>
                      )}
                    </button>

                    {editingCategoryId && (
                      <button
                        type="button"
                        onClick={cancelEditCategory}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[10px] py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* Right Column: Manage Category Items List */}
              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoriesToRender.map((cat) => {
                    const count = products.filter(p => p.category === cat.id).length;
                    return (
                      <div key={cat.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-blue-400 transition-colors">
                        
                        {/* Elegant category image preview header overlay */}
                        <div className="h-32 w-full relative bg-slate-100 overflow-hidden">
                          <img
                            src={cat.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600'}
                            alt={cat.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-mono text-white/90 border border-white/10 uppercase tracking-wider">
                            {cat.id}
                          </div>
                        </div>

                        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 font-bold">CATEGORY NODE</span>
                              
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => startEditCategory(cat)}
                                  className="p-1.5 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg text-blue-600 cursor-pointer transition-all duration-200"
                                  title="Edit Category Specifications"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategoryGroup(cat.id)}
                                  disabled={catLoading}
                                  className="p-1.5 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg text-red-500 cursor-pointer transition-all duration-200"
                                  title="Delete Category Node"
                                >
                                  <TrashIcon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <h3 className="font-extrabold text-slate-900 text-sm mt-1 mb-0 font-sans">
                              {cat.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 leading-normal mt-1 block h-12 overflow-hidden text-ellipsis line-clamp-3 font-sans">
                              {cat.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-400 font-semibold tracking-wider text-[9px]">Deployed items</span>
                            <span className="text-blue-600 font-extrabold bg-blue-50 px-2.5 py-1 rounded border border-blue-100">{count} products</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB E: MANAGE AMAZON PARTNERS AFFILIATES */}
        {activeTab === 'affiliates' && (
          <div className="space-y-8" id="admin-affiliates-tab">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-slate-900 text-base font-sans mt-0">Amazon Affiliate Manual Management</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-mono mt-1">
                Manually append and manage curated partner Amazon products. We never scrub Amazon automatically to maintain high-quality catalog alignments.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Manual Affiliate product addition form */}
              <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mt-0">Deploy New Partner Asset</h4>
                  <div className="h-0.5 w-10 bg-emerald-500 mt-1 rounded"></div>
                </div>

                {affSuccessMsg && (
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 p-4 rounded-xl shadow-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{affSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveAffiliate} className="space-y-4 text-xs">
                  
                  {/* Title field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Affiliate Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shure MV7 USB/XLR Vocal Microphone"
                      value={affTitle}
                      onChange={(e) => setAffTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white outline-none rounded-xl py-3 px-4 transition-all"
                    />
                  </div>

                  {/* Category choices field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Assortment Category</label>
                    <select
                      value={affCategory}
                      onChange={(e) => setAffCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white outline-none rounded-xl py-3 px-3 cursor-pointer transition-all"
                    >
                      <option value="Creator Essentials">Creator Essentials</option>
                      <option value="Recommended Tools">Recommended Tools</option>
                      <option value="Office & Business Tools">Office & Business Tools</option>
                    </select>
                  </div>

                  {/* Description field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Short Narrative / Review Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Meticulously written review or setup instructions highlighting product specs..."
                      value={affDescription}
                      onChange={(e) => setAffDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white outline-none rounded-xl py-3 px-4 resize-none transition-all"
                    />
                  </div>

                  {/* Amazon link field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Amazon Tagged Affiliate Link</label>
                    <input
                      type="url"
                      required
                      placeholder="e.g. https://www.amazon.com/dp/B08G7RG9ML/?tag=framsirona-20"
                      value={affAmazonLink}
                      onChange={(e) => setAffAmazonLink(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 focus:bg-white outline-none rounded-xl py-3 px-4 font-mono transition-all"
                    />
                  </div>

                  {/* Image manual url or file uploader */}
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Product Preview Photo Source</label>
                    
                    {/* File selector input */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 block pb-0.5">Choice A: Choose image file (Stores securely)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAffImageFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-slate-500 font-mono text-[10px] bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                      />
                    </div>

                    {/* Manual typed image url input */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 block pb-0.5">Choice B: Paste exact Unsplash/Web image URL</span>
                      <input
                        type="url"
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                        value={affManualImage}
                        disabled={!!affImageFile}
                        onChange={(e) => setAffManualImage(e.target.value)}
                        className="w-full bg-slate-50 disabled:opacity-50 border border-slate-200 focus:border-emerald-400 focus:bg-white outline-none rounded-xl py-2.5 px-4 font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <button
                    type="submit"
                    disabled={affLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/10 text-white font-bold py-3.5 rounded-xl cursor-pointer text-xs uppercase tracking-wider transition-all pt-3.5 mt-2"
                  >
                    {affLoading ? (
                      <span className="block w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        <span>Deploy Affiliate Card</span>
                      </>
                    )}
                  </button>

                </form>
              </div>

              {/* Existing Items Registry Table */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-xs">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-500 mt-0">Active Affiliate Registry ({affiliatesList.length})</span>
                  <button 
                    onClick={loadAffiliates} 
                    className="text-[9px] font-mono bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-bold"
                  >
                    Sync Grid
                  </button>
                </div>

                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
                  {affiliatesList.length > 0 ? (
                    affiliatesList.map((aff) => (
                      <div key={aff.id} className="p-4 flex items-start space-x-4">
                        <img 
                          src={aff.image} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 bg-slate-100 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                        />
                        <div className="flex-grow space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                              {aff.category}
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-900 truncate mt-1">{aff.title}</h5>
                          <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{aff.description}</p>
                          <a 
                            href={aff.amazonLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] font-mono text-emerald-600 hover:underline truncate block max-w-sm mt-1"
                          >
                            {aff.amazonLink}
                          </a>
                        </div>
                        <button
                          onClick={() => handleDeleteAffiliate(aff.id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-xl transition-colors cursor-pointer self-start"
                          title="Delete affiliate card"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-slate-400 font-mono text-[11px]">
                      No affiliate cards registered. Populate items via the deployment form.
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB F: DIGITAL SALES & WEBHOOK MONITOR */}
        {activeTab === 'sales' && (
          <div className="space-y-8" id="admin-sales-tab">
            
            {/* Sales Dashboard Metrics bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">Accumulated Gross Revenue</span>
                  <span className="block text-xl font-mono font-bold text-emerald-600">${orders.reduce((sum, o) => sum + o.pricePaid, 0).toFixed(2)}</span>
                </div>
                <Activity className="w-8 h-8 text-emerald-600 opacity-20" />
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold font-sans">Automated Dispatches</span>
                  <span className="block text-xl font-mono font-bold text-slate-800">{orders.length} Deliveries</span>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600 opacity-20" />
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">Secured Material Downloads</span>
                  <span className="block text-xl font-mono font-bold text-slate-800">{downloadLogs.length} Attempts</span>
                </div>
                <Clock className="w-8 h-8 text-indigo-600 opacity-20" />
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">Gateway Sandbox API</span>
                  <span className="block text-[11px] font-mono font-bold text-blue-600 uppercase tracking-wide">Sandbox Actively Hooked</span>
                </div>
                <Terminal className="w-8 h-8 text-indigo-500 opacity-20" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Orders History & Access Logs */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Transaction orders history */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm text-xs overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-500 mt-0">Customer Purchase Logs ({orders.length})</span>
                    </div>
                    <button 
                      onClick={loadSalesData}
                      disabled={salesLoading}
                      className="text-[9px] font-mono font-bold bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 flex items-center space-x-1"
                    >
                      {salesLoading ? <RefreshCw className="w-3 h-3 animate-spin text-slate-500" /> : null}
                      <span>Recalculate Telemetry</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 font-mono text-[9px] uppercase tracking-wider border-b border-slate-200">
                          <th className="p-3 pl-5">Recipient Order</th>
                          <th className="p-3">Deliverable Item</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3 font-mono">Expiring Access Code</th>
                          <th className="p-3 text-right pr-5">Licensing Timeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {orders.length > 0 ? (
                          [...orders].reverse().map((ord) => {
                            const isExpired = new Date() > new Date(ord.tokenExpiresAt);
                            return (
                              <tr key={ord.id} className="hover:bg-slate-50/50 transition-all">
                                <td className="p-3 pl-5">
                                  <span className="font-bold text-slate-800 block text-xs">{ord.buyerEmail}</span>
                                  <span className="text-[9px] font-mono text-slate-400 block uppercase">Gateway: {ord.paymentGateway} | {new Date(ord.createdAt).toLocaleDateString()}</span>
                                </td>
                                <td className="p-3">
                                  <span className="font-semibold text-slate-700 block truncate max-w-[170px]">{ord.productTitle}</span>
                                  <span className="text-[9.5px] font-mono text-slate-400 block">ID: #fs-{ord.productId}</span>
                                </td>
                                <td className="p-3 font-mono font-bold text-emerald-600">${ord.pricePaid.toFixed(2)}</td>
                                <td className="p-3">
                                  <span className="font-mono text-[10px] bg-slate-100 border border-slate-200 text-slate-600 p-1.5 rounded uppercase select-all font-semibold block truncate max-w-[110px]" title={ord.downloadToken}>
                                    {ord.downloadToken}
                                  </span>
                                </td>
                                <td className="p-3 text-right pr-5">
                                  {isExpired ? (
                                    <span className="text-[8.5px] font-mono uppercase bg-red-50 border border-red-100 text-red-500 px-2 py-0.5 rounded font-bold">
                                      Expired Key Blocked
                                    </span>
                                  ) : (
                                    <span className="text-[8.5px] font-mono uppercase bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded font-bold" title={`Expires at ${new Date(ord.tokenExpiresAt).toLocaleString()}`}>
                                      Active Link Safe
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-16 text-slate-400 font-mono text-[10.5px]">
                              Zero transactions processed yet. Trigger simulated orders from payment sandbox flows.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Download Access Tracking Logs */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm text-xs overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                       <CheckCircle className="w-4 h-4 text-indigo-500" />
                       <span className="font-mono text-[10px] uppercase font-bold text-slate-500 mt-0">Download Retrieval logs ({downloadLogs.length})</span>
                    </div>
                    <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 font-mono font-semibold px-2 py-0.5 rounded">
                      Secured Access Audit
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                    {downloadLogs.length > 0 ? (
                      [...downloadLogs].reverse().map((log) => (
                        <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-slate-800 text-xs truncate block max-w-[250px]">
                                {log.buyerEmail}
                              </span>
                              <span className="text-[8.5px] font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded">
                                {log.ipAddress}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-slate-400 truncate max-w-lg m-0 font-mono">
                              Downloaded file: <strong className="text-slate-600 font-sans font-semibold">{log.productTitle}</strong>
                            </p>
                            <span className="block text-[9px] text-slate-400 font-mono truncate max-w-sm">
                              {log.userAgent}
                            </span>
                          </div>
                          <div className="text-right flex-shrink-0 pl-4 space-y-1">
                            <span className="block text-[9px] text-slate-400 font-mono">
                              {new Date(log.downloadedAt).toLocaleString()}
                            </span>
                            {log.status === 'success' ? (
                              <span className="inline-block text-[8.5px] font-mono uppercase bg-emerald-50 text-emerald-600 px-1.5 py-0.5 border border-emerald-100 rounded font-bold">
                                GRANTED
                              </span>
                            ) : (
                              <span className="inline-block text-[8.5px] font-mono uppercase bg-red-50 text-red-500 px-1.5 py-0.5 border border-red-100 rounded font-bold">
                                DENIED
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 text-slate-400 font-mono text-[10.5px]">
                        No material download attempts recorded yet. Fully audited download tokens track visitor actions live.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Webhook Simulator form and terminal screen */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Simulated Order Incoming Webhook form */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                  <span className="text-[9.5px] font-mono uppercase font-bold text-slate-400 tracking-wider block font-bold">Sandbox Webhook simulation</span>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight m-0">Inbound Checkout Dispatcher</h4>
                    <p className="text-xs text-slate-400 leading-normal font-sans">
                      Simulate a live Snippe webhook transaction callback. This will trigger automated delivery and generate expiring download access keys instantaneously.
                    </p>
                  </div>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const targetSel = (e.currentTarget.elements.namedItem('testProduct') as HTMLSelectElement).value;
                      const targetMail = (e.currentTarget.elements.namedItem('testEmail') as HTMLInputElement).value;
                      if (!targetSel) return;
                      setOperationLoading(true);
                      try {
                        const targetProd = products.find(p => p.id === targetSel);
                        const titleStr = targetProd ? targetProd.title : 'Simulation Pack';
                        const priceVal = targetProd ? targetProd.price : 19.99;
                        await recordOrder({
                          productId: targetSel,
                          productType: 'product',
                          productTitle: titleStr,
                          buyerEmail: targetMail || 'buyer@sandbox-env.io',
                          pricePaid: priceVal,
                          paymentGateway: 'Snippe',
                          paymentIntentId: 'snippe_webhook_sim_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                          status: 'completed'
                        });
                        await loadSalesData();
                        (e.target as HTMLFormElement).reset();
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setOperationLoading(false);
                      }
                    }} 
                    className="space-y-3"
                  >
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-500 font-mono block">Buyer Account Email</label>
                      <input 
                        type="email" 
                        name="testEmail"
                        placeholder="buyer@sandbox-env.io"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-500 font-mono block">Select Catalog Item to Buy</label>
                      <select 
                        name="testProduct"
                        required
                        className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-500 font-sans cursor-pointer"
                      >
                        <option value="">-- Choose Product to Order --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.title} (${p.price.toFixed(2)})</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={operationLoading}
                      className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-55 px-4 py-3 rounded-xl text-xs font-mono font-bold uppercase cursor-pointer flex items-center justify-center space-x-2 transition-all mt-3"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Trigger Inbound Webhook</span>
                    </button>
                  </form>
                </div>

                {/* monospaced Webhook Receiver Live Logs Console */}
                <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl shadow-xl space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-300">Webhook Monitor terminal</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse block"></span>
                  </div>

                  <div className="font-mono text-[9px] leading-relaxed text-emerald-500 bg-black/45 p-3 rounded-lg border border-slate-900 h-64 overflow-y-auto space-y-2">
                    {webhookLogs.length > 0 ? (
                      [...webhookLogs].reverse().map((wh, idx) => (
                        <div key={wh.id || idx} className="space-y-0.5 border-b border-slate-900 pb-2">
                          <p className="text-slate-400 m-0 text-[8.5px]">[{new Date(wh.receivedAt).toLocaleTimeString()}] INBOUND WEBHOOK DISPATCH</p>
                          <p className="m-0 text-amber-300 font-bold">Event: {wh.event}</p>
                          <p className="m-0 text-slate-500 text-[8px] truncate">Gateway: {wh.gateway}</p>
                          <p className="m-0 text-emerald-600 block opacity-85 select-all overflow-x-auto text-[8px] whitespace-pre-wrap leading-tight">
                            {wh.payload}
                          </p>
                          <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded text-[7.5px] uppercase font-bold mt-1">
                            Status: {wh.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 animate-pulse m-0">
                        Listening for incoming Snippe webhook trigger callbacks... [CONSOLE IDLE]
                      </p>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
