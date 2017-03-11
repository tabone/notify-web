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
  classNames: ['mdl-list__item'],

  /**
   * click is invoked when the user clicks on the component. When clicked the
   * user who is being represented by this component is selected to get invited.
   */
  click () {
    this.get('select')(this.get('item'))
  }
})
