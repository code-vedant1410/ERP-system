const PDFDocument = require("pdfkit");
const fs = require("fs");

function generateBillPDF(billData, filePath) {
  const doc = new PDFDocument();
  // Customize your PDF content based on the billData
  doc.text("Invoice");
  doc.text("");
  doc.text(`Customer Name: ${billData.customerName}`);
  doc.text(`address: ${billData.address}`);
  doc.text(`state: ${billData.state}`);
  doc.text(`country: ${billData.country}`);
  doc.text(`postal_code: ${billData.postal_code}`);

  doc.pipe(fs.createWriteStream(filePath));
  doc.end();
}

module.exports = generateBillPDF;
