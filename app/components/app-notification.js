import Ember from 'ember';

/**
 * Component used to display notifications. These notifications are displayed
 * through the app's Notification service.
 */
export default Ember.Component.extend({
  /**
   * classNames to be added to the root element of the component.
   * @type {Array}
   */
  classNames: ['app-notification', 'mdl-js-snackbar', 'mdl-snackbar'],

  /**
   * notification is used to listen for messages that should be notified to the
   * user.
   * @type {service:notification}
   */
  notification: Ember.inject.service(),

  /**
   * elem is the Snackbar HTML Element
   * @type {HTML Element}
   */
  elem: null,

  /**
   * didInsertElement is called when the element of the view has been inserted
   * into the DOM or after the view was re-rendered.
   */
  didInsertElement () {
    componentHandler.upgradeElements(this.$()[0])
    this.set('elem', this.$()[0])
    this.get('notification').addListener(this.onNotification.bind(this))
  },

  /**
   * onNotification is triggered when there is a notification to be displayed.
   * @param  {String} payload.type    The type of the message.
   * @param  {String} payload.message The message to display.
   */
  onNotification (payload) {
    this.get('elem').MaterialSnackbar.showSnackbar({
      message: payload.message,
      timeout: 10000,
      actionText: 'Close',
      actionHandler: close
    });
  }
});
