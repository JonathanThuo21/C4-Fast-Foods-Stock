const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use 'secure: true' if using HTTPS
}));

// Routes
const indexRouter = require('./routes/index');
const menuItemsRouter = require('./routes/menuItems');

app.use('/', indexRouter);
app.use('/menuItems', menuItemsRouter);

// Database connection
mongoose.connect('mongodb://localhost:27017/food_calculator', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
