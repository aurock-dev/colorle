document.addEventListener('DOMContentLoaded', randomColor, false);
document.querySelector('#guess-button').addEventListener('click', guessedColor, false);

var rColorToGuess;
var bColorToGuess;
var gColorToGuess;

var previousRColor = parseInt(document.querySelector('#r-color').value);
var previousGColor = parseInt(document.querySelector('#g-color').value);
var previousBColor = parseInt(document.querySelector('#b-color').value);

var tries = 0; 
var rTries = 0;
var gTries = 0;
var bTries = 0;

function getTodayDate(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDay();

    return [year, month, day]
}

function randomColor(){
    checkIfAlreadyFinished();
    let timestamp = new Date(getTodayDate()[0], getTodayDate()[1], getTodayDate()[2]).getTime();

    let seedRng = new Math.seedrandom(timestamp);
    let rRandom = Math.floor(seedRng() * 255) + 0;
    let gRandom = Math.floor(seedRng() * 255) + 0;
    let bRandom = Math.floor(seedRng() * 255) + 0;

    rColorToGuess = rRandom;
    gColorToGuess = gRandom;
    bColorToGuess = bRandom;

    let colorToGuess = `rgb(${rRandom}, ${gRandom}, ${bRandom})`;
    document.body.style.backgroundColor = colorToGuess;
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
    compareRColor(rColor);
    compareGColor(gColor);
    compareBColor(bColor);
}

function compareRColor(rColor){
    if (rColor > rColorToGuess){
        document.querySelector('#r-color-hint').textContent = "↓";
    }
    else if (rColor < rColorToGuess){
        document.querySelector('#r-color-hint').textContent = "↑";
    }
    else{
        document.querySelector('#r-color-hint').textContent = "✔";
    }

    if (rColor !== previousRColor){
        rTries += 1;
        previousRColor = rColor;
    }
}

function compareGColor(gColor){
    if (gColor > gColorToGuess){
        document.querySelector('#g-color-hint').textContent = "↓";
    }
    else if (gColor < gColorToGuess){
        document.querySelector('#g-color-hint').textContent = "↑";
    }
    else{
        document.querySelector('#g-color-hint').textContent = "✔";
    }

    if (gColor !== previousGColor){
        gTries += 1;
        previousGColor = gColor;
    }
}

function compareBColor(bColor){
    if (bColor > bColorToGuess){
        document.querySelector('#b-color-hint').textContent = "↓";
    }
    else if (bColor < bColorToGuess){
        document.querySelector('#b-color-hint').textContent = "↑";
    }
    else{
        document.querySelector('#b-color-hint').textContent = "✔";
    }

    if (bColor !== previousBColor){
        bTries += 1;
        previousBColor = bColor;
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

        document.querySelector('#r-tries-number').textContent = rTries;
        document.querySelector('#g-tries-number').textContent = gTries;
        document.querySelector('#b-tries-number').textContent = bTries;
        document.querySelector('#colors-tries-container').classList.remove('hidden');

        document.querySelector('#guess-button').disabled = true;
        updateLocalStorageWithFinishedData();
    }
}

function checkIfAlreadyFinished(){
    let isFinished = getLocalStorage().isFinished;

    if (isFinished === 'true'){
        document.querySelector('#state-game-text').textContent = `Yay! You finish in ${getLocalStorage().tries} tries!`;
        let hexColor = rgbToHex(getLocalStorage().rColorToGuess, getLocalStorage().gColorToGuess, getLocalStorage().bColorToGuess);
        document.querySelector('#color-reminder').textContent = `RGB : rgb(${getLocalStorage().rColorToGuess}, ${getLocalStorage().gColorToGuess}, ${getLocalStorage().bColorToGuess}) / HEX: ${hexColor}`;
        document.querySelector('#color-reminder-container').classList.remove('hidden');

        document.querySelector('#r-tries-number').textContent = getLocalStorage().rTries;
        document.querySelector('#g-tries-number').textContent = getLocalStorage().gTries;
        document.querySelector('#b-tries-number').textContent = getLocalStorage().bTries;
        document.querySelector('#colors-tries-container').classList.remove('hidden');

        document.querySelector('#r-color').value = getLocalStorage().rColorToGuess;
        document.querySelector('#g-color').value = getLocalStorage().gColorToGuess;
        document.querySelector('#b-color').value = getLocalStorage().bColorToGuess;

        document.querySelector('#guess-button').disabled = true;
    }
    else{
        setLocalStorage();
    }
}

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

function getDateForLS(){
    return `${getTodayDate()[0]}-${getTodayDate()[1]}-${getTodayDate()[2]}`;
}

function setLocalStorage(){
    let data = {
        isFinished: 'false',
        'tries': 0,
        'rTries': 0,
        'gTries': 0,
        'bTries': 0,
        'rColorToGuess': 0,
        'gColorToGuess': 0,
        'bColorToGuess': 0 
    }

    localStorage.setItem(getDateForLS(), JSON.stringify(data));
}

function updateLocalStorageWithFinishedData(){
    let data = {
        isFinished: 'true',
        'tries': tries,
        'rTries': rTries,
        'gTries': gTries,
        'bTries': bTries,
        'rColorToGuess': rColorToGuess,
        'gColorToGuess': gColorToGuess,
        'bColorToGuess': bColorToGuess 
    }
    
    localStorage.setItem(getDateForLS(), JSON.stringify(data));
}

function getLocalStorage(){
    let data = JSON.parse(localStorage.getItem(getDateForLS()));
    return data;
}
