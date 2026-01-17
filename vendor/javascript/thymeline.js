function b(t) {
  if (typeof t == "string") {
    const e = /Z|[+-]\d{2}:\d{2}$/.test(t);
    let n;
    if (e)
      n = Temporal.Instant.from(t);
    else
      try {
        n = Temporal.PlainDateTime.from(t).toZonedDateTime("UTC").toInstant();
      } catch {
        n = Temporal.PlainDate.from(t).toZonedDateTime("UTC").toInstant();
      }
    return gt(n);
  }
  if (t instanceof Temporal.Instant)
    return gt(t);
  if ("year" in t && "era" in t)
    return t.era === "CE" ? t.year : -t.year;
  if ("value" in t && "unit" in t) {
    const e = Temporal.Now.plainDateISO().year;
    return t.unit === "mya" ? -(t.value * 1e6) : e - t.value;
  }
  if ("localTime" in t && "timezone" in t) {
    const e = Temporal.PlainDateTime.from(t.localTime).toZonedDateTime(t.timezone);
    return gt(e.toInstant());
  }
  throw new Error(`Unsupported time input format: ${JSON.stringify(t)}`);
}
function gt(t) {
  const n = t.toZonedDateTimeISO("UTC").year, i = Temporal.ZonedDateTime.from({
    year: n,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    timeZone: "UTC"
  }), o = Temporal.ZonedDateTime.from({
    year: n + 1,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    timeZone: "UTC"
  }).epochNanoseconds - i.epochNanoseconds, s = t.epochNanoseconds - i.toInstant().epochNanoseconds, a = Number(s) / Number(o);
  return n + a;
}
function Os(t, e) {
  if (t < -1e6)
    return `${(Math.abs(t) / 1e6).toFixed(1)} MYA`;
  if (t < -1e4)
    return `${(Math.abs(t) / 1e3).toFixed(1)} KYA`;
  if (t < 0)
    return `${Math.abs(Math.floor(t))} BCE`;
  if (t < 1e3)
    return `${Math.floor(t)} CE`;
  {
    const n = Math.floor(t);
    return e === "precise" ? hn(t).toString() : e === "historical" ? `${n} CE` : n.toString();
  }
}
function hn(t) {
  const e = Math.floor(t), n = t - e, i = Temporal.ZonedDateTime.from({
    year: e,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    timeZone: "UTC"
  }), o = Temporal.ZonedDateTime.from({
    year: e + 1,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    timeZone: "UTC"
  }).epochNanoseconds - i.epochNanoseconds, s = BigInt(Math.round(n * Number(o))), a = i.epochNanoseconds + s;
  return Temporal.Instant.fromEpochNanoseconds(a);
}
function Hs(t, e) {
  const n = e - t;
  return n > 1e6 || t < -1e6 ? "geological" : n > 1e4 || t < -1e4 ? "prehistoric" : n > 1e3 ? "historical" : n > 1 ? "modern" : "precise";
}
function Ce() {
  return gt(Temporal.Now.instant());
}
function ce(t) {
  return t.endTime === void 0 || t.endTime === null;
}
function it(t, e = !1) {
  return t == null ? e ? 1 / 0 : Ce() : b(t);
}
function dn(t, e) {
  const n = /* @__PURE__ */ new Map();
  t.forEach((m) => {
    n.set(m.id, {
      name: m.name,
      startTime: b(m.startTime),
      endTime: it(m.endTime, !0)
      // true = use Infinity for ongoing periods
    });
  });
  const i = e.filter((m) => m.type === "defined"), r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  i.forEach((m) => {
    r.has(m.fromId) || r.set(m.fromId, []), r.get(m.fromId).push(m.toId), o.has(m.toId) || o.set(m.toId, []), o.get(m.toId).push(m.fromId);
  });
  const s = [];
  (/* @__PURE__ */ new Set([
    ...i.map((m) => m.fromId),
    ...i.map((m) => m.toId)
  ])).forEach((m) => {
    o.has(m) || s.push(m);
  });
  const c = /* @__PURE__ */ new Map();
  function u(m) {
    const y = /* @__PURE__ */ new Set();
    let w = [m];
    for (; w.length > 0; ) {
      const x = [];
      for (const T of w) {
        if (y.has(T)) continue;
        y.add(T);
        const v = o.get(T) || [];
        if (v.length === 0) {
          const A = n.get(T);
          if (A)
            return { rootId: T, rootStartTime: A.startTime };
        } else
          x.push(...v);
      }
      w = x;
    }
    return null;
  }
  o.forEach((m, y) => {
    if (m.length > 1) {
      let w = null;
      for (const x of m) {
        const T = u(x);
        T && (!w || T.rootStartTime < w.rootStartTime) && (w = T);
      }
      w && c.set(y, w.rootId);
    }
  });
  const l = /* @__PURE__ */ new Set();
  function f(m, y) {
    const w = n.get(m);
    if (!w || c.has(m) && c.get(m) !== y || l.has(m))
      return null;
    l.add(m);
    const x = {
      id: m,
      name: w.name,
      startTime: w.startTime,
      endTime: w.endTime,
      children: []
    }, T = r.get(m) || [];
    for (const v of T) {
      const A = f(v, y);
      A && x.children.push(A);
    }
    return x.children.sort((v, A) => v.startTime - A.startTime), x;
  }
  const h = [], d = /* @__PURE__ */ new Set();
  function p(m, y) {
    y.add(m.id), m.children.forEach((w) => p(w, y));
  }
  for (const m of s) {
    l.clear();
    const y = f(m, m);
    if (y) {
      const w = /* @__PURE__ */ new Set();
      p(y, w), h.push({ root: y, allNodeIds: w }), w.forEach((x) => d.add(x));
    }
  }
  h.sort((m, y) => m.root.startTime - y.root.startTime);
  const g = /* @__PURE__ */ new Map();
  return n.forEach((m, y) => {
    d.has(y) || g.set(y, m);
  }), { trees: h, unconnectedPeriods: g, periodMap: n };
}
function Ot(t) {
  let e = t.endTime;
  for (const n of t.children) {
    const i = Ot(n);
    i > e && (e = i);
  }
  return e;
}
function Qt(t) {
  const e = [t], n = t.children.filter((a) => a.startTime >= t.endTime);
  if (n.length === 0)
    return e;
  let i = n[0], r = i.startTime, o = Ot(i);
  for (let a = 1; a < n.length; a++) {
    const c = n[a], u = Ot(c);
    c.startTime < r ? (i = c, r = c.startTime, o = u) : c.startTime === r && u > o && (i = c, o = u);
  }
  const s = Qt(i);
  return e.push(...s), e;
}
function mn(t) {
  const e = new Set(t.map((i) => i.id)), n = [];
  for (const i of t)
    for (const r of i.children)
      if (!e.has(r.id)) {
        const o = Qt(r);
        n.push(o);
      }
  return n;
}
function pn(t, e, n, i) {
  return t < i && n < e;
}
function Pe(t, e, n, i) {
  const r = i.find(
    (o) => o.lane === n && pn(t, e, o.startTime, o.endTime)
  );
  return r ? r.id : null;
}
function ue(t, e, n, i) {
  for (const r of t) {
    const o = Pe(r.startTime, r.endTime, e, n);
    if (o)
      return i.get(o), !1;
  }
  return !0;
}
function Rt(t, e, n) {
  for (const i of t)
    n.push({
      id: i.id,
      lane: e,
      startTime: i.startTime,
      endTime: i.endTime
    });
}
function gn(t, e, n, i) {
  const r = [], o = Qt(t.root);
  let s = e;
  const a = 100;
  let c = 0;
  for (; c < a; ) {
    if (s < 0) {
      s = 0, c++;
      continue;
    }
    const g = [...n, ...r];
    if (ue(o, s, g, i)) {
      Rt(o, s, r);
      break;
    }
    s++, c++;
  }
  const u = [{ trunk: o, parentLane: s, isAboveParent: null }], l = /* @__PURE__ */ new Map();
  l.set(o[0].id, s);
  let f = 0;
  for (; f < u.length; ) {
    const { trunk: g, parentLane: m, isAboveParent: y } = u[f], w = y === null, x = mn(g);
    x.length > 0;
    let T = 1, v = 1, A = w ? !0 : y;
    for (let Q = 0; Q < x.length; Q++) {
      const O = x[Q], Lt = O[0].id;
      let $, _ = !1;
      for (c = 0; !_ && c < a; ) {
        if (A ? $ = m + T : $ = m - v, $ < 0) {
          s++, r.length = 0, Rt(o, s, r), u.length = 1, u[0] = { trunk: o, parentLane: s, isAboveParent: null }, l.clear(), l.set(o[0].id, s), f = -1;
          break;
        }
        const L = [...n, ...r];
        if (ue(O, $, L, i)) {
          Rt(O, $, r), _ = !0, l.set(Lt, $);
          const M = $ > m;
          u.push({ trunk: O, parentLane: $, isAboveParent: M }), A ? T++ : v++, w && (A = !A);
        } else
          A ? T++ : v++;
        c++;
      }
    }
    f++;
  }
  const h = r.map((g) => g.lane), d = h.length > 0 ? Math.min(...h) : s, p = h.length > 0 ? Math.max(...h) : s;
  return { placements: r, minLane: d, maxLane: p };
}
function wn(t, e) {
  const n = [], i = Array.from(t.entries()).sort((r, o) => r[1].startTime - o[1].startTime);
  for (const [r, o] of i) {
    let s = 0;
    const a = [...e, ...n];
    for (; Pe(o.startTime, o.endTime, s, a); )
      s++;
    n.push({
      id: r,
      lane: s,
      startTime: o.startTime,
      endTime: o.endTime
    });
  }
  return n;
}
const vn = {
  name: "Succession-based",
  description: "Periods that succeed each other are placed on the same row",
  layout(t, e = []) {
    if (t.length === 0)
      return [];
    const { trees: n, unconnectedPeriods: i, periodMap: r } = dn(t, e);
    n.forEach((u, l) => {
    });
    const o = [];
    let s = 0;
    for (let u = 0; u < n.length; u++) {
      const l = n[u], { placements: f, maxLane: h } = gn(l, s, o, r);
      o.push(...f), s = h + 1;
    }
    const a = wn(i, o);
    o.push(...a);
    const c = o.map((u) => ({
      itemId: u.id,
      lane: u.lane,
      startTime: u.startTime,
      endTime: u.endTime,
      type: "period"
    }));
    return c.forEach((u) => {
    }), c;
  }
};
function yn(t, e) {
  return t < e;
}
function _n(t, e = 0) {
  const n = [], i = t.map((o) => {
    const s = b(o.time);
    return {
      id: o.id,
      time: s
    };
  });
  i.sort((o, s) => o.time - s.time);
  const r = [];
  for (const o of i) {
    let s = -1;
    for (let a = 0; a < Math.min(r.length, 3); a++)
      if (!yn(o.time, r[a].endTime)) {
        s = a;
        break;
      }
    if (s === -1 && r.length < 3)
      s = r.length, r.push({ endTime: o.time });
    else if (s === -1) {
      let a = 0, c = r[0].endTime;
      for (let u = 1; u < 3; u++)
        r[u].endTime < c && (a = u, c = r[u].endTime);
      s = a, r[s].endTime = o.time;
    } else
      r[s].endTime = o.time;
    n.push({
      itemId: o.id,
      lane: s + e,
      startTime: o.time,
      endTime: o.time,
      type: "event"
    });
  }
  return n;
}
const xn = {
  succession: vn
}, Tn = "succession";
function bn(t, e, n = Tn, i = []) {
  const r = xn[n];
  if (!r)
    throw new Error(`Unknown period layout algorithm: ${n}`);
  const o = r.layout(t, i), a = (o.length > 0 ? Math.max(...o.map((u) => u.lane)) : -1) + 1, c = _n(e, a);
  return [...o, ...c];
}
function zs(t) {
  return t.length === 0 ? 0 : Math.max(...t.map((e) => e.lane)) + 1;
}
const nt = -138e8;
function Fs(t) {
  const e = [], n = [], i = [
    ...t.events.map((o) => o.id),
    ...t.periods.map((o) => o.id),
    ...t.connectors.map((o) => o.id)
  ], r = i.filter((o, s) => i.indexOf(o) !== s);
  r.length > 0 && e.push({
    type: "error",
    message: `Duplicate IDs found: ${[...new Set(r)].join(", ")}`
  });
  for (const o of t.periods)
    try {
      const s = b(o.startTime);
      if (!ce(o)) {
        const c = it(o.endTime);
        s > c && e.push({
          type: "error",
          message: `Period "${o.name}" has start time after end time`,
          itemId: o.id
        }), c < nt && e.push({
          type: "error",
          message: `Period "${o.name}" ends before the Big Bang (13.8 billion years ago). End time: ${c.toExponential(2)}`,
          itemId: o.id
        });
      }
      s < nt && e.push({
        type: "error",
        message: `Period "${o.name}" starts before the Big Bang (13.8 billion years ago). Start time: ${s.toExponential(2)}`,
        itemId: o.id
      });
    } catch (s) {
      e.push({
        type: "error",
        message: `Period "${o.name}" has invalid time format: ${s instanceof Error ? s.message : String(s)}`,
        itemId: o.id
      });
    }
  for (const o of t.connectors) {
    const s = t.periods.find((c) => c.id === o.fromId), a = t.periods.find((c) => c.id === o.toId);
    if (!s) {
      e.push({
        type: "error",
        message: `Connector "${o.id}" references non-existent period: ${o.fromId}`,
        itemId: o.id
      });
      continue;
    }
    if (!a) {
      e.push({
        type: "error",
        message: `Connector "${o.id}" references non-existent period: ${o.toId}`,
        itemId: o.id
      });
      continue;
    }
    try {
      if (!ce(a)) {
        const c = b(s.startTime), u = it(a.endTime);
        if (c > u) {
          const l = c - u;
          n.push({
            type: "warning",
            message: `Connector "${o.id}" connects "${s.name}" → "${a.name}", but "${s.name}" starts ${l.toFixed(0)} years after "${a.name}" ends. The periods don't overlap in time.`,
            itemId: o.id
          });
        }
      }
    } catch {
    }
  }
  for (const o of t.events)
    try {
      const s = b(o.time);
      s < nt && e.push({
        type: "error",
        message: `Event "${o.name}" is set before the Big Bang (13.8 billion years ago). Time: ${s.toExponential(2)}`,
        itemId: o.id
      });
    } catch (s) {
      e.push({
        type: "error",
        message: `Event "${o.name}" has invalid time format: ${s instanceof Error ? s.message : String(s)}`,
        itemId: o.id
      });
    }
  return {
    valid: e.length === 0,
    errors: e,
    warnings: n
  };
}
function Ys(t) {
  const e = [];
  if (t.valid && t.warnings.length === 0)
    return e.push("✓ Timeline data is valid"), e.join(`
`);
  if (t.errors.length > 0) {
    e.push("✗ Timeline validation failed:"), e.push(""), e.push("Errors:");
    for (const n of t.errors)
      e.push(`  • ${n.message}`);
  }
  if (t.warnings.length > 0) {
    e.length > 0 && e.push(""), e.push("Warnings:");
    for (const n of t.warnings)
      e.push(`  ⚠ ${n.message}`);
  }
  return e.join(`
`);
}
function wt(t, e) {
  return t == null || e == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function An(t, e) {
  return t == null || e == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Ie(t) {
  let e, n, i;
  t.length !== 2 ? (e = wt, n = (a, c) => wt(t(a), c), i = (a, c) => t(a) - c) : (e = t === wt || t === An ? t : Mn, n = t, i = t);
  function r(a, c, u = 0, l = a.length) {
    if (u < l) {
      if (e(c, c) !== 0) return l;
      do {
        const f = u + l >>> 1;
        n(a[f], c) < 0 ? u = f + 1 : l = f;
      } while (u < l);
    }
    return u;
  }
  function o(a, c, u = 0, l = a.length) {
    if (u < l) {
      if (e(c, c) !== 0) return l;
      do {
        const f = u + l >>> 1;
        n(a[f], c) <= 0 ? u = f + 1 : l = f;
      } while (u < l);
    }
    return u;
  }
  function s(a, c, u = 0, l = a.length) {
    const f = r(a, c, u, l - 1);
    return f > u && i(a[f - 1], c) > -i(a[f], c) ? f - 1 : f;
  }
  return { left: r, center: s, right: o };
}
function Mn() {
  return 0;
}
function Nn(t) {
  return t === null ? NaN : +t;
}
const $n = Ie(wt), Sn = $n.right;
Ie(Nn).center;
const En = Math.sqrt(50), kn = Math.sqrt(10), Cn = Math.sqrt(2);
function xt(t, e, n) {
  const i = (e - t) / Math.max(0, n), r = Math.floor(Math.log10(i)), o = i / Math.pow(10, r), s = o >= En ? 10 : o >= kn ? 5 : o >= Cn ? 2 : 1;
  let a, c, u;
  return r < 0 ? (u = Math.pow(10, -r) / s, a = Math.round(t * u), c = Math.round(e * u), a / u < t && ++a, c / u > e && --c, u = -u) : (u = Math.pow(10, r) * s, a = Math.round(t / u), c = Math.round(e / u), a * u < t && ++a, c * u > e && --c), c < a && 0.5 <= n && n < 2 ? xt(t, e, n * 2) : [a, c, u];
}
function Pn(t, e, n) {
  if (e = +e, t = +t, n = +n, !(n > 0)) return [];
  if (t === e) return [t];
  const i = e < t, [r, o, s] = i ? xt(e, t, n) : xt(t, e, n);
  if (!(o >= r)) return [];
  const a = o - r + 1, c = new Array(a);
  if (i)
    if (s < 0) for (let u = 0; u < a; ++u) c[u] = (o - u) / -s;
    else for (let u = 0; u < a; ++u) c[u] = (o - u) * s;
  else if (s < 0) for (let u = 0; u < a; ++u) c[u] = (r + u) / -s;
  else for (let u = 0; u < a; ++u) c[u] = (r + u) * s;
  return c;
}
function Ht(t, e, n) {
  return e = +e, t = +t, n = +n, xt(t, e, n)[2];
}
function In(t, e, n) {
  e = +e, t = +t, n = +n;
  const i = e < t, r = i ? Ht(e, t, n) : Ht(t, e, n);
  return (i ? -1 : 1) * (r < 0 ? 1 / -r : r);
}
var Ln = { value: () => {
} };
function Le() {
  for (var t = 0, e = arguments.length, n = {}, i; t < e; ++t) {
    if (!(i = arguments[t] + "") || i in n || /[\s.]/.test(i)) throw new Error("illegal type: " + i);
    n[i] = [];
  }
  return new vt(n);
}
function vt(t) {
  this._ = t;
}
function Rn(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var i = "", r = n.indexOf(".");
    if (r >= 0 && (i = n.slice(r + 1), n = n.slice(0, r)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: i };
  });
}
vt.prototype = Le.prototype = {
  constructor: vt,
  on: function(t, e) {
    var n = this._, i = Rn(t + "", n), r, o = -1, s = i.length;
    if (arguments.length < 2) {
      for (; ++o < s; ) if ((r = (t = i[o]).type) && (r = Dn(n[r], t.name))) return r;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++o < s; )
      if (r = (t = i[o]).type) n[r] = le(n[r], t.name, e);
      else if (e == null) for (r in n) n[r] = le(n[r], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new vt(t);
  },
  call: function(t, e) {
    if ((r = arguments.length - 2) > 0) for (var n = new Array(r), i = 0, r, o; i < r; ++i) n[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (o = this._[t], i = 0, r = o.length; i < r; ++i) o[i].value.apply(e, n);
  },
  apply: function(t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (var i = this._[t], r = 0, o = i.length; r < o; ++r) i[r].value.apply(e, n);
  }
};
function Dn(t, e) {
  for (var n = 0, i = t.length, r; n < i; ++n)
    if ((r = t[n]).name === e)
      return r.value;
}
function le(t, e, n) {
  for (var i = 0, r = t.length; i < r; ++i)
    if (t[i].name === e) {
      t[i] = Ln, t = t.slice(0, i).concat(t.slice(i + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var zt = "http://www.w3.org/1999/xhtml";
const fe = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: zt,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Ct(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), fe.hasOwnProperty(e) ? { space: fe[e], local: t } : t;
}
function Xn(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === zt && e.documentElement.namespaceURI === zt ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function On(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Re(t) {
  var e = Ct(t);
  return (e.local ? On : Xn)(e);
}
function Hn() {
}
function Jt(t) {
  return t == null ? Hn : function() {
    return this.querySelector(t);
  };
}
function zn(t) {
  typeof t != "function" && (t = Jt(t));
  for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
    for (var o = e[r], s = o.length, a = i[r] = new Array(s), c, u, l = 0; l < s; ++l)
      (c = o[l]) && (u = t.call(c, c.__data__, l, o)) && ("__data__" in c && (u.__data__ = c.__data__), a[l] = u);
  return new k(i, this._parents);
}
function Fn(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Yn() {
  return [];
}
function De(t) {
  return t == null ? Yn : function() {
    return this.querySelectorAll(t);
  };
}
function Bn(t) {
  return function() {
    return Fn(t.apply(this, arguments));
  };
}
function Vn(t) {
  typeof t == "function" ? t = Bn(t) : t = De(t);
  for (var e = this._groups, n = e.length, i = [], r = [], o = 0; o < n; ++o)
    for (var s = e[o], a = s.length, c, u = 0; u < a; ++u)
      (c = s[u]) && (i.push(t.call(c, c.__data__, u, s)), r.push(c));
  return new k(i, r);
}
function Xe(t) {
  return function() {
    return this.matches(t);
  };
}
function Oe(t) {
  return function(e) {
    return e.matches(t);
  };
}
var qn = Array.prototype.find;
function Zn(t) {
  return function() {
    return qn.call(this.children, t);
  };
}
function Gn() {
  return this.firstElementChild;
}
function Un(t) {
  return this.select(t == null ? Gn : Zn(typeof t == "function" ? t : Oe(t)));
}
var Wn = Array.prototype.filter;
function Kn() {
  return Array.from(this.children);
}
function Qn(t) {
  return function() {
    return Wn.call(this.children, t);
  };
}
function Jn(t) {
  return this.selectAll(t == null ? Kn : Qn(typeof t == "function" ? t : Oe(t)));
}
function jn(t) {
  typeof t != "function" && (t = Xe(t));
  for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
    for (var o = e[r], s = o.length, a = i[r] = [], c, u = 0; u < s; ++u)
      (c = o[u]) && t.call(c, c.__data__, u, o) && a.push(c);
  return new k(i, this._parents);
}
function He(t) {
  return new Array(t.length);
}
function ti() {
  return new k(this._enter || this._groups.map(He), this._parents);
}
function Tt(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
Tt.prototype = {
  constructor: Tt,
  appendChild: function(t) {
    return this._parent.insertBefore(t, this._next);
  },
  insertBefore: function(t, e) {
    return this._parent.insertBefore(t, e);
  },
  querySelector: function(t) {
    return this._parent.querySelector(t);
  },
  querySelectorAll: function(t) {
    return this._parent.querySelectorAll(t);
  }
};
function ei(t) {
  return function() {
    return t;
  };
}
function ni(t, e, n, i, r, o) {
  for (var s = 0, a, c = e.length, u = o.length; s < u; ++s)
    (a = e[s]) ? (a.__data__ = o[s], i[s] = a) : n[s] = new Tt(t, o[s]);
  for (; s < c; ++s)
    (a = e[s]) && (r[s] = a);
}
function ii(t, e, n, i, r, o, s) {
  var a, c, u = /* @__PURE__ */ new Map(), l = e.length, f = o.length, h = new Array(l), d;
  for (a = 0; a < l; ++a)
    (c = e[a]) && (h[a] = d = s.call(c, c.__data__, a, e) + "", u.has(d) ? r[a] = c : u.set(d, c));
  for (a = 0; a < f; ++a)
    d = s.call(t, o[a], a, o) + "", (c = u.get(d)) ? (i[a] = c, c.__data__ = o[a], u.delete(d)) : n[a] = new Tt(t, o[a]);
  for (a = 0; a < l; ++a)
    (c = e[a]) && u.get(h[a]) === c && (r[a] = c);
}
function ri(t) {
  return t.__data__;
}
function oi(t, e) {
  if (!arguments.length) return Array.from(this, ri);
  var n = e ? ii : ni, i = this._parents, r = this._groups;
  typeof t != "function" && (t = ei(t));
  for (var o = r.length, s = new Array(o), a = new Array(o), c = new Array(o), u = 0; u < o; ++u) {
    var l = i[u], f = r[u], h = f.length, d = si(t.call(l, l && l.__data__, u, i)), p = d.length, g = a[u] = new Array(p), m = s[u] = new Array(p), y = c[u] = new Array(h);
    n(l, f, g, m, y, d, e);
    for (var w = 0, x = 0, T, v; w < p; ++w)
      if (T = g[w]) {
        for (w >= x && (x = w + 1); !(v = m[x]) && ++x < p; ) ;
        T._next = v || null;
      }
  }
  return s = new k(s, i), s._enter = a, s._exit = c, s;
}
function si(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function ai() {
  return new k(this._exit || this._groups.map(He), this._parents);
}
function ci(t, e, n) {
  var i = this.enter(), r = this, o = this.exit();
  return typeof t == "function" ? (i = t(i), i && (i = i.selection())) : i = i.append(t + ""), e != null && (r = e(r), r && (r = r.selection())), n == null ? o.remove() : n(o), i && r ? i.merge(r).order() : r;
}
function ui(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, i = e._groups, r = n.length, o = i.length, s = Math.min(r, o), a = new Array(r), c = 0; c < s; ++c)
    for (var u = n[c], l = i[c], f = u.length, h = a[c] = new Array(f), d, p = 0; p < f; ++p)
      (d = u[p] || l[p]) && (h[p] = d);
  for (; c < r; ++c)
    a[c] = n[c];
  return new k(a, this._parents);
}
function li() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var i = t[e], r = i.length - 1, o = i[r], s; --r >= 0; )
      (s = i[r]) && (o && s.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(s, o), o = s);
  return this;
}
function fi(t) {
  t || (t = hi);
  function e(f, h) {
    return f && h ? t(f.__data__, h.__data__) : !f - !h;
  }
  for (var n = this._groups, i = n.length, r = new Array(i), o = 0; o < i; ++o) {
    for (var s = n[o], a = s.length, c = r[o] = new Array(a), u, l = 0; l < a; ++l)
      (u = s[l]) && (c[l] = u);
    c.sort(e);
  }
  return new k(r, this._parents).order();
}
function hi(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function di() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function mi() {
  return Array.from(this);
}
function pi() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var i = t[e], r = 0, o = i.length; r < o; ++r) {
      var s = i[r];
      if (s) return s;
    }
  return null;
}
function gi() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function wi() {
  return !this.node();
}
function vi(t) {
  for (var e = this._groups, n = 0, i = e.length; n < i; ++n)
    for (var r = e[n], o = 0, s = r.length, a; o < s; ++o)
      (a = r[o]) && t.call(a, a.__data__, o, r);
  return this;
}
function yi(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function _i(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function xi(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function Ti(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function bi(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function Ai(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function Mi(t, e) {
  var n = Ct(t);
  if (arguments.length < 2) {
    var i = this.node();
    return n.local ? i.getAttributeNS(n.space, n.local) : i.getAttribute(n);
  }
  return this.each((e == null ? n.local ? _i : yi : typeof e == "function" ? n.local ? Ai : bi : n.local ? Ti : xi)(n, e));
}
function ze(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function Ni(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function $i(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function Si(t, e, n) {
  return function() {
    var i = e.apply(this, arguments);
    i == null ? this.style.removeProperty(t) : this.style.setProperty(t, i, n);
  };
}
function Ei(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? Ni : typeof e == "function" ? Si : $i)(t, e, n ?? "")) : U(this.node(), t);
}
function U(t, e) {
  return t.style.getPropertyValue(e) || ze(t).getComputedStyle(t, null).getPropertyValue(e);
}
function ki(t) {
  return function() {
    delete this[t];
  };
}
function Ci(t, e) {
  return function() {
    this[t] = e;
  };
}
function Pi(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function Ii(t, e) {
  return arguments.length > 1 ? this.each((e == null ? ki : typeof e == "function" ? Pi : Ci)(t, e)) : this.node()[t];
}
function Fe(t) {
  return t.trim().split(/^|\s+/);
}
function jt(t) {
  return t.classList || new Ye(t);
}
function Ye(t) {
  this._node = t, this._names = Fe(t.getAttribute("class") || "");
}
Ye.prototype = {
  add: function(t) {
    var e = this._names.indexOf(t);
    e < 0 && (this._names.push(t), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(t) {
    var e = this._names.indexOf(t);
    e >= 0 && (this._names.splice(e, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(t) {
    return this._names.indexOf(t) >= 0;
  }
};
function Be(t, e) {
  for (var n = jt(t), i = -1, r = e.length; ++i < r; ) n.add(e[i]);
}
function Ve(t, e) {
  for (var n = jt(t), i = -1, r = e.length; ++i < r; ) n.remove(e[i]);
}
function Li(t) {
  return function() {
    Be(this, t);
  };
}
function Ri(t) {
  return function() {
    Ve(this, t);
  };
}
function Di(t, e) {
  return function() {
    (e.apply(this, arguments) ? Be : Ve)(this, t);
  };
}
function Xi(t, e) {
  var n = Fe(t + "");
  if (arguments.length < 2) {
    for (var i = jt(this.node()), r = -1, o = n.length; ++r < o; ) if (!i.contains(n[r])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? Di : e ? Li : Ri)(n, e));
}
function Oi() {
  this.textContent = "";
}
function Hi(t) {
  return function() {
    this.textContent = t;
  };
}
function zi(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Fi(t) {
  return arguments.length ? this.each(t == null ? Oi : (typeof t == "function" ? zi : Hi)(t)) : this.node().textContent;
}
function Yi() {
  this.innerHTML = "";
}
function Bi(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Vi(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function qi(t) {
  return arguments.length ? this.each(t == null ? Yi : (typeof t == "function" ? Vi : Bi)(t)) : this.node().innerHTML;
}
function Zi() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Gi() {
  return this.each(Zi);
}
function Ui() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Wi() {
  return this.each(Ui);
}
function Ki(t) {
  var e = typeof t == "function" ? t : Re(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Qi() {
  return null;
}
function Ji(t, e) {
  var n = typeof t == "function" ? t : Re(t), i = e == null ? Qi : typeof e == "function" ? e : Jt(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), i.apply(this, arguments) || null);
  });
}
function ji() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function tr() {
  return this.each(ji);
}
function er() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function nr() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function ir(t) {
  return this.select(t ? nr : er);
}
function rr(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function or(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function sr(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", i = e.indexOf(".");
    return i >= 0 && (n = e.slice(i + 1), e = e.slice(0, i)), { type: e, name: n };
  });
}
function ar(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, i = -1, r = e.length, o; n < r; ++n)
        o = e[n], (!t.type || o.type === t.type) && o.name === t.name ? this.removeEventListener(o.type, o.listener, o.options) : e[++i] = o;
      ++i ? e.length = i : delete this.__on;
    }
  };
}
function cr(t, e, n) {
  return function() {
    var i = this.__on, r, o = or(e);
    if (i) {
      for (var s = 0, a = i.length; s < a; ++s)
        if ((r = i[s]).type === t.type && r.name === t.name) {
          this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, r.listener = o, r.options = n), r.value = e;
          return;
        }
    }
    this.addEventListener(t.type, o, n), r = { type: t.type, name: t.name, value: e, listener: o, options: n }, i ? i.push(r) : this.__on = [r];
  };
}
function ur(t, e, n) {
  var i = sr(t + ""), r, o = i.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var c = 0, u = a.length, l; c < u; ++c)
        for (r = 0, l = a[c]; r < o; ++r)
          if ((s = i[r]).type === l.type && s.name === l.name)
            return l.value;
    }
    return;
  }
  for (a = e ? cr : ar, r = 0; r < o; ++r) this.each(a(i[r], e, n));
  return this;
}
function qe(t, e, n) {
  var i = ze(t), r = i.CustomEvent;
  typeof r == "function" ? r = new r(e, n) : (r = i.document.createEvent("Event"), n ? (r.initEvent(e, n.bubbles, n.cancelable), r.detail = n.detail) : r.initEvent(e, !1, !1)), t.dispatchEvent(r);
}
function lr(t, e) {
  return function() {
    return qe(this, t, e);
  };
}
function fr(t, e) {
  return function() {
    return qe(this, t, e.apply(this, arguments));
  };
}
function hr(t, e) {
  return this.each((typeof e == "function" ? fr : lr)(t, e));
}
function* dr() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var i = t[e], r = 0, o = i.length, s; r < o; ++r)
      (s = i[r]) && (yield s);
}
var mr = [null];
function k(t, e) {
  this._groups = t, this._parents = e;
}
function at() {
  return new k([[document.documentElement]], mr);
}
function pr() {
  return this;
}
k.prototype = at.prototype = {
  constructor: k,
  select: zn,
  selectAll: Vn,
  selectChild: Un,
  selectChildren: Jn,
  filter: jn,
  data: oi,
  enter: ti,
  exit: ai,
  join: ci,
  merge: ui,
  selection: pr,
  order: li,
  sort: fi,
  call: di,
  nodes: mi,
  node: pi,
  size: gi,
  empty: wi,
  each: vi,
  attr: Mi,
  style: Ei,
  property: Ii,
  classed: Xi,
  text: Fi,
  html: qi,
  raise: Gi,
  lower: Wi,
  append: Ki,
  insert: Ji,
  remove: tr,
  clone: ir,
  datum: rr,
  on: ur,
  dispatch: hr,
  [Symbol.iterator]: dr
};
function te(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function Ze(t, e) {
  var n = Object.create(t.prototype);
  for (var i in e) n[i] = e[i];
  return n;
}
function ct() {
}
var rt = 0.7, bt = 1 / rt, G = "\\s*([+-]?\\d+)\\s*", ot = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", P = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", gr = /^#([0-9a-f]{3,8})$/, wr = new RegExp(`^rgb\\(${G},${G},${G}\\)$`), vr = new RegExp(`^rgb\\(${P},${P},${P}\\)$`), yr = new RegExp(`^rgba\\(${G},${G},${G},${ot}\\)$`), _r = new RegExp(`^rgba\\(${P},${P},${P},${ot}\\)$`), xr = new RegExp(`^hsl\\(${ot},${P},${P}\\)$`), Tr = new RegExp(`^hsla\\(${ot},${P},${P},${ot}\\)$`), he = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
te(ct, Y, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: de,
  // Deprecated! Use color.formatHex.
  formatHex: de,
  formatHex8: br,
  formatHsl: Ar,
  formatRgb: me,
  toString: me
});
function de() {
  return this.rgb().formatHex();
}
function br() {
  return this.rgb().formatHex8();
}
function Ar() {
  return Ge(this).formatHsl();
}
function me() {
  return this.rgb().formatRgb();
}
function Y(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = gr.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? pe(e) : n === 3 ? new N(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? ht(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? ht(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = wr.exec(t)) ? new N(e[1], e[2], e[3], 1) : (e = vr.exec(t)) ? new N(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = yr.exec(t)) ? ht(e[1], e[2], e[3], e[4]) : (e = _r.exec(t)) ? ht(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = xr.exec(t)) ? ve(e[1], e[2] / 100, e[3] / 100, 1) : (e = Tr.exec(t)) ? ve(e[1], e[2] / 100, e[3] / 100, e[4]) : he.hasOwnProperty(t) ? pe(he[t]) : t === "transparent" ? new N(NaN, NaN, NaN, 0) : null;
}
function pe(t) {
  return new N(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function ht(t, e, n, i) {
  return i <= 0 && (t = e = n = NaN), new N(t, e, n, i);
}
function Mr(t) {
  return t instanceof ct || (t = Y(t)), t ? (t = t.rgb(), new N(t.r, t.g, t.b, t.opacity)) : new N();
}
function Ft(t, e, n, i) {
  return arguments.length === 1 ? Mr(t) : new N(t, e, n, i ?? 1);
}
function N(t, e, n, i) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +i;
}
te(N, Ft, Ze(ct, {
  brighter(t) {
    return t = t == null ? bt : Math.pow(bt, t), new N(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? rt : Math.pow(rt, t), new N(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new N(F(this.r), F(this.g), F(this.b), At(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ge,
  // Deprecated! Use color.formatHex.
  formatHex: ge,
  formatHex8: Nr,
  formatRgb: we,
  toString: we
}));
function ge() {
  return `#${z(this.r)}${z(this.g)}${z(this.b)}`;
}
function Nr() {
  return `#${z(this.r)}${z(this.g)}${z(this.b)}${z((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function we() {
  const t = At(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${F(this.r)}, ${F(this.g)}, ${F(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function At(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function F(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function z(t) {
  return t = F(t), (t < 16 ? "0" : "") + t.toString(16);
}
function ve(t, e, n, i) {
  return i <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new E(t, e, n, i);
}
function Ge(t) {
  if (t instanceof E) return new E(t.h, t.s, t.l, t.opacity);
  if (t instanceof ct || (t = Y(t)), !t) return new E();
  if (t instanceof E) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, i = t.b / 255, r = Math.min(e, n, i), o = Math.max(e, n, i), s = NaN, a = o - r, c = (o + r) / 2;
  return a ? (e === o ? s = (n - i) / a + (n < i) * 6 : n === o ? s = (i - e) / a + 2 : s = (e - n) / a + 4, a /= c < 0.5 ? o + r : 2 - o - r, s *= 60) : a = c > 0 && c < 1 ? 0 : s, new E(s, a, c, t.opacity);
}
function $r(t, e, n, i) {
  return arguments.length === 1 ? Ge(t) : new E(t, e, n, i ?? 1);
}
function E(t, e, n, i) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +i;
}
te(E, $r, Ze(ct, {
  brighter(t) {
    return t = t == null ? bt : Math.pow(bt, t), new E(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? rt : Math.pow(rt, t), new E(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, i = n + (n < 0.5 ? n : 1 - n) * e, r = 2 * n - i;
    return new N(
      Dt(t >= 240 ? t - 240 : t + 120, r, i),
      Dt(t, r, i),
      Dt(t < 120 ? t + 240 : t - 120, r, i),
      this.opacity
    );
  },
  clamp() {
    return new E(ye(this.h), dt(this.s), dt(this.l), At(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = At(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${ye(this.h)}, ${dt(this.s) * 100}%, ${dt(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function ye(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function dt(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function Dt(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const ee = (t) => () => t;
function Sr(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function Er(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(i) {
    return Math.pow(t + i * e, n);
  };
}
function kr(t) {
  return (t = +t) == 1 ? Ue : function(e, n) {
    return n - e ? Er(e, n, t) : ee(isNaN(e) ? n : e);
  };
}
function Ue(t, e) {
  var n = e - t;
  return n ? Sr(t, n) : ee(isNaN(t) ? e : t);
}
const Mt = (function t(e) {
  var n = kr(e);
  function i(r, o) {
    var s = n((r = Ft(r)).r, (o = Ft(o)).r), a = n(r.g, o.g), c = n(r.b, o.b), u = Ue(r.opacity, o.opacity);
    return function(l) {
      return r.r = s(l), r.g = a(l), r.b = c(l), r.opacity = u(l), r + "";
    };
  }
  return i.gamma = t, i;
})(1);
function Cr(t, e) {
  e || (e = []);
  var n = t ? Math.min(e.length, t.length) : 0, i = e.slice(), r;
  return function(o) {
    for (r = 0; r < n; ++r) i[r] = t[r] * (1 - o) + e[r] * o;
    return i;
  };
}
function Pr(t) {
  return ArrayBuffer.isView(t) && !(t instanceof DataView);
}
function Ir(t, e) {
  var n = e ? e.length : 0, i = t ? Math.min(n, t.length) : 0, r = new Array(i), o = new Array(n), s;
  for (s = 0; s < i; ++s) r[s] = ne(t[s], e[s]);
  for (; s < n; ++s) o[s] = e[s];
  return function(a) {
    for (s = 0; s < i; ++s) o[s] = r[s](a);
    return o;
  };
}
function Lr(t, e) {
  var n = /* @__PURE__ */ new Date();
  return t = +t, e = +e, function(i) {
    return n.setTime(t * (1 - i) + e * i), n;
  };
}
function S(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
function Rr(t, e) {
  var n = {}, i = {}, r;
  (t === null || typeof t != "object") && (t = {}), (e === null || typeof e != "object") && (e = {});
  for (r in e)
    r in t ? n[r] = ne(t[r], e[r]) : i[r] = e[r];
  return function(o) {
    for (r in n) i[r] = n[r](o);
    return i;
  };
}
var Yt = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Xt = new RegExp(Yt.source, "g");
function Dr(t) {
  return function() {
    return t;
  };
}
function Xr(t) {
  return function(e) {
    return t(e) + "";
  };
}
function We(t, e) {
  var n = Yt.lastIndex = Xt.lastIndex = 0, i, r, o, s = -1, a = [], c = [];
  for (t = t + "", e = e + ""; (i = Yt.exec(t)) && (r = Xt.exec(e)); )
    (o = r.index) > n && (o = e.slice(n, o), a[s] ? a[s] += o : a[++s] = o), (i = i[0]) === (r = r[0]) ? a[s] ? a[s] += r : a[++s] = r : (a[++s] = null, c.push({ i: s, x: S(i, r) })), n = Xt.lastIndex;
  return n < e.length && (o = e.slice(n), a[s] ? a[s] += o : a[++s] = o), a.length < 2 ? c[0] ? Xr(c[0].x) : Dr(e) : (e = c.length, function(u) {
    for (var l = 0, f; l < e; ++l) a[(f = c[l]).i] = f.x(u);
    return a.join("");
  });
}
function ne(t, e) {
  var n = typeof e, i;
  return e == null || n === "boolean" ? ee(e) : (n === "number" ? S : n === "string" ? (i = Y(e)) ? (e = i, Mt) : We : e instanceof Y ? Mt : e instanceof Date ? Lr : Pr(e) ? Cr : Array.isArray(e) ? Ir : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? Rr : S)(t, e);
}
function Or(t, e) {
  return t = +t, e = +e, function(n) {
    return Math.round(t * (1 - n) + e * n);
  };
}
var _e = 180 / Math.PI, Bt = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Ke(t, e, n, i, r, o) {
  var s, a, c;
  return (s = Math.sqrt(t * t + e * e)) && (t /= s, e /= s), (c = t * n + e * i) && (n -= t * c, i -= e * c), (a = Math.sqrt(n * n + i * i)) && (n /= a, i /= a, c /= a), t * i < e * n && (t = -t, e = -e, c = -c, s = -s), {
    translateX: r,
    translateY: o,
    rotate: Math.atan2(e, t) * _e,
    skewX: Math.atan(c) * _e,
    scaleX: s,
    scaleY: a
  };
}
var mt;
function Hr(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Bt : Ke(e.a, e.b, e.c, e.d, e.e, e.f);
}
function zr(t) {
  return t == null || (mt || (mt = document.createElementNS("http://www.w3.org/2000/svg", "g")), mt.setAttribute("transform", t), !(t = mt.transform.baseVal.consolidate())) ? Bt : (t = t.matrix, Ke(t.a, t.b, t.c, t.d, t.e, t.f));
}
function Qe(t, e, n, i) {
  function r(u) {
    return u.length ? u.pop() + " " : "";
  }
  function o(u, l, f, h, d, p) {
    if (u !== f || l !== h) {
      var g = d.push("translate(", null, e, null, n);
      p.push({ i: g - 4, x: S(u, f) }, { i: g - 2, x: S(l, h) });
    } else (f || h) && d.push("translate(" + f + e + h + n);
  }
  function s(u, l, f, h) {
    u !== l ? (u - l > 180 ? l += 360 : l - u > 180 && (u += 360), h.push({ i: f.push(r(f) + "rotate(", null, i) - 2, x: S(u, l) })) : l && f.push(r(f) + "rotate(" + l + i);
  }
  function a(u, l, f, h) {
    u !== l ? h.push({ i: f.push(r(f) + "skewX(", null, i) - 2, x: S(u, l) }) : l && f.push(r(f) + "skewX(" + l + i);
  }
  function c(u, l, f, h, d, p) {
    if (u !== f || l !== h) {
      var g = d.push(r(d) + "scale(", null, ",", null, ")");
      p.push({ i: g - 4, x: S(u, f) }, { i: g - 2, x: S(l, h) });
    } else (f !== 1 || h !== 1) && d.push(r(d) + "scale(" + f + "," + h + ")");
  }
  return function(u, l) {
    var f = [], h = [];
    return u = t(u), l = t(l), o(u.translateX, u.translateY, l.translateX, l.translateY, f, h), s(u.rotate, l.rotate, f, h), a(u.skewX, l.skewX, f, h), c(u.scaleX, u.scaleY, l.scaleX, l.scaleY, f, h), u = l = null, function(d) {
      for (var p = -1, g = h.length, m; ++p < g; ) f[(m = h[p]).i] = m.x(d);
      return f.join("");
    };
  };
}
var Fr = Qe(Hr, "px, ", "px)", "deg)"), Yr = Qe(zr, ", ", ")", ")"), W = 0, j = 0, J = 0, Je = 1e3, Nt, tt, $t = 0, B = 0, Pt = 0, st = typeof performance == "object" && performance.now ? performance : Date, je = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function ie() {
  return B || (je(Br), B = st.now() + Pt);
}
function Br() {
  B = 0;
}
function St() {
  this._call = this._time = this._next = null;
}
St.prototype = tn.prototype = {
  constructor: St,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? ie() : +n) + (e == null ? 0 : +e), !this._next && tt !== this && (tt ? tt._next = this : Nt = this, tt = this), this._call = t, this._time = n, Vt();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Vt());
  }
};
function tn(t, e, n) {
  var i = new St();
  return i.restart(t, e, n), i;
}
function Vr() {
  ie(), ++W;
  for (var t = Nt, e; t; )
    (e = B - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --W;
}
function xe() {
  B = ($t = st.now()) + Pt, W = j = 0;
  try {
    Vr();
  } finally {
    W = 0, Zr(), B = 0;
  }
}
function qr() {
  var t = st.now(), e = t - $t;
  e > Je && (Pt -= e, $t = t);
}
function Zr() {
  for (var t, e = Nt, n, i = 1 / 0; e; )
    e._call ? (i > e._time && (i = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : Nt = n);
  tt = t, Vt(i);
}
function Vt(t) {
  if (!W) {
    j && (j = clearTimeout(j));
    var e = t - B;
    e > 24 ? (t < 1 / 0 && (j = setTimeout(xe, t - st.now() - Pt)), J && (J = clearInterval(J))) : (J || ($t = st.now(), J = setInterval(qr, Je)), W = 1, je(xe));
  }
}
function Te(t, e, n) {
  var i = new St();
  return e = e == null ? 0 : +e, i.restart((r) => {
    i.stop(), t(r + e);
  }, e, n), i;
}
var Gr = Le("start", "end", "cancel", "interrupt"), Ur = [], en = 0, be = 1, qt = 2, yt = 3, Ae = 4, Zt = 5, _t = 6;
function It(t, e, n, i, r, o) {
  var s = t.__transition;
  if (!s) t.__transition = {};
  else if (n in s) return;
  Wr(t, n, {
    name: e,
    index: i,
    // For context during callback.
    group: r,
    // For context during callback.
    on: Gr,
    tween: Ur,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: en
  });
}
function re(t, e) {
  var n = C(t, e);
  if (n.state > en) throw new Error("too late; already scheduled");
  return n;
}
function I(t, e) {
  var n = C(t, e);
  if (n.state > yt) throw new Error("too late; already running");
  return n;
}
function C(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Wr(t, e, n) {
  var i = t.__transition, r;
  i[e] = n, n.timer = tn(o, 0, n.time);
  function o(u) {
    n.state = be, n.timer.restart(s, n.delay, n.time), n.delay <= u && s(u - n.delay);
  }
  function s(u) {
    var l, f, h, d;
    if (n.state !== be) return c();
    for (l in i)
      if (d = i[l], d.name === n.name) {
        if (d.state === yt) return Te(s);
        d.state === Ae ? (d.state = _t, d.timer.stop(), d.on.call("interrupt", t, t.__data__, d.index, d.group), delete i[l]) : +l < e && (d.state = _t, d.timer.stop(), d.on.call("cancel", t, t.__data__, d.index, d.group), delete i[l]);
      }
    if (Te(function() {
      n.state === yt && (n.state = Ae, n.timer.restart(a, n.delay, n.time), a(u));
    }), n.state = qt, n.on.call("start", t, t.__data__, n.index, n.group), n.state === qt) {
      for (n.state = yt, r = new Array(h = n.tween.length), l = 0, f = -1; l < h; ++l)
        (d = n.tween[l].value.call(t, t.__data__, n.index, n.group)) && (r[++f] = d);
      r.length = f + 1;
    }
  }
  function a(u) {
    for (var l = u < n.duration ? n.ease.call(null, u / n.duration) : (n.timer.restart(c), n.state = Zt, 1), f = -1, h = r.length; ++f < h; )
      r[f].call(t, l);
    n.state === Zt && (n.on.call("end", t, t.__data__, n.index, n.group), c());
  }
  function c() {
    n.state = _t, n.timer.stop(), delete i[e];
    for (var u in i) return;
    delete t.__transition;
  }
}
function Kr(t, e) {
  var n = t.__transition, i, r, o = !0, s;
  if (n) {
    e = e == null ? null : e + "";
    for (s in n) {
      if ((i = n[s]).name !== e) {
        o = !1;
        continue;
      }
      r = i.state > qt && i.state < Zt, i.state = _t, i.timer.stop(), i.on.call(r ? "interrupt" : "cancel", t, t.__data__, i.index, i.group), delete n[s];
    }
    o && delete t.__transition;
  }
}
function Qr(t) {
  return this.each(function() {
    Kr(this, t);
  });
}
function Jr(t, e) {
  var n, i;
  return function() {
    var r = I(this, t), o = r.tween;
    if (o !== n) {
      i = n = o;
      for (var s = 0, a = i.length; s < a; ++s)
        if (i[s].name === e) {
          i = i.slice(), i.splice(s, 1);
          break;
        }
    }
    r.tween = i;
  };
}
function jr(t, e, n) {
  var i, r;
  if (typeof n != "function") throw new Error();
  return function() {
    var o = I(this, t), s = o.tween;
    if (s !== i) {
      r = (i = s).slice();
      for (var a = { name: e, value: n }, c = 0, u = r.length; c < u; ++c)
        if (r[c].name === e) {
          r[c] = a;
          break;
        }
      c === u && r.push(a);
    }
    o.tween = r;
  };
}
function to(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var i = C(this.node(), n).tween, r = 0, o = i.length, s; r < o; ++r)
      if ((s = i[r]).name === t)
        return s.value;
    return null;
  }
  return this.each((e == null ? Jr : jr)(n, t, e));
}
function oe(t, e, n) {
  var i = t._id;
  return t.each(function() {
    var r = I(this, i);
    (r.value || (r.value = {}))[e] = n.apply(this, arguments);
  }), function(r) {
    return C(r, i).value[e];
  };
}
function nn(t, e) {
  var n;
  return (typeof e == "number" ? S : e instanceof Y ? Mt : (n = Y(e)) ? (e = n, Mt) : We)(t, e);
}
function eo(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function no(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function io(t, e, n) {
  var i, r = n + "", o;
  return function() {
    var s = this.getAttribute(t);
    return s === r ? null : s === i ? o : o = e(i = s, n);
  };
}
function ro(t, e, n) {
  var i, r = n + "", o;
  return function() {
    var s = this.getAttributeNS(t.space, t.local);
    return s === r ? null : s === i ? o : o = e(i = s, n);
  };
}
function oo(t, e, n) {
  var i, r, o;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttribute(t) : (s = this.getAttribute(t), c = a + "", s === c ? null : s === i && c === r ? o : (r = c, o = e(i = s, a)));
  };
}
function so(t, e, n) {
  var i, r, o;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttributeNS(t.space, t.local) : (s = this.getAttributeNS(t.space, t.local), c = a + "", s === c ? null : s === i && c === r ? o : (r = c, o = e(i = s, a)));
  };
}
function ao(t, e) {
  var n = Ct(t), i = n === "transform" ? Yr : nn;
  return this.attrTween(t, typeof e == "function" ? (n.local ? so : oo)(n, i, oe(this, "attr." + t, e)) : e == null ? (n.local ? no : eo)(n) : (n.local ? ro : io)(n, i, e));
}
function co(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function uo(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function lo(t, e) {
  var n, i;
  function r() {
    var o = e.apply(this, arguments);
    return o !== i && (n = (i = o) && uo(t, o)), n;
  }
  return r._value = e, r;
}
function fo(t, e) {
  var n, i;
  function r() {
    var o = e.apply(this, arguments);
    return o !== i && (n = (i = o) && co(t, o)), n;
  }
  return r._value = e, r;
}
function ho(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var i = Ct(t);
  return this.tween(n, (i.local ? lo : fo)(i, e));
}
function mo(t, e) {
  return function() {
    re(this, t).delay = +e.apply(this, arguments);
  };
}
function po(t, e) {
  return e = +e, function() {
    re(this, t).delay = e;
  };
}
function go(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? mo : po)(e, t)) : C(this.node(), e).delay;
}
function wo(t, e) {
  return function() {
    I(this, t).duration = +e.apply(this, arguments);
  };
}
function vo(t, e) {
  return e = +e, function() {
    I(this, t).duration = e;
  };
}
function yo(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? wo : vo)(e, t)) : C(this.node(), e).duration;
}
function _o(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    I(this, t).ease = e;
  };
}
function xo(t) {
  var e = this._id;
  return arguments.length ? this.each(_o(e, t)) : C(this.node(), e).ease;
}
function To(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    I(this, t).ease = n;
  };
}
function bo(t) {
  if (typeof t != "function") throw new Error();
  return this.each(To(this._id, t));
}
function Ao(t) {
  typeof t != "function" && (t = Xe(t));
  for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
    for (var o = e[r], s = o.length, a = i[r] = [], c, u = 0; u < s; ++u)
      (c = o[u]) && t.call(c, c.__data__, u, o) && a.push(c);
  return new X(i, this._parents, this._name, this._id);
}
function Mo(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, i = e.length, r = n.length, o = Math.min(i, r), s = new Array(i), a = 0; a < o; ++a)
    for (var c = e[a], u = n[a], l = c.length, f = s[a] = new Array(l), h, d = 0; d < l; ++d)
      (h = c[d] || u[d]) && (f[d] = h);
  for (; a < i; ++a)
    s[a] = e[a];
  return new X(s, this._parents, this._name, this._id);
}
function No(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function $o(t, e, n) {
  var i, r, o = No(e) ? re : I;
  return function() {
    var s = o(this, t), a = s.on;
    a !== i && (r = (i = a).copy()).on(e, n), s.on = r;
  };
}
function So(t, e) {
  var n = this._id;
  return arguments.length < 2 ? C(this.node(), n).on.on(t) : this.each($o(n, t, e));
}
function Eo(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function ko() {
  return this.on("end.remove", Eo(this._id));
}
function Co(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Jt(t));
  for (var i = this._groups, r = i.length, o = new Array(r), s = 0; s < r; ++s)
    for (var a = i[s], c = a.length, u = o[s] = new Array(c), l, f, h = 0; h < c; ++h)
      (l = a[h]) && (f = t.call(l, l.__data__, h, a)) && ("__data__" in l && (f.__data__ = l.__data__), u[h] = f, It(u[h], e, n, h, u, C(l, n)));
  return new X(o, this._parents, e, n);
}
function Po(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = De(t));
  for (var i = this._groups, r = i.length, o = [], s = [], a = 0; a < r; ++a)
    for (var c = i[a], u = c.length, l, f = 0; f < u; ++f)
      if (l = c[f]) {
        for (var h = t.call(l, l.__data__, f, c), d, p = C(l, n), g = 0, m = h.length; g < m; ++g)
          (d = h[g]) && It(d, e, n, g, h, p);
        o.push(h), s.push(l);
      }
  return new X(o, s, e, n);
}
var Io = at.prototype.constructor;
function Lo() {
  return new Io(this._groups, this._parents);
}
function Ro(t, e) {
  var n, i, r;
  return function() {
    var o = U(this, t), s = (this.style.removeProperty(t), U(this, t));
    return o === s ? null : o === n && s === i ? r : r = e(n = o, i = s);
  };
}
function rn(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Do(t, e, n) {
  var i, r = n + "", o;
  return function() {
    var s = U(this, t);
    return s === r ? null : s === i ? o : o = e(i = s, n);
  };
}
function Xo(t, e, n) {
  var i, r, o;
  return function() {
    var s = U(this, t), a = n(this), c = a + "";
    return a == null && (c = a = (this.style.removeProperty(t), U(this, t))), s === c ? null : s === i && c === r ? o : (r = c, o = e(i = s, a));
  };
}
function Oo(t, e) {
  var n, i, r, o = "style." + e, s = "end." + o, a;
  return function() {
    var c = I(this, t), u = c.on, l = c.value[o] == null ? a || (a = rn(e)) : void 0;
    (u !== n || r !== l) && (i = (n = u).copy()).on(s, r = l), c.on = i;
  };
}
function Ho(t, e, n) {
  var i = (t += "") == "transform" ? Fr : nn;
  return e == null ? this.styleTween(t, Ro(t, i)).on("end.style." + t, rn(t)) : typeof e == "function" ? this.styleTween(t, Xo(t, i, oe(this, "style." + t, e))).each(Oo(this._id, t)) : this.styleTween(t, Do(t, i, e), n).on("end.style." + t, null);
}
function zo(t, e, n) {
  return function(i) {
    this.style.setProperty(t, e.call(this, i), n);
  };
}
function Fo(t, e, n) {
  var i, r;
  function o() {
    var s = e.apply(this, arguments);
    return s !== r && (i = (r = s) && zo(t, s, n)), i;
  }
  return o._value = e, o;
}
function Yo(t, e, n) {
  var i = "style." + (t += "");
  if (arguments.length < 2) return (i = this.tween(i)) && i._value;
  if (e == null) return this.tween(i, null);
  if (typeof e != "function") throw new Error();
  return this.tween(i, Fo(t, e, n ?? ""));
}
function Bo(t) {
  return function() {
    this.textContent = t;
  };
}
function Vo(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function qo(t) {
  return this.tween("text", typeof t == "function" ? Vo(oe(this, "text", t)) : Bo(t == null ? "" : t + ""));
}
function Zo(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function Go(t) {
  var e, n;
  function i() {
    var r = t.apply(this, arguments);
    return r !== n && (e = (n = r) && Zo(r)), e;
  }
  return i._value = t, i;
}
function Uo(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, Go(t));
}
function Wo() {
  for (var t = this._name, e = this._id, n = on(), i = this._groups, r = i.length, o = 0; o < r; ++o)
    for (var s = i[o], a = s.length, c, u = 0; u < a; ++u)
      if (c = s[u]) {
        var l = C(c, e);
        It(c, t, n, u, s, {
          time: l.time + l.delay + l.duration,
          delay: 0,
          duration: l.duration,
          ease: l.ease
        });
      }
  return new X(i, this._parents, t, n);
}
function Ko() {
  var t, e, n = this, i = n._id, r = n.size();
  return new Promise(function(o, s) {
    var a = { value: s }, c = { value: function() {
      --r === 0 && o();
    } };
    n.each(function() {
      var u = I(this, i), l = u.on;
      l !== t && (e = (t = l).copy(), e._.cancel.push(a), e._.interrupt.push(a), e._.end.push(c)), u.on = e;
    }), r === 0 && o();
  });
}
var Qo = 0;
function X(t, e, n, i) {
  this._groups = t, this._parents = e, this._name = n, this._id = i;
}
function on() {
  return ++Qo;
}
var D = at.prototype;
X.prototype = {
  constructor: X,
  select: Co,
  selectAll: Po,
  selectChild: D.selectChild,
  selectChildren: D.selectChildren,
  filter: Ao,
  merge: Mo,
  selection: Lo,
  transition: Wo,
  call: D.call,
  nodes: D.nodes,
  node: D.node,
  size: D.size,
  empty: D.empty,
  each: D.each,
  on: So,
  attr: ao,
  attrTween: ho,
  style: Ho,
  styleTween: Yo,
  text: qo,
  textTween: Uo,
  remove: ko,
  tween: to,
  delay: go,
  duration: yo,
  ease: xo,
  easeVarying: bo,
  end: Ko,
  [Symbol.iterator]: D[Symbol.iterator]
};
function Jo(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var jo = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Jo
};
function ts(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function es(t) {
  var e, n;
  t instanceof X ? (e = t._id, t = t._name) : (e = on(), (n = jo).time = ie(), t = t == null ? null : t + "");
  for (var i = this._groups, r = i.length, o = 0; o < r; ++o)
    for (var s = i[o], a = s.length, c, u = 0; u < a; ++u)
      (c = s[u]) && It(c, t, e, u, s, n || ts(c, e));
  return new X(i, this._parents, t, e);
}
at.prototype.interrupt = Qr;
at.prototype.transition = es;
const Gt = Math.PI, Ut = 2 * Gt, H = 1e-6, ns = Ut - H;
function sn(t) {
  this._ += t[0];
  for (let e = 1, n = t.length; e < n; ++e)
    this._ += arguments[e] + t[e];
}
function is(t) {
  let e = Math.floor(t);
  if (!(e >= 0)) throw new Error(`invalid digits: ${t}`);
  if (e > 15) return sn;
  const n = 10 ** e;
  return function(i) {
    this._ += i[0];
    for (let r = 1, o = i.length; r < o; ++r)
      this._ += Math.round(arguments[r] * n) / n + i[r];
  };
}
class rs {
  constructor(e) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = e == null ? sn : is(e);
  }
  moveTo(e, n) {
    this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +n}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
  }
  lineTo(e, n) {
    this._append`L${this._x1 = +e},${this._y1 = +n}`;
  }
  quadraticCurveTo(e, n, i, r) {
    this._append`Q${+e},${+n},${this._x1 = +i},${this._y1 = +r}`;
  }
  bezierCurveTo(e, n, i, r, o, s) {
    this._append`C${+e},${+n},${+i},${+r},${this._x1 = +o},${this._y1 = +s}`;
  }
  arcTo(e, n, i, r, o) {
    if (e = +e, n = +n, i = +i, r = +r, o = +o, o < 0) throw new Error(`negative radius: ${o}`);
    let s = this._x1, a = this._y1, c = i - e, u = r - n, l = s - e, f = a - n, h = l * l + f * f;
    if (this._x1 === null)
      this._append`M${this._x1 = e},${this._y1 = n}`;
    else if (h > H) if (!(Math.abs(f * c - u * l) > H) || !o)
      this._append`L${this._x1 = e},${this._y1 = n}`;
    else {
      let d = i - s, p = r - a, g = c * c + u * u, m = d * d + p * p, y = Math.sqrt(g), w = Math.sqrt(h), x = o * Math.tan((Gt - Math.acos((g + h - m) / (2 * y * w))) / 2), T = x / w, v = x / y;
      Math.abs(T - 1) > H && this._append`L${e + T * l},${n + T * f}`, this._append`A${o},${o},0,0,${+(f * d > l * p)},${this._x1 = e + v * c},${this._y1 = n + v * u}`;
    }
  }
  arc(e, n, i, r, o, s) {
    if (e = +e, n = +n, i = +i, s = !!s, i < 0) throw new Error(`negative radius: ${i}`);
    let a = i * Math.cos(r), c = i * Math.sin(r), u = e + a, l = n + c, f = 1 ^ s, h = s ? r - o : o - r;
    this._x1 === null ? this._append`M${u},${l}` : (Math.abs(this._x1 - u) > H || Math.abs(this._y1 - l) > H) && this._append`L${u},${l}`, i && (h < 0 && (h = h % Ut + Ut), h > ns ? this._append`A${i},${i},0,1,${f},${e - a},${n - c}A${i},${i},0,1,${f},${this._x1 = u},${this._y1 = l}` : h > H && this._append`A${i},${i},0,${+(h >= Gt)},${f},${this._x1 = e + i * Math.cos(o)},${this._y1 = n + i * Math.sin(o)}`);
  }
  rect(e, n, i, r) {
    this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +n}h${i = +i}v${+r}h${-i}Z`;
  }
  toString() {
    return this._;
  }
}
function os(t) {
  return Math.abs(t = Math.round(t)) >= 1e21 ? t.toLocaleString("en").replace(/,/g, "") : t.toString(10);
}
function Et(t, e) {
  if ((n = (t = e ? t.toExponential(e - 1) : t.toExponential()).indexOf("e")) < 0) return null;
  var n, i = t.slice(0, n);
  return [
    i.length > 1 ? i[0] + i.slice(2) : i,
    +t.slice(n + 1)
  ];
}
function K(t) {
  return t = Et(Math.abs(t)), t ? t[1] : NaN;
}
function ss(t, e) {
  return function(n, i) {
    for (var r = n.length, o = [], s = 0, a = t[0], c = 0; r > 0 && a > 0 && (c + a + 1 > i && (a = Math.max(1, i - c)), o.push(n.substring(r -= a, r + a)), !((c += a + 1) > i)); )
      a = t[s = (s + 1) % t.length];
    return o.reverse().join(e);
  };
}
function as(t) {
  return function(e) {
    return e.replace(/[0-9]/g, function(n) {
      return t[+n];
    });
  };
}
var cs = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function kt(t) {
  if (!(e = cs.exec(t))) throw new Error("invalid format: " + t);
  var e;
  return new se({
    fill: e[1],
    align: e[2],
    sign: e[3],
    symbol: e[4],
    zero: e[5],
    width: e[6],
    comma: e[7],
    precision: e[8] && e[8].slice(1),
    trim: e[9],
    type: e[10]
  });
}
kt.prototype = se.prototype;
function se(t) {
  this.fill = t.fill === void 0 ? " " : t.fill + "", this.align = t.align === void 0 ? ">" : t.align + "", this.sign = t.sign === void 0 ? "-" : t.sign + "", this.symbol = t.symbol === void 0 ? "" : t.symbol + "", this.zero = !!t.zero, this.width = t.width === void 0 ? void 0 : +t.width, this.comma = !!t.comma, this.precision = t.precision === void 0 ? void 0 : +t.precision, this.trim = !!t.trim, this.type = t.type === void 0 ? "" : t.type + "";
}
se.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function us(t) {
  t: for (var e = t.length, n = 1, i = -1, r; n < e; ++n)
    switch (t[n]) {
      case ".":
        i = r = n;
        break;
      case "0":
        i === 0 && (i = n), r = n;
        break;
      default:
        if (!+t[n]) break t;
        i > 0 && (i = 0);
        break;
    }
  return i > 0 ? t.slice(0, i) + t.slice(r + 1) : t;
}
var an;
function ls(t, e) {
  var n = Et(t, e);
  if (!n) return t + "";
  var i = n[0], r = n[1], o = r - (an = Math.max(-8, Math.min(8, Math.floor(r / 3))) * 3) + 1, s = i.length;
  return o === s ? i : o > s ? i + new Array(o - s + 1).join("0") : o > 0 ? i.slice(0, o) + "." + i.slice(o) : "0." + new Array(1 - o).join("0") + Et(t, Math.max(0, e + o - 1))[0];
}
function Me(t, e) {
  var n = Et(t, e);
  if (!n) return t + "";
  var i = n[0], r = n[1];
  return r < 0 ? "0." + new Array(-r).join("0") + i : i.length > r + 1 ? i.slice(0, r + 1) + "." + i.slice(r + 1) : i + new Array(r - i.length + 2).join("0");
}
const Ne = {
  "%": (t, e) => (t * 100).toFixed(e),
  b: (t) => Math.round(t).toString(2),
  c: (t) => t + "",
  d: os,
  e: (t, e) => t.toExponential(e),
  f: (t, e) => t.toFixed(e),
  g: (t, e) => t.toPrecision(e),
  o: (t) => Math.round(t).toString(8),
  p: (t, e) => Me(t * 100, e),
  r: Me,
  s: ls,
  X: (t) => Math.round(t).toString(16).toUpperCase(),
  x: (t) => Math.round(t).toString(16)
};
function $e(t) {
  return t;
}
var Se = Array.prototype.map, Ee = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function fs(t) {
  var e = t.grouping === void 0 || t.thousands === void 0 ? $e : ss(Se.call(t.grouping, Number), t.thousands + ""), n = t.currency === void 0 ? "" : t.currency[0] + "", i = t.currency === void 0 ? "" : t.currency[1] + "", r = t.decimal === void 0 ? "." : t.decimal + "", o = t.numerals === void 0 ? $e : as(Se.call(t.numerals, String)), s = t.percent === void 0 ? "%" : t.percent + "", a = t.minus === void 0 ? "−" : t.minus + "", c = t.nan === void 0 ? "NaN" : t.nan + "";
  function u(f) {
    f = kt(f);
    var h = f.fill, d = f.align, p = f.sign, g = f.symbol, m = f.zero, y = f.width, w = f.comma, x = f.precision, T = f.trim, v = f.type;
    v === "n" ? (w = !0, v = "g") : Ne[v] || (x === void 0 && (x = 12), T = !0, v = "g"), (m || h === "0" && d === "=") && (m = !0, h = "0", d = "=");
    var A = g === "$" ? n : g === "#" && /[boxX]/.test(v) ? "0" + v.toLowerCase() : "", Q = g === "$" ? i : /[%p]/.test(v) ? s : "", O = Ne[v], Lt = /[defgprs%]/.test(v);
    x = x === void 0 ? 6 : /[gprs]/.test(v) ? Math.max(1, Math.min(21, x)) : Math.max(0, Math.min(20, x));
    function $(_) {
      var L = A, M = Q, V, ae, ut;
      if (v === "c")
        M = O(_) + M, _ = "";
      else {
        _ = +_;
        var lt = _ < 0 || 1 / _ < 0;
        if (_ = isNaN(_) ? c : O(Math.abs(_), x), T && (_ = us(_)), lt && +_ == 0 && p !== "+" && (lt = !1), L = (lt ? p === "(" ? p : a : p === "-" || p === "(" ? "" : p) + L, M = (v === "s" ? Ee[8 + an / 3] : "") + M + (lt && p === "(" ? ")" : ""), Lt) {
          for (V = -1, ae = _.length; ++V < ae; )
            if (ut = _.charCodeAt(V), 48 > ut || ut > 57) {
              M = (ut === 46 ? r + _.slice(V + 1) : _.slice(V)) + M, _ = _.slice(0, V);
              break;
            }
        }
      }
      w && !m && (_ = e(_, 1 / 0));
      var ft = L.length + _.length + M.length, R = ft < y ? new Array(y - ft + 1).join(h) : "";
      switch (w && m && (_ = e(R + _, R.length ? y - M.length : 1 / 0), R = ""), d) {
        case "<":
          _ = L + _ + M + R;
          break;
        case "=":
          _ = L + R + _ + M;
          break;
        case "^":
          _ = R.slice(0, ft = R.length >> 1) + L + _ + M + R.slice(ft);
          break;
        default:
          _ = R + L + _ + M;
          break;
      }
      return o(_);
    }
    return $.toString = function() {
      return f + "";
    }, $;
  }
  function l(f, h) {
    var d = u((f = kt(f), f.type = "f", f)), p = Math.max(-8, Math.min(8, Math.floor(K(h) / 3))) * 3, g = Math.pow(10, -p), m = Ee[8 + p / 3];
    return function(y) {
      return d(g * y) + m;
    };
  }
  return {
    format: u,
    formatPrefix: l
  };
}
var pt, cn, un;
hs({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function hs(t) {
  return pt = fs(t), cn = pt.format, un = pt.formatPrefix, pt;
}
function ds(t) {
  return Math.max(0, -K(Math.abs(t)));
}
function ms(t, e) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(K(e) / 3))) * 3 - K(Math.abs(t)));
}
function ps(t, e) {
  return t = Math.abs(t), e = Math.abs(e) - t, Math.max(0, K(e) - K(t)) + 1;
}
function gs(t, e) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(t);
      break;
    default:
      this.range(e).domain(t);
      break;
  }
  return this;
}
function ws(t) {
  return function() {
    return t;
  };
}
function vs(t) {
  return +t;
}
var ke = [0, 1];
function Z(t) {
  return t;
}
function Wt(t, e) {
  return (e -= t = +t) ? function(n) {
    return (n - t) / e;
  } : ws(isNaN(e) ? NaN : 0.5);
}
function ys(t, e) {
  var n;
  return t > e && (n = t, t = e, e = n), function(i) {
    return Math.max(t, Math.min(e, i));
  };
}
function _s(t, e, n) {
  var i = t[0], r = t[1], o = e[0], s = e[1];
  return r < i ? (i = Wt(r, i), o = n(s, o)) : (i = Wt(i, r), o = n(o, s)), function(a) {
    return o(i(a));
  };
}
function xs(t, e, n) {
  var i = Math.min(t.length, e.length) - 1, r = new Array(i), o = new Array(i), s = -1;
  for (t[i] < t[0] && (t = t.slice().reverse(), e = e.slice().reverse()); ++s < i; )
    r[s] = Wt(t[s], t[s + 1]), o[s] = n(e[s], e[s + 1]);
  return function(a) {
    var c = Sn(t, a, 1, i) - 1;
    return o[c](r[c](a));
  };
}
function Ts(t, e) {
  return e.domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp()).unknown(t.unknown());
}
function bs() {
  var t = ke, e = ke, n = ne, i, r, o, s = Z, a, c, u;
  function l() {
    var h = Math.min(t.length, e.length);
    return s !== Z && (s = ys(t[0], t[h - 1])), a = h > 2 ? xs : _s, c = u = null, f;
  }
  function f(h) {
    return h == null || isNaN(h = +h) ? o : (c || (c = a(t.map(i), e, n)))(i(s(h)));
  }
  return f.invert = function(h) {
    return s(r((u || (u = a(e, t.map(i), S)))(h)));
  }, f.domain = function(h) {
    return arguments.length ? (t = Array.from(h, vs), l()) : t.slice();
  }, f.range = function(h) {
    return arguments.length ? (e = Array.from(h), l()) : e.slice();
  }, f.rangeRound = function(h) {
    return e = Array.from(h), n = Or, l();
  }, f.clamp = function(h) {
    return arguments.length ? (s = h ? !0 : Z, l()) : s !== Z;
  }, f.interpolate = function(h) {
    return arguments.length ? (n = h, l()) : n;
  }, f.unknown = function(h) {
    return arguments.length ? (o = h, f) : o;
  }, function(h, d) {
    return i = h, r = d, l();
  };
}
function As() {
  return bs()(Z, Z);
}
function Ms(t, e, n, i) {
  var r = In(t, e, n), o;
  switch (i = kt(i ?? ",f"), i.type) {
    case "s": {
      var s = Math.max(Math.abs(t), Math.abs(e));
      return i.precision == null && !isNaN(o = ms(r, s)) && (i.precision = o), un(i, s);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      i.precision == null && !isNaN(o = ps(r, Math.max(Math.abs(t), Math.abs(e)))) && (i.precision = o - (i.type === "e"));
      break;
    }
    case "f":
    case "%": {
      i.precision == null && !isNaN(o = ds(r)) && (i.precision = o - (i.type === "%") * 2);
      break;
    }
  }
  return cn(i);
}
function Ns(t) {
  var e = t.domain;
  return t.ticks = function(n) {
    var i = e();
    return Pn(i[0], i[i.length - 1], n ?? 10);
  }, t.tickFormat = function(n, i) {
    var r = e();
    return Ms(r[0], r[r.length - 1], n ?? 10, i);
  }, t.nice = function(n) {
    n == null && (n = 10);
    var i = e(), r = 0, o = i.length - 1, s = i[r], a = i[o], c, u, l = 10;
    for (a < s && (u = s, s = a, a = u, u = r, r = o, o = u); l-- > 0; ) {
      if (u = Ht(s, a, n), u === c)
        return i[r] = s, i[o] = a, e(i);
      if (u > 0)
        s = Math.floor(s / u) * u, a = Math.ceil(a / u) * u;
      else if (u < 0)
        s = Math.ceil(s * u) / u, a = Math.floor(a * u) / u;
      else
        break;
      c = u;
    }
    return t;
  }, t;
}
function Kt() {
  var t = As();
  return t.copy = function() {
    return Ts(t, Kt());
  }, gs.apply(t, arguments), Ns(t);
}
function q(t) {
  return function() {
    return t;
  };
}
function $s(t) {
  let e = 3;
  return t.digits = function(n) {
    if (!arguments.length) return e;
    if (n == null)
      e = null;
    else {
      const i = Math.floor(n);
      if (!(i >= 0)) throw new RangeError(`invalid digits: ${n}`);
      e = i;
    }
    return t;
  }, () => new rs(e);
}
function Ss(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function ln(t) {
  this._context = t;
}
ln.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(t, e) {
    switch (t = +t, e = +e, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(t, e) : this._context.moveTo(t, e);
        break;
      case 1:
        this._point = 2;
      // falls through
      default:
        this._context.lineTo(t, e);
        break;
    }
  }
};
function Es(t) {
  return new ln(t);
}
function ks(t) {
  return t[0];
}
function Cs(t) {
  return t[1];
}
function Ps(t, e) {
  var n = q(!0), i = null, r = Es, o = null, s = $s(a);
  t = typeof t == "function" ? t : t === void 0 ? ks : q(t), e = typeof e == "function" ? e : e === void 0 ? Cs : q(e);
  function a(c) {
    var u, l = (c = Ss(c)).length, f, h = !1, d;
    for (i == null && (o = r(d = s())), u = 0; u <= l; ++u)
      !(u < l && n(f = c[u], u, c)) === h && ((h = !h) ? o.lineStart() : o.lineEnd()), h && o.point(+t(f, u, c), +e(f, u, c));
    if (d) return o = null, d + "" || null;
  }
  return a.x = function(c) {
    return arguments.length ? (t = typeof c == "function" ? c : q(+c), a) : t;
  }, a.y = function(c) {
    return arguments.length ? (e = typeof c == "function" ? c : q(+c), a) : e;
  }, a.defined = function(c) {
    return arguments.length ? (n = typeof c == "function" ? c : q(!!c), a) : n;
  }, a.curve = function(c) {
    return arguments.length ? (r = c, i != null && (o = r(i)), a) : r;
  }, a.context = function(c) {
    return arguments.length ? (c == null ? i = o = null : o = r(i = c), a) : i;
  }, a;
}
function et(t, e, n) {
  this.k = t, this.x = e, this.y = n;
}
et.prototype = {
  constructor: et,
  scale: function(t) {
    return t === 1 ? this : new et(this.k * t, this.x, this.y);
  },
  translate: function(t, e) {
    return t === 0 & e === 0 ? this : new et(this.k, this.x + this.k * t, this.y + this.k * e);
  },
  apply: function(t) {
    return [t[0] * this.k + this.x, t[1] * this.k + this.y];
  },
  applyX: function(t) {
    return t * this.k + this.x;
  },
  applyY: function(t) {
    return t * this.k + this.y;
  },
  invert: function(t) {
    return [(t[0] - this.x) / this.k, (t[1] - this.y) / this.k];
  },
  invertX: function(t) {
    return (t - this.x) / this.k;
  },
  invertY: function(t) {
    return (t - this.y) / this.k;
  },
  rescaleX: function(t) {
    return t.copy().domain(t.range().map(this.invertX, this).map(t.invert, t));
  },
  rescaleY: function(t) {
    return t.copy().domain(t.range().map(this.invertY, this).map(t.invert, t));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
et.prototype;
const Is = {
  name: "Sigmoid v3",
  description: "Smooth sigmoid curve that travels horizontally first, with limited curve distance",
  render(t) {
    const e = [], n = t.fromX - 5, i = t.toX + 5;
    let r = t.fromY;
    t.toY < t.fromY ? r = t.fromY - 5 : t.toY > t.fromY && (r = t.fromY + 5);
    const o = t.toY, s = Math.abs(i - n), a = 50;
    if (s <= a)
      return Ls(n, r, i, o, t);
    const u = i > n ? n + a : n - a, l = fn(n, r, u, o);
    if (!l) {
      const d = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      return d.setAttribute("d", `M ${n},${r} L ${i},${o}`), d.setAttribute("stroke", t.color), d.setAttribute("stroke-width", "5"), d.setAttribute("fill", "none"), e.push(d), e;
    }
    const f = `${l} L ${i},${o}`, h = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return h.setAttribute("d", f), h.setAttribute("stroke", t.color), h.setAttribute("stroke-width", "5"), h.setAttribute("fill", "none"), t.connectorType === "undefined" ? (h.setAttribute("stroke-dasharray", "5,5"), h.setAttribute("stroke-opacity", "0.5")) : h.setAttribute("stroke-opacity", t.opacity.toString()), e.push(h), e;
  }
};
function Ls(t, e, n, i, r) {
  const o = [], s = fn(t, e, n, i);
  if (!s) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return c.setAttribute("d", `M ${t},${e} L ${n},${i}`), c.setAttribute("stroke", r.color), c.setAttribute("stroke-width", "2"), c.setAttribute("fill", "none"), o.push(c), o;
  }
  const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return a.setAttribute("d", s), a.setAttribute("stroke", r.color), a.setAttribute("stroke-width", "5"), a.setAttribute("fill", "none"), r.connectorType === "undefined" ? (a.setAttribute("stroke-dasharray", "5,5"), a.setAttribute("stroke-opacity", "0.5")) : a.setAttribute("stroke-opacity", r.opacity.toString()), o.push(a), o;
}
function fn(t, e, n, i) {
  const r = (f) => 1 / (1 + Math.exp(-2 * f)), a = [];
  for (let f = -3; f <= 3; f += 0.1) {
    const h = r(f);
    a.push([h, f]);
  }
  const c = Kt().domain([0, 1]).range([t, n]), u = Kt().domain([0, 1]).range([e, i]);
  return Ps().x((f) => {
    const h = (f[1] + 3) / 6;
    return c(h);
  }).y((f) => u(f[0]))(a);
}
const Rs = {
  sigmoidHorizontalLimited: Is
}, Ds = "sigmoidHorizontalLimited";
class Xs {
  element = null;
  container;
  documentClickHandler = null;
  constructor(e) {
    this.container = e;
  }
  /**
   * Show the popup with the given content at the specified position
   * @param content The text content to display
   * @param x X coordinate relative to the viewport
   * @param y Y coordinate relative to the viewport
   */
  show(e, n, i) {
    this.hide(), this.element = document.createElement("div"), this.element.className = "info-popup";
    const r = document.createElement("button");
    r.className = "info-popup-close", r.innerHTML = "&times;", r.addEventListener("click", (s) => {
      s.stopPropagation(), this.hide();
    });
    const o = document.createElement("div");
    o.className = "info-popup-content", o.textContent = e, this.element.appendChild(r), this.element.appendChild(o), this.container.appendChild(this.element), this.positionPopup(n, i), setTimeout(() => {
      this.documentClickHandler = (s) => {
        this.element && !this.element.contains(s.target) && this.hide();
      }, document.addEventListener("click", this.documentClickHandler);
    }, 0);
  }
  /**
   * Position the popup near the click point, adjusting for container edges
   */
  positionPopup(e, n) {
    if (!this.element) return;
    const i = this.container.getBoundingClientRect(), r = 250, o = 150, s = 10;
    let a = e - i.left + s, c = n - i.top + s;
    a + r > i.width && (a = e - i.left - r - s), c + o > i.height && (c = n - i.top - o - s), a = Math.max(10, a), c = Math.max(10, c), this.element.style.left = `${a}px`, this.element.style.top = `${c}px`;
  }
  /**
   * Hide and remove the popup
   */
  hide() {
    this.element && (this.element.remove(), this.element = null), this.documentClickHandler && (document.removeEventListener("click", this.documentClickHandler), this.documentClickHandler = null);
  }
  /**
   * Check if the popup is currently visible
   */
  isVisible() {
    return this.element !== null;
  }
  /**
   * Clean up resources
   */
  destroy() {
    this.hide();
  }
}
class Bs {
  container;
  svg = null;
  data = null;
  options;
  viewport;
  eventListeners = /* @__PURE__ */ new Map();
  laneAssignments = [];
  rowMapping = /* @__PURE__ */ new Map();
  infoPopup = null;
  constructor(e, n = {}) {
    if (typeof e == "string") {
      const i = document.querySelector(e);
      if (!i || !(i instanceof HTMLElement))
        throw new Error(`Container element not found: ${e}`);
      this.container = i;
    } else
      this.container = e;
    this.options = {
      width: n.width ?? this.container.clientWidth,
      height: n.height ?? this.container.clientHeight,
      initialStartTime: n.initialStartTime ?? "1900-01-01",
      initialEndTime: n.initialEndTime ?? Temporal.Now.instant().toString(),
      minZoom: n.minZoom ?? 0.1,
      maxZoom: n.maxZoom ?? 1e9,
      // Support geological/astronomical to human timescales
      theme: n.theme ?? "light",
      constraints: n.constraints ?? {
        minEventWidth: 2,
        maxEventWidth: 20,
        minPeriodHeight: 20,
        maxPeriodHeight: 60,
        laneHeight: 80,
        laneGap: 16
      },
      periodLayoutAlgorithm: n.periodLayoutAlgorithm ?? "succession",
      connectorRenderer: n.connectorRenderer ?? Ds,
      showRowNumbers: n.showRowNumbers ?? !1
    }, this.viewport = {
      startTime: b(this.options.initialStartTime),
      endTime: b(this.options.initialEndTime),
      zoomLevel: 1,
      centerTime: 0
    }, this.viewport.centerTime = (this.viewport.startTime + this.viewport.endTime) / 2;
  }
  /**
   * Render timeline with data
   */
  render(e) {
    this.data = e;
    const { minTime: n, maxTime: i } = this.calculateDataTimeRange(e);
    this.viewport.startTime = n, this.viewport.endTime = i, this.viewport.centerTime = (n + i) / 2, this.viewport.zoomLevel = 1;
    const r = bn(
      e.periods,
      e.events,
      this.options.periodLayoutAlgorithm,
      e.connectors
    );
    this.laneAssignments = r, this.rowMapping = this.buildRowMapping(), this.createSVG(), this.renderTimeline();
  }
  /**
   * Zoom controls
   */
  zoomIn() {
    this.setZoomLevel(this.viewport.zoomLevel * 1.5);
  }
  zoomOut() {
    this.setZoomLevel(this.viewport.zoomLevel / 1.5);
  }
  zoomTo(e, n) {
    this.viewport.startTime = b(e), this.viewport.endTime = b(n), this.viewport.centerTime = (this.viewport.startTime + this.viewport.endTime) / 2, this.viewport.zoomLevel = 1, this.updateView();
  }
  setZoomLevel(e, n) {
    if (!this.data) return;
    const i = this.viewport.zoomLevel, r = this.viewport.endTime - this.viewport.startTime, o = n !== void 0 ? n : this.viewport.centerTime, { minTime: s, maxTime: a } = this.calculateDataTimeRange(this.data), c = a - s, u = this.viewport.endTime - this.viewport.startTime, l = Math.min(
      this.options.minZoom,
      i * (u / c)
    ), f = this.findShortestPeriod();
    let h = this.options.maxZoom;
    if (f !== null) {
      const m = f * 10;
      h = Math.min(
        this.options.maxZoom,
        c / m
      );
    }
    const d = Math.max(
      l,
      Math.min(h, e)
    );
    if (d === i)
      return;
    this.viewport.zoomLevel = d;
    let p = r * (i / d);
    p = Math.min(p, c * 1.05), this.viewport.centerTime = o, this.viewport.startTime = o - p / 2, this.viewport.endTime = o + p / 2, this.clampPanPosition();
    const g = this.viewport.endTime - this.viewport.startTime;
    this.viewport.startTime = this.viewport.centerTime - g / 2, this.viewport.endTime = this.viewport.centerTime + g / 2, this.updateView(), this.emit("zoom", this.viewport.zoomLevel);
  }
  /**
   * Pan controls
   */
  panTo(e) {
    this.viewport.centerTime = b(e), this.clampPanPosition(), this.recalculateViewportBounds(), this.updateView(), this.emit("pan", this.viewport.centerTime);
  }
  panBy(e) {
    const n = this.viewport.endTime - this.viewport.startTime, i = e / this.options.width * n;
    this.viewport.centerTime += i, this.clampPanPosition(), this.recalculateViewportBounds(), this.updateView(), this.emit("pan", this.viewport.centerTime);
  }
  /**
   * Data manipulation
   */
  addEvent(e) {
    this.data && (this.data.events.push(e), this.render(this.data));
  }
  addPeriod(e) {
    this.data && (this.data.periods.push(e), this.render(this.data));
  }
  addConnector(e) {
    this.data && (this.data.connectors.push(e), this.render(this.data));
  }
  removeItem(e) {
    this.data && (this.data.events = this.data.events.filter((n) => n.id !== e), this.data.periods = this.data.periods.filter((n) => n.id !== e), this.data.connectors = this.data.connectors.filter((n) => n.id !== e), this.render(this.data));
  }
  updateItem(e, n) {
    if (!this.data) return;
    const i = this.data.events.find((o) => o.id === e);
    i && Object.assign(i, n);
    const r = this.data.periods.find((o) => o.id === e);
    r && Object.assign(r, n), this.render(this.data);
  }
  /**
   * Toggle row numbers visibility
   */
  setShowRowNumbers(e) {
    this.options.showRowNumbers = e, this.renderTimeline();
  }
  /**
   * Export
   */
  toSVG() {
    return this.svg?.outerHTML ?? "";
  }
  async toPNG() {
    throw new Error("PNG export not yet implemented");
  }
  destroy() {
    this.infoPopup && (this.infoPopup.destroy(), this.infoPopup = null), this.svg && (this.svg.remove(), this.svg = null), this.eventListeners.clear();
  }
  /**
   * Get current viewport state (for debugging)
   */
  getViewport() {
    return { ...this.viewport };
  }
  on(e, n) {
    this.eventListeners.has(e) || this.eventListeners.set(e, /* @__PURE__ */ new Set()), this.eventListeners.get(e).add(n);
  }
  /**
   * Private methods
   */
  createSVG() {
    this.svg && this.svg.remove(), this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.svg.setAttribute("width", this.options.width.toString());
    const e = this.rowMapping.size > 0 ? Math.max(...this.rowMapping.values()) + 1 : 1, n = this.options.constraints.minPeriodHeight, i = this.options.constraints.laneGap, s = 60 + e * (n + i) + 20, a = Math.max(this.options.height, s);
    this.svg.setAttribute("height", a.toString()), this.svg.style.border = "1px solid #ccc", this.svg.style.background = "#fff", this.svg.style.cursor = "grab", this.svg.style.userSelect = "none", this.setupDragToPan(), this.container.appendChild(this.svg), this.infoPopup || (this.infoPopup = new Xs(this.container));
  }
  /**
   * Set up mouse drag to pan and double-click to zoom
   */
  setupDragToPan() {
    if (!this.svg) return;
    let e = !1, n = 0, i = 0, r = 0;
    this.svg.addEventListener("mousedown", (s) => {
      const a = Date.now();
      if (a - r < 300) {
        this.handleDoubleClick(s), r = 0;
        return;
      }
      r = a, e = !0, n = s.clientX, i = this.viewport.centerTime, this.svg && (this.svg.style.cursor = "grabbing");
    }), this.svg.addEventListener("mousemove", (s) => {
      if (!e) return;
      const a = s.clientX - n, c = this.viewport.endTime - this.viewport.startTime, u = -a / this.options.width * c;
      this.viewport.centerTime = i + u, this.clampPanPosition(), this.recalculateViewportBounds(), this.updateView(), this.emit("pan", this.viewport.centerTime);
    });
    const o = () => {
      e && this.svg && (e = !1, this.svg.style.cursor = "grab");
    };
    this.svg.addEventListener("mouseup", o), this.svg.addEventListener("mouseleave", o), this.svg.addEventListener("wheel", (s) => {
      s.preventDefault(), s.deltaY < 0 ? this.zoomIn() : this.zoomOut();
    });
  }
  /**
   * Handle double-click to zoom in centered on click position
   */
  handleDoubleClick(e) {
    if (!this.svg) return;
    const n = this.svg.getBoundingClientRect(), i = e.clientX - n.left, r = this.xToTime(i), o = this.viewport.zoomLevel * 1.5;
    this.setZoomLevel(o, r);
  }
  /**
   * Convert pixel position to time
   */
  xToTime(e) {
    const n = this.viewport.endTime - this.viewport.startTime, i = e / this.options.width;
    return this.viewport.startTime + n * i;
  }
  updateView() {
    this.data && this.renderTimeline();
  }
  emit(e, ...n) {
    const i = this.eventListeners.get(e);
    i && i.forEach((r) => r(...n));
  }
  /**
   * Calculate the time range that encompasses all data
   */
  calculateDataTimeRange(e) {
    let n = 1 / 0, i = -1 / 0;
    for (const s of e.events) {
      const a = b(s.time);
      n = Math.min(n, a), i = Math.max(i, a);
    }
    for (const s of e.periods) {
      const a = b(s.startTime), c = it(s.endTime, !1);
      n = Math.min(n, a), i = Math.max(i, c);
    }
    (n === 1 / 0 || i === -1 / 0) && (n = b(this.options.initialStartTime), i = b(this.options.initialEndTime));
    const o = (i - n) * 0.025;
    return {
      minTime: n - o,
      maxTime: i + o
    };
  }
  /**
   * Find the shortest period duration in the data
   * Skips ongoing periods (those without endTime)
   */
  findShortestPeriod() {
    if (!this.data || this.data.periods.length === 0)
      return null;
    let e = 1 / 0;
    for (const n of this.data.periods) {
      if (n.endTime === void 0 || n.endTime === null)
        continue;
      const i = b(n.startTime), o = b(n.endTime) - i;
      o > 0 && (e = Math.min(e, o));
    }
    return e === 1 / 0 ? null : e;
  }
  /**
   * Clamp pan position to prevent excessive empty space (15% max on each side)
   */
  clampPanPosition() {
    if (!this.data) return;
    let e = 1 / 0, n = -1 / 0;
    for (const a of this.data.events) {
      const c = b(a.time);
      e = Math.min(e, c), n = Math.max(n, c);
    }
    for (const a of this.data.periods) {
      const c = b(a.startTime), u = it(a.endTime, !1);
      e = Math.min(e, c), n = Math.max(n, u);
    }
    if (e === 1 / 0 || n === -1 / 0)
      return;
    const i = this.viewport.endTime - this.viewport.startTime, r = i * 0.15, o = e - r + i / 2, s = n + r - i / 2;
    this.viewport.centerTime = Math.max(
      o,
      Math.min(s, this.viewport.centerTime)
    );
  }
  /**
   * Recalculate viewport start/end times based on center and current range
   */
  recalculateViewportBounds() {
    const e = this.viewport.endTime - this.viewport.startTime;
    this.viewport.startTime = this.viewport.centerTime - e / 2, this.viewport.endTime = this.viewport.centerTime + e / 2;
  }
  /**
   * Convert normalized time to pixel position
   */
  timeToX(e) {
    const n = this.viewport.endTime - this.viewport.startTime, i = this.options.width / n;
    return (e - this.viewport.startTime) * i;
  }
  /**
   * Convert lane assignments to sequential row numbers
   * This normalizes sparse lane assignments (e.g., 0, 1, 5, 10) to dense rows (0, 1, 2, 3)
   */
  buildRowMapping() {
    const e = /* @__PURE__ */ new Map(), n = this.laneAssignments.filter(
      (a) => a.type === "period"
    ), i = this.laneAssignments.filter(
      (a) => a.type === "event"
    ), r = [...new Set(n.map((a) => a.lane))].sort(
      (a, c) => a - c
    ), o = [...new Set(i.map((a) => a.lane))].sort(
      (a, c) => a - c
    );
    n.forEach((a) => {
      const c = r.indexOf(a.lane);
      e.set(a.itemId, c);
    });
    const s = r.length;
    return i.forEach((a) => {
      const c = o.indexOf(a.lane), u = s + c;
      e.set(a.itemId, u);
    }), e;
  }
  /**
   * Get Y position for a row
   * Simple row-based positioning with configurable gaps
   */
  rowToY(e, n) {
    const i = this.options.constraints.minPeriodHeight, r = 20, o = this.options.constraints.laneGap, s = 60;
    return n === "period" ? s + e * (i + o) : s + e * (r + o);
  }
  /**
   * Main rendering method
   */
  renderTimeline() {
    if (!(!this.svg || !this.data)) {
      this.svg.innerHTML = "", this.options.showRowNumbers && this.renderRowNumbers(), this.renderTimeAxis();
      for (const e of this.data.connectors)
        this.renderConnector(e);
      for (const e of this.data.periods)
        this.renderPeriod(e);
      for (const e of this.data.events)
        this.renderEvent(e);
    }
  }
  /**
   * Render row numbers for debugging
   */
  renderRowNumbers() {
    if (!this.svg) return;
    const e = this.rowMapping.size > 0 ? Math.max(...this.rowMapping.values()) + 1 : 0, n = this.options.constraints.minPeriodHeight;
    for (let i = 0; i < e; i++) {
      let r = !0;
      for (const [c, u] of this.rowMapping.entries())
        if (u === i && this.laneAssignments.find(
          (f) => f.itemId === c
        )?.type === "period") {
          r = !1;
          break;
        }
      const o = this.rowToY(i, r ? "event" : "period"), s = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      s.setAttribute("x", "0"), s.setAttribute("y", o.toString()), s.setAttribute("width", "30"), s.setAttribute("height", n.toString()), s.setAttribute("fill", "#f0f0f0"), s.setAttribute("stroke", "#ccc"), s.setAttribute("stroke-width", "0.5"), this.svg.appendChild(s);
      const a = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      a.setAttribute("x", "15"), a.setAttribute("y", (o + n / 2 + 4).toString()), a.setAttribute("text-anchor", "middle"), a.setAttribute("font-size", "10"), a.setAttribute("fill", "#666"), a.setAttribute("font-family", "monospace"), a.textContent = i.toString(), this.svg.appendChild(a);
    }
  }
  /**
   * Render time axis
   */
  renderTimeAxis() {
    if (!this.svg) return;
    const e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    e.setAttribute("id", "time-axis-background"), e.setAttribute("x", "0"), e.setAttribute("y", "0"), e.setAttribute("width", this.options.width.toString()), e.setAttribute("height", "40"), e.setAttribute("fill", "#f8f9fa"), this.svg.appendChild(e), this.renderBigBangBoundary();
    const n = document.createElementNS("http://www.w3.org/2000/svg", "line");
    n.setAttribute("x1", "0"), n.setAttribute("y1", "40"), n.setAttribute("x2", this.options.width.toString()), n.setAttribute("y2", "40"), n.setAttribute("stroke", "#666"), n.setAttribute("stroke-width", "2"), this.svg.appendChild(n);
    const i = 40, r = this.options.width - i * 2, o = 10, s = this.viewport.endTime - this.viewport.startTime;
    for (let a = 0; a <= o; a++) {
      const c = i + r / o * a, u = (c - 0) / this.options.width, l = this.viewport.startTime + s * u, f = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      if (f.setAttribute("x1", c.toString()), f.setAttribute("y1", "40"), f.setAttribute("x2", c.toString()), f.setAttribute("y2", "50"), f.setAttribute("stroke", "#666"), f.setAttribute("stroke-width", "1"), this.svg.appendChild(f), l >= nt) {
        const h = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        h.setAttribute("x", c.toString()), h.setAttribute("y", "25"), h.setAttribute("text-anchor", "middle"), h.setAttribute("font-size", "11"), h.setAttribute("fill", "#666"), h.textContent = this.formatTimeLabel(l), this.svg.appendChild(h);
      }
    }
  }
  /**
   * Render Big Bang boundary and static noise
   */
  renderBigBangBoundary() {
    if (!this.svg) return;
    const e = this.timeToX(nt);
    if (e < 0 || e > this.options.width)
      return;
    const n = parseFloat(this.svg.getAttribute("height") || "500"), i = "static-noise-pattern";
    let r = this.svg.querySelector("defs");
    r || (r = document.createElementNS("http://www.w3.org/2000/svg", "defs"), this.svg.insertBefore(r, this.svg.firstChild));
    const o = r.querySelector(`#${i}`);
    o && o.remove();
    const s = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    s.setAttribute("id", "noise-filter"), s.setAttribute("x", "0"), s.setAttribute("y", "0"), s.setAttribute("width", "100%"), s.setAttribute("height", "100%");
    const a = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feTurbulence"
    );
    a.setAttribute("type", "fractalNoise"), a.setAttribute("baseFrequency", "2.5"), a.setAttribute("numOctaves", "5"), a.setAttribute("result", "noise");
    const c = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feColorMatrix"
    );
    if (c.setAttribute("in", "noise"), c.setAttribute("type", "matrix"), c.setAttribute(
      "values",
      "0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0"
    ), s.appendChild(a), s.appendChild(c), r.appendChild(s), e > 0) {
      const u = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      u.setAttribute("x", "0"), u.setAttribute("y", "40"), u.setAttribute("width", e.toString()), u.setAttribute("height", (n - 40).toString()), u.setAttribute("fill", "#d0d0d0"), u.setAttribute("filter", "url(#noise-filter)"), u.setAttribute("opacity", "0.35"), this.svg.appendChild(u);
      const l = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      l.setAttribute("x1", e.toString()), l.setAttribute("y1", "40"), l.setAttribute("x2", e.toString()), l.setAttribute("y2", n.toString()), l.setAttribute("stroke", "#333"), l.setAttribute("stroke-width", "2"), l.setAttribute("stroke-dasharray", "5,5"), this.svg.appendChild(l);
      const f = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      f.setAttribute("x", (e - 5).toString()), f.setAttribute("y", "55"), f.setAttribute("text-anchor", "end"), f.setAttribute("font-size", "10"), f.setAttribute("fill", "#666"), f.setAttribute("font-style", "italic"), f.textContent = "Big Bang", this.svg.appendChild(f);
    }
  }
  /**
   * Format time for axis labels
   */
  formatTimeLabel(e) {
    return e < -1e6 ? `${(Math.abs(e) / 1e6).toFixed(0)}M BCE` : e < 0 ? `${Math.abs(Math.floor(e))} BCE` : e < 1e3 ? `${Math.floor(e)} CE` : Math.floor(e).toString();
  }
  /**
   * Format TimeInput for display in info popup
   */
  formatTimeForDisplay(e) {
    if (typeof e == "string")
      try {
        return new Date(e).toLocaleDateString(void 0, {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      } catch {
        return e;
      }
    else {
      if (e instanceof Temporal.Instant)
        return new Date(e.epochMilliseconds).toLocaleDateString(void 0, {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      if ("era" in e)
        return `${e.year} ${e.era}`;
      if ("unit" in e)
        return e.unit === "mya" ? `${e.value} million years ago` : `${e.value} years ago`;
      if ("localTime" in e)
        return `${e.localTime} (${e.timezone})`;
    }
    return String(e);
  }
  /**
   * Render a period as a rectangle
   */
  renderPeriod(e) {
    if (!this.svg) return;
    const n = this.laneAssignments.find((f) => f.itemId === e.id);
    if (!n) return;
    const i = this.rowMapping.get(e.id);
    if (i === void 0) return;
    const r = this.timeToX(n.startTime), o = n.endTime === 1 / 0 ? Ce() : n.endTime, s = this.timeToX(o), a = this.rowToY(i, "period"), c = Math.max(2, s - r), u = this.options.constraints.minPeriodHeight, l = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    if (l.setAttribute("id", e.id), l.setAttribute("x", r.toString()), l.setAttribute("y", a.toString()), l.setAttribute("width", c.toString()), l.setAttribute("height", u.toString()), l.setAttribute("fill", "#000"), l.setAttribute("fill-opacity", "0.85"), l.setAttribute("stroke", "#000"), l.setAttribute("stroke-width", "1"), l.setAttribute("rx", (u / 2).toString()), l.style.cursor = "pointer", l.addEventListener("click", (f) => {
      if (f.stopPropagation(), this.infoPopup) {
        const h = this.formatTimeForDisplay(e.startTime), d = e.endTime ? this.formatTimeForDisplay(e.endTime) : "ongoing";
        let p = `${e.name}
${h} – ${d}`;
        e.info && (p += `

${e.info}`), this.infoPopup.show(p, f.clientX, f.clientY);
      }
      this.emit("itemClick", e);
    }), this.svg.appendChild(l), c > 40) {
      const f = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      f.setAttribute("x", (r + c / 2).toString()), f.setAttribute("y", (a + u / 2 + 4).toString()), f.setAttribute("text-anchor", "middle"), f.setAttribute("font-size", "11"), f.setAttribute("fill", "#fff"), f.setAttribute("font-weight", "bold"), f.setAttribute("pointer-events", "none"), f.textContent = e.name, this.svg.appendChild(f);
    }
  }
  /**
   * Render an event as a marker
   */
  renderEvent(e) {
    if (!this.svg) return;
    const n = this.laneAssignments.find((u) => u.itemId === e.id);
    if (!n) return;
    const i = this.rowMapping.get(e.id);
    if (i === void 0) return;
    const r = this.timeToX(n.startTime), o = this.rowToY(i, "event"), s = 20, a = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    a.setAttribute("id", e.id), a.setAttribute("cx", r.toString()), a.setAttribute("cy", (o + s / 2).toString()), a.setAttribute("r", "4"), a.setAttribute("fill", "none"), a.setAttribute("stroke", "#000"), a.setAttribute("stroke-width", "2"), a.style.cursor = "pointer", a.addEventListener("click", (u) => {
      if (u.stopPropagation(), this.infoPopup) {
        const l = this.formatTimeForDisplay(e.time);
        let f = `${e.name}
${l}`;
        e.info && (f += `

${e.info}`), this.infoPopup.show(f, u.clientX, u.clientY);
      }
      this.emit("itemClick", e);
    }), this.svg.appendChild(a);
    const c = document.createElementNS("http://www.w3.org/2000/svg", "text");
    c.setAttribute("x", (r + 8).toString()), c.setAttribute("y", (o + s / 2 + 4).toString()), c.setAttribute("font-size", "10"), c.setAttribute("fill", "#333"), c.setAttribute("pointer-events", "none"), c.textContent = e.name, this.svg.appendChild(c);
  }
  /**
   * Render a connector between periods
   */
  renderConnector(e) {
    if (!this.svg || !this.data) return;
    const n = this.laneAssignments.find(
      (v) => v.itemId === e.fromId
    ), i = this.laneAssignments.find(
      (v) => v.itemId === e.toId
    );
    if (!n || !i) return;
    const r = this.timeToX(n.startTime), s = this.timeToX(n.endTime) - r, a = this.timeToX(i.startTime), u = this.timeToX(i.endTime) - a;
    if (s < 10 || u < 10)
      return;
    const l = this.rowMapping.get(e.fromId), f = this.rowMapping.get(e.toId);
    if (l === void 0 || f === void 0) return;
    const d = this.data.periods.find((v) => v.id === e.fromId) ? "#000" : "#f587f3", p = Math.min(
      n.endTime,
      i.startTime
    ), g = this.timeToX(p), m = this.timeToX(i.startTime), y = this.rowToY(l, n.type) + this.options.constraints.minPeriodHeight / 2, w = this.rowToY(f, i.type) + this.options.constraints.minPeriodHeight / 2, x = Rs[this.options.connectorRenderer];
    if (!x) {
      console.warn(
        `Connector renderer not found: ${this.options.connectorRenderer}`
      );
      return;
    }
    x.render({
      fromX: g,
      fromY: y,
      toX: m,
      toY: w,
      connectorType: e.type,
      color: d,
      opacity: 0.85
    }).forEach((v) => {
      v.setAttribute("id", e.id), this.svg.appendChild(v);
    });
  }
}
export {
  nt as BIG_BANG_TIME,
  Rs as CONNECTOR_RENDERERS,
  Ds as DEFAULT_CONNECTOR,
  Tn as DEFAULT_PERIOD_LAYOUT,
  xn as PERIOD_LAYOUT_ALGORITHMS,
  Bs as TimelineRenderer,
  bn as assignLanes,
  Hs as determineTimeScale,
  Os as formatTime,
  Ys as formatValidationResult,
  zs as getLaneCount,
  b as normalizeTime,
  Fs as validateTimelineData
};
//# sourceMappingURL=thymeline.js.map
