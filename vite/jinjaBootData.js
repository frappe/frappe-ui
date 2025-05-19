export function jinjaBootData() {
  return {
    name: 'frappeui-jinja-boot-data-plugin',
    transformIndexHtml(html, context) {
      if (!context.server) {
        // context.server is true in dev mode
        // only inject this in production build
        return html.replace(
          /<\/body>/,
          `
          <script>
              {% for key in boot %}
              window["{{ key }}"] = {{ boot[key] | tojson }};
              {% endfor %}
          </script>
          </body>
          `,
        )
      }
      return html
    },
  }
}
