import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { cn } from '../UI/LoadingSpinner';

const KanbanBoard = ({ tasks, onTaskUpdate, onEdit, onDelete, isAdmin }) => {
  const columns = {
    'To Do': tasks.filter(t => t.status === 'To Do'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Done': tasks.filter(t => t.status === 'Done'),
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    onTaskUpdate(draggableId, destination.droppableId);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
        {Object.entries(columns).map(([columnId, columnTasks]) => (
          <div key={columnId} className="flex flex-col bg-slate-100/50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                {columnId}
                <span className="bg-slate-200 text-slate-600 text-xs py-0.5 px-2 rounded-full">
                  {columnTasks.length}
                </span>
              </h3>
            </div>

            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "flex-1 space-y-4 transition-colors rounded-xl",
                    snapshot.isDraggingOver ? "bg-slate-200/50" : ""
                  )}
                >
                  {columnTasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? "z-50" : ""}
                        >
                          <TaskCard
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isAdmin={isAdmin}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  
                  {columnTasks.length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-400">
                      <p className="text-sm font-medium">No tasks here</p>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
