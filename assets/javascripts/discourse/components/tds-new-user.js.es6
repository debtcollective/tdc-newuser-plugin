export default Ember.Component.extend({
  // isDebtor and isInSolidarity control the visibility of the user fields
  isDebtor: false,
  isInSolidarity: false,

  actions: {
    collectiveSelected(event) {
      const solidarityBloc = "Solidarity Bloc"

      const elements = $(".collective-selectors input:checked").toArray()
      const collectives = elements.map(element => element.attributes.value.value)
      
      Ember.set(this, 'isInSolidarity', collectives.includes(solidarityBloc))
      Ember.set(this, 'isDebtor', collectives.filter(x => x != solidarityBloc).length > 0)
    }
  }
});