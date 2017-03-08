import Ember from 'ember'

export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-chat-fab'],

  /**
   * configuration object.
   * @type {service:config}
   */
  config: Ember.inject.service(),

  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * store service to query the Ember Data Repository.
   * @type {Store}
   */
  store: Ember.inject.service(),

  /**
   * grants the logged in user has.
   * @type {Object}
   */
  grants: null,

  /**
   * listener for key down events. This is mainly to keep a reference of the
   * function assigned to the glonal keydown event so that when this component
   * is destroyed we can easily remove it.
   * @type {Function}
   */
  keyDownListener: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    this.set('grants', {
      createBot: this.canCreateBot()
    })

    const keyDownListener = this.onKeyDown.bind(this)
    this.set('keyDownListener', keyDownListener)
    window.addEventListener('keydown', keyDownListener)
  },

  /**
   * onKeyDown event is the listener that will be invoked on every keydown event
   * in the app.
   * @param  {Object} ev Key Down Event object.
   */
  onKeyDown (ev) {
    // In order to use a global shortcut user must press CTRL + ALT.
    if (!ev.altKey || !ev.ctrlKey) return

    switch (ev.keyCode) {
      // F - Finder Dialog.
      case 70: {
        this.actions.openFinderDialog.call(this)
        break
      }
      // R - Room Creation.
      case 82: {
        this.actions.openRoomCreationDialog.call(this)
        break
      }
      // B - Bot Management Page.
      case 66: {
        this.actions.openBotManagementPage.call(this)
        break
      }
    }
  },

  /**
   * canCreateBot determines whether the logged in user is allowed to create
   * bots.
   * @return {Boolean} True if the user can, false otherwise.
   */
  canCreateBot () {
    const config = this.get('config')
    const user = this.get('session.user')
    const grants = user.get('grants')
    return grants.indexOf(config.getGrant(config.grants['CREATE_BOT'])) !== -1
  },

  /**
   * willDestroyElement is an EmberJS hook which is invoked before the component
   * is destroyed.
   */
  willDestroyElement () {
    // When the cmponent is destroyed we should remove any global events
    // registered.
    window.removeEventListener('keydown', this.get('keyDownListener'))
  },

  actions: {
    /**
     * openFinderDialog opens the dialog used to create a new public room.
     */
    openFinderDialog () {
      this.$('.app-chat-finder-dialog')[0].showModal()
    },

    /**
     * openRoomCreationDialog opens the dialog used to create a new public room.
     */
    openRoomCreationDialog () {
      this.$('.app-chat-room-creation-dialog')[0].showModal()
    },

    /**
     * openBotManagementPage redirects the user to the Bot Management Page.
     */
    openBotManagementPage () {
      if (this.canCreateBot() === false) return
      this.get('router').transitionTo('chat.bots')
    }
  }
})
