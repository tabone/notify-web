import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('chat-room-info', 'Integration | Component | chat room info', {
  integration: true
})

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value')
  // Handle any actions with this.on('myAction', function(val) { ... })

  this.render(hbs`{{chat-room-info}}`)

  assert.equal(this.$().text().trim(), '')

  // Template block usage:
  this.render(hbs`
    {{#chat-room-info}}
      template block text
    {{/chat-room-info}}
  `)

  assert.equal(this.$().text().trim(), 'template block text')
})
