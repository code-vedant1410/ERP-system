const Sales = require('../models/sales');
const Product = require('../models/product');
const successResponse = require('../responses/successResponse');
const errorResponse = require('../responses/errorResponse');
//const PDFDocument = require('pdfkit');
//const nodemailer = require('nodemailer');

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

// const Sales = require("../models/sales");
// const Product = require("../models/product");
// const successResponse = require("../responses/successResponse");
// const errorResponse = require("../responses/errorResponse");
// const PDFDocument = require("pdfkit");
// const nodemailer = require("nodemailer");
// const fs = require("fs");
// const { log } = require("console");

// const salesController = {
//   createSale: async (req, res) => {
//     try {
//       const { customer, customermail, products } = req.body;

//       // Array to store the created sales
//       const createdSales = [];

//       // Loop through each product in the request
//       for (const productData of products) {
//         const { productId, quantity } = productData;

//         // Find the product by its ID
//         const product = await Product.findById(productId);

//         if (!product) {
//           return errorResponse(res, 404, "Product not found");
//         }

//         if (product.inventory < quantity) {
//           return errorResponse(res, 400, "Insufficient inventory");
//         }

//         // Deduct the quantity from inventory
//         product.inventory -= quantity;
//         await product.save();

//         // Retrieve the price from the product document
//         const price = product.price;

//         // Calculate the amount
//         const amount = price * quantity;
//         const name = product.name;

//         // Create a new sale object
//         const newSale = new Sales({
//           customer,
//           customermail,
//           product: productId,
//           name,
//           quantity,
//           price,
//           amount,
//         });

//         // Save the sale to the database
//         const savedSale = await newSale.save();

//         // Add the saved sale to the createdSales array
//         createdSales.push(savedSale);
//       }

//       // Send success response with array of created sales
//       successResponse(res, createdSales, "Sales created successfully");

//       // Send email with bill to the customer
//       sendBillByEmail(customermail, createdSales);
//     } catch (error) {
//       console.error(error);
//       errorResponse(res, 500, "Internal Server Error", error);
//     }
//   },

//   getSales: async (req, res) => {
//     try {
//       // Projecting only required fields
//       let sales = await Sales.find(
//         {},
//         {
//           customer: 1,
//           customermail: 1,
//           product: 1,
//           quantity: 1,
//           amount: 1,
//           date: 1,
//         }
//       ).populate("products.product", "name");
//       console.log("adfadf", sales);
//       return;
//       // Convert date to desired format
//       sales = sales.map((sale) => ({
//         customer: sale.customer,
//         customermail: sale.customermail,
//         product: sale.product,
//         quantity: sale.quantity,
//         amount: sale.amount,
//         date: sale.date.toISOString().split("T")[0], // Extracting only the date part
//       }));

//       successResponse(res, sales, "Sales retrieved successfully");
//     } catch (error) {
//       console.error(error);
//       errorResponse(res, 500, "Internal Server Error", error);
//     }
//   },
// };

// //---------------------------------------------------------------------------------------

// async function sendBillByEmail(customerEmail, sales) {
//   try {
//     console.log("asda", sales);
//     // Create PDF
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream("sales_bill.pdf"));

//     // Add sales details to PDF
//     doc.fontSize(16).text("Sales Bill", { align: "center" }).moveDown();
//     sales.forEach((sale, index) => {
//       doc.fontSize(12).text(`Sale ${index + 1}:`);
//       doc.fontSize(10).text(`Customer: ${sale.customer}`);
//       doc.text(`Product: ${sale.product}`);

//       doc.text(`Quantity: ${sale.quantity}`);
//       doc.text(`Amount: ${sale.amount}`);
//       doc.moveDown();
//     });

//     doc.end();

//     // Send email with PDF attachment
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "inframax07@gmail.com", // Your Gmail address
//         pass: "xoqr beri hcac cnjx", // Your Gmail app password
//       },
//     });

//     const mailOptions = {
//       from: "inframax07@gmail.com",
//       to: customerEmail,
//       subject: "Your Sales Bill",
//       text: "Please find attached your sales bill.",
//       attachments: [
//         {
//           filename: "sales_bill.pdf",
//           path: "sales_bill.pdf",
//         },
//       ],
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//       } else {
//         console.log("Email sent:", info.response);
//       }
//     });
//   } catch (error) {
//     console.error("Error generating PDF or sending email:", error);
//   }
// }
// module.exports = salesController;
