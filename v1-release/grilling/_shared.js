const STORAGE_PREFIX = 'frappe-ui-rc-grill:'

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('[data-grill-page]')
  if (!app) return

  const grill = new GrillPage(app, {
    area: AREA,
    title: TITLE,
    intro: INTRO,
    questions: QUESTIONS,
  })
  grill.render()
})

class GrillPage {
  constructor(root, page) {
    this.root = root
    this.page = page
    this.storageKey = (suffix) => `${STORAGE_PREFIX}${page.area}:${suffix}`
  }

  render() {
    this.storeManifest()
    this.root.innerHTML = `
      <header class="page-header">
        <div class="header-inner">
          <div>
            <a class="back-link" href="index.html">Back to all areas</a>
            <h1>${this.page.title}</h1>
            <p>${this.page.intro}</p>
          </div>
          <div class="header-actions">
            <span class="answer-count" data-answer-count></span>
            <button class="button" type="button" data-copy>Copy answers</button>
          </div>
        </div>
      </header>
      <main class="question-list">
        ${this.page.questions.map((question) => this.questionMarkup(question)).join('')}
        <section class="copy-fallback" data-copy-fallback hidden>
          <label for="copy-fallback-text">Copy the text below</label>
          <textarea id="copy-fallback-text" readonly data-copy-fallback-text></textarea>
        </section>
        <footer><button class="clear-link" type="button" data-clear>Clear this file's answers</button></footer>
      </main>`

    this.restoreAnswers()
    this.bindEvents()
    this.updateCount()
  }

  questionMarkup(question) {
    const dependency = question.dependsOn
      ? `<span class="dependency">depends on ${escapeHtml(question.dependsOn)}</span>`
      : ''
    const chips = question.covers
      .map((id) => `<span class="chip chip-source">${escapeHtml(id)}</span>`)
      .join('')
    const options = question.options
      .map((option, index) => this.optionMarkup(question, option, index))
      .join('')

    return `
      <article class="question-card" data-question="${escapeHtml(question.id)}">
        <div class="question-heading">
          <div class="question-kicker">
            <span class="question-id">${escapeHtml(question.id)}</span>${dependency}
          </div>
          <h2>${question.title}</h2>
          <div class="chips">${chips}<span class="chip">${escapeHtml(question.severity)}</span><span class="chip">${escapeHtml(question.tier)}</span></div>
        </div>
        ${this.sectionMarkup('What this API is', question.what)}
        ${this.visualMarkup(question.visual)}
        ${this.sectionMarkup('What the audit found', question.found)}
        ${this.sectionMarkup('Already said', question.said, 'said')}
        ${this.sectionMarkup('The trade-off', question.tradeoff)}
        <section class="question-section options-section">
          <h3 id="options-${escapeHtml(question.id)}">Options</h3>
          <fieldset aria-labelledby="options-${escapeHtml(question.id)}">${options}</fieldset>
          <p class="recommendation"><strong>Why this is recommended:</strong> ${escapeHtml(question.why)}</p>
        </section>
        <section class="question-section answer-section">
          <label for="answer-${escapeHtml(question.id)}">Your answer</label>
          <textarea id="answer-${escapeHtml(question.id)}" rows="5" placeholder="Write your reasoning, constraints, or a different option" data-answer></textarea>
        </section>
      </article>`
  }

  optionMarkup(question, option, index) {
    const recommended =
      index === question.recommended
        ? '<span class="recommended">Recommended</span>'
        : ''
    return `
      <label class="option">
        <input type="radio" name="${escapeHtml(question.id)}" value="${index}">
        <span><span class="option-text">${escapeHtml(option)}</span>${recommended}</span>
      </label>`
  }

  sectionMarkup(title, html, className = '') {
    return `<section class="question-section ${className}"><h3>${title}</h3><div class="prose">${html}</div></section>`
  }

  visualMarkup(visual) {
    if (visual.code !== undefined) {
      const lines = visual.code.split('\n').map((line) => {
        const className = line.startsWith('-')
          ? 'diff-remove'
          : line.startsWith('+')
            ? 'diff-add'
            : ''
        return `<span class="${className}">${escapeHtml(line)}</span>`
      })
      return `<figure class="visual"><figcaption>${escapeHtml(visual.label)}</figcaption><pre><code>${lines.join('')}</code></pre></figure>`
    }
    return `<figure class="visual visual-table"><figcaption>${escapeHtml(visual.label)}</figcaption>${visual.html}</figure>`
  }

  bindEvents() {
    this.root.addEventListener('input', (event) => {
      const card = event.target.closest('[data-question]')
      if (!card) return
      this.saveAnswer(card)
      this.updateCount()
    })
    this.root
      .querySelector('[data-copy]')
      .addEventListener('click', () => this.copyAnswers())
    this.root
      .querySelector('[data-clear]')
      .addEventListener('click', () => this.clearAnswers())
  }

  restoreAnswers() {
    for (const question of this.page.questions) {
      const card = this.root.querySelector(`[data-question="${question.id}"]`)
      const saved = readJson(this.storageKey(question.id), {})
      if (Number.isInteger(saved.choice)) {
        const radio = card.querySelector(`input[value="${saved.choice}"]`)
        if (radio) radio.checked = true
      }
      card.querySelector('[data-answer]').value = saved.answer || ''
    }
  }

  saveAnswer(card) {
    const selected = card.querySelector('input[type="radio"]:checked')
    const answer = card.querySelector('[data-answer]').value
    localStorage.setItem(
      this.storageKey(card.dataset.question),
      JSON.stringify({
        choice: selected ? Number(selected.value) : null,
        answer,
      }),
    )
  }

  updateCount() {
    const answered = this.page.questions.filter((question) => {
      const saved = readJson(this.storageKey(question.id), {})
      return Number.isInteger(saved.choice) || Boolean(saved.answer?.trim())
    }).length
    this.root.querySelector('[data-answer-count]').textContent =
      `${answered} of ${this.page.questions.length} answered`
  }

  async copyAnswers() {
    const text = formatAreaAnswers(this.page.area, this.page.questions)
    const button = this.root.querySelector('[data-copy]')
    const fallback = this.root.querySelector('[data-copy-fallback]')
    const textarea = fallback.querySelector('[data-copy-fallback-text]')
    fallback.hidden = false
    textarea.value = text
    try {
      await navigator.clipboard.writeText(text)
      button.textContent = 'Copied'
      setTimeout(() => {
        button.textContent = 'Copy answers'
      }, 1600)
    } catch {
      textarea.focus()
      textarea.select()
    }
  }

  clearAnswers() {
    if (!window.confirm("Clear this file's saved choices and answers?")) return
    for (const question of this.page.questions)
      localStorage.removeItem(this.storageKey(question.id))
    this.root.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.checked = false
    })
    this.root.querySelectorAll('[data-answer]').forEach((textarea) => {
      textarea.value = ''
    })
    this.root.querySelector('[data-copy-fallback]').hidden = true
    this.updateCount()
  }

  storeManifest() {
    localStorage.setItem(
      this.storageKey('__count'),
      String(this.page.questions.length),
    )
    localStorage.setItem(
      this.storageKey('__questions'),
      JSON.stringify(
        this.page.questions.map(({ id, title, options }) => ({
          id,
          title,
          options,
        })),
      ),
    )
  }
}

function formatAreaAnswers(area, questions) {
  return questions
    .map((question) => {
      const saved = readJson(`${STORAGE_PREFIX}${area}:${question.id}`, {})
      const choice = Number.isInteger(saved.choice)
        ? question.options[saved.choice]
        : '(not answered)'
      const answer = saved.answer?.trim() || '(none)'
      return `## ${area} ${question.id} — ${question.title}\nchoice: ${choice}\nanswer: ${answer}`
    })
    .join('\n\n')
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}
