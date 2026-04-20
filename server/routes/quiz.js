const express = require('express');
const router = express.Router();
const QuizUser = require('../models/QuizUser');
const QuizSubmission = require('../models/QuizSubmission');
const { authMiddleware } = require('../middleware/auth');

// Public route - Register quiz user
router.post('/register-user', async (req, res) => {
  try {
    const { name, email, phone, relationship, additionalInfo } = req.body;

    // Validation
    if (!name || !email || !phone || !relationship) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        errors: ['Name, email, phone, and relationship are required']
      });
    }

    // Check if user already exists
    let user = await QuizUser.findOne({ email: email.toLowerCase() });

    if (user) {
      // Update last accessed time
      user.lastAccessedAt = new Date();
      await user.save();
      
      return res.status(200).json({
        message: 'Welcome back!',
        userId: user._id,
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          relationship: user.relationship
        }
      });
    }

    // Create new user
    user = new QuizUser({
      name,
      email: email.toLowerCase(),
      phone,
      relationship,
      additionalInfo: additionalInfo || ''
    });

    await user.save();

    res.status(201).json({
      message: 'Registration successful',
      userId: user._id,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        relationship: user.relationship
      }
    });

  } catch (error) {
    console.error('Quiz user registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user',
      error: error.message 
    });
  }
});

// Public route - Submit quiz results (allows multiple submissions per user)
router.post('/submit', async (req, res) => {
  try {
    const { userId, answers, results } = req.body;

    // Validation
    if (!userId || !answers || !results) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        errors: ['User ID, answers, and results are required']
      });
    }

    // Verify user exists
    const user = await QuizUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new submission (allows multiple per user)
    const submission = new QuizSubmission({
      userId,
      answers: new Map(Object.entries(answers)),
      results,
      submittedAt: new Date()
    });

    await submission.save();

    // Update user's last accessed time
    user.lastAccessedAt = new Date();
    await user.save();

    res.status(200).json({
      message: 'Quiz submitted successfully',
      submissionId: submission._id,
      results: submission.results
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ 
      message: 'Error submitting quiz',
      error: error.message 
    });
  }
});

// Protected routes - Admin only
router.use(authMiddleware);

// Get all quiz users with their submission counts
router.get('/users', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      relationship = '',
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (relationship) {
      query.relationship = relationship;
    }

    // Date range filter for registration
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const users = await QuizUser.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get submission counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const submissionCount = await QuizSubmission.countDocuments({ userId: user._id });
        const lastSubmission = await QuizSubmission.findOne({ userId: user._id })
          .sort({ submittedAt: -1 })
          .select('submittedAt results.percentage')
          .lean();
        
        return {
          ...user,
          submissionCount,
          lastSubmission: lastSubmission ? {
            date: lastSubmission.submittedAt,
            percentage: lastSubmission.results.percentage
          } : null
        };
      })
    );

    const total = await QuizUser.countDocuments(query);

    res.json({
      users: usersWithCounts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Error fetching quiz users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get all submissions for a specific user
router.get('/users/:userId/submissions', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await QuizUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const submissions = await QuizSubmission.find({ userId })
      .sort({ submittedAt: -1 })
      .lean();

    res.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        relationship: user.relationship,
        additionalInfo: user.additionalInfo
      },
      submissions
    });

  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
});

// Get all submissions (admin view) - minimal data for table
router.get('/submissions', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '',
      user = '', // Filter by specific user (changed from userId)
      userId = '', // Keep for backward compatibility
      startDate, 
      endDate, 
      minScore, 
      maxScore,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    
    // Filter by user if provided (supports both 'user' and 'userId' params)
    const userFilter = user || userId;
    if (userFilter) {
      query.userId = userFilter;
    }
    
    // Date range filter for submission date
    if (startDate || endDate) {
      query.submittedAt = {};
      if (startDate) query.submittedAt.$gte = new Date(startDate);
      if (endDate) query.submittedAt.$lte = new Date(endDate);
    }
    
    // Score range filter
    if (minScore !== undefined || maxScore !== undefined) {
      query['results.percentage'] = {};
      if (minScore !== undefined) query['results.percentage'].$gte = parseInt(minScore);
      if (maxScore !== undefined) query['results.percentage'].$lte = parseInt(maxScore);
    }

    // Build sort object
    const sortObj = {};
    if (sortBy === 'percentage') {
      sortObj['results.percentage'] = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'userName') {
      // We'll sort after population
      sortObj['submittedAt'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    let submissions = await QuizSubmission.find(query)
      .populate('userId', 'name email relationship')
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('userId results.percentage results.band.label results.band.tier submittedAt')
      .lean();

    // Apply search filter on populated user data
    if (search) {
      const searchLower = search.toLowerCase();
      submissions = submissions.filter(sub => 
        sub.userId && (
          sub.userId.name?.toLowerCase().includes(searchLower) ||
          sub.userId.email?.toLowerCase().includes(searchLower)
        )
      );
    }

    // Sort by userName if requested
    if (sortBy === 'userName') {
      submissions.sort((a, b) => {
        const nameA = a.userId?.name || '';
        const nameB = b.userId?.name || '';
        return sortOrder === 'asc' 
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }

    const total = await QuizSubmission.countDocuments(query);

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
});

// Get detailed submission by ID (for view modal)
router.get('/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await QuizSubmission.findById(id)
      .populate('userId', 'name email phone relationship additionalInfo');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Convert to plain object and convert Map to Object for answers
    const submissionObj = submission.toObject();
    submissionObj.answers = Object.fromEntries(submissionObj.answers);

    res.json(submissionObj);

  } catch (error) {
    console.error('Error fetching submission details:', error);
    res.status(500).json({ message: 'Error fetching submission details', error: error.message });
  }
});

// Get submission statistics
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const [totalUsers, totalSubmissions, monthSubmissions, weekSubmissions, avgScore] = await Promise.all([
      QuizUser.countDocuments(),
      QuizSubmission.countDocuments(),
      QuizSubmission.countDocuments({ submittedAt: { $gte: startOfMonth } }),
      QuizSubmission.countDocuments({ submittedAt: { $gte: startOfWeek } }),
      QuizSubmission.aggregate([
        {
          $group: {
            _id: null,
            averageScore: { $avg: '$results.percentage' }
          }
        }
      ])
    ]);

    // Get distribution by readiness tier
    const tierDistribution = await QuizSubmission.aggregate([
      {
        $group: {
          _id: '$results.band.tier',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get relationship distribution
    const relationshipDistribution = await QuizUser.aggregate([
      {
        $group: {
          _id: '$relationship',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalSubmissions,
      monthSubmissions,
      weekSubmissions,
      averageScore: avgScore.length > 0 ? Math.round(avgScore[0].averageScore) : 0,
      tierDistribution,
      relationshipDistribution
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Get single submission details
router.get('/submissions/:id', async (req, res) => {
  try {
    const submission = await QuizSubmission.findById(req.params.id)
      .populate('userId')
      .lean();

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);

  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
  }
});

// Delete a submission
router.delete('/submissions/:id', async (req, res) => {
  try {
    const submission = await QuizSubmission.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ message: 'Submission deleted successfully' });

  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ message: 'Error deleting submission', error: error.message });
  }
});

// Delete a user and all their submissions
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await QuizUser.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all submissions for this user
    await QuizSubmission.deleteMany({ userId: req.params.id });

    res.json({ message: 'User and all submissions deleted successfully' });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

module.exports = router;
