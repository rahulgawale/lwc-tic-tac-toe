import { LightningElement, api } from 'lwc';

/**
 * Show an item
 */
export default class Child extends LightningElement {
    @api info;
    @api turn;

    _type = '';
    @api get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }

    handleClick(event) {
        if (!this.type) {
            this._type = this.turn == 'X' ? 'X' : 'O';
            this.dispatchEvent(
                new CustomEvent('play', {
                    detail: {
                        type: this.turn,
                        row: this.info.row,
                        col: this.info.col
                    }
                })
            );
        } else {
            this.dispatchEvent(new CustomEvent('wrongmove'));
        }
    }
}
