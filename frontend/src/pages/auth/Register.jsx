import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiWheat } from 'react-icons/gi';
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlinePhone,
} from 'react-icons/hi';
import { FaTractor, FaShoppingBasket } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'customer';

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: defaultRole,
    farmName: '',
    farmDescription: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const { register, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill all required fields');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const submitData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      address: formData.address,
    };

    if (formData.role === 'farmer') {
      submitData.farmName = formData.farmName;
      submitData.farmDescription = formData.farmDescription;
    }

    const result = await register(submitData);
    if (result.success) {
      if (formData.role === 'farmer') {
        toast.success('Registration successful! Your farmer account is pending approval.');
      } else {
        toast.success('Welcome to EcomFarma! 🌾');
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-farm relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 left-10 w-80 h-80 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-64 h-64 bg-primary-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
              <GiWheat className="text-3xl text-primary-300" />
            </div>
            <span className="font-display font-bold text-2xl">EcomFarma</span>
          </Link>

          <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight">
            Join the
            <br />
            <span className="text-primary-300">Ecom-Farma</span>
            <br />
            Revolution
          </h1>
          <p className="mt-6 text-primary-200 leading-relaxed max-w-sm">
            Whether you're a farmer looking to sell your produce directly or a customer seeking the freshest
            products — we've got you covered.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="text-primary-300">✓</span>
              </div>
              <span className="text-sm text-primary-200">No middlemen — direct farm-to-table</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="text-primary-300">✓</span>
              </div>
              <span className="text-sm text-primary-200">Fair prices for farmers & customers</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="text-primary-300">✓</span>
              </div>
              <span className="text-sm text-primary-200">Location-based product discovery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Register Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-10 bg-cream overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <GiWheat className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">
              Ecom<span className="text-primary-600">Farma</span>
            </span>
          </div>

          <div className="mb-6">
            <h2 className="font-display text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 mt-1">Join thousands of farmers and customers.</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">I want to:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField('role', 'customer')}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                  formData.role === 'customer'
                    ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-100'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.role === 'customer' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <FaShoppingBasket className="text-xl" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${formData.role === 'customer' ? 'text-primary-700' : 'text-gray-700'}`}>
                    Buy Produce
                  </p>
                  <p className="text-xs text-gray-500">As a Customer</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateField('role', 'farmer')}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                  formData.role === 'farmer'
                    ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-100'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formData.role === 'farmer' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <FaTractor className="text-xl" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${formData.role === 'farmer' ? 'text-primary-700' : 'text-gray-700'}`}>
                    Sell Produce
                  </p>
                  <p className="text-xs text-gray-500">As a Farmer</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`} />
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-semibold text-gray-800">Basic Information</h3>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="John Doe"
                      className="input-field pl-11"
                      id="register-name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="you@example.com"
                      className="input-field pl-11"
                      id="register-email"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="input-field pl-11"
                      id="register-phone"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      placeholder="Min 6 characters"
                      className="input-field pl-11 pr-12"
                      id="register-password"
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      placeholder="Re-enter password"
                      className="input-field pl-11"
                      id="register-confirm-password"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary w-full py-3.5 text-base mt-2"
                >
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    {formData.role === 'farmer' ? 'Farm & Address Details' : 'Address Details'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-primary-600 font-semibold hover:text-primary-700"
                  >
                    ← Back
                  </button>
                </div>

                {/* Farmer-specific fields */}
                {formData.role === 'farmer' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Farm Name *
                      </label>
                      <input
                        type="text"
                        value={formData.farmName}
                        onChange={(e) => updateField('farmName', e.target.value)}
                        placeholder="Green Valley Farms"
                        className="input-field"
                        id="register-farm-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Farm Description
                      </label>
                      <textarea
                        value={formData.farmDescription}
                        onChange={(e) => updateField('farmDescription', e.target.value)}
                        placeholder="Tell us about your farm..."
                        className="input-field resize-none h-20"
                        id="register-farm-desc"
                      />
                    </div>
                  </>
                )}

                {/* Address fields */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => updateAddress('street', e.target.value)}
                    placeholder="123 Main Street"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => updateAddress('city', e.target.value)}
                      placeholder="Mumbai"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => updateAddress('state', e.target.value)}
                      placeholder="Maharashtra"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.address.pincode}
                    onChange={(e) => updateAddress('pincode', e.target.value)}
                    placeholder="400001"
                    className="input-field"
                  />
                </div>

                {formData.role === 'farmer' && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <p className="text-xs text-amber-700">
                      ⚠️ Farmer accounts require admin approval before you can start selling.
                      You&apos;ll be notified once approved.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-3.5 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  id="register-submit"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
