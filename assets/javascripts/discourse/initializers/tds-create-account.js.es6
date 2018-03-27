// Extend discourse/app/assets/javascripts/discourse/controllers/create-account.js.es6
// We want it to know about the new fields

import { withPluginApi } from 'discourse/lib/plugin-api';
import { solidarity } from '../constants';
import DebtAmountValidation from "../mixins/debt-amount-validation";
import InputValidation from 'discourse/models/input-validation';

import createAccountController from 'discourse/controllers/create-account';

function initializeTdsNewUser(api) {
  
  api.modifyClass('controller:create-account', DebtAmountValidation);

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
      // added for the plugin. `submitDisabled` knows that it may have changed if these changed
      'store.collectives', 'debtAmountValidation.failed'
    ),

    _hasDebt(collectives) { // i.e. is a member of a non-solidarity collective
      return collectives.find(collective => ! collective.includes(solidarity)) !== undefined
    },

    actions: {
      createAccount() {
        // validate answers

        // persist answers
        const inputs = this.get('store')


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
