/* ============================================================
   demo.js — Try It workspace: tool selector, input, example
             prompts, run, result panel, guest-limit notice
   Source: DESIGN.md §5c, COPY.md §2
   ============================================================ */

(function () {
  'use strict';

  var GUEST_LIMIT = 2;
  var STORAGE_KEY = 'cc_guest_uses';

  var tools = [
    {
      id: 'jd-decoder',
      name: 'JD Decoder',
      placeholder: 'Paste a job posting…',
      example: 'Decode this JD for a fresher: We need a Python developer with REST API and cloud experience.'
    },
    {
      id: 'resume-enhancer',
      name: 'Resume Enhancer',
      placeholder: 'Paste a resume bullet…',
      example: 'Improve this bullet: Worked on a website for our college fest.'
    },
    {
      id: 'linkedin-builder',
      name: 'LinkedIn Builder',
      placeholder: 'Describe your background and target role…',
      example: 'Write a LinkedIn headline for a final-year engineering student interested in backend development.'
    },
    {
      id: 'culture-analyzer',
      name: 'Culture Analyzer',
      placeholder: "Paste a company's stated values…",
      example: 'Company values: customer obsession, ownership, bias for action. What should I ask in my interview?'
    },
    {
      id: 'interview-simulator',
      name: 'Interview Simulator',
      placeholder: 'Name the role you are preparing for…',
      example: 'Give me interview questions for a junior Java developer.'
    }
  ];

  /* --- Demo result generators (rule-based, no AI) --- */

  function generateJDResult(input) {
    var skills = [];
    var redFlags = [];
    var techKeywords = ['python', 'java', 'javascript', 'react', 'node', 'sql', 'rest', 'api', 'cloud', 'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'git', 'html', 'css', 'spring', 'boot', 'hibernate', 'mongodb', 'postgresql', 'mysql', 'redis', 'graphql', 'typescript', 'angular', 'vue', 'django', 'flask', 'machine learning', 'data science', 'agile', 'scrum', 'ci/cd', 'devops', 'linux', 'microservices'];
    var flagPatterns = [
      { pattern: /fast[- ]?paced/i, text: '"Fast-paced environment" — may signal high pressure or understaffing' },
      { pattern: /wear many hats/i, text: '"Wear many hats" — unclear role boundaries, possible overwork' },
      { pattern: /self[- ]?starter/i, text: '"Self-starter" — may indicate limited onboarding or mentorship' },
      { pattern: /rockstar|ninja|guru|wizard/i, text: 'Informal title language — may suggest unclear role expectations' },
      { pattern: /competitive salary/i, text: '"Competitive salary" without a number — compensation may be below market' },
      { pattern: /family/i, text: '"Like a family" — may indicate blurred boundaries between work and personal life' },
      { pattern: /unlimited pto|unlimited vacation/i, text: '"Unlimited PTO" — often results in employees taking fewer days off' },
      { pattern: /must have \d+\+? years/i, text: 'Years-of-experience requirement — may filter out capable candidates with non-traditional paths' }
    ];

    var lower = input.toLowerCase();
    techKeywords.forEach(function (kw) {
      if (lower.indexOf(kw) !== -1) {
        skills.push(kw.charAt(0).toUpperCase() + kw.slice(1));
      }
    });

    flagPatterns.forEach(function (fp) {
      if (fp.pattern.test(input)) {
        redFlags.push(fp.text);
      }
    });

    if (skills.length === 0) skills.push('No specific technical keywords detected — try pasting a fuller job description');
    if (redFlags.length === 0) redFlags.push('No obvious red flags found in this posting');

    var out = '📋 Must-Have Technical Skills\n';
    skills.forEach(function (s) { out += '  • ' + s + '\n'; });
    out += '\n🚩 Red Flags to Watch\n';
    redFlags.forEach(function (f) { out += '  • ' + f + '\n'; });
    out += '\n💡 Tip: Compare these requirements against your resume. Focus on the must-haves first.';
    return out;
  }

  function generateResumeResult(input) {
    var actionVerbs = ['Engineered', 'Developed', 'Optimized', 'Implemented', 'Designed', 'Architected', 'Delivered', 'Automated', 'Streamlined', 'Spearheaded', 'Led', 'Built', 'Created', 'Launched', 'Orchestrated'];
    var weakVerbs = ['worked on', 'helped', 'assisted', 'did', 'was responsible for', 'handled', 'managed', 'participated'];

    var verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    var lower = input.toLowerCase();
    var hadWeak = weakVerbs.some(function(w) { return lower.indexOf(w) !== -1; });

    var out = '✏️ Enhanced Resume Bullet\n\n';
    if (hadWeak) {
      out += '  Original: "' + input.trim() + '"\n\n';
      out += '  Improved (XYZ Formula):\n';
      out += '  "' + verb + ' [what you built], resulting in [measurable outcome], by [specific action you took]."\n\n';
      out += '  Example rewrite:\n';
      out += '  "' + verb + ' a responsive website for the college festival, increasing event registrations by 40%, by implementing an intuitive UI with real-time updates."\n\n';
    } else {
      out += '  Your bullet: "' + input.trim() + '"\n\n';
      out += '  Suggested XYZ rewrite:\n';
      out += '  "' + verb + ' [X — what you accomplished], as measured by [Y — quantifiable result], by [Z — how you did it]."\n\n';
    }
    out += '💡 Tips:\n';
    out += '  • Start with a strong action verb (e.g. ' + actionVerbs.slice(0, 5).join(', ') + ')\n';
    out += '  • Include a number or metric wherever possible\n';
    out += '  • Be specific about the technology or method you used';
    return out;
  }

  function generateLinkedInResult(input) {
    var headlines = [
      input.trim() + ' | Building Solutions That Matter',
      'Aspiring ' + (input.match(/backend|frontend|full[- ]?stack|data|ml|ai|software|web/i) || ['Software'])[0] + ' Engineer | ' + (input.match(/engineering|computer science|ece|ete|it/i) || ['Engineering'])[0] + ' Student',
      (input.match(/backend|frontend|full[- ]?stack|data|ml|software|web/i) || ['Software'])[0].charAt(0).toUpperCase() + (input.match(/backend|frontend|full[- ]?stack|data|ml|software|web/i) || ['Software'])[0].slice(1) + ' Developer | Problem Solver | Open to Opportunities'
    ];

    var out = '🔗 LinkedIn Headline Suggestions\n\n';
    headlines.forEach(function (h, i) {
      out += '  ' + (i + 1) + '. "' + h + '"\n';
    });
    out += '\n💡 Tips for LinkedIn Headlines:\n';
    out += '  • Keep it under 120 characters\n';
    out += '  • Include your target role and key skills\n';
    out += '  • Use keywords recruiters search for\n';
    out += '  • Avoid generic titles like "Student" alone';
    return out;
  }

  function generateCultureResult(input) {
    var valueQuestions = {
      'customer obsession': 'Can you share a recent example where the team changed direction based on direct customer feedback?',
      'ownership': 'How much autonomy do individuals have to make decisions about their projects?',
      'bias for action': 'How does the team balance speed of execution with thoughtful planning?',
      'innovation': 'What percentage of time can engineers spend on self-directed projects or experiments?',
      'integrity': 'How does the company handle situations where doing the right thing conflicts with short-term profits?',
      'teamwork': 'How are conflicts between team members typically resolved?',
      'excellence': 'What does "good enough" look like here, and when is perfection expected?',
      'transparency': 'How are major company decisions communicated to employees?',
      'diversity': 'What specific initiatives support underrepresented groups in leadership?',
      'learning': 'What does the professional development budget look like, and how is it used?'
    };

    var questions = [];
    var lower = input.toLowerCase();
    Object.keys(valueQuestions).forEach(function (key) {
      if (lower.indexOf(key) !== -1) {
        questions.push({ value: key, question: valueQuestions[key] });
      }
    });

    if (questions.length === 0) {
      questions.push({ value: 'general', question: 'What does a typical day look like for someone in this role?' });
      questions.push({ value: 'general', question: 'How does the team celebrate wins and handle setbacks?' });
      questions.push({ value: 'general', question: 'What are the most common reasons people leave this team?' });
    }

    var out = '🏢 Reverse Interview Questions\n\n';
    questions.forEach(function (q) {
      out += '  Based on "' + q.value + '":\n';
      out += '  → ' + q.question + '\n\n';
    });
    out += '💡 Tips for Reverse Interviews:\n';
    out += '  • Ask these at the end of your interview when invited\n';
    out += '  • Listen for specifics vs. vague platitudes\n';
    out += '  • A good answer cites a real, recent example';
    return out;
  }

  function generateInterviewResult(input) {
    var role = input.replace(/give me interview questions for /i, '').replace(/^a |^an /i, '').trim();
    var out = '🎤 Interview Questions for ' + role.charAt(0).toUpperCase() + role.slice(1) + '\n\n';

    out += '📘 Behavioral Round\n';
    out += '  1. Tell me about a time you had to learn a new technology under a tight deadline.\n';
    out += '  2. Describe a situation where you disagreed with a teammate. How did you resolve it?\n';
    out += '  3. Give an example of a project where you took initiative beyond your assigned tasks.\n\n';

    out += '💻 Technical Round\n';
    out += '  1. Explain the difference between an interface and an abstract class. When would you use each?\n';
    out += '  2. How would you design a REST API for a to-do application? Walk through the endpoints.\n';
    out += '  3. What happens when you type a URL into a browser? Describe the full lifecycle.\n\n';

    out += '📊 Case-Based Round\n';
    out += '  1. You discover a critical bug in production on a Friday evening. Walk through your decision process.\n';
    out += '  2. A stakeholder wants a feature that contradicts the current architecture. How would you approach this?\n';
    out += '  3. Your team is falling behind on sprint commitments. What steps would you take?\n\n';

    out += '💡 Preparation Tips:\n';
    out += '  • Use the STAR method (Situation, Task, Action, Result) for behavioral answers\n';
    out += '  • Practice thinking out loud for technical questions\n';
    out += '  • For case-based questions, structure your answer before diving into details';
    return out;
  }

  var generators = {
    'jd-decoder': generateJDResult,
    'resume-enhancer': generateResumeResult,
    'linkedin-builder': generateLinkedInResult,
    'culture-analyzer': generateCultureResult,
    'interview-simulator': generateInterviewResult
  };

  var activeTool = tools[0].id;

  function getGuestUses() {
    try { return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10); }
    catch (e) { return 0; }
  }

  function incGuestUses() {
    try { localStorage.setItem(STORAGE_KEY, String(getGuestUses() + 1)); }
    catch (e) { /* ignore */ }
  }

  function initDemo() {
    var pills = document.querySelectorAll('.pill[data-tool]');
    var textarea = document.getElementById('demo-input');
    var runBtn = document.getElementById('demo-run');
    var resultPanel = document.querySelector('.try-workspace__result');
    var resultBody = document.querySelector('.result-panel__body');
    var noticeEl = document.querySelector('.try-workspace__notice');
    var chipsContainer = document.querySelector('.try-workspace__chips');
    var copyBtn = document.getElementById('demo-copy');

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

      /* Update chip */
      chipsContainer.innerHTML = '';
      var chip = document.createElement('button');
      chip.className = 'chip';
      chip.type = 'button';
      chip.textContent = 'Try: "' + tool.example + '"';
      chip.addEventListener('click', function () {
        textarea.value = tool.example;
        textarea.focus();
      });
      chipsContainer.appendChild(chip);

      /* Hide result */
      resultPanel.classList.remove('try-workspace__result--visible');
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        setActiveTool(pill.getAttribute('data-tool'));
      });
    });

    runBtn.addEventListener('click', function () {
      var text = textarea.value.trim();
      if (!text) { textarea.focus(); return; }

      if (getGuestUses() >= GUEST_LIMIT) {
        noticeEl.classList.add('try-workspace__notice--visible');
        return;
      }

      /* Generate result */
      var gen = generators[activeTool];
      if (gen) {
        resultBody.textContent = gen(text);
        resultPanel.classList.add('try-workspace__result--visible');
        incGuestUses();
      }
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var text = resultBody.textContent;
        if (navigator.clipboard && text) {
          navigator.clipboard.writeText(text).then(function () {
            copyBtn.textContent = '✓ Copied';
            setTimeout(function () { copyBtn.textContent = 'Copy'; }, 2000);
          });
        }
      });
    }

    setActiveTool(tools[0].id);
  }

  document.addEventListener('DOMContentLoaded', initDemo);
})();
