/**
 * Cyber Upgrade — таблиця рекордів (Google Apps Script), версія 1.2
 *
 * Аркуш: колонки Час | Нік | Бали, ОДИН рядок на ім'я (без урахування регістру).
 * При старті партії гра записує ім'я з 0 (резервує його); наприкінці партії
 * результат записується в той самий рядок, якщо він вищий за наявний.
 * Старі дублікати (якщо лишились від попередніх версій) у рейтингу не заважають:
 * береться найкращий результат імені.
 *
 * Скрипт прив'язаний до Google Таблиці й опублікований як веб-додаток.
 * Гра звертається до нього через JSONP (GET-запити з параметром callback):
 *   ?action=top&limit=5000&callback=fn   → { records: [{name, score}, ...] }  (усі імена, до limit)
 *   ?action=submit&name=Ім'я&score=120&callback=fn → { ok: true, best: 120, updated: true|false }
 *
 * Гра завантажує список один раз при відкритті і з нього бере топ-3, Топ-100
 * і перевірку, чи ім'я вже зайняте, — тому limit має бути великим.
 *
 * Інструкція з підключення: docs/cyber-upgrade-leaderboard.md
 */

var SHEET_NAME = 'records';
var HEADER = ['Час', 'Нік', 'Бали'];
var MAX_SCORE = 50 * 10 + Math.floor(50 / 3) * 5; // 50 запитань × 10 + бонуси за серії
var MAX_NAME = 20;
var MAX_LIMIT = 5000;

function doGet(e) {
  var p = (e && e.parameter) || {};
  var result;
  try {
    if (p.action === 'submit') result = submit(p);
    else result = top(p);
  } catch (err) {
    result = { ok: false, error: String(err) };
  }
  return respond(result, p.callback);
}

function respond(obj, callback) {
  var json = JSON.stringify(obj);
  if (callback && /^[\w$]+$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADER);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function cleanName(raw) {
  return String(raw || '')
    .replace(/[<>"'`\\\/{}\[\]=]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME);
}

// ----- Фільтр нецензурних слів (та сама логіка, що в games/cyber-upgrade/badwords.js) -----
var BAD_CYR = [
  'хуй', 'хуя', 'хує', 'хуе', 'хуї', 'хуи', 'хуі', 'хуйл', 'хуіл', 'хуил',
  'пизд', 'пізд',
  'бляд', 'блят', 'бля',
  'ебал', 'ебан', 'ебат', 'ебну', 'ебло', 'ебуч',
  'їбал', 'їбан', 'їбат', 'їбну', 'йобан', 'йобн', 'йоба', 'єбал', 'єбан', 'єбат',
  'уеб', 'уёб', 'уєб',
  'сука', 'сучк', 'сучар',
  'мудак', 'мудил', 'мудо',
  'гандон', 'гондон',
  'залуп',
  'пидор', 'підор', 'пидар', 'підар', 'педик', 'пидр', 'підр',
  'жоп', 'дроч', 'шлюх', 'курв', 'срак', 'сран', 'гівн', 'говн', 'дерьм',
  'сцик', 'пердун', 'далбо', 'долбо', 'дебіл', 'дебил', 'даун', 'лох', 'чмо', 'нахуй', 'нахер'
];
var BAD_LAT = [
  'fuck', 'fuk', 'fck', 'shit', 'bitch', 'cunt', 'asshole', 'pussy', 'whore', 'slut',
  'nigg', 'bastard', 'porn', 'wtf', 'motherf'
];
var DIGIT_MAP = { '0': 'о', '1': 'і', '3': 'з', '4': 'ч', '5': 's', '6': 'б', '9': 'я', '@': 'а', '$': 's', '!': 'і', '|': 'і' };
var LAT2CYR = { a: 'а', b: 'в', c: 'с', e: 'е', h: 'н', i: 'і', k: 'к', m: 'м', o: 'о', p: 'р', t: 'т', x: 'х', y: 'у', u: 'и', n: 'п', r: 'г', g: 'д', w: 'ш', s: 'с', d: 'д', l: 'л', f: 'ф', v: 'в', z: 'з', j: 'й', q: 'к' };
var CYR2LAT = { 'а': 'a', 'в': 'b', 'с': 'c', 'е': 'e', 'н': 'h', 'і': 'i', 'к': 'k', 'м': 'm', 'о': 'o', 'р': 'p', 'т': 't', 'х': 'x', 'у': 'y', 'и': 'u', 'п': 'n', 'г': 'r', 'д': 'd', 'ш': 'w', 'з': 'z', 'й': 'j', 'л': 'l', 'ф': 'f' };

function mapChars(str, table) {
  var out = '';
  for (var i = 0; i < str.length; i++) out += table[str[i]] || str[i];
  return out;
}
function containsAny(str, roots) {
  for (var i = 0; i < roots.length; i++) if (str.indexOf(roots[i]) !== -1) return true;
  return false;
}
function isBadName(name) {
  var b = String(name || '').toLowerCase()
    .replace(/[0-9@$!|]/g, function (ch) { return DIGIT_MAP[ch] || ''; })
    .replace(/[^a-zа-яіїєґё]/g, '')
    .replace(/ё/g, 'е');
  if (!b) return false;
  var cyr = mapChars(b, LAT2CYR);
  var lat = mapChars(b, CYR2LAT);
  var sq = function (s) { return s.replace(/(.)\1+/g, '$1'); };
  return containsAny(cyr, BAD_CYR) || containsAny(sq(cyr), BAD_CYR) ||
         containsAny(lat, BAD_LAT) || containsAny(sq(lat), BAD_LAT);
}

function submit(p) {
  var name = cleanName(p.name);
  var score = Math.round(Number(p.score));
  if (name.length < 2) return { ok: false, error: 'bad-name' };
  if (isBadName(name)) return { ok: false, error: 'bad-word' };
  if (!(score >= 0 && score <= MAX_SCORE)) return { ok: false, error: 'bad-score' };

  var lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    var sheet = getSheet();
    var rec = bestScores(sheet)[name.toLowerCase()];
    if (!rec) {
      // Нове ім'я — новий рядок (при старті партії це резервування з 0)
      sheet.appendRow([new Date(), name, score]);
      SpreadsheetApp.flush();
      return { ok: true, best: score, updated: true, created: true };
    }
    if (score > rec.score) {
      // Вищий результат — оновлюємо той самий рядок
      sheet.getRange(rec.row, 1, 1, 3).setValues([[new Date(), rec.name, score]]);
      SpreadsheetApp.flush();
      return { ok: true, best: score, updated: true, created: false };
    }
    return { ok: true, best: rec.score, updated: false, created: false };
  } finally {
    lock.releaseLock();
  }
}

// Найкращий результат кожного гравця (ім'я без урахування регістру) + номер його рядка
function bestScores(sheet) {
  sheet = sheet || getSheet();
  var rows = sheet.getDataRange().getValues();
  var best = {};
  for (var i = 1; i < rows.length; i++) { // рядок 1 — заголовки
    var name = cleanName(rows[i][1]);
    var score = Number(rows[i][2]);
    if (!name || isNaN(score)) continue;
    var key = name.toLowerCase();
    if (!best[key] || score > best[key].score) best[key] = { name: name, score: score, row: i + 1 };
  }
  return best;
}

function top(p) {
  var limit = Math.min(Math.max(parseInt(p.limit, 10) || 100, 1), MAX_LIMIT);
  var best = bestScores();
  var list = Object.keys(best).map(function (k) { return { name: best[k].name, score: best[k].score }; });
  list.sort(function (a, b) { return b.score - a.score || a.name.localeCompare(b.name); });
  return { records: list.slice(0, limit) };
}
