import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
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
   * messageCache is used to cache messages by room.
   * @type {service:messageCache}
   */
  messageCache: Ember.inject.service(),

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

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    this.set('limit', 10)
    this.set('messages', [])
  },

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
    /**
     * room in which the message will be created in.
     * @type {Record}
     */
    const room = this.get('room')

    // When the record is new (i.e. id === null) there won't be the need to
    // retrieve its messages. However when it gets persisted (ex. when the user
    // submits a message) we need to reinvoke the showMessages to start caching
    // the messages of the room inside the message-cache service.
    if (room.get('id') === null) {
      room.addObserver('id', this, this.showMessages)
      this.set('messages', null)
      return
    }
    
    // Remove the showMessages observer from the id.
    room.removeObserver('id', this, this.showMessages)

    // First retrieve and display the cached messages.
    const messages = this.get('messageCache').read(room)

    // If nothing is read from the message cache, stop process.
    if (messages === null) return

    // Else store cached messages returned.
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
        room: room.get('id')
      },
      page: {
        limit,
        offset
      }
    })
    .then(messages => {
      this.get('messageCache').cache(room, ...messages.toArray())
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

      // Validate the message.
      const content = this.get('message')
      if (content == null || content.length === 0) return null

      // Before submitting the message we need to make sure that the room the
      // message is going to be written in is persisted.
      const room = this.get('room')

      const roomPersisted = (room.get('isNew'))
        ? room.save()
        : Promise.resolve()

      // Create and persist message.
      return roomPersisted
        .then(() => {
          return this.get('store')
            .createRecord('message', {
              content: content,
              deleted: false,
              user: this.get('session').get('user'),
              room: this.get('room')
            })
            .save()
        })
        .then((message) => {
          this.get('messageCache').cache(this.get('room'), message)
          this.set('message', null)
        })
    }
  }
});
