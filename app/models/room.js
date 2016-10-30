import DS from 'ember-data';

export default DS.Model.extend({
  /**
   * name of the room.
   */
  name: DS.attr('string'),

  /**
   * image name.
   */
  image: DS.attr('string'),

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
  })
});
