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
  classNames: ['app-chat-invite-dialog', 'mdl-dialog'],

  /**
   * store service to query the Ember Data Repository.
   * @type {Store}
   */
  store: Ember.inject.service(),

  /**
   * users that can be invited.
   * @type {Array}
   */
  users: null,

  /**
   * invites stores the users who have been chosen to be invited to the room.
   * @type {Array}
   */
  invites: null,

  /**
   * filter is the function to be used by app-select to filter the users that
   * should be displayed.
   * @this {ChatInviteDialog}
   * @type {Function}
   */
  filter: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    this.set('invites', [])
    this.set('filter', this.doFilter.bind(this))
    this.set('users', this.get('store').peekAll('user'))
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
    // Whenever the user changes the room, without destorying the component, we
    // need to clear the invites. This will in turn notify the app-select
    // component do the filtering for the newly selected room.
    this.set('invites', [])
  },

  /**
   * polyfillDialog polyfills the dialog for browsers who don't support HTML5
   * Dialog.
   */
  polyfillDialog () {
    dialogPolyfill.registerDialog(this.element)
  },

  /**
   * doFilter updates the list of users who can be invited.
   */
  doFilter (filterValue, user) {
    // Create filter RegExp.
    const filterPattern = new RegExp(filterValue.toLowerCase())

    // Username must match the filter pattern.
    if (filterPattern.test(user.get('username')) === false) return false

    // User should not be a bot.
    if (user.get('bot') === true) return false

    // User should not be already a member.
    const isAlreadyMember = this.get('room.users')
      .any(memberUser => memberUser.get('id') === user.get('id'))

    if (isAlreadyMember === true) return false

    // User should not be already invited.
    const isAlreadyInvited = this.get('invites')
      .any(invitedUser => invitedUser.get('id') === user.get('id'))

    if (isAlreadyInvited === true) return false

    return true
  },

  actions: {
    /**
     * closeDialog closes the dialog.
     */
    closeDialog () {
      this.element.close()
      this.set('invites', [])
    },

    /**
     * invite invites the selected users. If an invitation is done from a
     * private room, a new public room is created.
     */
    invite () {
      // Store invited users.
      const invites = this.get('invites')
      // If no invites were issued, do nothing.
      if (invites.get('length') === 0) return

      // Store the room the invites were done in.
      const room = this.get('room')

      let invitePromise = null

      // If the room is not a private room, include the invited users in the
      // room.
      if (room.get('private') === false) {
        this.get('room.users').pushObjects(invites)
        invitePromise = this.get('room').save()
      } else {
        // If the room is a private room, create a new public room with:
        //   * The users of the private room.
        //   * The invited users.
        invitePromise = this.get('store').createRecord('room', {
          private: false,
          users: invites.concat(this.get('room.users').toArray())
        })
        .save()
        .then((newRoom) => {
          this.get('router').transitionTo('chat.room', newRoom)
        })
      }

      return invitePromise
        .then(() => {
          this.element.close()
          this.set('invites', [])
        })
    }
  }
})
