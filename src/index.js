import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    var backGround = props.isHighlighted ? 'highlighted-square' : 'square';
    return (
        <button className={backGround} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(squareNumber, isHighlighted) {
        return <Square key={squareNumber} value={this.props.squares[squareNumber]} isHighlighted={isHighlighted} onClick={() => this.props.onClick(squareNumber)} />;
    }

    isSquareInWinnerSquares(winnerSquares, squareNumber) {
        return (winnerSquares[0] === squareNumber || winnerSquares[1] === squareNumber || winnerSquares[2] === squareNumber);
    }

    render() {
        var board = [];
        var squareNumber = 0;
        const winnerSquares = this.props.winnerSquares;
        for (var i = 0; i < 3; i++) {
            var row = [];
            for (var j = 0; j < 3; j++) {
                const isHighlighted = (winnerSquares !== null && this.isSquareInWinnerSquares(winnerSquares, squareNumber));
                row.push(this.renderSquare(squareNumber++, isHighlighted));
            }
            board.push(<div key={i} className="board-row">{row}</div>);
        }
        return <div>{board}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    clickedSquare: 0,
                },
            ],
            stepNumber: 0,
            xIsNext: true,
            winnerSquares: null,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const clickedSquare = i;
        const gameIsOver = this.state.winnerSquares ? true : false;

        if (squares[i]) // do nothing if clicked on an occupied square
            return;

        if (gameIsOver) { // do nothing if the game is over
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                clickedSquare: clickedSquare,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            winnerSquares: calculateWinner(squares),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    allMovesDone(board) {

        if(board === null) return false;

        for(var i=0; i < 9; i++) {
            if (board[i] === null) return false;
        }

        return true;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerSquares = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + displayMoveCoordinates(step.clickedSquare) :
                'Go to the start';
            const buttonClass = this.state.stepNumber === move ? 'bold-button' : '';
            return (
                <li key={move}>
                    <button className={buttonClass} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winnerSquares)
            status = 'Winner: ' + current.squares[winnerSquares[0]];
        else if (this.allMovesDone(current.squares))
            status = 'Game Drawn';
        else
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} winnerSquares={winnerSquares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function displayMoveCoordinates(clickedSquare) {
    return ' (C' + (clickedSquare % 3 + 1) + ', R' + (Math.floor(clickedSquare / 3) + 1) + ')';
}

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
            return lines[i];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

