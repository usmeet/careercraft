/* ============================================================
   demo.js — Production-Grade Application Workspace
   - Connected Target Role Context across all tools
   - Designed Structured Result Components (no raw text blobs)
   - Interactive Interview Simulator Practice loop
   - Safe XSS escaping and instant clipboard copies
   ============================================================ */

(function () {
  'use strict';

  var tools = [
    {
      id: 'jd-decoder',
      name: 'JD Decoder',
      placeholder: 'Paste the job description (responsibilities, requirements, qualifications)...',
      chips: [
        { label: 'Sample: Python & Cloud Engineer', text: 'We are seeking a Backend Python Developer with REST API, PostgreSQL, and AWS experience. Fast-paced startup environment, must wear many hats and be a rockstar self-starter.' },
        { label: 'Sample: Frontend React Developer', text: 'Senior Frontend Engineer needed with React, TypeScript, GraphQL, and micro-frontend architecture. Competitive salary, unlimited PTO.' }
      ]
    },
    {
      id: 'resume-enhancer',
      name: 'Resume Enhancer',
      placeholder: 'Paste a weak or plain resume bullet point (or paragraph)...',
      chips: [
        { label: 'Sample: College Project Website', text: 'Worked on a website for our college fest and fixed bugs to make it faster.' },
        { label: 'Sample: Intern Backend API', text: 'Created endpoints in Python and connected to a database for user authentication.' }
      ]
    },
    {
      id: 'linkedin-builder',
      name: 'LinkedIn Builder',
      placeholder: 'Describe your target role and key technical background...',
      chips: [
        { label: 'Sample: Final-Year Student', text: 'Final-year computer science student specializing in backend systems, Java, Spring Boot, and cloud deployment.' },
        { label: 'Sample: Data & ML Aspirant', text: 'Junior data analyst with experience in Python, SQL, Tableau, transitioning to machine learning engineering.' }
      ]
    },
    {
      id: 'culture-analyzer',
      name: 'Culture Analyzer',
      placeholder: "Paste company values, 'About Us' copy, or job posting cultural statements...",
      chips: [
        { label: 'Sample: High-Growth Values', text: 'Our values: Customer obsession, radical ownership, bias for action, and moving fast without fear of failure.' },
        { label: 'Sample: Enterprise Culture', text: 'We value integrity, deep collaboration, work-life balance, and deliberate long-term architecture over quick fixes.' }
      ]
    },
    {
      id: 'interview-simulator',
      name: 'Interview Simulator',
      placeholder: 'Name the role or tech stack you are interviewing for...',
      chips: [
        { label: 'Sample: Junior Java Developer', text: 'Junior Java & Spring Boot Developer' },
        { label: 'Sample: Fullstack Node/React', text: 'Fullstack Engineer with Node.js and React' }
      ]
    }
  ];

  var activeTool = 'jd-decoder';
  var lastRawResult = '';

  function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function initTargetRoleContext() {
    var labelEl = document.getElementById('target-role-label');
    var btnSet = document.getElementById('btn-set-target');
    var btnClear = document.getElementById('btn-clear-target');
    var drawer = document.getElementById('target-role-drawer');
    var inputEl = document.getElementById('target-role-input');
    var btnSave = document.getElementById('btn-save-target');
    var hintEl = document.getElementById('workspace-context-hint');

    if (!btnSet || !labelEl || !drawer || !inputEl || !btnSave) {
      return; // Gracefully bail if not on DOM
    }

    function updateView() {
      var saved = sessionStorage.getItem('careercraft_target_role');
      if (saved) {
        var preview = saved.length > 50 ? saved.substring(0, 47) + '...' : saved;
        labelEl.textContent = preview;
        labelEl.style.color = 'var(--color-paper-white)';
        btnClear.style.display = 'inline-block';
        btnSet.textContent = 'Change Target';
        if (hintEl) hintEl.textContent = '⚡ Tailoring result to your Active Target Role';
      } else {
        labelEl.textContent = 'Not set yet (using standalone mode)';
        labelEl.style.color = 'var(--color-mist)';
        btnClear.style.display = 'none';
        btnSet.textContent = 'Set Target JD';
        if (hintEl) hintEl.textContent = '';
      }
    }

    btnSet.addEventListener('click', function () {
      drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
      if (drawer.style.display === 'block') inputEl.focus();
    });

    btnClear.addEventListener('click', function () {
      sessionStorage.removeItem('careercraft_target_role');
      drawer.style.display = 'none';
      updateView();
    });

    btnSave.addEventListener('click', function () {
      var val = inputEl.value.trim();
      if (val) {
        sessionStorage.setItem('careercraft_target_role', val);
        drawer.style.display = 'none';
        updateView();
      }
    });

    updateView();
  }

  /* ═══ RENDERERS FOR STRUCTURED JSON RESULTS ═══ */

  function renderJdDecoder(data) {
    var html = '';
    if (data.verdict) {
      html += '<div style="background: rgba(28, 108, 255, 0.1); border: 1px solid rgba(28, 108, 255, 0.3); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">' +
        '<div style="font-size: 12px; font-weight: 600; color: var(--color-signal-blue); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">Application Verdict</div>' +
        '<div style="font-size: 15px; color: var(--color-paper-white); line-height: 1.5;">' + escapeHtml(data.verdict) + '</div>' +
        (data.experienceLevel ? '<div style="margin-top: 8px; font-size: 12px; color: var(--color-fog);">Estimated Level: <strong>' + escapeHtml(data.experienceLevel) + '</strong></div>' : '') +
      '</div>';
    }

    if (data.mustHaveSkills && data.mustHaveSkills.length) {
      html += '<div style="margin-bottom: 24px;">' +
        '<h4 style="font-size: 14px; color: var(--color-paper-white); margin-bottom: 10px;">📋 Must-Have Technical Skills:</h4>' +
        '<div>';
      data.mustHaveSkills.forEach(function (skill) {
        html += '<span class="skill-chip">' + escapeHtml(skill) + '</span>';
      });
      html += '</div></div>';
    }

    if (data.niceToHaveSkills && data.niceToHaveSkills.length) {
      html += '<div style="margin-bottom: 24px;">' +
        '<h4 style="font-size: 14px; color: var(--color-fog); margin-bottom: 10px;">✨ Nice-To-Have / Supporting Skills:</h4>' +
        '<div>';
      data.niceToHaveSkills.forEach(function (skill) {
        html += '<span class="skill-chip" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); color: var(--color-fog);">' + escapeHtml(skill) + '</span>';
      });
      html += '</div></div>';
    }

    if (data.redFlags && data.redFlags.length) {
      html += '<div style="margin-bottom: 20px;">' +
        '<h4 style="font-size: 14px; color: var(--color-tag-coral); margin-bottom: 12px;">🚩 Red Flags & Subconscious Warnings:</h4>';
      data.redFlags.forEach(function (rf) {
        html += '<div class="red-flag-card">' +
          '<strong style="color: var(--color-paper-white); font-size: 14px;">"' + escapeHtml(rf.phrase) + '"</strong>' +
          '<p style="font-size: 13px; color: var(--color-fog); margin-top: 4px; line-height: 1.5;">' + escapeHtml(rf.explanation) + '</p>' +
        '</div>';
      });
      html += '</div>';
    }

    return html;
  }

  function renderResumeEnhancer(data) {
    var html = '';
    if (data.original) {
      html += '<div style="margin-bottom: 20px; padding: 14px 18px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15);">' +
        '<div style="font-size: 11px; color: var(--color-mist); text-transform: uppercase; margin-bottom: 4px;">Original Input</div>' +
        '<div style="font-size: 14px; color: var(--color-fog);">' + escapeHtml(data.original) + '</div>' +
      '</div>';
    }

    if (data.variants && data.variants.length) {
      html += '<h4 style="font-size: 14px; color: var(--color-paper-white); margin-bottom: 14px;">🚀 Application-Ready XYZ Variations:</h4>';
      data.variants.forEach(function (v, idx) {
        html += '<div class="variant-card" id="var-card-' + idx + '">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
            '<span style="font-size: 12px; font-weight: 600; color: var(--color-signal-blue);">' + escapeHtml(v.style || 'Variant ' + (idx + 1)) + '</span>' +
            '<button class="btn-copy-variant btn-ghost" data-text="' + encodeURIComponent(v.bullet) + '" style="padding: 4px 10px; font-size: 12px; border-radius: 6px;">Copy</button>' +
          '</div>' +
          '<div style="font-size: 14px; color: var(--color-paper-white); line-height: 1.6; font-weight: 400; margin-bottom: 8px;">' + escapeHtml(v.bullet) + '</div>' +
          (v.strength ? '<div style="font-size: 12px; color: var(--color-mist);">' + escapeHtml(v.strength) + '</div>' : '') +
        '</div>';
      });
    }

    if (data.missingMetricsPrompt && data.missingMetricsPrompt.length) {
      html += '<div style="margin-top: 20px; padding: 14px 18px; border-radius: 10px; background: rgba(0, 204, 75, 0.05); border: 1px solid rgba(0, 204, 75, 0.2);">' +
        '<div style="font-size: 12px; font-weight: 600; color: var(--color-tag-lime); margin-bottom: 6px;">💡 Metrics to quantify in interview:</div>' +
        '<ul style="margin: 0; padding-left: 18px; font-size: 13px; color: var(--color-fog); line-height: 1.6;">';
      data.missingMetricsPrompt.forEach(function (q) {
        html += '<li>' + escapeHtml(q) + '</li>';
      });
      html += '</ul></div>';
    }

    return html;
  }

  function renderLinkedInBuilder(data) {
    var html = '';
    if (data.headlines && data.headlines.length) {
      html += '<h4 style="font-size: 14px; color: var(--color-paper-white); margin-bottom: 14px;">🎯 Recruiter-Optimized Headlines:</h4>';
      data.headlines.forEach(function (h, idx) {
        html += '<div class="variant-card">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
            '<span style="font-size: 12px; font-weight: 600; color: var(--color-tag-violet);">' + escapeHtml(h.angle || 'Angle ' + (idx + 1)) + '</span>' +
            '<button class="btn-copy-variant btn-ghost" data-text="' + encodeURIComponent(h.text) + '" style="padding: 4px 10px; font-size: 12px; border-radius: 6px;">Copy</button>' +
          '</div>' +
          '<div style="font-size: 14px; color: var(--color-paper-white); line-height: 1.5;">' + escapeHtml(h.text) + '</div>' +
        '</div>';
      });
    }

    if (data.seoKeywords && data.seoKeywords.length) {
      html += '<div style="margin-top: 20px; margin-bottom: 20px;">' +
        '<h4 style="font-size: 14px; color: var(--color-paper-white); margin-bottom: 10px;">🔍 High-Search Recruiter Keywords:</h4>' +
        '<div>';
      data.seoKeywords.forEach(function (kw) {
        html += '<span class="skill-chip" style="border-color: rgba(144, 25, 230, 0.4); background: rgba(144, 25, 230, 0.1);">' + escapeHtml(kw) + '</span>';
      });
      html += '</div></div>';
    }

    if (data.aboutSectionHook) {
      html += '<div style="padding: 14px 18px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);">' +
        '<div style="font-size: 12px; font-weight: 600; color: var(--color-paper-white); margin-bottom: 4px;">About Section Opening Hook:</div>' +
        '<div style="font-size: 13.5px; color: var(--color-fog); line-height: 1.6;">' + escapeHtml(data.aboutSectionHook) + '</div>' +
      '</div>';
    }

    return html;
  }

  function renderCultureAnalyzer(data) {
    var html = '';
    if (data.culturePersona) {
      html += '<div style="background: rgba(0, 204, 75, 0.08); border: 1px solid rgba(0, 204, 75, 0.25); border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">' +
        '<div style="font-size: 11px; font-weight: 600; color: var(--color-tag-lime); text-transform: uppercase;">Detected Cultural Persona</div>' +
        '<div style="font-size: 17px; font-weight: 600; color: var(--color-paper-white); margin-top: 2px;">' + escapeHtml(data.culturePersona) + '</div>' +
      '</div>';
    }

    if (data.reverseQuestions && data.reverseQuestions.length) {
      html += '<h4 style="font-size: 14px; color: var(--color-paper-white); margin-bottom: 14px;">❓ Reverse-Interview Questions to Ask the Hiring Team:</h4>';
      data.reverseQuestions.forEach(function (rq) {
        html += '<div class="variant-card">' +
          '<div style="font-size: 12px; font-weight: 600; color: var(--color-tag-lime); margin-bottom: 6px;">Based on: ' + escapeHtml(rq.valueOrTheme) + '</div>' +
          '<div style="font-size: 14px; color: var(--color-paper-white); font-weight: 500; margin-bottom: 8px;">"' + escapeHtml(rq.question) + '"</div>' +
          '<div style="font-size: 12.5px; color: var(--color-mist); line-height: 1.5; background: rgba(0,0,0,0.25); padding: 8px 12px; border-radius: 8px;">' +
            '<strong>Listen for:</strong> ' + escapeHtml(rq.whatToListenFor) +
          '</div>' +
        '</div>';
      });
    }

    return html;
  }

  function renderInterviewSimulator(data) {
    var html = '';
    if (data.interviewQuestions && data.interviewQuestions.length) {
      html += '<div style="margin-bottom: 16px;">' +
        '<h4 style="font-size: 15px; color: var(--color-paper-white); margin-bottom: 6px;">🎤 Interactive Interview Rounds for ' + escapeHtml(data.role || 'this Role') + '</h4>' +
        '<p style="font-size: 13px; color: var(--color-mist); margin: 0;">Click "Practice Answer" on any question to test your response and get real-time AI feedback.</p>' +
      '</div>';

      data.interviewQuestions.forEach(function (q) {
        html += '<div class="variant-card" style="margin-bottom: 18px;">' +
          '<div style="font-size: 12px; font-weight: 600; color: var(--color-tag-coral); margin-bottom: 6px;">' + escapeHtml(q.round) + '</div>' +
          '<div style="font-size: 15px; color: var(--color-paper-white); font-weight: 500; margin-bottom: 8px;">' + escapeHtml(q.question) + '</div>' +
          (q.hint ? '<div style="font-size: 12.5px; color: var(--color-mist); margin-bottom: 12px;"><strong>Coach Tip:</strong> ' + escapeHtml(q.hint) + '</div>' : '') +
          '<button class="btn-practice btn-ghost" data-qid="' + q.id + '" data-qtext="' + encodeURIComponent(q.question) + '" style="font-size: 12px; padding: 6px 14px; border-radius: 8px;">✍️ Practice Answer</button>' +
          '<div id="practice-drawer-' + q.id + '" style="display: none; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08);">' +
            '<textarea class="field__textarea practice-input" style="min-height: 80px; font-size: 13px; margin-bottom: 8px;" placeholder="Type your answer using the STAR method (Situation, Task, Action, Result)..."></textarea>' +
            '<div style="display: flex; justify-content: flex-end; gap: 8px;">' +
              '<button class="btn-submit-answer btn-primary" data-qid="' + q.id + '" style="font-size: 12px; padding: 6px 14px;">Evaluate My Answer</button>' +
            '</div>' +
            '<div id="practice-feedback-' + q.id + '" style="margin-top: 12px; display: none;"></div>' +
          '</div>' +
        '</div>';
      });
    }

    if (data.preparationTip) {
      html += '<div style="margin-top: 16px; padding: 12px 16px; border-radius: 10px; background: rgba(255, 68, 51, 0.05); border: 1px solid rgba(255, 68, 51, 0.2); font-size: 13px; color: var(--color-fog);">' +
        '<strong>Final Mindset Tip:</strong> ' + escapeHtml(data.preparationTip) +
      '</div>';
    }

    return html;
  }

  function renderEvaluationFeedback(feedback, container) {
    var html = '<div style="background: rgba(28, 108, 255, 0.08); border: 1px solid rgba(28, 108, 255, 0.25); border-radius: 10px; padding: 14px 18px;">' +
      '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
        '<span style="font-size: 12px; font-weight: 600; color: var(--color-signal-blue);">STAR Assessment: ' + escapeHtml(feedback.score || 'Evaluated') + '</span>' +
      '</div>' +
      '<div style="font-size: 13px; color: var(--color-paper-white); margin-bottom: 8px;">' +
        '<strong>Strengths:</strong> ' + escapeHtml((feedback.strengths || []).join('; ')) +
      '</div>' +
      '<div style="font-size: 13px; color: var(--color-fog); margin-bottom: 8px;">' +
        '<strong>Areas to Sharpen:</strong> ' + escapeHtml((feedback.areasToImprove || []).join('; ')) +
      '</div>' +
      (feedback.improvedAnswerSample ?
        '<div style="margin-top: 8px; padding: 10px 14px; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 13px; color: var(--color-tag-lime);">' +
          '<strong>Elevated Rewrite:</strong> "' + escapeHtml(feedback.improvedAnswerSample) + '"' +
        '</div>' : '') +
      (feedback.followUpQuestion ?
        '<div style="margin-top: 8px; font-size: 12px; color: var(--color-mist);">' +
          '<strong>Next Follow-Up Interviewer Question:</strong> "' + escapeHtml(feedback.followUpQuestion) + '"' +
        '</div>' : '') +
    '</div>';
    container.innerHTML = html;
    container.style.display = 'block';
  }

  /* ═══ WORKSPACE ORCHESTRATION ═══ */

  function initDemo() {
    initTargetRoleContext();

    var pills = document.querySelectorAll('.pill[data-tool]');
    var textarea = document.getElementById('demo-input');
    var runBtn = document.getElementById('demo-run');
    var resultPanel = document.querySelector('.try-workspace__result');
    var resultContainer = document.getElementById('structured-result-container') || document.querySelector('.result-panel__body');
    var loadingEl = document.getElementById('demo-loading');
    var noticeEl = document.querySelector('.try-workspace__notice');
    var chipsContainer = document.querySelector('.try-workspace__chips');
    var copyAllBtn = document.getElementById('demo-copy-all') || document.getElementById('demo-copy');

    if (!pills.length || !textarea || !runBtn) return;

    function setActiveTool(toolId) {
      activeTool = toolId;
      var tool = tools.find(function (t) { return t.id === toolId; });
      if (!tool) return;

      pills.forEach(function (p) {
        p.classList.toggle('pill--active', p.getAttribute('data-tool') === toolId);
      });

      textarea.setAttribute('placeholder', tool.placeholder);
      textarea.value = '';

      // Populate example chips
      chipsContainer.innerHTML = '';
      (tool.chips || []).forEach(function (c) {
        var chip = document.createElement('button');
        chip.className = 'chip';
        chip.type = 'button';
        chip.textContent = c.label;
        chip.addEventListener('click', function () {
          textarea.value = c.text;
          textarea.focus();
        });
        chipsContainer.appendChild(chip);
      });

      resultPanel.style.display = 'none';
      resultPanel.classList.remove('try-workspace__result--visible');
      if (noticeEl) noticeEl.style.display = 'none';
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        setActiveTool(pill.getAttribute('data-tool'));
      });
    });

    // Check if re-run shortcut was sent from history page
    var rerunTool = sessionStorage.getItem('careercraft_rerun_tool');
    var rerunInput = sessionStorage.getItem('careercraft_rerun_input');
    if (rerunTool && rerunInput) {
      sessionStorage.removeItem('careercraft_rerun_tool');
      sessionStorage.removeItem('careercraft_rerun_input');
      var matched = tools.find(function (t) { return t.name === rerunTool || t.id === rerunTool; });
      if (matched) {
        setActiveTool(matched.id);
        textarea.value = rerunInput;
      }
    } else {
      setActiveTool('jd-decoder');
    }

    // Attach Practice & Copy Handlers dynamically
    function attachResultInteractions() {
      // 1. Copy individual variant buttons
      document.querySelectorAll('.btn-copy-variant').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var text = decodeURIComponent(this.getAttribute('data-text') || '');
          var self = this;
          navigator.clipboard.writeText(text).then(function () {
            self.textContent = '✓ Copied';
            setTimeout(function () { self.textContent = 'Copy'; }, 1800);
          });
        });
      });

      // 2. Interactive Interview Simulator Practice Drawer
      document.querySelectorAll('.btn-practice').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var qid = this.getAttribute('data-qid');
          var drawer = document.getElementById('practice-drawer-' + qid);
          if (drawer) {
            drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
          }
        });
      });

      // 3. Interactive Answer Submission
      document.querySelectorAll('.btn-submit-answer').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var qid = this.getAttribute('data-qid');
          var drawer = document.getElementById('practice-drawer-' + qid);
          var input = drawer.querySelector('.practice-input');
          var feedbackEl = document.getElementById('practice-feedback-' + qid);
          var answer = input.value.trim();
          if (!answer) { input.focus(); return; }

          var questionText = decodeURIComponent(drawer.previousElementSibling.getAttribute('data-qtext') || '');
          var payload = '[QUESTION] ' + questionText + ' [ANSWER] ' + answer;

          var origText = btn.textContent;
          btn.textContent = 'Evaluating...';
          btn.disabled = true;

          API.runTool('interview-simulator', payload).then(function (res) {
            btn.textContent = origText;
            btn.disabled = false;
            try {
              var json = JSON.parse(res.result);
              renderEvaluationFeedback(json, feedbackEl);
            } catch (e) {
              feedbackEl.textContent = res.result;
              feedbackEl.style.display = 'block';
            }
          }).catch(function () {
            btn.textContent = origText;
            btn.disabled = false;
            alert('Evaluation failed. Please try again.');
          });
        });
      });
    }

    // Run Tool Action
    runBtn.addEventListener('click', function () {
      var text = textarea.value.trim();
      if (!text) { textarea.focus(); return; }

      // Check if target role context should be injected
      var targetRole = sessionStorage.getItem('careercraft_target_role');
      var fullInput = text;
      if (targetRole && activeTool !== 'jd-decoder') {
        fullInput = '[TARGET JOB DESCRIPTION]:\n' + targetRole + '\n\n[USER INPUT]:\n' + text;
      }

      var origBtnText = runBtn.textContent;
      runBtn.textContent = 'Analyzing...';
      runBtn.disabled = true;
      if (loadingEl) loadingEl.style.display = 'block';
      if (resultPanel) {
        resultPanel.style.display = 'none';
        resultPanel.classList.remove('try-workspace__result--visible');
      }
      if (noticeEl) noticeEl.style.display = 'none';

      // Waking up server indicator if slow
      var loadingSub = document.getElementById('demo-loading-sub');
      var timer = setTimeout(function () {
        if (loadingSub) loadingSub.textContent = 'Waking up AI engine & preparing structured cards...';
      }, 2500);

      API.runTool(activeTool, fullInput).then(function (res) {
        clearTimeout(timer);
        runBtn.textContent = origBtnText;
        runBtn.disabled = false;
        if (loadingEl) loadingEl.style.display = 'none';

        if (res.error) {
          if (res._status === 403) {
            if (noticeEl) noticeEl.style.display = 'block';
          } else {
            alert(res.message || 'An error occurred');
          }
          return;
        }

        lastRawResult = res.result;

        // Try parsing JSON to render rich components
        try {
          var parsed = JSON.parse(res.result);
          var renderedHtml = '';
          if (activeTool === 'jd-decoder') {
            renderedHtml = renderJdDecoder(parsed);
          } else if (activeTool === 'resume-enhancer') {
            renderedHtml = renderResumeEnhancer(parsed);
          } else if (activeTool === 'linkedin-builder') {
            renderedHtml = renderLinkedInBuilder(parsed);
          } else if (activeTool === 'culture-analyzer') {
            renderedHtml = renderCultureAnalyzer(parsed);
          } else if (activeTool === 'interview-simulator') {
            renderedHtml = renderInterviewSimulator(parsed);
          } else {
            renderedHtml = '<div style="white-space: pre-wrap;">' + escapeHtml(res.result) + '</div>';
          }
          resultContainer.innerHTML = renderedHtml;
        } catch (e) {
          // Plain text fallback if not JSON
          resultContainer.innerHTML = '<div style="white-space: pre-wrap; line-height: 1.6; color: var(--color-fog);">' + escapeHtml(res.result) + '</div>';
        }

        resultPanel.classList.add('try-workspace__result--visible');
        resultPanel.style.display = 'block';
        attachResultInteractions();

        // Smooth scroll to result
        setTimeout(function () {
          resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

      }).catch(function (err) {
        clearTimeout(timer);
        runBtn.textContent = origBtnText;
        runBtn.disabled = false;
        if (loadingEl) loadingEl.style.display = 'none';
        console.error('Run tool error:', err);
        alert('Connection error: ' + (err && err.message ? err.message : 'Please check your server.'));
      });
    });

    // Copy All action
    if (copyAllBtn) {
      copyAllBtn.addEventListener('click', function () {
        if (!lastRawResult) return;
        navigator.clipboard.writeText(lastRawResult).then(function () {
          copyAllBtn.textContent = '✓ Copied All';
          setTimeout(function () { copyAllBtn.textContent = 'Copy All'; }, 1800);
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initDemo);
})();
