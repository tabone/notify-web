import Ember from 'ember'

/**
 * This component enables the user to easily select multiple items from a
 * filterable list.
 * @param {String}     itemComponent  Component's name to be used for displaying
 *                                    the items that can be selected.
 * @param {String}     chipComponent  Component's name to be used for displaying
 *                                    the selected items.
 * @param {Array{Any}} items          Items which the user can select from.
 * @param {Array{Any}} selected       The array which this component will be
 *                                    putting the selected items in. This will
 *                                    then be used by the parent component to
 *                                    determine which items have been selected.
 * @param {Function}   filter         Function to be used for the filtering of
 *                                    the visible items. This function will be
 *                                    invoked for each item with the current
 *                                    filter value when this component requries
 *                                    filtering.
 */
export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-select'],

  /**
   * Items that comply to the current filter. These are the items that are
   * displayed.
   * @type {Array{Object}}
   */
  visibleItems: null,

  /**
   * Current filter string.
   * @type {String}
   */
  filterValue: null,

  /**
   * This function reference the doSelect function binded to the AppSelect
   * instance and will be provided to the app-select-item component being used.
   * @this {AppSelect}
   * @type {Function}
   */
  select: null,

  /**
   * This function reference the doUnselect function binded to the AppSelect
   * instance and will be provided to the app-select-chip component being used.
   * @type {Function}
   */
  unselect: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    this.set('filterValue', '')
    this.set('visibleItems', [])
    this.set('select', this.doSelect.bind(this))
    this.set('unselect', this.doUnselect.bind(this))
    this.setupObservers()
    this.doFilter()
  },

  /**
   * didUpdateAttrs runs when the attributes of a component have changed.
   */
  didUpdateAttrs (...args) {
    this._super(...args)
    this.doFilter()
  },

  /**
   * setupObservers that this component requires to function.
   */
  setupObservers () {
    this.addObserver('filterValue', this, this.doFilter)
    this.addObserver('selected.[]', this, this.doFilter)
  },

  /**
   * This method invokes the fitler function provided by the parent component
   * for each item with the current filter value.
   */
  doFilter () {
    /**
     * filter is the function provided by the parent component.
     * @type {Function}
     */
    const filter = this.get('filter')

    /**
     * filterValue is the current filter value.
     * @type {String}
     */
    const filterValue = this.get('filterValue')

    // Filter items.
    const visibleItems = this.get('items').filter(item => {
      return filter(filterValue, item)
    })

    // Store filtered items.
    this.set('visibleItems', visibleItems)
  },

  /**
   * doSelect selects an item.
   * @param  {Object}  item to be selected.
   */
  doSelect (item) {
    const selected = this.get('selected')
    if (selected.indexOf(item) === -1) selected.pushObject(item)
  },

  /**
   * doUnselect unselects an item.
   * @param  {Object} item  Item to be unselected
   */
  doUnselect (item) {
    this.get('selected').removeObject(item)
  },

  /**
   * willDestroyElement is an EmberJS hook which is invoked before the component
   * is destroyed.
   */
  willDestroyElement () {
    this.removeObserver('selected.[]', this.doFilter)
  }
})
