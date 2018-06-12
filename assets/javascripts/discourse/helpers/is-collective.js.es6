import { registerUnbound } from 'discourse-common/lib/helpers';
import { solidarityFullName } from '../tdc-utils';

// This is a handlebars helper

const collective = 'Collective'

export default registerUnbound('is-collective', function(name, options) {
  if (name === undefined) return false;

  // hacky way of making sure the category is a collective
  if (name.indexOf(collective) === name.length - collective.length) { // it ends with "Collective"
     return true
  }

  if (name === solidarityFullName) { // it's the solidarity bloc
     return true
  }

  return false
});
