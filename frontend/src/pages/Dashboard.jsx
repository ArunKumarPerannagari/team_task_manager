import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Activity, Download } from 'lucide-react';
import { dashboardService, taskService } from '../services';
import StatsCard from '../components/Dashboard/StatsCard';
import { TaskPieChart, UserBarChart } from '../components/Dashboard/Charts';
import Avatar from '../components/UI/Avatar';
import { formatDate } from '../utils/formatters';
import SkeletonLoader from '../components/UI/SkeletonLoader';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await taskService.getAll();
      const tasks = response.data.data;
      
      const headers = ['Title', 'Status', 'Priority', 'Assigned To', 'Project', 'Due Date'];
      const csvData = tasks.map(t => [
        t.title,
        t.status,
        t.priority,
        t.assignedTo?.name || 'Unassigned',
        t.project?.name || 'N/A',
        t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'
      ]);
      
      const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `team-tasks-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download report', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader className="h-[400px]" />
          <SkeletonLoader className="h-[400px]" />
        </div>
      </div>
    );
  }

  const statusData = stats?.tasksByStatus.map(s => ({
    _id: s._id,
    count: s.count
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-['Outfit',sans-serif]">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
        </div>
        <button 
          onClick={downloadReport}
          className="btn btn-primary shadow-lg shadow-primary-100 px-6 gap-2"
        >
          <Download size={18} />
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={ListTodo}
          variant="primary"
          trend="up"
          trendValue="12%"
        />
        <StatsCard
          title="Completed"
          value={stats?.tasksByStatus.find(s => s._id === 'Done')?.count || 0}
          icon={CheckCircle2}
          variant="success"
        />
        <StatsCard
          title="In Progress"
          value={stats?.tasksByStatus.find(s => s._id === 'In Progress')?.count || 0}
          icon={Clock}
          variant="warning"
        />
        <StatsCard
          title="Overdue"
          value={stats?.overdueTasks || 0}
          icon={AlertCircle}
          variant="danger"
          trend="down"
          trendValue="5%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            Tasks by Status
          </h3>
          <TaskPieChart data={statusData} />
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tasks per Member</h3>
          <UserBarChart data={stats?.tasksPerUser || []} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity size={20} className="text-primary-600" />
            Recent Activity
          </h3>
          <button 
            onClick={() => navigate('/activity')}
            className="text-sm font-bold text-primary-600 hover:text-primary-700"
          >
            View All
          </button>
        </div>
        <div className="space-y-6">
          {stats?.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity) => (
              <div key={activity._id} className="flex gap-4">
                <Avatar src={activity.user?.avatar} name={activity.user?.name} size="sm" className="mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-slate-600">
                      <span className="font-bold text-slate-900">{activity.user?.name}</span>
                      {' '}{activity.details}
                    </p>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(activity.createdAt)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      activity.action === 'created' ? 'bg-emerald-500' : 
                      activity.action === 'deleted' ? 'bg-rose-500' : 'bg-primary-500'
                    }`}></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {activity.entity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 py-4">No recent activity found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
