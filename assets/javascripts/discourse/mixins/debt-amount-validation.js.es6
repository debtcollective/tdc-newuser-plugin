import InputValidation from 'discourse/models/input-validation';
import { default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Mixin.create({

  debtAmountValidation: function() {

    const debtAmount = this.get('store.customFields.debt_amount');

    if (! isFinite(debtAmount)) {
      // debtAmount is NaN or infinite
      return InputValidation.create( { failed: true, reason: 'Must be a finite number.'});
    }

    if (debtAmount <= 0) {
      return InputValidation.create( {
        failed: true,
        reason: 'Must be a number greater than zero.'});
    }

    // Looks good!
    return InputValidation.create({
      ok: true
    })
  }.property('store.customFields.debt_amount')
})
