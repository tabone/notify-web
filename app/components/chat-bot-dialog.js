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
  classNames: ['app-chat-bot-dialog', 'mdl-dialog'],

  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * rooms which a bot can write into. These will be rooms which the bot creator
   * is a member of.
   * @type {Array{Record}}
   */
  rooms: null,

  /**
   * filter function to be used by app-select component.
   * @this {BotDialog}
   * @type {Function}
   */
  filter: null,

  /**
   * tempBot is an object which will be used to store the changes that need to
   * be applied to the bot & token objects being modified or created.
   * @type {Object}
   */
  tempBot: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    this.set('filter', this.doFilter.bind(this))
    this.set('rooms', this.get('session.user.rooms'))
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
   * didUpdateAttrs runs when the attributes of a component have changed.
   */
  didUpdateAttrs (...args) {
    this._super(...args)
    this.syncTempBot()
  },

  /**
   * didRender hook is called during both render and re-render after the
   * template has rendered and the DOM updated. Currently there is a bug in mdl
   * where it doesn't update the dirty flag (is-dirty class) of a textfield when
   * inserting the value using JavaScript. For this reason this check needs to
   * be done manually. We have choose to use the didRender because at this stage
   * the values would have been inserted in their respective textfields.
   */
  didRender (...args) {
    this._super(...args)

    // When rendering the template, check whether the textifields are dirty.
    this.$('.mdl-js-textfield').each((index, elem) => {
      const materialTextfield = elem.MaterialTextfield

      // Since the dom registration of this component is being made by a parent
      // component (chat-bots) the textfields elements at the first invocation
      // of didRender would still not have been registered with mdl and we
      // should therefore skip the check.
      if (materialTextfield !== undefined) materialTextfield.checkDirty()
    })
  },

  /**
   * polyfillDialog polyfills the dialog for browsers who don't support HTML5
   * Dialog.
   */
  polyfillDialog () {
    dialogPolyfill.registerDialog(this.element)
  },

  /**
   * syncTempBot syncs the temporarly bot object with the current selected bot.
   */
  syncTempBot () {
    const bot = this.get('bot')
    let tempBot = this.get('tempBot')

    if (tempBot === null) {
      tempBot = Ember.Object.create()
    }

    tempBot.set('username', bot.get('username'))
    tempBot.set('rooms', bot.get('rooms').slice(0))
    tempBot.set('origin', bot.get('token.origin'))
    tempBot.set('token', bot.get('token.token'))
    tempBot.set('isNew', bot.get('isNew'))

    this.set('tempBot', tempBot)
  },

  /**
   * doFilter will be invoked by 'app-select' for each selectable room with the
   * current filter value to determine whether it should display the room or
   * not.
   * @param  {String} filterValue  Current filter value.
   * @param  {Record} room         Room to be checked.
   * @return {Boolean}             True if the room should be displayed as a
   *                               selectable option, false otherwise.
   */
  doFilter (filterValue, room) {
    // Determine whether the user has selected a bot. Note that this component
    // is initialized when the bot page is loaded.
    if (this.get('bot') === null) return false

    // Bots can only write in public rooms.
    if (room.get('private') === true) return false

    // Room name must match the filter pattern.
    const filterPattern = new RegExp(filterValue.toLowerCase())
    if (filterPattern.test(room.get('uiName').toLowerCase()) === false) {
      return false
    }

    // Room should not be already added.
    const isAlreadyPermitted = this.get('tempBot.rooms').any(permittedRoom => {
      return permittedRoom.get('id') === room.get('id')
    })

    if (isAlreadyPermitted === true) return false

    return true
  },

  actions: {
    /**
     * save will invoke the save listener with the changes done to the provided
     * bot.
     */
    save () {
      this.element.close()
      this.get('save')(this.get('tempBot'))
    },

    /**
     * cloe closes the dialog without doing any changes.
     */
    close () {
      this.syncTempBot()
      this.element.close()
    }
  }
})
