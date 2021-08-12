const jwt = require('jsonwebtoken');
const { tokenAuthenticator } = require('./middleware');
const User = require('./schema/User');

module.exports = function (app) {
  
    app.post('/api/register', async (req, res) => {
        const { name, email, password } = req.body;

        const user = await User.findOne({
            email: email
        }).exec();

        if (user) {
            res.sendStatus(409)
        } else {
            const newUser = new User({
                name: name,
                email: email
            })
            newUser.password = newUser.generateHash(password);
            newUser.save((err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.sendStatus(201);
                }
            })
        }
    });

    app.post('/api/login', async (req, res) => {
        const {email, password} = req.body;

        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i")}
        }).exec();

        if (user && user.validPassword(password)) {
            const token = jwt.sign(user.email, process.env.SECRET)
            res.json({token: token})
        } else {
            res.sendStatus(404);
        }
    })

    app.get('/api/verifytoken', tokenAuthenticator, async (req, res) => {
        res.sendStatus(204);
    })

    app.get('/api/test', tokenAuthenticator, async (req, res) => {
        res.send(req.email);
    })

    app.post('/api/start-conversation', tokenAuthenticator, async (req, res) => {
        
    })

};