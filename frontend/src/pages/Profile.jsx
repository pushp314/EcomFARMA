import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, uploadAPI } from '../api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth(); // login actually updates user state inside context if we pass new token/user but we might need a refresh logic. 
  // Wait, in AuthContext `login` takes token and sets it. `getMe` fetches user. Let's just reload page after update for simplicity or rely on getMe.

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    farmName: user?.farmName || '',
    bio: user?.bio || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.avatarUrl || '');
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
      let avatarUrl = user?.avatarUrl;

      // Handle avatar upload if new file is selected
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('image', selectedFile);
        const { data } = await uploadAPI.uploadImage(fileData);
        avatarUrl = data.url; 
      }

      // Structure data correctly for backend
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

      const res = await authAPI.updateProfile(updatePayload);
      
      toast.success('Profile updated successfully!');
      
      // Force reload to let AuthContext getMe pull latest user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12 text-white text-center relative">
          <h1 className="text-3xl font-display font-bold">Profile Settings</h1>
          <p className="opacity-90 mt-2">Update your personal information and address</p>
          
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="relative group cursor-pointer inline-block">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <img 
                  src={imagePreview || 'https://via.placeholder.com/150'} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-xs font-bold">Change</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
              </label>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="px-8 pt-20 pb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="input-field bg-gray-50 text-gray-500" value={formData.email} disabled />
              <span className="text-xs text-gray-400 mt-1 block">Email cannot be changed</span>
            </div>
            
            {user.role === 'farmer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                  <input type="text" className="input-field" value={formData.farmName} onChange={e => setFormData({...formData, farmName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farm Description / Bio</label>
                  <textarea rows="3" className="input-field py-3" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}></textarea>
                </div>
              </>
            )}

            {user.role === 'customer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-gray-800 mb-4">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input type="text" className="input-field" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" className="input-field" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" className="input-field" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input type="text" className="input-field" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="btn-primary px-8 py-3 w-full md:w-auto flex justify-center items-center gap-2">
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
