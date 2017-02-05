import DS from 'ember-data'

export default DS.Model.extend({
  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
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
    if (name != null) return name

    // In case the room hasn't got a name, the app should concatinate the
    // usernames of the members (excluding the logged in user) and use it as the
    // name for the room.
    const user = this.get('session.user')
    name = []

    const friends = this.get('users')

    friends.forEach(friend => {
      if (friend === user) return
      name.push(friend.get('username'))
    })

    return name.join(', ')
  }),

  /**
   * uiImage is the image name used in the UI.
   */
  uiImage: Ember.computed('image', function () {
    // Get room image
    let image = this.get('image')

    // If the room has been assigned an image, use the assigned image.
    if (image != null) return image

    // In case the room hasn't got an image, the app should use a random image
    // of a member (excluding the logged in user).
    const user = this.get('session.user')
    const users = this.get('users')

    for (let index = 0; index < users.length; index++) {
      // Ignore user if it is the logged in user.
      if (users.objectAt(index) === user) continue

      // Retrieve user image.
      const userImage = users.objectAt(index).get('image')

      // Ignore user if he doesn't have an image.
      if (userImage == null) continue

      // Set image.
      image = userImage
    }

    // If there is a member who has an image, return his image.
    if (image != null) return image

    // Else return the default image.
    return 'no-conversation-image.png'
  })
})
