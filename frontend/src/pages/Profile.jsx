import React, { useState, useEffect } from 'react';
import { FiUser, FiLogOut, FiEdit2, FiCheck, FiCamera, FiUsers, FiBook, FiShoppingBag, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api/API.js';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfileData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '', 
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchProfileData();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  // Analytics data summarizing the app usage
  const analytics = [
    { id: 1, label: 'Total Personas', value: '4', icon: <FiUsers size={18} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 2, label: 'Saved Recipes', value: '28', icon: <FiBook size={18} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 3, label: 'Pantry Items', value: '45', icon: <FiShoppingBag size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 4, label: 'Cooking Hours', value: '112', icon: <FiClock size={18} />, color: 'text-orange-400', bg: 'bg-orange-500/10' }
  ];

  const handleSave = async () => {
    const toastId = toast.loading("Updating profile...");
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!", { id: toastId });
        updateUser({ firstName: data.user.firstName, lastName: data.user.lastName, email: data.user.email });
        setIsEditing(false);
      } else {
        toast.error(data.error || "Failed to update profile", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error. Please try again.", { id: toastId });
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="h-full w-full text-white font-sans relative overflow-hidden flex flex-col">
      
      {/* Global Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Honesti 3D Avatar.jfif" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover object-[center_15%] opacity-50 blur-[3px] scale-110 pointer-events-none"
        />
        <div className="absolute inset-0 bg-[#0b0f19]/80 backdrop-blur-md pointer-events-none"></div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar px-3 py-4 md:p-8">
        
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-row justify-between items-center mb-5 md:mb-8 border-b border-white/10 pb-4 md:pb-5 gap-2 md:gap-4">
            <div className="min-w-0">
              <h1 className="text-[24px] md:text-[28px] font-bold tracking-tight mb-0.5 md:mb-1.5 drop-shadow-md truncate">My Profile</h1>
              <p className="text-gray-400 md:text-gray-300 text-[14px] md:text-[12px] font-medium drop-shadow-sm truncate">Manage Your Personal Information</p>
            </div>
            
            <button 
              onClick={toggleEdit}
              className={`cursor-pointer px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-[14px] md:text-[14px] font-bold transition-colors flex items-center gap-1.5 md:gap-2 shrink-0 ${isEditing ? 'bg-[#0077ff] text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              {isEditing ? <><FiCheck className="text-[14px] md:text-[16px]"/> Update</> : <><FiEdit2 className="text-[14px] md:text-[16px]"/> Edit Profile</>}
            </button>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
            {analytics.map((stat) => (
              <div 
                key={stat.id}
                className="bg-[#0f1523]/80 backdrop-blur-lg border border-white/10 rounded-xl p-2.5 md:p-5 flex flex-row items-center md:items-start gap-2.5 md:gap-4 text-left"
              >
                <div className={`w-7 h-7 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                  <div className="scale-[0.8] md:scale-100">{stat.icon}</div>
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] md:text-[11px] font-bold text-gray-400 tracking-wider mb-0 md:mb-0.5 truncate">{stat.label}</p>
                  <p className="text-[16px] md:text-xl font-bold text-white leading-tight truncate">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Layout */}
          <div className="w-full">
            
            {/* Details Form */}
            <div className="w-full">
              <div className="bg-[#0f1523]/80 backdrop-blur-lg border border-white/10 rounded-xl p-4 md:p-6 h-full relative">
                
                {isLoading && (
                  <div className="absolute inset-0 z-20 bg-[#0f1523]/50 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#0077ff] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs font-bold text-gray-300">Loading Profile...</span>
                  </div>
                )}

                <h3 className="text-[16px] md:text-sm font-bold tracking-wider text-gray-400 mb-4 md:mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                  <FiUser className="text-[#0077ff]" /> Personal Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-[14px] md:text-[11px] font-bold text-gray-400 tracking-wider mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-lg px-4 py-2.5 text-[16px] md:text-[13px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] md:text-[11px] font-bold text-gray-400 tracking-wider mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-lg px-4 py-2.5 text-[16px] md:text-[13px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] md:text-[11px] font-bold text-gray-400 tracking-wider mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      disabled={true}
                      className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-[16px] md:text-[13px] font-bold text-gray-400 focus:outline-none transition-colors opacity-70 cursor-not-allowed`}
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] md:text-[11px] font-bold text-gray-400 tracking-wider mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-lg px-4 py-2.5 text-[16px] md:text-[13px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
