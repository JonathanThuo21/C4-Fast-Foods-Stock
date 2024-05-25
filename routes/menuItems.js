const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Route to render the add menu item form
router.get('/new', (req, res) => {
    res.render('addMenuItem');
});

// Route to handle new menu item submission
router.post('/', async (req, res) => {
    const { name, ingredients, quantities, energyUsed } = req.body;

    if (!name || !ingredients || !quantities || !energyUsed) {
        return res.json({ message: 'Please fill all fields.' });
    }

    const ingredientArray = ingredients.split(',').map(ingredient => ingredient.trim());
    const quantityArray = quantities.split(',').map(quantity => parseFloat(quantity.trim()));

    if (ingredientArray.length !== quantityArray.length) {
        return res.json({ message: 'Ingredients and quantities must match.' });
    }

    const newMenuItem = new MenuItem({
        name,
        ingredients: ingredientArray,
        quantities: quantityArray,
        energyUsed: parseFloat(energyUsed)
    });

    await newMenuItem.save();

    res.json({ message: 'Menu item added successfully.' });
});

// Route to handle deletion of a menu item
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await MenuItem.findByIdAndDelete(id);
        res.json({ message: 'Menu item deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete menu item.' });
    }
});

module.exports = router;
