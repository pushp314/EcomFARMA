import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiWheat } from 'react-icons/gi';
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated, error, clearError } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }
    setSubmitting(true);
    const result = await login(formData);
    if (result.success) {
      toast.success(`Welcome back, ${result.data.user.name}! 🌾`);
    }
    setSubmitting(false);
  };

  // Demo account quick-fill
  const fillDemo = (role) => {
    const accounts = {
      admin: { email: 'admin@farm.com', password: 'password123' },
      farmer: { email: 'farmer@farm.com', password: 'password123' },
      customer: { email: 'customer@farm.com', password: 'password123' },
    };
    setFormData(accounts[role]);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Illustration / Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-farm relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
              <GiWheat className="text-3xl text-primary-300" />
            </div>
            <span className="font-display font-bold text-2xl">EcomFarma</span>
          </div>

          <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight">
            {t('common.fresh_from')}
            <br />
            <span className="text-primary-300">{t('common.farm')}</span> {t('common.to_your')}
            <br />
            <span className="text-primary-300">{t('common.table')}</span>
          </h1>
          <p className="mt-6 text-lg text-primary-200 leading-relaxed max-w-md">
            {t('common.connecting')}
          </p>

          <div className="mt-10 flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-primary-300">{t('common.farmers')}</p>
            </div>
            <div className="w-px h-12 bg-primary-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-sm text-primary-300">{t('common.customers')}</p>
            </div>
            <div className="w-px h-12 bg-primary-700" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-sm text-primary-300">{t('common.orders')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-cream">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <GiWheat className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">
              Ecom<span className="text-primary-600">Farma</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-gray-900">{t('auth.login_title')}!</h2>
            <p className="text-gray-500 mt-2">{t('auth.sign_in_subtitle')}</p>
          </div>



          {/* Demo Account Quick Access */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {t('auth.quick_demo')}
            </p>
            <div className="flex gap-2">
              {['admin', 'farmer', 'customer'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg border-2 border-dashed border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-400 transition-all capitalize"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* End Demo Account Quick Access */}


          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('auth.email_address')}
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  id="login-email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-12"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">{t('auth.remember_me')}</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                {t('auth.forgot_password')}
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              id="login-submit"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('auth.signing_in')}
                </span>
              ) : (
                t('auth.login_button')
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              {t('auth.create_one_now')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
