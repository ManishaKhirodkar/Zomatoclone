const Restaurants = require('../Models/Restaurants');

exports.getRestaurantsByLocId = (req, res) => {
    const { locId } = req.params;
    Restaurants.find({ location_id: locId })
        .then(response => {
            res.status(200).json(
                {
                    message: "Restaurants fetched suceesfully",
                    restaurants: response
                }
            )
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};

exports.getRestaurantsDetailsById = (req, res) => {
    const {resId }= req.params;
    Restaurants.findById(resId)
        .then(response => {
            res.status(200).json(
                {
                    message: "Restaurants fetched suceesfully",
                    restaurant: response
                }
            )
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};

exports.restaurantsFilter = (req, res) => {
    let { mealtype, location, cuisine, lcost, hcost, sort, page } = req.body;


    sort = sort ? sort : 1;
    page = page ? page : 1;

    const itemsPerPage = 2;

    let startIndex, endIndex;

    let filterObj = {};

    mealtype && (filterObj['mealtype_id'] = mealtype);
    location && (filterObj['location_id'] = location);
    cuisine && (filterObj['cuisine_id'] = { $in: cuisine });
    lcost && hcost && (filterObj['min_price'] = { $lte: hcost, $gte: lcost });

    Restaurants.find(filterObj).sort({ min_price: sort })
        .then(response => {
            //pagination logic - based on page, itemsPerPage

            startIndex = page * itemsPerPage - itemsPerPage;
            endIndex = page * itemsPerPage;

            const paginatedResponse = response.slice(startIndex, endIndex);

            let arr=[];
            for(let i=1;i<=Math.ceil(response.length / itemsPerPage);i++){
                arr.push(i);
            }

            res.status(200).json(
                {
                    message: "Restaurants fetched suceesfully",
                    restaurants: paginatedResponse,
                    totalItems : response.length,
                    pageCount: arr,
                    activePage:page
                }
            )
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};