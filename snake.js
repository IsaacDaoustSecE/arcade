const WIDTH = 400;
const HEIGHT = 400;
const SPEED = 10;
const SIZE = 10;
const INTERVAL = 100;
let snake;
let food;
let interval;
let score = 0;

const canvas = document.getElementById("canv");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const context = canvas.getContext("2d");

context.fillStyle = "red";

// Snake object
function Snake(x, y) {
    const body = [{ x, y }];
    let direction = "down";

    function render() {
        for (const part of body) {
            context.fillStyle = "green";
            context.fillRect(part.x, part.y, 10, 10);
        }
    }

    function move() {
        const head = { ...body[0] };

        if (direction === "down") head.y += SPEED;
        else if (direction === "up") head.y -= SPEED;
        else if (direction === "left") head.x -= SPEED;
        else if (direction === "right") head.x += SPEED;

        // Wall collision
        if (
            head.x < 0 ||
            head.x >= WIDTH ||
            head.y < 0 ||
            head.y >= HEIGHT ||
            checkCollision(head)
        ) {
            clearInterval(interval);
            console.log(`Game Over! Your score: ${score}`);
            startGame();
            // alert(`Game Over! Your score: ${score}`);
        }

        // Food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            spawnFood();
        } else {
            body.pop(); // Remove tail if no food eaten
        }

        body.unshift(head); // Add new head
    }

    function setDirection(newDirection) {
        const opposite = {
            up: "down",
            down: "up",
            left: "right",
            right: "left",
        };
        if (newDirection !== opposite[direction]) {
            direction = newDirection;
        }
    }

    function checkCollision(part) {
        return body.some((b) => b.x === part.x && b.y === part.y);
    }

    return { render, move, setDirection };
}

// Spawn food at a random location
function spawnFood() {
    food = {
        x: Math.floor(Math.floor(Math.random() * (WIDTH / SIZE)) * SIZE),
        y: Math.floor(Math.floor(Math.random() * (HEIGHT / SIZE)) * SIZE),
    };
}

// Render the game board and snake
function renderBoard() {
    // Render the snake and food
    clearScreen();
    snake.render();

    context.fillStyle = "red";
    context.fillRect(food.x, food.y, 10, 10);
}

// Clear the terminal screen
function clearScreen() {
    context.clearRect(0, 0, canv.width, canv.height);
}

// Handle keyboard input for direction changes
document.body.addEventListener("keypress", (e) => {
    switch (e.key.toLowerCase()) {
        case "w":
            snake.setDirection("up");
            break;
        case "s":
            snake.setDirection("down");
            break;
        case "a":
            snake.setDirection("left");
            break;
        case "d":
            snake.setDirection("right");
            break;
    }
});

// Start the game
function startGame() {
    snake = Snake(Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2));
    spawnFood();
    interval = setInterval(() => {
        snake.move();
        renderBoard();
    }, INTERVAL);
}

startGame();
