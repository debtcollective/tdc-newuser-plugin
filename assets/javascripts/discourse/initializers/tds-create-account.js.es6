// Extend discourse/app/assets/javascripts/discourse/controllers/create-account.js.es6
// We want it to know about the new fields

import { withPluginApi } from 'discourse/lib/plugin-api';

import createAccountController from 'discourse/controllers/create-account';

function initializeTdsNewUser(api) {
  api.modifyClass('controller:create-account', {
    submitDisabled: function() {
      if (this._super()) return true;

      // todo

      return false;
    }.property('passwordRequired', 'nameValidation.failed', 'emailValidation.failed', 'usernameValidation.failed', 'passwordValidation.failed', 'userFieldsValidation.failed', 'formSubmitted'),

    actions: {
      createAccount() {
        // validate answers

        // persist answers

        this._super()
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
