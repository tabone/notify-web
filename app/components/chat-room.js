import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement () {
    this.$('.app-chat-room')[0].style.height = window.innerHeight + 'px'
  }
});
