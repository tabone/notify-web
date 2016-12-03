export function initialize() {
  // Configure marked library
  marked.setOptions({
    sanitize: true,
    langPrefix:'hljs ',
    renderer: getRenderer(),
    highlight (code, lang) {
      if (lang === undefined) return hljs.highlightAuto(code).value
      return hljs.highlight(lang, code).value
    }
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

    return renderer
  }
}

export default {
  name: 'marked-config',
  initialize
};
