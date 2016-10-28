import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement () {
    componentHandler.upgradeElements(this.$('[class*="mdl-js-"]'));
  }
});
