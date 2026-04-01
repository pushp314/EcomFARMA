import { Link } from 'react-router-dom';
import {
  HiOutlineLocationMarker,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineCurrencyRupee,
  HiOutlineSearch,
  HiArrowRight,
} from 'react-icons/hi';
import { GiWheat, GiFruitBowl, GiCow, GiHoneyJar } from 'react-icons/gi';
import { FaTractor, FaSeedling, FaLeaf } from 'react-icons/fa';

const Home = () => {
  const categories = [
    { name: 'Vegetables', icon: FaSeedling, color: 'bg-green-100 text-green-600', count: '120+' },
    { name: 'Fruits', icon: GiFruitBowl, color: 'bg-orange-100 text-orange-600', count: '85+' },
    { name: 'Dairy', icon: GiCow, color: 'bg-blue-100 text-blue-600', count: '45+' },
    { name: 'Grains', icon: GiWheat, color: 'bg-amber-100 text-amber-600', count: '60+' },
    { name: 'Organic', icon: FaLeaf, color: 'bg-emerald-100 text-emerald-600', count: '200+' },
    { name: 'Honey & More', icon: GiHoneyJar, color: 'bg-yellow-100 text-yellow-600', count: '30+' },
  ];

  const features = [
    {
      icon: HiOutlineLocationMarker,
      title: 'Location-Based Discovery',
      desc: 'Find farmers near you and get the freshest produce delivered with minimal transport distance.',
      color: 'bg-primary-50 text-primary-600 border-primary-200',
    },
    {
      icon: HiOutlineTruck,
      title: 'Farm-Direct Delivery',
      desc: 'Produce goes directly from the farm to your doorstep. No warehouses, no middlemen.',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      icon: HiOutlineShieldCheck,
      title: 'Quality Assured',
      desc: 'Every farmer on our platform is verified. We ensure quality at every step.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      icon: HiOutlineCurrencyRupee,
      title: 'Fair Pricing',
      desc: 'Farmers earn more, customers pay less. Cutting out the middlemen makes it possible.',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Farmers', icon: FaTractor },
    { value: '10,000+', label: 'Happy Customers', icon: '😊' },
    { value: '50,000+', label: 'Orders Delivered', icon: HiOutlineTruck },
    { value: '₹2Cr+', label: 'Farmer Earnings', icon: HiOutlineCurrencyRupee },
  ];

  const testimonials = [
    {
      name: 'Rajesh Patel',
      role: 'Organic Farmer, Gujarat',
      text: 'FarmFresh has transformed my income. I now sell directly to customers and earn 40% more than before.',
      avatar: 'https://ui-avatars.com/api/?name=Rajesh+Patel&background=22c55e&color=fff',
    },
    {
      name: 'Anita Singh',
      role: 'Customer, Mumbai',
      text: 'The vegetables I get from FarmFresh are incredibly fresh. It feels like I have my own farm!',
      avatar: 'https://ui-avatars.com/api/?name=Anita+Singh&background=3b82f6&color=fff',
    },
    {
      name: 'Suresh Reddy',
      role: 'Dairy Farmer, Karnataka',
      text: 'Finally a platform that understands rural farmers. The process is simple and payments are instant.',
      avatar: 'https://ui-avatars.com/api/?name=Suresh+Reddy&background=f59e0b&color=fff',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-primary-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-6">
                <span className="w-2 h-2 bg-primary-400 rounded-full pulse-dot" />
                <span className="text-sm text-primary-200 font-medium">🌾 India's #1 Farm Marketplace</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1]">
                From the <span className="text-primary-300">Farm</span>
                <br />
                Straight to
                <br />
                Your <span className="text-primary-300">Table</span>
              </h1>
              <p className="mt-6 text-lg text-primary-200 leading-relaxed max-w-lg">
                Empowering rural farmers by connecting them directly with urban consumers.
                Fresh, organic produce — no middlemen, no markup.
              </p>

              {/* Search Bar */}
              <div className="mt-8 flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-2 max-w-lg">
                <HiOutlineSearch className="text-primary-300 text-xl ml-3" />
                <input
                  type="text"
                  placeholder="Search for fresh vegetables, fruits, dairy..."
                  className="flex-1 bg-transparent text-white placeholder:text-primary-300/60 px-4 py-3 outline-none text-sm"
                  id="hero-search"
                />
                <Link
                  to="/marketplace"
                  className="px-6 py-3 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/30"
                >
                  Search
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <Link to="/register?role=farmer" className="btn-primary py-3 px-7">
                  <FaTractor className="mr-2" />
                  Start Selling
                </Link>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 text-primary-200 hover:text-white font-semibold transition-colors group"
                >
                  Browse Products
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Side — Stats Cards */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 ${
                      i === 0 ? 'translate-y-4' : i === 3 ? 'translate-y-4' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                      {typeof stat.icon === 'string' ? (
                        <span className="text-2xl">{stat.icon}</span>
                      ) : (
                        <stat.icon className="text-xl text-primary-300" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-primary-300 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 38C672 46 768 62 864 65C960 68 1056 58 1152 50C1248 42 1344 36 1392 33L1440 30V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V60Z" fill="#FFFBF0" />
          </svg>
        </div>
      </section>

      {/* ===================== CATEGORIES ===================== */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              🛒 Shop by Category
            </span>
            <h2 className="section-title">
              Fresh From the <span className="gradient-text">Fields</span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">
              Browse our wide range of fresh farm products sourced directly from verified farmers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/marketplace?category=${cat.name.toLowerCase()}`}
                className="card p-6 text-center group hover:-translate-y-1 cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <cat.icon className="text-2xl" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.count} products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              ⚡ Why FarmFresh?
            </span>
            <h2 className="section-title">
              The <span className="gradient-text">Smarter</span> Way to Buy & Sell
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card p-6 group hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl border-2 ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-20 bg-gradient-earth">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-primary-700 rounded-full text-sm font-semibold mb-4 shadow-sm">
              🔄 How It Works
            </span>
            <h2 className="section-title">
              Simple Steps to <span className="gradient-text">Fresh Food</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Browse & Discover',
                desc: 'Search for fresh products near you. Filter by category, price, or distance from your location.',
                emoji: '🔍',
              },
              {
                step: '02',
                title: 'Order & Pay',
                desc: 'Add items to cart, choose your delivery option, and pay securely via UPI, cards, or net banking.',
                emoji: '🛒',
              },
              {
                step: '03',
                title: 'Fresh Delivery',
                desc: 'Get farm-fresh produce delivered to your doorstep. Track your order in real-time.',
                emoji: '🚚',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="card p-8 text-center h-full">
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-700 rounded-full font-bold text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              💬 What People Say
            </span>
            <h2 className="section-title">
              Trusted by <span className="gradient-text">Thousands</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FARMER CTA ===================== */}
      <section className="py-20 bg-gradient-farm relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-primary-200 rounded-full text-sm font-semibold mb-6 border border-white/10">
            <FaTractor />
            <span>For Farmers</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight">
            Grow Your Income,
            <br />
            <span className="text-primary-300">Not Just Crops</span>
          </h2>
          <p className="mt-6 text-primary-200 text-lg max-w-xl mx-auto">
            Join our platform and sell your produce directly to customers. Higher profits,
            transparent pricing, and a growing customer base.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register?role=farmer"
              className="px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl text-base"
            >
              Register as Farmer — It's Free
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-base"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
