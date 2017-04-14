import Ember from 'ember'

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
   * store is used to query the Ember Data Repository.
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
    const filter = this.get('filter')

    if (filter.length === 0) {
      this.set('items', [])
      return
    }

    /**
     * Pattern used to filter the finder items.
     * @type {RegExp}
     */
    const pattern = new RegExp(filter.toLowerCase())

    this.set('items', this.filterUsers(pattern)
      .concat(this.filterRooms(pattern)))
  },

  /**
   * close filter dialog
   */
  close () {
    this.element.close()
  },

  /**
   * filterUsers is used to filter the users by their username.
   * @param  {RegExp} pattern Pattern used to filter the users.
   * @return {Array} List of users that match the provided pattern.
   */
  filterUsers (pattern) {
    return this.get('store').peekAll('user').filter(user => {
      const username = user.get('username').toLowerCase()
      return pattern.test(username) &&
        this.get('session.user') !== user &&
        user.get('bot') === false
    }).map(user => {
      return {
        close: this.close.bind(this),
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
        close: this.close.bind(this),
        data: room,
        component: 'chat-finder-room-item'
      }
    })
  }
})
