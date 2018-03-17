# name: tdc-newuser
# about: A plugin to extend the standard discourse new user process for The Debt Collective's purposes (https://github.com/debtcollective/parent/issues/18)
# version: 0.0.1

register_asset "stylesheets/common/tds-new-user.scss"

after_initialize do
  puts ['hiiiii shoshana!!!!!']

  add_custom_user_fields()

  set_up_event_triggers()

  puts ['doonnnnneeee']
end

# each collective has a correspnding user group (value) and category (key)
# see seed.js debtsyndicate/discourse-seed
collectives = { 'For Profit Colleges Collective': 'for-profit-colleges',
'Student Debt Collective': 'student0debt',
'Credit Card Debt Collective': 'credit-card-debt',
'Housing Debt Collective': 'housing-debt',
'Payday Loans Collective': 'payday-loans',
 'Auto Loans Collective': 'auto-loans',
'Court Fines and Fees Collective': 'court-fines-fees',
'Medical Debt Collective': 'medical-debt',
'Solidarity Bloc': 'solidarity-bloc'
}

def add_custom_user_fields()
  # why doesn't this re-add them every time the app starts up? ???
  
  custom_user_fields = {
    'collectives': :list,
    'debt_amount': :bigdecimal,
    'solidarity_how_can_you_help': :text,
    'solidarity_employment': :text,
    'solidarity_skills': :text,
    'phone': :text }

  custom_user_fields.each do |field_name, field_type|
    User.register_custom_field_type(field_name, field_type)
    add_to_serializer(:user, :custom_fields) { user.custom_fields[field_name] }
  end  
end

def set_up_event_triggers()
  DiscourseEvent.on(:user_created) do |user|
    assign_user_groups(user)
  end

  DiscourseEvent.on(:user_updated) do |user|
    assign_user_groups(user)
  end
end

def assign_user_groups(user)
  collectives.each do |category, group|
    if user.custom_fields[collectives].include?(category)
      # the user is in the collective
      group.add(user)
    else # the user is not in the collective
      group.remove(user)
    end
  end
end

# gem, rvm, bundle, discourse, rails, ember, handlebars, jquery, brew, SCSS
