# name: tdc-new-user-plugin
# about: A plugin to extend the standard discourse new user process for The Debt Collective's purposes (https://github.com/debtcollective/parent/issues/18)
# version: 0.0.1

register_asset "stylesheets/common/tdc-new-user.scss"

after_initialize do
  add_user_custom_fields()
  set_up_event_triggers()

  add_to_serializer(:site, :group_names) {
    Group.order(:name).pluck(:name, :full_name).select { |name, full_name| ! full_name.nil? }
    .map { |name, full_name|
              {:name => name, :full_name => full_name }
    }
  }
end

def add_user_custom_fields()
  user_custom_fields = ['collectives', 'debt_amount', 'solidarity_how_can_you_help',
    'solidarity_employment', 'solidarity_skills', 'phone']

  user_custom_fields.each do |field_name|
    add_to_serializer(:user, :custom_fields) { user.custom_fields[field_name] }
    DiscoursePluginRegistry.serialized_current_user_fields << field_name
  end

  # ugly hack so that the custom fields don't get filtered out in UsersController.create
  # technically not very robust (if another plugin erases OPTION_ATTR, for example)
  # but I'm reasonably confident it won't be a problem
  ::UserUpdater::OPTION_ATTR.concat [ :custom_fields => [
    :debt_amount,
    :solidarity_how_can_you_help,
    :solidarity_skills,
    :solidarity_employment,
    :phone,
    :collectives => [],
  ] ]
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
  # each collective has a corresponding user group (value) and category (key)
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
  collectives.each do |category, group_id|
    group = Group.find(group_id)
    if user.custom_fields['collectives'].include?(category)
      # the user is in the collective
      group.add(user)
    else # the user is not in the collective
      group.remove(user)
    end

    vals = {user: user.username, group_id: group_id}
    if group.save
      Rails.logger.debug("Successfully updated %<user>s's membership in %<group_id>s" % vals)
    else
      Rails.logger.error("Unsuccessful attempt to update %<user>s's membership in %<group_id>s" % vals)
    end
  end
end
