import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * tagName of the root element.
   * @type {String}
   */
  tagName: 'dialog',

  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-chat-finder-dialog', 'mdl-dialog'],

  /**
   * store service to query the Ember Data Repository.
   * @type {Store}
   */
  store: Ember.inject.service(),

  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * filter string entered by the user. This will be used to filter the finder
   * items.
   * @type {String}
   */
  filter: null,

  /**
   * items that match the filter criteria.
   * @type {[type]}
   */
  items: null,

  /**
   * actions available to the user.
   * @type {[type]}
   */
  actions: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    this.set('items', [])
    this.set('actions', [ 'Create Room', 'Manage Bots' ])
    this.setupObservers()
  },

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement (...args) {
    this._super(...args)
    this.polyfillDialog()
  },

  /**
   * polyfillDialog polyfills the dialog for browsers who don't support HTML5
   * Dialog.
   */
  polyfillDialog () {
    dialogPolyfill.registerDialog(this.element)
  },

  /**
   * setupObservers setup up any observers that this component requires to
   * function.
   */
  setupObservers () {
    this.addObserver('filter', this, this.doFilter)
  },

  /**
   * doFilter filters the finder items.
   */
  doFilter () {
    /**
     * Pattern used to filter the finder items.
     * @type {RegExp}
     */
    const pattern = new RegExp(this.get('filter').toLowerCase())

    this.set('items', this.filterActions(pattern)
      .concat(this.filterUsers(pattern))
      .concat(this.filterRooms(pattern)))
  },

  /**
   * filterActions is used to filter the actions by their name.
   * @param  {RegExp} pattern Pattern used to filter the actions.
   * @return {Array} List of actions that match the provided pattern.
   */
  filterActions (pattern) {
    return this.get('actions').filter(action => {
      return pattern.test(action.toLowerCase())
    }).map(action => {
      return {
        data: action,
        component: 'chat-finder-action-item'
      }
    })
  },

  /**
   * filterUsers is used to filter the users by their username.
   * @param  {RegExp} pattern Pattern used to filter the users.
   * @return {Array} List of users that match the provided pattern.
   */
  filterUsers (pattern) {
    return this.get('store').peekAll('user').filter(user => {
      const username = user.get('username').toLowerCase()
      return pattern.test(username) && this.get('session.user') !== user
    }).map(user => {
      return {
        data: user,
        component: 'chat-finder-colleague-item'
      }
    })
  },

  /**
   * filterRooms is used to filter the rooms by their name.
   * @param  {RegExp} pattern Pattern used to filter the rooms.
   * @return {Array} List of rooms that match the provided pattern.
   */
  filterRooms (pattern) {
    return this.get('store').peekAll('room').filter(room => {
      const roomName = room.get('uiName').toLowerCase()
      return pattern.test(roomName) && room.get('private') === false
    }).map(room => {
      return {
        data: room,
        component: 'chat-finder-room-item'
      }
    })
  }
})
