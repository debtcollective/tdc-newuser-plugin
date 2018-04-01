# name: tdc-new-user-plugin
# about: A plugin to extend the standard discourse new user process for The Debt Collective's purposes (https://github.com/debtcollective/parent/issues/18)
# version: 0.0.1

register_asset "stylesheets/common/tdc-new-user.scss"

after_initialize do
  add_custom_user_fields()
  set_up_event_triggers()
end

def add_custom_user_fields()
  custom_user_fields = ['collectives', 'debt_amount', 'solidarity_how_can_you_help',
    'solidarity_employment', 'solidarity_skills', 'phone']

  custom_user_fields.each do |field_name|
    add_to_serializer(:user, :custom_fields) { user.custom_fields[field_name] }
    DiscoursePluginRegistry.serialized_current_user_fields << field_name
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
  # each collective has a correspnding user group (value) and category (key)
  # see seed.js debtcollective/discourse-seed

  collectives = {
    'For Profit Colleges Collective': 'for-profit-colleges',
    'Student Debt Collective': 'student-debt',
    'Credit Card Debt Collective': 'credit-card-debt',
    'Housing Debt Collective': 'housing-debt',
    'Payday Loans Collective': 'payday-loans',
    'Auto Loans Collective': 'auto-loans',
    'Court Fines and Fees Collective': 'court-fines-fees',
    'Medical Debt Collective': 'medical-debt',
    'Solidarity Bloc': 'solidarity-bloc' }

  collectives.each do |category, group|
    if user.custom_fields[collectives].include?(category)
      # the user is in the collective
      group.add(user)
    else # the user is not in the collective
      group.remove(user)
    end
  end
end
