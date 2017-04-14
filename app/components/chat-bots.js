import Ember from 'ember'

export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-chat-bots app--page-padding'],

  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * store is used to query the Ember Data Repository.
   * @type {Store}
   */
  store: Ember.inject.service(),

  /**
   * Bot instance being viewed inside the bot dialog.
   * @type {Record}
   */
  bot: null,

  /**
   * filter stores the filter query entered by the user. This will then be used
   * to filter the bot list.
   * @type {String}
   */
  filter: null,

  /**
   * isotope instance used to filter the bot list.
   * @type {Object}
   */
  isotope: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)

    // Add an observer to the filter field so that when it changes, it filters
    // the bot list.
    this.addObserver('filter', this, this.doFilter)

    // Create reference of the save & cancel listeners to be passed to bot
    // dialog.
    this.set('saveListener', this.get('save').bind(this))
  },

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement (...args) {
    this._super(...args)
    this.upgradeElements()
    this.setupIsotopeInstance()
  },

  /**
   * upgradeElements register the DOM to mdl.
   */
  upgradeElements () {
    componentHandler.upgradeElements(this.$('[class*="mdl-js-"]'))
  },

  /**
   * didRender hook is called during both render and re-render after the
   * template has rendered and the DOM updated.
   */
  didRender () {
    this.get('isotope').reloadItems()
    this.get('isotope').arrange()
  },

  /**
   * sets up the isotope instance.
   */
  setupIsotopeInstance () {
    // Create isotope instance.
    const iso = new Isotope(this.$('.app-chat-bots__list')[0], {
      itemSelector: '.app-chat-bots__list-item',
      layoutMode: 'masonry'
    })

    // Store isotope instance.
    this.set('isotope', iso)
  },

  /**
   * doFilter the bot list.
   * @param  {Object} ev Key Down Event object.
   */
  doFilter () {
    // Retrieve the value of the
    const value = this.get('filter')

    this.get('isotope').arrange({
      filter () {
        const pattern = RegExp(value)

        const tags = this.dataset.filter.split(',')
          .map(tag => tag.toLowerCase())

        for (let index = 0; index < tags.length; index++) {
          const tag = tags[index]
          if (pattern.test(tag) === true) return true
        }

        return false
      }
    })
  },

  /**
   * save is passed to the bot dialog and is invoked when the user submits the
   * changes.
   * @param  {Object} dialogBot The changes done to the selected/new bot.
   * @return {Promise}          Resolved when the changes have been persisted.
   */
  save (dialogBot) {
    if (dialogBot.isNew === true) {
      // When creating a new bot, we need to create and persist a user and a
      // token.

      // New user.
      const newBot = this.get('store').createRecord('user', {
        username: dialogBot.get('username'),
        bot: true,
        creator: this.get('session.user'),
        rooms: dialogBot.get('rooms')
      })

      // New token.
      const newToken = this.get('store').createRecord('token', {
        origin: dialogBot.get('origin'),
        user: newBot
      })

      // Persist changes.
      newBot.save().then(() => newToken.save()).then(() => {
        this.get('bots').pushObject(newBot)
        this.get('isotope').reloadItems()
        this.get('isotope').arrange()
      })
    } else {
      // When modifying an existing user, we need to apply the changes to the
      // existing user and token and persist the changes.
      const bot = this.get('bot')
      const token = this.get('store').peekRecord('token', bot.get('token.id'))

      bot.set('rooms', dialogBot.get('rooms'))
      bot.set('username', dialogBot.get('username'))
      token.set('origin', dialogBot.get('origin'))

      bot.save().then(() => token.save())
    }
  },

  actions: {
    /**
     * view a bot object inside the bot dialog.
     * @param  {Record} bot Bot record to be viewed.
     */
    view (bot) {
      this.set('bot', bot)
      this.$('.app-chat-bot-dialog')[0].showModal()
    },

    /**
     * remove a bot.
     * @param  {Record} bot Bot record to be removed.
     * @param  {Object} ev  Event object.
     */
    remove (bot, ev) {
      ev.stopPropagation()
      return bot.destroyRecord().then(() => {
        this.get('bots').removeObject(bot)
      })
    },

    /**
     * create a bot.
     * @return {[type]} [description]
     */
    create () {
      const newBot = this.get('store').createRecord('user', {
        bot: true,
        creator: this.get('session.user')
      })

      this.set('bot', newBot)
      this.$('.app-chat-bot-dialog')[0].showModal()
    }
  }
})
