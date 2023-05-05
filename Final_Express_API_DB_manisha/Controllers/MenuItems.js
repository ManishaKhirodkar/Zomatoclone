const MenuItems = require('../Models/MenuItems');

exports.getMenuItemsByRes = (req, res) => {
    const { resId } = req.params;
    MenuItems.find({ restaurantId: resId })
        .then(response => {
            res.status(200).json(
                {
                    message: "MenuItems Fetched Succesfully",
                    menuItems: response
                }
            )
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}