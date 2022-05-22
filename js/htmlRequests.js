function getRequestSync(url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

async function getRequestAsync(url) {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
        console.log(xmlHttp.responseText);
        resolve(JSON.parse(xmlHttp.responseText));
    });
}

function putRequestSync(url, data) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("PUT", url, false);
    xmlHttp.setRequestHeader("Accept", "application/json");
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    console.log(data);
    xmlHttp.send(JSON.stringify(data));
    return JSON.parse(xmlHttp.responseText);
}

function putRequestAsync(url, data) {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("PUT", url, false);
        xmlHttp.setRequestHeader("Accept", "application/json");
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        console.log(data);
        xmlHttp.send(JSON.stringify(data));
        resolve(JSON.parse(xmlHttp.responseText));
    });
}

function postRequestAsync(url, data) {
    return new Promise(resolve => {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", url, false);
        xmlHttp.setRequestHeader("Accept", "application/json");
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        console.log(data);
        xmlHttp.send(JSON.stringify(data));
        resolve(JSON.parse(xmlHttp.responseText));
    });
}