import Ember from 'ember'

/**
 * This component is used by app-select component to represent an item which the
 * user can select. In this case it will represent users who can get invited.
 * @param {Object}   item    The user that can be selected.
 * @param {Function} select  Function used to select the user.
 */
export default Ember.Component.extend({
  /**
   * tagName of the root element.
   * @type {String}
   */
  tagName: ['li'],

  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-select-item-invite-user', 'mdl-list__item'],

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
   * click is invoked when the user clicks on the component. When clicked the
   * user who is being represented by this component is selected to get invited.
   */
  click () {
    this.get('select')(this.get('item'))
  },

  /**
   * keyDown is invoked when the user presses a key while focusing on the
   * component. When triggered with the enter key it should be considered as a
   * click.
   * @param  {Object} ev  KeyDown event.
   */
  keyDown (ev) {
    if (ev.keyCode === 13) this.click()
  }
})
