const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

mongoose.connect('mongodb://localhost:27017/food_calculator', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const seedData = [
    {
        name: 'Pasta',
        ingredients: ['Flour', 'Eggs', 'Salt'],
        quantities: [100, 2, 1],
        energyUsed: 0.5
    },
    {
        name: 'Pizza',
        ingredients: ['Flour', 'Tomato Sauce', 'Cheese'],
        quantities: [200, 150, 100],
        energyUsed: 1
    }
];

MenuItem.insertMany(seedData)
    .then(() => {
        console.log('Data seeded');
        mongoose.connection.close();
    })
    .catch(err => console.error(err));
