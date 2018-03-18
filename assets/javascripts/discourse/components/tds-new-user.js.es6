import { solidarity } from '../constants';

export default Ember.Component.extend({
  // isDebtor and isInSolidarity control the visibility of the user fields
  isDebtor: false,
  isInSolidarity: false,

  actions: {
    collectiveSelected(event) {

      const elements = $(".collective-selectors input:checked").toArray()
      const collectives = elements.map(element => element.attributes.value.value)
      
      Ember.set(this, 'isInSolidarity', collectives.includes(solidarity))
      Ember.set(this, 'isDebtor', collectives.filter(x => x != solidarity).length > 0)
    }
  }
});