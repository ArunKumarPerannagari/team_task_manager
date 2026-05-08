import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await signup(formData);
    setIsSubmitting(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Create account</h1>
        <p className="text-slate-500 mt-1">Start managing your team effectively</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User size={18} />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input pl-10"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="input pl-10"
              placeholder="••••••••"
            />
          </div>
          <p className="mt-1 text-[10px] text-slate-400">Minimum 6 characters</p>
        </div>

        <div className="pt-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">I am an...</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'member' })}
              className={`py-2 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                formData.role === 'member'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
              }`}
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'admin' })}
              className={`py-2 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                formData.role === 'admin'
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full py-3 text-base shadow-lg shadow-primary-200 mt-2 group"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : (
            <>
              Sign Up
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Signup;
