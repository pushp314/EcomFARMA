import { Link } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'Marketplace', path: '/marketplace' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ],
    'For Farmers': [
      { name: 'Sell Your Produce', path: '/register?role=farmer' },
      { name: 'Farmer Dashboard', path: '/farmer/dashboard' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Success Stories', path: '/stories' },
    ],
    'For Customers': [
      { name: 'Browse Products', path: '/marketplace' },
      { name: 'My Orders', path: '/my-orders' },
      { name: 'Track Order', path: '/track' },
      { name: 'Help Center', path: '/help' },
    ],
  };

  const socials = [
    { icon: FaFacebookF, url: '#', label: 'Facebook' },
    { icon: FaTwitter, url: '#', label: 'Twitter' },
    { icon: FaInstagram, url: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, url: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -top-16">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary-900/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                  Ready to Go Organic?
                </h3>
                <p className="text-primary-100 mt-2 text-sm md:text-base">
                  Join thousands of farmers and customers building a sustainable food ecosystem.
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/register?role=farmer"
                  className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg text-sm"
                >
                  Start Selling
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-primary-800/50 text-white font-semibold rounded-xl border border-primary-400/30 hover:bg-primary-800 transition-all duration-200 text-sm"
                >
                  Start Buying
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <GiWheat className="text-white text-xl" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Ecom<span className="text-primary-400">Farma</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-sm">
              Bridging the gap between rural farmers and urban consumers. Fresh, organic produce delivered
              straight from the farm to your table.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <HiOutlineMail className="text-primary-500" />
                <span>hello@ecomfarma.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <HiOutlinePhone className="text-primary-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <HiOutlineLocationMarker className="text-primary-500" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} EcomFarma. All rights reserved. Made with 🌱 for rural India.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, url, label }) => (
              <a
                key={label}
                href={url}
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
              >
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
