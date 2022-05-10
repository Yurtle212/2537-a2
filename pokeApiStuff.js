function getRequest(url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    if (xmlHttp.responseText[0] == 'N') {
        return false;
    }
    return JSON.parse(xmlHttp.responseText);
}

async function getRequestAsync(url) {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, true);
        xmlHttp.onload = function (e) {
            resolve(JSON.parse(xmlHttp.responseText));
        }
        xmlHttp.send(null);
    });
}

async function getRandomPokemon(data) {
    return new Promise(resolve => {
        async function doIt() {
            let randomPokemon = data.results[Math.floor(Math.random() * data.results.length)]
            let res = await getRequestAsync(randomPokemon.url);
            
            resolve(res);
        }
        doIt();
    });
}

function getPokemonArtUrl(json) {
    return json["sprites"]["other"]["official-artwork"]["front_default"];
}

function getPokemonName(json) {
    return json["name"];
}

function getPokemonStats(json) {
    return json["stats"];
}

function validatePokemon(name) {
    let res = getRequest("https://pokeapi.co/api/v2/pokemon/" + name);
    return res == null ? false : true;
}

function getPokemonsByType(type) {
    let res = getRequest("https://pokeapi.co/api/v2/type/" + type);
    return res["pokemon"];
}

function getPokemonsByAbility(ability) {
    let res = getRequest("https://pokeapi.co/api/v2/ability/" + ability);
    return res["pokemon"];
}

function getPokemonsByMove(move) {
    let res = getRequest("https://pokeapi.co/api/v2/move/" + move);
    return res["learned_by_pokemon"];
}

function getMoveType(move) {
    return new Promise(resolve => {
        async function doIt() {
            let res = await getRequestAsync("https://pokeapi.co/api/v2/move/" + move);
            resolve(await getRequestAsync(res["type"]["url"]));
        }
        doIt();
    });
}

function getAbilityDescription(url) {
    return new Promise(resolve => {
        async function doIt() {
            let res = await getRequestAsync(url);
            for (let i = 0; i < res.flavor_text_entries.length; i++) {
                if (res.flavor_text_entries[i].language.name == "en") {
                    resolve(res.flavor_text_entries[i].flavor_text);
                }
            }
        }
        doIt();
    });
}

function getTypeColour(type) {
    const colourDict = {
        "bug": "9cac1e",
        "dark": "413325",
        "dragon": "503ca9",
        "electric": "ffbd14",
        "fairy": "f6b1f6",
        "fighting": "4a1101",
        "fire": "c32406",
        "flying": "8c9eef",
        "ghost": "5a5b9a",
        "grass": "87ce4e",
        "ground": "d0b467",
        "ice": "6dd3f5",
        "normal": "c8c2b9",
        "poison": "824385",
        "psychic": "df4e7f",
        "rock": "9e8645",
        "steel": "908da3",
        "water": "4091de",
        "unknown": "68a090"
    }
    return "#" + colourDict[type.toLowerCase()];
}