import { LightningElement, track } from 'lwc';
const DEFAULT_SIZE = 3;
const MAX_TIMER = 100;
const TIMER_INTERVAL = 10;
const INTERVAL = 1000;
export default class Board extends LightningElement {
    @track boxes;
    size = DEFAULT_SIZE;
    turn = 'X';
    board;
    started;
    rowSum = [];
    colSum = [];
    diagSum = 0;
    revDiagSum = 0;
    totalSum = 0;

    timeInterval = INTERVAL;
    timeRemaining = MAX_TIMER;
    timer;

    constructor() {
        super();
        //this.initGame();
    }

    initGame() {
        let boxes = [];
        this.board = [...Array(this.size)].map((x) => Array(this.size));
        this.rowSum = [...Array(this.size)].map((x) => 0);
        this.colSum = [...Array(this.size)].map((x) => 0);

        this.totalSum = 0;
        this.timeRemaining = MAX_TIMER;

        this.changeTurn();

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                boxes.push({ key: i + '-' + j, row: i, col: j, type: '' });
            }
        }

        this.boxes = boxes;
        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining -= TIMER_INTERVAL;
            if (this.timeRemaining === 0) {
                console.log('times up');
                this.stopTimer();
            }
        }, this.timeInterval);
    }

    stopTimer() {
        clearInterval(this.timer);
        this.timeRemaining = MAX_TIMER;
    }

    handlePlay(event) {
        let data = event.detail;
        let index = this.boxes.findIndex(
            (box) => box.key === data.row + '-' + data.col
        );
        this.board[data.row][data.col] = this.turn;
        this.checkWin(data.row, data.col, this.turn);
        this.boxes[index].type = this.turn;
        this.changeTurn();
        this.stopTimer();
        this.startTimer();
        console.log(this.board);
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
            console.log(turn + ' won!');
            return turn;
        }
        if (this.checkTie()) {
            console.log('Its a tie!');
            return 'tie';
        }
    }

    checkTie() {
        this.totalSum++;
        return this.totalSum == this.size * this.size;
    }

    handleStart(event) {
        this.stopTimer();
        this.started = 'Start';
        this.initGame();
    }

    get buttonLabel() {
        return this.started ? 'Restart' : 'Start';
    }
}
