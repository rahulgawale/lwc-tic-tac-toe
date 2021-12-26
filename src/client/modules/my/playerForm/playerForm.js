import { LightningElement, api } from 'lwc';
export default class PlyerForm extends LightningElement {
    player1;
    player2;

    handlePlayer1(event) {
        this.player1 = event.target.value;
        this.fireEvent();
    }

    handlePlayer2(event) {
        this.player2 = event.target.value;
        this.fireEvent();
    }

    fireEvent() {
        const event = new CustomEvent('change', {
            detail: { player1: this.player1, player2: this.player2 }
        });
        this.dispatchEvent(event);
    }

    @api
    validateInputs() {
        if (this.player1 && this.player2) {
            return true;
        } else {
            return false;
        }
    }
}
