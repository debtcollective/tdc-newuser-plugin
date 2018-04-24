// Extend discourse/app/assets/javascripts/discourse/controllers/create-account.js.es6
// We want it to know about the new fields
import { ajax } from 'discourse/lib/ajax';
import Ember from 'ember';

import { userPath } from 'discourse/lib/url';
import { withPluginApi } from 'discourse/lib/plugin-api';
import InputValidation from 'discourse/models/input-validation';
import createAccountController from 'discourse/controllers/create-account';
import User from 'discourse/models/user'

import DebtAmountValidation from "../mixins/debt-amount-validation";
import { hasDebt } from '../tdc-utils';

function initializeTdcCreateAccount(api) {

  api.modifyClass('controller:create-account', DebtAmountValidation);

  api.modifyClass('controller:create-account', {
    submitDisabled: function() {
      
      const inputs = this.get('store')

      // default constraints must be satisfied
      if (this._super()) return true;
      
      const customFields = this.get('store.customFields')

      // at least one collective must be selected
      if (customFields === undefined ||
        customFields.collectives === undefined ||
        customFields.collectives.length === 0) {
          return true
      }

      // they must provide debt amount if they are not joining only in solidarity
      if (hasDebt(customFields.collectives) && this.get('debtAmountValidation.failed')) {
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
      'store.customFields.collectives', 'debtAmountValidation.failed'
    ),

    uglyHackPartOne() {
      // the only way to send the custom fields stuff to `User.createAccount` (tdc-user-model)
      // is to piggyback on another property. This will be problematic if we decide to use user
      // fields created via the admin api (unlikely)
      // See uglyHackPartTwo, in tdc-user-model

      const rawCustomFields = this.get('store.customFields')


      if (!hasDebt(rawCustomFields.collectives)) {
        delete rawCustomFields.debtAmount // they don't have debt
      }

      // manipulate custom field data into what discourse expects (ember objects)
      const emberizedCustomFields = Object.keys(rawCustomFields).map(fieldName =>
        Ember.Object.create({ field: { id: fieldName}, value: rawCustomFields[fieldName]}))

      // replace the built-in userFields with customFields
      this.set('userFields', emberizedCustomFields)
    },

    actions: {
      async createAccount() {
        // persist answers
        this.uglyHackPartOne()

        await this._super()
      },
        }
  });      
}

export default {
  name: 'tdc-create-account',
  initialize() {
    withPluginApi('0.8.7', initializeTdcCreateAccount);
  }
}
