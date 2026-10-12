import React, { useState, useRef } from 'react';
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Package,
  Trash2,
  Camera,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  MessageCircle,
  X,
  Store,
  Cloud,
  AlertCircle,
  Eye,
  EyeOff,
  Heart,
  ArrowLeft,
  ChevronRight,
  Award,
  Sparkles,
  Ruler,
  FileText,
  Plus,
  Printer,
  Zap,
  Crown,
} from 'lucide-react';
import {
  CustomerAccount,
  RegionalOrder,
  ALL_ORDER_STATUSES,
  StoreSettingsConfig,
  SellerAccount,
  SavedDeliveryAddress,
  floralMaxiDressImg,
  mensCasualShirtImg,
  frontDrapeMaroonImg,
  mensFashionKurtaImg,
} from '../data/catalogData';
import {
  signInWithGooglePopup,
  connectFirebaseEmailAuth,
} from '../lib/firebase';
import { uploadImageToImgBB } from '../lib/imgbb';
import { ReyazLogo } from './ReyazLogo';

const PRESET_AVATARS = [
  { id: 'av-1', label: 'Royal Kurta Look', url: mensFashionKurtaImg },
  { id: 'av-2', label: 'Festive Anarkali', url: frontDrapeMaroonImg },
  { id: 'av-3', label: 'Smart Casual', url: mensCasualShirtImg },
  { id: 'av-4', label: 'Lavender Floral', url: floralMaxiDressImg },
];

interface CustomerAccountViewProps {
  currentCustomer: CustomerAccount | null;
  customers: CustomerAccount[];
  sellers: SellerAccount[];
  orders: RegionalOrder[];
  storeSettings: StoreSettingsConfig;
  onLoginCustomer: (customer: CustomerAccount) => void;
  onRegisterCustomer: (newCustomer: CustomerAccount) => void;
  onUpdateCustomer: (updated: CustomerAccount) => void;
  onLogoutCustomer: () => void;
  onOpenWishlist: () => void;
  onCancelCustomerOrder: (orderId: string) => void;
  onDirectSuperAdminLogin: (adminData: {
    email: string;
    name: string;
    role: 'super_admin' | 'seller';
    department?: string;
  }) => void;
}

export const CustomerAccountView: React.FC<CustomerAccountViewProps> = ({
  currentCustomer,
  customers,
  sellers,
  orders,
  storeSettings,
  onLoginCustomer,
  onRegisterCustomer,
  onUpdateCustomer,
  onLogoutCustomer,
  onOpenWishlist,
  onCancelCustomerOrder,
  onDirectSuperAdminLogin,
}) => {
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [profileSection, setProfileSection] = useState<
    'overview' | 'profile' | 'orders' | 'fit-vault' | 'addresses' | 'password'
  >('overview');
  const [orderFilterTab, setOrderFilterTab] = useState<
    'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  >('All');
  const [selectedOrderDetail, setSelectedOrderDetail] =
    useState<RegionalOrder | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] =
    useState<RegionalOrder | null>(null);

  // Login / Register state
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [googlePassInput, setGooglePassInput] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regAddress, setRegAddress] = useState(
    'Main Road, Ward No. 4, Horanda Alias Ramgarh'
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Profile Edit State
  const [editName, setEditName] = useState(currentCustomer?.name || '');
  const [editEmail, setEditEmail] = useState(currentCustomer?.email || '');
  const [editMobile, setEditMobile] = useState(currentCustomer?.mobile || '');
  const [editAddress, setEditAddress] = useState(
    currentCustomer?.address.fullAddress || ''
  );
  const [editPin, setEditPin] = useState(
    currentCustomer?.address.pinCode || '822110'
  );
  const [newPass, setNewPass] = useState('');

  // Fit Vault State
  const [topSize, setTopSize] = useState(
    currentCustomer?.fitPreferences?.topSize || 'L'
  );
  const [bottomWaist, setBottomWaist] = useState(
    currentCustomer?.fitPreferences?.bottomWaist || '32"'
  );
  const [fitStyle, setFitStyle] = useState<
    'Regular Fit' | 'Slim Tailored' | 'Relaxed Comfort'
  >(currentCustomer?.fitPreferences?.fitStyle || 'Regular Fit');
  const [favColors, setFavColors] = useState<string[]>(
    currentCustomer?.fitPreferences?.favoriteColors || [
      'Royal Gold',
      'Navy Blue',
    ]
  );

  // New Address Form State
  const [addrLabel, setAddrLabel] =
    useState<SavedDeliveryAddress['label']>('Home');
  const [addrLine, setAddrLine] = useState('');

  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (currentCustomer) {
      setEditName(currentCustomer.name);
      setEditEmail(currentCustomer.email);
      setEditMobile(currentCustomer.mobile);
      setEditAddress(currentCustomer.address.fullAddress);
      setEditPin(currentCustomer.address.pinCode || '822110');
      setTopSize(currentCustomer.fitPreferences?.topSize || 'L');
      setBottomWaist(currentCustomer.fitPreferences?.bottomWaist || '32"');
      setFitStyle(currentCustomer.fitPreferences?.fitStyle || 'Regular Fit');
      setFavColors(
        currentCustomer.fitPreferences?.favoriteColors || [
          'Royal Gold',
          'Navy Blue',
        ]
      );
    }
  }, [currentCustomer]);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleProfilePhotoFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !currentCustomer) return;
    if (!file.type.startsWith('image/')) return;
    e.target.value = '';
    setIsUploadingPhoto(true);
    try {
      const imgbbUrl = await uploadImageToImgBB(
        file,
        `customer-${currentCustomer.name || 'profile'}`
      );
      onUpdateCustomer({
        ...currentCustomer,
        profilePhotoUrl: imgbbUrl,
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const identifier = emailOrMobile.trim();
    const q = identifier.toLowerCase();

    if (!identifier || !password) {
      setAuthError('Please enter your Email/Mobile and Password.');
      return;
    }

    // 1. Check if this is the Super Admin (nasirhussain12489@gmail.com / 9934886605dilD@)
    if (q === 'nasirhussain12489@gmail.com') {
      if (password === '9934886605dilD@') {
        await connectFirebaseEmailAuth('nasirhussain12489@gmail.com', password);
        onDirectSuperAdminLogin({
          email: 'nasirhussain12489@gmail.com',
          name: 'Super Admin (Nasir Hussain)',
          role: 'super_admin',
        });
        return;
      } else {
        setAuthError('Invalid password. Please check your password and try again.');
        return;
      }
    }

    try {
      const checkRes = await fetch('/api/auth/check-super-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const checkData = await checkRes.json();
      if (checkData.isSuperAdmin && checkData.account) {
        await connectFirebaseEmailAuth(identifier, password);
        onDirectSuperAdminLogin(checkData.account);
        return;
      }
    } catch {
      // Handled above
    }

    // 2. Check if this matches a Seller account created by Super Admin
    const sellerByIdentifier = sellers.find(
      (s) => s.email.toLowerCase() === q || s.phone === q
    );
    if (sellerByIdentifier) {
      if (!sellerByIdentifier.active) {
        setAuthError(
          'Your seller account is currently paused by the Super Admin.'
        );
        return;
      }
      if (sellerByIdentifier.passwordPlainOrHint === password) {
        await connectFirebaseEmailAuth(sellerByIdentifier.email, password);
        onDirectSuperAdminLogin({
          email: sellerByIdentifier.email,
          name: sellerByIdentifier.name,
          role: 'seller',
          department: sellerByIdentifier.department,
        });
        return;
      } else {
        setAuthError('Incorrect password for Seller account.');
        return;
      }
    }

    // 3. Otherwise, log in as a Customer
    await connectFirebaseEmailAuth(identifier, password);
    const existingCustomer = customers.find(
      (c) => c.email.toLowerCase() === q || c.mobile === q
    );
    if (existingCustomer) {
      onLoginCustomer(existingCustomer);
    } else {
      const autoCustomer: CustomerAccount = {
        id: `cust-${Date.now()}`,
        name: identifier.includes('@')
          ? identifier.split('@')[0].replace(/[._]/g, ' ')
          : `Customer (${identifier})`,
        email: identifier.includes('@')
          ? identifier
          : `${identifier}@reyazstore.in`,
        mobile: identifier.includes('@') ? '9876543210' : identifier,
        whatsapp: identifier.includes('@') ? '9876543210' : identifier,
        passwordHash: 'user_hash',
        profilePhotoUrl: null,
        loyaltyPoints: 250,
        membershipTier: 'Gold VIP',
        address: {
          fullAddress: 'Main Road, Horanda Alias Ramgarh',
          villageArea: 'Horanda Alias Ramgarh',
          district: 'Palamu',
          state: 'Jharkhand',
          pinCode: '822110',
        },
        joinedDate: 'Today',
      };
      onRegisterCustomer(autoCustomer);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!regName.trim() || !regMobile.trim()) {
      setAuthError('Please enter your Full Name and Mobile Number.');
      return;
    }
    if (regPassword && regConfirmPass && regPassword !== regConfirmPass) {
      setAuthError('Passwords do not match.');
      return;
    }

    // If someone registers with nasirhussain12489@gmail.com and the admin password, open Super Admin
    if (
      regEmail.trim().toLowerCase() === 'nasirhussain12489@gmail.com' &&
      regPassword === '9934886605dilD@'
    ) {
      onDirectSuperAdminLogin({
        email: 'nasirhussain12489@gmail.com',
        name: regName.trim() || 'Super Admin (Nasir Hussain)',
        role: 'super_admin',
      });
      return;
    }

    let passwordHash = 'hashed_pw';
    try {
      const res = await fetch('/api/auth/hash-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: regPassword || '123456' }),
      });
      const data = await res.json();
      if (data.passwordHash) passwordHash = data.passwordHash;
    } catch {
      // fallback
    }

    const created: CustomerAccount = {
      id: `cust-${Date.now()}`,
      name: regName.trim(),
      email:
        regEmail.trim() ||
        `${regMobile.trim()}@horanda.reyazshoppingcenter.in`,
      mobile: regMobile.trim(),
      whatsapp: regMobile.trim(),
      passwordHash,
      profilePhotoUrl: null,
      loyaltyPoints: 300,
      membershipTier: 'Gold VIP',
      address: {
        fullAddress: regAddress.trim(),
        villageArea: 'Horanda Alias Ramgarh',
        district: 'Palamu',
        state: 'Jharkhand',
        pinCode: '822110',
      },
      joinedDate: 'Today',
    };
    onRegisterCustomer(created);
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const res = await signInWithGooglePopup();
      const u = res.user;
      const emailLower = (u.email || '').toLowerCase();

      // CRITICAL: If Google login is nasirhussain12489@gmail.com, open Super Admin Dashboard immediately!
      if (emailLower === 'nasirhussain12489@gmail.com') {
        onDirectSuperAdminLogin({
          email: 'nasirhussain12489@gmail.com',
          name: u.displayName || 'Super Admin (Nasir Hussain)',
          role: 'super_admin',
        });
        return;
      }

      // Check if Google email matches a Seller account
      const matchedSeller = sellers.find(
        (s) => s.email.toLowerCase() === emailLower && s.active
      );
      if (matchedSeller) {
        onDirectSuperAdminLogin({
          email: matchedSeller.email,
          name: matchedSeller.name,
          role: 'seller',
          department: matchedSeller.department,
        });
        return;
      }

      // Otherwise log in as Customer
      const existing = customers.find(
        (c) => c.email.toLowerCase() === emailLower
      );
      if (existing) {
        onLoginCustomer({
          ...existing,
          profilePhotoUrl: existing.profilePhotoUrl || u.photoURL || null,
        });
      } else {
        const created: CustomerAccount = {
          id: u.uid,
          name: u.displayName || 'Valued Customer',
          email: u.email || 'customer@example.com',
          mobile: '9835000000',
          whatsapp: '9835000000',
          passwordHash: 'google_oauth',
          profilePhotoUrl: u.photoURL || null,
          loyaltyPoints: 500,
          membershipTier: 'Gold VIP',
          address: {
            fullAddress: 'Main Road, Horanda Alias Ramgarh',
            villageArea: 'Horanda Alias Ramgarh',
            district: 'Palamu',
            state: 'Jharkhand',
            pinCode: '822110',
          },
          joinedDate: 'Today',
        };
        onRegisterCustomer(created);
      }
    } catch {
      // If browser preview iframe blocks third-party popup, open the in-app Google Account Sign-In modal
      setShowGoogleModal(true);
    }
  };

  const handleCompleteGoogleModalSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const gEmail = googleEmailInput.trim().toLowerCase();
    if (!gEmail || !gEmail.includes('@')) {
      setAuthError('Please enter a valid Google (Gmail) address.');
      return;
    }

    if (gEmail === 'nasirhussain12489@gmail.com') {
      if (googlePassInput !== '9934886605dilD@') {
        setAuthError('Please enter your Super Admin password to continue.');
        return;
      }
      await connectFirebaseEmailAuth(gEmail, googlePassInput);
      setShowGoogleModal(false);
      onDirectSuperAdminLogin({
        email: 'nasirhussain12489@gmail.com',
        name: googleNameInput.trim() || 'Super Admin (Nasir Hussain)',
        role: 'super_admin',
      });
      return;
    }

    const matchedSeller = sellers.find(
      (s) => s.email.toLowerCase() === gEmail && s.active
    );
    if (matchedSeller) {
      await connectFirebaseEmailAuth(
        matchedSeller.email,
        matchedSeller.passwordPlainOrHint
      );
      setShowGoogleModal(false);
      onDirectSuperAdminLogin({
        email: matchedSeller.email,
        name: matchedSeller.name,
        role: 'seller',
        department: matchedSeller.department,
      });
      return;
    }

    await connectFirebaseEmailAuth(gEmail, googlePassInput || 'google_auth_123');
    setShowGoogleModal(false);
    const existing = customers.find((c) => c.email.toLowerCase() === gEmail);
    if (existing) {
      onLoginCustomer(existing);
    } else {
      const displayName =
        googleNameInput.trim() ||
        gEmail.split('@')[0].replace(/[._]/g, ' ');
      const created: CustomerAccount = {
        id: `cust-${Date.now()}`,
        name: displayName,
        email: gEmail,
        mobile: '9835000000',
        whatsapp: '9835000000',
        passwordHash: 'google_oauth',
        profilePhotoUrl: null,
        loyaltyPoints: 500,
        membershipTier: 'Gold VIP',
        address: {
          fullAddress: 'Main Road, Horanda Alias Ramgarh',
          villageArea: 'Horanda Alias Ramgarh',
          district: 'Palamu',
          state: 'Jharkhand',
          pinCode: '822110',
        },
        joinedDate: 'Today',
      };
      onRegisterCustomer(created);
    }
  };

  // ================= UNAUTHENTICATED VIEW (SCREENS #13 & #14) =================
  if (!currentCustomer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Card: Login / Google Login / Forgot Password */}
          <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col items-center text-center space-y-2">
              <ReyazLogo size="md" showTextBeside={false} />
              <h1 className="font-serif text-2xl font-bold text-[#0D1B2A]">
                {authTab === 'forgot' ? 'Forgot Password' : 'Login to Reyaz'}
              </h1>
              <p className="text-xs text-stone-500">
                {authTab === 'forgot'
                  ? 'Enter your email or mobile number to reset your password'
                  : 'Sign in with your Email (Gmail), Mobile Number, or Google'}
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {authNotice && (
              <div className="bg-[#D1FAE5] text-[#065F46] text-xs font-bold p-3 rounded-xl">
                {authNotice}
              </div>
            )}

            {authTab === 'forgot' ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  placeholder="Email or Mobile Number"
                  className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() =>
                    setAuthNotice(
                      `Password reset assistance initiated. You can also message our WhatsApp support desk at +91 ${storeSettings.whatsappPrimary}.`
                    )
                  }
                  className="w-full bg-[#0D1B2A] text-white font-bold text-xs py-3.5 rounded-xl cursor-pointer"
                >
                  Send OTP / Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setAuthNotice(null);
                  }}
                  className="w-full text-center text-xs font-bold text-[#0D1B2A] hover:underline cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    required
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    placeholder="Email (Gmail) or Mobile Number"
                    className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-3 text-xs font-medium"
                  />
                </div>
                <div className="relative">
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl pl-3.5 pr-10 py-3 text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                  >
                    {showLoginPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setAuthTab('forgot')}
                    className="text-[11px] font-bold text-stone-500 hover:text-[#0D1B2A] cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0D1B2A] hover:bg-[#1B263B] text-white font-bold text-xs py-3.5 rounded-xl cursor-pointer"
                >
                  Login
                </button>

                <div className="relative py-2 text-center">
                  <span className="bg-white px-3 text-[11px] text-stone-400 relative z-10">
                    Or sign in with Google
                  </span>
                  <div className="absolute inset-x-0 top-1/2 h-px bg-stone-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-[#FAF8F5] hover:bg-stone-100 text-[#0D1B2A] border-2 border-[#D4AF37] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Cloud className="w-4 h-4 text-[#B8860B]" />
                  Continue with Google
                </button>
              </form>
            )}
          </div>

          {/* Right Card: Create Account */}
          <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <h2 className="font-serif text-2xl font-bold text-[#0D1B2A]">
                Create Account
              </h2>
              <p className="text-xs text-stone-500">
                Unlock VIP Rewards &amp; Free Cash on Delivery in Horanda (822110)
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Full Name *"
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
              />
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Email (Gmail)"
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
              />
              <input
                type="tel"
                required
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value)}
                placeholder="Mobile Number *"
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
              />
              <input
                type="text"
                required
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                placeholder="Delivery Address in Horanda Alias Ramgarh (822110)"
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
              />
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Password *"
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
              />
              <input
                type="password"
                value={regConfirmPass}
                onChange={(e) => setRegConfirmPass(e.target.value)}
                placeholder="Confirm Password"
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
              />
              <button
                type="submit"
                className="w-full bg-[#0D1B2A] hover:bg-[#1B263B] text-white font-bold text-xs py-3.5 rounded-xl cursor-pointer"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>

        {/* In-App Google Sign-In Modal (when browser preview blocks third-party popup) */}
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#E6E1D6] shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-[#B8860B]" />
                  <h3 className="font-serif text-lg font-bold text-[#0D1B2A]">
                    Sign in with Google
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-500">
                Enter your Gmail account to continue to Reyaz Shopping Center:
              </p>

              <form onSubmit={handleCompleteGoogleModalSignIn} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Gmail Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>

                {googleEmailInput.trim().toLowerCase() ===
                'nasirhussain12489@gmail.com' ? (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={googlePassInput}
                      onChange={(e) => setGooglePassInput(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#0D1B2A] hover:bg-[#1B263B] text-[#F5CE62] font-bold text-xs py-3.5 rounded-xl cursor-pointer"
                >
                  Continue with Gmail
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ================= AUTHENTICATED FUTURISTIC VIP CUSTOMER PROFILE =================
  const customerOrders = orders.filter(
    (o) =>
      o.customerId === currentCustomer.id ||
      o.customerPhone === currentCustomer.mobile ||
      o.customerName.toLowerCase() === currentCustomer.name.toLowerCase()
  );

  const totalSpent = customerOrders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + o.amount, 0);
  const totalSavedOnDiscounts = Math.round(totalSpent * 0.35);
  const rewardPoints =
    (currentCustomer.loyaltyPoints || 250) +
    Math.round(totalSpent / 10);

  const filteredOrders = customerOrders.filter((o) => {
    if (orderFilterTab === 'All') return true;
    if (orderFilterTab === 'Processing')
      return (
        o.status === 'Order Placed' ||
        o.status === 'Confirmed' ||
        o.status === 'Processing'
      );
    if (orderFilterTab === 'Shipped')
      return o.status === 'Shipped' || o.status === 'Out for Delivery';
    return o.status === orderFilterTab;
  });

  // Order Details Screen (#10) with Printable Invoice
  if (selectedOrderDetail) {
    const progressSteps: (
      | 'Order Placed'
      | 'Confirmed'
      | 'Processing'
      | 'Shipped'
      | 'Out for Delivery'
      | 'Delivered'
    )[] = [
      'Order Placed',
      'Confirmed',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];
    const currentStepIdx = ALL_ORDER_STATUSES.indexOf(
      selectedOrderDetail.status
    );

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedOrderDetail(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D1B2A] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Profile &amp; Orders
          </button>

          <button
            type="button"
            onClick={() => setShowInvoiceModal(selectedOrderDetail)}
            className="bg-[#0D1B2A] text-[#F5CE62] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> View / Print Order Bill
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <h1 className="font-mono-num text-2xl font-extrabold text-[#0D1B2A]">
                #{selectedOrderDetail.orderNumber}
              </h1>
              <div className="text-xs text-stone-500 mt-0.5">
                Placed on {selectedOrderDetail.timestamp}
              </div>
            </div>
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                selectedOrderDetail.status === 'Delivered'
                  ? 'bg-[#D1FAE5] text-[#065F46]'
                  : selectedOrderDetail.status === 'Cancelled'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-[#FEF3C7] text-[#B45309]'
              }`}
            >
              {selectedOrderDetail.status}
            </span>
          </div>

          {/* 6-Step Horizontal Order Tracker */}
          {selectedOrderDetail.status !== 'Cancelled' && (
            <div className="py-2 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[520px]">
                {progressSteps.map((step, idx) => {
                  const stepOrderIdx = ALL_ORDER_STATUSES.indexOf(step);
                  const reached = stepOrderIdx <= currentStepIdx;
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            reached
                              ? 'bg-[#15803D] text-white'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          ✓
                        </div>
                        <span
                          className={`text-[10px] font-bold ${
                            reached ? 'text-[#0D1B2A]' : 'text-stone-400'
                          }`}
                        >
                          {step === 'Order Placed' ? 'Placed' : step}
                        </span>
                      </div>
                      {idx < progressSteps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-1 rounded ${
                            ALL_ORDER_STATUSES.indexOf(progressSteps[idx + 1]) <=
                            currentStepIdx
                              ? 'bg-[#15803D]'
                              : 'bg-stone-200'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery Address Card */}
          <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E6E1D6] space-y-1.5 text-xs">
            <h3 className="font-serif font-bold text-sm text-[#0D1B2A]">
              Delivery Address
            </h3>
            <div className="font-bold text-[#0D1B2A]">
              {selectedOrderDetail.customerName}
            </div>
            <div className="text-stone-600">
              +91 {selectedOrderDetail.customerPhone}
            </div>
            <div className="text-stone-600">
              {selectedOrderDetail.fullAddress}, {selectedOrderDetail.villageArea},{' '}
              {selectedOrderDetail.district}, {selectedOrderDetail.state} -{' '}
              {selectedOrderDetail.pinCode}
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-[#0D1B2A]">
              Items Ordered
            </h3>
            {(selectedOrderDetail.items && selectedOrderDetail.items.length > 0
              ? selectedOrderDetail.items
              : [
                  {
                    productId: 'item-1',
                    sku: selectedOrderDetail.sku,
                    title: selectedOrderDetail.productTitle,
                    imageUrl: '',
                    size: selectedOrderDetail.size,
                    colorName: selectedOrderDetail.shade,
                    unitPrice: selectedOrderDetail.amount,
                    quantity: selectedOrderDetail.quantity,
                  },
                ]
            ).map((it, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-[#FAF8F5] border border-[#E6E1D6]"
              >
                <div className="flex items-center gap-3">
                  {it.imageUrl && (
                    <img
                      src={it.imageUrl}
                      alt={it.title}
                      className="w-14 h-16 rounded-xl object-cover bg-white"
                    />
                  )}
                  <div>
                    <div className="text-xs font-bold text-[#0D1B2A]">
                      {it.title}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {it.colorName}, Size {it.size} × {it.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-mono-num font-bold text-sm text-[#0D1B2A]">
                  ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Total & Actions */}
          <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 block">
                Payment: Cash on Delivery (FREE Delivery)
              </span>
              <span className="font-bold text-sm text-[#0D1B2A]">Total</span>
            </div>
            <span className="font-mono-num text-2xl font-extrabold text-[#0D1B2A]">
              ₹{selectedOrderDetail.amount.toLocaleString('en-IN')}
            </span>
          </div>

          {(selectedOrderDetail.status === 'Order Placed' ||
            selectedOrderDetail.status === 'Confirmed') && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onCancelCustomerOrder(selectedOrderDetail.id);
                  setSelectedOrderDetail({
                    ...selectedOrderDetail,
                    status: 'Cancelled',
                  });
                }}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Cancel This Order
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <input
        ref={profilePhotoInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePhotoFile}
        className="hidden"
      />

      {/* Top Futuristic VIP Banner & Digital Membership Pass */}
      <div className="bg-gradient-to-r from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] text-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with glowing gold ring */}
          <div className="relative shrink-0">
            {currentCustomer.profilePhotoUrl ? (
              <img
                src={currentCustomer.profilePhotoUrl}
                alt={currentCustomer.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#F5CE62] shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1B263B] text-[#F5CE62] flex items-center justify-center font-serif text-4xl font-extrabold border-4 border-[#F5CE62]">
                {currentCustomer.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => profilePhotoInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#F5CE62] text-[#0D1B2A] border-2 border-[#0D1B2A] flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
              title="Upload Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#F5CE62]/20 border border-[#F5CE62]/40 text-[#F5CE62] px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5" />
              <span>
                {currentCustomer.membershipTier || 'REYAZ GOLD VIP MEMBER'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {currentCustomer.name}
            </h1>
            <div className="text-xs text-stone-300 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span>📧 {currentCustomer.email}</span>
              <span>•</span>
              <span>📱 +91 {currentCustomer.mobile}</span>
              <span>•</span>
              <span>📍 Horanda Alias Ramgarh (822110)</span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                disabled={isUploadingPhoto}
                onClick={() => profilePhotoInputRef.current?.click()}
                className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-white/15 cursor-pointer"
              >
                {isUploadingPhoto ? 'Uploading to ImgBB...' : 'Upload Custom Photo (ImgBB)'}
              </button>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="bg-[#F5CE62] hover:bg-[#e5be52] text-[#0D1B2A] text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                onClick={onLogoutCustomer}
                className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-white/15 cursor-pointer"
              >
                Switch Account / Logout
              </button>
            </div>
          </div>
        </div>

        {/* Right VIP Metrics Cards */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3.5 text-center">
            <Award className="w-5 h-5 text-[#F5CE62] mx-auto mb-1" />
            <div className="font-mono-num text-xl font-extrabold text-[#F5CE62]">
              {rewardPoints}
            </div>
            <div className="text-[10px] text-stone-300 uppercase tracking-wider">
              VIP Points
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3.5 text-center">
            <Package className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="font-mono-num text-xl font-extrabold text-white">
              {customerOrders.length}
            </div>
            <div className="text-[10px] text-stone-300 uppercase tracking-wider">
              COD Orders
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3.5 text-center">
            <Sparkles className="w-5 h-5 text-[#F5CE62] mx-auto mb-1" />
            <div className="font-mono-num text-xl font-extrabold text-emerald-400">
              ₹{totalSavedOnDiscounts.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-300 uppercase tracking-wider">
              Total Saved
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Futuristic Navigation + Right Dynamic Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 bg-white rounded-3xl border border-[#E6E1D6] p-4 space-y-1.5 shadow-2xs">
          {[
            { id: 'overview', label: 'VIP Hub & Avatar Studio', icon: Zap },
            { id: 'profile', label: 'Personal Profile Info', icon: User },
            {
              id: 'orders',
              label: `My Orders & Bills (${customerOrders.length})`,
              icon: Package,
            },
            { id: 'fit-vault', label: 'My Size & Fit Vault', icon: Ruler },
            {
              id: 'addresses',
              label: 'Horanda (822110) Addresses',
              icon: MapPin,
            },
            { id: 'password', label: 'Security & Password', icon: Lock },
          ].map((item) => {
            const Icon = item.icon;
            const active = profileSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setProfileSection(item.id as typeof profileSection)
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#0D1B2A] text-[#F5CE62] shadow-xs'
                    : 'text-stone-600 hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={onOpenWishlist}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-stone-600 hover:bg-[#FAF8F5] cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#DC2626]" />
            <span>Saved Wishlist</span>
          </button>

          <button
            type="button"
            onClick={onLogoutCustomer}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* 1. VIP HUB & AVATAR PHOTO STUDIO */}
          {profileSection === 'overview' && (
            <div className="space-y-6">
              {/* Futuristic Digital VIP Membership Card & Tier Progress */}
              <div className="bg-gradient-to-br from-[#0D1B2A] via-[#162840] to-[#0D1B2A] text-white rounded-3xl p-6 sm:p-7 border border-[#D4AF37]/40 shadow-lg space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F5CE62]">
                      REYAZ DIGITAL VIP PASS • HORANDA (822110)
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      {currentCustomer.membershipTier || 'Gold VIP'} Privileges Active
                    </h3>
                    <p className="text-xs text-stone-300">
                      100% Free Priority Doorstep Cash on Delivery • Early Festive Access • Instant 7-Day Doorstep Exchange
                    </p>
                  </div>
                  <div className="text-right font-mono-num bg-white/10 border border-white/15 px-4 py-2.5 rounded-2xl">
                    <div className="text-[10px] text-stone-300 uppercase">
                      Member ID
                    </div>
                    <div className="text-sm font-extrabold text-[#F5CE62]">
                      RSC-VIP-{currentCustomer.mobile.slice(-4) || '8210'}
                    </div>
                  </div>
                </div>

                {/* Tier Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-300">
                      Lifetime Shopping Value: ₹{totalSpent.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[#F5CE62]">
                      {totalSpent >= 5000
                        ? 'Platinum Royal Unlocked (Max Tier)'
                        : `₹${(5000 - totalSpent).toLocaleString('en-IN')} away from Platinum Royal`}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5CE62]"
                      style={{
                        width: `${Math.min(100, Math.max(18, Math.round((totalSpent / 5000) * 100)))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Personalized Avatar Studio */}
              <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#B8860B]">
                      PERSONALIZED AVATAR STUDIO
                    </span>
                    <h2 className="font-serif text-xl font-bold text-[#0D1B2A]">
                      Profile Photo &amp; Quick Preset Avatars
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => profilePhotoInputRef.current?.click()}
                      className="bg-[#0D1B2A] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-[#F5CE62]" />
                      <span>Upload Photo From Phone / PC</span>
                    </button>
                    {currentCustomer.profilePhotoUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateCustomer({
                            ...currentCustomer,
                            profilePhotoUrl: null,
                          })
                        }
                        className="bg-red-50 text-red-600 text-xs font-bold px-3.5 py-2.5 rounded-xl cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() =>
                        onUpdateCustomer({
                          ...currentCustomer,
                          profilePhotoUrl: av.url,
                        })
                      }
                      className={`p-3 rounded-2xl border text-center space-y-2 transition-all cursor-pointer ${
                        currentCustomer.profilePhotoUrl === av.url
                          ? 'border-2 border-[#0D1B2A] bg-[#FAF8F5]'
                          : 'border-stone-200 hover:border-[#0D1B2A]'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.label}
                        className="w-16 h-16 rounded-full object-cover mx-auto border border-[#D4AF37]"
                      />
                      <div className="text-xs font-bold text-[#0D1B2A]">
                        {av.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. MY SIZE & FIT PREFERENCES VAULT */}
          {profileSection === 'fit-vault' && (
            <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#B8860B]">
                  SMART FIT MEMORY
                </span>
                <h2 className="font-serif text-xl font-bold text-[#0D1B2A]">
                  My Size &amp; Style Preferences Vault
                </h2>
                <p className="text-xs text-stone-500">
                  Save your preferred garment sizes and fit style in the database for faster shopping.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D1B2A] mb-1.5">
                    Shirt / Kurti / Top Size
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setTopSize(sz)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                          topSize === sz
                            ? 'bg-[#0D1B2A] text-[#F5CE62] border-[#0D1B2A]'
                            : 'bg-[#FAF8F5] text-stone-700 border-stone-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D1B2A] mb-1.5">
                    Jeans / Trouser Waist Size
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['28"', '30"', '32"', '34"', '36"', '38"'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setBottomWaist(w)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                          bottomWaist === w
                            ? 'bg-[#0D1B2A] text-[#F5CE62] border-[#0D1B2A]'
                            : 'bg-[#FAF8F5] text-stone-700 border-stone-200'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D1B2A] mb-1.5">
                    Preferred Tailoring Fit
                  </label>
                  <select
                    value={fitStyle}
                    onChange={(e) =>
                      setFitStyle(e.target.value as typeof fitStyle)
                    }
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold"
                  >
                    <option value="Regular Fit">Regular Fit</option>
                    <option value="Slim Tailored">Slim Tailored</option>
                    <option value="Relaxed Comfort">Relaxed Comfort</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateCustomer({
                    ...currentCustomer,
                    fitPreferences: {
                      topSize,
                      bottomWaist,
                      fitStyle,
                      favoriteColors: favColors,
                    },
                  })
                }
                className="bg-[#0D1B2A] text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
              >
                Save My Fit Vault to Database
              </button>
            </div>
          )}

          {/* 3. PERSONAL PROFILE, ADDRESSES & PASSWORD */}
          {(profileSection === 'profile' ||
            profileSection === 'addresses' ||
            profileSection === 'password') && (
            <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 sm:p-8 space-y-6">
              <h2 className="font-serif font-bold text-xl text-[#0D1B2A]">
                Personal Details &amp; Horanda Alias Ramgarh (822110) Address
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateCustomer({
                    ...currentCustomer,
                    name: editName.trim() || currentCustomer.name,
                    email: editEmail.trim() || currentCustomer.email,
                    mobile: editMobile.trim() || currentCustomer.mobile,
                    whatsapp: editMobile.trim() || currentCustomer.whatsapp,
                    address: {
                      ...currentCustomer.address,
                      fullAddress:
                        editAddress.trim() ||
                        currentCustomer.address.fullAddress,
                      pinCode: editPin.trim() || '822110',
                    },
                  });
                  setNewPass('');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                      Mobile &amp; WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                      PIN Code (Horanda Alias Ramgarh)
                    </label>
                    <input
                      type="text"
                      value={editPin}
                      onChange={(e) => setEditPin(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-mono-num font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                    Primary Delivery Address (Horanda Alias Ramgarh, Palamu, Jharkhand - 822110)
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                    Update Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0D1B2A] text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
                >
                  Save Profile to Database
                </button>
              </form>

              {/* Multiple Saved Addresses */}
              <div className="border-t border-stone-100 pt-5 space-y-3">
                <h3 className="font-serif font-bold text-base text-[#0D1B2A]">
                  Saved Delivery Addresses in Horanda (822110)
                </h3>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={addrLabel}
                    onChange={(e) =>
                      setAddrLabel(
                        e.target.value as SavedDeliveryAddress['label']
                      )
                    }
                    className="bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="Home">Home</option>
                    <option value="Shop">Shop</option>
                    <option value="Work">Work</option>
                  </select>
                  <input
                    type="text"
                    value={addrLine}
                    onChange={(e) => setAddrLine(e.target.value)}
                    placeholder="Add another landmark / house address in Horanda 822110..."
                    className="flex-1 bg-[#FAF8F5] border border-stone-200 rounded-xl px-3.5 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!addrLine.trim()) return;
                      const nextList: SavedDeliveryAddress[] = [
                        ...(currentCustomer.savedAddresses || []),
                        {
                          id: `addr-${Date.now()}`,
                          label: addrLabel,
                          recipientName: currentCustomer.name,
                          mobile: currentCustomer.mobile,
                          fullAddress: addrLine.trim(),
                          villageArea: 'Horanda Alias Ramgarh',
                          district: 'Palamu',
                          state: 'Jharkhand',
                          pinCode: '822110',
                        },
                      ];
                      onUpdateCustomer({
                        ...currentCustomer,
                        savedAddresses: nextList,
                      });
                      setAddrLine('');
                    }}
                    className="bg-[#0D1B2A] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    + Add Address
                  </button>
                </div>

                {(currentCustomer.savedAddresses || []).map((ad) => (
                  <div
                    key={ad.id}
                    className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="bg-[#0D1B2A] text-[#F5CE62] text-[10px] font-bold px-2 py-0.5 rounded mr-2">
                        {ad.label}
                      </span>
                      <strong>{ad.fullAddress}</strong>, {ad.villageArea} -{' '}
                      {ad.pinCode}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateCustomer({
                          ...currentCustomer,
                          savedAddresses: (
                            currentCustomer.savedAddresses || []
                          ).filter((x) => x.id !== ad.id),
                        })
                      }
                      className="text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MY ORDERS & INVOICE BILLS LIST */}
          <div className="bg-white rounded-3xl border border-[#E6E1D6] p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif font-bold text-xl text-[#0D1B2A]">
                My Orders &amp; Digital Receipts ({customerOrders.length})
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    'All',
                    'Processing',
                    'Shipped',
                    'Delivered',
                    'Cancelled',
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setOrderFilterTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      orderFilterTab === tab
                        ? 'bg-[#0D1B2A] text-white'
                        : 'bg-[#FAF8F5] text-stone-600'
                    }`}
                  >
                    {tab === 'All' ? 'All Orders' : tab}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <p className="text-xs text-stone-500 py-4">
                No orders found under this filter.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E6E1D6] flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-num font-extrabold text-sm text-[#0D1B2A]">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-xs text-stone-400">
                          • Placed on {ord.timestamp}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-stone-700">
                        {ord.productTitle} (Size: {ord.size}, {ord.shade})
                      </div>
                      <div className="font-mono-num font-bold text-xs text-[#0D1B2A]">
                        Total: ₹{ord.amount.toLocaleString('en-IN')} • Cash on
                        Delivery (FREE Shipping)
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          ord.status === 'Delivered'
                            ? 'bg-[#D1FAE5] text-[#065F46]'
                            : ord.status === 'Cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-[#FEF3C7] text-[#B45309]'
                        }`}
                      >
                        {ord.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => setShowInvoiceModal(ord)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-bold text-[#0D1B2A] hover:border-[#0D1B2A] flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>Bill</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedOrderDetail(ord)}
                        className="px-3 py-1.5 rounded-xl bg-[#0D1B2A] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Track</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Order Invoice Receipt Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6E1D6] space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <ReyazLogo size="sm" />
              <div className="text-right">
                <div className="text-xs font-extrabold uppercase text-[#B8860B]">
                  OFFICIAL COD INVOICE
                </div>
                <div className="font-mono-num text-sm font-bold text-[#0D1B2A]">
                  #{showInvoiceModal.orderNumber}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-stone-400 uppercase font-bold text-[10px]">
                  Billed To
                </div>
                <div className="font-bold text-[#0D1B2A]">
                  {showInvoiceModal.customerName}
                </div>
                <div className="text-stone-600">
                  +91 {showInvoiceModal.customerPhone}
                </div>
                <div className="text-stone-600">
                  {showInvoiceModal.fullAddress}, {showInvoiceModal.villageArea}{' '}
                  - {showInvoiceModal.pinCode}
                </div>
              </div>
              <div className="text-right">
                <div className="text-stone-400 uppercase font-bold text-[10px]">
                  Store Hub
                </div>
                <div className="font-bold text-[#0D1B2A]">
                  Reyaz Shopping Center
                </div>
                <div className="text-stone-600">
                  Horanda Alias Ramgarh - 822110
                </div>
                <div className="text-stone-600">
                  Ph: +91 {storeSettings.whatsappPrimary}
                </div>
              </div>
            </div>

            <div className="border-y border-stone-200 py-3 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-[#0D1B2A]">
                <span>
                  {showInvoiceModal.productTitle} ({showInvoiceModal.size},{' '}
                  {showInvoiceModal.shade}) × {showInvoiceModal.quantity}
                </span>
                <span className="font-mono-num">
                  ₹{showInvoiceModal.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery Charge (Horanda 822110)</span>
                <span className="font-bold text-[#15803D]">FREE (₹0)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500">
                Total Cash on Delivery Payable
              </span>
              <span className="font-mono-num text-2xl font-extrabold text-[#0D1B2A]">
                ₹{showInvoiceModal.amount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-[#0D1B2A] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#F5CE62]" /> Print Bill
              </button>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(null)}
                className="bg-stone-100 text-stone-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= HIDDEN 4-CLICK MANAGEMENT LOGIN MODAL (SUPER ADMIN & SELLER) =================
interface HiddenManagementLoginModalProps {
  sellers: SellerAccount[];
  onClose: () => void;
  onSuccessManagementLogin: (account: {
    id?: string;
    email: string;
    name: string;
    role: 'super_admin' | 'seller';
    department?: string;
  }) => void;
}

export const HiddenManagementLoginModal: React.FC<
  HiddenManagementLoginModalProps
> = ({ sellers, onClose, onSuccessManagementLogin }) => {
  const [roleTab, setRoleTab] = useState<'super_admin' | 'seller'>('super_admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
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
          email,
          password,
          role: roleTab,
          sellers,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setErrorMsg(data.error || 'Authentication failed');
      } else if (data.success && data.account) {
        onSuccessManagementLogin(data.account);
      }
    } catch {
      setErrorMsg('Unable to reach authentication server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAdmin = async () => {
    setErrorMsg(null);
    try {
      const res = await signInWithGooglePopup();
      const emailLower = (res.user.email || '').toLowerCase();
      if (roleTab === 'seller') {
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
      }
      onSuccessManagementLogin({
        email: res.user.email || 'nasirhussain12489@gmail.com',
        name: res.user.displayName || 'Super Admin (Nasir Hussain)',
        role: 'super_admin',
      });
    } catch {
      setErrorMsg(
        'Google popup was closed or blocked in preview. Please sign in with your Gmail and password above.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden border border-[#E6E1D6] shadow-2xl">
        {/* Top Dark Navy Banner */}
        <div className="bg-[#0D1B2A] text-white p-6 flex items-center justify-between border-b border-[#D4AF37]/30">
          <ReyazLogo size="sm" theme="dark" />
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Role Switcher: Super Admin Login | Seller Login */}
          <div className="grid grid-cols-2 gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#E6E1D6] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setRoleTab('super_admin');
                setErrorMsg(null);
              }}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                roleTab === 'super_admin'
                  ? 'bg-[#0D1B2A] text-[#F5CE62] shadow-xs'
                  : 'text-stone-600'
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
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                roleTab === 'seller'
                  ? 'bg-[#0D1B2A] text-[#F5CE62] shadow-xs'
                  : 'text-stone-600'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Seller Login</span>
            </button>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                {roleTab === 'super_admin'
                  ? 'Super Admin Gmail'
                  : 'Seller Email or Mobile'}
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
                className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl px-3.5 py-2.5 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0D1B2A] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-[#FAF8F5] border border-[#E6E1D6] rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0D1B2A] hover:bg-[#1B263B] text-white font-bold text-xs py-3.5 rounded-xl cursor-pointer"
            >
              {isLoading
                ? 'Authenticating...'
                : roleTab === 'super_admin'
                ? 'Open Super Admin Dashboard'
                : 'Open Seller Portal Dashboard'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleGoogleAdmin}
            className="w-full bg-[#FAF8F5] hover:bg-stone-100 text-[#0D1B2A] border-2 border-[#D4AF37] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Cloud className="w-4 h-4 text-[#B8860B]" />
            Continue with Google ({roleTab === 'super_admin' ? 'Super Admin' : 'Seller'})
          </button>
        </div>
      </div>
    </div>
  );
};
