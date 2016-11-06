import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  // host of JSONAPI Server.
  host: 'http://localhost:8080',

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
