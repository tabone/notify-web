import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('app-select-item-invite-user', 'Integration | Component | app select item invite user', {
  integration: true
})

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value')
  // Handle any actions with this.on('myAction', function(val) { ... })

  this.render(hbs`{{app-select-item-invite-user}}`)

  assert.equal(this.$().text().trim(), '')

  // Template block usage:
  this.render(hbs`
    {{#app-select-item-invite-user}}
      template block text
    {{/app-select-item-invite-user}}
  `)

  assert.equal(this.$().text().trim(), 'template block text')
})
