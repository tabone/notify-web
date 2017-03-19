import { moduleForComponent, test } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'

moduleForComponent('app-select-chip-invite-user', 'Integration | Component | app select chip invite user', {
  integration: true
})

test('it renders', function (assert) {
  // Set any properties with this.set('myProperty', 'value')
  // Handle any actions with this.on('myAction', function(val) { ... })

  this.render(hbs`{{app-select-chip-invite-user}}`)

  assert.equal(this.$().text().trim(), '')

  // Template block usage:
  this.render(hbs`
    {{#app-select-chip-invite-user}}
      template block text
    {{/app-select-chip-invite-user}}
  `)

  assert.equal(this.$().text().trim(), 'template block text')
})
