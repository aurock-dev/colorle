document.addEventListener('DOMContentLoaded', randomColor, false);
document.querySelector('#guess-button').addEventListener('click', guessedColor, false);

var rColorToGuess;
var bColorToGuess;
var gColorToGuess;
var guessNumber = 0

function randomColor(){
    let color = uniqolor.random({format: 'rgb'});
    let colorValues = color.color.match(/\d+/g);
    rColorToGuess = parseInt(colorValues[0]);
    gColorToGuess = parseInt(colorValues[1]);
    bColorToGuess = parseInt(colorValues[2]);

    document.body.style.backgroundColor = color.color;
    document.body.style.color = (rColorToGuess * 0.299 + gColorToGuess * 0.587 + bColorToGuess * 0.114) > 186 ? "#000000" : "#ffffff";
}

function guessedColor(){
    let rColor = parseInt(document.querySelector('#r-color').value);
    let gColor = parseInt(document.querySelector('#g-color').value);
    let bColor = parseInt(document.querySelector('#b-color').value);
    let color = `rgb(${rColor}, ${gColor}, ${bColor})`;
    document.querySelector('#guessed-color').style.backgroundColor = color;

    compareColors(rColor, gColor, bColor);
    updateTries();
    checkIfFinish(rColor, gColor, bColor);
}

function compareColors(rColor, gColor, bColor){
    if (rColor > rColorToGuess){
        document.querySelector('#r-color-hint').textContent = "↓";
    }
    else if (rColor < rColorToGuess){
        document.querySelector('#r-color-hint').textContent = "↑";
    }
    else{
        document.querySelector('#r-color-hint').textContent = "✔";
    }

    if (gColor > gColorToGuess){
        document.querySelector('#g-color-hint').textContent = "↓";
    }
    else if (gColor < gColorToGuess){
        document.querySelector('#g-color-hint').textContent = "↑";
    }
    else{
        document.querySelector('#g-color-hint').textContent = "✔";
    }

    if (bColor > bColorToGuess){
        document.querySelector('#b-color-hint').textContent = "↓";
    }
    else if (bColor < bColorToGuess){
        document.querySelector('#b-color-hint').textContent = "↑";
    }
    else{
        document.querySelector('#b-color-hint').textContent = "✔";
    }
}

function updateTries(){
    tries += 1;
    document.querySelector('#tries-number').textContent = tries;
}

function checkIfFinish(rColor, gColor, bColor){
    if (rColor === rColorToGuess && gColor === gColorToGuess && bColor === bColorToGuess){
        document.querySelector('#state-game-text').textContent = `Yay! You finish in ${tries} tries!`;
        let hexColor = rgbToHex(rColorToGuess, gColorToGuess, bColorToGuess);
        document.querySelector('#color-reminder').textContent = `RGB : rgb(${rColorToGuess}, ${gColorToGuess}, ${bColorToGuess}) / HEX: ${hexColor}`;
        document.querySelector('#color-reminder-container').classList.remove('hidden');
    }
}

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}