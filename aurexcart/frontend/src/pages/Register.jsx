import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store';
import { signInWithGoogle } from '../lib/firebase';
import api from '../lib/api';
import toast from 'react-hot-toast';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { name: form.name, email: form.email, password: form.password });
      setAuth(data.user, data.token);
      toast.success('Account created! Welcome to AurexCart.');
      navigate('/');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    try {
      const firebaseUser = await signInWithGoogle();
      const data = await api.post('/auth/firebase-login', { uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName, avatar: firebaseUser.photoURL });
      setAuth(data.user, data.token);
      toast.success('Welcome to AurexCart!');
      navigate('/');
    } catch (err) { toast.error(err.message || 'Google signup failed.'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="glass-card p-8" style={{ border: '1px solid rgba(0,209,255,0.12)' }}>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-display text-white mb-1">Create Account</h1>
            <p className="text-white/40 text-sm">Join AurexCart — browse, buy, and sell</p>
          </div>

          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-white mb-6 transition-all hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <GoogleIcon /> Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/25 text-xs">or with email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { field: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'Your full name', auto: 'name' },
              { field: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com', auto: 'email' },
            ].map(({ field, label, type, icon: Icon, placeholder, auto }) => (
              <div key={field}>
                <label className="block text-xs text-white/40 mb-1.5 ml-1">{label}</label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type={type} required autoComplete={auto} placeholder={placeholder} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="input-glass pl-10" />
                </div>
              </div>
            ))}

            {['password', 'confirmPassword'].map((field, i) => (
              <div key={field}>
                <label className="block text-xs text-white/40 mb-1.5 ml-1">{i === 0 ? 'Password' : 'Confirm Password'}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type={showPass ? 'text' : 'password'} required minLength={6} placeholder="••••••••" value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="input-glass pl-10 pr-10" />
                  {i === 0 && <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>}
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              <UserPlus size={16} />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00D1FF' }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
