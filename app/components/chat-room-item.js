import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * name of the room.
   * @type {String}
   */
  name: null,

  /**
   * image of the room.
   * @type {String}
   */
  image: null,

  init (...args) {
    this._super(args)
    this.setRoomName()
    this.setRoomImage()
  },

  /**
   * setRoomName setup the name of the room this component is representing.
   */
  setRoomName () {
    const room = this.get('room')
    let roomName = room.get('name')

    // If the room has been assigned a name, use the assigned name.
    if (roomName !== null) return this.set('name', roomName)

    // In case the room hasn't got a name, the app should concatinate the
    // usernames of the members (excluding the logged in user) and use it as the
    // name for the room.
    const session = this.get('session')
    roomName = []

    room.get('users')
      .then(users => {
        users.forEach(user => {
          if (user === session.get('user')) return
          roomName.push(user.get('username'))
        })

        this.set('name', roomName.join(', '))
      })
  },

  /**
   * setRoomImage setup the image of the room this component is representing.
   */
  setRoomImage () {
    const room = this.get('room')
    let roomImage = room.get('image')

    // If the room has been assigned an image, use the assigned image.
    if (roomImage !== null) return this.set('image', roomImage)

    // In case the room hasn't got an image, the app should use a random image
    // of a member (excluding the logged in user).
    const session = this.get('session')
    room.get('users')
      .then(users => {
        let userIndex = 0
        if (users.objectAt(userIndex) === session.get('user')) userIndex++
        this.set('image', users.objectAt(userIndex).get('image'))
      })
  }
});
