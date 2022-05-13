const express = require('express');
const app = express();
const fs = require("fs");
const BodyParser = require('body-parser')
const res = require('express/lib/response');

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/timelineDB",
{ useNewUrlParser: true, useUnifiedTopology: true });
const timelineSchema = new mongoose.Schema({
    ability: String,
    type: String,
    move: String,
    hits: Number,
    time: String
});

const timelineModel = mongoose.model("timelines", timelineSchema);

const pokemon = JSON.parse(fs.readFileSync("./data/pokemon.json"));
const move = JSON.parse(fs.readFileSync("./data/move.json"));
const ability = JSON.parse(fs.readFileSync("./data/ability.json"));
const type = JSON.parse(fs.readFileSync("./data/type.json"));

var bodyParser = BodyParser.json({
    extended: false
})

app.use("/html", express.static("./html"));
app.use("/css", express.static("./css"));
app.use("/js", express.static("./js"));

app.get('/', function (req, res) {
    let doc = fs.readFileSync('./html/index.html', "utf8");
    res.send(doc);
});

app.get('/pokemon', function (req, res) {
    let doc = fs.readFileSync('./html/pokemon.html', "utf8");
    res.send(doc);
});

app.get('/timeline', function (req, res) {
    let doc = fs.readFileSync('./html/timelines.html', "utf8");
    res.send(doc);
});

//#region TIMELINE

app.get('/timeline/getAllEvents', function (req, res) {
    timelineModel.find({}, function (err, data) {
        res.send(data);
    });
});

app.put('/timeline/insert', bodyParser, function (req, res) {
    //console.log("body: " + JSON.stringify(req.body));
    let data = {
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

app.put('/timeline/delete/:id', function (req, res) {
    timelineModel.deleteOne({id: req.params.id}, function (err, data) {
        res.send({"result": "Success", "msg": "Deleted Successfully."})
    });
});

//#endregion

//#region API

app.get('/api/randomPokemon', (req, res) => {
    let randNum = Math.floor(Math.random() * Object.keys(pokemon).length) + 1;
    res.send(pokemon[Object.keys(pokemon)[randNum]]);
});

app.get('/api/pokemon', (req, res) => {
    sendable = {"results": []}
    for (m in pokemon) {
        sendable.results.push({name: m, url: `/api/pokemon/${pokemon[m].id}`});
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
    sendable = {"results": []}
    for (m in move) {
        sendable.results.push({name: m, url: `/api/move/${move[m].id}`});
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
    sendable = {"results": []}
    for (m in ability) {
        sendable.results.push({name: m, url: `/api/ability/${ability[m].id}`});
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
    sendable = {"results": []}
    for (m in type) {
        sendable.results.push({name: m, url: `/api/ability/${type[m].id}`});
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

app.use(function (req, res, next) {
    res.status(404).send('Page not found.');
});

let port = 5100;
app.listen(port, console.log("Listening on port " + port));