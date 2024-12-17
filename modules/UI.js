export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Pirata One";
    this.livesImage = lives
  }
  draw(ctx) {
    ctx.save();
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "white";
    ctx.shadowBlur = 0;
    ctx.font = this.fontSize + "px " + this.fontFamily;
    ctx.textAlign = "left";
    ctx.fillStyle = this.game.fontColor;
    ctx.fillText("Score: " + this.game.score, 20, 30);
    // timer
    ctx.font = this.fontSize * 0.8 + "px " + this.fontFamily;
    ctx.fillText("Time: " + (this.game.time * 0.001).toFixed(1), 20, 90);
    // energy
    ctx.font = this.fontSize * 0.8 + "px " + this.fontFamily;
    ctx.fillText("Energy: " + (this.game.player.energy).toFixed(1), 20, 60);
    // lives
    for (let i = 0; i < this.game.lives; i++) {

      ctx.drawImage(this.livesImage, 25 * i + 25, 105, 25, 25)
    }
    // game over
    if (this.game.gameOver) {
      ctx.textAlign = "center";
      ctx.font = this.fontSize * 2 + "px " + this.fontFamily;
      if (this.game.score > 50) {
        ctx.fillText(
          "Lets goooo! You fucked this ghosts with score: " + this.game.score,
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        ctx.font = this.fontSize * 0.7 + "px " + this.fontFamily;
        ctx.fillText(
          "What are creatures of the night afraid of? YOU!!!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      } else {
        ctx.fillText(
          "Love at first bite?",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        ctx.font = this.fontSize * 0.7 + "px " + this.fontFamily;
        ctx.fillText(
          "Nope. Better luck next time",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      }
    }
    ctx.restore();
  }
}
