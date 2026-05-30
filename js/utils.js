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
  isGameOver: false,

  init: function() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.reset();
    this.bindEvents();
    this.draw();
    this.loadHelpText();
    this.loadGames();
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
    this.isGameOver = false;
    this.spawnFood();
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

    this.canvas.addEventListener('click', () => this.handleCanvasInteraction());
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleCanvasInteraction();
    }, { passive: false });

    const gamesBtn = document.getElementById('gamesBtn');
    const gamesDropdown = document.getElementById('gamesDropdown');
    gamesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      gamesDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      gamesDropdown.classList.remove('show');
    });

    gamesDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    const helpBtn = document.getElementById('helpBtn');
    const helpDropdown = document.getElementById('helpDropdown');
    helpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      helpDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      helpDropdown.classList.remove('show');
    });

    helpDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.getElementById('localeSelect').addEventListener('change', (e) => {
      this.loadHelpText(e.target.value);
    });
  },

  handleCanvasInteraction: function() {
    if (!this.isRunning) {
      this.start();
    } else if (this.isGameOver) {
      this.reset();
      this.start();
    }
  },

  start: function() {
    this.isRunning = true;
    this.isGameOver = false;
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

    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 10, 20);

    if (this.isGameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 20);
      this.ctx.font = '18px Arial';
      this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
      this.ctx.fillText('Tap to restart', this.canvas.width / 2, this.canvas.height / 2 + 40);
      this.ctx.textAlign = 'left';
    } else if (!this.isRunning) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Snake Game', this.canvas.width / 2, this.canvas.height / 2 - 20);
      this.ctx.font = '18px Arial';
      this.ctx.fillText('Tap to start', this.canvas.width / 2, this.canvas.height / 2 + 10);
      this.ctx.textAlign = 'left';
    }
  },

  gameOver: function() {
    this.isRunning = false;
    this.isGameOver = true;
    clearInterval(this.gameLoop);
    this.draw();
  },

  loadHelpText: function(locale) {
    locale = locale || 'en';
    const helpTexts = {
      en: {
        title: 'How to Play',
        text: 'Use arrow keys or WASD to control the snake. Eat food to grow and increase your score. Avoid hitting walls or yourself!'
      },
      zh: {
        title: '如何玩',
        text: '使用方向键或 WASD 控制蛇。吃食物来增长并增加分数。避免撞墙或撞到自己！'
      }
    };
    const help = helpTexts[locale] || helpTexts.en;
    document.getElementById('helpTitle').textContent = help.title;
    document.getElementById('helpText').textContent = help.text;
  },

  loadGames: function() {
    fetch('https://zihaohong.github.io/data/links/games.json')
      .then(response => response.json())
      .then(data => {
        const locale = document.getElementById('localeSelect').value;
        const items = data[locale] || data.en || {};
        const currentPath = window.location.pathname;
        const dropdown = document.getElementById('gamesDropdown');
        dropdown.innerHTML = Object.entries(items).map(([title, params]) => {
          const isCurrent = currentPath.includes(params.url.replace('https://zihaohong.github.io/', ''));
          return `<a href="${params.url}" class="${isCurrent ? 'current' : ''}">${title}</a>`;
        }).join('');
      })
      .catch(error => console.error('Error loading games:', error));
  }
};

document.addEventListener('DOMContentLoaded', () => SnakeGame.init());
