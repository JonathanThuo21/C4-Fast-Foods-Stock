const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: String,
    ingredients: [String],
    quantities: [Number],
    energyUsed: Number
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
