import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('chat-finder-room-item', 'Integration | Component | chat finder room item', {
  integration: true
})

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value')
  // Handle any actions with this.on('myAction', function(val) { ... })

  this.render(hbs`{{chat-finder-room-item}}`)

  assert.equal(this.$().text().trim(), '')

  // Template block usage:
  this.render(hbs`
    {{#chat-finder-room-item}}
      template block text
    {{/chat-finder-room-item}}
  `)

  assert.equal(this.$().text().trim(), 'template block text')
})
