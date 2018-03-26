import { solidarity } from '../constants';

export default Ember.Component.extend({
  // isDebtor and isInSolidarity control the visibility of the user fields
  isDebtor: false,
  isInSolidarity: false,

  actions: {
    collectiveSelected(event) {
      const elements = $(".collective-selectors input:checked").toArray()
      Ember.set(this, 'store.collectives', elements.map(element => element.attributes.id.textContent));
      
      Ember.set(this, 'isInSolidarity', this.store.collectives.includes(solidarity));
      Ember.set(this, 'isDebtor', this.store.collectives.filter(x => x != solidarity).length > 0);
    }
  }
});