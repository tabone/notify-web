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
   * bot or not.
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
  }),

  /**
   * uiImage is the image name used in the UI.
   */
  uiImage: Ember.computed('image', function () {
    // Retrive user image
    let image = this.get('image')

    // If the user does have an image, return the image name
    if (image != null) return image

    // Else return the default name.
    return 'no-user-image.png'
  })
})
