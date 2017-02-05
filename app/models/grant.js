import DS from 'ember-data'

export default DS.Model.extend({
  /**
   * name of grant.
   */
  name: DS.attr('string'),

  /**
   * users who have this grant.
   */
  users: DS.hasMany('user', {
    inverse: 'grants'
  })
})
