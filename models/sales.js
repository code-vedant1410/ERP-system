const mongoose = require('mongoose');
const salesSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  customer:{type:String , required:true},
  customermail:{type:String,required:true},
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  amount:{ type: Number, required: true }
});
const Sales = mongoose.model('Sales', salesSchema);
module.exports = Sales;