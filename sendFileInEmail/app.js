require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 7410;

const app = express();

// Set up file storage using Multer (store file in memory)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// API endpoint to upload the file and send it via email
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded');
  }

  // Create email options
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'testkmsof@gmail.com',
    subject: 'File Upload',
    text: 'A file has been uploaded.',
    attachments: [
      {
        filename: file.originalname, // Maintain original filename
        content: file.buffer, // Send file content directly from memory
      },
    ],
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to send email');
    }

    return res.status(200).send('File uploaded and email sent successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
