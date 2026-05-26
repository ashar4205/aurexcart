import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, CreditCard, Shield, Instagram, Facebook, Linkedin, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store';
import api from '../lib/api';
import toast from 'react-hot-toast';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const steps = [
  { id: 1, title: 'Store Info', subtitle: 'Name and description' },
  { id: 2, title: 'Verification', subtitle: 'CNIC & payout details' },
  { id: 3, title: 'Social Links', subtitle: 'Connect your profiles' },
];

export default function CreateStore() {
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    storeName: '',
    storeTagline: '',
    storeDescription: '',
    cnic: '',
    payoutMethod: 'easypaisa',
    payoutAccountNumber: '',
    socialLinks: { instagram: '', facebook: '', tiktok: '', linkedin: '' },
  });

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/create-store' }} />;
  if (user?.vendorStore) return <Navigate to="/vendor-dashboard" />;

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const updateSocial = (platform, value) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [platform]: value } }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await api.post('/vendors/create', form);
      toast.success('Store created! Pending admin approval.');
      updateUser({ vendorStore: data.vendor._id, role: 'vendor' });
      navigate('/vendor-dashboard');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(0,82,255,0.15)', border: '1px solid rgba(0,82,255,0.3)' }}>
            <Store size={24} style={{ color: '#00D1FF' }} />
          </div>
          <h1 className="section-title mb-2">Open Your Store</h1>
          <p className="section-subtitle">Sell your products to thousands of customers — completely free.</p>
          <div className="neon-track mt-4 w-32 mx-auto" />
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1" style={{ background: step >= s.id ? 'rgba(0,82,255,0.3)' : 'rgba(255,255,255,0.06)', border: `1px solid ${step >= s.id ? 'rgba(0,209,255,0.5)' : 'rgba(255,255,255,0.1)'}`, color: step >= s.id ? '#00D1FF' : 'rgba(255,255,255,0.3)' }}>
                  {s.id}
                </div>
                <p className={`text-xs font-medium ${step >= s.id ? 'text-white' : 'text-white/30'}`}>{s.title}</p>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-px mx-2" style={{ background: step > s.id ? 'rgba(0,209,255,0.4)' : 'rgba(255,255,255,0.06)' }} />}
            </React.Fragment>
          ))}
        </div>

        <motion.div className="glass-card p-7" style={{ border: '1px solid rgba(0,209,255,0.12)' }} key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold font-display text-white mb-2">Store Information</h3>
              <div>
                <label className="text-xs text-white/40 block mb-1.5 ml-1">Store Name *</label>
                <input className="input-glass" placeholder="My Awesome Store" value={form.storeName} onChange={e => update('storeName', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5 ml-1">Tagline</label>
                <input className="input-glass" placeholder="What your store is all about" value={form.storeTagline} onChange={e => update('storeTagline', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-white/40 block mb-1.5 ml-1">Description</label>
                <textarea rows={4} className="input-glass resize-none" placeholder="Tell customers about your store, what you sell, and your story..." value={form.storeDescription} onChange={e => update('storeDescription', e.target.value)} />
              </div>
              <button onClick={() => { if (!form.storeName.trim()) { toast.error('Store name is required'); return; } setStep(2); }} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                Next: Verification <ArrowRight size={15} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={15} style={{ color: '#00D1FF' }} />
                  <h3 className="font-semibold font-display text-white">Identity & Payout Verification</h3>
                </div>
                <p className="text-white/40 text-xs mb-5">Your information is encrypted and secure. Required for payouts.</p>
              </div>

              <div>
                <label className="text-xs text-white/40 block mb-1.5 ml-1">CNIC / National ID Number *</label>
                <div className="relative">
                  <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input className="input-glass pl-10" placeholder="XXXXX-XXXXXXX-X" value={form.cnic} onChange={e => update('cnic', e.target.value)} required />
                </div>
                <p className="text-white/25 text-xs mt-1 ml-1">Format: 13 digits (e.g. 42101-1234567-1)</p>
              </div>

              <div>
                <label className="text-xs text-white/40 block mb-1.5 ml-1">Payout Method *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['easypaisa', 'jazzcash', 'payoneer'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => update('payoutMethod', method)}
                      className="py-2.5 rounded-xl text-xs font-medium capitalize transition-all"
                      style={{
                        background: form.payoutMethod === method ? 'rgba(0,82,255,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.payoutMethod === method ? 'rgba(0,209,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        color: form.payoutMethod === method ? '#00D1FF' : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/40 block mb-1.5 ml-1">
                  {form.payoutMethod === 'payoneer' ? 'Payoneer Email / Account' : `${form.payoutMethod} Account Number`} *
                </label>
                <div className="relative">
                  <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input className="input-glass pl-10" placeholder="Account number or email" value={form.payoutAccountNumber} onChange={e => update('payoutAccountNumber', e.target.value)} required />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-glass flex-1 py-3">Back</button>
                <button onClick={() => { if (!form.cnic || !form.payoutAccountNumber) { toast.error('All fields required'); return; } setStep(3); }} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                  Next: Social Links <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold font-display text-white mb-1">Social Media Links</h3>
              <p className="text-white/40 text-xs mb-4">Optional — helps customers find and trust your store.</p>

              {[
                { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourhandle' },
                { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
                { key: 'tiktok', label: 'TikTok', icon: TikTokIcon, placeholder: 'https://tiktok.com/@yourhandle' },
                { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/yourprofile' },
              ].map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-white/40 block mb-1.5 ml-1">{label}</label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input className="input-glass pl-10" placeholder={placeholder} value={form.socialLinks[key]} onChange={e => updateSocial(key, e.target.value)} />
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl mt-2" style={{ background: 'rgba(0,82,255,0.08)', border: '1px solid rgba(0,82,255,0.2)' }}>
                <p className="text-xs text-white/50">Your store will be reviewed by our admin team before going live. This typically takes 1-24 hours.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="btn-glass flex-1 py-3">Back</button>
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 py-3">
                  {loading ? 'Creating...' : 'Launch Store'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
