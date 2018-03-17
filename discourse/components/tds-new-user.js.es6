import Component from '@ember/component';
import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    collectiveSelected(event) {
      alert('collective selection changed!')
    }
  }
});