import Ember from 'ember'

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
   * messagesContainer is the HTML Element containing all the messages.
   * @type {HTML Element}
   */
  messagesContainer: null,

  /**
   * waiting for messages response.
   * @type {Boolean}
   */
  waiting: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    this.set('limit', 10)
    this.set('messages', [])
    this.set('waiting', false)

    // Include an observer on messages so that when its content changes, notify
    // checks whether it should scroll down or not. This is based on the current
    // scroll value.
    this.addObserver('messages.[]', () => {
      // The check should happen once the messages have been rendered. This is
      // important since the check uses the messages container height.
      Ember.run.scheduleOnce('afterRender', this, this.handleScroll)
    })
  },

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement (...args) {
    this._super(...args)

    /**
     * HTML Element containing all the messages
     * @type {HTML Element}
     */
    const messagesContainer = this.$('.app-chat-room-conversation__messages')[0]
    this.set('messagesContainer', messagesContainer)

    // Retrieve the messages & scroll down to view the last message.
    this.showMessages()
      .then(() => {
        Ember.run.schedule('afterRender', this, this.scrollDown)
      })
  },

  /**
   * didUpdateAttrs runs when the attributes of a component have changed.
   */
  didUpdateAttrs (...args) {
    this._super(...args)

    // Retrieve the messages & scroll down to view the last message.
    this.showMessages()
      .then(() => {
        Ember.run.schedule('afterRender', this, this.scrollDown)
      })
  },

  /**
   * handleScroll is triggered when there is a new message and it is used to
   * determine whether it should scroll the messages container to view the
   * latest message.
   */
  handleScroll () {
    // Retrieve message container HTML Element
    const messagesContainer = this.get('messagesContainer')

    const scrollTop = messagesContainer.scrollTop
    const scrollHeight = messagesContainer.scrollHeight
    const viewPortHeight = messagesContainer.offsetHeight

    /**
     * offset from the bottom which should be considered by notify that the user
     * is waiting for the latest message.
     * @type {Number}
     */
    const offset = 200

    // Scroll to the latest message if the user is within the offset specified.
    if ((scrollHeight - (scrollTop + viewPortHeight)) < offset) {
      this.scrollDown()
    }
  },

  /**
   * scrollDown scrolls the messages container to display the latest message.
   */
  scrollDown () {
    const messagesContainer = this.get('messagesContainer')

    const scrollHeight = messagesContainer.scrollHeight
    const viewPortHeight = messagesContainer.offsetHeight

    messagesContainer.scrollTop = (scrollHeight - viewPortHeight)
  },

  /**
   * showMessages displays the messages of the room. Before it requests messages
   * from the API it checks for cached ones.
   * @param  {Number} offset From where to start
   * @return {Promise}       Resolved once the requested messages have been
   *                         retrieved.
   */
  showMessages (offset = 0) {
    // Display notification.
    this.set('waiting', true)

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
      this.set('waiting', false)
      return Promise.resolve()
    }

    // Remove the showMessages observer from the id.
    room.removeObserver('id', this, this.showMessages)

    // First retrieve and display the cached messages.
    const messages = this.get('messageCache').read(room)

    // If nothing is read from the message cache, stop process.
    if (messages === null) return Promise.resolve()

    // Else store cached messages returned.
    this.set('messages', messages)

    // Once we have displayed the cached messages, we will check if there is
    // room for more.
    let limit = this.get('limit')
    const maxOffset = offset + limit - 1

    // If there isn't do nothing.
    if (messages.length >= maxOffset) return Promise.resolve()

    // If there is, update the offset and limit and request for more.
    offset = messages.length
    limit = maxOffset - offset + 1

    return this.get('store').query('message', {
      sort: '-created',
      filter: {
        room: room.get('id')
      },
      page: {
        limit,
        offset
      }
    })
    .then(messages => {
      // Hide notification
      this.set('waiting', false)
      // Store messages.
      this.get('messageCache').cache(room, true, ...messages.toArray())
    })
  },

  actions: {
    /**
     * onScroll is invoked when the user scrolls the messages container.
     * @param  {Object} ev Event object
     */
    onScroll (ev) {
      // If the user either hasn't reached the oldest message or is waiting for
      // a message response, do nothing
      if (ev.target.scrollTop !== 0 || this.get('waiting') === true) return

      // Retrieve the number of messages. This will indicate the offset of the
      // next query.
      const offset = this.get('messages.length')

      // Display next page.
      this.showMessages(offset)
    },

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
          this.get('messageCache').cache(this.get('room'), false, message)
          this.set('message', null)
        })
    }
  }
})
