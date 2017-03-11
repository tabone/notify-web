import Ember from 'ember'

/**
 * This component is used by app-select component to represent an item which the
 * user can select. In this case it will represent rooms which a bot can write
 * in.
 * @param {Object}   item    The room that can be selected.
 * @param {Function} select  Function used to select the room.
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
  classNames: ['app-select-item-bot-room', 'mdl-list__item'],

  /**
   * click is invoked when the user clicks on the component.
   */
  click () {
    this.get('select')(this.get('item'))
  }
})
