import coverEmeraldImg from '../assets/images/kurti_cover_emerald_1791694662512.jpg';
import frontDrapeMaroonImg from '../assets/images/kurti_front_drape_maroon_1791694675042.jpg';
import collarZariMacroImg from '../assets/images/kurti_collar_zari_macro_1791694687595.jpg';
import fabricWeaveMacroImg from '../assets/images/chanderi_fabric_weave_macro_1791694698405.jpg';
import dupattaBorderImg from '../assets/images/dupatta_border_tassels_1791694709887.jpg';
import heroCampaignBannerImg from '../assets/images/reyaz_hero_campaign_banner_1791696969234.jpg';
import mensFashionKurtaImg from '../assets/images/mens_fashion_kurta_jacket_1791696979872.jpg';
import kidsFestiveWearImg from '../assets/images/kids_festive_wear_studio_1791696990982.jpg';
import floralMaxiDressImg from '../assets/images/lavender_floral_maxi_dress_1791698948842.jpg';
import mensCasualShirtImg from '../assets/images/mens_casual_shirt_denim_1791698958947.jpg';
import coupleHeroBannerImg from '../assets/images/couple_hero_fashion_banner_1791698968669.jpg';

export {
  coverEmeraldImg,
  frontDrapeMaroonImg,
  collarZariMacroImg,
  fabricWeaveMacroImg,
  dupattaBorderImg,
  heroCampaignBannerImg,
  mensFashionKurtaImg,
  kidsFestiveWearImg,
  floralMaxiDressImg,
  mensCasualShirtImg,
  coupleHeroBannerImg,
};

export interface MegaMenuGroup {
  groupTitle: string;
  items: string[];
}

export interface CategoryTaxonomyItem {
  id: string;
  name: 'Men' | 'Women' | 'Kids' | string;
  order: number;
  visible: boolean;
  bannerImage: string;
  tagline: string;
  subcategories: string[];
  megaMenuGroups: MegaMenuGroup[];
}

export const INITIAL_CATEGORIES: CategoryTaxonomyItem[] = [
  {
    id: 'cat-men',
    name: 'Men',
    order: 1,
    visible: true,
    bannerImage: mensCasualShirtImg,
    tagline: 'Look Good, Feel Confident — Shirts, T-Shirts, Denim & Ethnic Wear',
    subcategories: [
      'Shirts',
      'Casual Shirts',
      'Formal Shirts',
      'T-Shirts',
      'Polo T-Shirts',
      'Sweatshirts',
      'Hoodies',
      'Jackets',
      'Blazers',
      'Jeans',
      'Pants/Trousers',
      'Cargo Pants',
      'Joggers',
      'Shorts',
      'Kurta',
      'Kurta Sets',
      'Pajama',
      'Sherwanis',
      'Nehru Jackets',
      'Traditional Wear',
      'Festive Wear',
    ],
    megaMenuGroups: [
      {
        groupTitle: 'Topwear',
        items: [
          'T-Shirts',
          'Casual Shirts',
          'Formal Shirts',
          'Polo T-Shirts',
          'Sweatshirts',
          'Hoodies',
          'Jackets',
          'Blazers',
        ],
      },
      {
        groupTitle: 'Bottomwear',
        items: [
          'Jeans',
          'Pants/Trousers',
          'Joggers',
          'Shorts',
          'Cargo Pants',
        ],
      },
      {
        groupTitle: 'Indian & Traditional Wear',
        items: [
          'Kurta',
          'Kurta Sets',
          'Pajama',
          'Sherwanis',
          'Nehru Jackets',
          'Traditional Wear',
        ],
      },
      {
        groupTitle: 'Other Collections',
        items: ['Festive Wear', 'Wedding Wear', 'New Arrivals', 'Bestsellers'],
      },
    ],
  },
  {
    id: 'cat-women',
    name: 'Women',
    order: 2,
    visible: true,
    bannerImage: floralMaxiDressImg,
    tagline: 'Elegant Dresses, Sarees, Kurtis, Salwar Suits & Modest Fashion',
    subcategories: [
      'Dresses',
      'Sarees',
      'Kurtis',
      'Kurta Sets',
      'Salwar Suits',
      'Anarkalis',
      'Lehengas',
      'Tops',
      'T-Shirts',
      'Tunics',
      'Jeans/Pants',
      'Leggings',
      'Skirts',
      'Co-ord Sets',
      'Abayas',
      'Hijabs',
      'Dupattas',
      'Traditional Wear',
      'Festive Wear',
    ],
    megaMenuGroups: [
      {
        groupTitle: 'Clothing',
        items: [
          'Dresses',
          'Tops',
          'T-Shirts',
          'Tunics',
          'Jeans/Pants',
          'Leggings',
          'Skirts',
          'Co-ord Sets',
        ],
      },
      {
        groupTitle: 'Indian & Ethnic Wear',
        items: [
          'Sarees',
          'Kurtis',
          'Kurta Sets',
          'Salwar Suits',
          'Anarkalis',
          'Lehengas',
          'Traditional Wear',
          'Festive Wear',
        ],
      },
      {
        groupTitle: 'Modest & Traditional Fashion',
        items: ['Abayas', 'Hijabs', 'Dupattas'],
      },
      {
        groupTitle: 'Other Collections',
        items: ['Wedding Wear', 'New Arrivals', 'Bestsellers', 'Sale'],
      },
    ],
  },
  {
    id: 'cat-kids',
    name: 'Kids',
    order: 3,
    visible: true,
    bannerImage: kidsFestiveWearImg,
    tagline: 'Playful Everyday & Festive Fashion for Boys, Girls & Babies',
    subcategories: [
      'Boys',
      'Girls',
      'Baby',
      'Kids Dresses',
      'Kids T-Shirts',
      'Kids Pants',
      'Shirts',
      'Jeans',
      'Shorts',
      'Rompers',
      'Party Wear',
      'Traditional Wear',
    ],
    megaMenuGroups: [
      {
        groupTitle: 'Boys',
        items: [
          'Boys',
          'Kids T-Shirts',
          'Shirts',
          'Jeans',
          'Kids Pants',
          'Shorts',
          'Traditional Wear',
        ],
      },
      {
        groupTitle: 'Girls',
        items: [
          'Girls',
          'Kids Dresses',
          'Kids T-Shirts',
          'Jeans',
          'Traditional Wear',
        ],
      },
      {
        groupTitle: 'Babies & Toddlers',
        items: ['Baby', 'Rompers', 'Party Wear'],
      },
      {
        groupTitle: 'Special Collections',
        items: ['Traditional Wear', 'Party Wear', 'New Arrivals'],
      },
    ],
  },
];

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  isCover?: boolean;
}

export interface SizeStockItem {
  code: string;
  label: string;
  chest: string;
  stock: number;
}

export interface ColorShadeItem {
  id: string;
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
}

export interface ProductSpecs {
  fabric: string;
  pattern: string;
  neck: string;
  sleeve: string;
  length: string;
  fit: string;
  careInstructions: string;
}

export interface ProductCatalogItem {
  id: string;
  sku: string;
  status: 'Active • In Stock' | 'Low Stock' | 'Draft';
  createdByRole: 'super_admin' | 'seller';
  createdByEmail: string;
  createdByName: string;
  brandName?: string;
  title: string;
  primaryCategory: 'Men' | 'Women' | 'Kids';
  subCategory: string;
  productType: string;
  shortDescription: string;
  description: string;
  costPrice?: number;
  regularMrp: number;
  sellingPrice: number;
  regionalCodEnabled: boolean;
  isNew: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isTrending: boolean;
  isVisible: boolean;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  mediaGallery: MediaItem[];
  specs: ProductSpecs;
  warehouseLocation: string;
  sizes: SizeStockItem[];
  colorShades: ColorShadeItem[];
  updatedAt: string;
}

export const INITIAL_PRODUCTS: ProductCatalogItem[] = [
  {
    id: 'prod-floral-maxi-01',
    sku: 'RSC-WD-101',
    status: 'Active • In Stock',
    createdByRole: 'super_admin',
    createdByEmail: 'nasirhussain12489@gmail.com',
    createdByName: 'Super Admin (Nasir Hussain)',
    title: 'Floral Maxi Dress',
    primaryCategory: 'Women',
    subCategory: 'Dresses',
    productType: 'Maxi Dress',
    shortDescription: 'Soft lavender floral printed rayon maxi dress with puff sleeves.',
    description:
      'Beautiful floral maxi dress made from breathable premium rayon fabric. Perfect for casual outings, family gatherings, and special occasions in Horanda Alias Ramgarh.',
    regularMrp: 1999,
    sellingPrice: 1299,
    regionalCodEnabled: true,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    isVisible: true,
    rating: 4.6,
    reviewCount: 234,
    reviews: [
      {
        id: 'rev-101',
        customerId: 'cust-1',
        customerName: 'Priya Sharma',
        rating: 5,
        comment:
          'Beautiful dress! Perfect fit and quality is amazing. Free Cash on Delivery in Horanda was super fast.',
        date: '12 Apr 2026',
        verifiedBuyer: true,
      },
      {
        id: 'rev-102',
        customerId: 'cust-2',
        customerName: 'Shabnam Parveen',
        rating: 5,
        comment: 'Soft rayon fabric and lovely lavender floral print.',
        date: '10 Apr 2026',
        verifiedBuyer: true,
      },
    ],
    mediaGallery: [
      {
        id: 'm-1',
        title: 'Front Full View',
        url: floralMaxiDressImg,
        isCover: true,
      },
      {
        id: 'm-2',
        title: 'Fabric Detail',
        url: fabricWeaveMacroImg,
      },
      {
        id: 'm-3',
        title: 'Alternate Set',
        url: coverEmeraldImg,
      },
    ],
    specs: {
      fabric: 'Rayon',
      pattern: 'Floral',
      neck: 'Round / Square Neck',
      sleeve: 'Puff Sleeves',
      length: 'Maxi',
      fit: 'Regular',
      careInstructions: 'Gentle machine wash or hand wash in cold water',
    },
    warehouseLocation: 'Horanda Hub Rack #A-01',
    sizes: [
      { code: 'XS', label: 'XS (32")', chest: '32"', stock: 4 },
      { code: 'S', label: 'S (34")', chest: '34"', stock: 8 },
      { code: 'M', label: 'M (36")', chest: '36"', stock: 10 },
      { code: 'L', label: 'L (38")', chest: '38"', stock: 7 },
      { code: 'XL', label: 'XL (40")', chest: '40"', stock: 5 },
      { code: 'XXL', label: 'XXL (42")', chest: '42"', stock: 3 },
    ],
    colorShades: [
      { id: 'c-purple', name: 'Purple', hex: '#A78BFA' },
      { id: 'c-peach', name: 'Peach', hex: '#FDBA74' },
      { id: 'c-navy', name: 'Navy', hex: '#1E293B' },
      { id: 'c-pink', name: 'Rose Pink', hex: '#F472B6' },
    ],
    updatedAt: 'Today',
  },
  {
    id: 'prod-mens-shirt-02',
    sku: 'RSC-MS-102',
    status: 'Active • In Stock',
    createdByRole: 'super_admin',
    createdByEmail: 'nasirhussain12489@gmail.com',
    createdByName: 'Super Admin (Nasir Hussain)',
    title: "Men's Casual Cotton Shirt",
    primaryCategory: 'Men',
    subCategory: 'Casual Shirts',
    productType: 'Shirt',
    shortDescription: 'Crisp sky-blue pure cotton tailored casual shirt for men.',
    description:
      'Premium breathable 100% cotton casual shirt featuring button-down collar, tailored slim-regular comfort fit, and durable stitching.',
    regularMrp: 999,
    sellingPrice: 599,
    regionalCodEnabled: true,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    isVisible: true,
    rating: 4.5,
    reviewCount: 148,
    reviews: [
      {
        id: 'rev-201',
        customerId: 'cust-4',
        customerName: 'Mohit Kumar',
        rating: 5,
        comment: 'Great fabric and stitch quality at ₹599. Best shirt in Horanda.',
        date: '11 Apr 2026',
        verifiedBuyer: true,
      },
    ],
    mediaGallery: [
      {
        id: 'ms-1',
        title: 'Cover Photo',
        url: mensCasualShirtImg,
        isCover: true,
      },
      {
        id: 'ms-2',
        title: 'Fabric Weave',
        url: fabricWeaveMacroImg,
      },
    ],
    specs: {
      fabric: '100% Pure Cotton',
      pattern: 'Solid Oxford Weave',
      neck: 'Button-Down Collar',
      sleeve: 'Full Sleeve',
      length: 'Regular',
      fit: 'Regular Tailored',
      careInstructions: 'Machine wash cold, warm iron',
    },
    warehouseLocation: 'Horanda Hub Rack #M-04',
    sizes: [
      { code: 'S', label: 'S (38")', chest: '38"', stock: 6 },
      { code: 'M', label: 'M (40")', chest: '40"', stock: 12 },
      { code: 'L', label: 'L (42")', chest: '42"', stock: 9 },
      { code: 'XL', label: 'XL (44")', chest: '44"', stock: 5 },
      { code: 'XXL', label: 'XXL (46")', chest: '46"', stock: 4 },
    ],
    colorShades: [
      { id: 'c-sky', name: 'Sky Blue', hex: '#60A5FA' },
      { id: 'c-navy', name: 'Navy Blue', hex: '#1E3A8A' },
      { id: 'c-white', name: 'Classic White', hex: '#F8FAFC' },
    ],
    updatedAt: 'Today',
  },
  {
    id: 'prod-rsc-kt-094',
    sku: 'RSC-KT-094',
    status: 'Active • In Stock',
    createdByRole: 'super_admin',
    createdByEmail: 'nasirhussain12489@gmail.com',
    createdByName: 'Super Admin (Nasir Hussain)',
    title: 'Anarkali Chanderi Silk Kurti Set',
    primaryCategory: 'Women',
    subCategory: 'Kurtis',
    productType: 'Kurti Set',
    shortDescription: 'Handloom Chanderi silk kurti with gold zari embroidery & dupatta.',
    description:
      'Pure handloom Chanderi silk kurti featuring intricate gold zari embroidery on the neckline and sleeves. Paired with solid cotton-silk trousers and a matching organza-border dupatta.',
    regularMrp: 2499,
    sellingPrice: 1499,
    regionalCodEnabled: true,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    isVisible: true,
    rating: 4.8,
    reviewCount: 162,
    reviews: [],
    mediaGallery: [
      {
        id: 'kt-1',
        title: 'Front Drape',
        url: frontDrapeMaroonImg,
        isCover: true,
      },
      {
        id: 'kt-2',
        title: 'Emerald Edition',
        url: coverEmeraldImg,
      },
      {
        id: 'kt-3',
        title: 'Collar Zari Macro',
        url: collarZariMacroImg,
      },
      {
        id: 'kt-4',
        title: 'Dupatta Border',
        url: dupattaBorderImg,
      },
    ],
    specs: {
      fabric: 'Chanderi Silk Blend',
      pattern: 'Zari Embroidered',
      neck: 'Notched Round Neck',
      sleeve: '3/4 Sleeves',
      length: 'Calf Length',
      fit: 'Anarkali Flared',
      careInstructions: 'Dry clean or gentle hand wash separately',
    },
    warehouseLocation: 'Horanda Hub Rack #B-12',
    sizes: [
      { code: 'S', label: 'S (36")', chest: '36"', stock: 4 },
      { code: 'M', label: 'M (38")', chest: '38"', stock: 6 },
      { code: 'L', label: 'L (40")', chest: '40"', stock: 8 },
      { code: 'XL', label: 'XL (42")', chest: '42"', stock: 5 },
      { code: 'XXL', label: 'XXL (44")', chest: '44"', stock: 3 },
    ],
    colorShades: [
      { id: 'c-maroon', name: 'Crimson Maroon', hex: '#7A1C24' },
      { id: 'c-emerald', name: 'Royal Emerald', hex: '#0F5132' },
      { id: 'c-gold', name: 'Champagne Gold', hex: '#C69D53' },
    ],
    updatedAt: 'Today',
  },
  {
    id: 'prod-mens-kurta-04',
    sku: 'RSC-MK-108',
    status: 'Active • In Stock',
    createdByRole: 'super_admin',
    createdByEmail: 'nasirhussain12489@gmail.com',
    createdByName: 'Super Admin (Nasir Hussain)',
    title: 'Royal Navy Festive Kurta & Nehru Jacket Set',
    primaryCategory: 'Men',
    subCategory: 'Kurta Sets',
    productType: 'Kurta Jacket Set',
    shortDescription: '3-piece brocade Nehru jacket with silk-cotton kurta & pajama.',
    description:
      'Distinguished men’s festive ensemble featuring a tailored deep navy silk-blend kurta, white churidar pajama, and a golden-beige woven brocade Nehru waistcoat.',
    regularMrp: 3499,
    sellingPrice: 1899,
    regionalCodEnabled: true,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    isVisible: true,
    rating: 4.9,
    reviewCount: 112,
    reviews: [],
    mediaGallery: [
      {
        id: 'mk-1',
        title: 'Kurta Set Cover',
        url: mensFashionKurtaImg,
        isCover: true,
      },
      {
        id: 'mk-2',
        title: 'Brocade Detail',
        url: fabricWeaveMacroImg,
      },
    ],
    specs: {
      fabric: 'Silk Cotton & Brocade',
      pattern: 'Woven Jacquard',
      neck: 'Mandarin Collar',
      sleeve: 'Full Sleeve',
      length: 'Knee Length',
      fit: 'Regular Festive Fit',
      careInstructions: 'Dry clean recommended',
    },
    warehouseLocation: 'Horanda Hub Rack #M-01',
    sizes: [
      { code: 'M', label: 'M (38")', chest: '38"', stock: 5 },
      { code: 'L', label: 'L (40")', chest: '40"', stock: 9 },
      { code: 'XL', label: 'XL (42")', chest: '42"', stock: 7 },
      { code: 'XXL', label: 'XXL (44")', chest: '44"', stock: 4 },
    ],
    colorShades: [
      { id: 'c-navy-gold', name: 'Navy & Gold', hex: '#1E293B' },
      { id: 'c-ivory', name: 'Ivory Gold', hex: '#D6C7B2' },
    ],
    updatedAt: 'Today',
  },
  {
    id: 'prod-kids-festive-05',
    sku: 'RSC-KD-301',
    status: 'Active • In Stock',
    createdByRole: 'super_admin',
    createdByEmail: 'nasirhussain12489@gmail.com',
    createdByName: 'Super Admin (Nasir Hussain)',
    title: 'Kids Festive Kurta & Lehenga Choli Collection',
    primaryCategory: 'Kids',
    subCategory: 'Traditional Wear',
    productType: 'Kids Ethnic Set',
    shortDescription: 'Soft cotton-lined festive traditional wear for boys and girls.',
    description:
      'Joyful festive ethnic wear for kids crafted with ultra-soft breathable cotton lining and golden zari borders — ideal for weddings, Eid, and family celebrations.',
    regularMrp: 1599,
    sellingPrice: 899,
    regionalCodEnabled: true,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    isTrending: false,
    isVisible: true,
    rating: 4.9,
    reviewCount: 84,
    reviews: [],
    mediaGallery: [
      {
        id: 'kd-1',
        title: 'Kids Festive Cover',
        url: kidsFestiveWearImg,
        isCover: true,
      },
    ],
    specs: {
      fabric: 'Pure Silk-Cotton with Soft Lining',
      pattern: 'Festive Zari Border',
      neck: 'Round / Mandarin',
      sleeve: 'Regular',
      length: 'Full Set',
      fit: 'Comfort Kids Fit',
      careInstructions: 'Gentle wash',
    },
    warehouseLocation: 'Horanda Hub Rack #K-02',
    sizes: [
      { code: 'S', label: '4-5 Years', chest: '24"', stock: 6 },
      { code: 'M', label: '6-7 Years', chest: '26"', stock: 8 },
      { code: 'L', label: '8-9 Years', chest: '28"', stock: 5 },
      { code: 'XL', label: '10-12 Years', chest: '30"', stock: 4 },
    ],
    colorShades: [
      { id: 'c-coral', name: 'Festive Coral', hex: '#E11D48' },
      { id: 'c-gold', name: 'Mustard Gold', hex: '#D97706' },
    ],
    updatedAt: 'Today',
  },
  {
    id: 'prod-mens-jeans-06',
    sku: 'RSC-MJ-204',
    status: 'Active • In Stock',
    createdByRole: 'super_admin',
    createdByEmail: 'nasirhussain12489@gmail.com',
    createdByName: 'Super Admin (Nasir Hussain)',
    title: "Men's Classic Indigo Stretch Denim Jeans",
    primaryCategory: 'Men',
    subCategory: 'Jeans',
    productType: 'Denim Jeans',
    shortDescription: 'Comfort-stretch dark indigo regular tapered denim jeans.',
    description:
      'Durable heavy-duty cotton stretch denim jeans in deep indigo wash with reinforced 5-pocket styling and all-day comfort.',
    regularMrp: 2199,
    sellingPrice: 1499,
    regionalCodEnabled: true,
    isNew: false,
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    isVisible: true,
    rating: 4.5,
    reviewCount: 95,
    reviews: [],
    mediaGallery: [
      {
        id: 'mj-1',
        title: 'Denim Look',
        url: mensCasualShirtImg,
        isCover: true,
      },
    ],
    specs: {
      fabric: '98% Cotton, 2% Elastane Denim',
      pattern: 'Dark Indigo Wash',
      neck: 'Mid-Rise Waist',
      sleeve: 'Full Length',
      length: '40 Inches',
      fit: 'Regular Tapered',
      careInstructions: 'Machine wash inside out',
    },
    warehouseLocation: 'Horanda Hub Rack #M-09',
    sizes: [
      { code: 'S', label: 'Waist 30"', chest: '30"', stock: 7 },
      { code: 'M', label: 'Waist 32"', chest: '32"', stock: 10 },
      { code: 'L', label: 'Waist 34"', chest: '34"', stock: 9 },
      { code: 'XL', label: 'Waist 36"', chest: '36"', stock: 6 },
    ],
    colorShades: [
      { id: 'c-indigo', name: 'Dark Indigo', hex: '#1E3A8A' },
      { id: 'c-black', name: 'Charcoal Black', hex: '#171717' },
    ],
    updatedAt: 'Today',
  },
  {
    id: 'prod-womens-saree-07',
    sku: 'RSC-SR-201',
    status: 'Active • In Stock',
    createdByRole: 'super_admin',
    createdByEmail: 'nasirhussain12489@gmail.com',
    createdByName: 'Super Admin (Nasir Hussain)',
    title: 'Banarasi Crimson Zari Border Silk Saree',
    primaryCategory: 'Women',
    subCategory: 'Sarees',
    productType: 'Silk Saree',
    shortDescription: 'Crimson Banarasi silk saree with woven golden zari pallu.',
    description:
      'Regal crimson Banarasi Katan silk saree woven with traditional golden zari floral motifs, rich bridal border, and unstitched blouse piece.',
    regularMrp: 3599,
    sellingPrice: 1799,
    regionalCodEnabled: true,
    isNew: true,
    isFeatured: true,
    isPopular: true,
    isTrending: true,
    isVisible: true,
    rating: 4.9,
    reviewCount: 190,
    reviews: [],
    mediaGallery: [
      {
        id: 'sr-1',
        title: 'Saree Border & Tassels',
        url: dupattaBorderImg,
        isCover: true,
      },
      {
        id: 'sr-2',
        title: 'Zari Weave',
        url: collarZariMacroImg,
      },
    ],
    specs: {
      fabric: 'Banarasi Katan Silk',
      pattern: 'Woven Zari Border',
      neck: 'With Unstitched Blouse Piece',
      sleeve: '5.5m Saree + 0.8m Blouse',
      length: '6.3 Meters Total',
      fit: 'Free Size Drape',
      careInstructions: 'Dry Clean Only',
    },
    warehouseLocation: 'Horanda Hub Rack #S-01',
    sizes: [{ code: 'M', label: 'Free Size (5.5m + Blouse)', chest: 'Free', stock: 12 }],
    colorShades: [
      { id: 'c-crimson', name: 'Bridal Crimson', hex: '#991B1B' },
      { id: 'c-emerald', name: 'Emerald Gold', hex: '#065F46' },
    ],
    updatedAt: 'Today',
  },
  {
    id: 'prod-womens-emerald-08',
    sku: 'RSC-EM-112',
    status: 'Active • In Stock',
    createdByRole: 'super_admin',
    createdByEmail: 'nasirhussain12489@gmail.com',
    createdByName: 'Super Admin (Nasir Hussain)',
    title: 'Royal Emerald Handloom Salwar Suit Set',
    primaryCategory: 'Women',
    subCategory: 'Salwar Suits',
    productType: 'Salwar Suit',
    shortDescription: '3-piece emerald green handloom silk salwar suit with zari work.',
    description:
      'Complete 3-piece emerald green handloom silk salwar suit set featuring a zari-embroidered kurta, matching silk trousers, and woven dupatta.',
    regularMrp: 2799,
    sellingPrice: 1599,
    regionalCodEnabled: true,
    isNew: false,
    isFeatured: false,
    isPopular: true,
    isTrending: true,
    isVisible: true,
    rating: 4.7,
    reviewCount: 118,
    reviews: [],
    mediaGallery: [
      {
        id: 'em-1',
        title: 'Emerald Set',
        url: coverEmeraldImg,
        isCover: true,
      },
    ],
    specs: {
      fabric: 'Handloom Silk Blend',
      pattern: 'Embroidered Neckline',
      neck: 'Notch Neck',
      sleeve: '3/4 Sleeve',
      length: '44 Inches',
      fit: 'Straight Comfort Fit',
      careInstructions: 'Gentle hand wash',
    },
    warehouseLocation: 'Horanda Hub Rack #W-06',
    sizes: [
      { code: 'S', label: 'S (36")', chest: '36"', stock: 5 },
      { code: 'M', label: 'M (38")', chest: '38"', stock: 8 },
      { code: 'L', label: 'L (40")', chest: '40"', stock: 7 },
      { code: 'XL', label: 'XL (42")', chest: '42"', stock: 4 },
    ],
    colorShades: [
      { id: 'c-em', name: 'Emerald Green', hex: '#0F5132' },
      { id: 'c-mr', name: 'Deep Maroon', hex: '#7A1C24' },
    ],
    updatedAt: 'Today',
  },
];

export type OrderStatusType =
  | 'Order Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export const ALL_ORDER_STATUSES: OrderStatusType[] = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export interface OrderItemLine {
  productId: string;
  sku: string;
  title: string;
  imageUrl: string;
  size: string;
  colorName: string;
  costPrice?: number;
  unitPrice: number;
  quantity: number;
}

export interface RegionalOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  customerEmail: string;
  villageArea: string;
  district: string;
  state: string;
  pinCode: string;
  fullAddress: string;
  orderNotes: string;
  sku: string;
  productTitle: string;
  size: string;
  shade: string;
  quantity: number;
  amount: number;
  estimatedProfit?: number;
  isToday?: boolean;
  soldBySellerName?: string;
  deliveryCharge: number;
  items: OrderItemLine[];
  status: OrderStatusType;
  timestamp: string;
}

export const INITIAL_ORDERS: RegionalOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'R2123456',
    customerId: 'cust-1',
    customerName: 'Mohit Kumar',
    customerPhone: '9876543210',
    customerWhatsapp: '9876543210',
    customerEmail: 'mohit@gmail.com',
    villageArea: 'Horanda Alias Ramgarh',
    district: 'Palamu',
    state: 'Jharkhand',
    pinCode: '822110',
    fullAddress: 'Main Road, Ward No. 4, Horanda Alias Ramgarh',
    orderNotes: 'Deliver before evening',
    sku: 'RSC-WD-101',
    productTitle: 'Floral Maxi Dress + 2 items',
    size: 'M',
    shade: 'Purple',
    quantity: 3,
    amount: 3797,
    estimatedProfit: 1480,
    isToday: true,
    soldBySellerName: 'Super Admin (Nasir Hussain)',
    deliveryCharge: 0,
    items: [
      {
        productId: 'prod-floral-maxi-01',
        sku: 'RSC-WD-101',
        title: 'Floral Maxi Dress',
        imageUrl: floralMaxiDressImg,
        size: 'M',
        colorName: 'Purple',
        costPrice: 780,
        unitPrice: 1299,
        quantity: 1,
      },
      {
        productId: 'prod-mens-shirt-02',
        sku: 'RSC-MS-102',
        title: "Men's Casual Cotton Shirt",
        imageUrl: mensCasualShirtImg,
        size: 'L',
        colorName: 'Sky Blue',
        costPrice: 350,
        unitPrice: 599,
        quantity: 1,
      },
      {
        productId: 'prod-mens-kurta-04',
        sku: 'RSC-MK-108',
        title: 'Royal Navy Festive Kurta & Nehru Jacket Set',
        imageUrl: mensFashionKurtaImg,
        size: 'L',
        colorName: 'Navy & Gold',
        costPrice: 1187,
        unitPrice: 1899,
        quantity: 1,
      },
    ],
    status: 'Delivered',
    timestamp: 'Today, 09:45 AM',
  },
  {
    id: 'ord-2',
    orderNumber: 'R2123455',
    customerId: 'cust-1',
    customerName: 'Shabnam Parveen',
    customerPhone: '9835123456',
    customerWhatsapp: '9835123456',
    customerEmail: 'shabnam.horanda@example.com',
    villageArea: 'Horanda Alias Ramgarh',
    district: 'Palamu',
    state: 'Jharkhand',
    pinCode: '822110',
    fullAddress: 'Near Jama Masjid, Horanda Alias Ramgarh',
    orderNotes: 'Call upon arrival',
    sku: 'RSC-KT-094',
    productTitle: 'Anarkali Chanderi Silk Kurti Set',
    size: 'L',
    shade: 'Crimson Maroon',
    quantity: 1,
    amount: 1499,
    estimatedProfit: 599,
    isToday: true,
    soldBySellerName: 'Dilshad Ansari (Store Manager)',
    deliveryCharge: 0,
    items: [
      {
        productId: 'prod-rsc-kt-094',
        sku: 'RSC-KT-094',
        title: 'Anarkali Chanderi Silk Kurti Set',
        imageUrl: frontDrapeMaroonImg,
        size: 'L',
        colorName: 'Crimson Maroon',
        costPrice: 900,
        unitPrice: 1499,
        quantity: 1,
      },
    ],
    status: 'Processing',
    timestamp: 'Today, 11:20 AM',
  },
  {
    id: 'ord-3',
    orderNumber: 'R2123454',
    customerId: 'cust-4',
    customerName: 'Md. Irfan Alam',
    customerPhone: '9934011223',
    customerWhatsapp: '9934011223',
    customerEmail: 'irfan.horanda@example.com',
    villageArea: 'Horanda Alias Ramgarh',
    district: 'Palamu',
    state: 'Jharkhand',
    pinCode: '822110',
    fullAddress: 'High School Road, Horanda Alias Ramgarh',
    orderNotes: '',
    sku: 'RSC-SR-201',
    productTitle: 'Banarasi Crimson Zari Border Silk Saree',
    size: 'M',
    shade: 'Bridal Crimson',
    quantity: 1,
    amount: 1799,
    estimatedProfit: 719,
    isToday: false,
    soldBySellerName: 'Super Admin (Nasir Hussain)',
    deliveryCharge: 0,
    items: [
      {
        productId: 'prod-womens-saree-07',
        sku: 'RSC-SR-201',
        title: 'Banarasi Crimson Zari Border Silk Saree',
        imageUrl: dupattaBorderImg,
        size: 'M',
        colorName: 'Bridal Crimson',
        costPrice: 1080,
        unitPrice: 1799,
        quantity: 1,
      },
    ],
    status: 'Shipped',
    timestamp: 'Yesterday',
  },
];

export interface SavedDeliveryAddress {
  id: string;
  label: 'Home' | 'Shop' | 'Work' | 'Other';
  recipientName: string;
  mobile: string;
  fullAddress: string;
  villageArea: string;
  district: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export interface CustomerFitPreferences {
  topSize: string;
  bottomWaist: string;
  fitStyle: 'Regular Fit' | 'Slim Tailored' | 'Relaxed Comfort';
  favoriteColors: string[];
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  mobile: string;
  whatsapp: string;
  passwordHash: string;
  profilePhotoUrl: string | null;
  loyaltyPoints?: number;
  membershipTier?: 'Gold VIP' | 'Platinum Royal' | 'Silver Member';
  savedAddresses?: SavedDeliveryAddress[];
  fitPreferences?: CustomerFitPreferences;
  address: {
    fullAddress: string;
    villageArea: string;
    district: string;
    state: string;
    pinCode: string;
  };
  joinedDate: string;
}

export const INITIAL_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'cust-1',
    name: 'Mohit Kumar',
    email: 'mohit@gmail.com',
    mobile: '9876543210',
    whatsapp: '9876543210',
    passwordHash: 'demo_hash_1',
    profilePhotoUrl: null,
    address: {
      fullAddress: 'Main Road, Ward No. 4, Horanda Alias Ramgarh',
      villageArea: 'Horanda Alias Ramgarh',
      district: 'Palamu',
      state: 'Jharkhand',
      pinCode: '822110',
    },
    joinedDate: 'Apr 2026',
  },
  {
    id: 'cust-2',
    name: 'Shabnam Parveen',
    email: 'shabnam.horanda@example.com',
    mobile: '9835123456',
    whatsapp: '9835123456',
    passwordHash: 'demo_hash_2',
    profilePhotoUrl: null,
    address: {
      fullAddress: 'Near Jama Masjid, Ward No. 4, Horanda Alias Ramgarh',
      villageArea: 'Horanda Alias Ramgarh',
      district: 'Palamu',
      state: 'Jharkhand',
      pinCode: '822110',
    },
    joinedDate: 'Apr 2026',
  },
];

export interface SellerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordPlainOrHint: string;
  department: 'All Departments' | 'Men' | 'Women' | 'Kids';
  active: boolean;
  profilePhotoUrl: string | null;
  createdAt: string;
}

export interface SellerActivityLog {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  action: string;
  targetSkuOrOrder: string;
  timestamp: string;
}

export const INITIAL_SELLERS: SellerAccount[] = [
  {
    id: 'seller-1',
    name: 'Dilshad Ansari (Store Manager)',
    email: 'dilshadansari134578692@gmail.com',
    phone: '9693935479',
    passwordPlainOrHint: 'reyaz123',
    department: 'All Departments',
    active: true,
    profilePhotoUrl: null,
    createdAt: '10 Apr 2026',
  },
];

export const INITIAL_SELLER_LOGS: SellerActivityLog[] = [
  {
    id: 'log-1',
    sellerId: 'seller-1',
    sellerName: 'Dilshad Ansari (Store Manager)',
    sellerEmail: 'dilshadansari134578692@gmail.com',
    action: 'Updated stock count for Anarkali Chanderi Silk Kurti Set',
    targetSkuOrOrder: 'RSC-KT-094',
    timestamp: 'Today, 10:15 AM',
  },
];

export interface HomepageConfig {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroBannerUrl: string;
  promoOfferTitle: string;
  promoOfferSubtitle: string;
  promoDiscountBadge: string;
  freeDeliveryBanner: string;
  showFeatured: boolean;
  showNewArrivals: boolean;
  showPopular: boolean;
  showTrendingSection: boolean;
}

export const INITIAL_HOMEPAGE_CONFIG: HomepageConfig = {
  heroBadge: 'REYAZ SHOPPING CENTER • HORANDA ALIAS RAMGARH (822110)',
  heroTitle: 'Style for Every You',
  heroSubtitle:
    'Trendy Fashion | Premium Quality | Best Prices — Shop Men, Women & Kids Collections with Free Cash on Delivery in Horanda Alias Ramgarh (822110), Palamu.',
  heroCtaText: 'Shop Now',
  heroBannerUrl: coupleHeroBannerImg,
  promoOfferTitle: 'Special Offers — Up to 50% OFF Festive & Everyday Fashion',
  promoOfferSubtitle:
    'Enjoy FREE Home Delivery (₹0) and 100% Cash on Delivery across Horanda Alias Ramgarh, Palamu, Jharkhand - 822110.',
  promoDiscountBadge: 'UP TO 50% OFF + FREE COD',
  freeDeliveryBanner:
    'FREE Cash on Delivery Available in Horanda Alias Ramgarh, Palamu, Jharkhand - 822110',
  showFeatured: true,
  showNewArrivals: true,
  showPopular: true,
  showTrendingSection: true,
};

export interface StoreSettingsConfig {
  storeName: string;
  tagline: string;
  whatsappPrimary: string;
  whatsappSecondary: string;
  storeEmail: string;
  allowedVillageArea: string;
  allowedDistrict: string;
  allowedState: string;
  allowedCountry: string;
  defaultPinCode: string;
  deliveryCharge: number;
  codOnly: boolean;
  returnPolicyText: string;
  shippingPolicyText: string;
  privacyPolicyText: string;
  termsText: string;
}

export const INITIAL_STORE_SETTINGS: StoreSettingsConfig = {
  storeName: 'Reyaz Shopping Center',
  tagline: 'Fashion for a Better You — Horanda Alias Ramgarh, Palamu (822110)',
  whatsappPrimary: '9693935479',
  whatsappSecondary: '7209629509',
  storeEmail: 'dilshadansari134578692@gmail.com',
  allowedVillageArea: 'Horanda Alias Ramgarh',
  allowedDistrict: 'Palamu',
  allowedState: 'Jharkhand',
  allowedCountry: 'India',
  defaultPinCode: '822110',
  deliveryCharge: 0,
  codOnly: true,
  returnPolicyText:
    'Easy 7-day doorstep exchange or return in Horanda Alias Ramgarh (822110) for unworn items with original tags intact.',
  shippingPolicyText:
    'FREE Doorstep Delivery (₹0) exclusively in Horanda Alias Ramgarh, Palamu, Jharkhand - 822110. Orders are delivered within 24–48 hours.',
  privacyPolicyText:
    'Your personal contact details, profile photo, and delivery addresses are strictly confidential and used solely to fulfill your Reyaz Shopping Center orders.',
  termsText:
    'All orders are fulfilled directly by Reyaz Shopping Center via 100% Cash on Delivery (COD) in Horanda Alias Ramgarh (822110), Palamu, Jharkhand.',
};

export interface ShopExpenseItem {
  id: string;
  title: string;
  category: 'Stock Transport' | 'Packaging' | 'Delivery Boy' | 'Shop Electricity/Rent' | 'Other';
  amount: number;
  addedBy: string;
  date: string;
}

export const INITIAL_SHOP_EXPENSES: ShopExpenseItem[] = [
  {
    id: 'exp-1',
    title: 'Horanda Local COD Delivery Boy Allowance',
    category: 'Delivery Boy',
    amount: 150,
    addedBy: 'Super Admin',
    date: 'Today',
  },
  {
    id: 'exp-2',
    title: 'Premium Printed Carry Bags & Packaging',
    category: 'Packaging',
    amount: 120,
    addedBy: 'Dilshad Ansari (Store Manager)',
    date: 'Today',
  },
];

export const EXTRA_UPLOAD_POOL: MediaItem[] = [
  {
    id: 'pool-1',
    title: 'Collar Zari Detail',
    url: collarZariMacroImg,
  },
  {
    id: 'pool-2',
    title: 'Handloom Silk Weave',
    url: fabricWeaveMacroImg,
  },
  {
    id: 'pool-3',
    title: 'Dupatta Tassels',
    url: dupattaBorderImg,
  },
  {
    id: 'pool-4',
    title: 'Emerald Variant',
    url: coverEmeraldImg,
  },
];
