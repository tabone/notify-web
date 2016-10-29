import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement () {
    this.$('.app-chat-room')[0].style.height = window.innerHeight + 'px'
  }
});
