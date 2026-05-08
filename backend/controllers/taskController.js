const Task = require('../models/Task');
const Activity = require('../models/Activity');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    let query;

    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Handle project filtering
    if (reqQuery.project) {
      query = Task.find(reqQuery);
    } else if (req.user.role === 'admin') {
      query = Task.find(reqQuery);
    } else {
      query = Task.find({
        ...reqQuery,
        $or: [
          { assignedTo: req.user.id },
          { createdBy: req.user.id }
        ]
      });
    }

    // Search logic
    if (req.query.search) {
      query = query.find({
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } }
        ]
      });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Task.countDocuments(reqQuery);

    query = query.skip(startIndex).limit(limit);

    const tasks = await query
      .populate('assignedTo', 'name avatar')
      .populate('project', 'name')
      .populate('createdBy', 'name avatar');

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination: {
        total,
        page,
        limit
      },
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private (Admin only)
exports.createTask = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    // Check if project exists
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create(req.body);

    await Activity.create({
      user: req.user.id,
      project: task.project,
      action: 'created',
      entity: 'task',
      entityId: task._id,
      details: `Task "${task.title}" was created`
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // RBAC: Member can only update status if assigned
    if (req.user.role === 'member') {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }

      // If member, only allow status update
      const allowedUpdates = ['status'];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ message: 'Members can only update task status' });
      }
    }

    const oldStatus = task.status;
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (oldStatus !== task.status) {
      await Activity.create({
        user: req.user.id,
        project: task.project,
        action: 'status changed',
        entity: 'task',
        entityId: task._id,
        details: `Task "${task.title}" status changed from ${oldStatus} to ${task.status}`
      });
    } else {
      await Activity.create({
        user: req.user.id,
        project: task.project,
        action: 'updated',
        entity: 'task',
        entityId: task._id,
        details: `Task "${task.title}" was updated`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const projectId = task.project;
    const taskTitle = task.title;

    await task.deleteOne();

    await Activity.create({
      user: req.user.id,
      project: projectId,
      action: 'deleted',
      entity: 'task',
      entityId: req.params.id,
      details: `Task "${taskTitle}" was deleted`
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
