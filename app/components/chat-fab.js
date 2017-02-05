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
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    this.set('grants', {
      createBot: this.canCreateBot()
    })
  },

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement (...args) {
    this._super(...args)
    componentHandler.upgradeElements(this.$('[class*="mdl-js-"]'))
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

  actions: {
    /**
     * openRoomCreationDialog opens the dialog used to create a new public room.
     */
    openRoomCreationDialog () {
      this.$('.app-chat-room-creation-dialog dialog')[0].showModal()
    }
  }
})
