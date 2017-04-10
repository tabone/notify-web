import Ember from 'ember'
import DS from 'ember-data'

export default DS.Model.extend({
  /**
   * content of the message.
   */
  content: DS.attr('string'),

  /**
   * indicates whether the message has been deleted.
   */
  deleted: DS.attr('boolean'),

  /**
   * date when the message was created.
   */
  created: DS.attr('date'),

  /**
   * user who created the message.
   */
  user: DS.belongsTo('user', {
    inverse: 'messages'
  }),

  /**
   * room inside which the message was written in.
   */
  room: DS.belongsTo('room', {
    inverse: 'messages'
  }),

  /**
   * users who have still not read the message.
   */
  unread: DS.hasMany('user', {
    inverse: 'unread'
  }),

  /**
   * age of the message.
   */
  uiCreated: Ember.computed('created', function () {
    // Retrieve the message age in seconds.
    const diffSeconds = Math.floor((new Date() - this.get('created')) / 1000)

    // 0 seconds to 1 minute.
    if (diffSeconds >= 0 && diffSeconds < 60) return handleSeconds()
    // 1 minute to 1 hour.
    if (diffSeconds >= 60 && diffSeconds < 3600) return handleMinutes()
    // 1 hour to 1 day.
    if (diffSeconds >= 3600 && diffSeconds < 86400) return handleHours()
    // 1 day to 1 week.
    if (diffSeconds >= 86400 && diffSeconds < 604800) return handleDays()
    // 1 week to 1 month.
    if (diffSeconds >= 604800 && diffSeconds < 2419200) return handleWeeks()
    // 1 month to 1 year.
    if (diffSeconds >= 2419200 && diffSeconds < 29030400) return handleMonths()
    // 1 month onwards.
    if (diffSeconds >= 29030400) return handleYears()

    /**
     * handle difference in seconds.
     * @return {String} The created date to be used in UI.
     */
    function handleSeconds () {
      return (diffSeconds < 20) ? 'just now' : `${diffSeconds} seconds ago`
    }

    /**
     * handle difference in minutes.
     * @return {String} The created date to be used in UI.
     */
    function handleMinutes () {
      const diffMinutes = Math.floor(diffSeconds / 60)
      return (diffMinutes === 1) ? '1 minute ago' : `${diffMinutes} minutes ago`
    }

    /**
     * handle difference in hours.
     * @return {String} The created date to be used in UI.
     */
    function handleHours () {
      const diffHours = Math.floor(diffSeconds / 3600)
      return (diffHours === 1) ? '1 hour ago' : `${diffHours} hours ago`
    }

    /**
     * handle difference in days.
     * @return {String} The created date to be used in UI.
     */
    function handleDays () {
      const diffDays = Math.floor(diffSeconds / 86400)
      return (diffDays === 1) ? '1 day ago' : `${diffDays} days ago`
    }

    /**
     * handle difference in weeks.
     * @return {String} The created date to be used in UI.
     */
    function handleWeeks () {
      const diffWeeks = Math.floor(diffSeconds / 604800)
      return (diffWeeks === 1) ? '1 week ago' : `${diffWeeks} weeks ago`
    }

    /**
     * handle difference in months.
     * @return {String} The created date to be used in UI.
     */
    function handleMonths () {
      const diffMonths = Math.floor(diffSeconds / 2419200)
      return (diffMonths === 1) ? '1 month ago' : `${diffMonths} months ago`
    }

    /**
     * handle difference in years.
     * @return {String} The created date to be used in UI.
     */
    function handleYears () {
      const diffYears = Math.floor(diffSeconds / 29030400)
      return (diffYears === 1) ? '1 year ago' : `${diffYears} years ago`
    }
  })
})
