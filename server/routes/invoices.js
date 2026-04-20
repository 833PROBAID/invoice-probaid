const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { authMiddleware } = require('../middleware/auth');

// Apply authentication to all invoice routes
router.use(authMiddleware);

// Validation middleware
const validateInvoice = (req, res, next) => {
  const { invoiceNumber, date } = req.body;
  const errors = [];

  if (!invoiceNumber || invoiceNumber.trim() === '') {
    errors.push('Invoice number is required');
  }
  if (!date || date.trim() === '') {
    errors.push('Date is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
};

// Get invoice statistics
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonthStr = startOfMonth.toISOString().split('T')[0];

    const [totalStats, monthStats] = await Promise.all([
      Invoice.aggregate([
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalAmount: { 
              $sum: { 
                $cond: [
                  { $ne: ['$totalDue', ''] },
                  { $toDouble: { $ifNull: ['$totalDue', '0'] } },
                  0
                ]
              }
            }
          }
        }
      ]),
      Invoice.aggregate([
        { $match: { date: { $gte: startOfMonthStr } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalAmount: { 
              $sum: { 
                $cond: [
                  { $ne: ['$totalDue', ''] },
                  { $toDouble: { $ifNull: ['$totalDue', '0'] } },
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    res.json({
      total: totalStats[0]?.count || 0,
      totalAmount: totalStats[0]?.totalAmount || 0,
      thisMonth: monthStats[0]?.count || 0,
      thisMonthAmount: monthStats[0]?.totalAmount || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate next invoice number
router.get('/next-number', async (req, res) => {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const prefix = `INV-${year}${month}-`;
    
    // Find the highest invoice number with this prefix
    const lastInvoice = await Invoice.findOne({
      invoiceNumber: { $regex: `^${prefix}` }
    }).sort({ invoiceNumber: -1 });

    let nextNum = 1;
    if (lastInvoice) {
      const lastNum = parseInt(lastInvoice.invoiceNumber.replace(prefix, '')) || 0;
      nextNum = lastNum + 1;
    }

    res.json({ nextNumber: `${prefix}${String(nextNum).padStart(3, '0')}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all invoices with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Build filter object
    const filter = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { invoiceNumber: searchRegex },
        { billingContact: searchRegex },
        { companyName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { toAddress: searchRegex }
      ];
    }
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = req.query.startDate;
      if (req.query.endDate) filter.date.$lte = req.query.endDate;
    }

    // Status filter
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    // Amount range filter
    if (req.query.minAmount || req.query.maxAmount) {
      filter.$expr = {};
      const conditions = [];
      if (req.query.minAmount) {
        conditions.push({ $gte: [{ $toDouble: { $ifNull: ['$totalDue', '0'] } }, parseFloat(req.query.minAmount)] });
      }
      if (req.query.maxAmount) {
        conditions.push({ $lte: [{ $toDouble: { $ifNull: ['$totalDue', '0'] } }, parseFloat(req.query.maxAmount)] });
      }
      if (conditions.length === 1) {
        filter.$expr = conditions[0];
      } else if (conditions.length === 2) {
        filter.$expr = { $and: conditions };
      }
    }

    const [total, invoices] = await Promise.all([
      Invoice.countDocuments(filter),
      Invoice.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    res.json({
      invoices,
      currentPage: page,
      totalPages: Math.ceil(total / limit) || 1,
      totalInvoices: total,
      hasMore: skip + invoices.length < total,
      limit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get suggestions for autocomplete
router.get('/suggestions/:field', async (req, res) => {
  try {
    const { field } = req.params;
    const { query } = req.query;
    
    console.log(`[Suggestions] Field: ${field}, Query: ${query || 'none'}`);
    
    // Validate field
    const allowedFields = [
      'billingContact', 'fromAddress', 'companyName', 'toAddress',
      'phone', 'phone2', 'email', 'payableTo', 'mailingAddress',
      'nameZelle', 'phoneZelle', 'emailZelle', 'descriptions', 'includedServices',
      'invoiceNumber', 'notes', 'disclaimer'
    ];
    
    if (!allowedFields.includes(field)) {
      console.log(`[Suggestions] Invalid field: ${field}`);
      return res.status(400).json({ message: 'Invalid field' });
    }

    // Handle array fields - unwind and aggregate
    const arrayFields = ['descriptions', 'includedServices'];
    
    if (arrayFields.includes(field)) {
      const pipeline = [
        { $unwind: `$${field}` },
        {
          $match: {
            [field]: { $exists: true, $ne: null, $ne: '' }
          }
        }
      ];

      // Add search filter if query provided
      if (query) {
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        pipeline.push({
          $match: {
            [field]: { $regex: escapedQuery, $options: 'i' }
          }
        });
      }

      // Group and sort
      pipeline.push(
        {
          $group: {
            _id: `$${field}`,
            count: { $sum: 1 },
            lastUsed: { $max: '$createdAt' }
          }
        },
        {
          $project: {
            _id: 0,
            value: '$_id',
            count: 1,
            lastUsed: 1
          }
        },
        {
          $sort: { count: -1, lastUsed: -1 }
        },
        {
          $limit: 10
        }
      );

      console.log(`[Suggestions] Running array field aggregation for ${field}`);
      const suggestions = await Invoice.aggregate(pipeline);
      console.log(`[Suggestions] Found ${suggestions.length} suggestions`);
      return res.json(suggestions);
    }

    // Build aggregation pipeline for single fields
    const pipeline = [
      {
        $match: {
          [field]: { $exists: true, $ne: '', $ne: null }
        }
      }
    ];

    // Add search filter if query provided
    if (query) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      pipeline.push({
        $match: {
          [field]: { $regex: escapedQuery, $options: 'i' }
        }
      });
    }

    // Group by field to get unique values
    pipeline.push(
      {
        $group: {
          _id: `$${field}`,
          count: { $sum: 1 },
          lastUsed: { $max: '$createdAt' }
        }
      },
      {
        $project: {
          _id: 0,
          value: '$_id',
          count: 1,
          lastUsed: 1
        }
      },
      {
        $sort: { count: -1, lastUsed: -1 }
      },
      {
        $limit: 10
      }
    );

    console.log(`[Suggestions] Running single field aggregation pipeline`);
    const suggestions = await Invoice.aggregate(pipeline);
    console.log(`[Suggestions] Found ${suggestions.length} suggestions`);
    res.json(suggestions);
  } catch (error) {
    console.error(`[Suggestions] Error:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Update invoice status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: draft, sent, paid, overdue, cancelled' 
      });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'sent' && { sentDate: new Date().toISOString().split('T')[0] }),
        ...(status === 'paid' && { paidDate: new Date().toISOString().split('T')[0] })
      },
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single invoice by ID
router.get('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid invoice ID format' });
    }

    const invoice = await Invoice.findById(req.params.id).lean();
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new invoice
router.post('/', validateInvoice, async (req, res) => {
  try {
    // Check for duplicate invoice number
    const existing = await Invoice.findOne({ invoiceNumber: req.body.invoiceNumber });
    if (existing) {
      return res.status(409).json({ message: 'Invoice number already exists' });
    }

    const invoice = new Invoice(req.body);
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Invoice number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid invoice ID format' });
    }

    // Check if updating to a duplicate invoice number
    if (req.body.invoiceNumber) {
      const existing = await Invoice.findOne({ 
        invoiceNumber: req.body.invoiceNumber,
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(409).json({ message: 'Invoice number already exists' });
      }
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Invoice number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid invoice ID format' });
    }

    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

