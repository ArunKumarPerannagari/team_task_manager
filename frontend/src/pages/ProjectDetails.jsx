import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, UserPlus, ArrowLeft, MoreHorizontal, Settings } from 'lucide-react';
import { projectService, taskService, userService } from '../services';
import KanbanBoard from '../components/Tasks/KanbanBoard';
import TaskModal from '../components/Tasks/TaskModal';
import ProjectModal from '../components/Projects/ProjectModal';
import MemberModal from '../components/Projects/MemberModal';
import ConfirmModal from '../components/UI/ConfirmModal';
import Avatar from '../components/UI/Avatar';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projRes, tasksRes, usersRes] = await Promise.all([
        projectService.getById(id),
        taskService.getAll({ project: id }),
        isAdmin ? userService.getAll() : Promise.resolve({ data: { data: [] } })
      ]);
      setProject(projRes.data.data);
      setTasks(tasksRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      toast.error('Failed to load project data');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (data) => {
    try {
      if (selectedTask) {
        await taskService.update(selectedTask._id, data);
        toast.success('Task updated!');
      } else {
        await taskService.create({ ...data, project: id });
        toast.success('Task created!');
      }
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleTaskUpdateStatus = async (taskId, newStatus) => {
    try {
      // Optimistic Update
      const oldTasks = [...tasks];
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      
      await taskService.update(taskId, { status: newStatus });
      toast.success('Status updated');
    } catch (error) {
      setTasks(oldTasks);
      toast.error('Update failed');
    }
  };

  const handleProjectUpdate = async (data) => {
    try {
      await projectService.update(id, data);
      toast.success('Project updated!');
      setIsProjectModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await projectService.addMembers(id, [userId]);
      toast.success('Member added!');
      fetchData();
    } catch (error) {
      toast.error('Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await projectService.removeMember(id, userId);
      toast.success('Member removed');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await projectService.delete(id);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors w-fit group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Projects</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">{project.name}</h1>
            <p className="text-slate-500 max-w-2xl">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isAdmin && (
              <>
                <button 
                  onClick={() => setIsProjectModalOpen(true)}
                  className="btn btn-secondary px-4 gap-2"
                >
                  <Edit2 size={18} />
                  Settings
                </button>
                <button 
                  onClick={() => setIsConfirmDeleteOpen(true)}
                  className="btn btn-secondary px-4 gap-2 text-rose-600 hover:bg-rose-50 border-rose-100"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </>
            )}
            <button 
              onClick={() => {
                setSelectedTask(null);
                setIsTaskModalOpen(true);
              }}
              className="btn btn-primary px-6 gap-2 shadow-lg shadow-primary-100"
            >
              <Plus size={20} />
              New Task
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-8 py-4 border-y border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin</span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
              <Avatar src={project.createdBy?.avatar} name={project.createdBy?.name} size="sm" />
              <span className="text-sm font-bold text-slate-700">{project.createdBy?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team Members</span>
            <div className="flex -space-x-2">
              {project.members?.map(m => (
                <div key={m._id} className="border-2 border-white rounded-full" title={m.name}>
                  <Avatar src={m.avatar} name={m.name} size="sm" />
                </div>
              ))}
              {isAdmin && (
                <button 
                  onClick={() => setIsMemberModalOpen(true)}
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-50 text-primary-600 border-2 border-white hover:bg-primary-100 transition-colors"
                >
                  <UserPlus size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="relative">
        <KanbanBoard
          tasks={tasks}
          onTaskUpdate={handleTaskUpdateStatus}
          onEdit={(task) => {
            setSelectedTask(task);
            setIsTaskModalOpen(true);
          }}
          onDelete={async (taskId) => {
             if (window.confirm('Are you sure you want to delete this task?')) {
               try {
                 await taskService.delete(taskId);
                 toast.success('Task deleted');
                 fetchData();
               } catch (err) {
                 toast.error('Failed to delete task');
               }
             }
          }}
          isAdmin={isAdmin}
        />
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        projects={[project]}
        users={isAdmin ? users : [project.createdBy, ...project.members]}
        initialData={selectedTask}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleProjectUpdate}
        initialData={project}
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action will permanently remove all associated tasks and cannot be undone.`}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        members={project.members}
        allUsers={users}
        onAdd={handleAddMember}
        onRemove={handleRemoveMember}
      />
    </div>
  );
};

export default ProjectDetails;
