import { Player } from "./Player.js";
import { InputHandler } from "./Input.js";
import { Background } from "./Background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./Enemy.js";
import { UI } from "./UI.js";

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.groundMargin = 80;
    this.speed = 0;
    this.maxSpeed = 3;
    this.particles = [];
    this.collisions = [];
    this.background = new Background(this);
    this.player = new Player(this);
    this.input = new InputHandler(this);
    this.UI = new UI(this);
    this.enemies = [];
    this.enemyTimer = 0;
    this.enemyInterval = 3000;
    this.maxParticle = 50;
    this.time = 0;
    this.maxTime = 150000;
    this.lives = 5;
    this.gameOver = false;
    this.score = 0;
    this.fontColor = "black";
    this.player.currentState = this.player.states[0];
    this.player.currentState.enter();
  }
  update(deltaTime) {
    this.time += deltaTime;
    if (this.time > this.maxTime) {
      this.gameOver = true;
    }
    this.background.update();
    this.player.update(this.input.keys, deltaTime);
    // handleEnemies
    if (this.enemyTimer > this.enemyInterval) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }
    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
      if (enemy.markedForDeletion) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
      }
    });
    // handle particles
    this.particles.forEach((particle, index) => {
      particle.update();
      if (particle.markedForDeletion) {
        this.particles.splice(index, 1);
      }
    });
    if (this.particles.length > 50) {
      this.particles = this.particles.slice(0, this.maxParticle);
    }
    // handle collisions
    this.collisions.forEach((collision, index) => {
      collision.update(deltaTime);
      if (collision.markedForDeletion) {
        this.collisions.splice(index, 1);
      }
    });
  }
  draw(ctx) {
    this.background.draw(ctx);
    this.player.draw(ctx);
    this.enemies.forEach((enemy) => {
      enemy.draw(ctx);
    });
    this.particles.forEach((particle) => {
      particle.draw(ctx);
    });
    this.collisions.forEach((collision) => {
      collision.draw(ctx);
    });
    this.UI.draw(ctx);
  }
  addEnemy() {
    if (this.speed > 0 && Math.random() < 0.3) {
      this.enemies.push(new GroundEnemy(this));
    } else if (this.speed > 0 && Math.random() > 0.6) {
      this.enemies.push(new ClimbingEnemy(this));
    }
    this.enemies.push(new FlyingEnemy(this));
  }
}
