import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('chat-sidebar', 'Integration | Component | chat sidebar', {
  integration: true
})

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value')
  // Handle any actions with this.on('myAction', function (val) { ... })

  this.render(hbs`{{chat-sidebar}}`)

  assert.equal(this.$().text().trim(), '')

  // Template block usage:
  this.render(hbs`
    {{#chat-sidebar}}
      template block text
    {{/chat-sidebar}}
  `)

  assert.equal(this.$().text().trim(), 'template block text')
})
