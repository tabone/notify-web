import Ember from 'ember';

export default Ember.Service.extend({
  api: {
    url: 'http://localhost:8080'
  },
  auth: {
    url: 'http://localhost:8181/auth'
  }
});
