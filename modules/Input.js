export class InputHandler {
  constructor(game) {
    this.keys = [];
    this.game = game;
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "W" ||
          e.key === "w" ||
          e.key === "S" ||
          e.key === "s" ||
          e.key === "A" ||
          e.key === "a" ||
          e.key === "D" ||
          e.key === "d" ||
          e.key === "Enter") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
      } else if (e.key === "d" || e.key === "D") {
        this.game.debug = !this.game.debug;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (
        (e.key === "W" ||
          e.key === "w" ||
          e.key === "S" ||
          e.key === "s" ||
          e.key === "A" ||
          e.key === "a" ||
          e.key === "D" ||
          e.key === "d" ||
          e.key === "Enter") &&
        this.keys.indexOf(e.key) > -1
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
  }
}
