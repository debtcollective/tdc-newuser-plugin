import { registerUnbound } from 'discourse-common/lib/helpers';
import { solidarityFullName } from '../tdc-utils';

// This is a handlebars helper

export default registerUnbound('is-collective', function(name, options) {
  if (name === undefined) return false

  // hacky way of making sure the category is a collective
  return name.includes('Collective') || name.includes(solidarityFullName)
});
