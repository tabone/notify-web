import { moduleForModel, test } from 'ember-qunit'

moduleForModel('message', 'Unit | Model | message', {
  needs: ['model:user', 'model:room']
})

test('Age for message created less than 20sec ago', function (assert) {
  assert.expect(1)
  const message = this.subject({ created: new Date() })
  assert.strictEqual(message.get('uiCreated'), 'just now')
})

test('Age for message created between 20sec (incl) & 1min (excl) ago', function (assert) {
  assert.expect(1)
  const seconds = 25
  const created = new Date()
  created.setSeconds(created.getSeconds() - seconds)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), `${seconds} seconds ago`)
})

test('Age for message created between 1min (incl) & 2min (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setSeconds(created.getSeconds() - 68)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '1 minute ago')
})

test('Age for message created between 1min (excl) & 1hr (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setSeconds(created.getSeconds() - 121)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '2 minutes ago')
})

test('Age for message created between 1hr (incl) & 2hr (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setMinutes(created.getMinutes() - 64)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '1 hour ago')
})

test('Age for message created between 1hr (excl) & 1 day (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setMinutes(created.getMinutes() - 126)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '2 hours ago')
})

test('Age for message created between 1 day (incl) & 2 days (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setHours(created.getHours() - 26)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '1 day ago')
})

test('Age for message created between 1 day (excl) & 1 week (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setHours(created.getHours() - 50)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '2 days ago')
})

test('Age for message created between 1 week (incl) & 2 weeks (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setDate(created.getDate() - 9)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '1 week ago')
})

test('Age for message created between 1 week (excl) & 1 month (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setDate(created.getDate() - 17)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '2 weeks ago')
})

test('Age for message created between 1 month (incl) & 2 months (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setDate(created.getDate() - (5 * 7))
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '1 month ago')
})

test('Age for message created between 1 month (excl) & 1 year (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setDate(created.getDate() - (10 * 7))
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '2 months ago')
})

test('Age for message created between 1 year (incl) & 2 year (excl) ago', function (assert) {
  assert.expect(1)
  const created = new Date()
  created.setMonth(created.getMonth() - 16)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), '1 year ago')
})

test('Age for message created 2 year (incl) or more years ago', function (assert) {
  assert.expect(1)
  const years = 7
  const created = new Date()
  created.setFullYear(created.getFullYear() - years)
  const message = this.subject({ created: created })
  assert.strictEqual(message.get('uiCreated'), `${years} years ago`)
})
