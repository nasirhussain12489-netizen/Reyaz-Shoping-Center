/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Truck,
  ShieldCheck,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  CheckCircle2,
  Headphones,
  CreditCard,
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_SELLERS,
  INITIAL_SELLER_LOGS,
  INITIAL_SHOP_EXPENSES,
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_STORE_SETTINGS,
  ProductCatalogItem,
  CategoryTaxonomyItem,
  RegionalOrder,
  OrderStatusType,
  CustomerAccount,
  SellerAccount,
  SellerActivityLog,
  ShopExpenseItem,
  HomepageConfig,
  StoreSettingsConfig,
  mensCasualShirtImg,
  floralMaxiDressImg,
  kidsFestiveWearImg,
  frontDrapeMaroonImg,
  dupattaBorderImg,
} from './data/catalogData';
import {
  ProductCard,
  ProductListingPage,
  ProductDetailsPage,
  CartAndCheckoutView,
  CartItem,
  ContactAndAboutPage,
} from './components/CustomerStorefrontPages';
import {
  CustomerAccountView,
  HiddenManagementLoginModal,
} from './components/CustomerAccountAndOrdersModal';
import {
  SuperAdminDashboard,
  TonerAdminLoginPage,
} from './components/SuperAdminDashboard';
import { ReyazLogo } from './components/ReyazLogo';
import {
  auth,
  signOutFirebase,
  syncProductToFirestore,
  syncOrderToFirestore,
  syncAllStoreDataToFirestore,
  subscribeToAdminProducts,
} from './lib/firebase';

type CustomerPageType =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'account'
  | 'contact'
  | 'about'
  | 'faq'
  | 'policies';

export default function App() {
  // ================= PERSISTENT DATABASE STATE =================
  const [products, setProducts] = useState<ProductCatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem('rsc_db_products_v3');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<CategoryTaxonomyItem[]>(() => {
    try {
      const saved = localStorage.getItem('rsc_db_categories_v3');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [orders, setOrders] = useState<RegionalOrder[]>(() => {
    try {
      const saved = localStorage.getItem('rsc_db_orders_v3');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [customers, setCustomers] = useState<CustomerAccount[]>(() => {
    try {
      const saved = localStorage.getItem('rsc_db_customers_v3');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [sellers, setSellers] = useState<SellerAccount[]>(() => {
    try {
      const saved = localStorage.getItem('rsc_db_sellers_v3');
      return saved ? JSON.parse(saved) : INITIAL_SELLERS;
    } catch {
      return INITIAL_SELLERS;
    }
  });

  const [sellerLogs, setSellerLogs] = useState<SellerActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('rsc_db_seller_logs_v3');
      return saved ? JSON.parse(saved) : INITIAL_SELLER_LOGS;
    } catch {
      return INITIAL_SELLER_LOGS;
    }
  });

  const [expenses, setExpenses] = useState<ShopExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem('rsc_db_expenses_v3');
      return saved ? JSON.parse(saved) : INITIAL_SHOP_EXPENSES;
    } catch {
      return INITIAL_SHOP_EXPENSES;
    }
  });

  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    try {
      const saved = localStorage.getItem('rsc_db_homepage_v3');
      return saved ? JSON.parse(saved) : INITIAL_HOMEPAGE_CONFIG;
    } catch {
      return INITIAL_HOMEPAGE_CONFIG;
    }
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettingsConfig>(() => {
    try {
      const saved = localStorage.getItem('rsc_db_settings_v3');
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  const [adminAvatarUrl, setAdminAvatarUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem('rsc_admin_avatar_v3') || null;
    } catch {
      return null;
    }
  });

  // ================= CUSTOMER SESSION & SHOPPING STATE =================
  const [currentCustomer, setCurrentCustomer] = useState<CustomerAccount | null>(
    () => {
      try {
        const saved = localStorage.getItem('rsc_active_customer_v4');
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
  );

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rsc_wishlist_ids_v3');
      return saved
        ? JSON.parse(saved)
        : ['prod-floral-maxi-01', 'prod-mens-shirt-02', 'prod-rsc-kt-094'];
    } catch {
      return ['prod-floral-maxi-01', 'prod-mens-shirt-02'];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rsc_cart_items_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ================= NAVIGATION & ROUTING STATE (PERSISTED ACROSS REFRESH) =================
  const getInitialNavState = (): {
    page: CustomerPageType;
    category: string;
    subCategory: string;
  } => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlPage = params.get('page') as CustomerPageType | null;
        const urlCat = params.get('category');
        const urlSub = params.get('sub');
        if (urlPage) {
          return {
            page: urlPage,
            category: urlCat || 'All',
            subCategory: urlSub || 'All',
          };
        }
        const saved = sessionStorage.getItem('rsc_active_nav_state_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            page: (parsed.page as CustomerPageType) || 'home',
            category: parsed.category || 'All',
            subCategory: parsed.subCategory || 'All',
          };
        }
      }
    } catch {
      // Ignore storage access errors
    }
    return { page: 'home', category: 'All', subCategory: 'All' };
  };

  const initialNav = getInitialNavState();
  const [currentPage, setCurrentPage] = useState<CustomerPageType>(
    initialNav.page
  );
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>(
    initialNav.category
  );
  const [shopSubCategoryFilter, setShopSubCategoryFilter] = useState<string>(
    initialNav.subCategory
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDetailProductId, setSelectedDetailProductId] = useState<string>(
    INITIAL_PRODUCTS[0].id
  );
  const [lastPlacedOrder, setLastPlacedOrder] = useState<RegionalOrder | null>(
    null
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNavCat, setHoveredNavCat] = useState<string | null>(null);
  const [mobileCols, setMobileCols] = useState<2 | 3>(() => {
    try {
      const saved = localStorage.getItem('rsc_mobile_grid_cols_v1');
      return saved === '3' ? 3 : 2;
    } catch {
      return 2;
    }
  });

  const handleUpdateMobileCols = (cols: 2 | 3) => {
    setMobileCols(cols);
    try {
      localStorage.setItem('rsc_mobile_grid_cols_v1', String(cols));
    } catch {
      // Ignore
    }
  };

  // ================= HIDDEN 4-CLICK MANAGEMENT ACCESS (SUPER ADMIN & SELLER) =================
  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoClickTimerRef = useRef<number | null>(null);
  const [showHiddenAdminLoginModal, setShowHiddenAdminLoginModal] =
    useState(false);
  const [managementSession, setManagementSession] = useState<{
    email: string;
    name: string;
    role: 'super_admin' | 'seller';
    department?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('rsc_management_session_v4');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dbHydrated, setDbHydrated] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  };

  // 1. Hydrate from Server Database (/api/db/state) on mount
  useEffect(() => {
    async function hydrateFromServerDb() {
      try {
        const res = await fetch('/api/db/state');
        const json = await res.json();
        const dbData = json?.data || {};
        if (Array.isArray(dbData.products) && dbData.products.length > 0) {
          setProducts(dbData.products);
        }
        if (Array.isArray(dbData.categories) && dbData.categories.length > 0) {
          setCategories(dbData.categories);
        }
        if (Array.isArray(dbData.orders) && dbData.orders.length > 0) {
          setOrders(dbData.orders);
        }
        if (Array.isArray(dbData.customers) && dbData.customers.length > 0) {
          setCustomers(dbData.customers);
        }
        if (Array.isArray(dbData.sellers) && dbData.sellers.length > 0) {
          setSellers(dbData.sellers);
        }
        if (Array.isArray(dbData.sellerLogs) && dbData.sellerLogs.length > 0) {
          setSellerLogs(dbData.sellerLogs);
        }
        if (Array.isArray(dbData.expenses) && dbData.expenses.length > 0) {
          setExpenses(dbData.expenses);
        }
        if (dbData.homepageConfig) {
          setHomepageConfig(dbData.homepageConfig);
        }
        if (dbData.storeSettings) {
          setStoreSettings(dbData.storeSettings);
        }
      } catch {
        // fallback to local state
      } finally {
        setDbHydrated(true);
      }
    }
    hydrateFromServerDb();
  }, []);

  // 2. Automatically persist all changes to Server Database (/api/db/save) + localStorage
  const saveAllToServerDb = async (showNotice = false) => {
    try {
      localStorage.setItem('rsc_db_products_v3', JSON.stringify(products));
      localStorage.setItem('rsc_db_categories_v3', JSON.stringify(categories));
      localStorage.setItem('rsc_db_orders_v3', JSON.stringify(orders));
      localStorage.setItem('rsc_db_customers_v3', JSON.stringify(customers));
      localStorage.setItem('rsc_db_sellers_v3', JSON.stringify(sellers));
      localStorage.setItem('rsc_db_seller_logs_v3', JSON.stringify(sellerLogs));
      localStorage.setItem('rsc_db_expenses_v3', JSON.stringify(expenses));
      localStorage.setItem(
        'rsc_db_homepage_v3',
        JSON.stringify(homepageConfig)
      );
      localStorage.setItem('rsc_db_settings_v3', JSON.stringify(storeSettings));
      if (adminAvatarUrl) {
        localStorage.setItem('rsc_admin_avatar_v3', adminAvatarUrl);
      }

      await fetch('/api/db/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products,
          categories,
          orders,
          customers,
          sellers,
          sellerLogs,
          expenses,
          homepageConfig,
          storeSettings,
        }),
      });
      await syncAllStoreDataToFirestore(products, orders, sellers);
      if (showNotice) {
        triggerToast(
          'All store data saved to Firebase Cloud Firestore & Server Database!'
        );
      }
    } catch {
      if (showNotice) {
        triggerToast('Saved to local database');
      }
    }
  };

  useEffect(() => {
    if (!dbHydrated) return;
    saveAllToServerDb(false);
  }, [
    products,
    categories,
    orders,
    customers,
    sellers,
    sellerLogs,
    expenses,
    homepageConfig,
    storeSettings,
    dbHydrated,
  ]);

  useEffect(() => {
    try {
      if (managementSession) {
        localStorage.setItem(
          'rsc_management_session_v4',
          JSON.stringify(managementSession)
        );
      } else {
        localStorage.removeItem('rsc_management_session_v4');
      }
    } catch {}
  }, [managementSession]);

  useEffect(() => {
    try {
      if (currentCustomer) {
        localStorage.setItem(
          'rsc_active_customer_v4',
          JSON.stringify(currentCustomer)
        );
      } else {
        localStorage.removeItem('rsc_active_customer_v4');
      }
    } catch {}
  }, [currentCustomer]);

  useEffect(() => {
    try {
      localStorage.setItem('rsc_wishlist_ids_v3', JSON.stringify(wishlistIds));
    } catch {}
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('rsc_cart_items_v3', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Firebase Auth & Cloud Firestore Sync (Auto-opens Super Admin if signed in as nasirhussain12489@gmail.com)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUid(user.uid);
        if (
          user.email &&
          user.email.toLowerCase() === 'nasirhussain12489@gmail.com'
        ) {
          setManagementSession((prev) =>
            prev || {
              email: 'nasirhussain12489@gmail.com',
              name: user.displayName || 'Super Admin (Nasir Hussain)',
              role: 'super_admin',
            }
          );
        }
      } else {
        setFirebaseUid(null);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!firebaseUid) return;
    const unsub = subscribeToAdminProducts(firebaseUid, (cloudMap) => {
      setProducts((prev) =>
        prev.map((item) => {
          const sanitizedId = item.id
            .replace(/[^a-zA-Z0-9_-]/g, '-')
            .slice(0, 120);
          const remote = cloudMap[sanitizedId];
          if (!remote) return item;
          return {
            ...item,
            title: typeof remote.title === 'string' ? remote.title : item.title,
            description:
              typeof remote.description === 'string'
                ? remote.description
                : item.description,
            regularMrp:
              typeof remote.regularMrp === 'number'
                ? remote.regularMrp
                : item.regularMrp,
            sellingPrice:
              typeof remote.sellingPrice === 'number'
                ? remote.sellingPrice
                : item.sellingPrice,
          };
        })
      );
    });
    return () => unsub();
  }, [firebaseUid]);

  // ================= STORE LOGO & NAVIGATION: CLICK TO REFRESH & 5-SECOND HOLD FOR ADMIN LOGIN =================
  const navigatePageWithRefresh = (
    targetPage: CustomerPageType,
    category = 'All',
    subCategory = 'All'
  ) => {
    setCurrentPage(targetPage);
    setSearchQuery('');
    setShopCategoryFilter(category);
    setShopSubCategoryFilter(subCategory);
    setMobileMenuOpen(false);
    setHoveredNavCat(null);
    try {
      sessionStorage.setItem(
        'rsc_active_nav_state_v1',
        JSON.stringify({ page: targetPage, category, subCategory })
      );
      const url = new URL(window.location.href);
      if (targetPage === 'home' && category === 'All' && subCategory === 'All') {
        url.searchParams.delete('page');
        url.searchParams.delete('category');
        url.searchParams.delete('sub');
      } else {
        url.searchParams.set('page', targetPage);
        url.searchParams.set('category', category);
        url.searchParams.set('sub', subCategory);
      }
      window.history.replaceState(null, '', url.toString());
    } catch {
      // Ignore history/sessionStorage errors in restricted frames
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.reload();
  };

  const handleStoreLogoClick = () => {
    navigatePageWithRefresh('home', 'All', 'All');
  };

  const handleStoreLogoHoldFiveSeconds = () => {
    setShowHiddenAdminLoginModal(true);
    triggerToast('Admin & Seller Login Unlocked');
  };

  // ================= SHOPPING HANDLERS =================
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      triggerToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist');
      return next;
    });
  };

  const handleAddToCart = (
    product: ProductCatalogItem,
    sizeCode: string,
    colorName: string,
    qty = 1
  ) => {
    const sizeObj =
      product.sizes.find((s) => s.code === sizeCode) || product.sizes[0];
    if (!sizeObj || sizeObj.stock <= 0) {
      triggerToast('Selected size is currently out of stock');
      return;
    }

    const cartKey = `${product.id}-${sizeCode}-${colorName}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartKey);
      if (existing) {
        return prev.map((i) =>
          i.id === cartKey
            ? { ...i, quantity: Math.min(i.maxStock, i.quantity + qty) }
            : i
        );
      }
      const coverUrl =
        product.mediaGallery.find((m) => m.isCover)?.url ||
        product.mediaGallery[0]?.url ||
        '';
      return [
        ...prev,
        {
          id: cartKey,
          productId: product.id,
          sku: product.sku,
          title: product.title,
          imageUrl: coverUrl,
          size: sizeCode,
          colorName,
          unitPrice: product.sellingPrice,
          regularMrp: product.regularMrp,
          quantity: qty,
          maxStock: sizeObj.stock,
        },
      ];
    });
    triggerToast(`Added "${product.title}" (${sizeCode}) to Shopping Cart`);
  };

  const handleQuickAddToCart = (
    product: ProductCatalogItem,
    selectedSize?: string
  ) => {
    const sizeToUse =
      selectedSize ||
      product.sizes.find((s) => s.stock > 0)?.code ||
      product.sizes[0]?.code ||
      'M';
    const firstColor = product.colorShades[0]?.name || 'Default';
    handleAddToCart(product, sizeToUse, firstColor, 1);
  };

  const handleBuyNow = (
    product: ProductCatalogItem,
    sizeCode: string,
    colorName: string,
    qty = 1
  ) => {
    handleAddToCart(product, sizeCode, colorName, qty);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== cartItemId) return item;
          const nextQ = item.quantity + delta;
          return nextQ > 0
            ? { ...item, quantity: Math.min(item.maxStock, nextQ) }
            : null;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    triggerToast('Item removed from cart');
  };

  const handlePlaceCodOrder = (payload: {
    customerName: string;
    customerMobile: string;
    customerWhatsapp: string;
    customerEmail: string;
    fullAddress: string;
    villageArea: string;
    district: string;
    state: string;
    pinCode: string;
    orderNotes: string;
  }): RegionalOrder | null => {
    if (cart.length === 0) return null;

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const primaryItem = cart[0];
    const summaryTitle =
      cart.length === 1
        ? primaryItem.title
        : `${primaryItem.title} + ${cart.length - 1} more item(s)`;

    const estimatedProfit = cart.reduce((sum, c) => {
      const matched = products.find((p) => p.id === c.productId);
      const unitCost =
        matched?.costPrice ?? Math.round(c.unitPrice * 0.6);
      return sum + Math.max(0, c.unitPrice - unitCost) * c.quantity;
    }, 0);

    const newOrder: RegionalOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `R${Math.floor(2123457 + Math.random() * 9000)}`,
      customerId: currentCustomer?.id || `guest-${Date.now()}`,
      customerName: payload.customerName,
      customerPhone: payload.customerMobile,
      customerWhatsapp: payload.customerWhatsapp,
      customerEmail: payload.customerEmail,
      villageArea: payload.villageArea,
      district: payload.district,
      state: payload.state,
      pinCode: payload.pinCode,
      fullAddress: payload.fullAddress,
      orderNotes: payload.orderNotes,
      sku: primaryItem.sku,
      productTitle: summaryTitle,
      size: primaryItem.size,
      shade: primaryItem.colorName,
      quantity: totalQty,
      amount: totalAmount,
      estimatedProfit,
      isToday: true,
      soldBySellerName: 'Online Store (COD)',
      deliveryCharge: 0,
      items: cart.map((c) => {
        const matched = products.find((p) => p.id === c.productId);
        return {
          productId: c.productId,
          sku: c.sku,
          title: c.title,
          imageUrl: c.imageUrl,
          size: c.size,
          colorName: c.colorName,
          costPrice: matched?.costPrice ?? Math.round(c.unitPrice * 0.6),
          unitPrice: c.unitPrice,
          quantity: c.quantity,
        };
      }),
      status: 'Order Placed',
      timestamp: 'Today, Just now',
    };

    // Deduct stock quantity for ordered items
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const matchingCartItems = cart.filter((c) => c.productId === prod.id);
        if (matchingCartItems.length === 0) return prod;
        return {
          ...prod,
          sizes: prod.sizes.map((s) => {
            const orderedForSize = matchingCartItems
              .filter((c) => c.size === s.code)
              .reduce((sum, c) => sum + c.quantity, 0);
            return orderedForSize > 0
              ? { ...s, stock: Math.max(0, s.stock - orderedForSize) }
              : s;
          }),
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    if (auth.currentUser) {
      syncOrderToFirestore(newOrder);
    }
    setLastPlacedOrder(newOrder);
    setCart([]);
    setCurrentPage('order-confirmation');
    triggerToast(`Order #${newOrder.orderNumber} Placed via Cash on Delivery!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return newOrder;
  };

  // Product Reviews Handlers
  const handleAddReview = (
    productId: string,
    rating: number,
    comment: string
  ) => {
    const reviewerName = currentCustomer?.name || 'Verified Customer (Horanda)';
    const reviewerId = currentCustomer?.id || `cust-${Date.now()}`;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const nextReviews = [
          {
            id: `rev-${Date.now()}`,
            customerId: reviewerId,
            customerName: reviewerName,
            rating,
            comment,
            date: 'Today',
            verifiedBuyer: true,
          },
          ...p.reviews,
        ];
        const avg =
          nextReviews.reduce((s, r) => s + r.rating, 0) / nextReviews.length;
        return {
          ...p,
          reviews: nextReviews,
          rating: Number(avg.toFixed(1)),
          reviewCount: p.reviewCount + 1,
        };
      })
    );
    triggerToast('Thank you! Your review has been saved.');
  };

  const handleDeleteReview = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, reviews: p.reviews.filter((r) => r.id !== reviewId) }
          : p
      )
    );
    triggerToast('Review deleted');
  };

  const openCategoryShop = (catName: string, subCat = 'All') => {
    navigatePageWithRefresh('shop', catName, subCat);
  };

  const openProductDetail = (productId: string) => {
    setSelectedDetailProductId(productId);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ================= SUPER ADMIN & SELLER PORTAL VIEW =================
  if (managementSession) {
    return (
      <>
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0D1B2A] text-white px-4 py-2.5 rounded-full shadow-xl border border-[#D4AF37]/40 flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#F5CE62] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <SuperAdminDashboard
          accountRole={managementSession.role}
          accountName={managementSession.name}
          accountEmail={managementSession.email}
          adminAvatarUrl={adminAvatarUrl}
          onUpdateAdminAvatar={setAdminAvatarUrl}
          products={products}
          categories={categories}
          orders={orders}
          customers={customers}
          sellers={sellers}
          sellerLogs={sellerLogs}
          expenses={expenses}
          homepageConfig={homepageConfig}
          storeSettings={storeSettings}
          onUpdateProducts={setProducts}
          onSaveProductToCloud={async (prod) => {
            if (auth.currentUser) {
              await syncProductToFirestore(prod);
              triggerToast(`Synced ${prod.sku} to Cloud Firestore & Server DB`);
            } else {
              triggerToast(`Saved ${prod.sku} to Server Database`);
            }
          }}
          onUpdateCategories={setCategories}
          onUpdateOrderStatus={(orderId: string, nextStatus: OrderStatusType) => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === orderId ? { ...o, status: nextStatus } : o
              )
            );
            triggerToast(`Updated Order status to "${nextStatus}"`);
          }}
          onAddOrder={(newOrd: RegionalOrder) => {
            setOrders((prev) => [newOrd, ...prev]);
          }}
          onDeleteOrder={(orderId: string) => {
            setOrders((prev) => prev.filter((o) => o.id !== orderId));
            triggerToast('Order removed from database');
          }}
          onUpdateCustomers={setCustomers}
          onUpdateSellers={setSellers}
          onUpdateExpenses={setExpenses}
          onLogSellerAction={(action: string, targetSkuOrOrder: string) => {
            setSellerLogs((prev) => [
              {
                id: `log-${Date.now()}`,
                sellerId: managementSession.email,
                sellerName: managementSession.name,
                sellerEmail: managementSession.email,
                action,
                targetSkuOrOrder,
                timestamp: 'Just now',
              },
              ...prev,
            ]);
          }}
          onUpdateHomepage={setHomepageConfig}
          onUpdateSettings={setStoreSettings}
          onDeleteReview={handleDeleteReview}
          onSaveAllToServerDb={() => saveAllToServerDb(true)}
          onExitToStorefront={() => setManagementSession(null)}
          onLogoutAdmin={() => {
            signOutFirebase().catch(() => {});
            setManagementSession(null);
            setCurrentCustomer(null);
            setCurrentPage('account');
            triggerToast('Logged out');
          }}
          triggerToast={triggerToast}
        />
      </>
    );
  }

  // Computed Homepage Lists
  const visibleProducts = products.filter((p) => p.isVisible);
  const featuredProducts = visibleProducts.filter((p) => p.isFeatured);
  const newArrivalProducts = visibleProducts.filter((p) => p.isNew);
  const trendingProducts = visibleProducts.filter((p) => p.isTrending);
  const menProducts = visibleProducts.filter((p) => p.primaryCategory === 'Men');
  const womenProducts = visibleProducts.filter(
    (p) => p.primaryCategory === 'Women'
  );
  const kidsProducts = visibleProducts.filter(
    (p) => p.primaryCategory === 'Kids'
  );
  const wishedProducts = visibleProducts.filter((p) =>
    wishlistIds.includes(p.id)
  );
  const activeDetailProduct =
    products.find((p) => p.id === selectedDetailProductId) || visibleProducts[0];

  const totalCartItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0D1B2A] flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0D1B2A] text-white px-4 py-2.5 rounded-full shadow-xl border border-[#D4AF37]/40 flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-[#F5CE62] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Store Header Bar matching Mockup Screen #1 */}
      <header className="sticky top-0 z-40 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu Button + Transparent-BG Reyaz Logo (4-Click Hidden Admin Access) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#FAF8F5] text-[#0D1B2A]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            <ReyazLogo
              size="md"
              theme="light"
              onClick={handleStoreLogoClick}
              onLongPressFiveSeconds={handleStoreLogoHoldFiveSeconds}
            />
          </div>

          {/* Center: Wide Rounded Search Bar matching Mockup */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentPage !== 'shop') setCurrentPage('shop');
                }}
                placeholder="Search for products, categories, brands..."
                className="w-full bg-[#F4F1EA] focus:bg-white border border-[#E6E1D6] focus:border-[#0D1B2A] rounded-l-full pl-10 pr-4 py-2.5 text-xs font-medium text-[#0D1B2A] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setCurrentPage('shop')}
                className="bg-[#0D1B2A] hover:bg-[#1B263B] text-white px-5 py-2.5 rounded-r-full text-xs font-bold flex items-center justify-center cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Icons: Login / Profile, Wishlist, Shopping Cart */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              type="button"
              onClick={() => setCurrentPage('account')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-[#FAF8F5] border border-transparent hover:border-[#E6E1D6] text-xs font-bold text-[#0D1B2A] cursor-pointer"
              title="Customer Profile & Orders"
            >
              {currentCustomer?.profilePhotoUrl ? (
                <img
                  src={currentCustomer.profilePhotoUrl}
                  alt={currentCustomer.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-stone-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#0D1B2A]" />
                </div>
              )}
              <span className="hidden sm:inline max-w-[90px] truncate">
                {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Login'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('wishlist')}
              className="relative p-2 rounded-full hover:bg-[#FAF8F5] text-[#0D1B2A] cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#B8860B] text-white text-[10px] font-mono-num font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 rounded-full hover:bg-[#FAF8F5] text-[#0D1B2A] cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] font-mono-num font-bold flex items-center justify-center">
                {totalCartItems}
              </span>
            </button>
          </div>
        </div>

        {/* Full-Width Deep Navy Navigation Bar with Multi-Column Mega Menus (Screen #1) */}
        <nav className="hidden lg:block bg-[#0D1B2A] text-white border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 h-12">
            <button
              type="button"
              onClick={() => navigatePageWithRefresh('home', 'All', 'All')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentPage === 'home'
                  ? 'text-[#F5CE62] underline underline-offset-8 decoration-2'
                  : 'text-white hover:text-[#F5CE62]'
              }`}
            >
              Home
            </button>

            {sortedCategories.map((cat) => (
              <div
                key={cat.id}
                className="relative h-full flex items-center"
                onMouseEnter={() => setHoveredNavCat(cat.id)}
                onMouseLeave={() => setHoveredNavCat(null)}
              >
                <button
                  type="button"
                  onClick={() => openCategoryShop(cat.name, 'All')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    currentPage === 'shop' && shopCategoryFilter === cat.name
                      ? 'text-[#F5CE62] underline underline-offset-8 decoration-2'
                      : 'text-white hover:text-[#F5CE62]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {/* Multi-Column Mega-Dropdown Menu */}
                {hoveredNavCat === cat.id && (
                  <div className="absolute left-0 top-full pt-1 w-[680px] z-50">
                    <div className="bg-white text-[#0D1B2A] rounded-2xl border border-[#E6E1D6] shadow-2xl p-6 grid grid-cols-4 gap-6">
                      {(cat.megaMenuGroups && cat.megaMenuGroups.length > 0
                        ? cat.megaMenuGroups
                        : [
                            {
                              groupTitle: `${cat.name} Categories`,
                              items: cat.subcategories,
                            },
                          ]
                      ).map((group) => (
                        <div key={group.groupTitle} className="space-y-2">
                          <div className="text-xs font-extrabold uppercase tracking-wider text-[#B8860B] border-b border-stone-100 pb-1">
                            {group.groupTitle}
                          </div>
                          <ul className="space-y-1">
                            {group.items.map((sub) => (
                              <li key={sub}>
                                <button
                                  type="button"
                                  onClick={() => openCategoryShop(cat.name, sub)}
                                  className="text-left text-xs text-stone-600 hover:text-[#0D1B2A] hover:font-bold py-0.5 cursor-pointer"
                                >
                                  {sub}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => openCategoryShop('All', 'All')}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white hover:text-[#F5CE62] cursor-pointer"
            >
              New Arrivals
            </button>

            <button
              type="button"
              onClick={() => openCategoryShop('All', 'Traditional Wear')}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white hover:text-[#F5CE62] cursor-pointer"
            >
              Traditional Wear
            </button>

            <button
              type="button"
              onClick={() => openCategoryShop('All', 'All')}
              className="px-4 py-2 rounded-lg text-xs font-bold text-[#F5CE62] hover:underline cursor-pointer"
            >
              Offers &amp; Sale
            </button>

            <button
              type="button"
              onClick={() => navigatePageWithRefresh('contact', 'All', 'All')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentPage === 'contact'
                  ? 'text-[#F5CE62] underline underline-offset-8 decoration-2'
                  : 'text-white hover:text-[#F5CE62]'
              }`}
            >
              Contact
            </button>

            <div className="ml-auto text-[11px] font-semibold text-[#F5CE62] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Horanda Alias Ramgarh, Jharkhand (JH) - 822110 (Free COD)</span>
            </div>
          </div>
        </nav>

        {/* Mobile Always-Visible Search & Quick Category Bar (Phone View matching Desktop) */}
        <div className="lg:hidden bg-[#0D1B2A] text-white border-t border-white/10 px-3 py-2 space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentPage !== 'shop') setCurrentPage('shop');
                }}
                placeholder="Search dresses, kurtis, shirts, sarees..."
                className="w-full bg-white text-[#0D1B2A] rounded-full pl-8 pr-3 py-1.5 text-xs font-medium focus:outline-none"
              />
            </div>

            {/* Mobile 2-Dress vs 3-Dress Grid Switcher */}
            <div className="flex items-center bg-white/10 border border-white/15 rounded-full p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => handleUpdateMobileCols(2)}
                className={`px-2 py-1 rounded-full text-[10px] font-extrabold transition-colors cursor-pointer ${
                  mobileCols === 2
                    ? 'bg-[#F5CE62] text-[#0D1B2A]'
                    : 'text-white/80'
                }`}
                title="Show 2 dresses per row on phone"
              >
                2x
              </button>
              <button
                type="button"
                onClick={() => handleUpdateMobileCols(3)}
                className={`px-2 py-1 rounded-full text-[10px] font-extrabold transition-colors cursor-pointer ${
                  mobileCols === 3
                    ? 'bg-[#F5CE62] text-[#0D1B2A]'
                    : 'text-white/80'
                }`}
                title="Show 3 dresses per row on phone"
              >
                3x
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Category Navigation (Refreshes on Click) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => navigatePageWithRefresh('home', 'All', 'All')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                currentPage === 'home'
                  ? 'bg-[#F5CE62] text-[#0D1B2A]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Home
            </button>
            {sortedCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => openCategoryShop(cat.name, 'All')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  currentPage === 'shop' && shopCategoryFilter === cat.name
                    ? 'bg-[#F5CE62] text-[#0D1B2A]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => openCategoryShop('All', 'Traditional Wear')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                currentPage === 'shop' &&
                shopSubCategoryFilter === 'Traditional Wear'
                  ? 'bg-[#F5CE62] text-[#0D1B2A]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Traditional
            </button>
            <button
              type="button"
              onClick={() => openCategoryShop('All', 'All')}
              className="px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap bg-white/10 text-[#F5CE62] hover:bg-white/20 cursor-pointer"
            >
              Offers
            </button>
            <button
              type="button"
              onClick={() => navigatePageWithRefresh('contact', 'All', 'All')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                currentPage === 'contact'
                  ? 'bg-[#F5CE62] text-[#0D1B2A]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Contact
            </button>
          </div>
        </div>

        {/* Mobile Search & Accordion Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage('shop');
                }}
                placeholder="Search Men, Women, Kids clothing..."
                className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigatePageWithRefresh('home', 'All', 'All')}
                className="px-3 py-1.5 rounded-xl bg-[#0D1B2A] text-white text-xs font-bold"
              >
                Home
              </button>
              {sortedCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => openCategoryShop(cat.name, 'All')}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs font-bold"
                >
                  {cat.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => navigatePageWithRefresh('contact', 'All', 'All')}
                className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs font-bold"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= MAIN PAGE CONTENT ================= */}
      <main className="flex-1">
        {/* 1. MODERN HOMEPAGE MATCHING SCREEN #1 (NO TRY-ON) */}
        {currentPage === 'home' && (
          <div className="space-y-7 sm:space-y-12 pb-16">
            {/* Hero Banner matching Screen #1 ("Style for Every You") */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#EFECE6] border border-[#E6E1D6] shadow-md min-h-[210px] sm:min-h-[430px] flex items-center">
                <img
                  src={homepageConfig.heroBannerUrl}
                  alt={homepageConfig.heroTitle}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/95 via-[#FAF8F5]/80 to-transparent" />

                <div className="relative z-10 p-5 sm:p-14 max-w-xl space-y-2.5 sm:space-y-4">
                  <span className="inline-block bg-[#0D1B2A] text-[#F5CE62] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-2.5 sm:px-3 py-1 rounded-full">
                    {homepageConfig.heroBadge}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-6xl font-bold text-[#0D1B2A] leading-[1.08]">
                    {homepageConfig.heroTitle}
                  </h1>
                  <p className="text-[11px] sm:text-sm font-medium text-stone-700 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {homepageConfig.heroSubtitle}
                  </p>
                  <div className="pt-1 sm:pt-2">
                    <button
                      type="button"
                      onClick={() => openCategoryShop('All', 'All')}
                      className="bg-[#0D1B2A] hover:bg-[#1B263B] text-white font-bold text-xs sm:text-sm px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                    >
                      <span>{homepageConfig.heroCtaText}</span>
                      <ChevronRight className="w-4 h-4 text-[#F5CE62]" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Circular Category Bubbles Row matching Screen #1 (All 5 side-by-side on Phone & Desktop) */}
            <section className="max-w-5xl mx-auto px-3 sm:px-6">
              <div className="grid grid-cols-5 gap-2 sm:gap-4 text-center">
                {[
                  {
                    label: 'Men',
                    img: mensCasualShirtImg,
                    action: () => openCategoryShop('Men', 'All'),
                  },
                  {
                    label: 'Women',
                    img: floralMaxiDressImg,
                    action: () => openCategoryShop('Women', 'All'),
                  },
                  {
                    label: 'Kids',
                    img: kidsFestiveWearImg,
                    action: () => openCategoryShop('Kids', 'All'),
                  },
                  {
                    label: 'Offers',
                    img: frontDrapeMaroonImg,
                    action: () => openCategoryShop('All', 'All'),
                  },
                  {
                    label: 'Traditional',
                    img: dupattaBorderImg,
                    action: () => openCategoryShop('All', 'Traditional Wear'),
                  },
                ].map((bubble) => (
                  <button
                    key={bubble.label}
                    type="button"
                    onClick={bubble.action}
                    className="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-white shadow-xs group-hover:scale-105 transition-transform">
                      <img
                        src={bubble.img}
                        alt={bubble.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] sm:text-sm font-bold text-[#0D1B2A] group-hover:text-[#B8860B] truncate max-w-full">
                      {bubble.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured Products Row matching Screen #1 (2-3 Dresses per Row on Phone, 5 on Desktop) */}
            {homepageConfig.showFeatured && featuredProducts.length > 0 && (
              <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#0D1B2A]">
                    Featured Products
                  </h2>
                  <button
                    type="button"
                    onClick={() => openCategoryShop('All', 'All')}
                    className="text-xs font-bold text-[#0D1B2A] hover:text-[#B8860B] flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div
                  className={`grid ${
                    mobileCols === 3
                      ? 'grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5'
                      : 'grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5'
                  }`}
                >
                  {featuredProducts.slice(0, 6).map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      isWished={wishlistIds.includes(item.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onOpenDetail={openProductDetail}
                      onQuickAddToCart={handleQuickAddToCart}
                      mobileCols={mobileCols}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3 Promotional Split Cards matching Screen #1 (Replaced Try-On with Festive Ethnic Collection!) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1: Special Offers */}
                <div className="bg-[#FDF2EC] rounded-2xl border border-[#F5D0C5] p-6 flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B83B1D]">
                      LIMITED TIME SALE
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">
                      Special Offers
                    </h3>
                    <p className="text-xs font-semibold text-stone-600">
                      Up to 50% OFF on Men, Women &amp; Kids
                    </p>
                    <button
                      type="button"
                      onClick={() => openCategoryShop('All', 'All')}
                      className="bg-[#0D1B2A] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Shop Now &gt;
                    </button>
                  </div>
                  <img
                    src={frontDrapeMaroonImg}
                    alt="Special Offers"
                    className="w-24 h-28 rounded-xl object-cover shrink-0"
                  />
                </div>

                {/* Card 2: Festive & Wedding Ethnic Collection */}
                <div className="bg-[#EEF2FF] rounded-2xl border border-[#C7D2FE] p-6 flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1E3A8A]">
                      ROYAL HERITAGE
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">
                      Festive &amp; Wedding Edit
                    </h3>
                    <p className="text-xs font-semibold text-stone-600">
                      Banarasi Sarees, Kurtis &amp; Kurta Sets
                    </p>
                    <button
                      type="button"
                      onClick={() => openCategoryShop('All', 'Traditional Wear')}
                      className="bg-[#0D1B2A] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Explore Edit &gt;
                    </button>
                  </div>
                  <img
                    src={dupattaBorderImg}
                    alt="Festive Collection"
                    className="w-24 h-28 rounded-xl object-cover shrink-0"
                  />
                </div>

                {/* Card 3: Free Delivery in Horanda Alias Ramgarh (822110) */}
                <div className="bg-[#ECFDF5] rounded-2xl border border-[#A7F3D0] p-6 flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#15803D]">
                      100% CASH ON DELIVERY
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">
                      Free Delivery
                    </h3>
                    <p className="text-xs font-semibold text-stone-600">
                      Only in Horanda Alias Ramgarh, Palamu, Jharkhand - 822110
                    </p>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('policies')}
                      className="bg-[#0D1B2A] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Learn More &gt;
                    </button>
                  </div>
                  <div className="w-20 h-20 rounded-2xl bg-white border border-[#A7F3D0] flex items-center justify-center shrink-0">
                    <Truck className="w-10 h-10 text-[#15803D]" />
                  </div>
                </div>
              </div>
            </section>

            {/* Trending & New Arrivals Section (2-3 Dresses per Row on Phone) */}
            {homepageConfig.showTrendingSection && trendingProducts.length > 0 && (
              <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#B8860B]">
                      TRENDING IN HORANDA (822110)
                    </span>
                    <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#0D1B2A]">
                      Trending &amp; Bestselling Fashion
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCategoryShop('All', 'All')}
                    className="text-xs font-bold text-[#0D1B2A] hover:underline cursor-pointer"
                  >
                    Explore All →
                  </button>
                </div>

                <div
                  className={`grid ${
                    mobileCols === 3
                      ? 'grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4'
                      : 'grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4'
                  }`}
                >
                  {trendingProducts.slice(0, 6).map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      isWished={wishlistIds.includes(item.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onOpenDetail={openProductDetail}
                      onQuickAddToCart={handleQuickAddToCart}
                      mobileCols={mobileCols}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Department Showcases: Women, Men, Kids (2-3 Dresses per Row on Phone) */}
            {[
              { title: "Women's Fashion", cat: 'Women', items: womenProducts },
              { title: "Men's Fashion", cat: 'Men', items: menProducts },
              { title: "Kids' Collection", cat: 'Kids', items: kidsProducts },
            ].map((sec) => (
              <section
                key={sec.cat}
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0D1B2A]">
                    {sec.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => openCategoryShop(sec.cat, 'All')}
                    className="text-xs font-bold text-[#B8860B] hover:underline cursor-pointer"
                  >
                    Shop All {sec.cat} →
                  </button>
                </div>
                <div
                  className={`grid ${
                    mobileCols === 3
                      ? 'grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4'
                      : 'grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4'
                  }`}
                >
                  {sec.items.slice(0, 6).map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      isWished={wishlistIds.includes(item.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onOpenDetail={openProductDetail}
                      onQuickAddToCart={handleQuickAddToCart}
                      mobileCols={mobileCols}
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* 4 Trust Indicators Bar matching Screen #1 */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl border border-[#E6E1D6] p-5 grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-[#0D1B2A]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D1B2A]">
                      Free Delivery
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Horanda Alias Ramgarh (822110)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-[#15803D]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D1B2A]">
                      Cash on Delivery
                    </div>
                    <div className="text-[11px] text-stone-500">
                      100% COD Only
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#B8860B]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D1B2A]">
                      Secure Shopping
                    </div>
                    <div className="text-[11px] text-stone-500">
                      100% Safe &amp; Verified
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5 text-[#15803D]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0D1B2A]">
                      24/7 Support
                    </div>
                    <div className="text-[11px] text-stone-500">
                      WhatsApp &amp; Email
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. PRODUCT LISTING PAGE (SCREENS #2, #3, #12) */}
        {currentPage === 'shop' && (
          <ProductListingPage
            products={products}
            categories={categories}
            initialCategory={shopCategoryFilter}
            initialSubCategory={shopSubCategoryFilter}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onOpenDetail={openProductDetail}
            onQuickAddToCart={handleQuickAddToCart}
            onNavigateHome={() => navigatePageWithRefresh('home', 'All', 'All')}
            onSelectCategory={(cat, sub) => openCategoryShop(cat, sub || 'All')}
            mobileCols={mobileCols}
            onChangeMobileCols={handleUpdateMobileCols}
          />
        )}

        {/* 3. PRODUCT DETAILS PAGE (SCREEN #4) */}
        {currentPage === 'product-detail' && activeDetailProduct && (
          <ProductDetailsPage
            product={activeDetailProduct}
            allProducts={products}
            isWished={wishlistIds.includes(activeDetailProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onOpenDetail={openProductDetail}
            onBack={() => setCurrentPage('shop')}
            currentCustomer={currentCustomer}
            onAddReview={handleAddReview}
            onDeleteReview={handleDeleteReview}
            storeSettings={storeSettings}
          />
        )}

        {/* 4. WISHLIST PAGE (SCREEN #6) */}
        {currentPage === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E1D6] pb-4">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D1B2A]">
                ← My Wishlist ({wishedProducts.length})
              </h1>
              <button
                type="button"
                onClick={() => setCurrentPage('shop')}
                className="text-xs font-bold text-[#B8860B] hover:underline cursor-pointer"
              >
                Continue Shopping →
              </button>
            </div>

            {wishedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E6E1D6] p-12 text-center space-y-3">
                <Heart className="w-10 h-10 text-stone-400 mx-auto" />
                <h2 className="font-serif text-xl font-bold">
                  Your Wishlist is Empty
                </h2>
                <p className="text-xs text-stone-500">
                  Tap the heart icon on any outfit to save it here.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentPage('shop')}
                  className="bg-[#0D1B2A] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div
                className={`grid ${
                  mobileCols === 3
                    ? 'grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4'
                    : 'grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4'
                }`}
              >
                {wishedProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    isWished={true}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenDetail={openProductDetail}
                    onQuickAddToCart={handleQuickAddToCart}
                    mobileCols={mobileCols}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. CART, CHECKOUT & ORDER CONFIRMATION (SCREENS #7 & #8) */}
        {(currentPage === 'cart' ||
          currentPage === 'checkout' ||
          currentPage === 'order-confirmation') && (
          <CartAndCheckoutView
            mode={
              currentPage === 'cart'
                ? 'cart'
                : currentPage === 'checkout'
                ? 'checkout'
                : 'confirmation'
            }
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveCartItem={handleRemoveCartItem}
            onProceedToCheckout={() => setCurrentPage('checkout')}
            onContinueShopping={() => setCurrentPage('shop')}
            currentCustomer={currentCustomer}
            storeSettings={storeSettings}
            onPlaceCodOrder={handlePlaceCodOrder}
            lastPlacedOrder={lastPlacedOrder}
            onViewMyOrders={() => setCurrentPage('account')}
          />
        )}

        {/* 6. CUSTOMER LOGIN, PROFILE PHOTO, ADDRESSES & ORDER TRACKING (SCREENS #9, #10, #13, #14, #15) */}
        {currentPage === 'account' && (
          <CustomerAccountView
            currentCustomer={currentCustomer}
            customers={customers}
            sellers={sellers}
            orders={orders}
            storeSettings={storeSettings}
            onLoginCustomer={(cust) => {
              setCurrentCustomer(cust);
              triggerToast(`Welcome back, ${cust.name}!`);
            }}
            onRegisterCustomer={(newCust) => {
              setCustomers((prev) => [newCust, ...prev]);
              setCurrentCustomer(newCust);
              triggerToast(`Signed in as ${newCust.name}`);
            }}
            onUpdateCustomer={(updated) => {
              setCustomers((prev) =>
                prev.map((c) => (c.id === updated.id ? updated : c))
              );
              setCurrentCustomer(updated);
              triggerToast('Profile & photo saved to database');
            }}
            onLogoutCustomer={() => {
              setCurrentCustomer(null);
              triggerToast('Logged out of customer account');
            }}
            onOpenWishlist={() => setCurrentPage('wishlist')}
            onCancelCustomerOrder={(orderId) => {
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === orderId ? { ...o, status: 'Cancelled' } : o
                )
              );
              triggerToast('Order cancelled');
            }}
            onDirectSuperAdminLogin={(account) => {
              setManagementSession(account);
              triggerToast(
                `Welcome ${account.name} (${
                  account.role === 'super_admin' ? 'Super Admin' : 'Seller'
                })`
              );
            }}
          />
        )}

        {/* 7. CONTACT, ABOUT, FAQ & POLICIES */}
        {(currentPage === 'contact' ||
          currentPage === 'about' ||
          currentPage === 'faq' ||
          currentPage === 'policies') && (
          <ContactAndAboutPage
            view={currentPage}
            storeSettings={storeSettings}
          />
        )}
      </main>

      {/* ================= DARK NAVY FOOTER MATCHING SCREEN #1 ================= */}
      <footer className="bg-[#0D1B2A] text-white border-t border-white/10 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <ReyazLogo
              size="md"
              theme="dark"
              onClick={handleStoreLogoClick}
              onLongPressFiveSeconds={handleStoreLogoHoldFiveSeconds}
            />
            <p className="text-xs text-stone-300 leading-relaxed pt-1">
              “For more information about Cash on Delivery, delivery, products, or orders, please contact us.”
            </p>
            <div className="text-xs text-[#F5CE62] font-semibold">
              Horanda Alias Ramgarh, Palamu, Jharkhand (JH) - 822110, India
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold uppercase tracking-wider text-[#F5CE62]">
              Quick Links
            </div>
            <ul className="space-y-1.5 text-stone-300">
              <li>
                <button
                  type="button"
                  onClick={() => navigatePageWithRefresh('home', 'All', 'All')}
                  className="hover:text-white cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openCategoryShop('Men', 'All')}
                  className="hover:text-white cursor-pointer"
                >
                  Men
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openCategoryShop('Women', 'All')}
                  className="hover:text-white cursor-pointer"
                >
                  Women
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openCategoryShop('Kids', 'All')}
                  className="hover:text-white cursor-pointer"
                >
                  Kids
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openCategoryShop('All', 'Traditional Wear')}
                  className="hover:text-white cursor-pointer"
                >
                  Traditional Wear
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold uppercase tracking-wider text-[#F5CE62]">
              Customer Service
            </div>
            <ul className="space-y-1.5 text-stone-300">
              <li>
                <button
                  type="button"
                  onClick={() => navigatePageWithRefresh('account', 'All', 'All')}
                  className="hover:text-white cursor-pointer"
                >
                  Track Order / My Orders
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigatePageWithRefresh('policies', 'All', 'All')}
                  className="hover:text-white cursor-pointer"
                >
                  Return &amp; Delivery Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigatePageWithRefresh('faq', 'All', 'All')}
                  className="hover:text-white cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigatePageWithRefresh('contact', 'All', 'All')}
                  className="hover:text-white cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigatePageWithRefresh('about', 'All', 'All')}
                  className="hover:text-white cursor-pointer"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold uppercase tracking-wider text-[#F5CE62]">
              Contact Us
            </div>
            <div className="space-y-2 text-stone-300">
              <a
                href={`https://wa.me/91${storeSettings.whatsappPrimary}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#F5CE62]"
              >
                <MessageCircle className="w-4 h-4 text-[#15803D]" />
                <span>{storeSettings.whatsappPrimary}</span>
              </a>
              <a
                href={`https://wa.me/91${storeSettings.whatsappSecondary}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#F5CE62]"
              >
                <Phone className="w-4 h-4 text-[#F5CE62]" />
                <span>{storeSettings.whatsappSecondary}</span>
              </a>
              <a
                href={`mailto:${storeSettings.storeEmail}`}
                className="flex items-center gap-2 hover:text-[#F5CE62] break-all"
              >
                <Mail className="w-4 h-4 text-[#F5CE62]" />
                <span>{storeSettings.storeEmail}</span>
              </a>
              <div className="flex items-start gap-2 text-stone-300 pt-1">
                <MapPin className="w-4 h-4 text-[#F5CE62] shrink-0 mt-0.5" />
                <span>
                  Horanda Alias Ramgarh, Palamu, Jharkhand (JH) - 822110, India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-4 px-4 text-center text-[11px] text-stone-400">
          © {new Date().getFullYear()} Reyaz Shopping Center • Horanda Alias Ramgarh, Palamu, Jharkhand (JH) - 822110 • All rights reserved.
        </div>
      </footer>

      {/* Floating WhatsApp Quick Contact Button */}
      <a
        href={`https://wa.me/91${storeSettings.whatsappPrimary}?text=${encodeURIComponent(
          'Assalamu Alaikum Reyaz Shopping Center! I have a question regarding products and Cash on Delivery in Horanda Alias Ramgarh, Jharkhand (JH) - 822110.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-16 lg:bottom-5 right-4 lg:right-5 z-40 bg-[#15803D] hover:bg-green-800 text-white px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">WhatsApp Support</span>
      </a>

      {/* Sticky Bottom Mobile App Navigation Bar (Phone View) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0D1B2A] text-white border-t border-white/15 px-2 py-1.5 grid grid-cols-5 gap-1 shadow-2xl">
        <button
          type="button"
          onClick={() => navigatePageWithRefresh('home', 'All', 'All')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold cursor-pointer ${
            currentPage === 'home' ? 'text-[#F5CE62]' : 'text-stone-300'
          }`}
        >
          <span>Home</span>
        </button>
        <button
          type="button"
          onClick={() => openCategoryShop('Men', 'All')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold cursor-pointer ${
            currentPage === 'shop' && shopCategoryFilter === 'Men'
              ? 'text-[#F5CE62]'
              : 'text-stone-300'
          }`}
        >
          <span>Men</span>
        </button>
        <button
          type="button"
          onClick={() => openCategoryShop('Women', 'All')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold cursor-pointer ${
            currentPage === 'shop' && shopCategoryFilter === 'Women'
              ? 'text-[#F5CE62]'
              : 'text-stone-300'
          }`}
        >
          <span>Women</span>
        </button>
        <button
          type="button"
          onClick={() => openCategoryShop('Kids', 'All')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold cursor-pointer ${
            currentPage === 'shop' && shopCategoryFilter === 'Kids'
              ? 'text-[#F5CE62]'
              : 'text-stone-300'
          }`}
        >
          <span>Kids</span>
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage('cart')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold cursor-pointer ${
            currentPage === 'cart' ? 'text-[#F5CE62]' : 'text-stone-300'
          }`}
        >
          <span>Cart ({totalCartItems})</span>
        </button>
      </nav>

      {/* 5-Second Hold on Store Logo -> Opens Dedicated Toner Admin & Seller Login Page */}
      {showHiddenAdminLoginModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0F172A]">
          <TonerAdminLoginPage
            sellers={sellers}
            onBackToStorefront={() => setShowHiddenAdminLoginModal(false)}
            onSuccessManagementLogin={(account) => {
              setShowHiddenAdminLoginModal(false);
              setManagementSession(account);
              triggerToast(
                `Logged in as ${account.name} (${
                  account.role === 'super_admin' ? 'Super Admin' : 'Seller'
                })`
              );
            }}
          />
        </div>
      )}
    </div>
  );
}
