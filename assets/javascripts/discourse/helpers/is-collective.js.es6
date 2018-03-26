import { registerUnbound } from 'discourse-common/lib/helpers';
import { solidarity } from '../constants';

export default registerUnbound('is-collective', function(categoryName, options) {
  // hacky way of making sure the category is a collective
  return categoryName.includes('Collective') || categoryName.includes(solidarity)
});
