import { Sitting } from "./StateManager.js";
import { Running } from "./StateManager.js";
import { Jumping } from "./StateManager.js";
import { Falling } from "./StateManager.js";
import { Rolling } from "./StateManager.js";
import { Diving } from "./StateManager.js";
import { Hit } from "./StateManager.js";
import { CollisionAnimation } from "./CollisionAnimation.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 92;
    this.image = player;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame;
    this.speed = 0;
    this.maxSpeed = 5;
    this.vy = 0;
    this.energy = 50;
    this.weight = 1;
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game),
    ];
  }
  update(input, deltaTime) {
    this.checkCollision();
    this.currentState.handleInput(input);
    // Уменьшение энергии в состоянии Rolling
    if (this.currentState === this.states[4]) {
      this.energy -= 0.5 * (deltaTime / 100);
      if (this.energy < 0) this.energy = 0;
    }
    // horizontal control
    if (
      input.includes("D") ||
      (input.includes("d") && this.currentState !== this.states[6])
    ) {
      this.speed = this.maxSpeed;
    } else if (
      input.includes("A") ||
      (input.includes("a") && this.currentState !== this.states[6])
    ) {
      this.speed = -this.maxSpeed;
    } else {
      this.speed = 0;
    }
    // horizontal movement
    this.x += this.speed * (deltaTime / 16.67);
    // horizontal restrictions
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.game.width - this.width) {
      this.x = this.game.width - this.width;
    }
    // vertical movement
    this.y += this.vy * (deltaTime / 16.67);
    // Притяжениеd
    if (!this.onGround()) {
      this.vy += this.weight * (deltaTime / 16.67);
    } else {
      this.vy = 0;
    }
    if (this.y > this.game.height - this.height - this.game.groundMargin) {
      this.y = this.game.height - this.height - this.game.groundMargin;
    }
    // sprite animation
    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
    } else {
      this.frameTimer += deltaTime;
    }
  }
  onGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;
    this.currentState.enter();
  }
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        enemy.markedForDeletion = true;
        this.game.collisions.push(
          new CollisionAnimation(
            this.game,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5
          )
        );
        if (
          this.currentState === this.states[4] ||
          this.currentState === this.states[5]
        ) {
          this.game.score++;
          this.energy += 5;
        } else {
          this.setState(6, 0);
          this.game.lives--;
          this.energy -= 5;
          if (this.game.lives <= 0) this.game.gameOver = true;
        }
      }
    });
  }
}
