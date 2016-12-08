import Ember from 'ember';

export default Ember.Service.extend({
  listeners: null,

  init (...args) {
    this._super(...args)
    this.set('listeners', [])
  },

  info (message) {
    this.emit('info', message)
  },

  error (message) {
    this.emit('error', message)
  },

  warning (message) {
    this.emit('warning', message)
  },

  success (message) {
    this.emit('success', message)
  },

  emit (type, message) {
    this.get(`listeners`).forEach(listener => listener({ type, message }))
  },

  addListener (listener) {
    this.get('listeners').pushObject(listener)
  }
});
