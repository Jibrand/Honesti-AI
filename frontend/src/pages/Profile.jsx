import React, { useState, useEffect } from "react";
import { FiUser, FiLogOut, FiEdit2, FiCheck, FiCamera, FiUsers, FiBook, FiShoppingBag, FiClock } from 'react-icons/fi';
import { API_URL } from '../api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
    const cachedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const [profileData, setProfileData] = useState({
    firstName: cachedProfile.firstName || '',
    lastName: cachedProfile.lastName || '',
    email: cachedProfile.email || '',
    phone: cachedProfile.phone || '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const newData = { ...data, phone: '+1 (555) 123-4567' };
          setProfileData(newData);
          localStorage.setItem('userProfile', JSON.stringify(newData));
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ firstName: profileData.firstName, lastName: profileData.lastName, email: profileData.email })
      });
      if (res.ok) {
        setIsEditing(false);
        const updatedData = { ...profileData, firstName: profileData.firstName, lastName: profileData.lastName, email: profileData.email };
        localStorage.setItem('userProfile', JSON.stringify(updatedData));
        window.dispatchEvent(new Event('profileUpdated'));
      }
    } catch (error) {
      console.error(error);
    }
  };


  // Analytics data summarizing the app usage
  const analytics = [
    { id: 1, label: 'Total Personas', value: '4', icon: <FiUsers size={18} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 2, label: 'Saved Recipes', value: '28', icon: <FiBook size={18} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 3, label: 'Pantry Items', value: '45', icon: <FiShoppingBag size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 4, label: 'Cooking Hours', value: '112', icon: <FiClock size={18} />, color: 'text-orange-400', bg: 'bg-orange-500/10' }
  ];

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('userProfile'); navigate('/login'); };

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

      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5 md:mb-8 border-b border-white/10 pb-4 md:pb-5 gap-4 md:gap-4">
            <div>
              <h1 className="text-xl md:text-[28px] font-bold tracking-tight mb-0.5 md:mb-5 drop-shadow-md">My Profile</h1>
              <p className="text-gray-300 text-base md:text-base font-medium drop-shadow-sm">Manage Your Personal Information</p>
            </div>
            
            <button 
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              className={`cursor-pointer px-5 md:px-5 py-2 md:py-2.5 rounded-md md:rounded-lg text-[15px] md:text-base font-bold transition-colors flex items-center gap-3 md:gap-4 ${isEditing ? 'bg-[#0077ff] text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              {isEditing ? <><FiCheck size={12} className="md:w-5 md:h-5"/> Save Changes</> : <><FiEdit2 size={12} className="md:w-5 md:h-5"/> Edit Profile</>}
            </button>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
            {analytics.map((stat) => (
              <div 
                key={stat.id}
                className="bg-[#0f1523]/80 backdrop-blur-lg border border-white/10 rounded-lg md:rounded-xl p-2.5 md:p-5 flex items-center gap-2 md:gap-4"
              >
                <div className={`w-7 h-7 md:w-10 md:h-10 shrink-0 rounded-md md:rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] md:text-sm font-bold text-gray-400 tracking-wide mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{stat.label}</p>
                  <p className="text-sm md:text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 gap-5 md:gap-6">
            
            {/* Details Form */}
            <div className="md:col-span-1">
              <div className="bg-[#0f1523]/80 backdrop-blur-lg border border-white/10 rounded-xl p-5 md:p-6 h-full">
                <h3 className="text-[15px] md:text-sm font-bold tracking-wider text-gray-400 mb-5 md:mb-6 border-b border-white/10 pb-2 md:pb-3 flex items-center gap-2">
                  <FiUser className="text-[#0077ff] w-4 h-4 md:w-4 md:h-4" /> Personal Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-5">
                  <div>
                    <label className="block text-base md:text-base font-bold text-gray-400 tracking-wider mb-5 md:mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={profileData.firstName || ''}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-md md:rounded-lg px-4 md:px-4 py-2 md:py-2.5 text-[15px] md:text-[15px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
                    />
                  </div>

                  <div>
                    <label className="block text-base md:text-base font-bold text-gray-400 tracking-wider mb-5 md:mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={profileData.lastName || ''}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-md md:rounded-lg px-4 md:px-4 py-2 md:py-2.5 text-[15px] md:text-[15px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
                    />
                  </div>

                  <div>
                    <label className="block text-base md:text-base font-bold text-gray-400 tracking-wider mb-5 md:mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-md md:rounded-lg px-4 md:px-4 py-2 md:py-2.5 text-[15px] md:text-[15px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
                    />
                  </div>
                  <div>
                    <label className="block text-base md:text-base font-bold text-gray-400 tracking-wider mb-5 md:mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-md md:rounded-lg px-4 md:px-4 py-2 md:py-2.5 text-[15px] md:text-[15px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
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
