import React from 'react';
import { Users, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../UI/Avatar';
import { formatDate } from '../../utils/formatters';

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 animate-fade-in relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
        <ArrowRight className="text-primary-600" size={24} />
      </div>

      <div className="flex flex-col h-full">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
          {project.name}
        </h3>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 flex-1">
          {project.description}
        </p>

        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>Created {formatDate(project.createdAt)}</span>
            </div>
            <span>{project.members?.length || 0} Members</span>
          </div>

          <div className="flex -space-x-2 overflow-hidden">
            {project.members?.slice(0, 5).map((member) => (
              <div key={member._id} className="border-2 border-white rounded-full">
                <Avatar src={member.avatar} name={member.name} size="sm" />
              </div>
            ))}
            {project.members?.length > 5 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 border-2 border-white text-[10px] font-bold text-slate-600">
                +{project.members.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
