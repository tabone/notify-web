import DS from 'ember-data';

export default DS.Model.extend({
  /**
   * username of the user.
   */
  username: DS.attr('string'),

  /**
   * image name.
   */
  image: DS.attr('string'),

  /**
   * rooms which the user is a member of.
   */
  rooms: DS.hasMany('room', {
    inverse: 'users'
  }),

  /**
   * state of the user (offline, online, away, etc...)
   */
  state: DS.belongsTo('state', {
    inverse: 'users'
  }),

  /**
   * messages created by the user.
   */
  messages: DS.hasMany('message', {
    inverse: 'user'
  }),

  /**
   * unread messages.
   */
  unread: DS.hasMany('message', {
    inverse: 'unread'
  })
});
