import Ember from 'ember'
import { initialize } from 'notify/instance-initializers/ajax-setup'
import { module, test } from 'qunit'
import destroyApp from '../../helpers/destroy-app'
import sinon from 'sinon'
import $ from 'jquery'

module('Unit | Instance Initializer | ajax setup', {
  beforeEach () {
    Ember.run(() => {
      this.application = Ember.Application.create()
      this.appInstance = this.application.buildInstance()
    })
  },
  afterEach () {
    Ember.run(this.appInstance, 'destroy')
    destroyApp(this.application)
  }
})

// When making a AJAX Request, it should by default include the
// 'withCredentials' header set to 'true'.
test('it works', function (assert) {
  // Initialize app.
  initialize(this.appInstance)

  // Array to contain the XHR Requests done.
  const requests = []
  // Mock XHR Request.
  const xhr = sinon.useFakeXMLHttpRequest()
  // Store any requests done by the login() method.
  xhr.onCreate = (request) => requests.push(request)

  // Make an AJAX Request.
  $.ajax({
    url: 'http://hikupz.io/api',
    method: 'POST'
  })

  // Verify that one request has been done.
  assert.strictEqual(requests.length, 1)

  // Verify that the request was done with the header 'withCredentials' set to
  // 'true'
  assert.ok(requests[0].withCredentials === true)
})
