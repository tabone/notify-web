import { moduleForModel, test } from 'ember-qunit'

moduleForModel('user', 'Unit | Model | user', {
  // Specify the other units that are required for this test.
  needs: [
    'model:room',
    'model:state',
    'model:grant',
    'model:message',
    'model:token'
  ]
})

test('Image for a user who does not have a image', function (assert) {
  let model = this.subject({ image: null })
  assert.equal(model.get('uiImage'), 'no-user-image.png')
})

test('Image for a user who does have a image', function (assert) {
  const userImage = 'user.png'
  let model = this.subject({ image: userImage })
  assert.equal(model.get('uiImage'), userImage)
})
