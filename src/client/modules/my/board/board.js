import { LightningElement, track } from 'lwc';
const DEFAULT_SIZE = 3;
const MAX_TIMER = 100;
const TIMER_INTERVAL = 10;
const INTERVAL = 1000;
export default class Board extends LightningElement {
    @track boxes = [];
    size = DEFAULT_SIZE;

    turn = 'X';

    // stores the result to check winner
    rowSum = [];
    colSum = [];
    diagSum = 0;
    revDiagSum = 0;
    totalSum = 0;

    started;

    timeInterval = INTERVAL;
    timeRemaining = MAX_TIMER;
    timer;

    player1;
    player2;

    message;
    showPopup;
    showPlayerForm = true;

    buttonLabelStart = 'Start';
    buttonLabelRestart = 'Restart';

    initGame() {
        let boxes = [];
        // this.board = [...Array(this.size)].map((x) => Array(this.size));
        this.rowSum = [...Array(this.size)].map((x) => 0);
        this.colSum = [...Array(this.size)].map((x) => 0);

        this.diagSum = 0;
        this.revDiagSum = 0;
        this.totalSum = 0;

        this.timeRemaining = MAX_TIMER;

        this.changeTurn();

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                boxes = [
                    ...boxes,
                    { key: i + '-' + j, row: i, col: j, type: '' }
                ];
            }
        }

        this.boxes = boxes;
        this.startTimer();
    }

    get noBoxes() {
        return !this.boxes.length;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining -= TIMER_INTERVAL;
            if (this.timeRemaining === 0) {
                this.stopTimer();
                this.showPopup = true;
                this.message = 'Times up!';
                this.changeTurn();
                this.setWinningMsg();
            }
        }, this.timeInterval);
    }

    stopTimer() {
        clearInterval(this.timer);
        this.timeRemaining = MAX_TIMER;
    }

    handlePlay(event) {
        console.log('in handlePlay');
        let data = event.detail;
        let index = this.boxes.findIndex(
            (box) => box.key === data.row + '-' + data.col
        );
        // this.board[data.row][data.col] = this.turn;

        // won or tie
        if (this.checkWin(data.row, data.col, this.turn)) {
            this.stopTimer();
        } else {
            // continue playing
            this.boxes[index].type = this.turn;
            this.changeTurn();
            this.stopTimer();
            this.startTimer();
        }
    }

    handleWrongMove(event) {
        console.warn('wrong move!');
    }

    changeTurn() {
        this.turn = this.turn === 'X' ? 'O' : 'X';
    }

    checkWin(row, col, turn) {
        let val = turn === 'X' ? 1 : -1;
        this.rowSum[row] += val;
        this.colSum[col] += val;

        if (row === col) {
            this.diagSum += val;
        }

        if (row === this.size - col - 1) {
            this.revDiagSum += val;
        }

        if (
            Math.abs(this.rowSum[row]) === this.size ||
            Math.abs(this.colSum[col]) === this.size ||
            Math.abs(this.diagSum) === this.size ||
            Math.abs(this.revDiagSum) == this.size
        ) {
            this.setWinningMsg();
            return turn;
        }
        if (this.checkTie()) {
            this.message = 'Its a tie!';
            this.showPopup = true;
            return 'tie';
        }
    }

    checkTie() {
        this.totalSum++;
        return this.totalSum == this.size * this.size;
    }

    handleStart(event) {
        if (this.template.querySelector('my-player-form').validateInputs()) {
            this.started = 'Start';
            this.showPlayerForm = false;
            this.initGame();
        } else {
            this.message = 'Please enter both players';
            this.showPopup = true;
        }
    }

    handleRestart(event) {
        this.stopTimer();
        this.initGame();
    }

    handleClose(event) {
        this.showPopup = false;
    }

    handleFormChange(event) {
        this.player1 = event.detail.player1;
        this.player2 = event.detail.player2;
    }

    get playerName() {
        return 'X' === this.turn ? this.player1 : this.player2;
    }

    setWinningMsg() {
        this.message = this.playerName + ' won!';
        this.showPopup = true;
    }
}
