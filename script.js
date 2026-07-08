// Selection

// Board
const board = document.querySelector(".board");
const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

// Modal
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-Over");
const restartButton = document.querySelector(".btn-restart");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");

// Score
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#time");

let score = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;

scoreElement.innerText = score;
highScoreElement.innerText = highScore;

// Timer
let seconds = 0;
let timerId = null;

// Game
let intervalId = null;

const blocks = {};

let direction = "down";

let snake = [
    {
        x: 1,
        y: 3
    }
];

let food = {};

// Timer

function startTimer() {

    clearInterval(timerId);

    timerId = setInterval(() => {

        seconds++;

        let min = Math.floor(seconds / 60);
        let sec = seconds % 60;

        min = String(min).padStart(2, "0");
        sec = String(sec).padStart(2, "0");

        timeElement.innerText = `${min}:${sec}`;

    }, 1000);

}

function stopTimer() {

    clearInterval(timerId);

}

function resetTimer() {

    seconds = 0;

    timeElement.innerText = "00:00";

}

// Create Board

for (let row = 0; row < rows; row++) {

    for (let col = 0; col < cols; col++) {

        const block = document.createElement("div");

        block.classList.add("block");

        board.appendChild(block);

        blocks[`${row}-${col}`] = block;

    }

}

// Spawn Food

function spawnFood() {

    do {

        food = {

            x: Math.floor(Math.random() * rows),

            y: Math.floor(Math.random() * cols)

        };

    } while (

        snake.some(segment =>

            segment.x === food.x &&

            segment.y === food.y

        )

    );

}

spawnFood();

// Render Function

function gameOver() {

    clearInterval(intervalId);
    stopTimer();

    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    restartButton.style.display = "block";

}

function render() {

    let head;

    // Remove previous snake
    snake.forEach(segment => {

        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
        blocks[`${segment.x}-${segment.y}`].style.background = "";

    });

    // Remove previous food
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    // Direction
    if (direction === "left") {

        head = {
            x: snake[0].x,
            y: snake[0].y - 1
        };

    }
    else if (direction === "right") {

        head = {
            x: snake[0].x,
            y: snake[0].y + 1
        };

    }
    else if (direction === "up") {

        head = {
            x: snake[0].x - 1,
            y: snake[0].y
        };

    }
    else {

        head = {
            x: snake[0].x + 1,
            y: snake[0].y
        };

    }

    // Wall Collision
    if (
        head.x < 0 ||
        head.x >= rows ||
        head.y < 0 ||
        head.y >= cols
    ) {

        gameOver();
        return;

    }

    // Self Collision
    if (
        snake.some(segment =>
            segment.x === head.x &&
            segment.y === head.y
        )
    ) {

        gameOver();
        return;

    }

    // Add new head
    snake.unshift(head);

    // Food Collision
    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score += 10;

        scoreElement.innerText = score;

        if (score > highScore) {

            highScore = score;

            highScoreElement.innerText = highScore;

            localStorage.setItem(
                "highScore",
                highScore
            );

        }

        spawnFood();

    }
    else {

        snake.pop();

    }

    // Draw food
    blocks[`${food.x}-${food.y}`]
        .classList.add("food");

    // Draw snake
    snake.forEach((segment, index) => {

        blocks[`${segment.x}-${segment.y}`]
            .classList.add("fill");

        // Snake head
        if (index === 0) {

            blocks[`${segment.x}-${segment.y}`]
                .style.background = "#00ff00";

        }

    });

}

// Start Game
startButton.addEventListener("click", () => {

    modal.style.display = "none";
    startGameModal.style.display = "flex";
    gameOverModal.style.display = "none";

    clearInterval(intervalId);

    startTimer();

    intervalId = setInterval(render, 300);

});

// Restart Game
restartButton.addEventListener("click", restartGame);

function restartGame() {

    clearInterval(intervalId);
    stopTimer();

    // Remove snake
    snake.forEach(segment => {

        blocks[`${segment.x}-${segment.y}`]
            .classList.remove("fill");

        blocks[`${segment.x}-${segment.y}`]
            .style.background = "";

    });

    // Remove food
    blocks[`${food.x}-${food.y}`]
        .classList.remove("food");

    // Reset values
    snake = [
        {
            x: 1,
            y: 3
        }
    ];

    direction = "down";

    score = 0;

    scoreElement.innerText = score;

    resetTimer();

    spawnFood();

    // Hide modal
    modal.style.display = "none";
    gameOverModal.style.display = "none";

    // Draw initial snake
    snake.forEach((segment, index) => {

        blocks[`${segment.x}-${segment.y}`]
            .classList.add("fill");

        if (index === 0) {

            blocks[`${segment.x}-${segment.y}`]
                .style.background = "#00ff00";

        }

    });

    // Draw food
    blocks[`${food.x}-${food.y}`]
        .classList.add("food");

    startTimer();

    intervalId = setInterval(render, 300);

}

// Keyboard Controls
window.addEventListener("keydown", (event) => {

    if (
        event.key === "ArrowUp" &&
        direction !== "down"
    ) {

        direction = "up";

    }

    else if (
        event.key === "ArrowDown" &&
        direction !== "up"
    ) {

        direction = "down";

    }

    else if (
        event.key === "ArrowLeft" &&
        direction !== "right"
    ) {

        direction = "left";

    }

    else if (
        event.key === "ArrowRight" &&
        direction !== "left"
    ) {

        direction = "right";

    }

});

// Initial Draw
blocks[`${food.x}-${food.y}`]
    .classList.add("food");

snake.forEach((segment, index) => {

    blocks[`${segment.x}-${segment.y}`]
        .classList.add("fill");

    if (index === 0) {

        blocks[`${segment.x}-${segment.y}`]
            .style.background = "#00ff00";

    }

});