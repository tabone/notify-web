import Ember from 'ember'

/**
 * This component is used by app-select component to represent selected items.
 * In this case this component will represent rooms which the bot can write in.
 * @param {Object}   item      The selected room.
 * @param {Function} unselect  Function used to unselect the room.
 */
export default Ember.Component.extend({
  /**
   * tagName of the root element.
   * @type {String}
   */
  tagName: 'span',

  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['mdl-chip', 'mdl-chip--deletable'],

  actions: {
    /**
     * unselect the user that this component is representing.
     */
    unselect () {
      this.get('unselect')(this.get('item'))
    }
  }
})
