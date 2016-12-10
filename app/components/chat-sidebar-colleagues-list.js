import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * tagName of the root element.
   * @type {String}
   */
  tagName: 'nav',

  /**
   * attributeBindings binds the instance fields with the root element
   * attributes.
   * @type {Array}
   */
  attributeBindings: ['role', 'ariaLabel:aria-label'],

  /**
   * role of the component.
   * @type {String}
   */
  role: 'navigation',

  /**
   * ariaLabel describing the component.
   * @type {String}
   */
  ariaLabel: 'List of Collegues'
});
