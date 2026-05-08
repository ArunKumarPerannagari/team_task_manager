import React from 'react';
import { Layout, LogOut, CheckSquare, Users, BarChart2, FolderKanban, User, Menu, X, Bell, Search } from 'lucide-react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/UI/Avatar';
import { useState } from 'react';
import { cn } from '../components/UI/LoadingSpinner';

const SidebarLink = ({ to, icon: Icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
        isActive
          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
          : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
      )
    }
  >
    <Icon size={20} className="transition-transform group-hover:scale-110" />
    <span className="font-medium">{children}</span>
  </NavLink>
);

const AppLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/projects')) return 'Projects';
    if (path.includes('/tasks')) return 'Tasks';
    if (path.includes('/team')) return 'Team Members';
    if (path.includes('/profile')) return 'My Profile';
    return 'Team Task Manager';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-xl text-white shadow-lg shadow-primary-200">
                <FolderKanban size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                TaskManager
              </span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            <SidebarLink to="/dashboard" icon={BarChart2} onClick={() => setIsSidebarOpen(false)}>
              Dashboard
            </SidebarLink>
            <SidebarLink to="/projects" icon={FolderKanban} onClick={() => setIsSidebarOpen(false)}>
              Projects
            </SidebarLink>
            <SidebarLink to="/tasks" icon={CheckSquare} onClick={() => setIsSidebarOpen(false)}>
              All Tasks
            </SidebarLink>
            {isAdmin && (
              <SidebarLink to="/team" icon={Users} onClick={() => setIsSidebarOpen(false)}>
                Team Members
              </SidebarLink>
            )}
            <div className="pt-4 pb-2 px-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</span>
            </div>
            <SidebarLink to="/profile" icon={User} onClick={() => setIsSidebarOpen(false)}>
              Profile Settings
            </SidebarLink>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 rounded-2xl mb-2">
              <Avatar src={user?.avatar} name={user?.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-48 lg:w-64"
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <Avatar src={user?.avatar} name={user?.name} className="cursor-pointer border-2 border-transparent hover:border-primary-500 transition-all" />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
