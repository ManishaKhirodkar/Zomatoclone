const Orders=require('../Models/Orders');

exports.saveOrderDetails=(req,res)=>{
    const { placedBy, placedByUserId, placedOn, items,Amount,restaurantId } = req.body;

    const ordersObj = new Orders({
        placedBy, placedByUserId, placedOn, items,Amount,restaurantId
    });
    ordersObj.save()
        .then(response => {
            res.status(200).json(
                {
                    message: "Orders Added suceesfully",
                    orders: response
                }
            )
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}

exports.getOrdersByUserId=(req,res)=>{
    const {userId} = req.params;
    Orders.find({ placedByUserId: userId })
        .then(response => {
            res.status(200).json(
                {
                    message: "Orders fetched suceesfully",
                    orders: response
                }
            )
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}