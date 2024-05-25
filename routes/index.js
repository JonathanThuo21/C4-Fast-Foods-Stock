const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Route to render the form
router.get('/', async (req, res) => {
    const menuItems = await MenuItem.find({});
    res.render('index', { menuItems });
});

// Route to handle starting a new session
router.post('/start-session', (req, res) => {
    req.session.calculation = {
        items: [],
        totalIngredients: {},
        totalEnergy: 0
    };
    res.json({ message: 'New calculation session started.' });
});

// Route to handle adding items to the current session
router.post('/add-item', async (req, res) => {
    const { menuItemId, numItems } = req.body;

    if (!menuItemId || !numItems) {
        return res.json({ message: 'Please select a menu item and enter the number of items.' });
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
        return res.json({ message: 'Menu item not found.' });
    }

    // Calculate total quantities and energy used for this item
    const totalQuantities = menuItem.quantities.map(quantity => quantity * numItems);
    const totalEnergyUsed = menuItem.energyUsed * numItems;

    // Update session data
    req.session.calculation.items.push({
        name: menuItem.name,
        quantities: totalQuantities,
        energyUsed: totalEnergyUsed
    });

    // Update total ingredients and energy
    menuItem.ingredients.forEach((ingredient, index) => {
        if (req.session.calculation.totalIngredients[ingredient]) {
            req.session.calculation.totalIngredients[ingredient] += totalQuantities[index];
        } else {
            req.session.calculation.totalIngredients[ingredient] = totalQuantities[index];
        }
    });
    req.session.calculation.totalEnergy += totalEnergyUsed;

    res.json({ message: 'Item added to session.' });
});

// Route to summarize the session results
router.get('/summarize-session', (req, res) => {
    if (!req.session.calculation) {
        return res.json({ message: 'No active calculation session.' });
    }

    const summary = {
        totalIngredients: req.session.calculation.totalIngredients,
        totalEnergy: req.session.calculation.totalEnergy
    };

    res.json({ message: 'Session summary', summary });
});

module.exports = router;
