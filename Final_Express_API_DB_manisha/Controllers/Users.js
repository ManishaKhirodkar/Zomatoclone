const Users = require('../Models/Users');

exports.userLogin = (req, res) => {
    const { user, pwd } = req.body;
    Users.find({
        username: user,
        password: pwd
    })
        .then(response => {
            let msg, auth;
            if (response.length == 0) {
                msg = "User not Authenticated suceesfully";
                auth = false;
            }
            else {
                msg = "User Authenticated suceesfully";
                auth = true;
            }
            res.status(200).json(
                {
                    message: msg,
                    user: response,
                    isAuthenticated: auth
                }
            )
        })
        .catch(err => {
            res.staus(500).json({ error: err })
        })
}

exports.userSignUp = (req, res) => {
    const { user, pwd, fn, ln } = req.body;

    const userObj = new Users({
        username: user,
        password: pwd,
        firstname: fn,
        lastname: ln
    });

    Users.find({
        username: user,
    })
        .then(response => {
            if (response.length == 0) {
                userObj.save()
                    .then(response => {
                        res.status(200).json(
                            {
                                message: "User Added suceesfully",
                                user: response
                            }
                        )
                    })
            }
            else {
                res.staus(200).json(
                    {
                        message: "User Already exists.."
                    }
                )
            }
        })
        .catch (err => {
    res.status(500).json({ error: err })
})
}