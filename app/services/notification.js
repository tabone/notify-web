import Ember from 'ember'

/**
 * Service used to push a notification to get displayed to the user.
 */
export default Ember.Service.extend({
  /**
   * listeners to be notified on a new notification.
   * @type {Array}
   */
  listeners: null,

  /**
   * init is invoked when the object is initialized.
   */
  init (...args) {
    this._super(...args)
    // Initialize the listeners array.
    this.set('listeners', [])
  },

  /**
   * info emits a info notification.
   * @param  {String} message The message to be displayed
   */
  info (message) {
    this.emit('info', message)
  },

  /**
   * error emits a error notification.
   * @param  {String} message The message to be displayed
   */
  error (message) {
    this.emit('error', message)
  },

  /**
   * warning emits a warning notification.
   * @param  {String} message The message to be displayed
   */
  warning (message) {
    this.emit('warning', message)
  },

  /**
   * success emits a success notification.
   * @param  {String} message The message to be displayed
   */
  success (message) {
    this.emit('success', message)
  },

  /**
   * emit notifies the listeners about a notification.
   * @param  {String} type    The type of the notification.
   * @param  {String} message The message to be displayed.
   */
  emit (type, message) {
    this.get(`listeners`).forEach(listener => listener({ type, message }))
  },

  /**
   * addListener adds a new listener.
   * @param {Function} listener The listener.
   */
  addListener (listener) {
    if (typeof listener !== 'function') return
    this.get('listeners').pushObject(listener)
  }
})
