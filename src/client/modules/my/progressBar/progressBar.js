import { LightningElement, api } from 'lwc';

export default class ProgressBar extends LightningElement {
    @api value = 0;
    @api color = '#4898f3';
    @api height = '0.5rem';
    @api borderRadius = '0.5rem';
    @api placeholder = '0%';

    get style() {
        let style = `width: ${this.value}%`;
        style += `; height: ${this.height}`;
        style += `; background-color: ${this.color}`;
        style += `; border-radius: ${this.borderRadius}`;
        return style;
    }
}
