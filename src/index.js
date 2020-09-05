import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
      );
}

  class Board extends React.Component {    
    /*Board is passed squares as slice */
    renderSquare(i) {
      return (
      <Square 
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
              />
      );
    }

    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      /* In Java, whenever making a constructor of a subclass you must call super(props) */
      super(props);
      this.state = {
        /* Setting two properties */
        history: [{
          squares: Array(9).fill(null),
          coord: {x: null,y: null}
        }],
        moveHistory: [
          {x: null, y:null}
        ],
        stepNumber: 0,
        xIsNext: true,
      };
    }


    handleClick(i) {
      const history = this.state.history;
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      const coord ={ x: (i % 3) + 1, y:(Math.ceil(i/3))}

      /* Logical OR (expr 1 || expr 2) -- tries to evaluate expr1, if False returns expr2 */
      if (calculateWinner(squares) || squares[i]){
        return;
      }
      /* Ternary Operator - condition ? val1 : val2 */
      /* Evaluates condition - if true returns val1, else val2*/
      squares[i] = this.state.xIsNext ? "X" : "O";

      this.setState({

        history: history.concat([
          {
          squares: squares,
          coord: coord
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext, 
      /*todo: grab last move from x and y*/
    })

    }

    jumpTo(step){
      /* Set the state to the step */
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0, 
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const buttonStyle = {
        borderRadius: 5,
        borderColor: '#c1eba0',
        fontWeight: 'bold',
      }
      /* Use the saved state of history and call the function on every element in the array*/
      
          
      /* .Map() creates array of applied */
      /* move is the index of the array, step is the squares */
      const moves = history.map((step, move) => {
      /* Const variables cannot be reassign */  
      const coordStr = "(" + history[move].coord.x + "," +  history[move].coord.y + ")" 
      const desc = move ?
        ' Go to move #' + move + " : " + coordStr:
        ' Go to game start'

      
        /* === is strict equality (considers things of different type to be different) */ 
        if (this.state.stepNumber === move){
          /* The current step button is highlighted  */
          return(
            <li key={move}>
              <button style={buttonStyle} onClick={() => this.jumpTo(move)}>{desc}
              </button>
            </li>
          );
        }
        else{
          return(
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}
              </button>
            </li>
          );
        }
      });

      /* Variables declared with let have Block Scope 
         Block variables are only accessible within the Block*/
      let status;
      if (winner){
        status = "Winner: " + winner ;
      } else {
        status = "Next player:" + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          </div>
      </div>
      );
      }
    }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
