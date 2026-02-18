import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, LogIn, UserPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = '/api';

const AuthApp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    identifier: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin
        ? { identifier: formData.identifier, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);

      setMessage({ type: 'success', text: response.data.message });

      // Redirect logic
      setTimeout(() => {
        window.location.href = 'https://webmovies-two.vercel.app/';
      }, 2000);
    } catch (err) {
      console.error('Registration/Login error:', err);
      const errorMsg = err.response?.data?.error ||
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Network error: Cannot reach the server. Please check if the backend is running.' : 'Something went wrong. Please try again.');

      setMessage({
        type: 'error',
        text: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl z-10 relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Future'}
          </h2>
          <p className="text-white/40 text-sm italic">
            {isLogin ? 'Sign in to access your portal' : 'Create your production-ready account'}
          </p>
        </div>

        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${message.type === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
            >
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/80 transition-colors" size={18} />
                <input
                  type="text"
                  name="username"
                  placeholder="yourname"
                  required
                  className="glass-input w-full py-4 pl-12 pr-4 rounded-xl text-sm"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-1">
              {isLogin ? 'Email or Username' : 'Email Address'}
            </label>
            <div className="relative group">
              {isLogin ? <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/80 transition-colors" size={18} /> : <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/80 transition-colors" size={18} />}
              <input
                type={isLogin ? 'text' : 'email'}
                name={isLogin ? 'identifier' : 'email'}
                placeholder={isLogin ? 'name@example.com' : 'hello@world.com'}
                required
                className="glass-input w-full py-4 pl-12 pr-4 rounded-xl text-sm"
                value={isLogin ? formData.identifier : formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/80 transition-colors" size={18} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="glass-input w-full py-4 pl-12 pr-4 rounded-xl text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest shadow-xl hover:bg-neutral-200 transition-all active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? <LogIn size={18} /> : <UserPlus size={18} />)}
            {isLogin ? 'Authentication' : 'Registration'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-white/30">
            {isLogin ? "Don't have an account?" : "Already a member?"}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ type: '', text: '' });
            }}
            className="ml-2 text-white font-bold hover:underline underline-offset-4"
          >
            {isLogin ? 'Create Account' : 'Sign In Now'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthApp;
