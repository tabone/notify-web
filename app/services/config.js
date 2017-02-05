import Ember from 'ember'

/**
 * Service used to store common configuration used throughout the app.
 * @type {Object}
 */
export default Ember.Service.extend({
  /**
   * store service to query the Ember Data Repository.
   * @type {Store}
   */
  store: Ember.inject.service(),
  api: {
    url: 'http://localhost:8080'
  },
  auth: {
    url: 'http://localhost:8181/auth'
  },
  ws: {
    url: 'ws://localhost:8282'
  },

  /**
   * grants available.
   * @type {Object}
   */
  grants: {
    /**
     * Grant for users who can create bots.
     */
    'CREATE_BOT': 'CREATE_BOT',

    /**
     * Grant for users who can create other users.
     */
    'CREATE_USER': 'CREATE_USER',

    /**
     * Grant for users who can create tokens.
     */
    'CREATE_TOKEN': 'CREATE_TOKEN'
  },

  /**
   * getGrant returns the grant object by name.
   */
  getGrant (name) {
    const grants = this.get('store').peekAll('grant')

    for (var index = 0; index < grants.get('length'); index++) {
      const grant = grants.objectAt(index)
      if (grant.get('name') === name) return grant
    }

    return null
  }
})
