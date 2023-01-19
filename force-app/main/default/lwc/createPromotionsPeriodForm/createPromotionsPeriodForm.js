import { LightningElement, api } from 'lwc';

export default class CreatePromotionsPeriodForm extends LightningElement {
    @api recordId;
    @api promotionId;
    @api pmiId;
    @api productId;
    @api actiontype;

    labels = {
        cancel: { label: 'Cancel' },
        save: { label: 'Save' }
    }

    cancel() {

    }
    save() {
        
    }
}