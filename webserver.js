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
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
});

app.put('/timeline/insert', bodyParser, function (req, res) {
    console.log("body: " + JSON.stringify(req.body));
    let data = {
        'ability': req.body.ability,
        'move': req.body.move,
        'type': req.body.type,
        'time': req.body.time,
        'hits': req.body.hits
    }

    timelineModel.create(data, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
});

app.put('/timeline/delete/:id', function (req, res) {
    timelineModel.deleteOne({id: req.params.id}, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
        }
        res.send({"result": "Success", "msg": "Deleted Successfully."})
    });
});

//#endregion

//#region API

app.get('/api/randomPokemon', (req, res) => {
    
});

app.get('/api/pokemon/:id', (req, res) => {

});

//#endregion

app.use(function (req, res, next) {
    res.status(404).send('Page not found.');
});

let port = 5100;
app.listen(port, console.log("Listening on port " + port));