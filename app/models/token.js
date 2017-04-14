import DS from 'ember-data'

export default DS.Model.extend({
  /**
   * created is the date when the token created.
   */
  created: DS.attr('date'),

  /**
   * origin of the token.
   */
  origin: DS.attr('string'),

  /**
   * token value.
   */
  token: DS.attr('string'),

  /**
   * user the token belongs to.
   */
  user: DS.belongsTo('user', {
    inverse: 'token'
  })
})
