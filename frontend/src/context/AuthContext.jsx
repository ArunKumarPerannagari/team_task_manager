import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Determine API URL based on environment
  // If we are on localhost, use the VITE_API_URL (which usually points to the local backend)
  // Otherwise, use relative /api path (which is standard for production deployments)
  const API_BASE_URL = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

  useEffect(() => {
    console.log('AuthContext Initialization:');
    console.log(' - Hostname:', window.location.hostname);
    console.log(' - API Base URL:', API_BASE_URL);
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      setUser(response.data.data);
    } catch (error) {
      console.error('Fetch User Error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Login attempt at URL:', `${API_BASE_URL}/auth/login`);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      console.error('Login Error Object:', error);
      const message = error.response?.data?.message || 'The server could not be reached or returned an error.';
      toast.error(`Login Error: ${message}`);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      console.log('Signup attempt at URL:', `${API_BASE_URL}/auth/signup`);
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(newUser);
      toast.success(`Account created! Welcome, ${newUser.name}`);
      return true;
    } catch (error) {
      console.error('Signup Error Object:', error);
      const message = error.response?.data?.message || 'The server could not be reached or returned an error.';
      toast.error(`Signup Error: ${message}`);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/profile`, data);
      setUser(response.data.data);
      toast.success('Profile updated!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};
