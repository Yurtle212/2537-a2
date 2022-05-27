hasFlippedCard = false;


firstCard = undefined
secondCard = undefined

async function generateCards(w, h) {
    let cards = []

    for (let row = 0; row < h; row++) {
        let rowTemplate = $($("#cardRowTemplate").html());
        for (let col = 0; col < w; col++) {
            let cardTemplate = $($("#cardTemplate").html());
            rowTemplate.append(cardTemplate);
            cards.push(cardTemplate);
        }
        $('.gameGrid').append(rowTemplate);
    }

    let data = await getRequestAsync("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    for (let i = 0; i < ((w*h)/2); i++) {
        if (cards.length <= 1) {
            break;
        }
        let random1 = Math.floor(Math.random() * cards.length);
        let random2 = Math.floor(Math.random() * cards.length);

        while (random1 == random2 & cards.length > 1) {
            random2 = Math.floor(Math.random() * cards.length);
        }

        let response = await getRandomPokemon(data);
        let art = getPokemonArtUrl(response);
        while (!art) {
            response = await getRandomPokemon(data);
            art = getPokemonArtUrl(response);
        }

        cards[random1].children('.frontFace').attr('src', getPokemonArtUrl(response));
        let second = cards[random2];
        cards[random2].children('.frontFace').attr('src', getPokemonArtUrl(response));
        cards.splice(random1, 1);
        cards.splice(cards.indexOf(second), 1);
    }
}

let stopTimer = false;
let lost = false;

async function completeGame() {
    stopTimer = true;
    $("#timer").html("You Win!");
}

async function timer(time) {
    const timer = $("#timer");
    while (time > 0 && !stopTimer) {
        $(timer).html('Time Left: ' + time + 's')
        await new Promise(r => setTimeout(r, 10));
        time = (time - .01).toFixed(2);
    }
    if (!stopTimer) {
        lost = true;
        $(timer).html('You lose :(');
    }
}

async function setup(){
    let searchParams = new URLSearchParams(window.location.search)

    if (!searchParams.has('w') || !searchParams.has('h') || !searchParams.has('t')) {
        window.location.replace('/memory?w=5&h=2&t=60');
    }

    let width = searchParams.get('w');
    let height = searchParams.get('h');
    let time = searchParams.get('t');

    switch (time) {
        case '60':
            $("#difficulty").val('easy');
            break;
        case '30':
            $("#difficulty").val('medium');
            break;
        case '20':
            $("#difficulty").val('hard');
            break;
    }

    $("#difficulty").on('change', () => {
        let diff = $('#difficulty').find(":selected").attr('value');
        let newURL;

        switch(diff) {
            case 'easy': 
                newURL = '/memory?w=5&h=2&t=60';
                break;
            case 'medium':
                newURL = '/memory?w=5&h=2&t=30';
                break;
            case 'hard':
                newURL = '/memory?w=5&h=2&t=20';
                break;
            case 'default':
                window.location.reload();
        }
        window.location.assign(newURL);
    });

    await generateCards(width, height);
    let comparing = false;
    let finalNum = Math.floor((width*height)/2);
    let matches = 0;
    timer(time);

    $(".card").on("click", async function (){
        if (comparing || $(this).hasClass("matched") || $(this).hasClass("flip") || lost) { return; }
        $(this).toggleClass("flip")

        if ($(this).find('.frontFace').attr("src") == '/img/Yurtle.png') { return; }

        if(!hasFlippedCard) {
            // this is the first card
            firstCard = $(this).find('.frontFace')[0]
            // console.log(firstCard);
            hasFlippedCard = true;
        } else {
            // 2nd card
            secondCard =  $(this).find('.frontFace')[0]
            hasFlippedCard = false;

            if ($(firstCard).attr("src") == $(secondCard).attr("src")) {
                $(firstCard).parent().toggleClass("matched");
                $(secondCard).parent().toggleClass("matched");
                matches++;
                if (matches >= finalNum) {
                    console.log("Game Completed.");
                    completeGame();
                }
            } else {
                comparing = true;
                await new Promise(r => setTimeout(r, 1000));
                comparing = false;
                $(firstCard).parent().toggleClass("flip");
                $(secondCard).parent().toggleClass("flip");
            }
        }
    })
}


$(document).ready(setup)