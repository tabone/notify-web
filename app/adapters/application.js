import DS from 'ember-data'

/**
 * Extend the default JSONAPI Adapter.
 */
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

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    // Set the host of JSONAPI Server.
    this.set('host', this.get('config.api.url'))
  }
});
