import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
        <p className="text-slate-500 mt-1">Please enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input pl-10"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input pl-10"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">Remember me</label>
          </div>
          <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-500">Forgot password?</a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full py-3 text-base shadow-lg shadow-primary-200 group"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
            </>
          )}
        </button>
      </form>

      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-400">New to TaskManager?</span>
        </div>
      </div>

      <div className="mt-6">
        <Link
          to="/signup"
          className="btn btn-secondary w-full py-3 text-base hover:bg-slate-50 border-slate-200 text-slate-700"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;
