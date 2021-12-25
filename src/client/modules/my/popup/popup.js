import { LightningElement, api } from 'lwc';

export default class Popup extends LightningElement {
    @api message;
    @api title;

    handleClose() {
        const event = new CustomEvent('close');
        this.dispatchEvent(event);
    }
}
