import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('chat-room-creation-dialog', 'Integration | Component | chat room creation dialog', {
  integration: true
})

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value')
  // Handle any actions with this.on('myAction', function(val) { ... })

  this.render(hbs`{{chat-room-creation-dialog}}`)

  assert.equal(this.$().text().trim(), '')

  // Template block usage:
  this.render(hbs`
    {{#chat-room-creation-dialog}}
      template block text
    {{/chat-room-creation-dialog}}
  `)

  assert.equal(this.$().text().trim(), 'template block text')
})
