import { acceptance } from "helpers/qunit-helpers";
acceptance("TDS Create Account", { loggedIn: false });

const solidarityFieldIds = ["solidarity-how-can-you-help", "solidarity-employment", "solidarity-skills", "phone"]

test("create account modal submit button works correctly", assert => {
  visit("/");
  click("header .sign-up-button");

  andThen(() => {
    assert.ok(exists('.collective-selectors'))
    assert.not(exists('.tds-field')) // ??
  })

  fillIn('#new-account-name', 'Kilgore Trout')
  fillIn("#new-account-password", 'salmonidae')
  fillin("#new-account-email", "kilgore@trout.com")
  fillIn('#new-account-username', 'kilgore.trout')

  andThen(() => {
    assert.not(submitButtonEnabled(), 'create account button is disabled because the TDS-specific fields are not filled in');
  })

  click("#solidarity-bloc[type=checkbox]");

  andThen(() => {
    assert.ok(solidarityFieldsAllVisible(), 'the solidarity fields become visible')
    assert.not(debtAmountFieldVisible(), 'the debt amount field does not become visible')
    assert.ok(submitButtonEnabled(), 'none of the solidarity fields are required, so the button is enabled')
  })

  click("#student-debt[type=checkbox]");

  andThen(() => {
    assert.ok(solidarityFieldsAllVisible(), 'the solidarity fields are still visible')
    assert.ok(debtAmountFieldVisible(), 'the debt amount field becomes visible')
    assert.not(submitButtonEnabled(), 'the debt amount field must be filled out')
  })

  click('#solidarity-bloc[type=checkbox]')

  andThen(() => {
    assert.not(solidarityFieldsAllVisible(), 'the solidarity fields disappear')
    assert.ok(debtAmountFieldVisible(), 'the debt amount field is still visible')
  })

  fillIn('#debt-amount', '123')

  andThen(() => {
    assert.ok(submitButtonEnabled())
  })

  click('.modal-footer .btn-primary')

  andThen(() => {
    console.log('test')
    const newUser = await User.create({username: this.get('accountUsername')});
    console.log(newUser)
  })
});

const solidarityFieldsAllVisible() = function() {
  return ["solidarity-how-can-you-help", "solidarity-employment", "solidarity-skills", "phone"].reduce(
    (areVisible, id) => exists('#' + id) && areVisible
  )
}

const debtAmountFieldVisible = function() {
  return exists('#debt-amount')
}

const submitButtonEnabled = function() {
  return ! exists('.modal-footer .btn-primary:disabled')
}
