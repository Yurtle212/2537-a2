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