import { useState } from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled/macro';
import './index.css';

const SquareContainer = styled.button`
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
  :focus {
    outline: none;
  }
`

const BoardRow = styled.div`
  :after {
    clear: both;
    content: "";
    display: table;    
  }
`

const GameContainer = styled.div`
  display: flex;
  flex-direction: row;
`
const GameBoard = styled.div`
`

const GameInfo = styled.div`
  margin-left: 20px;
`

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
  for (const line of lines) {
    const [a, b, c] = line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Square({ value, handleClick }) {
  return (
    <SquareContainer 
      value={value}
      onClick={handleClick}
    >
      {value}
    </SquareContainer>
  )
}

function Board({ squares, handleClick }) {
  return (
    <div>
      <BoardRow>
        <Square value={squares[0]} handleClick={handleClick(0)}></Square>
        <Square value={squares[1]} handleClick={handleClick(1)}></Square>
        <Square value={squares[2]} handleClick={handleClick(2)}></Square>
      </BoardRow>
      <BoardRow>
        <Square value={squares[3]} handleClick={handleClick(3)}></Square>
        <Square value={squares[4]} handleClick={handleClick(4)}></Square>
        <Square value={squares[5]} handleClick={handleClick(5)}></Square>
      </BoardRow>
      <BoardRow>
        <Square value={squares[6]} handleClick={handleClick(6)}></Square>
        <Square value={squares[7]} handleClick={handleClick(7)}></Square>
        <Square value={squares[8]} handleClick={handleClick(8)}></Square>
      </BoardRow>
    </div>
  );
}

function Game() {
  const [state, setState] = useState({
    history: [{
      squares: Array(9).fill(null)
    }],
    stepNumber: 0,
    xIsNext: true
  })
  console.log(state)
  const history = state.history;
  const current = history[state.stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (state.xIsNext ? 'X' : 'O');
  }

  // 跳回歷史紀錄
  function jumpTo(step) {
    setState({
      ...state,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  // 出棋
  function handleClick(i) {
    return () => {
      // 回到歷史時，把它當作新的起點
      const history = state.history.slice(0, state.stepNumber + 1)
      const current = history[history.length - 1]
      const squares = current.squares.slice()
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = state.xIsNext ? 'X' : 'O';
      setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !state.xIsNext
      });
    }
  }

  return (  
    <GameContainer>
      <GameBoard>
        <Board
          squares={current.squares}
          handleClick={(i) => handleClick(i)}
        />
      </GameBoard>
      <GameInfo>
        <div>{status}</div>
        <ol>{moves}</ol>
      </GameInfo>
    </GameContainer>
  )
}

ReactDOM.render(
    <Game />,
  document.getElementById('root')
);
