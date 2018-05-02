# name: tdc-new-user-plugin
# about: A plugin to extend the standard discourse new user process for The Debt Collective's purposes (https://github.com/debtcollective/parent/issues/18)
# version: 0.0.1

after_initialize do
  add_user_custom_fields()
  set_up_event_triggers()

  # make the pretty group names available to the front-end via preload store
  add_to_serializer(:site, :group_names) do
    Group.order(:name).pluck(:name, :full_name)
      .select { |name, full_name| ! full_name.nil? }
      .map { |name, full_name| {:name => name, :full_name => full_name } }
  end
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
  if user.custom_fields['collectives'].nil?
    Rails.logger.warn('A user %<username> was created or updated without any collectives!' % {username: user.username})
    return
  end

  if user.custom_fields['collectives'].is_a?(String)
    # can happen if the user is a member of only one collective
    user.custom_fields['collectives'] = [ user.custom_fields['collectives'] ]
  end

  collective_groups = ['for-profit-colleges', 'student-debt', 'credit-card-debt', 'housing-debt',
    'payday-loans', 'auto-loans', 'court-fines-fees','medical-debt','solidarity-bloc' ]

  collective_groups.each do |group_name|
    group = Group.find_by(name: group_name)
    if user.custom_fields['collectives'].include?(group_name)
      # the user is in the collective
      group.add(user)
    else # the user is not in the collective
      group.remove(user)
    end

    vals = {user: user.username, group_name: group.name}
    if group.save
      Rails.logger.debug("Successfully updated %<user>s's membership in %<group_name>s" % vals)
    else
      Rails.logger.error("Unsuccessful attempt to update %<user>s's membership in %<group_name>s" % vals)
    end
  end
end
