import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * tagName of the root element.
   * @type {String}
   */
  tagName: 'li',

  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['mdl-list__item'],

  /**
   * attributeBindings binds the instance fields with the root element
   * attributes.
   * @type {Array}
   */
  attributeBindings: ['tabindex'],

  /**
   * tabIndex of the component.
   * @type {String}
   */
  tabindex: '0',

  /**
   * click is invoked when the user clicks on the component. When invoked it
   * redirects the user to the room this component is representing.
   */
  click () {
    this.get('router').transitionTo('chat.room', this.get('data'))
  },

  /**
   * keyDown is invoked when the user presses a key while focusing the
   * component. When invoked it redirects the user to the room this component
   * is representing
   * @param  {Object} ev KeyDown event object
   */
  keyDown (ev) {
    if (ev.keyCode === 13) this.click()
  }
})
