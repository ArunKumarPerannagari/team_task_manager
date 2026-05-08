const Project = require('../models/Project');
const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'admin') {
      query = Project.find();
    } else {
      query = Project.find({
        $or: [
          { createdBy: req.user.id },
          { members: req.user.id }
        ]
      });
    }

    const projects = await query.populate('createdBy', 'name avatar').populate('members', 'name avatar');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('members', 'name avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && 
        project.createdBy.toString() !== req.user.id && 
        !project.members.some(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this project' });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin only)
exports.createProject = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    const project = await Project.create(req.body);

    await Activity.create({
      user: req.user.id,
      project: project._id,
      action: 'created',
      entity: 'project',
      entityId: project._id,
      details: `Project "${project.name}" was created`
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await Activity.create({
      user: req.user.id,
      project: project._id,
      action: 'updated',
      entity: 'project',
      entityId: project._id,
      details: `Project "${project.name}" was updated`
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add members to project
// @route   POST /api/projects/:id/members
// @access  Private (Admin only)
exports.addMembers = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Filter out existing members
    const newMembers = userIds.filter(id => !project.members.includes(id));
    project.members.push(...newMembers);
    await project.save();

    project = await Project.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('members', 'name avatar');

    await Activity.create({
      user: req.user.id,
      project: project._id,
      action: 'added members',
      entity: 'member',
      entityId: project._id,
      details: `Added ${newMembers.length} members to project`
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin only)
exports.removeMember = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.members = project.members.filter(m => m.toString() !== req.params.userId);
    await project.save();

    project = await Project.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('members', 'name avatar');

    await Activity.create({
      user: req.user.id,
      project: project._id,
      action: 'removed member',
      entity: 'member',
      entityId: project._id,
      details: `Removed a member from project`
    });

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
};
