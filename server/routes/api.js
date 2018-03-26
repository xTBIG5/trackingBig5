const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/big5s', (req, res) => {
    connection((db) => {
        db.db('tbig5').collection('big5s')
            .find()
            .toArray()
            .then((big5s) => {
                response.data = big5s;
                console.log(big5s[5]);
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});
router.get('/hero/:id', (req, res) => {
    connection((db) => {
        db.db('myapp').collection('heroes')
            .findOne({_id:+req.params['id']})
            .then((user) => {
                response.data = user;
                console.log(user);
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
                console.log(err);
            });
    });
});
router.post('/users', function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;

    res.send(user_id + ' ' + token + ' ' + geo);
});

module.exports = router;