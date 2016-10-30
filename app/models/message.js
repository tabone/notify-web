import DS from 'ember-data';

export default DS.Model.extend({
  /**
   * content of the message.
   */
  content: DS.attr('string'),

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
   * unread by the users listed.
   */
  unread: DS.hasMany('user', {
    inverse: 'unread'
  })
});
