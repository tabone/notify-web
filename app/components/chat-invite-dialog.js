import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-chat-invite-dialog'],

  /**
   * store service to query the Ember Data Repository.
   * @type {Store}
   */
  store: Ember.inject.service(),

  /**
   * users who can get invited.
   * @type {Array}
   */
  users: null,

  /**
   * invites stores the users who have been chosen to be invited to the room.
   * @type {Array}
   */
  invites: null,

  /**
   * filter used to filter the users by username.
   * @type {Array}
   */
  filter: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    this.set('invites', [])
  },

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement (...args) {
    this._super(...args)
    this.doSetup()
  },

  /**
   * didUpdateAttrs runs when the attributes of a component have changed.
   */
  didUpdateAttrs (...args) {
    this._super(...args)
    this.doSetup()
  },

  /**
   * doSetup sets up the dialog.
   */
  doSetup () {
    this.polyfillDialog()
    this.upgradeElements()
    this.setupObservers()
    this.doFilter()
  },

  /**
   * polyfillDialog polyfills the dialog for browsers who don't support HTML5
   * Dialog.
   */
  polyfillDialog () {
    const dialog = this.$('dialog')[0]
    if (dialog.showModal === undefined) dialogPolyfill.registerDialog(dialog)
  },

  /**
   * upgradeElements is used to register elements with Material Design lite.
   */
  upgradeElements () {
    componentHandler.upgradeElements(this.$('[class*="mdl-js-"]'));
  },

  /**
   * setupObservers observe changes in the filter and invites so that the list
   * of users who can be invited is updated.
   */
  setupObservers () {
    this.addObserver('filter', this, this.doFilter)
    this.addObserver('invites.[]', this, this.doFilter)
  },

  /**
   * doFilter updates the list of users who can be invited.
   */
  doFilter () {
    const filter = this.get('filter') || ''
    const filterPattern = new RegExp(filter.toLowerCase())

    const users = this.get('store').peekAll('user').filter(user => {
      // Username must match the filter pattern.
      if (filterPattern.test(user.get('username')) === false) return false

      // User should not be already a member
      const isAlreadyMember = this.get('room.users')
        .any(memberUser => memberUser.get('id') === user.get('id'))

      if (isAlreadyMember === true) return false

      // User should not be already invited.
      const isAlreadyInvited = this.get('invites')
        .any(invitedUser => invitedUser.get('id') === user.get('id'))

      if (isAlreadyInvited === true) return false

      return true
    })

    this.set('users', users)
  },

  actions: {
    /**
     * add user to the invitation list.
     * @param {Record} user User to be invited.
     */
    add (user) {
      const invites = this.get('invites')
      if (!~invites.indexOf(user)) invites.pushObject(user)
    },

    /**
     * remove user from the invitation list.
     * @param  {Record} user User to be removed.
     */
    remove (user) {
      this.get('invites').removeObject(user)
    },

    /**
     * closeDialog closes the dialog.
     */
    closeDialog () {
      this.$('dialog')[0].close()
      this.set('filter', '')
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
          this.$('dialog')[0].close()
          this.set('filter', '')
          this.set('invites', [])
        })
    }
  }
});
