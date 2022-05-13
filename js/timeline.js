function getAllEvents() {
    let events = getRequestSync("/timeline/getAllEvents");
    console.log(events);   
    const template = document.querySelector('#timelineNodeTemplate');
    const parent = document.querySelector("#timeline");
    
    for (let eventI in events) {
        let event = events[eventI];
        let cNode = template.content.cloneNode(true);
        
        cNode.querySelector('.tType').textContent = `Type: ${event.type}`;
        cNode.querySelector('.tAbility').textContent = `Ability: ${event.ability}`;
        cNode.querySelector('.tMove').textContent = `Move: ${event.move}`;
        cNode.querySelector('.tHits').textContent = `Hits: ${event.hits}`;
        cNode.querySelector('.tTime').textContent = `Time: ${event.time}`;

        cNode.querySelector('.tButtonDelete').addEventListener('click', () => {
            //console.log(event._id);
            deleteTimelineNode(event._id);
        })

        parent.appendChild(cNode);
    }
}

function deleteTimelineNode(id) {
    putRequestSync(`/timeline/delete/${id}`);
}

getAllEvents();