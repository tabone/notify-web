import DS from 'ember-data'

export default DS.Model.extend({
  /**
   * created.
   */
  created: DS.attr('date'),

  /**
   * created.
   */
  origin: DS.attr('string'),

  /**
   * token value.
   */
  token: DS.attr('string'),

  /**
   * user the token belong to.
   */
  user: DS.belongsTo('user', {
    inverse: 'token'
  })
})
