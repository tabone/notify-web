import Ember from 'ember'
import { initialize } from 'notify/instance-initializers/marked-config'
import { module, test } from 'qunit'
import destroyApp from '../../helpers/destroy-app'
import sinon from 'sinon'

module('Unit | Instance Initializer | marked config', {
  beforeEach: function () {
    Ember.run(() => {
      this.application = Ember.Application.create()
      this.appInstance = this.application.buildInstance()
    })
  },
  afterEach: function () {
    Ember.run(this.appInstance, 'destroy')
    destroyApp(this.application)
  }
})

// When marking down a heading string, it should not use heading tags.
test('Marking down a heading string', function (assert) {
  assert.expect(6)
  // Initialize app.
  initialize(this.appInstance)

  // Title to be parsed.
  const title = 'hello'

  // Verify that when conerted it does not include header tag.
  assert.strictEqual(marked(`# ${title}`), title)
  assert.strictEqual(marked(`## ${title}`), title)
  assert.strictEqual(marked(`### ${title}`), title)
  assert.strictEqual(marked(`#### ${title}`), title)
  assert.strictEqual(marked(`##### ${title}`), title)
  assert.strictEqual(marked(`###### ${title}`), title)
})

/**
 * When marking down a code snippet with a specified language, it should
 * highlight the code in the specified language.
 */
test('Marking down a code snippet with a specified language', function (assert) {
  assert.expect(5)
  // Initialize app.
  initialize(this.appInstance)

  /**
   * The language which the specified code is written in.
   * @type {String}
   */
  const language = 'javascript'

  /**
   * Code snippet to be highlighted.
   * @type {String}
   */
  const code = `console.log('1')`

  /**
   * Markdown string.
   * @type {String}
   */
  const codeMarkdown = `\`\`\`${language}\n${code}\n\`\`\``

  /**
   * Highlighted code returned by the hljs function used when a language is
   * specified.
   * @type {String}
   */
  const highlightedCode = 'highlighted-code'

  /**
   * Highlighted code returned by the hljs function used when a language is not
   * specified.
   * @type {String}
   */
  const autoHighlightedCode = 'auto-highlighted-code'

  /**
   * Expected markdown result.
   * @type {String}
   */
  const expResult = `<pre><code class="hljs">${highlightedCode}</code></pre>`

  // Stub the return object of the hljs function used to highlight the code when
  // a language is specified. This object will then be used to determine whether
  // the function's value was used in the markdown process.
  sinon.stub(hljs, 'highlight').returns({ value: highlightedCode })

  // Stub the return object of the hljs function used to highlight the code when
  // no language is specified. This object will then be used to determine
  // whether the function's value was used in the markdown process.
  sinon.stub(hljs, 'highlightAuto').returns({ value: autoHighlightedCode })

  // Invoke function to be tested.
  const result = marked(codeMarkdown)

  // Verify that the expected highlight function was invoked.
  assert.strictEqual(hljs.highlight.callCount, 1)
  assert.strictEqual(hljs.highlightAuto.callCount, 0)

  // Verify that the expected highlight function was invoked with the expected
  // params.
  assert.strictEqual(hljs.highlight.getCall(0).args[0], language)
  assert.strictEqual(hljs.highlight.getCall(0).args[1], code)

  // Verify the markdown result.
  assert.strictEqual(result, expResult)

  // Restore stubs.
  hljs.highlight.restore()
  hljs.highlightAuto.restore()
})

/**
 * When marking down a code snipeet without specifying a language, it should
 * highlight the code in an auto detected language.
 */
test('Marking down a code snippet without specifying language', function (assert) {
  assert.expect(4)
  // Initialize app.
  initialize(this.appInstance)

  /**
   * Code snippet to be highlighted.
   * @type {String}
   */
  const code = `console.log('1')`

  /**
   * Markdown string.
   * @type {String}
   */
  const codeMarkdown = `\`\`\`\n${code}\n\`\`\``

  /**
   * Highlighted code returned by the hljs function used when a language is
   * specified.
   * @type {String}
   */
  const highlightedCode = 'highlighted-code'

  /**
   * Highlighted code returned by the hljs function used when a language is not
   * specified.
   * @type {String}
   */
  const autoHighlightedCode = 'auto-highlighted-code'

  /**
   * Expected markdown result.
   * @type {String}
   */
  const expResult = '<pre><code class="hljs">' + autoHighlightedCode +
    '</code></pre>'

  // Stub the return object of the hljs function used to highlight the code when
  // a language is specified. This object will then be used to determine whether
  // the function's value was used in the markdown process.
  sinon.stub(hljs, 'highlight').returns({ value: highlightedCode })

  // Stub the return object of the hljs function used to highlight the code when
  // no language is specified. This object will then be used to determine
  // whether the function's value was used in the markdown process.
  sinon.stub(hljs, 'highlightAuto').returns({ value: autoHighlightedCode })

  // Invoke function to be tested.
  const result = marked(codeMarkdown)

  // Verify that the expected highlight function was invoked.
  assert.strictEqual(hljs.highlight.callCount, 0)
  assert.strictEqual(hljs.highlightAuto.callCount, 1)

  // Verify that the expected highlight function was invoked with the expected
  // params.
  assert.strictEqual(hljs.highlightAuto.getCall(0).args[0], code)

  // Verify the markdown result.
  assert.strictEqual(result, expResult)

  // Restore stubs.
  hljs.highlight.restore()
  hljs.highlightAuto.restore()
})
