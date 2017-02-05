/**
 * Instance initializer used to setup the markdown library used for chat
 * messages.
 */
export function initialize() {
  // Configure marked library
  marked.setOptions({
    sanitize: true,
    renderer: getRenderer()
  })

  /**
   * getRenderer overrides the in built renderer.
   * @return {Object} Markdown renderer object.
   */
  function getRenderer () {
    const renderer = new marked.Renderer()

    // Disable header tags.
    renderer.heading = (text, level) => {
      return text
    }

    // Highlight code syntax.
    renderer.code = (code, language) => {
      code = (language === undefined)
        // If no language is provided, use the automated feature.
        ? hljs.highlightAuto(code).value
        // Else highlight based on the language specified.
        : hljs.highlight(language, code).value
      
      return `<pre><code class="hljs lang-${language}">${code}</code></pre>`
    }

    return renderer
  }
}

export default {
  name: 'marked-config',
  initialize
}
