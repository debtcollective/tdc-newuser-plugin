import InputValidation from 'discourse/models/input-validation';
import { default as computed } from 'ember-addons/ember-computed-decorators';

export default Ember.Mixin.create({

  debtAmountValidation: function() {
    console.log('inmixin debt amount validation');

    const debtAmount = this.get('store.debtAmount');

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
  }.property('store.debtAmount')
})
