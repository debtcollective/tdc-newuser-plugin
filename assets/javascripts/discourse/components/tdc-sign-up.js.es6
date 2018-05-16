import { solidarityGroupName, hasDebt } from '../tdc-utils';

export default Ember.Component.extend({
  tagName: '', // do not wrap in a div
    
  // isDebtor and isInSolidarity control the visibility of the user fields
  isDebtor: false,
  isInSolidarity: false,

  didRender() {
    // noCollectives is true if the component found no collective groups
    this.set('noCollectives', $('.collective-selectors label').length === 0)
  },

  actions: {
    collectiveSelected(event) {
      // initialize the container for the custom fields
      if (this.get('store.customFields') === undefined) {
        Ember.set(this, 'store.customFields', {});
      }

      // store the list of checked collectives in 'customFields.collectives'
      const elements = $('.collective-selectors input:checked').toArray();

      Ember.set(this, 'store.customFields.collectives', elements.map(element => element.attributes.id.textContent));

      this.set('isInSolidarity', this.get('store.customFields.collectives').includes(solidarityGroupName));
      this.set('isDebtor', hasDebt(this.get('store.customFields.collectives')));
    },
  },
});
