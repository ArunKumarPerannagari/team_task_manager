import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
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
      // Assuming we have a /me endpoint or similar
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`);
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/signup`, userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(newUser);
      toast.success(`Account created! Welcome, ${newUser.name}`);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
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
      const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/profile`, data);
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
