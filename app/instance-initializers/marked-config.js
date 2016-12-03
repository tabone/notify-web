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

    renderer.heading = (text, level) => {
      return text
    }

    renderer.code = (code, language) => {
      code = (language === undefined)
        ? hljs.highlightAuto(code).value
        : hljs.highlight(language, code).value
      return `<pre><code class="hljs lang-${language}">${code}</code></pre>`
    }

    return renderer
  }
}

export default {
  name: 'marked-config',
  initialize
};
