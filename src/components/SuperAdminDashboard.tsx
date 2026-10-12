import React, { useState, useRef } from 'react';
import {
  BarChart2,
  Package,
  Layers,
  Receipt,
  Users,
  LayoutTemplate,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Save,
  Truck,
  Images,
  Camera,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  LogOut,
  ExternalLink,
  Store,
  ShieldCheck,
  Database,
  Search,
  MessageCircle,
  AlertTriangle,
  IndianRupee,
  UploadCloud,
  Wallet,
  ShoppingBag,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Cloud,
  AlertCircle,
  ArrowLeft,
  FolderPlus,
  FileCheck,
  Moon,
  Sun,
} from 'lucide-react';
import {
  ProductCatalogItem,
  CategoryTaxonomyItem,
  RegionalOrder,
  ALL_ORDER_STATUSES,
  OrderStatusType,
  CustomerAccount,
  SellerAccount,
  SellerActivityLog,
  HomepageConfig,
  StoreSettingsConfig,
  ShopExpenseItem,
  EXTRA_UPLOAD_POOL,
} from '../data/catalogData';
import {
  signInWithGooglePopup,
  syncSellerToFirestore,
  syncProductToFirestore,
  syncOrderToFirestore,
} from '../lib/firebase';
import { uploadImageToImgBB } from '../lib/imgbb';
import { ReyazLogo } from './ReyazLogo';

// ============================================================================
// 1. DEDICATED TONER BACKEND ADMIN & SELLER SIGN-IN PAGE
// ============================================================================
interface TonerAdminLoginPageProps {
  sellers: SellerAccount[];
  onBackToStorefront: () => void;
  onSuccessManagementLogin: (account: {
    id?: string;
    email: string;
    name: string;
    role: 'super_admin' | 'seller';
    department?: string;
  }) => void;
}

export const TonerAdminLoginPage: React.FC<TonerAdminLoginPageProps> = ({
  sellers,
  onBackToStorefront,
  onSuccessManagementLogin,
}) => {
  const [roleTab, setRoleTab] = useState<'super_admin' | 'seller'>('super_admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/management-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: roleTab,
          sellers,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        // Fallback check if Super Admin credentials match directly
        if (
          roleTab === 'super_admin' &&
          email.trim().toLowerCase() === 'nasirhussain12489@gmail.com' &&
          password === '9934886605dilD@'
        ) {
          onSuccessManagementLogin({
            email: 'nasirhussain12489@gmail.com',
            name: 'Super Admin (Nasir Hussain)',
            role: 'super_admin',
          });
          return;
        }
        setErrorMsg(data.error || 'Invalid Admin / Seller credentials');
      } else if (data.success && data.account) {
        onSuccessManagementLogin(data.account);
      }
    } catch {
      if (
        email.trim().toLowerCase() === 'nasirhussain12489@gmail.com' &&
        password === '9934886605dilD@'
      ) {
        onSuccessManagementLogin({
          email: 'nasirhussain12489@gmail.com',
          name: 'Super Admin (Nasir Hussain)',
          role: 'super_admin',
        });
      } else {
        setErrorMsg('Authentication error. Please check your email and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setErrorMsg(null);
    try {
      const res = await signInWithGooglePopup();
      const emailLower = (res.user.email || '').toLowerCase();

      if (emailLower === 'nasirhussain12489@gmail.com') {
        onSuccessManagementLogin({
          email: 'nasirhussain12489@gmail.com',
          name: res.user.displayName || 'Super Admin (Nasir Hussain)',
          role: 'super_admin',
        });
        return;
      }

      const matchedSeller = sellers.find(
        (s) => s.email.toLowerCase() === emailLower && s.active
      );
      if (matchedSeller) {
        onSuccessManagementLogin({
          id: matchedSeller.id,
          email: matchedSeller.email,
          name: matchedSeller.name,
          role: 'seller',
          department: matchedSeller.department,
        });
        return;
      }

      setErrorMsg(
        `Signed in as ${res.user.email}, which is not registered as Super Admin (nasirhussain12489@gmail.com) or an active Seller.`
      );
    } catch {
      setErrorMsg(
        'Google Sign-In popup was closed or blocked in preview. Please sign in using your Admin Gmail and Password below.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-between relative overflow-hidden">
      {/* Subtle Background Grid Accent */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-6 flex items-center justify-between relative z-10">
        <ReyazLogo size="md" theme="dark" onClick={onBackToStorefront} />
        <button
          type="button"
          onClick={onBackToStorefront}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#F5CE62]" />
          <span>Back to Customer Storefront</span>
        </button>
      </div>

      {/* Main Toner Split Sign-In Card */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200">
          {/* Left Branding Panel (Toner Style) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0D1B2A] via-[#1E293B] to-[#0F172A] text-white p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F5CE62]/15 text-[#F5CE62] text-[11px] font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Toner eCommerce Backend</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight text-white">
                Reyaz Shopping Center Admin Portal
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete backend control for Products, Multi-Photo Uploads, Categories, Subcategories, Cash on Delivery Orders, Sellers, and Daily Sales &amp; Profit (`Aaj Kitna Bika &amp; Faida`).
              </p>
            </div>

            <div className="space-y-3 pt-8 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full Product, Category &amp; Inventory Control</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live Daily Sales &amp; Net Profit (Faida) Analytics</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Horanda Alias Ramgarh (822110) COD Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Welcome Back!
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in to continue to Reyaz Shopping Center Backend.
                </p>
              </div>
            </div>

            {/* Role Switcher: Super Admin | Seller */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setRoleTab('super_admin');
                  setErrorMsg(null);
                }}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  roleTab === 'super_admin'
                    ? 'bg-[#0D1B2A] text-[#F5CE62] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Super Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoleTab('seller');
                  setErrorMsg(null);
                }}
                className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  roleTab === 'seller'
                    ? 'bg-[#0D1B2A] text-[#F5CE62] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Seller / Staff Login</span>
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {roleTab === 'super_admin'
                    ? 'Super Admin Gmail Address'
                    : 'Seller Email or Mobile Number'}
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    roleTab === 'super_admin'
                      ? 'nasirhussain12489@gmail.com'
                      : 'Enter Seller Email or Mobile'
                  }
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#0D1B2A] focus:bg-white rounded-xl px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0D1B2A] focus:bg-white rounded-xl pl-4 pr-10 py-3 text-xs font-medium text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#0D1B2A]"
                  />
                  <span>Remember session</span>
                </label>
                <span className="text-slate-400 text-[11px]">
                  Protected by Salted SHA-256 &amp; Firebase Auth
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0D1B2A] hover:bg-[#1E293B] text-white font-bold text-xs py-3.5 rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                {isLoading
                  ? 'Signing In to Backend...'
                  : roleTab === 'super_admin'
                  ? 'Sign In to Super Admin Backend'
                  : 'Sign In to Seller Backend'}
              </button>
            </form>

            <div className="relative py-1 text-center">
              <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 relative z-10">
                Sign In with Google OAuth
              </span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleAdminLogin}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 border-2 border-[#D4AF37] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Cloud className="w-4 h-4 text-[#B8860B]" />
              <span>
                Sign in with Google (nasirhussain12489@gmail.com → Super Admin)
              </span>
            </button>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Reyaz Shopping Center • Horanda Alias Ramgarh (822110), Palamu, Jharkhand
      </footer>
    </div>
  );
};

// ============================================================================
// 2. TONER E-COMMERCE BACKEND ADMIN & SELLER COMMAND CENTER
// ============================================================================
interface SuperAdminDashboardProps {
  accountRole: 'super_admin' | 'seller';
  accountName: string;
  accountEmail: string;
  adminAvatarUrl: string | null;
  onUpdateAdminAvatar: (url: string | null) => void;
  products: ProductCatalogItem[];
  categories: CategoryTaxonomyItem[];
  orders: RegionalOrder[];
  customers: CustomerAccount[];
  sellers: SellerAccount[];
  sellerLogs: SellerActivityLog[];
  expenses: ShopExpenseItem[];
  homepageConfig: HomepageConfig;
  storeSettings: StoreSettingsConfig;
  onUpdateProducts: (
    updater: (prev: ProductCatalogItem[]) => ProductCatalogItem[]
  ) => void;
  onSaveProductToCloud: (product: ProductCatalogItem) => void;
  onUpdateCategories: (next: CategoryTaxonomyItem[]) => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatusType) => void;
  onAddOrder: (newOrder: RegionalOrder) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateCustomers: (next: CustomerAccount[]) => void;
  onUpdateSellers: (next: SellerAccount[]) => void;
  onUpdateExpenses: (next: ShopExpenseItem[]) => void;
  onLogSellerAction: (action: string, targetSkuOrOrder: string) => void;
  onUpdateHomepage: (next: HomepageConfig) => void;
  onUpdateSettings: (next: StoreSettingsConfig) => void;
  onDeleteReview: (productId: string, reviewId: string) => void;
  onSaveAllToServerDb: () => void;
  onExitToStorefront: () => void;
  onLogoutAdmin: () => void;
  triggerToast: (msg: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  accountRole,
  accountName,
  accountEmail,
  adminAvatarUrl,
  onUpdateAdminAvatar,
  products,
  categories,
  orders,
  customers,
  sellers,
  sellerLogs,
  expenses,
  homepageConfig,
  storeSettings,
  onUpdateProducts,
  onSaveProductToCloud,
  onUpdateCategories,
  onUpdateOrderStatus,
  onAddOrder,
  onDeleteOrder,
  onUpdateCustomers,
  onUpdateSellers,
  onUpdateExpenses,
  onLogSellerAction,
  onUpdateHomepage,
  onUpdateSettings,
  onDeleteReview,
  onSaveAllToServerDb,
  onExitToStorefront,
  onLogoutAdmin,
  triggerToast,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'finance'
    | 'upload'
    | 'products'
    | 'editor'
    | 'categories'
    | 'orders'
    | 'shipments'
    | 'sellers'
    | 'customers'
    | 'homepage'
    | 'reviews'
    | 'settings'
  >('dashboard');

  const [sidebarDark, setSidebarDark] = useState(true);
  const [productsMenuOpen, setProductsMenuOpen] = useState(true);
  const [chartRange, setChartRange] = useState<'TODAY' | '7D' | '1M' | '1Y'>('TODAY');

  const [activeProductId, setActiveProductId] = useState<string>(
    products[0]?.id || 'prod-floral-maxi-01'
  );
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<string>('All');

  // ================= NEW PRODUCT UPLOAD STUDIO STATE (TONER 2-COL CREATE PRODUCT) =================
  const [upTitle, setUpTitle] = useState('');
  const [upBrand, setUpBrand] = useState('Reyaz Exclusive');
  const [upSku, setUpSku] = useState(`RSC-NEW-${101 + products.length}`);
  const [upCat, setUpCat] = useState<'Women' | 'Men' | 'Kids'>('Women');
  const [upSubCat, setUpSubCat] = useState('Dresses');
  const [upType, setUpType] = useState('Festive Outfit');
  const [upCostPrice, setUpCostPrice] = useState<number>(650);
  const [upMrp, setUpMrp] = useState<number>(1999);
  const [upSellingPrice, setUpSellingPrice] = useState<number>(1199);
  const [upRack, setUpRack] = useState('Horanda Hub Rack #A-02');
  const [upDesc, setUpDesc] = useState(
    'Premium quality fashion wear crafted for comfort and durability. Eligible for Free Doorstep Cash on Delivery in Horanda Alias Ramgarh (822110).'
  );
  const [upFabric, setUpFabric] = useState('Pure Cotton / Silk Blend');
  const [upPattern, setUpPattern] = useState('Embroidered / Printed');
  const [upNeck, setUpNeck] = useState('Round / Collar');
  const [upSleeve, setUpSleeve] = useState('Full / 3/4 Sleeve');
  const [upLength, setUpLength] = useState('Regular');
  const [upFit, setUpFit] = useState('Regular Comfort Fit');
  const [upCare, setUpCare] = useState('Gentle Wash');
  const [upPhotos, setUpPhotos] = useState<string[]>([]);
  const [upImageUrlInput, setUpImageUrlInput] = useState('');
  const [upSizes, setUpSizes] = useState<
    { code: string; chest: string; stock: number }[]
  >([
    { code: 'S', chest: '36"', stock: 6 },
    { code: 'M', chest: '38"', stock: 10 },
    { code: 'L', chest: '40"', stock: 8 },
    { code: 'XL', chest: '42"', stock: 6 },
    { code: 'XXL', chest: '44"', stock: 4 },
  ]);
  const [upColors, setUpColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Royal Gold', hex: '#D4AF37' },
    { name: 'Deep Navy', hex: '#0D1B2A' },
    { name: 'Crimson Maroon', hex: '#7A1C24' },
  ]);
  const [upFeatured, setUpFeatured] = useState(true);
  const [upNew, setUpNew] = useState(true);
  const [upPopular, setUpPopular] = useState(true);
  const [upTrending, setUpTrending] = useState(true);

  // ================= DUKAN COUNTER SALE (OFFLINE POS) & EXPENSE STATE =================
  const [posProductId, setPosProductId] = useState<string>(
    products[0]?.id || ''
  );
  const [posSize, setPosSize] = useState<string>('M');
  const [posQty, setPosQty] = useState<number>(1);
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('');

  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] =
    useState<ShopExpenseItem['category']>('Delivery Boy');
  const [expAmount, setExpAmount] = useState<number>(100);

  // Size addition state for Editor
  const [newSizeCode, setNewSizeCode] = useState('3XL');
  const [newSizeChest, setNewSizeChest] = useState('46"');
  const [newSizeStock, setNewSizeStock] = useState(5);

  // Color addition state for Editor
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#1E3A8A');

  // Category Management inputs
  const [newCatName, setNewCatName] = useState('');
  const [newCatTagline, setNewCatTagline] = useState('');
  const [newSubcatInputs, setNewSubcatInputs] = useState<
    Record<string, string>
  >({});

  // Seller creation inputs (Super Admin only)
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [sellerDept, setSellerDept] =
    useState<SellerAccount['department']>('All Departments');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadStudioFileRef = useRef<HTMLInputElement | null>(null);
  const adminAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const bannerFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingToImgBB, setIsUploadingToImgBB] = useState(false);

  const product =
    products.find((p) => p.id === activeProductId) || products[0];

  const updateActiveProduct = (
    updater: (prev: ProductCatalogItem) => ProductCatalogItem
  ) => {
    onUpdateProducts((prevList) =>
      prevList.map((item) => (item.id === product.id ? updater(item) : item))
    );
  };

  // ================= REAL-TIME FINANCIALS: AAJ KITNA BIKA & KITNE KA FAIDA HUA =================
  const validOrders = orders.filter((o) => o.status !== 'Cancelled');
  const todayOrders = validOrders.filter(
    (o) =>
      o.isToday === true ||
      o.timestamp.toLowerCase().includes('today') ||
      o.timestamp.toLowerCase().includes('just now')
  );

  const calculateOrderGrossProfit = (ord: RegionalOrder): number => {
    if (typeof ord.estimatedProfit === 'number') {
      return ord.estimatedProfit;
    }
    if (ord.items && ord.items.length > 0) {
      return ord.items.reduce((sum, it) => {
        const matchedProd = products.find(
          (p) => p.id === it.productId || p.sku === it.sku
        );
        const unitCost =
          it.costPrice ??
          matchedProd?.costPrice ??
          Math.round(it.unitPrice * 0.6);
        return sum + Math.max(0, it.unitPrice - unitCost) * it.quantity;
      }, 0);
    }
    return Math.round(ord.amount * 0.38);
  };

  const todaySalesRevenue = todayOrders.reduce((sum, o) => sum + o.amount, 0);
  const todayUnitsSold = todayOrders.reduce((sum, o) => sum + o.quantity, 0);
  const todayGrossProfit = todayOrders.reduce(
    (sum, o) => sum + calculateOrderGrossProfit(o),
    0
  );
  const todayExpensesTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const todayNetProfit = todayGrossProfit - todayExpensesTotal;

  const totalRevenue = validOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalGrossProfit = validOrders.reduce(
    (sum, o) => sum + calculateOrderGrossProfit(o),
    0
  );
  const pendingOrdersCount = orders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;
  const deliveredOrdersCount = orders.filter(
    (o) => o.status === 'Delivered'
  ).length;
  const shippedOrdersCount = orders.filter(
    (o) => o.status === 'Shipped' || o.status === 'Out for Delivery'
  ).length;
  const lowStockProducts = products.filter(
    (p) => p.sizes.reduce((s, item) => s + item.stock, 0) <= 10
  );

  // Category distribution counts for Toner Sales by Category widget
  const menCount = products.filter((p) => p.primaryCategory === 'Men').length;
  const womenCount = products.filter(
    (p) => p.primaryCategory === 'Women'
  ).length;
  const kidsCount = products.filter((p) => p.primaryCategory === 'Kids').length;
  const totalProdCount = Math.max(1, products.length);

  // Upload Studio Photo Handler -> Uploads directly to ImgBB (https://imgbb.com/)
  const handleUploadStudioFiles = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith('image/')
    );
    e.target.value = '';
    if (validFiles.length === 0) return;

    setIsUploadingToImgBB(true);
    triggerToast(`Uploading ${validFiles.length} photo(s) to ImgBB...`);
    try {
      const uploadedUrls: string[] = [];
      for (const file of validFiles) {
        const hostedUrl = await uploadImageToImgBB(
          file,
          upTitle.trim() || file.name
        );
        uploadedUrls.push(hostedUrl);
      }
      setUpPhotos((prev) => [...prev, ...uploadedUrls]);
      triggerToast(
        `Uploaded ${uploadedUrls.length} photo(s) to ImgBB successfully!`
      );
    } catch {
      triggerToast('Error uploading image to ImgBB');
    } finally {
      setIsUploadingToImgBB(false);
    }
  };

  const handlePublishUploadedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upTitle.trim()) {
      triggerToast('Please enter a Product Name / Title');
      return;
    }
    const newId = `prod-${Date.now()}`;
    const finalSku =
      upSku.trim() || `RSC-${upCat.slice(0, 1)}-${100 + products.length + 1}`;
    const galleryPhotos =
      upPhotos.length > 0
        ? upPhotos.map((url, idx) => ({
            id: `up-img-${Date.now()}-${idx}`,
            title: idx === 0 ? 'Cover Photo' : `Angle View ${idx + 1}`,
            url,
            isCover: idx === 0,
          }))
        : [
            {
              id: `up-default-${Date.now()}`,
              title: 'Cover Photo',
              url: products[0]?.mediaGallery[0]?.url || '',
              isCover: true,
            },
          ];

    const created: ProductCatalogItem = {
      id: newId,
      sku: finalSku,
      status: 'Active • In Stock',
      createdByRole: accountRole,
      createdByEmail: accountEmail,
      createdByName: accountName,
      brandName: upBrand.trim() || 'Reyaz Exclusive',
      title: upTitle.trim(),
      primaryCategory: upCat,
      subCategory: upSubCat,
      productType: upType.trim() || upSubCat,
      shortDescription: upDesc.slice(0, 110),
      description: upDesc,
      costPrice: Math.max(0, Number(upCostPrice) || 0),
      regularMrp: Math.max(1, Number(upMrp) || 1999),
      sellingPrice: Math.max(1, Number(upSellingPrice) || 999),
      regionalCodEnabled: true,
      isNew: upNew,
      isFeatured: upFeatured,
      isPopular: upPopular,
      isTrending: upTrending,
      isVisible: true,
      rating: 4.8,
      reviewCount: 1,
      reviews: [],
      mediaGallery: galleryPhotos,
      specs: {
        fabric: upFabric,
        pattern: upPattern,
        neck: upNeck,
        sleeve: upSleeve,
        length: upLength,
        fit: upFit,
        careInstructions: upCare,
      },
      warehouseLocation: upRack,
      sizes: upSizes.map((s) => ({
        code: s.code,
        label: `${s.code} (${s.chest})`,
        chest: s.chest,
        stock: Math.max(0, Number(s.stock) || 0),
      })),
      colorShades: upColors.map((c, idx) => ({
        id: `clr-${Date.now()}-${idx}`,
        name: c.name,
        hex: c.hex,
      })),
      updatedAt: 'Just now',
    };

    onUpdateProducts((prev) => [created, ...prev]);
    onSaveProductToCloud(created);
    onLogSellerAction(
      `Uploaded new product "${created.title}" (Price: ₹${created.sellingPrice}, Cost: ₹${created.costPrice})`,
      created.sku
    );
    setActiveProductId(newId);
    setUpTitle('');
    setUpPhotos([]);
    setUpSku(`RSC-NEW-${102 + products.length}`);
    setActiveTab('products');
    triggerToast(
      `Published "${created.title}" (${created.sku}) to Storefront & Database!`
    );
  };

  // Record Walk-in Dukan Counter Sale (Offline POS)
  const handleRecordPosSale = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProd =
      products.find((p) => p.id === posProductId) || products[0];
    if (!targetProd) return;
    const qty = Math.max(1, Number(posQty) || 1);
    const unitSell = targetProd.sellingPrice;
    const unitCost =
      targetProd.costPrice ?? Math.round(targetProd.sellingPrice * 0.6);
    const totalAmt = unitSell * qty;
    const profitAmt = Math.max(0, unitSell - unitCost) * qty;

    const posOrder: RegionalOrder = {
      id: `pos-${Date.now()}`,
      orderNumber: `POS-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: `walkin-${Date.now()}`,
      customerName: posCustomerName.trim() || 'Walk-in Dukan Customer',
      customerPhone: posCustomerPhone.trim() || '9693935479',
      customerWhatsapp: posCustomerPhone.trim() || '9693935479',
      customerEmail: 'walkin@reyazshoppingcenter.in',
      villageArea: 'Horanda Alias Ramgarh (Dukan Counter)',
      district: 'Palamu',
      state: 'Jharkhand',
      pinCode: '822110',
      fullAddress: 'Reyaz Shopping Center Main Showroom Counter, Horanda',
      orderNotes: `Sold at shop counter by ${accountName}`,
      sku: targetProd.sku,
      productTitle: targetProd.title,
      size: posSize,
      shade: targetProd.colorShades[0]?.name || 'Standard',
      quantity: qty,
      amount: totalAmt,
      estimatedProfit: profitAmt,
      isToday: true,
      soldBySellerName: accountName,
      deliveryCharge: 0,
      items: [
        {
          productId: targetProd.id,
          sku: targetProd.sku,
          title: targetProd.title,
          imageUrl: targetProd.mediaGallery[0]?.url || '',
          size: posSize,
          colorName: targetProd.colorShades[0]?.name || 'Standard',
          costPrice: unitCost,
          unitPrice: unitSell,
          quantity: qty,
        },
      ],
      status: 'Delivered',
      timestamp: 'Today, Just now',
    };

    onUpdateProducts((prev) =>
      prev.map((p) =>
        p.id === targetProd.id
          ? {
              ...p,
              sizes: p.sizes.map((s) =>
                s.code === posSize
                  ? { ...s, stock: Math.max(0, s.stock - qty) }
                  : s
              ),
            }
          : p
      )
    );

    onAddOrder(posOrder);
    onLogSellerAction(
      `Recorded Dukan Counter Sale: ${qty}x ${targetProd.title} (₹${totalAmt}, Profit: ₹${profitAmt})`,
      posOrder.orderNumber
    );
    setPosCustomerName('');
    setPosCustomerPhone('');
    setPosQty(1);
    triggerToast(
      `Dukan Sale Recorded! +₹${totalAmt} Sales | +₹${profitAmt} Faida (Profit)`
    );
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || expAmount <= 0) return;
    const item: ShopExpenseItem = {
      id: `exp-${Date.now()}`,
      title: expTitle.trim(),
      category: expCategory,
      amount: Number(expAmount) || 0,
      addedBy: accountName,
      date: 'Today',
    };
    onUpdateExpenses([item, ...expenses]);
    onLogSellerAction(
      `Logged shop expense "${item.title}" of ₹${item.amount}`,
      item.category
    );
    setExpTitle('');
    setExpAmount(100);
    triggerToast(`Added shop expense ₹${item.amount}`);
  };

  const handleDeleteProduct = (id: string, sku: string) => {
    if (products.length <= 1) {
      triggerToast('Cannot delete the last remaining catalog product');
      return;
    }
    onUpdateProducts((prev) => prev.filter((p) => p.id !== id));
    if (activeProductId === id) {
      const remaining = products.filter((p) => p.id !== id);
      if (remaining[0]) setActiveProductId(remaining[0].id);
    }
    onLogSellerAction(`Deleted product from catalog`, sku);
    triggerToast(`Deleted product ${sku}`);
  };

  const handleUploadPhoto = () => {
    const nextExtra = EXTRA_UPLOAD_POOL.find(
      (extra) => !product.mediaGallery.some((m) => m.title === extra.title)
    );
    if (nextExtra) {
      updateActiveProduct((prev) => ({
        ...prev,
        mediaGallery: [
          ...prev.mediaGallery,
          { ...nextExtra, id: `media-${Date.now()}`, isCover: false },
        ],
      }));
      triggerToast(`Added "${nextExtra.title}" to Product Gallery`);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsUploadingToImgBB(true);
    triggerToast('Uploading product photo to ImgBB...');
    try {
      const hostedUrl = await uploadImageToImgBB(
        file,
        product.title || file.name
      );
      updateActiveProduct((prev) => ({
        ...prev,
        mediaGallery: [
          ...prev.mediaGallery,
          {
            id: `upload-${Date.now()}`,
            title: file.name.slice(0, 16) || 'Product Photo',
            url: hostedUrl,
            isCover: false,
          },
        ],
      }));
      triggerToast('Uploaded product image to ImgBB & saved to database!');
    } finally {
      setIsUploadingToImgBB(false);
    }
  };

  const handleAdminAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsUploadingToImgBB(true);
    triggerToast('Uploading profile photo to ImgBB...');
    try {
      const hostedUrl = await uploadImageToImgBB(file, `admin-${accountName}`);
      onUpdateAdminAvatar(hostedUrl);
      triggerToast('Profile photo uploaded to ImgBB & saved!');
    } finally {
      setIsUploadingToImgBB(false);
    }
  };

  const handleBannerFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsUploadingToImgBB(true);
    triggerToast('Uploading Homepage Banner to ImgBB...');
    try {
      const hostedUrl = await uploadImageToImgBB(file, 'reyaz-hero-banner');
      onUpdateHomepage({
        ...homepageConfig,
        heroBannerUrl: hostedUrl,
      });
      triggerToast('Banner uploaded to ImgBB & updated on Homepage!');
    } finally {
      setIsUploadingToImgBB(false);
    }
  };

  const handleCreateSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName.trim() || !sellerEmail.trim() || !sellerPassword.trim()) {
      triggerToast('Please fill Seller Name, Email, and Password');
      return;
    }
    const newSeller: SellerAccount = {
      id: `seller-${Date.now()}`,
      name: sellerName.trim(),
      email: sellerEmail.trim().toLowerCase(),
      phone: sellerPhone.trim() || '9693935479',
      passwordPlainOrHint: sellerPassword.trim(),
      department: sellerDept,
      active: true,
      profilePhotoUrl: null,
      createdAt: 'Today',
    };
    onUpdateSellers([newSeller, ...sellers]);
    syncSellerToFirestore(newSeller).catch(() => {});
    onLogSellerAction(
      `Created Seller Account for ${newSeller.name} (${newSeller.email})`,
      newSeller.department
    );
    setSellerName('');
    setSellerEmail('');
    setSellerPhone('');
    setSellerPassword('');
    triggerToast(
      `Created Seller account for ${newSeller.name} & synced to Firebase!`
    );
  };

  const handleExportDatabaseJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      store: storeSettings.storeName,
      products,
      categories,
      orders,
      customers,
      sellers,
      expenses,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reyaz-shopping-center-db-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Downloaded complete Store Database backup JSON');
  };

  const uploadUnitProfit = Math.max(0, upSellingPrice - upCostPrice);
  const uploadMarginPercent =
    upSellingPrice > 0
      ? Math.round((uploadUnitProfit / upSellingPrice) * 100)
      : 0;
  const uploadDiscountPercent =
    upMrp > upSellingPrice
      ? Math.round(((upMrp - upSellingPrice) / upMrp) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col lg:flex-row font-sans">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={uploadStudioFileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUploadStudioFiles}
        className="hidden"
      />
      <input
        ref={adminAvatarInputRef}
        type="file"
        accept="image/*"
        onChange={handleAdminAvatarFileChange}
        className="hidden"
      />
      <input
        ref={bannerFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleBannerFileChange}
        className="hidden"
      />

      {/* ================= LEFT VERTICAL SIDEBAR (THEMESBRAND TONER BACKEND STYLE) ================= */}
      <aside
        className={`w-full lg:w-64 shrink-0 flex flex-col justify-between border-r transition-colors ${
          sidebarDark
            ? 'bg-[#0F172A] text-slate-300 border-slate-800'
            : 'bg-white text-slate-700 border-slate-200'
        }`}
      >
        <div className="p-4 space-y-5">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-1 pb-3 border-b border-slate-700/30">
            <ReyazLogo
              size="sm"
              theme={sidebarDark ? 'dark' : 'light'}
              onClick={onExitToStorefront}
            />
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#4B93FF]/20 text-[#4B93FF] border border-[#4B93FF]/30">
              {accountRole === 'super_admin' ? 'ADMIN' : 'SELLER'}
            </span>
          </div>

          {/* Toner Hierarchical Navigation Menu */}
          <div className="space-y-4">
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Menu
              </div>
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {/* 1. Dashboard */}
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-[#4B93FF] text-white shadow-xs'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <BarChart2 className="w-4 h-4 shrink-0" />
                  <span>Dashboard</span>
                </button>

                {/* 2. Products Accordion Group (Toner Signature) */}
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'products' ||
                      activeTab === 'upload' ||
                      activeTab === 'editor' ||
                      activeTab === 'categories'
                        ? sidebarDark
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-900'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Package className="w-4 h-4 shrink-0 text-[#4B93FF]" />
                      <span>Products</span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        productsMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {productsMenuOpen && (
                    <div className="pl-7 space-y-1 hidden lg:block">
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between ${
                          activeTab === 'products'
                            ? 'text-[#4B93FF] font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>• Product List</span>
                        <span className="text-[10px] font-mono-num">
                          {products.length}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                          activeTab === 'upload'
                            ? 'text-[#F5CE62] font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        • Create / Upload Product
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('editor')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                          activeTab === 'editor'
                            ? 'text-[#4B93FF] font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        • Edit Product Studio
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('categories')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                          activeTab === 'categories'
                            ? 'text-[#4B93FF] font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        • Categories &amp; Sub-Categories
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Orders */}
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#4B93FF] text-white shadow-xs'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Receipt className="w-4 h-4 shrink-0" />
                    <span>Orders</span>
                  </span>
                  <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {orders.length}
                  </span>
                </button>

                {/* 4. Today's Sales & Profit (Aaj Ka Hisaab & POS) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('finance')}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'finance'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <IndianRupee className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Today Sales &amp; Profit</span>
                  </span>
                </button>

                {/* 5. Sellers (Super Admin) */}
                {accountRole === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('sellers')}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'sellers'
                        ? 'bg-[#4B93FF] text-white shadow-xs'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Store className="w-4 h-4 shrink-0" />
                      <span>Sellers</span>
                    </span>
                    <span className="text-[10px] font-mono-num">
                      {sellers.length}
                    </span>
                  </button>
                )}

                {/* 6. Shipments (Horanda 822110 COD Dispatch) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('shipments')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'shipments'
                      ? 'bg-[#4B93FF] text-white shadow-xs'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <Truck className="w-4 h-4 shrink-0" />
                  <span>Shipments (822110)</span>
                </button>

                {/* 7. Users / Customers List */}
                <button
                  type="button"
                  onClick={() => setActiveTab('customers')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'customers'
                      ? 'bg-[#4B93FF] text-white shadow-xs'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Customers List</span>
                </button>

                {/* 8. Reviews & Ratings */}
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'bg-[#4B93FF] text-white shadow-xs'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <Star className="w-4 h-4 shrink-0" />
                  <span>Reviews &amp; Ratings</span>
                </button>

                {/* 9. Homepage Banners & Offers */}
                <button
                  type="button"
                  onClick={() => setActiveTab('homepage')}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === 'homepage'
                      ? 'bg-[#4B93FF] text-white shadow-xs'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <LayoutTemplate className="w-4 h-4 shrink-0" />
                  <span>Banners &amp; Offers</span>
                </button>

                {/* 10. Store Settings & Database */}
                {accountRole === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-[#4B93FF] text-white shadow-xs'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>Settings &amp; DB</span>
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Bottom Action Box */}
        <div className="p-4 border-t border-slate-700/30 hidden lg:block space-y-2">
          <button
            type="button"
            onClick={onSaveAllToServerDb}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sync &amp; Save Database</span>
          </button>
          <button
            type="button"
            onClick={onLogoutAdmin}
            className="w-full bg-red-500/15 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* ================= RIGHT MAIN WORKSPACE (TONER TOPBAR + CONTENT CANVAS) ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toner Topbar Header */}
        <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between gap-4 sticky top-0 z-30">
          {/* Left: Global Backend Search */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  if (activeTab !== 'products' && e.target.value.trim()) {
                    setActiveTab('products');
                  }
                }}
                placeholder="Search products, SKU, orders, categories..."
                className="w-full bg-slate-100 focus:bg-white border border-transparent focus:border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Right: Toner Action Buttons + Firebase Status + Admin Profile */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={async () => {
                onSaveAllToServerDb();
                for (const p of products.slice(0, 10)) {
                  await syncProductToFirestore(p).catch(() => {});
                }
                for (const o of orders.slice(0, 10)) {
                  await syncOrderToFirestore(o).catch(() => {});
                }
                for (const s of sellers) {
                  await syncSellerToFirestore(s).catch(() => {});
                }
                triggerToast(
                  'Firebase Cloud Firestore & Server Database Synced!'
                );
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold cursor-pointer whitespace-nowrap"
              title="Firebase Cloud Firestore Connected — Click to Sync All Data"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Cloud className="w-3.5 h-3.5" />
              <span>Firebase Connected</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className="bg-[#4B93FF] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Create Product</span>
            </button>

            <button
              type="button"
              onClick={() => setSidebarDark(!sidebarDark)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              title="Toggle Sidebar Theme"
            >
              {sidebarDark ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              type="button"
              onClick={onExitToStorefront}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#4B93FF]" />
              <span className="hidden sm:inline">Live Storefront</span>
            </button>

            {/* Admin Profile Dropdown Trigger */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={() => adminAvatarInputRef.current?.click()}
                className="w-9 h-9 rounded-full overflow-hidden bg-[#0F172A] text-[#F5CE62] flex items-center justify-center font-bold text-xs border-2 border-[#D4AF37] cursor-pointer shrink-0"
                title="Change Admin Avatar Photo"
              >
                {adminAvatarUrl ? (
                  <img
                    src={adminAvatarUrl}
                    alt={accountName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  accountName.charAt(0).toUpperCase()
                )}
              </button>
              <div className="hidden md:block text-left leading-tight">
                <div className="text-xs font-bold text-slate-900">
                  {accountName}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {accountEmail}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Quick Mobile Sub-Navigation Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'upload', label: '+ Create Product' },
            { id: 'products', label: 'Product List' },
            { id: 'categories', label: 'Categories' },
            { id: 'orders', label: 'Orders' },
            { id: 'finance', label: 'Today Sales & Profit' },
            ...(accountRole === 'super_admin'
              ? [{ id: 'sellers', label: 'Sellers' }]
              : []),
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-[#4B93FF] text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <main className="p-6 space-y-6 max-w-[1440px] w-full mx-auto">
          {/* ================= TAB 1: TONER E-COMMERCE DASHBOARD (`backend/index.html`) ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top 4 Toner Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {/* Card 1: Total Earnings & Today's Bikri */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-start justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      TOTAL REVENUE (EARNINGS)
                    </span>
                    <div className="font-mono-num text-2xl sm:text-3xl font-extrabold text-slate-900">
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-emerald-600 font-bold">
                        +18.30%
                      </span>
                      <span className="text-slate-500">
                        • Today: ₹{todaySalesRevenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>

                {/* Card 2: Today's & Total Profit (Faida) */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-start justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      TODAY&apos;S NET PROFIT (FAIDA)
                    </span>
                    <div className="font-mono-num text-2xl sm:text-3xl font-extrabold text-emerald-600">
                      +₹{todayNetProfit.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-600 font-semibold">
                        Gross: ₹{todayGrossProfit.toLocaleString('en-IN')}
                      </span>
                      <span className="text-slate-400">
                        • All-Time: ₹{totalGrossProfit.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#4B93FF] flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                {/* Card 3: Orders */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-start justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      TOTAL ORDERS (COD)
                    </span>
                    <div className="font-mono-num text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {orders.length}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-amber-600 font-bold">
                        {pendingOrdersCount} Pending
                      </span>
                      <span className="text-slate-400">
                        • {todayUnitsSold} Pcs Sold Today
                      </span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

                {/* Card 4: Products, Categories & Sellers */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs flex items-start justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      CATALOG PRODUCTS
                    </span>
                    <div className="font-mono-num text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {products.length}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#4B93FF] font-bold">
                        {categories.length} Categories
                      </span>
                      <span className="text-slate-400">
                        • {sellers.length} Sellers
                      </span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Toner Row 2: Revenue & Profit Analytics Chart (8 Cols) + Sales by Category & Horanda 822110 Dispatch (4 Cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 8 Cols: Toner Revenue & Profit Overview Card */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Revenue, Orders &amp; Profit Analytics
                      </h2>
                      <p className="text-xs text-slate-500">
                        Live store performance for Reyaz Shopping Center (Horanda Alias Ramgarh - 822110)
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                      {(['TODAY', '7D', '1M', '1Y'] as const).map((rng) => (
                        <button
                          key={rng}
                          type="button"
                          onClick={() => setChartRange(rng)}
                          className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                            chartRange === rng
                              ? 'bg-[#4B93FF] text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {rng}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toner 4-Column Sub-Header Strip inside Revenue Card */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 border border-slate-200 rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50/60 text-center">
                    <div className="p-3">
                      <div className="font-mono-num text-lg font-extrabold text-slate-900">
                        {orders.length}
                      </div>
                      <div className="text-[11px] text-slate-500">Orders</div>
                    </div>
                    <div className="p-3">
                      <div className="font-mono-num text-lg font-extrabold text-[#4B93FF]">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-500">Earnings</div>
                    </div>
                    <div className="p-3">
                      <div className="font-mono-num text-lg font-extrabold text-emerald-600">
                        +₹{totalGrossProfit.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Gross Profit (Faida)
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="font-mono-num text-lg font-extrabold text-amber-600">
                        ₹{todaySalesRevenue.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Aaj Ki Bikri
                      </div>
                    </div>
                  </div>

                  {/* Toner Combo Bar + Line SVG Chart */}
                  <div className="pt-2">
                    <svg viewBox="0 0 600 200" className="w-full h-52">
                      {/* Grid Lines */}
                      {[30, 75, 120, 165].map((y) => (
                        <line
                          key={y}
                          x1="30"
                          y1={y}
                          x2="580"
                          y2={y}
                          stroke="#E2E8F0"
                          strokeDasharray="4 4"
                        />
                      ))}
                      {/* Revenue Bars */}
                      {[
                        { x: 55, h: 95, p: 55, label: 'Mon' },
                        { x: 130, h: 115, p: 68, label: 'Tue' },
                        { x: 205, h: 85, p: 48, label: 'Wed' },
                        { x: 280, h: 130, p: 82, label: 'Thu' },
                        { x: 355, h: 110, p: 70, label: 'Fri' },
                        { x: 430, h: 145, p: 92, label: 'Sat' },
                        { x: 505, h: 155, p: 105, label: 'Today' },
                      ].map((bar, idx) => (
                        <g key={idx}>
                          {/* Revenue Bar */}
                          <rect
                            x={bar.x}
                            y={170 - bar.h}
                            width="18"
                            height={bar.h}
                            rx="4"
                            fill="#4B93FF"
                          />
                          {/* Profit Bar */}
                          <rect
                            x={bar.x + 22}
                            y={170 - bar.p}
                            width="18"
                            height={bar.p}
                            rx="4"
                            fill="#10B981"
                          />
                          <text
                            x={bar.x + 19}
                            y="190"
                            textAnchor="middle"
                            fontSize="11"
                            fill="#64748B"
                            fontWeight="600"
                          >
                            {bar.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                    <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-600 pt-1">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-xs bg-[#4B93FF]" />
                        <span>Sales Revenue (Bikri ₹)</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-xs bg-[#10B981]" />
                        <span>Net Profit (Faida ₹)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right 4 Cols: Category Breakdown & Quick Control Panel */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">
                        Category Distribution
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('categories')}
                        className="text-xs font-bold text-[#4B93FF] hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Women&apos;s Fashion ({womenCount} items)</span>
                          <span className="font-mono-num">
                            {Math.round((womenCount / totalProdCount) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-[#4B93FF] rounded-full"
                            style={{
                              width: `${Math.round(
                                (womenCount / totalProdCount) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Men&apos;s Fashion ({menCount} items)</span>
                          <span className="font-mono-num">
                            {Math.round((menCount / totalProdCount) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${Math.round(
                                (menCount / totalProdCount) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Kids&apos; Collection ({kidsCount} items)</span>
                          <span className="font-mono-num">
                            {Math.round((kidsCount / totalProdCount) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{
                              width: `${Math.round(
                                (kidsCount / totalProdCount) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Management Shortcuts */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className="bg-[#0F172A] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-[#F5CE62]" />
                        <span>Upload Product</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('finance')}
                        className="bg-emerald-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>Dukan POS Sale</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('categories')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-[#4B93FF]" />
                        <span>Categories</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-amber-600" />
                        <span>All Orders</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toner Row 3: Recent Orders Table (8 Cols) + Stock Report / Top Products (4 Cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Orders Table */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Recent Orders (Horanda 822110 COD &amp; POS)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Update order delivery status directly from the dashboard
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-[#4B93FF] hover:underline cursor-pointer"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                          <th className="py-3 px-2">Order ID</th>
                          <th className="py-3 px-2">Product</th>
                          <th className="py-3 px-2">Customer</th>
                          <th className="py-3 px-2">Amount</th>
                          <th className="py-3 px-2">Profit (Faida)</th>
                          <th className="py-3 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.slice(0, 6).map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50">
                            <td className="py-3 px-2 font-mono-num font-bold text-[#4B93FF]">
                              #{ord.orderNumber}
                            </td>
                            <td className="py-3 px-2 font-semibold text-slate-800">
                              {ord.productTitle} ({ord.size})
                            </td>
                            <td className="py-3 px-2">
                              <div className="font-bold text-slate-900">
                                {ord.customerName}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                +91 {ord.customerPhone}
                              </div>
                            </td>
                            <td className="py-3 px-2 font-mono-num font-bold text-slate-900">
                              ₹{ord.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-2 font-mono-num font-bold text-emerald-600">
                              +₹{calculateOrderGrossProfit(ord)}
                            </td>
                            <td className="py-3 px-2">
                              <select
                                value={ord.status}
                                onChange={(e) =>
                                  onUpdateOrderStatus(
                                    ord.id,
                                    e.target.value as OrderStatusType
                                  )
                                }
                                className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 cursor-pointer"
                              >
                                {ALL_ORDER_STATUSES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Stock Report & Top Products */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      Product Stock Report
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-bold text-[#4B93FF] hover:underline cursor-pointer"
                    >
                      All Products
                    </button>
                  </div>

                  <div className="space-y-3">
                    {products.slice(0, 5).map((p) => {
                      const stockTotal = p.sizes.reduce(
                        (s, item) => s + item.stock,
                        0
                      );
                      return (
                        <div
                          key={p.id}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={p.mediaGallery[0]?.url}
                              alt={p.title}
                              className="w-10 h-12 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate">
                                {p.title}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono-num">
                                ₹{p.sellingPrice} • {stockTotal} pcs
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveProductId(p.id);
                              setActiveTab('editor');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 font-bold text-[#4B93FF] hover:border-[#4B93FF] cursor-pointer shrink-0"
                          >
                            Edit
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: TODAY'S SALES, PROFIT & DUKAN COUNTER POS (AAJ KA HISAAB) ================= */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              {/* Top 4 Financial Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="text-xs text-slate-500 font-bold">
                    Aaj Ki Kul Bikri (Today&apos;s Sales)
                  </div>
                  <div className="font-mono-num text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    ₹{todaySalesRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-[#4B93FF] font-bold mt-1">
                    {todayOrders.length} Orders • {todayUnitsSold} Pcs Sold
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="text-xs text-slate-500 font-bold">
                    Aaj Ka Gross Munafa (Faida)
                  </div>
                  <div className="font-mono-num text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
                    +₹{todayGrossProfit.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Selling Rate minus Cost Rate
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="text-xs text-slate-500 font-bold">
                    Aaj Ka Dukan Kharcha (Expenses)
                  </div>
                  <div className="font-mono-num text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">
                    -₹{todayExpensesTotal.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {expenses.length} Expense Entries
                  </div>
                </div>

                <div className="bg-[#0F172A] text-white rounded-2xl p-5">
                  <div className="text-xs text-[#F5CE62] font-bold">
                    Aaj Ka Shuddh Faida (Net Profit)
                  </div>
                  <div className="font-mono-num text-2xl sm:text-3xl font-extrabold text-[#F5CE62] mt-1">
                    ₹{todayNetProfit.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    All-Time Profit: ₹{totalGrossProfit.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Walk-in Dukan Counter Sale (POS Entry) */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                        OFFLINE SHOP COUNTER POS
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        Record Instant Dukan Counter Sale
                      </h3>
                      <p className="text-xs text-slate-500">
                        Log walk-in shop counter sales to immediately update Today&apos;s Sales &amp; Profit.
                      </p>
                    </div>
                    <ShoppingBag className="w-6 h-6 text-[#4B93FF] shrink-0" />
                  </div>

                  <form onSubmit={handleRecordPosSale} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Select Product Sold *
                      </label>
                      <select
                        value={posProductId}
                        onChange={(e) => setPosProductId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                      >
                        {products.map((p) => {
                          const cPrice =
                            p.costPrice ?? Math.round(p.sellingPrice * 0.6);
                          return (
                            <option key={p.id} value={p.id}>
                              {p.sku} — {p.title} (Sell: ₹{p.sellingPrice} |
                              Faida: ₹{p.sellingPrice - cPrice})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Size
                        </label>
                        <select
                          value={posSize}
                          onChange={(e) => setPosSize(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                        >
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free'].map(
                            (sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Quantity (Pieces)
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={posQty}
                          onChange={(e) =>
                            setPosQty(Math.max(1, Number(e.target.value) || 1))
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono-num font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={posCustomerName}
                        onChange={(e) => setPosCustomerName(e.target.value)}
                        placeholder="Customer Name (Optional)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                      />
                      <input
                        type="tel"
                        value={posCustomerPhone}
                        onChange={(e) => setPosCustomerPhone(e.target.value)}
                        placeholder="Customer Mobile (Optional)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3.5 rounded-xl cursor-pointer"
                    >
                      + Add Dukan Sale to Today&apos;s Bikri &amp; Profit
                    </button>
                  </form>
                </div>

                {/* Right: Daily Shop Expense Logger (Dukan Kharcha) */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                        DUKAN KHARCHA LEDGER
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        Log Today&apos;s Shop Expenses
                      </h3>
                      <p className="text-xs text-slate-500">
                        Track delivery boy allowance, packaging, transport, or shop bills.
                      </p>
                    </div>
                    <Wallet className="w-6 h-6 text-amber-600 shrink-0" />
                  </div>

                  <form onSubmit={handleAddExpense} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={expTitle}
                      onChange={(e) => setExpTitle(e.target.value)}
                      placeholder="Expense Description (e.g. Delivery Boy Petrol, Carry Bags)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={expCategory}
                        onChange={(e) =>
                          setExpCategory(
                            e.target.value as ShopExpenseItem['category']
                          )
                        }
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                      >
                        <option value="Delivery Boy">Delivery Boy</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Stock Transport">Stock Transport</option>
                        <option value="Shop Electricity/Rent">
                          Shop Electricity/Rent
                        </option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        type="number"
                        min={1}
                        required
                        value={expAmount}
                        onChange={(e) =>
                          setExpAmount(Math.max(0, Number(e.target.value) || 0))
                        }
                        placeholder="Amount (₹)"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono-num font-bold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#0F172A] text-white text-xs font-bold py-3 rounded-xl cursor-pointer"
                    >
                      + Record Expense
                    </button>
                  </form>

                  <div className="space-y-2 max-h-44 overflow-y-auto pt-2">
                    {expenses.map((ex) => (
                      <div
                        key={ex.id}
                        className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {ex.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {ex.category} • Added by {ex.addedBy} • {ex.date}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-num font-bold text-red-600">
                            -₹{ex.amount}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateExpenses(
                                expenses.filter((item) => item.id !== ex.id)
                              )
                            }
                            className="text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: TONER 2-COLUMN CREATE / UPLOAD PRODUCT PAGE (`product-create.html`) ================= */}
          {activeTab === 'upload' && (
            <form onSubmit={handlePublishUploadedProduct} className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Create / Upload New Product
                  </h2>
                  <p className="text-xs text-slate-500">
                    Add product photos, pricing, cost rate, category, sizes, and specifications to publish immediately.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('products')}
                    className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    View All Products
                  </button>
                  <button
                    type="submit"
                    className="bg-[#4B93FF] hover:bg-blue-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Publish Product</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left 8 Columns: Product Info, Gallery Dropzone, Sizes & Specs */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Card 1: Product Title & Description */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Product Information
                    </h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={upTitle}
                        onChange={(e) => setUpTitle(e.target.value)}
                        placeholder="Enter product title (e.g. Royal Embroidered Wedding Sherwani / Floral Kurti)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Product Description
                      </label>
                      <textarea
                        rows={4}
                        value={upDesc}
                        onChange={(e) => setUpDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs"
                      />
                    </div>
                  </div>

                  {/* Card 2: Product Gallery Dropzone */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Product Gallery (Hosted on ImgBB)
                        </h3>
                        <p className="text-xs text-slate-500">
                          All uploaded photos are automatically saved to ImgBB (https://imgbb.com/) and stored in the database.
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={isUploadingToImgBB}
                        onClick={() => uploadStudioFileRef.current?.click()}
                        className="bg-[#4B93FF] disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>
                          {isUploadingToImgBB
                            ? 'Uploading to ImgBB...'
                            : 'Upload Photos (ImgBB)'}
                        </span>
                      </button>
                    </div>

                    <div
                      onClick={() => uploadStudioFileRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-[#4B93FF] rounded-2xl p-6 text-center cursor-pointer bg-slate-50/60 transition-colors"
                    >
                      <UploadCloud className="w-8 h-8 text-[#4B93FF] mx-auto mb-2" />
                      <div className="text-xs font-bold text-slate-800">
                        Click to select product photos from Phone / PC
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Supports JPG, PNG, WebP (First image becomes Main Cover)
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={upImageUrlInput}
                        onChange={(e) => setUpImageUrlInput(e.target.value)}
                        placeholder="Or paste an image URL here..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!upImageUrlInput.trim()) return;
                          setUpPhotos((prev) => [
                            ...prev,
                            upImageUrlInput.trim(),
                          ]);
                          setUpImageUrlInput('');
                        }}
                        className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        + Add URL
                      </button>
                    </div>

                    {upPhotos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                        {upPhotos.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 bg-white"
                          >
                            <img
                              src={url}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {idx === 0 && (
                              <span className="absolute top-2 left-2 bg-[#0F172A] text-[#F5CE62] text-[10px] font-bold px-2 py-0.5 rounded">
                                COVER
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                setUpPhotos((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card 3: General Info, Sizes & Specifications */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                      General Info, Sizes &amp; Specifications
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Brand / Manufacturer
                        </label>
                        <input
                          type="text"
                          value={upBrand}
                          onChange={(e) => setUpBrand(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          SKU Code
                        </label>
                        <input
                          type="text"
                          value={upSku}
                          onChange={(e) => setUpSku(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono-num font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Dukan Rack / Location
                        </label>
                        <input
                          type="text"
                          value={upRack}
                          onChange={(e) => setUpRack(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        value={upFabric}
                        onChange={(e) => setUpFabric(e.target.value)}
                        placeholder="Fabric"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        value={upPattern}
                        onChange={(e) => setUpPattern(e.target.value)}
                        placeholder="Pattern"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        value={upNeck}
                        onChange={(e) => setUpNeck(e.target.value)}
                        placeholder="Neck / Collar"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        value={upFit}
                        onChange={(e) => setUpFit(e.target.value)}
                        placeholder="Fit Style"
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Size-Wise Stock Quantities
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {upSizes.map((sz, i) => (
                          <div
                            key={sz.code}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between"
                          >
                            <span className="text-xs font-bold">{sz.code}</span>
                            <input
                              type="number"
                              min={0}
                              value={sz.stock}
                              onChange={(e) => {
                                const v = Math.max(
                                  0,
                                  Number(e.target.value) || 0
                                );
                                setUpSizes((prev) =>
                                  prev.map((item, idx) =>
                                    idx === i ? { ...item, stock: v } : item
                                  )
                                );
                              }}
                              className="w-14 bg-white border border-slate-300 rounded-lg px-2 py-1 text-center font-mono-num text-xs font-bold"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 Columns: Toner Publish, Pricing & Profit, Categories, Visibility Flags */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Pricing & Profit Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Pricing &amp; Profit (Faida)
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Khareed Rate / Cost Price (₹) *
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={upCostPrice}
                        onChange={(e) =>
                          setUpCostPrice(
                            Math.max(0, Number(e.target.value) || 0)
                          )
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono-num font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Original Tag MRP (₹) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={upMrp}
                        onChange={(e) =>
                          setUpMrp(Math.max(1, Number(e.target.value) || 0))
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono-num font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-700 mb-1">
                        Selling Price (Bikri Rate ₹) *
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={upSellingPrice}
                        onChange={(e) =>
                          setUpSellingPrice(
                            Math.max(1, Number(e.target.value) || 0)
                          )
                        }
                        className="w-full bg-emerald-50/50 border-2 border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-mono-num font-extrabold text-emerald-700"
                      />
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-emerald-800">
                        <span>Net Profit (Faida) / Pc:</span>
                        <span className="font-mono-num">
                          +₹{uploadUnitProfit} ({uploadMarginPercent}%)
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-700">
                        <span>Customer Discount:</span>
                        <span className="font-mono-num">
                          {uploadDiscountPercent}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Categories Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Product Categories
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('categories')}
                        className="text-xs font-bold text-[#4B93FF] hover:underline cursor-pointer"
                      >
                        + Add New
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Main Department
                      </label>
                      <select
                        value={upCat}
                        onChange={(e) => {
                          const c = e.target.value as 'Women' | 'Men' | 'Kids';
                          setUpCat(c);
                          const found = categories.find((x) => x.name === c);
                          if (found?.subcategories[0]) {
                            setUpSubCat(found.subcategories[0]);
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                      >
                        <option value="Women">Women</option>
                        <option value="Men">Men</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sub-Category
                      </label>
                      <select
                        value={upSubCat}
                        onChange={(e) => setUpSubCat(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                      >
                        {(
                          categories.find((c) => c.name === upCat)
                            ?.subcategories || [
                            'Shirts',
                            'T-Shirts',
                            'Jeans',
                            'Dresses',
                            'Sarees',
                            'Kurtis',
                          ]
                        ).map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Storefront Badges & Publish Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                      Storefront Visibility &amp; Badges
                    </h3>
                    <div className="space-y-2.5 text-xs font-semibold">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={upFeatured}
                          onChange={(e) => setUpFeatured(e.target.checked)}
                        />
                        <span>Featured on Homepage</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={upNew}
                          onChange={(e) => setUpNew(e.target.checked)}
                        />
                        <span>New Arrival Badge</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={upTrending}
                          onChange={(e) => setUpTrending(e.target.checked)}
                        />
                        <span>Trending Collection</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#4B93FF] hover:bg-blue-600 text-white text-xs font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Publish Product to Store</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ================= TAB 4: ALL PRODUCTS TABLE & CRUD (`product-list.html`) ================= */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Product List ({products.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage pricing, cost rate, profit margin, stock, and visibility across all Men, Women &amp; Kids products.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <select
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="All">All Categories</option>
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                  </select>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search SKU or title..."
                      className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="bg-[#4B93FF] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px]">
                      <th className="py-3 px-2">Product Name</th>
                      <th className="py-3 px-2">Category</th>
                      <th className="py-3 px-2">Bikri / MRP</th>
                      <th className="py-3 px-2">Cost / Faida</th>
                      <th className="py-3 px-2">Stock</th>
                      <th className="py-3 px-2">Rating</th>
                      <th className="py-3 px-2">Published</th>
                      <th className="py-3 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter(
                        (p) =>
                          productCatFilter === 'All' ||
                          p.primaryCategory === productCatFilter
                      )
                      .filter(
                        (p) =>
                          !productSearch.trim() ||
                          p.title
                            .toLowerCase()
                            .includes(productSearch.toLowerCase()) ||
                          p.sku
                            .toLowerCase()
                            .includes(productSearch.toLowerCase())
                      )
                      .map((p) => {
                        const stockSum = p.sizes.reduce(
                          (s, item) => s + item.stock,
                          0
                        );
                        const unitCost =
                          p.costPrice ?? Math.round(p.sellingPrice * 0.6);
                        const unitProfit = Math.max(
                          0,
                          p.sellingPrice - unitCost
                        );
                        return (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.mediaGallery[0]?.url}
                                  alt={p.title}
                                  className="w-11 h-14 rounded-lg object-cover shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-slate-900">
                                    {p.title}
                                  </div>
                                  <div className="font-mono-num text-[11px] text-slate-400">
                                    SKU: {p.sku} • {p.warehouseLocation}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-2 font-semibold text-slate-700">
                              {p.primaryCategory} &gt; {p.subCategory}
                            </td>
                            <td className="py-3 px-2 font-mono-num">
                              <strong className="text-slate-900">
                                ₹{p.sellingPrice}
                              </strong>{' '}
                              <span className="line-through text-slate-400">
                                ₹{p.regularMrp}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-mono-num">
                              <div className="text-slate-500">
                                Cost: ₹{unitCost}
                              </div>
                              <div className="font-bold text-emerald-600">
                                Faida: +₹{unitProfit}
                              </div>
                            </td>
                            <td className="py-3 px-2 font-mono-num font-bold">
                              {stockSum} pcs
                            </td>
                            <td className="py-3 px-2 font-mono-num font-bold text-amber-600">
                              ★ {p.rating} ({p.reviewCount})
                            </td>
                            <td className="py-3 px-2">
                              <input
                                type="checkbox"
                                checked={p.isVisible}
                                onChange={(e) =>
                                  onUpdateProducts((prev) =>
                                    prev.map((item) =>
                                      item.id === p.id
                                        ? {
                                            ...item,
                                            isVisible: e.target.checked,
                                          }
                                        : item
                                    )
                                  )
                                }
                                className="accent-[#4B93FF] cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-2 text-right space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveProductId(p.id);
                                  setActiveTab('editor');
                                }}
                                className="bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteProduct(p.id, p.sku)
                                }
                                className="bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg font-bold cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 5: FULL PRODUCT DATA ENTRY & EDITOR ================= */}
          {activeTab === 'editor' && product && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left SKU Selector */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase text-slate-500">
                    Select Product to Edit
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="bg-[#4B93FF] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create New
                  </button>
                </div>
                <div className="space-y-1.5 max-h-[540px] overflow-y-auto">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveProductId(p.id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-3 cursor-pointer ${
                        p.id === product.id
                          ? 'bg-blue-50/70 border-2 border-[#4B93FF] font-bold'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={p.mediaGallery[0]?.url}
                        alt={p.title}
                        className="w-10 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-mono-num text-[10px] text-slate-400">
                          {p.sku}
                        </div>
                        <div className="truncate text-slate-900">{p.title}</div>
                        <div className="text-emerald-600 font-mono-num">
                          ₹{p.sellingPrice}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Comprehensive Product Data Entry Form */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono-num font-bold text-[#4B93FF]">
                      EDITING SKU: {product.sku}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">
                      {product.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSaveProductToCloud(product);
                        onSaveAllToServerDb();
                        onLogSellerAction(
                          `Saved product changes for "${product.title}"`,
                          product.sku
                        );
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Product Changes</span>
                    </button>
                  </div>
                </div>

                {/* Basic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Product Name / Title
                    </label>
                    <input
                      type="text"
                      value={product.title}
                      onChange={(e) =>
                        updateActiveProduct((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={product.sku}
                      onChange={(e) =>
                        updateActiveProduct((prev) => ({
                          ...prev,
                          sku: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono-num font-bold"
                    />
                  </div>
                </div>

                {/* Department, Subcategory, Cost Price, MRP, Selling Price */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department
                    </label>
                    <select
                      value={product.primaryCategory}
                      onChange={(e) => {
                        const nextCat = e.target
                          .value as ProductCatalogItem['primaryCategory'];
                        const catObj = categories.find(
                          (c) => c.name === nextCat
                        );
                        updateActiveProduct((prev) => ({
                          ...prev,
                          primaryCategory: nextCat,
                          subCategory: catObj?.subcategories[0] || 'Dresses',
                        }));
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      <option value="Women">Women</option>
                      <option value="Men">Men</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subcategory
                    </label>
                    <select
                      value={product.subCategory}
                      onChange={(e) =>
                        updateActiveProduct((prev) => ({
                          ...prev,
                          subCategory: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      {(
                        categories.find(
                          (c) => c.name === product.primaryCategory
                        )?.subcategories || ['Shirts', 'Dresses', 'Kurtis']
                      ).map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Khareed / Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={
                        product.costPrice ??
                        Math.round(product.sellingPrice * 0.6)
                      }
                      onChange={(e) =>
                        updateActiveProduct((prev) => ({
                          ...prev,
                          costPrice: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono-num font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Original MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={product.regularMrp}
                      onChange={(e) =>
                        updateActiveProduct((prev) => ({
                          ...prev,
                          regularMrp: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono-num font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-700 mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      value={product.sellingPrice}
                      onChange={(e) =>
                        updateActiveProduct((prev) => ({
                          ...prev,
                          sellingPrice: Math.max(
                            0,
                            Number(e.target.value) || 0
                          ),
                        }))
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono-num font-bold text-emerald-700"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    value={product.description}
                    onChange={(e) =>
                      updateActiveProduct((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                  />
                </div>

                {/* Multi-Image Gallery Manager */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
                      <Images className="w-4 h-4 text-[#4B93FF]" />
                      Product Photos ({product.mediaGallery.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#F5CE62]" /> Upload
                      From Device
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {product.mediaGallery.map((m, idx) => (
                      <div
                        key={m.id}
                        className="relative rounded-xl overflow-hidden aspect-[3/4] border border-slate-200 group"
                      >
                        <img
                          src={m.url}
                          alt={m.title}
                          className="w-full h-full object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-2 left-2 bg-slate-900 text-[#F5CE62] text-[10px] font-bold px-2 py-0.5 rounded">
                            COVER
                          </span>
                        )}
                        {product.mediaGallery.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              updateActiveProduct((prev) => ({
                                ...prev,
                                mediaGallery: prev.mediaGallery.filter(
                                  (x) => x.id !== m.id
                                ),
                              }))
                            }
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleUploadPhoto}
                      className="rounded-xl border-2 border-dashed border-slate-300 aspect-[3/4] flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:border-[#4B93FF] hover:text-[#4B93FF] cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Photo</span>
                    </button>
                  </div>
                </div>

                {/* Sizes & Stock Quantity Manager */}
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="text-xs font-extrabold uppercase text-slate-800">
                    Sizes &amp; Stock Quantities
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {product.sizes.map((s) => (
                      <div
                        key={s.code}
                        className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-slate-800">
                          {s.code} ({s.chest})
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={s.stock}
                          onChange={(e) => {
                            const val = Math.max(
                              0,
                              Number(e.target.value) || 0
                            );
                            updateActiveProduct((prev) => ({
                              ...prev,
                              sizes: prev.sizes.map((item) =>
                                item.code === s.code
                                  ? { ...item, stock: val }
                                  : item
                              ),
                            }));
                          }}
                          className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-center font-mono-num text-xs font-bold"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add Size Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newSizeCode}
                      onChange={(e) =>
                        setNewSizeCode(e.target.value.toUpperCase())
                      }
                      placeholder="Size (e.g. 3XL)"
                      className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={newSizeChest}
                      onChange={(e) => setNewSizeChest(e.target.value)}
                      placeholder='Chest (e.g. 46")'
                      className="w-28 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="number"
                      value={newSizeStock}
                      onChange={(e) =>
                        setNewSizeStock(Number(e.target.value) || 0)
                      }
                      className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono-num"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSizeCode.trim()) return;
                        updateActiveProduct((prev) => ({
                          ...prev,
                          sizes: [
                            ...prev.sizes.filter((x) => x.code !== newSizeCode),
                            {
                              code: newSizeCode.trim(),
                              label: `${newSizeCode.trim()} (${newSizeChest})`,
                              chest: newSizeChest,
                              stock: newSizeStock,
                            },
                          ],
                        }));
                        triggerToast(`Added size ${newSizeCode}`);
                      }}
                      className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      + Add Size
                    </button>
                  </div>
                </div>

                {/* Color Shades Manager */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="text-xs font-extrabold uppercase text-slate-800">
                    Available Color Shades
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colorShades.map((c) => (
                      <div
                        key={c.id}
                        className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                        {product.colorShades.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              updateActiveProduct((prev) => ({
                                ...prev,
                                colorShades: prev.colorShades.filter(
                                  (x) => x.id !== c.id
                                ),
                              }))
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Color Name (e.g. Royal Blue)"
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-9 h-8 rounded cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newColorName.trim()) return;
                        updateActiveProduct((prev) => ({
                          ...prev,
                          colorShades: [
                            ...prev.colorShades,
                            {
                              id: `col-${Date.now()}`,
                              name: newColorName.trim(),
                              hex: newColorHex,
                            },
                          ],
                        }));
                        setNewColorName('');
                      }}
                      className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      + Add Color
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 6: CATEGORIES & SUB-CATEGORIES (`categories.html` & `sub-categories.html`) ================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Categories &amp; Sub-Categories Management
                  </h2>
                  <p className="text-xs text-slate-500">
                    Create, reorder, or delete Main Categories and Subcategories shown in the Storefront Mega Menu.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Category Name (e.g. Winter Wear)..."
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={newCatTagline}
                    onChange={(e) => setNewCatTagline(e.target.value)}
                    placeholder="Tagline / Description..."
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCatName.trim()) return;
                      onUpdateCategories([
                        ...categories,
                        {
                          id: `cat-${Date.now()}`,
                          name: newCatName.trim(),
                          order: categories.length + 1,
                          visible: true,
                          bannerImage: products[0]?.mediaGallery[0]?.url || '',
                          tagline:
                            newCatTagline.trim() ||
                            `${newCatName.trim()} Fashion Collection`,
                          subcategories: ['Traditional Wear', 'Festive Wear'],
                          megaMenuGroups: [
                            {
                              groupTitle: 'Main Collection',
                              items: ['Traditional Wear', 'Festive Wear'],
                            },
                          ],
                        },
                      ]);
                      setNewCatName('');
                      setNewCatTagline('');
                      triggerToast('Created new category');
                    }}
                    className="bg-[#4B93FF] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4" /> Create Category
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...categories]
                  .sort((a, b) => a.order - b.order)
                  .map((cat, idx) => (
                    <div
                      key={cat.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-32 bg-slate-100 relative overflow-hidden">
                          {cat.bannerImage && (
                            <img
                              src={cat.bannerImage}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end justify-between p-4">
                            <div>
                              <h3 className="text-lg font-bold text-white">
                                {cat.name}
                              </h3>
                              <p className="text-[11px] text-slate-200">
                                {cat.subcategories.length} Sub-Categories
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const sorted = [...categories].sort(
                                    (a, b) => a.order - b.order
                                  );
                                  const temp = sorted[idx - 1].order;
                                  sorted[idx - 1].order = sorted[idx].order;
                                  sorted[idx].order = temp;
                                  onUpdateCategories([...sorted]);
                                }}
                                className="p-1.5 rounded bg-white/90 text-slate-800 disabled:opacity-40 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === categories.length - 1}
                                onClick={() => {
                                  const sorted = [...categories].sort(
                                    (a, b) => a.order - b.order
                                  );
                                  const temp = sorted[idx + 1].order;
                                  sorted[idx + 1].order = sorted[idx].order;
                                  sorted[idx].order = temp;
                                  onUpdateCategories([...sorted]);
                                }}
                                className="p-1.5 rounded bg-white/90 text-slate-800 disabled:opacity-40 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div className="flex flex-wrap gap-1.5">
                            {cat.subcategories.map((sub) => (
                              <span
                                key={sub}
                                className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-800"
                              >
                                <span>{sub}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateCategories(
                                      categories.map((c) =>
                                        c.id === cat.id
                                          ? {
                                              ...c,
                                              subcategories:
                                                c.subcategories.filter(
                                                  (s) => s !== sub
                                                ),
                                            }
                                          : c
                                      )
                                    )
                                  }
                                  className="text-red-500 font-bold hover:text-red-700 cursor-pointer"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                        <input
                          type="text"
                          value={newSubcatInputs[cat.id] || ''}
                          onChange={(e) =>
                            setNewSubcatInputs((prev) => ({
                              ...prev,
                              [cat.id]: e.target.value,
                            }))
                          }
                          placeholder={`Add Sub-Category to ${cat.name}...`}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = (newSubcatInputs[cat.id] || '').trim();
                            if (!val) return;
                            onUpdateCategories(
                              categories.map((c) =>
                                c.id === cat.id
                                  ? {
                                      ...c,
                                      subcategories: [...c.subcategories, val],
                                    }
                                  : c
                              )
                            );
                            setNewSubcatInputs((prev) => ({
                              ...prev,
                              [cat.id]: '',
                            }));
                            triggerToast(`Added "${val}" under ${cat.name}`);
                          }}
                          className="bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================= TAB 7: ORDERS LIST (`orders-list-view.html`) ================= */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Orders List ({orders.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage all Horanda Alias Ramgarh (822110) Cash on Delivery &amp; POS orders.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search Order #, Customer, Phone..."
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs"
                  />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="All">All Statuses</option>
                    {ALL_ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {orders
                  .filter(
                    (o) =>
                      orderStatusFilter === 'All' ||
                      o.status === orderStatusFilter
                  )
                  .filter(
                    (o) =>
                      !orderSearch.trim() ||
                      o.orderNumber
                        .toLowerCase()
                        .includes(orderSearch.toLowerCase()) ||
                      o.customerName
                        .toLowerCase()
                        .includes(orderSearch.toLowerCase()) ||
                      o.customerPhone.includes(orderSearch)
                  )
                  .map((ord) => {
                    const ordProfit = calculateOrderGrossProfit(ord);
                    return (
                      <div
                        key={ord.id}
                        className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-num font-extrabold text-sm text-[#4B93FF]">
                              #{ord.orderNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              • {ord.customerName} (+91 {ord.customerPhone})
                            </span>
                            <span className="text-[11px] text-slate-400">
                              • {ord.timestamp}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-700 font-mono-num">
                            {ord.productTitle} (Size: {ord.size}, {ord.shade}) ×{' '}
                            {ord.quantity} —{' '}
                            <strong className="text-slate-900">
                              Sale: ₹{ord.amount.toLocaleString('en-IN')}
                            </strong>{' '}
                            •{' '}
                            <strong className="text-emerald-600">
                              Faida: +₹{ordProfit.toLocaleString('en-IN')}
                            </strong>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            📍 {ord.fullAddress}, {ord.villageArea},{' '}
                            {ord.district}, {ord.state} - {ord.pinCode}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={ord.status}
                            onChange={(e) => {
                              const nextSt = e.target.value as OrderStatusType;
                              onUpdateOrderStatus(ord.id, nextSt);
                              onLogSellerAction(
                                `Updated Order #${ord.orderNumber} status to ${nextSt}`,
                                ord.orderNumber
                              );
                            }}
                            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 cursor-pointer"
                          >
                            {ALL_ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>

                          <a
                            href={`https://wa.me/91${ord.customerWhatsapp || ord.customerPhone}?text=${encodeURIComponent(
                              `Assalamu Alaikum ${ord.customerName}! Update from Reyaz Shopping Center (Horanda 822110): Your Order #${ord.orderNumber} is currently "${ord.status}".`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>

                          {accountRole === 'super_admin' && (
                            <button
                              type="button"
                              onClick={() => onDeleteOrder(ord.id)}
                              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ================= TAB 8: SHIPMENTS & HORANDA (822110) DISPATCH (`shipments.html`) ================= */}
          {activeTab === 'shipments' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Horanda Alias Ramgarh (822110) — Free COD Shipments &amp; Delivery Board
                  </h2>
                  <p className="text-xs text-slate-500">
                    Track local doorstep deliveries across Horanda Alias Ramgarh, Palamu, Jharkhand - 822110.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700">
                    In Transit / Shipped: {shippedOrdersCount}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700">
                    Delivered: {deliveredOrdersCount}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-num font-bold text-[#4B93FF]">
                        Shipment #{ord.orderNumber}
                      </span>
                      <span className="font-bold text-slate-800">
                        {ord.status}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900">
                      {ord.customerName} (+91 {ord.customerPhone})
                    </div>
                    <div className="text-slate-600">
                      📍 {ord.fullAddress}, {ord.villageArea} - {ord.pinCode}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="font-mono-num font-bold text-emerald-700">
                        COD Collect: ₹{ord.amount.toLocaleString('en-IN')} (Free Shipping)
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer"
                      >
                        Mark Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 9: SELLERS / STAFF ACCOUNTS & AUDIT (`sellers-list-view.html`) ================= */}
          {activeTab === 'sellers' && accountRole === 'super_admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Create Seller Form */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div>
                  <span className="text-xs font-extrabold uppercase text-[#4B93FF]">
                    SUPER ADMIN EXCLUSIVE
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Create Seller / Staff Account
                  </h2>
                  <p className="text-xs text-slate-500">
                    Create login credentials for store sellers/staff. Super Admin monitors and controls all Seller actions.
                  </p>
                </div>

                <form onSubmit={handleCreateSeller} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Seller Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      placeholder="e.g. Arman Ansari"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Seller Login Email (Gmail) *
                    </label>
                    <input
                      type="email"
                      required
                      value={sellerEmail}
                      onChange={(e) => setSellerEmail(e.target.value)}
                      placeholder="seller@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Seller Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={sellerPhone}
                      onChange={(e) => setSellerPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Seller Login Password *
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerPassword}
                      onChange={(e) => setSellerPassword(e.target.value)}
                      placeholder="Assign password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Assigned Department
                    </label>
                    <select
                      value={sellerDept}
                      onChange={(e) =>
                        setSellerDept(
                          e.target.value as SellerAccount['department']
                        )
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                    >
                      <option value="All Departments">All Departments</option>
                      <option value="Men">Men&apos;s Department</option>
                      <option value="Women">Women&apos;s Department</option>
                      <option value="Kids">Kids&apos; Department</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#4B93FF] text-white text-xs font-bold py-3.5 rounded-xl cursor-pointer"
                  >
                    + Create Seller Account
                  </button>
                </form>
              </div>

              {/* Active Sellers List + Complete Seller Activity Audit Log */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Authorized Sellers ({sellers.length})
                  </h3>
                  <div className="space-y-3">
                    {sellers.map((s) => {
                      const sellerProductsCount = products.filter(
                        (p) =>
                          p.createdByEmail.toLowerCase() ===
                          s.email.toLowerCase()
                      ).length;
                      return (
                        <div
                          key={s.id}
                          className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-sm text-slate-900">
                              {s.name}{' '}
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-[#F5CE62] ml-1">
                                {s.department}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Email: <strong>{s.email}</strong> • Phone:{' '}
                              <strong>{s.phone}</strong> • Password:{' '}
                              <code className="bg-white px-1.5 py-0.5 rounded border">
                                {s.passwordPlainOrHint}
                              </code>
                            </div>
                            <div className="text-[11px] text-emerald-600 font-bold mt-1">
                              Uploaded Products: {sellerProductsCount} items
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateSellers(
                                  sellers.map((item) =>
                                    item.id === s.id
                                      ? { ...item, active: !item.active }
                                      : item
                                  )
                                )
                              }
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                                s.active
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {s.active ? 'Active' : 'Disabled'}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                onUpdateSellers(
                                  sellers.filter((item) => item.id !== s.id)
                                )
                              }
                              className="p-2 rounded-xl bg-red-50 text-red-600 cursor-pointer"
                              title="Delete Seller"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Seller Activity Audit Log */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    Seller Actions &amp; Audit Log
                  </h3>
                  <div className="space-y-2.5 max-h-80 overflow-y-auto">
                    {sellerLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            {log.sellerName} ({log.sellerEmail})
                          </div>
                          <div className="text-slate-600 mt-0.5">
                            {log.action}
                          </div>
                        </div>
                        <div className="text-right font-mono-num text-[11px] text-slate-500">
                          <div>{log.targetSkuOrOrder}</div>
                          <div>{log.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 10: CUSTOMERS LIST (`users-list.html`) ================= */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Registered Customers ({customers.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customers.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {c.profilePhotoUrl ? (
                        <img
                          src={c.profilePhotoUrl}
                          alt={c.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-900 text-[#F5CE62] flex items-center justify-center font-bold">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <div className="text-xs">
                        <div className="font-bold text-sm text-slate-900">
                          {c.name}
                        </div>
                        <div className="text-slate-500">
                          {c.email} • +91 {c.mobile}
                        </div>
                        <div className="text-slate-500">
                          📍 {c.address.fullAddress}, {c.address.villageArea} -{' '}
                          {c.address.pinCode}
                        </div>
                      </div>
                    </div>

                    {accountRole === 'super_admin' && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateCustomers(
                            customers.filter((item) => item.id !== c.id)
                          )
                        }
                        className="p-2 rounded-xl bg-red-50 text-red-600 cursor-pointer"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 11: HOMEPAGE BANNERS & OFFERS ================= */}
          {activeTab === 'homepage' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="text-xl font-bold text-slate-900">
                Homepage Banners &amp; Promotional Content
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={homepageConfig.heroTitle}
                    onChange={(e) =>
                      onUpdateHomepage({
                        ...homepageConfig,
                        heroTitle: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Free Delivery Top Announcement Bar
                  </label>
                  <input
                    type="text"
                    value={homepageConfig.freeDeliveryBanner}
                    onChange={(e) =>
                      onUpdateHomepage({
                        ...homepageConfig,
                        freeDeliveryBanner: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={homepageConfig.heroSubtitle}
                    onChange={(e) =>
                      onUpdateHomepage({
                        ...homepageConfig,
                        heroSubtitle: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Offer Headline
                  </label>
                  <input
                    type="text"
                    value={homepageConfig.promoOfferTitle}
                    onChange={(e) =>
                      onUpdateHomepage({
                        ...homepageConfig,
                        promoOfferTitle: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hero Banner Image URL (or Upload to ImgBB)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={homepageConfig.heroBannerUrl}
                      onChange={(e) =>
                        onUpdateHomepage({
                          ...homepageConfig,
                          heroBannerUrl: e.target.value,
                        })
                      }
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                    />
                    <button
                      type="button"
                      disabled={isUploadingToImgBB}
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="bg-slate-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shrink-0 cursor-pointer"
                    >
                      {isUploadingToImgBB ? 'Uploading...' : 'Upload to ImgBB'}
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onSaveAllToServerDb}
                className="bg-[#4B93FF] text-white text-xs font-bold px-5 py-3 rounded-xl cursor-pointer"
              >
                Save Homepage Settings to Database
              </button>
            </div>
          )}

          {/* ================= TAB 12: REVIEWS MODERATION (`reviews-ratings.html`) ================= */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Customer Product Reviews &amp; Ratings
              </h2>
              <div className="space-y-3">
                {products.flatMap((p) =>
                  p.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between"
                    >
                      <div className="text-xs space-y-1">
                        <div className="font-bold text-slate-900">
                          {rev.customerName} on <em>{p.title}</em> (
                          {'★'.repeat(rev.rating)})
                        </div>
                        <p className="text-slate-600">{rev.comment}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteReview(p.id, rev.id)}
                        className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 13: DUKAN & WEBSITE SETTINGS (SUPER ADMIN ONLY) ================= */}
          {activeTab === 'settings' && accountRole === 'super_admin' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Dukan &amp; Website Master Settings (Horanda 822110)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure store details, WhatsApp numbers, PIN code rules, and download full database backups.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportDatabaseJson}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#4B93FF]" />
                  <span>Export Full Database JSON</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeSettings.storeName}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...storeSettings,
                        storeName: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Area PIN Code
                  </label>
                  <input
                    type="text"
                    value={storeSettings.defaultPinCode}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...storeSettings,
                        defaultPinCode: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono-num font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={storeSettings.whatsappPrimary}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...storeSettings,
                        whatsappPrimary: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Secondary WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={storeSettings.whatsappSecondary}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...storeSettings,
                        whatsappSecondary: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Store Email
                  </label>
                  <input
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...storeSettings,
                        storeEmail: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Allowed Delivery Village / Area
                  </label>
                  <input
                    type="text"
                    value={storeSettings.allowedVillageArea}
                    onChange={(e) =>
                      onUpdateSettings({
                        ...storeSettings,
                        allowedVillageArea: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={onSaveAllToServerDb}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Database className="w-4 h-4" />
                <span>Save All Store Settings to Server Database</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
