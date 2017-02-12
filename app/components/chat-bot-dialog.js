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
   * tempBot is an object which will be used to store the changes that need to
   * be applied to the bot & token objects being modified or created.
   * @type {Object}
   */
  tempBot: null,

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
    this.setupTempBot()
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
   * setupTempBot configures the temporarly bot object.
   */
  setupTempBot () {
    const bot = this.get('bot')

    this.set('tempBot', Ember.Object.create({
      username: bot.get('username'),
      origin: bot.get('token.origin'),
      token: bot.get('token.token'),
      isNew: bot.get('isNew')
    }))
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
      this.element.close()
    }
  }
})
