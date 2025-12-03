function T(t) {
  if (typeof t == "string") {
    const e = new Date(t);
    return Lt(e);
  }
  if (t instanceof Date)
    return Lt(t);
  if ("year" in t && "era" in t)
    return t.era === "CE" ? t.year : -t.year;
  if ("value" in t && "unit" in t) {
    const e = (/* @__PURE__ */ new Date()).getFullYear();
    return t.unit === "mya" ? -(t.value * 1e6) : e - t.value;
  }
  if ("localTime" in t && "timezone" in t) {
    const e = new Date(t.localTime);
    return Lt(e);
  }
  throw new Error(`Unsupported time input format: ${JSON.stringify(t)}`);
}
function Lt(t) {
  const e = t.getFullYear(), n = new Date(e, 0, 1).getTime(), i = new Date(e + 1, 0, 1).getTime(), r = (t.getTime() - n) / (i - n);
  return e + r;
}
function Po(t, e) {
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
    return e === "precise" ? cn(t).toISOString() : n.toString();
  }
}
function cn(t) {
  const e = Math.floor(t), n = t - e, i = new Date(e, 0, 1).getTime(), r = new Date(e + 1, 0, 1).getTime(), s = i + n * (r - i);
  return new Date(s);
}
function Ro(t, e) {
  const n = e - t;
  return n > 1e6 || t < -1e6 ? "geological" : n > 1e4 || t < -1e4 ? "prehistoric" : n > 1e3 ? "historical" : n > 1 ? "modern" : "precise";
}
function ln(t, e) {
  const n = /* @__PURE__ */ new Map();
  t.forEach((m) => {
    n.set(m.id, {
      name: m.name,
      startTime: T(m.startTime),
      endTime: T(m.endTime)
    });
  });
  const i = e.filter((m) => m.type === "defined"), r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  i.forEach((m) => {
    r.has(m.fromId) || r.set(m.fromId, []), r.get(m.fromId).push(m.toId), s.has(m.toId) || s.set(m.toId, []), s.get(m.toId).push(m.fromId);
  });
  const o = [];
  (/* @__PURE__ */ new Set([
    ...i.map((m) => m.fromId),
    ...i.map((m) => m.toId)
  ])).forEach((m) => {
    s.has(m) || o.push(m);
  });
  const u = /* @__PURE__ */ new Map();
  function c(m) {
    const y = /* @__PURE__ */ new Set();
    let w = [m];
    for (; w.length > 0; ) {
      const x = [];
      for (const b of w) {
        if (y.has(b)) continue;
        y.add(b);
        const v = s.get(b) || [];
        if (v.length === 0) {
          const A = n.get(b);
          if (A)
            return { rootId: b, rootStartTime: A.startTime };
        } else
          x.push(...v);
      }
      w = x;
    }
    return null;
  }
  s.forEach((m, y) => {
    if (m.length > 1) {
      let w = null;
      for (const x of m) {
        const b = c(x);
        b && (!w || b.rootStartTime < w.rootStartTime) && (w = b);
      }
      w && u.set(y, w.rootId);
    }
  });
  const l = /* @__PURE__ */ new Set();
  function f(m, y) {
    const w = n.get(m);
    if (!w || u.has(m) && u.get(m) !== y || l.has(m))
      return null;
    l.add(m);
    const x = {
      id: m,
      name: w.name,
      startTime: w.startTime,
      endTime: w.endTime,
      children: []
    }, b = r.get(m) || [];
    for (const v of b) {
      const A = f(v, y);
      A && x.children.push(A);
    }
    return x.children.sort((v, A) => v.startTime - A.startTime), x;
  }
  const h = [], d = /* @__PURE__ */ new Set();
  function p(m, y) {
    y.add(m.id), m.children.forEach((w) => p(w, y));
  }
  for (const m of o) {
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
function Xt(t) {
  let e = t.endTime;
  for (const n of t.children) {
    const i = Xt(n);
    i > e && (e = i);
  }
  return e;
}
function Kt(t) {
  const e = [t], n = t.children.filter((a) => a.startTime >= t.endTime);
  if (n.length === 0)
    return e;
  let i = n[0], r = i.startTime, s = Xt(i);
  for (let a = 1; a < n.length; a++) {
    const u = n[a], c = Xt(u);
    u.startTime < r ? (i = u, r = u.startTime, s = c) : u.startTime === r && c > s && (i = u, s = c);
  }
  const o = Kt(i);
  return e.push(...o), e;
}
function fn(t) {
  const e = new Set(t.map((i) => i.id)), n = [];
  for (const i of t)
    for (const r of i.children)
      if (!e.has(r.id)) {
        const s = Kt(r);
        n.push(s);
      }
  return n;
}
function hn(t, e, n, i) {
  return t < i && n < e;
}
function Ee(t, e, n, i) {
  const r = i.find(
    (s) => s.lane === n && hn(t, e, s.startTime, s.endTime)
  );
  return r ? r.id : null;
}
function ae(t, e, n, i) {
  for (const r of t) {
    const s = Ee(r.startTime, r.endTime, e, n);
    if (s)
      return i.get(s), !1;
  }
  return !0;
}
function Pt(t, e, n) {
  for (const i of t)
    n.push({
      id: i.id,
      lane: e,
      startTime: i.startTime,
      endTime: i.endTime
    });
}
function dn(t, e, n, i) {
  const r = [], s = Kt(t.root);
  let o = e;
  const a = 100;
  let u = 0;
  for (; u < a; ) {
    if (o < 0) {
      o = 0, u++;
      continue;
    }
    const g = [...n, ...r];
    if (ae(s, o, g, i)) {
      Pt(s, o, r);
      break;
    }
    o++, u++;
  }
  const c = [{ trunk: s, parentLane: o, isAboveParent: null }], l = /* @__PURE__ */ new Map();
  l.set(s[0].id, o);
  let f = 0;
  for (; f < c.length; ) {
    const { trunk: g, parentLane: m, isAboveParent: y } = c[f], w = y === null, x = fn(g);
    x.length > 0;
    let b = 1, v = 1, A = w ? !0 : y;
    for (let Q = 0; Q < x.length; Q++) {
      const O = x[Q], It = O[0].id;
      let $, _ = !1;
      for (u = 0; !_ && u < a; ) {
        if (A ? $ = m + b : $ = m - v, $ < 0) {
          o++, r.length = 0, Pt(s, o, r), c.length = 1, c[0] = { trunk: s, parentLane: o, isAboveParent: null }, l.clear(), l.set(s[0].id, o), f = -1;
          break;
        }
        const P = [...n, ...r];
        if (ae(O, $, P, i)) {
          Pt(O, $, r), _ = !0, l.set(It, $);
          const M = $ > m;
          c.push({ trunk: O, parentLane: $, isAboveParent: M }), A ? b++ : v++, w && (A = !A);
        } else
          A ? b++ : v++;
        u++;
      }
    }
    f++;
  }
  const h = r.map((g) => g.lane), d = h.length > 0 ? Math.min(...h) : o, p = h.length > 0 ? Math.max(...h) : o;
  return { placements: r, minLane: d, maxLane: p };
}
function mn(t, e) {
  const n = [], i = Array.from(t.entries()).sort((r, s) => r[1].startTime - s[1].startTime);
  for (const [r, s] of i) {
    let o = 0;
    const a = [...e, ...n];
    for (; Ee(s.startTime, s.endTime, o, a); )
      o++;
    n.push({
      id: r,
      lane: o,
      startTime: s.startTime,
      endTime: s.endTime
    });
  }
  return n;
}
const pn = {
  name: "Succession-based",
  description: "Periods that succeed each other are placed on the same row",
  layout(t, e = []) {
    if (t.length === 0)
      return [];
    const { trees: n, unconnectedPeriods: i, periodMap: r } = ln(t, e);
    n.forEach((c, l) => {
    });
    const s = [];
    let o = 0;
    for (let c = 0; c < n.length; c++) {
      const l = n[c], { placements: f, maxLane: h } = dn(l, o, s, r);
      s.push(...f), o = h + 1;
    }
    const a = mn(i, s);
    s.push(...a);
    const u = s.map((c) => ({
      itemId: c.id,
      lane: c.lane,
      startTime: c.startTime,
      endTime: c.endTime,
      type: "period"
    }));
    return u.forEach((c) => {
    }), u;
  }
};
function gn(t, e) {
  return t < e;
}
function wn(t, e = 0) {
  const n = [], i = t.map((s) => {
    const o = T(s.time);
    return {
      id: s.id,
      time: o
    };
  });
  i.sort((s, o) => s.time - o.time);
  const r = [];
  for (const s of i) {
    let o = -1;
    for (let a = 0; a < Math.min(r.length, 3); a++)
      if (!gn(s.time, r[a].endTime)) {
        o = a;
        break;
      }
    if (o === -1 && r.length < 3)
      o = r.length, r.push({ endTime: s.time });
    else if (o === -1) {
      let a = 0, u = r[0].endTime;
      for (let c = 1; c < 3; c++)
        r[c].endTime < u && (a = c, u = r[c].endTime);
      o = a, r[o].endTime = s.time;
    } else
      r[o].endTime = s.time;
    n.push({
      itemId: s.id,
      lane: o + e,
      startTime: s.time,
      endTime: s.time,
      type: "event"
    });
  }
  return n;
}
const vn = {
  succession: pn
}, yn = "succession";
function _n(t, e, n = yn, i = []) {
  const r = vn[n];
  if (!r)
    throw new Error(`Unknown period layout algorithm: ${n}`);
  const s = r.layout(t, i), a = (s.length > 0 ? Math.max(...s.map((c) => c.lane)) : -1) + 1, u = wn(e, a);
  return [...s, ...u];
}
function Do(t) {
  return t.length === 0 ? 0 : Math.max(...t.map((e) => e.lane)) + 1;
}
const nt = -138e8;
function Xo(t) {
  const e = [], n = [], i = [
    ...t.events.map((s) => s.id),
    ...t.periods.map((s) => s.id),
    ...t.connectors.map((s) => s.id)
  ], r = i.filter((s, o) => i.indexOf(s) !== o);
  r.length > 0 && e.push({
    type: "error",
    message: `Duplicate IDs found: ${[...new Set(r)].join(", ")}`
  });
  for (const s of t.periods)
    try {
      const o = T(s.startTime), a = T(s.endTime);
      o > a && e.push({
        type: "error",
        message: `Period "${s.name}" has start time after end time`,
        itemId: s.id
      }), o < nt && e.push({
        type: "error",
        message: `Period "${s.name}" starts before the Big Bang (13.8 billion years ago). Start time: ${o.toExponential(2)}`,
        itemId: s.id
      }), a < nt && e.push({
        type: "error",
        message: `Period "${s.name}" ends before the Big Bang (13.8 billion years ago). End time: ${a.toExponential(2)}`,
        itemId: s.id
      });
    } catch (o) {
      e.push({
        type: "error",
        message: `Period "${s.name}" has invalid time format: ${o instanceof Error ? o.message : String(o)}`,
        itemId: s.id
      });
    }
  for (const s of t.connectors) {
    const o = t.periods.find((u) => u.id === s.fromId), a = t.periods.find((u) => u.id === s.toId);
    if (!o) {
      e.push({
        type: "error",
        message: `Connector "${s.id}" references non-existent period: ${s.fromId}`,
        itemId: s.id
      });
      continue;
    }
    if (!a) {
      e.push({
        type: "error",
        message: `Connector "${s.id}" references non-existent period: ${s.toId}`,
        itemId: s.id
      });
      continue;
    }
    try {
      const u = T(o.startTime), c = T(a.endTime);
      if (u > c) {
        const l = u - c;
        n.push({
          type: "warning",
          message: `Connector "${s.id}" connects "${o.name}" → "${a.name}", but "${o.name}" starts ${l.toFixed(0)} years after "${a.name}" ends. The periods don't overlap in time.`,
          itemId: s.id
        });
      }
    } catch {
    }
  }
  for (const s of t.events)
    try {
      const o = T(s.time);
      o < nt && e.push({
        type: "error",
        message: `Event "${s.name}" is set before the Big Bang (13.8 billion years ago). Time: ${o.toExponential(2)}`,
        itemId: s.id
      });
    } catch (o) {
      e.push({
        type: "error",
        message: `Event "${s.name}" has invalid time format: ${o instanceof Error ? o.message : String(o)}`,
        itemId: s.id
      });
    }
  return {
    valid: e.length === 0,
    errors: e,
    warnings: n
  };
}
function Oo(t) {
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
function pt(t, e) {
  return t == null || e == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function xn(t, e) {
  return t == null || e == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function ke(t) {
  let e, n, i;
  t.length !== 2 ? (e = pt, n = (a, u) => pt(t(a), u), i = (a, u) => t(a) - u) : (e = t === pt || t === xn ? t : bn, n = t, i = t);
  function r(a, u, c = 0, l = a.length) {
    if (c < l) {
      if (e(u, u) !== 0) return l;
      do {
        const f = c + l >>> 1;
        n(a[f], u) < 0 ? c = f + 1 : l = f;
      } while (c < l);
    }
    return c;
  }
  function s(a, u, c = 0, l = a.length) {
    if (c < l) {
      if (e(u, u) !== 0) return l;
      do {
        const f = c + l >>> 1;
        n(a[f], u) <= 0 ? c = f + 1 : l = f;
      } while (c < l);
    }
    return c;
  }
  function o(a, u, c = 0, l = a.length) {
    const f = r(a, u, c, l - 1);
    return f > c && i(a[f - 1], u) > -i(a[f], u) ? f - 1 : f;
  }
  return { left: r, center: o, right: s };
}
function bn() {
  return 0;
}
function Tn(t) {
  return t === null ? NaN : +t;
}
const An = ke(pt), Mn = An.right;
ke(Tn).center;
const Sn = Math.sqrt(50), $n = Math.sqrt(10), Nn = Math.sqrt(2);
function yt(t, e, n) {
  const i = (e - t) / Math.max(0, n), r = Math.floor(Math.log10(i)), s = i / Math.pow(10, r), o = s >= Sn ? 10 : s >= $n ? 5 : s >= Nn ? 2 : 1;
  let a, u, c;
  return r < 0 ? (c = Math.pow(10, -r) / o, a = Math.round(t * c), u = Math.round(e * c), a / c < t && ++a, u / c > e && --u, c = -c) : (c = Math.pow(10, r) * o, a = Math.round(t / c), u = Math.round(e / c), a * c < t && ++a, u * c > e && --u), u < a && 0.5 <= n && n < 2 ? yt(t, e, n * 2) : [a, u, c];
}
function En(t, e, n) {
  if (e = +e, t = +t, n = +n, !(n > 0)) return [];
  if (t === e) return [t];
  const i = e < t, [r, s, o] = i ? yt(e, t, n) : yt(t, e, n);
  if (!(s >= r)) return [];
  const a = s - r + 1, u = new Array(a);
  if (i)
    if (o < 0) for (let c = 0; c < a; ++c) u[c] = (s - c) / -o;
    else for (let c = 0; c < a; ++c) u[c] = (s - c) * o;
  else if (o < 0) for (let c = 0; c < a; ++c) u[c] = (r + c) / -o;
  else for (let c = 0; c < a; ++c) u[c] = (r + c) * o;
  return u;
}
function Ot(t, e, n) {
  return e = +e, t = +t, n = +n, yt(t, e, n)[2];
}
function kn(t, e, n) {
  e = +e, t = +t, n = +n;
  const i = e < t, r = i ? Ot(e, t, n) : Ot(t, e, n);
  return (i ? -1 : 1) * (r < 0 ? 1 / -r : r);
}
var Cn = { value: () => {
} };
function Ce() {
  for (var t = 0, e = arguments.length, n = {}, i; t < e; ++t) {
    if (!(i = arguments[t] + "") || i in n || /[\s.]/.test(i)) throw new Error("illegal type: " + i);
    n[i] = [];
  }
  return new gt(n);
}
function gt(t) {
  this._ = t;
}
function In(t, e) {
  return t.trim().split(/^|\s+/).map(function(n) {
    var i = "", r = n.indexOf(".");
    if (r >= 0 && (i = n.slice(r + 1), n = n.slice(0, r)), n && !e.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: i };
  });
}
gt.prototype = Ce.prototype = {
  constructor: gt,
  on: function(t, e) {
    var n = this._, i = In(t + "", n), r, s = -1, o = i.length;
    if (arguments.length < 2) {
      for (; ++s < o; ) if ((r = (t = i[s]).type) && (r = Ln(n[r], t.name))) return r;
      return;
    }
    if (e != null && typeof e != "function") throw new Error("invalid callback: " + e);
    for (; ++s < o; )
      if (r = (t = i[s]).type) n[r] = ue(n[r], t.name, e);
      else if (e == null) for (r in n) n[r] = ue(n[r], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, e = this._;
    for (var n in e) t[n] = e[n].slice();
    return new gt(t);
  },
  call: function(t, e) {
    if ((r = arguments.length - 2) > 0) for (var n = new Array(r), i = 0, r, s; i < r; ++i) n[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (s = this._[t], i = 0, r = s.length; i < r; ++i) s[i].value.apply(e, n);
  },
  apply: function(t, e, n) {
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (var i = this._[t], r = 0, s = i.length; r < s; ++r) i[r].value.apply(e, n);
  }
};
function Ln(t, e) {
  for (var n = 0, i = t.length, r; n < i; ++n)
    if ((r = t[n]).name === e)
      return r.value;
}
function ue(t, e, n) {
  for (var i = 0, r = t.length; i < r; ++i)
    if (t[i].name === e) {
      t[i] = Cn, t = t.slice(0, i).concat(t.slice(i + 1));
      break;
    }
  return n != null && t.push({ name: e, value: n }), t;
}
var Ht = "http://www.w3.org/1999/xhtml";
const ce = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Ht,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Et(t) {
  var e = t += "", n = e.indexOf(":");
  return n >= 0 && (e = t.slice(0, n)) !== "xmlns" && (t = t.slice(n + 1)), ce.hasOwnProperty(e) ? { space: ce[e], local: t } : t;
}
function Pn(t) {
  return function() {
    var e = this.ownerDocument, n = this.namespaceURI;
    return n === Ht && e.documentElement.namespaceURI === Ht ? e.createElement(t) : e.createElementNS(n, t);
  };
}
function Rn(t) {
  return function() {
    return this.ownerDocument.createElementNS(t.space, t.local);
  };
}
function Ie(t) {
  var e = Et(t);
  return (e.local ? Rn : Pn)(e);
}
function Dn() {
}
function Qt(t) {
  return t == null ? Dn : function() {
    return this.querySelector(t);
  };
}
function Xn(t) {
  typeof t != "function" && (t = Qt(t));
  for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
    for (var s = e[r], o = s.length, a = i[r] = new Array(o), u, c, l = 0; l < o; ++l)
      (u = s[l]) && (c = t.call(u, u.__data__, l, s)) && ("__data__" in u && (c.__data__ = u.__data__), a[l] = c);
  return new k(i, this._parents);
}
function On(t) {
  return t == null ? [] : Array.isArray(t) ? t : Array.from(t);
}
function Hn() {
  return [];
}
function Le(t) {
  return t == null ? Hn : function() {
    return this.querySelectorAll(t);
  };
}
function Yn(t) {
  return function() {
    return On(t.apply(this, arguments));
  };
}
function Fn(t) {
  typeof t == "function" ? t = Yn(t) : t = Le(t);
  for (var e = this._groups, n = e.length, i = [], r = [], s = 0; s < n; ++s)
    for (var o = e[s], a = o.length, u, c = 0; c < a; ++c)
      (u = o[c]) && (i.push(t.call(u, u.__data__, c, o)), r.push(u));
  return new k(i, r);
}
function Pe(t) {
  return function() {
    return this.matches(t);
  };
}
function Re(t) {
  return function(e) {
    return e.matches(t);
  };
}
var Bn = Array.prototype.find;
function zn(t) {
  return function() {
    return Bn.call(this.children, t);
  };
}
function Vn() {
  return this.firstElementChild;
}
function qn(t) {
  return this.select(t == null ? Vn : zn(typeof t == "function" ? t : Re(t)));
}
var Gn = Array.prototype.filter;
function Zn() {
  return Array.from(this.children);
}
function Un(t) {
  return function() {
    return Gn.call(this.children, t);
  };
}
function Wn(t) {
  return this.selectAll(t == null ? Zn : Un(typeof t == "function" ? t : Re(t)));
}
function Kn(t) {
  typeof t != "function" && (t = Pe(t));
  for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
    for (var s = e[r], o = s.length, a = i[r] = [], u, c = 0; c < o; ++c)
      (u = s[c]) && t.call(u, u.__data__, c, s) && a.push(u);
  return new k(i, this._parents);
}
function De(t) {
  return new Array(t.length);
}
function Qn() {
  return new k(this._enter || this._groups.map(De), this._parents);
}
function _t(t, e) {
  this.ownerDocument = t.ownerDocument, this.namespaceURI = t.namespaceURI, this._next = null, this._parent = t, this.__data__ = e;
}
_t.prototype = {
  constructor: _t,
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
function Jn(t) {
  return function() {
    return t;
  };
}
function jn(t, e, n, i, r, s) {
  for (var o = 0, a, u = e.length, c = s.length; o < c; ++o)
    (a = e[o]) ? (a.__data__ = s[o], i[o] = a) : n[o] = new _t(t, s[o]);
  for (; o < u; ++o)
    (a = e[o]) && (r[o] = a);
}
function ti(t, e, n, i, r, s, o) {
  var a, u, c = /* @__PURE__ */ new Map(), l = e.length, f = s.length, h = new Array(l), d;
  for (a = 0; a < l; ++a)
    (u = e[a]) && (h[a] = d = o.call(u, u.__data__, a, e) + "", c.has(d) ? r[a] = u : c.set(d, u));
  for (a = 0; a < f; ++a)
    d = o.call(t, s[a], a, s) + "", (u = c.get(d)) ? (i[a] = u, u.__data__ = s[a], c.delete(d)) : n[a] = new _t(t, s[a]);
  for (a = 0; a < l; ++a)
    (u = e[a]) && c.get(h[a]) === u && (r[a] = u);
}
function ei(t) {
  return t.__data__;
}
function ni(t, e) {
  if (!arguments.length) return Array.from(this, ei);
  var n = e ? ti : jn, i = this._parents, r = this._groups;
  typeof t != "function" && (t = Jn(t));
  for (var s = r.length, o = new Array(s), a = new Array(s), u = new Array(s), c = 0; c < s; ++c) {
    var l = i[c], f = r[c], h = f.length, d = ii(t.call(l, l && l.__data__, c, i)), p = d.length, g = a[c] = new Array(p), m = o[c] = new Array(p), y = u[c] = new Array(h);
    n(l, f, g, m, y, d, e);
    for (var w = 0, x = 0, b, v; w < p; ++w)
      if (b = g[w]) {
        for (w >= x && (x = w + 1); !(v = m[x]) && ++x < p; ) ;
        b._next = v || null;
      }
  }
  return o = new k(o, i), o._enter = a, o._exit = u, o;
}
function ii(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function ri() {
  return new k(this._exit || this._groups.map(De), this._parents);
}
function si(t, e, n) {
  var i = this.enter(), r = this, s = this.exit();
  return typeof t == "function" ? (i = t(i), i && (i = i.selection())) : i = i.append(t + ""), e != null && (r = e(r), r && (r = r.selection())), n == null ? s.remove() : n(s), i && r ? i.merge(r).order() : r;
}
function oi(t) {
  for (var e = t.selection ? t.selection() : t, n = this._groups, i = e._groups, r = n.length, s = i.length, o = Math.min(r, s), a = new Array(r), u = 0; u < o; ++u)
    for (var c = n[u], l = i[u], f = c.length, h = a[u] = new Array(f), d, p = 0; p < f; ++p)
      (d = c[p] || l[p]) && (h[p] = d);
  for (; u < r; ++u)
    a[u] = n[u];
  return new k(a, this._parents);
}
function ai() {
  for (var t = this._groups, e = -1, n = t.length; ++e < n; )
    for (var i = t[e], r = i.length - 1, s = i[r], o; --r >= 0; )
      (o = i[r]) && (s && o.compareDocumentPosition(s) ^ 4 && s.parentNode.insertBefore(o, s), s = o);
  return this;
}
function ui(t) {
  t || (t = ci);
  function e(f, h) {
    return f && h ? t(f.__data__, h.__data__) : !f - !h;
  }
  for (var n = this._groups, i = n.length, r = new Array(i), s = 0; s < i; ++s) {
    for (var o = n[s], a = o.length, u = r[s] = new Array(a), c, l = 0; l < a; ++l)
      (c = o[l]) && (u[l] = c);
    u.sort(e);
  }
  return new k(r, this._parents).order();
}
function ci(t, e) {
  return t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function li() {
  var t = arguments[0];
  return arguments[0] = this, t.apply(null, arguments), this;
}
function fi() {
  return Array.from(this);
}
function hi() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var i = t[e], r = 0, s = i.length; r < s; ++r) {
      var o = i[r];
      if (o) return o;
    }
  return null;
}
function di() {
  let t = 0;
  for (const e of this) ++t;
  return t;
}
function mi() {
  return !this.node();
}
function pi(t) {
  for (var e = this._groups, n = 0, i = e.length; n < i; ++n)
    for (var r = e[n], s = 0, o = r.length, a; s < o; ++s)
      (a = r[s]) && t.call(a, a.__data__, s, r);
  return this;
}
function gi(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function wi(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function vi(t, e) {
  return function() {
    this.setAttribute(t, e);
  };
}
function yi(t, e) {
  return function() {
    this.setAttributeNS(t.space, t.local, e);
  };
}
function _i(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttribute(t) : this.setAttribute(t, n);
  };
}
function xi(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? this.removeAttributeNS(t.space, t.local) : this.setAttributeNS(t.space, t.local, n);
  };
}
function bi(t, e) {
  var n = Et(t);
  if (arguments.length < 2) {
    var i = this.node();
    return n.local ? i.getAttributeNS(n.space, n.local) : i.getAttribute(n);
  }
  return this.each((e == null ? n.local ? wi : gi : typeof e == "function" ? n.local ? xi : _i : n.local ? yi : vi)(n, e));
}
function Xe(t) {
  return t.ownerDocument && t.ownerDocument.defaultView || t.document && t || t.defaultView;
}
function Ti(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Ai(t, e, n) {
  return function() {
    this.style.setProperty(t, e, n);
  };
}
function Mi(t, e, n) {
  return function() {
    var i = e.apply(this, arguments);
    i == null ? this.style.removeProperty(t) : this.style.setProperty(t, i, n);
  };
}
function Si(t, e, n) {
  return arguments.length > 1 ? this.each((e == null ? Ti : typeof e == "function" ? Mi : Ai)(t, e, n ?? "")) : U(this.node(), t);
}
function U(t, e) {
  return t.style.getPropertyValue(e) || Xe(t).getComputedStyle(t, null).getPropertyValue(e);
}
function $i(t) {
  return function() {
    delete this[t];
  };
}
function Ni(t, e) {
  return function() {
    this[t] = e;
  };
}
function Ei(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    n == null ? delete this[t] : this[t] = n;
  };
}
function ki(t, e) {
  return arguments.length > 1 ? this.each((e == null ? $i : typeof e == "function" ? Ei : Ni)(t, e)) : this.node()[t];
}
function Oe(t) {
  return t.trim().split(/^|\s+/);
}
function Jt(t) {
  return t.classList || new He(t);
}
function He(t) {
  this._node = t, this._names = Oe(t.getAttribute("class") || "");
}
He.prototype = {
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
function Ye(t, e) {
  for (var n = Jt(t), i = -1, r = e.length; ++i < r; ) n.add(e[i]);
}
function Fe(t, e) {
  for (var n = Jt(t), i = -1, r = e.length; ++i < r; ) n.remove(e[i]);
}
function Ci(t) {
  return function() {
    Ye(this, t);
  };
}
function Ii(t) {
  return function() {
    Fe(this, t);
  };
}
function Li(t, e) {
  return function() {
    (e.apply(this, arguments) ? Ye : Fe)(this, t);
  };
}
function Pi(t, e) {
  var n = Oe(t + "");
  if (arguments.length < 2) {
    for (var i = Jt(this.node()), r = -1, s = n.length; ++r < s; ) if (!i.contains(n[r])) return !1;
    return !0;
  }
  return this.each((typeof e == "function" ? Li : e ? Ci : Ii)(n, e));
}
function Ri() {
  this.textContent = "";
}
function Di(t) {
  return function() {
    this.textContent = t;
  };
}
function Xi(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.textContent = e ?? "";
  };
}
function Oi(t) {
  return arguments.length ? this.each(t == null ? Ri : (typeof t == "function" ? Xi : Di)(t)) : this.node().textContent;
}
function Hi() {
  this.innerHTML = "";
}
function Yi(t) {
  return function() {
    this.innerHTML = t;
  };
}
function Fi(t) {
  return function() {
    var e = t.apply(this, arguments);
    this.innerHTML = e ?? "";
  };
}
function Bi(t) {
  return arguments.length ? this.each(t == null ? Hi : (typeof t == "function" ? Fi : Yi)(t)) : this.node().innerHTML;
}
function zi() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Vi() {
  return this.each(zi);
}
function qi() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Gi() {
  return this.each(qi);
}
function Zi(t) {
  var e = typeof t == "function" ? t : Ie(t);
  return this.select(function() {
    return this.appendChild(e.apply(this, arguments));
  });
}
function Ui() {
  return null;
}
function Wi(t, e) {
  var n = typeof t == "function" ? t : Ie(t), i = e == null ? Ui : typeof e == "function" ? e : Qt(e);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), i.apply(this, arguments) || null);
  });
}
function Ki() {
  var t = this.parentNode;
  t && t.removeChild(this);
}
function Qi() {
  return this.each(Ki);
}
function Ji() {
  var t = this.cloneNode(!1), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function ji() {
  var t = this.cloneNode(!0), e = this.parentNode;
  return e ? e.insertBefore(t, this.nextSibling) : t;
}
function tr(t) {
  return this.select(t ? ji : Ji);
}
function er(t) {
  return arguments.length ? this.property("__data__", t) : this.node().__data__;
}
function nr(t) {
  return function(e) {
    t.call(this, e, this.__data__);
  };
}
function ir(t) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var n = "", i = e.indexOf(".");
    return i >= 0 && (n = e.slice(i + 1), e = e.slice(0, i)), { type: e, name: n };
  });
}
function rr(t) {
  return function() {
    var e = this.__on;
    if (e) {
      for (var n = 0, i = -1, r = e.length, s; n < r; ++n)
        s = e[n], (!t.type || s.type === t.type) && s.name === t.name ? this.removeEventListener(s.type, s.listener, s.options) : e[++i] = s;
      ++i ? e.length = i : delete this.__on;
    }
  };
}
function sr(t, e, n) {
  return function() {
    var i = this.__on, r, s = nr(e);
    if (i) {
      for (var o = 0, a = i.length; o < a; ++o)
        if ((r = i[o]).type === t.type && r.name === t.name) {
          this.removeEventListener(r.type, r.listener, r.options), this.addEventListener(r.type, r.listener = s, r.options = n), r.value = e;
          return;
        }
    }
    this.addEventListener(t.type, s, n), r = { type: t.type, name: t.name, value: e, listener: s, options: n }, i ? i.push(r) : this.__on = [r];
  };
}
function or(t, e, n) {
  var i = ir(t + ""), r, s = i.length, o;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var u = 0, c = a.length, l; u < c; ++u)
        for (r = 0, l = a[u]; r < s; ++r)
          if ((o = i[r]).type === l.type && o.name === l.name)
            return l.value;
    }
    return;
  }
  for (a = e ? sr : rr, r = 0; r < s; ++r) this.each(a(i[r], e, n));
  return this;
}
function Be(t, e, n) {
  var i = Xe(t), r = i.CustomEvent;
  typeof r == "function" ? r = new r(e, n) : (r = i.document.createEvent("Event"), n ? (r.initEvent(e, n.bubbles, n.cancelable), r.detail = n.detail) : r.initEvent(e, !1, !1)), t.dispatchEvent(r);
}
function ar(t, e) {
  return function() {
    return Be(this, t, e);
  };
}
function ur(t, e) {
  return function() {
    return Be(this, t, e.apply(this, arguments));
  };
}
function cr(t, e) {
  return this.each((typeof e == "function" ? ur : ar)(t, e));
}
function* lr() {
  for (var t = this._groups, e = 0, n = t.length; e < n; ++e)
    for (var i = t[e], r = 0, s = i.length, o; r < s; ++r)
      (o = i[r]) && (yield o);
}
var fr = [null];
function k(t, e) {
  this._groups = t, this._parents = e;
}
function ot() {
  return new k([[document.documentElement]], fr);
}
function hr() {
  return this;
}
k.prototype = ot.prototype = {
  constructor: k,
  select: Xn,
  selectAll: Fn,
  selectChild: qn,
  selectChildren: Wn,
  filter: Kn,
  data: ni,
  enter: Qn,
  exit: ri,
  join: si,
  merge: oi,
  selection: hr,
  order: ai,
  sort: ui,
  call: li,
  nodes: fi,
  node: hi,
  size: di,
  empty: mi,
  each: pi,
  attr: bi,
  style: Si,
  property: ki,
  classed: Pi,
  text: Oi,
  html: Bi,
  raise: Vi,
  lower: Gi,
  append: Zi,
  insert: Wi,
  remove: Qi,
  clone: tr,
  datum: er,
  on: or,
  dispatch: cr,
  [Symbol.iterator]: lr
};
function jt(t, e, n) {
  t.prototype = e.prototype = n, n.constructor = t;
}
function ze(t, e) {
  var n = Object.create(t.prototype);
  for (var i in e) n[i] = e[i];
  return n;
}
function at() {
}
var it = 0.7, xt = 1 / it, Z = "\\s*([+-]?\\d+)\\s*", rt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", I = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", dr = /^#([0-9a-f]{3,8})$/, mr = new RegExp(`^rgb\\(${Z},${Z},${Z}\\)$`), pr = new RegExp(`^rgb\\(${I},${I},${I}\\)$`), gr = new RegExp(`^rgba\\(${Z},${Z},${Z},${rt}\\)$`), wr = new RegExp(`^rgba\\(${I},${I},${I},${rt}\\)$`), vr = new RegExp(`^hsl\\(${rt},${I},${I}\\)$`), yr = new RegExp(`^hsla\\(${rt},${I},${I},${rt}\\)$`), le = {
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
jt(at, B, {
  copy(t) {
    return Object.assign(new this.constructor(), this, t);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: fe,
  // Deprecated! Use color.formatHex.
  formatHex: fe,
  formatHex8: _r,
  formatHsl: xr,
  formatRgb: he,
  toString: he
});
function fe() {
  return this.rgb().formatHex();
}
function _r() {
  return this.rgb().formatHex8();
}
function xr() {
  return Ve(this).formatHsl();
}
function he() {
  return this.rgb().formatRgb();
}
function B(t) {
  var e, n;
  return t = (t + "").trim().toLowerCase(), (e = dr.exec(t)) ? (n = e[1].length, e = parseInt(e[1], 16), n === 6 ? de(e) : n === 3 ? new S(e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, (e & 15) << 4 | e & 15, 1) : n === 8 ? ft(e >> 24 & 255, e >> 16 & 255, e >> 8 & 255, (e & 255) / 255) : n === 4 ? ft(e >> 12 & 15 | e >> 8 & 240, e >> 8 & 15 | e >> 4 & 240, e >> 4 & 15 | e & 240, ((e & 15) << 4 | e & 15) / 255) : null) : (e = mr.exec(t)) ? new S(e[1], e[2], e[3], 1) : (e = pr.exec(t)) ? new S(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, 1) : (e = gr.exec(t)) ? ft(e[1], e[2], e[3], e[4]) : (e = wr.exec(t)) ? ft(e[1] * 255 / 100, e[2] * 255 / 100, e[3] * 255 / 100, e[4]) : (e = vr.exec(t)) ? ge(e[1], e[2] / 100, e[3] / 100, 1) : (e = yr.exec(t)) ? ge(e[1], e[2] / 100, e[3] / 100, e[4]) : le.hasOwnProperty(t) ? de(le[t]) : t === "transparent" ? new S(NaN, NaN, NaN, 0) : null;
}
function de(t) {
  return new S(t >> 16 & 255, t >> 8 & 255, t & 255, 1);
}
function ft(t, e, n, i) {
  return i <= 0 && (t = e = n = NaN), new S(t, e, n, i);
}
function br(t) {
  return t instanceof at || (t = B(t)), t ? (t = t.rgb(), new S(t.r, t.g, t.b, t.opacity)) : new S();
}
function Yt(t, e, n, i) {
  return arguments.length === 1 ? br(t) : new S(t, e, n, i ?? 1);
}
function S(t, e, n, i) {
  this.r = +t, this.g = +e, this.b = +n, this.opacity = +i;
}
jt(S, Yt, ze(at, {
  brighter(t) {
    return t = t == null ? xt : Math.pow(xt, t), new S(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? it : Math.pow(it, t), new S(this.r * t, this.g * t, this.b * t, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new S(F(this.r), F(this.g), F(this.b), bt(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: me,
  // Deprecated! Use color.formatHex.
  formatHex: me,
  formatHex8: Tr,
  formatRgb: pe,
  toString: pe
}));
function me() {
  return `#${Y(this.r)}${Y(this.g)}${Y(this.b)}`;
}
function Tr() {
  return `#${Y(this.r)}${Y(this.g)}${Y(this.b)}${Y((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function pe() {
  const t = bt(this.opacity);
  return `${t === 1 ? "rgb(" : "rgba("}${F(this.r)}, ${F(this.g)}, ${F(this.b)}${t === 1 ? ")" : `, ${t})`}`;
}
function bt(t) {
  return isNaN(t) ? 1 : Math.max(0, Math.min(1, t));
}
function F(t) {
  return Math.max(0, Math.min(255, Math.round(t) || 0));
}
function Y(t) {
  return t = F(t), (t < 16 ? "0" : "") + t.toString(16);
}
function ge(t, e, n, i) {
  return i <= 0 ? t = e = n = NaN : n <= 0 || n >= 1 ? t = e = NaN : e <= 0 && (t = NaN), new E(t, e, n, i);
}
function Ve(t) {
  if (t instanceof E) return new E(t.h, t.s, t.l, t.opacity);
  if (t instanceof at || (t = B(t)), !t) return new E();
  if (t instanceof E) return t;
  t = t.rgb();
  var e = t.r / 255, n = t.g / 255, i = t.b / 255, r = Math.min(e, n, i), s = Math.max(e, n, i), o = NaN, a = s - r, u = (s + r) / 2;
  return a ? (e === s ? o = (n - i) / a + (n < i) * 6 : n === s ? o = (i - e) / a + 2 : o = (e - n) / a + 4, a /= u < 0.5 ? s + r : 2 - s - r, o *= 60) : a = u > 0 && u < 1 ? 0 : o, new E(o, a, u, t.opacity);
}
function Ar(t, e, n, i) {
  return arguments.length === 1 ? Ve(t) : new E(t, e, n, i ?? 1);
}
function E(t, e, n, i) {
  this.h = +t, this.s = +e, this.l = +n, this.opacity = +i;
}
jt(E, Ar, ze(at, {
  brighter(t) {
    return t = t == null ? xt : Math.pow(xt, t), new E(this.h, this.s, this.l * t, this.opacity);
  },
  darker(t) {
    return t = t == null ? it : Math.pow(it, t), new E(this.h, this.s, this.l * t, this.opacity);
  },
  rgb() {
    var t = this.h % 360 + (this.h < 0) * 360, e = isNaN(t) || isNaN(this.s) ? 0 : this.s, n = this.l, i = n + (n < 0.5 ? n : 1 - n) * e, r = 2 * n - i;
    return new S(
      Rt(t >= 240 ? t - 240 : t + 120, r, i),
      Rt(t, r, i),
      Rt(t < 120 ? t + 240 : t - 120, r, i),
      this.opacity
    );
  },
  clamp() {
    return new E(we(this.h), ht(this.s), ht(this.l), bt(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const t = bt(this.opacity);
    return `${t === 1 ? "hsl(" : "hsla("}${we(this.h)}, ${ht(this.s) * 100}%, ${ht(this.l) * 100}%${t === 1 ? ")" : `, ${t})`}`;
  }
}));
function we(t) {
  return t = (t || 0) % 360, t < 0 ? t + 360 : t;
}
function ht(t) {
  return Math.max(0, Math.min(1, t || 0));
}
function Rt(t, e, n) {
  return (t < 60 ? e + (n - e) * t / 60 : t < 180 ? n : t < 240 ? e + (n - e) * (240 - t) / 60 : e) * 255;
}
const te = (t) => () => t;
function Mr(t, e) {
  return function(n) {
    return t + n * e;
  };
}
function Sr(t, e, n) {
  return t = Math.pow(t, n), e = Math.pow(e, n) - t, n = 1 / n, function(i) {
    return Math.pow(t + i * e, n);
  };
}
function $r(t) {
  return (t = +t) == 1 ? qe : function(e, n) {
    return n - e ? Sr(e, n, t) : te(isNaN(e) ? n : e);
  };
}
function qe(t, e) {
  var n = e - t;
  return n ? Mr(t, n) : te(isNaN(t) ? e : t);
}
const Tt = (function t(e) {
  var n = $r(e);
  function i(r, s) {
    var o = n((r = Yt(r)).r, (s = Yt(s)).r), a = n(r.g, s.g), u = n(r.b, s.b), c = qe(r.opacity, s.opacity);
    return function(l) {
      return r.r = o(l), r.g = a(l), r.b = u(l), r.opacity = c(l), r + "";
    };
  }
  return i.gamma = t, i;
})(1);
function Nr(t, e) {
  e || (e = []);
  var n = t ? Math.min(e.length, t.length) : 0, i = e.slice(), r;
  return function(s) {
    for (r = 0; r < n; ++r) i[r] = t[r] * (1 - s) + e[r] * s;
    return i;
  };
}
function Er(t) {
  return ArrayBuffer.isView(t) && !(t instanceof DataView);
}
function kr(t, e) {
  var n = e ? e.length : 0, i = t ? Math.min(n, t.length) : 0, r = new Array(i), s = new Array(n), o;
  for (o = 0; o < i; ++o) r[o] = ee(t[o], e[o]);
  for (; o < n; ++o) s[o] = e[o];
  return function(a) {
    for (o = 0; o < i; ++o) s[o] = r[o](a);
    return s;
  };
}
function Cr(t, e) {
  var n = /* @__PURE__ */ new Date();
  return t = +t, e = +e, function(i) {
    return n.setTime(t * (1 - i) + e * i), n;
  };
}
function N(t, e) {
  return t = +t, e = +e, function(n) {
    return t * (1 - n) + e * n;
  };
}
function Ir(t, e) {
  var n = {}, i = {}, r;
  (t === null || typeof t != "object") && (t = {}), (e === null || typeof e != "object") && (e = {});
  for (r in e)
    r in t ? n[r] = ee(t[r], e[r]) : i[r] = e[r];
  return function(s) {
    for (r in n) i[r] = n[r](s);
    return i;
  };
}
var Ft = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Dt = new RegExp(Ft.source, "g");
function Lr(t) {
  return function() {
    return t;
  };
}
function Pr(t) {
  return function(e) {
    return t(e) + "";
  };
}
function Ge(t, e) {
  var n = Ft.lastIndex = Dt.lastIndex = 0, i, r, s, o = -1, a = [], u = [];
  for (t = t + "", e = e + ""; (i = Ft.exec(t)) && (r = Dt.exec(e)); )
    (s = r.index) > n && (s = e.slice(n, s), a[o] ? a[o] += s : a[++o] = s), (i = i[0]) === (r = r[0]) ? a[o] ? a[o] += r : a[++o] = r : (a[++o] = null, u.push({ i: o, x: N(i, r) })), n = Dt.lastIndex;
  return n < e.length && (s = e.slice(n), a[o] ? a[o] += s : a[++o] = s), a.length < 2 ? u[0] ? Pr(u[0].x) : Lr(e) : (e = u.length, function(c) {
    for (var l = 0, f; l < e; ++l) a[(f = u[l]).i] = f.x(c);
    return a.join("");
  });
}
function ee(t, e) {
  var n = typeof e, i;
  return e == null || n === "boolean" ? te(e) : (n === "number" ? N : n === "string" ? (i = B(e)) ? (e = i, Tt) : Ge : e instanceof B ? Tt : e instanceof Date ? Cr : Er(e) ? Nr : Array.isArray(e) ? kr : typeof e.valueOf != "function" && typeof e.toString != "function" || isNaN(e) ? Ir : N)(t, e);
}
function Rr(t, e) {
  return t = +t, e = +e, function(n) {
    return Math.round(t * (1 - n) + e * n);
  };
}
var ve = 180 / Math.PI, Bt = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Ze(t, e, n, i, r, s) {
  var o, a, u;
  return (o = Math.sqrt(t * t + e * e)) && (t /= o, e /= o), (u = t * n + e * i) && (n -= t * u, i -= e * u), (a = Math.sqrt(n * n + i * i)) && (n /= a, i /= a, u /= a), t * i < e * n && (t = -t, e = -e, u = -u, o = -o), {
    translateX: r,
    translateY: s,
    rotate: Math.atan2(e, t) * ve,
    skewX: Math.atan(u) * ve,
    scaleX: o,
    scaleY: a
  };
}
var dt;
function Dr(t) {
  const e = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(t + "");
  return e.isIdentity ? Bt : Ze(e.a, e.b, e.c, e.d, e.e, e.f);
}
function Xr(t) {
  return t == null || (dt || (dt = document.createElementNS("http://www.w3.org/2000/svg", "g")), dt.setAttribute("transform", t), !(t = dt.transform.baseVal.consolidate())) ? Bt : (t = t.matrix, Ze(t.a, t.b, t.c, t.d, t.e, t.f));
}
function Ue(t, e, n, i) {
  function r(c) {
    return c.length ? c.pop() + " " : "";
  }
  function s(c, l, f, h, d, p) {
    if (c !== f || l !== h) {
      var g = d.push("translate(", null, e, null, n);
      p.push({ i: g - 4, x: N(c, f) }, { i: g - 2, x: N(l, h) });
    } else (f || h) && d.push("translate(" + f + e + h + n);
  }
  function o(c, l, f, h) {
    c !== l ? (c - l > 180 ? l += 360 : l - c > 180 && (c += 360), h.push({ i: f.push(r(f) + "rotate(", null, i) - 2, x: N(c, l) })) : l && f.push(r(f) + "rotate(" + l + i);
  }
  function a(c, l, f, h) {
    c !== l ? h.push({ i: f.push(r(f) + "skewX(", null, i) - 2, x: N(c, l) }) : l && f.push(r(f) + "skewX(" + l + i);
  }
  function u(c, l, f, h, d, p) {
    if (c !== f || l !== h) {
      var g = d.push(r(d) + "scale(", null, ",", null, ")");
      p.push({ i: g - 4, x: N(c, f) }, { i: g - 2, x: N(l, h) });
    } else (f !== 1 || h !== 1) && d.push(r(d) + "scale(" + f + "," + h + ")");
  }
  return function(c, l) {
    var f = [], h = [];
    return c = t(c), l = t(l), s(c.translateX, c.translateY, l.translateX, l.translateY, f, h), o(c.rotate, l.rotate, f, h), a(c.skewX, l.skewX, f, h), u(c.scaleX, c.scaleY, l.scaleX, l.scaleY, f, h), c = l = null, function(d) {
      for (var p = -1, g = h.length, m; ++p < g; ) f[(m = h[p]).i] = m.x(d);
      return f.join("");
    };
  };
}
var Or = Ue(Dr, "px, ", "px)", "deg)"), Hr = Ue(Xr, ", ", ")", ")"), W = 0, j = 0, J = 0, We = 1e3, At, tt, Mt = 0, z = 0, kt = 0, st = typeof performance == "object" && performance.now ? performance : Date, Ke = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function ne() {
  return z || (Ke(Yr), z = st.now() + kt);
}
function Yr() {
  z = 0;
}
function St() {
  this._call = this._time = this._next = null;
}
St.prototype = Qe.prototype = {
  constructor: St,
  restart: function(t, e, n) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    n = (n == null ? ne() : +n) + (e == null ? 0 : +e), !this._next && tt !== this && (tt ? tt._next = this : At = this, tt = this), this._call = t, this._time = n, zt();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, zt());
  }
};
function Qe(t, e, n) {
  var i = new St();
  return i.restart(t, e, n), i;
}
function Fr() {
  ne(), ++W;
  for (var t = At, e; t; )
    (e = z - t._time) >= 0 && t._call.call(void 0, e), t = t._next;
  --W;
}
function ye() {
  z = (Mt = st.now()) + kt, W = j = 0;
  try {
    Fr();
  } finally {
    W = 0, zr(), z = 0;
  }
}
function Br() {
  var t = st.now(), e = t - Mt;
  e > We && (kt -= e, Mt = t);
}
function zr() {
  for (var t, e = At, n, i = 1 / 0; e; )
    e._call ? (i > e._time && (i = e._time), t = e, e = e._next) : (n = e._next, e._next = null, e = t ? t._next = n : At = n);
  tt = t, zt(i);
}
function zt(t) {
  if (!W) {
    j && (j = clearTimeout(j));
    var e = t - z;
    e > 24 ? (t < 1 / 0 && (j = setTimeout(ye, t - st.now() - kt)), J && (J = clearInterval(J))) : (J || (Mt = st.now(), J = setInterval(Br, We)), W = 1, Ke(ye));
  }
}
function _e(t, e, n) {
  var i = new St();
  return e = e == null ? 0 : +e, i.restart((r) => {
    i.stop(), t(r + e);
  }, e, n), i;
}
var Vr = Ce("start", "end", "cancel", "interrupt"), qr = [], Je = 0, xe = 1, Vt = 2, wt = 3, be = 4, qt = 5, vt = 6;
function Ct(t, e, n, i, r, s) {
  var o = t.__transition;
  if (!o) t.__transition = {};
  else if (n in o) return;
  Gr(t, n, {
    name: e,
    index: i,
    // For context during callback.
    group: r,
    // For context during callback.
    on: Vr,
    tween: qr,
    time: s.time,
    delay: s.delay,
    duration: s.duration,
    ease: s.ease,
    timer: null,
    state: Je
  });
}
function ie(t, e) {
  var n = C(t, e);
  if (n.state > Je) throw new Error("too late; already scheduled");
  return n;
}
function L(t, e) {
  var n = C(t, e);
  if (n.state > wt) throw new Error("too late; already running");
  return n;
}
function C(t, e) {
  var n = t.__transition;
  if (!n || !(n = n[e])) throw new Error("transition not found");
  return n;
}
function Gr(t, e, n) {
  var i = t.__transition, r;
  i[e] = n, n.timer = Qe(s, 0, n.time);
  function s(c) {
    n.state = xe, n.timer.restart(o, n.delay, n.time), n.delay <= c && o(c - n.delay);
  }
  function o(c) {
    var l, f, h, d;
    if (n.state !== xe) return u();
    for (l in i)
      if (d = i[l], d.name === n.name) {
        if (d.state === wt) return _e(o);
        d.state === be ? (d.state = vt, d.timer.stop(), d.on.call("interrupt", t, t.__data__, d.index, d.group), delete i[l]) : +l < e && (d.state = vt, d.timer.stop(), d.on.call("cancel", t, t.__data__, d.index, d.group), delete i[l]);
      }
    if (_e(function() {
      n.state === wt && (n.state = be, n.timer.restart(a, n.delay, n.time), a(c));
    }), n.state = Vt, n.on.call("start", t, t.__data__, n.index, n.group), n.state === Vt) {
      for (n.state = wt, r = new Array(h = n.tween.length), l = 0, f = -1; l < h; ++l)
        (d = n.tween[l].value.call(t, t.__data__, n.index, n.group)) && (r[++f] = d);
      r.length = f + 1;
    }
  }
  function a(c) {
    for (var l = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(u), n.state = qt, 1), f = -1, h = r.length; ++f < h; )
      r[f].call(t, l);
    n.state === qt && (n.on.call("end", t, t.__data__, n.index, n.group), u());
  }
  function u() {
    n.state = vt, n.timer.stop(), delete i[e];
    for (var c in i) return;
    delete t.__transition;
  }
}
function Zr(t, e) {
  var n = t.__transition, i, r, s = !0, o;
  if (n) {
    e = e == null ? null : e + "";
    for (o in n) {
      if ((i = n[o]).name !== e) {
        s = !1;
        continue;
      }
      r = i.state > Vt && i.state < qt, i.state = vt, i.timer.stop(), i.on.call(r ? "interrupt" : "cancel", t, t.__data__, i.index, i.group), delete n[o];
    }
    s && delete t.__transition;
  }
}
function Ur(t) {
  return this.each(function() {
    Zr(this, t);
  });
}
function Wr(t, e) {
  var n, i;
  return function() {
    var r = L(this, t), s = r.tween;
    if (s !== n) {
      i = n = s;
      for (var o = 0, a = i.length; o < a; ++o)
        if (i[o].name === e) {
          i = i.slice(), i.splice(o, 1);
          break;
        }
    }
    r.tween = i;
  };
}
function Kr(t, e, n) {
  var i, r;
  if (typeof n != "function") throw new Error();
  return function() {
    var s = L(this, t), o = s.tween;
    if (o !== i) {
      r = (i = o).slice();
      for (var a = { name: e, value: n }, u = 0, c = r.length; u < c; ++u)
        if (r[u].name === e) {
          r[u] = a;
          break;
        }
      u === c && r.push(a);
    }
    s.tween = r;
  };
}
function Qr(t, e) {
  var n = this._id;
  if (t += "", arguments.length < 2) {
    for (var i = C(this.node(), n).tween, r = 0, s = i.length, o; r < s; ++r)
      if ((o = i[r]).name === t)
        return o.value;
    return null;
  }
  return this.each((e == null ? Wr : Kr)(n, t, e));
}
function re(t, e, n) {
  var i = t._id;
  return t.each(function() {
    var r = L(this, i);
    (r.value || (r.value = {}))[e] = n.apply(this, arguments);
  }), function(r) {
    return C(r, i).value[e];
  };
}
function je(t, e) {
  var n;
  return (typeof e == "number" ? N : e instanceof B ? Tt : (n = B(e)) ? (e = n, Tt) : Ge)(t, e);
}
function Jr(t) {
  return function() {
    this.removeAttribute(t);
  };
}
function jr(t) {
  return function() {
    this.removeAttributeNS(t.space, t.local);
  };
}
function ts(t, e, n) {
  var i, r = n + "", s;
  return function() {
    var o = this.getAttribute(t);
    return o === r ? null : o === i ? s : s = e(i = o, n);
  };
}
function es(t, e, n) {
  var i, r = n + "", s;
  return function() {
    var o = this.getAttributeNS(t.space, t.local);
    return o === r ? null : o === i ? s : s = e(i = o, n);
  };
}
function ns(t, e, n) {
  var i, r, s;
  return function() {
    var o, a = n(this), u;
    return a == null ? void this.removeAttribute(t) : (o = this.getAttribute(t), u = a + "", o === u ? null : o === i && u === r ? s : (r = u, s = e(i = o, a)));
  };
}
function is(t, e, n) {
  var i, r, s;
  return function() {
    var o, a = n(this), u;
    return a == null ? void this.removeAttributeNS(t.space, t.local) : (o = this.getAttributeNS(t.space, t.local), u = a + "", o === u ? null : o === i && u === r ? s : (r = u, s = e(i = o, a)));
  };
}
function rs(t, e) {
  var n = Et(t), i = n === "transform" ? Hr : je;
  return this.attrTween(t, typeof e == "function" ? (n.local ? is : ns)(n, i, re(this, "attr." + t, e)) : e == null ? (n.local ? jr : Jr)(n) : (n.local ? es : ts)(n, i, e));
}
function ss(t, e) {
  return function(n) {
    this.setAttribute(t, e.call(this, n));
  };
}
function os(t, e) {
  return function(n) {
    this.setAttributeNS(t.space, t.local, e.call(this, n));
  };
}
function as(t, e) {
  var n, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (n = (i = s) && os(t, s)), n;
  }
  return r._value = e, r;
}
function us(t, e) {
  var n, i;
  function r() {
    var s = e.apply(this, arguments);
    return s !== i && (n = (i = s) && ss(t, s)), n;
  }
  return r._value = e, r;
}
function cs(t, e) {
  var n = "attr." + t;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (e == null) return this.tween(n, null);
  if (typeof e != "function") throw new Error();
  var i = Et(t);
  return this.tween(n, (i.local ? as : us)(i, e));
}
function ls(t, e) {
  return function() {
    ie(this, t).delay = +e.apply(this, arguments);
  };
}
function fs(t, e) {
  return e = +e, function() {
    ie(this, t).delay = e;
  };
}
function hs(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? ls : fs)(e, t)) : C(this.node(), e).delay;
}
function ds(t, e) {
  return function() {
    L(this, t).duration = +e.apply(this, arguments);
  };
}
function ms(t, e) {
  return e = +e, function() {
    L(this, t).duration = e;
  };
}
function ps(t) {
  var e = this._id;
  return arguments.length ? this.each((typeof t == "function" ? ds : ms)(e, t)) : C(this.node(), e).duration;
}
function gs(t, e) {
  if (typeof e != "function") throw new Error();
  return function() {
    L(this, t).ease = e;
  };
}
function ws(t) {
  var e = this._id;
  return arguments.length ? this.each(gs(e, t)) : C(this.node(), e).ease;
}
function vs(t, e) {
  return function() {
    var n = e.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    L(this, t).ease = n;
  };
}
function ys(t) {
  if (typeof t != "function") throw new Error();
  return this.each(vs(this._id, t));
}
function _s(t) {
  typeof t != "function" && (t = Pe(t));
  for (var e = this._groups, n = e.length, i = new Array(n), r = 0; r < n; ++r)
    for (var s = e[r], o = s.length, a = i[r] = [], u, c = 0; c < o; ++c)
      (u = s[c]) && t.call(u, u.__data__, c, s) && a.push(u);
  return new X(i, this._parents, this._name, this._id);
}
function xs(t) {
  if (t._id !== this._id) throw new Error();
  for (var e = this._groups, n = t._groups, i = e.length, r = n.length, s = Math.min(i, r), o = new Array(i), a = 0; a < s; ++a)
    for (var u = e[a], c = n[a], l = u.length, f = o[a] = new Array(l), h, d = 0; d < l; ++d)
      (h = u[d] || c[d]) && (f[d] = h);
  for (; a < i; ++a)
    o[a] = e[a];
  return new X(o, this._parents, this._name, this._id);
}
function bs(t) {
  return (t + "").trim().split(/^|\s+/).every(function(e) {
    var n = e.indexOf(".");
    return n >= 0 && (e = e.slice(0, n)), !e || e === "start";
  });
}
function Ts(t, e, n) {
  var i, r, s = bs(e) ? ie : L;
  return function() {
    var o = s(this, t), a = o.on;
    a !== i && (r = (i = a).copy()).on(e, n), o.on = r;
  };
}
function As(t, e) {
  var n = this._id;
  return arguments.length < 2 ? C(this.node(), n).on.on(t) : this.each(Ts(n, t, e));
}
function Ms(t) {
  return function() {
    var e = this.parentNode;
    for (var n in this.__transition) if (+n !== t) return;
    e && e.removeChild(this);
  };
}
function Ss() {
  return this.on("end.remove", Ms(this._id));
}
function $s(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Qt(t));
  for (var i = this._groups, r = i.length, s = new Array(r), o = 0; o < r; ++o)
    for (var a = i[o], u = a.length, c = s[o] = new Array(u), l, f, h = 0; h < u; ++h)
      (l = a[h]) && (f = t.call(l, l.__data__, h, a)) && ("__data__" in l && (f.__data__ = l.__data__), c[h] = f, Ct(c[h], e, n, h, c, C(l, n)));
  return new X(s, this._parents, e, n);
}
function Ns(t) {
  var e = this._name, n = this._id;
  typeof t != "function" && (t = Le(t));
  for (var i = this._groups, r = i.length, s = [], o = [], a = 0; a < r; ++a)
    for (var u = i[a], c = u.length, l, f = 0; f < c; ++f)
      if (l = u[f]) {
        for (var h = t.call(l, l.__data__, f, u), d, p = C(l, n), g = 0, m = h.length; g < m; ++g)
          (d = h[g]) && Ct(d, e, n, g, h, p);
        s.push(h), o.push(l);
      }
  return new X(s, o, e, n);
}
var Es = ot.prototype.constructor;
function ks() {
  return new Es(this._groups, this._parents);
}
function Cs(t, e) {
  var n, i, r;
  return function() {
    var s = U(this, t), o = (this.style.removeProperty(t), U(this, t));
    return s === o ? null : s === n && o === i ? r : r = e(n = s, i = o);
  };
}
function tn(t) {
  return function() {
    this.style.removeProperty(t);
  };
}
function Is(t, e, n) {
  var i, r = n + "", s;
  return function() {
    var o = U(this, t);
    return o === r ? null : o === i ? s : s = e(i = o, n);
  };
}
function Ls(t, e, n) {
  var i, r, s;
  return function() {
    var o = U(this, t), a = n(this), u = a + "";
    return a == null && (u = a = (this.style.removeProperty(t), U(this, t))), o === u ? null : o === i && u === r ? s : (r = u, s = e(i = o, a));
  };
}
function Ps(t, e) {
  var n, i, r, s = "style." + e, o = "end." + s, a;
  return function() {
    var u = L(this, t), c = u.on, l = u.value[s] == null ? a || (a = tn(e)) : void 0;
    (c !== n || r !== l) && (i = (n = c).copy()).on(o, r = l), u.on = i;
  };
}
function Rs(t, e, n) {
  var i = (t += "") == "transform" ? Or : je;
  return e == null ? this.styleTween(t, Cs(t, i)).on("end.style." + t, tn(t)) : typeof e == "function" ? this.styleTween(t, Ls(t, i, re(this, "style." + t, e))).each(Ps(this._id, t)) : this.styleTween(t, Is(t, i, e), n).on("end.style." + t, null);
}
function Ds(t, e, n) {
  return function(i) {
    this.style.setProperty(t, e.call(this, i), n);
  };
}
function Xs(t, e, n) {
  var i, r;
  function s() {
    var o = e.apply(this, arguments);
    return o !== r && (i = (r = o) && Ds(t, o, n)), i;
  }
  return s._value = e, s;
}
function Os(t, e, n) {
  var i = "style." + (t += "");
  if (arguments.length < 2) return (i = this.tween(i)) && i._value;
  if (e == null) return this.tween(i, null);
  if (typeof e != "function") throw new Error();
  return this.tween(i, Xs(t, e, n ?? ""));
}
function Hs(t) {
  return function() {
    this.textContent = t;
  };
}
function Ys(t) {
  return function() {
    var e = t(this);
    this.textContent = e ?? "";
  };
}
function Fs(t) {
  return this.tween("text", typeof t == "function" ? Ys(re(this, "text", t)) : Hs(t == null ? "" : t + ""));
}
function Bs(t) {
  return function(e) {
    this.textContent = t.call(this, e);
  };
}
function zs(t) {
  var e, n;
  function i() {
    var r = t.apply(this, arguments);
    return r !== n && (e = (n = r) && Bs(r)), e;
  }
  return i._value = t, i;
}
function Vs(t) {
  var e = "text";
  if (arguments.length < 1) return (e = this.tween(e)) && e._value;
  if (t == null) return this.tween(e, null);
  if (typeof t != "function") throw new Error();
  return this.tween(e, zs(t));
}
function qs() {
  for (var t = this._name, e = this._id, n = en(), i = this._groups, r = i.length, s = 0; s < r; ++s)
    for (var o = i[s], a = o.length, u, c = 0; c < a; ++c)
      if (u = o[c]) {
        var l = C(u, e);
        Ct(u, t, n, c, o, {
          time: l.time + l.delay + l.duration,
          delay: 0,
          duration: l.duration,
          ease: l.ease
        });
      }
  return new X(i, this._parents, t, n);
}
function Gs() {
  var t, e, n = this, i = n._id, r = n.size();
  return new Promise(function(s, o) {
    var a = { value: o }, u = { value: function() {
      --r === 0 && s();
    } };
    n.each(function() {
      var c = L(this, i), l = c.on;
      l !== t && (e = (t = l).copy(), e._.cancel.push(a), e._.interrupt.push(a), e._.end.push(u)), c.on = e;
    }), r === 0 && s();
  });
}
var Zs = 0;
function X(t, e, n, i) {
  this._groups = t, this._parents = e, this._name = n, this._id = i;
}
function en() {
  return ++Zs;
}
var D = ot.prototype;
X.prototype = {
  constructor: X,
  select: $s,
  selectAll: Ns,
  selectChild: D.selectChild,
  selectChildren: D.selectChildren,
  filter: _s,
  merge: xs,
  selection: ks,
  transition: qs,
  call: D.call,
  nodes: D.nodes,
  node: D.node,
  size: D.size,
  empty: D.empty,
  each: D.each,
  on: As,
  attr: rs,
  attrTween: cs,
  style: Rs,
  styleTween: Os,
  text: Fs,
  textTween: Vs,
  remove: Ss,
  tween: Qr,
  delay: hs,
  duration: ps,
  ease: ws,
  easeVarying: ys,
  end: Gs,
  [Symbol.iterator]: D[Symbol.iterator]
};
function Us(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}
var Ws = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Us
};
function Ks(t, e) {
  for (var n; !(n = t.__transition) || !(n = n[e]); )
    if (!(t = t.parentNode))
      throw new Error(`transition ${e} not found`);
  return n;
}
function Qs(t) {
  var e, n;
  t instanceof X ? (e = t._id, t = t._name) : (e = en(), (n = Ws).time = ne(), t = t == null ? null : t + "");
  for (var i = this._groups, r = i.length, s = 0; s < r; ++s)
    for (var o = i[s], a = o.length, u, c = 0; c < a; ++c)
      (u = o[c]) && Ct(u, t, e, c, o, n || Ks(u, e));
  return new X(i, this._parents, t, e);
}
ot.prototype.interrupt = Ur;
ot.prototype.transition = Qs;
const Gt = Math.PI, Zt = 2 * Gt, H = 1e-6, Js = Zt - H;
function nn(t) {
  this._ += t[0];
  for (let e = 1, n = t.length; e < n; ++e)
    this._ += arguments[e] + t[e];
}
function js(t) {
  let e = Math.floor(t);
  if (!(e >= 0)) throw new Error(`invalid digits: ${t}`);
  if (e > 15) return nn;
  const n = 10 ** e;
  return function(i) {
    this._ += i[0];
    for (let r = 1, s = i.length; r < s; ++r)
      this._ += Math.round(arguments[r] * n) / n + i[r];
  };
}
class to {
  constructor(e) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = e == null ? nn : js(e);
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
  bezierCurveTo(e, n, i, r, s, o) {
    this._append`C${+e},${+n},${+i},${+r},${this._x1 = +s},${this._y1 = +o}`;
  }
  arcTo(e, n, i, r, s) {
    if (e = +e, n = +n, i = +i, r = +r, s = +s, s < 0) throw new Error(`negative radius: ${s}`);
    let o = this._x1, a = this._y1, u = i - e, c = r - n, l = o - e, f = a - n, h = l * l + f * f;
    if (this._x1 === null)
      this._append`M${this._x1 = e},${this._y1 = n}`;
    else if (h > H) if (!(Math.abs(f * u - c * l) > H) || !s)
      this._append`L${this._x1 = e},${this._y1 = n}`;
    else {
      let d = i - o, p = r - a, g = u * u + c * c, m = d * d + p * p, y = Math.sqrt(g), w = Math.sqrt(h), x = s * Math.tan((Gt - Math.acos((g + h - m) / (2 * y * w))) / 2), b = x / w, v = x / y;
      Math.abs(b - 1) > H && this._append`L${e + b * l},${n + b * f}`, this._append`A${s},${s},0,0,${+(f * d > l * p)},${this._x1 = e + v * u},${this._y1 = n + v * c}`;
    }
  }
  arc(e, n, i, r, s, o) {
    if (e = +e, n = +n, i = +i, o = !!o, i < 0) throw new Error(`negative radius: ${i}`);
    let a = i * Math.cos(r), u = i * Math.sin(r), c = e + a, l = n + u, f = 1 ^ o, h = o ? r - s : s - r;
    this._x1 === null ? this._append`M${c},${l}` : (Math.abs(this._x1 - c) > H || Math.abs(this._y1 - l) > H) && this._append`L${c},${l}`, i && (h < 0 && (h = h % Zt + Zt), h > Js ? this._append`A${i},${i},0,1,${f},${e - a},${n - u}A${i},${i},0,1,${f},${this._x1 = c},${this._y1 = l}` : h > H && this._append`A${i},${i},0,${+(h >= Gt)},${f},${this._x1 = e + i * Math.cos(s)},${this._y1 = n + i * Math.sin(s)}`);
  }
  rect(e, n, i, r) {
    this._append`M${this._x0 = this._x1 = +e},${this._y0 = this._y1 = +n}h${i = +i}v${+r}h${-i}Z`;
  }
  toString() {
    return this._;
  }
}
function eo(t) {
  return Math.abs(t = Math.round(t)) >= 1e21 ? t.toLocaleString("en").replace(/,/g, "") : t.toString(10);
}
function $t(t, e) {
  if ((n = (t = e ? t.toExponential(e - 1) : t.toExponential()).indexOf("e")) < 0) return null;
  var n, i = t.slice(0, n);
  return [
    i.length > 1 ? i[0] + i.slice(2) : i,
    +t.slice(n + 1)
  ];
}
function K(t) {
  return t = $t(Math.abs(t)), t ? t[1] : NaN;
}
function no(t, e) {
  return function(n, i) {
    for (var r = n.length, s = [], o = 0, a = t[0], u = 0; r > 0 && a > 0 && (u + a + 1 > i && (a = Math.max(1, i - u)), s.push(n.substring(r -= a, r + a)), !((u += a + 1) > i)); )
      a = t[o = (o + 1) % t.length];
    return s.reverse().join(e);
  };
}
function io(t) {
  return function(e) {
    return e.replace(/[0-9]/g, function(n) {
      return t[+n];
    });
  };
}
var ro = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Nt(t) {
  if (!(e = ro.exec(t))) throw new Error("invalid format: " + t);
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
Nt.prototype = se.prototype;
function se(t) {
  this.fill = t.fill === void 0 ? " " : t.fill + "", this.align = t.align === void 0 ? ">" : t.align + "", this.sign = t.sign === void 0 ? "-" : t.sign + "", this.symbol = t.symbol === void 0 ? "" : t.symbol + "", this.zero = !!t.zero, this.width = t.width === void 0 ? void 0 : +t.width, this.comma = !!t.comma, this.precision = t.precision === void 0 ? void 0 : +t.precision, this.trim = !!t.trim, this.type = t.type === void 0 ? "" : t.type + "";
}
se.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function so(t) {
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
var rn;
function oo(t, e) {
  var n = $t(t, e);
  if (!n) return t + "";
  var i = n[0], r = n[1], s = r - (rn = Math.max(-8, Math.min(8, Math.floor(r / 3))) * 3) + 1, o = i.length;
  return s === o ? i : s > o ? i + new Array(s - o + 1).join("0") : s > 0 ? i.slice(0, s) + "." + i.slice(s) : "0." + new Array(1 - s).join("0") + $t(t, Math.max(0, e + s - 1))[0];
}
function Te(t, e) {
  var n = $t(t, e);
  if (!n) return t + "";
  var i = n[0], r = n[1];
  return r < 0 ? "0." + new Array(-r).join("0") + i : i.length > r + 1 ? i.slice(0, r + 1) + "." + i.slice(r + 1) : i + new Array(r - i.length + 2).join("0");
}
const Ae = {
  "%": (t, e) => (t * 100).toFixed(e),
  b: (t) => Math.round(t).toString(2),
  c: (t) => t + "",
  d: eo,
  e: (t, e) => t.toExponential(e),
  f: (t, e) => t.toFixed(e),
  g: (t, e) => t.toPrecision(e),
  o: (t) => Math.round(t).toString(8),
  p: (t, e) => Te(t * 100, e),
  r: Te,
  s: oo,
  X: (t) => Math.round(t).toString(16).toUpperCase(),
  x: (t) => Math.round(t).toString(16)
};
function Me(t) {
  return t;
}
var Se = Array.prototype.map, $e = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function ao(t) {
  var e = t.grouping === void 0 || t.thousands === void 0 ? Me : no(Se.call(t.grouping, Number), t.thousands + ""), n = t.currency === void 0 ? "" : t.currency[0] + "", i = t.currency === void 0 ? "" : t.currency[1] + "", r = t.decimal === void 0 ? "." : t.decimal + "", s = t.numerals === void 0 ? Me : io(Se.call(t.numerals, String)), o = t.percent === void 0 ? "%" : t.percent + "", a = t.minus === void 0 ? "−" : t.minus + "", u = t.nan === void 0 ? "NaN" : t.nan + "";
  function c(f) {
    f = Nt(f);
    var h = f.fill, d = f.align, p = f.sign, g = f.symbol, m = f.zero, y = f.width, w = f.comma, x = f.precision, b = f.trim, v = f.type;
    v === "n" ? (w = !0, v = "g") : Ae[v] || (x === void 0 && (x = 12), b = !0, v = "g"), (m || h === "0" && d === "=") && (m = !0, h = "0", d = "=");
    var A = g === "$" ? n : g === "#" && /[boxX]/.test(v) ? "0" + v.toLowerCase() : "", Q = g === "$" ? i : /[%p]/.test(v) ? o : "", O = Ae[v], It = /[defgprs%]/.test(v);
    x = x === void 0 ? 6 : /[gprs]/.test(v) ? Math.max(1, Math.min(21, x)) : Math.max(0, Math.min(20, x));
    function $(_) {
      var P = A, M = Q, V, oe, ut;
      if (v === "c")
        M = O(_) + M, _ = "";
      else {
        _ = +_;
        var ct = _ < 0 || 1 / _ < 0;
        if (_ = isNaN(_) ? u : O(Math.abs(_), x), b && (_ = so(_)), ct && +_ == 0 && p !== "+" && (ct = !1), P = (ct ? p === "(" ? p : a : p === "-" || p === "(" ? "" : p) + P, M = (v === "s" ? $e[8 + rn / 3] : "") + M + (ct && p === "(" ? ")" : ""), It) {
          for (V = -1, oe = _.length; ++V < oe; )
            if (ut = _.charCodeAt(V), 48 > ut || ut > 57) {
              M = (ut === 46 ? r + _.slice(V + 1) : _.slice(V)) + M, _ = _.slice(0, V);
              break;
            }
        }
      }
      w && !m && (_ = e(_, 1 / 0));
      var lt = P.length + _.length + M.length, R = lt < y ? new Array(y - lt + 1).join(h) : "";
      switch (w && m && (_ = e(R + _, R.length ? y - M.length : 1 / 0), R = ""), d) {
        case "<":
          _ = P + _ + M + R;
          break;
        case "=":
          _ = P + R + _ + M;
          break;
        case "^":
          _ = R.slice(0, lt = R.length >> 1) + P + _ + M + R.slice(lt);
          break;
        default:
          _ = R + P + _ + M;
          break;
      }
      return s(_);
    }
    return $.toString = function() {
      return f + "";
    }, $;
  }
  function l(f, h) {
    var d = c((f = Nt(f), f.type = "f", f)), p = Math.max(-8, Math.min(8, Math.floor(K(h) / 3))) * 3, g = Math.pow(10, -p), m = $e[8 + p / 3];
    return function(y) {
      return d(g * y) + m;
    };
  }
  return {
    format: c,
    formatPrefix: l
  };
}
var mt, sn, on;
uo({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function uo(t) {
  return mt = ao(t), sn = mt.format, on = mt.formatPrefix, mt;
}
function co(t) {
  return Math.max(0, -K(Math.abs(t)));
}
function lo(t, e) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(K(e) / 3))) * 3 - K(Math.abs(t)));
}
function fo(t, e) {
  return t = Math.abs(t), e = Math.abs(e) - t, Math.max(0, K(e) - K(t)) + 1;
}
function ho(t, e) {
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
function mo(t) {
  return function() {
    return t;
  };
}
function po(t) {
  return +t;
}
var Ne = [0, 1];
function G(t) {
  return t;
}
function Ut(t, e) {
  return (e -= t = +t) ? function(n) {
    return (n - t) / e;
  } : mo(isNaN(e) ? NaN : 0.5);
}
function go(t, e) {
  var n;
  return t > e && (n = t, t = e, e = n), function(i) {
    return Math.max(t, Math.min(e, i));
  };
}
function wo(t, e, n) {
  var i = t[0], r = t[1], s = e[0], o = e[1];
  return r < i ? (i = Ut(r, i), s = n(o, s)) : (i = Ut(i, r), s = n(s, o)), function(a) {
    return s(i(a));
  };
}
function vo(t, e, n) {
  var i = Math.min(t.length, e.length) - 1, r = new Array(i), s = new Array(i), o = -1;
  for (t[i] < t[0] && (t = t.slice().reverse(), e = e.slice().reverse()); ++o < i; )
    r[o] = Ut(t[o], t[o + 1]), s[o] = n(e[o], e[o + 1]);
  return function(a) {
    var u = Mn(t, a, 1, i) - 1;
    return s[u](r[u](a));
  };
}
function yo(t, e) {
  return e.domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp()).unknown(t.unknown());
}
function _o() {
  var t = Ne, e = Ne, n = ee, i, r, s, o = G, a, u, c;
  function l() {
    var h = Math.min(t.length, e.length);
    return o !== G && (o = go(t[0], t[h - 1])), a = h > 2 ? vo : wo, u = c = null, f;
  }
  function f(h) {
    return h == null || isNaN(h = +h) ? s : (u || (u = a(t.map(i), e, n)))(i(o(h)));
  }
  return f.invert = function(h) {
    return o(r((c || (c = a(e, t.map(i), N)))(h)));
  }, f.domain = function(h) {
    return arguments.length ? (t = Array.from(h, po), l()) : t.slice();
  }, f.range = function(h) {
    return arguments.length ? (e = Array.from(h), l()) : e.slice();
  }, f.rangeRound = function(h) {
    return e = Array.from(h), n = Rr, l();
  }, f.clamp = function(h) {
    return arguments.length ? (o = h ? !0 : G, l()) : o !== G;
  }, f.interpolate = function(h) {
    return arguments.length ? (n = h, l()) : n;
  }, f.unknown = function(h) {
    return arguments.length ? (s = h, f) : s;
  }, function(h, d) {
    return i = h, r = d, l();
  };
}
function xo() {
  return _o()(G, G);
}
function bo(t, e, n, i) {
  var r = kn(t, e, n), s;
  switch (i = Nt(i ?? ",f"), i.type) {
    case "s": {
      var o = Math.max(Math.abs(t), Math.abs(e));
      return i.precision == null && !isNaN(s = lo(r, o)) && (i.precision = s), on(i, o);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      i.precision == null && !isNaN(s = fo(r, Math.max(Math.abs(t), Math.abs(e)))) && (i.precision = s - (i.type === "e"));
      break;
    }
    case "f":
    case "%": {
      i.precision == null && !isNaN(s = co(r)) && (i.precision = s - (i.type === "%") * 2);
      break;
    }
  }
  return sn(i);
}
function To(t) {
  var e = t.domain;
  return t.ticks = function(n) {
    var i = e();
    return En(i[0], i[i.length - 1], n ?? 10);
  }, t.tickFormat = function(n, i) {
    var r = e();
    return bo(r[0], r[r.length - 1], n ?? 10, i);
  }, t.nice = function(n) {
    n == null && (n = 10);
    var i = e(), r = 0, s = i.length - 1, o = i[r], a = i[s], u, c, l = 10;
    for (a < o && (c = o, o = a, a = c, c = r, r = s, s = c); l-- > 0; ) {
      if (c = Ot(o, a, n), c === u)
        return i[r] = o, i[s] = a, e(i);
      if (c > 0)
        o = Math.floor(o / c) * c, a = Math.ceil(a / c) * c;
      else if (c < 0)
        o = Math.ceil(o * c) / c, a = Math.floor(a * c) / c;
      else
        break;
      u = c;
    }
    return t;
  }, t;
}
function Wt() {
  var t = xo();
  return t.copy = function() {
    return yo(t, Wt());
  }, ho.apply(t, arguments), To(t);
}
function q(t) {
  return function() {
    return t;
  };
}
function Ao(t) {
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
  }, () => new to(e);
}
function Mo(t) {
  return typeof t == "object" && "length" in t ? t : Array.from(t);
}
function an(t) {
  this._context = t;
}
an.prototype = {
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
function So(t) {
  return new an(t);
}
function $o(t) {
  return t[0];
}
function No(t) {
  return t[1];
}
function Eo(t, e) {
  var n = q(!0), i = null, r = So, s = null, o = Ao(a);
  t = typeof t == "function" ? t : t === void 0 ? $o : q(t), e = typeof e == "function" ? e : e === void 0 ? No : q(e);
  function a(u) {
    var c, l = (u = Mo(u)).length, f, h = !1, d;
    for (i == null && (s = r(d = o())), c = 0; c <= l; ++c)
      !(c < l && n(f = u[c], c, u)) === h && ((h = !h) ? s.lineStart() : s.lineEnd()), h && s.point(+t(f, c, u), +e(f, c, u));
    if (d) return s = null, d + "" || null;
  }
  return a.x = function(u) {
    return arguments.length ? (t = typeof u == "function" ? u : q(+u), a) : t;
  }, a.y = function(u) {
    return arguments.length ? (e = typeof u == "function" ? u : q(+u), a) : e;
  }, a.defined = function(u) {
    return arguments.length ? (n = typeof u == "function" ? u : q(!!u), a) : n;
  }, a.curve = function(u) {
    return arguments.length ? (r = u, i != null && (s = r(i)), a) : r;
  }, a.context = function(u) {
    return arguments.length ? (u == null ? i = s = null : s = r(i = u), a) : i;
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
const ko = {
  name: "Sigmoid v3",
  description: "Smooth sigmoid curve that travels horizontally first, with limited curve distance",
  render(t) {
    const e = [], n = t.fromX - 5, i = t.toX + 5;
    let r = t.fromY;
    t.toY < t.fromY ? r = t.fromY - 5 : t.toY > t.fromY && (r = t.fromY + 5);
    const s = t.toY, o = Math.abs(i - n), a = 50;
    if (o <= a)
      return Co(n, r, i, s, t);
    const c = i > n ? n + a : n - a, l = un(n, r, c, s);
    if (!l) {
      const d = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      return d.setAttribute("d", `M ${n},${r} L ${i},${s}`), d.setAttribute("stroke", t.color), d.setAttribute("stroke-width", "5"), d.setAttribute("fill", "none"), e.push(d), e;
    }
    const f = `${l} L ${i},${s}`, h = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return h.setAttribute("d", f), h.setAttribute("stroke", t.color), h.setAttribute("stroke-width", "5"), h.setAttribute("fill", "none"), t.connectorType === "undefined" ? (h.setAttribute("stroke-dasharray", "5,5"), h.setAttribute("stroke-opacity", "0.5")) : h.setAttribute("stroke-opacity", t.opacity.toString()), e.push(h), e;
  }
};
function Co(t, e, n, i, r) {
  const s = [], o = un(t, e, n, i);
  if (!o) {
    const u = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return u.setAttribute("d", `M ${t},${e} L ${n},${i}`), u.setAttribute("stroke", r.color), u.setAttribute("stroke-width", "2"), u.setAttribute("fill", "none"), s.push(u), s;
  }
  const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return a.setAttribute("d", o), a.setAttribute("stroke", r.color), a.setAttribute("stroke-width", "5"), a.setAttribute("fill", "none"), r.connectorType === "undefined" ? (a.setAttribute("stroke-dasharray", "5,5"), a.setAttribute("stroke-opacity", "0.5")) : a.setAttribute("stroke-opacity", r.opacity.toString()), s.push(a), s;
}
function un(t, e, n, i) {
  const r = (f) => 1 / (1 + Math.exp(-2 * f)), a = [];
  for (let f = -3; f <= 3; f += 0.1) {
    const h = r(f);
    a.push([h, f]);
  }
  const u = Wt().domain([0, 1]).range([t, n]), c = Wt().domain([0, 1]).range([e, i]);
  return Eo().x((f) => {
    const h = (f[1] + 3) / 6;
    return u(h);
  }).y((f) => c(f[0]))(a);
}
const Io = {
  sigmoidHorizontalLimited: ko
}, Lo = "sigmoidHorizontalLimited";
class Ho {
  container;
  svg = null;
  data = null;
  options;
  viewport;
  eventListeners = /* @__PURE__ */ new Map();
  laneAssignments = [];
  rowMapping = /* @__PURE__ */ new Map();
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
      initialEndTime: n.initialEndTime ?? (/* @__PURE__ */ new Date()).toISOString(),
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
      connectorRenderer: n.connectorRenderer ?? Lo,
      showRowNumbers: n.showRowNumbers ?? !1
    }, this.viewport = {
      startTime: T(this.options.initialStartTime),
      endTime: T(this.options.initialEndTime),
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
    const r = _n(
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
    this.viewport.startTime = T(e), this.viewport.endTime = T(n), this.viewport.centerTime = (this.viewport.startTime + this.viewport.endTime) / 2, this.viewport.zoomLevel = 1, this.updateView();
  }
  setZoomLevel(e, n) {
    if (!this.data) return;
    const i = this.viewport.zoomLevel, r = this.viewport.endTime - this.viewport.startTime, s = n !== void 0 ? n : this.viewport.centerTime, { minTime: o, maxTime: a } = this.calculateDataTimeRange(this.data), u = a - o, c = this.viewport.endTime - this.viewport.startTime, l = Math.min(
      this.options.minZoom,
      i * (c / u)
    ), f = this.findShortestPeriod();
    let h = this.options.maxZoom;
    if (f !== null) {
      const m = f * 10;
      h = Math.min(
        this.options.maxZoom,
        u / m
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
    p = Math.min(p, u * 1.05), this.viewport.centerTime = s, this.viewport.startTime = s - p / 2, this.viewport.endTime = s + p / 2, this.clampPanPosition();
    const g = this.viewport.endTime - this.viewport.startTime;
    this.viewport.startTime = this.viewport.centerTime - g / 2, this.viewport.endTime = this.viewport.centerTime + g / 2, this.updateView(), this.emit("zoom", this.viewport.zoomLevel);
  }
  /**
   * Pan controls
   */
  panTo(e) {
    this.viewport.centerTime = T(e), this.clampPanPosition(), this.recalculateViewportBounds(), this.updateView(), this.emit("pan", this.viewport.centerTime);
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
    const i = this.data.events.find((s) => s.id === e);
    i && Object.assign(i, n);
    const r = this.data.periods.find((s) => s.id === e);
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
    this.svg && (this.svg.remove(), this.svg = null), this.eventListeners.clear();
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
    const e = this.rowMapping.size > 0 ? Math.max(...this.rowMapping.values()) + 1 : 1, n = this.options.constraints.minPeriodHeight, i = this.options.constraints.laneGap, o = 60 + e * (n + i) + 20, a = Math.max(this.options.height, o);
    this.svg.setAttribute("height", a.toString()), this.svg.style.border = "1px solid #ccc", this.svg.style.background = "#fff", this.svg.style.cursor = "grab", this.svg.style.userSelect = "none", this.setupDragToPan(), this.container.appendChild(this.svg);
  }
  /**
   * Set up mouse drag to pan and double-click to zoom
   */
  setupDragToPan() {
    if (!this.svg) return;
    let e = !1, n = 0, i = 0, r = 0;
    this.svg.addEventListener("mousedown", (o) => {
      const a = Date.now();
      if (a - r < 300) {
        this.handleDoubleClick(o), r = 0;
        return;
      }
      r = a, e = !0, n = o.clientX, i = this.viewport.centerTime, this.svg && (this.svg.style.cursor = "grabbing");
    }), this.svg.addEventListener("mousemove", (o) => {
      if (!e) return;
      const a = o.clientX - n, u = this.viewport.endTime - this.viewport.startTime, c = -a / this.options.width * u;
      this.viewport.centerTime = i + c, this.clampPanPosition(), this.recalculateViewportBounds(), this.updateView(), this.emit("pan", this.viewport.centerTime);
    });
    const s = () => {
      e && this.svg && (e = !1, this.svg.style.cursor = "grab");
    };
    this.svg.addEventListener("mouseup", s), this.svg.addEventListener("mouseleave", s), this.svg.addEventListener("wheel", (o) => {
      o.preventDefault(), o.deltaY < 0 ? this.zoomIn() : this.zoomOut();
    });
  }
  /**
   * Handle double-click to zoom in centered on click position
   */
  handleDoubleClick(e) {
    if (!this.svg) return;
    const n = this.svg.getBoundingClientRect(), i = e.clientX - n.left, r = this.xToTime(i), s = this.viewport.zoomLevel * 1.5;
    this.setZoomLevel(s, r);
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
    for (const o of e.events) {
      const a = T(o.time);
      n = Math.min(n, a), i = Math.max(i, a);
    }
    for (const o of e.periods) {
      const a = T(o.startTime), u = T(o.endTime);
      n = Math.min(n, a), i = Math.max(i, u);
    }
    (n === 1 / 0 || i === -1 / 0) && (n = T(this.options.initialStartTime), i = T(this.options.initialEndTime));
    const s = (i - n) * 0.025;
    return {
      minTime: n - s,
      maxTime: i + s
    };
  }
  /**
   * Find the shortest period duration in the data
   */
  findShortestPeriod() {
    if (!this.data || this.data.periods.length === 0)
      return null;
    let e = 1 / 0;
    for (const n of this.data.periods) {
      const i = T(n.startTime), s = T(n.endTime) - i;
      s > 0 && (e = Math.min(e, s));
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
      const u = T(a.time);
      e = Math.min(e, u), n = Math.max(n, u);
    }
    for (const a of this.data.periods) {
      const u = T(a.startTime), c = T(a.endTime);
      e = Math.min(e, u), n = Math.max(n, c);
    }
    if (e === 1 / 0 || n === -1 / 0)
      return;
    const i = this.viewport.endTime - this.viewport.startTime, r = i * 0.15, s = e - r + i / 2, o = n + r - i / 2;
    this.viewport.centerTime = Math.max(
      s,
      Math.min(o, this.viewport.centerTime)
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
      (a, u) => a - u
    ), s = [...new Set(i.map((a) => a.lane))].sort(
      (a, u) => a - u
    );
    n.forEach((a) => {
      const u = r.indexOf(a.lane);
      e.set(a.itemId, u);
    });
    const o = r.length;
    return i.forEach((a) => {
      const u = s.indexOf(a.lane), c = o + u;
      e.set(a.itemId, c);
    }), e;
  }
  /**
   * Get Y position for a row
   * Simple row-based positioning with configurable gaps
   */
  rowToY(e, n) {
    const i = this.options.constraints.minPeriodHeight, r = 20, s = this.options.constraints.laneGap, o = 60;
    return n === "period" ? o + e * (i + s) : o + e * (r + s);
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
      for (const [u, c] of this.rowMapping.entries())
        if (c === i && this.laneAssignments.find(
          (f) => f.itemId === u
        )?.type === "period") {
          r = !1;
          break;
        }
      const s = this.rowToY(i, r ? "event" : "period"), o = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      o.setAttribute("x", "0"), o.setAttribute("y", s.toString()), o.setAttribute("width", "30"), o.setAttribute("height", n.toString()), o.setAttribute("fill", "#f0f0f0"), o.setAttribute("stroke", "#ccc"), o.setAttribute("stroke-width", "0.5"), this.svg.appendChild(o);
      const a = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      a.setAttribute("x", "15"), a.setAttribute("y", (s + n / 2 + 4).toString()), a.setAttribute("text-anchor", "middle"), a.setAttribute("font-size", "10"), a.setAttribute("fill", "#666"), a.setAttribute("font-family", "monospace"), a.textContent = i.toString(), this.svg.appendChild(a);
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
    const i = 40, r = this.options.width - i * 2, s = 10, o = this.viewport.endTime - this.viewport.startTime;
    for (let a = 0; a <= s; a++) {
      const u = i + r / s * a, c = (u - 0) / this.options.width, l = this.viewport.startTime + o * c, f = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      if (f.setAttribute("x1", u.toString()), f.setAttribute("y1", "40"), f.setAttribute("x2", u.toString()), f.setAttribute("y2", "50"), f.setAttribute("stroke", "#666"), f.setAttribute("stroke-width", "1"), this.svg.appendChild(f), l >= nt) {
        const h = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        h.setAttribute("x", u.toString()), h.setAttribute("y", "25"), h.setAttribute("text-anchor", "middle"), h.setAttribute("font-size", "11"), h.setAttribute("fill", "#666"), h.textContent = this.formatTimeLabel(l), this.svg.appendChild(h);
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
    const s = r.querySelector(`#${i}`);
    s && s.remove();
    const o = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    o.setAttribute("id", "noise-filter"), o.setAttribute("x", "0"), o.setAttribute("y", "0"), o.setAttribute("width", "100%"), o.setAttribute("height", "100%");
    const a = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feTurbulence"
    );
    a.setAttribute("type", "fractalNoise"), a.setAttribute("baseFrequency", "2.5"), a.setAttribute("numOctaves", "5"), a.setAttribute("result", "noise");
    const u = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feColorMatrix"
    );
    if (u.setAttribute("in", "noise"), u.setAttribute("type", "matrix"), u.setAttribute(
      "values",
      "0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0"
    ), o.appendChild(a), o.appendChild(u), r.appendChild(o), e > 0) {
      const c = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      c.setAttribute("x", "0"), c.setAttribute("y", "40"), c.setAttribute("width", e.toString()), c.setAttribute("height", (n - 40).toString()), c.setAttribute("fill", "#d0d0d0"), c.setAttribute("filter", "url(#noise-filter)"), c.setAttribute("opacity", "0.35"), this.svg.appendChild(c);
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
   * Render a period as a rectangle
   */
  renderPeriod(e) {
    if (!this.svg) return;
    const n = this.laneAssignments.find((l) => l.itemId === e.id);
    if (!n) return;
    const i = this.rowMapping.get(e.id);
    if (i === void 0) return;
    const r = this.timeToX(n.startTime), s = this.timeToX(n.endTime), o = this.rowToY(i, "period"), a = Math.max(2, s - r), u = this.options.constraints.minPeriodHeight, c = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    if (c.setAttribute("id", e.id), c.setAttribute("x", r.toString()), c.setAttribute("y", o.toString()), c.setAttribute("width", a.toString()), c.setAttribute("height", u.toString()), c.setAttribute("fill", "#000"), c.setAttribute("fill-opacity", "0.85"), c.setAttribute("stroke", "#000"), c.setAttribute("stroke-width", "1"), c.setAttribute("rx", (u / 2).toString()), this.svg.appendChild(c), a > 40) {
      const l = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      l.setAttribute("x", (r + a / 2).toString()), l.setAttribute("y", (o + u / 2 + 4).toString()), l.setAttribute("text-anchor", "middle"), l.setAttribute("font-size", "11"), l.setAttribute("fill", "#fff"), l.setAttribute("font-weight", "bold"), l.textContent = e.name, this.svg.appendChild(l);
    }
  }
  /**
   * Render an event as a marker
   */
  renderEvent(e) {
    if (!this.svg) return;
    const n = this.laneAssignments.find((c) => c.itemId === e.id);
    if (!n) return;
    const i = this.rowMapping.get(e.id);
    if (i === void 0) return;
    const r = this.timeToX(n.startTime), s = this.rowToY(i, "event"), o = 20, a = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    a.setAttribute("id", e.id), a.setAttribute("cx", r.toString()), a.setAttribute("cy", (s + o / 2).toString()), a.setAttribute("r", "4"), a.setAttribute("fill", "none"), a.setAttribute("stroke", "#000"), a.setAttribute("stroke-width", "2"), this.svg.appendChild(a);
    const u = document.createElementNS("http://www.w3.org/2000/svg", "text");
    u.setAttribute("x", (r + 8).toString()), u.setAttribute("y", (s + o / 2 + 4).toString()), u.setAttribute("font-size", "10"), u.setAttribute("fill", "#333"), u.textContent = e.name, this.svg.appendChild(u);
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
    const r = this.timeToX(n.startTime), o = this.timeToX(n.endTime) - r, a = this.timeToX(i.startTime), c = this.timeToX(i.endTime) - a;
    if (o < 10 || c < 10)
      return;
    const l = this.rowMapping.get(e.fromId), f = this.rowMapping.get(e.toId);
    if (l === void 0 || f === void 0) return;
    const d = this.data.periods.find((v) => v.id === e.fromId) ? "#000" : "#f587f3", p = Math.min(
      n.endTime,
      i.startTime
    ), g = this.timeToX(p), m = this.timeToX(i.startTime), y = this.rowToY(l, n.type) + this.options.constraints.minPeriodHeight / 2, w = this.rowToY(f, i.type) + this.options.constraints.minPeriodHeight / 2, x = Io[this.options.connectorRenderer];
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
  Io as CONNECTOR_RENDERERS,
  Lo as DEFAULT_CONNECTOR,
  yn as DEFAULT_PERIOD_LAYOUT,
  vn as PERIOD_LAYOUT_ALGORITHMS,
  Ho as TimelineRenderer,
  _n as assignLanes,
  Ho as default,
  Ro as determineTimeScale,
  Po as formatTime,
  Oo as formatValidationResult,
  Do as getLaneCount,
  T as normalizeTime,
  Xo as validateTimelineData
};
//# sourceMappingURL=thymeline.js.map
