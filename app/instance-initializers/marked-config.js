/**
 * Instance initializer used to setup the markdown library used for chat
 * messages.
 * Libraries:
 *   > Marked: https://github.com/chjj/marked
 *   > HighlightJS: https://github.com/isagalaev/highlight.js
 */
export function initialize () {
  // Configure `marked` library.
  marked.setOptions({
    sanitize: true,
    renderer: getRenderer()
  })

  /**
   * getRenderer overrides the `marked` built-in renderer.
   * @return {Object} Markdown renderer object.
   */
  function getRenderer () {
    // Create a new Renderer instance.
    const renderer = new marked.Renderer()

    /**
     * Customize the Renderer to not use heading tags.
     * @param  {String} text  Title text.
     * @return {String}       String to be used in the DOM.
     */
    renderer.heading = (text) => text

    /**
     * Customize the Renderer to highlight the code using hljs library.
     * @param  {String} code     Code to be highlighted.
     * @param  {String} language Language of the code to be highlighted.
     * @return {String}          String to be used in the DOM.
     */
    renderer.code = (code, language) => {
      // Highlight code.
      code = (language == undefined) ? hljs.highlightAuto(code).value
        : hljs.highlight(language, code).value

      return `<pre><code class="hljs">${code}</code></pre>`
    }

    // Return customized renderer.
    return renderer
  }
}

export default {
  name: 'marked-config',
  initialize
}
