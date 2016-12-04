import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['app-chat-room-conversation'],

  /**
   * store service to query the Ember Data Repository.
   * @type {Store}
   */
  store: Ember.inject.service(),

  /**
   * session is used to get the details of the current logged in user.
   * @type {service:session}
   */
  session: Ember.inject.service(),

  /**
   * roomCache is used to cache messages by room.
   * @type {service:roomCache}
   */
  roomCache: Ember.inject.service(),

  /**
   * limit is the total number of records to retrieve on each request
   * @type {Number}
   */
  limit: null,

  /**
   * messages being shown.
   * @type {Array}
   */
  messages: null,

  /**
   * message to be sent.
   * @type {String}
   */
  message: null,

  init (...args) {
    this._super(...args)
    this.set('limit', 10)
    this.set('messages', [])
  }

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement () {
    this.showMessages()
  },

  /**
   * didUpdateAttrs runs when the attributes of a component have changed.
   */
  didUpdateAttrs () {
    this.showMessages()
  },

  /**
   * showMessages displays the messages of the room. Before it requests messages
   * from the API it checks for cached ones.
   * @param  {Number} offset From where to start
   * @return {Promise}       Resolved once the requested messages have been
   *                         retrieved.
   */
  showMessages (offset = 0) {
    // The id of the room the user is in.
    const roomID = this.get('room.id')

    // First retrieve and display the cached messages.
    const messages = this.get('roomCache').read(roomID)
    this.set('messages', messages)

    // Once we have displayed the cached messages, we will check if there is
    // room for more.
    let limit = this.get('limit')
    const maxOffset = offset + limit - 1

    // If there isn't do nothing.
    if (messages.length >= maxOffset) return Promise.resolve(messages)

    // If there is, update the offset and limit and request for more.
    offset = messages.length
    limit = maxOffset - offset + 1

    return this.get('store').query('message', {
      filter: {
        room: roomID
      },
      page: {
        limit,
        offset
      }
    })
    .then(messages => {
      this.get('roomCache').cache(roomID, ...messages.toArray())
    })
  },

  actions: {
    /**
     * submitMessage persist the message written by the user on submission.
     * @return {Promise} Resolved once the message has been submitted
     */
    submitMessage () {
      // If the user hasn't clicked Enter without the holding shift key, the
      // message should not be submitted.
      if (event.keyCode !== 13 || (event.keyCode === 13 && event.shiftKey)) {
        return
      }

      // If the user did, we should stop the browser from including the \n
      // inside the message.
      event.preventDefault()

      // submit the message
      let content = this.get('message')

      if (content == null || content.length === 0) return null

      // Create and persist message
      return this.get('store')
        .createRecord('message', {
          content: content,
          deleted: false,
          user: this.get('session').get('user'),
          room: this.get('room')
        })
        .save()
        .then((message) => {
          this.get('roomCache').cache(this.get('room.id'), message)
          this.set('message', null)
        })
    }
  }
});
