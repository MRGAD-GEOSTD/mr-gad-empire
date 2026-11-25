// @ts-nocheck
import { STAGES, OBJ, DOM, ACH } from './data.js';
import { COUNTRIES, RIVERS, K } from './mapdata.js';
import { PLACES, HOME, EGYPT } from './places.js';
import { FACE } from './face.js';
import { PROLOGUE, BRIEF, OUTRO, ENDING, RX_OK, RX_NO } from './story.js';
const DK = ['pol', 'eco', 'soc', 'rel', 'sci'];
const sh = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
} return a; };
const X = (lon) => lon, Y = (lat) => -lat * K;
const BOSS = { id: 6, name: 'الحارس الأخير', sub: 'الامتحان الشامل', icon: '👑', color: '#3b2a7a', bg: '#eee9fb', treasure: { i: '👑', n: 'تاج الحارس' } };
const rankOf = (s) => (s < 4 ? 'تلميذ في الأطلس' : s < 8 ? 'مستكشف الخرائط' : s < 12 ? 'حارس الحضارات' : s < 16 ? 'قائد الحضارات' : 'إمبراطور مستر جاد');
const P = { stars: [0, 0, 0, 0, 0, 0], ach: {}, treasures: {}, acc: {}, best: 0, name: '', mute: false };
try {
    const s = store.get();
    if (s)
        Object.assign(P, JSON.parse(s));
    if (P.name)
        V = { v: 'home' };
}
catch (e) { }
let V = { v: 'name' }, R = null, first = true;
const SK = 'imp_unit2_v1';
const store = { get() { try {
        const s = localStorage.getItem(SK);
        if (s)
            return s;
    }
    catch (e) { } try {
        if (window.name && window.name.indexOf(SK + ':') === 0)
            return window.name.slice(SK.length + 1);
    }
    catch (e) { } return null; }, set(s) { try {
        localStorage.setItem(SK, s);
    }
    catch (e) { } try {
        window.name = SK + ':' + s;
    }
    catch (e) { } } };
const save = () => { try {
    store.set(JSON.stringify(P));
}
catch (e) { } };
let AC = null;
const sfx = (kind) => { try {
    if (P.mute)
        return;
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const seq = { ok: [[523, 0], [659, .09], [784, .18]], no: [[220, 0], [165, .14]], star: [[523, 0], [659, .1], [784, .2], [1047, .3]], tap: [[440, 0]], coin: [[988, 0], [1319, .07]] }[kind] || [];
    seq.forEach(([f, t]) => { const o = AC.createOscillator(), g2 = AC.createGain(); o.type = kind === 'no' ? 'sawtooth' : 'triangle'; o.frequency.value = f; const t0 = AC.currentTime + t; g2.gain.setValueAtTime(.0001, t0); g2.gain.exponentialRampToValueAtTime(.12, t0 + .02); g2.gain.exponentialRampToValueAtTime(.0001, t0 + .22); o.connect(g2); g2.connect(AC.destination); o.start(t0); o.stop(t0 + .25); });
}
catch (e) { } };
const KN = () => esc(P.name || 'بطل');
const king = () => 'الملك ' + KN();
function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
const faceImg = (s = 64, cls = '') => `<img class="imp-face ${cls}" src="${FACE}" width="${s}" height="${s}" alt="أ. محمد جمال جاد">`;
const narr = (t) => (t = String(t).replace(/\{N\}/g, KN()), `<div class="imp-narr">${faceImg(54)}<div class="imp-bub"><b>مستر جاد</b>${t}</div></div>`);
const stickman = (c = '#14213d', s = 44) => `<svg width="${s}" height="${s}" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="14" r="9" fill="#fff" stroke="${c}" stroke-width="3"/><circle cx="28" cy="13" r="3" fill="none" stroke="${c}" stroke-width="1.6"/><circle cx="37" cy="13" r="3" fill="none" stroke="${c}" stroke-width="1.6"/><path d="M31 13h3M28 18q4 3 8 0" stroke="${c}" stroke-width="1.6" fill="none"/><path d="M32 23v20M32 29l-14 8M32 29l15-10M32 43l-11 16M32 43l11 16" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round"/><rect x="45" y="12" width="12" height="9" rx="1.5" fill="#e0a526" stroke="${c}" stroke-width="2" transform="rotate(-12 50 16)"/></svg>`;
function ringPoly(poly) { return 'M' + poly.map(([lo, la]) => X(lo) + ' ' + Y(la)).join(' ') + 'Z'; }
function mapSVG(o) {
    // o: win, holes[], extents[{si,poly?,iso}], pins[{n,lat,lon,on,color}], labels bool, id
    const [lo0, la0, lo1, la1] = o.win;
    const vx = X(lo0), vy = Y(la1), vw = lo1 - lo0, vh = (la1 - la0) * K;
    const s = vw < 80 ? vw / 48 : vw / 100;
    const holes = o.holes.map(([lo, la, rx, ry], i) => `<ellipse cx="${X(lo)}" cy="${Y(la)}" rx="${rx}" ry="${ry * K}" fill="#000"/>`).join('');
    const extIso = {};
    (o.extents || []).forEach((e) => (e.iso || []).forEach((i) => { extIso[i] = e.color; }));
    const inView = (c) => true;
    const countries = COUNTRIES.map((c) => `<path d="${c.d}" fill="${extIso[c.id] ? extIso[c.id] : '#eadfc4'}" fill-opacity="${extIso[c.id] ? 0.78 : 1}" stroke="#b9a87c" stroke-width="${s * 0.18}" stroke-linejoin="round"/>`).join('');
    const polys = (o.extents || []).filter((e) => e.poly).map((e) => `<path d="${ringPoly(e.poly)}" fill="${e.color}" fill-opacity=".7" stroke="${e.color}" stroke-width="${s * 0.35}" stroke-dasharray="${s} ${s * 0.7}"/>`).join('');
    const seen = {};
    const rivers = RIVERS.map((r) => `<path d="${r.d}" fill="none" stroke="#4e93c4" stroke-width="${s * 0.35}" stroke-linecap="round"/>`).join('');
    const rl = RIVERS.filter((r) => { if (seen[r.n])
        return false; seen[r.n] = 1; return o.riverLabels && o.riverLabels.includes(r.n); });
    const names = { EGY: 'مصر', IRQ: 'العراق', LBN: 'لبنان', YEM: 'اليمن', PAK: 'باكستان', IND: 'الهند', CHN: 'الصين', SAU: 'السعودية', IRN: 'إيران', TUR: 'تركيا', ESP: 'إسبانيا', LBY: 'ليبيا', SYR: 'سوريا', DZA: 'الجزائر', AFG: 'أفغانستان', MAR: 'المغرب', TUN: 'تونس' };
    const labs = o.labels ? COUNTRIES.filter((c) => names[c.id] && c.lx >= lo0 && c.lx <= lo1 && -c.ly / K >= la0 && -c.ly / K <= la1).map((c) => `<text x="${c.lx}" y="${c.ly}" font-size="${s * 2.1}" fill="#6b5d3a" fill-opacity=".75" text-anchor="middle" font-weight="700">${names[c.id]}</text>`).join('') : '';
    const pins = o.pins.map((p, pi) => {
        const cx = X(p.lon), cy = Y(p.lat);
        if (!p.on)
            return `<g opacity=".9"><circle cx="${cx}" cy="${cy}" r="${s * 1.3}" fill="#59636b" stroke="#fff" stroke-width="${s * .25}"/><text x="${cx}" y="${cy + s * .55}" font-size="${s * 1.7}" text-anchor="middle" fill="#fff" font-weight="800">؟</text></g>`;
        if (o.noLabels && !p.big)
            return `<g class="pin-on"><circle cx="${cx}" cy="${cy}" r="${s * 0.9}" fill="${p.color}" stroke="#fff" stroke-width="${s * .25}"/></g>`;
        const lw = p.n.length * s * 0.98 + s * 2;
        return `<g class="pin-on"><circle cx="${cx}" cy="${cy}" r="${s * 1.3}" fill="${p.color}" stroke="#fff" stroke-width="${s * .3}"/><circle cx="${cx}" cy="${cy}" r="${s * .45}" fill="#fff"/><rect x="${cx - lw / 2}" y="${cy + (pi % 2 ? s * 1.7 : -s * 4.4)}" width="${lw}" height="${s * 2.6}" rx="${s * .6}" fill="#14213d" fill-opacity=".92"/><text x="${cx}" y="${cy + (pi % 2 ? s * 3.55 : -s * 2.55)}" font-size="${s * 1.75}" text-anchor="middle" fill="#fff" font-weight="700">${p.n}</text></g>`;
    }).join('');
    const id = o.id || 'm';
    const fog = o.noFog ? '' : `<defs><filter id="bl${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${s * 3.2}"/></filter><mask id="mk${id}"><rect x="${vx - 200}" y="${vy - 200}" width="${vw + 400}" height="${vh + 400}" fill="#fff"/><g filter="url(#bl${id})">${holes}</g></mask></defs><rect x="${vx - 200}" y="${vy - 200}" width="${vw + 400}" height="${vh + 400}" fill="#9aa3aa" mask="url(#mk${id})" class="fog"/>`;
    return `<svg class="map" viewBox="${vx} ${vy} ${vw} ${vh}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="خريطة"><rect x="${vx - 200}" y="${vy - 200}" width="${vw + 400}" height="${vh + 400}" fill="#bcd9ea"/>${countries}${polys}${rivers}${labs}${rl.map((r) => '').join('')}${fog}${pins}</svg>`;
}
function homeMap() {
    const holes = [], ext = [], pins = [];
    for (let i = 1; i <= 5; i++)
        if (P.stars[i - 1] > 0) {
            holes.push(PLACES[i].hole);
            const e = PLACES[i].ext;
            ext.push({ iso: e.iso, poly: e.poly, color: STAGES[i - 1].color });
            PLACES[i].pins.forEach((p) => pins.push({ n: p[0], lat: p[1], lon: p[2], on: true, color: STAGES[i - 1].color }));
        }
    pins.push({ n: EGYPT[0], lat: EGYPT[1], lon: EGYPT[2], on: true, color: '#c9981a', big: true });
    holes.push([31, 29, 6, 5]);
    if (P.stars.slice(0, 5).every((x) => x > 0)) {
        holes.push([55, 30, 90, 30]);
    }
    // order so that smaller stage areas draw over bigger
    ext.sort((a, b) => (b.iso ? b.iso.length : 0) - (a.iso ? a.iso.length : 0));
    return mapSVG({ win: HOME.win, holes, extents: ext, pins, labels: false, id: 'h', noLabels: true });
}
function stageMap(si, revealed, done) {
    const st = PLACES[si];
    const c = STAGES[si - 1].color;
    const holes = [];
    st.pins.forEach((p, i) => { if (i < revealed || done)
        holes.push([p[2], p[1], (st.win[2] - st.win[0]) / 6, (st.win[3] - st.win[1]) / 5]); });
    for (let i = 1; i <= 5; i++)
        if (i !== si && P.stars[i - 1] > 0)
            holes.push(PLACES[i].hole);
    holes.push([EGYPT[2], EGYPT[1], 3, 3]);
    const extents = done ? [{ iso: st.ext.iso, poly: st.ext.poly, color: c }] : [];
    const pins = st.pins.map((p, i) => ({ n: p[0], lat: p[1], lon: p[2], on: i < revealed || done, color: c }));
    if (EGYPT[2] >= st.win[0] && EGYPT[2] <= st.win[2] && EGYPT[1] >= st.win[1] && EGYPT[1] <= st.win[3])
        pins.push({ n: 'مصر', lat: EGYPT[1], lon: EGYPT[2], on: true, color: '#c9981a' });
    return mapSVG({ win: st.win, holes, extents, pins, labels: true, id: 's' + si, riverLabels: [] });
}
const root = () => document.getElementById('imp-root');
const totalStars = () => P.stars.reduce((a, b) => a + b, 0);
const cleared = (i) => P.stars[i] > 0;
const unlocked = (i) => (i === 0 ? true : i < 5 ? cleared(i - 1) : i === 5 ? P.stars.slice(0, 5).every((x) => x > 0) : false);
function header() {
    return `<header class="imp-head"><div class="imp-logo">${faceImg(44)}</div><div class="imp-title"><b>إمبراطورية مستر جاد</b><span>أ. محمد جمال جاد، مدرس الدراسات الاجتماعية</span></div><button class="imp-mute" data-act="mute" aria-label="الصوت">${P.mute ? '🔇' : '🔊'}</button></header>`;
}
function footer() { return `<footer class="imp-foot">هنلعب بالدراسات لعب! · الصف الثاني الإعدادي · الوحدة الثانية</footer>`; }
function render() {
    const el = root();
    if (!el)
        return;
    save();
    let h = '';
    if (V.v === 'name')
        h = nameScreen();
    else if (V.v === 'prologue')
        h = prologue();
    else if (V.v === 'home')
        h = home();
    else if (V.v === 'brief')
        h = brief();
    else if (V.v === 'play')
        h = play();
    else if (V.v === 'shop')
        h = shop();
    else if (V.v === 'result')
        h = result();
    else if (V.v === 'fail')
        h = fail();
    else if (V.v === 'ending')
        h = ending();
    el.innerHTML = `<div class="imp-wrap">${V.v === 'prologue' || V.v === 'name' ? '' : header()}${h}${footer()}</div>`;
    if (!first) {
        try {
            el.scrollIntoView({ block: 'start' });
        }
        catch (e) { }
    }
    first = false;
    const sc = el.querySelector('.imp-scroll');
    if (sc) {
        const W = sc.scrollWidth, vw = sc.clientWidth, f = 0.46;
        sc.scrollLeft = (f * W - vw / 2) - (W - vw);
    }
}
function go(v, extra) { V = Object.assign({ v }, extra || {}); render(); }
function nameScreen() {
    return `<section class="imp-pro"><div class="imp-pro-fog"></div><div class="imp-pro-top">${faceImg(104, 'big')}<h1>إمبراطورية مستر جاد</h1><p class="imp-sub">أ. محمد جمال جاد · مدرس الدراسات الاجتماعية</p></div><div class="imp-pro-box"><p class="imp-story" style="min-height:0">اقترب يا بطل. الأطلس لا يفتح إلا لمن يقول اسمه. ما اسم ملكنا الجديد؟</p><input id="imp-name" class="imp-input" maxlength="14" placeholder="اكتب اسمك هنا" autocomplete="off"><button class="imp-btn" data-act="setName">تتويجي ملكًا 👑</button></div></section>`;
}
function prologue() {
    const t = PROLOGUE[V.p].replace(/\{N\}/g, KN());
    const last = V.p === PROLOGUE.length - 1;
    return `<section class="imp-pro"><div class="imp-pro-fog"></div><div class="imp-pro-top">${faceImg(104, 'big')}<h1>إمبراطورية مستر جاد</h1><p class="imp-sub">أ. محمد جمال جاد · مدرس الدراسات الاجتماعية</p></div><div class="imp-pro-box"><div class="imp-pro-n">الفصل الأول · ${V.p + 1} / ${PROLOGUE.length}</div><p class="imp-story">${t.replace(/\n/g, '<br>')}</p><button class="imp-btn" data-act="${last ? 'toHome' : 'proNext'}">${last ? 'افتح الأطلس' : 'التالي'}</button>${V.p === 0 ? '' : '<button class="imp-link" data-act="toHome">عدّي القصة</button>'}</div></section>`;
}
function objReport() {
    return Object.keys(OBJ).map((k) => { const a = P.acc[k] || { c: 0, t: 0 }; const pc = a.t ? Math.round((a.c / a.t) * 100) : 0; return `<div class="imp-obj"><span>${OBJ[k].i} ${OBJ[k].n}</span><div class="imp-bar"><i style="width:${pc}%"></i></div><em>${a.t ? pc + '%' : '--'}</em></div>`; }).join('');
}
function home() {
    const ts = totalStars();
    const cards = STAGES.concat([BOSS]).map((st, i) => {
        const un = unlocked(i), s = P.stars[i];
        const stars = [0, 1, 2].map((k) => `<b class="${k < s ? 'on' : ''}">★</b>`).join('');
        return `<button class="imp-stage ${un ? '' : 'lock'}" style="--c:${st.color};--bg:${st.bg}" data-act="${un ? 'stage' : 'none'}" data-i="${i}"><span class="ic">${un ? st.icon : '🔒'}</span><span class="tx"><b>${i === 5 ? 'المرحلة الأخيرة: ' : 'المرحلة ' + (i + 1) + ': '}${st.name}</b><small>${un ? st.sub : 'خلّص اللي قبلها عشان تفتح'}</small></span><span class="st">${stars}</span></button>`;
    }).join('');
    const tr = STAGES.concat([BOSS]).map((st, i) => `<div class="imp-tr ${P.treasures[i] ? 'on' : ''}"><span>${P.treasures[i] ? st.treasure.i : '❔'}</span><small>${P.treasures[i] ? st.treasure.n : 'كنز مخفي'}</small></div>`).join('');
    const ac = ACH.map((a) => `<div class="imp-ach ${P.ach[a[0]] ? 'on' : ''}"><span>${P.ach[a[0]] ? a[1] : '🔒'}</span><b>${a[2]}</b><small>${a[3]}</small></div>`).join('');
    return `<section class="imp-card imp-hero"><div class="imp-rank"><small>${king()}</small><b>${rankOf(ts)}</b></div><div class="imp-rank r2"><small>النجوم</small><b>${ts} من ١٨</b></div></section>
  <section class="imp-card"><h2>أطلس الإمبراطورية</h2><p class="imp-note">الضباب يغطي الأماكن التي لم تُستعد بعد. كل مرحلة تفتح أماكن جديدة وتُظهر اتساع الحضارة. حدود الحضارات تقريبية فوق خريطة الدول الحالية.</p><div class="imp-mapbox wide"><div class="imp-scroll">${homeMap()}</div></div></section>
  <section class="imp-card"><h2>المراحل</h2><div class="imp-stages">${cards}</div></section>
  <section class="imp-card imp-soon"><div class="imp-lockbig">🔒</div><div><h2>الوحدة الرابعة: حضارات أوروبا القديمة</h2>${narr('في آخر الأطلس صفحة لسه مقفولة، وضباب أبيض بيلمع من ورا القفل. الراديو بيهمس: «الجزء الجاي من الحكاية في الغرب». تحديث جديد هيضيف حضارات أوروبا القديمة، الوحدة الرابعة. استنى يا ملك {N}… قريب جدًا.')}<span class="imp-badge">قريبًا: تحديث الوحدة الرابعة</span></div></section>
  <section class="imp-card"><h2>أهداف الوحدة</h2><p class="imp-note">نسبة تحقيقك لكل هدف تعليمي من أسئلتك.</p>${objReport()}</section>
  <section class="imp-card"><h2>الكنوز</h2><div class="imp-trs">${tr}</div></section>
  <section class="imp-card"><h2>الأوسمة</h2><div class="imp-achs">${ac}</div></section>`;
}
function startStage(i) {
    const st = i === 5 ? BOSS : STAGES[i];
    let qs;
    if (i === 5) {
        const all = STAGES.flatMap((s) => s.qs);
        qs = sh(all).slice(0, 10);
    }
    else
        qs = STAGES[i].qs.slice();
    qs = qs.map((q) => { if (q.t === 'tf')
        return Object.assign({}, q, { order: [0, 1] }); return Object.assign({}, q, { order: sh(q.opts.map((_, k) => k)) }); });
    R = { i, qs, qi: 0, lives: 3, coins: 0, streak: 0, ok: 0, bad: 0, dom: { pol: 0, eco: 0, soc: 0, rel: 0, sci: 0 }, proj: {}, revealed: 0, ph: 'q', pick: null, shopped: false, gained: [], bestStreak: 0 };
    go('brief');
}
function brief() {
    const i = R.i, st = i === 5 ? BOSS : STAGES[i];
    if (i === 5)
        return `<section class="imp-card" style="--c:${st.color};--bg:${st.bg}"><div class="imp-chap">${st.icon} ${st.name}</div>${narr(BRIEF[6])}<p class="imp-rules">١٠ أسئلة عشوائية من الوحدة كلها. معاك ٣ قلوب. ١٠/١٠ = ٣ نجوم.</p><button class="imp-btn" data-act="begin">ابدأ الامتحان الشامل</button><button class="imp-link" data-act="toHome">ارجع للأطلس</button></section>`;
    const objs = [...new Set(st.qs.map((q) => q.o))].map((o) => `<li>${OBJ[o].i} ${OBJ[o].n}</li>`).join('');
    return `<section class="imp-card" style="--c:${st.color};--bg:${st.bg}"><div class="imp-chap">${st.icon} المرحلة ${i + 1}: ${st.name}</div><p class="imp-lesson">${st.lesson}</p>${narr(BRIEF[i + 1])}<div class="imp-mapbox">${stageMap(i + 1, 0, false)}</div><p class="imp-note">${st.intro}</p><h3>أهداف المرحلة</h3><ul class="imp-list">${objs}</ul><h3>خطة النجاح</h3><ul class="imp-list"><li>جاوب صح عشان ترفع مجالات الحضارة الخمسة وتكسب عملات.</li><li>استثمر العملات في مشروعات بين الأسئلة.</li><li>نجمة: خلّص المرحلة. نجمتين: كل مجال ٢ أو أكتر. ٣ نجوم: كل مجال ٣ أو أكتر.</li><li>معاك ٣ قلوب. كل غلطة بتكلّفك قلب.</li></ul><button class="imp-btn" data-act="begin">ابدأ</button><button class="imp-link" data-act="toHome">ارجع للأطلس</button></section>`;
}
const hud = () => `<div class="imp-hud"><span class="hl">${'❤️'.repeat(R.lives)}${'🖤'.repeat(3 - R.lives)}</span><span>🪙 ${R.coins}</span><span>🔥 ${R.streak}</span><span>${Math.min(R.qi + 1, R.qs.length)} من ${R.qs.length}</span></div>`;
const doms = () => R.i === 5 ? '' : `<div class="imp-doms">${DK.map((d) => `<div class="imp-dom"><span>${DOM[d].i}</span><small>${DOM[d].n}</small><div class="pips">${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= R.dom[d] ? 'on' : ''} ${k === 3 ? 'm' : ''}"></i>`).join('')}</div></div>`).join('')}</div>`;
function play() {
    const q = R.qs[R.qi];
    const st = R.i === 5 ? BOSS : STAGES[R.i];
    const map = R.i === 5 ? '' : `<div class="imp-mapbox sm">${stageMap(R.i + 1, R.revealed, false)}</div>`;
    const opts = q.order.map((k, n) => {
        let cls = '';
        if (R.ph === 'fb') {
            if (k === q.a)
                cls = 'right';
            else if (k === R.pick)
                cls = 'wrong';
            else
                cls = 'dim';
        }
        return `<button class="imp-opt ${cls}" data-act="${R.ph === 'fb' ? 'none' : 'ans'}" data-k="${k}"><b>${q.t === 'tf' ? (k === 0 ? '✔' : '✖') : ['أ', 'ب', 'ج', 'د'][n]}</b><span>${q.opts[k]}</span></button>`;
    }).join('');
    let fb = '';
    if (R.ph === 'fb') {
        const ok = R.pick === q.a;
        const rx = (ok ? RX_OK : RX_NO)[R.qi % (ok ? RX_OK.length : RX_NO.length)].replace(/\{N\}/g, KN());
        fb = `<div class="imp-fb ${ok ? 'ok' : 'no'}"><div class="imp-rx">${faceImg(40, ok ? 'happy' : 'sad')}<span>${rx}</span></div><b>${ok ? 'إجابة صح! الضباب بيتراجع ✨' : 'إجابة غلط. خسرت قلب 💔'}</b>${ok ? `<div class="gain">+٢ 🪙 · ${DOM[q.d].i} ${DOM[q.d].n} +١${R.last && R.last.bonus ? ' · مكافأة السلسلة +١ 🔥' : ''}</div>` : ''}<p>${q.why}</p><button class="imp-btn" data-act="next">${R.lives <= 0 ? 'الحضارة وقعت للأسف' : 'التالي'}</button></div>`;
    }
    return `<section class="imp-card imp-play" style="--c:${st.color};--bg:${st.bg}">${hud()}${map}${doms()}<div class="imp-q"><div class="imp-tag">${OBJ[q.o].i} ${OBJ[q.o].n}</div><h2>${q.q}</h2><div class="imp-opts">${opts}</div>${fb}</div></section>`;
}
function answer(k) {
    const q = R.qs[R.qi];
    R.pick = k;
    const ok = k === q.a;
    R.ph = 'fb';
    R.last = { ok };
    const a = P.acc[q.o] = P.acc[q.o] || { c: 0, t: 0 };
    a.t++;
    if (ok) {
        a.c++;
        R.ok++;
        R.streak++;
        R.bestStreak = Math.max(R.bestStreak, R.streak);
        R.coins += 2;
        R.dom[q.d] = Math.min(5, R.dom[q.d] + 1);
        if (R.i !== 5 && R.streak >= 3) {
            R.coins++;
            R.last.bonus = true;
        }
        if (R.i !== 5)
            R.revealed = Math.min(PLACES[R.i + 1].pins.length, R.revealed + 1);
        if (R.streak >= 5)
            unlock('streak5');
    }
    else {
        R.bad++;
        R.lives--;
        R.streak = 0;
    }
    sfx(ok ? (R.last.bonus ? 'star' : 'ok') : 'no');
    render();
}
function next() {
    if (R.lives <= 0)
        return go('fail');
    R.qi++;
    R.ph = 'q';
    R.pick = null;
    const n = R.qs.length;
    if (R.i !== 5 && !R.shopped && R.qi === Math.ceil(n / 2)) {
        R.shopped = true;
        return go('shop');
    }
    if (R.qi >= n) {
        if (R.i === 5)
            return finish();
        return go('shop', { final: true });
    }
    render();
}
const LV = [2, 4];
function shop() {
    const st = STAGES[R.i];
    const items = DK.map((d) => { const l = R.proj[d] || 0; const cost = LV[l]; const can = cost !== undefined && R.coins >= cost; return `<button class="imp-proj ${l >= 2 ? 'max' : ''}" data-act="${can ? 'buy' : 'none'}" data-d="${d}" ${can ? '' : 'disabled'}><span class="pi">${DOM[d].i}</span><span class="pt"><b>${st.projects[d]}</b><small>${DOM[d].n} +١ · المستوى ${l} من ٢</small></span><span class="pc">${l >= 2 ? 'مكتمل' : '🪙 ' + cost}</span></button>`; }).join('');
    const final = V.final;
    const weak = DK.filter((d) => R.dom[d] + (R.proj[d] || 0) < 3).map((d) => DOM[d].n);
    return `<section class="imp-card imp-play" style="--c:${st.color};--bg:${st.bg}">${hud()}<h2>${final ? 'القرار الأخير: استثمر خزينتك' : 'قرار استراتيجي: ابنِ مشروعًا'}</h2><p class="imp-note">عملاتك: <b>${R.coins} 🪙</b>. كل مشروع يرفع مجالًا من مجالات الحضارة. ${final ? 'بعد هذه الخطوة تظهر نتيجة المرحلة.' : 'ستعود لإكمال الأسئلة بعد ذلك.'}</p>${doms()}${weak.length ? `<p class="imp-hint">💡 مجالات ما زالت تحتاج دعمًا: ${weak.join('، ')}</p>` : '<p class="imp-hint ok">✅ كل المجالات وصلت للمستوى ٣ أو أكثر!</p>'}<div class="imp-projs">${items}</div><button class="imp-btn" data-act="${final ? 'finish' : 'cont'}">${final ? 'عرض النتيجة' : 'أكمل الأسئلة'}</button></section>`;
}
function buy(d) {
    const l = R.proj[d] || 0, c = LV[l];
    if (c === undefined || R.coins < c)
        return;
    R.coins -= c;
    R.proj[d] = l + 1;
    R.dom[d] = Math.min(5, R.dom[d] + 1);
    render();
}
function unlock(k) { if (!P.ach[k]) {
    P.ach[k] = true;
    if (R)
        R.gained.push(k);
} }
function finish() {
    const i = R.i;
    let stars;
    if (i === 5)
        stars = R.ok >= 10 ? 3 : R.ok >= 8 ? 2 : R.ok >= 6 ? 1 : 0;
    else {
        const mn = Math.min(...DK.map((d) => R.dom[d]));
        stars = 1 + (mn >= 2 ? 1 : 0) + (mn >= 3 ? 1 : 0);
    }
    R.stars = stars;
    if (stars > 0) {
        P.stars[i] = Math.max(P.stars[i], stars);
        P.treasures[i] = true;
        unlock('first');
        if (R.bad === 0)
            unlock('perfect');
        if (totalStars() >= 9)
            unlock('stars9');
        if (P.stars.slice(0, 5).every((x) => x > 0))
            unlock('all5');
        if (i === 5)
            unlock('boss');
        go('result');
    }
    else
        go('fail');
}
function result() {
    const i = R.i, st = i === 5 ? BOSS : STAGES[i];
    const stars = [0, 1, 2].map((k) => `<b class="${k < R.stars ? 'on' : ''}">★</b>`).join('');
    const gained = R.gained.map((k) => { const a = ACH.find((x) => x[0] === k); return `<div class="imp-new">${a[1]} وسام جديد: <b>${a[2]}</b></div>`; }).join('');
    const last = i === 5;
    const sc = i === 5 ? `<p class="imp-note">إجاباتك الصحيحة: ${R.ok} من ${R.qs.length}</p>` : `${doms()}<div class="imp-mapbox">${stageMap(i + 1, 99, true)}</div><p class="imp-note">${PLACES[i + 1].ext.label}</p>`;
    const nextBtn = last ? `<button class="imp-btn" data-act="toEnding">الصفحة الأخيرة</button>` : `<button class="imp-btn" data-act="toHome">ارجع للأطلس</button>`;
    return `<section class="imp-card imp-res" style="--c:${st.color};--bg:${st.bg}"><div class="imp-chap">المرحلة رجعت ${i + 1}: ${st.name}</div><div class="imp-stars">${stars}</div>${narr(OUTRO[i + 1])}${sc}<div class="imp-reward"><span>${st.treasure.i}</span><div><small>كنز جديد في خزنتك</small><b>${st.treasure.n}</b></div></div>${gained}<h3>أهداف المرحلة</h3>${objReport()}${nextBtn}<button class="imp-link" data-act="again" data-i="${i}">أعد المرحلة عشان نجوم أكتر</button></section>`;
}
function fail() {
    const st = R.i === 5 ? BOSS : STAGES[R.i];
    return `<section class="imp-card imp-res" style="--c:${st.color};--bg:${st.bg}"><div class="imp-chap">🌫️ الضباب بلع المنطقة</div><p class="imp-story">${narr('قلوبك خلصت والضباب غطّى المنطقة! بس ماتقلقش يا ملك {N}، الخريطة لسه موجودة. راجع غلطاتك وحاول تاني، الحارس عمره ما بيستسلم.')}<button class="imp-btn" data-act="again" data-i="${R.i}">حاول تاني</button><button class="imp-link" data-act="toHome">ارجع للأطلس</button></section>`;
}
function ending() {
    const ts = totalStars();
    return `<section class="imp-card imp-res" style="--c:#3b2a7a;--bg:#eee9fb"><div class="imp-chap">👑 إمبراطورية مستر جاد</div>${narr(OUTRO[6])}${narr(ENDING)}<div class="imp-rank big"><small>${king()}</small><b>${rankOf(ts)}</b><small>${ts} من ١٨ نجمة</small></div><div class="imp-mapbox">${homeMap()}</div>${objReport()}<button class="imp-btn" data-act="toHome">ارجع للأطلس</button></section>`;
}
const actions = {
    mute: () => { P.mute = !P.mute; save(); render(); },
    setName: () => { const v = (document.getElementById('imp-name') || {}).value || ''; const n = v.trim().slice(0, 14); if (!n) {
        const i = document.getElementById('imp-name');
        if (i) {
            i.classList.add('shake');
            i.focus();
        }
        return;
    } P.name = n; save(); sfx('star'); go('prologue', { p: 0 }); },
    proNext: () => go('prologue', { p: V.p + 1 }),
    toHome: () => { R = null; go('home'); },
    none: () => { },
    stage: (e) => startStage(+e.dataset.i),
    again: (e) => startStage(+e.dataset.i),
    begin: () => go('play'),
    ans: (e) => answer(+e.dataset.k),
    next: () => next(),
    buy: (e) => buy(e.dataset.d),
    cont: () => go('play'),
    finish: () => finish(),
    toEnding: () => go('ending'),
};
export function mount(el) {
    el.id = 'imp-root';
    el.onclick = (ev) => { const b = ev.target.closest('[data-act]'); if (!b || !el.contains(b))
        return; const f = actions[b.dataset.act]; if (f)
        f(b); };
    render();
          }
