import Ember from 'ember'
import DS from 'ember-data'

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
   * indicates whether the user is a bot.
   */
  bot: DS.attr('boolean'),

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
   * creator of the user.
   * @type {Array}
   */
  creator: DS.belongsTo('user', {
    inverse: 'created'
  }),

  /**
   * other users which this user has created.
   * @type {Array}
   */
  created: DS.hasMany('user', {
    inverse: 'creator'
  }),

  /**
   * grants of the user.
   */
  grants: DS.hasMany('grant', {
    inverse: 'users'
  }),

  /**
   * messages created by the user.
   */
  messages: DS.hasMany('message', {
    inverse: 'user'
  }),

  /**
   * token which the user uses to log in.
   */
  token: DS.belongsTo('token', {
    inverse: 'user'
  }),

  /**
   * unread messages.
   */
  unread: DS.hasMany('message', {
    inverse: 'unread'
  }),

  /**
   * uiImage is the image name used in the UI. Use the user's image if he has
   * one, else show the defualt image.
   */
  uiImage: Ember.computed('image', function () {
    // Use user image if he has one, else use the default one.
    return this.get('image') || 'no-user-image.png'
  })
})
