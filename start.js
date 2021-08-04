import Tetris from "./tetris.core.js"
import Game from "./tetris.game.js"
import Network from "./tetrisDQN.js"

let network = new Network();
await network.loadModel();
let tetris = new Tetris({}, network);
let game = new Game(null, tetris, {});
await game.start();