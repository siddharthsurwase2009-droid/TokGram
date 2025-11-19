import React, { useState } from 'react';
import { X, Shield, DollarSign, Accessibility, Copyright as CopyrightIcon, ChevronRight, Moon, Volume2, FileText, Wallet, AlertCircle, Landmark, CreditCard, History, ArrowUpRight, TrendingUp, Lock, Users, Eye, EyeOff, Key, Smartphone, MessageSquare, AtSign, ShieldAlert, Award, CheckCircle2, Circle, Zap, Download } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

type SettingsTab = 'general' | 'monetization' | 'accessibility' | 'privacy' | 'copyright';

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  
  // Monetization State
  const [balance, setBalance] = useState(1240.50);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [upiId, setUpiId] = useState('');

  // Monetization Criteria State
  const [eligibility] = useState({
    followers: 1200000, // 1.2M from profile
    reqFollowers: 5000, // Updated to 5000
    views: 845000,
    reqViews: 1000000,
    posts: 12,
    reqPosts: 20,
    policyCompliant: true,
    ageVerified: true
  });

  // Privacy & Safety State
  const [isPrivate, setIsPrivate] = useState(false);
  const [isActivityStatusOn, setIsActivityStatusOn] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [hiddenWords, setHiddenWords] = useState(true);

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (amount > balance) {
      alert("Insufficient funds.");
      return;
    }

    let destination = '';
    if (paymentMethod === 'bank') {
        destination = 'Bank Account (**** 1234)';
    } else if (paymentMethod === 'paypal') {
        destination = 'PayPal';
    } else if (paymentMethod === 'upi') {
        if (!upiId.trim() || !upiId.includes('@')) {
            alert("Please enter a valid UPI ID (e.g., user@bank)");
            return;
        }
        destination = `UPI ID (${upiId})`;
    }

    // Simulate processing
    const confirmMsg = `Withdraw $${amount.toFixed(2)} to your ${destination}?`;
    if (window.confirm(confirmMsg)) {
      setBalance(prev => prev - amount);
      setWithdrawAmount('');
      setShowWithdraw(false);
      setUpiId('');
      alert("Withdrawal initiated! Funds should arrive in 2-3 business days.");
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick, value, colorClass = "text-gray-300" }: any) => (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl mb-2 cursor-pointer hover:bg-gray-800 transition border border-gray-800"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-800 rounded-lg">
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
        <span className="font-medium text-sm text-gray-200">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-gray-500">{value}</span>}
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </div>
    </div>
  );

  const ToggleItem = ({ label, description, isActive, onToggle }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
      <div className="pr-4">
        <h4 className="text-sm font-bold text-gray-200">{label}</h4>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button 
        onClick={onToggle}
        className={`w-11 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${isActive ? 'bg-neon' : 'bg-gray-700'}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isActive ? 'left-6' : 'left-1'}`}></div>
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'monetization':
        return (
          <div className="animate-in slide-in-from-right pb-10">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-green-900 to-gray-900 p-6 rounded-2xl border border-green-800/30 mb-6 relative overflow-hidden shadow-lg">
              <div className="absolute -top-4 -right-4 p-4 opacity-10 text-green-400">
                <DollarSign className="w-40 h-40" />
              </div>
              
              <div className="relative z-10">
                <h3 className="text-green-400 text-xs font-bold uppercase mb-1 flex items-center gap-1">
                  <Wallet className="w-3 h-3" /> Available Balance
                </h3>
                <div className="text-4xl font-bold text-white mb-6">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                
                {!showWithdraw ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowWithdraw(true)}
                      className="flex-1 bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Landmark className="w-4 h-4" /> Cash Out
                    </button>
                    <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors border border-gray-700">
                      Details
                    </button>
                  </div>
                ) : (
                  <div className="bg-black/40 p-4 rounded-xl backdrop-blur-sm border border-white/10 animate-in fade-in">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-sm">Withdraw Funds</h4>
                      <button onClick={() => setShowWithdraw(false)}><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Amount</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                          <input 
                            type="number" 
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-4 py-2 text-sm focus:border-green-500 focus:outline-none"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Payout Method</label>
                        <select 
                          value={paymentMethod} 
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                        >
                          <option value="bank">Bank Account ending in 1234</option>
                          <option value="paypal">PayPal (user@example.com)</option>
                          <option value="upi">UPI ID</option>
                        </select>
                      </div>

                      {paymentMethod === 'upi' && (
                        <div className="animate-in slide-in-from-top-2">
                            <label className="text-xs text-gray-400 mb-1 block">Enter UPI ID</label>
                            <input 
                                type="text" 
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="username@bank"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                            />
                        </div>
                      )}

                      <button 
                        onClick={handleWithdraw}
                        className="w-full bg-green-500 text-black font-bold py-2 rounded-lg hover:bg-green-400 transition"
                      >
                        Confirm Withdrawal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

             {/* Criteria / Next Level Tracker */}
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 px-1">Monetization Requirements</h3>
             <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-6 opacity-5 text-purple-500 pointer-events-none">
                    <Award className="w-24 h-24" />
                </div>
                <div className="flex items-start gap-4 mb-4 relative z-10">
                    <div className="p-2 bg-purple-500/20 rounded-full text-purple-400 shrink-0">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Creator Program Status</h4>
                        <p className="text-xs text-gray-400 mt-1">Meet 5,000 followers and 1M views to fully unlock monetization.</p>
                    </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4 relative z-10">
                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-gray-300 font-medium">Followers</span>
                            <span className="text-gray-500">{eligibility.followers.toLocaleString()} / {eligibility.reqFollowers.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((eligibility.followers/eligibility.reqFollowers)*100, 100)}%` }}></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-gray-300 font-medium">Video Views (30d)</span>
                            <span className="text-gray-500">{eligibility.views.toLocaleString()} / {eligibility.reqViews.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((eligibility.views/eligibility.reqViews)*100, 100)}%` }}></div>
                        </div>
                    </div>
                </div>
                
                {/* Checklist */}
                <div className="mt-5 space-y-3 border-t border-gray-800 pt-4 relative z-10">
                    <div className="flex items-center gap-3">
                        {eligibility.posts >= eligibility.reqPosts ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-gray-600" />}
                        <span className={`text-xs ${eligibility.posts >= eligibility.reqPosts ? 'text-gray-200' : 'text-gray-500'}`}>
                            Active poster ({eligibility.posts}/{eligibility.reqPosts} videos this month)
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {eligibility.ageVerified ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4 text-gray-600" />}
                        <span className="text-xs text-gray-200">15+ Age Verification</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {eligibility.policyCompliant ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                        <span className="text-xs text-gray-200">Adhere to Community Guidelines</span>
                    </div>
                </div>
                
                <button disabled className="w-full mt-5 bg-gray-800 text-gray-500 text-xs font-bold py-3 rounded-lg cursor-not-allowed border border-gray-700 flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" /> {eligibility.views >= eligibility.reqViews ? 'Application In Review' : 'Locked (Complete Requirements)'}
                </button>
             </div>

            {/* Revenue Chart (Simulated) */}
            <div className="mb-6">
               <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                  <span>Revenue Breakdown</span>
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Last 30 Days</span>
               </h3>
               <div className="flex items-end gap-2 h-24">
                  <div className="flex-1 flex flex-col gap-1">
                      <div className="flex-1 flex items-end rounded-t-md overflow-hidden bg-gray-800 relative group">
                          <div className="w-full bg-blue-500 h-[60%] relative group-hover:bg-blue-400 transition-all"></div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition">$640</div>
                      </div>
                      <span className="text-[10px] text-center text-gray-500">Ads</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                      <div className="flex-1 flex items-end rounded-t-md overflow-hidden bg-gray-800 relative group">
                          <div className="w-full bg-pink-500 h-[35%] relative group-hover:bg-pink-400 transition-all"></div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition">$320</div>
                      </div>
                      <span className="text-[10px] text-center text-gray-500">Gifts</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                      <div className="flex-1 flex items-end rounded-t-md overflow-hidden bg-gray-800 relative group">
                          <div className="w-full bg-purple-500 h-[25%] relative group-hover:bg-purple-400 transition-all"></div>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition">$280</div>
                      </div>
                      <span className="text-[10px] text-center text-gray-500">Subs</span>
                  </div>
               </div>
            </div>

            {/* Transaction History */}
            <div className="mb-6">
               <h3 className="text-sm font-bold text-white mb-3">Recent Activity</h3>
               <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-500/20 rounded-full text-pink-500">
                           <DollarSign className="w-4 h-4" />
                        </div>
                        <div>
                           <div className="text-xs font-bold text-white">Gift from @alex_dev</div>
                           <div className="text-[10px] text-gray-500">2 minutes ago</div>
                        </div>
                     </div>
                     <span className="text-sm font-bold text-green-400">+$5.00</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-full text-blue-500">
                           <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                           <div className="text-xs font-bold text-white">Ad Revenue Payout</div>
                           <div className="text-[10px] text-gray-500">Yesterday</div>
                        </div>
                     </div>
                     <span className="text-sm font-bold text-green-400">+$12.40</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl border border-gray-800">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-full text-gray-400">
                           <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <div>
                           <div className="text-xs font-bold text-white">Withdrawal to Bank</div>
                           <div className="text-[10px] text-gray-500">3 days ago</div>
                        </div>
                     </div>
                     <span className="text-sm font-bold text-gray-400">-$500.00</span>
                  </div>
               </div>
            </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 px-1">Monetization Tools</h3>
            <ToggleItem label="Ad Revenue Sharing" description="Earn from ads displayed on your reels." isActive={true} onToggle={()=>{}} />
            <ToggleItem label="Gifts" description="Allow viewers to send you virtual gifts." isActive={true} onToggle={()=>{}} />
            <ToggleItem label="Creator Marketplace" description="Get discovered by brands for sponsorships." isActive={true} onToggle={()=>{}} />
            
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-blue-900/30 transition">
               <CreditCard className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
               <div>
                  <h4 className="text-sm font-bold text-blue-200">Payment Methods</h4>
                  <p className="text-xs text-blue-300/70 mt-1">Manage your bank accounts, UPI and tax documents.</p>
               </div>
               <ChevronRight className="w-4 h-4 text-blue-400 ml-auto self-center" />
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="animate-in slide-in-from-right space-y-2">
            <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 mb-4">
              <p className="text-sm text-gray-300">
                Customize your viewing experience. These settings apply only to this device.
              </p>
            </div>
            <ToggleItem label="Captions" description="Auto-generate captions for video posts." isActive={true} onToggle={()=>{}} />
            <ToggleItem label="Reduce Motion" description="Minimize animation effects in UI." isActive={false} onToggle={()=>{}} />
            <ToggleItem label="High Contrast" description="Increase color contrast for better visibility." isActive={false} onToggle={()=>{}} />
            <ToggleItem label="Dark Mode" description="Always use dark theme." isActive={true} onToggle={()=>{}} />
            <ToggleItem label="Screen Reader Support" description="Optimize layout for screen readers." isActive={true} onToggle={()=>{}} />
          </div>
        );

      case 'copyright':
        return (
          <div className="animate-in slide-in-from-right">
             <div className="text-center py-6">
                <CopyrightIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Copyright & Rights</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  TokGram AI respects intellectual property. Ensure you have rights to the content you generate and post.
                </p>
             </div>

             <div className="space-y-2 mt-4">
               <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:bg-gray-800 transition cursor-pointer flex justify-between items-center">
                  <span className="text-sm font-medium">Music Usage Policy</span>
                  <FileText className="w-4 h-4 text-gray-500" />
               </div>
               <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:bg-gray-800 transition cursor-pointer flex justify-between items-center">
                  <span className="text-sm font-medium">AI Generation Rights</span>
                  <FileText className="w-4 h-4 text-gray-500" />
               </div>
               <div className="p-4 bg-red-900/10 rounded-xl border border-red-900/30 mt-6 flex items-center gap-3 cursor-pointer hover:bg-red-900/20">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-bold text-red-500">Report Copyright Infringement</span>
               </div>
             </div>
          </div>
        );

      case 'privacy':
        return (
           <div className="animate-in slide-in-from-right pb-8">
              <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-xl mb-6 flex gap-3">
                  <ShieldAlert className="w-6 h-6 text-blue-400 shrink-0" />
                  <div>
                      <h3 className="text-sm font-bold text-blue-100">Safety Center</h3>
                      <p className="text-xs text-blue-300/80 mt-1">Manage your account security and control who can interact with you.</p>
                  </div>
              </div>

              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 px-1">Account Privacy</h3>
              <ToggleItem 
                label="Private Account" 
                description="Only people you approve can see your photos and videos." 
                isActive={isPrivate} 
                onToggle={() => setIsPrivate(!isPrivate)} 
              />
              <ToggleItem 
                label="Activity Status" 
                description="Allow accounts you follow to see when you were last active." 
                isActive={isActivityStatusOn} 
                onToggle={() => setIsActivityStatusOn(!isActivityStatusOn)} 
              />

              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 mt-8 px-1">Security</h3>
              <ToggleItem 
                label="Two-Factor Authentication" 
                description="Add an extra layer of security to your account." 
                isActive={twoFactor} 
                onToggle={() => setTwoFactor(!twoFactor)} 
              />
              <MenuItem icon={Smartphone} label="Login Activity" value="San Francisco, CA" />
              <MenuItem icon={Key} label="Password" value="Last changed 3m ago" />

              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 mt-8 px-1">Interactions & Safety</h3>
              <ToggleItem 
                label="Hidden Words" 
                description="Hide comments containing offensive words or phrases." 
                isActive={hiddenWords} 
                onToggle={() => setHiddenWords(!hiddenWords)} 
              />
              <MenuItem icon={MessageSquare} label="Comments" value="Everyone" />
              <MenuItem icon={AtSign} label="Mentions & Tags" value="Everyone" />
              <MenuItem icon={Users} label="Restricted Accounts" value="0 users" />
              <MenuItem icon={EyeOff} label="Blocked Accounts" value="12 users" colorClass="text-red-400" />
           </div>
        );

      default: // General Menu
        return (
          <div className="space-y-1 animate-in slide-in-from-left">
             <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-4 rounded-xl border border-indigo-500/30 mb-4 flex items-center justify-between cursor-pointer hover:bg-indigo-900/30 transition" onClick={() => alert("Installing App...")}>
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500 p-2 rounded-lg text-white">
                        <Download className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Install App</h4>
                        <p className="text-xs text-indigo-200">Get the full experience</p>
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-300" />
             </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 px-1">Account</h3>
            <MenuItem icon={DollarSign} label="Monetization & Earnings" onClick={() => setActiveTab('monetization')} value={`$${balance.toLocaleString()}`} />
            <MenuItem icon={Shield} label="Privacy & Safety" onClick={() => setActiveTab('privacy')} />
            <MenuItem icon={Wallet} label="Orders & Payments" onClick={() => {}} />
            
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 mt-6 px-1">Content & Display</h3>
            <MenuItem icon={Accessibility} label="Accessibility" onClick={() => setActiveTab('accessibility')} />
            <MenuItem icon={Moon} label="Appearance" onClick={() => setActiveTab('accessibility')} value="Dark" />
            <MenuItem icon={Volume2} label="Sound Quality" onClick={() => {}} />

            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 mt-6 px-1">Support</h3>
            <MenuItem icon={CopyrightIcon} label="Copyright & Policies" onClick={() => setActiveTab('copyright')} />
            <MenuItem icon={AlertCircle} label="Report a Problem" onClick={() => {}} />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full sm:w-[450px] h-[85vh] sm:h-[750px] rounded-t-2xl sm:rounded-2xl flex flex-col border border-gray-800 relative shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-2">
             {activeTab !== 'general' && (
               <button onClick={() => setActiveTab('general')} className="mr-2 p-1 hover:bg-gray-800 rounded-full">
                 <ChevronRight className="w-5 h-5 rotate-180" />
               </button>
             )}
             <h2 className="text-lg font-bold capitalize">
               {activeTab === 'general' ? 'Settings' : activeTab}
             </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
           {renderContent()}
           
           {activeTab === 'general' && (
             <div className="mt-8 text-center pb-4">
               <p className="text-xs text-gray-600 mb-4">TokGram AI v1.3.0</p>
               <button className="text-red-500 text-sm font-bold py-3 w-full border border-gray-800 rounded-xl hover:bg-red-900/10 transition">
                 Log Out
               </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;