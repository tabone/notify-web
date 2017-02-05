import Ember from 'ember'

export default Ember.Component.extend({
  /**
   * tagName of the root element.
   * @type {String}
   */
  tagName: 'nav',

  /**
   * attributeBindings binds the instance fields with the root element
   * attributes.
   * @type {Array}
   */
  attributeBindings: ['role', 'ariaLabel:aria-label'],

  /**
   * role of the component.
   * @type {String}
   */
  role: 'navigation',

  /**
   * ariaLabel describing the component.
   * @type {String}
   */
  ariaLabel: 'List of Collegues',

  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * friends which the user can chat with. This list should contain all non-bot
   * users expect the logged in user himself..
   * @type {Array{Records}}
   */
  friends: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)

    // Filter friends.
    this.filterFriends()

    // When a new user gets registered, we need to show him in the colleagues
    // list.
    this.addObserver('users.[]', () => {
      this.filterFriends()
    })
  },

  /**
   * filterFriends goes through all users and identify those with whome the
   * logged in user can chat with.
   */
  filterFriends () {
    const friends = this.get('users').filter(user => {
      return (user.get('bot') !== true) && (user !== this.get('session.user'))
    })

    this.set('friends', friends)
  }
})
