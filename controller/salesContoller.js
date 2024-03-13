const Sales = require('../models/sales');
const Product = require('../models/product');
const successResponse = require('../responses/successResponse');
const errorResponse = require('../responses/errorResponse');
const salesController = {
  createSale: async (req, res) => {
    try {
      const { customer, customermail, products } = req.body;
      
      // Array to store the created sales
      const createdSales = [];

      // Loop through each product in the request
      for (const productData of products) {
        const { productId, quantity } = productData;

        // Find the product by its ID
        const product = await Product.findById(productId);

        if (!product) {
          return errorResponse(res, 404, 'Product not found');
        }

        if (product.inventory < quantity) {
          return errorResponse(res, 400, 'Insufficient inventory');
        }

        // Deduct the quantity from inventory
        product.inventory -= quantity;
        await product.save();

        // Retrieve the price from the product document
        const price = product.price;

        // Calculate the amount
        const amount = price * quantity;

        // Create a new sale object
        const newSale = new Sales({ customer, customermail, product: productId, quantity, price, amount });

        // Save the sale to the database
        const savedSale = await newSale.save();

        // Add the saved sale to the createdSales array
        createdSales.push(savedSale);
      }

      // Send success response with array of created sales
      successResponse(res, createdSales, 'Sales created successfully');
    } catch (error) {
      console.error(error);
      errorResponse(res, 500, 'Internal Server Error', error);
    }
  },
  getSales: async (req, res) => {
    try {
      // Projecting only required fields
      let sales = await Sales.find({}, { customer: 1, customermail: 1, product: 1, quantity: 1, amount: 1, date: 1 }).populate('product');
      
      // Convert date to desired format
      sales = sales.map(sale => ({
        customer: sale.customer,
        customermail: sale.customermail,
        product: sale.product,
        quantity: sale.quantity,
        amount: sale.amount,
        date: sale.date.toISOString().split('T')[0] // Extracting only the date part
      }));
      
      successResponse(res, sales, 'Sales retrieved successfully');
    } catch (error) {
      console.error(error);
      errorResponse(res, 500, 'Internal Server Error', error);
    }
  },
};
module.exports = salesController;