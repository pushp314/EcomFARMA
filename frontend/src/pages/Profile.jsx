import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, uploadAPI } from '../api';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineCamera, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    farmName: user?.farmName || '',
    bio: user?.farmDescription || user?.bio || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.avatar?.url || '');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = user?.avatar?.url;

      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('image', selectedFile);
        const { data } = await uploadAPI.uploadImage(fileData);
        avatarUrl = data.url; 
      }

      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
        farmName: formData.farmName,
        farmDescription: formData.bio,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        avatarUrl: avatarUrl
      };

      await authAPI.updateProfile(updatePayload);
      toast.success('Identity profile synchronized!');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container-custom max-w-5xl">
        <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-fade-in">
          
          <div className="bg-primary-600 px-12 py-16 text-white relative">
             <div className="max-w-2xl">
                <h1 className="text-4xl font-display font-bold mb-2">Private Profile</h1>
                <p className="opacity-70 text-sm font-medium tracking-wide">Securely manage your personal credentials and logistics details</p>
             </div>
             <div className="absolute -bottom-16 left-12">
                <div className="relative group">
                   <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      <div className="w-full h-full rounded-[2rem] overflow-hidden bg-gray-100">
                         <img 
                          src={imagePreview || `https://ui-avatars.com/api/?name=${user.name}&background=16a34a&color=fff`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                         />
                      </div>
                   </div>
                   <label className="absolute bottom-1 -right-1 p-3 bg-white text-primary-600 rounded-2xl shadow-xl border border-gray-100 cursor-pointer hover:bg-primary-600 hover:text-white transition-all transform active:scale-90">
                      <HiOutlineCamera className="text-xl" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                   </label>
                </div>
             </div>
          </div>

          <form onSubmit={handleUpdate} className="px-12 pt-24 pb-12 space-y-12">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Column 1: Identity */}
                <div className="lg:col-span-1 space-y-6">
                   <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <HiOutlineUser className="text-primary-600" />
                      Legal Identity
                   </h3>
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Display Name</label>
                         <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500 text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Verified Email</label>
                         <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl text-sm text-gray-400 border border-gray-100">
                           <HiOutlineMail />
                           {formData.email}
                         </div>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                         <div className="relative">
                            <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input type="tel" className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Column 2: Specific Info (Farmer etc) */}
                <div className="lg:col-span-2 space-y-8">
                   {user.role === 'farmer' ? (
                     <div className="space-y-6">
                        <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-4">Merchant Credentials</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Farm Business Name</label>
                              <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500 text-sm" value={formData.farmName} onChange={e => setFormData({...formData, farmName: e.target.value})} />
                           </div>
                           <div className="md:col-span-2 space-y-1">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mission / Biography</label>
                              <textarea className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500 text-sm h-32" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="h-full flex flex-col justify-center bg-primary-50/50 p-8 rounded-[2rem] border border-primary-100 italic text-primary-600 text-sm text-center">
                        <span className="text-3xl mb-2 not-italic">🏘️</span>
                        "Freshly grown, ethically sourced. Your profile details help us deliver nature’s best directly to your doorstep."
                     </div>
                   )}

                   <div className="space-y-6">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4">
                         <HiOutlineLocationMarker className="text-primary-600" />
                         Shipping Hub & Logistics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Base Street Office / Home</label>
                            <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500 text-sm" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City Hub</label>
                            <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500 text-sm" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Region/State</label>
                               <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500 text-sm" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                               <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500 text-sm" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="pt-8 flex justify-end">
                <button type="submit" disabled={loading} className="w-full md:w-auto btn-primary py-4 px-12 rounded-2xl shadow-xl shadow-primary-500/20 font-bold tracking-wide flex items-center justify-center gap-3">
                   {loading ? (
                     <>
                       <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                       Synchronizing...
                     </>
                   ) : 'Sync Identity Profile'}
                </button>
             </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
