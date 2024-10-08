document.addEventListener('DOMContentLoaded', setupPage, false);

let rColorToGuess;
let bColorToGuess;
let gColorToGuess;

let previousRColor = parseInt(document.querySelector('#r-color').value);
let previousGColor = parseInt(document.querySelector('#g-color').value);
let previousBColor = parseInt(document.querySelector('#b-color').value);

let tries = 0; 
let rTries = 0;
let gTries = 0;
let bTries = 0;

let dateNextColor = new Date;
dateNextColor.setHours(0, 0, 0);
dateNextColor.setDate(dateNextColor.getDate() + 1);

let buttonPressTimer;
let buttonPressTimerValue = 40;

function setupPage(){
    lucide.createIcons();
    createEventListenerForPlusMinus();

    window.addEventListener('click', (e) => {
        if (e.target.closest('svg') !== document.querySelector('[data-lucide="menu"]')) {
            document.querySelector('#menu').classList.add('hidden');
        }
    }, false)
    document.querySelector('#guess-button').addEventListener('click', guessedColor, false);
    document.querySelector('#r-range').addEventListener('input', updateInput, false);
    document.querySelector('#g-range').addEventListener('input', updateInput, false);
    document.querySelector('#b-range').addEventListener('input', updateInput, false);
    document.querySelectorAll('input[type="number"]').forEach((input) => {
        input.addEventListener('input', checkInput, false)
    });
    document.querySelectorAll('[data-lucide="copy"]').forEach((button) => {
        button.addEventListener('click', copy, false)
    })
    document.querySelector('[data-lucide="menu"]').addEventListener('click', toggleMenu, false)
    document.querySelectorAll('[name="menu-element"]').forEach((menuElement) => {
        menuElement.addEventListener('click', showDialog, false)  
    });
    document.querySelector('dialog').addEventListener('click', closeDialog, false)

    randomColor();
    timeLeft();
}

function timeLeft(){
    let dateNow = new Date;
    let remain = Math.floor(((dateNextColor - dateNow) / 1000));
    let hh = ("0" + parseInt((remain / 60 / 60) % 60)).slice(-2);
    let mm = ("0" + parseInt((remain / 60) % 60)).slice(-2);
    let ss = ("0" + parseInt(remain % 60)).slice(-2);

    let timeCounter = `${hh}:${mm}:${ss}`;
    document.querySelector('#time').textContent = timeCounter;
 
    setTimeout(timeLeft, 1000);
}

function getTodayDate(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    return [year, month, day]
}

function randomColor(){
    try {
        getLocalStorage()
        checkIfAlreadyFinished();
    } catch (error) {
        setLocalStorage()
    }

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
    document.querySelector('#tried-color').style.backgroundColor = color;

    compareColors(rColor, gColor, bColor);
    updateTries();
    checkIfFinish(rColor, gColor, bColor);
}

function compareColors(rColor, gColor, bColor){
    compareRColor(rColor);
    compareGColor(gColor);
    compareBColor(bColor);
    lucide.createIcons();
    // createEventListenerForPlusMinus();
}

function compareRColor(rColor){
    if (rColor > rColorToGuess){
        toHintDown('r');
    }
    else if (rColor < rColorToGuess){
        toHintUp('r');
    }
    else{
        toHintCheck('r');
    }

    if (rColor !== previousRColor){
        rTries += 1;
        previousRColor = rColor;
    }
}

function compareGColor(gColor){
    if (gColor > gColorToGuess){
        toHintDown('g');
    }
    else if (gColor < gColorToGuess){
        toHintUp('g');
    }
    else{
        toHintCheck('g');
    }

    if (gColor !== previousGColor){
        gTries += 1;
        previousGColor = gColor;
    }
}

function compareBColor(bColor){
    if (bColor > bColorToGuess){
        toHintDown('b');
    }
    else if (bColor < bColorToGuess){
        toHintUp('b');
    }
    else{
        toHintCheck('b');
    }

    if (bColor !== previousBColor){
        bTries += 1;
        previousBColor = bColor;
    }
}

function toHintUp(color){
    document.querySelector(`#${color}-color-hint`).innerHTML = "<i data-lucide='trending-up'></i>";
}

function toHintDown(color){
    document.querySelector(`#${color}-color-hint`).innerHTML = "<i data-lucide='trending-down'></i>";
}

function toHintCheck(color){
    document.querySelector(`#${color}-color-hint`).innerHTML = "<i data-lucide='badge-check'></i>";
    document.querySelector(`#${color}-plus-svg`).classList.add('disabledSVG');
    document.querySelector(`#${color}-minus-svg`).classList.add('disabledSVG');
    document.querySelector(`#${color}-plus`).removeEventListener('click', plusInput);
    document.querySelector(`#${color}-minus`).removeEventListener('click', minusInput);
    document.querySelector(`#${color}-minus`).removeEventListener('long-press', longPress);
    document.querySelector(`#${color}-range`).disabled = true;
    document.querySelector(`#${color}-color`).disabled = true;
}

function updateTries(){
    tries += 1;
    document.querySelector('#tries-number').textContent = tries;
}

function checkIfFinish(rColor, gColor, bColor){
    if (rColor === rColorToGuess && gColor === gColorToGuess && bColor === bColorToGuess){
        updateLocalStorageWithFinishedData();
        applyFinishGame();
    }
}

function checkIfAlreadyFinished(){
    if (getLocalStorage().isFinished === 'true'){
        applyFinishGame();
    }
}

function applyFinishGame(){
    document.querySelector('#state-game-text').textContent = `Yay! You finished in ${getLocalStorage().tries} tries!`;
    let hexColor = rgbToHex(getLocalStorage().rColorToGuess, getLocalStorage().gColorToGuess, getLocalStorage().bColorToGuess);
    document.querySelector('#color-reminder').textContent = `rgb(${getLocalStorage().rColorToGuess}, ${getLocalStorage().gColorToGuess}, ${getLocalStorage().bColorToGuess}) / ${hexColor}`;
    document.querySelector('#color-reminder-container').classList.remove('hidden');

    document.querySelector('#r-tries-number').textContent = getLocalStorage().rTries;
    document.querySelector('#g-tries-number').textContent = getLocalStorage().gTries;
    document.querySelector('#b-tries-number').textContent = getLocalStorage().bTries;
    document.querySelector('#colors-tries-container').classList.remove('hidden');

    document.querySelector('#r-color').value = getLocalStorage().rColorToGuess;
    document.querySelector('#g-color').value = getLocalStorage().gColorToGuess;
    document.querySelector('#b-color').value = getLocalStorage().bColorToGuess;

    document.querySelector('#r-color').disabled = true;
    document.querySelector('#g-color').disabled = true;
    document.querySelector('#b-color').disabled = true;

    document.querySelector('#r-color-hint').innerHTML = "<i data-lucide='badge-check'></i>";
    document.querySelector('#g-color-hint').innerHTML = "<i data-lucide='badge-check'></i>";
    document.querySelector('#b-color-hint').innerHTML = "<i data-lucide='badge-check'></i>";
    
    document.querySelector('#r-range').value = getLocalStorage().rColorToGuess;
    document.querySelector('#g-range').value = getLocalStorage().gColorToGuess;
    document.querySelector('#b-range').value = getLocalStorage().bColorToGuess;

    document.querySelector('#r-range').disabled = true;
    document.querySelector('#g-range').disabled = true;
    document.querySelector('#b-range').disabled = true;
    
    document.querySelector('#r-plus-svg').classList.add('disabledSVG');
    document.querySelector('#r-minus-svg').classList.add('disabledSVG');
    document.querySelector('#g-plus').classList.add('disabledSVG');
    document.querySelector('#g-minus').classList.add('disabledSVG');
    document.querySelector('#b-plus').classList.add('disabledSVG');
    document.querySelector('#b-minus').classList.add('disabledSVG');

    document.querySelectorAll('[data-lucide="minus"]').forEach((button) => {
        button.removeEventListener('click', minusInput)
    })
    document.querySelectorAll('[data-lucide="plus"]').forEach((button) => {
        button.removeEventListener('click', plusInput)
    })

    document.querySelector('#tried-color').style.backgroundColor = hexColor;

    document.querySelector('#guess-button').disabled = true;

    document.querySelectorAll('[data-lucide="copy"]').forEach((copyButton) => {
        copyButton.classList.remove('hidden');
    });
    
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

function updateInput(){
    document.querySelector(`#${this.id.replace('-range', '-color')}`).value = this.value;
}

function checkInput(){
    this.value = Math.min(255, Math.max(0, this.value));
}

function minusInput(e){
    let inputTarget = document.querySelector(`#${e.currentTarget.buttonId.replace('-minus', '-color')}`);
    let inputValue = parseInt(inputTarget.value);
    inputTarget.value = Math.max(inputValue - 1, 0);
    
    let rangeTarget = document.querySelector(`#${e.currentTarget.buttonId.replace('-minus', '-range')}`);
    let rangeValue = parseInt(rangeTarget.value);
    rangeTarget.value = Math.max(rangeValue - 1, 0);
}

function plusInput(e){
    let inputTarget = document.querySelector(`#${e.currentTarget.buttonId.replace('-plus', '-color')}`);
    let inputValue = parseInt(inputTarget.value);
    inputTarget.value = Math.min(inputValue + 1, 255);
    
    let rangeTarget = document.querySelector(`#${e.currentTarget.buttonId.replace('-plus', '-range')}`);
    let rangeValue = parseInt(rangeTarget.value);
    rangeTarget.value = Math.min(rangeValue + 1, 255);
}

function longPress(e){
    buttonId = e.currentTarget.id;
    buttonPressTimer = setInterval(function(){
        document.querySelector(`#${buttonId}`).click();
    }, buttonPressTimerValue)
}

function copy(){
    let copyText = this.closest('.reminderContainer').querySelector('[name="toCopy"]');
    navigator.clipboard.writeText(copyText.textContent);

    var snackbar = document.querySelector("#snackbar");
    snackbar.className = "show";
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}

function toggleMenu(){
    document.querySelector('#menu').classList.toggle('hidden');
}

function showDialog(){
    document.querySelector(`#${this.id.replace('menu', 'dialog')}`).showModal();
}

function closeDialog(){
    document.querySelector(`#${this.id}`).close();
}

function createEventListenerForPlusMinus(){
    document.querySelectorAll('[name="minus-button"]').forEach((button) => {
        button.addEventListener('click', minusInput, false);
        button.addEventListener('long-press', longPress, false)
        button.buttonId = button.id;
        
        button.addEventListener('mouseup', resetPressTimer, false)
        button.addEventListener('touchend', resetPressTimer, false)
    })

    document.querySelectorAll('[name="plus-button"]').forEach((button) => {
        button.addEventListener('click', plusInput, false);
        button.addEventListener('long-press', longPress, false)
        button.buttonId = button.id;
        
        button.addEventListener('mouseup', resetPressTimer, false)
        button.addEventListener('touchend', resetPressTimer, false)
    })
}
 
function resetPressTimer(){
    clearInterval(buttonPressTimer);
}