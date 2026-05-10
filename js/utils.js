// Snake Game Logic
const SnakeGame = {
    canvas: null,
    ctx: null,
    gridSize: 20,
    snake: [],
    food: {},
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    gameLoop: null,
    isRunning: false,

    init: function() {
        this.canvas = CommonUtils.get('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.reset();
        this.bindEvents();
        this.draw();
    },

    reset: function() {
        this.snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.spawnFood();
        CommonUtils.get('score').textContent = this.score;
    },

    spawnFood: function() {
        const maxX = Math.floor(this.canvas.width / this.gridSize);
        const maxY = Math.floor(this.canvas.height / this.gridSize);
        this.food = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    },

    bindEvents: function() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (['arrowup', 'w'].includes(key) && this.direction !== 'down') {
                this.nextDirection = 'up';
            } else if (['arrowdown', 's'].includes(key) && this.direction !== 'up') {
                this.nextDirection = 'down';
            } else if (['arrowleft', 'a'].includes(key) && this.direction !== 'right') {
                this.nextDirection = 'left';
            } else if (['arrowright', 'd'].includes(key) && this.direction !== 'left') {
                this.nextDirection = 'right';
            }
        });

        CommonUtils.get('startBtn').addEventListener('click', () => {
            if (!this.isRunning) {
                this.start();
            }
        });
    },

    start: function() {
        this.reset();
        this.isRunning = true;
        CommonUtils.get('startBtn').textContent = 'Playing...';
        CommonUtils.get('startBtn').disabled = true;
        this.gameLoop = setInterval(() => this.update(), 100);
    },

    update: function() {
        this.direction = this.nextDirection;
        const head = {...this.snake[0]};

        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        const maxX = Math.floor(this.canvas.width / this.gridSize);
        const maxY = Math.floor(this.canvas.height / this.gridSize);

        if (head.x < 0 || head.x >= maxX || head.y < 0 || head.y >= maxY ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            CommonUtils.get('score').textContent = this.score;
            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    },

    draw: function() {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#66BB6A' : '#4CAF50';
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        this.ctx.fillStyle = '#FF5722';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 1,
            this.food.y * this.gridSize + 1,
            this.gridSize - 2,
            this.gridSize - 2
        );
    },

    gameOver: function() {
        this.isRunning = false;
        clearInterval(this.gameLoop);
        CommonUtils.get('startBtn').textContent = 'Start Game';
        CommonUtils.get('startBtn').disabled = false;
        alert(`Game Over! Score: ${this.score}`);
    }
};

document.addEventListener('DOMContentLoaded', () => SnakeGame.init());
