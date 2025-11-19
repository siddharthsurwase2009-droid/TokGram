import React from 'react';
import { X, Shield, Lock, Eye, Bell } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  const SettingItem = ({ icon: Icon, title, value }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-200">{title}</span>
      </div>
      <span className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer hover:text-white">
        {value}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card w-full sm:w-[400px] h-[80vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl flex flex-col border border-gray-800 relative overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-neon" /> Privacy & Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Account Privacy</h3>
              <SettingItem icon={Lock} title="Private Account" value="Off" />
              <SettingItem icon={Eye} title="Activity Status" value="On" />
              <SettingItem icon={Bell} title="Push Notifications" value="All" />
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Data & Permissions</h3>
              <div className="bg-gray-900/50 rounded-lg p-4 text-xs text-gray-400 leading-relaxed border border-gray-800">
                <p className="mb-2">
                  <strong className="text-white">Data Usage:</strong> We use AI models (Gemini, Veo) to process your content. Your prompts are sent to Google's API for generation.
                </p>
                <p>
                  <strong className="text-white">Camera & Mic:</strong> Used only when creating content or using Live features. You can revoke these permissions in your browser settings.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">About</h3>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-300">Terms of Service</span>
                <span className="text-xs text-gray-500">v1.0.0</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-300">Community Guidelines</span>
              </div>
            </section>

             <button className="w-full mt-6 py-3 rounded-lg border border-red-900/50 text-red-500 text-sm font-bold hover:bg-red-900/10 transition">
                Log Out
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;