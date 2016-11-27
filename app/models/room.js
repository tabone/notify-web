import DS from 'ember-data';

export default DS.Model.extend({
  session: Ember.inject.service(),

  /**
   * name of the room.
   */
  name: DS.attr('string'),

  /**
   * image name.
   */
  image: DS.attr('string'),

  /**
   * private room or not.
   */
  private: DS.attr('boolean'),

  /**
   * users who are inside the room.
   */
  users: DS.hasMany('user', {
    inverse: 'rooms'
  }),

  /**
   * messages written in the room.
   */
  messages: DS.hasMany('message', {
    inverse: 'room'
  }),

  /**
   * uiName is the room name used in the UI.
   */
  uiName: Ember.computed('name', function () {
    let name = this.get('name')

    // If the room has been assigned a name, use the assigned name.
    if (name !== null) return name

    // In case the room hasn't got a name, the app should concatinate the
    // usernames of the members (excluding the logged in user) and use it as the
    // name for the room.
    const session = this.get('session')
    name = []

    const users = this.get('users')

    users.forEach(user => {
      if (user === session.get('user')) return
      name.push(user.get('username'))
    })

    return name.join(', ')
  }),

  /**
   * uiImage is the image name used in the UI.
   */
  uiImage: Ember.computed('image', function () {
    let image = this.get('image')

    // If the room has been assigned an image, use the assigned image.
    if (image !== null) return image

    // In case the room hasn't got an image, the app should use a random image
    // of a member (excluding the logged in user).
    const session = this.get('session')
    const users = this.get('users')

    let userIndex = 0
    if (users.objectAt(userIndex) === session.get('user')) userIndex++
    console.log(users.objectAt(userIndex).get('image'))
    return users.objectAt(userIndex).get('image')
  })
});
