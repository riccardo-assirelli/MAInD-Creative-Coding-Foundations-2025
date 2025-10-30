const BUTTON = document.getElementById("button");
const BOX = document.getElementById("result");
const INPUT = document.getElementById("userInput");

let number = 0;

BUTTON.addEventListener("click", () => {
    let userInput = INPUT.value;
    let boxInput = document.createElement("p");
    boxInput.textContent = userInput;
    BOX.appendChild(boxInput);
})
