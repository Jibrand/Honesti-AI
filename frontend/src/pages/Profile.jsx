import React, { useState } from 'react';
import { FiUser, FiLogOut, FiEdit2, FiCheck, FiCamera, FiUsers, FiBook, FiShoppingBag, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: 'Maya',
    lastName: 'V',
    email: 'maya@household.com',
    phone: '+1 (555) 123-4567',
  });

  // Analytics data summarizing the app usage
  const analytics = [
    { id: 1, label: 'totalPersonas', value: '4', icon: <FiUsers size={18} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 2, label: 'savedRecipes', value: '28', icon: <FiBook size={18} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 3, label: 'pantryItems', value: '45', icon: <FiShoppingBag size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 4, label: 'cookingHours', value: '112', icon: <FiClock size={18} />, color: 'text-orange-400', bg: 'bg-orange-500/10' }
  ];

  const handleLogout = () => {
    navigate('/login');
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

      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8">
        
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-white/10 pb-5 gap-4">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight mb-1.5 drop-shadow-md">myProfile</h1>
              <p className="text-gray-300 text-[12px] font-medium drop-shadow-sm">manageYourPersonalInformation</p>
            </div>
            
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`cursor-pointer px-5 py-2.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-2 ${isEditing ? 'bg-[#0077ff] text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              {isEditing ? <><FiCheck size={14}/> saveChanges</> : <><FiEdit2 size={14}/> editProfile</>}
            </button>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {analytics.map((stat) => (
              <div 
                key={stat.id}
                className="bg-[#0f1523]/80 backdrop-blur-lg border border-white/10 rounded-xl p-5 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-0.5">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Avatar & Quick Actions */}
            <div className="md:col-span-1 flex flex-col gap-6">
              
              <div className="bg-[#0f1523]/80 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full bg-[#0077ff] flex items-center justify-center text-white font-bold text-2xl shadow-md border-2 border-white/10">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full text-black hover:bg-gray-200 transition-colors cursor-pointer shadow-md border border-gray-300">
                      <FiCamera size={14} />
                    </button>
                  )}
                </div>
                <h2 className="text-lg font-bold tracking-tight">{profileData.firstName} {profileData.lastName}</h2>
                <p className="text-[12px] text-gray-400 mb-6">{profileData.email}</p>
                
                <div className="w-full flex flex-col gap-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <FiLogOut size={14} /> logOut
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Details Form */}
            <div className="md:col-span-2">
              <div className="bg-[#0f1523]/80 backdrop-blur-lg border border-white/10 rounded-xl p-6 h-full">
                <h3 className="text-sm font-bold tracking-wider text-gray-400 mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                  <FiUser className="text-[#0077ff]" /> personalInformation
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 tracking-wider mb-2">firstName</label>
                    <input 
                      type="text" 
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-lg px-4 py-2.5 text-[13px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 tracking-wider mb-2">lastName</label>
                    <input 
                      type="text" 
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-lg px-4 py-2.5 text-[13px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 tracking-wider mb-2">emailAddress</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-lg px-4 py-2.5 text-[13px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 tracking-wider mb-2">phoneNumber</label>
                    <input 
                      type="tel" 
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full bg-black/20 border ${isEditing ? 'border-[#0077ff]' : 'border-white/10'} rounded-lg px-4 py-2.5 text-[13px] font-bold text-white focus:outline-none transition-colors disabled:opacity-70 disabled:text-gray-300`}
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
