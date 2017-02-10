import Ember from 'ember'
import RSVP from 'rsvp'

export default Ember.Route.extend({
  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * configuration object.
   * @type {service:config}
   */
  config: Ember.inject.service(),

  /**
   * beforeModel hook is the first of the route entry validation hooks called.
   * In order for a user to enter the Bot Management page, he needs to have the
   * CREATE_BOT grant.
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
   */
  model () {
    return RSVP.hash({
      // Retrieve tokens
      tokens: this.get('store').findAll('token'),
      
      // Retrieve bots 
      bots: this.get('store').peekAll('user').filter(user => {
        const isBot = user.get('bot')
        const isChild = user.get('creator.id') === this.get('session.user.id')

        // If the user being traversed is a child bot of the logged in user,
        // include it in the list.
        return isChild && isBot
      })
    })
  }
})
