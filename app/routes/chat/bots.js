import Ember from 'ember'
import RSVP from 'rsvp'

/**
 * This is the route of the Bot Management page. In this route the user will be
 * able to manage the bots he is the owner of. In order to access this route the
 * user must have the 'CREATE_BOT' grant, which is a grant that authorize him to
 * crate bots.
 */
export default Ember.Route.extend({
  /**
   * session is used to get details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * config is used to retrieve the 'CREATE_BOT' Record stored in Ember
   * DataStore.
   * @type {service:config}
   */
  config: Ember.inject.service(),

  /**
   * Before retrieving the route's model, checks are made to verify that the
   * user is authorized to access the route (i.e. the user has the 'CREATE_BOT'
   * grant - can create bots).
   */
  beforeModel () {
    const config = this.get('config')
    const createBotGrant = config.getGrant(config.grants['CREATE_BOT'])

    // If user doesn't have the CREATE_BOT grant, redirect him to homepage.
    if (this.get('session.user.grants').indexOf(createBotGrant) !== -1) return
    this.transitionTo('chat')
  },

  /**
   * model hook is used to convert the url to a model.
   * Before displaying the route's template, the following info will be
   * retrieved:
   *   > Access Tokens which the user has access to (since in this route the
   *     user will be able to modify the bot tokens).
   *   > Bots which the user owns.
   */
  model () {
    return RSVP.hash({
      // Retrieve tokens.
      tokens: this.get('store').findAll('token'),

      // Retrieve bots.
      bots: this.get('store').peekAll('user').filter(user => {
        /**
         * Indicates that the user being traversed is a bot.
         * @type {Boolean}
         */
        const isBot = user.get('bot')

        /**
         * Indicates that the user being traversed has been created by the
         * logged in user.
         * @type {Boolean}
         */
        const isChild = user.get('creator.id') === this.get('session.user.id')

        // If the user being traversed is a child bot of the logged in user,
        // include it in the list.
        return isChild && isBot
      })
    })
  }
})
