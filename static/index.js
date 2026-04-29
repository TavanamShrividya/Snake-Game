const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const respawnBtn = document.querySelector("#respawnBtn");
const titleScreen = document.querySelector("#titleScreen");
const instructionsBtn = document.querySelector("#instructionsBtn");
const usernameInput = document.querySelector("#usernameInput");
const userNameBackBtn = document.querySelector("#userNameBackBtn");
const instructionsBackBtn = document.querySelector("#instructionsBackBtn");
const enterUsernameBtn = document.querySelector("#enterUsername");
const startGameBtn = document.querySelector("#startGameBtn");
const titleScrnBtn = document.querySelector("#titleScrnBtn");


const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#0e0f24";
const snakeBorder = "black";
const carrotImage = new Image();
carrotImage.src = "/static/Carrot_JE3_BE2.png";
const pumpkinPieImage = new Image();
pumpkinPieImage.src = "/static/Pumpkin_Pie_JE2_BE2.png";
const appleImage = new Image();
appleImage.src = "/static/Golden_Apple_JE2_BE2.png"
const sweetBerriesImage = new Image();
sweetBerriesImage.src = "/static/Sweet_Berries_JE1_BE1.png"
const unitSize = 25;
const normalSpeed = 200;
const boostSpeed = 100;
let gameLoop;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let countdownInterval;
let duration = 0;
let dataObject = {
    username: "",
    score: 0,
    durationInSec: 0,
    causeOfDeath: ""
};
let boost = false;
let foodX;
let foodY;
let food;
let foodImage;
let immune = false;
let snakeSpeed = normalSpeed;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

ctx.imageSmoothingEnabled = false;

window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();

    }

    changeDirection(e);

});
resetBtn.addEventListener("click", function () { resetGame(); gameStart(); });
respawnBtn.addEventListener("click", function () { resetGame(); gameStart(); });
instructionsBtn.addEventListener("click", displayInstructions);
userNameBackBtn.addEventListener("click", displayTitleScreen);
instructionsBackBtn.addEventListener("click", displayTitleScreen);
enterUsernameBtn.addEventListener("click", enterUsername);
titleScrnBtn.addEventListener("click", displayTitleScreen);
usernameInput.addEventListener("keydown",function(e){
    if(e.key === "Enter" && document.getElementById("usernameForm").style.display !== "none"){
         e.preventDefault();
         startGameBtn.click();
    }
});
startGameBtn.addEventListener("click", function () {
    const username = usernameInput.value.trim();
    if (username) {
        dataObject.username = username;
        gameStart();
    } else {
        alert("Please enter a username to start the game.");
    }
});

let imagesLoaded = 0;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 4) {
        displayTitleScreen();
    }
}

carrotImage.onload = checkImagesLoaded;
pumpkinPieImage.onload = checkImagesLoaded;
appleImage.onload = checkImagesLoaded;
sweetBerriesImage.onload = checkImagesLoaded;
function displayTitleScreen() {
    document.getElementById("titleScreen").style.visibility = "visible";
    document.getElementById("instructionsScreen").style.display = "none";
    document.getElementById("usernameForm").style.display = "none";
    document.getElementById("gameOverScreen").style.visibility = "hidden";
}

function gameStart() {
    const savedUsername = dataObject.username;  // save before reset clears it
    resetGame();
    dataObject.username = savedUsername; 
    document.getElementById("titleScreen").style.visibility = "hidden";
    document.getElementById("usernameForm").style.display = "none";
    document.getElementById("gameOverScreen").style.visibility = "hidden";
    document.getElementById("resetBtn").style.visibility = "visible";
    document.getElementById("scoreText").style.visibility = "visible";
    running = true;
    scoreText.textContent = dataObject.score;
    createFood();
    drawFood();
    nextTick();
};
function enterUsername() {
    document.getElementById("titleScreen").style.visibility = "hidden";
    document.getElementById("usernameForm").style.display = "flex";
};

function nextTick() {
    if (running) {
        gameLoop = setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            if (immune == false) { checkGameOver(); }
            nextTick();
            duration += 1;
            dataObject.durationInSec = Math.floor(duration / 5)
        }, snakeSpeed);
    }
    else {
        displayGameOver();
        sendScore(dataObject);
    }
};

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function pickWhichFood() {
    return Math.random();
}

function randomFood(min, max) {
    const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
}

function createFood() {

    let selectedFood = pickWhichFood();
    if (selectedFood < 0.6) {
        foodImage = carrotImage;
        food = "carrot";
    }
    else if (selectedFood < 0.85) {
        foodImage = pumpkinPieImage;
        food = "pumpkinPie";
    }
    else if (selectedFood < 0.9) {
        foodImage = appleImage;
        food = "goldenApple";
    }
    else {
        foodImage = sweetBerriesImage;
        food = "sweetBerries";
    }

    if (food == "pumpkinPie" || food == "sweetBerries") {
        foodX = randomFood(3 * unitSize, gameWidth - 4 * unitSize);
        foodY = randomFood(3 * unitSize, gameHeight - 4 * unitSize);
    }
    else {
        foodX = randomFood(0, gameWidth - unitSize);
        foodY = randomFood(0, gameHeight - unitSize);
    }
};

function displayImmuneTimer() {
    const timerDiv = document.getElementById("immuneTimer");
    let timeLeft = 10;
    //show timer
    timerDiv.style.visibility = "visible";
    timerDiv.textContent = `Immunity Time Left: ${timeLeft}`;

    // Clear previous interval if golden apple is eaten again
    clearInterval(countdownInterval);

    // Start countdown
    countdownInterval = setInterval(() => {
        timeLeft--;
        timerDiv.textContent = `Immunity Time Left: ${timeLeft}`;


        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            timerDiv.style.visibility = "hidden"; // Hide after 10 seconds
            immune = false;
        }
    }, 1000);
};

function displayBoostTimer() {
    const timerDiv = document.getElementById("boostTimer");
    let timeLeft = 10;
    //show timer
    timerDiv.style.visibility = "visible";
    timerDiv.textContent = `Boost Time Left: ${timeLeft}`;

    // Clear previous interval if golden apple is eaten again
    clearInterval(countdownInterval);

    // Start countdown
    countdownInterval = setInterval(() => {
        timeLeft--;
        timerDiv.textContent = `Boost Time Left: ${timeLeft}`;


        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            timerDiv.style.visibility = "hidden"; // Hide after 10 seconds
            boost = false;
            snakeSpeed = normalSpeed;
        }
    }, 1000);
};

function drawFood() {
    ctx.drawImage(foodImage, foodX - 3, foodY - 3, unitSize + 6, unitSize + 6);
};

function updateScore(points) {
    dataObject.score += points;
    scoreText.textContent = dataObject.score;
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };
    const addition1 = {
        x: snake[0].x + 2 * xVelocity,
        y: snake[0].y + 2 * yVelocity
    };
    const addition2 = {
        x: snake[0].x + 3 * xVelocity,
        y: snake[0].y + 3 * yVelocity
    };
    if (immune) {
        if (head.x < 0) head.x = gameWidth - unitSize;
        else if (head.x >= gameWidth) head.x = 0;
        if (head.y < 0) head.y = gameHeight - unitSize;
        else if (head.y >= gameHeight) head.y = 0;
    }

    snake.unshift(head);
    //if food is eaten
    if (snake[0].x == foodX && snake[0].y == foodY) {
        if (food == "pumpkinPie") {
            snake.unshift(addition1);
            snake.unshift(addition2);
            updateScore(3);
        }
        else if (food == "carrot") {
            updateScore(1);
        }
        else if (food == "sweetBerries") {
            snake.pop();
            boost = true;
            snakeSpeed = boostSpeed;
            displayBoostTimer();
        }
        else {
            snake.pop();
            immune = true;
            displayImmuneTimer();
        }
        createFood();

    }
    else {
        snake.pop();
    }
};

function drawSnake() {

    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        let snakeColor = ctx.createRadialGradient(
            snakePart.x + unitSize / 2, snakePart.y + unitSize / 2, unitSize / 8,
            snakePart.x + unitSize / 2, snakePart.y + unitSize / 2, unitSize);
        snakeColor.addColorStop(0, "#254228");
        snakeColor.addColorStop(1, "#418b49");
        ctx.fillStyle = snakeColor
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};

function changeDirection(event) {

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch (event.key) {

        case "ArrowLeft":
        case "a":
        case "A":
            if (!goingRight) {
                xVelocity = -unitSize;
                yVelocity = 0;
            }
            break;

        case "ArrowUp":
        case "w":
        case "W":
            if (!goingDown) {
                xVelocity = 0;
                yVelocity = -unitSize;
            }
            break;

        case "ArrowRight":
        case "d":
        case "D":
            if (!goingLeft) {
                xVelocity = unitSize;
                yVelocity = 0;
            }
            break;

        case "ArrowDown":
        case "s":
        case "S":
            if (!goingUp) {
                xVelocity = 0;
                yVelocity = unitSize;
            }
            break;
    }
};

function checkGameOver() {
    if (snake[0].x < 0 || snake[0].x >= gameWidth ||
        snake[0].y < 0 || snake[0].y >= gameHeight) {
        running = false;
        dataObject.causeOfDeath = "wall";
    }

    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
            dataObject.causeOfDeath = "body";
        }
    }
};
function displayInstructions() {
    document.getElementById("titleScreen").style.visibility = "hidden";
    document.getElementById("instructionsScreen").style.display = "flex";

}

function displayGameOver() {

    document.getElementById("gameOverScreen").style.visibility = "visible";
    document.getElementById("resetBtn").style.visibility = "hidden";
    document.getElementById("scoreText").style.visibility = "hidden";


    document.getElementById("deathMsg").innerHTML = `${dataObject.username} died because snake hit the ${dataObject.causeOfDeath}`;
    
    document.getElementById("endScoreText").innerHTML = `Score: <span id="score">${dataObject.score}</span><br>Duration: <span id="score">${dataObject.durationInSec}</span> sec`
}

async function sendScore(dataObject) {

    try {
        const res = await fetch("/save_score", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataObject)
        });

        const result = await res.json();
    }
    catch (error) {
        console.error("Error saving score:", error);
    }

}

function resetGame() {
    clearTimeout(gameLoop);
    clearInterval(countdownInterval);

    immune = false;
    boost = false;
    snakeSpeed = normalSpeed;

    document.getElementById("immuneTimer").style.visibility = "hidden";
    document.getElementById("boostTimer").style.visibility = "hidden";
    document.getElementById("gameOverScreen").style.visibility = "hidden";
    document.getElementById("resetBtn").style.visibility = "visible";
    document.getElementById("scoreText").style.visibility = "visible";

    dataObject.causeOfDeath = "";

    dataObject.score = 0;
    dataObject.durationInSec = 0;
    duration = 0;

    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
};

