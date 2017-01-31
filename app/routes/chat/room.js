import Ember from 'ember';

export default Ember.Route.extend({
  /**
   * model hook is used to convert the url to a model.
   */
  model (params) {
    return this.get('store').findRecord('room', params['room_id'])
  }
});
