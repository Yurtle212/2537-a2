function toTitleCase(str) {
    // Didn't want to figure this out myself, https://stackoverflow.com/a/40111894
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

function compareThings(t1, t2) {
    return t1.name.localeCompare(t2.name);
}

function populateSelector(parent, url) {
    const response = getRequest(url);

    let allEntries = [];
    for (let i = 0; i < response.count; i++) {
        allEntries.push(response["results"][i]);
    }
    allEntries.sort(compareThings);

    for (let i = 0; i < allEntries.length; i++) {
        let newNode = document.createElement("option");
        newNode.value = allEntries[i].name;
        newNode.innerHTML = toTitleCase(allEntries[i].name);
        parent.appendChild(newNode);
    }
}