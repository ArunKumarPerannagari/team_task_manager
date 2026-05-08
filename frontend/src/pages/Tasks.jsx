import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Calendar, ListTodo, MoreVertical } from 'lucide-react';
import { taskService, projectService, userService } from '../services';
import TaskCard from '../components/Tasks/TaskCard';
import TaskModal from '../components/Tasks/TaskModal';
import { CardSkeleton } from '../components/UI/SkeletonLoader';
import EmptyState from '../components/UI/EmptyState';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchData();
  }, [statusFilter, priorityFilter]);

  const fetchData = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      
      const [tasksRes, projsRes, usersRes] = await Promise.all([
        taskService.getAll(params),
        isAdmin ? projectService.getAll() : Promise.resolve({ data: { data: [] } }),
        isAdmin ? userService.getAll() : Promise.resolve({ data: { data: [] } })
      ]);
      
      setTasks(tasksRes.data.data);
      setProjects(projsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (data) => {
    try {
      if (selectedTask) {
        await taskService.update(selectedTask._id, data);
        toast.success('Task updated');
      } else {
        await taskService.create(data);
        toast.success('Task created');
      }
      setIsModalOpen(false);
      setSelectedTask(null);
      fetchData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-['Outfit',sans-serif]">All Tasks</h1>
          <p className="text-slate-500 mt-1">Overview of all tasks across projects.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary px-6 gap-2"
          >
            <Plus size={20} />
            Add Task
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              className="input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="input" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select 
            className="input"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Tasks List/Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task._id} 
              task={task} 
              isAdmin={isAdmin}
              onEdit={(t) => {
                setSelectedTask(t);
                setIsModalOpen(true);
              }}
              onDelete={async (id) => {
                if (window.confirm('Delete this task?')) {
                  await taskService.delete(id);
                  toast.success('Task deleted');
                  fetchData();
                }
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ListTodo}
          title="No tasks found"
          description="We couldn't find any tasks matching your current filters."
          action={(
            <button 
              onClick={() => {
                setStatusFilter('');
                setPriorityFilter('');
                setSearchQuery('');
              }} 
              className="btn btn-secondary"
            >
              Clear all filters
            </button>
          )}
        />
      )}

      {isAdmin && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleTaskSubmit}
          projects={projects}
          users={users}
          initialData={selectedTask}
        />
      )}
    </div>
  );
};

export default Tasks;
