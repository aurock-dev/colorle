document.addEventListener('DOMContentLoaded', randomColor, false);

// document.querySelector('#random-color').addEventListener("click", randomColor);

function randomColor(){
    color = uniqolor.random({format: 'rgb'});
    document.body.style.backgroundColor = color.color;
}
