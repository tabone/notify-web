import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('chat-fab', 'Integration | Component | chat fab', {
  integration: true
})

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value')
  // Handle any actions with this.on('myAction', function (val) { ... })

  this.render(hbs`{{chat-fab}}`)

  assert.equal(this.$().text().trim(), '')

  // Template block usage:
  this.render(hbs`
    {{#chat-fab}}
      template block text
    {{/chat-fab}}
  `)

  assert.equal(this.$().text().trim(), 'template block text')
})
