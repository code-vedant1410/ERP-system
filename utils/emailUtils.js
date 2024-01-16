const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
  
  });
};

module.exports = { createTransporter }; 
