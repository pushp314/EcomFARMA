import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineViewGrid,
  HiOutlineCog,
  HiOutlineChartBar,
  HiOutlineHeart,
  HiHeart,
  HiOutlineGlobeAlt
} from 'react-icons/hi';
import { GiWheat } from 'react-icons/gi';

const Navbar = () => {
  const { user, isAuthenticated, isFarmer, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isNavbarLight = !scrolled && isHomePage;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'About', path: '/about' },
  ];

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isFarmer) return '/farmer/dashboard';
    return '/my-orders';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHomePage
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-105">
              <GiWheat className="text-white text-xl" />
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-bold text-lg leading-tight transition-colors duration-300 ${isNavbarLight ? 'text-white' : 'text-gray-900'}`}>
                Ecom<span className={isNavbarLight ? 'text-primary-300' : 'text-primary-600'}>Farma</span>
              </span>
              <span className={`text-[10px] font-medium tracking-wider uppercase -mt-0.5 transition-colors duration-300 ${isNavbarLight ? 'text-primary-100' : 'text-gray-500'}`}>
                India's Fresh Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? (isNavbarLight ? 'text-primary-900 bg-white shadow-md' : 'text-primary-700 bg-primary-50')
                    : (isNavbarLight ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50')
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Wishlist Icon */}
            {!isAdmin && !isFarmer && (
              <Link
                to="/wishlist"
                className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                  isNavbarLight 
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-rose-600 hover:bg-rose-50' 
                }`}
              >
                {wishlist.length > 0 ? <HiHeart className="text-xl text-rose-500" /> : <HiOutlineHeart className="text-xl" />}
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart (for guests and customers) */}
            {!isFarmer && !isAdmin && (
              <Link
                to="/cart"
                className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                  isNavbarLight 
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50' 
                }`}
              >
                <HiOutlineShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Language Selection */}
            <button
              className={`p-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                isNavbarLight 
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50' 
              }`}
              title="Change Language"
            >
              <HiOutlineGlobeAlt className="text-xl" />
              <span className="text-[10px] font-bold uppercase tracking-wider">EN</span>
            </button>

            {isAuthenticated ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                  >
                    <img
                      src={user?.avatar?.url}
                      alt={user?.name}
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-primary-100"
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">
                        {user?.name?.split(' ')[0]}
                      </p>
                      <p className="text-[10px] text-primary-600 font-medium capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <Link
                        to={getDashboardLink()}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <HiOutlineViewGrid className="text-lg" />
                        Dashboard
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        >
                          <HiOutlineChartBar className="text-lg" />
                          Admin Panel
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                      >
                        <HiOutlineCog className="text-lg" />
                        Settings
                      </Link>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <HiOutlineLogout className="text-lg" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-5 py-2.5 text-sm font-semibold transition-colors ${
                    isNavbarLight ? 'text-white hover:text-primary-200' : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  Sign In
                </Link>
                <Link to="/register" className={`btn-primary text-sm ${isNavbarLight && 'bg-white text-primary-700 hover:bg-primary-50 shadow-lg'}`}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions & Toggle */}
          <div className="flex lg:hidden items-center gap-1">
            {!isFarmer && !isAdmin && (
              <Link
                to="/cart"
                className={`relative p-2 rounded-xl transition-all ${
                  isNavbarLight ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <HiOutlineShoppingCart className="text-[22px]" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              className={`p-2 rounded-xl transition-all ${
                isNavbarLight ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl animate-slide-up">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="btn-secondary flex-1 text-center text-sm">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary flex-1 text-center text-sm">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
