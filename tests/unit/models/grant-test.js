import { moduleForModel, test } from 'ember-qunit'

moduleForModel('grant', 'Unit | Model | grant', {
  needs: ['model:user']
})

test('it exists', function (assert) {
  assert.expect(1)
  const model = this.subject()
  assert.ok(!!model)
})
