(function () {
  'use strict';

  var PREFIX = 'ccarf.v1.';
  var EXAM_MS = 120 * 60 * 1000;
  var PASS_SCALED = 720;
  var DOMAINS = {
    1: 'D1 Agentic Architecture & Orchestration',
    2: 'D2 Tool Design & MCP Integration',
    3: 'D3 Claude Code Configuration & Workflows',
    4: 'D4 Prompt Engineering & Structured Output',
    5: 'D5 Context Management & Reliability'
  };

  var root = document.getElementById('app');
  var modalRoot = document.getElementById('modal-root');

  var papers = (Array.isArray(window.EXAM_PAPERS) ? window.EXAM_PAPERS : [])
    .filter(function (p) { return p && typeof p.id === 'number' && Array.isArray(p.scenarios); })
    .sort(function (a, b) { return a.id - b.id; });

  var mode = 'exam';
  var screen = 'home';
  var S = null; // active session
  var timerHandle = null;
  var lastResult = null;
  var reviewFilter = 'all';
  var answerFilter = 'all';
  var pendingPaperId = null;
  var scnOpen = true;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function pkey(id) { return 'paper' + pad2(id); }
  function lsGet(k) { try { return window.localStorage.getItem(PREFIX + k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(PREFIX + k, v); } catch (e) { /* ignore */ } }
  function lsDel(k) { try { window.localStorage.removeItem(PREFIX + k); } catch (e) { /* ignore */ } }
  function lsJson(k, def) {
    var v = lsGet(k);
    if (!v) return def;
    try { return JSON.parse(v); } catch (e) { return def; }
  }
  function getName() { return lsGet('candidateName') || ''; }
  function getHistory(id) { var h = lsJson('history.' + pkey(id), []); return Array.isArray(h) ? h : []; }
  function getProgress(id) { var p = lsJson('progress.' + pkey(id), null); return p && typeof p === 'object' ? p : null; }
  function resetAll() {
    var del = [];
    try {
      for (var i = 0; i < window.localStorage.length; i++) {
        var k = window.localStorage.key(i);
        if (k && k.indexOf(PREFIX) === 0) del.push(k);
      }
      del.forEach(function (k) { window.localStorage.removeItem(k); });
    } catch (e) { /* ignore */ }
  }
  function fmt(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var m = Math.floor(s / 60);
    return pad2(m) + ':' + pad2(s % 60);
  }
  function findPaper(id) {
    for (var i = 0; i < papers.length; i++) if (papers[i].id === id) return papers[i];
    return null;
  }
  function flatten(paper) {
    var out = [];
    paper.scenarios.forEach(function (sc, si) {
      (sc.questions || []).forEach(function (q) { out.push({ q: q, sc: sc, si: si }); });
    });
    return out;
  }
  function stopTimer() { if (timerHandle) { clearInterval(timerHandle); timerHandle = null; } }

  function scaled(raw, total) {
    var p = total ? raw / total : 0;
    if (p <= 0.72) return Math.round(100 + (p / 0.72) * 620);
    return Math.round(720 + ((p - 0.72) / 0.28) * 280);
  }
  function isCorrect(q, sel) {
    sel = sel || [];
    var c = q.correct || [];
    if (sel.length !== c.length) return false;
    return c.every(function (k) { return sel.indexOf(k) !== -1; });
  }

  /* ---------- modal ---------- */
  function closeModal() { modalRoot.innerHTML = ''; }
  function confirmDialog(title, msg, okLabel, onOk, danger) {
    modalRoot.innerHTML = '<div class="overlay"><div class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlgt">' +
      '<h3 id="dlgt">' + esc(title) + '</h3><p>' + esc(msg) + '</p><div class="row" style="justify-content:flex-end">' +
      '<button class="btn sec" id="dlg-cancel">Cancel</button>' +
      '<button class="btn' + (danger ? ' danger' : '') + '" id="dlg-ok">' + esc(okLabel) + '</button></div></div></div>';
    document.getElementById('dlg-cancel').onclick = closeModal;
    document.getElementById('dlg-ok').onclick = function () { closeModal(); onOk(); };
    document.getElementById('dlg-cancel').focus();
  }

  /* ---------- persistence of progress ---------- */
  function remainingMs() { return Math.max(0, S.deadline - Date.now()); }
  function elapsedMs() { return S.elapsedBase + (Date.now() - S.resumedAt); }
  function saveProgress() {
    if (!S) return;
    var o = {
      mode: S.mode, answers: S.answers, flags: S.flags, idx: S.idx,
      deadline: S.mode === 'exam' ? S.deadline : null,
      elapsedMs: S.mode === 'practice' ? elapsedMs() : 0
    };
    lsSet('progress.' + pkey(S.paper.id), JSON.stringify(o));
  }

  function newSession(paper, m, saved) {
    var flat = flatten(paper);
    S = {
      paper: paper, flat: flat, mode: m,
      answers: {}, flags: {}, idx: 0,
      deadline: Date.now() + EXAM_MS, elapsedBase: 0, resumedAt: Date.now()
    };
    if (saved) {
      S.mode = saved.mode === 'practice' ? 'practice' : 'exam';
      S.answers = saved.answers || {};
      S.flags = saved.flags || {};
      S.idx = Math.min(Math.max(0, saved.idx | 0), Math.max(0, flat.length - 1));
      if (S.mode === 'exam') S.deadline = typeof saved.deadline === 'number' ? saved.deadline : Date.now() + EXAM_MS;
      else S.elapsedBase = saved.elapsedMs || 0;
    }
    saveProgress();
  }

  /* ---------- screens ---------- */
  function header(extraRight) {
    return '<header class="hdr"><div><h1>Claude Certified Architect – Foundations</h1>' +
      '<div class="sub">Mock Examination</div></div><div class="right">' + (extraRight || '') + '</div></header>';
  }

  function goHome() {
    stopTimer();
    screen = 'home';
    S = null;
    var cards = papers.map(function (p) {
      var h = getHistory(p.id);
      var best = h.length ? Math.max.apply(null, h.map(function (a) { return a.scaledScore; })) : null;
      var last = h.length ? h[h.length - 1] : null;
      var prog = getProgress(p.id);
      var badge = last ? '<span class="badge ' + (last.pass ? 'pass' : 'fail') + '">' + (last.pass ? 'PASS' : 'FAIL') + '</span>' : '<span class="badge none">Not attempted</span>';
      return '<div class="paper"><h3>Paper ' + p.id + '</h3><div>' + esc(p.title || ('Mock Exam ' + p.id)) + '</div>' +
        '<div class="meta">Best score: <b>' + (best === null ? '—' : best) + '</b> · Attempts: <b>' + h.length + '</b></div>' +
        '<div class="meta">Last result: ' + badge + (last ? ' (' + last.scaledScore + ')' : '') + '</div>' +
        '<div class="row" style="margin-top:8px">' +
        (prog ? '<button class="btn" data-act="resume" data-id="' + p.id + '">Resume</button>' +
          '<button class="btn sec" data-act="start" data-id="' + p.id + '">Restart</button>' :
          '<button class="btn" data-act="start" data-id="' + p.id + '">Start</button>') +
        '</div></div>';
    }).join('');
    root.innerHTML = header('') +
      '<main class="wrap"><div class="card"><h2>Candidate</h2><div class="row">' +
      '<label for="cname">Candidate name</label><input type="text" id="cname" value="' + esc(getName()) + '" placeholder="Enter your name" autocomplete="name">' +
      '</div><h2 style="margin-top:18px">Mode</h2><div class="row"><div class="mode" role="group" aria-label="Mode">' +
      '<button data-act="mode" data-m="exam" class="' + (mode === 'exam' ? 'on' : '') + '">Exam mode</button>' +
      '<button data-act="mode" data-m="practice" class="' + (mode === 'practice' ? 'on' : '') + '">Practice mode</button></div>' +
      '<span class="meta-line">' + (mode === 'exam' ? '120-minute timer, no feedback until the end.' : 'Untimed, explanation shown after each answer.') + '</span></div></div>' +
      '<div class="row between" style="margin-bottom:10px"><h2 style="margin:0">Practice papers</h2>' +
      '<button class="btn sec" data-act="reset">Reset history</button></div>' +
      (cards ? '<div class="grid-cards">' + cards + '</div>' : '<div class="card">No exam papers found. Add <code>data/paper01.js</code> … <code>data/paper10.js</code>.</div>') +
      '</main>';
    var inp = document.getElementById('cname');
    inp.oninput = function () { lsSet('candidateName', inp.value); };
  }

  function showInstructions(id) {
    pendingPaperId = id;
    screen = 'instructions';
    var p = findPaper(id);
    var total = flatten(p).length;
    var practice = mode === 'practice';
    root.innerHTML = header('') + '<main class="wrap"><div class="card"><h2>Paper ' + id + ' – Instructions &amp; Confidentiality Agreement</h2>' +
      '<ul class="clean"><li><b>' + total + '</b> items (60 on the full exam)</li><li><b>120 minutes</b> total' + (practice ? ' (Practice mode: untimed, elapsed time is tracked)' : '') + '</li>' +
      '<li><b>4 scenarios</b>, each framing 15 questions</li>' +
      '<li>Item types: <b>multiple-choice</b> (select 1 of 4) and <b>multiple-response</b> (select the stated number of 5). No partial credit.</li>' +
      '<li>You may <b>flag items for review</b> and use the Review screen to navigate.</li>' +
      '<li>Scaled score 100–1000; the <b>pass cut is 720</b>.</li>' +
      '<li>Keyboard: A–E choose, N/→ next, P/← previous, F flag.</li></ul>' +
      '<div class="nda"><b>Non-disclosure agreement.</b> This is a practice examination. By continuing you agree to treat the content as confidential, to complete it without outside assistance (closed book), and not to share questions with others.</div>' +
      '<div class="row" style="margin-top:16px"><button class="btn" data-act="begin">I agree – Begin exam</button>' +
      '<button class="btn sec" data-act="home">Cancel</button></div></div></main>';
  }

  function startTimer() {
    stopTimer();
    timerHandle = setInterval(tick, 500);
  }
  function tick() {
    if (!S || screen === 'results') { stopTimer(); return; }
    var el = document.getElementById('timer');
    if (S.mode === 'exam') {
      var r = remainingMs();
      if (r <= 0) { submit(true); return; }
      if (el) {
        el.textContent = fmt(r);
        el.className = 'timer' + (r < 5 * 60000 ? ' red' : r < 15 * 60000 ? ' amber' : '');
      }
    } else if (el) {
      el.textContent = fmt(elapsedMs());
    }
    if (Math.floor(Date.now() / 500) % 20 === 0) saveProgress();
  }

  function timerHtml() {
    if (S.mode === 'exam') {
      var r = remainingMs();
      return '<div class="timer' + (r < 5 * 60000 ? ' red' : r < 15 * 60000 ? ' amber' : '') + '" id="timer" role="timer" aria-label="Time remaining">' + fmt(r) + '</div>';
    }
    return '<div class="timer" id="timer" title="Elapsed time (practice mode)">' + fmt(elapsedMs()) + '</div>';
  }

  function examHeader() {
    var total = S.flat.length;
    return '<header class="hdr"><div><h1>Claude Certified Architect – Foundations · Paper ' + S.paper.id + '</h1>' +
      '<div class="sub">' + esc(S.paper.title || '') + (S.mode === 'practice' ? ' · Practice mode' : '') + '</div></div>' +
      '<div class="right"><span class="sub">Candidate: ' + esc(getName() || '—') + '</span>' + timerHtml() + '</div></header>' +
      '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + answeredCount() + '"><div style="width:' + (total ? Math.round(answeredCount() / total * 100) : 0) + '%"></div></div>';
  }
  function answeredCount() {
    return S.flat.filter(function (f) { return (S.answers[f.q.id] || []).length > 0; }).length;
  }

  function showExam() {
    screen = 'exam';
    if (!S.flat.length) { goHome(); return; }
    var f = S.flat[S.idx], q = f.q, total = S.flat.length;
    var sel = S.answers[q.id] || [];
    var multi = q.type === 'multiple';
    var n = q.select || (multi ? 2 : 1);
    var scnNum = f.si + 1, scnTotal = S.paper.scenarios.length;
    var answered = sel.length >= n;
    var reveal = S.mode === 'practice' && answered;
    var opts = (q.options || []).map(function (o) {
      var cls = 'opt', tagTxt = '';
      var on = sel.indexOf(o.key) !== -1;
      if (on) cls += ' sel';
      if (reveal) {
        var cor = q.correct.indexOf(o.key) !== -1;
        if (cor && on) { cls = 'opt ok'; tagTxt = '✓ Correct'; }
        else if (cor) { cls = 'opt miss'; tagTxt = '✓ Correct answer'; }
        else if (on) { cls = 'opt bad'; tagTxt = '✗ Incorrect'; }
      }
      return '<label class="' + cls + '"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="opt" data-key="' + esc(o.key) + '"' + (on ? ' checked' : '') + '>' +
        '<span class="k">' + esc(o.key) + '.</span><span>' + esc(o.text) + '</span>' + (tagTxt ? '<span class="tag">' + tagTxt + '</span>' : '') + '</label>';
    }).join('');
    var expl = reveal ? '<div class="expl"><b>Explanation.</b> ' + esc(q.explanation) + '<div class="meta-line" style="margin-top:6px">Correct: ' + esc(q.correct.join(', ')) + '</div></div>' : '';
    var flagged = !!S.flags[q.id];
    root.innerHTML = examHeader() + '<main class="wrap">' +
      '<div class="row between" style="margin-bottom:10px"><b>Question ' + (S.idx + 1) + ' of ' + total + '</b>' +
      '<span class="meta-line">' + answeredCount() + ' answered</span></div>' +
      '<details class="scn" id="scn"' + (scnOpen ? ' open' : '') + '><summary>Scenario ' + scnNum + ' of ' + scnTotal + ': ' + esc(f.sc.title) + '</summary><div class="body">' + esc(f.sc.description) + '</div></details>' +
      '<div class="card"><div class="stem">' + esc(q.stem) + '</div>' +
      '<div class="hint">' + (multi ? 'Select ' + n : 'Select 1') + '</div><div role="group" aria-label="Answer options">' + opts + '</div>' + expl + '</div>' +
      '<div class="navbar"><button class="btn sec" data-act="prev"' + (S.idx === 0 ? ' disabled' : '') + '>◀ Previous</button>' +
      '<button class="btn sec" data-act="next"' + (S.idx === total - 1 ? ' disabled' : '') + '>Next ▶</button>' +
      '<button class="btn flag' + (flagged ? ' on' : '') + '" data-act="flag" aria-pressed="' + flagged + '">' + (flagged ? '⚑ Flagged' : '⚐ Flag for Review') + '</button>' +
      '<span class="sp"></span><button class="btn sec" data-act="review">Review / Navigator</button>' +
      '<button class="btn danger" data-act="end">End Exam</button></div></main>';
    var det = document.getElementById('scn');
    if (det) det.addEventListener('toggle', function () { scnOpen = det.open; });
    if (S.mode === 'exam' || S.mode === 'practice') startTimer();
  }

  function showReview() {
    screen = 'review';
    var total = S.flat.length;
    var tabs = [['all', 'Review all'], ['incomplete', 'Review incomplete'], ['flagged', 'Review flagged']].map(function (t) {
      return '<button data-act="rfilter" data-f="' + t[0] + '" class="' + (reviewFilter === t[0] ? 'on' : '') + '">' + t[1] + '</button>';
    }).join('');
    var btns = S.flat.map(function (f, i) {
      var a = (S.answers[f.q.id] || []).length > 0, fl = !!S.flags[f.q.id];
      if (reviewFilter === 'incomplete' && a) return '';
      if (reviewFilter === 'flagged' && !fl) return '';
      return '<button class="qb' + (a ? ' ans' : '') + (fl ? ' fl' : '') + (i === S.idx ? ' cur' : '') + '" data-act="goto" data-i="' + i + '" aria-label="Question ' + (i + 1) + (a ? ', answered' : ', unanswered') + (fl ? ', flagged' : '') + '">' + (i + 1) + '</button>';
    }).join('');
    var unans = total - answeredCount();
    root.innerHTML = examHeader() + '<main class="wrap"><div class="card"><h2>Review / Navigator</h2>' +
      '<div class="legend"><span><i class="sw"></i>Unanswered</span><span><i class="sw a"></i>Answered</span><span><i class="sw f"></i>Flagged (corner marker)</span></div>' +
      '<div class="tabs">' + tabs + '</div>' +
      '<div class="qgrid">' + (btns || '<em>No items match this filter.</em>') + '</div>' +
      '<p class="meta-line">' + answeredCount() + ' answered · ' + unans + ' unanswered · ' + S.flat.filter(function (f) { return S.flags[f.q.id]; }).length + ' flagged</p>' +
      '<div class="row"><button class="btn sec" data-act="back">Return to exam</button><button class="btn danger" data-act="end">End Exam</button></div></div></main>';
    startTimer();
  }

  /* ---------- submit / results ---------- */
  function endExamConfirm() {
    var un = S.flat.length - answeredCount();
    var msg = (un > 0 ? 'You have ' + un + ' unanswered item' + (un === 1 ? '' : 's') + '. ' : 'All items are answered. ') +
      'Once submitted you cannot change your answers. End the exam now?';
    confirmDialog('End exam?', msg, 'Submit exam', function () { submit(false); }, true);
  }

  function submit(auto) {
    if (!S) return;
    stopTimer();
    closeModal();
    var total = S.flat.length, raw = 0;
    var dTot = {}, dOk = {}, sTot = {}, sOk = {}, sTitle = {};
    var items = S.flat.map(function (f, i) {
      var sel = S.answers[f.q.id] || [];
      var ok = isCorrect(f.q, sel);
      if (ok) raw++;
      var d = f.q.domain;
      dTot[d] = (dTot[d] || 0) + 1; if (ok) dOk[d] = (dOk[d] || 0) + 1;
      sTot[f.si] = (sTot[f.si] || 0) + 1; if (ok) sOk[f.si] = (sOk[f.si] || 0) + 1;
      sTitle[f.si] = f.sc.title;
      return { n: i + 1, q: f.q, sc: f.sc, sel: sel.slice(), ok: ok, flagged: !!S.flags[f.q.id] };
    });
    var domainPercents = {};
    [1, 2, 3, 4, 5].forEach(function (d) {
      domainPercents[d] = dTot[d] ? Math.round((dOk[d] || 0) / dTot[d] * 1000) / 10 : null;
    });
    var scenarioBreakdown = Object.keys(sTot).map(function (si) {
      return { scenarioId: S.paper.scenarios[si].id, title: sTitle[si], correct: sOk[si] || 0, total: sTot[si] };
    });
    var timeUsed = S.mode === 'exam' ? Math.min(EXAM_MS, EXAM_MS - remainingMs()) : elapsedMs();
    var sc = scaled(raw, total);
    var rec = {
      date: new Date().toISOString(), scaledScore: sc, pass: sc >= PASS_SCALED, rawCorrect: raw, total: total,
      domainPercents: domainPercents, scenarioBreakdown: scenarioBreakdown, timeUsed: timeUsed, mode: S.mode
    };
    var h = getHistory(S.paper.id); h.push(rec);
    lsSet('history.' + pkey(S.paper.id), JSON.stringify(h));
    lsDel('progress.' + pkey(S.paper.id));
    lastResult = { rec: rec, items: items, paperId: S.paper.id, auto: auto };
    S = null;
    answerFilter = 'all';
    showResults();
  }

  function showResults() {
    screen = 'results';
    var r = lastResult.rec;
    var dBars = [1, 2, 3, 4, 5].map(function (d) {
      var p = r.domainPercents[d];
      return '<div class="bar"><div class="lbl">' + esc(DOMAINS[d]) + '</div><div class="trk"><div class="val" style="width:' + (p || 0) + '%"></div></div><div class="pc">' + (p === null ? 'n/a' : p + '%') + '</div></div>';
    }).join('');
    var sBars = r.scenarioBreakdown.map(function (s) {
      var pc = s.total ? Math.round(s.correct / s.total * 100) : 0;
      return '<div class="bar"><div class="lbl">' + esc(s.title) + '</div><div class="trk"><div class="val" style="width:' + pc + '%"></div></div><div class="pc">' + s.correct + ' / ' + s.total + '</div></div>';
    }).join('');
    var pos = Math.min(100, Math.max(0, (r.scaledScore - 100) / 900 * 100));
    var cutPos = (PASS_SCALED - 100) / 900 * 100;
    root.innerHTML = header('<span class="sub">Candidate: ' + esc(getName() || '—') + '</span>') + '<main class="wrap">' +
      (lastResult.auto ? '<div class="card" style="border-color:#c0392b">Time expired – the exam was submitted automatically.</div>' : '') +
      '<div class="banner ' + (r.pass ? 'pass' : 'fail') + '"><h2>' + (r.pass ? 'PASS' : 'FAIL') + '</h2>' +
      '<div>Paper ' + lastResult.paperId + ' · Scaled score <b>' + r.scaledScore + '</b> (pass = ' + PASS_SCALED + ')</div></div>' +
      '<div class="card"><h2>Scaled score</h2><div class="scale"><div class="fill" style="width:' + pos + '%"></div>' +
      '<div class="cut" style="left:' + cutPos + '%"></div><div class="cutl" style="left:' + cutPos + '%">Cut 720</div></div>' +
      '<div class="row between meta-line"><span>100</span><span>1000</span></div>' +
      '<p>Raw score: <b>' + r.rawCorrect + ' / ' + r.total + '</b> correct · Time used: <b>' + fmt(r.timeUsed) + '</b>' +
      (r.mode === 'exam' ? ' of 120:00' : ' (practice, elapsed)') + '</p></div>' +
      '<div class="card"><h2>Percent correct by domain</h2>' + dBars + '</div>' +
      '<div class="card"><h2>Scenario breakdown</h2>' + sBars + '</div>' +
      '<div class="row noprint" style="margin-bottom:16px"><button class="btn" data-act="print">Print results</button><button class="btn sec" data-act="home">Back to dashboard</button></div>' +
      '<h2>Answer review</h2><div class="tabs noprint">' +
      [['all', 'All'], ['wrong', 'Incorrect only'], ['flagged', 'Flagged']].map(function (t) {
        return '<button data-act="afilter" data-f="' + t[0] + '" class="' + (answerFilter === t[0] ? 'on' : '') + '">' + t[1] + '</button>';
      }).join('') + '</div><div id="answers">' + answersHtml() + '</div></main>';
  }

  function answersHtml() {
    var out = lastResult.items.filter(function (it) {
      return answerFilter === 'all' || (answerFilter === 'wrong' && !it.ok) || (answerFilter === 'flagged' && it.flagged);
    }).map(function (it) {
      var q = it.q;
      var opts = (q.options || []).map(function (o) {
        var on = it.sel.indexOf(o.key) !== -1, cor = q.correct.indexOf(o.key) !== -1;
        var cls = 'opt', tag = '';
        if (on && cor) { cls += ' ok'; tag = '✓ Your answer (correct)'; }
        else if (on) { cls += ' bad'; tag = '✗ Your answer (incorrect)'; }
        else if (cor) { cls += ' miss'; tag = '✓ Correct answer'; }
        return '<div class="' + cls + '"><span class="k">' + esc(o.key) + '.</span><span>' + esc(o.text) + '</span>' + (tag ? '<span class="tag">' + tag + '</span>' : '') + '</div>';
      }).join('');
      return '<div class="rev ' + (it.ok ? 'good' : 'wrong') + '"><div class="t">Question ' + it.n + ' · Domain ' + q.domain + ' · Task ' + esc(q.task) +
        ' · ' + esc(DOMAINS[q.domain] || '') + ' · Scenario: ' + esc(it.sc.title) + (it.flagged ? ' · ⚑ Flagged' : '') + '</div>' +
        '<div class="stem">' + esc(q.stem) + '</div>' + opts +
        '<div class="meta-line">Your answer: ' + (it.sel.length ? esc(it.sel.slice().sort().join(', ')) : 'none') + ' · Correct: ' + esc(q.correct.join(', ')) + ' · ' + (it.ok ? 'Correct' : 'Incorrect') + '</div>' +
        '<div class="expl"><b>Explanation.</b> ' + esc(q.explanation) + '</div></div>';
    }).join('');
    return out || '<div class="card">No items match this filter.</div>';
  }

  /* ---------- actions ---------- */
  function setAnswer(key) {
    var f = S.flat[S.idx], q = f.q;
    var n = q.select || 1, cur = (S.answers[q.id] || []).slice();
    var i = cur.indexOf(key);
    if (q.type === 'multiple') {
      if (i !== -1) cur.splice(i, 1);
      else { cur.push(key); while (cur.length > n) cur.shift(); }
    } else cur = [key];
    S.answers[q.id] = cur;
    saveProgress();
    showExam();
  }
  function move(d) {
    var ni = S.idx + d;
    if (ni < 0 || ni >= S.flat.length) return;
    S.idx = ni; saveProgress(); showExam();
  }
  function toggleFlag() {
    var id = S.flat[S.idx].q.id;
    if (S.flags[id]) delete S.flags[id]; else S.flags[id] = true;
    saveProgress(); showExam();
  }
  function begin(id, resume) {
    var p = findPaper(id);
    if (!p) return;
    var saved = resume ? getProgress(id) : null;
    if (saved) mode = saved.mode === 'practice' ? 'practice' : 'exam';
    newSession(p, mode, saved);
    if (S.mode === 'exam' && remainingMs() <= 0) { submit(true); return; }
    showExam();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!t || t.disabled) return;
    var act = t.getAttribute('data-act');
    var id = parseInt(t.getAttribute('data-id'), 10);
    switch (act) {
      case 'mode': mode = t.getAttribute('data-m'); goHome(); break;
      case 'start':
        if (getProgress(id)) {
          confirmDialog('Restart paper?', 'Your in-progress attempt for Paper ' + id + ' will be discarded.', 'Restart', function () { lsDel('progress.' + pkey(id)); showInstructions(id); }, true);
        } else showInstructions(id);
        break;
      case 'resume': begin(id, true); break;
      case 'begin': begin(pendingPaperId, false); break;
      case 'home': goHome(); break;
      case 'reset':
        confirmDialog('Reset history?', 'This permanently deletes all attempt history, in-progress exams and the saved candidate name.', 'Reset', function () { resetAll(); goHome(); }, true);
        break;
      case 'prev': if (S) move(-1); break;
      case 'next': if (S) move(1); break;
      case 'flag': if (S) toggleFlag(); break;
      case 'review': if (S) { saveProgress(); showReview(); } break;
      case 'back': if (S) showExam(); break;
      case 'end': if (S) endExamConfirm(); break;
      case 'goto': if (S) { S.idx = parseInt(t.getAttribute('data-i'), 10); saveProgress(); showExam(); } break;
      case 'rfilter': reviewFilter = t.getAttribute('data-f'); if (S) showReview(); break;
      case 'afilter':
        answerFilter = t.getAttribute('data-f');
        if (lastResult) { document.getElementById('answers').innerHTML = answersHtml(); }
        Array.prototype.forEach.call(document.querySelectorAll('[data-act="afilter"]'), function (b) {
          b.className = b.getAttribute('data-f') === answerFilter ? 'on' : '';
        });
        break;
      case 'print': window.print(); break;
    }
  });

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (screen === 'exam' && S && t && t.getAttribute && t.getAttribute('data-key')) setAnswer(t.getAttribute('data-key'));
  });

  document.addEventListener('keydown', function (e) {
    if (screen !== 'exam' || !S || modalRoot.innerHTML) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = e.target && e.target.tagName;
    if (tag === 'INPUT' && e.target.type === 'text') return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'n' || k === 'N') { e.preventDefault(); move(1); }
    else if (k === 'ArrowLeft' || k === 'p' || k === 'P') { e.preventDefault(); move(-1); }
    else if (k === 'f' || k === 'F') { e.preventDefault(); toggleFlag(); }
    else if (/^[a-eA-E]$/.test(k)) {
      var key = k.toUpperCase();
      var opts = S.flat[S.idx].q.options || [];
      if (opts.some(function (o) { return o.key === key; })) { e.preventDefault(); setAnswer(key); }
    }
  });

  window.addEventListener('beforeunload', function () { if (S) saveProgress(); });

  goHome();
})();
