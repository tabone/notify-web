import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['app-chat-room'],

  /**
   * listener used to keep the chat room component at full height.
   * @type {Function}
   */
  listener: null,

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement () {
    // The root element of the chat room component.
    const rootElem = this.$()[0]

    const fn = () => {
      rootElem.style.height = window.innerHeight + 'px'
    }
    
    fn()
    this.set('listener', fn)
    window.addEventListener('resize', fn)
  },

  /**
   * willDestroyElement is called before the element of the view is removed by
   * Ember.
   */
  willDestroyElement () {
    window.removeEventListener('resize', this.get('listener'))
  }
});
