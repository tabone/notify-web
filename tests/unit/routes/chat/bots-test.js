import Ember from 'ember'
import { moduleFor, test } from 'ember-qunit'
import sinon from 'sinon'

moduleFor('route:chat/bots', 'Unit | Route | chat/bots', {
  beforeEach: function beforeEach () {
    /**
     * Stubbing the Session Service.
     * @type {service}
     */
    const sessionStub = Ember.Service.extend({ user: null })

    /**
     * Stubbing the Store Service.
     * @type {service}
     */
    const storeStub = Ember.Service.extend({
      findAll: sinon.stub(),
      peekAll: sinon.stub()
    })

    /**
     * Stubbing the Config Service.
     * @type {service}
     */
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
  // Create route instance.
  const route = this.subject()

  /**
   * Object representing the 'CREATE_BOT' grant inside the Ember DataStore.
   * @type {Object}
   */
  const grantMock = Ember.Object.create()

  // Get a reference to the config stub.
  const configStub = route.get('config')

  // Get a reference to the session stub.
  const sessionStub = route.get('session')

  // Stub the function used to redirect the user.
  const transitionToStub = sinon.stub(route, 'transitionTo')

  // Stub the function used to get the grants by name to return the mocked
  // 'CREATE_BOT' grant.
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

  transitionToStub.restore()
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
  // Create route instance.
  const route = this.subject()

  /**
   * Object representing the 'CREATE_BOT' grant inside the Ember DataStore
   * @type {Object}
   */
  const grantMock = {}

  /**
   * List of tokens to be retrieved.
   * @type {Array}
   */
  const tokensArray = []

  // Get a reference to the config stub.
  const configStub = route.get('config')

  // Get a reference to the store stub.
  const storeStub = route.get('store')

  // Get a reference to the session stub.
  const sessionStub = route.get('session')

  // Stub the function used to redirect the user.
  const transitionToStub = sinon.stub(route, 'transitionTo')

  // Stub the function used to get the grants by name to return the mocked
  // 'CREATE_BOT' grant.
  configStub.getGrant.withArgs(configStub.get('grants.CREATE_BOT'))
    .returns(grantMock)

  // Mock the logged in user object to have the 'CREATE_BOT' grant.
  sessionStub.set('user', {
    id: '1',
    grants: [{}, {}, grantMock]
  })

  /**
   * List of users to be retrieved.
   * @type {Array}
   */
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

  // Stub the store.findAll function to return the expected value.
  storeStub.get('findAll').withArgs('token').returns(tokensArray)

  // Stub the store.peekAll function to return the expected value.
  storeStub.get('peekAll').withArgs('user').returns(botsArray)

  // Invoke one of the function to be tested.
  route.beforeModel()

  // Verify that the user is not redirected to the 'chat' route.
  assert.strictEqual(transitionToStub.callCount, 0)

  // Invoke one of the function to be tested.
  return route.model().then(model => {
    // Verify that the model returned has two keys.
    assert.strictEqual(Object.keys(model).length, 2)

    // Verify that the model returned has the list of tokens retrieved from
    // store.findAll function.
    assert.strictEqual(model.tokens, tokensArray)

    // Verify that the model returned has the list of users who are bots and has
    // been created by the logged in user.
    assert.strictEqual(model.bots.length, 2)
    assert.ok(model.bots.indexOf(botsArray[0]) !== -1)
    assert.ok(model.bots.indexOf(botsArray[1]) !== -1)

    transitionToStub.restore()
  })
})
