import DS from 'ember-data'

export default DS.Model.extend({
  /**
   * name of the state (online, offline, away, etc...)
   */
  name: DS.attr('string'),

  /**
   * users which have the current state set to the model instance.
   */
  users: DS.hasMany('user', {
    inverse: 'state'
  })
})
