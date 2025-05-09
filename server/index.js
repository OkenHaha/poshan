require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// ... other middleware ...
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const beneficiarySchema = new mongoose.Schema({
  name: String,
  category: String,
  gender: String,
  dob: Date
});

const nutritionSchema = new mongoose.Schema({
  beneficiaryId: String,
  date: Date,
  height: Number,
  weight: Number,
  haz: Number,
  waz: Number,
  whz: Number,
  status: {
    stunting: String,
    wasting: String,
    underweight: String
  }
});

const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);
const Nutrition = mongoose.model('Nutrition', nutritionSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token !== process.env.ACCESS_TOKEN) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  next();
};

// Beneficiary Management
app.post('/api/v1/beneficiaries', authenticateToken, async (req, res) => {
  try {
    const beneficiary = new Beneficiary(req.body);
    await beneficiary.save();
    res.status(201).json(beneficiary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/v1/beneficiaries/:id', authenticateToken, async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    res.json(beneficiary);
  } catch (error) {
    res.status(404).json({ error: 'Beneficiary not found' });
  }
});

app.put('/api/v1/beneficiaries/:id', authenticateToken, async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(beneficiary);
  } catch (error) {
    res.status(404).json({ error: 'Beneficiary not found' });
  }
});

app.get('/api/v1/beneficiaries', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const beneficiaries = await Beneficiary.find(query);
    res.json(beneficiaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Nutritional Status Calculation
app.post('/api/v1/nutrition/status', authenticateToken, async (req, res) => {
  try {
    const { beneficiaryId, height, weight } = req.body;
    const beneficiary = await Beneficiary.findById(beneficiaryId);
    
    if (!beneficiary) {
      return res.status(404).json({ error: 'Beneficiary not found' });
    }

    // Simplified calculation (replace with proper WHO standard implementation)
    const haz = Math.random() * 2 - 1; // Random value for demonstration
    const waz = Math.random() * 2 - 1; // Random value for demonstration
    const whz = Math.random() * 2 - 1; // Random value for demonstration

    const nutritionRecord = new Nutrition({
      beneficiaryId,
      date: new Date(),
      height,
      weight,
      haz,
      waz,
      whz,
      status: {
        stunting: haz < -2 ? 'severe' : haz < -1 ? 'moderate' : 'normal',
        wasting: whz < -2 ? 'severe' : whz < -1 ? 'moderate' : 'normal',
        underweight: waz < -2 ? 'severe' : waz < -1 ? 'moderate' : 'normal'
      }
    });

    await nutritionRecord.save();
    res.status(201).json(nutritionRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/nutrition/history/:beneficiaryId', authenticateToken, async (req, res) => {
  try {
    const records = await Nutrition.find({ beneficiaryId: req.params.beneficiaryId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Growth Standards Management (Admin routes)
app.get('/api/v1/standards/who', authenticateToken, (req, res) => {
  // Implementation would go here
  res.json({ message: 'WHO standards endpoint' });
});

app.post('/api/v1/standards/who', authenticateToken, (req, res) => {
  // Implementation would go here
  res.json({ message: 'Update WHO standards endpoint' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});