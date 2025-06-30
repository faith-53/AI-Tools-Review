const express = require("express");
const cors = require("cors");
require("dotenv").config();
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./controllers/authController');
const path = require('path');
const connectDB = require('./config/db.js');
const newsletterRoutes = require('./routes/newsletterRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Sample route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use("/api/users", userRoutes)
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
