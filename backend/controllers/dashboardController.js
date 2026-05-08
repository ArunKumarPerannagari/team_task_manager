const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let matchQuery = {};
    if (!isAdmin) {
      // For members, only count tasks they are involved in
      matchQuery = {
        $or: [
          { assignedTo: req.user._id },
          { createdBy: req.user._id }
        ]
      };
    }

    // Total tasks count
    const totalTasks = await Task.countDocuments(matchQuery);

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Tasks per user (Admin only)
    let tasksPerUser = [];
    if (isAdmin) {
      tasksPerUser = await Task.aggregate([
        {
          $group: {
            _id: '$assignedTo',
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            name: '$user.name',
            count: 1
          }
        }
      ]);
    }

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      ...matchQuery,
      dueDate: { $lt: new Date() },
      status: { $ne: 'Done' }
    });

    // Recent activity
    let activityQuery = {};
    if (!isAdmin) {
       // Only show activity for projects user is member of
       const userProjects = await Project.find({
         $or: [{ createdBy: userId }, { members: userId }]
       }).select('_id');
       const projectIds = userProjects.map(p => p._id);
       activityQuery = { project: { $in: projectIds } };
    }

    const recentActivity = await Activity.find(activityQuery)
      .sort('-createdAt')
      .limit(10)
      .populate('user', 'name avatar');

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        tasksByStatus,
        tasksPerUser,
        overdueTasks,
        recentActivity
      }
    });
  } catch (err) {
    next(err);
  }
};
