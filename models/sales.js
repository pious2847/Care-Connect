const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customerName: {
    type: String,
    trim: true,
  },
  customerContact: {
    type: String,
    trim: true,
  },
  drugs: [
    {
      drugId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drug',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      unitPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Mobile Money'],
    default: 'Cash',
  },
}, { timestamps: true });


const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
