import React, { Component } from 'react';
import './App.css';

import './chessground.css';
import heaws from './heaws.mp3';
import { Chessground } from 'chessground';
import { defaults } from 'chessground/state';

function initGame() {

  const player = {role: 'knight', color: 'white'}
  const target = {role: 'pawn', color: 'black'}

  const choose = (choices) => {
      var index = Math.floor(Math.random() * choices.length);
      return choices[index];
  }

  const randomTile = () => {
      return choose(['a', 'b', 'c', 'd', 'e', 'f', 'g']) +
      choose(['1', '2', '3', '4', '5', '6', '7'])
  }

  const differentRandomTile = (other) => {
      var pos = randomTile()
      while(pos === other) {
          pos = randomTile()
      }
      return pos
  }

  const getDests = (pos) => {
      function toKey(x,y) {
          if (x < 0 || x > 7 || y < 0 || y > 7) {
              return null
          }
          return String.fromCharCode(x+'a'.charCodeAt()) +
          String.fromCharCode(y+'1'.charCodeAt())
      }

      const x = pos[0].toLowerCase().charCodeAt() - 'a'.charCodeAt()
      const y = pos[1].charCodeAt() - '1'.charCodeAt()
      return [
          toKey(x-2, y+1),
          toKey(x-2, y-1),
          toKey(x-1, y+2),
          toKey(x-1, y-2),
          toKey(x+1, y+2),
          toKey(x+1, y-2),
          toKey(x+2, y+1),
          toKey(x+2, y-1),
      ].filter(x => x != null)
  }

  var config = defaults();

  config.movable.free = false;
  config.fen = '8/8/8/8/8/8/8/8 w KQkq -'
  config.disableContextMenu = true;
  config.events.move = (orig, dest, capturedPiece) => {
      if(capturedPiece) {
          var audio = new Audio(heaws);
          audio.play();
          const pos = differentRandomTile(dest)
          ground.setPieces({[pos]: target})
      }
      ground.set({movable: {dests: {[dest]: getDests(dest)}}})
  }

  var ground = Chessground(document.getElementById('dirty'), config);

  const pos = randomTile()
  const pos2 = differentRandomTile(pos)
  ground.set({movable: {dests: {[pos]: getDests(pos)}}})
  ground.setPieces({[pos]: player})
  ground.setPieces({[pos2]: target})
}

class App extends Component {
  render() {
    return (
      <div id="board" className="blue merida">
        <div id="dirty" className="cg-board-wrap"></div>
      </div>
    );
  }

  componentDidMount() {
    initGame()
  }
}

export default App;
