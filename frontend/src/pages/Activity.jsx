import React, { useState, useEffect } from 'react';
import { Activity, Search, Filter } from 'lucide-react';
import api from '../services/api';
import Avatar from '../components/UI/Avatar';
import { formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/dashboard/stats'); // Dashboard stats includes recent activity, but maybe we want a dedicated endpoint?
      // For now, let's just use what we have or assume the backend has a /activities endpoint
      // Actually, the dashboardController has a getStats that returns recentActivity.
      // Let's just use the stats for now as a mock of "all activities" or keep it simple.
      setActivities(response.data.data.recentActivity);
    } catch (error) {
      console.error('Failed to fetch activity', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-['Outfit',sans-serif]">Recent Activity</h1>
        <p className="text-slate-500 mt-1">Track all actions and changes across the platform.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-8">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity._id} className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <Avatar src={activity.user?.avatar} name={activity.user?.name} size="md" />
                  <div className="w-0.5 flex-1 bg-slate-100 my-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <p className="text-slate-600">
                      <span className="font-bold text-slate-900">{activity.user?.name}</span>
                      {' '}{activity.details}
                    </p>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(activity.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      activity.action === 'created' ? 'bg-emerald-100 text-emerald-700' : 
                      activity.action === 'deleted' ? 'bg-rose-100 text-rose-700' : 'bg-primary-100 text-primary-700'
                    }`}>
                      {activity.action}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-3">
                      {activity.entity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 py-4">No activities found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
