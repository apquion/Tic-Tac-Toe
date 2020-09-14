import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
    return (
      <button className={props.className} onClick={props.onClick}>
        {props.value}
      </button>
      );
}
  class Board extends React.Component {    
    /*Board is passed squares as slice */
    renderSquare(i) {
      if ((this.props.currentStep === this.props.step) && this.props.winningSquares && this.props.winningSquares.includes(i)){
        return (
          <Square className="square-highlight"
                  value={this.props.squares[i]}
                  onClick={() => this.props.onClick(i)}
                  />
          );
      }
      else{
        return (
          <Square className="square"
                  value={this.props.squares[i]}
                  onClick={() => this.props.onClick(i)}
                  />
          );
      }
    }

    renderRow(ids){
      let cells = ids.map((id) => {
        return(this.renderSquare(id));
      })

      return(
        <div className="board-row">
          {cells}
        </div>
      )
    }

    render(){
      /* Render 3 rows */
      let rows = [0,1,2];
      let rowGroups = rows.map(rowNum => {
        return([rowNum * 3 , rowNum * 3 + 1, rowNum * 3 + 2])
      })

      let board = rowGroups.map(ids =>{
        return(this.renderRow(ids))
      })

      // pass groups of 3 to the row render
        return(
          <div>
          {board}
          </div>
        )
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
          coord: {x: null,y: null},
        }],
        stepNumber: 0,
        xIsNext: true,
        moveOrderIsDescending : false,
        winState:{winner: null, winningSquares: null}
      };
    }

     calculateWinner(squares){
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
      
      let winningSquares = Array(3).fill()
      let winner = null

      for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            winner = squares[a];
            winningSquares = [a,b,c]
        }
      }

      if (winner){
        return {winner: winner, winningSquares:winningSquares}
      }
      return {winner:null, winningSquares:null};
    }

    handleClick(i) {
      const history = this.state.history;
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const coord ={x:(i % 3), y:(Math.floor(i/3))}

      /* Logical OR (expr 1 || expr 2) -- tries to evaluate expr1, if False returns expr2 */

      if (this.state.winState.winner || squares[i]){
        return;
      }

      /* Ternary Operator - condition ? val1 : val2 */
      /* Evaluates condition - if true returns val1, else val2*/

      squares[i] = this.state.xIsNext ? "X" : "O";

      var currentWinState = this.calculateWinner(squares)

      this.setState({
        history: history.concat([
          {
          squares: squares,
          coord: coord,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winState: currentWinState 
    })

    }

    jumpTo(step){
      /* Set the state to the step */
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0, 
      })
    }

    toggleOrder(){
      this.setState({
        moveOrderIsDescending: !this.state.moveOrderIsDescending,
      })
    }

    render() {      
    /* Grab a copy of the history using slice()
      Immutability is important becuase it allows us to detect changes more easily in other
    */
      
      let myHistory = this.state.history.slice();
      const current = myHistory[this.state.stepNumber];
      const winner = this.state.winState.winner

      /* Use the saved state of history and call the function on every element in the array*/
          
      /* .Map() creates array of applied */
      /* move is the index of the array, step is the squares */

      const buttonStyle = {
        borderRadius: 5,
        borderColor: '#c1eba0',
        fontWeight: 'bold',
      }
      
      const moves = myHistory.map((step, move) => {

        /* 0, 1, 2,3,4, */
        /* 5, 4, 3,2, 1 ,null* 
      /* Const variables cannot be reassign */  
      if (!this.state.moveOrderIsDescending){
        move = this.state.history.length - move - 1
      }

      const coordStr = "(" + myHistory[move].coord.x + "," +  myHistory[move].coord.y + ")" 
      const desc = move ?
        ' Go to move #' + move + " : " + coordStr:
        ' Go to game start'
      
        /* === is strict equality (considers things of different type to be different) */ 
        if (this.state.stepNumber === move){
          /* The current step button is highlighted  */
          return(
            <li key={move}>
              <button style={buttonStyle} onClick={() => this.toggleOrder()}>{desc}
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
      }
      else if (!winner && this.state.history.length - -1 === 9){
        status = "Draw"
      }
       else {
        status = "Next player:" + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={this.state.winState.winningSquares}
            step={this.state.stepNumber}
            currentStep={myHistory.length - 1}
          />
        </div>
        <div className="game-info">
          <button style={buttonStyle} onClick={() => this.toggleOrder()}>Toggle Move Order</button>
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

 
  
