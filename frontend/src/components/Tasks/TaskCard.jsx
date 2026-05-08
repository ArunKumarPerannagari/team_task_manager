import React from 'react';
import { Calendar, Clock, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import Badge from '../UI/Badge';
import Avatar from '../UI/Avatar';
import { formatDate, getDueDateStatus } from '../../utils/formatters';
import { cn } from '../UI/LoadingSpinner';

const TaskCard = ({ task, onEdit, onDelete, isAdmin, isDraggable = false }) => {
  const priorityColors = {
    Low: 'info',
    Medium: 'warning',
    High: 'error',
  };

  const dueStatus = getDueDateStatus(task.dueDate);
  const dueColor = {
    overdue: 'text-rose-600 font-bold',
    today: 'text-amber-600 font-bold',
    tomorrow: 'text-sky-600',
    upcoming: 'text-slate-500',
  }[dueStatus];

  return (
    <div className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 animate-fade-in relative overflow-hidden">
      {/* Priority Indicator */}
      <div className={cn(
        "absolute top-0 left-0 w-1 h-full",
        task.priority === 'High' ? "bg-rose-500" : task.priority === 'Medium' ? "bg-amber-500" : "bg-sky-500"
      )}></div>

      <div className="flex justify-between items-start mb-3">
        <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
        {isAdmin && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(task)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
              <Edit2 size={16} />
            </button>
            <button onClick={() => onDelete(task._id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <h4 className="font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">{task.title}</h4>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{task.description}</p>

      <div className="flex items-center gap-3 text-xs mb-4">
        <div className={cn("flex items-center gap-1.5", dueColor)}>
          <Calendar size={14} />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        {task.status !== 'Done' && dueStatus === 'overdue' && (
          <Badge variant="error" className="animate-pulse">Overdue</Badge>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <Avatar src={task.assignedTo?.avatar} name={task.assignedTo?.name} size="sm" />
          <span className="text-xs font-medium text-slate-600">{task.assignedTo?.name?.split(' ')[0]}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{task.project?.name}</span>
      </div>
    </div>
  );
};

export default TaskCard;
