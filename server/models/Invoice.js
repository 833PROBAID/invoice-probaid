const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  serviceDate: {
    type: String
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  billingContact: String,
  fromAddress: String,
  companyName: String,
  toAddress: String,
  phone: String,
  phone2: String,
  email: String,
  serviceFee: String,
  totalDue: String,
  payableTo: String,
  mailingAddress: String,
  nameZelle: String,
  phoneZelle: String,
  emailZelle: String,
  descriptions: {
    type: [String],
    default: []
  },
  includedServices: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  dueDate: String,
  sentDate: String,
  paidDate: String,
  notes: String,
  includeBanner: {
    type: Boolean,
    default: false
  },
  bannerWidth: {
    type: Number,
    default: 90
  },
  disclaimer: {
    type: String,
    default: 'Please note that this invoice is for services rendered by 833PROBAID®. Payment is due upon receipt of this invoice. Late payments may be subject to additional fees as outlined in our service agreement. If you have any questions regarding this invoice, please contact our billing department at your earliest convenience.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
