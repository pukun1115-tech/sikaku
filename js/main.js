class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
        
        this.time = 0;
    }

    resizeCanvas() {
        this.canvas.width = Math.floor(window.innerWidth);
        this.canvas.height = Math.floor(window.innerHeight);
    }
    
    start() {
        this.tick();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        drawMap(this.canvas, this.ctx);
        player.draw(this.canvas, this.ctx);
    }

    update() {
        player.update();
    }
    
    tick() {
        this.time++;

        this.update();
        this.draw();

        requestAnimationFrame(() => this.tick());
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.xSize = 0.5;
        this.ySize = 0.5;
        this.jumpPower = 0.2;
        this.movePower = 0.005;
        this.maxVelocityX = 0.1;
        this.velocityY = 0;
        this.velocityX = 0;

        this.onGround = false;
        this.onWall = false;
        this.onCeiling = false;
        this.isCrouching = false;
    }

    draw(canvas, ctx) {
        const originX = Math.floor(canvas.width / 2);
        const originY = Math.floor(canvas.height / 2);
        ctx.fillStyle = "rgba(0, 0, 0, 1)";
        ctx.fillRect(originX - gameData.size * (this.xSize / 2), originY - gameData.size * (this.ySize / 2), gameData.size * this.xSize, gameData.size * this.ySize);
        ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        ctx.lineWidth = gameData.size / 32;
        ctx.strokeRect(originX - gameData.size * (this.xSize / 2), originY - gameData.size * (this.ySize / 2), gameData.size * this.xSize, gameData.size * this.ySize);
    }

    update() {
        this.onWall = this.checkCollision(this.x, this.y + 0.002);
        this.onCeiling = this.checkCollision(this.x - 0.002, this.y) || this.checkCollision(this.x + 0.02, this.y);
        this.onGround = this.checkCollision(this.x, this.y - 0.002);
        this.isCrouching = keys["KeyS"] || keys["ArrowDown"];
        if (this.isCrouching) {
            this.ySize = 0.25;
        } else {
            this.ySize = 0.5;
        }
        
        this.updateHorizontalVelocity();
        this.updateVerticalVelocity();
        
        this.moveHorizontal();
        this.moveVertical();
    }
    
    updateHorizontalVelocity() {
        const left = (keys["ArrowLeft"] || keys["KeyA"]);
        const right = (keys["ArrowRight"] || keys["KeyD"]);
        let friction;
        let movePower;
        if (this.onGround) {
            friction = 0.01;
            movePower = this.movePower;
        } else {
            friction = 0.005;
            movePower = this.movePower * 0.2;
        }
        let maxVelocityX;
        if (!this.isCrouching) {
            maxVelocityX = this.maxVelocityX;
        } else {
            maxVelocityX = this.maxVelocityX * 0.4;
        }

        if (left && !right) {
            this.velocityX = Math.max(this.velocityX - movePower, -maxVelocityX);
        } else if (!left && right) {
            this.velocityX = Math.min(this.velocityX + movePower, maxVelocityX);
        } else {
            if (Math.abs(this.velocityX) < friction) {
                this.velocityX = 0;
            } else {
                this.velocityX -= (Math.sign(this.velocityX) * friction);
            }
        }
    }

    updateVerticalVelocity() {
        if (this.onGround) {
            if (keys["Space"] || keys["KeyW"] || keys["ArrowUp"]) {
                this.velocityY = this.jumpPower;
            }
        } else {
            this.velocityY += gameData.gravity;
        }
    }

    moveHorizontal() {
        let remainingX = Math.abs(this.velocityX);
        const directionX = Math.sign(this.velocityX);//x方向の移動する向き(正負)
        while (remainingX > 0) {
            const stepX = Math.min(0.001, remainingX) * directionX;
            if (this.checkCollision(this.x + stepX, this.y)) {
                this.velocityX = 0;
                break;
            }
            this.x += stepX;
            remainingX -= Math.abs(stepX);
        }
        
    }
    
    moveVertical() {
        let remainingY = Math.abs(this.velocityY);
        const directionY = Math.sign(this.velocityY);
        while (remainingY > 0) {
            const stepY = Math.min(0.001, remainingY) * directionY;
            if (this.checkCollision(this.x, this.y + stepY)) {
                this.velocityY = 0;
                break;
            }
            this.y += stepY;
            remainingY -= Math.abs(stepY);
        }
        
    }

    checkCollision(nx, ny) {
        for (let y = 0; y < gameData.mapHeight; y++) {
            for (let x = 0; x < gameData.mapWidth; x++) {
                if (mapData[y][x] !== "#") continue;
                const worldY = gameData.mapHeight - y - 1;
                if (nx + this.xSize >= x && nx <= x + 1 && ny + this.ySize >= worldY && ny <= worldY + 1) {
                    return true;
                }
            }
        }
        return false;
    }
}

function drawMap(canvas, ctx) {
    const originX = Math.floor(canvas.width / 2);
    const originY = Math.floor(canvas.height / 2);

    for (let y = 0; y < gameData.mapHeight; y++) {
        for (let x = 0; x < gameData.mapWidth; x++) {
            if (mapData[y][x] === "#") {
                const worldY = gameData.mapHeight - y - 1;
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                ctx.fillRect(originX + Math.floor((x - player.x - (player.xSize / 2)) * gameData.size), originY - Math.floor((worldY - player.y - (player.ySize / 2)) * gameData.size), gameData.size, -gameData.size);
            }
        }
    }
}

const game = new Game("canvas");
const player = new Player(2, 5);
game.start();