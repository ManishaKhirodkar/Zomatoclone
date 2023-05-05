const Locations = require('../Models/Locations');

exports.getLocations = (req, res) => {
    Locations.find()
        .then(response => {
            res.status(200).json(
                {
                    message: "Locations fetched suceesfully",
                    locations: response
                }
            )
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};