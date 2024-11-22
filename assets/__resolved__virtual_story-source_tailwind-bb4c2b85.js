const __resolved__virtual_storySource_tailwind = `import 'histoire-style'
import './style.css'
import { createApp, h, markRaw, ref } from "/home/runner/work/frappe-ui/frappe-ui/node_modules/histoire/dist/node/vendors/vue.js"
import {
  HstColorShades,
  HstTokenList,
  HstTokenGrid,
  HstText,
  HstTextarea,
  HstNumber,
} from "/home/runner/work/frappe-ui/frappe-ui/node_modules/histoire/dist/node/vendors/controls.js"

const config = markRaw({
  "theme": {
    "typography": {
      "DEFAULT": {
        "css": [
          {
            "color": "var(--tw-prose-body)",
            "maxWidth": "65ch",
            "p": {},
            "[class~=\\"lead\\"]": {
              "color": "var(--tw-prose-lead)"
            },
            "a": {
              "color": "var(--tw-prose-links)",
              "textDecoration": "underline",
              "fontWeight": "500"
            },
            "strong": {
              "color": "var(--tw-prose-bold)",
              "fontWeight": "600"
            },
            "a strong": {
              "color": "inherit"
            },
            "blockquote strong": {
              "color": "inherit"
            },
            "thead th strong": {
              "color": "inherit"
            },
            "ol": {
              "listStyleType": "decimal"
            },
            "ol[type=\\"A\\"]": {
              "listStyleType": "upper-alpha"
            },
            "ol[type=\\"a\\"]": {
              "listStyleType": "lower-alpha"
            },
            "ol[type=\\"A\\" s]": {
              "listStyleType": "upper-alpha"
            },
            "ol[type=\\"a\\" s]": {
              "listStyleType": "lower-alpha"
            },
            "ol[type=\\"I\\"]": {
              "listStyleType": "upper-roman"
            },
            "ol[type=\\"i\\"]": {
              "listStyleType": "lower-roman"
            },
            "ol[type=\\"I\\" s]": {
              "listStyleType": "upper-roman"
            },
            "ol[type=\\"i\\" s]": {
              "listStyleType": "lower-roman"
            },
            "ol[type=\\"1\\"]": {
              "listStyleType": "decimal"
            },
            "ul": {
              "listStyleType": "disc"
            },
            "ol > li::marker": {
              "fontWeight": "400",
              "color": "var(--tw-prose-counters)"
            },
            "ul > li::marker": {
              "color": "var(--tw-prose-bullets)"
            },
            "dt": {
              "color": "var(--tw-prose-headings)",
              "fontWeight": "600"
            },
            "hr": {
              "borderColor": "var(--tw-prose-hr)",
              "borderTopWidth": 1
            },
            "blockquote": {
              "fontWeight": "500",
              "fontStyle": "italic",
              "color": "var(--tw-prose-quotes)",
              "borderInlineStartWidth": "0.25rem",
              "borderInlineStartColor": "var(--tw-prose-quote-borders)",
              "quotes": "\\"\\\\201C\\"\\"\\\\201D\\"\\"\\\\2018\\"\\"\\\\2019\\""
            },
            "blockquote p:first-of-type::before": {
              "content": "open-quote"
            },
            "blockquote p:last-of-type::after": {
              "content": "close-quote"
            },
            "h1": {
              "color": "var(--tw-prose-headings)",
              "fontWeight": "800"
            },
            "h1 strong": {
              "fontWeight": "900",
              "color": "inherit"
            },
            "h2": {
              "color": "var(--tw-prose-headings)",
              "fontWeight": "700"
            },
            "h2 strong": {
              "fontWeight": "800",
              "color": "inherit"
            },
            "h3": {
              "color": "var(--tw-prose-headings)",
              "fontWeight": "600"
            },
            "h3 strong": {
              "fontWeight": "700",
              "color": "inherit"
            },
            "h4": {
              "color": "var(--tw-prose-headings)",
              "fontWeight": "600"
            },
            "h4 strong": {
              "fontWeight": "700",
              "color": "inherit"
            },
            "img": {},
            "picture": {
              "display": "block"
            },
            "video": {},
            "kbd": {
              "fontWeight": "500",
              "fontFamily": "inherit",
              "color": "var(--tw-prose-kbd)",
              "boxShadow": "0 0 0 1px rgb(var(--tw-prose-kbd-shadows) / 10%), 0 3px 0 rgb(var(--tw-prose-kbd-shadows) / 10%)"
            },
            "code": {
              "color": "var(--tw-prose-code)",
              "fontWeight": "600"
            },
            "code::before": {
              "content": "\\"\`\\""
            },
            "code::after": {
              "content": "\\"\`\\""
            },
            "a code": {
              "color": "inherit"
            },
            "h1 code": {
              "color": "inherit"
            },
            "h2 code": {
              "color": "inherit"
            },
            "h3 code": {
              "color": "inherit"
            },
            "h4 code": {
              "color": "inherit"
            },
            "blockquote code": {
              "color": "inherit"
            },
            "thead th code": {
              "color": "inherit"
            },
            "pre": {
              "color": "var(--tw-prose-pre-code)",
              "backgroundColor": "var(--tw-prose-pre-bg)",
              "overflowX": "auto",
              "fontWeight": "400"
            },
            "pre code": {
              "backgroundColor": "transparent",
              "borderWidth": "0",
              "borderRadius": "0",
              "padding": "0",
              "fontWeight": "inherit",
              "color": "inherit",
              "fontSize": "inherit",
              "fontFamily": "inherit",
              "lineHeight": "inherit"
            },
            "pre code::before": {
              "content": "none"
            },
            "pre code::after": {
              "content": "none"
            },
            "table": {
              "width": "100%",
              "tableLayout": "auto",
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "thead": {
              "borderBottomWidth": "1px",
              "borderBottomColor": "var(--tw-prose-th-borders)"
            },
            "thead th": {
              "color": "var(--tw-prose-headings)",
              "fontWeight": "600",
              "verticalAlign": "bottom"
            },
            "tbody tr": {
              "borderBottomWidth": "1px",
              "borderBottomColor": "var(--tw-prose-td-borders)"
            },
            "tbody tr:last-child": {
              "borderBottomWidth": "0"
            },
            "tbody td": {
              "verticalAlign": "baseline"
            },
            "tfoot": {
              "borderTopWidth": "1px",
              "borderTopColor": "var(--tw-prose-th-borders)"
            },
            "tfoot td": {
              "verticalAlign": "top"
            },
            "th, td": {
              "textAlign": "start"
            },
            "figure > *": {},
            "figcaption": {
              "color": "var(--tw-prose-captions)"
            }
          },
          {
            "--tw-prose-body": "#374151",
            "--tw-prose-headings": "#111827",
            "--tw-prose-lead": "#4b5563",
            "--tw-prose-links": "#111827",
            "--tw-prose-bold": "#111827",
            "--tw-prose-counters": "#6b7280",
            "--tw-prose-bullets": "#d1d5db",
            "--tw-prose-hr": "#e5e7eb",
            "--tw-prose-quotes": "#111827",
            "--tw-prose-quote-borders": "#e5e7eb",
            "--tw-prose-captions": "#6b7280",
            "--tw-prose-kbd": "#111827",
            "--tw-prose-kbd-shadows": "17 24 39",
            "--tw-prose-code": "#111827",
            "--tw-prose-pre-code": "#e5e7eb",
            "--tw-prose-pre-bg": "#1f2937",
            "--tw-prose-th-borders": "#d1d5db",
            "--tw-prose-td-borders": "#e5e7eb",
            "--tw-prose-invert-body": "#d1d5db",
            "--tw-prose-invert-headings": "#fff",
            "--tw-prose-invert-lead": "#9ca3af",
            "--tw-prose-invert-links": "#fff",
            "--tw-prose-invert-bold": "#fff",
            "--tw-prose-invert-counters": "#9ca3af",
            "--tw-prose-invert-bullets": "#4b5563",
            "--tw-prose-invert-hr": "#374151",
            "--tw-prose-invert-quotes": "#f3f4f6",
            "--tw-prose-invert-quote-borders": "#374151",
            "--tw-prose-invert-captions": "#9ca3af",
            "--tw-prose-invert-kbd": "#fff",
            "--tw-prose-invert-kbd-shadows": "255 255 255",
            "--tw-prose-invert-code": "#fff",
            "--tw-prose-invert-pre-code": "#d1d5db",
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": "#4b5563",
            "--tw-prose-invert-td-borders": "#374151"
          },
          {
            "fontSize": "1rem",
            "lineHeight": "1.75",
            "p": {
              "marginTop": "1.25em",
              "marginBottom": "1.25em"
            },
            "[class~=\\"lead\\"]": {
              "fontSize": "1.25em",
              "lineHeight": "1.6",
              "marginTop": "1.2em",
              "marginBottom": "1.2em"
            },
            "blockquote": {
              "marginTop": "1.6em",
              "marginBottom": "1.6em",
              "paddingInlineStart": "1em"
            },
            "h1": {
              "fontSize": "2.25em",
              "marginTop": "0",
              "marginBottom": "0.8888889em",
              "lineHeight": "1.1111111"
            },
            "h2": {
              "fontSize": "1.5em",
              "marginTop": "2em",
              "marginBottom": "1em",
              "lineHeight": "1.3333333"
            },
            "h3": {
              "fontSize": "1.25em",
              "marginTop": "1.6em",
              "marginBottom": "0.6em",
              "lineHeight": "1.6"
            },
            "h4": {
              "marginTop": "1.5em",
              "marginBottom": "0.5em",
              "lineHeight": "1.5"
            },
            "img": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "picture": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "picture > img": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "video": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "kbd": {
              "fontSize": "0.875em",
              "borderRadius": "0.3125rem",
              "paddingTop": "0.1875em",
              "paddingInlineEnd": "0.375em",
              "paddingBottom": "0.1875em",
              "paddingInlineStart": "0.375em"
            },
            "code": {
              "fontSize": "0.875em"
            },
            "h2 code": {
              "fontSize": "0.875em"
            },
            "h3 code": {
              "fontSize": "0.9em"
            },
            "pre": {
              "fontSize": "0.875em",
              "lineHeight": "1.7142857",
              "marginTop": "1.7142857em",
              "marginBottom": "1.7142857em",
              "borderRadius": "0.375rem",
              "paddingTop": "0.8571429em",
              "paddingInlineEnd": "1.1428571em",
              "paddingBottom": "0.8571429em",
              "paddingInlineStart": "1.1428571em"
            },
            "ol": {
              "marginTop": "1.25em",
              "marginBottom": "1.25em",
              "paddingInlineStart": "1.625em"
            },
            "ul": {
              "marginTop": "1.25em",
              "marginBottom": "1.25em",
              "paddingInlineStart": "1.625em"
            },
            "li": {
              "marginTop": "0.5em",
              "marginBottom": "0.5em"
            },
            "ol > li": {
              "paddingInlineStart": "0.375em"
            },
            "ul > li": {
              "paddingInlineStart": "0.375em"
            },
            "> ul > li p": {
              "marginTop": "0.75em",
              "marginBottom": "0.75em"
            },
            "> ul > li > p:first-child": {
              "marginTop": "1.25em"
            },
            "> ul > li > p:last-child": {
              "marginBottom": "1.25em"
            },
            "> ol > li > p:first-child": {
              "marginTop": "1.25em"
            },
            "> ol > li > p:last-child": {
              "marginBottom": "1.25em"
            },
            "ul ul, ul ol, ol ul, ol ol": {
              "marginTop": "0.75em",
              "marginBottom": "0.75em"
            },
            "dl": {
              "marginTop": "1.25em",
              "marginBottom": "1.25em"
            },
            "dt": {
              "marginTop": "1.25em"
            },
            "dd": {
              "marginTop": "0.5em",
              "paddingInlineStart": "1.625em"
            },
            "hr": {
              "marginTop": "3em",
              "marginBottom": "3em"
            },
            "hr + *": {
              "marginTop": "0"
            },
            "h2 + *": {
              "marginTop": "0"
            },
            "h3 + *": {
              "marginTop": "0"
            },
            "h4 + *": {
              "marginTop": "0"
            },
            "table": {
              "fontSize": "0.875em",
              "lineHeight": "1.7142857"
            },
            "thead th": {
              "paddingInlineEnd": "0.5714286em",
              "paddingBottom": "0.5714286em",
              "paddingInlineStart": "0.5714286em"
            },
            "thead th:first-child": {
              "paddingInlineStart": "0"
            },
            "thead th:last-child": {
              "paddingInlineEnd": "0"
            },
            "tbody td, tfoot td": {
              "paddingTop": "0.5714286em",
              "paddingInlineEnd": "0.5714286em",
              "paddingBottom": "0.5714286em",
              "paddingInlineStart": "0.5714286em"
            },
            "tbody td:first-child, tfoot td:first-child": {
              "paddingInlineStart": "0"
            },
            "tbody td:last-child, tfoot td:last-child": {
              "paddingInlineEnd": "0"
            },
            "figure": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "figure > *": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "figcaption": {
              "fontSize": "0.875em",
              "lineHeight": "1.4285714",
              "marginTop": "0.8571429em"
            }
          },
          {
            "> :first-child": {
              "marginTop": "0"
            },
            "> :last-child": {
              "marginBottom": "0"
            }
          },
          {
            "--tw-prose-body": "rgb(56 56 56)"
          }
        ]
      },
      "sm": {
        "css": [
          {
            "fontSize": "0.875rem",
            "lineHeight": "1.7142857",
            "p": {
              "marginTop": "1.1428571em",
              "marginBottom": "1.1428571em"
            },
            "[class~=\\"lead\\"]": {
              "fontSize": "1.2857143em",
              "lineHeight": "1.5555556",
              "marginTop": "0.8888889em",
              "marginBottom": "0.8888889em"
            },
            "blockquote": {
              "marginTop": "1.3333333em",
              "marginBottom": "1.3333333em",
              "paddingInlineStart": "1.1111111em"
            },
            "h1": {
              "fontSize": "2.1428571em",
              "marginTop": "0",
              "marginBottom": "0.8em",
              "lineHeight": "1.2"
            },
            "h2": {
              "fontSize": "1.4285714em",
              "marginTop": "1.6em",
              "marginBottom": "0.8em",
              "lineHeight": "1.4"
            },
            "h3": {
              "fontSize": "1.2857143em",
              "marginTop": "1.5555556em",
              "marginBottom": "0.4444444em",
              "lineHeight": "1.5555556"
            },
            "h4": {
              "marginTop": "1.4285714em",
              "marginBottom": "0.5714286em",
              "lineHeight": "1.4285714"
            },
            "img": {
              "marginTop": "1.7142857em",
              "marginBottom": "1.7142857em"
            },
            "picture": {
              "marginTop": "1.7142857em",
              "marginBottom": "1.7142857em"
            },
            "picture > img": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "video": {
              "marginTop": "1.7142857em",
              "marginBottom": "1.7142857em"
            },
            "kbd": {
              "fontSize": "0.8571429em",
              "borderRadius": "0.3125rem",
              "paddingTop": "0.1428571em",
              "paddingInlineEnd": "0.3571429em",
              "paddingBottom": "0.1428571em",
              "paddingInlineStart": "0.3571429em"
            },
            "code": {
              "fontSize": "0.8571429em"
            },
            "h2 code": {
              "fontSize": "0.9em"
            },
            "h3 code": {
              "fontSize": "0.8888889em"
            },
            "pre": {
              "fontSize": "0.8571429em",
              "lineHeight": "1.6666667",
              "marginTop": "1.6666667em",
              "marginBottom": "1.6666667em",
              "borderRadius": "0.25rem",
              "paddingTop": "0.6666667em",
              "paddingInlineEnd": "1em",
              "paddingBottom": "0.6666667em",
              "paddingInlineStart": "1em"
            },
            "ol": {
              "marginTop": "1.1428571em",
              "marginBottom": "1.1428571em",
              "paddingInlineStart": "1.5714286em"
            },
            "ul": {
              "marginTop": "1.1428571em",
              "marginBottom": "1.1428571em",
              "paddingInlineStart": "1.5714286em"
            },
            "li": {
              "marginTop": "0.2857143em",
              "marginBottom": "0.2857143em"
            },
            "ol > li": {
              "paddingInlineStart": "0.4285714em"
            },
            "ul > li": {
              "paddingInlineStart": "0.4285714em"
            },
            "> ul > li p": {
              "marginTop": "0.5714286em",
              "marginBottom": "0.5714286em"
            },
            "> ul > li > p:first-child": {
              "marginTop": "1.1428571em"
            },
            "> ul > li > p:last-child": {
              "marginBottom": "1.1428571em"
            },
            "> ol > li > p:first-child": {
              "marginTop": "1.1428571em"
            },
            "> ol > li > p:last-child": {
              "marginBottom": "1.1428571em"
            },
            "ul ul, ul ol, ol ul, ol ol": {
              "marginTop": "0.5714286em",
              "marginBottom": "0.5714286em"
            },
            "dl": {
              "marginTop": "1.1428571em",
              "marginBottom": "1.1428571em"
            },
            "dt": {
              "marginTop": "1.1428571em"
            },
            "dd": {
              "marginTop": "0.2857143em",
              "paddingInlineStart": "1.5714286em"
            },
            "hr": {
              "marginTop": "2.8571429em",
              "marginBottom": "2.8571429em"
            },
            "hr + *": {
              "marginTop": "0"
            },
            "h2 + *": {
              "marginTop": "0"
            },
            "h3 + *": {
              "marginTop": "0"
            },
            "h4 + *": {
              "marginTop": "0"
            },
            "table": {
              "fontSize": "0.8571429em",
              "lineHeight": "1.5"
            },
            "thead th": {
              "paddingInlineEnd": "1em",
              "paddingBottom": "0.6666667em",
              "paddingInlineStart": "1em"
            },
            "thead th:first-child": {
              "paddingInlineStart": "0"
            },
            "thead th:last-child": {
              "paddingInlineEnd": "0"
            },
            "tbody td, tfoot td": {
              "paddingTop": "0.6666667em",
              "paddingInlineEnd": "1em",
              "paddingBottom": "0.6666667em",
              "paddingInlineStart": "1em"
            },
            "tbody td:first-child, tfoot td:first-child": {
              "paddingInlineStart": "0"
            },
            "tbody td:last-child, tfoot td:last-child": {
              "paddingInlineEnd": "0"
            },
            "figure": {
              "marginTop": "1.7142857em",
              "marginBottom": "1.7142857em"
            },
            "figure > *": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "figcaption": {
              "fontSize": "0.8571429em",
              "lineHeight": "1.3333333",
              "marginTop": "0.6666667em"
            }
          },
          {
            "> :first-child": {
              "marginTop": "0"
            },
            "> :last-child": {
              "marginBottom": "0"
            }
          },
          {
            "fontSize": "14px",
            "fontWeight": 420,
            "lineHeight": 1.6,
            "letterSpacing": "0.02em",
            "p": {
              "marginTop": "0.5rem",
              "marginBottom": "1rem"
            },
            "> ul > li p": {
              "marginTop": "0.5rem",
              "marginBottom": "0.5rem"
            },
            "> ul > li > *:first-child": {
              "marginTop": "0.5rem"
            },
            "> ul > li > *:last-child": {
              "marginBottom": "0.5rem"
            },
            "> ol > li p": {
              "marginTop": "0.5rem",
              "marginBottom": "0.5rem"
            },
            "> ol > li > *:first-child": {
              "marginTop": "0.5rem"
            },
            "> ol > li > *:last-child": {
              "marginBottom": "0.5rem"
            }
          }
        ]
      },
      "base": {
        "css": [
          {
            "fontSize": "1rem",
            "lineHeight": "1.75",
            "p": {
              "marginTop": "1.25em",
              "marginBottom": "1.25em"
            },
            "[class~=\\"lead\\"]": {
              "fontSize": "1.25em",
              "lineHeight": "1.6",
              "marginTop": "1.2em",
              "marginBottom": "1.2em"
            },
            "blockquote": {
              "marginTop": "1.6em",
              "marginBottom": "1.6em",
              "paddingInlineStart": "1em"
            },
            "h1": {
              "fontSize": "2.25em",
              "marginTop": "0",
              "marginBottom": "0.8888889em",
              "lineHeight": "1.1111111"
            },
            "h2": {
              "fontSize": "1.5em",
              "marginTop": "2em",
              "marginBottom": "1em",
              "lineHeight": "1.3333333"
            },
            "h3": {
              "fontSize": "1.25em",
              "marginTop": "1.6em",
              "marginBottom": "0.6em",
              "lineHeight": "1.6"
            },
            "h4": {
              "marginTop": "1.5em",
              "marginBottom": "0.5em",
              "lineHeight": "1.5"
            },
            "img": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "picture": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "picture > img": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "video": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "kbd": {
              "fontSize": "0.875em",
              "borderRadius": "0.3125rem",
              "paddingTop": "0.1875em",
              "paddingInlineEnd": "0.375em",
              "paddingBottom": "0.1875em",
              "paddingInlineStart": "0.375em"
            },
            "code": {
              "fontSize": "0.875em"
            },
            "h2 code": {
              "fontSize": "0.875em"
            },
            "h3 code": {
              "fontSize": "0.9em"
            },
            "pre": {
              "fontSize": "0.875em",
              "lineHeight": "1.7142857",
              "marginTop": "1.7142857em",
              "marginBottom": "1.7142857em",
              "borderRadius": "0.375rem",
              "paddingTop": "0.8571429em",
              "paddingInlineEnd": "1.1428571em",
              "paddingBottom": "0.8571429em",
              "paddingInlineStart": "1.1428571em"
            },
            "ol": {
              "marginTop": "1.25em",
              "marginBottom": "1.25em",
              "paddingInlineStart": "1.625em"
            },
            "ul": {
              "marginTop": "1.25em",
              "marginBottom": "1.25em",
              "paddingInlineStart": "1.625em"
            },
            "li": {
              "marginTop": "0.5em",
              "marginBottom": "0.5em"
            },
            "ol > li": {
              "paddingInlineStart": "0.375em"
            },
            "ul > li": {
              "paddingInlineStart": "0.375em"
            },
            "> ul > li p": {
              "marginTop": "0.75em",
              "marginBottom": "0.75em"
            },
            "> ul > li > p:first-child": {
              "marginTop": "1.25em"
            },
            "> ul > li > p:last-child": {
              "marginBottom": "1.25em"
            },
            "> ol > li > p:first-child": {
              "marginTop": "1.25em"
            },
            "> ol > li > p:last-child": {
              "marginBottom": "1.25em"
            },
            "ul ul, ul ol, ol ul, ol ol": {
              "marginTop": "0.75em",
              "marginBottom": "0.75em"
            },
            "dl": {
              "marginTop": "1.25em",
              "marginBottom": "1.25em"
            },
            "dt": {
              "marginTop": "1.25em"
            },
            "dd": {
              "marginTop": "0.5em",
              "paddingInlineStart": "1.625em"
            },
            "hr": {
              "marginTop": "3em",
              "marginBottom": "3em"
            },
            "hr + *": {
              "marginTop": "0"
            },
            "h2 + *": {
              "marginTop": "0"
            },
            "h3 + *": {
              "marginTop": "0"
            },
            "h4 + *": {
              "marginTop": "0"
            },
            "table": {
              "fontSize": "0.875em",
              "lineHeight": "1.7142857"
            },
            "thead th": {
              "paddingInlineEnd": "0.5714286em",
              "paddingBottom": "0.5714286em",
              "paddingInlineStart": "0.5714286em"
            },
            "thead th:first-child": {
              "paddingInlineStart": "0"
            },
            "thead th:last-child": {
              "paddingInlineEnd": "0"
            },
            "tbody td, tfoot td": {
              "paddingTop": "0.5714286em",
              "paddingInlineEnd": "0.5714286em",
              "paddingBottom": "0.5714286em",
              "paddingInlineStart": "0.5714286em"
            },
            "tbody td:first-child, tfoot td:first-child": {
              "paddingInlineStart": "0"
            },
            "tbody td:last-child, tfoot td:last-child": {
              "paddingInlineEnd": "0"
            },
            "figure": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "figure > *": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "figcaption": {
              "fontSize": "0.875em",
              "lineHeight": "1.4285714",
              "marginTop": "0.8571429em"
            }
          },
          {
            "> :first-child": {
              "marginTop": "0"
            },
            "> :last-child": {
              "marginBottom": "0"
            }
          }
        ]
      },
      "lg": {
        "css": [
          {
            "fontSize": "1.125rem",
            "lineHeight": "1.7777778",
            "p": {
              "marginTop": "1.3333333em",
              "marginBottom": "1.3333333em"
            },
            "[class~=\\"lead\\"]": {
              "fontSize": "1.2222222em",
              "lineHeight": "1.4545455",
              "marginTop": "1.0909091em",
              "marginBottom": "1.0909091em"
            },
            "blockquote": {
              "marginTop": "1.6666667em",
              "marginBottom": "1.6666667em",
              "paddingInlineStart": "1em"
            },
            "h1": {
              "fontSize": "2.6666667em",
              "marginTop": "0",
              "marginBottom": "0.8333333em",
              "lineHeight": "1"
            },
            "h2": {
              "fontSize": "1.6666667em",
              "marginTop": "1.8666667em",
              "marginBottom": "1.0666667em",
              "lineHeight": "1.3333333"
            },
            "h3": {
              "fontSize": "1.3333333em",
              "marginTop": "1.6666667em",
              "marginBottom": "0.6666667em",
              "lineHeight": "1.5"
            },
            "h4": {
              "marginTop": "1.7777778em",
              "marginBottom": "0.4444444em",
              "lineHeight": "1.5555556"
            },
            "img": {
              "marginTop": "1.7777778em",
              "marginBottom": "1.7777778em"
            },
            "picture": {
              "marginTop": "1.7777778em",
              "marginBottom": "1.7777778em"
            },
            "picture > img": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "video": {
              "marginTop": "1.7777778em",
              "marginBottom": "1.7777778em"
            },
            "kbd": {
              "fontSize": "0.8888889em",
              "borderRadius": "0.3125rem",
              "paddingTop": "0.2222222em",
              "paddingInlineEnd": "0.4444444em",
              "paddingBottom": "0.2222222em",
              "paddingInlineStart": "0.4444444em"
            },
            "code": {
              "fontSize": "0.8888889em"
            },
            "h2 code": {
              "fontSize": "0.8666667em"
            },
            "h3 code": {
              "fontSize": "0.875em"
            },
            "pre": {
              "fontSize": "0.8888889em",
              "lineHeight": "1.75",
              "marginTop": "2em",
              "marginBottom": "2em",
              "borderRadius": "0.375rem",
              "paddingTop": "1em",
              "paddingInlineEnd": "1.5em",
              "paddingBottom": "1em",
              "paddingInlineStart": "1.5em"
            },
            "ol": {
              "marginTop": "1.3333333em",
              "marginBottom": "1.3333333em",
              "paddingInlineStart": "1.5555556em"
            },
            "ul": {
              "marginTop": "1.3333333em",
              "marginBottom": "1.3333333em",
              "paddingInlineStart": "1.5555556em"
            },
            "li": {
              "marginTop": "0.6666667em",
              "marginBottom": "0.6666667em"
            },
            "ol > li": {
              "paddingInlineStart": "0.4444444em"
            },
            "ul > li": {
              "paddingInlineStart": "0.4444444em"
            },
            "> ul > li p": {
              "marginTop": "0.8888889em",
              "marginBottom": "0.8888889em"
            },
            "> ul > li > p:first-child": {
              "marginTop": "1.3333333em"
            },
            "> ul > li > p:last-child": {
              "marginBottom": "1.3333333em"
            },
            "> ol > li > p:first-child": {
              "marginTop": "1.3333333em"
            },
            "> ol > li > p:last-child": {
              "marginBottom": "1.3333333em"
            },
            "ul ul, ul ol, ol ul, ol ol": {
              "marginTop": "0.8888889em",
              "marginBottom": "0.8888889em"
            },
            "dl": {
              "marginTop": "1.3333333em",
              "marginBottom": "1.3333333em"
            },
            "dt": {
              "marginTop": "1.3333333em"
            },
            "dd": {
              "marginTop": "0.6666667em",
              "paddingInlineStart": "1.5555556em"
            },
            "hr": {
              "marginTop": "3.1111111em",
              "marginBottom": "3.1111111em"
            },
            "hr + *": {
              "marginTop": "0"
            },
            "h2 + *": {
              "marginTop": "0"
            },
            "h3 + *": {
              "marginTop": "0"
            },
            "h4 + *": {
              "marginTop": "0"
            },
            "table": {
              "fontSize": "0.8888889em",
              "lineHeight": "1.5"
            },
            "thead th": {
              "paddingInlineEnd": "0.75em",
              "paddingBottom": "0.75em",
              "paddingInlineStart": "0.75em"
            },
            "thead th:first-child": {
              "paddingInlineStart": "0"
            },
            "thead th:last-child": {
              "paddingInlineEnd": "0"
            },
            "tbody td, tfoot td": {
              "paddingTop": "0.75em",
              "paddingInlineEnd": "0.75em",
              "paddingBottom": "0.75em",
              "paddingInlineStart": "0.75em"
            },
            "tbody td:first-child, tfoot td:first-child": {
              "paddingInlineStart": "0"
            },
            "tbody td:last-child, tfoot td:last-child": {
              "paddingInlineEnd": "0"
            },
            "figure": {
              "marginTop": "1.7777778em",
              "marginBottom": "1.7777778em"
            },
            "figure > *": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "figcaption": {
              "fontSize": "0.8888889em",
              "lineHeight": "1.5",
              "marginTop": "1em"
            }
          },
          {
            "> :first-child": {
              "marginTop": "0"
            },
            "> :last-child": {
              "marginBottom": "0"
            }
          }
        ]
      },
      "xl": {
        "css": [
          {
            "fontSize": "1.25rem",
            "lineHeight": "1.8",
            "p": {
              "marginTop": "1.2em",
              "marginBottom": "1.2em"
            },
            "[class~=\\"lead\\"]": {
              "fontSize": "1.2em",
              "lineHeight": "1.5",
              "marginTop": "1em",
              "marginBottom": "1em"
            },
            "blockquote": {
              "marginTop": "1.6em",
              "marginBottom": "1.6em",
              "paddingInlineStart": "1.0666667em"
            },
            "h1": {
              "fontSize": "2.8em",
              "marginTop": "0",
              "marginBottom": "0.8571429em",
              "lineHeight": "1"
            },
            "h2": {
              "fontSize": "1.8em",
              "marginTop": "1.5555556em",
              "marginBottom": "0.8888889em",
              "lineHeight": "1.1111111"
            },
            "h3": {
              "fontSize": "1.5em",
              "marginTop": "1.6em",
              "marginBottom": "0.6666667em",
              "lineHeight": "1.3333333"
            },
            "h4": {
              "marginTop": "1.8em",
              "marginBottom": "0.6em",
              "lineHeight": "1.6"
            },
            "img": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "picture": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "picture > img": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "video": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "kbd": {
              "fontSize": "0.9em",
              "borderRadius": "0.3125rem",
              "paddingTop": "0.25em",
              "paddingInlineEnd": "0.4em",
              "paddingBottom": "0.25em",
              "paddingInlineStart": "0.4em"
            },
            "code": {
              "fontSize": "0.9em"
            },
            "h2 code": {
              "fontSize": "0.8611111em"
            },
            "h3 code": {
              "fontSize": "0.9em"
            },
            "pre": {
              "fontSize": "0.9em",
              "lineHeight": "1.7777778",
              "marginTop": "2em",
              "marginBottom": "2em",
              "borderRadius": "0.5rem",
              "paddingTop": "1.1111111em",
              "paddingInlineEnd": "1.3333333em",
              "paddingBottom": "1.1111111em",
              "paddingInlineStart": "1.3333333em"
            },
            "ol": {
              "marginTop": "1.2em",
              "marginBottom": "1.2em",
              "paddingInlineStart": "1.6em"
            },
            "ul": {
              "marginTop": "1.2em",
              "marginBottom": "1.2em",
              "paddingInlineStart": "1.6em"
            },
            "li": {
              "marginTop": "0.6em",
              "marginBottom": "0.6em"
            },
            "ol > li": {
              "paddingInlineStart": "0.4em"
            },
            "ul > li": {
              "paddingInlineStart": "0.4em"
            },
            "> ul > li p": {
              "marginTop": "0.8em",
              "marginBottom": "0.8em"
            },
            "> ul > li > p:first-child": {
              "marginTop": "1.2em"
            },
            "> ul > li > p:last-child": {
              "marginBottom": "1.2em"
            },
            "> ol > li > p:first-child": {
              "marginTop": "1.2em"
            },
            "> ol > li > p:last-child": {
              "marginBottom": "1.2em"
            },
            "ul ul, ul ol, ol ul, ol ol": {
              "marginTop": "0.8em",
              "marginBottom": "0.8em"
            },
            "dl": {
              "marginTop": "1.2em",
              "marginBottom": "1.2em"
            },
            "dt": {
              "marginTop": "1.2em"
            },
            "dd": {
              "marginTop": "0.6em",
              "paddingInlineStart": "1.6em"
            },
            "hr": {
              "marginTop": "2.8em",
              "marginBottom": "2.8em"
            },
            "hr + *": {
              "marginTop": "0"
            },
            "h2 + *": {
              "marginTop": "0"
            },
            "h3 + *": {
              "marginTop": "0"
            },
            "h4 + *": {
              "marginTop": "0"
            },
            "table": {
              "fontSize": "0.9em",
              "lineHeight": "1.5555556"
            },
            "thead th": {
              "paddingInlineEnd": "0.6666667em",
              "paddingBottom": "0.8888889em",
              "paddingInlineStart": "0.6666667em"
            },
            "thead th:first-child": {
              "paddingInlineStart": "0"
            },
            "thead th:last-child": {
              "paddingInlineEnd": "0"
            },
            "tbody td, tfoot td": {
              "paddingTop": "0.8888889em",
              "paddingInlineEnd": "0.6666667em",
              "paddingBottom": "0.8888889em",
              "paddingInlineStart": "0.6666667em"
            },
            "tbody td:first-child, tfoot td:first-child": {
              "paddingInlineStart": "0"
            },
            "tbody td:last-child, tfoot td:last-child": {
              "paddingInlineEnd": "0"
            },
            "figure": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "figure > *": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "figcaption": {
              "fontSize": "0.9em",
              "lineHeight": "1.5555556",
              "marginTop": "1em"
            }
          },
          {
            "> :first-child": {
              "marginTop": "0"
            },
            "> :last-child": {
              "marginBottom": "0"
            }
          }
        ]
      },
      "2xl": {
        "css": [
          {
            "fontSize": "1.5rem",
            "lineHeight": "1.6666667",
            "p": {
              "marginTop": "1.3333333em",
              "marginBottom": "1.3333333em"
            },
            "[class~=\\"lead\\"]": {
              "fontSize": "1.25em",
              "lineHeight": "1.4666667",
              "marginTop": "1.0666667em",
              "marginBottom": "1.0666667em"
            },
            "blockquote": {
              "marginTop": "1.7777778em",
              "marginBottom": "1.7777778em",
              "paddingInlineStart": "1.1111111em"
            },
            "h1": {
              "fontSize": "2.6666667em",
              "marginTop": "0",
              "marginBottom": "0.875em",
              "lineHeight": "1"
            },
            "h2": {
              "fontSize": "2em",
              "marginTop": "1.5em",
              "marginBottom": "0.8333333em",
              "lineHeight": "1.0833333"
            },
            "h3": {
              "fontSize": "1.5em",
              "marginTop": "1.5555556em",
              "marginBottom": "0.6666667em",
              "lineHeight": "1.2222222"
            },
            "h4": {
              "marginTop": "1.6666667em",
              "marginBottom": "0.6666667em",
              "lineHeight": "1.5"
            },
            "img": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "picture": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "picture > img": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "video": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "kbd": {
              "fontSize": "0.8333333em",
              "borderRadius": "0.375rem",
              "paddingTop": "0.25em",
              "paddingInlineEnd": "0.3333333em",
              "paddingBottom": "0.25em",
              "paddingInlineStart": "0.3333333em"
            },
            "code": {
              "fontSize": "0.8333333em"
            },
            "h2 code": {
              "fontSize": "0.875em"
            },
            "h3 code": {
              "fontSize": "0.8888889em"
            },
            "pre": {
              "fontSize": "0.8333333em",
              "lineHeight": "1.8",
              "marginTop": "2em",
              "marginBottom": "2em",
              "borderRadius": "0.5rem",
              "paddingTop": "1.2em",
              "paddingInlineEnd": "1.6em",
              "paddingBottom": "1.2em",
              "paddingInlineStart": "1.6em"
            },
            "ol": {
              "marginTop": "1.3333333em",
              "marginBottom": "1.3333333em",
              "paddingInlineStart": "1.5833333em"
            },
            "ul": {
              "marginTop": "1.3333333em",
              "marginBottom": "1.3333333em",
              "paddingInlineStart": "1.5833333em"
            },
            "li": {
              "marginTop": "0.5em",
              "marginBottom": "0.5em"
            },
            "ol > li": {
              "paddingInlineStart": "0.4166667em"
            },
            "ul > li": {
              "paddingInlineStart": "0.4166667em"
            },
            "> ul > li p": {
              "marginTop": "0.8333333em",
              "marginBottom": "0.8333333em"
            },
            "> ul > li > p:first-child": {
              "marginTop": "1.3333333em"
            },
            "> ul > li > p:last-child": {
              "marginBottom": "1.3333333em"
            },
            "> ol > li > p:first-child": {
              "marginTop": "1.3333333em"
            },
            "> ol > li > p:last-child": {
              "marginBottom": "1.3333333em"
            },
            "ul ul, ul ol, ol ul, ol ol": {
              "marginTop": "0.6666667em",
              "marginBottom": "0.6666667em"
            },
            "dl": {
              "marginTop": "1.3333333em",
              "marginBottom": "1.3333333em"
            },
            "dt": {
              "marginTop": "1.3333333em"
            },
            "dd": {
              "marginTop": "0.5em",
              "paddingInlineStart": "1.5833333em"
            },
            "hr": {
              "marginTop": "3em",
              "marginBottom": "3em"
            },
            "hr + *": {
              "marginTop": "0"
            },
            "h2 + *": {
              "marginTop": "0"
            },
            "h3 + *": {
              "marginTop": "0"
            },
            "h4 + *": {
              "marginTop": "0"
            },
            "table": {
              "fontSize": "0.8333333em",
              "lineHeight": "1.4"
            },
            "thead th": {
              "paddingInlineEnd": "0.6em",
              "paddingBottom": "0.8em",
              "paddingInlineStart": "0.6em"
            },
            "thead th:first-child": {
              "paddingInlineStart": "0"
            },
            "thead th:last-child": {
              "paddingInlineEnd": "0"
            },
            "tbody td, tfoot td": {
              "paddingTop": "0.8em",
              "paddingInlineEnd": "0.6em",
              "paddingBottom": "0.8em",
              "paddingInlineStart": "0.6em"
            },
            "tbody td:first-child, tfoot td:first-child": {
              "paddingInlineStart": "0"
            },
            "tbody td:last-child, tfoot td:last-child": {
              "paddingInlineEnd": "0"
            },
            "figure": {
              "marginTop": "2em",
              "marginBottom": "2em"
            },
            "figure > *": {
              "marginTop": "0",
              "marginBottom": "0"
            },
            "figcaption": {
              "fontSize": "0.8333333em",
              "lineHeight": "1.6",
              "marginTop": "1em"
            }
          },
          {
            "> :first-child": {
              "marginTop": "0"
            },
            "> :last-child": {
              "marginBottom": "0"
            }
          }
        ]
      },
      "slate": {
        "css": {
          "--tw-prose-body": "#334155",
          "--tw-prose-headings": "#0f172a",
          "--tw-prose-lead": "#475569",
          "--tw-prose-links": "#0f172a",
          "--tw-prose-bold": "#0f172a",
          "--tw-prose-counters": "#64748b",
          "--tw-prose-bullets": "#cbd5e1",
          "--tw-prose-hr": "#e2e8f0",
          "--tw-prose-quotes": "#0f172a",
          "--tw-prose-quote-borders": "#e2e8f0",
          "--tw-prose-captions": "#64748b",
          "--tw-prose-kbd": "#0f172a",
          "--tw-prose-kbd-shadows": "15 23 42",
          "--tw-prose-code": "#0f172a",
          "--tw-prose-pre-code": "#e2e8f0",
          "--tw-prose-pre-bg": "#1e293b",
          "--tw-prose-th-borders": "#cbd5e1",
          "--tw-prose-td-borders": "#e2e8f0",
          "--tw-prose-invert-body": "#cbd5e1",
          "--tw-prose-invert-headings": "#fff",
          "--tw-prose-invert-lead": "#94a3b8",
          "--tw-prose-invert-links": "#fff",
          "--tw-prose-invert-bold": "#fff",
          "--tw-prose-invert-counters": "#94a3b8",
          "--tw-prose-invert-bullets": "#475569",
          "--tw-prose-invert-hr": "#334155",
          "--tw-prose-invert-quotes": "#f1f5f9",
          "--tw-prose-invert-quote-borders": "#334155",
          "--tw-prose-invert-captions": "#94a3b8",
          "--tw-prose-invert-kbd": "#fff",
          "--tw-prose-invert-kbd-shadows": "255 255 255",
          "--tw-prose-invert-code": "#fff",
          "--tw-prose-invert-pre-code": "#cbd5e1",
          "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
          "--tw-prose-invert-th-borders": "#475569",
          "--tw-prose-invert-td-borders": "#334155"
        }
      },
      "gray": {
        "css": {
          "--tw-prose-body": "#374151",
          "--tw-prose-headings": "#111827",
          "--tw-prose-lead": "#4b5563",
          "--tw-prose-links": "#111827",
          "--tw-prose-bold": "#111827",
          "--tw-prose-counters": "#6b7280",
          "--tw-prose-bullets": "#d1d5db",
          "--tw-prose-hr": "#e5e7eb",
          "--tw-prose-quotes": "#111827",
          "--tw-prose-quote-borders": "#e5e7eb",
          "--tw-prose-captions": "#6b7280",
          "--tw-prose-kbd": "#111827",
          "--tw-prose-kbd-shadows": "17 24 39",
          "--tw-prose-code": "#111827",
          "--tw-prose-pre-code": "#e5e7eb",
          "--tw-prose-pre-bg": "#1f2937",
          "--tw-prose-th-borders": "#d1d5db",
          "--tw-prose-td-borders": "#e5e7eb",
          "--tw-prose-invert-body": "#d1d5db",
          "--tw-prose-invert-headings": "#fff",
          "--tw-prose-invert-lead": "#9ca3af",
          "--tw-prose-invert-links": "#fff",
          "--tw-prose-invert-bold": "#fff",
          "--tw-prose-invert-counters": "#9ca3af",
          "--tw-prose-invert-bullets": "#4b5563",
          "--tw-prose-invert-hr": "#374151",
          "--tw-prose-invert-quotes": "#f3f4f6",
          "--tw-prose-invert-quote-borders": "#374151",
          "--tw-prose-invert-captions": "#9ca3af",
          "--tw-prose-invert-kbd": "#fff",
          "--tw-prose-invert-kbd-shadows": "255 255 255",
          "--tw-prose-invert-code": "#fff",
          "--tw-prose-invert-pre-code": "#d1d5db",
          "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
          "--tw-prose-invert-th-borders": "#4b5563",
          "--tw-prose-invert-td-borders": "#374151"
        }
      },
      "zinc": {
        "css": {
          "--tw-prose-body": "#3f3f46",
          "--tw-prose-headings": "#18181b",
          "--tw-prose-lead": "#52525b",
          "--tw-prose-links": "#18181b",
          "--tw-prose-bold": "#18181b",
          "--tw-prose-counters": "#71717a",
          "--tw-prose-bullets": "#d4d4d8",
          "--tw-prose-hr": "#e4e4e7",
          "--tw-prose-quotes": "#18181b",
          "--tw-prose-quote-borders": "#e4e4e7",
          "--tw-prose-captions": "#71717a",
          "--tw-prose-kbd": "#18181b",
          "--tw-prose-kbd-shadows": "24 24 27",
          "--tw-prose-code": "#18181b",
          "--tw-prose-pre-code": "#e4e4e7",
          "--tw-prose-pre-bg": "#27272a",
          "--tw-prose-th-borders": "#d4d4d8",
          "--tw-prose-td-borders": "#e4e4e7",
          "--tw-prose-invert-body": "#d4d4d8",
          "--tw-prose-invert-headings": "#fff",
          "--tw-prose-invert-lead": "#a1a1aa",
          "--tw-prose-invert-links": "#fff",
          "--tw-prose-invert-bold": "#fff",
          "--tw-prose-invert-counters": "#a1a1aa",
          "--tw-prose-invert-bullets": "#52525b",
          "--tw-prose-invert-hr": "#3f3f46",
          "--tw-prose-invert-quotes": "#f4f4f5",
          "--tw-prose-invert-quote-borders": "#3f3f46",
          "--tw-prose-invert-captions": "#a1a1aa",
          "--tw-prose-invert-kbd": "#fff",
          "--tw-prose-invert-kbd-shadows": "255 255 255",
          "--tw-prose-invert-code": "#fff",
          "--tw-prose-invert-pre-code": "#d4d4d8",
          "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
          "--tw-prose-invert-th-borders": "#52525b",
          "--tw-prose-invert-td-borders": "#3f3f46"
        }
      },
      "neutral": {
        "css": {
          "--tw-prose-body": "#404040",
          "--tw-prose-headings": "#171717",
          "--tw-prose-lead": "#525252",
          "--tw-prose-links": "#171717",
          "--tw-prose-bold": "#171717",
          "--tw-prose-counters": "#737373",
          "--tw-prose-bullets": "#d4d4d4",
          "--tw-prose-hr": "#e5e5e5",
          "--tw-prose-quotes": "#171717",
          "--tw-prose-quote-borders": "#e5e5e5",
          "--tw-prose-captions": "#737373",
          "--tw-prose-kbd": "#171717",
          "--tw-prose-kbd-shadows": "23 23 23",
          "--tw-prose-code": "#171717",
          "--tw-prose-pre-code": "#e5e5e5",
          "--tw-prose-pre-bg": "#262626",
          "--tw-prose-th-borders": "#d4d4d4",
          "--tw-prose-td-borders": "#e5e5e5",
          "--tw-prose-invert-body": "#d4d4d4",
          "--tw-prose-invert-headings": "#fff",
          "--tw-prose-invert-lead": "#a3a3a3",
          "--tw-prose-invert-links": "#fff",
          "--tw-prose-invert-bold": "#fff",
          "--tw-prose-invert-counters": "#a3a3a3",
          "--tw-prose-invert-bullets": "#525252",
          "--tw-prose-invert-hr": "#404040",
          "--tw-prose-invert-quotes": "#f5f5f5",
          "--tw-prose-invert-quote-borders": "#404040",
          "--tw-prose-invert-captions": "#a3a3a3",
          "--tw-prose-invert-kbd": "#fff",
          "--tw-prose-invert-kbd-shadows": "255 255 255",
          "--tw-prose-invert-code": "#fff",
          "--tw-prose-invert-pre-code": "#d4d4d4",
          "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
          "--tw-prose-invert-th-borders": "#525252",
          "--tw-prose-invert-td-borders": "#404040"
        }
      },
      "stone": {
        "css": {
          "--tw-prose-body": "#44403c",
          "--tw-prose-headings": "#1c1917",
          "--tw-prose-lead": "#57534e",
          "--tw-prose-links": "#1c1917",
          "--tw-prose-bold": "#1c1917",
          "--tw-prose-counters": "#78716c",
          "--tw-prose-bullets": "#d6d3d1",
          "--tw-prose-hr": "#e7e5e4",
          "--tw-prose-quotes": "#1c1917",
          "--tw-prose-quote-borders": "#e7e5e4",
          "--tw-prose-captions": "#78716c",
          "--tw-prose-kbd": "#1c1917",
          "--tw-prose-kbd-shadows": "28 25 23",
          "--tw-prose-code": "#1c1917",
          "--tw-prose-pre-code": "#e7e5e4",
          "--tw-prose-pre-bg": "#292524",
          "--tw-prose-th-borders": "#d6d3d1",
          "--tw-prose-td-borders": "#e7e5e4",
          "--tw-prose-invert-body": "#d6d3d1",
          "--tw-prose-invert-headings": "#fff",
          "--tw-prose-invert-lead": "#a8a29e",
          "--tw-prose-invert-links": "#fff",
          "--tw-prose-invert-bold": "#fff",
          "--tw-prose-invert-counters": "#a8a29e",
          "--tw-prose-invert-bullets": "#57534e",
          "--tw-prose-invert-hr": "#44403c",
          "--tw-prose-invert-quotes": "#f5f5f4",
          "--tw-prose-invert-quote-borders": "#44403c",
          "--tw-prose-invert-captions": "#a8a29e",
          "--tw-prose-invert-kbd": "#fff",
          "--tw-prose-invert-kbd-shadows": "255 255 255",
          "--tw-prose-invert-code": "#fff",
          "--tw-prose-invert-pre-code": "#d6d3d1",
          "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
          "--tw-prose-invert-th-borders": "#57534e",
          "--tw-prose-invert-td-borders": "#44403c"
        }
      },
      "red": {
        "css": {
          "--tw-prose-links": "#dc2626",
          "--tw-prose-invert-links": "#ef4444"
        }
      },
      "orange": {
        "css": {
          "--tw-prose-links": "#ea580c",
          "--tw-prose-invert-links": "#f97316"
        }
      },
      "amber": {
        "css": {
          "--tw-prose-links": "#d97706",
          "--tw-prose-invert-links": "#f59e0b"
        }
      },
      "yellow": {
        "css": {
          "--tw-prose-links": "#ca8a04",
          "--tw-prose-invert-links": "#eab308"
        }
      },
      "lime": {
        "css": {
          "--tw-prose-links": "#65a30d",
          "--tw-prose-invert-links": "#84cc16"
        }
      },
      "green": {
        "css": {
          "--tw-prose-links": "#16a34a",
          "--tw-prose-invert-links": "#22c55e"
        }
      },
      "emerald": {
        "css": {
          "--tw-prose-links": "#059669",
          "--tw-prose-invert-links": "#10b981"
        }
      },
      "teal": {
        "css": {
          "--tw-prose-links": "#0d9488",
          "--tw-prose-invert-links": "#14b8a6"
        }
      },
      "cyan": {
        "css": {
          "--tw-prose-links": "#0891b2",
          "--tw-prose-invert-links": "#06b6d4"
        }
      },
      "sky": {
        "css": {
          "--tw-prose-links": "#0284c7",
          "--tw-prose-invert-links": "#0ea5e9"
        }
      },
      "blue": {
        "css": {
          "--tw-prose-links": "#2563eb",
          "--tw-prose-invert-links": "#3b82f6"
        }
      },
      "indigo": {
        "css": {
          "--tw-prose-links": "#4f46e5",
          "--tw-prose-invert-links": "#6366f1"
        }
      },
      "violet": {
        "css": {
          "--tw-prose-links": "#7c3aed",
          "--tw-prose-invert-links": "#8b5cf6"
        }
      },
      "purple": {
        "css": {
          "--tw-prose-links": "#9333ea",
          "--tw-prose-invert-links": "#a855f7"
        }
      },
      "fuchsia": {
        "css": {
          "--tw-prose-links": "#c026d3",
          "--tw-prose-invert-links": "#d946ef"
        }
      },
      "pink": {
        "css": {
          "--tw-prose-links": "#db2777",
          "--tw-prose-invert-links": "#ec4899"
        }
      },
      "rose": {
        "css": {
          "--tw-prose-links": "#e11d48",
          "--tw-prose-invert-links": "#f43f5e"
        }
      },
      "invert": {
        "css": {
          "--tw-prose-body": "var(--tw-prose-invert-body)",
          "--tw-prose-headings": "var(--tw-prose-invert-headings)",
          "--tw-prose-lead": "var(--tw-prose-invert-lead)",
          "--tw-prose-links": "var(--tw-prose-invert-links)",
          "--tw-prose-bold": "var(--tw-prose-invert-bold)",
          "--tw-prose-counters": "var(--tw-prose-invert-counters)",
          "--tw-prose-bullets": "var(--tw-prose-invert-bullets)",
          "--tw-prose-hr": "var(--tw-prose-invert-hr)",
          "--tw-prose-quotes": "var(--tw-prose-invert-quotes)",
          "--tw-prose-quote-borders": "var(--tw-prose-invert-quote-borders)",
          "--tw-prose-captions": "var(--tw-prose-invert-captions)",
          "--tw-prose-kbd": "var(--tw-prose-invert-kbd)",
          "--tw-prose-kbd-shadows": "var(--tw-prose-invert-kbd-shadows)",
          "--tw-prose-code": "var(--tw-prose-invert-code)",
          "--tw-prose-pre-code": "var(--tw-prose-invert-pre-code)",
          "--tw-prose-pre-bg": "var(--tw-prose-invert-pre-bg)",
          "--tw-prose-th-borders": "var(--tw-prose-invert-th-borders)",
          "--tw-prose-td-borders": "var(--tw-prose-invert-td-borders)"
        }
      }
    },
    "colors": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      }
    },
    "borderRadius": {
      "none": "0px",
      "sm": "0.25rem",
      "DEFAULT": "0.5rem",
      "md": "0.625rem",
      "lg": "0.75rem",
      "xl": "1rem",
      "2xl": "1.25rem",
      "full": "9999px"
    },
    "boxShadow": {
      "sm": "0px 1px 2px rgba(0, 0, 0, 0.1)",
      "DEFAULT": "0px 0px 1px rgba(0, 0, 0, 0.45), 0px 1px 2px rgba(0, 0, 0, 0.1)",
      "md": "0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0.5px 2px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.16)",
      "lg": "0px 0px 1px rgba(0, 0, 0, 0.35), 0px 6px 8px -4px rgba(0, 0, 0, 0.1)",
      "xl": "0px 0px 1px rgba(0, 0, 0, 0.19), 0px 1px 2px rgba(0, 0, 0, 0.07), 0px 6px 15px -5px rgba(0, 0, 0, 0.11)",
      "2xl": "0px 0px 1px rgba(0, 0, 0, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 24px -3px rgba(0, 0, 0, 0.1)",
      "none": "none"
    },
    "container": {
      "padding": {
        "xl": "5rem"
      }
    },
    "fontSize": {
      "2xs": [
        "11px",
        {
          "lineHeight": "1.15",
          "letterSpacing": "0.01em",
          "fontWeight": "420"
        }
      ],
      "xs": [
        "12px",
        {
          "lineHeight": "1.15",
          "letterSpacing": "0.02em",
          "fontWeight": "420"
        }
      ],
      "sm": [
        "13px",
        {
          "lineHeight": "1.15",
          "letterSpacing": "0.02em",
          "fontWeight": "420"
        }
      ],
      "base": [
        "14px",
        {
          "lineHeight": "1.15",
          "letterSpacing": "0.02em",
          "fontWeight": "420"
        }
      ],
      "lg": [
        "16px",
        {
          "lineHeight": "1.15",
          "letterSpacing": "0.02em",
          "fontWeight": "400"
        }
      ],
      "xl": [
        "18px",
        {
          "lineHeight": "1.15",
          "letterSpacing": "0.01em",
          "fontWeight": "400"
        }
      ],
      "2xl": [
        "20px",
        {
          "lineHeight": "1.15",
          "letterSpacing": "0.01em",
          "fontWeight": "400"
        }
      ],
      "3xl": [
        "24px",
        {
          "lineHeight": "1.15",
          "fontWeight": 400,
          "letterSpacing": "0.005em"
        }
      ],
      "p-2xs": [
        "11px",
        {
          "lineHeight": "1.6",
          "letterSpacing": "0.01em",
          "fontWeight": "420"
        }
      ],
      "p-xs": [
        "12px",
        {
          "lineHeight": "1.6",
          "letterSpacing": "0.02em",
          "fontWeight": "420"
        }
      ],
      "p-sm": [
        "13px",
        {
          "lineHeight": "1.5",
          "letterSpacing": "0.02em",
          "fontWeight": "420"
        }
      ],
      "p-base": [
        "14px",
        {
          "lineHeight": "1.5",
          "letterSpacing": "0.02em",
          "fontWeight": "420"
        }
      ],
      "p-lg": [
        "16px",
        {
          "lineHeight": "1.5",
          "letterSpacing": "0.02em",
          "fontWeight": "400"
        }
      ],
      "p-xl": [
        "18px",
        {
          "lineHeight": "1.42",
          "letterSpacing": "0.01em",
          "fontWeight": "400"
        }
      ],
      "p-2xl": [
        "20px",
        {
          "lineHeight": "1.38",
          "letterSpacing": "0.01em",
          "fontWeight": "400"
        }
      ],
      "p-3xl": [
        "24px",
        {
          "lineHeight": "1.2",
          "fontWeight": 400,
          "letterSpacing": "0.005em"
        }
      ]
    },
    "screens": {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px"
    },
    "accentColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      },
      "auto": "auto"
    },
    "animation": {
      "none": "none",
      "spin": "spin 1s linear infinite",
      "ping": "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      "bounce": "bounce 1s infinite"
    },
    "aria": {
      "busy": "busy=\\"true\\"",
      "checked": "checked=\\"true\\"",
      "disabled": "disabled=\\"true\\"",
      "expanded": "expanded=\\"true\\"",
      "hidden": "hidden=\\"true\\"",
      "pressed": "pressed=\\"true\\"",
      "readonly": "readonly=\\"true\\"",
      "required": "required=\\"true\\"",
      "selected": "selected=\\"true\\""
    },
    "aspectRatio": {
      "auto": "auto",
      "square": "1 / 1",
      "video": "16 / 9"
    },
    "backdropBlur": {
      "0": "0",
      "none": "",
      "sm": "4px",
      "DEFAULT": "8px",
      "md": "12px",
      "lg": "16px",
      "xl": "24px",
      "2xl": "40px",
      "3xl": "64px"
    },
    "backdropBrightness": {
      "0": "0",
      "50": ".5",
      "75": ".75",
      "90": ".9",
      "95": ".95",
      "100": "1",
      "105": "1.05",
      "110": "1.1",
      "125": "1.25",
      "150": "1.5",
      "200": "2"
    },
    "backdropContrast": {
      "0": "0",
      "50": ".5",
      "75": ".75",
      "100": "1",
      "125": "1.25",
      "150": "1.5",
      "200": "2"
    },
    "backdropGrayscale": {
      "0": "0",
      "DEFAULT": "100%"
    },
    "backdropHueRotate": {
      "0": "0deg",
      "15": "15deg",
      "30": "30deg",
      "60": "60deg",
      "90": "90deg",
      "180": "180deg"
    },
    "backdropInvert": {
      "0": "0",
      "DEFAULT": "100%"
    },
    "backdropOpacity": {
      "0": "0",
      "5": "0.05",
      "10": "0.1",
      "15": "0.15",
      "20": "0.2",
      "25": "0.25",
      "30": "0.3",
      "35": "0.35",
      "40": "0.4",
      "45": "0.45",
      "50": "0.5",
      "55": "0.55",
      "60": "0.6",
      "65": "0.65",
      "70": "0.7",
      "75": "0.75",
      "80": "0.8",
      "85": "0.85",
      "90": "0.9",
      "95": "0.95",
      "100": "1"
    },
    "backdropSaturate": {
      "0": "0",
      "50": ".5",
      "100": "1",
      "150": "1.5",
      "200": "2"
    },
    "backdropSepia": {
      "0": "0",
      "DEFAULT": "100%"
    },
    "backgroundColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      },
      "surface": {}
    },
    "backgroundImage": {
      "none": "none",
      "gradient-to-t": "linear-gradient(to top, var(--tw-gradient-stops))",
      "gradient-to-tr": "linear-gradient(to top right, var(--tw-gradient-stops))",
      "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))",
      "gradient-to-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
      "gradient-to-b": "linear-gradient(to bottom, var(--tw-gradient-stops))",
      "gradient-to-bl": "linear-gradient(to bottom left, var(--tw-gradient-stops))",
      "gradient-to-l": "linear-gradient(to left, var(--tw-gradient-stops))",
      "gradient-to-tl": "linear-gradient(to top left, var(--tw-gradient-stops))"
    },
    "backgroundOpacity": {
      "0": "0",
      "5": "0.05",
      "10": "0.1",
      "15": "0.15",
      "20": "0.2",
      "25": "0.25",
      "30": "0.3",
      "35": "0.35",
      "40": "0.4",
      "45": "0.45",
      "50": "0.5",
      "55": "0.55",
      "60": "0.6",
      "65": "0.65",
      "70": "0.7",
      "75": "0.75",
      "80": "0.8",
      "85": "0.85",
      "90": "0.9",
      "95": "0.95",
      "100": "1"
    },
    "backgroundPosition": {
      "bottom": "bottom",
      "center": "center",
      "left": "left",
      "left-bottom": "left bottom",
      "left-top": "left top",
      "right": "right",
      "right-bottom": "right bottom",
      "right-top": "right top",
      "top": "top"
    },
    "backgroundSize": {
      "auto": "auto",
      "cover": "cover",
      "contain": "contain"
    },
    "blur": {
      "0": "0",
      "none": "",
      "sm": "4px",
      "DEFAULT": "8px",
      "md": "12px",
      "lg": "16px",
      "xl": "24px",
      "2xl": "40px",
      "3xl": "64px"
    },
    "borderColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      },
      "DEFAULT": "rgb(237 237 237)",
      "outline": {}
    },
    "borderOpacity": {
      "0": "0",
      "5": "0.05",
      "10": "0.1",
      "15": "0.15",
      "20": "0.2",
      "25": "0.25",
      "30": "0.3",
      "35": "0.35",
      "40": "0.4",
      "45": "0.45",
      "50": "0.5",
      "55": "0.55",
      "60": "0.6",
      "65": "0.65",
      "70": "0.7",
      "75": "0.75",
      "80": "0.8",
      "85": "0.85",
      "90": "0.9",
      "95": "0.95",
      "100": "1"
    },
    "borderSpacing": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem"
    },
    "borderWidth": {
      "0": "0px",
      "2": "2px",
      "4": "4px",
      "8": "8px",
      "DEFAULT": "1px"
    },
    "boxShadowColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      }
    },
    "brightness": {
      "0": "0",
      "50": ".5",
      "75": ".75",
      "90": ".9",
      "95": ".95",
      "100": "1",
      "105": "1.05",
      "110": "1.1",
      "125": "1.25",
      "150": "1.5",
      "200": "2"
    },
    "caretColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      }
    },
    "columns": {
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      "10": "10",
      "11": "11",
      "12": "12",
      "auto": "auto",
      "3xs": "16rem",
      "2xs": "18rem",
      "xs": "20rem",
      "sm": "24rem",
      "md": "28rem",
      "lg": "32rem",
      "xl": "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
      "5xl": "64rem",
      "6xl": "72rem",
      "7xl": "80rem"
    },
    "content": {
      "none": "none"
    },
    "contrast": {
      "0": "0",
      "50": ".5",
      "75": ".75",
      "100": "1",
      "125": "1.25",
      "150": "1.5",
      "200": "2"
    },
    "cursor": {
      "auto": "auto",
      "default": "default",
      "pointer": "pointer",
      "wait": "wait",
      "text": "text",
      "move": "move",
      "help": "help",
      "not-allowed": "not-allowed",
      "none": "none",
      "context-menu": "context-menu",
      "progress": "progress",
      "cell": "cell",
      "crosshair": "crosshair",
      "vertical-text": "vertical-text",
      "alias": "alias",
      "copy": "copy",
      "no-drop": "no-drop",
      "grab": "grab",
      "grabbing": "grabbing",
      "all-scroll": "all-scroll",
      "col-resize": "col-resize",
      "row-resize": "row-resize",
      "n-resize": "n-resize",
      "e-resize": "e-resize",
      "s-resize": "s-resize",
      "w-resize": "w-resize",
      "ne-resize": "ne-resize",
      "nw-resize": "nw-resize",
      "se-resize": "se-resize",
      "sw-resize": "sw-resize",
      "ew-resize": "ew-resize",
      "ns-resize": "ns-resize",
      "nesw-resize": "nesw-resize",
      "nwse-resize": "nwse-resize",
      "zoom-in": "zoom-in",
      "zoom-out": "zoom-out"
    },
    "divideColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      },
      "DEFAULT": "rgb(237 237 237)",
      "outline": {}
    },
    "divideOpacity": {
      "0": "0",
      "5": "0.05",
      "10": "0.1",
      "15": "0.15",
      "20": "0.2",
      "25": "0.25",
      "30": "0.3",
      "35": "0.35",
      "40": "0.4",
      "45": "0.45",
      "50": "0.5",
      "55": "0.55",
      "60": "0.6",
      "65": "0.65",
      "70": "0.7",
      "75": "0.75",
      "80": "0.8",
      "85": "0.85",
      "90": "0.9",
      "95": "0.95",
      "100": "1"
    },
    "divideWidth": {
      "0": "0px",
      "2": "2px",
      "4": "4px",
      "8": "8px",
      "DEFAULT": "1px"
    },
    "dropShadow": {
      "sm": "0 1px 1px rgb(0 0 0 / 0.05)",
      "DEFAULT": [
        "0 1px 2px rgb(0 0 0 / 0.1)",
        "0 1px 1px rgb(0 0 0 / 0.06)"
      ],
      "md": [
        "0 4px 3px rgb(0 0 0 / 0.07)",
        "0 2px 2px rgb(0 0 0 / 0.06)"
      ],
      "lg": [
        "0 10px 8px rgb(0 0 0 / 0.04)",
        "0 4px 3px rgb(0 0 0 / 0.1)"
      ],
      "xl": [
        "0 20px 13px rgb(0 0 0 / 0.03)",
        "0 8px 5px rgb(0 0 0 / 0.08)"
      ],
      "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
      "none": "0 0 #0000"
    },
    "fill": {
      "none": "none",
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      },
      "ink": {}
    },
    "flex": {
      "1": "1 1 0%",
      "auto": "1 1 auto",
      "initial": "0 1 auto",
      "none": "none"
    },
    "flexBasis": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "auto": "auto",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem",
      "1/2": "50%",
      "1/3": "33.333333%",
      "2/3": "66.666667%",
      "1/4": "25%",
      "2/4": "50%",
      "3/4": "75%",
      "1/5": "20%",
      "2/5": "40%",
      "3/5": "60%",
      "4/5": "80%",
      "1/6": "16.666667%",
      "2/6": "33.333333%",
      "3/6": "50%",
      "4/6": "66.666667%",
      "5/6": "83.333333%",
      "1/12": "8.333333%",
      "2/12": "16.666667%",
      "3/12": "25%",
      "4/12": "33.333333%",
      "5/12": "41.666667%",
      "6/12": "50%",
      "7/12": "58.333333%",
      "8/12": "66.666667%",
      "9/12": "75%",
      "10/12": "83.333333%",
      "11/12": "91.666667%",
      "full": "100%"
    },
    "flexGrow": {
      "0": "0",
      "DEFAULT": "1"
    },
    "flexShrink": {
      "0": "0",
      "DEFAULT": "1"
    },
    "fontFamily": {
      "sans": [
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        "\\"Apple Color Emoji\\"",
        "\\"Segoe UI Emoji\\"",
        "\\"Segoe UI Symbol\\"",
        "\\"Noto Color Emoji\\""
      ],
      "serif": [
        "ui-serif",
        "Georgia",
        "Cambria",
        "\\"Times New Roman\\"",
        "Times",
        "serif"
      ],
      "mono": [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "\\"Liberation Mono\\"",
        "\\"Courier New\\"",
        "monospace"
      ]
    },
    "fontWeight": {
      "thin": "100",
      "extralight": "200",
      "light": "300",
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700",
      "extrabold": "800",
      "black": "900"
    },
    "gap": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem"
    },
    "gradientColorStops": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      }
    },
    "gradientColorStopPositions": {
      "0%": "0%",
      "5%": "5%",
      "10%": "10%",
      "15%": "15%",
      "20%": "20%",
      "25%": "25%",
      "30%": "30%",
      "35%": "35%",
      "40%": "40%",
      "45%": "45%",
      "50%": "50%",
      "55%": "55%",
      "60%": "60%",
      "65%": "65%",
      "70%": "70%",
      "75%": "75%",
      "80%": "80%",
      "85%": "85%",
      "90%": "90%",
      "95%": "95%",
      "100%": "100%"
    },
    "grayscale": {
      "0": "0",
      "DEFAULT": "100%"
    },
    "gridAutoColumns": {
      "auto": "auto",
      "min": "min-content",
      "max": "max-content",
      "fr": "minmax(0, 1fr)"
    },
    "gridAutoRows": {
      "auto": "auto",
      "min": "min-content",
      "max": "max-content",
      "fr": "minmax(0, 1fr)"
    },
    "gridColumn": {
      "auto": "auto",
      "span-1": "span 1 / span 1",
      "span-2": "span 2 / span 2",
      "span-3": "span 3 / span 3",
      "span-4": "span 4 / span 4",
      "span-5": "span 5 / span 5",
      "span-6": "span 6 / span 6",
      "span-7": "span 7 / span 7",
      "span-8": "span 8 / span 8",
      "span-9": "span 9 / span 9",
      "span-10": "span 10 / span 10",
      "span-11": "span 11 / span 11",
      "span-12": "span 12 / span 12",
      "span-full": "1 / -1"
    },
    "gridColumnEnd": {
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      "10": "10",
      "11": "11",
      "12": "12",
      "13": "13",
      "auto": "auto"
    },
    "gridColumnStart": {
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      "10": "10",
      "11": "11",
      "12": "12",
      "13": "13",
      "auto": "auto"
    },
    "gridRow": {
      "auto": "auto",
      "span-1": "span 1 / span 1",
      "span-2": "span 2 / span 2",
      "span-3": "span 3 / span 3",
      "span-4": "span 4 / span 4",
      "span-5": "span 5 / span 5",
      "span-6": "span 6 / span 6",
      "span-7": "span 7 / span 7",
      "span-8": "span 8 / span 8",
      "span-9": "span 9 / span 9",
      "span-10": "span 10 / span 10",
      "span-11": "span 11 / span 11",
      "span-12": "span 12 / span 12",
      "span-full": "1 / -1"
    },
    "gridRowEnd": {
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      "10": "10",
      "11": "11",
      "12": "12",
      "13": "13",
      "auto": "auto"
    },
    "gridRowStart": {
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      "10": "10",
      "11": "11",
      "12": "12",
      "13": "13",
      "auto": "auto"
    },
    "gridTemplateColumns": {
      "1": "repeat(1, minmax(0, 1fr))",
      "2": "repeat(2, minmax(0, 1fr))",
      "3": "repeat(3, minmax(0, 1fr))",
      "4": "repeat(4, minmax(0, 1fr))",
      "5": "repeat(5, minmax(0, 1fr))",
      "6": "repeat(6, minmax(0, 1fr))",
      "7": "repeat(7, minmax(0, 1fr))",
      "8": "repeat(8, minmax(0, 1fr))",
      "9": "repeat(9, minmax(0, 1fr))",
      "10": "repeat(10, minmax(0, 1fr))",
      "11": "repeat(11, minmax(0, 1fr))",
      "12": "repeat(12, minmax(0, 1fr))",
      "none": "none",
      "subgrid": "subgrid"
    },
    "gridTemplateRows": {
      "1": "repeat(1, minmax(0, 1fr))",
      "2": "repeat(2, minmax(0, 1fr))",
      "3": "repeat(3, minmax(0, 1fr))",
      "4": "repeat(4, minmax(0, 1fr))",
      "5": "repeat(5, minmax(0, 1fr))",
      "6": "repeat(6, minmax(0, 1fr))",
      "7": "repeat(7, minmax(0, 1fr))",
      "8": "repeat(8, minmax(0, 1fr))",
      "9": "repeat(9, minmax(0, 1fr))",
      "10": "repeat(10, minmax(0, 1fr))",
      "11": "repeat(11, minmax(0, 1fr))",
      "12": "repeat(12, minmax(0, 1fr))",
      "none": "none",
      "subgrid": "subgrid"
    },
    "height": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "auto": "auto",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem",
      "1/2": "50%",
      "1/3": "33.333333%",
      "2/3": "66.666667%",
      "1/4": "25%",
      "2/4": "50%",
      "3/4": "75%",
      "1/5": "20%",
      "2/5": "40%",
      "3/5": "60%",
      "4/5": "80%",
      "1/6": "16.666667%",
      "2/6": "33.333333%",
      "3/6": "50%",
      "4/6": "66.666667%",
      "5/6": "83.333333%",
      "full": "100%",
      "screen": "100vh",
      "svh": "100svh",
      "lvh": "100lvh",
      "dvh": "100dvh",
      "min": "min-content",
      "max": "max-content",
      "fit": "fit-content"
    },
    "hueRotate": {
      "0": "0deg",
      "15": "15deg",
      "30": "30deg",
      "60": "60deg",
      "90": "90deg",
      "180": "180deg"
    },
    "inset": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "auto": "auto",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem",
      "1/2": "50%",
      "1/3": "33.333333%",
      "2/3": "66.666667%",
      "1/4": "25%",
      "2/4": "50%",
      "3/4": "75%",
      "full": "100%"
    },
    "invert": {
      "0": "0",
      "DEFAULT": "100%"
    },
    "keyframes": {
      "spin": {
        "to": {
          "transform": "rotate(360deg)"
        }
      },
      "ping": {
        "75%, 100%": {
          "transform": "scale(2)",
          "opacity": "0"
        }
      },
      "pulse": {
        "50%": {
          "opacity": ".5"
        }
      },
      "bounce": {
        "0%, 100%": {
          "transform": "translateY(-25%)",
          "animationTimingFunction": "cubic-bezier(0.8,0,1,1)"
        },
        "50%": {
          "transform": "none",
          "animationTimingFunction": "cubic-bezier(0,0,0.2,1)"
        }
      }
    },
    "letterSpacing": {
      "tighter": "-0.05em",
      "tight": "-0.025em",
      "normal": "0em",
      "wide": "0.025em",
      "wider": "0.05em",
      "widest": "0.1em"
    },
    "lineHeight": {
      "3": ".75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "none": "1",
      "tight": "1.25",
      "snug": "1.375",
      "normal": "1.5",
      "relaxed": "1.625",
      "loose": "2"
    },
    "listStyleType": {
      "none": "none",
      "disc": "disc",
      "decimal": "decimal"
    },
    "listStyleImage": {
      "none": "none"
    },
    "margin": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "auto": "auto",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem"
    },
    "lineClamp": {
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6"
    },
    "maxHeight": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem",
      "none": "none",
      "full": "100%",
      "screen": "100vh",
      "svh": "100svh",
      "lvh": "100lvh",
      "dvh": "100dvh",
      "min": "min-content",
      "max": "max-content",
      "fit": "fit-content"
    },
    "maxWidth": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem",
      "none": "none",
      "xs": "20rem",
      "sm": "24rem",
      "md": "28rem",
      "lg": "32rem",
      "xl": "36rem",
      "2xl": "42rem",
      "3xl": "48rem",
      "4xl": "56rem",
      "5xl": "64rem",
      "6xl": "72rem",
      "7xl": "80rem",
      "full": "100%",
      "min": "min-content",
      "max": "max-content",
      "fit": "fit-content",
      "prose": "65ch",
      "screen-sm": "640px",
      "screen-md": "768px",
      "screen-lg": "1024px",
      "screen-xl": "1280px"
    },
    "minHeight": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem",
      "full": "100%",
      "screen": "100vh",
      "svh": "100svh",
      "lvh": "100lvh",
      "dvh": "100dvh",
      "min": "min-content",
      "max": "max-content",
      "fit": "fit-content"
    },
    "minWidth": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "50": "18rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem",
      "full": "100%",
      "min": "min-content",
      "max": "max-content",
      "fit": "fit-content"
    },
    "objectPosition": {
      "bottom": "bottom",
      "center": "center",
      "left": "left",
      "left-bottom": "left bottom",
      "left-top": "left top",
      "right": "right",
      "right-bottom": "right bottom",
      "right-top": "right top",
      "top": "top"
    },
    "opacity": {
      "0": "0",
      "5": "0.05",
      "10": "0.1",
      "15": "0.15",
      "20": "0.2",
      "25": "0.25",
      "30": "0.3",
      "35": "0.35",
      "40": "0.4",
      "45": "0.45",
      "50": "0.5",
      "55": "0.55",
      "60": "0.6",
      "65": "0.65",
      "70": "0.7",
      "75": "0.75",
      "80": "0.8",
      "85": "0.85",
      "90": "0.9",
      "95": "0.95",
      "100": "1"
    },
    "order": {
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      "10": "10",
      "11": "11",
      "12": "12",
      "first": "-9999",
      "last": "9999",
      "none": "0"
    },
    "outlineColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      }
    },
    "outlineOffset": {
      "0": "0px",
      "1": "1px",
      "2": "2px",
      "4": "4px",
      "8": "8px"
    },
    "outlineWidth": {
      "0": "0px",
      "1": "1px",
      "2": "2px",
      "4": "4px",
      "8": "8px"
    },
    "padding": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem"
    },
    "placeholderColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      }
    },
    "placeholderOpacity": {
      "0": "0",
      "5": "0.05",
      "10": "0.1",
      "15": "0.15",
      "20": "0.2",
      "25": "0.25",
      "30": "0.3",
      "35": "0.35",
      "40": "0.4",
      "45": "0.45",
      "50": "0.5",
      "55": "0.55",
      "60": "0.6",
      "65": "0.65",
      "70": "0.7",
      "75": "0.75",
      "80": "0.8",
      "85": "0.85",
      "90": "0.9",
      "95": "0.95",
      "100": "1"
    },
    "ringColor": {
      "DEFAULT": "rgb(2 137 247)",
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      }
    },
    "ringOffsetColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      }
    },
    "ringOffsetWidth": {
      "0": "0px",
      "1": "1px",
      "2": "2px",
      "4": "4px",
      "8": "8px"
    },
    "ringOpacity": {
      "0": "0",
      "5": "0.05",
      "10": "0.1",
      "15": "0.15",
      "20": "0.2",
      "25": "0.25",
      "30": "0.3",
      "35": "0.35",
      "40": "0.4",
      "45": "0.45",
      "50": "0.5",
      "55": "0.55",
      "60": "0.6",
      "65": "0.65",
      "70": "0.7",
      "75": "0.75",
      "80": "0.8",
      "85": "0.85",
      "90": "0.9",
      "95": "0.95",
      "100": "1",
      "DEFAULT": "0.5"
    },
    "ringWidth": {
      "0": "0px",
      "1": "1px",
      "2": "2px",
      "4": "4px",
      "8": "8px",
      "DEFAULT": "3px"
    },
    "rotate": {
      "0": "0deg",
      "1": "1deg",
      "2": "2deg",
      "3": "3deg",
      "6": "6deg",
      "12": "12deg",
      "45": "45deg",
      "90": "90deg",
      "180": "180deg"
    },
    "saturate": {
      "0": "0",
      "50": ".5",
      "100": "1",
      "150": "1.5",
      "200": "2"
    },
    "scale": {
      "0": "0",
      "50": ".5",
      "75": ".75",
      "90": ".9",
      "95": ".95",
      "100": "1",
      "105": "1.05",
      "110": "1.1",
      "125": "1.25",
      "150": "1.5"
    },
    "scrollMargin": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem"
    },
    "scrollPadding": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem"
    },
    "sepia": {
      "0": "0",
      "DEFAULT": "100%"
    },
    "skew": {
      "0": "0deg",
      "1": "1deg",
      "2": "2deg",
      "3": "3deg",
      "6": "6deg",
      "12": "12deg"
    },
    "space": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem"
    },
    "spacing": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem"
    },
    "stroke": {
      "none": "none",
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      },
      "ink": {}
    },
    "strokeWidth": {
      "0": "0",
      "1": "1",
      "2": "2"
    },
    "supports": {},
    "data": {},
    "textColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      },
      "ink": {}
    },
    "textDecorationColor": {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "gray": {},
      "blue": {},
      "green": {},
      "red": {},
      "orange": {},
      "yellow": {},
      "teal": {},
      "violet": {},
      "cyan": {},
      "amber": {},
      "pink": {},
      "purple": {},
      "white-overlay": {
        "50": "rgb(255 255 255 / 0.1)",
        "100": "rgb(255 255 255 / 0.18)",
        "200": "rgb(255 255 255 / 0.27)",
        "300": "rgb(255 255 255 / 0.36)",
        "400": "rgb(255 255 255 / 0.45)",
        "500": "rgb(255 255 255 / 0.54)",
        "600": "rgb(255 255 255 / 0.63)",
        "700": "rgb(255 255 255 / 0.72)",
        "800": "rgb(255 255 255 / 0.81)",
        "900": "rgb(255 255 255 / 0.90)"
      },
      "black-overlay": {
        "50": "rgb(0 0 0 / 0.09)",
        "100": "rgb(0 0 0 / 0.18)",
        "200": "rgb(0 0 0 / 0.27)",
        "300": "rgb(0 0 0 / 0.36)",
        "400": "rgb(0 0 0 / 0.45)",
        "500": "rgb(0 0 0 / 0.54)",
        "600": "rgb(0 0 0 / 0.63)",
        "700": "rgb(0 0 0 / 0.72)",
        "800": "rgb(0 0 0 / 0.81)",
        "900": "rgb(0 0 0 / 0.90)"
      }
    },
    "textDecorationThickness": {
      "0": "0px",
      "1": "1px",
      "2": "2px",
      "4": "4px",
      "8": "8px",
      "auto": "auto",
      "from-font": "from-font"
    },
    "textIndent": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem"
    },
    "textOpacity": {
      "0": "0",
      "5": "0.05",
      "10": "0.1",
      "15": "0.15",
      "20": "0.2",
      "25": "0.25",
      "30": "0.3",
      "35": "0.35",
      "40": "0.4",
      "45": "0.45",
      "50": "0.5",
      "55": "0.55",
      "60": "0.6",
      "65": "0.65",
      "70": "0.7",
      "75": "0.75",
      "80": "0.8",
      "85": "0.85",
      "90": "0.9",
      "95": "0.95",
      "100": "1"
    },
    "textUnderlineOffset": {
      "0": "0px",
      "1": "1px",
      "2": "2px",
      "4": "4px",
      "8": "8px",
      "auto": "auto"
    },
    "transformOrigin": {
      "center": "center",
      "top": "top",
      "top-right": "top right",
      "right": "right",
      "bottom-right": "bottom right",
      "bottom": "bottom",
      "bottom-left": "bottom left",
      "left": "left",
      "top-left": "top left"
    },
    "transitionDelay": {
      "0": "0s",
      "75": "75ms",
      "100": "100ms",
      "150": "150ms",
      "200": "200ms",
      "300": "300ms",
      "500": "500ms",
      "700": "700ms",
      "1000": "1000ms"
    },
    "transitionDuration": {
      "0": "0s",
      "75": "75ms",
      "100": "100ms",
      "150": "150ms",
      "200": "200ms",
      "300": "300ms",
      "500": "500ms",
      "700": "700ms",
      "1000": "1000ms",
      "DEFAULT": "150ms"
    },
    "transitionProperty": {
      "none": "none",
      "all": "all",
      "DEFAULT": "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
      "colors": "color, background-color, border-color, text-decoration-color, fill, stroke",
      "opacity": "opacity",
      "shadow": "box-shadow",
      "transform": "transform"
    },
    "transitionTimingFunction": {
      "DEFAULT": "cubic-bezier(0.4, 0, 0.2, 1)",
      "linear": "linear",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)",
      "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    "translate": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem",
      "1/2": "50%",
      "1/3": "33.333333%",
      "2/3": "66.666667%",
      "1/4": "25%",
      "2/4": "50%",
      "3/4": "75%",
      "full": "100%"
    },
    "size": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "auto": "auto",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem",
      "1/2": "50%",
      "1/3": "33.333333%",
      "2/3": "66.666667%",
      "1/4": "25%",
      "2/4": "50%",
      "3/4": "75%",
      "1/5": "20%",
      "2/5": "40%",
      "3/5": "60%",
      "4/5": "80%",
      "1/6": "16.666667%",
      "2/6": "33.333333%",
      "3/6": "50%",
      "4/6": "66.666667%",
      "5/6": "83.333333%",
      "1/12": "8.333333%",
      "2/12": "16.666667%",
      "3/12": "25%",
      "4/12": "33.333333%",
      "5/12": "41.666667%",
      "6/12": "50%",
      "7/12": "58.333333%",
      "8/12": "66.666667%",
      "9/12": "75%",
      "10/12": "83.333333%",
      "11/12": "91.666667%",
      "full": "100%",
      "min": "min-content",
      "max": "max-content",
      "fit": "fit-content"
    },
    "width": {
      "0": "0px",
      "1": "0.25rem",
      "2": "0.5rem",
      "3": "0.75rem",
      "4": "1rem",
      "5": "1.25rem",
      "6": "1.5rem",
      "7": "1.75rem",
      "8": "2rem",
      "9": "2.25rem",
      "10": "2.5rem",
      "11": "2.75rem",
      "12": "3rem",
      "13": "3.25rem",
      "14": "3.5rem",
      "15": "3.75rem",
      "16": "4rem",
      "20": "5rem",
      "24": "6rem",
      "28": "7rem",
      "32": "8rem",
      "36": "9rem",
      "40": "10rem",
      "44": "11rem",
      "48": "12rem",
      "52": "13rem",
      "56": "14rem",
      "60": "15rem",
      "64": "16rem",
      "72": "18rem",
      "80": "20rem",
      "96": "24rem",
      "112": "28rem",
      "auto": "auto",
      "px": "1px",
      "0.5": "0.125rem",
      "1.5": "0.375rem",
      "2.5": "0.625rem",
      "3.5": "0.875rem",
      "4.5": "1.125rem",
      "5.5": "1.375rem",
      "6.5": "1.625rem",
      "7.5": "1.875rem",
      "8.5": "2.125rem",
      "9.5": "2.375rem",
      "10.5": "2.625rem",
      "11.5": "2.875rem",
      "12.5": "3.125rem",
      "13.5": "3.375rem",
      "14.5": "3.625rem",
      "15.5": "3.875rem",
      "1/2": "50%",
      "1/3": "33.333333%",
      "2/3": "66.666667%",
      "1/4": "25%",
      "2/4": "50%",
      "3/4": "75%",
      "1/5": "20%",
      "2/5": "40%",
      "3/5": "60%",
      "4/5": "80%",
      "1/6": "16.666667%",
      "2/6": "33.333333%",
      "3/6": "50%",
      "4/6": "66.666667%",
      "5/6": "83.333333%",
      "1/12": "8.333333%",
      "2/12": "16.666667%",
      "3/12": "25%",
      "4/12": "33.333333%",
      "5/12": "41.666667%",
      "6/12": "50%",
      "7/12": "58.333333%",
      "8/12": "66.666667%",
      "9/12": "75%",
      "10/12": "83.333333%",
      "11/12": "91.666667%",
      "full": "100%",
      "screen": "100vw",
      "svw": "100svw",
      "lvw": "100lvw",
      "dvw": "100dvw",
      "min": "min-content",
      "max": "max-content",
      "fit": "fit-content",
      "wizard": "650px"
    },
    "willChange": {
      "auto": "auto",
      "scroll": "scroll-position",
      "contents": "contents",
      "transform": "transform"
    },
    "zIndex": {
      "0": "0",
      "10": "10",
      "20": "20",
      "30": "30",
      "40": "40",
      "50": "50",
      "auto": "auto"
    }
  },
  "corePlugins": [
    "preflight",
    "container",
    "accessibility",
    "pointerEvents",
    "visibility",
    "position",
    "inset",
    "isolation",
    "zIndex",
    "order",
    "gridColumn",
    "gridColumnStart",
    "gridColumnEnd",
    "gridRow",
    "gridRowStart",
    "gridRowEnd",
    "float",
    "clear",
    "margin",
    "boxSizing",
    "lineClamp",
    "display",
    "aspectRatio",
    "size",
    "height",
    "maxHeight",
    "minHeight",
    "width",
    "minWidth",
    "maxWidth",
    "flex",
    "flexShrink",
    "flexGrow",
    "flexBasis",
    "tableLayout",
    "captionSide",
    "borderCollapse",
    "borderSpacing",
    "transformOrigin",
    "translate",
    "rotate",
    "skew",
    "scale",
    "transform",
    "animation",
    "cursor",
    "touchAction",
    "userSelect",
    "resize",
    "scrollSnapType",
    "scrollSnapAlign",
    "scrollSnapStop",
    "scrollMargin",
    "scrollPadding",
    "listStylePosition",
    "listStyleType",
    "listStyleImage",
    "appearance",
    "columns",
    "breakBefore",
    "breakInside",
    "breakAfter",
    "gridAutoColumns",
    "gridAutoFlow",
    "gridAutoRows",
    "gridTemplateColumns",
    "gridTemplateRows",
    "flexDirection",
    "flexWrap",
    "placeContent",
    "placeItems",
    "alignContent",
    "alignItems",
    "justifyContent",
    "justifyItems",
    "gap",
    "space",
    "divideWidth",
    "divideStyle",
    "divideColor",
    "divideOpacity",
    "placeSelf",
    "alignSelf",
    "justifySelf",
    "overflow",
    "overscrollBehavior",
    "scrollBehavior",
    "textOverflow",
    "hyphens",
    "whitespace",
    "textWrap",
    "wordBreak",
    "borderRadius",
    "borderWidth",
    "borderStyle",
    "borderColor",
    "borderOpacity",
    "backgroundColor",
    "backgroundOpacity",
    "backgroundImage",
    "gradientColorStops",
    "boxDecorationBreak",
    "backgroundSize",
    "backgroundAttachment",
    "backgroundClip",
    "backgroundPosition",
    "backgroundRepeat",
    "backgroundOrigin",
    "fill",
    "stroke",
    "strokeWidth",
    "objectFit",
    "objectPosition",
    "padding",
    "textAlign",
    "textIndent",
    "verticalAlign",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "textTransform",
    "fontStyle",
    "fontVariantNumeric",
    "lineHeight",
    "letterSpacing",
    "textColor",
    "textOpacity",
    "textDecoration",
    "textDecorationColor",
    "textDecorationStyle",
    "textDecorationThickness",
    "textUnderlineOffset",
    "fontSmoothing",
    "placeholderColor",
    "placeholderOpacity",
    "caretColor",
    "accentColor",
    "opacity",
    "backgroundBlendMode",
    "mixBlendMode",
    "boxShadow",
    "boxShadowColor",
    "outlineStyle",
    "outlineWidth",
    "outlineOffset",
    "outlineColor",
    "ringWidth",
    "ringColor",
    "ringOpacity",
    "ringOffsetWidth",
    "ringOffsetColor",
    "blur",
    "brightness",
    "contrast",
    "dropShadow",
    "grayscale",
    "hueRotate",
    "invert",
    "saturate",
    "sepia",
    "filter",
    "backdropBlur",
    "backdropBrightness",
    "backdropContrast",
    "backdropGrayscale",
    "backdropHueRotate",
    "backdropInvert",
    "backdropOpacity",
    "backdropSaturate",
    "backdropSepia",
    "backdropFilter",
    "transitionProperty",
    "transitionDelay",
    "transitionDuration",
    "transitionTimingFunction",
    "willChange",
    "contain",
    "content",
    "forcedColorAdjust"
  ],
  "plugins": [
    null,
    null,
    {
      "config": {
        "theme": {
          "borderRadius": {
            "none": "0px",
            "sm": "0.25rem",
            "DEFAULT": "0.5rem",
            "md": "0.625rem",
            "lg": "0.75rem",
            "xl": "1rem",
            "2xl": "1.25rem",
            "full": "9999px"
          },
          "boxShadow": {
            "sm": "0px 1px 2px rgba(0, 0, 0, 0.1)",
            "DEFAULT": "0px 0px 1px rgba(0, 0, 0, 0.45), 0px 1px 2px rgba(0, 0, 0, 0.1)",
            "md": "0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0.5px 2px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.16)",
            "lg": "0px 0px 1px rgba(0, 0, 0, 0.35), 0px 6px 8px -4px rgba(0, 0, 0, 0.1)",
            "xl": "0px 0px 1px rgba(0, 0, 0, 0.19), 0px 1px 2px rgba(0, 0, 0, 0.07), 0px 6px 15px -5px rgba(0, 0, 0, 0.11)",
            "2xl": "0px 0px 1px rgba(0, 0, 0, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 24px -3px rgba(0, 0, 0, 0.1)",
            "none": "none"
          },
          "container": {
            "padding": {
              "xl": "5rem"
            }
          },
          "fontSize": {
            "2xs": [
              "11px",
              {
                "lineHeight": "1.15",
                "letterSpacing": "0.01em",
                "fontWeight": "420"
              }
            ],
            "xs": [
              "12px",
              {
                "lineHeight": "1.15",
                "letterSpacing": "0.02em",
                "fontWeight": "420"
              }
            ],
            "sm": [
              "13px",
              {
                "lineHeight": "1.15",
                "letterSpacing": "0.02em",
                "fontWeight": "420"
              }
            ],
            "base": [
              "14px",
              {
                "lineHeight": "1.15",
                "letterSpacing": "0.02em",
                "fontWeight": "420"
              }
            ],
            "lg": [
              "16px",
              {
                "lineHeight": "1.15",
                "letterSpacing": "0.02em",
                "fontWeight": "400"
              }
            ],
            "xl": [
              "18px",
              {
                "lineHeight": "1.15",
                "letterSpacing": "0.01em",
                "fontWeight": "400"
              }
            ],
            "2xl": [
              "20px",
              {
                "lineHeight": "1.15",
                "letterSpacing": "0.01em",
                "fontWeight": "400"
              }
            ],
            "3xl": [
              "24px",
              {
                "lineHeight": "1.15",
                "fontWeight": 400,
                "letterSpacing": "0.005em"
              }
            ],
            "p-2xs": [
              "11px",
              {
                "lineHeight": "1.6",
                "letterSpacing": "0.01em",
                "fontWeight": "420"
              }
            ],
            "p-xs": [
              "12px",
              {
                "lineHeight": "1.6",
                "letterSpacing": "0.02em",
                "fontWeight": "420"
              }
            ],
            "p-sm": [
              "13px",
              {
                "lineHeight": "1.5",
                "letterSpacing": "0.02em",
                "fontWeight": "420"
              }
            ],
            "p-base": [
              "14px",
              {
                "lineHeight": "1.5",
                "letterSpacing": "0.02em",
                "fontWeight": "420"
              }
            ],
            "p-lg": [
              "16px",
              {
                "lineHeight": "1.5",
                "letterSpacing": "0.02em",
                "fontWeight": "400"
              }
            ],
            "p-xl": [
              "18px",
              {
                "lineHeight": "1.42",
                "letterSpacing": "0.01em",
                "fontWeight": "400"
              }
            ],
            "p-2xl": [
              "20px",
              {
                "lineHeight": "1.38",
                "letterSpacing": "0.01em",
                "fontWeight": "400"
              }
            ],
            "p-3xl": [
              "24px",
              {
                "lineHeight": "1.2",
                "fontWeight": 400,
                "letterSpacing": "0.005em"
              }
            ]
          },
          "screens": {
            "sm": "640px",
            "md": "768px",
            "lg": "1024px",
            "xl": "1280px"
          },
          "extend": {
            "textColor": {
              "ink": {}
            },
            "backgroundColor": {
              "surface": {}
            },
            "fill": {
              "ink": {}
            },
            "stroke": {
              "ink": {}
            },
            "spacing": {
              "13": "3.25rem",
              "15": "3.75rem",
              "4.5": "1.125rem",
              "5.5": "1.375rem",
              "6.5": "1.625rem",
              "7.5": "1.875rem",
              "8.5": "2.125rem",
              "9.5": "2.375rem",
              "10.5": "2.625rem",
              "11.5": "2.875rem",
              "12.5": "3.125rem",
              "13.5": "3.375rem",
              "14.5": "3.625rem",
              "15.5": "3.875rem"
            },
            "width": {
              "112": "28rem",
              "3.5": "0.875rem",
              "wizard": "650px"
            },
            "height": {
              "3.5": "0.875rem"
            },
            "minWidth": {
              "40": "10rem",
              "50": "18rem"
            },
            "maxHeight": {
              "52": "13rem"
            }
          }
        }
      }
    }
  ],
  "presets": [
    {
      "darkMode": [
        "selector",
        "[data-theme=\\"dark\\"]"
      ],
      "plugins": [
        null,
        null,
        {
          "config": {
            "theme": {
              "borderRadius": {
                "none": "0px",
                "sm": "0.25rem",
                "DEFAULT": "0.5rem",
                "md": "0.625rem",
                "lg": "0.75rem",
                "xl": "1rem",
                "2xl": "1.25rem",
                "full": "9999px"
              },
              "boxShadow": {
                "sm": "0px 1px 2px rgba(0, 0, 0, 0.1)",
                "DEFAULT": "0px 0px 1px rgba(0, 0, 0, 0.45), 0px 1px 2px rgba(0, 0, 0, 0.1)",
                "md": "0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0.5px 2px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.16)",
                "lg": "0px 0px 1px rgba(0, 0, 0, 0.35), 0px 6px 8px -4px rgba(0, 0, 0, 0.1)",
                "xl": "0px 0px 1px rgba(0, 0, 0, 0.19), 0px 1px 2px rgba(0, 0, 0, 0.07), 0px 6px 15px -5px rgba(0, 0, 0, 0.11)",
                "2xl": "0px 0px 1px rgba(0, 0, 0, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 24px -3px rgba(0, 0, 0, 0.1)",
                "none": "none"
              },
              "container": {
                "padding": {
                  "xl": "5rem"
                }
              },
              "fontSize": {
                "2xs": [
                  "11px",
                  {
                    "lineHeight": "1.15",
                    "letterSpacing": "0.01em",
                    "fontWeight": "420"
                  }
                ],
                "xs": [
                  "12px",
                  {
                    "lineHeight": "1.15",
                    "letterSpacing": "0.02em",
                    "fontWeight": "420"
                  }
                ],
                "sm": [
                  "13px",
                  {
                    "lineHeight": "1.15",
                    "letterSpacing": "0.02em",
                    "fontWeight": "420"
                  }
                ],
                "base": [
                  "14px",
                  {
                    "lineHeight": "1.15",
                    "letterSpacing": "0.02em",
                    "fontWeight": "420"
                  }
                ],
                "lg": [
                  "16px",
                  {
                    "lineHeight": "1.15",
                    "letterSpacing": "0.02em",
                    "fontWeight": "400"
                  }
                ],
                "xl": [
                  "18px",
                  {
                    "lineHeight": "1.15",
                    "letterSpacing": "0.01em",
                    "fontWeight": "400"
                  }
                ],
                "2xl": [
                  "20px",
                  {
                    "lineHeight": "1.15",
                    "letterSpacing": "0.01em",
                    "fontWeight": "400"
                  }
                ],
                "3xl": [
                  "24px",
                  {
                    "lineHeight": "1.15",
                    "fontWeight": 400,
                    "letterSpacing": "0.005em"
                  }
                ],
                "p-2xs": [
                  "11px",
                  {
                    "lineHeight": "1.6",
                    "letterSpacing": "0.01em",
                    "fontWeight": "420"
                  }
                ],
                "p-xs": [
                  "12px",
                  {
                    "lineHeight": "1.6",
                    "letterSpacing": "0.02em",
                    "fontWeight": "420"
                  }
                ],
                "p-sm": [
                  "13px",
                  {
                    "lineHeight": "1.5",
                    "letterSpacing": "0.02em",
                    "fontWeight": "420"
                  }
                ],
                "p-base": [
                  "14px",
                  {
                    "lineHeight": "1.5",
                    "letterSpacing": "0.02em",
                    "fontWeight": "420"
                  }
                ],
                "p-lg": [
                  "16px",
                  {
                    "lineHeight": "1.5",
                    "letterSpacing": "0.02em",
                    "fontWeight": "400"
                  }
                ],
                "p-xl": [
                  "18px",
                  {
                    "lineHeight": "1.42",
                    "letterSpacing": "0.01em",
                    "fontWeight": "400"
                  }
                ],
                "p-2xl": [
                  "20px",
                  {
                    "lineHeight": "1.38",
                    "letterSpacing": "0.01em",
                    "fontWeight": "400"
                  }
                ],
                "p-3xl": [
                  "24px",
                  {
                    "lineHeight": "1.2",
                    "fontWeight": 400,
                    "letterSpacing": "0.005em"
                  }
                ]
              },
              "screens": {
                "sm": "640px",
                "md": "768px",
                "lg": "1024px",
                "xl": "1280px"
              },
              "extend": {
                "textColor": {
                  "ink": {}
                },
                "backgroundColor": {
                  "surface": {}
                },
                "fill": {
                  "ink": {}
                },
                "stroke": {
                  "ink": {}
                },
                "spacing": {
                  "13": "3.25rem",
                  "15": "3.75rem",
                  "4.5": "1.125rem",
                  "5.5": "1.375rem",
                  "6.5": "1.625rem",
                  "7.5": "1.875rem",
                  "8.5": "2.125rem",
                  "9.5": "2.375rem",
                  "10.5": "2.625rem",
                  "11.5": "2.875rem",
                  "12.5": "3.125rem",
                  "13.5": "3.375rem",
                  "14.5": "3.625rem",
                  "15.5": "3.875rem"
                },
                "width": {
                  "112": "28rem",
                  "3.5": "0.875rem",
                  "wizard": "650px"
                },
                "height": {
                  "3.5": "0.875rem"
                },
                "minWidth": {
                  "40": "10rem",
                  "50": "18rem"
                },
                "maxHeight": {
                  "52": "13rem"
                }
              }
            }
          }
        }
      ]
    }
  ],
  "content": {
    "relative": false,
    "files": [
      "./index.html",
      "./App.vue",
      "./src/**/*.{vue,js,ts,jsx,tsx}"
    ],
    "extract": {},
    "transform": {}
  },
  "default": {
    "presets": [
      {
        "darkMode": [
          "selector",
          "[data-theme=\\"dark\\"]"
        ],
        "plugins": [
          null,
          null,
          {
            "config": {
              "theme": {
                "borderRadius": {
                  "none": "0px",
                  "sm": "0.25rem",
                  "DEFAULT": "0.5rem",
                  "md": "0.625rem",
                  "lg": "0.75rem",
                  "xl": "1rem",
                  "2xl": "1.25rem",
                  "full": "9999px"
                },
                "boxShadow": {
                  "sm": "0px 1px 2px rgba(0, 0, 0, 0.1)",
                  "DEFAULT": "0px 0px 1px rgba(0, 0, 0, 0.45), 0px 1px 2px rgba(0, 0, 0, 0.1)",
                  "md": "0px 0px 1px rgba(0, 0, 0, 0.12), 0px 0.5px 2px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.16)",
                  "lg": "0px 0px 1px rgba(0, 0, 0, 0.35), 0px 6px 8px -4px rgba(0, 0, 0, 0.1)",
                  "xl": "0px 0px 1px rgba(0, 0, 0, 0.19), 0px 1px 2px rgba(0, 0, 0, 0.07), 0px 6px 15px -5px rgba(0, 0, 0, 0.11)",
                  "2xl": "0px 0px 1px rgba(0, 0, 0, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 24px -3px rgba(0, 0, 0, 0.1)",
                  "none": "none"
                },
                "container": {
                  "padding": {
                    "xl": "5rem"
                  }
                },
                "fontSize": {
                  "2xs": [
                    "11px",
                    {
                      "lineHeight": "1.15",
                      "letterSpacing": "0.01em",
                      "fontWeight": "420"
                    }
                  ],
                  "xs": [
                    "12px",
                    {
                      "lineHeight": "1.15",
                      "letterSpacing": "0.02em",
                      "fontWeight": "420"
                    }
                  ],
                  "sm": [
                    "13px",
                    {
                      "lineHeight": "1.15",
                      "letterSpacing": "0.02em",
                      "fontWeight": "420"
                    }
                  ],
                  "base": [
                    "14px",
                    {
                      "lineHeight": "1.15",
                      "letterSpacing": "0.02em",
                      "fontWeight": "420"
                    }
                  ],
                  "lg": [
                    "16px",
                    {
                      "lineHeight": "1.15",
                      "letterSpacing": "0.02em",
                      "fontWeight": "400"
                    }
                  ],
                  "xl": [
                    "18px",
                    {
                      "lineHeight": "1.15",
                      "letterSpacing": "0.01em",
                      "fontWeight": "400"
                    }
                  ],
                  "2xl": [
                    "20px",
                    {
                      "lineHeight": "1.15",
                      "letterSpacing": "0.01em",
                      "fontWeight": "400"
                    }
                  ],
                  "3xl": [
                    "24px",
                    {
                      "lineHeight": "1.15",
                      "fontWeight": 400,
                      "letterSpacing": "0.005em"
                    }
                  ],
                  "p-2xs": [
                    "11px",
                    {
                      "lineHeight": "1.6",
                      "letterSpacing": "0.01em",
                      "fontWeight": "420"
                    }
                  ],
                  "p-xs": [
                    "12px",
                    {
                      "lineHeight": "1.6",
                      "letterSpacing": "0.02em",
                      "fontWeight": "420"
                    }
                  ],
                  "p-sm": [
                    "13px",
                    {
                      "lineHeight": "1.5",
                      "letterSpacing": "0.02em",
                      "fontWeight": "420"
                    }
                  ],
                  "p-base": [
                    "14px",
                    {
                      "lineHeight": "1.5",
                      "letterSpacing": "0.02em",
                      "fontWeight": "420"
                    }
                  ],
                  "p-lg": [
                    "16px",
                    {
                      "lineHeight": "1.5",
                      "letterSpacing": "0.02em",
                      "fontWeight": "400"
                    }
                  ],
                  "p-xl": [
                    "18px",
                    {
                      "lineHeight": "1.42",
                      "letterSpacing": "0.01em",
                      "fontWeight": "400"
                    }
                  ],
                  "p-2xl": [
                    "20px",
                    {
                      "lineHeight": "1.38",
                      "letterSpacing": "0.01em",
                      "fontWeight": "400"
                    }
                  ],
                  "p-3xl": [
                    "24px",
                    {
                      "lineHeight": "1.2",
                      "fontWeight": 400,
                      "letterSpacing": "0.005em"
                    }
                  ]
                },
                "screens": {
                  "sm": "640px",
                  "md": "768px",
                  "lg": "1024px",
                  "xl": "1280px"
                },
                "extend": {
                  "textColor": {
                    "ink": {}
                  },
                  "backgroundColor": {
                    "surface": {}
                  },
                  "fill": {
                    "ink": {}
                  },
                  "stroke": {
                    "ink": {}
                  },
                  "spacing": {
                    "13": "3.25rem",
                    "15": "3.75rem",
                    "4.5": "1.125rem",
                    "5.5": "1.375rem",
                    "6.5": "1.625rem",
                    "7.5": "1.875rem",
                    "8.5": "2.125rem",
                    "9.5": "2.375rem",
                    "10.5": "2.625rem",
                    "11.5": "2.875rem",
                    "12.5": "3.125rem",
                    "13.5": "3.375rem",
                    "14.5": "3.625rem",
                    "15.5": "3.875rem"
                  },
                  "width": {
                    "112": "28rem",
                    "3.5": "0.875rem",
                    "wizard": "650px"
                  },
                  "height": {
                    "3.5": "0.875rem"
                  },
                  "minWidth": {
                    "40": "10rem",
                    "50": "18rem"
                  },
                  "maxHeight": {
                    "52": "13rem"
                  }
                }
              }
            }
          }
        ]
      }
    ],
    "content": [
      "./index.html",
      "./App.vue",
      "./src/**/*.{vue,js,ts,jsx,tsx}"
    ],
    "theme": {
      "extend": {}
    },
    "plugins": []
  },
  "darkMode": [
    "selector",
    "[data-theme=\\"dark\\"]"
  ],
  "prefix": "",
  "important": false,
  "separator": ":",
  "safelist": [],
  "blocklist": []
})
const search = ref('')
const sampleText = ref('Cat sit like bread eat prawns daintily with a claw then lick paws clean wash down prawns with a lap of carnation milk then retire to the warmest spot on the couch to claw at the fabric before taking a catnap mrow cat cat moo moo lick ears lick paws')
const fontSize = ref(16)

function mountApp ({ el, state, onUnmount }, render) {
  Object.assign(state, {
    search,
    sampleText,
    fontSize,
  })

  const app = createApp({
    render,
  })
  app.mount(el)

  onUnmount(() => {
    app.unmount()
  })
}

export default {
  id: 'tailwind',
  title: 'Tailwind',
  group: 'design-system',
  icon: 'mdi:tailwind',
  responsiveDisabled: true,
  layout: { type: 'single', iframe: false },
  variants: [
    {
      id: 'background-color',
      title: 'Background Color',
      icon: 'carbon:color-palette',
      onMount: (api) => mountApp(api, () => Object.entries(config.theme.backgroundColor).map(([key, shades]) => h(HstColorShades, {
        key,
        shades: typeof shades === 'object' ? shades : { DEFAULT: shades },
        getName: shade => (config.prefix ?? '') + (shade === 'DEFAULT' ? \`bg-\${key}\` : \`bg-\${key}-\${shade}\`),
        search: search.value,
      }, ({ color}) => h('div', {
        class: '__hst-shade',
        style: {
          backgroundColor: color.replace('<alpha-value>', 1),
        },
      })))),
      onMountControls: (api) => mountApp(api, () => [
        h(HstText, {
          title: 'Filter...',
          modelValue: search.value,
          'onUpdate:modelValue': value => { search.value = value },
        }),
      ]),
    },
    {
      id: 'text-color',
      title: 'Text Color',
      icon: 'carbon:text-color',
      onMount: (api) => mountApp(api, () => Object.entries(config.theme.textColor).map(([key, shades]) => h(HstColorShades, {
        key,
        shades: typeof shades === 'object' ? shades : { DEFAULT: shades },
        getName: shade => (config.prefix ?? '') + (shade === 'DEFAULT' ? \`text-\${key}\` : \`text-\${key}-\${shade}\`),
        search: search.value,
      }, ({ color}) => h('div', {
        class: '__hst-shade __hst-text',
        style: {
          color: color.replace('<alpha-value>', 1),
        },
      }, 'Aa')))),
      onMountControls: (api) => mountApp(api, () => [
        h(HstText, {
          title: 'Filter...',
          modelValue: search.value,
          'onUpdate:modelValue': value => { search.value = value },
        }),
      ]),
    },
    {
      id: 'border-color',
      title: 'Border Color',
      icon: 'carbon:color-palette',
      onMount: (api) => mountApp(api, () => Object.entries(config.theme.borderColor).map(([key, shades]) => h(HstColorShades, {
        key,
        shades: typeof shades === 'object' ? shades : { DEFAULT: shades },
        getName: shade => (config.prefix ?? '') + (shade === 'DEFAULT' ? \`border-\${key}\` : \`border-\${key}-\${shade}\`),
        search: search.value,
      }, ({ color}) => h('div', {
        class: '__hst-shade __hst-border',
        style: {
          borderColor: color.replace('<alpha-value>', 1),
        },
      })))),
      onMountControls: (api) => mountApp(api, () => [
        h(HstText, {
          title: 'Filter...',
          modelValue: search.value,
          'onUpdate:modelValue': value => { search.value = value },
        }),
      ]),
    },
    {
      id: 'padding',
      title: 'Padding',
      icon: 'carbon:area',
      onMount: (api) => mountApp(api, () => h(HstTokenList, {
        tokens: config.theme.padding,
        getName: key => \`\${config.prefix ?? ''}p-\${key}\`,
      }, ({ token }) => h('div', {
        class: '__hst-padding',
        style: {
          padding: token.value,
        },
      }, [
        h('div', {
          class: '__hst-padding-box',
        }),
      ]))),
    },
    {
      id: 'margin',
      title: 'Margin',
      icon: 'carbon:area',
      onMount: (api) => mountApp(api, () => h(HstTokenList, {
        tokens: config.theme.margin,
        getName: key => \`\${config.prefix ?? ''}m-\${key}\`,
      }, ({ token }) => h('div', {
        class: '__hst-margin',
      }, [
        h('div', {
          class: '__hst-margin-box',
          style: {
            margin: token.value,
          },
        }),
      ]))),
    },
    {
      id: 'font-size',
      title: 'Font Size',
      icon: 'carbon:text-font',
      onMount: (api) => mountApp(api, () => h(HstTokenList, {
        tokens: config.theme.fontSize,
        getName: key => \`\${config.prefix ?? ''}text-\${key}\`,
      }, ({ token }) => h('div', {
        class: '__hst-truncate',
        style: {
          fontSize: Array.isArray(token.value) ? token.value[0] : token.value,
          ...(Array.isArray(token.value) && typeof token.value[1] === "object" ? token.value[1] : { lineHeight: token.value[1] })
        },
      }, sampleText.value))),
      onMountControls: (api) => mountApp(api, () => [
        h(HstTextarea, {
          title: 'Sample text',
          modelValue: sampleText.value,
          'onUpdate:modelValue': value => { sampleText.value = value },
          rows: 5,
        }),
      ]),
    },
    {
      id: 'font-weight',
      title: 'Font Weight',
      icon: 'carbon:text-font',
      onMount: (api) => mountApp(api, () => h(HstTokenList, {
        tokens: config.theme.fontWeight,
        getName: key => \`\${config.prefix ?? ''}font-\${key}\`,
      }, ({ token }) => h('div', {
        class: '__hst-truncate',
        style: {
          fontWeight: token.value,
          fontSize: \`\${fontSize.value}px\`,
        },
      }, sampleText.value))),
      onMountControls: (api) => mountApp(api, () => [
        h(HstTextarea, {
          title: 'Sample text',
          modelValue: sampleText.value,
          'onUpdate:modelValue': value => { sampleText.value = value },
          rows: 5,
        }),
        h(HstNumber, {
          title: 'Font size',
          modelValue: fontSize.value,
          'onUpdate:modelValue': value => { fontSize.value = value },
          min: 1,
        }),
      ]),
    },
    {
      id: 'font-family',
      title: 'Font Family',
      icon: 'carbon:text-font',
      onMount: (api) => mountApp(api, () => h(HstTokenList, {
        tokens: config.theme.fontFamily,
        getName: key => \`\${config.prefix ?? ''}font-\${key}\`,
      }, ({ token }) => h('div', {
        class: '__hst-truncate',
        style: {
          fontFamily: token.value,
          fontSize: \`\${fontSize.value}px\`,
        },
      }, sampleText.value))),
      onMountControls: (api) => mountApp(api, () => [
        h(HstTextarea, {
          title: 'Sample text',
          modelValue: sampleText.value,
          'onUpdate:modelValue': value => { sampleText.value = value },
          rows: 5,
        }),
        h(HstNumber, {
          title: 'Font size',
          modelValue: fontSize.value,
          'onUpdate:modelValue': value => { fontSize.value = value },
          min: 1,
        }),
      ]),
    },
    {
      id: 'letter-spacing',
      title: 'Letter Spacing',
      icon: 'carbon:text-font',
      onMount: (api) => mountApp(api, () => h(HstTokenList, {
        tokens: config.theme.letterSpacing,
        getName: key => \`\${config.prefix ?? ''}tracking-\${key}\`,
      }, ({ token }) => h('div', {
        class: '__hst-truncate',
        style: {
          letterSpacing: token.value,
          fontSize: \`\${fontSize.value}px\`,
        },
      }, sampleText.value))),
      onMountControls: (api) => mountApp(api, () => [
        h(HstTextarea, {
          title: 'Sample text',
          modelValue: sampleText.value,
          'onUpdate:modelValue': value => { sampleText.value = value },
          rows: 5,
        }),
        h(HstNumber, {
          title: 'Font size',
          modelValue: fontSize.value,
          'onUpdate:modelValue': value => { fontSize.value = value },
          min: 1,
        }),
      ]),
    },
    {
      id: 'line-height',
      title: 'Line Height',
      icon: 'carbon:text-font',
      onMount: (api) => mountApp(api, () => h(HstTokenList, {
        tokens: config.theme.lineHeight,
        getName: key => \`\${config.prefix ?? ''}leading-\${key}\`,
      }, ({ token }) => h('div', {
        style: {
          lineHeight: token.value,
        },
      }, sampleText.value))),
      onMountControls: (api) => mountApp(api, () => [
        h(HstTextarea, {
          title: 'Sample text',
          modelValue: sampleText.value,
          'onUpdate:modelValue': value => { sampleText.value = value },
          rows: 5,
        }),
        // @TODO select font size
      ]),
    },
    {
      id: 'drop-shadow',
      title: 'Drop Shadow',
      icon: 'carbon:shape-except',
      onMount: (api) => mountApp(api, () => h(HstTokenGrid, {
        tokens: config.theme.dropShadow,
        getName: key => (config.prefix ?? '') + (key === 'DEFAULT' ? 'drop-shadow' : \`drop-shadow-\${key}\`),
        colSize: 180,
      }, ({ token }) => h('div', {
        class: '__hst-drop-shadow',
        style: {
          filter: \`\${(Array.isArray(token.value) ? token.value : [token.value]).map(v => \`drop-shadow(\${v})\`).join(' ')}\`,
        },
      }))),
    },
    {
      id: 'border-radius',
      title: 'Border Radius',
      icon: 'carbon:condition-wait-point',
      onMount: (api) => mountApp(api, () => h(HstTokenGrid, {
        tokens: config.theme.borderRadius,
        getName: key => (config.prefix ?? '') + (key === 'DEFAULT' ? 'rounded' : \`rounded-\${key}\`),
        colSize: 180,
      }, ({ token }) => h('div', {
        class: '__hst-border-radius',
        style: {
          borderRadius: token.value,
        },
      }))),
    },
    {
      id: 'border-width',
      title: 'Border Width',
      icon: 'carbon:checkbox',
      onMount: (api) => mountApp(api, () => h(HstTokenGrid, {
        tokens: config.theme.borderWidth,
        getName: key => (config.prefix ?? '') + (key === 'DEFAULT' ? 'border' : \`border-\${key}\`),
        colSize: 180,
      }, ({ token }) => h('div', {
        class: '__hst-border-width',
        style: {
          borderWidth: token.value,
        },
      }))),
    },
    {
      id: 'width',
      title: 'Width',
      icon: 'carbon:pan-horizontal',
      onMount: (api) => mountApp(api, () => h(HstTokenList, {
        tokens: config.theme.width,
        getName: key => (config.prefix ?? '') + (key === 'DEFAULT' ? 'w' : \`w-\${key}\`),
      }, ({ token }) => h('div', {
        class: '__hst-width',
      }, [
        h('div', {
          class: '__hst-width-box',
          style: {
            width: token.value,
          },
        }),
      ]))),
    },
    {
      id: 'height',
      title: 'Height',
      icon: 'carbon:pan-vertical',
      onMount: (api) => mountApp(api, () => h(HstTokenList, {
        tokens: config.theme.height,
        getName: key => (config.prefix ?? '') + (key === 'DEFAULT' ? 'h' : \`h-\${key}\`),
      }, ({ token }) => h('div', {
        class: '__hst-height',
        style: {
          height: token.value,
        },
      }))),
    },
    {
      id: 'full-config',
      title: 'Full Config',
      icon: 'carbon:code',
      onMount: (api) => mountApp(api, () => h('pre', JSON.stringify(config, null, 2))),
    },
  ],
}`;
export {
  __resolved__virtual_storySource_tailwind as default
};
