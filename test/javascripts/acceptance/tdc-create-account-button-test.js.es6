import { acceptance } from 'helpers/qunit-helpers';
import User from 'discourse/models/user';

acceptance('TDC Create Account', {
  site: {
    group_names: [
      { name: 'solidarity-bloc', full_name: 'Solidarity Bloc' },
      { name: 'student-debt', full_name: 'Student Debt Collective' },
    ],
    loggedIn: false,
  },
});

test('create account modal submit button works correctly', assert => {
  visit('/');
  click('header .sign-up-button');

  andThen(() => {
    assert.ok(exists('.collective-selectors'));
  });

  fillIn('#new-account-name', 'Kilgore Trout');
  fillIn('#new-account-password', 'salmonidae');
  fillIn('#new-account-email', 'kilgore@trout.com');
  const username = 'kilgore.trout';
  fillIn('#new-account-username', username);

  andThen(() => {
    assert.not(
      submitButtonEnabled(),
      'create account button is disabled because the TDS-specific fields are not filled in',
    );
  });

  click('input#solidarity-bloc[type=checkbox]');

  andThen(() => {
    assert.ok(solidarityFieldsAllVisible(), 'the solidarity fields become visible');
    assert.not(debtAmountFieldVisible(), 'the debt amount field does not become visible');
    assert.ok(submitButtonEnabled(), 'none of the solidarity fields are required, so the button is enabled');
  });

  click('input#student-debt[type=checkbox]');

  andThen(() => {
    assert.ok(solidarityFieldsAllVisible(), 'the solidarity fields are still visible');
    assert.ok(debtAmountFieldVisible(), 'the debt amount field becomes visible');
    assert.not(submitButtonEnabled(), 'the debt amount field must be filled out');
  });

  click('input#solidarity-bloc[type=checkbox]');

  andThen(() => {
    assert.not(solidarityFieldsAllVisible(), 'the solidarity fields disappear');
    assert.ok(debtAmountFieldVisible(), 'the debt amount field is still visible');
  });

  fillIn('#debt-amount', '123');

  andThen(() => {
    assert.ok(submitButtonEnabled());
  });
});

const solidarityFieldsAllVisible = function() {
  return ['solidarity-how-can-you-help', 'solidarity-employment', 'solidarity-skills', 'phone'].reduce(
    (areVisible, id) => {
      return exists('#' + id) && areVisible;
    },
  );
};

const debtAmountFieldVisible = function() {
  return exists('#debt-amount');
};

const submitButtonEnabled = function() {
  return !exists('.modal-footer .btn-primary:disabled');
};
