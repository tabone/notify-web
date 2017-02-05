import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('chat-sidebar-rooms-list', 'Integration | Component | chat sidebar rooms list', {
  integration: true
})

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value')
  // Handle any actions with this.on('myAction', function (val) { ... })

  this.render(hbs`{{chat-sidebar-rooms-list}}`)

  assert.equal(this.$().text().trim(), '')

  // Template block usage:
  this.render(hbs`
    {{#chat-sidebar-rooms-list}}
      template block text
    {{/chat-sidebar-rooms-list}}
  `)

  assert.equal(this.$().text().trim(), 'template block text')
})
