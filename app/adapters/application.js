import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  /**
   * configuration object.
   * @type {service:config}
   */
  config: Ember.inject.service(),

  /**
   * host of JSONAPI Server.
   * @type {String}
   */
  host: null,

  init (...args) {
    this.set('host', this.get('config').get('api').url)
    this._super(...args)
  },

  // ajax is the method which the app will be using to request for JSONAPI
  // resources.
  ajax(url, method, hash) {
    hash = hash || {}
    hash.crossDomain = true
    hash.xhrFields = {
      withCredentials: true
    }
    return this._super(url, method, hash);
  }
});
