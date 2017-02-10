import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-chat-bots app--page-padding'],

  /**
   * isotope instance used to filter the bot list.
   * @type {Object}
   */
  isotope: null,

  /**
   * selected bot being viewed inside the chat-bot-dialog
   * @type {Record}
   */
  selectedBot: null,

  /**
   * filter stores the filter query entered by the user.
   * @type {String}
   */
  filter: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)

    // Add an observer to the filter field so that when it changes, it filters
    // the bot list.
    this.addObserver('filter', this, this.doFilter)
  },

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement (...args) {
    this._super(...args)

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

  actions: {
    /**
     * view a bot object inside the bot dialog.
     * @param  {Record} bot Bot record to be viewed.
     */
    view (bot) {
      this.set('selectedBot', bot)
    },

    /**
     * remove a bot.
     * @param  {Record} bot Bot record to be removed.
     * @param  {Object} ev  Event object.
     */
    remove (bot, ev) {
      ev.stopPropagation()
      console.log('removed')
    }
  }
});
