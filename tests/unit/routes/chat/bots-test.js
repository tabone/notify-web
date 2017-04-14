import Ember from 'ember'
import { moduleFor, test } from 'ember-qunit'
import sinon from 'sinon'

moduleFor('route:chat/bots', 'Unit | Route | chat/bots', {
  beforeEach: function beforeEach () {
    const sessionStub = Ember.Service.extend({ user: null })

    const storeStub = Ember.Service.extend({
      findAll: sinon.stub(),
      peekAll: sinon.stub()
    })

    const configStub = Ember.Service.extend({
      getGrant: sinon.stub(),
      grants: {
        'CREATE_BOT': 'CREATE_BOT'
      }
    })

    this.register('service:store', storeStub)
    this.register('service:config', configStub)
    this.register('service:session', sessionStub)

    this.inject.service('store')
    this.inject.service('config')
    this.inject.service('session')
  }
})

/**
 * When trying to access the 'chat/bots' route without having the 'CREATE_BOT'
 * grant, the user should be redirected to the 'chat' route.
 */
test('Accessing the `chat/bots` route without having the `CREATE_BOT` grant', function (assert) {
  assert.expect(2)
  // Create a route instance.
  const route = this.subject()

  // Mocks the 'CREATE_BOT' grant.
  const grantMock = {}

  // Get a reference to the config stub
  const configStub = route.get('config')

  // Get a reference to the session stub
  const sessionStub = route.get('session')

  // Stub the function used to redirect the user.
  const transitionToStub = sinon.stub(route, 'transitionTo')

  // Stub the function used to get the grants by name to return the mock grant.
  configStub.getGrant.withArgs(configStub.get('grants.CREATE_BOT'))
    .returns(grantMock)

  // Mock the logged in user object to not have the 'CREATE_BOT' grant.
  sessionStub.set('user', {
    grants: [ {}, {} ]
  })

  // Invoke function to be tested
  route.beforeModel()

  // Verify that the user has been redirected to the 'chat' route.
  assert.strictEqual(transitionToStub.callCount, 1)
  assert.strictEqual(transitionToStub.getCall(0).args[0], 'chat')
})

/**
 * When trying to access the 'chat/bots' route when having the 'CREATE_BOT'
 * grant, it should:
 *   > Allow the user to enter the route.
 *   > Retrieve info about the all the tokens the logged in user has access to.
 *   > Retrieve info about the bots the user has created.
 */
test('Accessing the `chat/bots` route when having the `CREATE_BOT` grant', function (assert) {
  assert.expect(6)
  const route = this.subject()

  const grantMock = {}
  const tokensArray = []

  const configStub = route.get('config')
  const storeStub = route.get('store')
  const sessionStub = route.get('session')
  const transitionToStub = sinon.stub(route, 'transitionTo')

  configStub.getGrant.withArgs(configStub.get('grants.CREATE_BOT'))
    .returns(grantMock)

  sessionStub.set('user', {
    id: '1',
    grants: [{}, {}, grantMock]
  })

  const botsArray = [
    Ember.Object.create({
      bot: true,
      creator: sessionStub.get('user')
    }),
    Ember.Object.create({
      bot: true,
      creator: sessionStub.get('user')
    }),
    Ember.Object.create({
      bot: false,
      creator: sessionStub.get('user')
    }),
    Ember.Object.create({
      bot: true,
      creator: Ember.Object.create()
    })
  ]

  storeStub.get('findAll').withArgs('token').returns(tokensArray)
  storeStub.get('peekAll').withArgs('user').returns(botsArray)

  route.beforeModel()
  assert.strictEqual(transitionToStub.callCount, 0)

  return route.model().then(model => {
    assert.strictEqual(Object.keys(model).length, 2)
    assert.strictEqual(model.tokens, tokensArray)
    assert.strictEqual(model.bots.length, 2)
    assert.ok(model.bots.indexOf(botsArray[0]) !== -1)
    assert.ok(model.bots.indexOf(botsArray[1]) !== -1)
  })
})
