import { Dust } from "./Particle.js";
import { Fire } from "./Particle.js";
import { Splash } from "./Particle.js";

const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

class StateManager {
  constructor(state, game) {
    this.game = game;
    this.state = state;
  }
}

export class Sitting extends StateManager {
  constructor(game) {
    super("SITTING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 4;
    this.game.player.frameY = 5;
  }
  handleInput(input) {
    if (
      input.includes("D") ||
      input.includes("d") ||
      input.includes("A") ||
      input.includes("a")
    ) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (input.includes("Enter")) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}
export class Running extends StateManager {
  constructor(game) {
    super("RUNNING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 3;
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height
      )
    );
    if (input.includes("S") || input.includes("s")) {
      this.game.player.setState(states.SITTING, 0);
    } else if (input.includes("W") || input.includes("w")) {
      this.game.player.setState(states.JUMPING, 1);
    } else if (input.includes("Enter")) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}
export class Jumping extends StateManager {
  constructor(game) {
    super("JUMPING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    if (this.game.player.onGround()) {
      this.game.player.vy -= 27;
    }
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 1;
  }
  handleInput(input) {
    if (this.game.player.vy > this.game.player.weight) {
      this.game.player.setState(states.FALLING, 1);
    } else if (input.includes("Enter")) {
      this.game.player.setState(states.ROLLING, 2);
    } else if (input.includes("S") || input.includes("s")) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}
export class Falling extends StateManager {
  constructor(game) {
    super("FALLING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 2;
  }
  handleInput(input) {
    if (this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (input.includes("S") || input.includes("s")) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}
export class Rolling extends StateManager {
  constructor(game) {
    super("ROLLING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 6;
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );
    if (!input.includes("Enter") && this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (!input.includes("Enter") && !this.game.player.onGround()) {
      this.game.player.setState(states.FALLING, 1);
    } else if (
      input.includes("Enter") &&
      (input.includes("w") || input.includes("W")) &&
      this.game.player.onGround()
    ) {
      this.game.player.vy -= 27;
    } else if (
      input.includes("S") ||
      (input.includes("s") && !this.game.player.onGround())
    ) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}
export class Diving extends StateManager {
  constructor(game) {
    super("DIVING", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 6;
    this.game.player.frameY = 6;
    this.game.player.vy = 15;
  }
  handleInput(input) {
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width * 0.5,
        this.game.player.y + this.game.player.height * 0.5
      )
    );
    if (!input.includes("Enter") && this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
      for (let i = 0; i < 30; i++) {
        this.game.particles.unshift(
          new Splash(
            this.game,
            this.game.player.x + this.game.player.width * 0.5,
            this.game.player.y + this.game.player.height * 0.5
          )
        );
      }
    } else if (input.includes("Enter") && this.game.player.onGround()) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}
export class Hit extends StateManager {
  constructor(game) {
    super("HIT", game);
  }
  enter() {
    this.game.player.frameX = 0;
    this.game.player.maxFrame = 10;
    this.game.player.frameY = 4;
  }
  handleInput(input) {
    if (this.game.player.frameX >= 10 && this.game.player.onGround()) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (this.game.player.frameX >= 10 && this.game.player.onGround()) {
      this.game.player.setState(states.FALLING, 2);
    }
  }
}
