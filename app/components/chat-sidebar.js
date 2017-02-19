import Ember from 'ember'

export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-chat-sidebar'],

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
   * states which the user can choose from.
   * @type {Array{State}}
   */
  states: null,

  /**
   * panelsTopPosition is the position of the HTML Element containing the tab
   * panels for the Collegues and Chat Rooms. This value will then be used to
   * resize the panels to use all the height available.
   * @type {Number}
   */
  panelsTopPosition: null,

  /**
   * panels keeps a reference to the HTML Elements of the Collegues and Chat
   * Rooms tab panels.
   * @type {Array{HTML Element}}
   */
  panels: null,

  /**
   * updates is the number of rooms which have unread updates by the logged in
   * user.
   */
  updates: Ember.computed('session.user.unread', function () {
    const roomIDs = []

    this.get('session.user.unread').forEach(msg => {
      const roomID = msg.get('room.id')
      if (roomIDs.indexOf(roomID) !== -1) return
      roomIDs.push(roomID)
    })

    const unread = roomIDs.length

    if (unread === 0) return null
    if (unread >= 100) return '99+'
    return unread
  }),

  /**
   * listeners keeps references of any listener used within this component. This
   * is done so that when the component is destroyed it can remove them.
   * @type {Object}
   */
  listeners: {
    /**
     * resizePanels is a listener which updates the height of the Collegues and
     * Chat Rooms tab panels when the window is resized.
     * @type {Function}
     */
    resizePanels: null
  },

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(args)
    // Setup states
    this.setupStates()
    // Create listener.
    this.listeners.resizePanels = this.resizePanels.bind(this)
  },

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement (...args) {
    this._super(...args)
    this.handleTabPanelsHeight()
  },

  /**
   * Sets up the states.
   * @return {Promise} Resolved when the states has been configured.
   */
  setupStates () {
    const stateMap = {
      Online: 'online',
      Away: 'away',
      Offline: 'offline'
    }

    const states = {}

    this.get('store').peekAll('state')
      .forEach(state => {
        states[stateMap[state.get('name')]] = state
      })

    this.set('states', states)
  },

  handleTabPanelsHeight () {
    // Get the HTML Element containing the tab panels.
    const panels = this.$('.app-chat-sidebar__conversations-panels')[0]

    // Store its top position.
    this.set('panelsTopPosition', panels.getBoundingClientRect().top)

    // Keep a reference of all the tab panels.
    this.set('panels', this.$('.app-chat-sidebar__conversations-panel'))

    // When the window is resized, it should update the height of the tab
    // panels.
    window.addEventListener('resize', this.get('listeners.resizePanels'))

    this.resizePanels()
  },

  /**
   * resizePanels goes through each tab panel within the sidebar and resizes
   * their height to use all the available height.
   */
  resizePanels () {
    // Retrieve the current window height.
    const windowHeight = window.innerHeight

    // Retrieve the top position of the HTML Element containing all the tab
    // panels.
    const panelsTopPosition = this.get('panelsTopPosition')

    // Update the height of each panel.
    this.get('panels').each((index, panel) => {
      panel.style.height = (windowHeight - panelsTopPosition) + 'px'
    })
  },

  /**
   * willDestroyElement is called when the component will be destroyed by ember.
   */
  willDestroyElement () {
    // When the component is destroyed remove the listener from the window
    // global object.
    window.removeEventListener('resize', this.get('listeners.watchWindowResize'))
  },

  actions: {
    /**
     * changeState changes the online state of the user.
     * @param  {State} state  The newly selected state.
     */
    changeState (state) {
      this.$('.mdl-menu__container')[0].classList.remove('is-visible')
      const user = this.get('session').get('user')
      if (user.get('state').get('id') === state.get('id')) return
      user.set('state', state)
      user.save()
    }
  }
})
