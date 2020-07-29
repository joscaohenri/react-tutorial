import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ToggleButton from '@material-ui/lab/ToggleButton';

function Square(props) {
    const name = props.winner? "square highlight" : "square";
    return (
      <button className={name} 
              onClick={() => props.onClick()}
      >
        {props.value}
      </button>
    );
}
  

class Board extends React.Component {
  
  renderSquare(i) {
    return (<Square value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}
                    winner={this.props.highlights[i]}

    />);
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
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      p1IsNext: true,
      p1Char: 'J',
      p2Char: 'R',
      stepNumber: 0,
      ascendingOrder: true,
    };
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      p1IsNext: (step % 2) === 0,
    })
  }

  handleSquareClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.p1IsNext ? this.state.p1Char : this.state.p2Char;
    
    this.setState({
      history: history.concat([{
        squares: squares,
        column: i % 3,
        row: Math.floor(i / 3),
      }]),
      p1IsNext: !this.state.p1IsNext,
      stepNumber: history.length
    });
  }
  setSelected(bool){
    this.setState({
      ascendingOrder: bool,
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winningSequence = calculateWinner(current.squares);
    const selected = this.state.ascendingOrder;
    const orderText = "Ascending Order";
    const highlights = Array(9).fill(null);
    let winner;
    if(winningSequence)
    {
      winner = winningSequence.winner;
      highlights[winningSequence.a] = true;
      highlights[winningSequence.b] = true;
      highlights[winningSequence.c] = true;
    }

    let moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move + 
                          `(${step.column},${step.row})`: 'Go to game start';
      const isBold = (current === step) ? "bold" : "";
      return (
        <li key={move}>
          <button onClick={()=> this.jumpTo(move)}
                  className={isBold}
          >
              {desc}
          </button>
        </li>
      );
    });
    // If the ascending order is set to false, reverse the array.    
    if(!this.state.ascendingOrder)
    {
      moves = moves.reverse()
    }
    let status;
    if(winner){
      status = `The winner is ${winner}.`
    }
    else if ((moves.length < 10) || this.state.stepNumber < 9){
      status = `Next player: 
        ${this.state.p1IsNext ? this.state.p1Char : this.state.p2Char}`;
    }
    else {
      status = 'Draw';
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleSquareClick(i)}
            highlights={highlights}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ToggleButton value="check"
                        selected={this.state.ascendingOrder}
                        onChange={() => this.setSelected(!selected)}                                  
                        >
                        {orderText}                        
          </ToggleButton>
          <ul>{moves}</ul>
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
      return {a, b, c, winner: squares[a]};
    }
  }
  return null;
}