const express = require('express');
const app = express();
const fs = require("fs");
const BodyParser = require('body-parser')
const res = require('express/lib/response');
const session = require("express-session");

const mongoose = require('mongoose');

const  mongoAtlasUri = "mongodb+srv://pokeapiClient:xqgp2lbm9jAJ2EGq@pokeapithing.gtend.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoAtlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const timelineSchema = new mongoose.Schema({
    userID: Number,
    ability: String,
    type: String,
    move: String,
    hits: Number,
    time: String
});

const userSchema = new mongoose.Schema({
    userID: Number,
    username: String,
    password: String
});

const cartSchema = new mongoose.Schema({
    userID: Number,
    pokemonList: Array
});

const orderSchema = new mongoose.Schema({
    userID: Number,
    pokemonList: Array,
    timestamp: {type: Date, default: Date.now}
});

app.use(session({
    secret: "1746598729385744815909",
    name: "PokeSession",
    resave: false,
    saveUninitialized: false
}));

const timelineModel = mongoose.model("timelines", timelineSchema);
const userModel = mongoose.model("users", userSchema);
const cartModel = mongoose.model("carts", cartSchema);
const orderModel = mongoose.model("orders", orderSchema);

const pokemon = JSON.parse(fs.readFileSync("./data/pokemon.json"));
const move = JSON.parse(fs.readFileSync("./data/move.json"));
const ability = JSON.parse(fs.readFileSync("./data/ability.json"));
const type = JSON.parse(fs.readFileSync("./data/type.json"));

var bodyParser = BodyParser.json({
    extended: false
})

function reqLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/profile');
        // res.send({
        //     "Result": "Failed",
        //     "msg": "Not logged in."
        // });
        return;
    }
}

app.use("/html", express.static("./html"));
app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));
app.use("/img", express.static("./img"));

app.get('/', function (req, res) {
    let doc = fs.readFileSync('./html/index.html', "utf8");
    res.send(doc);
});

app.get('/pokemon', function (req, res) {
    let doc = fs.readFileSync('./html/pokemon.html', "utf8");
    res.send(doc);
});

app.get('/cart', reqLogin, function (req, res) {
    let doc = fs.readFileSync('./html/cart.html', "utf8");
    res.send(doc);
});

app.get('/memory', function (req, res) {
    let doc = fs.readFileSync('./html/memory.html', "utf8");
    res.send(doc);
});

app.get('/profile', function (req, res) {
    let doc;
    if (req.session.loggedIn) {
        doc = fs.readFileSync('./html/profile.html', "utf8");
    } else {
        doc = fs.readFileSync('./html/login.html', "utf8");
    }
    res.send(doc);
});

// app.get('/signup', function (req, res) {
//     let doc = fs.readFileSync('./html/signup.html', "utf8");
//     res.send(doc);
// });

// app.get('/login', function (req, res) {
//     let doc = fs.readFileSync('./html/login.html', "utf8");
//     res.send(doc);
// });

//#region TIMELINE

app.get('/timeline/getAllEvents', reqLogin, function (req, res) {
    let uid = req.session.uid;
    timelineModel.find({'userID': uid}, function (err, data) {
        res.send(data);
    });
});

app.put('/timeline/insert', reqLogin, bodyParser, function (req, res) {
    //console.log("body: " + JSON.stringify(req.body));
    let data = {
        'userID': req.session.uid,
        'ability': req.body.ability,
        'move': req.body.move,
        'type': req.body.type,
        'time': req.body.time,
        'hits': req.body.hits
    }

    timelineModel.create(data, function (err, data) {
        res.send(data);
    });
});

app.put('/timeline/delete/:id', reqLogin, function (req, res) {
    timelineModel.deleteOne({
        id: req.params.id
    }, function (err, data) {
        res.send({
            "result": "Success",
            "msg": "Deleted Successfully."
        })
    });
});

//#endregion

//#region API

app.get('/api/randomPokemon', (req, res) => {
    let randNum = Math.floor(Math.random() * Object.keys(pokemon).length) + 1;
    res.send(pokemon[Object.keys(pokemon)[randNum]]);
});

app.get('/api/pokemon', (req, res) => {
    sendable = {
        "results": []
    }
    for (m in pokemon) {
        sendable.results.push({
            name: m,
            url: `/api/pokemon/${pokemon[m].id}`
        });
    }
    res.send(sendable);
});

app.get('/api/pokemon/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.send(pokemon[req.params.id]);
    } else {
        let name = Object.keys(pokemon).find(key => pokemon[key]["id"] == req.params.id)
        res.send(pokemon[name])
    }
});

app.get('/api/move', (req, res) => {
    sendable = {
        "results": []
    }
    for (m in move) {
        sendable.results.push({
            name: m,
            url: `/api/move/${move[m].id}`
        });
    }
    res.send(sendable);
});

app.get('/api/move/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.send(move[req.params.id]);
    } else {
        let name = Object.keys(move).find(key => move[key]["id"] == req.params.id)
        res.send(move[name])
    }
});

app.get('/api/ability', (req, res) => {
    sendable = {
        "results": []
    }
    for (m in ability) {
        sendable.results.push({
            name: m,
            url: `/api/ability/${ability[m].id}`
        });
    }
    res.send(sendable);
});

app.get('/api/ability/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.send(ability[req.params.id]);
    } else {
        let name = Object.keys(ability).find(key => ability[key]["id"] == req.params.id)
        res.send(ability[name])
    }
});

app.get('/api/type', (req, res) => {
    sendable = {
        "results": []
    }
    for (m in type) {
        sendable.results.push({
            name: m,
            url: `/api/ability/${type[m].id}`
        });
    }
    res.send(sendable);
});

app.get('/api/type/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.send(type[req.params.id]);
    } else {
        let name = Object.keys(type).find(key => type[key]["id"] == req.params.id)
        res.send(type[name])
    }
});

//#endregion

//#region Accounts

app.post('/accounts/signup', bodyParser, async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    let newestUser = await userModel.find().sort({
        userID: -1
    }).limit(1);
    let newUID = newestUser.length > 0 ? newestUser[0].userID + 1 : 0;

    let inData = {
        'userID': newUID,
        'username': req.body.username,
        'password': req.body.password
    }

    userModel.create(inData, function (err, data) {
        req.session.loggedIn = true;
        req.session.uid = newUID;
        req.session.username = req.body.username,

        res.send({
            "Result": "Success",
            "msg": "Account Created.",
            'data': data
        });
    });
});

app.get('/accounts/getUserInfo', reqLogin, (req, res) => {
    let uid = req.session.uid;
    userModel.find({
        'userID': uid
    }, function (err, data) {
        res.send(data);
    });
});

app.post('/accounts/login', bodyParser, (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    userModel.find({
        'username': username,
        'password': password
    }, function (err, data) {
        if (data.length > 0) {
            req.session.loggedIn = true;
            req.session.username = data[0].username;
            req.session.uid = data[0].userID;

            res.send({
                "Result": "Success",
                "msg": "Logged in."
            });
        } else {
            res.send({
                "Result": "Failed",
                "msg": "Account not found."
            });
        }
    });
});

app.get('/accounts/logout', reqLogin, (req, res) => {
    req.session.destroy(function (error) {
        if (error) {
            console.log('aaa');
            res.status(400).send({
                "Result": "Failed",
                "msg": "Could not log out."
            })
        } else {
            res.status(200).send({
                "Result": "Succeeded",
                "msg": "Successfully logged out."
            })
        }
    });
});

//#endregion

//#region CARTS

app.put('/cart/add', reqLogin, bodyParser, (req, res) => {
    let pokemonID = req.body.pokemonID;
    cartModel.find({'userID': req.session.uid}, function (err, data) {
        let cart = [];
        if (data.length == 0) {
            let inData = {
                'userID': req.session.uid,
                'pokemonList': []
            }
        
            cartModel.create(inData, function (err, data) {
                console.log(data);
            });
        } else {
            cart = data[0].pokemonList;
        }
        //console.log(cart);
        cart.push(pokemonID);
        cartModel.updateOne({userID: req.session.uid}, {
            $set: { 'pokemonList': cart }
        }, function (err, uData) {
            console.log(uData);
            res.send(uData)
        });
    });
});

app.put('/cart/order', reqLogin, (req, res) => {
    cartModel.find({'userID': req.session.uid}, function (err, data) {
        if (data.length == 0 || data[0].pokemonList.length == 0) { 
            res.send({"result": 'cart is empty.'});
            return;
        }
        let cart = data[0].pokemonList;
        //console.log(cart);
        
        let inData = {
            'userID': req.session.uid,
            'pokemonList': cart
        }
    
        orderModel.create(inData, function (err, data) {
            //console.log(data);
        });

        cartModel.updateOne({'userID': req.session.uid}, {
            $set: { 'pokemonList': [] }
        }, function (err, uData) {
            // console.log(err);
            console.log(uData);
            res.send(cart)
        });
    });
});

app.get('/cart/getCart', reqLogin, (req, res) => {
    cartModel.find({'userID': req.session.uid}, function (err, data) {
        let cart = [];
        if (data.length == 0) {
            let inData = {
                'userID': req.session.uid,
                'pokemonList': []
            }
        
            cartModel.create(inData, function (err, data) {
                //console.log(data);
            });
        } else {
            cart = data[0].pokemonList;
        }

        res.send(cart);
    });
});

app.get('/cart/getOrders', reqLogin, (req, res) => {
    orderModel.find({'userID': req.session.uid}, function (err, data) {
        res.send(data);
    });
});

//#endregion

app.use(function (req, res, next) {
    res.status(404).send('Page not found.');
});

let port = 5100;
app.listen(port, console.log("Listening on port " + port));