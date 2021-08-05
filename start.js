import Tetris from "./tetris.core.js"
import Game  from "./tetris.game.js"

let tetris = new Tetris({});
let game = new Game(null, tetris, {});
game.start();
console.log(game.tetris.score);