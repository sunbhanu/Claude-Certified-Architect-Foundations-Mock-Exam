'use strict';
// Validates data/paper*.js files.
// Usage: node tools/validate.js [dataDir] [--relaxed]
//   --relaxed skips the 4-scenario / 15-question / 60-total count checks (for small test samples).
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var args = process.argv.slice(2);
var relaxed = args.indexOf('--relaxed') !== -1;
var dirArg = args.filter(function (a) { return a.indexOf('--') !== 0; })[0];
var dataDir = dirArg ? path.resolve(dirArg) : path.join(__dirname, '..', 'data');
var PAPER_SCENARIOS = {
  1: [1, 2, 3, 5], 2: [1, 3, 4, 6], 3: [2, 4, 5, 6], 4: [1, 2, 4, 6], 5: [1, 3, 5, 6],
  6: [2, 3, 4, 5], 7: [1, 2, 3, 6], 8: [1, 4, 5, 6], 9: [2, 3, 5, 6], 10: [1, 3, 4, 5]
};

var errors = [];
var warnings = [];
function err(file, where, msg) { errors.push(file + ' | ' + where + ' | ' + msg); }
function warn(file, where, msg) { warnings.push(file + ' | ' + where + ' | ' + msg); }
function nonEmpty(s) { return typeof s === 'string' && s.trim().length > 0; }

var files = [];
if (fs.existsSync(dataDir)) {
  files = fs.readdirSync(dataDir).filter(function (f) { return /^paper.*\.js$/i.test(f); }).sort();
}

var validated = 0;
files.forEach(function (file) {
  var code = fs.readFileSync(path.join(dataDir, file), 'utf8');
  var sandbox = { window: { EXAM_PAPERS: [] } };
  try {
    vm.runInContext(code, vm.createContext(sandbox), { filename: file });
  } catch (e) {
    err(file, 'file', 'failed to load: ' + e.message);
    return;
  }
  var list = sandbox.window.EXAM_PAPERS;
  if (!Array.isArray(list) || list.length === 0) { err(file, 'file', 'no paper pushed to window.EXAM_PAPERS'); return; }
  list.forEach(function (paper) { validatePaper(file, paper); validated++; });
});

function validatePaper(file, paper) {
  var pid = paper && paper.id;
  var pw = 'paper ' + pid;
  if (!paper || typeof pid !== 'number') { err(file, 'paper', 'missing numeric id'); return; }
  var m = /^paper(\d\d)\.js$/i.exec(file);
  if (m && parseInt(m[1], 10) !== pid) err(file, pw, 'paper id does not match file name');
  if (!nonEmpty(paper.title)) err(file, pw, 'missing title');
  if (!Array.isArray(paper.scenarios)) { err(file, pw, 'scenarios must be an array'); return; }
  if (!relaxed && paper.scenarios.length !== 4) {
    err(file, pw, 'must have exactly 4 scenarios (found ' + paper.scenarios.length + ')');
  }
  var ids = paper.scenarios.map(function (s) { return s && s.id; });
  ids.forEach(function (id) {
    if (!(Number.isInteger(id) && id >= 1 && id <= 6)) err(file, pw, 'scenario id ' + id + ' not in 1..6');
  });
  if (!relaxed && m && PAPER_SCENARIOS[pid] && JSON.stringify(ids) !== JSON.stringify(PAPER_SCENARIOS[pid])) {
    err(file, pw, 'scenario ids [' + ids + '] differ from SPEC table [' + PAPER_SCENARIOS[pid] + ']');
  }
  var seen = {};
  var domainCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  var multiCount = 0, total = 0, letters = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  var singleTotal = 0, longest = 0;

  paper.scenarios.forEach(function (sc, si) {
    var sw = pw + ', scenario #' + (si + 1) + ' (id ' + (sc && sc.id) + ')';
    if (!sc) return;
    if (!nonEmpty(sc.title)) err(file, sw, 'missing title');
    if (!nonEmpty(sc.description)) err(file, sw, 'missing description');
    var qs = sc.questions;
    if (!Array.isArray(qs)) { err(file, sw, 'questions must be an array'); return; }
    if (!relaxed && qs.length !== 15) err(file, sw, 'must have exactly 15 questions (found ' + qs.length + ')');
    qs.forEach(function (q, qi) {
      total++;
      var qw = sw + ', ' + (q && q.id ? q.id : 'question #' + (qi + 1));
      if (!q || typeof q !== 'object') { err(file, qw, 'not an object'); return; }
      if (!nonEmpty(q.id)) err(file, qw, 'missing id');
      else {
        if (seen[q.id]) err(file, qw, 'duplicate question id');
        seen[q.id] = true;
        if (!/^P\d+-S\d+-Q\d+$/.test(q.id)) err(file, qw, 'malformed id (expected P<paper>-S<scenario>-Q<n>)');
        else if (q.id.indexOf('P' + pid + '-S' + sc.id + '-Q') !== 0) warn(file, qw, 'id does not match P' + pid + '-S' + sc.id + '-Q<n>');
      }
      if (!(Number.isInteger(q.domain) && q.domain >= 1 && q.domain <= 5)) err(file, qw, 'domain must be integer 1-5');
      else domainCounts[q.domain]++;
      if (!nonEmpty(q.task)) err(file, qw, 'task must be a non-empty string');
      if (!nonEmpty(q.explanation)) err(file, qw, 'explanation must be a non-empty string');
      if (!nonEmpty(q.stem)) err(file, qw, 'stem must be a non-empty string');
      var opts = Array.isArray(q.options) ? q.options : [];
      var keys = opts.map(function (o) { return o && o.key; });
      opts.forEach(function (o) { if (!o || !nonEmpty(o.text)) err(file, qw, 'option ' + (o && o.key) + ' has empty text'); });
      var stem = typeof q.stem === 'string' ? q.stem : '';
      if (q.type === 'single') {
        singleTotal++;
        if (keys.join('') !== 'ABCD') err(file, qw, 'single needs exactly options A-D (found ' + keys.join(',') + ')');
        if (q.select !== 1) err(file, qw, 'single requires select === 1');
      } else if (q.type === 'multiple') {
        multiCount++;
        if (keys.join('') !== 'ABCDE') err(file, qw, 'multiple needs exactly options A-E (found ' + keys.join(',') + ')');
        if (q.select !== 2 && q.select !== 3) err(file, qw, 'multiple requires select 2 or 3');
        if (q.select === 2 && stem.indexOf('(Select TWO.)') === -1) err(file, qw, 'stem must contain "(Select TWO.)"');
        if (q.select === 3 && stem.indexOf('(Select THREE.)') === -1) err(file, qw, 'stem must contain "(Select THREE.)"');
      } else err(file, qw, 'type must be "single" or "multiple"');
      var c = q.correct;
      if (!Array.isArray(c)) { err(file, qw, 'correct must be an array'); return; }
      if (c.length !== q.select) err(file, qw, 'correct length (' + c.length + ') !== select (' + q.select + ')');
      if (new Set(c).size !== c.length) err(file, qw, 'correct contains duplicates');
      c.forEach(function (k) {
        if (keys.indexOf(k) === -1) err(file, qw, 'correct key "' + k + '" not among options');
        else if (letters[k] !== undefined) letters[k]++;
      });
      if (q.type === 'single' && c.length === 1 && opts.length === 4) {
        var lens = opts.map(function (o) { return o && typeof o.text === 'string' ? o.text.length : 0; });
        var idx = keys.indexOf(c[0]);
        if (idx !== -1) {
          var cl = lens[idx];
          if (lens.every(function (l, i) { return i === idx || l < cl; })) longest++;
        }
      }
    });
  });

  if (!relaxed && total !== 60) err(file, pw, 'must have 60 questions total (found ' + total + ')');

  console.log('\n== ' + file + ' (paper ' + pid + ', "' + paper.title + '") ==');
  console.log('  Questions: ' + total + ' | Scenarios: [' + ids.join(', ') + ']');
  console.log('  Domain counts: ' + [1, 2, 3, 4, 5].map(function (d) { return 'D' + d + '=' + domainCounts[d]; }).join(', '));
  console.log('  Multiple-response items: ' + multiCount);
  console.log('  Correct letters: ' + Object.keys(letters).map(function (l) { return l + '=' + letters[l]; }).join(', '));
  console.log('  Single items where correct is strictly longest: ' + longest + '/' + singleTotal +
    (singleTotal ? ' (' + (longest / singleTotal * 100).toFixed(1) + '%)' : '') + ' [informational]');
}

console.log('Data dir: ' + dataDir + (relaxed ? ' (relaxed mode)' : ''));
if (files.length === 0) console.log('No paper*.js files found.');
else {
  console.log('\nPaper files found: ' + files.length + ' | papers validated: ' + validated);
  if (files.length === 10 && validated !== 10) errors.push('all | expected exactly 10 papers, validated ' + validated);
}
if (warnings.length) { console.log('\nWarnings (' + warnings.length + '):'); warnings.forEach(function (w) { console.log('  WARN ' + w); }); }
if (errors.length) {
  console.log('\nHARD ERRORS (' + errors.length + '):');
  errors.forEach(function (e) { console.log('  ERROR ' + e); });
  process.exit(1);
}
console.log('\nOK: no hard errors.');
process.exit(0);
