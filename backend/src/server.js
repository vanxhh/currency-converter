require('dotenv').config()

const express = require('express');
const cors = require('cors');
const currencyRoutes = require('./routes/currencyRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes'); // Import favorites routes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/currency', currencyRoutes);
app.use('/api/favorites', favoritesRoutes); // Connected to /api/favorites

app.get('/', (req, res) => {
  res.send('Currency Converter Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});