// Extend discourse/app/assets/javascripts/discourse/controllers/create-account.js.es6
// We want it to know about the new fields

import { withPluginApi } from 'discourse/lib/plugin-api';
import { solidarity } from '../constants';
import { default as computed } from 'ember-addons/ember-computed-decorators';
import InputValidation from 'discourse/models/input-validation';

import createAccountController from 'discourse/controllers/create-account';

function initializeTdsNewUser(api) {
  api.modifyClass('controller:create-account', {

    submitDisabled: function() {
      const inputs = this.get('store')

      // default constraints must be satisfied
      if (this._super()) return true;

      // at least one collective must be selected
      if (inputs.collectives === undefined || inputs.collectives.length === 0) return true;
      
      // they must provide debt amount if they are joining a debt collective
      if (this._hasDebt(inputs.collectives) && this.get('debtAmountValidation.failed')) {
        console.log('HAS DEBT AND DEBTVALIDATION FAILED')
        return true;
      }

      // looks good
      return false;
    }.property(
      // discourse properties taken from original method definition
      'passwordRequired', 'nameValidation.failed', 'emailValidation.failed',
      'usernameValidation.failed', 'passwordValidation.failed', 'userFieldsValidation.failed',
      'formSubmitted',
      // added for the plugin. `submitDisabled` will fire when Ember knows these properties change
      'store.collectives', 'debtAmountValidation.failed'
    ),

    _hasDebt(collectives) { // i.e. is a member of a non-solidarity collective
      return collectives.find(collective => ! collective.includes(solidarity)) !== undefined
    },

    @computed('store.debtAmount')
    debtAmountValidation() {
      console.log('INCLASS debt amount validation')
  
      const debtAmount = this.get('store.debtAmount')

      if (! isFinite(debtAmount)) {
        // debtAmount is NaN or infinite
        return InputValidation.create( { failed: true, reason: 'Must be a finite number.'})
      }

      if (debtAmount <= 0) {
        return InputValidation.create( {
          failed: true,
          reason: 'Must be a number greater than zero.'})
      }
  
      // Looks good!
      return InputValidation.create({
        ok: true
      });
    },

    actions: {
      createAccount() {
        // validate answers

        // persist answers

        return this._super()
      }
    }
  })
}

export default {
  name: 'tdc-create-account',
  initialize() {
    withPluginApi('0.8.7', initializeTdsNewUser);
  }
}
