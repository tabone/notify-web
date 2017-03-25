import { moduleForModel, test } from 'ember-qunit'

moduleForModel('token', 'Unit | Model | token', {
  needs: ['model:user']
})

test('it exists', function (assert) {
  assert.expect(1)
  const model = this.subject()
  assert.ok(!!model)
})
