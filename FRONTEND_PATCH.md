# Frontend + Config Patch (Applied)

> **Status:** ✅ All patches below have been directly applied across `java-app/src/main/resources/` (and synchronized with `java-app/static/` and `java-app/target/classes/`).

This document records the exact changes made to integrate the Python ML service into the Spring Boot web app UI.

---

## 1. `application.properties` (Configured)

Configured under `java-app/src/main/resources/application.properties` and `java-app/target/classes/application.properties`:

```properties
# ── ML service (FastAPI) ──
ml.service.url=${ML_SERVICE_URL:http://localhost:8000}
```

- When running locally, defaults to `http://localhost:8000`.
- In Docker Compose, overridden to `http://ml-service:8000`.

---

## 2. `static/try.html` (Tool Selector Button Added)

Added the **Resume Match** button inside `<div class="try-workspace__selector pill-group">` after *Interview Simulator*:

```html
<button class="pill" data-tool="resume-matcher">Resume Match</button>
```

---

## 3. `static/js/demo.js` (Client Integration Added)

### 3a. Registered in the `tools` array

```js
    {
      id: 'resume-matcher',
      name: 'Resume Match Score',
      placeholder: 'Paste your resume. Then add a line "=====JOB DESCRIPTION=====" and paste the job description below it. (Or set a Target JD above and paste only your resume.)',
      chips: [
        { label: 'Sample: ML Intern vs Data Role', text: 'Machine Learning intern with strong background in Python, scikit-learn, pandas, numpy, model evaluation, data preprocessing, feature engineering, and statistical analysis. Built resume classification models and NLP pipelines.\n\n=====JOB DESCRIPTION=====\nSeeking a Data Engineer / ML Intern proficient in Python, SQL, machine learning, data pipelines, ETL, and cloud services. Experience with REST APIs and scikit-learn is a plus.' }
      ]
    }
```

### 3b. UI Card Renderer (`renderResumeMatcher`)

```js
  function renderResumeMatcher(data) {
    if (data.error) {
      return '<div style="color: var(--color-fog);">' + escapeHtml(data.error) + '</div>';
    }
    var res = data.resume_roles && data.resume_roles[0];
    var jd = data.jd_roles && data.jd_roles[0];
    var html = '<div style="background: rgba(28,108,255,0.1); border: 1px solid rgba(28,108,255,0.3); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">' +
      '<div style="font-size: 12px; font-weight: 600; color: var(--color-signal-blue); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">Match score</div>' +
      '<div style="font-size: 32px; color: var(--color-paper-white); font-weight: 600;">' + escapeHtml(String(data.score)) + '/100</div>' +
      (res ? '<div style="margin-top: 8px; font-size: 13px; color: var(--color-fog);">Resume looks like <strong>' + escapeHtml(res.role) + '</strong> (' + Math.round(res.confidence * 100) + '%)</div>' : '') +
      (jd ? '<div style="font-size: 13px; color: var(--color-fog);">Job looks like <strong>' + escapeHtml(jd.role) + '</strong> (' + Math.round(jd.confidence * 100) + '%) &middot; Role match: <strong>' + (data.role_match ? 'Yes' : 'No') + '</strong></div>' : '') +
      (data.low_confidence ? '<div style="margin-top: 8px; font-size: 12px; color: var(--color-mist);">Low confidence: this resume does not fit the dataset\'s 24 categories well, so rely more on the skills below.</div>' : '') +
      '</div>';

    function chips(title, arr) {
      if (!arr || !arr.length) return '';
      var h = '<div style="margin-bottom: 24px;"><h4 style="font-size: 14px; color: var(--color-paper-white); margin-bottom: 10px;">' + title + '</h4><div>';
      arr.forEach(function (s) { h += '<span class="skill-chip">' + escapeHtml(s) + '</span>'; });
      return h + '</div></div>';
    }
    html += chips('✅ Skills you already show:', data.matched_skills);
    html += chips('➕ Skills to add (in the job, not in your resume):', data.missing_skills);
    html += chips('🔎 Other missing keywords:', data.missing_keywords);
    html += '<div style="font-size: 12px; color: var(--color-mist);">Only add skills you really have. The score is a simple heuristic, not a hiring decision.</div>';
    return html;
  }
```

### 3c. Added to the Execution Dispatcher Chain

```js
          } else if (activeTool === 'interview-simulator') {
            renderedHtml = renderInterviewSimulator(parsed);
          } else if (activeTool === 'resume-matcher') {
            renderedHtml = renderResumeMatcher(parsed);
          } else {
```

---

## 4. History & Persistence Integration

`HistoryService` automatically persists inputs and results for authenticated users in the H2 database. Because `resume-matcher` is registered with the matching tool ID and name in `demo.js`, the History page re-run button works automatically without requiring any database schema changes.
