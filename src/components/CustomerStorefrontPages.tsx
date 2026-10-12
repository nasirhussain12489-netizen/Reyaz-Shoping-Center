import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Star,
  SlidersHorizontal,
  Check,
  Truck,
  ShieldCheck,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Ruler,
  X,
  HelpCircle,
  FileText,
} from 'lucide-react';
import {
  ProductCatalogItem,
  CategoryTaxonomyItem,
  RegionalOrder,
  StoreSettingsConfig,
  CustomerAccount,
  OrderItemLine,
} from '../data/catalogData';

// ================= REUSABLE PRODUCT CARD (NO TRY-ON — MOBILE 2-3 COL & DESKTOP READY) =================
interface ProductCardProps {
  product: ProductCatalogItem;
  isWished: boolean;
  onToggleWishlist: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onQuickAddToCart: (product: ProductCatalogItem, selectedSize?: string) => void;
  mobileCols?: 2 | 3;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWished,
  onToggleWishlist,
  onOpenDetail,
  onQuickAddToCart,
  mobileCols = 2,
}) => {
  const [pickedSize, setPickedSize] = useState<string>(
    product.sizes.find((s) => s.stock > 0)?.code || product.sizes[0]?.code || 'M'
  );

  const cover =
    product.mediaGallery.find((m) => m.isCover) || product.mediaGallery[0];
  const discountPct =
    product.regularMrp > 0 && product.regularMrp > product.sellingPrice
      ? Math.round(
          ((product.regularMrp - product.sellingPrice) / product.regularMrp) * 100
        )
      : 0;
  const totalStock = product.sizes.reduce((s, item) => s + item.stock, 0);
  const isDenseMobile = mobileCols === 3;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E6E1D6] overflow-hidden flex flex-col justify-between group hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
      <div>
        {/* Product Image Container */}
        <div
          onClick={() => onOpenDetail(product.id)}
          className="relative aspect-[3/4] bg-[#F4F1EA] overflow-hidden cursor-pointer"
        >
          {cover && (
            <img
              src={cover.url}
              alt={product.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Top Left Badges matching Mockup (NEW / SALE) */}
          <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex items-center gap-1">
            {product.isNew ? (
              <span className="bg-[#15803D] text-white text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 rounded shadow-xs">
                NEW
              </span>
            ) : discountPct >= 30 ? (
              <span className="bg-[#DC2626] text-white text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 rounded shadow-xs">
                SALE
              </span>
            ) : null}
            {totalStock <= 0 && (
              <span className="bg-stone-900 text-white text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2.5 py-0.5 rounded">
                OUT
              </span>
            )}
          </div>

          {/* Top Right Wishlist Heart */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            aria-label="Toggle Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isWished ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#0D1B2A]'
              }`}
            />
          </button>
        </div>

        {/* Card Body */}
        <div
          className={`${
            isDenseMobile ? 'p-1.5 sm:p-3.5 space-y-1 sm:space-y-2' : 'p-2.5 sm:p-3.5 space-y-1.5 sm:space-y-2'
          }`}
        >
          <h3
            onClick={() => onOpenDetail(product.id)}
            className={`font-semibold ${
              isDenseMobile ? 'text-[10px] sm:text-sm' : 'text-xs sm:text-sm'
            } text-[#0D1B2A] leading-snug line-clamp-1 cursor-pointer hover:text-[#B8860B] transition-colors`}
          >
            {product.title}
          </h3>

          {/* Price & Discount Row */}
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <div className="flex items-baseline gap-1">
              <span
                className={`font-mono-num font-extrabold ${
                  isDenseMobile ? 'text-[11px] sm:text-base' : 'text-xs sm:text-base'
                } text-[#0D1B2A]`}
              >
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.regularMrp > product.sellingPrice && (
                <span
                  className={`font-mono-num ${
                    isDenseMobile ? 'text-[9px] sm:text-xs' : 'text-[10px] sm:text-xs'
                  } text-stone-400 line-through`}
                >
                  ₹{product.regularMrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPct > 0 && (
              <span
                className={`${
                  isDenseMobile ? 'text-[8px] sm:text-[11px]' : 'text-[10px] sm:text-[11px]'
                } font-bold text-[#15803D]`}
              >
                {discountPct}% OFF
              </span>
            )}
          </div>

          {/* Rating & Color Swatches Row */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs pt-0.5">
            <div className="flex items-center gap-0.5 sm:gap-1 text-stone-600 font-medium">
              <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="font-bold text-[#0D1B2A]">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-[9px] sm:text-[11px] text-stone-400">
                ({product.reviewCount})
              </span>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              {product.colorShades.slice(0, isDenseMobile ? 3 : 4).map((c) => (
                <span
                  key={c.id}
                  title={c.name}
                  className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border border-stone-300"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Interactive Size Pills Row matching Mockup */}
          <div className="flex items-center gap-1 pt-0.5 flex-wrap">
            {product.sizes.slice(0, isDenseMobile ? 4 : 5).map((s) => {
              const active = pickedSize === s.code;
              const out = s.stock <= 0;
              return (
                <button
                  key={s.code}
                  type="button"
                  disabled={out}
                  onClick={() => setPickedSize(s.code)}
                  className={`${
                    isDenseMobile ? 'px-1 py-0.5 text-[8px] sm:px-2 sm:text-[10px]' : 'px-1.5 py-0.5 text-[9px] sm:px-2 sm:text-[10px]'
                  } rounded font-bold border transition-colors cursor-pointer ${
                    out
                      ? 'bg-stone-100 text-stone-300 border-stone-200 line-through cursor-not-allowed'
                      : active
                      ? 'bg-[#0D1B2A] text-white border-[#0D1B2A]'
                      : 'bg-[#FAF8F5] text-stone-600 border-stone-200 hover:border-[#0D1B2A]'
                  }`}
                >
                  {s.code}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full-Width Deep Navy Add to Cart Button */}
      <div
        className={`${
          isDenseMobile ? 'px-1.5 pb-1.5 sm:px-3.5 sm:pb-3.5' : 'px-2.5 pb-2.5 sm:px-3.5 sm:pb-3.5'
        } pt-1`}
      >
        <button
          type="button"
          disabled={totalStock <= 0}
          onClick={() => onQuickAddToCart(product, pickedSize)}
          className={`w-full bg-[#0D1B2A] hover:bg-[#1B263B] disabled:opacity-40 text-white ${
            isDenseMobile
              ? 'text-[9px] sm:text-xs py-1.5 sm:py-2.5 px-1.5 sm:px-3 rounded-lg sm:rounded-xl'
              : 'text-[11px] sm:text-xs py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl'
          } font-bold flex items-center justify-center gap-1 sm:gap-2 transition-colors cursor-pointer`}
        >
          <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F5CE62] shrink-0" />
          <span className="truncate">
            {totalStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </span>
        </button>
      </div>
    </div>
  );
};

// ================= PRODUCT LISTING & CATEGORY PAGE (SCREENS #2, #3, #12) =================
interface ProductListingPageProps {
  products: ProductCatalogItem[];
  categories: CategoryTaxonomyItem[];
  initialCategory?: string;
  initialSubCategory?: string;
  searchQuery: string;
  onChangeSearchQuery?: (q: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onQuickAddToCart: (product: ProductCatalogItem, selectedSize?: string) => void;
  onNavigateHome?: () => void;
  onSelectCategory?: (category: string, subCategory?: string) => void;
  mobileCols?: 2 | 3;
  onChangeMobileCols?: (cols: 2 | 3) => void;
}

export const ProductListingPage: React.FC<ProductListingPageProps> = ({
  products,
  categories,
  initialCategory = 'All',
  initialSubCategory = 'All',
  searchQuery,
  onChangeSearchQuery,
  wishlistIds,
  onToggleWishlist,
  onOpenDetail,
  onQuickAddToCart,
  onNavigateHome,
  onSelectCategory,
  mobileCols = 2,
  onChangeMobileCols,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<string>(initialSubCategory);
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    | 'Popular'
    | 'Newest'
    | 'PriceLowHigh'
    | 'PriceHighLow'
    | 'HighestRated'
    | 'Discount'
  >('Popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  React.useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedSubCategory(initialSubCategory);
  }, [initialCategory, initialSubCategory]);

  const activeCategoryObj = categories.find((c) => c.name === selectedCategory);
  const availableSubcategories = activeCategoryObj
    ? activeCategoryObj.subcategories
    : Array.from(new Set(categories.flatMap((c) => c.subcategories)));

  const allSizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorSwatches = [
    { name: 'All', hex: '#E5E7EB' },
    { name: 'Purple', hex: '#A78BFA' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Maroon', hex: '#7A1C24' },
    { name: 'Emerald', hex: '#0F5132' },
    { name: 'Gold', hex: '#D97706' },
    { name: 'Crimson', hex: '#991B1B' },
    { name: 'Black', hex: '#171717' },
  ];

  const filteredProducts = products
    .filter((p) => p.isVisible)
    .filter((p) => {
      if (selectedCategory !== 'All' && p.primaryCategory !== selectedCategory)
        return false;
      if (
        selectedSubCategory !== 'All' &&
        p.subCategory.toLowerCase() !== selectedSubCategory.toLowerCase()
      )
        return false;
      if (
        selectedSize !== 'All' &&
        !p.sizes.some((s) => s.code === selectedSize && s.stock > 0)
      )
        return false;
      if (
        selectedColor !== 'All' &&
        !p.colorShades.some((c) =>
          c.name.toLowerCase().includes(selectedColor.toLowerCase())
        )
      )
        return false;
      if (p.sellingPrice > maxPrice) return false;
      if (inStockOnly && p.sizes.reduce((sum, s) => sum + s.stock, 0) <= 0)
        return false;
      const disc =
        p.regularMrp > 0
          ? Math.round(((p.regularMrp - p.sellingPrice) / p.regularMrp) * 100)
          : 0;
      if (disc < minDiscount) return false;
      if (p.rating < minRating) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.primaryCategory.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.productType.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'Popular') return b.reviewCount - a.reviewCount;
      if (sortBy === 'PriceLowHigh') return a.sellingPrice - b.sellingPrice;
      if (sortBy === 'PriceHighLow') return b.sellingPrice - a.sellingPrice;
      if (sortBy === 'HighestRated') return b.rating - a.rating;
      if (sortBy === 'Discount') {
        const discA =
          a.regularMrp > 0 ? (a.regularMrp - a.sellingPrice) / a.regularMrp : 0;
        const discB =
          b.regularMrp > 0 ? (b.regularMrp - b.sellingPrice) / b.regularMrp : 0;
        return discB - discA;
      }
      return 0;
    });

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setMaxPrice(5000);
    setInStockOnly(false);
    setMinDiscount(0);
    setMinRating(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb Row */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
        <div className="flex items-center gap-1.5 font-medium">
          <button
            type="button"
            onClick={() => onNavigateHome?.()}
            className="hover:text-[#0D1B2A] hover:underline cursor-pointer"
          >
            Home
          </button>
          <span>&gt;</span>
          <span className="font-bold text-[#0D1B2A]">
            {selectedCategory === 'All' ? 'All Fashion' : selectedCategory}
          </span>
          {selectedSubCategory !== 'All' && (
            <>
              <span>&gt;</span>
              <span className="font-bold text-[#B8860B]">
                {selectedSubCategory}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden bg-[#0D1B2A] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
        </button>
      </div>

      {/* Search Suggestions Bar if user is searching (Screen #12) */}
      {searchQuery.trim() && (
        <div className="bg-white rounded-2xl border border-[#E6E1D6] p-3.5 mb-5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-500">
            Search Suggestions:
          </span>
          {['kurti', 'floral maxi dress', 'shirt', 'saree', 'kurta', 'jeans'].map(
            (sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => onChangeSearchQuery?.(sug)}
                className="px-3 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#0D1B2A] hover:text-white border border-stone-200 text-xs font-medium transition-colors cursor-pointer"
              >
                🔍 {sug}
              </button>
            )
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Filter Sidebar (Desktop + Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 bg-white rounded-2xl border border-[#E6E1D6] p-5 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#0D1B2A]">
              <SlidersHorizontal className="w-4 h-4 text-[#B8860B]" />
              <span>Filters</span>
            </div>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-bold text-[#B8860B] hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Gender / Department Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0D1B2A]">
              Department
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['All', ...categories.map((c) => c.name)].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedSubCategory('All');
                    onSelectCategory?.(cat, 'All');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0D1B2A] text-white'
                      : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-200/70'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Category / Subcategory Checkboxes */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0D1B2A]">
              Category
            </label>
            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
              <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                <input
                  type="radio"
                  name="subcat"
                  checked={selectedSubCategory === 'All'}
                  onChange={() => setSelectedSubCategory('All')}
                  className="accent-[#0D1B2A]"
                />
                <span>All Categories</span>
              </label>
              {availableSubcategories.map((sub) => (
                <label
                  key={sub}
                  className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="subcat"
                    checked={
                      selectedSubCategory.toLowerCase() === sub.toLowerCase()
                    }
                    onChange={() => setSelectedSubCategory(sub)}
                    className="accent-[#0D1B2A]"
                  />
                  <span>{sub}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0D1B2A]">
              Size
            </label>
            <div className="flex flex-wrap gap-1.5">
              {allSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-[#0D1B2A] text-white border-[#0D1B2A]'
                      : 'bg-[#FAF8F5] text-stone-700 border-stone-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Swatches */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0D1B2A]">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorSwatches.map((col) => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setSelectedColor(col.name)}
                  title={col.name}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    selectedColor === col.name
                      ? 'border-[#0D1B2A] scale-115 ring-2 ring-[#D4AF37]'
                      : 'border-stone-300'
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="uppercase tracking-wider text-[#0D1B2A]">
                Price Range
              </span>
              <span className="font-mono-num text-[#B8860B]">
                ₹0 – ₹{maxPrice}
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={5000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0D1B2A] cursor-pointer"
            />
          </div>

          {/* Availability */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0D1B2A]">
              Availability
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#0D1B2A] rounded"
              />
              In Stock Only
            </label>
          </div>

          {/* Discount Filter */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0D1B2A]">
              Discount
            </label>
            {[0, 20, 30, 40, 50].map((d) => (
              <label
                key={d}
                className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer"
              >
                <input
                  type="radio"
                  name="discount"
                  checked={minDiscount === d}
                  onChange={() => setMinDiscount(d)}
                  className="accent-[#0D1B2A]"
                />
                <span>{d === 0 ? 'All Discounts' : `${d}% and above`}</span>
              </label>
            ))}
          </div>

          {/* Rating Filter */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#0D1B2A]">
              Customer Rating
            </label>
            {[0, 4, 4.5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setMinRating(r)}
                className={`mr-1.5 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  minRating === r
                    ? 'bg-[#0D1B2A] text-white'
                    : 'bg-[#FAF8F5] text-stone-700'
                }`}
              >
                {r === 0 ? 'Any ★' : `${r}★ & above`}
              </button>
            ))}
          </div>
        </aside>

        {/* Right Column: Category Banner + Sort Header + Product Grid */}
        <div className="lg:col-span-9 space-y-5">
          {/* Category Banner matching Screen #2 */}
          {activeCategoryObj && (
            <div className="relative rounded-2xl overflow-hidden bg-[#0D1B2A] text-white h-44 sm:h-52 flex items-center border border-[#E6E1D6]">
              <img
                src={activeCategoryObj.bannerImage}
                alt={activeCategoryObj.name}
                className="absolute inset-0 w-full h-full object-cover opacity-45"
              />
              <div className="relative z-10 p-6 sm:p-8 max-w-lg space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F5CE62]">
                  REYAZ SHOPPING CENTER
                </span>
                <h1 className="font-serif text-2xl sm:text-4xl font-bold">
                  {activeCategoryObj.name}&apos;s Fashion
                </h1>
                <p className="text-xs sm:text-sm text-stone-200">
                  {activeCategoryObj.tagline}
                </p>
              </div>
            </div>
          )}

          {/* Heading + Sort & Mobile 2/3-Column View Switcher Bar */}
          <div className="bg-white rounded-2xl border border-[#E6E1D6] px-3.5 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-2.5">
            <div>
              <h2 className="font-serif text-base sm:text-xl font-bold text-[#0D1B2A]">
                {selectedSubCategory !== 'All'
                  ? `${selectedCategory !== 'All' ? `${selectedCategory}'s ` : ''}${selectedSubCategory}`
                  : selectedCategory !== 'All'
                  ? `${selectedCategory}'s Collection`
                  : 'All Fashion Products'}{' '}
                <span className="text-xs font-sans font-normal text-stone-500">
                  ({filteredProducts.length} Products)
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Mobile 2-Dress vs 3-Dress Grid Toggle */}
              {onChangeMobileCols && (
                <div className="flex sm:hidden items-center bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => onChangeMobileCols(2)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                      mobileCols === 2
                        ? 'bg-[#0D1B2A] text-[#F5CE62]'
                        : 'text-stone-600'
                    }`}
                  >
                    2 Dress
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeMobileCols(3)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                      mobileCols === 3
                        ? 'bg-[#0D1B2A] text-[#F5CE62]'
                        : 'text-stone-600'
                    }`}
                  >
                    3 Dress
                  </button>
                </div>
              )}

              <span className="hidden sm:inline text-xs font-semibold text-stone-500">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as typeof sortBy)
                }
                className="bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[#0D1B2A] focus:outline-none cursor-pointer"
              >
                <option value="Popular">Popular</option>
                <option value="Newest">Newest First</option>
                <option value="PriceLowHigh">Price: Low to High</option>
                <option value="PriceHighLow">Price: High to Low</option>
                <option value="HighestRated">Highest Rated</option>
                <option value="Discount">Highest Discount</option>
              </select>
            </div>
          </div>

          {/* Product Grid: 2 or 3 Dresses per Row on Mobile Phone, 3-4 on Desktop */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E6E1D6] p-12 text-center space-y-3">
              <p className="font-serif text-xl font-bold text-[#0D1B2A]">
                No matching fashion items found
              </p>
              <p className="text-xs text-stone-500">
                Try clearing some filters or searching for another category or SKU.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="bg-[#0D1B2A] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid ${
                mobileCols === 3
                  ? 'grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4 xl:grid-cols-3'
                  : 'grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3'
              }`}
            >
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  isWished={wishlistIds.includes(item.id)}
                  onToggleWishlist={onToggleWishlist}
                  onOpenDetail={onOpenDetail}
                  onQuickAddToCart={onQuickAddToCart}
                  mobileCols={mobileCols}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ================= PRODUCT DETAILS PAGE (SCREEN #4 — NO TRY-ON) =================
interface ProductDetailsPageProps {
  product: ProductCatalogItem;
  allProducts: ProductCatalogItem[];
  isWished: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (
    product: ProductCatalogItem,
    size: string,
    colorName: string,
    qty?: number
  ) => void;
  onBuyNow: (
    product: ProductCatalogItem,
    size: string,
    colorName: string,
    qty?: number
  ) => void;
  onOpenDetail: (id: string) => void;
  onBack: () => void;
  currentCustomer: CustomerAccount | null;
  onAddReview: (productId: string, rating: number, comment: string) => void;
  onDeleteReview: (productId: string, reviewId: string) => void;
  storeSettings: StoreSettingsConfig;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  allProducts,
  isWished,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onOpenDetail,
  onBack,
  currentCustomer,
  onAddReview,
  onDeleteReview,
  storeSettings,
}) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.find((s) => s.stock > 0)?.code || product.sizes[0]?.code || 'M'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colorShades[0]?.name || 'Default'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  React.useEffect(() => {
    setActiveImgIdx(0);
    setSelectedSize(
      product.sizes.find((s) => s.stock > 0)?.code || product.sizes[0]?.code || 'M'
    );
    setSelectedColor(product.colorShades[0]?.name || 'Default');
    setQuantity(1);
  }, [product.id]);

  const activeImg =
    product.mediaGallery[activeImgIdx] || product.mediaGallery[0];
  const discountPct =
    product.regularMrp > 0
      ? Math.round(
          ((product.regularMrp - product.sellingPrice) / product.regularMrp) * 100
        )
      : 0;
  const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);

  const validateAndRun = (action: 'cart' | 'buy') => {
    if (!selectedSize || !selectedColor) {
      setSelectionError(
        'Please select both a Color and a Size before adding to cart.'
      );
      return;
    }
    setSelectionError(null);
    if (action === 'cart') {
      onAddToCart(product, selectedSize, selectedColor, quantity);
    } else {
      onBuyNow(product, selectedSize, selectedColor, quantity);
    }
  };

  const whatsappProductInquiryUrl = `https://wa.me/91${storeSettings.whatsappPrimary}?text=${encodeURIComponent(
    `Assalamu Alaikum Reyaz Shopping Center! I want to inquire about:\n• Product: ${product.title}\n• SKU: ${product.sku}\n• Price: ₹${product.sellingPrice} (COD)\n• Delivery Area: Horanda Alias Ramgarh - 822110, Palamu`
  )}`;

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.isVisible &&
        p.id !== product.id &&
        (p.primaryCategory === product.primaryCategory ||
          p.subCategory === product.subCategory)
    )
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
      {/* Breadcrumb & Back Row */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 font-bold text-[#0D1B2A] hover:underline cursor-pointer mr-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <span>Home</span>
          <span>&gt;</span>
          <span>{product.primaryCategory}</span>
          <span>&gt;</span>
          <span>{product.subCategory}</span>
          <span>&gt;</span>
          <span className="font-bold text-[#0D1B2A]">{product.title}</span>
        </div>
        <span className="font-mono-num">SKU: {product.sku}</span>
      </div>

      {/* Main PDP Grid matching Screen #4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Vertical Thumbnails + Main Image */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex flex-col-reverse sm:flex-row gap-3.5">
            {/* Vertical Thumbnail Strip */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible shrink-0">
              {product.mediaGallery.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImgIdx === idx
                      ? 'border-[#0D1B2A] shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Large Main Image */}
            <div className="flex-1 rounded-2xl overflow-hidden aspect-[3/4] bg-[#F4F1EA] border border-[#E6E1D6] relative">
              {activeImg && (
                <img
                  src={activeImg.url}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-white/95 shadow-sm flex items-center justify-center cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isWished ? 'fill-[#DC2626] text-[#DC2626]' : 'text-[#0D1B2A]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Description & Product Details Spec Table (Below Gallery like Screen #4) */}
          <div className="bg-white rounded-2xl border border-[#E6E1D6] p-5 sm:p-6 space-y-5">
            <div>
              <h3 className="font-serif font-bold text-base text-[#0D1B2A] mb-1.5">
                Description
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-stone-100 pt-4">
              <h4 className="font-serif font-bold text-base text-[#0D1B2A] mb-3">
                Product Details
              </h4>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                <div className="text-stone-500">• Fabric</div>
                <div className="font-semibold text-[#0D1B2A]">
                  : {product.specs?.fabric || 'Premium Rayon / Cotton'}
                </div>
                <div className="text-stone-500">• Pattern</div>
                <div className="font-semibold text-[#0D1B2A]">
                  : {product.specs?.pattern || 'Printed / Embroidered'}
                </div>
                <div className="text-stone-500">• Neck</div>
                <div className="font-semibold text-[#0D1B2A]">
                  : {product.specs?.neck || 'Round Neck'}
                </div>
                <div className="text-stone-500">• Sleeve</div>
                <div className="font-semibold text-[#0D1B2A]">
                  : {product.specs?.sleeve || 'Regular'}
                </div>
                <div className="text-stone-500">• Length</div>
                <div className="font-semibold text-[#0D1B2A]">
                  : {product.specs?.length || 'Full Length'}
                </div>
                <div className="text-stone-500">• Fit</div>
                <div className="font-semibold text-[#0D1B2A]">
                  : {product.specs?.fit || 'Regular Fit'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Purchase Controls + Customer Reviews (Screen #4) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E1D6] p-6 sm:p-7 space-y-5">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D1B2A]">
                {product.title}
              </h1>

              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex items-center text-[#F59E0B]">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
                <span className="font-bold text-[#0D1B2A]">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-stone-500">
                  ({product.reviews.length || product.reviewCount} reviews)
                </span>
                <span
                  className={`ml-auto px-2.5 py-0.5 rounded-md font-bold ${
                    totalStock > 0
                      ? 'bg-[#D1FAE5] text-[#065F46]'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {totalStock > 0 ? `In Stock (${totalStock})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 border-y border-stone-100 py-3.5">
              <span className="font-mono-num text-3xl font-extrabold text-[#0D1B2A]">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.regularMrp > product.sellingPrice && (
                <>
                  <span className="font-mono-num text-base text-stone-400 line-through">
                    ₹{product.regularMrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-extrabold text-[#15803D]">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            {selectionError && (
              <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl">
                {selectionError}
              </div>
            )}

            {/* Color Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-600">
                Color: <strong className="text-[#0D1B2A]">{selectedColor}</strong>
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {product.colorShades.map((shade) => (
                  <button
                    key={shade.id}
                    type="button"
                    onClick={() => setSelectedColor(shade.name)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform cursor-pointer ${
                      selectedColor === shade.name
                        ? 'border-[#0D1B2A] scale-110 ring-2 ring-[#D4AF37]'
                        : 'border-stone-300'
                    }`}
                    style={{ backgroundColor: shade.hex }}
                    title={shade.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector + Size Guide */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-600">
                  Size: <strong className="text-[#0D1B2A]">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-[#B8860B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const isOut = s.stock <= 0;
                  return (
                    <button
                      key={s.code}
                      type="button"
                      disabled={isOut}
                      onClick={() => setSelectedSize(s.code)}
                      className={`min-w-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isOut
                          ? 'bg-stone-100 text-stone-300 border-stone-200 line-through cursor-not-allowed'
                          : selectedSize === s.code
                          ? 'bg-[#0D1B2A] text-white border-[#0D1B2A]'
                          : 'bg-white text-[#0D1B2A] border-stone-300 hover:border-[#0D1B2A]'
                      }`}
                    >
                      {s.code}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-600">Quantity:</span>
              <div className="inline-flex items-center bg-[#FAF8F5] border border-stone-200 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-xs font-bold cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-mono-num text-xs font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Stacked Action Buttons matching Screen #4 (Add to Cart + Buy Now) */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                disabled={totalStock <= 0}
                onClick={() => validateAndRun('cart')}
                className="w-full bg-[#0D1B2A] hover:bg-[#1B263B] disabled:opacity-40 text-white font-bold text-sm py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#F5CE62]" />
                Add to Cart
              </button>

              <button
                type="button"
                disabled={totalStock <= 0}
                onClick={() => validateAndRun('buy')}
                className="w-full bg-white hover:bg-[#FAF8F5] disabled:opacity-40 text-[#0D1B2A] border-2 border-[#0D1B2A] font-bold text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                Buy Now (Cash on Delivery)
              </button>
            </div>

            {/* Secondary Wishlist & Share Links */}
            <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold text-stone-600 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className="flex items-center gap-1.5 hover:text-[#0D1B2A] cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWished ? 'fill-[#DC2626] text-[#DC2626]' : ''
                  }`}
                />
                <span>{isWished ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <a
                href={whatsappProductInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#15803D] hover:underline"
              >
                <Share2 className="w-4 h-4" />
                <span>Ask / Share on WhatsApp</span>
              </a>
            </div>

            {/* Regional Free COD Delivery Badge */}
            <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-[#E6E1D6] space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#0D1B2A]">
                <Truck className="w-4 h-4 text-[#15803D]" />
                <span>
                  FREE Delivery in {storeSettings.allowedVillageArea} -{' '}
                  {storeSettings.defaultPinCode}, {storeSettings.allowedDistrict}
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
                <span>
                  100% Cash on Delivery Only • Easy 7-Day Doorstep Exchange
                </span>
              </div>
            </div>
          </div>

          {/* Customer Reviews Card matching Screen #4 */}
          <div className="bg-white rounded-2xl border border-[#E6E1D6] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#0D1B2A]">
                Customer Reviews
              </h3>
              <div className="flex items-center gap-1.5 text-sm font-bold">
                <span className="text-xl text-[#0D1B2A]">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-[#F59E0B]">★★★★★</span>
                <span className="text-xs text-stone-400">
                  ({product.reviews.length || product.reviewCount})
                </span>
              </div>
            </div>

            {product.reviews.length === 0 ? (
              <p className="text-xs text-stone-500">
                No written reviews yet. Be the first customer to review this outfit!
              </p>
            ) : (
              <div className="space-y-3">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#FAF8F5] rounded-xl p-3.5 border border-[#E6E1D6] flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#0D1B2A] text-[#F5CE62] flex items-center justify-center font-bold text-xs shrink-0">
                      {rev.customerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0D1B2A]">
                          {rev.customerName}
                        </span>
                        <span className="text-xs text-[#F59E0B]">
                          {'★'.repeat(rev.rating)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">{rev.comment}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-stone-400">
                          {rev.date} • Verified Buyer
                        </span>
                        {currentCustomer && currentCustomer.id === rev.customerId && (
                          <button
                            type="button"
                            onClick={() => onDeleteReview(product.id, rev.id)}
                            className="text-[10px] text-red-600 font-bold hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Review Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!reviewComment.trim()) return;
                onAddReview(product.id, reviewRating, reviewComment.trim());
                setReviewComment('');
              }}
              className="border-t border-stone-100 pt-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0D1B2A]">
                  Rate &amp; Review this Outfit
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setReviewRating(st)}
                      className={`text-base cursor-pointer ${
                        st <= reviewRating ? 'text-[#F59E0B]' : 'text-stone-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your feedback on fit, fabric quality, and delivery..."
                className="w-full bg-[#FAF8F5] rounded-xl p-3 text-xs border border-[#E6E1D6] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#0D1B2A] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#E6E1D6]">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0D1B2A]">
            Similar &amp; Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isWished={false}
                onToggleWishlist={onToggleWishlist}
                onOpenDetail={onOpenDetail}
                onQuickAddToCart={(p, sz) =>
                  onAddToCart(p, sz || 'M', p.colorShades[0]?.name || 'Default', 1)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-[#E6E1D6]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#0D1B2A]">
                Reyaz Shopping Center — Size Guide
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="p-1.5 rounded-full bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#0D1B2A] text-white">
                  <th className="p-2 text-left rounded-tl-lg">Size</th>
                  <th className="p-2 text-left">Chest / Bust</th>
                  <th className="p-2 text-left rounded-tr-lg">Stock</th>
                </tr>
              </thead>
              <tbody>
                {product.sizes.map((s) => (
                  <tr key={s.code} className="border-b border-stone-200">
                    <td className="p-2 font-bold">{s.code}</td>
                    <td className="p-2">{s.chest}</td>
                    <td className="p-2 font-mono-num">{s.stock} available</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= SHOPPING CART & 3-STEP COD CHECKOUT (SCREENS #7 & #8) =================
export interface CartItem {
  id: string;
  productId: string;
  sku: string;
  title: string;
  imageUrl: string;
  size: string;
  colorName: string;
  unitPrice: number;
  regularMrp: number;
  quantity: number;
  maxStock: number;
}

interface CartAndCheckoutViewProps {
  mode: 'cart' | 'checkout' | 'confirmation';
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveCartItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  currentCustomer: CustomerAccount | null;
  storeSettings: StoreSettingsConfig;
  onPlaceCodOrder: (orderPayload: {
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
  }) => RegionalOrder | null;
  lastPlacedOrder: RegionalOrder | null;
  onViewMyOrders: () => void;
}

export const CartAndCheckoutView: React.FC<CartAndCheckoutViewProps> = ({
  mode,
  cart,
  onUpdateQuantity,
  onRemoveCartItem,
  onProceedToCheckout,
  onContinueShopping,
  currentCustomer,
  storeSettings,
  onPlaceCodOrder,
  lastPlacedOrder,
  onViewMyOrders,
}) => {
  const [customerName, setCustomerName] = useState(currentCustomer?.name || '');
  const [customerMobile, setCustomerMobile] = useState(
    currentCustomer?.mobile || ''
  );
  const [customerWhatsapp, setCustomerWhatsapp] = useState(
    currentCustomer?.whatsapp || ''
  );
  const [customerEmail, setCustomerEmail] = useState(
    currentCustomer?.email || ''
  );
  const [fullAddress, setFullAddress] = useState(
    currentCustomer?.address.fullAddress || ''
  );
  const [villageArea, setVillageArea] = useState(
    currentCustomer?.address.villageArea || 'Horanda Alias Ramgarh'
  );
  const [district, setDistrict] = useState(
    currentCustomer?.address.district || 'Palamu'
  );
  const [state, setState] = useState(
    currentCustomer?.address.state || 'Jharkhand'
  );
  const [pinCode, setPinCode] = useState(
    currentCustomer?.address.pinCode || '822110'
  );
  const [orderNotes, setOrderNotes] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const deliveryFee = storeSettings.deliveryCharge || 0;
  const grandTotal = subtotal + deliveryFee;

  // Serviceability validation for Horanda Alias Ramgarh (822110), Palamu, Jharkhand (JH)
  const normalizedState = state.trim().toLowerCase();
  const normalizedDistrict = district.trim().toLowerCase();
  const isSupportedDeliveryArea =
    (villageArea.toLowerCase().includes('horanda') ||
      villageArea.toLowerCase().includes('ramgarh')) &&
    (normalizedDistrict.includes('palamu') ||
      normalizedDistrict.includes('palamau') ||
      normalizedDistrict.includes('ramgarh') ||
      normalizedDistrict.includes('garhwa')) &&
    (normalizedState.includes('jharkhand') || normalizedState === 'jh') &&
    (pinCode.trim() === '822110' || pinCode.trim() === '822101');

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!isSupportedDeliveryArea) {
      setCheckoutError(
        'Delivery is available only in Horanda Alias Ramgarh (PIN 822110), Palamu, Jharkhand, India.'
      );
      return;
    }

    if (!customerName.trim() || !customerMobile.trim() || !fullAddress.trim()) {
      setCheckoutError(
        'Please fill in your Full Name, Mobile Number, and House/Street Address.'
      );
      return;
    }

    onPlaceCodOrder({
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      customerWhatsapp: customerWhatsapp.trim() || customerMobile.trim(),
      customerEmail: customerEmail.trim(),
      fullAddress: fullAddress.trim(),
      villageArea: villageArea.trim(),
      district: district.trim(),
      state: state.trim(),
      pinCode: pinCode.trim(),
      orderNotes: orderNotes.trim(),
    });
  };

  if (mode === 'confirmation' && lastPlacedOrder) {
    const waMessage = `Assalamu Alaikum Reyaz Shopping Center!\nI have placed a Cash on Delivery order:\n• Order ID: #${lastPlacedOrder.orderNumber}\n• Name: ${lastPlacedOrder.customerName}\n• Items: ${lastPlacedOrder.productTitle}\n• Total Payable: ₹${lastPlacedOrder.amount} (FREE Delivery)\n• Address: ${lastPlacedOrder.fullAddress}, ${lastPlacedOrder.villageArea}, ${lastPlacedOrder.district}, ${lastPlacedOrder.state} - ${lastPlacedOrder.pinCode}`;

    const waLinkPrimary = `https://wa.me/91${storeSettings.whatsappPrimary}?text=${encodeURIComponent(
      waMessage
    )}`;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-[#E6E1D6] p-8 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#D1FAE5] text-[#15803D] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#15803D]">
              3. ORDER CONFIRMED • CASH ON DELIVERY
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#0D1B2A] mt-1">
              Order #{lastPlacedOrder.orderNumber} Placed!
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Thank you, <strong>{lastPlacedOrder.customerName}</strong>! Your order is confirmed for Free Delivery in{' '}
              <strong>Horanda Alias Ramgarh (822110), Palamu, Jharkhand</strong>.
            </p>
          </div>

          <div className="bg-[#FAF8F5] rounded-2xl p-4 text-left text-xs space-y-2 border border-[#E6E1D6]">
            <div className="flex justify-between">
              <span className="text-stone-500">Order Number:</span>
              <span className="font-mono-num font-bold text-[#0D1B2A]">
                #{lastPlacedOrder.orderNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Order Status:</span>
              <span className="font-bold text-[#15803D]">
                {lastPlacedOrder.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payment Method:</span>
              <span className="font-bold text-[#0D1B2A]">
                Cash on Delivery (₹{lastPlacedOrder.amount.toLocaleString('en-IN')})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Delivery Charge:</span>
              <span className="font-bold text-[#15803D]">FREE (₹0)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Delivery Address:</span>
              <span className="font-semibold text-[#0D1B2A] text-right">
                {lastPlacedOrder.fullAddress}, {lastPlacedOrder.villageArea} -{' '}
                {lastPlacedOrder.pinCode}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={waLinkPrimary}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#15803D] hover:bg-green-800 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Send Order on WhatsApp ({storeSettings.whatsappPrimary})
            </a>
            <button
              type="button"
              onClick={onViewMyOrders}
              className="bg-[#0D1B2A] text-white font-bold text-xs py-3.5 px-5 rounded-xl cursor-pointer"
            >
              View &amp; Track My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Step Progress Indicator matching Screen #8 */}
      <div className="bg-white rounded-2xl border border-[#E6E1D6] p-4 flex items-center justify-between max-w-xl mx-auto text-xs font-bold">
        <div className="flex items-center gap-2 text-[#0D1B2A]">
          <span className="w-6 h-6 rounded-full bg-[#0D1B2A] text-white flex items-center justify-center">
            1
          </span>
          <span>Shopping Bag</span>
        </div>
        <div className="h-0.5 flex-1 mx-3 bg-stone-200" />
        <div
          className={`flex items-center gap-2 ${
            mode === 'checkout' ? 'text-[#0D1B2A]' : 'text-stone-400'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              mode === 'checkout'
                ? 'bg-[#0D1B2A] text-white'
                : 'bg-stone-200 text-stone-500'
            }`}
          >
            2
          </span>
          <span>Delivery &amp; COD</span>
        </div>
        <div className="h-0.5 flex-1 mx-3 bg-stone-200" />
        <div className="flex items-center gap-2 text-stone-400">
          <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center">
            3
          </span>
          <span>Confirm</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0D1B2A]">
          {mode === 'cart' ? 'Shopping Cart' : 'Delivery Address & COD Checkout'}
        </h1>
        <button
          type="button"
          onClick={onContinueShopping}
          className="text-xs font-bold text-stone-600 hover:text-[#0D1B2A] flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E6E1D6] p-12 text-center my-6 space-y-4">
          <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
          <h2 className="font-serif text-xl font-bold text-[#0D1B2A]">
            Your Shopping Cart is Empty
          </h2>
          <p className="text-xs text-stone-500">
            Browse Men, Women, and Kids collections to add outfits to your bag.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="bg-[#0D1B2A] text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
          >
            Shop Now
          </button>
        </div>
      ) : mode === 'cart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E6E1D6] p-4 flex items-center gap-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-24 rounded-xl object-cover bg-[#F4F1EA] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-base text-[#0D1B2A] truncate">
                    {item.title}
                  </h3>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Color: <strong>{item.colorName}</strong> • Size:{' '}
                    <strong>{item.size}</strong>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-stone-200 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded bg-white flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-mono-num text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded bg-white flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveCartItem(item.id)}
                      className="text-xs text-stone-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right font-mono-num font-extrabold text-base text-[#0D1B2A]">
                  ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E6E1D6] p-6 space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#0D1B2A]">
              Order Summary
            </h2>
            <div className="space-y-2 text-xs border-b border-stone-100 pb-4">
              <div className="flex justify-between">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-mono-num font-bold">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">
                  Delivery (Horanda - 822110)
                </span>
                <span className="font-bold text-[#15803D]">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Method</span>
                <span className="font-bold text-[#0D1B2A]">
                  Cash on Delivery Only
                </span>
              </div>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-sm">Total</span>
              <span className="font-mono-num text-xl font-extrabold text-[#0D1B2A]">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full bg-[#0D1B2A] hover:bg-[#1B263B] text-white font-bold text-xs py-4 rounded-xl transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        /* CHECKOUT VIEW MATCHING SCREEN #8 */
        <form
          onSubmit={handleCheckoutSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E1D6] p-6 space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#0D1B2A]">
              Delivery Address
            </h2>

            {checkoutError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs font-bold text-red-700 flex items-center justify-between gap-2">
                <span>{checkoutError}</span>
                <button
                  type="button"
                  onClick={() => {
                    setVillageArea('Horanda Alias Ramgarh');
                    setDistrict('Palamu');
                    setState('Jharkhand');
                    setPinCode('822110');
                    setCheckoutError(null);
                  }}
                  className="bg-red-700 text-white px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                >
                  Reset to Horanda (822110)
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  placeholder="WhatsApp number for updates"
                  className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                Address (House No., Street, Landmark) *
              </label>
              <input
                type="text"
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="House No., Ward, Near Main Road, Horanda"
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                  Village / Area *
                </label>
                <input
                  type="text"
                  required
                  value={villageArea}
                  onChange={(e) => setVillageArea(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3 py-2.5 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3 py-2.5 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3 py-2.5 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3 py-2.5 text-xs font-mono-num font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                Order Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Special delivery instructions..."
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl p-3 text-xs"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E1D6] p-6 space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#0D1B2A]">
              Order Summary
            </h2>

            <div className="space-y-3 border-b border-stone-100 pb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-12 h-14 rounded-lg object-cover bg-[#F4F1EA] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#0D1B2A] truncate">
                      {item.title}
                    </div>
                    <div className="text-stone-500">
                      {item.colorName} • Size: {item.size} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-mono-num font-bold text-[#0D1B2A]">
                    ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Total</span>
                <span className="font-mono-num font-extrabold text-lg text-[#0D1B2A]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery</span>
                <span className="font-bold text-[#15803D]">FREE</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <label className="block text-xs font-bold text-[#0D1B2A]">
                Payment Method
              </label>
              <div className="bg-[#FAF8F5] border-2 border-[#0D1B2A] rounded-xl p-3.5 flex items-center gap-2.5 text-xs font-bold text-[#0D1B2A]">
                <Check className="w-4 h-4 text-[#15803D]" />
                <span>Cash on Delivery (Only)</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0D1B2A] hover:bg-[#1B263B] text-white font-bold text-sm py-4 rounded-xl transition-colors cursor-pointer"
            >
              Place Order
            </button>

            <div className="bg-[#F4F1EA] rounded-xl p-3 text-[11px] text-stone-600 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0D1B2A] shrink-0" />
              <span>
                Free Delivery | Delivery only in Horanda Alias Ramgarh, Palamu, Jharkhand - 822110
              </span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

// ================= CONTACT, ABOUT, FAQ & POLICY PAGES =================
export const ContactAndAboutPage: React.FC<{
  view: 'contact' | 'about' | 'faq' | 'policies';
  storeSettings: StoreSettingsConfig;
}> = ({ view, storeSettings }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 sm:p-10 space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#B8860B]">
            {storeSettings.storeName} • HORANDA ALIAS RAMGARH, JHARKHAND (JH) - {storeSettings.defaultPinCode}
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#0D1B2A] mt-1">
            {view === 'contact'
              ? 'Contact Reyaz Shopping Center (Jharkhand - JH)'
              : view === 'faq'
              ? 'Frequently Asked Questions (FAQ)'
              : view === 'policies'
              ? 'Store Policies — Shipping, Returns, Privacy & Terms'
              : 'About Reyaz Shopping Center — Jharkhand (JH)'}
          </h1>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            “For more information about Cash on Delivery, delivery, products, or orders in Horanda Alias Ramgarh (822110), Palamu, Jharkhand (JH), India, please contact us.”
          </p>
        </div>

        {/* Official Jharkhand (JH) Store Location & Map Card */}
        <div className="bg-[#FAF8F5] rounded-2xl border border-[#E6E1D6] p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#0D1B2A] text-[#F5CE62] text-[10px] font-extrabold uppercase tracking-wider">
                <MapPin className="w-3 h-3" />
                <span>OFFICIAL STORE LOCATION • JHARKHAND (JH)</span>
              </div>
              <h2 className="font-serif text-lg font-bold text-[#0D1B2A]">
                Reyaz Shopping Center — Horanda Alias Ramgarh, Jharkhand (JH)
              </h2>
              <p className="text-xs text-stone-600">
                Main Road, Horanda Alias Ramgarh, Block Ramgarh, District Palamu,{' '}
                <strong>State: Jharkhand (JH)</strong> — PIN Code:{' '}
                <strong className="font-mono-num">822110</strong>, India
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Horanda+Alias+Ramgarh+Palamu+Jharkhand+822110"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0D1B2A] hover:bg-[#1B263B] text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F5CE62]" />
              <span>Open in Google Maps (JH 822110)</span>
            </a>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#E6E1D6] h-56 bg-stone-100">
            <iframe
              title="Reyaz Shopping Center — Horanda Alias Ramgarh, Palamu, Jharkhand (JH) 822110"
              src="https://www.google.com/maps?q=Horanda+Alias+Ramgarh,+Palamu,+Jharkhand+822110,+India&z=13&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href={`https://wa.me/91${storeSettings.whatsappPrimary}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FAF8F5] hover:bg-[#F4F1EA] border border-[#E6E1D6] rounded-2xl p-4 space-y-1.5 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-[#15803D]" />
            <div className="text-xs font-bold text-[#0D1B2A]">
              WhatsApp Support 1
            </div>
            <div className="font-mono-num text-sm font-bold text-[#15803D]">
              +91 {storeSettings.whatsappPrimary}
            </div>
            <p className="text-[11px] text-stone-500">Tap to chat on WhatsApp</p>
          </a>

          <a
            href={`https://wa.me/91${storeSettings.whatsappSecondary}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FAF8F5] hover:bg-[#F4F1EA] border border-[#E6E1D6] rounded-2xl p-4 space-y-1.5 transition-colors"
          >
            <Phone className="w-5 h-5 text-[#B8860B]" />
            <div className="text-xs font-bold text-[#0D1B2A]">
              WhatsApp &amp; Phone 2
            </div>
            <div className="font-mono-num text-sm font-bold text-[#B8860B]">
              +91 {storeSettings.whatsappSecondary}
            </div>
            <p className="text-[11px] text-stone-500">Direct Call &amp; WhatsApp</p>
          </a>

          <a
            href={`mailto:${storeSettings.storeEmail}`}
            className="bg-[#FAF8F5] hover:bg-[#F4F1EA] border border-[#E6E1D6] rounded-2xl p-4 space-y-1.5 transition-colors"
          >
            <Mail className="w-5 h-5 text-[#0D1B2A]" />
            <div className="text-xs font-bold text-[#0D1B2A]">Official Email</div>
            <div className="text-xs font-bold text-[#0D1B2A] break-all">
              {storeSettings.storeEmail}
            </div>
            <p className="text-[11px] text-stone-500">24/7 Customer Care</p>
          </a>
        </div>

        {view === 'faq' && (
          <div className="space-y-3 pt-2">
            {[
              {
                q: 'Which area is eligible for Free Delivery?',
                a: 'We provide FREE doorstep delivery (₹0) exclusively in Horanda Alias Ramgarh (PIN 822110), Palamu, Jharkhand, India.',
              },
              {
                q: 'What payment methods are accepted?',
                a: 'Reyaz Shopping Center accepts 100% Cash on Delivery (COD Only). You pay in cash only when your order is delivered to your address.',
              },
              {
                q: 'How can I track my order?',
                a: 'Go to My Account → My Orders to view your live 5-step order status (Placed → Confirmed → Processing → Shipped → Out for Delivery → Delivered).',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E6E1D6] space-y-1"
              >
                <div className="text-xs font-bold text-[#0D1B2A] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#B8860B]" />
                  {item.q}
                </div>
                <p className="text-xs text-stone-600 pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E6E1D6] space-y-3 text-xs leading-relaxed text-stone-700">
          <h2 className="font-serif font-bold text-base text-[#0D1B2A] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#B8860B]" />
            Shipping, Return &amp; Privacy Policies
          </h2>
          <p>
            • <strong>Shipping &amp; Service Area:</strong>{' '}
            {storeSettings.shippingPolicyText}
          </p>
          <p>
            • <strong>Return &amp; Cancellation Policy:</strong>{' '}
            {storeSettings.returnPolicyText}
          </p>
          <p>
            • <strong>Privacy Policy:</strong> {storeSettings.privacyPolicyText}
          </p>
          <p>
            • <strong>Terms &amp; Conditions:</strong> {storeSettings.termsText}
          </p>
        </div>
      </div>
    </div>
  );
};
