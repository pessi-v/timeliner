class f extends Array {
  constructor(t, n) {
    if (super(t), this.sign = n, Object.setPrototypeOf(this, f.prototype), t > f.__kMaxLength) throw new RangeError("Maximum BigInt size exceeded");
  }
  static BigInt(t) {
    var n = Math.floor, r = Number.isFinite;
    if (typeof t == "number") {
      if (t === 0) return f.__zero();
      if (f.__isOneDigitInt(t)) return 0 > t ? f.__oneDigit(-t, !0) : f.__oneDigit(t, !1);
      if (!r(t) || n(t) !== t) throw new RangeError("The number " + t + " cannot be converted to BigInt because it is not an integer");
      return f.__fromDouble(t);
    }
    if (typeof t == "string") {
      const i = f.__fromString(t);
      if (i === null) throw new SyntaxError("Cannot convert " + t + " to a BigInt");
      return i;
    }
    if (typeof t == "boolean") return t === !0 ? f.__oneDigit(1, !1) : f.__zero();
    if (typeof t == "object") {
      if (t.constructor === f) return t;
      const i = f.__toPrimitive(t);
      return f.BigInt(i);
    }
    throw new TypeError("Cannot convert " + t + " to a BigInt");
  }
  toDebugString() {
    const t = ["BigInt["];
    for (const n of this) t.push((n && (n >>> 0).toString(16)) + ", ");
    return t.push("]"), t.join("");
  }
  toString(t = 10) {
    if (2 > t || 36 < t) throw new RangeError("toString() radix argument must be between 2 and 36");
    return this.length === 0 ? "0" : (t & t - 1) == 0 ? f.__toStringBasePowerOfTwo(this, t) : f.__toStringGeneric(this, t, !1);
  }
  valueOf() {
    throw new Error("Convert JSBI instances to native numbers using `toNumber`.");
  }
  static toNumber(t) {
    const n = t.length;
    if (n === 0) return 0;
    if (n === 1) {
      const y = t.__unsignedDigit(0);
      return t.sign ? -y : y;
    }
    const r = t.__digit(n - 1), i = f.__clz30(r), o = 30 * n - i;
    if (1024 < o) return t.sign ? -1 / 0 : 1 / 0;
    let s = o - 1, a = r, c = n - 1;
    const u = i + 3;
    let l = u === 32 ? 0 : a << u;
    l >>>= 12;
    const h = u - 12;
    let d = 12 <= u ? 0 : a << 20 + u, g = 20 + u;
    for (0 < h && 0 < c && (c--, a = t.__digit(c), l |= a >>> 30 - h, d = a << h + 2, g = h + 2); 0 < g && 0 < c; ) c--, a = t.__digit(c), d |= 30 <= g ? a << g - 30 : a >>> 30 - g, g -= 30;
    const p = f.__decideRounding(t, g, c, a);
    if ((p === 1 || p === 0 && (1 & d) == 1) && (d = d + 1 >>> 0, d === 0 && (l++, l >>> 20 != 0 && (l = 0, s++, 1023 < s)))) return t.sign ? -1 / 0 : 1 / 0;
    const w = t.sign ? -2147483648 : 0;
    return s = s + 1023 << 20, f.__kBitConversionInts[f.__kBitConversionIntHigh] = w | s | l, f.__kBitConversionInts[f.__kBitConversionIntLow] = d, f.__kBitConversionDouble[0];
  }
  static unaryMinus(t) {
    if (t.length === 0) return t;
    const n = t.__copy();
    return n.sign = !t.sign, n;
  }
  static bitwiseNot(t) {
    return t.sign ? f.__absoluteSubOne(t).__trim() : f.__absoluteAddOne(t, !0);
  }
  static exponentiate(t, n) {
    if (n.sign) throw new RangeError("Exponent must be positive");
    if (n.length === 0) return f.__oneDigit(1, !1);
    if (t.length === 0) return t;
    if (t.length === 1 && t.__digit(0) === 1) return t.sign && (1 & n.__digit(0)) == 0 ? f.unaryMinus(t) : t;
    if (1 < n.length) throw new RangeError("BigInt too big");
    let r = n.__unsignedDigit(0);
    if (r === 1) return t;
    if (r >= f.__kMaxLengthBits) throw new RangeError("BigInt too big");
    if (t.length === 1 && t.__digit(0) === 2) {
      const s = 1 + (0 | r / 30), a = t.sign && (1 & r) != 0, c = new f(s, a);
      c.__initializeDigits();
      const u = 1 << r % 30;
      return c.__setDigit(s - 1, u), c;
    }
    let i = null, o = t;
    for ((1 & r) != 0 && (i = t), r >>= 1; r !== 0; r >>= 1) o = f.multiply(o, o), (1 & r) != 0 && (i === null ? i = o : i = f.multiply(i, o));
    return i;
  }
  static multiply(t, n) {
    if (t.length === 0) return t;
    if (n.length === 0) return n;
    let r = t.length + n.length;
    30 <= t.__clzmsd() + n.__clzmsd() && r--;
    const i = new f(r, t.sign !== n.sign);
    i.__initializeDigits();
    for (let o = 0; o < t.length; o++) f.__multiplyAccumulate(n, t.__digit(o), i, o);
    return i.__trim();
  }
  static divide(t, n) {
    if (n.length === 0) throw new RangeError("Division by zero");
    if (0 > f.__absoluteCompare(t, n)) return f.__zero();
    const r = t.sign !== n.sign, i = n.__unsignedDigit(0);
    let o;
    if (n.length === 1 && 32767 >= i) {
      if (i === 1) return r === t.sign ? t : f.unaryMinus(t);
      o = f.__absoluteDivSmall(t, i, null);
    } else o = f.__absoluteDivLarge(t, n, !0, !1);
    return o.sign = r, o.__trim();
  }
  static remainder(t, n) {
    if (n.length === 0) throw new RangeError("Division by zero");
    if (0 > f.__absoluteCompare(t, n)) return t;
    const r = n.__unsignedDigit(0);
    if (n.length === 1 && 32767 >= r) {
      if (r === 1) return f.__zero();
      const o = f.__absoluteModSmall(t, r);
      return o === 0 ? f.__zero() : f.__oneDigit(o, t.sign);
    }
    const i = f.__absoluteDivLarge(t, n, !1, !0);
    return i.sign = t.sign, i.__trim();
  }
  static add(t, n) {
    const r = t.sign;
    return r === n.sign ? f.__absoluteAdd(t, n, r) : 0 <= f.__absoluteCompare(t, n) ? f.__absoluteSub(t, n, r) : f.__absoluteSub(n, t, !r);
  }
  static subtract(t, n) {
    const r = t.sign;
    return r === n.sign ? 0 <= f.__absoluteCompare(t, n) ? f.__absoluteSub(t, n, r) : f.__absoluteSub(n, t, !r) : f.__absoluteAdd(t, n, r);
  }
  static leftShift(t, n) {
    return n.length === 0 || t.length === 0 ? t : n.sign ? f.__rightShiftByAbsolute(t, n) : f.__leftShiftByAbsolute(t, n);
  }
  static signedRightShift(t, n) {
    return n.length === 0 || t.length === 0 ? t : n.sign ? f.__leftShiftByAbsolute(t, n) : f.__rightShiftByAbsolute(t, n);
  }
  static unsignedRightShift() {
    throw new TypeError("BigInts have no unsigned right shift; use >> instead");
  }
  static lessThan(t, n) {
    return 0 > f.__compareToBigInt(t, n);
  }
  static lessThanOrEqual(t, n) {
    return 0 >= f.__compareToBigInt(t, n);
  }
  static greaterThan(t, n) {
    return 0 < f.__compareToBigInt(t, n);
  }
  static greaterThanOrEqual(t, n) {
    return 0 <= f.__compareToBigInt(t, n);
  }
  static equal(t, n) {
    if (t.sign !== n.sign || t.length !== n.length) return !1;
    for (let r = 0; r < t.length; r++) if (t.__digit(r) !== n.__digit(r)) return !1;
    return !0;
  }
  static notEqual(t, n) {
    return !f.equal(t, n);
  }
  static bitwiseAnd(t, n) {
    var r = Math.max;
    if (!t.sign && !n.sign) return f.__absoluteAnd(t, n).__trim();
    if (t.sign && n.sign) {
      const i = r(t.length, n.length) + 1;
      let o = f.__absoluteSubOne(t, i);
      const s = f.__absoluteSubOne(n);
      return o = f.__absoluteOr(o, s, o), f.__absoluteAddOne(o, !0, o).__trim();
    }
    return t.sign && ([t, n] = [n, t]), f.__absoluteAndNot(t, f.__absoluteSubOne(n)).__trim();
  }
  static bitwiseXor(t, n) {
    var r = Math.max;
    if (!t.sign && !n.sign) return f.__absoluteXor(t, n).__trim();
    if (t.sign && n.sign) {
      const s = r(t.length, n.length), a = f.__absoluteSubOne(t, s), c = f.__absoluteSubOne(n);
      return f.__absoluteXor(a, c, a).__trim();
    }
    const i = r(t.length, n.length) + 1;
    t.sign && ([t, n] = [n, t]);
    let o = f.__absoluteSubOne(n, i);
    return o = f.__absoluteXor(o, t, o), f.__absoluteAddOne(o, !0, o).__trim();
  }
  static bitwiseOr(t, n) {
    var r = Math.max;
    const i = r(t.length, n.length);
    if (!t.sign && !n.sign) return f.__absoluteOr(t, n).__trim();
    if (t.sign && n.sign) {
      let s = f.__absoluteSubOne(t, i);
      const a = f.__absoluteSubOne(n);
      return s = f.__absoluteAnd(s, a, s), f.__absoluteAddOne(s, !0, s).__trim();
    }
    t.sign && ([t, n] = [n, t]);
    let o = f.__absoluteSubOne(n, i);
    return o = f.__absoluteAndNot(o, t, o), f.__absoluteAddOne(o, !0, o).__trim();
  }
  static asIntN(t, n) {
    var r = Math.floor;
    if (n.length === 0) return n;
    if (t = r(t), 0 > t) throw new RangeError("Invalid value: not (convertible to) a safe integer");
    if (t === 0) return f.__zero();
    if (t >= f.__kMaxLengthBits) return n;
    const i = 0 | (t + 29) / 30;
    if (n.length < i) return n;
    const o = n.__unsignedDigit(i - 1), s = 1 << (t - 1) % 30;
    if (n.length === i && o < s) return n;
    if ((o & s) !== s) return f.__truncateToNBits(t, n);
    if (!n.sign) return f.__truncateAndSubFromPowerOfTwo(t, n, !0);
    if ((o & s - 1) == 0) {
      for (let a = i - 2; 0 <= a; a--) if (n.__digit(a) !== 0) return f.__truncateAndSubFromPowerOfTwo(t, n, !1);
      return n.length === i && o === s ? n : f.__truncateToNBits(t, n);
    }
    return f.__truncateAndSubFromPowerOfTwo(t, n, !1);
  }
  static asUintN(t, n) {
    var r = Math.floor;
    if (n.length === 0) return n;
    if (t = r(t), 0 > t) throw new RangeError("Invalid value: not (convertible to) a safe integer");
    if (t === 0) return f.__zero();
    if (n.sign) {
      if (t > f.__kMaxLengthBits) throw new RangeError("BigInt too big");
      return f.__truncateAndSubFromPowerOfTwo(t, n, !1);
    }
    if (t >= f.__kMaxLengthBits) return n;
    const i = 0 | (t + 29) / 30;
    if (n.length < i) return n;
    const o = t % 30;
    return n.length == i && (o === 0 || !(n.__digit(i - 1) >>> o)) ? n : f.__truncateToNBits(t, n);
  }
  static ADD(t, n) {
    if (t = f.__toPrimitive(t), n = f.__toPrimitive(n), typeof t == "string") return typeof n != "string" && (n = n.toString()), t + n;
    if (typeof n == "string") return t.toString() + n;
    if (t = f.__toNumeric(t), n = f.__toNumeric(n), f.__isBigInt(t) && f.__isBigInt(n)) return f.add(t, n);
    if (typeof t == "number" && typeof n == "number") return t + n;
    throw new TypeError("Cannot mix BigInt and other types, use explicit conversions");
  }
  static LT(t, n) {
    return f.__compare(t, n, 0);
  }
  static LE(t, n) {
    return f.__compare(t, n, 1);
  }
  static GT(t, n) {
    return f.__compare(t, n, 2);
  }
  static GE(t, n) {
    return f.__compare(t, n, 3);
  }
  static EQ(t, n) {
    for (; ; ) {
      if (f.__isBigInt(t)) return f.__isBigInt(n) ? f.equal(t, n) : f.EQ(n, t);
      if (typeof t == "number") {
        if (f.__isBigInt(n)) return f.__equalToNumber(n, t);
        if (typeof n != "object") return t == n;
        n = f.__toPrimitive(n);
      } else if (typeof t == "string") {
        if (f.__isBigInt(n)) return t = f.__fromString(t), t !== null && f.equal(t, n);
        if (typeof n != "object") return t == n;
        n = f.__toPrimitive(n);
      } else if (typeof t == "boolean") {
        if (f.__isBigInt(n)) return f.__equalToNumber(n, +t);
        if (typeof n != "object") return t == n;
        n = f.__toPrimitive(n);
      } else if (typeof t == "symbol") {
        if (f.__isBigInt(n)) return !1;
        if (typeof n != "object") return t == n;
        n = f.__toPrimitive(n);
      } else if (typeof t == "object") {
        if (typeof n == "object" && n.constructor !== f) return t == n;
        t = f.__toPrimitive(t);
      } else return t == n;
    }
  }
  static NE(t, n) {
    return !f.EQ(t, n);
  }
  static DataViewGetBigInt64(t, n, r = !1) {
    return f.asIntN(64, f.DataViewGetBigUint64(t, n, r));
  }
  static DataViewGetBigUint64(t, n, r = !1) {
    const [i, o] = r ? [4, 0] : [0, 4], s = t.getUint32(n + i, r), a = t.getUint32(n + o, r), c = new f(3, !1);
    return c.__setDigit(0, 1073741823 & a), c.__setDigit(1, (268435455 & s) << 2 | a >>> 30), c.__setDigit(2, s >>> 28), c.__trim();
  }
  static DataViewSetBigInt64(t, n, r, i = !1) {
    f.DataViewSetBigUint64(t, n, r, i);
  }
  static DataViewSetBigUint64(t, n, r, i = !1) {
    r = f.asUintN(64, r);
    let o = 0, s = 0;
    if (0 < r.length && (s = r.__digit(0), 1 < r.length)) {
      const u = r.__digit(1);
      s |= u << 30, o = u >>> 2, 2 < r.length && (o |= r.__digit(2) << 28);
    }
    const [a, c] = i ? [4, 0] : [0, 4];
    t.setUint32(n + a, o, i), t.setUint32(n + c, s, i);
  }
  static __zero() {
    return new f(0, !1);
  }
  static __oneDigit(t, n) {
    const r = new f(1, n);
    return r.__setDigit(0, t), r;
  }
  __copy() {
    const t = new f(this.length, this.sign);
    for (let n = 0; n < this.length; n++) t[n] = this[n];
    return t;
  }
  __trim() {
    let t = this.length, n = this[t - 1];
    for (; n === 0; ) t--, n = this[t - 1], this.pop();
    return t === 0 && (this.sign = !1), this;
  }
  __initializeDigits() {
    for (let t = 0; t < this.length; t++) this[t] = 0;
  }
  static __decideRounding(t, n, r, i) {
    if (0 < n) return -1;
    let o;
    if (0 > n) o = -n - 1;
    else {
      if (r === 0) return -1;
      r--, i = t.__digit(r), o = 29;
    }
    let s = 1 << o;
    if ((i & s) == 0) return -1;
    if (s -= 1, (i & s) != 0) return 1;
    for (; 0 < r; ) if (r--, t.__digit(r) !== 0) return 1;
    return 0;
  }
  static __fromDouble(t) {
    f.__kBitConversionDouble[0] = t;
    const n = 2047 & f.__kBitConversionInts[f.__kBitConversionIntHigh] >>> 20, r = n - 1023, i = (0 | r / 30) + 1, o = new f(i, 0 > t);
    let s = 1048575 & f.__kBitConversionInts[f.__kBitConversionIntHigh] | 1048576, a = f.__kBitConversionInts[f.__kBitConversionIntLow];
    const c = 20, u = r % 30;
    let l, h = 0;
    if (u < 20) {
      const d = c - u;
      h = d + 32, l = s >>> d, s = s << 32 - d | a >>> d, a <<= 32 - d;
    } else if (u === 20) h = 32, l = s, s = a, a = 0;
    else {
      const d = u - c;
      h = 32 - d, l = s << d | a >>> 32 - d, s = a << d, a = 0;
    }
    o.__setDigit(i - 1, l);
    for (let d = i - 2; 0 <= d; d--) 0 < h ? (h -= 30, l = s >>> 2, s = s << 30 | a >>> 2, a <<= 30) : l = 0, o.__setDigit(d, l);
    return o.__trim();
  }
  static __isWhitespace(t) {
    return 13 >= t && 9 <= t || (159 >= t ? t == 32 : 131071 >= t ? t == 160 || t == 5760 : 196607 >= t ? (t &= 131071, 10 >= t || t == 40 || t == 41 || t == 47 || t == 95 || t == 4096) : t == 65279);
  }
  static __fromString(t, n = 0) {
    let r = 0;
    const i = t.length;
    let o = 0;
    if (o === i) return f.__zero();
    let s = t.charCodeAt(o);
    for (; f.__isWhitespace(s); ) {
      if (++o === i) return f.__zero();
      s = t.charCodeAt(o);
    }
    if (s === 43) {
      if (++o === i) return null;
      s = t.charCodeAt(o), r = 1;
    } else if (s === 45) {
      if (++o === i) return null;
      s = t.charCodeAt(o), r = -1;
    }
    if (n === 0) {
      if (n = 10, s === 48) {
        if (++o === i) return f.__zero();
        if (s = t.charCodeAt(o), s === 88 || s === 120) {
          if (n = 16, ++o === i) return null;
          s = t.charCodeAt(o);
        } else if (s === 79 || s === 111) {
          if (n = 8, ++o === i) return null;
          s = t.charCodeAt(o);
        } else if (s === 66 || s === 98) {
          if (n = 2, ++o === i) return null;
          s = t.charCodeAt(o);
        }
      }
    } else if (n === 16 && s === 48) {
      if (++o === i) return f.__zero();
      if (s = t.charCodeAt(o), s === 88 || s === 120) {
        if (++o === i) return null;
        s = t.charCodeAt(o);
      }
    }
    if (r != 0 && n !== 10) return null;
    for (; s === 48; ) {
      if (++o === i) return f.__zero();
      s = t.charCodeAt(o);
    }
    const a = i - o;
    let c = f.__kMaxBitsPerChar[n], u = f.__kBitsPerCharTableMultiplier - 1;
    if (a > 1073741824 / c) return null;
    const l = c * a + u >>> f.__kBitsPerCharTableShift, h = new f(0 | (l + 29) / 30, !1), d = 10 > n ? n : 10, g = 10 < n ? n - 10 : 0;
    if ((n & n - 1) == 0) {
      c >>= f.__kBitsPerCharTableShift;
      const p = [], w = [];
      let y = !1;
      do {
        let v = 0, _ = 0;
        for (; ; ) {
          let T;
          if (s - 48 >>> 0 < d) T = s - 48;
          else if ((32 | s) - 97 >>> 0 < g) T = (32 | s) - 87;
          else {
            y = !0;
            break;
          }
          if (_ += c, v = v << c | T, ++o === i) {
            y = !0;
            break;
          }
          if (s = t.charCodeAt(o), 30 < _ + c) break;
        }
        p.push(v), w.push(_);
      } while (!y);
      f.__fillFromParts(h, p, w);
    } else {
      h.__initializeDigits();
      let p = !1, w = 0;
      do {
        let y = 0, v = 1;
        for (; ; ) {
          let T;
          if (s - 48 >>> 0 < d) T = s - 48;
          else if ((32 | s) - 97 >>> 0 < g) T = (32 | s) - 87;
          else {
            p = !0;
            break;
          }
          const x = v * n;
          if (1073741823 < x) break;
          if (v = x, y = y * n + T, w++, ++o === i) {
            p = !0;
            break;
          }
          s = t.charCodeAt(o);
        }
        u = 30 * f.__kBitsPerCharTableMultiplier - 1;
        const _ = 0 | (c * w + u >>> f.__kBitsPerCharTableShift) / 30;
        h.__inplaceMultiplyAdd(v, y, _);
      } while (!p);
    }
    if (o !== i) {
      if (!f.__isWhitespace(s)) return null;
      for (o++; o < i; o++) if (s = t.charCodeAt(o), !f.__isWhitespace(s)) return null;
    }
    return h.sign = r == -1, h.__trim();
  }
  static __fillFromParts(t, n, r) {
    let i = 0, o = 0, s = 0;
    for (let a = n.length - 1; 0 <= a; a--) {
      const c = n[a], u = r[a];
      o |= c << s, s += u, s === 30 ? (t.__setDigit(i++, o), s = 0, o = 0) : 30 < s && (t.__setDigit(i++, 1073741823 & o), s -= 30, o = c >>> u - s);
    }
    if (o !== 0) {
      if (i >= t.length) throw new Error("implementation bug");
      t.__setDigit(i++, o);
    }
    for (; i < t.length; i++) t.__setDigit(i, 0);
  }
  static __toStringBasePowerOfTwo(t, n) {
    const r = t.length;
    let i = n - 1;
    i = (85 & i >>> 1) + (85 & i), i = (51 & i >>> 2) + (51 & i), i = (15 & i >>> 4) + (15 & i);
    const o = i, s = n - 1, a = t.__digit(r - 1), c = f.__clz30(a);
    let u = 0 | (30 * r - c + o - 1) / o;
    if (t.sign && u++, 268435456 < u) throw new Error("string too long");
    const l = Array(u);
    let h = u - 1, d = 0, g = 0;
    for (let w = 0; w < r - 1; w++) {
      const y = t.__digit(w), v = (d | y << g) & s;
      l[h--] = f.__kConversionChars[v];
      const _ = o - g;
      for (d = y >>> _, g = 30 - _; g >= o; ) l[h--] = f.__kConversionChars[d & s], d >>>= o, g -= o;
    }
    const p = (d | a << g) & s;
    for (l[h--] = f.__kConversionChars[p], d = a >>> o - g; d !== 0; ) l[h--] = f.__kConversionChars[d & s], d >>>= o;
    if (t.sign && (l[h--] = "-"), h != -1) throw new Error("implementation bug");
    return l.join("");
  }
  static __toStringGeneric(t, n, r) {
    const i = t.length;
    if (i === 0) return "";
    if (i === 1) {
      let w = t.__unsignedDigit(0).toString(n);
      return r === !1 && t.sign && (w = "-" + w), w;
    }
    const o = 30 * i - f.__clz30(t.__digit(i - 1)), s = f.__kMaxBitsPerChar[n], a = s - 1;
    let c = o * f.__kBitsPerCharTableMultiplier;
    c += a - 1, c = 0 | c / a;
    const u = c + 1 >> 1, l = f.exponentiate(f.__oneDigit(n, !1), f.__oneDigit(u, !1));
    let h, d;
    const g = l.__unsignedDigit(0);
    if (l.length === 1 && 32767 >= g) {
      h = new f(t.length, !1), h.__initializeDigits();
      let w = 0;
      for (let y = 2 * t.length - 1; 0 <= y; y--) {
        const v = w << 15 | t.__halfDigit(y);
        h.__setHalfDigit(y, 0 | v / g), w = 0 | v % g;
      }
      d = w.toString(n);
    } else {
      const w = f.__absoluteDivLarge(t, l, !0, !0);
      h = w.quotient;
      const y = w.remainder.__trim();
      d = f.__toStringGeneric(y, n, !0);
    }
    h.__trim();
    let p = f.__toStringGeneric(h, n, !0);
    for (; d.length < u; ) d = "0" + d;
    return r === !1 && t.sign && (p = "-" + p), p + d;
  }
  static __unequalSign(t) {
    return t ? -1 : 1;
  }
  static __absoluteGreater(t) {
    return t ? -1 : 1;
  }
  static __absoluteLess(t) {
    return t ? 1 : -1;
  }
  static __compareToBigInt(t, n) {
    const r = t.sign;
    if (r !== n.sign) return f.__unequalSign(r);
    const i = f.__absoluteCompare(t, n);
    return 0 < i ? f.__absoluteGreater(r) : 0 > i ? f.__absoluteLess(r) : 0;
  }
  static __compareToNumber(t, n) {
    if (f.__isOneDigitInt(n)) {
      const r = t.sign, i = 0 > n;
      if (r !== i) return f.__unequalSign(r);
      if (t.length === 0) {
        if (i) throw new Error("implementation bug");
        return n === 0 ? 0 : -1;
      }
      if (1 < t.length) return f.__absoluteGreater(r);
      const o = Math.abs(n), s = t.__unsignedDigit(0);
      return s > o ? f.__absoluteGreater(r) : s < o ? f.__absoluteLess(r) : 0;
    }
    return f.__compareToDouble(t, n);
  }
  static __compareToDouble(t, n) {
    if (n !== n) return n;
    if (n === 1 / 0) return -1;
    if (n === -1 / 0) return 1;
    const r = t.sign;
    if (r !== 0 > n) return f.__unequalSign(r);
    if (n === 0) throw new Error("implementation bug: should be handled elsewhere");
    if (t.length === 0) return -1;
    f.__kBitConversionDouble[0] = n;
    const i = 2047 & f.__kBitConversionInts[f.__kBitConversionIntHigh] >>> 20;
    if (i == 2047) throw new Error("implementation bug: handled elsewhere");
    const o = i - 1023;
    if (0 > o) return f.__absoluteGreater(r);
    const s = t.length;
    let a = t.__digit(s - 1);
    const c = f.__clz30(a), u = 30 * s - c, l = o + 1;
    if (u < l) return f.__absoluteLess(r);
    if (u > l) return f.__absoluteGreater(r);
    let h = 1048576 | 1048575 & f.__kBitConversionInts[f.__kBitConversionIntHigh], d = f.__kBitConversionInts[f.__kBitConversionIntLow];
    const g = 20, p = 29 - c;
    if (p !== (0 | (u - 1) % 30)) throw new Error("implementation bug");
    let w, y = 0;
    if (20 > p) {
      const v = g - p;
      y = v + 32, w = h >>> v, h = h << 32 - v | d >>> v, d <<= 32 - v;
    } else if (p === 20) y = 32, w = h, h = d, d = 0;
    else {
      const v = p - g;
      y = 32 - v, w = h << v | d >>> 32 - v, h = d << v, d = 0;
    }
    if (a >>>= 0, w >>>= 0, a > w) return f.__absoluteGreater(r);
    if (a < w) return f.__absoluteLess(r);
    for (let v = s - 2; 0 <= v; v--) {
      0 < y ? (y -= 30, w = h >>> 2, h = h << 30 | d >>> 2, d <<= 30) : w = 0;
      const _ = t.__unsignedDigit(v);
      if (_ > w) return f.__absoluteGreater(r);
      if (_ < w) return f.__absoluteLess(r);
    }
    if (h !== 0 || d !== 0) {
      if (y === 0) throw new Error("implementation bug");
      return f.__absoluteLess(r);
    }
    return 0;
  }
  static __equalToNumber(t, n) {
    var r = Math.abs;
    return f.__isOneDigitInt(n) ? n === 0 ? t.length === 0 : t.length === 1 && t.sign === 0 > n && t.__unsignedDigit(0) === r(n) : f.__compareToDouble(t, n) === 0;
  }
  static __comparisonResultToBool(t, n) {
    return n === 0 ? 0 > t : n === 1 ? 0 >= t : n === 2 ? 0 < t : n === 3 ? 0 <= t : void 0;
  }
  static __compare(t, n, r) {
    if (t = f.__toPrimitive(t), n = f.__toPrimitive(n), typeof t == "string" && typeof n == "string") switch (r) {
      case 0:
        return t < n;
      case 1:
        return t <= n;
      case 2:
        return t > n;
      case 3:
        return t >= n;
    }
    if (f.__isBigInt(t) && typeof n == "string") return n = f.__fromString(n), n !== null && f.__comparisonResultToBool(f.__compareToBigInt(t, n), r);
    if (typeof t == "string" && f.__isBigInt(n)) return t = f.__fromString(t), t !== null && f.__comparisonResultToBool(f.__compareToBigInt(t, n), r);
    if (t = f.__toNumeric(t), n = f.__toNumeric(n), f.__isBigInt(t)) {
      if (f.__isBigInt(n)) return f.__comparisonResultToBool(f.__compareToBigInt(t, n), r);
      if (typeof n != "number") throw new Error("implementation bug");
      return f.__comparisonResultToBool(f.__compareToNumber(t, n), r);
    }
    if (typeof t != "number") throw new Error("implementation bug");
    if (f.__isBigInt(n)) return f.__comparisonResultToBool(f.__compareToNumber(n, t), 2 ^ r);
    if (typeof n != "number") throw new Error("implementation bug");
    return r === 0 ? t < n : r === 1 ? t <= n : r === 2 ? t > n : r === 3 ? t >= n : void 0;
  }
  __clzmsd() {
    return f.__clz30(this.__digit(this.length - 1));
  }
  static __absoluteAdd(t, n, r) {
    if (t.length < n.length) return f.__absoluteAdd(n, t, r);
    if (t.length === 0) return t;
    if (n.length === 0) return t.sign === r ? t : f.unaryMinus(t);
    let i = t.length;
    (t.__clzmsd() === 0 || n.length === t.length && n.__clzmsd() === 0) && i++;
    const o = new f(i, r);
    let s = 0, a = 0;
    for (; a < n.length; a++) {
      const c = t.__digit(a) + n.__digit(a) + s;
      s = c >>> 30, o.__setDigit(a, 1073741823 & c);
    }
    for (; a < t.length; a++) {
      const c = t.__digit(a) + s;
      s = c >>> 30, o.__setDigit(a, 1073741823 & c);
    }
    return a < o.length && o.__setDigit(a, s), o.__trim();
  }
  static __absoluteSub(t, n, r) {
    if (t.length === 0) return t;
    if (n.length === 0) return t.sign === r ? t : f.unaryMinus(t);
    const i = new f(t.length, r);
    let o = 0, s = 0;
    for (; s < n.length; s++) {
      const a = t.__digit(s) - n.__digit(s) - o;
      o = 1 & a >>> 30, i.__setDigit(s, 1073741823 & a);
    }
    for (; s < t.length; s++) {
      const a = t.__digit(s) - o;
      o = 1 & a >>> 30, i.__setDigit(s, 1073741823 & a);
    }
    return i.__trim();
  }
  static __absoluteAddOne(t, n, r = null) {
    const i = t.length;
    r === null ? r = new f(i, n) : r.sign = n;
    let o = 1;
    for (let s = 0; s < i; s++) {
      const a = t.__digit(s) + o;
      o = a >>> 30, r.__setDigit(s, 1073741823 & a);
    }
    return o != 0 && r.__setDigitGrow(i, 1), r;
  }
  static __absoluteSubOne(t, n) {
    const r = t.length;
    n = n || r;
    const i = new f(n, !1);
    let o = 1;
    for (let s = 0; s < r; s++) {
      const a = t.__digit(s) - o;
      o = 1 & a >>> 30, i.__setDigit(s, 1073741823 & a);
    }
    if (o != 0) throw new Error("implementation bug");
    for (let s = r; s < n; s++) i.__setDigit(s, 0);
    return i;
  }
  static __absoluteAnd(t, n, r = null) {
    let i = t.length, o = n.length, s = o;
    if (i < o) {
      s = i;
      const u = t, l = i;
      t = n, i = o, n = u, o = l;
    }
    let a = s;
    r === null ? r = new f(a, !1) : a = r.length;
    let c = 0;
    for (; c < s; c++) r.__setDigit(c, t.__digit(c) & n.__digit(c));
    for (; c < a; c++) r.__setDigit(c, 0);
    return r;
  }
  static __absoluteAndNot(t, n, r = null) {
    const i = t.length, o = n.length;
    let s = o;
    i < o && (s = i);
    let a = i;
    r === null ? r = new f(a, !1) : a = r.length;
    let c = 0;
    for (; c < s; c++) r.__setDigit(c, t.__digit(c) & ~n.__digit(c));
    for (; c < i; c++) r.__setDigit(c, t.__digit(c));
    for (; c < a; c++) r.__setDigit(c, 0);
    return r;
  }
  static __absoluteOr(t, n, r = null) {
    let i = t.length, o = n.length, s = o;
    if (i < o) {
      s = i;
      const u = t, l = i;
      t = n, i = o, n = u, o = l;
    }
    let a = i;
    r === null ? r = new f(a, !1) : a = r.length;
    let c = 0;
    for (; c < s; c++) r.__setDigit(c, t.__digit(c) | n.__digit(c));
    for (; c < i; c++) r.__setDigit(c, t.__digit(c));
    for (; c < a; c++) r.__setDigit(c, 0);
    return r;
  }
  static __absoluteXor(t, n, r = null) {
    let i = t.length, o = n.length, s = o;
    if (i < o) {
      s = i;
      const u = t, l = i;
      t = n, i = o, n = u, o = l;
    }
    let a = i;
    r === null ? r = new f(a, !1) : a = r.length;
    let c = 0;
    for (; c < s; c++) r.__setDigit(c, t.__digit(c) ^ n.__digit(c));
    for (; c < i; c++) r.__setDigit(c, t.__digit(c));
    for (; c < a; c++) r.__setDigit(c, 0);
    return r;
  }
  static __absoluteCompare(t, n) {
    const r = t.length - n.length;
    if (r != 0) return r;
    let i = t.length - 1;
    for (; 0 <= i && t.__digit(i) === n.__digit(i); ) i--;
    return 0 > i ? 0 : t.__unsignedDigit(i) > n.__unsignedDigit(i) ? 1 : -1;
  }
  static __multiplyAccumulate(t, n, r, i) {
    if (n === 0) return;
    const o = 32767 & n, s = n >>> 15;
    let a = 0, c = 0;
    for (let u, l = 0; l < t.length; l++, i++) {
      u = r.__digit(i);
      const h = t.__digit(l), d = 32767 & h, g = h >>> 15, p = f.__imul(d, o), w = f.__imul(d, s), y = f.__imul(g, o), v = f.__imul(g, s);
      u += c + p + a, a = u >>> 30, u &= 1073741823, u += ((32767 & w) << 15) + ((32767 & y) << 15), a += u >>> 30, c = v + (w >>> 15) + (y >>> 15), r.__setDigit(i, 1073741823 & u);
    }
    for (; a != 0 || c !== 0; i++) {
      let u = r.__digit(i);
      u += a + c, c = 0, a = u >>> 30, r.__setDigit(i, 1073741823 & u);
    }
  }
  static __internalMultiplyAdd(t, n, r, i, o) {
    let s = r, a = 0;
    for (let c = 0; c < i; c++) {
      const u = t.__digit(c), l = f.__imul(32767 & u, n), h = f.__imul(u >>> 15, n), d = l + ((32767 & h) << 15) + a + s;
      s = d >>> 30, a = h >>> 15, o.__setDigit(c, 1073741823 & d);
    }
    if (o.length > i) for (o.__setDigit(i++, s + a); i < o.length; ) o.__setDigit(i++, 0);
    else if (s + a !== 0) throw new Error("implementation bug");
  }
  __inplaceMultiplyAdd(t, n, r) {
    r > this.length && (r = this.length);
    const i = 32767 & t, o = t >>> 15;
    let s = 0, a = n;
    for (let c = 0; c < r; c++) {
      const u = this.__digit(c), l = 32767 & u, h = u >>> 15, d = f.__imul(l, i), g = f.__imul(l, o), p = f.__imul(h, i), w = f.__imul(h, o);
      let y = a + d + s;
      s = y >>> 30, y &= 1073741823, y += ((32767 & g) << 15) + ((32767 & p) << 15), s += y >>> 30, a = w + (g >>> 15) + (p >>> 15), this.__setDigit(c, 1073741823 & y);
    }
    if (s != 0 || a !== 0) throw new Error("implementation bug");
  }
  static __absoluteDivSmall(t, n, r = null) {
    r === null && (r = new f(t.length, !1));
    let i = 0;
    for (let o, s = 2 * t.length - 1; 0 <= s; s -= 2) {
      o = (i << 15 | t.__halfDigit(s)) >>> 0;
      const a = 0 | o / n;
      i = 0 | o % n, o = (i << 15 | t.__halfDigit(s - 1)) >>> 0;
      const c = 0 | o / n;
      i = 0 | o % n, r.__setDigit(s >>> 1, a << 15 | c);
    }
    return r;
  }
  static __absoluteModSmall(t, n) {
    let r = 0;
    for (let i = 2 * t.length - 1; 0 <= i; i--)
      r = 0 | ((r << 15 | t.__halfDigit(i)) >>> 0) % n;
    return r;
  }
  static __absoluteDivLarge(t, n, r, i) {
    const o = n.__halfDigitLength(), s = n.length, a = t.__halfDigitLength() - o;
    let c = null;
    r && (c = new f(a + 2 >>> 1, !1), c.__initializeDigits());
    const u = new f(o + 2 >>> 1, !1);
    u.__initializeDigits();
    const l = f.__clz15(n.__halfDigit(o - 1));
    0 < l && (n = f.__specialLeftShift(n, l, 0));
    const h = f.__specialLeftShift(t, l, 1), d = n.__halfDigit(o - 1);
    let g = 0;
    for (let p, w = a; 0 <= w; w--) {
      p = 32767;
      const y = h.__halfDigit(w + o);
      if (y !== d) {
        const _ = (y << 15 | h.__halfDigit(w + o - 1)) >>> 0;
        p = 0 | _ / d;
        let T = 0 | _ % d;
        const x = n.__halfDigit(o - 2), E = h.__halfDigit(w + o - 2);
        for (; f.__imul(p, x) >>> 0 > (T << 16 | E) >>> 0 && (p--, T += d, !(32767 < T)); ) ;
      }
      f.__internalMultiplyAdd(n, p, 0, s, u);
      let v = h.__inplaceSub(u, w, o + 1);
      v !== 0 && (v = h.__inplaceAdd(n, w, o), h.__setHalfDigit(w + o, 32767 & h.__halfDigit(w + o) + v), p--), r && (1 & w ? g = p << 15 : c.__setDigit(w >>> 1, g | p));
    }
    if (i) return h.__inplaceRightShift(l), r ? { quotient: c, remainder: h } : h;
    if (r) return c;
    throw new Error("unreachable");
  }
  static __clz15(t) {
    return f.__clz30(t) - 15;
  }
  __inplaceAdd(t, n, r) {
    let i = 0;
    for (let o = 0; o < r; o++) {
      const s = this.__halfDigit(n + o) + t.__halfDigit(o) + i;
      i = s >>> 15, this.__setHalfDigit(n + o, 32767 & s);
    }
    return i;
  }
  __inplaceSub(t, n, r) {
    let i = 0;
    if (1 & n) {
      n >>= 1;
      let o = this.__digit(n), s = 32767 & o, a = 0;
      for (; a < r - 1 >>> 1; a++) {
        const l = t.__digit(a), h = (o >>> 15) - (32767 & l) - i;
        i = 1 & h >>> 15, this.__setDigit(n + a, (32767 & h) << 15 | 32767 & s), o = this.__digit(n + a + 1), s = (32767 & o) - (l >>> 15) - i, i = 1 & s >>> 15;
      }
      const c = t.__digit(a), u = (o >>> 15) - (32767 & c) - i;
      if (i = 1 & u >>> 15, this.__setDigit(n + a, (32767 & u) << 15 | 32767 & s), n + a + 1 >= this.length) throw new RangeError("out of bounds");
      (1 & r) == 0 && (o = this.__digit(n + a + 1), s = (32767 & o) - (c >>> 15) - i, i = 1 & s >>> 15, this.__setDigit(n + t.length, 1073709056 & o | 32767 & s));
    } else {
      n >>= 1;
      let o = 0;
      for (; o < t.length - 1; o++) {
        const l = this.__digit(n + o), h = t.__digit(o), d = (32767 & l) - (32767 & h) - i;
        i = 1 & d >>> 15;
        const g = (l >>> 15) - (h >>> 15) - i;
        i = 1 & g >>> 15, this.__setDigit(n + o, (32767 & g) << 15 | 32767 & d);
      }
      const s = this.__digit(n + o), a = t.__digit(o), c = (32767 & s) - (32767 & a) - i;
      i = 1 & c >>> 15;
      let u = 0;
      (1 & r) == 0 && (u = (s >>> 15) - (a >>> 15) - i, i = 1 & u >>> 15), this.__setDigit(n + o, (32767 & u) << 15 | 32767 & c);
    }
    return i;
  }
  __inplaceRightShift(t) {
    if (t === 0) return;
    let n = this.__digit(0) >>> t;
    const r = this.length - 1;
    for (let i = 0; i < r; i++) {
      const o = this.__digit(i + 1);
      this.__setDigit(i, 1073741823 & o << 30 - t | n), n = o >>> t;
    }
    this.__setDigit(r, n);
  }
  static __specialLeftShift(t, n, r) {
    const i = t.length, o = new f(i + r, !1);
    if (n === 0) {
      for (let a = 0; a < i; a++) o.__setDigit(a, t.__digit(a));
      return 0 < r && o.__setDigit(i, 0), o;
    }
    let s = 0;
    for (let a = 0; a < i; a++) {
      const c = t.__digit(a);
      o.__setDigit(a, 1073741823 & c << n | s), s = c >>> 30 - n;
    }
    return 0 < r && o.__setDigit(i, s), o;
  }
  static __leftShiftByAbsolute(t, n) {
    const r = f.__toShiftAmount(n);
    if (0 > r) throw new RangeError("BigInt too big");
    const i = 0 | r / 30, o = r % 30, s = t.length, a = o !== 0 && t.__digit(s - 1) >>> 30 - o != 0, c = s + i + (a ? 1 : 0), u = new f(c, t.sign);
    if (o === 0) {
      let l = 0;
      for (; l < i; l++) u.__setDigit(l, 0);
      for (; l < c; l++) u.__setDigit(l, t.__digit(l - i));
    } else {
      let l = 0;
      for (let h = 0; h < i; h++) u.__setDigit(h, 0);
      for (let h = 0; h < s; h++) {
        const d = t.__digit(h);
        u.__setDigit(h + i, 1073741823 & d << o | l), l = d >>> 30 - o;
      }
      if (a) u.__setDigit(s + i, l);
      else if (l !== 0) throw new Error("implementation bug");
    }
    return u.__trim();
  }
  static __rightShiftByAbsolute(t, n) {
    const r = t.length, i = t.sign, o = f.__toShiftAmount(n);
    if (0 > o) return f.__rightShiftByMaximum(i);
    const s = 0 | o / 30, a = o % 30;
    let c = r - s;
    if (0 >= c) return f.__rightShiftByMaximum(i);
    let u = !1;
    if (i) {
      if ((t.__digit(s) & (1 << a) - 1) != 0) u = !0;
      else for (let h = 0; h < s; h++) if (t.__digit(h) !== 0) {
        u = !0;
        break;
      }
    }
    u && a === 0 && ~t.__digit(r - 1) == 0 && c++;
    let l = new f(c, i);
    if (a === 0) {
      l.__setDigit(c - 1, 0);
      for (let h = s; h < r; h++) l.__setDigit(h - s, t.__digit(h));
    } else {
      let h = t.__digit(s) >>> a;
      const d = r - s - 1;
      for (let g = 0; g < d; g++) {
        const p = t.__digit(g + s + 1);
        l.__setDigit(g, 1073741823 & p << 30 - a | h), h = p >>> a;
      }
      l.__setDigit(d, h);
    }
    return u && (l = f.__absoluteAddOne(l, !0, l)), l.__trim();
  }
  static __rightShiftByMaximum(t) {
    return t ? f.__oneDigit(1, !0) : f.__zero();
  }
  static __toShiftAmount(t) {
    if (1 < t.length) return -1;
    const n = t.__unsignedDigit(0);
    return n > f.__kMaxLengthBits ? -1 : n;
  }
  static __toPrimitive(t, n = "default") {
    if (typeof t != "object" || t.constructor === f) return t;
    if (typeof Symbol < "u" && typeof Symbol.toPrimitive == "symbol" && t[Symbol.toPrimitive]) {
      const o = t[Symbol.toPrimitive](n);
      if (typeof o != "object") return o;
      throw new TypeError("Cannot convert object to primitive value");
    }
    const r = t.valueOf;
    if (r) {
      const o = r.call(t);
      if (typeof o != "object") return o;
    }
    const i = t.toString;
    if (i) {
      const o = i.call(t);
      if (typeof o != "object") return o;
    }
    throw new TypeError("Cannot convert object to primitive value");
  }
  static __toNumeric(t) {
    return f.__isBigInt(t) ? t : +t;
  }
  static __isBigInt(t) {
    return typeof t == "object" && t !== null && t.constructor === f;
  }
  static __truncateToNBits(t, n) {
    const r = 0 | (t + 29) / 30, i = new f(r, n.sign), o = r - 1;
    for (let a = 0; a < o; a++) i.__setDigit(a, n.__digit(a));
    let s = n.__digit(o);
    if (t % 30 != 0) {
      const a = 32 - t % 30;
      s = s << a >>> a;
    }
    return i.__setDigit(o, s), i.__trim();
  }
  static __truncateAndSubFromPowerOfTwo(t, n, r) {
    var i = Math.min;
    const o = 0 | (t + 29) / 30, s = new f(o, r);
    let a = 0;
    const c = o - 1;
    let u = 0;
    for (const g = i(c, n.length); a < g; a++) {
      const p = 0 - n.__digit(a) - u;
      u = 1 & p >>> 30, s.__setDigit(a, 1073741823 & p);
    }
    for (; a < c; a++) s.__setDigit(a, 0 | 1073741823 & -u);
    let l = c < n.length ? n.__digit(c) : 0;
    const h = t % 30;
    let d;
    if (h == 0) d = 0 - l - u, d &= 1073741823;
    else {
      const g = 32 - h;
      l = l << g >>> g;
      const p = 1 << 32 - g;
      d = p - l - u, d &= p - 1;
    }
    return s.__setDigit(c, d), s.__trim();
  }
  __digit(t) {
    return this[t];
  }
  __unsignedDigit(t) {
    return this[t] >>> 0;
  }
  __setDigit(t, n) {
    this[t] = 0 | n;
  }
  __setDigitGrow(t, n) {
    this[t] = 0 | n;
  }
  __halfDigitLength() {
    const t = this.length;
    return 32767 >= this.__unsignedDigit(t - 1) ? 2 * t - 1 : 2 * t;
  }
  __halfDigit(t) {
    return 32767 & this[t >>> 1] >>> 15 * (1 & t);
  }
  __setHalfDigit(t, n) {
    const r = t >>> 1, i = this.__digit(r), o = 1 & t ? 32767 & i | n << 15 : 1073709056 & i | 32767 & n;
    this.__setDigit(r, o);
  }
  static __digitPow(t, n) {
    let r = 1;
    for (; 0 < n; ) 1 & n && (r *= t), n >>>= 1, t *= t;
    return r;
  }
  static __detectBigEndian() {
    return f.__kBitConversionDouble[0] = -0, f.__kBitConversionInts[0] !== 0;
  }
  static __isOneDigitInt(t) {
    return (1073741823 & t) === t;
  }
}
f.__kMaxLength = 33554432, f.__kMaxLengthBits = f.__kMaxLength << 5, f.__kMaxBitsPerChar = [0, 0, 32, 51, 64, 75, 83, 90, 96, 102, 107, 111, 115, 119, 122, 126, 128, 131, 134, 136, 139, 141, 143, 145, 147, 149, 151, 153, 154, 156, 158, 159, 160, 162, 163, 165, 166], f.__kBitsPerCharTableShift = 5, f.__kBitsPerCharTableMultiplier = 1 << f.__kBitsPerCharTableShift, f.__kConversionChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"], f.__kBitConversionBuffer = new ArrayBuffer(8), f.__kBitConversionDouble = new Float64Array(f.__kBitConversionBuffer), f.__kBitConversionInts = new Int32Array(f.__kBitConversionBuffer), f.__kBitConversionIntHigh = f.__detectBigEndian() ? 0 : 1, f.__kBitConversionIntLow = f.__detectBigEndian() ? 1 : 0, f.__clz30 = Math.clz32 ? function(e) {
  return Math.clz32(e) - 2;
} : function(e) {
  return e === 0 ? 30 : 0 | 29 - (0 | Math.log(e >>> 0) / Math.LN2);
}, f.__imul = Math.imul || function(e, t) {
  return 0 | e * t;
};
const Ot = f.BigInt(0), er = f.BigInt(1), wo = f.BigInt(2), Sc = f.BigInt(10), zc = f.BigInt(24), jc = f.BigInt(60), Uc = f.BigInt(1e3), pr = f.BigInt(1e6), Gn = f.BigInt(1e9), Qs = f.multiply(f.BigInt(3600), Gn), Fc = f.multiply(jc, Gn), Le = f.multiply(Qs, zc);
function ge(e) {
  return typeof e == "bigint" ? f.BigInt(e.toString(10)) : e;
}
function Bs(e) {
  return f.equal(f.remainder(e, wo), Ot);
}
function Se(e) {
  return f.lessThan(e, Ot) ? f.unaryMinus(e) : e;
}
function qr(e, t) {
  return f.lessThan(e, t) ? -1 : f.greaterThan(e, t) ? 1 : 0;
}
function Pn(e, t) {
  return { quotient: f.divide(e, t), remainder: f.remainder(e, t) };
}
var Wo, Go;
const $ = "slot-epochNanoSeconds", A = "slot-iso-date", q = "slot-iso-date-time", G = "slot-time", M = "slot-calendar", Js = "slot-date-brand", ta = "slot-year-month-brand", ea = "slot-month-day-brand", S = "slot-time-zone", dt = "slot-years", ft = "slot-months", Dt = "slot-weeks", mt = "slot-days", gt = "slot-hours", pt = "slot-minutes", yt = "slot-seconds", wt = "slot-milliseconds", vt = "slot-microseconds", Ct = "slot-nanoseconds", na = "date", ra = "ym", ia = "md", oa = "time", sa = "datetime", aa = "instant", Je = "original", cn = "timezone-canonical", Si = "timezone-original", Sn = "calendar-id", ca = "locale", zi = "options", ua = /* @__PURE__ */ new WeakMap(), ji = Symbol.for("@@Temporal__GetSlots");
(Wo = globalThis)[ji] || (Wo[ji] = function(e) {
  return ua.get(e);
});
const fi = globalThis[ji], Ui = Symbol.for("@@Temporal__CreateSlots");
(Go = globalThis)[Ui] || (Go[Ui] = function(e) {
  ua.set(e, /* @__PURE__ */ Object.create(null));
});
const De = globalThis[Ui];
function Et(e, ...t) {
  if (!e || typeof e != "object") return !1;
  const n = fi(e);
  return !!n && t.every(((r) => r in n));
}
function m(e, t) {
  const n = fi(e)?.[t];
  if (n === void 0) throw new TypeError(`Missing internal slot ${t}`);
  return n;
}
function R(e, t, n) {
  const r = fi(e);
  if (r === void 0) throw new TypeError("Missing slots for the given container");
  if (r[t]) throw new TypeError(`${t} already has set`);
  r[t] = n;
}
const Fi = {};
function Ce(e, t) {
  Object.defineProperty(e.prototype, Symbol.toStringTag, { value: t, writable: !1, enumerable: !1, configurable: !0 });
  const n = Object.getOwnPropertyNames(e);
  for (let i = 0; i < n.length; i++) {
    const o = n[i], s = Object.getOwnPropertyDescriptor(e, o);
    s.configurable && s.enumerable && (s.enumerable = !1, Object.defineProperty(e, o, s));
  }
  const r = Object.getOwnPropertyNames(e.prototype);
  for (let i = 0; i < r.length; i++) {
    const o = r[i], s = Object.getOwnPropertyDescriptor(e.prototype, o);
    s.configurable && s.enumerable && (s.enumerable = !1, Object.defineProperty(e.prototype, o, s));
  }
  Hi(t, e), Hi(`${t}.prototype`, e.prototype);
}
function Hi(e, t) {
  const n = `%${e}%`;
  if (Fi[n] !== void 0) throw new Error(`intrinsic ${e} already exists`);
  Fi[n] = t;
}
function ot(e) {
  return Fi[e];
}
function ln(e, t) {
  let n = e;
  if (n === 0) return { div: n, mod: n };
  const r = Math.sign(n);
  n = Math.abs(n);
  const i = Math.trunc(1 + Math.log10(n));
  if (t >= i) return { div: 0 * r, mod: r * n };
  if (t === 0) return { div: r * n, mod: 0 * r };
  const o = n.toPrecision(i);
  return { div: r * Number.parseInt(o.slice(0, i - t), 10), mod: r * Number.parseInt(o.slice(i - t), 10) };
}
function ki(e, t, n) {
  let r = e, i = n;
  if (r === 0) return i;
  const o = Math.sign(r) || Math.sign(i);
  r = Math.abs(r), i = Math.abs(i);
  const s = r.toPrecision(Math.trunc(1 + Math.log10(r)));
  if (i === 0) return o * Number.parseInt(s + "0".repeat(t), 10);
  const a = s + i.toPrecision(Math.trunc(1 + Math.log10(i))).padStart(t, "0");
  return o * Number.parseInt(a, 10);
}
function mi(e, t) {
  const n = t === "negative";
  switch (e) {
    case "ceil":
      return n ? "zero" : "infinity";
    case "floor":
      return n ? "infinity" : "zero";
    case "expand":
      return "infinity";
    case "trunc":
      return "zero";
    case "halfCeil":
      return n ? "half-zero" : "half-infinity";
    case "halfFloor":
      return n ? "half-infinity" : "half-zero";
    case "halfExpand":
      return "half-infinity";
    case "halfTrunc":
      return "half-zero";
    case "halfEven":
      return "half-even";
  }
}
function gi(e, t, n, r, i) {
  return i === "zero" ? e : i === "infinity" ? t : n < 0 ? e : n > 0 ? t : i === "half-zero" ? e : i === "half-infinity" ? t : r ? e : t;
}
class O {
  constructor(t) {
    this.totalNs = ge(t), this.sec = f.toNumber(f.divide(this.totalNs, Gn)), this.subsec = f.toNumber(f.remainder(this.totalNs, Gn));
  }
  static validateNew(t, n) {
    if (f.greaterThan(Se(t), O.MAX)) throw new RangeError(`${n} of duration time units cannot exceed ${O.MAX} s`);
    return new O(t);
  }
  static fromEpochNsDiff(t, n) {
    const r = f.subtract(ge(t), ge(n));
    return new O(r);
  }
  static fromComponents(t, n, r, i, o, s) {
    const a = f.add(f.add(f.add(f.add(f.add(f.BigInt(s), f.multiply(f.BigInt(o), Uc)), f.multiply(f.BigInt(i), pr)), f.multiply(f.BigInt(r), Gn)), f.multiply(f.BigInt(n), Fc)), f.multiply(f.BigInt(t), Qs));
    return O.validateNew(a, "total");
  }
  abs() {
    return new O(Se(this.totalNs));
  }
  add(t) {
    return O.validateNew(f.add(this.totalNs, t.totalNs), "sum");
  }
  add24HourDays(t) {
    return O.validateNew(f.add(this.totalNs, f.multiply(f.BigInt(t), Le)), "sum");
  }
  addToEpochNs(t) {
    return f.add(ge(t), this.totalNs);
  }
  cmp(t) {
    return qr(this.totalNs, t.totalNs);
  }
  divmod(t) {
    const { quotient: n, remainder: r } = Pn(this.totalNs, f.BigInt(t));
    return { quotient: f.toNumber(n), remainder: new O(r) };
  }
  fdiv(t) {
    const n = ge(t), r = f.BigInt(n);
    let { quotient: i, remainder: o } = Pn(this.totalNs, r);
    const s = [];
    let a;
    const c = (f.lessThan(this.totalNs, Ot) ? -1 : 1) * Math.sign(f.toNumber(n));
    for (; !f.equal(o, Ot) && s.length < 50; ) o = f.multiply(o, Sc), { quotient: a, remainder: o } = Pn(o, r), s.push(Math.abs(f.toNumber(a)));
    return c * +(Se(i).toString() + "." + s.join(""));
  }
  isZero() {
    return f.equal(this.totalNs, Ot);
  }
  round(t, n) {
    const r = ge(t);
    if (f.equal(r, er)) return this;
    const { quotient: i, remainder: o } = Pn(this.totalNs, r), s = f.lessThan(this.totalNs, Ot) ? "negative" : "positive", a = f.multiply(Se(i), r), c = f.add(a, r), u = qr(Se(f.multiply(o, wo)), r), l = mi(n, s), h = f.equal(Se(this.totalNs), a) ? a : gi(a, c, u, Bs(i), l), d = s === "positive" ? h : f.unaryMinus(h);
    return O.validateNew(d, "rounding");
  }
  sign() {
    return this.cmp(new O(Ot));
  }
  subtract(t) {
    return O.validateNew(f.subtract(this.totalNs, t.totalNs), "difference");
  }
}
O.MAX = f.BigInt("9007199254740991999999999"), O.ZERO = new O(Ot);
const Vo = /[A-Za-z._][A-Za-z._0-9+-]*/, yr = new RegExp(`(?:${/(?:[+-](?:[01][0-9]|2[0-3])(?::?[0-5][0-9])?)/.source}|(?:${Vo.source})(?:\\/(?:${Vo.source}))*)`), la = /(?:[+-]\d{6}|\d{4})/, Xr = /(?:0[1-9]|1[0-2])/, Zi = /(?:0[1-9]|[12]\d|3[01])/, Hc = new RegExp(`(${la.source})(?:-(${Xr.source})-(${Zi.source})|(${Xr.source})(${Zi.source}))`), ha = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/, da = /((?:[+-])(?:[01][0-9]|2[0-3])(?::?(?:[0-5][0-9])(?::?(?:[0-5][0-9])(?:[.,](?:\d{1,9}))?)?)?)/, fa = new RegExp(`([zZ])|${da.source}?`), pn = /\[(!)?([a-z_][a-z0-9_-]*)=([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\]/g, Zc = new RegExp([`^${Hc.source}`, `(?:(?:[tT]|\\s+)${ha.source}(?:${fa.source})?)?`, `(?:\\[!?(${yr.source})\\])?`, `((?:${pn.source})*)$`].join("")), qc = new RegExp([`^[tT]?${ha.source}`, `(?:${fa.source})?`, `(?:\\[!?${yr.source}\\])?`, `((?:${pn.source})*)$`].join("")), Xc = new RegExp(`^(${la.source})-?(${Xr.source})(?:\\[!?${yr.source}\\])?((?:${pn.source})*)$`), Wc = new RegExp(`^(?:--)?(${Xr.source})-?(${Zi.source})(?:\\[!?${yr.source}\\])?((?:${pn.source})*)$`), Ni = /(\d+)(?:[.,](\d{1,9}))?/, Gc = new RegExp(`(?:${Ni.source}H)?(?:${Ni.source}M)?(?:${Ni.source}S)?`), Vc = new RegExp(`^([+-])?P${/(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/.source}(?:T(?!$)${Gc.source})?$`, "i"), Oe = 864e5, Wr = 1e6 * Oe, Kc = 6e10, ma = 1e8 * Oe, yn = oe(ma), nr = f.unaryMinus(yn), Qc = f.add(f.subtract(nr, Le), er), Bc = f.subtract(f.add(yn, Le), er), Jc = 146097 * Oe, Ko = -271821, Qo = 275760, Vn = Date.UTC(1847, 0, 1), tu = ["iso8601", "hebrew", "islamic", "islamic-umalqura", "islamic-tbla", "islamic-civil", "islamic-rgsa", "islamicc", "persian", "ethiopic", "ethioaa", "ethiopic-amete-alem", "coptic", "chinese", "dangi", "roc", "indian", "buddhist", "japanese", "gregory"], eu = /* @__PURE__ */ new Set(["ACT", "AET", "AGT", "ART", "AST", "BET", "BST", "CAT", "CNT", "CST", "CTT", "EAT", "ECT", "IET", "IST", "JST", "MIT", "NET", "NST", "PLT", "PNT", "PRT", "PST", "SST", "VST"]);
function V(e) {
  return typeof e == "object" && e !== null || typeof e == "function";
}
function pi(e) {
  if (typeof e == "bigint") throw new TypeError("Cannot convert BigInt to number");
  return Number(e);
}
function yi(e) {
  if (typeof e == "symbol") throw new TypeError("Cannot convert a Symbol value to a String");
  return String(e);
}
function k(e) {
  const t = pi(e);
  if (t === 0) return 0;
  if (Number.isNaN(t) || t === 1 / 0 || t === -1 / 0) throw new RangeError("invalid number value");
  const n = Math.trunc(t);
  return n === 0 ? 0 : n;
}
function Bo(e, t) {
  const n = k(e);
  if (n <= 0)
    throw t !== void 0 ? new RangeError(`property '${t}' cannot be a a number less than one`) : new RangeError("Cannot convert a number less than one to a positive integer");
  return n;
}
function Gt(e) {
  const t = pi(e);
  if (Number.isNaN(t)) throw new RangeError("not a number");
  if (t === 1 / 0 || t === -1 / 0) throw new RangeError("infinity is out of range");
  if (!(function(n) {
    if (typeof n != "number" || Number.isNaN(n) || n === 1 / 0 || n === -1 / 0) return !1;
    const r = Math.abs(n);
    return Math.floor(r) === r;
  })(t)) throw new RangeError(`unsupported fractional value ${e}`);
  return t === 0 ? 0 : t;
}
function rr(e, t) {
  return String(e).padStart(t, "0");
}
function J(e) {
  if (typeof e != "string") throw new TypeError(`expected a string, not ${String(e)}`);
  return e;
}
function qi(e, t) {
  if (V(e)) {
    const n = e?.toString();
    if (typeof n == "string" || typeof n == "number") return n;
    throw new TypeError("Cannot convert object to primitive value");
  }
  return e;
}
const Xi = ["era", "eraYear", "year", "month", "monthCode", "day", "hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset", "timeZone"], nu = { era: yi, eraYear: k, year: k, month: Bo, monthCode: function(e) {
  const t = J(qi(e));
  if (t.length < 3 || t.length > 4 || t[0] !== "M" || "0123456789".indexOf(t[1]) === -1 || "0123456789".indexOf(t[2]) === -1 || t[1] + t[2] === "00" && t[3] !== "L" || t[3] !== "L" && t[3] !== void 0) throw new RangeError(`bad month code ${t}; must match M01-M99 or M00L-M99L`);
  return t;
}, day: Bo, hour: k, minute: k, second: k, millisecond: k, microsecond: k, nanosecond: k, offset: function(e) {
  const t = J(qi(e));
  return kn(t), t;
}, timeZone: Tt }, ru = { hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }, wn = [["years", "year", "date"], ["months", "month", "date"], ["weeks", "week", "date"], ["days", "day", "date"], ["hours", "hour", "time"], ["minutes", "minute", "time"], ["seconds", "second", "time"], ["milliseconds", "millisecond", "time"], ["microseconds", "microsecond", "time"], ["nanoseconds", "nanosecond", "time"]], Jo = Object.fromEntries(wn.map(((e) => [e[0], e[1]]))), iu = Object.fromEntries(wn.map((([e, t]) => [t, e]))), Kn = wn.map((([, e]) => e)), vn = { day: Wr, hour: 36e11, minute: 6e10, second: 1e9, millisecond: 1e6, microsecond: 1e3, nanosecond: 1 }, Gr = ["days", "hours", "microseconds", "milliseconds", "minutes", "months", "nanoseconds", "seconds", "weeks", "years"], ou = Intl.DateTimeFormat, ts = /* @__PURE__ */ new Map();
function ga(e) {
  const t = cr(e);
  let n = ts.get(t);
  return n === void 0 && (n = new ou("en-us", { timeZone: t, hour12: !1, era: "short", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }), ts.set(t, n)), n;
}
function nt(e) {
  return Et(e, $) && !Et(e, S, M);
}
function X(e) {
  return Et(e, dt, ft, mt, gt, pt, yt, wt, vt, Ct);
}
function W(e) {
  return Et(e, Js);
}
function K(e) {
  return Et(e, G);
}
function Z(e) {
  return Et(e, q);
}
function rt(e) {
  return Et(e, ta);
}
function Lt(e) {
  return Et(e, ea);
}
function L(e) {
  return Et(e, $, S, M);
}
function b(e, t) {
  if (!t(e)) throw new TypeError("invalid receiver: method called with the wrong type of this-object");
}
function Cn(e) {
  if (Et(e, M) || Et(e, S)) throw new TypeError("with() does not support a calendar or timeZone property");
  if (K(e)) throw new TypeError("with() does not accept Temporal.PlainTime, use withPlainTime() instead");
  if (e.calendar !== void 0) throw new TypeError("with() does not support a calendar property");
  if (e.timeZone !== void 0) throw new TypeError("with() does not support a timeZone property");
}
function wr(e, t) {
  return t === "never" || t === "auto" && e === "iso8601" ? "" : `[${t === "critical" ? "!" : ""}u-ca=${e}]`;
}
function wi(e) {
  let t, n, r = !1;
  for (pn.lastIndex = 0; n = pn.exec(e); ) {
    const { 1: i, 2: o, 3: s } = n;
    if (o === "u-ca") {
      if (t === void 0) t = s, r = i === "!";
      else if (i === "!" || r) throw new RangeError(`Invalid annotations in ${e}: more than one u-ca present with critical flag`);
    } else if (i === "!") throw new RangeError(`Unrecognized annotation: !${o}=${s}`);
  }
  return t;
}
function he(e) {
  const t = Zc.exec(e);
  if (!t) throw new RangeError(`invalid RFC 9557 string: ${e}`);
  const n = wi(t[16]);
  let r = t[1];
  if (r === "-000000") throw new RangeError(`invalid RFC 9557 string: ${e}`);
  const i = +r, o = +(t[2] ?? t[4] ?? 1), s = +(t[3] ?? t[5] ?? 1), a = t[6] !== void 0, c = +(t[6] ?? 0), u = +(t[7] ?? t[10] ?? 0);
  let l = +(t[8] ?? t[11] ?? 0);
  l === 60 && (l = 59);
  const h = (t[9] ?? t[12] ?? "") + "000000000", d = +h.slice(0, 3), g = +h.slice(3, 6), p = +h.slice(6, 9);
  let w, y = !1;
  t[13] ? (w = void 0, y = !0) : t[14] && (w = t[14]);
  const v = t[15];
  return Eo(i, o, s, c, u, l, d, g, p), { year: i, month: o, day: s, time: a ? { hour: c, minute: u, second: l, millisecond: d, microsecond: g, nanosecond: p } : "start-of-day", tzAnnotation: v, offset: w, z: y, calendar: n };
}
function pa(e) {
  const t = qc.exec(e);
  let n, r, i, o, s, a, c;
  if (t) {
    c = wi(t[10]), n = +(t[1] ?? 0), r = +(t[2] ?? t[5] ?? 0), i = +(t[3] ?? t[6] ?? 0), i === 60 && (i = 59);
    const u = (t[4] ?? t[7] ?? "") + "000000000";
    if (o = +u.slice(0, 3), s = +u.slice(3, 6), a = +u.slice(6, 9), t[8]) throw new RangeError("Z designator not supported for PlainTime");
  } else {
    let u, l;
    if ({ time: u, z: l, calendar: c } = he(e), u === "start-of-day") throw new RangeError(`time is missing in string: ${e}`);
    if (l) throw new RangeError("Z designator not supported for PlainTime");
    ({ hour: n, minute: r, second: i, millisecond: o, microsecond: s, nanosecond: a } = u);
  }
  if (Ti(n, r, i, o, s, a), /[tT ][0-9][0-9]/.test(e)) return { hour: n, minute: r, second: i, millisecond: o, microsecond: s, nanosecond: a, calendar: c };
  try {
    const { month: u, day: l } = bo(e);
    Xe(1972, u, l);
  } catch {
    try {
      const { year: u, month: l } = vo(e);
      Xe(u, l, 1);
    } catch {
      return { hour: n, minute: r, second: i, millisecond: o, microsecond: s, nanosecond: a, calendar: c };
    }
  }
  throw new RangeError(`invalid RFC 9557 time-only string ${e}; may need a T prefix`);
}
function vo(e) {
  const t = Xc.exec(e);
  let n, r, i, o;
  if (t) {
    i = wi(t[3]);
    let s = t[1];
    if (s === "-000000") throw new RangeError(`invalid RFC 9557 string: ${e}`);
    if (n = +s, r = +t[2], o = 1, i !== void 0 && i !== "iso8601") throw new RangeError("YYYY-MM format is only valid with iso8601 calendar");
  } else {
    let s;
    if ({ year: n, month: r, calendar: i, day: o, z: s } = he(e), s) throw new RangeError("Z designator not supported for PlainYearMonth");
  }
  return { year: n, month: r, calendar: i, referenceISODay: o };
}
function bo(e) {
  const t = Wc.exec(e);
  let n, r, i, o;
  if (t) {
    if (i = wi(t[3]), n = +t[1], r = +t[2], i !== void 0 && i !== "iso8601") throw new RangeError("MM-DD format is only valid with iso8601 calendar");
  } else {
    let s;
    if ({ month: n, day: r, calendar: i, year: o, z: s } = he(e), s) throw new RangeError("Z designator not supported for PlainMonthDay");
  }
  return { month: n, day: r, calendar: i, referenceISOYear: o };
}
const ya = new RegExp(`^${yr.source}$`, "i"), wa = new RegExp(`^${/([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])?)?/.source}$`);
function va(e) {
  const t = au.test(e) ? "Seconds not allowed in offset time zone" : "Invalid time zone";
  throw new RangeError(`${t}: ${e}`);
}
function Re(e) {
  return ya.test(e) || va(e), wa.test(e) ? { offsetMinutes: kn(e) / 6e10 } : { tzName: e };
}
function Qn(e, t, n, r) {
  let i = e, o = t, s = n;
  switch (r) {
    case "reject":
      Xe(i, o, s);
      break;
    case "constrain":
      ({ year: i, month: o, day: s } = Ia(i, o, s));
  }
  return { year: i, month: o, day: s };
}
function vi(e, t, n, r, i, o, s) {
  let a = e, c = t, u = n, l = r, h = i, d = o;
  switch (s) {
    case "reject":
      Ti(a, c, u, l, h, d);
      break;
    case "constrain":
      a = bt(a, 0, 23), c = bt(c, 0, 59), u = bt(u, 0, 59), l = bt(l, 0, 999), h = bt(h, 0, 999), d = bt(d, 0, 999);
  }
  return { hour: a, minute: c, second: u, millisecond: l, microsecond: h, nanosecond: d };
}
function ba(e) {
  if (!V(e)) throw new TypeError("invalid duration-like");
  const t = { years: void 0, months: void 0, weeks: void 0, days: void 0, hours: void 0, minutes: void 0, seconds: void 0, milliseconds: void 0, microseconds: void 0, nanoseconds: void 0 };
  let n = !1;
  for (let r = 0; r < Gr.length; r++) {
    const i = Gr[r], o = e[i];
    o !== void 0 && (n = !0, t[i] = Gt(o));
  }
  if (!n) throw new TypeError("invalid duration-like");
  return t;
}
function at({ years: e, months: t, weeks: n, days: r }, i, o, s) {
  return { years: e, months: s ?? t, weeks: o ?? n, days: i ?? r };
}
function P(e, t) {
  return { isoDate: e, time: t };
}
function I(e) {
  return Te(e, "overflow", ["constrain", "reject"], "constrain");
}
function Bn(e) {
  return Te(e, "disambiguation", ["compatible", "earlier", "later", "reject"], "compatible");
}
function Qt(e, t) {
  return Te(e, "roundingMode", ["ceil", "floor", "expand", "trunc", "halfCeil", "halfFloor", "halfExpand", "halfTrunc", "halfEven"], t);
}
function zr(e, t) {
  return Te(e, "offset", ["prefer", "use", "ignore", "reject"], t);
}
function vr(e) {
  return Te(e, "calendarName", ["auto", "always", "never", "critical"], "auto");
}
function $n(e) {
  let t = e.roundingIncrement;
  if (t === void 0) return 1;
  const n = k(t);
  if (n < 1 || n > 1e9) throw new RangeError(`roundingIncrement must be at least 1 and at most 1e9, not ${t}`);
  return n;
}
function An(e, t, n) {
  const r = n ? t : t - 1;
  if (e > r) throw new RangeError(`roundingIncrement must be at least 1 and less than ${r}, not ${e}`);
  if (t % e != 0) throw new RangeError(`Rounding increment must divide evenly into ${t}`);
}
function br(e) {
  const t = e.fractionalSecondDigits;
  if (t === void 0) return "auto";
  if (typeof t != "number") {
    if (yi(t) !== "auto") throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${t}`);
    return "auto";
  }
  const n = Math.floor(t);
  if (!Number.isFinite(n) || n < 0 || n > 9) throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${t}`);
  return n;
}
function _r(e, t) {
  switch (e) {
    case "minute":
      return { precision: "minute", unit: "minute", increment: 1 };
    case "second":
      return { precision: 0, unit: "second", increment: 1 };
    case "millisecond":
      return { precision: 3, unit: "millisecond", increment: 1 };
    case "microsecond":
      return { precision: 6, unit: "microsecond", increment: 1 };
    case "nanosecond":
      return { precision: 9, unit: "nanosecond", increment: 1 };
  }
  switch (t) {
    case "auto":
      return { precision: t, unit: "nanosecond", increment: 1 };
    case 0:
      return { precision: t, unit: "second", increment: 1 };
    case 1:
    case 2:
    case 3:
      return { precision: t, unit: "millisecond", increment: 10 ** (3 - t) };
    case 4:
    case 5:
    case 6:
      return { precision: t, unit: "microsecond", increment: 10 ** (6 - t) };
    case 7:
    case 8:
    case 9:
      return { precision: t, unit: "nanosecond", increment: 10 ** (9 - t) };
    default:
      throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${t}`);
  }
}
const Ee = Symbol("~required~");
function At(e, t, n, r, i = []) {
  let o = [];
  for (let u = 0; u < wn.length; u++) {
    const l = wn[u], h = l[1], d = l[2];
    n !== "datetime" && n !== d || o.push(h);
  }
  o = o.concat(i);
  let s = r;
  s === Ee ? s = void 0 : s !== void 0 && o.push(s);
  let a = [];
  a = a.concat(o);
  for (let u = 0; u < o.length; u++) {
    const l = o[u], h = iu[l];
    h !== void 0 && a.push(h);
  }
  let c = Te(e, t, a, s);
  if (c === void 0 && r === Ee) throw new RangeError(`${t} is required`);
  return c && c in Jo ? Jo[c] : c;
}
function Ri(e) {
  const t = e.relativeTo;
  if (t === void 0) return {};
  let n, r, i, o, s, a = "option", c = !1;
  if (V(t)) {
    if (L(t)) return { zonedRelativeTo: t };
    if (W(t)) return { plainRelativeTo: t };
    if (Z(t)) return { plainRelativeTo: _t(m(t, q).isoDate, m(t, M)) };
    i = Dr(t);
    const u = Pt(i, t, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset", "timeZone"], []);
    ({ isoDate: n, time: r } = Mr(i, u, "constrain")), { offset: s, timeZone: o } = u, s === void 0 && (a = "wall");
  } else {
    let u, l, h, d, g;
    if ({ year: h, month: d, day: g, time: r, calendar: i, tzAnnotation: u, offset: s, z: l } = he(J(t)), u) o = Tt(u), l ? a = "exact" : s || (a = "wall"), c = !0;
    else if (l) throw new RangeError("Z designator not supported for PlainDate relativeTo; either remove the Z or add a bracketed time zone");
    i || (i = "iso8601"), i = xt(i), n = { year: h, month: d, day: g };
  }
  return o === void 0 ? { plainRelativeTo: _t(n, i) } : { zonedRelativeTo: st(Vr(n, r, a, a === "option" ? kn(s) : 0, o, "compatible", "reject", c), o, i) };
}
function pe(e) {
  return m(e, dt) !== 0 ? "year" : m(e, ft) !== 0 ? "month" : m(e, Dt) !== 0 ? "week" : m(e, mt) !== 0 ? "day" : m(e, gt) !== 0 ? "hour" : m(e, pt) !== 0 ? "minute" : m(e, yt) !== 0 ? "second" : m(e, wt) !== 0 ? "millisecond" : m(e, vt) !== 0 ? "microsecond" : "nanosecond";
}
function be(e, t) {
  return Kn.indexOf(e) > Kn.indexOf(t) ? t : e;
}
function ee(e) {
  return e === "year" || e === "month" || e === "week";
}
function ye(e) {
  return ee(e) || e === "day" ? "date" : "time";
}
function Ie(e) {
  return ot("%calendarImpl%")(e);
}
function Tr(e) {
  return ot("%calendarImpl%")(m(e, M));
}
function Mt(e, t, n = "date") {
  const r = /* @__PURE__ */ Object.create(null), i = Ie(e).isoToDate(t, { year: !0, monthCode: !0, day: !0 });
  return r.monthCode = i.monthCode, n !== "month-day" && n !== "date" || (r.day = i.day), n !== "year-month" && n !== "date" || (r.year = i.year), r;
}
function Pt(e, t, n, r, i) {
  const o = Ie(e).extraFields(n), s = n.concat(r, o), a = /* @__PURE__ */ Object.create(null);
  let c = !1;
  s.sort();
  for (let u = 0; u < s.length; u++) {
    const l = s[u], h = t[l];
    if (h !== void 0) c = !0, a[l] = (0, nu[l])(h);
    else if (i !== "partial") {
      if (i.includes(l)) throw new TypeError(`required property '${l}' missing or undefined`);
      a[l] = ru[l];
    }
  }
  if (i === "partial" && !c) throw new TypeError("no supported properties found");
  return a;
}
function Wi(e, t = "complete") {
  const n = ["hour", "microsecond", "millisecond", "minute", "nanosecond", "second"];
  let r = !1;
  const i = /* @__PURE__ */ Object.create(null);
  for (let o = 0; o < n.length; o++) {
    const s = n[o], a = e[s];
    a !== void 0 ? (i[s] = k(a), r = !0) : t === "complete" && (i[s] = 0);
  }
  if (!r) throw new TypeError("invalid time-like");
  return i;
}
function zn(e, t) {
  if (V(e)) {
    if (W(e)) return I(D(t)), _t(m(e, A), m(e, M));
    if (L(e)) {
      const c = Ft(m(e, S), m(e, $));
      return I(D(t)), _t(c.isoDate, m(e, M));
    }
    if (Z(e)) return I(D(t)), _t(m(e, q).isoDate, m(e, M));
    const a = Dr(e);
    return _t(Ye(a, Pt(a, e, ["year", "month", "monthCode", "day"], [], []), I(D(t))), a);
  }
  let { year: n, month: r, day: i, calendar: o, z: s } = he(J(e));
  if (s) throw new RangeError("Z designator not supported for PlainDate");
  return o || (o = "iso8601"), o = xt(o), I(D(t)), _t({ year: n, month: r, day: i }, o);
}
function Mr(e, t, n) {
  return P(Ye(e, t, n), vi(t.hour, t.minute, t.second, t.millisecond, t.microsecond, t.nanosecond, n));
}
function jn(e, t) {
  let n, r, i;
  if (V(e)) {
    if (Z(e)) return I(D(t)), St(m(e, q), m(e, M));
    if (L(e)) {
      const a = Ft(m(e, S), m(e, $));
      return I(D(t)), St(a, m(e, M));
    }
    if (W(e)) return I(D(t)), St(P(m(e, A), { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), m(e, M));
    i = Dr(e);
    const o = Pt(i, e, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond"], []), s = I(D(t));
    ({ isoDate: n, time: r } = Mr(i, o, s));
  } else {
    let o, s, a, c;
    if ({ year: s, month: a, day: c, time: r, calendar: i, z: o } = he(J(e)), o) throw new RangeError("Z designator not supported for PlainDateTime");
    r === "start-of-day" && (r = { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), Eo(s, a, c, r.hour, r.minute, r.second, r.millisecond, r.microsecond, r.nanosecond), i || (i = "iso8601"), i = xt(i), I(D(t)), n = { year: s, month: a, day: c };
  }
  return St(P(n, r), i);
}
function Ut(e) {
  const t = ot("%Temporal.Duration%");
  if (X(e)) return new t(m(e, dt), m(e, ft), m(e, Dt), m(e, mt), m(e, gt), m(e, pt), m(e, yt), m(e, wt), m(e, vt), m(e, Ct));
  if (!V(e)) return (function(i) {
    const { years: o, months: s, weeks: a, days: c, hours: u, minutes: l, seconds: h, milliseconds: d, microseconds: g, nanoseconds: p } = (function(w) {
      const y = Vc.exec(w);
      if (!y) throw new RangeError(`invalid duration: ${w}`);
      if (y.every(((nn, Wt) => Wt < 2 || nn === void 0))) throw new RangeError(`invalid duration: ${w}`);
      const v = y[1] === "-" ? -1 : 1, _ = y[2] === void 0 ? 0 : k(y[2]) * v, T = y[3] === void 0 ? 0 : k(y[3]) * v, x = y[4] === void 0 ? 0 : k(y[4]) * v, E = y[5] === void 0 ? 0 : k(y[5]) * v, N = y[6] === void 0 ? 0 : k(y[6]) * v, F = y[7], U = y[8], j = y[9], H = y[10], C = y[11];
      let Y = 0, z = 0, Q = 0;
      if (F !== void 0) {
        if (U ?? j ?? H ?? C) throw new RangeError("only the smallest unit can be fractional");
        Q = 3600 * k((F + "000000000").slice(0, 9)) * v;
      } else if (Y = U === void 0 ? 0 : k(U) * v, j !== void 0) {
        if (H ?? C) throw new RangeError("only the smallest unit can be fractional");
        Q = 60 * k((j + "000000000").slice(0, 9)) * v;
      } else z = H === void 0 ? 0 : k(H) * v, C !== void 0 && (Q = k((C + "000000000").slice(0, 9)) * v);
      const Zt = Q % 1e3, qt = Math.trunc(Q / 1e3) % 1e3, Xt = Math.trunc(Q / 1e6) % 1e3;
      return z += Math.trunc(Q / 1e9) % 60, Y += Math.trunc(Q / 6e10), Mi(_, T, x, E, N, Y, z, Xt, qt, Zt), { years: _, months: T, weeks: x, days: E, hours: N, minutes: Y, seconds: z, milliseconds: Xt, microseconds: qt, nanoseconds: Zt };
    })(i);
    return new (ot("%Temporal.Duration%"))(o, s, a, c, u, l, h, d, g, p);
  })(J(e));
  const n = { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, microseconds: 0, nanoseconds: 0 };
  let r = ba(e);
  for (let i = 0; i < Gr.length; i++) {
    const o = Gr[i], s = r[o];
    s !== void 0 && (n[o] = s);
  }
  return new t(n.years, n.months, n.weeks, n.days, n.hours, n.minutes, n.seconds, n.milliseconds, n.microseconds, n.nanoseconds);
}
function Un(e) {
  let t;
  if (V(e)) {
    if (nt(e) || L(e)) return re(m(e, $));
    t = qi(e);
  } else t = e;
  const { year: n, month: r, day: i, time: o, offset: s, z: a } = (function(w) {
    const y = he(w);
    if (!y.z && !y.offset) throw new RangeError("Temporal.Instant requires a time zone offset");
    return y;
  })(J(t)), { hour: c = 0, minute: u = 0, second: l = 0, millisecond: h = 0, microsecond: d = 0, nanosecond: g = 0 } = o === "start-of-day" ? {} : o, p = ar(n, r, i, c, u, l, h, d, g - (a ? 0 : kn(s)));
  return mn(p.isoDate), re(it(p));
}
function es(e, t) {
  if (V(e)) {
    if (Lt(e)) return I(D(t)), hn(m(e, A), m(e, M));
    let a;
    return Et(e, M) ? a = m(e, M) : (a = e.calendar, a === void 0 && (a = "iso8601"), a = xr(a)), hn(Kr(a, Pt(a, e, ["year", "month", "monthCode", "day"], [], []), I(D(t))), a);
  }
  let { month: n, day: r, referenceISOYear: i, calendar: o } = bo(J(e));
  if (o === void 0 && (o = "iso8601"), o = xt(o), I(D(t)), o === "iso8601") return hn({ year: 1972, month: n, day: r }, o);
  let s = { year: i, month: n, day: r };
  return tn(s), s = Kr(o, Mt(o, s, "month-day"), "constrain"), hn(s, o);
}
function ke(e, t) {
  let n;
  if (V(e)) {
    if (K(e)) return I(D(t)), we(m(e, G));
    if (Z(e)) return I(D(t)), we(m(e, q).time);
    if (L(e)) {
      const u = Ft(m(e, S), m(e, $));
      return I(D(t)), we(u.time);
    }
    const { hour: r, minute: i, second: o, millisecond: s, microsecond: a, nanosecond: c } = Wi(e);
    n = vi(r, i, o, s, a, c, I(D(t)));
  } else n = pa(J(e)), I(D(t));
  return we(n);
}
function _a(e) {
  return e === void 0 ? { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 } : m(ke(e), G);
}
function Fn(e, t) {
  if (V(e)) {
    if (rt(e)) return I(D(t)), fn(m(e, A), m(e, M));
    const a = Dr(e);
    return fn(ir(a, Pt(a, e, ["year", "month", "monthCode"], [], []), I(D(t))), a);
  }
  let { year: n, month: r, referenceISODay: i, calendar: o } = vo(J(e));
  o === void 0 && (o = "iso8601"), o = xt(o), I(D(t));
  let s = { year: n, month: r, day: i };
  return xo(s), s = ir(o, Mt(o, s, "year-month"), "constrain"), fn(s, o);
}
function Vr(e, t, n, r, i, o, s, a) {
  if (t === "start-of-day") return $e(i, e);
  const c = P(e, t);
  if (n === "wall" || s === "ignore") return ct(i, c, o);
  if (n === "exact" || s === "use") {
    const h = ar(e.year, e.month, e.day, t.hour, t.minute, t.second, t.millisecond, t.microsecond, t.nanosecond - r);
    mn(h.isoDate);
    const d = it(h);
    return ue(d), d;
  }
  mn(e);
  const u = it(c), l = or(i, c);
  for (let h = 0; h < l.length; h++) {
    const d = l[h], g = f.toNumber(f.subtract(u, d)), p = Ne(g, 6e10, "halfExpand");
    if (g === r || a && p === r) return d;
  }
  if (s === "reject") {
    const h = Gi(r), d = sr(c, "iso8601", "auto");
    throw new RangeError(`Offset ${h} is invalid for ${d} in ${i}`);
  }
  return ka(l, i, c, o);
}
function Hn(e, t) {
  let n, r, i, o, s, a, c, u = !1, l = "option";
  if (V(e)) {
    if (L(e)) {
      const w = D(t);
      return Bn(w), zr(w, "reject"), I(w), st(m(e, $), m(e, S), m(e, M));
    }
    s = Dr(e);
    const d = Pt(s, e, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset", "timeZone"], ["timeZone"]);
    ({ offset: o, timeZone: i } = d), o === void 0 && (l = "wall");
    const g = D(t);
    a = Bn(g), c = zr(g, "reject");
    const p = I(g);
    ({ isoDate: n, time: r } = Mr(s, d, p));
  } else {
    let d, g, p, w, y;
    ({ year: p, month: w, day: y, time: r, tzAnnotation: d, offset: o, z: g, calendar: s } = (function(_) {
      const T = he(_);
      if (!T.tzAnnotation) throw new RangeError("Temporal.ZonedDateTime requires a time zone ID in brackets");
      return T;
    })(J(e))), i = Tt(d), g ? l = "exact" : o || (l = "wall"), s || (s = "iso8601"), s = xt(s), u = !0;
    const v = D(t);
    a = Bn(v), c = zr(v, "reject"), I(v), n = { year: p, month: w, day: y };
  }
  let h = 0;
  return l === "option" && (h = kn(o)), st(Vr(n, r, l, h, i, a, c, u), i, s);
}
function Ta(e, t, n) {
  tn(t), De(e), R(e, A, t), R(e, M, n), R(e, Js, !0);
}
function _t(e, t) {
  const n = ot("%Temporal.PlainDate%"), r = Object.create(n.prototype);
  return Ta(r, e, t), r;
}
function Ma(e, t, n) {
  We(t), De(e), R(e, q, t), R(e, M, n);
}
function St(e, t) {
  const n = ot("%Temporal.PlainDateTime%"), r = Object.create(n.prototype);
  return Ma(r, e, t), r;
}
function Ea(e, t, n) {
  tn(t), De(e), R(e, A, t), R(e, M, n), R(e, ea, !0);
}
function hn(e, t) {
  const n = ot("%Temporal.PlainMonthDay%"), r = Object.create(n.prototype);
  return Ea(r, e, t), r;
}
function xa(e, t) {
  De(e), R(e, G, t);
}
function we(e) {
  const t = ot("%Temporal.PlainTime%"), n = Object.create(t.prototype);
  return xa(n, e), n;
}
function Da(e, t, n) {
  xo(t), De(e), R(e, A, t), R(e, M, n), R(e, ta, !0);
}
function fn(e, t) {
  const n = ot("%Temporal.PlainYearMonth%"), r = Object.create(n.prototype);
  return Da(r, e, t), r;
}
function Ca(e, t) {
  ue(t), De(e), R(e, $, t);
}
function re(e) {
  const t = ot("%Temporal.Instant%"), n = Object.create(t.prototype);
  return Ca(n, e), n;
}
function $a(e, t, n, r) {
  ue(t), De(e), R(e, $, t), R(e, S, n), R(e, M, r);
}
function st(e, t, n = "iso8601") {
  const r = ot("%Temporal.ZonedDateTime%"), i = Object.create(r.prototype);
  return $a(i, e, t, n), i;
}
function ns(e) {
  return Xi.filter(((t) => e[t] !== void 0));
}
function qe(e, t, n) {
  const r = ns(n), i = Ie(e).fieldKeysToIgnore(r), o = /* @__PURE__ */ Object.create(null), s = ns(t);
  for (let a = 0; a < Xi.length; a++) {
    let c;
    const u = Xi[a];
    s.includes(u) && !i.includes(u) && (c = t[u]), r.includes(u) && (c = n[u]), c !== void 0 && (o[u] = c);
  }
  return o;
}
function Yt(e, t, n, r) {
  const i = Ie(e).dateAdd(t, n, r);
  return tn(i), i;
}
function Er(e, t, n, r) {
  return Ie(e).dateUntil(t, n, r);
}
function xr(e) {
  if (V(e) && Et(e, M)) return m(e, M);
  const t = J(e);
  try {
    return xt(t);
  } catch {
  }
  let n;
  try {
    ({ calendar: n } = he(t));
  } catch {
    try {
      ({ calendar: n } = pa(t));
    } catch {
      try {
        ({ calendar: n } = vo(t));
      } catch {
        ({ calendar: n } = bo(t));
      }
    }
  }
  return n || (n = "iso8601"), xt(n);
}
function Dr(e) {
  if (Et(e, M)) return m(e, M);
  const { calendar: t } = e;
  return t === void 0 ? "iso8601" : xr(t);
}
function ce(e, t) {
  return xt(e) === xt(t);
}
function Ye(e, t, n) {
  const r = Ie(e);
  r.resolveFields(t, "date");
  const i = r.dateToISO(t, n);
  return tn(i), i;
}
function ir(e, t, n) {
  const r = Ie(e);
  r.resolveFields(t, "year-month"), t.day = 1;
  const i = r.dateToISO(t, n);
  return xo(i), i;
}
function Kr(e, t, n) {
  const r = Ie(e);
  r.resolveFields(t, "month-day");
  const i = r.monthDayToISOReferenceDate(t, n);
  return tn(i), i;
}
function Tt(e) {
  if (V(e) && L(e)) return m(e, S);
  const t = J(e);
  if (t === "UTC") return "UTC";
  const { tzName: n, offsetMinutes: r } = (function(o) {
    const { tzAnnotation: s, offset: a, z: c } = (function(u) {
      if (ya.test(u)) return { tzAnnotation: u, offset: void 0, z: !1 };
      try {
        const { tzAnnotation: l, offset: h, z: d } = he(u);
        if (d || l || h) return { tzAnnotation: l, offset: h, z: d };
      } catch {
      }
      va(u);
    })(o);
    return s ? Re(s) : c ? Re("UTC") : a ? Re(a) : void 0;
  })(t);
  if (r !== void 0) return _o(r);
  const i = Qr(n);
  if (!i) throw new RangeError(`Unrecognized time zone ${n}`);
  return i.identifier;
}
function Aa(e, t) {
  if (e === t) return !0;
  const n = Re(e).offsetMinutes, r = Re(t).offsetMinutes;
  if (n === void 0 && r === void 0) {
    const i = Qr(t);
    if (!i) return !1;
    const o = Qr(e);
    return !!o && o.primaryIdentifier === i.primaryIdentifier;
  }
  return n === r;
}
function ve(e, t) {
  const n = Re(e).offsetMinutes;
  return n !== void 0 ? 6e10 * n : Vi(e, t);
}
function Gi(e) {
  const t = e < 0 ? "-" : "+", n = Math.abs(e), r = Math.floor(n / 36e11), i = Math.floor(n / 6e10) % 60, o = Math.floor(n / 1e9) % 60, s = n % 1e9;
  return `${t}${bi(r, i, o, s, o === 0 && s === 0 ? "minute" : "auto")}`;
}
function Ft(e, t) {
  const n = ve(e, t);
  let { isoDate: { year: r, month: i, day: o }, time: { hour: s, minute: a, second: c, millisecond: u, microsecond: l, nanosecond: h } } = La(t);
  return ar(r, i, o, s, a, c, u, l, h + n);
}
function ct(e, t, n) {
  return ka(or(e, t), e, t, n);
}
function ka(e, t, n, r) {
  const i = e.length;
  if (i === 1) return e[0];
  if (i) switch (r) {
    case "compatible":
    case "earlier":
      return e[0];
    case "later":
      return e[i - 1];
    case "reject":
      throw new RangeError("multiple instants found");
  }
  if (r === "reject") throw new RangeError("multiple instants found");
  const o = it(n), s = f.subtract(o, Le);
  ue(s);
  const a = ve(t, s), c = f.add(o, Le);
  ue(c);
  const u = ve(t, c) - a;
  switch (r) {
    case "earlier": {
      const l = O.fromComponents(0, 0, 0, 0, 0, -u), h = bn(n.time, l);
      return or(t, P(Nt(n.isoDate.year, n.isoDate.month, n.isoDate.day + h.deltaDays), h))[0];
    }
    case "compatible":
    case "later": {
      const l = O.fromComponents(0, 0, 0, 0, 0, u), h = bn(n.time, l), d = or(t, P(Nt(n.isoDate.year, n.isoDate.month, n.isoDate.day + h.deltaDays), h));
      return d[d.length - 1];
    }
  }
}
function or(e, t) {
  if (e === "UTC") return mn(t.isoDate), [it(t)];
  const n = Re(e).offsetMinutes;
  if (n !== void 0) {
    const r = ar(t.isoDate.year, t.isoDate.month, t.isoDate.day, t.time.hour, t.time.minute - n, t.time.second, t.time.millisecond, t.time.microsecond, t.time.nanosecond);
    mn(r.isoDate);
    const i = it(r);
    return ue(i), [i];
  }
  return mn(t.isoDate), (function(r, i) {
    let o = it(i), s = f.subtract(o, Le);
    f.lessThan(s, nr) && (s = o);
    let a = f.add(o, Le);
    f.greaterThan(a, yn) && (a = o);
    const c = Vi(r, s), u = Vi(r, a);
    return (c === u ? [c] : [c, u]).map(((h) => {
      const d = f.subtract(o, f.BigInt(h)), g = (function(p, w) {
        const { epochMilliseconds: y, time: { millisecond: v, microsecond: _, nanosecond: T } } = La(w), { year: x, month: E, day: N, hour: F, minute: U, second: j } = Oa(p, y);
        return ar(x, E, N, F, U, j, v, _, T);
      })(r, d);
      if (_n(i, g) === 0) return ue(d), d;
    })).filter(((h) => h !== void 0));
  })(e, t);
}
function $e(e, t) {
  const n = P(t, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), r = or(e, n);
  if (r.length) return r[0];
  const i = it(n), o = f.subtract(i, Le);
  return ue(o), Mo(e, o);
}
function Cr(e) {
  let t;
  return t = e < 0 || e > 9999 ? (e < 0 ? "-" : "+") + rr(Math.abs(e), 6) : rr(e, 4), t;
}
function It(e) {
  return rr(e, 2);
}
function Na(e, t) {
  let n;
  if (t === "auto") {
    if (e === 0) return "";
    n = rr(e, 9).replace(/0+$/, "");
  } else {
    if (t === 0) return "";
    n = rr(e, 9).slice(0, t);
  }
  return `.${n}`;
}
function bi(e, t, n, r, i) {
  let o = `${It(e)}:${It(t)}`;
  return i === "minute" || (o += `:${It(n)}`, o += Na(r, i)), o;
}
function rs(e, t, n) {
  let r = t;
  r === void 0 && (r = "UTC");
  const i = m(e, $), o = sr(Ft(r, i), "iso8601", n, "never");
  let s = "Z";
  return t !== void 0 && (s = Ra(ve(r, i))), `${o}${s}`;
}
function Or(e, t) {
  const n = m(e, dt), r = m(e, ft), i = m(e, Dt), o = m(e, mt), s = m(e, gt), a = m(e, pt), c = Jr(e);
  let u = "";
  n !== 0 && (u += `${Math.abs(n)}Y`), r !== 0 && (u += `${Math.abs(r)}M`), i !== 0 && (u += `${Math.abs(i)}W`), o !== 0 && (u += `${Math.abs(o)}D`);
  let l = "";
  s !== 0 && (l += `${Math.abs(s)}H`), a !== 0 && (l += `${Math.abs(a)}M`);
  const h = O.fromComponents(0, 0, m(e, yt), m(e, wt), m(e, vt), m(e, Ct));
  h.isZero() && !["second", "millisecond", "microsecond", "nanosecond"].includes(pe(e)) && t === "auto" || (l += `${Math.abs(h.sec)}${Na(Math.abs(h.subsec), t)}S`);
  let d = `${c < 0 ? "-" : ""}P${u}`;
  return l && (d = `${d}T${l}`), d;
}
function is(e, t = "auto") {
  const { year: n, month: r, day: i } = m(e, A);
  return `${Cr(n)}-${It(r)}-${It(i)}${wr(m(e, M), t)}`;
}
function os({ hour: e, minute: t, second: n, millisecond: r, microsecond: i, nanosecond: o }, s) {
  return bi(e, t, n, 1e6 * r + 1e3 * i + o, s);
}
function sr(e, t, n, r = "auto") {
  const { isoDate: { year: i, month: o, day: s }, time: { hour: a, minute: c, second: u, millisecond: l, microsecond: h, nanosecond: d } } = e;
  return `${Cr(i)}-${It(o)}-${It(s)}T${bi(a, c, u, 1e6 * l + 1e3 * h + d, n)}${wr(t, r)}`;
}
function ss(e, t = "auto") {
  const { year: n, month: r, day: i } = m(e, A);
  let o = `${It(r)}-${It(i)}`;
  const s = m(e, M);
  t !== "always" && t !== "critical" && s === "iso8601" || (o = `${Cr(n)}-${o}`);
  const a = wr(s, t);
  return a && (o += a), o;
}
function as(e, t = "auto") {
  const { year: n, month: r, day: i } = m(e, A);
  let o = `${Cr(n)}-${It(r)}`;
  const s = m(e, M);
  t !== "always" && t !== "critical" && s === "iso8601" || (o += `-${It(i)}`);
  const a = wr(s, t);
  return a && (o += a), o;
}
function cs(e, t, n = "auto", r = "auto", i = "auto", o = void 0) {
  let s = m(e, $);
  if (o) {
    const { unit: l, increment: h, roundingMode: d } = o;
    s = Ji(s, h, l, d);
  }
  const a = m(e, S), c = ve(a, s);
  let u = sr(Ft(a, s), "iso8601", t, "never");
  return i !== "never" && (u += Ra(c)), r !== "never" && (u += `[${r === "critical" ? "!" : ""}${a}]`), u += wr(m(e, M), n), u;
}
function us(e) {
  return wa.test(e);
}
function kn(e) {
  const t = cu.exec(e);
  if (!t) throw new RangeError(`invalid time zone offset: ${e}; must match ±HH:MM[:SS.SSSSSSSSS]`);
  return (t[1] === "-" ? -1 : 1) * (1e9 * (60 * (60 * +t[2] + +(t[3] || 0)) + +(t[4] || 0)) + +((t[5] || 0) + "000000000").slice(0, 9));
}
let Ln;
const su = Object.assign(/* @__PURE__ */ Object.create(null), { "/": !0, "-": !0, _: !0 });
function Qr(e) {
  if (Ln === void 0) {
    const o = Intl.supportedValuesOf?.("timeZone");
    if (o) {
      Ln = /* @__PURE__ */ new Map();
      for (let s = 0; s < o.length; s++) {
        const a = o[s];
        Ln.set(cr(a), a);
      }
    } else Ln = null;
  }
  const t = cr(e);
  let n = Ln?.get(t);
  if (n) return { identifier: n, primaryIdentifier: n };
  try {
    n = ga(e).resolvedOptions().timeZone;
  } catch {
    return;
  }
  if (t === "antarctica/south_pole" && (n = "Antarctica/McMurdo"), eu.has(e)) throw new RangeError(`${e} is a legacy time zone identifier from ICU. Use ${n} instead`);
  const r = [...t].map(((o, s) => s === 0 || su[t[s - 1]] ? o.toUpperCase() : o)).join("").split("/");
  if (r.length === 1) return t === "gb-eire" ? { identifier: "GB-Eire", primaryIdentifier: n } : { identifier: t.length <= 3 || /[-0-9]/.test(t) ? t.toUpperCase() : r[0], primaryIdentifier: n };
  if (r[0] === "Etc") return { identifier: `Etc/${["Zulu", "Greenwich", "Universal"].includes(r[1]) ? r[1] : r[1].toUpperCase()}`, primaryIdentifier: n };
  if (r[0] === "Us") return { identifier: `US/${r[1]}`, primaryIdentifier: n };
  const i = /* @__PURE__ */ new Map([["Act", "ACT"], ["Lhi", "LHI"], ["Nsw", "NSW"], ["Dar_Es_Salaam", "Dar_es_Salaam"], ["Port_Of_Spain", "Port_of_Spain"], ["Port-Au-Prince", "Port-au-Prince"], ["Isle_Of_Man", "Isle_of_Man"], ["Comodrivadavia", "ComodRivadavia"], ["Knox_In", "Knox_IN"], ["Dumontdurville", "DumontDUrville"], ["Mcmurdo", "McMurdo"], ["Denoronha", "DeNoronha"], ["Easterisland", "EasterIsland"], ["Bajanorte", "BajaNorte"], ["Bajasur", "BajaSur"]]);
  return r[1] = i.get(r[1]) ?? r[1], r.length > 2 && (r[2] = i.get(r[2]) ?? r[2]), { identifier: r.join("/"), primaryIdentifier: n };
}
function Fe(e, t) {
  const { year: n, month: r, day: i, hour: o, minute: s, second: a } = Oa(e, t);
  let c = t % 1e3;
  return c < 0 && (c += 1e3), 1e6 * (To({ isoDate: { year: n, month: r, day: i }, time: { hour: o, minute: s, second: a, millisecond: c } }) - t);
}
function Vi(e, t) {
  return Fe(e, Ht(t, "floor"));
}
function _o(e) {
  const t = e < 0 ? "-" : "+", n = Math.abs(e);
  return `${t}${bi(Math.floor(n / 60), n % 60, 0, 0, "minute")}`;
}
function Ra(e) {
  return _o(Ne(e, Kc, "halfExpand") / 6e10);
}
function To({ isoDate: { year: e, month: t, day: n }, time: { hour: r, minute: i, second: o, millisecond: s } }) {
  const a = e % 400, c = (e - a) / 400, u = /* @__PURE__ */ new Date();
  return u.setUTCHours(r, i, o, s), u.setUTCFullYear(a, t - 1, n), u.getTime() + Jc * c;
}
function it(e) {
  const t = To(e), n = 1e3 * e.time.microsecond + e.time.nanosecond;
  return f.add(oe(t), f.BigInt(n));
}
function La(e) {
  let t = Ht(e, "trunc"), n = f.toNumber(f.remainder(e, pr));
  n < 0 && (n += 1e6, t -= 1);
  const r = Math.floor(n / 1e3) % 1e3, i = n % 1e3, o = new Date(t);
  return { epochMilliseconds: t, isoDate: { year: o.getUTCFullYear(), month: o.getUTCMonth() + 1, day: o.getUTCDate() }, time: { hour: o.getUTCHours(), minute: o.getUTCMinutes(), second: o.getUTCSeconds(), millisecond: o.getUTCMilliseconds(), microsecond: r, nanosecond: i } };
}
function Mo(e, t) {
  if (e === "UTC") return null;
  const n = Ht(t, "floor");
  if (n < Vn) return Mo(e, oe(Vn));
  const r = Date.now(), i = Math.max(n, r) + 366 * Oe * 3;
  let o = n, s = Fe(e, o), a = o, c = s;
  for (; s === c && o < i; ) {
    if (a = o + 2 * Oe * 7, a > ma) return null;
    c = Fe(e, a), s === c && (o = a);
  }
  return s === c ? null : oe(Za(((u) => Fe(e, u)), o, a, s, c));
}
function Ki(e, t) {
  if (e === "UTC") return null;
  const n = Ht(t, "ceil"), r = Date.now(), i = r + 366 * Oe * 3;
  if (n > i) {
    const u = Ki(e, oe(i));
    if (u === null || f.lessThan(u, oe(r))) return u;
  }
  if (e === "Africa/Casablanca" || e === "Africa/El_Aaiun") {
    const u = Date.UTC(2088, 0, 1);
    if (u < n) return Ki(e, oe(u));
  }
  let o = n - 1;
  if (o < Vn) return null;
  let s = Fe(e, o), a = o, c = s;
  for (; s === c && o > Vn; ) {
    if (a = o - 2 * Oe * 7, a < Vn) return null;
    c = Fe(e, a), s === c && (o = a);
  }
  return s === c ? null : oe(Za(((u) => Fe(e, u)), a, o, c, s));
}
function Oa(e, t) {
  return (function(n) {
    const r = n.split(/[^\w]+/);
    if (r.length !== 7) throw new RangeError(`expected 7 parts in "${n}`);
    const i = +r[0], o = +r[1];
    let s = +r[2];
    const a = r[3];
    if (a[0] === "b" || a[0] === "B") s = 1 - s;
    else if (a[0] !== "a" && a[0] !== "A") throw new RangeError(`Unknown era ${a} in "${n}`);
    const c = r[4] === "24" ? 0 : +r[4], u = +r[5], l = +r[6];
    if (!(Number.isFinite(s) && Number.isFinite(i) && Number.isFinite(o) && Number.isFinite(c) && Number.isFinite(u) && Number.isFinite(l))) throw new RangeError(`Invalid number in "${n}`);
    return { year: s, month: i, day: o, hour: c, minute: u, second: l };
  })(ga(e).format(t));
}
function Br(e) {
  return e !== void 0 && !(e % 4 != 0 || e % 100 == 0 && e % 400 != 0);
}
function He(e, t) {
  return { standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] }[Br(e) ? "leapyear" : "standard"][t - 1];
}
function Jr(e) {
  const t = [m(e, dt), m(e, ft), m(e, Dt), m(e, mt), m(e, gt), m(e, pt), m(e, yt), m(e, wt), m(e, vt), m(e, Ct)];
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    if (r !== 0) return r < 0 ? -1 : 1;
  }
  return 0;
}
function _i(e) {
  const t = ["years", "months", "weeks", "days"];
  for (let n = 0; n < t.length; n++) {
    const r = e[t[n]];
    if (r !== 0) return r < 0 ? -1 : 1;
  }
  return 0;
}
function Ya(e) {
  const t = _i(e.date);
  return t !== 0 ? t : e.time.sign();
}
function je(e, t) {
  let n = e, r = t;
  if (!Number.isFinite(n) || !Number.isFinite(r)) throw new RangeError("infinity is out of range");
  return r -= 1, n += Math.floor(r / 12), r %= 12, r < 0 && (r += 12), r += 1, { year: n, month: r };
}
function Nt(e, t, n) {
  let r = e, i = t, o = n;
  if (!Number.isFinite(o)) throw new RangeError("infinity is out of range");
  ({ year: r, month: i } = je(r, i));
  const s = 146097;
  if (Math.abs(o) > s) {
    const u = Math.trunc(o / s);
    r += 400 * u, o -= u * s;
  }
  let a = 0, c = i > 2 ? r : r - 1;
  for (; a = Br(c) ? 366 : 365, o < -a; ) r -= 1, c -= 1, o += a;
  for (c += 1; a = Br(c) ? 366 : 365, o > a; ) r += 1, c += 1, o -= a;
  for (; o < 1; ) ({ year: r, month: i } = je(r, i - 1)), o += He(r, i);
  for (; o > He(r, i); ) o -= He(r, i), { year: r, month: i } = je(r, i + 1);
  return { year: r, month: i, day: o };
}
function ar(e, t, n, r, i, o, s, a, c) {
  const u = Ae(r, i, o, s, a, c);
  return P(Nt(e, t, n + u.deltaDays), u);
}
function Ae(e, t, n, r, i, o) {
  let s, a = e, c = t, u = n, l = r, h = i, d = o;
  ({ div: s, mod: d } = ln(d, 3)), h += s, d < 0 && (h -= 1, d += 1e3), { div: s, mod: h } = ln(h, 3), l += s, h < 0 && (l -= 1, h += 1e3), u += Math.trunc(l / 1e3), l %= 1e3, l < 0 && (u -= 1, l += 1e3), c += Math.trunc(u / 60), u %= 60, u < 0 && (c -= 1, u += 60), a += Math.trunc(c / 60), c %= 60, c < 0 && (a -= 1, c += 60);
  let g = Math.trunc(a / 24);
  return a %= 24, a < 0 && (g -= 1, a += 24), g += 0, a += 0, c += 0, u += 0, l += 0, h += 0, d += 0, { deltaDays: g, hour: a, minute: c, second: u, millisecond: l, microsecond: h, nanosecond: d };
}
function ls(e, t) {
  const n = at(e, 0);
  if (_i(n) === 0) return e.days;
  const r = m(t, A), i = Yt(m(t, M), r, n, "constrain"), o = Ge(r.year, r.month - 1, r.day), s = Ge(i.year, i.month - 1, i.day) - o;
  return e.days + s;
}
function Rt(e) {
  return new (ot("%Temporal.Duration%"))(-m(e, dt), -m(e, ft), -m(e, Dt), -m(e, mt), -m(e, gt), -m(e, pt), -m(e, yt), -m(e, wt), -m(e, vt), -m(e, Ct));
}
function bt(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function Ia(e, t, n) {
  const r = bt(t, 1, 12);
  return { year: e, month: r, day: bt(n, 1, He(e, r)) };
}
function et(e, t, n) {
  if (e < t || e > n) throw new RangeError(`value out of range: ${t} <= ${e} <= ${n}`);
}
function Xe(e, t, n) {
  et(t, 1, 12), et(n, 1, He(e, t));
}
function tn(e) {
  We(P(e, { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }));
}
function Ti(e, t, n, r, i, o) {
  et(e, 0, 23), et(t, 0, 59), et(n, 0, 59), et(r, 0, 999), et(i, 0, 999), et(o, 0, 999);
}
function Eo(e, t, n, r, i, o, s, a, c) {
  Xe(e, t, n), Ti(r, i, o, s, a, c);
}
function We(e) {
  const t = it(e);
  (f.lessThan(t, Qc) || f.greaterThan(t, Bc)) && ue(t);
}
function Qi(e) {
  it(e);
}
function ue(e) {
  if (f.lessThan(e, nr) || f.greaterThan(e, yn)) throw new RangeError("date/time value is outside of supported range");
}
function xo({ year: e, month: t }) {
  et(e, Ko, Qo), e === Ko ? et(t, 4, 12) : e === Qo && et(t, 1, 9);
}
function Mi(e, t, n, r, i, o, s, a, c, u) {
  let l = 0;
  const h = [e, t, n, r, i, o, s, a, c, u];
  for (let v = 0; v < h.length; v++) {
    const _ = h[v];
    if (_ === 1 / 0 || _ === -1 / 0) throw new RangeError("infinite values not allowed as duration fields");
    if (_ !== 0) {
      const T = _ < 0 ? -1 : 1;
      if (l !== 0 && T !== l) throw new RangeError("mixed-sign values not allowed as duration fields");
      l = T;
    }
  }
  if (Math.abs(e) >= 2 ** 32 || Math.abs(t) >= 2 ** 32 || Math.abs(n) >= 2 ** 32) throw new RangeError("years, months, and weeks must be < 2³²");
  const d = ln(a, 3), g = ln(c, 6), p = ln(u, 9), w = ln(1e6 * d.mod + 1e3 * g.mod + p.mod, 9).div, y = 86400 * r + 3600 * i + 60 * o + s + d.div + g.div + p.div + w;
  if (!Number.isSafeInteger(y)) throw new RangeError("total of duration time units cannot exceed 9007199254740991.999999999 s");
}
function un(e) {
  return { date: { years: m(e, dt), months: m(e, ft), weeks: m(e, Dt), days: m(e, mt) }, time: O.fromComponents(m(e, gt), m(e, pt), m(e, yt), m(e, wt), m(e, vt), m(e, Ct)) };
}
function ie(e) {
  const t = O.fromComponents(m(e, gt), m(e, pt), m(e, yt), m(e, wt), m(e, vt), m(e, Ct)).add24HourDays(m(e, mt));
  return { date: { years: m(e, dt), months: m(e, ft), weeks: m(e, Dt), days: 0 }, time: t };
}
function Pa(e) {
  const t = ie(e), n = Math.trunc(t.time.sec / 86400);
  return Mi(t.date.years, t.date.months, t.date.weeks, n, 0, 0, 0, 0, 0, 0), { ...t.date, days: n };
}
function zt(e, t) {
  const n = e.time.sign();
  let r = e.time.abs().subsec, i = 0, o = 0, s = e.time.abs().sec, a = 0, c = 0, u = 0;
  switch (t) {
    case "year":
    case "month":
    case "week":
    case "day":
      i = Math.trunc(r / 1e3), r %= 1e3, o = Math.trunc(i / 1e3), i %= 1e3, s += Math.trunc(o / 1e3), o %= 1e3, a = Math.trunc(s / 60), s %= 60, c = Math.trunc(a / 60), a %= 60, u = Math.trunc(c / 24), c %= 24;
      break;
    case "hour":
      i = Math.trunc(r / 1e3), r %= 1e3, o = Math.trunc(i / 1e3), i %= 1e3, s += Math.trunc(o / 1e3), o %= 1e3, a = Math.trunc(s / 60), s %= 60, c = Math.trunc(a / 60), a %= 60;
      break;
    case "minute":
      i = Math.trunc(r / 1e3), r %= 1e3, o = Math.trunc(i / 1e3), i %= 1e3, s += Math.trunc(o / 1e3), o %= 1e3, a = Math.trunc(s / 60), s %= 60;
      break;
    case "second":
      i = Math.trunc(r / 1e3), r %= 1e3, o = Math.trunc(i / 1e3), i %= 1e3, s += Math.trunc(o / 1e3), o %= 1e3;
      break;
    case "millisecond":
      i = Math.trunc(r / 1e3), r %= 1e3, o = ki(s, 3, Math.trunc(i / 1e3)), i %= 1e3, s = 0;
      break;
    case "microsecond":
      i = ki(s, 6, Math.trunc(r / 1e3)), r %= 1e3, s = 0;
      break;
    case "nanosecond":
      r = ki(s, 9, r), s = 0;
  }
  return new (ot("%Temporal.Duration%"))(e.date.years, e.date.months, e.date.weeks, e.date.days + n * u, n * c, n * a, n * s, n * o, n * i, n * r);
}
function _e(e, t) {
  return _i(e), t.sign(), { date: e, time: t };
}
function Ge(e, t, n) {
  return To({ isoDate: { year: e, month: t + 1, day: n }, time: { hour: 0, minute: 0, second: 0, millisecond: 0 } }) / Oe;
}
function mn({ year: e, month: t, day: n }) {
  if (Math.abs(Ge(e, t - 1, n)) > 1e8) throw new RangeError("date/time value is outside the supported range");
}
function Do(e, t) {
  const n = t.hour - e.hour, r = t.minute - e.minute, i = t.second - e.second, o = t.millisecond - e.millisecond, s = t.microsecond - e.microsecond, a = t.nanosecond - e.nanosecond;
  return O.fromComponents(n, r, i, o, s, a);
}
function Co(e, t, n, r, i) {
  let o = O.fromEpochNsDiff(t, e);
  return o = ti(o, n, r, i), _e({ years: 0, months: 0, weeks: 0, days: 0 }, o);
}
function Sa(e, t, n, r) {
  Qi(e), Qi(t);
  let i = Do(e.time, t.time);
  const o = i.sign(), s = le(e.isoDate, t.isoDate);
  let a = t.isoDate;
  s === o && (a = Nt(a.year, a.month, a.day + o), i = i.add24HourDays(-o));
  const c = be("day", r), u = Er(n, e.isoDate, a, c);
  return r !== c && (i = i.add24HourDays(u.days), u.days = 0), _e(u, i);
}
function za(e, t, n, r, i) {
  const o = f.subtract(t, e);
  if (f.equal(o, Ot)) return { date: { years: 0, months: 0, weeks: 0, days: 0 }, time: O.ZERO };
  const s = f.lessThan(o, Ot) ? -1 : 1, a = Ft(n, e), c = Ft(n, t);
  let u, l = 0, h = s === 1 ? 2 : 1, d = Do(a.time, c.time);
  for (d.sign() === -s && l++; l <= h; l++) {
    u = P(Nt(c.isoDate.year, c.isoDate.month, c.isoDate.day - l * s), a.time);
    const p = ct(n, u, "compatible");
    if (d = O.fromEpochNsDiff(t, p), d.sign() !== -s) break;
  }
  const g = be("day", i);
  return _e(Er(r, a.isoDate, u.isoDate, g), d);
}
function ja(e, t, n, r, i, o, s, a, c) {
  let u, l, h, d, g = t;
  switch (a) {
    case "year": {
      const Y = Ne(g.date.years, s, "trunc");
      u = Y, l = Y + s * e, h = { years: u, months: 0, weeks: 0, days: 0 }, d = { ...h, years: l };
      break;
    }
    case "month": {
      const Y = Ne(g.date.months, s, "trunc");
      u = Y, l = Y + s * e, h = at(g.date, 0, 0, u), d = at(g.date, 0, 0, l);
      break;
    }
    case "week": {
      const Y = at(g.date, 0, 0), z = Yt(o, r.isoDate, Y, "constrain"), Q = Er(o, z, Nt(z.year, z.month, z.day + g.date.days), "week"), Zt = Ne(g.date.weeks + Q.weeks, s, "trunc");
      u = Zt, l = Zt + s * e, h = at(g.date, 0, u), d = at(g.date, 0, l);
      break;
    }
    case "day": {
      const Y = Ne(g.date.days, s, "trunc");
      u = Y, l = Y + s * e, h = at(g.date, u), d = at(g.date, l);
      break;
    }
  }
  const p = Yt(o, r.isoDate, h, "constrain"), w = Yt(o, r.isoDate, d, "constrain");
  let y, v;
  const _ = P(p, r.time), T = P(w, r.time);
  i ? (y = ct(i, _, "compatible"), v = ct(i, T, "compatible")) : (y = it(_), v = it(T));
  const x = O.fromEpochNsDiff(n, y), E = O.fromEpochNsDiff(v, y), N = mi(c, e < 0 ? "negative" : "positive"), F = x.add(x).abs().subtract(E.abs()).sign(), U = Math.abs(u) / s % 2 == 0, j = x.isZero() ? Math.abs(u) : x.cmp(E) ? gi(Math.abs(u), Math.abs(l), F, U, N) : Math.abs(l), H = new O(f.add(f.multiply(E.totalNs, f.BigInt(u)), f.multiply(x.totalNs, f.BigInt(s * e)))).fdiv(E.totalNs), C = j === Math.abs(l);
  return g = { date: C ? d : h, time: O.ZERO }, { nudgeResult: { duration: g, nudgedEpochNs: C ? v : y, didExpandCalendarUnit: C }, total: H };
}
function Ei(e, t, n, r, i, o, s, a, c) {
  let u = e;
  const l = ee(a) || r && a === "day", h = Ya(u) < 0 ? -1 : 1;
  let d;
  return l ? { nudgeResult: d } = ja(h, u, t, n, r, i, s, a, c) : d = r ? (function(g, p, w, y, v, _, T, x) {
    let E = p;
    const N = Yt(v, w.isoDate, E.date, "constrain"), F = P(N, w.time), U = P(Nt(N.year, N.month, N.day + g), w.time), j = ct(y, F, "compatible"), H = ct(y, U, "compatible"), C = O.fromEpochNsDiff(H, j);
    if (C.sign() !== g) throw new RangeError("time zone returned inconsistent Instants");
    const Y = f.BigInt(vn[T] * _);
    let z = E.time.round(Y, x);
    const Q = z.subtract(C), Zt = Q.sign() !== -g;
    let qt, Xt;
    return Zt ? (qt = g, z = Q.round(Y, x), Xt = z.addToEpochNs(H)) : (qt = 0, Xt = z.addToEpochNs(j)), { duration: _e(at(E.date, E.date.days + qt), z), nudgedEpochNs: Xt, didExpandCalendarUnit: Zt };
  })(h, u, n, r, i, s, a, c) : (function(g, p, w, y, v, _) {
    let T = g;
    const x = T.time.add24HourDays(T.date.days), E = x.round(f.BigInt(y * vn[v]), _), N = E.subtract(x), { quotient: F } = x.divmod(Wr), { quotient: U } = E.divmod(Wr), j = Math.sign(U - F) === x.sign(), H = N.addToEpochNs(p);
    let C = 0, Y = E;
    return ye(w) === "date" && (C = U, Y = E.add(O.fromComponents(24 * -U, 0, 0, 0, 0, 0))), { duration: { date: at(T.date, C), time: Y }, nudgedEpochNs: H, didExpandCalendarUnit: j };
  })(u, t, o, s, a, c), u = d.duration, d.didExpandCalendarUnit && a !== "week" && (u = (function(g, p, w, y, v, _, T, x) {
    let E = p;
    if (x === T) return E;
    const N = Kn.indexOf(T);
    for (let F = Kn.indexOf(x) - 1; F >= N; F--) {
      const U = Kn[F];
      if (U === "week" && T !== "week") continue;
      let j;
      switch (U) {
        case "year":
          j = { years: E.date.years + g, months: 0, weeks: 0, days: 0 };
          break;
        case "month": {
          const Y = E.date.months + g;
          j = at(E.date, 0, 0, Y);
          break;
        }
        case "week": {
          const Y = E.date.weeks + g;
          j = at(E.date, 0, Y);
          break;
        }
      }
      const H = P(Yt(_, y.isoDate, j, "constrain"), y.time);
      let C;
      if (C = v ? ct(v, H, "compatible") : it(H), qr(w, C) === -g) break;
      E = { date: j, time: O.ZERO };
    }
    return E;
  })(h, u, d.nudgedEpochNs, n, r, i, o, be(a, "day"))), u;
}
function hs(e, t, n, r, i, o) {
  return ee(o) || r && o === "day" ? ja(Ya(e) < 0 ? -1 : 1, e, t, n, r, i, 1, o, "trunc").total : Jn(e.time.add24HourDays(e.date.days), o);
}
function Ua(e, t, n, r, i, o, s) {
  if (_n(e, t) == 0) return { date: { years: 0, months: 0, weeks: 0, days: 0 }, time: O.ZERO };
  We(e), We(t);
  const a = Sa(e, t, n, r);
  return o === "nanosecond" && i === 1 ? a : Ei(a, it(t), e, null, n, r, i, o, s);
}
function Fa(e, t, n, r, i, o, s, a) {
  if (ye(i) === "time") return Co(e, t, o, s, a);
  const c = za(e, t, n, r, i);
  return s === "nanosecond" && o === 1 ? c : Ei(c, t, Ft(n, e), n, r, i, o, s, a);
}
function Nn(e, t, n, r, i, o) {
  const s = wn.reduce(((g, p) => {
    const w = p[0], y = p[1], v = p[2];
    return n !== "datetime" && v !== n || r.includes(y) || g.push(y, w), g;
  }), []);
  let a = At(t, "largestUnit", n, "auto");
  if (r.includes(a)) throw new RangeError(`largestUnit must be one of ${s.join(", ")}, not ${a}`);
  const c = $n(t);
  let u = Qt(t, "trunc");
  e === "since" && (u = (function(g) {
    switch (g) {
      case "ceil":
        return "floor";
      case "floor":
        return "ceil";
      case "halfCeil":
        return "halfFloor";
      case "halfFloor":
        return "halfCeil";
      default:
        return g;
    }
  })(u));
  const l = At(t, "smallestUnit", n, i);
  if (r.includes(l)) throw new RangeError(`smallestUnit must be one of ${s.join(", ")}, not ${l}`);
  const h = be(o, l);
  if (a === "auto" && (a = h), be(a, l) !== a) throw new RangeError(`largestUnit ${a} cannot be smaller than smallestUnit ${l}`);
  const d = { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[l];
  return d !== void 0 && An(c, d, !1), { largestUnit: a, roundingIncrement: c, roundingMode: u, smallestUnit: l };
}
function ds(e, t, n, r) {
  const i = Un(n), o = Nn(e, D(r), "time", [], "nanosecond", "second");
  let s = zt(Co(m(t, $), m(i, $), o.roundingIncrement, o.smallestUnit, o.roundingMode), o.largestUnit);
  return e === "since" && (s = Rt(s)), s;
}
function fs(e, t, n, r) {
  const i = zn(n), o = m(t, M), s = m(i, M);
  if (!ce(o, s)) throw new RangeError(`cannot compute difference between dates of ${o} and ${s} calendars`);
  const a = Nn(e, D(r), "date", [], "day", "day"), c = ot("%Temporal.Duration%"), u = m(t, A), l = m(i, A);
  if (le(u, l) === 0) return new c();
  let h = { date: Er(o, u, l, a.largestUnit), time: O.ZERO };
  if (a.smallestUnit !== "day" || a.roundingIncrement !== 1) {
    const g = P(u, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    h = Ei(h, it(P(l, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 })), g, null, o, a.largestUnit, a.roundingIncrement, a.smallestUnit, a.roundingMode);
  }
  let d = zt(h, "day");
  return e === "since" && (d = Rt(d)), d;
}
function ms(e, t, n, r) {
  const i = jn(n), o = m(t, M), s = m(i, M);
  if (!ce(o, s)) throw new RangeError(`cannot compute difference between dates of ${o} and ${s} calendars`);
  const a = Nn(e, D(r), "datetime", [], "nanosecond", "day"), c = ot("%Temporal.Duration%"), u = m(t, q), l = m(i, q);
  if (_n(u, l) === 0) return new c();
  let h = zt(Ua(u, l, o, a.largestUnit, a.roundingIncrement, a.smallestUnit, a.roundingMode), a.largestUnit);
  return e === "since" && (h = Rt(h)), h;
}
function gs(e, t, n, r) {
  const i = ke(n), o = Nn(e, D(r), "time", [], "nanosecond", "hour");
  let s = Do(m(t, G), m(i, G));
  s = ti(s, o.roundingIncrement, o.smallestUnit, o.roundingMode);
  let a = zt(_e({ years: 0, months: 0, weeks: 0, days: 0 }, s), o.largestUnit);
  return e === "since" && (a = Rt(a)), a;
}
function ps(e, t, n, r) {
  const i = Fn(n), o = m(t, M), s = m(i, M);
  if (!ce(o, s)) throw new RangeError(`cannot compute difference between months of ${o} and ${s} calendars`);
  const a = Nn(e, D(r), "date", ["week", "day"], "month", "year"), c = ot("%Temporal.Duration%");
  if (le(m(t, A), m(i, A)) == 0) return new c();
  const u = Mt(o, m(t, A), "year-month");
  u.day = 1;
  const l = Ye(o, u, "constrain"), h = Mt(o, m(i, A), "year-month");
  h.day = 1;
  const d = Ye(o, h, "constrain");
  let g = { date: at(Er(o, l, d, a.largestUnit), 0, 0), time: O.ZERO };
  if (a.smallestUnit !== "month" || a.roundingIncrement !== 1) {
    const w = P(l, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    g = Ei(g, it(P(d, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 })), w, null, o, a.largestUnit, a.roundingIncrement, a.smallestUnit, a.roundingMode);
  }
  let p = zt(g, "day");
  return e === "since" && (p = Rt(p)), p;
}
function ys(e, t, n, r) {
  const i = Hn(n), o = m(t, M), s = m(i, M);
  if (!ce(o, s)) throw new RangeError(`cannot compute difference between dates of ${o} and ${s} calendars`);
  const a = Nn(e, D(r), "datetime", [], "nanosecond", "hour"), c = m(t, $), u = m(i, $), l = ot("%Temporal.Duration%");
  let h;
  if (ye(a.largestUnit) !== "date") h = zt(Co(c, u, a.roundingIncrement, a.smallestUnit, a.roundingMode), a.largestUnit);
  else {
    const d = m(t, S);
    if (!Aa(d, m(i, S))) throw new RangeError("When calculating difference between time zones, largestUnit must be 'hours' or smaller because day lengths can vary between time zones due to DST or time zone offset changes.");
    if (f.equal(c, u)) return new l();
    h = zt(Fa(c, u, d, o, a.largestUnit, a.roundingIncrement, a.smallestUnit, a.roundingMode), "hour");
  }
  return e === "since" && (h = Rt(h)), h;
}
function bn({ hour: e, minute: t, second: n, millisecond: r, microsecond: i, nanosecond: o }, s) {
  let a = n, c = o;
  return a += s.sec, c += s.subsec, Ae(e, t, a, r, i, c);
}
function Bi(e, t) {
  const n = t.addToEpochNs(e);
  return ue(n), n;
}
function Zn(e, t, n, r, i = "constrain") {
  if (_i(r.date) === 0) return Bi(e, r.time);
  const o = Ft(t, e);
  return Bi(ct(t, P(Yt(n, o.isoDate, r.date, i), o.time), "compatible"), r.time);
}
function ws(e, t, n) {
  let r = Ut(n);
  e === "subtract" && (r = Rt(r));
  const i = be(pe(t), pe(r));
  if (ee(i)) throw new RangeError("For years, months, or weeks arithmetic, use date arithmetic relative to a starting point");
  const o = ie(t), s = ie(r);
  return zt(_e({ years: 0, months: 0, weeks: 0, days: 0 }, o.time.add(s.time)), i);
}
function vs(e, t, n) {
  let r = Ut(n);
  e === "subtract" && (r = Rt(r));
  const i = pe(r);
  if (ye(i) === "date") throw new RangeError(`Duration field ${i} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`);
  const o = ie(r);
  return re(Bi(m(t, $), o.time));
}
function bs(e, t, n, r) {
  const i = m(t, M);
  let o = Ut(n);
  e === "subtract" && (o = Rt(o));
  const s = Pa(o), a = I(D(r));
  return _t(Yt(i, m(t, A), s, a), i);
}
function _s(e, t, n, r) {
  let i = Ut(n);
  e === "subtract" && (i = Rt(i));
  const o = I(D(r)), s = m(t, M), a = ie(i), c = m(t, q), u = bn(c.time, a.time), l = at(a.date, u.deltaDays);
  return Mi(l.years, l.months, l.weeks, l.days, 0, 0, 0, 0, 0, 0), St(P(Yt(s, c.isoDate, l, o), u), s);
}
function Ts(e, t, n) {
  let r = Ut(n);
  e === "subtract" && (r = Rt(r));
  const i = ie(r), { hour: o, minute: s, second: a, millisecond: c, microsecond: u, nanosecond: l } = bn(m(t, G), i.time);
  return we(vi(o, s, a, c, u, l, "reject"));
}
function Ms(e, t, n, r) {
  let i = Ut(n);
  e === "subtract" && (i = Rt(i));
  const o = I(D(r)), s = Jr(i), a = m(t, M), c = Mt(a, m(t, A), "year-month");
  c.day = 1;
  let u = Ye(a, c, "constrain");
  if (s < 0) {
    const h = Yt(a, u, { months: 1 }, "constrain");
    u = Nt(h.year, h.month, h.day - 1);
  }
  const l = Pa(i);
  return tn(u), fn(ir(a, Mt(a, Yt(a, u, l, o), "year-month"), o), a);
}
function Es(e, t, n, r) {
  let i = Ut(n);
  e === "subtract" && (i = Rt(i));
  const o = I(D(r)), s = m(t, S), a = m(t, M), c = un(i);
  return st(Zn(m(t, $), s, a, c, o), s, a);
}
function Ne(e, t, n) {
  const r = Math.trunc(e / t), i = e % t, o = e < 0 ? "negative" : "positive", s = Math.abs(r), a = s + 1, c = $t(Math.abs(2 * i) - t), u = s % 2 == 0, l = mi(n, o), h = i === 0 ? s : gi(s, a, c, u, l);
  return t * (o === "positive" ? h : -h);
}
function Ji(e, t, n, r) {
  const i = vn[n] * t;
  return (function(o, s, a) {
    const c = ge(o), u = ge(s), l = f.divide(c, u), h = f.remainder(c, u), d = mi(a, "positive");
    let g, p;
    f.lessThan(c, Ot) ? (g = f.subtract(l, er), p = l) : (g = l, p = f.add(l, er));
    const w = qr(Se(f.multiply(h, wo)), u) * (f.lessThan(c, Ot) ? -1 : 1) + 0, y = f.equal(h, Ot) ? l : gi(g, p, w, Bs(g), d);
    return f.multiply(y, u);
  })(e, f.BigInt(i), r);
}
function to(e, t, n, r) {
  Qi(e);
  const { year: i, month: o, day: s } = e.isoDate, a = eo(e.time, t, n, r);
  return P(Nt(i, o, s + a.deltaDays), a);
}
function eo({ hour: e, minute: t, second: n, millisecond: r, microsecond: i, nanosecond: o }, s, a, c) {
  let u;
  switch (a) {
    case "day":
    case "hour":
      u = 1e3 * (1e3 * (1e3 * (60 * (60 * e + t) + n) + r) + i) + o;
      break;
    case "minute":
      u = 1e3 * (1e3 * (1e3 * (60 * t + n) + r) + i) + o;
      break;
    case "second":
      u = 1e3 * (1e3 * (1e3 * n + r) + i) + o;
      break;
    case "millisecond":
      u = 1e3 * (1e3 * r + i) + o;
      break;
    case "microsecond":
      u = 1e3 * i + o;
      break;
    case "nanosecond":
      u = o;
  }
  const l = vn[a], h = Ne(u, l * s, c) / l;
  switch (a) {
    case "day":
      return { deltaDays: h, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
    case "hour":
      return Ae(h, 0, 0, 0, 0, 0);
    case "minute":
      return Ae(e, h, 0, 0, 0, 0);
    case "second":
      return Ae(e, t, h, 0, 0, 0);
    case "millisecond":
      return Ae(e, t, n, h, 0, 0);
    case "microsecond":
      return Ae(e, t, n, r, h, 0);
    case "nanosecond":
      return Ae(e, t, n, r, i, h);
    default:
      throw new Error(`Invalid unit ${a}`);
  }
}
function ti(e, t, n, r) {
  const i = vn[n];
  return e.round(f.BigInt(i * t), r);
}
function Jn(e, t) {
  const n = vn[t];
  return e.fdiv(f.BigInt(n));
}
function le(e, t) {
  return e.year !== t.year ? $t(e.year - t.year) : e.month !== t.month ? $t(e.month - t.month) : e.day !== t.day ? $t(e.day - t.day) : 0;
}
function no(e, t) {
  return e.hour !== t.hour ? $t(e.hour - t.hour) : e.minute !== t.minute ? $t(e.minute - t.minute) : e.second !== t.second ? $t(e.second - t.second) : e.millisecond !== t.millisecond ? $t(e.millisecond - t.millisecond) : e.microsecond !== t.microsecond ? $t(e.microsecond - t.microsecond) : e.nanosecond !== t.nanosecond ? $t(e.nanosecond - t.nanosecond) : 0;
}
function _n(e, t) {
  const n = le(e.isoDate, t.isoDate);
  return n !== 0 ? n : no(e.time, t.time);
}
function Ha(e) {
  const t = ei(e);
  return globalThis.BigInt !== void 0 ? globalThis.BigInt(t.toString(10)) : t;
}
function Ht(e, t) {
  const n = ge(e), { quotient: r, remainder: i } = Pn(n, pr);
  let o = f.toNumber(r);
  return t === "floor" && f.toNumber(i) < 0 && (o -= 1), t === "ceil" && f.toNumber(i) > 0 && (o += 1), o;
}
function oe(e) {
  if (!Number.isInteger(e)) throw new RangeError("epoch milliseconds must be an integer");
  return f.multiply(f.BigInt(e), pr);
}
function ei(e) {
  let t = e;
  if (typeof e == "object") {
    const n = e[Symbol.toPrimitive];
    n && typeof n == "function" && (t = n.call(e, "number"));
  }
  if (typeof t == "number") throw new TypeError("cannot convert number to bigint");
  return typeof t == "bigint" ? f.BigInt(t.toString(10)) : f.BigInt(t);
}
const ro = (() => {
  let e = f.BigInt(Date.now() % 1e6);
  return () => {
    const t = Date.now(), n = f.BigInt(t), r = f.add(oe(t), e);
    return e = f.remainder(n, pr), f.greaterThan(r, yn) ? yn : f.lessThan(r, nr) ? nr : r;
  };
})();
function On() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function $t(e) {
  return e < 0 ? -1 : e > 0 ? 1 : e;
}
function D(e) {
  if (e === void 0) return /* @__PURE__ */ Object.create(null);
  if (V(e) && e !== null) return e;
  throw new TypeError("Options parameter must be an object, not " + (e === null ? "null" : typeof e));
}
function Ve(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  return n[e] = t, n;
}
function Te(e, t, n, r) {
  let i = e[t];
  if (i !== void 0) {
    if (i = yi(i), !n.includes(i)) throw new RangeError(`${t} must be one of ${n.join(", ")}, not ${i}`);
    return i;
  }
  if (r === Ee) throw new RangeError(`${t} option is required`);
  return r;
}
function xt(e) {
  const t = cr(e);
  if (!tu.includes(cr(t))) throw new RangeError(`invalid calendar identifier ${t}`);
  switch (t) {
    case "ethiopic-amete-alem":
      return "ethioaa";
    case "islamicc":
      return "islamic-civil";
  }
  return t;
}
function cr(e) {
  let t = "";
  for (let n = 0; n < e.length; n++) {
    const r = e.charCodeAt(n);
    t += r >= 65 && r <= 90 ? String.fromCharCode(r + 32) : String.fromCharCode(r);
  }
  return t;
}
function Pe(e) {
  throw new TypeError(`Do not use built-in arithmetic operators with Temporal objects. When comparing, use ${e === "PlainMonthDay" ? "Temporal.PlainDate.compare(obj1.toPlainDate(year), obj2.toPlainDate(year))" : `Temporal.${e}.compare(obj1, obj2)`}, not obj1 > obj2. When coercing to strings, use \`\${obj}\` or String(obj), not '' + obj. When coercing to numbers, use properties or methods of the object, not \`+obj\`. When concatenating with strings, use \`\${str}\${obj}\` or str.concat(obj), not str + obj. In React, coerce to a string before rendering a Temporal object.`);
}
const au = new RegExp(`^${da.source}$`), cu = new RegExp(`^${/([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\d{1,9}))?)?)?/.source}$`);
function Za(e, t, n, r = e(t), i = e(n)) {
  let o = t, s = n, a = r, c = i;
  for (; s - o > 1; ) {
    let u = Math.trunc((o + s) / 2);
    const l = e(u);
    l === a ? (o = u, a = l) : l === c && (s = u, c = l);
  }
  return s;
}
function qa(e) {
  return [...e];
}
function Xa(e, t) {
  if (e !== "gregory" && e !== "iso8601") return;
  const n = $r[e];
  let r = t.year;
  const { dayOfWeek: i, dayOfYear: o, daysInYear: s } = n.isoToDate(t, { dayOfWeek: !0, dayOfYear: !0, daysInYear: !0 }), a = n.getFirstDayOfWeek(), c = n.getMinimalDaysInFirstWeek();
  let u = (i + 7 - a) % 7, l = (i - o + 7001 - a) % 7, h = Math.floor((o - 1 + l) / 7);
  if (7 - l >= c && ++h, h == 0) h = (function(d, g, p, w) {
    let y = (w - d - p + 1) % 7;
    y < 0 && (y += 7);
    let v = Math.floor((p + y - 1) / 7);
    return 7 - y >= g && ++v, v;
  })(a, c, o + n.isoToDate(n.dateAdd(t, { years: -1 }, "constrain"), { daysInYear: !0 }).daysInYear, i), r--;
  else if (o >= s - 5) {
    let d = (u + s - o) % 7;
    d < 0 && (d += 7), 6 - d >= c && o + 7 - u > s && (h = 1, r++);
  }
  return { week: h, year: r };
}
function xs(e, t, n, r, i) {
  if (t !== i.year) {
    if (e * (t - i.year) > 0) return !0;
  } else if (n !== i.month) {
    if (e * (n - i.month) > 0) return !0;
  } else if (r !== i.day && e * (r - i.day) > 0) return !0;
  return !1;
}
const $r = {};
function Ke(e) {
  if (!e.startsWith("M")) throw new RangeError(`Invalid month code: ${e}.  Month codes must start with M.`);
  const t = +e.slice(1);
  if (Number.isNaN(t)) throw new RangeError(`Invalid month code: ${e}`);
  return t;
}
function se(e, t = !1) {
  return `M${`${e}`.padStart(2, "0")}${t ? "L" : ""}`;
}
function $o(e, t = void 0, n = 12) {
  let { month: r, monthCode: i } = e;
  if (i === void 0) {
    if (r === void 0) throw new TypeError("Either month or monthCode are required");
    t === "reject" && et(r, 1, n), t === "constrain" && (r = bt(r, 1, n)), i = se(r);
  } else {
    const o = Ke(i);
    if (i !== se(o)) throw new RangeError(`Invalid month code: ${i}`);
    if (r !== void 0 && r !== o) throw new RangeError(`monthCode ${i} and month ${r} must match if both are present`);
    if (r = o, r < 1 || r > n) throw new RangeError(`Invalid monthCode: ${i}`);
  }
  return { ...e, month: r, monthCode: i };
}
$r.iso8601 = { resolveFields(e, t) {
  if ((t === "date" || t === "year-month") && e.year === void 0) throw new TypeError("year is required");
  if ((t === "date" || t === "month-day") && e.day === void 0) throw new TypeError("day is required");
  Object.assign(e, $o(e));
}, dateToISO: (e, t) => Qn(e.year, e.month, e.day, t), monthDayToISOReferenceDate(e, t) {
  const { month: n, day: r } = Qn(e.year ?? 1972, e.month, e.day, t);
  return { month: n, day: r, year: 1972 };
}, extraFields: () => [], fieldKeysToIgnore(e) {
  const t = /* @__PURE__ */ new Set();
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    t.add(r), r === "month" ? t.add("monthCode") : r === "monthCode" && t.add("month");
  }
  return qa(t);
}, dateAdd(e, { years: t = 0, months: n = 0, weeks: r = 0, days: i = 0 }, o) {
  let { year: s, month: a, day: c } = e;
  return s += t, a += n, { year: s, month: a } = je(s, a), { year: s, month: a, day: c } = Qn(s, a, c, o), c += i + 7 * r, Nt(s, a, c);
}, dateUntil(e, t, n) {
  const r = -le(e, t);
  if (r === 0) return { years: 0, months: 0, weeks: 0, days: 0 };
  let i, o = 0, s = 0;
  if (n === "year" || n === "month") {
    let l = t.year - e.year;
    for (l !== 0 && (l -= r); !xs(r, e.year + l, e.month, e.day, t); ) o = l, l += r;
    let h = r;
    for (i = je(e.year + o, e.month + h); !xs(r, i.year, i.month, e.day, t); ) s = h, h += r, i = je(i.year, i.month + r);
    n === "month" && (s += 12 * o, o = 0);
  }
  i = je(e.year + o, e.month + s);
  const a = Ia(i.year, i.month, e.day);
  let c = 0, u = Ge(t.year, t.month - 1, t.day) - Ge(a.year, a.month - 1, a.day);
  return n === "week" && (c = Math.trunc(u / 7), u %= 7), { years: o, months: s, weeks: c, days: u };
}, isoToDate({ year: e, month: t, day: n }, r) {
  const i = { era: void 0, eraYear: void 0, year: e, month: t, day: n, daysInWeek: 7, monthsInYear: 12 };
  if (r.monthCode && (i.monthCode = se(t)), r.dayOfWeek) {
    const o = t + (t < 3 ? 10 : -2), s = e - (t < 3 ? 1 : 0), a = Math.floor(s / 100), c = s - 100 * a, u = (n + Math.floor(2.6 * o - 0.2) + (c + Math.floor(c / 4)) + (Math.floor(a / 4) - 2 * a)) % 7;
    i.dayOfWeek = u + (u <= 0 ? 7 : 0);
  }
  if (r.dayOfYear) {
    let o = n;
    for (let s = t - 1; s > 0; s--) o += He(e, s);
    i.dayOfYear = o;
  }
  return r.weekOfYear && (i.weekOfYear = Xa("iso8601", { year: e, month: t, day: n })), r.daysInMonth && (i.daysInMonth = He(e, t)), (r.daysInYear || r.inLeapYear) && (i.inLeapYear = Br(e), i.daysInYear = i.inLeapYear ? 366 : 365), i;
}, getFirstDayOfWeek: () => 1, getMinimalDaysInFirstWeek: () => 4 };
class tt {
  constructor(t) {
    if (this.map = /* @__PURE__ */ new Map(), this.calls = 0, this.hits = 0, this.misses = 0, t !== void 0) {
      let n = 0;
      for (const r of t.map.entries()) {
        if (++n > tt.MAX_CACHE_ENTRIES) break;
        this.map.set(...r);
      }
    }
  }
  get(t) {
    const n = this.map.get(t);
    return n && (this.hits++, this.report()), this.calls++, n;
  }
  set(t, n) {
    this.map.set(t, n), this.misses++, this.report();
  }
  report() {
  }
  setObject(t) {
    if (tt.objectMap.get(t)) throw new RangeError("object already cached");
    tt.objectMap.set(t, this), this.report();
  }
  static getCacheForObject(t) {
    let n = tt.objectMap.get(t);
    return n || (n = new tt(), tt.objectMap.set(t, n)), n;
  }
}
function Wa({ isoYear: e, isoMonth: t, isoDay: n }) {
  return `${Cr(e)}-${It(t)}-${It(n)}T00:00Z`;
}
function Li(e, t) {
  return { years: e.year - t.year, months: e.month - t.month, days: e.day - t.day };
}
tt.objectMap = /* @__PURE__ */ new WeakMap(), tt.MAX_CACHE_ENTRIES = 1e3;
class en {
  constructor() {
    this.eras = [], this.hasEra = !1, this.erasBeginMidYear = !1;
  }
  getFormatter() {
    return this.formatter === void 0 && (this.formatter = new Intl.DateTimeFormat(`en-US-u-ca-${this.id}`, { day: "numeric", month: "numeric", year: "numeric", era: "short", timeZone: "UTC" })), this.formatter;
  }
  getCalendarParts(t) {
    let n = this.getFormatter(), r = new Date(t);
    if (t === "-271821-04-19T00:00Z") {
      const i = n.resolvedOptions();
      n = new Intl.DateTimeFormat(i.locale, { ...i, timeZone: "Etc/GMT+1" }), r = /* @__PURE__ */ new Date("-271821-04-20T00:00Z");
    }
    try {
      return n.formatToParts(r);
    } catch {
      throw new RangeError(`Invalid ISO date: ${t}`);
    }
  }
  isoToCalendarDate(t, n) {
    const { year: r, month: i, day: o } = t, s = JSON.stringify({ func: "isoToCalendarDate", isoYear: r, isoMonth: i, isoDay: o, id: this.id }), a = n.get(s);
    if (a) return a;
    const c = Wa({ isoYear: r, isoMonth: i, isoDay: o }), u = this.getCalendarParts(c), l = {};
    for (let d = 0; d < u.length; d++) {
      const { type: g, value: p } = u[d];
      if (g !== "year" && g !== "relatedYear" || (this.hasEra ? l.eraYear = +p : l.year = +p), g === "month") {
        const w = /^([0-9]*)(.*?)$/.exec(p);
        if (!w || w.length != 3 || !w[1] && !w[2]) throw new RangeError(`Unexpected month: ${p}`);
        if (l.month = w[1] ? +w[1] : 1, l.month < 1) throw new RangeError(`Invalid month ${p} from ${c}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10527)`);
        if (l.month > 13) throw new RangeError(`Invalid month ${p} from ${c}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
        w[2] && (l.monthExtra = w[2]);
      }
      g === "day" && (l.day = +p), this.hasEra && g === "era" && p != null && p !== "" && (l.era = p.split(" (")[0].normalize("NFD").replace(/[^-0-9 \p{L}]/gu, "").replace(/ /g, "-").toLowerCase());
    }
    if (this.hasEra && l.eraYear === void 0) throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
    if (this.hasEra) {
      const d = this.eras.find(((g) => l.era === g.genericName));
      d && (l.era = d.code);
    }
    if (this.reviseIntlEra) {
      const { era: d, eraYear: g } = this.reviseIntlEra(l, t);
      l.era = d, l.eraYear = g;
    }
    this.checkIcuBugs && this.checkIcuBugs(t);
    const h = this.adjustCalendarDate(l, n, "constrain", !0);
    if (h.year === void 0) throw new RangeError(`Missing year converting ${JSON.stringify(t)}`);
    if (h.month === void 0) throw new RangeError(`Missing month converting ${JSON.stringify(t)}`);
    if (h.day === void 0) throw new RangeError(`Missing day converting ${JSON.stringify(t)}`);
    return n.set(s, h), ["constrain", "reject"].forEach(((d) => {
      const g = JSON.stringify({ func: "calendarToIsoDate", year: h.year, month: h.month, day: h.day, overflow: d, id: this.id });
      n.set(g, t);
    })), h;
  }
  validateCalendarDate(t) {
    const { month: n, year: r, day: i, eraYear: o, monthCode: s, monthExtra: a } = t;
    if (a !== void 0) throw new RangeError("Unexpected `monthExtra` value");
    if (r === void 0 && o === void 0) throw new TypeError("year or eraYear is required");
    if (n === void 0 && s === void 0) throw new TypeError("month or monthCode is required");
    if (i === void 0) throw new RangeError("Missing day");
    if (s !== void 0) {
      if (typeof s != "string") throw new RangeError("monthCode must be a string, not " + typeof s);
      if (!/^M([01]?\d)(L?)$/.test(s)) throw new RangeError(`Invalid monthCode: ${s}`);
    }
    if (this.hasEra && t.era === void 0 != (t.eraYear === void 0)) throw new TypeError("properties era and eraYear must be provided together");
  }
  adjustCalendarDate(t, n = void 0, r = "constrain", i = !1) {
    if (this.calendarType === "lunisolar") throw new RangeError("Override required for lunisolar calendars");
    let o = t;
    this.validateCalendarDate(o);
    const s = this.monthsInYear(o, n);
    let { month: a, monthCode: c } = o;
    return { month: a, monthCode: c } = $o(o, r, s), { ...o, month: a, monthCode: c };
  }
  regulateMonthDayNaive(t, n, r) {
    const i = this.monthsInYear(t, r);
    let { month: o, day: s } = t;
    return n === "reject" ? (et(o, 1, i), et(s, 1, this.maximumMonthLength(t))) : (o = bt(o, 1, i), s = bt(s, 1, this.maximumMonthLength({ ...t, month: o }))), { ...t, month: o, day: s };
  }
  calendarToIsoDate(t, n = "constrain", r) {
    const i = t;
    let o = this.adjustCalendarDate(t, r, n, !1);
    o = this.regulateMonthDayNaive(o, n, r);
    const { year: s, month: a, day: c } = o, u = JSON.stringify({ func: "calendarToIsoDate", year: s, month: a, day: c, overflow: n, id: this.id });
    let l, h = r.get(u);
    if (h || i.year !== void 0 && i.month !== void 0 && i.day !== void 0 && (i.year !== o.year || i.month !== o.month || i.day !== o.day) && (l = JSON.stringify({ func: "calendarToIsoDate", year: i.year, month: i.month, day: i.day, overflow: n, id: this.id }), h = r.get(l), h)) return h;
    let d = this.estimateIsoDate({ year: s, month: a, day: c });
    const g = (_) => {
      let T = this.addDaysIso(d, _);
      if (o.day > this.minimumMonthLength(o)) {
        let x = this.isoToCalendarDate(T, r);
        for (; x.month !== a || x.year !== s; ) {
          if (n === "reject") throw new RangeError(`day ${c} does not exist in month ${a} of year ${s}`);
          T = this.addDaysIso(T, -1), x = this.isoToCalendarDate(T, r);
        }
      }
      return T;
    };
    let p = 0, w = this.isoToCalendarDate(d, r), y = Li(o, w);
    if (y.years !== 0 || y.months !== 0 || y.days !== 0) {
      const _ = 365 * y.years + 30 * y.months + y.days;
      d = this.addDaysIso(d, _), w = this.isoToCalendarDate(d, r), y = Li(o, w), y.years === 0 && y.months === 0 ? d = g(y.days) : p = this.compareCalendarDates(o, w);
    }
    let v = 8;
    for (; p; ) {
      d = this.addDaysIso(d, p * v);
      const _ = w;
      w = this.isoToCalendarDate(d, r);
      const T = p;
      if (p = this.compareCalendarDates(o, w), p) {
        if (y = Li(o, w), y.years === 0 && y.months === 0) d = g(y.days), p = 0;
        else if (T && p !== T) if (v > 1) v /= 2;
        else {
          if (n === "reject") throw new RangeError(`Can't find ISO date from calendar date: ${JSON.stringify({ ...i })}`);
          this.compareCalendarDates(w, _) > 0 && (d = this.addDaysIso(d, -1)), p = 0;
        }
      }
    }
    if (r.set(u, d), l && r.set(l, d), o.year === void 0 || o.month === void 0 || o.day === void 0 || o.monthCode === void 0 || this.hasEra && (o.era === void 0 || o.eraYear === void 0)) throw new RangeError("Unexpected missing property");
    return d;
  }
  compareCalendarDates(t, n) {
    return t.year !== n.year ? $t(t.year - n.year) : t.month !== n.month ? $t(t.month - n.month) : t.day !== n.day ? $t(t.day - n.day) : 0;
  }
  regulateDate(t, n = "constrain", r) {
    const i = this.calendarToIsoDate(t, n, r);
    return this.isoToCalendarDate(i, r);
  }
  addDaysIso(t, n) {
    return Nt(t.year, t.month, t.day + n);
  }
  addDaysCalendar(t, n, r) {
    const i = this.calendarToIsoDate(t, "constrain", r), o = this.addDaysIso(i, n);
    return this.isoToCalendarDate(o, r);
  }
  addMonthsCalendar(t, n, r, i) {
    let o = t;
    const { day: s } = o;
    for (let a = 0, c = Math.abs(n); a < c; a++) {
      const { month: u } = o, l = o, h = n < 0 ? -Math.max(s, this.daysInPreviousMonth(o, i)) : this.daysInMonth(o, i), d = this.calendarToIsoDate(o, "constrain", i);
      let g = this.addDaysIso(d, h);
      if (o = this.isoToCalendarDate(g, i), n > 0) {
        const p = this.monthsInYear(l, i);
        for (; o.month - 1 != u % p; ) g = this.addDaysIso(g, -1), o = this.isoToCalendarDate(g, i);
      }
      o.day !== s && (o = this.regulateDate({ ...o, day: s }, "constrain", i));
    }
    if (r === "reject" && o.day !== s) throw new RangeError(`Day ${s} does not exist in resulting calendar month`);
    return o;
  }
  addCalendar(t, { years: n = 0, months: r = 0, weeks: i = 0, days: o = 0 }, s, a) {
    const { year: c, day: u, monthCode: l } = t, h = this.adjustCalendarDate({ year: c + n, monthCode: l, day: u }, a), d = this.addMonthsCalendar(h, r, s, a), g = o + 7 * i;
    return this.addDaysCalendar(d, g, a);
  }
  untilCalendar(t, n, r, i) {
    let o = 0, s = 0, a = 0, c = 0;
    switch (r) {
      case "day":
        o = this.calendarDaysUntil(t, n, i);
        break;
      case "week": {
        const u = this.calendarDaysUntil(t, n, i);
        o = u % 7, s = (u - o) / 7;
        break;
      }
      case "month":
      case "year": {
        const u = this.compareCalendarDates(n, t);
        if (!u) return { years: 0, months: 0, weeks: 0, days: 0 };
        const l = n.year - t.year, h = n.day - t.day;
        if (r === "year" && l) {
          let p = 0;
          n.monthCode > t.monthCode && (p = 1), n.monthCode < t.monthCode && (p = -1), p || (p = Math.sign(h)), c = p * u < 0 ? l - u : l;
        }
        let d, g = c ? this.addCalendar(t, { years: c }, "constrain", i) : t;
        do
          a += u, d = g, g = this.addMonthsCalendar(d, u, "constrain", i), g.day !== t.day && (g = this.regulateDate({ ...g, day: t.day }, "constrain", i));
        while (this.compareCalendarDates(n, g) * u >= 0);
        a -= u, o = this.calendarDaysUntil(d, n, i);
        break;
      }
    }
    return { years: c, months: a, weeks: s, days: o };
  }
  daysInMonth(t, n) {
    const { day: r } = t, i = this.maximumMonthLength(t), o = this.minimumMonthLength(t);
    if (o === i) return o;
    const s = r <= i - o ? i : o, a = this.calendarToIsoDate(t, "constrain", n), c = this.addDaysIso(a, s), u = this.isoToCalendarDate(c, n), l = this.addDaysIso(c, -u.day);
    return this.isoToCalendarDate(l, n).day;
  }
  daysInPreviousMonth(t, n) {
    const { day: r, month: i, year: o } = t;
    let s = { year: i > 1 ? o : o - 1, month: i, day: 1 };
    const a = i > 1 ? i - 1 : this.monthsInYear(s, n);
    s = { ...s, month: a };
    const c = this.minimumMonthLength(s), u = this.maximumMonthLength(s);
    if (c === u) return u;
    const l = this.calendarToIsoDate(t, "constrain", n), h = this.addDaysIso(l, -r);
    return this.isoToCalendarDate(h, n).day;
  }
  startOfCalendarYear(t) {
    return { year: t.year, month: 1, monthCode: "M01", day: 1 };
  }
  startOfCalendarMonth(t) {
    return { year: t.year, month: t.month, day: 1 };
  }
  calendarDaysUntil(t, n, r) {
    const i = this.calendarToIsoDate(t, "constrain", r), o = this.calendarToIsoDate(n, "constrain", r);
    return Ge(o.year, o.month - 1, o.day) - Ge(i.year, i.month - 1, i.day);
  }
  monthDaySearchStartYear(t, n) {
    return 1972;
  }
  monthDayFromFields(t, n, r) {
    let i, o, s, a, c, { era: u, eraYear: l, year: h, month: d, monthCode: g, day: p } = t;
    if (d !== void 0 && h === void 0 && (!this.hasEra || u === void 0 || l === void 0)) throw new TypeError("when month is present, year (or era and eraYear) are required");
    (g === void 0 || h !== void 0 || this.hasEra && l !== void 0) && ({ monthCode: g, day: p } = this.isoToCalendarDate(this.calendarToIsoDate(t, n, r), r));
    const w = { year: this.monthDaySearchStartYear(g, p), month: 12, day: 31 }, y = this.isoToCalendarDate(w, r), v = y.monthCode > g || y.monthCode === g && y.day >= p ? y.year : y.year - 1;
    for (let _ = 0; _ < 20; _++) {
      const T = this.adjustCalendarDate({ day: p, monthCode: g, year: v - _ }, r), x = this.calendarToIsoDate(T, "constrain", r), E = this.isoToCalendarDate(x, r);
      if ({ year: i, month: o, day: s } = x, E.monthCode === g && E.day === p) return { month: o, day: s, year: i };
      if (n === "constrain") {
        const N = this.maxLengthOfMonthCodeInAnyYear(E.monthCode);
        if (E.monthCode === g && E.day === N && p > N) return { month: o, day: s, year: i };
        (a === void 0 || E.monthCode === a.monthCode && E.day > a.day) && (a = E, c = x);
      }
    }
    if (n === "constrain" && c !== void 0) return c;
    throw new RangeError(`No recent ${this.id} year with monthCode ${g} and day ${p}`);
  }
  getFirstDayOfWeek() {
  }
  getMinimalDaysInFirstWeek() {
  }
}
class uu extends en {
  constructor() {
    super(...arguments), this.id = "hebrew", this.calendarType = "lunisolar", this.months = { Tishri: { leap: 1, regular: 1, monthCode: "M01", days: 30 }, Heshvan: { leap: 2, regular: 2, monthCode: "M02", days: { min: 29, max: 30 } }, Kislev: { leap: 3, regular: 3, monthCode: "M03", days: { min: 29, max: 30 } }, Tevet: { leap: 4, regular: 4, monthCode: "M04", days: 29 }, Shevat: { leap: 5, regular: 5, monthCode: "M05", days: 30 }, Adar: { leap: void 0, regular: 6, monthCode: "M06", days: 29 }, "Adar I": { leap: 6, regular: void 0, monthCode: "M05L", days: 30 }, "Adar II": { leap: 7, regular: void 0, monthCode: "M06", days: 29 }, Nisan: { leap: 8, regular: 7, monthCode: "M07", days: 30 }, Iyar: { leap: 9, regular: 8, monthCode: "M08", days: 29 }, Sivan: { leap: 10, regular: 9, monthCode: "M09", days: 30 }, Tamuz: { leap: 11, regular: 10, monthCode: "M10", days: 29 }, Av: { leap: 12, regular: 11, monthCode: "M11", days: 30 }, Elul: { leap: 13, regular: 12, monthCode: "M12", days: 29 } };
  }
  inLeapYear(t) {
    const { year: n } = t;
    return (7 * n + 1) % 19 < 7;
  }
  monthsInYear(t) {
    return this.inLeapYear(t) ? 13 : 12;
  }
  minimumMonthLength(t) {
    return this.minMaxMonthLength(t, "min");
  }
  maximumMonthLength(t) {
    return this.minMaxMonthLength(t, "max");
  }
  minMaxMonthLength(t, n) {
    const { month: r, year: i } = t, o = this.getMonthCode(i, r), s = Object.entries(this.months).find(((c) => c[1].monthCode === o));
    if (s === void 0) throw new RangeError(`unmatched Hebrew month: ${r}`);
    const a = s[1].days;
    return typeof a == "number" ? a : a[n];
  }
  maxLengthOfMonthCodeInAnyYear(t) {
    return ["M04", "M06", "M08", "M10", "M12"].includes(t) ? 29 : 30;
  }
  estimateIsoDate(t) {
    const { year: n } = t;
    return { year: n - 3760, month: 1, day: 1 };
  }
  getMonthCode(t, n) {
    return this.inLeapYear({ year: t }) ? n === 6 ? se(5, !0) : se(n < 6 ? n : n - 1) : se(n);
  }
  adjustCalendarDate(t, n, r = "constrain", i = !1) {
    let { year: o, month: s, monthCode: a, day: c, monthExtra: u } = t;
    if (o === void 0) throw new TypeError("Missing property: year");
    if (i) {
      if (u) {
        const l = this.months[u];
        if (!l) throw new RangeError(`Unrecognized month from formatToParts: ${u}`);
        s = this.inLeapYear({ year: o }) ? l.leap : l.regular;
      }
      return a = this.getMonthCode(o, s), { year: o, month: s, day: c, monthCode: a };
    }
    if (this.validateCalendarDate(t), s === void 0) if (a.endsWith("L")) {
      if (a !== "M05L") throw new RangeError(`Hebrew leap month must have monthCode M05L, not ${a}`);
      if (s = 6, !this.inLeapYear({ year: o })) {
        if (r === "reject") throw new RangeError(`Hebrew monthCode M05L is invalid in year ${o} which is not a leap year`);
        s = 6, a = "M06";
      }
    } else {
      s = Ke(a), this.inLeapYear({ year: o }) && s >= 6 && s++;
      const l = this.monthsInYear({ year: o });
      if (s < 1 || s > l) throw new RangeError(`Invalid monthCode: ${a}`);
    }
    else if (r === "reject" ? (et(s, 1, this.monthsInYear({ year: o })), et(c, 1, this.maximumMonthLength({ year: o, month: s }))) : (s = bt(s, 1, this.monthsInYear({ year: o })), c = bt(c, 1, this.maximumMonthLength({ year: o, month: s }))), a === void 0) a = this.getMonthCode(o, s);
    else if (this.getMonthCode(o, s) !== a) throw new RangeError(`monthCode ${a} doesn't correspond to month ${s} in Hebrew year ${o}`);
    return { ...t, day: c, month: s, monthCode: a, year: o };
  }
}
class Rn extends en {
  constructor() {
    super(...arguments), this.calendarType = "lunar", this.DAYS_PER_ISLAMIC_YEAR = 354 + 11 / 30, this.DAYS_PER_ISO_YEAR = 365.2425;
  }
  inLeapYear(t, n) {
    const r = { year: t.year, month: 1, monthCode: "M01", day: 1 }, i = { year: t.year + 1, month: 1, monthCode: "M01", day: 1 };
    return this.calendarDaysUntil(r, i, n) === 355;
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength() {
    return 29;
  }
  maximumMonthLength() {
    return 30;
  }
  maxLengthOfMonthCodeInAnyYear() {
    return 30;
  }
  estimateIsoDate(t) {
    const { year: n } = this.adjustCalendarDate(t);
    return { year: Math.floor(n * this.DAYS_PER_ISLAMIC_YEAR / this.DAYS_PER_ISO_YEAR) + 622, month: 1, day: 1 };
  }
}
class lu extends Rn {
  constructor() {
    super(...arguments), this.id = "islamic";
  }
}
class hu extends Rn {
  constructor() {
    super(...arguments), this.id = "islamic-umalqura";
  }
}
class du extends Rn {
  constructor() {
    super(...arguments), this.id = "islamic-tbla";
  }
}
class fu extends Rn {
  constructor() {
    super(...arguments), this.id = "islamic-civil";
  }
}
class mu extends Rn {
  constructor() {
    super(...arguments), this.id = "islamic-rgsa";
  }
}
class gu extends Rn {
  constructor() {
    super(...arguments), this.id = "islamicc";
  }
}
class pu extends en {
  constructor() {
    super(...arguments), this.id = "persian", this.calendarType = "solar";
  }
  inLeapYear(t, n) {
    return this.daysInMonth({ year: t.year, month: 12, day: 1 }, n) === 30;
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength(t) {
    const { month: n } = t;
    return n === 12 ? 29 : n <= 6 ? 31 : 30;
  }
  maximumMonthLength(t) {
    const { month: n } = t;
    return n === 12 ? 30 : n <= 6 ? 31 : 30;
  }
  maxLengthOfMonthCodeInAnyYear(t) {
    return Ke(t) <= 6 ? 31 : 30;
  }
  estimateIsoDate(t) {
    const { year: n } = this.adjustCalendarDate(t);
    return { year: n + 621, month: 1, day: 1 };
  }
}
class yu extends en {
  constructor() {
    super(...arguments), this.id = "indian", this.calendarType = "solar", this.months = { 1: { length: 30, month: 3, day: 22, leap: { length: 31, month: 3, day: 21 } }, 2: { length: 31, month: 4, day: 21 }, 3: { length: 31, month: 5, day: 22 }, 4: { length: 31, month: 6, day: 22 }, 5: { length: 31, month: 7, day: 23 }, 6: { length: 31, month: 8, day: 23 }, 7: { length: 30, month: 9, day: 23 }, 8: { length: 30, month: 10, day: 23 }, 9: { length: 30, month: 11, day: 22 }, 10: { length: 30, month: 12, day: 22 }, 11: { length: 30, month: 1, nextYear: !0, day: 21 }, 12: { length: 30, month: 2, nextYear: !0, day: 20 } }, this.vulnerableToBceBug = (/* @__PURE__ */ new Date("0000-01-01T00:00Z")).toLocaleDateString("en-US-u-ca-indian", { timeZone: "UTC" }) !== "10/11/-79 Saka";
  }
  inLeapYear(t) {
    return Ao(t.year + 78);
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength(t) {
    return this.getMonthInfo(t).length;
  }
  maximumMonthLength(t) {
    return this.getMonthInfo(t).length;
  }
  maxLengthOfMonthCodeInAnyYear(t) {
    const n = Ke(t);
    let r = this.months[n];
    return r = r.leap ?? r, r.length;
  }
  getMonthInfo(t) {
    const { month: n } = t;
    let r = this.months[n];
    if (r === void 0) throw new RangeError(`Invalid month: ${n}`);
    return this.inLeapYear(t) && r.leap && (r = r.leap), r;
  }
  estimateIsoDate(t) {
    const n = this.adjustCalendarDate(t), r = this.getMonthInfo(n);
    return Nt(n.year + 78 + (r.nextYear ? 1 : 0), r.month, r.day + n.day - 1);
  }
  checkIcuBugs(t) {
    if (this.vulnerableToBceBug && t.year < 1) throw new RangeError(`calendar '${this.id}' is broken for ISO dates before 0001-01-01 (see https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
  }
}
function Ao(e) {
  return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
class Ga extends en {
  constructor(t, n) {
    super(), this.calendarType = "solar", this.id = t, this.isoEpoch = n;
  }
  inLeapYear(t) {
    const { year: n } = this.estimateIsoDate({ month: 1, day: 1, year: t.year });
    return Ao(n);
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength(t) {
    const { month: n } = t;
    return n === 2 ? this.inLeapYear(t) ? 29 : 28 : [4, 6, 9, 11].indexOf(n) >= 0 ? 30 : 31;
  }
  maximumMonthLength(t) {
    return this.minimumMonthLength(t);
  }
  maxLengthOfMonthCodeInAnyYear(t) {
    return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][Ke(t) - 1];
  }
  estimateIsoDate(t) {
    const n = this.adjustCalendarDate(t);
    return Qn(n.year + this.isoEpoch.year, n.month + this.isoEpoch.month, n.day + this.isoEpoch.day, "constrain");
  }
}
class Va extends en {
  constructor(t, n) {
    super(), this.hasEra = !0, this.calendarType = "solar", this.id = t;
    const { eras: r, anchorEra: i } = (function(o) {
      let s, a = o;
      if (a.length === 0) throw new RangeError("Invalid era data: eras are required");
      if (a.length === 1 && a[0].reverseOf) throw new RangeError("Invalid era data: anchor era cannot count years backwards");
      if (a.length === 1 && !a[0].code) throw new RangeError("Invalid era data: at least one named era is required");
      if (a.filter(((u) => u.reverseOf != null)).length > 1) throw new RangeError("Invalid era data: only one era can count years backwards");
      a.forEach(((u) => {
        if (u.isAnchor || !u.anchorEpoch && !u.reverseOf) {
          if (s) throw new RangeError("Invalid era data: cannot have multiple anchor eras");
          s = u, u.anchorEpoch = { year: u.hasYearZero ? 0 : 1 };
        } else if (!u.code) throw new RangeError("If era name is blank, it must be the anchor era");
      })), a = a.filter(((u) => u.code)), a.forEach(((u) => {
        const { reverseOf: l } = u;
        if (l) {
          const h = a.find(((d) => d.code === l));
          if (h === void 0) throw new RangeError(`Invalid era data: unmatched reverseOf era: ${l}`);
          u.reverseOf = h, u.anchorEpoch = h.anchorEpoch, u.isoEpoch = h.isoEpoch;
        }
        u.anchorEpoch.month === void 0 && (u.anchorEpoch.month = 1), u.anchorEpoch.day === void 0 && (u.anchorEpoch.day = 1);
      })), a.sort(((u, l) => {
        if (u.reverseOf) return 1;
        if (l.reverseOf) return -1;
        if (!u.isoEpoch || !l.isoEpoch) throw new RangeError("Invalid era data: missing ISO epoch");
        return l.isoEpoch.year - u.isoEpoch.year;
      }));
      const c = a[a.length - 1].reverseOf;
      if (c && c !== a[a.length - 2]) throw new RangeError("Invalid era data: invalid reverse-sign era");
      return a.forEach(((u, l) => {
        u.genericName = "era" + (a.length - 1 - l);
      })), { eras: a, anchorEra: s || a[0] };
    })(n);
    this.anchorEra = i, this.eras = r;
  }
  inLeapYear(t) {
    const { year: n } = this.estimateIsoDate({ month: 1, day: 1, year: t.year });
    return Ao(n);
  }
  monthsInYear() {
    return 12;
  }
  minimumMonthLength(t) {
    const { month: n } = t;
    return n === 2 ? this.inLeapYear(t) ? 29 : 28 : [4, 6, 9, 11].indexOf(n) >= 0 ? 30 : 31;
  }
  maximumMonthLength(t) {
    return this.minimumMonthLength(t);
  }
  maxLengthOfMonthCodeInAnyYear(t) {
    return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][Ke(t) - 1];
  }
  completeEraYear(t) {
    const n = (a, c, u) => {
      const l = t[a];
      if (l != null && l != c && !(u || []).includes(l)) {
        const h = u?.[0];
        throw new RangeError(`Input ${a} ${l} doesn't match calculated value ${h ? `${c} (also called ${h})` : c}`);
      }
    }, r = (a) => {
      let c;
      const u = { ...t, year: a }, l = this.eras.find(((h, d) => {
        if (d === this.eras.length - 1) {
          if (h.reverseOf) {
            if (a > 0) throw new RangeError(`Signed year ${a} is invalid for era ${h.code}`);
            return c = h.anchorEpoch.year - a, !0;
          }
          return c = a - h.anchorEpoch.year + (h.hasYearZero ? 0 : 1), !0;
        }
        return this.compareCalendarDates(u, h.anchorEpoch) >= 0 && (c = a - h.anchorEpoch.year + (h.hasYearZero ? 0 : 1), !0);
      }));
      if (!l) throw new RangeError(`Year ${a} was not matched by any era`);
      return { eraYear: c, era: l.code, eraNames: l.names };
    };
    let { year: i, eraYear: o, era: s } = t;
    if (i != null) {
      const a = r(i);
      ({ eraYear: o, era: s } = a), n("era", s, a?.eraNames), n("eraYear", o);
    } else {
      if (o == null) throw new RangeError("Either year or eraYear and era are required");
      {
        if (s === void 0) throw new RangeError("era and eraYear must be provided together");
        const a = this.eras.find((({ code: c, names: u = [] }) => c === s || u.includes(s)));
        if (!a) throw new RangeError(`Era ${s} (ISO year ${o}) was not matched by any era`);
        i = a.reverseOf ? a.anchorEpoch.year - o : o + a.anchorEpoch.year - (a.hasYearZero ? 0 : 1), n("year", i), { eraYear: o, era: s } = r(i);
      }
    }
    return { ...t, year: i, eraYear: o, era: s };
  }
  adjustCalendarDate(t, n, r = "constrain") {
    let i = t;
    const { month: o, monthCode: s } = i;
    return o === void 0 && (i = { ...i, month: Ke(s) }), this.validateCalendarDate(i), i = this.completeEraYear(i), super.adjustCalendarDate(i, n, r);
  }
  estimateIsoDate(t) {
    const n = this.adjustCalendarDate(t), { year: r, month: i, day: o } = n, { anchorEra: s } = this;
    return Qn(r + s.isoEpoch.year - (s.hasYearZero ? 0 : 1), i, o, "constrain");
  }
}
class ko extends Va {
  constructor(t, n) {
    super(t, n);
  }
  isoToCalendarDate(t) {
    const { year: n, month: r, day: i } = t, o = se(r), s = n - this.anchorEra.isoEpoch.year + 1;
    return this.completeEraYear({ year: s, month: r, monthCode: o, day: i });
  }
}
const ne = { inLeapYear(e) {
  const { year: t } = e;
  return (t + 1) % 4 == 0;
}, monthsInYear: () => 13, minimumMonthLength(e) {
  const { month: t } = e;
  return t === 13 ? this.inLeapYear(e) ? 6 : 5 : 30;
}, maximumMonthLength(e) {
  return this.minimumMonthLength(e);
}, maxLengthOfMonthCodeInAnyYear: (e) => e === "M13" ? 6 : 30 };
class wu extends Ga {
  constructor(t, n) {
    super(t, n), this.inLeapYear = ne.inLeapYear, this.monthsInYear = ne.monthsInYear, this.minimumMonthLength = ne.minimumMonthLength, this.maximumMonthLength = ne.maximumMonthLength, this.maxLengthOfMonthCodeInAnyYear = ne.maxLengthOfMonthCodeInAnyYear;
  }
}
class Ka extends Va {
  constructor(t, n) {
    super(t, n), this.inLeapYear = ne.inLeapYear, this.monthsInYear = ne.monthsInYear, this.minimumMonthLength = ne.minimumMonthLength, this.maximumMonthLength = ne.maximumMonthLength, this.maxLengthOfMonthCodeInAnyYear = ne.maxLengthOfMonthCodeInAnyYear;
  }
}
class vu extends wu {
  constructor() {
    super("ethioaa", { year: -5492, month: 7, day: 17 });
  }
}
class bu extends Ka {
  constructor() {
    super("coptic", [{ code: "coptic", isoEpoch: { year: 284, month: 8, day: 29 } }, { code: "coptic-inverse", reverseOf: "coptic" }]);
  }
}
class _u extends Ka {
  constructor() {
    super("ethiopic", [{ code: "ethioaa", names: ["ethiopic-amete-alem", "mundi"], isoEpoch: { year: -5492, month: 7, day: 17 } }, { code: "ethiopic", names: ["incar"], isoEpoch: { year: 8, month: 8, day: 27 }, anchorEpoch: { year: 5501 } }]);
  }
}
class Tu extends ko {
  constructor() {
    super("roc", [{ code: "roc", names: ["minguo"], isoEpoch: { year: 1912, month: 1, day: 1 } }, { code: "roc-inverse", names: ["before-roc"], reverseOf: "roc" }]);
  }
}
class Mu extends Ga {
  constructor() {
    super("buddhist", { year: -543, month: 1, day: 1 });
  }
}
class Eu extends ko {
  constructor() {
    super("gregory", [{ code: "gregory", names: ["ad", "ce"], isoEpoch: { year: 1, month: 1, day: 1 } }, { code: "gregory-inverse", names: ["be", "bce"], reverseOf: "gregory" }]);
  }
  reviseIntlEra(t) {
    let { era: n, eraYear: r } = t;
    return n === "b" && (n = "gregory-inverse"), n === "a" && (n = "gregory"), { era: n, eraYear: r };
  }
  getFirstDayOfWeek() {
    return 1;
  }
  getMinimalDaysInFirstWeek() {
    return 1;
  }
}
class xu extends ko {
  constructor() {
    super("japanese", [{ code: "reiwa", isoEpoch: { year: 2019, month: 5, day: 1 }, anchorEpoch: { year: 2019, month: 5, day: 1 } }, { code: "heisei", isoEpoch: { year: 1989, month: 1, day: 8 }, anchorEpoch: { year: 1989, month: 1, day: 8 } }, { code: "showa", isoEpoch: { year: 1926, month: 12, day: 25 }, anchorEpoch: { year: 1926, month: 12, day: 25 } }, { code: "taisho", isoEpoch: { year: 1912, month: 7, day: 30 }, anchorEpoch: { year: 1912, month: 7, day: 30 } }, { code: "meiji", isoEpoch: { year: 1868, month: 9, day: 8 }, anchorEpoch: { year: 1868, month: 9, day: 8 } }, { code: "japanese", names: ["japanese", "gregory", "ad", "ce"], isoEpoch: { year: 1, month: 1, day: 1 } }, { code: "japanese-inverse", names: ["japanese-inverse", "gregory-inverse", "bc", "bce"], reverseOf: "japanese" }]), this.erasBeginMidYear = !0;
  }
  reviseIntlEra(t, n) {
    const { era: r, eraYear: i } = t, { year: o } = n;
    return this.eras.find(((s) => s.code === r)) ? { era: r, eraYear: i } : o < 1 ? { era: "japanese-inverse", eraYear: 1 - o } : { era: "japanese", eraYear: o };
  }
}
class Qa extends en {
  constructor() {
    super(...arguments), this.calendarType = "lunisolar";
  }
  inLeapYear(t, n) {
    const r = this.getMonthList(t.year, n);
    return Object.entries(r).length === 13;
  }
  monthsInYear(t, n) {
    return this.inLeapYear(t, n) ? 13 : 12;
  }
  minimumMonthLength() {
    return 29;
  }
  maximumMonthLength() {
    return 30;
  }
  maxLengthOfMonthCodeInAnyYear(t) {
    return ["M01L", "M09L", "M10L", "M11L", "M12L"].includes(t) ? 29 : 30;
  }
  monthDaySearchStartYear(t, n) {
    const r = { M01L: [1651, 1651], M02L: [1947, 1765], M03L: [1966, 1955], M04L: [1963, 1944], M05L: [1971, 1952], M06L: [1960, 1941], M07L: [1968, 1938], M08L: [1957, 1718], M09L: [1832, 1832], M10L: [1870, 1870], M11L: [1814, 1814], M12L: [1890, 1890] }[t] ?? [1972, 1972];
    return n < 30 ? r[0] : r[1];
  }
  getMonthList(t, n) {
    if (t === void 0) throw new TypeError("Missing year");
    const r = JSON.stringify({ func: "getMonthList", calendarYear: t, id: this.id }), i = n.get(r);
    if (i) return i;
    const o = this.getFormatter(), s = (y, v) => {
      const _ = Wa({ isoYear: y, isoMonth: 2, isoDay: 1 }), T = new Date(_);
      T.setUTCDate(v + 1);
      const x = o.formatToParts(T), E = x.find(((j) => j.type === "month")).value, N = +x.find(((j) => j.type === "day")).value, F = x.find(((j) => j.type === "relatedYear"));
      let U;
      if (F === void 0) throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
      return U = +F.value, { calendarMonthString: E, calendarDay: N, calendarYearToVerify: U };
    };
    let a = 17, { calendarMonthString: c, calendarDay: u, calendarYearToVerify: l } = s(t, a);
    c !== "1" && (a += 29, { calendarMonthString: c, calendarDay: u } = s(t, a)), a -= u - 5;
    const h = {};
    let d, g, p = 1, w = !1;
    do
      ({ calendarMonthString: c, calendarDay: u, calendarYearToVerify: l } = s(t, a)), d && (h[g].daysInMonth = d + 30 - u), l !== t ? w = !0 : (h[c] = { monthIndex: p++ }, a += 30), d = u, g = c;
    while (!w);
    return h[g].daysInMonth = d + 30 - u, n.set(r, h), h;
  }
  estimateIsoDate(t) {
    const { year: n, month: r } = t;
    return { year: n, month: r >= 12 ? 12 : r + 1, day: 1 };
  }
  adjustCalendarDate(t, n, r = "constrain", i = !1) {
    let { year: o, month: s, monthExtra: a, day: c, monthCode: u } = t;
    if (o === void 0) throw new TypeError("Missing property: year");
    if (i) {
      if (a && a !== "bis") throw new RangeError(`Unexpected leap month suffix: ${a}`);
      const l = se(s, a !== void 0), h = `${s}${a || ""}`, d = this.getMonthList(o, n)[h];
      if (d === void 0) throw new RangeError(`Unmatched month ${h} in Chinese year ${o}`);
      return s = d.monthIndex, { year: o, month: s, day: c, monthCode: l };
    }
    if (this.validateCalendarDate(t), s === void 0) {
      const l = this.getMonthList(o, n);
      let h = u.replace(/^M|L$/g, ((g) => g === "L" ? "bis" : ""));
      h[0] === "0" && (h = h.slice(1));
      let d = l[h];
      if (s = d && d.monthIndex, s === void 0 && u.endsWith("L") && u != "M13L" && r === "constrain") {
        const g = +u.replace(/^M0?|L$/g, "");
        d = l[g], d && (s = d.monthIndex, u = se(g));
      }
      if (s === void 0) throw new RangeError(`Unmatched month ${u} in Chinese year ${o}`);
    } else if (u === void 0) {
      const l = this.getMonthList(o, n), h = Object.entries(l), d = h.length;
      r === "reject" ? (et(s, 1, d), et(c, 1, this.maximumMonthLength())) : (s = bt(s, 1, d), c = bt(c, 1, this.maximumMonthLength()));
      const g = h.find(((p) => p[1].monthIndex === s));
      if (g === void 0) throw new RangeError(`Invalid month ${s} in Chinese year ${o}`);
      u = se(+g[0].replace("bis", ""), g[0].indexOf("bis") !== -1);
    } else {
      const l = this.getMonthList(o, n);
      let h = u.replace(/^M|L$/g, ((g) => g === "L" ? "bis" : ""));
      h[0] === "0" && (h = h.slice(1));
      const d = l[h];
      if (!d) throw new RangeError(`Unmatched monthCode ${u} in Chinese year ${o}`);
      if (s !== d.monthIndex) throw new RangeError(`monthCode ${u} doesn't correspond to month ${s} in Chinese year ${o}`);
    }
    return { ...t, year: o, month: s, monthCode: u, day: c };
  }
}
class Du extends Qa {
  constructor() {
    super(...arguments), this.id = "chinese";
  }
}
class Cu extends Qa {
  constructor() {
    super(...arguments), this.id = "dangi";
  }
}
class $u {
  constructor(t) {
    this.helper = t;
  }
  extraFields(t) {
    return this.helper.hasEra && t.includes("year") ? ["era", "eraYear"] : [];
  }
  resolveFields(t) {
    if (this.helper.calendarType !== "lunisolar") {
      const n = new tt();
      $o(t, void 0, this.helper.monthsInYear({ year: t.year ?? 1972 }, n));
    }
  }
  dateToISO(t, n) {
    const r = new tt(), i = this.helper.calendarToIsoDate(t, n, r);
    return r.setObject(i), i;
  }
  monthDayToISOReferenceDate(t, n) {
    const r = new tt(), i = this.helper.monthDayFromFields(t, n, r);
    return r.setObject(i), i;
  }
  fieldKeysToIgnore(t) {
    const n = /* @__PURE__ */ new Set();
    for (let r = 0; r < t.length; r++) {
      const i = t[r];
      switch (n.add(i), i) {
        case "era":
          n.add("eraYear"), n.add("year");
          break;
        case "eraYear":
          n.add("era"), n.add("year");
          break;
        case "year":
          n.add("era"), n.add("eraYear");
          break;
        case "month":
          n.add("monthCode"), this.helper.erasBeginMidYear && (n.add("era"), n.add("eraYear"));
          break;
        case "monthCode":
          n.add("month"), this.helper.erasBeginMidYear && (n.add("era"), n.add("eraYear"));
          break;
        case "day":
          this.helper.erasBeginMidYear && (n.add("era"), n.add("eraYear"));
      }
    }
    return qa(n);
  }
  dateAdd(t, { years: n, months: r, weeks: i, days: o }, s) {
    const a = tt.getCacheForObject(t), c = this.helper.isoToCalendarDate(t, a), u = this.helper.addCalendar(c, { years: n, months: r, weeks: i, days: o }, s, a), l = this.helper.calendarToIsoDate(u, "constrain", a);
    return tt.getCacheForObject(l) || new tt(a).setObject(l), l;
  }
  dateUntil(t, n, r) {
    const i = tt.getCacheForObject(t), o = tt.getCacheForObject(n), s = this.helper.isoToCalendarDate(t, i), a = this.helper.isoToCalendarDate(n, o);
    return this.helper.untilCalendar(s, a, r, i);
  }
  isoToDate(t, n) {
    const r = tt.getCacheForObject(t), i = this.helper.isoToCalendarDate(t, r);
    if (n.dayOfWeek && (i.dayOfWeek = $r.iso8601.isoToDate(t, { dayOfWeek: !0 }).dayOfWeek), n.dayOfYear) {
      const o = this.helper.startOfCalendarYear(i), s = this.helper.calendarDaysUntil(o, i, r);
      i.dayOfYear = s + 1;
    }
    if (n.weekOfYear && (i.weekOfYear = Xa(this.helper.id, t)), i.daysInWeek = 7, n.daysInMonth && (i.daysInMonth = this.helper.daysInMonth(i, r)), n.daysInYear) {
      const o = this.helper.startOfCalendarYear(i), s = this.helper.addCalendar(o, { years: 1 }, "constrain", r);
      i.daysInYear = this.helper.calendarDaysUntil(o, s, r);
    }
    return n.monthsInYear && (i.monthsInYear = this.helper.monthsInYear(i, r)), n.inLeapYear && (i.inLeapYear = this.helper.inLeapYear(i, r)), i;
  }
  getFirstDayOfWeek() {
    return this.helper.getFirstDayOfWeek();
  }
  getMinimalDaysInFirstWeek() {
    return this.helper.getMinimalDaysInFirstWeek();
  }
}
for (const e of [uu, pu, _u, vu, bu, Du, Cu, Tu, yu, Mu, Eu, xu, lu, hu, du, fu, mu, gu]) {
  const t = new e();
  $r[t.id] = new $u(t);
}
Hi("calendarImpl", (function(e) {
  return $r[e];
}));
const ur = Intl.DateTimeFormat;
function rn(e, t) {
  let n = m(e, t);
  return typeof n == "function" && (n = new ur(m(e, ca), n(m(e, zi))), (function(r, i, o) {
    const s = fi(r);
    if (s === void 0) throw new TypeError("Missing slots for the given container");
    if (s[i] === void 0) throw new TypeError(`tried to reset ${i} which was not set`);
    s[i] = o;
  })(e, t, n)), n;
}
function Yn(e) {
  return Et(e, Je);
}
class lr {
  constructor(t = void 0, n = void 0) {
    (function(r, i, o) {
      const s = o !== void 0;
      let a;
      if (s) {
        const h = ["localeMatcher", "calendar", "numberingSystem", "hour12", "hourCycle", "timeZone", "weekday", "era", "year", "month", "day", "dayPeriod", "hour", "minute", "second", "fractionalSecondDigits", "timeZoneName", "formatMatcher", "dateStyle", "timeStyle"];
        a = (function(g) {
          if (g == null) throw new TypeError(`Expected object not ${g}`);
          return Object(g);
        })(o);
        const d = /* @__PURE__ */ Object.create(null);
        for (let g = 0; g < h.length; g++) {
          const p = h[g];
          Object.prototype.hasOwnProperty.call(a, p) && (d[p] = a[p]);
        }
        a = d;
      } else a = /* @__PURE__ */ Object.create(null);
      const c = new ur(i, a), u = c.resolvedOptions();
      if (De(r), s) {
        const h = Object.assign(/* @__PURE__ */ Object.create(null), u);
        for (const d in h) Object.prototype.hasOwnProperty.call(a, d) || delete h[d];
        h.hour12 = a.hour12, h.hourCycle = a.hourCycle, R(r, zi, h);
      } else R(r, zi, a);
      R(r, ca, u.locale), R(r, Je, c), R(r, cn, u.timeZone), R(r, Sn, u.calendar), R(r, na, Pu), R(r, ra, Yu), R(r, ia, Iu), R(r, oa, Ou), R(r, sa, Su), R(r, aa, zu);
      const l = s ? a.timeZone : void 0;
      if (l === void 0) R(r, Si, u.timeZone);
      else {
        const h = yi(l);
        if (h.startsWith("−")) throw new RangeError("Unicode minus (U+2212) is not supported in time zone offsets");
        R(r, Si, Tt(h));
      }
    })(this, t, n);
  }
  get format() {
    b(this, Yn);
    const t = ku.bind(this);
    return Object.defineProperties(t, { length: { value: 1, enumerable: !1, writable: !1, configurable: !0 }, name: { value: "", enumerable: !1, writable: !1, configurable: !0 } }), t;
  }
  formatRange(t, n) {
    return b(this, Yn), Ru.call(this, t, n);
  }
  formatToParts(t, ...n) {
    return b(this, Yn), Nu.call(this, t, ...n);
  }
  formatRangeToParts(t, n) {
    return b(this, Yn), Lu.call(this, t, n);
  }
  resolvedOptions() {
    return b(this, Yn), Au.call(this);
  }
}
"formatToParts" in ur.prototype || delete lr.prototype.formatToParts, "formatRangeToParts" in ur.prototype || delete lr.prototype.formatRangeToParts;
const jt = function(e = void 0, t = void 0) {
  return new lr(e, t);
};
function Au() {
  const e = m(this, Je).resolvedOptions();
  return e.timeZone = m(this, Si), e;
}
function ku(e, ...t) {
  let n, r, i = Tn(e, this);
  return i.formatter ? (n = i.formatter, r = [Ht(i.epochNs, "floor")]) : (n = m(this, Je), r = [e, ...t]), n.format(...r);
}
function Nu(e, ...t) {
  let n, r, i = Tn(e, this);
  return i.formatter ? (n = i.formatter, r = [Ht(i.epochNs, "floor")]) : (n = m(this, Je), r = [e, ...t]), n.formatToParts(...r);
}
function Ru(e, t) {
  if (e === void 0 || t === void 0) throw new TypeError("Intl.DateTimeFormat.formatRange requires two values");
  const n = ni(e), r = ni(t);
  let i, o = [n, r];
  if (Me(n) !== Me(r)) throw new TypeError("Intl.DateTimeFormat.formatRange accepts two values of the same type");
  if (Me(n)) {
    if (!Ba(n, r)) throw new TypeError("Intl.DateTimeFormat.formatRange accepts two values of the same type");
    const { epochNs: s, formatter: a } = Tn(n, this), { epochNs: c, formatter: u } = Tn(r, this);
    a && (i = a, o = [Ht(s, "floor"), Ht(c, "floor")]);
  }
  return i || (i = m(this, Je)), i.formatRange(...o);
}
function Lu(e, t) {
  if (e === void 0 || t === void 0) throw new TypeError("Intl.DateTimeFormat.formatRange requires two values");
  const n = ni(e), r = ni(t);
  let i, o = [n, r];
  if (Me(n) !== Me(r)) throw new TypeError("Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type");
  if (Me(n)) {
    if (!Ba(n, r)) throw new TypeError("Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type");
    const { epochNs: s, formatter: a } = Tn(n, this), { epochNs: c, formatter: u } = Tn(r, this);
    a && (i = a, o = [Ht(s, "floor"), Ht(c, "floor")]);
  }
  return i || (i = m(this, Je)), i.formatRangeToParts(...o);
}
function Ar(e = {}, t = {}) {
  const n = Object.assign({}, e), r = ["year", "month", "day", "hour", "minute", "second", "weekday", "dayPeriod", "timeZoneName", "dateStyle", "timeStyle"];
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    n[o] = o in t ? t[o] : n[o], n[o] !== !1 && n[o] !== void 0 || delete n[o];
  }
  return n;
}
function Ou(e) {
  const t = Ar(e, { year: !1, month: !1, day: !1, weekday: !1, timeZoneName: !1, dateStyle: !1 });
  if (t.timeStyle !== "long" && t.timeStyle !== "full" || (delete t.timeStyle, Object.assign(t, { hour: "numeric", minute: "2-digit", second: "2-digit" })), !Di(t)) {
    if (kr(e)) throw new TypeError(`cannot format Temporal.PlainTime with options [${Object.keys(e)}]`);
    Object.assign(t, { hour: "numeric", minute: "numeric", second: "numeric" });
  }
  return t;
}
function Yu(e) {
  const t = { short: { year: "2-digit", month: "numeric" }, medium: { year: "numeric", month: "short" }, long: { year: "numeric", month: "long" }, full: { year: "numeric", month: "long" } }, n = Ar(e, { day: !1, hour: !1, minute: !1, second: !1, weekday: !1, dayPeriod: !1, timeZoneName: !1, timeStyle: !1 });
  if ("dateStyle" in n && n.dateStyle) {
    const r = n.dateStyle;
    delete n.dateStyle, Object.assign(n, t[r]);
  }
  if (!("year" in n || "month" in n || "era" in n)) {
    if (kr(e)) throw new TypeError(`cannot format PlainYearMonth with options [${Object.keys(e)}]`);
    Object.assign(n, { year: "numeric", month: "numeric" });
  }
  return n;
}
function Iu(e) {
  const t = { short: { month: "numeric", day: "numeric" }, medium: { month: "short", day: "numeric" }, long: { month: "long", day: "numeric" }, full: { month: "long", day: "numeric" } }, n = Ar(e, { year: !1, hour: !1, minute: !1, second: !1, weekday: !1, dayPeriod: !1, timeZoneName: !1, timeStyle: !1 });
  if ("dateStyle" in n && n.dateStyle) {
    const r = n.dateStyle;
    delete n.dateStyle, Object.assign(n, t[r]);
  }
  if (!("month" in n) && !("day" in n)) {
    if (kr(e)) throw new TypeError(`cannot format PlainMonthDay with options [${Object.keys(e)}]`);
    Object.assign(n, { month: "numeric", day: "numeric" });
  }
  return n;
}
function Pu(e) {
  const t = Ar(e, { hour: !1, minute: !1, second: !1, dayPeriod: !1, timeZoneName: !1, timeStyle: !1 });
  if (!xi(t)) {
    if (kr(e)) throw new TypeError(`cannot format PlainDate with options [${Object.keys(e)}]`);
    Object.assign(t, { year: "numeric", month: "numeric", day: "numeric" });
  }
  return t;
}
function Su(e) {
  const t = Ar(e, { timeZoneName: !1 });
  if ((t.timeStyle === "long" || t.timeStyle === "full") && (delete t.timeStyle, Object.assign(t, { hour: "numeric", minute: "2-digit", second: "2-digit" }), t.dateStyle) && (Object.assign(t, { short: { year: "numeric", month: "numeric", day: "numeric" }, medium: { year: "numeric", month: "short", day: "numeric" }, long: { year: "numeric", month: "long", day: "numeric" }, full: { year: "numeric", month: "long", day: "numeric", weekday: "long" } }[t.dateStyle]), delete t.dateStyle), !Di(t) && !xi(t)) {
    if (kr(e)) throw new TypeError(`cannot format PlainDateTime with options [${Object.keys(e)}]`);
    Object.assign(t, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
  }
  return t;
}
function zu(e) {
  let t = e;
  return Di(t) || xi(t) || (t = Object.assign({}, t, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })), t;
}
function xi(e) {
  return "year" in e || "month" in e || "day" in e || "weekday" in e || "dateStyle" in e || "era" in e;
}
function Di(e) {
  return "hour" in e || "minute" in e || "second" in e || "timeStyle" in e || "dayPeriod" in e || "fractionalSecondDigits" in e;
}
function kr(e) {
  return xi(e) || Di(e) || "dateStyle" in e || "timeStyle" in e || "timeZoneName" in e;
}
function Me(e) {
  return W(e) || K(e) || Z(e) || L(e) || rt(e) || Lt(e) || nt(e);
}
function ni(e) {
  return Me(e) ? e : pi(e);
}
function Ba(e, t) {
  return !(!Me(e) || !Me(t) || K(e) && !K(t) || W(e) && !W(t) || Z(e) && !Z(t) || L(e) && !L(t) || rt(e) && !rt(t) || Lt(e) && !Lt(t) || nt(e) && !nt(t));
}
function Tn(e, t) {
  if (K(e)) {
    const n = { isoDate: { year: 1970, month: 1, day: 1 }, time: m(e, G) };
    return { epochNs: ct(m(t, cn), n, "compatible"), formatter: rn(t, oa) };
  }
  if (rt(e)) {
    const n = m(e, M), r = m(t, Sn);
    if (n !== r) throw new RangeError(`cannot format PlainYearMonth with calendar ${n} in locale with calendar ${r}`);
    const i = P(m(e, A), { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    return { epochNs: ct(m(t, cn), i, "compatible"), formatter: rn(t, ra) };
  }
  if (Lt(e)) {
    const n = m(e, M), r = m(t, Sn);
    if (n !== r) throw new RangeError(`cannot format PlainMonthDay with calendar ${n} in locale with calendar ${r}`);
    const i = P(m(e, A), { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    return { epochNs: ct(m(t, cn), i, "compatible"), formatter: rn(t, ia) };
  }
  if (W(e)) {
    const n = m(e, M), r = m(t, Sn);
    if (n !== "iso8601" && n !== r) throw new RangeError(`cannot format PlainDate with calendar ${n} in locale with calendar ${r}`);
    const i = P(m(e, A), { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    return { epochNs: ct(m(t, cn), i, "compatible"), formatter: rn(t, na) };
  }
  if (Z(e)) {
    const n = m(e, M), r = m(t, Sn);
    if (n !== "iso8601" && n !== r) throw new RangeError(`cannot format PlainDateTime with calendar ${n} in locale with calendar ${r}`);
    const i = m(e, q);
    return { epochNs: ct(m(t, cn), i, "compatible"), formatter: rn(t, sa) };
  }
  if (L(e)) throw new TypeError("Temporal.ZonedDateTime not supported in DateTimeFormat methods. Use toLocaleString() instead.");
  return nt(e) ? { epochNs: m(e, $), formatter: rn(t, aa) } : {};
}
function Ja(e) {
  const t = /* @__PURE__ */ Object.create(null);
  return t.years = m(e, dt), t.months = m(e, ft), t.weeks = m(e, Dt), t.days = m(e, mt), t.hours = m(e, gt), t.minutes = m(e, pt), t.seconds = m(e, yt), t.milliseconds = m(e, wt), t.microseconds = m(e, vt), t.nanoseconds = m(e, Ct), t;
}
lr.prototype.constructor = jt, Object.defineProperty(jt, "prototype", { value: lr.prototype, writable: !1, enumerable: !1, configurable: !1 }), jt.supportedLocalesOf = ur.supportedLocalesOf, Ce(jt, "Intl.DateTimeFormat");
const { format: ju, formatToParts: Uu } = Intl.DurationFormat?.prototype ?? /* @__PURE__ */ Object.create(null);
function tc(e) {
  Intl.DurationFormat.prototype.resolvedOptions.call(this);
  const t = Ja(Ut(e));
  return ju.call(this, t);
}
Intl.DurationFormat?.prototype && (Intl.DurationFormat.prototype.format = tc, Intl.DurationFormat.prototype.formatToParts = function(e) {
  Intl.DurationFormat.prototype.resolvedOptions.call(this);
  const t = Ja(Ut(e));
  return Uu.call(this, t);
});
class No {
  constructor(t) {
    if (arguments.length < 1) throw new TypeError("missing argument: epochNanoseconds is required");
    Ca(this, ei(t));
  }
  get epochMilliseconds() {
    return b(this, nt), Ht(m(this, $), "floor");
  }
  get epochNanoseconds() {
    return b(this, nt), Ha(f.BigInt(m(this, $)));
  }
  add(t) {
    return b(this, nt), vs("add", this, t);
  }
  subtract(t) {
    return b(this, nt), vs("subtract", this, t);
  }
  until(t, n = void 0) {
    return b(this, nt), ds("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, nt), ds("since", this, t, n);
  }
  round(t) {
    if (b(this, nt), t === void 0) throw new TypeError("options parameter is required");
    const n = typeof t == "string" ? Ve("smallestUnit", t) : D(t), r = $n(n), i = Qt(n, "halfExpand"), o = At(n, "smallestUnit", "time", Ee);
    return An(r, { hour: 24, minute: 1440, second: 86400, millisecond: 864e5, microsecond: 864e8, nanosecond: 864e11 }[o], !0), re(Ji(m(this, $), r, o, i));
  }
  equals(t) {
    b(this, nt);
    const n = Un(t), r = m(this, $), i = m(n, $);
    return f.equal(f.BigInt(r), f.BigInt(i));
  }
  toString(t = void 0) {
    b(this, nt);
    const n = D(t), r = br(n), i = Qt(n, "trunc"), o = At(n, "smallestUnit", "time", void 0);
    if (o === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    let s = n.timeZone;
    s !== void 0 && (s = Tt(s));
    const { precision: a, unit: c, increment: u } = _r(o, r);
    return rs(re(Ji(m(this, $), u, c, i)), s, a);
  }
  toJSON() {
    return b(this, nt), rs(this, void 0, "auto");
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, nt), new jt(t, n).format(this);
  }
  valueOf() {
    Pe("Instant");
  }
  toZonedDateTimeISO(t) {
    b(this, nt);
    const n = Tt(t);
    return st(m(this, $), n, "iso8601");
  }
  static fromEpochMilliseconds(t) {
    return re(oe(pi(t)));
  }
  static fromEpochNanoseconds(t) {
    return re(ei(t));
  }
  static from(t) {
    return Un(t);
  }
  static compare(t, n) {
    const r = Un(t), i = Un(n), o = m(r, $), s = m(i, $);
    return f.lessThan(o, s) ? -1 : f.greaterThan(o, s) ? 1 : 0;
  }
}
Ce(No, "Temporal.Instant");
class Ro {
  constructor(t, n, r, i = "iso8601") {
    const o = k(t), s = k(n), a = k(r), c = xt(i === void 0 ? "iso8601" : J(i));
    Xe(o, s, a), Ta(this, { year: o, month: s, day: a }, c);
  }
  get calendarId() {
    return b(this, W), m(this, M);
  }
  get era() {
    return ut(this, "era");
  }
  get eraYear() {
    return ut(this, "eraYear");
  }
  get year() {
    return ut(this, "year");
  }
  get month() {
    return ut(this, "month");
  }
  get monthCode() {
    return ut(this, "monthCode");
  }
  get day() {
    return ut(this, "day");
  }
  get dayOfWeek() {
    return ut(this, "dayOfWeek");
  }
  get dayOfYear() {
    return ut(this, "dayOfYear");
  }
  get weekOfYear() {
    return ut(this, "weekOfYear")?.week;
  }
  get yearOfWeek() {
    return ut(this, "weekOfYear")?.year;
  }
  get daysInWeek() {
    return ut(this, "daysInWeek");
  }
  get daysInMonth() {
    return ut(this, "daysInMonth");
  }
  get daysInYear() {
    return ut(this, "daysInYear");
  }
  get monthsInYear() {
    return ut(this, "monthsInYear");
  }
  get inLeapYear() {
    return ut(this, "inLeapYear");
  }
  with(t, n = void 0) {
    if (b(this, W), !V(t)) throw new TypeError("invalid argument");
    Cn(t);
    const r = m(this, M);
    let i = Mt(r, m(this, A));
    return i = qe(r, i, Pt(r, t, ["year", "month", "monthCode", "day"], [], "partial")), _t(Ye(r, i, I(D(n))), r);
  }
  withCalendar(t) {
    b(this, W);
    const n = xr(t);
    return _t(m(this, A), n);
  }
  add(t, n = void 0) {
    return b(this, W), bs("add", this, t, n);
  }
  subtract(t, n = void 0) {
    return b(this, W), bs("subtract", this, t, n);
  }
  until(t, n = void 0) {
    return b(this, W), fs("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, W), fs("since", this, t, n);
  }
  equals(t) {
    b(this, W);
    const n = zn(t);
    return le(m(this, A), m(n, A)) === 0 && ce(m(this, M), m(n, M));
  }
  toString(t = void 0) {
    return b(this, W), is(this, vr(D(t)));
  }
  toJSON() {
    return b(this, W), is(this);
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, W), new jt(t, n).format(this);
  }
  valueOf() {
    Pe("PlainDate");
  }
  toPlainDateTime(t = void 0) {
    b(this, W);
    const n = _a(t);
    return St(P(m(this, A), n), m(this, M));
  }
  toZonedDateTime(t) {
    let n, r;
    if (b(this, W), V(t)) {
      const s = t.timeZone;
      s === void 0 ? n = Tt(t) : (n = Tt(s), r = t.plainTime);
    } else n = Tt(t);
    const i = m(this, A);
    let o;
    return r === void 0 ? o = $e(n, i) : (r = ke(r), o = ct(n, P(i, m(r, G)), "compatible")), st(o, n, m(this, M));
  }
  toPlainYearMonth() {
    b(this, W);
    const t = m(this, M);
    return fn(ir(t, Mt(t, m(this, A)), "constrain"), t);
  }
  toPlainMonthDay() {
    b(this, W);
    const t = m(this, M);
    return hn(Kr(t, Mt(t, m(this, A)), "constrain"), t);
  }
  static from(t, n = void 0) {
    return zn(t, n);
  }
  static compare(t, n) {
    const r = zn(t), i = zn(n);
    return le(m(r, A), m(i, A));
  }
}
function ut(e, t) {
  b(e, W);
  const n = m(e, A);
  return Tr(e).isoToDate(n, { [t]: !0 })[t];
}
Ce(Ro, "Temporal.PlainDate");
class Lo {
  constructor(t, n, r, i = 0, o = 0, s = 0, a = 0, c = 0, u = 0, l = "iso8601") {
    const h = k(t), d = k(n), g = k(r), p = i === void 0 ? 0 : k(i), w = o === void 0 ? 0 : k(o), y = s === void 0 ? 0 : k(s), v = a === void 0 ? 0 : k(a), _ = c === void 0 ? 0 : k(c), T = u === void 0 ? 0 : k(u), x = xt(l === void 0 ? "iso8601" : J(l));
    Eo(h, d, g, p, w, y, v, _, T), Ma(this, { isoDate: { year: h, month: d, day: g }, time: { hour: p, minute: w, second: y, millisecond: v, microsecond: _, nanosecond: T } }, x);
  }
  get calendarId() {
    return b(this, Z), m(this, M);
  }
  get year() {
    return lt(this, "year");
  }
  get month() {
    return lt(this, "month");
  }
  get monthCode() {
    return lt(this, "monthCode");
  }
  get day() {
    return lt(this, "day");
  }
  get hour() {
    return on(this, "hour");
  }
  get minute() {
    return on(this, "minute");
  }
  get second() {
    return on(this, "second");
  }
  get millisecond() {
    return on(this, "millisecond");
  }
  get microsecond() {
    return on(this, "microsecond");
  }
  get nanosecond() {
    return on(this, "nanosecond");
  }
  get era() {
    return lt(this, "era");
  }
  get eraYear() {
    return lt(this, "eraYear");
  }
  get dayOfWeek() {
    return lt(this, "dayOfWeek");
  }
  get dayOfYear() {
    return lt(this, "dayOfYear");
  }
  get weekOfYear() {
    return lt(this, "weekOfYear")?.week;
  }
  get yearOfWeek() {
    return lt(this, "weekOfYear")?.year;
  }
  get daysInWeek() {
    return lt(this, "daysInWeek");
  }
  get daysInYear() {
    return lt(this, "daysInYear");
  }
  get daysInMonth() {
    return lt(this, "daysInMonth");
  }
  get monthsInYear() {
    return lt(this, "monthsInYear");
  }
  get inLeapYear() {
    return lt(this, "inLeapYear");
  }
  with(t, n = void 0) {
    if (b(this, Z), !V(t)) throw new TypeError("invalid argument");
    Cn(t);
    const r = m(this, M), i = m(this, q);
    let o = { ...Mt(r, i.isoDate), ...i.time };
    return o = qe(r, o, Pt(r, t, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond"], "partial")), St(Mr(r, o, I(D(n))), r);
  }
  withPlainTime(t = void 0) {
    b(this, Z);
    const n = _a(t);
    return St(P(m(this, q).isoDate, n), m(this, M));
  }
  withCalendar(t) {
    b(this, Z);
    const n = xr(t);
    return St(m(this, q), n);
  }
  add(t, n = void 0) {
    return b(this, Z), _s("add", this, t, n);
  }
  subtract(t, n = void 0) {
    return b(this, Z), _s("subtract", this, t, n);
  }
  until(t, n = void 0) {
    return b(this, Z), ms("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, Z), ms("since", this, t, n);
  }
  round(t) {
    if (b(this, Z), t === void 0) throw new TypeError("options parameter is required");
    const n = typeof t == "string" ? Ve("smallestUnit", t) : D(t), r = $n(n), i = Qt(n, "halfExpand"), o = At(n, "smallestUnit", "time", Ee, ["day"]), s = { day: 1, hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[o];
    An(r, s, s === 1);
    const a = m(this, q);
    return St(r === 1 && o === "nanosecond" ? a : to(a, r, o, i), m(this, M));
  }
  equals(t) {
    b(this, Z);
    const n = jn(t);
    return _n(m(this, q), m(n, q)) === 0 && ce(m(this, M), m(n, M));
  }
  toString(t = void 0) {
    b(this, Z);
    const n = D(t), r = vr(n), i = br(n), o = Qt(n, "trunc"), s = At(n, "smallestUnit", "time", void 0);
    if (s === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const { precision: a, unit: c, increment: u } = _r(s, i), l = to(m(this, q), u, c, o);
    return We(l), sr(l, m(this, M), a, r);
  }
  toJSON() {
    return b(this, Z), sr(m(this, q), m(this, M), "auto");
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, Z), new jt(t, n).format(this);
  }
  valueOf() {
    Pe("PlainDateTime");
  }
  toZonedDateTime(t, n = void 0) {
    b(this, Z);
    const r = Tt(t), i = Bn(D(n));
    return st(ct(r, m(this, q), i), r, m(this, M));
  }
  toPlainDate() {
    return b(this, Z), _t(m(this, q).isoDate, m(this, M));
  }
  toPlainTime() {
    return b(this, Z), we(m(this, q).time);
  }
  static from(t, n = void 0) {
    return jn(t, n);
  }
  static compare(t, n) {
    const r = jn(t), i = jn(n);
    return _n(m(r, q), m(i, q));
  }
}
function lt(e, t) {
  b(e, Z);
  const n = m(e, q).isoDate;
  return Tr(e).isoToDate(n, { [t]: !0 })[t];
}
function on(e, t) {
  return b(e, Z), m(e, q).time[t];
}
Ce(Lo, "Temporal.PlainDateTime");
class Mn {
  constructor(t = 0, n = 0, r = 0, i = 0, o = 0, s = 0, a = 0, c = 0, u = 0, l = 0) {
    const h = t === void 0 ? 0 : Gt(t), d = n === void 0 ? 0 : Gt(n), g = r === void 0 ? 0 : Gt(r), p = i === void 0 ? 0 : Gt(i), w = o === void 0 ? 0 : Gt(o), y = s === void 0 ? 0 : Gt(s), v = a === void 0 ? 0 : Gt(a), _ = c === void 0 ? 0 : Gt(c), T = u === void 0 ? 0 : Gt(u), x = l === void 0 ? 0 : Gt(l);
    Mi(h, d, g, p, w, y, v, _, T, x), De(this), R(this, dt, h), R(this, ft, d), R(this, Dt, g), R(this, mt, p), R(this, gt, w), R(this, pt, y), R(this, yt, v), R(this, wt, _), R(this, vt, T), R(this, Ct, x);
  }
  get years() {
    return b(this, X), m(this, dt);
  }
  get months() {
    return b(this, X), m(this, ft);
  }
  get weeks() {
    return b(this, X), m(this, Dt);
  }
  get days() {
    return b(this, X), m(this, mt);
  }
  get hours() {
    return b(this, X), m(this, gt);
  }
  get minutes() {
    return b(this, X), m(this, pt);
  }
  get seconds() {
    return b(this, X), m(this, yt);
  }
  get milliseconds() {
    return b(this, X), m(this, wt);
  }
  get microseconds() {
    return b(this, X), m(this, vt);
  }
  get nanoseconds() {
    return b(this, X), m(this, Ct);
  }
  get sign() {
    return b(this, X), Jr(this);
  }
  get blank() {
    return b(this, X), Jr(this) === 0;
  }
  with(t) {
    b(this, X);
    const n = ba(t), { years: r = m(this, dt), months: i = m(this, ft), weeks: o = m(this, Dt), days: s = m(this, mt), hours: a = m(this, gt), minutes: c = m(this, pt), seconds: u = m(this, yt), milliseconds: l = m(this, wt), microseconds: h = m(this, vt), nanoseconds: d = m(this, Ct) } = n;
    return new Mn(r, i, o, s, a, c, u, l, h, d);
  }
  negated() {
    return b(this, X), Rt(this);
  }
  abs() {
    return b(this, X), new Mn(Math.abs(m(this, dt)), Math.abs(m(this, ft)), Math.abs(m(this, Dt)), Math.abs(m(this, mt)), Math.abs(m(this, gt)), Math.abs(m(this, pt)), Math.abs(m(this, yt)), Math.abs(m(this, wt)), Math.abs(m(this, vt)), Math.abs(m(this, Ct)));
  }
  add(t) {
    return b(this, X), ws("add", this, t);
  }
  subtract(t) {
    return b(this, X), ws("subtract", this, t);
  }
  round(t) {
    if (b(this, X), t === void 0) throw new TypeError("options parameter is required");
    const n = pe(this), r = typeof t == "string" ? Ve("smallestUnit", t) : D(t);
    let i = At(r, "largestUnit", "datetime", void 0, ["auto"]), { plainRelativeTo: o, zonedRelativeTo: s } = Ri(r);
    const a = $n(r), c = Qt(r, "halfExpand");
    let u = At(r, "smallestUnit", "datetime", void 0), l = !0;
    u || (l = !1, u = "nanosecond");
    const h = be(n, u);
    let d = !0;
    if (i || (d = !1, i = h), i === "auto" && (i = h), !l && !d) throw new RangeError("at least one of smallestUnit or largestUnit is required");
    if (be(i, u) !== i) throw new RangeError(`largestUnit ${i} cannot be smaller than smallestUnit ${u}`);
    const g = { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[u];
    if (g !== void 0 && An(a, g, !1), a > 1 && ye(u) === "date" && i !== u) throw new RangeError("For calendar units with roundingIncrement > 1, use largestUnit = smallestUnit");
    if (s) {
      let w = un(this);
      const y = m(s, S), v = m(s, M), _ = m(s, $);
      return w = Fa(_, Zn(_, y, v, w), y, v, i, a, u, c), ye(i) === "date" && (i = "hour"), zt(w, i);
    }
    if (o) {
      let w = ie(this);
      const y = bn({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }, w.time), v = m(o, A), _ = m(o, M), T = Yt(_, v, at(w.date, y.deltaDays), "constrain");
      return w = Ua(P(v, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), P(T, y), _, i, a, u, c), zt(w, i);
    }
    if (ee(n)) throw new RangeError(`a starting point is required for ${n}s balancing`);
    if (ee(i)) throw new RangeError(`a starting point is required for ${i}s balancing`);
    let p = ie(this);
    if (u === "day") {
      const { quotient: w, remainder: y } = p.time.divmod(Wr);
      let v = p.date.days + w + Jn(y, "day");
      v = Ne(v, a, c), p = _e({ years: 0, months: 0, weeks: 0, days: v }, O.ZERO);
    } else p = _e({ years: 0, months: 0, weeks: 0, days: 0 }, ti(p.time, a, u, c));
    return zt(p, i);
  }
  total(t) {
    if (b(this, X), t === void 0) throw new TypeError("options argument is required");
    const n = typeof t == "string" ? Ve("unit", t) : D(t);
    let { plainRelativeTo: r, zonedRelativeTo: i } = Ri(n);
    const o = At(n, "unit", "datetime", Ee);
    if (i) {
      const a = un(this), c = m(i, S), u = m(i, M), l = m(i, $);
      return (function(h, d, g, p, w) {
        return ye(w) === "time" ? Jn(O.fromEpochNsDiff(d, h), w) : hs(za(h, d, g, p, w), d, Ft(g, h), g, p, w);
      })(l, Zn(l, c, u, a), c, u, o);
    }
    if (r) {
      const a = ie(this);
      let c = bn({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }, a.time);
      const u = m(r, A), l = m(r, M), h = Yt(l, u, at(a.date, c.deltaDays), "constrain");
      return (function(d, g, p, w) {
        if (_n(d, g) == 0) return 0;
        We(d), We(g);
        const y = Sa(d, g, p, w);
        return w === "nanosecond" ? f.toNumber(y.time.totalNs) : hs(y, it(g), d, null, p, w);
      })(P(u, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), P(h, c), l, o);
    }
    const s = pe(this);
    if (ee(s)) throw new RangeError(`a starting point is required for ${s}s total`);
    if (ee(o)) throw new RangeError(`a starting point is required for ${o}s total`);
    return Jn(ie(this).time, o);
  }
  toString(t = void 0) {
    b(this, X);
    const n = D(t), r = br(n), i = Qt(n, "trunc"), o = At(n, "smallestUnit", "time", void 0);
    if (o === "hour" || o === "minute") throw new RangeError('smallestUnit must be a time unit other than "hours" or "minutes"');
    const { precision: s, unit: a, increment: c } = _r(o, r);
    if (a === "nanosecond" && c === 1) return Or(this, s);
    const u = pe(this);
    let l = un(this);
    const h = ti(l.time, c, a, i);
    return l = _e(l.date, h), Or(zt(l, be(u, "second")), s);
  }
  toJSON() {
    return b(this, X), Or(this, "auto");
  }
  toLocaleString(t = void 0, n = void 0) {
    if (b(this, X), typeof Intl.DurationFormat == "function") {
      const r = new Intl.DurationFormat(t, n);
      return tc.call(r, this);
    }
    return console.warn("Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat."), Or(this, "auto");
  }
  valueOf() {
    Pe("Duration");
  }
  static from(t) {
    return Ut(t);
  }
  static compare(t, n, r = void 0) {
    const i = Ut(t), o = Ut(n), s = D(r), { plainRelativeTo: a, zonedRelativeTo: c } = Ri(s);
    if (m(i, dt) === m(o, dt) && m(i, ft) === m(o, ft) && m(i, Dt) === m(o, Dt) && m(i, mt) === m(o, mt) && m(i, gt) === m(o, gt) && m(i, pt) === m(o, pt) && m(i, yt) === m(o, yt) && m(i, wt) === m(o, wt) && m(i, vt) === m(o, vt) && m(i, Ct) === m(o, Ct)) return 0;
    const u = pe(i), l = pe(o), h = un(i), d = un(o);
    if (c && (ye(u) === "date" || ye(l) === "date")) {
      const v = m(c, S), _ = m(c, M), T = m(c, $), x = Zn(T, v, _, h), E = Zn(T, v, _, d);
      return $t(f.toNumber(f.subtract(x, E)));
    }
    let g = h.date.days, p = d.date.days;
    if (ee(u) || ee(l)) {
      if (!a) throw new RangeError("A starting point is required for years, months, or weeks comparison");
      g = ls(h.date, a), p = ls(d.date, a);
    }
    const w = h.time.add24HourDays(g), y = d.time.add24HourDays(p);
    return w.cmp(y);
  }
}
Ce(Mn, "Temporal.Duration");
class Oo {
  constructor(t, n, r = "iso8601", i = 1972) {
    const o = k(t), s = k(n), a = xt(r === void 0 ? "iso8601" : J(r)), c = k(i);
    Xe(c, o, s), Ea(this, { year: c, month: o, day: s }, a);
  }
  get monthCode() {
    return Ds(this, "monthCode");
  }
  get day() {
    return Ds(this, "day");
  }
  get calendarId() {
    return b(this, Lt), m(this, M);
  }
  with(t, n = void 0) {
    if (b(this, Lt), !V(t)) throw new TypeError("invalid argument");
    Cn(t);
    const r = m(this, M);
    let i = Mt(r, m(this, A), "month-day");
    return i = qe(r, i, Pt(r, t, ["year", "month", "monthCode", "day"], [], "partial")), hn(Kr(r, i, I(D(n))), r);
  }
  equals(t) {
    b(this, Lt);
    const n = es(t);
    return le(m(this, A), m(n, A)) === 0 && ce(m(this, M), m(n, M));
  }
  toString(t = void 0) {
    return b(this, Lt), ss(this, vr(D(t)));
  }
  toJSON() {
    return b(this, Lt), ss(this);
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, Lt), new jt(t, n).format(this);
  }
  valueOf() {
    Pe("PlainMonthDay");
  }
  toPlainDate(t) {
    if (b(this, Lt), !V(t)) throw new TypeError("argument should be an object");
    const n = m(this, M);
    return _t(Ye(n, qe(n, Mt(n, m(this, A), "month-day"), Pt(n, t, ["year"], [], [])), "constrain"), n);
  }
  static from(t, n = void 0) {
    return es(t, n);
  }
}
function Ds(e, t) {
  b(e, Lt);
  const n = m(e, A);
  return Tr(e).isoToDate(n, { [t]: !0 })[t];
}
function Oi(e) {
  return Ft(e, ro());
}
Ce(Oo, "Temporal.PlainMonthDay");
const ec = { instant: () => re(ro()), plainDateTimeISO: (e = On()) => St(Oi(Tt(e)), "iso8601"), plainDateISO: (e = On()) => _t(Oi(Tt(e)).isoDate, "iso8601"), plainTimeISO: (e = On()) => we(Oi(Tt(e)).time), timeZoneId: () => On(), zonedDateTimeISO: (e = On()) => {
  const t = Tt(e);
  return st(ro(), t, "iso8601");
}, [Symbol.toStringTag]: "Temporal.Now" };
Object.defineProperty(ec, Symbol.toStringTag, { value: "Temporal.Now", writable: !1, enumerable: !1, configurable: !0 });
class Nr {
  constructor(t = 0, n = 0, r = 0, i = 0, o = 0, s = 0) {
    const a = t === void 0 ? 0 : k(t), c = n === void 0 ? 0 : k(n), u = r === void 0 ? 0 : k(r), l = i === void 0 ? 0 : k(i), h = o === void 0 ? 0 : k(o), d = s === void 0 ? 0 : k(s);
    Ti(a, c, u, l, h, d), xa(this, { hour: a, minute: c, second: u, millisecond: l, microsecond: h, nanosecond: d });
  }
  get hour() {
    return b(this, K), m(this, G).hour;
  }
  get minute() {
    return b(this, K), m(this, G).minute;
  }
  get second() {
    return b(this, K), m(this, G).second;
  }
  get millisecond() {
    return b(this, K), m(this, G).millisecond;
  }
  get microsecond() {
    return b(this, K), m(this, G).microsecond;
  }
  get nanosecond() {
    return b(this, K), m(this, G).nanosecond;
  }
  with(t, n = void 0) {
    if (b(this, K), !V(t)) throw new TypeError("invalid argument");
    Cn(t);
    const r = Wi(t, "partial"), i = Wi(this);
    let { hour: o, minute: s, second: a, millisecond: c, microsecond: u, nanosecond: l } = Object.assign(i, r);
    const h = I(D(n));
    return { hour: o, minute: s, second: a, millisecond: c, microsecond: u, nanosecond: l } = vi(o, s, a, c, u, l, h), new Nr(o, s, a, c, u, l);
  }
  add(t) {
    return b(this, K), Ts("add", this, t);
  }
  subtract(t) {
    return b(this, K), Ts("subtract", this, t);
  }
  until(t, n = void 0) {
    return b(this, K), gs("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, K), gs("since", this, t, n);
  }
  round(t) {
    if (b(this, K), t === void 0) throw new TypeError("options parameter is required");
    const n = typeof t == "string" ? Ve("smallestUnit", t) : D(t), r = $n(n), i = Qt(n, "halfExpand"), o = At(n, "smallestUnit", "time", Ee);
    return An(r, { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[o], !1), we(eo(m(this, G), r, o, i));
  }
  equals(t) {
    b(this, K);
    const n = ke(t);
    return no(m(this, G), m(n, G)) === 0;
  }
  toString(t = void 0) {
    b(this, K);
    const n = D(t), r = br(n), i = Qt(n, "trunc"), o = At(n, "smallestUnit", "time", void 0);
    if (o === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const { precision: s, unit: a, increment: c } = _r(o, r);
    return os(eo(m(this, G), c, a, i), s);
  }
  toJSON() {
    return b(this, K), os(m(this, G), "auto");
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, K), new jt(t, n).format(this);
  }
  valueOf() {
    Pe("PlainTime");
  }
  static from(t, n = void 0) {
    return ke(t, n);
  }
  static compare(t, n) {
    const r = ke(t), i = ke(n);
    return no(m(r, G), m(i, G));
  }
}
Ce(Nr, "Temporal.PlainTime");
class Yo {
  constructor(t, n, r = "iso8601", i = 1) {
    const o = k(t), s = k(n), a = xt(r === void 0 ? "iso8601" : J(r)), c = k(i);
    Xe(o, s, c), Da(this, { year: o, month: s, day: c }, a);
  }
  get year() {
    return fe(this, "year");
  }
  get month() {
    return fe(this, "month");
  }
  get monthCode() {
    return fe(this, "monthCode");
  }
  get calendarId() {
    return b(this, rt), m(this, M);
  }
  get era() {
    return fe(this, "era");
  }
  get eraYear() {
    return fe(this, "eraYear");
  }
  get daysInMonth() {
    return fe(this, "daysInMonth");
  }
  get daysInYear() {
    return fe(this, "daysInYear");
  }
  get monthsInYear() {
    return fe(this, "monthsInYear");
  }
  get inLeapYear() {
    return fe(this, "inLeapYear");
  }
  with(t, n = void 0) {
    if (b(this, rt), !V(t)) throw new TypeError("invalid argument");
    Cn(t);
    const r = m(this, M);
    let i = Mt(r, m(this, A), "year-month");
    return i = qe(r, i, Pt(r, t, ["year", "month", "monthCode"], [], "partial")), fn(ir(r, i, I(D(n))), r);
  }
  add(t, n = void 0) {
    return b(this, rt), Ms("add", this, t, n);
  }
  subtract(t, n = void 0) {
    return b(this, rt), Ms("subtract", this, t, n);
  }
  until(t, n = void 0) {
    return b(this, rt), ps("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, rt), ps("since", this, t, n);
  }
  equals(t) {
    b(this, rt);
    const n = Fn(t);
    return le(m(this, A), m(n, A)) === 0 && ce(m(this, M), m(n, M));
  }
  toString(t = void 0) {
    return b(this, rt), as(this, vr(D(t)));
  }
  toJSON() {
    return b(this, rt), as(this);
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, rt), new jt(t, n).format(this);
  }
  valueOf() {
    Pe("PlainYearMonth");
  }
  toPlainDate(t) {
    if (b(this, rt), !V(t)) throw new TypeError("argument should be an object");
    const n = m(this, M);
    return _t(Ye(n, qe(n, Mt(n, m(this, A), "year-month"), Pt(n, t, ["day"], [], [])), "constrain"), n);
  }
  static from(t, n = void 0) {
    return Fn(t, n);
  }
  static compare(t, n) {
    const r = Fn(t), i = Fn(n);
    return le(m(r, A), m(i, A));
  }
}
function fe(e, t) {
  b(e, rt);
  const n = m(e, A);
  return Tr(e).isoToDate(n, { [t]: !0 })[t];
}
Ce(Yo, "Temporal.PlainYearMonth");
const Fu = jt.prototype.resolvedOptions;
class Io {
  constructor(t, n, r = "iso8601") {
    if (arguments.length < 1) throw new TypeError("missing argument: epochNanoseconds is required");
    const i = ei(t);
    let o = J(n);
    const { tzName: s, offsetMinutes: a } = Re(o);
    if (a === void 0) {
      const c = Qr(s);
      if (!c) throw new RangeError(`unknown time zone ${s}`);
      o = c.identifier;
    } else o = _o(a);
    $a(this, i, o, xt(r === void 0 ? "iso8601" : J(r)));
  }
  get calendarId() {
    return b(this, L), m(this, M);
  }
  get timeZoneId() {
    return b(this, L), m(this, S);
  }
  get year() {
    return ht(this, "year");
  }
  get month() {
    return ht(this, "month");
  }
  get monthCode() {
    return ht(this, "monthCode");
  }
  get day() {
    return ht(this, "day");
  }
  get hour() {
    return sn(this, "hour");
  }
  get minute() {
    return sn(this, "minute");
  }
  get second() {
    return sn(this, "second");
  }
  get millisecond() {
    return sn(this, "millisecond");
  }
  get microsecond() {
    return sn(this, "microsecond");
  }
  get nanosecond() {
    return sn(this, "nanosecond");
  }
  get era() {
    return ht(this, "era");
  }
  get eraYear() {
    return ht(this, "eraYear");
  }
  get epochMilliseconds() {
    return b(this, L), Ht(m(this, $), "floor");
  }
  get epochNanoseconds() {
    return b(this, L), Ha(m(this, $));
  }
  get dayOfWeek() {
    return ht(this, "dayOfWeek");
  }
  get dayOfYear() {
    return ht(this, "dayOfYear");
  }
  get weekOfYear() {
    return ht(this, "weekOfYear")?.week;
  }
  get yearOfWeek() {
    return ht(this, "weekOfYear")?.year;
  }
  get hoursInDay() {
    b(this, L);
    const t = m(this, S), n = te(this).isoDate, r = Nt(n.year, n.month, n.day + 1), i = $e(t, n), o = $e(t, r);
    return Jn(O.fromEpochNsDiff(o, i), "hour");
  }
  get daysInWeek() {
    return ht(this, "daysInWeek");
  }
  get daysInMonth() {
    return ht(this, "daysInMonth");
  }
  get daysInYear() {
    return ht(this, "daysInYear");
  }
  get monthsInYear() {
    return ht(this, "monthsInYear");
  }
  get inLeapYear() {
    return ht(this, "inLeapYear");
  }
  get offset() {
    return b(this, L), Gi(ve(m(this, S), m(this, $)));
  }
  get offsetNanoseconds() {
    return b(this, L), ve(m(this, S), m(this, $));
  }
  with(t, n = void 0) {
    if (b(this, L), !V(t)) throw new TypeError("invalid zoned-date-time-like");
    Cn(t);
    const r = m(this, M), i = m(this, S), o = ve(i, m(this, $)), s = te(this);
    let a = { ...Mt(r, s.isoDate), ...s.time, offset: Gi(o) };
    a = qe(r, a, Pt(r, t, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset"], "partial"));
    const c = D(n), u = Bn(c), l = zr(c, "prefer"), h = Mr(r, a, I(c)), d = kn(a.offset);
    return st(Vr(h.isoDate, h.time, "option", d, i, u, l, !1), i, r);
  }
  withPlainTime(t = void 0) {
    b(this, L);
    const n = m(this, S), r = m(this, M), i = te(this).isoDate;
    let o;
    return o = t === void 0 ? $e(n, i) : ct(n, P(i, m(ke(t), G)), "compatible"), st(o, n, r);
  }
  withTimeZone(t) {
    b(this, L);
    const n = Tt(t);
    return st(m(this, $), n, m(this, M));
  }
  withCalendar(t) {
    b(this, L);
    const n = xr(t);
    return st(m(this, $), m(this, S), n);
  }
  add(t, n = void 0) {
    return b(this, L), Es("add", this, t, n);
  }
  subtract(t, n = void 0) {
    return b(this, L), Es("subtract", this, t, n);
  }
  until(t, n = void 0) {
    return b(this, L), ys("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, L), ys("since", this, t, n);
  }
  round(t) {
    if (b(this, L), t === void 0) throw new TypeError("options parameter is required");
    const n = typeof t == "string" ? Ve("smallestUnit", t) : D(t), r = $n(n), i = Qt(n, "halfExpand"), o = At(n, "smallestUnit", "time", Ee, ["day"]), s = { day: 1, hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[o];
    if (An(r, s, s === 1), o === "nanosecond" && r === 1) return st(m(this, $), m(this, S), m(this, M));
    const a = m(this, S), c = m(this, $), u = te(this);
    let l;
    if (o === "day") {
      const h = u.isoDate, d = Nt(h.year, h.month, h.day + 1), g = $e(a, h), p = $e(a, d), w = f.subtract(p, g);
      l = O.fromEpochNsDiff(c, g).round(w, i).addToEpochNs(g);
    } else {
      const h = to(u, r, o, i), d = ve(a, c);
      l = Vr(h.isoDate, h.time, "option", d, a, "compatible", "prefer", !1);
    }
    return st(l, a, m(this, M));
  }
  equals(t) {
    b(this, L);
    const n = Hn(t), r = m(this, $), i = m(n, $);
    return !!f.equal(f.BigInt(r), f.BigInt(i)) && !!Aa(m(this, S), m(n, S)) && ce(m(this, M), m(n, M));
  }
  toString(t = void 0) {
    b(this, L);
    const n = D(t), r = vr(n), i = br(n), o = (function(d) {
      return Te(d, "offset", ["auto", "never"], "auto");
    })(n), s = Qt(n, "trunc"), a = At(n, "smallestUnit", "time", void 0);
    if (a === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const c = (function(d) {
      return Te(d, "timeZoneName", ["auto", "never", "critical"], "auto");
    })(n), { precision: u, unit: l, increment: h } = _r(a, i);
    return cs(this, u, r, c, o, { unit: l, increment: h, roundingMode: s });
  }
  toLocaleString(t = void 0, n = void 0) {
    b(this, L);
    const r = D(n), i = /* @__PURE__ */ Object.create(null);
    if ((function(c, u, l, h) {
      if (u == null) return;
      const d = Reflect.ownKeys(u);
      for (let g = 0; g < d.length; g++) {
        const p = d[g];
        if (!l.some(((w) => Object.is(w, p))) && Object.prototype.propertyIsEnumerable.call(u, p)) {
          const w = u[p];
          c[p] = w;
        }
      }
    })(i, r, ["timeZone"]), r.timeZone !== void 0) throw new TypeError("ZonedDateTime toLocaleString does not accept a timeZone option");
    if (i.year === void 0 && i.month === void 0 && i.day === void 0 && i.era === void 0 && i.weekday === void 0 && i.dateStyle === void 0 && i.hour === void 0 && i.minute === void 0 && i.second === void 0 && i.fractionalSecondDigits === void 0 && i.timeStyle === void 0 && i.dayPeriod === void 0 && i.timeZoneName === void 0 && (i.timeZoneName = "short"), i.timeZone = m(this, S), us(i.timeZone)) throw new RangeError("toLocaleString does not currently support offset time zones");
    const o = new jt(t, i), s = Fu.call(o).calendar, a = m(this, M);
    if (a !== "iso8601" && s !== "iso8601" && !ce(s, a)) throw new RangeError(`cannot format ZonedDateTime with calendar ${a} in locale with calendar ${s}`);
    return o.format(re(m(this, $)));
  }
  toJSON() {
    return b(this, L), cs(this, "auto");
  }
  valueOf() {
    Pe("ZonedDateTime");
  }
  startOfDay() {
    b(this, L);
    const t = m(this, S);
    return st($e(t, te(this).isoDate), t, m(this, M));
  }
  getTimeZoneTransition(t) {
    b(this, L);
    const n = m(this, S);
    if (t === void 0) throw new TypeError("options parameter is required");
    const r = Te(typeof t == "string" ? Ve("direction", t) : D(t), "direction", ["next", "previous"], Ee);
    if (r === void 0) throw new TypeError("direction option is required");
    if (us(n) || n === "UTC") return null;
    const i = m(this, $), o = r === "next" ? Mo(n, i) : Ki(n, i);
    return o === null ? null : st(o, n, m(this, M));
  }
  toInstant() {
    return b(this, L), re(m(this, $));
  }
  toPlainDate() {
    return b(this, L), _t(te(this).isoDate, m(this, M));
  }
  toPlainTime() {
    return b(this, L), we(te(this).time);
  }
  toPlainDateTime() {
    return b(this, L), St(te(this), m(this, M));
  }
  static from(t, n = void 0) {
    return Hn(t, n);
  }
  static compare(t, n) {
    const r = Hn(t), i = Hn(n), o = m(r, $), s = m(i, $);
    return f.lessThan(f.BigInt(o), f.BigInt(s)) ? -1 : f.greaterThan(f.BigInt(o), f.BigInt(s)) ? 1 : 0;
  }
}
function te(e) {
  return Ft(m(e, S), m(e, $));
}
function ht(e, t) {
  b(e, L);
  const n = te(e).isoDate;
  return Tr(e).isoToDate(n, { [t]: !0 })[t];
}
function sn(e, t) {
  return b(e, L), te(e).time[t];
}
Ce(Io, "Temporal.ZonedDateTime");
var Hu = Object.freeze({ __proto__: null, Duration: Mn, Instant: No, Now: ec, PlainDate: Ro, PlainDateTime: Lo, PlainMonthDay: Oo, PlainTime: Nr, PlainYearMonth: Yo, ZonedDateTime: Io });
const Zu = [No, Ro, Lo, Mn, Oo, Nr, Yo, Io];
for (const e of Zu) {
  const t = Object.getOwnPropertyDescriptor(e, "prototype");
  (t.configurable || t.enumerable || t.writable) && (t.configurable = !1, t.enumerable = !1, t.writable = !1, Object.defineProperty(e, "prototype", t));
}
function B(e) {
  if (e == null)
    throw new Error('normalizeTime received undefined or null input. Check that all events have a "time" property and all periods have a "startTime" property.');
  if (typeof e == "string") {
    const t = /Z|[+-]\d{2}:\d{2}$/.test(e);
    let n;
    if (t)
      n = Temporal.Instant.from(e);
    else
      try {
        n = Temporal.PlainDateTime.from(e).toZonedDateTime("UTC").toInstant();
      } catch {
        n = Temporal.PlainDate.from(e).toZonedDateTime("UTC").toInstant();
      }
    return jr(n);
  }
  if (e instanceof Temporal.Instant)
    return jr(e);
  if ("year" in e && "era" in e)
    return e.era === "CE" ? e.year : -e.year;
  if ("value" in e && "unit" in e) {
    const t = Temporal.Now.plainDateISO().year;
    return e.unit === "mya" ? -(e.value * 1e6) : t - e.value;
  }
  if ("localTime" in e && "timezone" in e) {
    const t = Temporal.PlainDateTime.from(e.localTime).toZonedDateTime(e.timezone);
    return jr(t.toInstant());
  }
  throw new Error(`Unsupported time input format: ${JSON.stringify(e)}`);
}
function jr(e) {
  const n = e.toZonedDateTimeISO("UTC").year, r = Temporal.ZonedDateTime.from({
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
  }).epochNanoseconds - r.epochNanoseconds, s = e.epochNanoseconds - r.toInstant().epochNanoseconds, a = Number(s) / Number(o);
  return n + a;
}
function _m(e, t) {
  if (e < -1e6)
    return `${(Math.abs(e) / 1e6).toFixed(1)} MYA`;
  if (e < -1e4)
    return `${(Math.abs(e) / 1e3).toFixed(1)} KYA`;
  if (e < 0)
    return `${Math.abs(Math.floor(e))} BCE`;
  if (e < 1e3)
    return `${Math.floor(e)} CE`;
  {
    const n = Math.floor(e);
    return t === "precise" ? qu(e).toString() : t === "historical" ? `${n} CE` : n.toString();
  }
}
function qu(e) {
  const t = Math.floor(e), n = e - t, r = Temporal.ZonedDateTime.from({
    year: t,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    timeZone: "UTC"
  }), o = Temporal.ZonedDateTime.from({
    year: t + 1,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    timeZone: "UTC"
  }).epochNanoseconds - r.epochNanoseconds, s = BigInt(Math.round(n * Number(o))), a = r.epochNanoseconds + s;
  return Temporal.Instant.fromEpochNanoseconds(a);
}
function Tm(e, t) {
  const n = t - e;
  return n > 1e6 || e < -1e6 ? "geological" : n > 1e4 || e < -1e4 ? "prehistoric" : n > 1e3 ? "historical" : n > 1 ? "modern" : "precise";
}
function nc() {
  return jr(Temporal.Now.instant());
}
function Cs(e) {
  return e.endTime === void 0 || e.endTime === null;
}
function hr(e, t = !1) {
  return e == null ? t ? 1 / 0 : nc() : B(e);
}
function Xu(e, t) {
  const n = /* @__PURE__ */ new Map();
  e.forEach((y) => {
    n.set(y.id, {
      name: y.name,
      startTime: B(y.startTime),
      endTime: hr(y.endTime, !0)
      // true = use Infinity for ongoing periods
    });
  });
  const r = t.filter((y) => y.type === "defined"), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  r.forEach((y) => {
    i.has(y.fromId) || i.set(y.fromId, []), i.get(y.fromId).push(y.toId), o.has(y.toId) || o.set(y.toId, []), o.get(y.toId).push(y.fromId);
  });
  const s = [];
  (/* @__PURE__ */ new Set([
    ...r.map((y) => y.fromId),
    ...r.map((y) => y.toId)
  ])).forEach((y) => {
    o.has(y) || s.push(y);
  });
  const c = /* @__PURE__ */ new Map();
  function u(y) {
    const v = /* @__PURE__ */ new Set();
    let _ = [y];
    for (; _.length > 0; ) {
      const T = [];
      for (const x of _) {
        if (v.has(x)) continue;
        v.add(x);
        const E = o.get(x) || [];
        if (E.length === 0) {
          const N = n.get(x);
          if (N)
            return { rootId: x, rootStartTime: N.startTime };
        } else
          T.push(...E);
      }
      _ = T;
    }
    return null;
  }
  o.forEach((y, v) => {
    if (y.length > 1) {
      let _ = null;
      for (const T of y) {
        const x = u(T);
        x && (!_ || x.rootStartTime < _.rootStartTime) && (_ = x);
      }
      _ && c.set(v, _.rootId);
    }
  });
  const l = /* @__PURE__ */ new Set();
  function h(y, v) {
    const _ = n.get(y);
    if (!_ || c.has(y) && c.get(y) !== v || l.has(y))
      return null;
    l.add(y);
    const T = {
      id: y,
      name: _.name,
      startTime: _.startTime,
      endTime: _.endTime,
      children: []
    }, x = i.get(y) || [];
    for (const E of x) {
      const N = h(E, v);
      N && T.children.push(N);
    }
    return T.children.sort((E, N) => E.startTime - N.startTime), T;
  }
  const d = [], g = /* @__PURE__ */ new Set();
  function p(y, v) {
    v.add(y.id), y.children.forEach((_) => p(_, v));
  }
  for (const y of s) {
    l.clear();
    const v = h(y, y);
    if (v) {
      const _ = /* @__PURE__ */ new Set();
      p(v, _), d.push({ root: v, allNodeIds: _ }), _.forEach((T) => g.add(T));
    }
  }
  d.sort((y, v) => y.root.startTime - v.root.startTime);
  const w = /* @__PURE__ */ new Map();
  return n.forEach((y, v) => {
    g.has(v) || w.set(v, y);
  }), { trees: d, unconnectedPeriods: w, periodMap: n };
}
function io(e) {
  let t = e.endTime;
  for (const n of e.children) {
    const r = io(n);
    r > t && (t = r);
  }
  return t;
}
function Po(e) {
  const t = [e], n = e.children.filter((a) => a.startTime >= e.endTime);
  if (n.length === 0)
    return t;
  let r = n[0], i = r.startTime, o = io(r);
  for (let a = 1; a < n.length; a++) {
    const c = n[a], u = io(c);
    c.startTime < i ? (r = c, i = c.startTime, o = u) : c.startTime === i && u > o && (r = c, o = u);
  }
  const s = Po(r);
  return t.push(...s), t;
}
function Wu(e) {
  const t = new Set(e.map((r) => r.id)), n = [];
  for (const r of e)
    for (const i of r.children)
      if (!t.has(i.id)) {
        const o = Po(i);
        n.push(o);
      }
  return n;
}
function Gu(e, t, n, r) {
  return e < r && n < t;
}
function rc(e, t, n, r) {
  const i = r.find(
    (o) => o.lane === n && Gu(e, t, o.startTime, o.endTime)
  );
  return i ? i.id : null;
}
function $s(e, t, n, r) {
  for (const i of e) {
    const o = rc(i.startTime, i.endTime, t, n);
    if (o)
      return r.get(o), !1;
  }
  return !0;
}
function Yi(e, t, n) {
  for (const r of e)
    n.push({
      id: r.id,
      lane: t,
      startTime: r.startTime,
      endTime: r.endTime
    });
}
function Vu(e, t, n, r) {
  const i = [], o = Po(e.root);
  let s = t;
  const a = 100;
  let c = 0;
  for (; c < a; ) {
    if (s < 0) {
      s = 0, c++;
      continue;
    }
    const w = [...n, ...i];
    if ($s(o, s, w, r)) {
      Yi(o, s, i);
      break;
    }
    s++, c++;
  }
  const u = [{ trunk: o, parentLane: s, isAboveParent: null }], l = /* @__PURE__ */ new Map();
  l.set(o[0].id, s);
  let h = 0;
  for (; h < u.length; ) {
    const { trunk: w, parentLane: y, isAboveParent: v } = u[h], _ = v === null, T = Wu(w);
    T.length > 0;
    let x = 1, E = 1, N = _ ? !0 : v;
    for (let F = 0; F < T.length; F++) {
      const U = T[F], j = U[0].id;
      let H, C = !1;
      for (c = 0; !C && c < a; ) {
        if (N ? H = y + x : H = y - E, H < 0) {
          s++, i.length = 0, Yi(o, s, i), u.length = 1, u[0] = { trunk: o, parentLane: s, isAboveParent: null }, l.clear(), l.set(o[0].id, s), h = -1;
          break;
        }
        const Y = [...n, ...i];
        if ($s(U, H, Y, r)) {
          Yi(U, H, i), C = !0, l.set(j, H);
          const z = H > y;
          u.push({ trunk: U, parentLane: H, isAboveParent: z }), N ? x++ : E++, _ && (N = !N);
        } else
          N ? x++ : E++;
        c++;
      }
    }
    h++;
  }
  const d = i.map((w) => w.lane), g = d.length > 0 ? Math.min(...d) : s, p = d.length > 0 ? Math.max(...d) : s;
  return { placements: i, minLane: g, maxLane: p };
}
function Ku(e, t) {
  const n = [], r = Array.from(e.entries()).sort((i, o) => i[1].startTime - o[1].startTime);
  for (const [i, o] of r) {
    let s = 0;
    const a = [...t, ...n];
    for (; rc(o.startTime, o.endTime, s, a); )
      s++;
    n.push({
      id: i,
      lane: s,
      startTime: o.startTime,
      endTime: o.endTime
    });
  }
  return n;
}
const Qu = {
  name: "Succession-based",
  description: "Periods that succeed each other are placed on the same row",
  layout(e, t = []) {
    if (e.length === 0)
      return [];
    const { trees: n, unconnectedPeriods: r, periodMap: i } = Xu(e, t);
    n.forEach((u, l) => {
    });
    const o = [];
    let s = 0;
    for (let u = 0; u < n.length; u++) {
      const l = n[u], { placements: h, maxLane: d } = Vu(l, s, o, i);
      o.push(...h), s = d + 1;
    }
    const a = Ku(r, o);
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
function ic(e, t) {
  return e < t;
}
function Bu(e, t) {
  const n = [1, 0, 2];
  for (const o of n)
    if (!ic(e, t[o]))
      return o;
  let r = 1, i = t[1];
  for (let o = 0; o < 3; o++)
    t[o] < i && (r = o, i = t[o]);
  return r;
}
function Ju(e, t = 0, n = []) {
  const r = [], i = /* @__PURE__ */ new Map();
  for (const l of n)
    i.set(l.itemId, l.lane);
  const o = [], s = [];
  for (const l of e)
    l.relates_to && i.has(l.relates_to) ? o.push(l) : s.push(l);
  const a = /* @__PURE__ */ new Map();
  for (const l of o) {
    const h = i.get(l.relates_to), d = B(l.time);
    a.has(h) || a.set(h, []), a.get(h).push({ event: l, time: d });
  }
  for (const [l, h] of a) {
    h.sort((g, p) => g.time - p.time);
    const d = [-1 / 0, -1 / 0, -1 / 0];
    for (const { event: g, time: p } of h) {
      const w = Bu(p, d);
      d[w] = p, r.push({
        itemId: g.id,
        lane: l,
        startTime: p,
        endTime: p,
        type: "event",
        subLane: w
      });
    }
  }
  const c = s.map((l) => {
    const h = B(l.time);
    return {
      id: l.id,
      time: h
    };
  });
  c.sort((l, h) => l.time - h.time);
  const u = [];
  for (const l of c) {
    let h = -1;
    for (let d = 0; d < Math.min(u.length, 3); d++)
      if (!ic(l.time, u[d].endTime)) {
        h = d;
        break;
      }
    if (h === -1 && u.length < 3)
      h = u.length, u.push({ endTime: l.time });
    else if (h === -1) {
      let d = 0, g = u[0].endTime;
      for (let p = 1; p < 3; p++)
        u[p].endTime < g && (d = p, g = u[p].endTime);
      h = d, u[h].endTime = l.time;
    } else
      u[h].endTime = l.time;
    r.push({
      itemId: l.id,
      lane: h + t,
      startTime: l.time,
      endTime: l.time,
      type: "event",
      subLane: h
      // For unrelated events, sub-lane matches their lane index (0, 1, or 2)
    });
  }
  return r;
}
const tl = {
  succession: Qu
}, el = "succession";
function nl(e, t, n = el, r = []) {
  const i = tl[n];
  if (!i)
    throw new Error(`Unknown period layout algorithm: ${n}`);
  const o = i.layout(e, r), a = (o.length > 0 ? Math.max(...o.map((u) => u.lane)) : -1) + 1, c = Ju(t, a, o);
  return [...o, ...c];
}
function Mm(e) {
  return e.length === 0 ? 0 : Math.max(...e.map((t) => t.lane)) + 1;
}
const tr = -138e8;
function Em(e) {
  const t = [], n = [], r = [
    ...e.events.map((o) => o.id),
    ...e.periods.map((o) => o.id),
    ...e.connectors.map((o) => o.id)
  ], i = r.filter((o, s) => r.indexOf(o) !== s);
  i.length > 0 && t.push({
    type: "error",
    message: `Duplicate IDs found: ${[...new Set(i)].join(", ")}`
  });
  for (const o of e.periods)
    try {
      const s = B(o.startTime);
      if (!Cs(o)) {
        const c = hr(o.endTime);
        s > c && t.push({
          type: "error",
          message: `Period "${o.name}" has start time after end time`,
          itemId: o.id
        }), c < tr && t.push({
          type: "error",
          message: `Period "${o.name}" ends before the Big Bang (13.8 billion years ago). End time: ${c.toExponential(2)}`,
          itemId: o.id
        });
      }
      s < tr && t.push({
        type: "error",
        message: `Period "${o.name}" starts before the Big Bang (13.8 billion years ago). Start time: ${s.toExponential(2)}`,
        itemId: o.id
      });
    } catch (s) {
      t.push({
        type: "error",
        message: `Period "${o.name}" has invalid time format: ${s instanceof Error ? s.message : String(s)}`,
        itemId: o.id
      });
    }
  for (const o of e.connectors) {
    const s = e.periods.find((c) => c.id === o.fromId), a = e.periods.find((c) => c.id === o.toId);
    if (!s) {
      t.push({
        type: "error",
        message: `Connector "${o.id}" references non-existent period: ${o.fromId}`,
        itemId: o.id
      });
      continue;
    }
    if (!a) {
      t.push({
        type: "error",
        message: `Connector "${o.id}" references non-existent period: ${o.toId}`,
        itemId: o.id
      });
      continue;
    }
    try {
      if (!Cs(a)) {
        const c = B(s.startTime), u = hr(a.endTime);
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
  for (const o of e.events)
    try {
      const s = B(o.time);
      s < tr && t.push({
        type: "error",
        message: `Event "${o.name}" is set before the Big Bang (13.8 billion years ago). Time: ${s.toExponential(2)}`,
        itemId: o.id
      });
    } catch (s) {
      t.push({
        type: "error",
        message: `Event "${o.name}" has invalid time format: ${s instanceof Error ? s.message : String(s)}`,
        itemId: o.id
      });
    }
  return {
    valid: t.length === 0,
    errors: t,
    warnings: n
  };
}
function xm(e) {
  const t = [];
  if (e.valid && e.warnings.length === 0)
    return t.push("✓ Timeline data is valid"), t.join(`
`);
  if (e.errors.length > 0) {
    t.push("✗ Timeline validation failed:"), t.push(""), t.push("Errors:");
    for (const n of e.errors)
      t.push(`  • ${n.message}`);
  }
  if (e.warnings.length > 0) {
    t.length > 0 && t.push(""), t.push("Warnings:");
    for (const n of e.warnings)
      t.push(`  ⚠ ${n.message}`);
  }
  return t.join(`
`);
}
function Ur(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function rl(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function oc(e) {
  let t, n, r;
  e.length !== 2 ? (t = Ur, n = (a, c) => Ur(e(a), c), r = (a, c) => e(a) - c) : (t = e === Ur || e === rl ? e : il, n = e, r = e);
  function i(a, c, u = 0, l = a.length) {
    if (u < l) {
      if (t(c, c) !== 0) return l;
      do {
        const h = u + l >>> 1;
        n(a[h], c) < 0 ? u = h + 1 : l = h;
      } while (u < l);
    }
    return u;
  }
  function o(a, c, u = 0, l = a.length) {
    if (u < l) {
      if (t(c, c) !== 0) return l;
      do {
        const h = u + l >>> 1;
        n(a[h], c) <= 0 ? u = h + 1 : l = h;
      } while (u < l);
    }
    return u;
  }
  function s(a, c, u = 0, l = a.length) {
    const h = i(a, c, u, l - 1);
    return h > u && r(a[h - 1], c) > -r(a[h], c) ? h - 1 : h;
  }
  return { left: i, center: s, right: o };
}
function il() {
  return 0;
}
function ol(e) {
  return e === null ? NaN : +e;
}
const sl = oc(Ur), al = sl.right;
oc(ol).center;
const cl = Math.sqrt(50), ul = Math.sqrt(10), ll = Math.sqrt(2);
function ri(e, t, n) {
  const r = (t - e) / Math.max(0, n), i = Math.floor(Math.log10(r)), o = r / Math.pow(10, i), s = o >= cl ? 10 : o >= ul ? 5 : o >= ll ? 2 : 1;
  let a, c, u;
  return i < 0 ? (u = Math.pow(10, -i) / s, a = Math.round(e * u), c = Math.round(t * u), a / u < e && ++a, c / u > t && --c, u = -u) : (u = Math.pow(10, i) * s, a = Math.round(e / u), c = Math.round(t / u), a * u < e && ++a, c * u > t && --c), c < a && 0.5 <= n && n < 2 ? ri(e, t, n * 2) : [a, c, u];
}
function hl(e, t, n) {
  if (t = +t, e = +e, n = +n, !(n > 0)) return [];
  if (e === t) return [e];
  const r = t < e, [i, o, s] = r ? ri(t, e, n) : ri(e, t, n);
  if (!(o >= i)) return [];
  const a = o - i + 1, c = new Array(a);
  if (r)
    if (s < 0) for (let u = 0; u < a; ++u) c[u] = (o - u) / -s;
    else for (let u = 0; u < a; ++u) c[u] = (o - u) * s;
  else if (s < 0) for (let u = 0; u < a; ++u) c[u] = (i + u) / -s;
  else for (let u = 0; u < a; ++u) c[u] = (i + u) * s;
  return c;
}
function oo(e, t, n) {
  return t = +t, e = +e, n = +n, ri(e, t, n)[2];
}
function dl(e, t, n) {
  t = +t, e = +e, n = +n;
  const r = t < e, i = r ? oo(t, e, n) : oo(e, t, n);
  return (r ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
var fl = { value: () => {
} };
function sc() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new Fr(n);
}
function Fr(e) {
  this._ = e;
}
function ml(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", i = n.indexOf(".");
    if (i >= 0 && (r = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
Fr.prototype = sc.prototype = {
  constructor: Fr,
  on: function(e, t) {
    var n = this._, r = ml(e + "", n), i, o = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++o < s; ) if ((i = (e = r[o]).type) && (i = gl(n[i], e.name))) return i;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++o < s; )
      if (i = (e = r[o]).type) n[i] = As(n[i], e.name, t);
      else if (t == null) for (i in n) n[i] = As(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new Fr(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), r = 0, i, o; r < i; ++r) n[r] = arguments[r + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (o = this._[e], r = 0, i = o.length; r < i; ++r) o[r].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var r = this._[e], i = 0, o = r.length; i < o; ++i) r[i].value.apply(t, n);
  }
};
function gl(e, t) {
  for (var n = 0, r = e.length, i; n < r; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function As(e, t, n) {
  for (var r = 0, i = e.length; r < i; ++r)
    if (e[r].name === t) {
      e[r] = fl, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var so = "http://www.w3.org/1999/xhtml";
const ks = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: so,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Ci(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), ks.hasOwnProperty(t) ? { space: ks[t], local: e } : e;
}
function pl(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === so && t.documentElement.namespaceURI === so ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function yl(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function ac(e) {
  var t = Ci(e);
  return (t.local ? yl : pl)(t);
}
function wl() {
}
function So(e) {
  return e == null ? wl : function() {
    return this.querySelector(e);
  };
}
function vl(e) {
  typeof e != "function" && (e = So(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var o = t[i], s = o.length, a = r[i] = new Array(s), c, u, l = 0; l < s; ++l)
      (c = o[l]) && (u = e.call(c, c.__data__, l, o)) && ("__data__" in c && (u.__data__ = c.__data__), a[l] = u);
  return new Bt(r, this._parents);
}
function bl(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function _l() {
  return [];
}
function cc(e) {
  return e == null ? _l : function() {
    return this.querySelectorAll(e);
  };
}
function Tl(e) {
  return function() {
    return bl(e.apply(this, arguments));
  };
}
function Ml(e) {
  typeof e == "function" ? e = Tl(e) : e = cc(e);
  for (var t = this._groups, n = t.length, r = [], i = [], o = 0; o < n; ++o)
    for (var s = t[o], a = s.length, c, u = 0; u < a; ++u)
      (c = s[u]) && (r.push(e.call(c, c.__data__, u, s)), i.push(c));
  return new Bt(r, i);
}
function uc(e) {
  return function() {
    return this.matches(e);
  };
}
function lc(e) {
  return function(t) {
    return t.matches(e);
  };
}
var El = Array.prototype.find;
function xl(e) {
  return function() {
    return El.call(this.children, e);
  };
}
function Dl() {
  return this.firstElementChild;
}
function Cl(e) {
  return this.select(e == null ? Dl : xl(typeof e == "function" ? e : lc(e)));
}
var $l = Array.prototype.filter;
function Al() {
  return Array.from(this.children);
}
function kl(e) {
  return function() {
    return $l.call(this.children, e);
  };
}
function Nl(e) {
  return this.selectAll(e == null ? Al : kl(typeof e == "function" ? e : lc(e)));
}
function Rl(e) {
  typeof e != "function" && (e = uc(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var o = t[i], s = o.length, a = r[i] = [], c, u = 0; u < s; ++u)
      (c = o[u]) && e.call(c, c.__data__, u, o) && a.push(c);
  return new Bt(r, this._parents);
}
function hc(e) {
  return new Array(e.length);
}
function Ll() {
  return new Bt(this._enter || this._groups.map(hc), this._parents);
}
function ii(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
ii.prototype = {
  constructor: ii,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Ol(e) {
  return function() {
    return e;
  };
}
function Yl(e, t, n, r, i, o) {
  for (var s = 0, a, c = t.length, u = o.length; s < u; ++s)
    (a = t[s]) ? (a.__data__ = o[s], r[s] = a) : n[s] = new ii(e, o[s]);
  for (; s < c; ++s)
    (a = t[s]) && (i[s] = a);
}
function Il(e, t, n, r, i, o, s) {
  var a, c, u = /* @__PURE__ */ new Map(), l = t.length, h = o.length, d = new Array(l), g;
  for (a = 0; a < l; ++a)
    (c = t[a]) && (d[a] = g = s.call(c, c.__data__, a, t) + "", u.has(g) ? i[a] = c : u.set(g, c));
  for (a = 0; a < h; ++a)
    g = s.call(e, o[a], a, o) + "", (c = u.get(g)) ? (r[a] = c, c.__data__ = o[a], u.delete(g)) : n[a] = new ii(e, o[a]);
  for (a = 0; a < l; ++a)
    (c = t[a]) && u.get(d[a]) === c && (i[a] = c);
}
function Pl(e) {
  return e.__data__;
}
function Sl(e, t) {
  if (!arguments.length) return Array.from(this, Pl);
  var n = t ? Il : Yl, r = this._parents, i = this._groups;
  typeof e != "function" && (e = Ol(e));
  for (var o = i.length, s = new Array(o), a = new Array(o), c = new Array(o), u = 0; u < o; ++u) {
    var l = r[u], h = i[u], d = h.length, g = zl(e.call(l, l && l.__data__, u, r)), p = g.length, w = a[u] = new Array(p), y = s[u] = new Array(p), v = c[u] = new Array(d);
    n(l, h, w, y, v, g, t);
    for (var _ = 0, T = 0, x, E; _ < p; ++_)
      if (x = w[_]) {
        for (_ >= T && (T = _ + 1); !(E = y[T]) && ++T < p; ) ;
        x._next = E || null;
      }
  }
  return s = new Bt(s, r), s._enter = a, s._exit = c, s;
}
function zl(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function jl() {
  return new Bt(this._exit || this._groups.map(hc), this._parents);
}
function Ul(e, t, n) {
  var r = this.enter(), i = this, o = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? o.remove() : n(o), r && i ? r.merge(i).order() : i;
}
function Fl(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, o = r.length, s = Math.min(i, o), a = new Array(i), c = 0; c < s; ++c)
    for (var u = n[c], l = r[c], h = u.length, d = a[c] = new Array(h), g, p = 0; p < h; ++p)
      (g = u[p] || l[p]) && (d[p] = g);
  for (; c < i; ++c)
    a[c] = n[c];
  return new Bt(a, this._parents);
}
function Hl() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], i = r.length - 1, o = r[i], s; --i >= 0; )
      (s = r[i]) && (o && s.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(s, o), o = s);
  return this;
}
function Zl(e) {
  e || (e = ql);
  function t(h, d) {
    return h && d ? e(h.__data__, d.__data__) : !h - !d;
  }
  for (var n = this._groups, r = n.length, i = new Array(r), o = 0; o < r; ++o) {
    for (var s = n[o], a = s.length, c = i[o] = new Array(a), u, l = 0; l < a; ++l)
      (u = s[l]) && (c[l] = u);
    c.sort(t);
  }
  return new Bt(i, this._parents).order();
}
function ql(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Xl() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Wl() {
  return Array.from(this);
}
function Gl() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], i = 0, o = r.length; i < o; ++i) {
      var s = r[i];
      if (s) return s;
    }
  return null;
}
function Vl() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Kl() {
  return !this.node();
}
function Ql(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var i = t[n], o = 0, s = i.length, a; o < s; ++o)
      (a = i[o]) && e.call(a, a.__data__, o, i);
  return this;
}
function Bl(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Jl(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function th(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function eh(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function nh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function rh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function ih(e, t) {
  var n = Ci(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Jl : Bl : typeof t == "function" ? n.local ? rh : nh : n.local ? eh : th)(n, t));
}
function dc(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function oh(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function sh(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function ah(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function ch(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? oh : typeof t == "function" ? ah : sh)(e, t, n ?? "")) : En(this.node(), e);
}
function En(e, t) {
  return e.style.getPropertyValue(t) || dc(e).getComputedStyle(e, null).getPropertyValue(t);
}
function uh(e) {
  return function() {
    delete this[e];
  };
}
function lh(e, t) {
  return function() {
    this[e] = t;
  };
}
function hh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function dh(e, t) {
  return arguments.length > 1 ? this.each((t == null ? uh : typeof t == "function" ? hh : lh)(e, t)) : this.node()[e];
}
function fc(e) {
  return e.trim().split(/^|\s+/);
}
function zo(e) {
  return e.classList || new mc(e);
}
function mc(e) {
  this._node = e, this._names = fc(e.getAttribute("class") || "");
}
mc.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function gc(e, t) {
  for (var n = zo(e), r = -1, i = t.length; ++r < i; ) n.add(t[r]);
}
function pc(e, t) {
  for (var n = zo(e), r = -1, i = t.length; ++r < i; ) n.remove(t[r]);
}
function fh(e) {
  return function() {
    gc(this, e);
  };
}
function mh(e) {
  return function() {
    pc(this, e);
  };
}
function gh(e, t) {
  return function() {
    (t.apply(this, arguments) ? gc : pc)(this, e);
  };
}
function ph(e, t) {
  var n = fc(e + "");
  if (arguments.length < 2) {
    for (var r = zo(this.node()), i = -1, o = n.length; ++i < o; ) if (!r.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? gh : t ? fh : mh)(n, t));
}
function yh() {
  this.textContent = "";
}
function wh(e) {
  return function() {
    this.textContent = e;
  };
}
function vh(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function bh(e) {
  return arguments.length ? this.each(e == null ? yh : (typeof e == "function" ? vh : wh)(e)) : this.node().textContent;
}
function _h() {
  this.innerHTML = "";
}
function Th(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Mh(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Eh(e) {
  return arguments.length ? this.each(e == null ? _h : (typeof e == "function" ? Mh : Th)(e)) : this.node().innerHTML;
}
function xh() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Dh() {
  return this.each(xh);
}
function Ch() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function $h() {
  return this.each(Ch);
}
function Ah(e) {
  var t = typeof e == "function" ? e : ac(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function kh() {
  return null;
}
function Nh(e, t) {
  var n = typeof e == "function" ? e : ac(e), r = t == null ? kh : typeof t == "function" ? t : So(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function Rh() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Lh() {
  return this.each(Rh);
}
function Oh() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Yh() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Ih(e) {
  return this.select(e ? Yh : Oh);
}
function Ph(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Sh(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function zh(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function jh(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, i = t.length, o; n < i; ++n)
        o = t[n], (!e.type || o.type === e.type) && o.name === e.name ? this.removeEventListener(o.type, o.listener, o.options) : t[++r] = o;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function Uh(e, t, n) {
  return function() {
    var r = this.__on, i, o = Sh(t);
    if (r) {
      for (var s = 0, a = r.length; s < a; ++s)
        if ((i = r[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = o, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, o, n), i = { type: e.type, name: e.name, value: t, listener: o, options: n }, r ? r.push(i) : this.__on = [i];
  };
}
function Fh(e, t, n) {
  var r = zh(e + ""), i, o = r.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var c = 0, u = a.length, l; c < u; ++c)
        for (i = 0, l = a[c]; i < o; ++i)
          if ((s = r[i]).type === l.type && s.name === l.name)
            return l.value;
    }
    return;
  }
  for (a = t ? Uh : jh, i = 0; i < o; ++i) this.each(a(r[i], t, n));
  return this;
}
function yc(e, t, n) {
  var r = dc(e), i = r.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Hh(e, t) {
  return function() {
    return yc(this, e, t);
  };
}
function Zh(e, t) {
  return function() {
    return yc(this, e, t.apply(this, arguments));
  };
}
function qh(e, t) {
  return this.each((typeof t == "function" ? Zh : Hh)(e, t));
}
function* Xh() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], i = 0, o = r.length, s; i < o; ++i)
      (s = r[i]) && (yield s);
}
var Wh = [null];
function Bt(e, t) {
  this._groups = e, this._parents = t;
}
function Rr() {
  return new Bt([[document.documentElement]], Wh);
}
function Gh() {
  return this;
}
Bt.prototype = Rr.prototype = {
  constructor: Bt,
  select: vl,
  selectAll: Ml,
  selectChild: Cl,
  selectChildren: Nl,
  filter: Rl,
  data: Sl,
  enter: Ll,
  exit: jl,
  join: Ul,
  merge: Fl,
  selection: Gh,
  order: Hl,
  sort: Zl,
  call: Xl,
  nodes: Wl,
  node: Gl,
  size: Vl,
  empty: Kl,
  each: Ql,
  attr: ih,
  style: ch,
  property: dh,
  classed: ph,
  text: bh,
  html: Eh,
  raise: Dh,
  lower: $h,
  append: Ah,
  insert: Nh,
  remove: Lh,
  clone: Ih,
  datum: Ph,
  on: Fh,
  dispatch: qh,
  [Symbol.iterator]: Xh
};
function jo(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function wc(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function Lr() {
}
var dr = 0.7, oi = 1 / dr, gn = "\\s*([+-]?\\d+)\\s*", fr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", ae = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Vh = /^#([0-9a-f]{3,8})$/, Kh = new RegExp(`^rgb\\(${gn},${gn},${gn}\\)$`), Qh = new RegExp(`^rgb\\(${ae},${ae},${ae}\\)$`), Bh = new RegExp(`^rgba\\(${gn},${gn},${gn},${fr}\\)$`), Jh = new RegExp(`^rgba\\(${ae},${ae},${ae},${fr}\\)$`), td = new RegExp(`^hsl\\(${fr},${ae},${ae}\\)$`), ed = new RegExp(`^hsla\\(${fr},${ae},${ae},${fr}\\)$`), Ns = {
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
jo(Lr, Qe, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Rs,
  // Deprecated! Use color.formatHex.
  formatHex: Rs,
  formatHex8: nd,
  formatHsl: rd,
  formatRgb: Ls,
  toString: Ls
});
function Rs() {
  return this.rgb().formatHex();
}
function nd() {
  return this.rgb().formatHex8();
}
function rd() {
  return vc(this).formatHsl();
}
function Ls() {
  return this.rgb().formatRgb();
}
function Qe(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Vh.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Os(t) : n === 3 ? new kt(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Yr(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Yr(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Kh.exec(e)) ? new kt(t[1], t[2], t[3], 1) : (t = Qh.exec(e)) ? new kt(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = Bh.exec(e)) ? Yr(t[1], t[2], t[3], t[4]) : (t = Jh.exec(e)) ? Yr(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = td.exec(e)) ? Ps(t[1], t[2] / 100, t[3] / 100, 1) : (t = ed.exec(e)) ? Ps(t[1], t[2] / 100, t[3] / 100, t[4]) : Ns.hasOwnProperty(e) ? Os(Ns[e]) : e === "transparent" ? new kt(NaN, NaN, NaN, 0) : null;
}
function Os(e) {
  return new kt(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Yr(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new kt(e, t, n, r);
}
function id(e) {
  return e instanceof Lr || (e = Qe(e)), e ? (e = e.rgb(), new kt(e.r, e.g, e.b, e.opacity)) : new kt();
}
function ao(e, t, n, r) {
  return arguments.length === 1 ? id(e) : new kt(e, t, n, r ?? 1);
}
function kt(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
jo(kt, ao, wc(Lr, {
  brighter(e) {
    return e = e == null ? oi : Math.pow(oi, e), new kt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? dr : Math.pow(dr, e), new kt(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new kt(Ze(this.r), Ze(this.g), Ze(this.b), si(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Ys,
  // Deprecated! Use color.formatHex.
  formatHex: Ys,
  formatHex8: od,
  formatRgb: Is,
  toString: Is
}));
function Ys() {
  return `#${Ue(this.r)}${Ue(this.g)}${Ue(this.b)}`;
}
function od() {
  return `#${Ue(this.r)}${Ue(this.g)}${Ue(this.b)}${Ue((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Is() {
  const e = si(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Ze(this.r)}, ${Ze(this.g)}, ${Ze(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function si(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Ze(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ue(e) {
  return e = Ze(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Ps(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Kt(e, t, n, r);
}
function vc(e) {
  if (e instanceof Kt) return new Kt(e.h, e.s, e.l, e.opacity);
  if (e instanceof Lr || (e = Qe(e)), !e) return new Kt();
  if (e instanceof Kt) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), o = Math.max(t, n, r), s = NaN, a = o - i, c = (o + i) / 2;
  return a ? (t === o ? s = (n - r) / a + (n < r) * 6 : n === o ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= c < 0.5 ? o + i : 2 - o - i, s *= 60) : a = c > 0 && c < 1 ? 0 : s, new Kt(s, a, c, e.opacity);
}
function sd(e, t, n, r) {
  return arguments.length === 1 ? vc(e) : new Kt(e, t, n, r ?? 1);
}
function Kt(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
jo(Kt, sd, wc(Lr, {
  brighter(e) {
    return e = e == null ? oi : Math.pow(oi, e), new Kt(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? dr : Math.pow(dr, e), new Kt(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - r;
    return new kt(
      Ii(e >= 240 ? e - 240 : e + 120, i, r),
      Ii(e, i, r),
      Ii(e < 120 ? e + 240 : e - 120, i, r),
      this.opacity
    );
  },
  clamp() {
    return new Kt(Ss(this.h), Ir(this.s), Ir(this.l), si(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = si(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Ss(this.h)}, ${Ir(this.s) * 100}%, ${Ir(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Ss(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Ir(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Ii(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Uo = (e) => () => e;
function ad(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function cd(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function ud(e) {
  return (e = +e) == 1 ? bc : function(t, n) {
    return n - t ? cd(t, n, e) : Uo(isNaN(t) ? n : t);
  };
}
function bc(e, t) {
  var n = t - e;
  return n ? ad(e, n) : Uo(isNaN(e) ? t : e);
}
const ai = (function e(t) {
  var n = ud(t);
  function r(i, o) {
    var s = n((i = ao(i)).r, (o = ao(o)).r), a = n(i.g, o.g), c = n(i.b, o.b), u = bc(i.opacity, o.opacity);
    return function(l) {
      return i.r = s(l), i.g = a(l), i.b = c(l), i.opacity = u(l), i + "";
    };
  }
  return r.gamma = e, r;
})(1);
function ld(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
  return function(o) {
    for (i = 0; i < n; ++i) r[i] = e[i] * (1 - o) + t[i] * o;
    return r;
  };
}
function hd(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function dd(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = new Array(r), o = new Array(n), s;
  for (s = 0; s < r; ++s) i[s] = Fo(e[s], t[s]);
  for (; s < n; ++s) o[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) o[s] = i[s](a);
    return o;
  };
}
function fd(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Vt(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function md(e, t) {
  var n = {}, r = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = Fo(e[i], t[i]) : r[i] = t[i];
  return function(o) {
    for (i in n) r[i] = n[i](o);
    return r;
  };
}
var co = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Pi = new RegExp(co.source, "g");
function gd(e) {
  return function() {
    return e;
  };
}
function pd(e) {
  return function(t) {
    return e(t) + "";
  };
}
function _c(e, t) {
  var n = co.lastIndex = Pi.lastIndex = 0, r, i, o, s = -1, a = [], c = [];
  for (e = e + "", t = t + ""; (r = co.exec(e)) && (i = Pi.exec(t)); )
    (o = i.index) > n && (o = t.slice(n, o), a[s] ? a[s] += o : a[++s] = o), (r = r[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, c.push({ i: s, x: Vt(r, i) })), n = Pi.lastIndex;
  return n < t.length && (o = t.slice(n), a[s] ? a[s] += o : a[++s] = o), a.length < 2 ? c[0] ? pd(c[0].x) : gd(t) : (t = c.length, function(u) {
    for (var l = 0, h; l < t; ++l) a[(h = c[l]).i] = h.x(u);
    return a.join("");
  });
}
function Fo(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Uo(t) : (n === "number" ? Vt : n === "string" ? (r = Qe(t)) ? (t = r, ai) : _c : t instanceof Qe ? ai : t instanceof Date ? fd : hd(t) ? ld : Array.isArray(t) ? dd : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? md : Vt)(e, t);
}
function yd(e, t) {
  return e = +e, t = +t, function(n) {
    return Math.round(e * (1 - n) + t * n);
  };
}
var zs = 180 / Math.PI, uo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Tc(e, t, n, r, i, o) {
  var s, a, c;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (c = e * n + t * r) && (n -= e * c, r -= t * c), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, c /= a), e * r < t * n && (e = -e, t = -t, c = -c, s = -s), {
    translateX: i,
    translateY: o,
    rotate: Math.atan2(t, e) * zs,
    skewX: Math.atan(c) * zs,
    scaleX: s,
    scaleY: a
  };
}
var Pr;
function wd(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? uo : Tc(t.a, t.b, t.c, t.d, t.e, t.f);
}
function vd(e) {
  return e == null || (Pr || (Pr = document.createElementNS("http://www.w3.org/2000/svg", "g")), Pr.setAttribute("transform", e), !(e = Pr.transform.baseVal.consolidate())) ? uo : (e = e.matrix, Tc(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Mc(e, t, n, r) {
  function i(u) {
    return u.length ? u.pop() + " " : "";
  }
  function o(u, l, h, d, g, p) {
    if (u !== h || l !== d) {
      var w = g.push("translate(", null, t, null, n);
      p.push({ i: w - 4, x: Vt(u, h) }, { i: w - 2, x: Vt(l, d) });
    } else (h || d) && g.push("translate(" + h + t + d + n);
  }
  function s(u, l, h, d) {
    u !== l ? (u - l > 180 ? l += 360 : l - u > 180 && (u += 360), d.push({ i: h.push(i(h) + "rotate(", null, r) - 2, x: Vt(u, l) })) : l && h.push(i(h) + "rotate(" + l + r);
  }
  function a(u, l, h, d) {
    u !== l ? d.push({ i: h.push(i(h) + "skewX(", null, r) - 2, x: Vt(u, l) }) : l && h.push(i(h) + "skewX(" + l + r);
  }
  function c(u, l, h, d, g, p) {
    if (u !== h || l !== d) {
      var w = g.push(i(g) + "scale(", null, ",", null, ")");
      p.push({ i: w - 4, x: Vt(u, h) }, { i: w - 2, x: Vt(l, d) });
    } else (h !== 1 || d !== 1) && g.push(i(g) + "scale(" + h + "," + d + ")");
  }
  return function(u, l) {
    var h = [], d = [];
    return u = e(u), l = e(l), o(u.translateX, u.translateY, l.translateX, l.translateY, h, d), s(u.rotate, l.rotate, h, d), a(u.skewX, l.skewX, h, d), c(u.scaleX, u.scaleY, l.scaleX, l.scaleY, h, d), u = l = null, function(g) {
      for (var p = -1, w = d.length, y; ++p < w; ) h[(y = d[p]).i] = y.x(g);
      return h.join("");
    };
  };
}
var bd = Mc(wd, "px, ", "px)", "deg)"), _d = Mc(vd, ", ", ")", ")"), xn = 0, qn = 0, In = 0, Ec = 1e3, ci, Xn, ui = 0, Be = 0, $i = 0, mr = typeof performance == "object" && performance.now ? performance : Date, xc = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Ho() {
  return Be || (xc(Td), Be = mr.now() + $i);
}
function Td() {
  Be = 0;
}
function li() {
  this._call = this._time = this._next = null;
}
li.prototype = Dc.prototype = {
  constructor: li,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Ho() : +n) + (t == null ? 0 : +t), !this._next && Xn !== this && (Xn ? Xn._next = this : ci = this, Xn = this), this._call = e, this._time = n, lo();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, lo());
  }
};
function Dc(e, t, n) {
  var r = new li();
  return r.restart(e, t, n), r;
}
function Md() {
  Ho(), ++xn;
  for (var e = ci, t; e; )
    (t = Be - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --xn;
}
function js() {
  Be = (ui = mr.now()) + $i, xn = qn = 0;
  try {
    Md();
  } finally {
    xn = 0, xd(), Be = 0;
  }
}
function Ed() {
  var e = mr.now(), t = e - ui;
  t > Ec && ($i -= t, ui = e);
}
function xd() {
  for (var e, t = ci, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : ci = n);
  Xn = e, lo(r);
}
function lo(e) {
  if (!xn) {
    qn && (qn = clearTimeout(qn));
    var t = e - Be;
    t > 24 ? (e < 1 / 0 && (qn = setTimeout(js, e - mr.now() - $i)), In && (In = clearInterval(In))) : (In || (ui = mr.now(), In = setInterval(Ed, Ec)), xn = 1, xc(js));
  }
}
function Us(e, t, n) {
  var r = new li();
  return t = t == null ? 0 : +t, r.restart((i) => {
    r.stop(), e(i + t);
  }, t, n), r;
}
var Dd = sc("start", "end", "cancel", "interrupt"), Cd = [], Cc = 0, Fs = 1, ho = 2, Hr = 3, Hs = 4, fo = 5, Zr = 6;
function Ai(e, t, n, r, i, o) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  $d(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Dd,
    tween: Cd,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: Cc
  });
}
function Zo(e, t) {
  var n = Jt(e, t);
  if (n.state > Cc) throw new Error("too late; already scheduled");
  return n;
}
function de(e, t) {
  var n = Jt(e, t);
  if (n.state > Hr) throw new Error("too late; already running");
  return n;
}
function Jt(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function $d(e, t, n) {
  var r = e.__transition, i;
  r[t] = n, n.timer = Dc(o, 0, n.time);
  function o(u) {
    n.state = Fs, n.timer.restart(s, n.delay, n.time), n.delay <= u && s(u - n.delay);
  }
  function s(u) {
    var l, h, d, g;
    if (n.state !== Fs) return c();
    for (l in r)
      if (g = r[l], g.name === n.name) {
        if (g.state === Hr) return Us(s);
        g.state === Hs ? (g.state = Zr, g.timer.stop(), g.on.call("interrupt", e, e.__data__, g.index, g.group), delete r[l]) : +l < t && (g.state = Zr, g.timer.stop(), g.on.call("cancel", e, e.__data__, g.index, g.group), delete r[l]);
      }
    if (Us(function() {
      n.state === Hr && (n.state = Hs, n.timer.restart(a, n.delay, n.time), a(u));
    }), n.state = ho, n.on.call("start", e, e.__data__, n.index, n.group), n.state === ho) {
      for (n.state = Hr, i = new Array(d = n.tween.length), l = 0, h = -1; l < d; ++l)
        (g = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (i[++h] = g);
      i.length = h + 1;
    }
  }
  function a(u) {
    for (var l = u < n.duration ? n.ease.call(null, u / n.duration) : (n.timer.restart(c), n.state = fo, 1), h = -1, d = i.length; ++h < d; )
      i[h].call(e, l);
    n.state === fo && (n.on.call("end", e, e.__data__, n.index, n.group), c());
  }
  function c() {
    n.state = Zr, n.timer.stop(), delete r[t];
    for (var u in r) return;
    delete e.__transition;
  }
}
function Ad(e, t) {
  var n = e.__transition, r, i, o = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        o = !1;
        continue;
      }
      i = r.state > ho && r.state < fo, r.state = Zr, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    o && delete e.__transition;
  }
}
function kd(e) {
  return this.each(function() {
    Ad(this, e);
  });
}
function Nd(e, t) {
  var n, r;
  return function() {
    var i = de(this, e), o = i.tween;
    if (o !== n) {
      r = n = o;
      for (var s = 0, a = r.length; s < a; ++s)
        if (r[s].name === t) {
          r = r.slice(), r.splice(s, 1);
          break;
        }
    }
    i.tween = r;
  };
}
function Rd(e, t, n) {
  var r, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var o = de(this, e), s = o.tween;
    if (s !== r) {
      i = (r = s).slice();
      for (var a = { name: t, value: n }, c = 0, u = i.length; c < u; ++c)
        if (i[c].name === t) {
          i[c] = a;
          break;
        }
      c === u && i.push(a);
    }
    o.tween = i;
  };
}
function Ld(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = Jt(this.node(), n).tween, i = 0, o = r.length, s; i < o; ++i)
      if ((s = r[i]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? Nd : Rd)(n, e, t));
}
function qo(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var i = de(this, r);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return Jt(i, r).value[t];
  };
}
function $c(e, t) {
  var n;
  return (typeof t == "number" ? Vt : t instanceof Qe ? ai : (n = Qe(t)) ? (t = n, ai) : _c)(e, t);
}
function Od(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Yd(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Id(e, t, n) {
  var r, i = n + "", o;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === r ? o : o = t(r = s, n);
  };
}
function Pd(e, t, n) {
  var r, i = n + "", o;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === r ? o : o = t(r = s, n);
  };
}
function Sd(e, t, n) {
  var r, i, o;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), c = a + "", s === c ? null : s === r && c === i ? o : (i = c, o = t(r = s, a)));
  };
}
function zd(e, t, n) {
  var r, i, o;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), c = a + "", s === c ? null : s === r && c === i ? o : (i = c, o = t(r = s, a)));
  };
}
function jd(e, t) {
  var n = Ci(e), r = n === "transform" ? _d : $c;
  return this.attrTween(e, typeof t == "function" ? (n.local ? zd : Sd)(n, r, qo(this, "attr." + e, t)) : t == null ? (n.local ? Yd : Od)(n) : (n.local ? Pd : Id)(n, r, t));
}
function Ud(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function Fd(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Hd(e, t) {
  var n, r;
  function i() {
    var o = t.apply(this, arguments);
    return o !== r && (n = (r = o) && Fd(e, o)), n;
  }
  return i._value = t, i;
}
function Zd(e, t) {
  var n, r;
  function i() {
    var o = t.apply(this, arguments);
    return o !== r && (n = (r = o) && Ud(e, o)), n;
  }
  return i._value = t, i;
}
function qd(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = Ci(e);
  return this.tween(n, (r.local ? Hd : Zd)(r, t));
}
function Xd(e, t) {
  return function() {
    Zo(this, e).delay = +t.apply(this, arguments);
  };
}
function Wd(e, t) {
  return t = +t, function() {
    Zo(this, e).delay = t;
  };
}
function Gd(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Xd : Wd)(t, e)) : Jt(this.node(), t).delay;
}
function Vd(e, t) {
  return function() {
    de(this, e).duration = +t.apply(this, arguments);
  };
}
function Kd(e, t) {
  return t = +t, function() {
    de(this, e).duration = t;
  };
}
function Qd(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Vd : Kd)(t, e)) : Jt(this.node(), t).duration;
}
function Bd(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    de(this, e).ease = t;
  };
}
function Jd(e) {
  var t = this._id;
  return arguments.length ? this.each(Bd(t, e)) : Jt(this.node(), t).ease;
}
function tf(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    de(this, e).ease = n;
  };
}
function ef(e) {
  if (typeof e != "function") throw new Error();
  return this.each(tf(this._id, e));
}
function nf(e) {
  typeof e != "function" && (e = uc(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var o = t[i], s = o.length, a = r[i] = [], c, u = 0; u < s; ++u)
      (c = o[u]) && e.call(c, c.__data__, u, o) && a.push(c);
  return new xe(r, this._parents, this._name, this._id);
}
function rf(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, i = n.length, o = Math.min(r, i), s = new Array(r), a = 0; a < o; ++a)
    for (var c = t[a], u = n[a], l = c.length, h = s[a] = new Array(l), d, g = 0; g < l; ++g)
      (d = c[g] || u[g]) && (h[g] = d);
  for (; a < r; ++a)
    s[a] = t[a];
  return new xe(s, this._parents, this._name, this._id);
}
function of(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function sf(e, t, n) {
  var r, i, o = of(t) ? Zo : de;
  return function() {
    var s = o(this, e), a = s.on;
    a !== r && (i = (r = a).copy()).on(t, n), s.on = i;
  };
}
function af(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Jt(this.node(), n).on.on(e) : this.each(sf(n, e, t));
}
function cf(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function uf() {
  return this.on("end.remove", cf(this._id));
}
function lf(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = So(e));
  for (var r = this._groups, i = r.length, o = new Array(i), s = 0; s < i; ++s)
    for (var a = r[s], c = a.length, u = o[s] = new Array(c), l, h, d = 0; d < c; ++d)
      (l = a[d]) && (h = e.call(l, l.__data__, d, a)) && ("__data__" in l && (h.__data__ = l.__data__), u[d] = h, Ai(u[d], t, n, d, u, Jt(l, n)));
  return new xe(o, this._parents, t, n);
}
function hf(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = cc(e));
  for (var r = this._groups, i = r.length, o = [], s = [], a = 0; a < i; ++a)
    for (var c = r[a], u = c.length, l, h = 0; h < u; ++h)
      if (l = c[h]) {
        for (var d = e.call(l, l.__data__, h, c), g, p = Jt(l, n), w = 0, y = d.length; w < y; ++w)
          (g = d[w]) && Ai(g, t, n, w, d, p);
        o.push(d), s.push(l);
      }
  return new xe(o, s, t, n);
}
var df = Rr.prototype.constructor;
function ff() {
  return new df(this._groups, this._parents);
}
function mf(e, t) {
  var n, r, i;
  return function() {
    var o = En(this, e), s = (this.style.removeProperty(e), En(this, e));
    return o === s ? null : o === n && s === r ? i : i = t(n = o, r = s);
  };
}
function Ac(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function gf(e, t, n) {
  var r, i = n + "", o;
  return function() {
    var s = En(this, e);
    return s === i ? null : s === r ? o : o = t(r = s, n);
  };
}
function pf(e, t, n) {
  var r, i, o;
  return function() {
    var s = En(this, e), a = n(this), c = a + "";
    return a == null && (c = a = (this.style.removeProperty(e), En(this, e))), s === c ? null : s === r && c === i ? o : (i = c, o = t(r = s, a));
  };
}
function yf(e, t) {
  var n, r, i, o = "style." + t, s = "end." + o, a;
  return function() {
    var c = de(this, e), u = c.on, l = c.value[o] == null ? a || (a = Ac(t)) : void 0;
    (u !== n || i !== l) && (r = (n = u).copy()).on(s, i = l), c.on = r;
  };
}
function wf(e, t, n) {
  var r = (e += "") == "transform" ? bd : $c;
  return t == null ? this.styleTween(e, mf(e, r)).on("end.style." + e, Ac(e)) : typeof t == "function" ? this.styleTween(e, pf(e, r, qo(this, "style." + e, t))).each(yf(this._id, e)) : this.styleTween(e, gf(e, r, t), n).on("end.style." + e, null);
}
function vf(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function bf(e, t, n) {
  var r, i;
  function o() {
    var s = t.apply(this, arguments);
    return s !== i && (r = (i = s) && vf(e, s, n)), r;
  }
  return o._value = t, o;
}
function _f(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, bf(e, t, n ?? ""));
}
function Tf(e) {
  return function() {
    this.textContent = e;
  };
}
function Mf(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Ef(e) {
  return this.tween("text", typeof e == "function" ? Mf(qo(this, "text", e)) : Tf(e == null ? "" : e + ""));
}
function xf(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Df(e) {
  var t, n;
  function r() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && xf(i)), t;
  }
  return r._value = e, r;
}
function Cf(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, Df(e));
}
function $f() {
  for (var e = this._name, t = this._id, n = kc(), r = this._groups, i = r.length, o = 0; o < i; ++o)
    for (var s = r[o], a = s.length, c, u = 0; u < a; ++u)
      if (c = s[u]) {
        var l = Jt(c, t);
        Ai(c, e, n, u, s, {
          time: l.time + l.delay + l.duration,
          delay: 0,
          duration: l.duration,
          ease: l.ease
        });
      }
  return new xe(r, this._parents, e, n);
}
function Af() {
  var e, t, n = this, r = n._id, i = n.size();
  return new Promise(function(o, s) {
    var a = { value: s }, c = { value: function() {
      --i === 0 && o();
    } };
    n.each(function() {
      var u = de(this, r), l = u.on;
      l !== e && (t = (e = l).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(c)), u.on = t;
    }), i === 0 && o();
  });
}
var kf = 0;
function xe(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function kc() {
  return ++kf;
}
var me = Rr.prototype;
xe.prototype = {
  constructor: xe,
  select: lf,
  selectAll: hf,
  selectChild: me.selectChild,
  selectChildren: me.selectChildren,
  filter: nf,
  merge: rf,
  selection: ff,
  transition: $f,
  call: me.call,
  nodes: me.nodes,
  node: me.node,
  size: me.size,
  empty: me.empty,
  each: me.each,
  on: af,
  attr: jd,
  attrTween: qd,
  style: wf,
  styleTween: _f,
  text: Ef,
  textTween: Cf,
  remove: uf,
  tween: Ld,
  delay: Gd,
  duration: Qd,
  ease: Jd,
  easeVarying: ef,
  end: Af,
  [Symbol.iterator]: me[Symbol.iterator]
};
function Nf(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Rf = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Nf
};
function Lf(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function Of(e) {
  var t, n;
  e instanceof xe ? (t = e._id, e = e._name) : (t = kc(), (n = Rf).time = Ho(), e = e == null ? null : e + "");
  for (var r = this._groups, i = r.length, o = 0; o < i; ++o)
    for (var s = r[o], a = s.length, c, u = 0; u < a; ++u)
      (c = s[u]) && Ai(c, e, t, u, s, n || Lf(c, t));
  return new xe(r, this._parents, e, t);
}
Rr.prototype.interrupt = kd;
Rr.prototype.transition = Of;
const mo = Math.PI, go = 2 * mo, ze = 1e-6, Yf = go - ze;
function Nc(e) {
  this._ += e[0];
  for (let t = 1, n = e.length; t < n; ++t)
    this._ += arguments[t] + e[t];
}
function If(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return Nc;
  const n = 10 ** t;
  return function(r) {
    this._ += r[0];
    for (let i = 1, o = r.length; i < o; ++i)
      this._ += Math.round(arguments[i] * n) / n + r[i];
  };
}
class Pf {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? Nc : If(t);
  }
  moveTo(t, n) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +n}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
  }
  lineTo(t, n) {
    this._append`L${this._x1 = +t},${this._y1 = +n}`;
  }
  quadraticCurveTo(t, n, r, i) {
    this._append`Q${+t},${+n},${this._x1 = +r},${this._y1 = +i}`;
  }
  bezierCurveTo(t, n, r, i, o, s) {
    this._append`C${+t},${+n},${+r},${+i},${this._x1 = +o},${this._y1 = +s}`;
  }
  arcTo(t, n, r, i, o) {
    if (t = +t, n = +n, r = +r, i = +i, o = +o, o < 0) throw new Error(`negative radius: ${o}`);
    let s = this._x1, a = this._y1, c = r - t, u = i - n, l = s - t, h = a - n, d = l * l + h * h;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = n}`;
    else if (d > ze) if (!(Math.abs(h * c - u * l) > ze) || !o)
      this._append`L${this._x1 = t},${this._y1 = n}`;
    else {
      let g = r - s, p = i - a, w = c * c + u * u, y = g * g + p * p, v = Math.sqrt(w), _ = Math.sqrt(d), T = o * Math.tan((mo - Math.acos((w + d - y) / (2 * v * _))) / 2), x = T / _, E = T / v;
      Math.abs(x - 1) > ze && this._append`L${t + x * l},${n + x * h}`, this._append`A${o},${o},0,0,${+(h * g > l * p)},${this._x1 = t + E * c},${this._y1 = n + E * u}`;
    }
  }
  arc(t, n, r, i, o, s) {
    if (t = +t, n = +n, r = +r, s = !!s, r < 0) throw new Error(`negative radius: ${r}`);
    let a = r * Math.cos(i), c = r * Math.sin(i), u = t + a, l = n + c, h = 1 ^ s, d = s ? i - o : o - i;
    this._x1 === null ? this._append`M${u},${l}` : (Math.abs(this._x1 - u) > ze || Math.abs(this._y1 - l) > ze) && this._append`L${u},${l}`, r && (d < 0 && (d = d % go + go), d > Yf ? this._append`A${r},${r},0,1,${h},${t - a},${n - c}A${r},${r},0,1,${h},${this._x1 = u},${this._y1 = l}` : d > ze && this._append`A${r},${r},0,${+(d >= mo)},${h},${this._x1 = t + r * Math.cos(o)},${this._y1 = n + r * Math.sin(o)}`);
  }
  rect(t, n, r, i) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +n}h${r = +r}v${+i}h${-r}Z`;
  }
  toString() {
    return this._;
  }
}
function Sf(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function hi(e, t) {
  if ((n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0) return null;
  var n, r = e.slice(0, n);
  return [
    r.length > 1 ? r[0] + r.slice(2) : r,
    +e.slice(n + 1)
  ];
}
function Dn(e) {
  return e = hi(Math.abs(e)), e ? e[1] : NaN;
}
function zf(e, t) {
  return function(n, r) {
    for (var i = n.length, o = [], s = 0, a = e[0], c = 0; i > 0 && a > 0 && (c + a + 1 > r && (a = Math.max(1, r - c)), o.push(n.substring(i -= a, i + a)), !((c += a + 1) > r)); )
      a = e[s = (s + 1) % e.length];
    return o.reverse().join(t);
  };
}
function jf(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(n) {
      return e[+n];
    });
  };
}
var Uf = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function di(e) {
  if (!(t = Uf.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new Xo({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10]
  });
}
di.prototype = Xo.prototype;
function Xo(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Xo.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function Ff(e) {
  t: for (var t = e.length, n = 1, r = -1, i; n < t; ++n)
    switch (e[n]) {
      case ".":
        r = i = n;
        break;
      case "0":
        r === 0 && (r = n), i = n;
        break;
      default:
        if (!+e[n]) break t;
        r > 0 && (r = 0);
        break;
    }
  return r > 0 ? e.slice(0, r) + e.slice(i + 1) : e;
}
var Rc;
function Hf(e, t) {
  var n = hi(e, t);
  if (!n) return e + "";
  var r = n[0], i = n[1], o = i - (Rc = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, s = r.length;
  return o === s ? r : o > s ? r + new Array(o - s + 1).join("0") : o > 0 ? r.slice(0, o) + "." + r.slice(o) : "0." + new Array(1 - o).join("0") + hi(e, Math.max(0, t + o - 1))[0];
}
function Zs(e, t) {
  var n = hi(e, t);
  if (!n) return e + "";
  var r = n[0], i = n[1];
  return i < 0 ? "0." + new Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + new Array(i - r.length + 2).join("0");
}
const qs = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: Sf,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => Zs(e * 100, t),
  r: Zs,
  s: Hf,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function Xs(e) {
  return e;
}
var Ws = Array.prototype.map, Gs = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function Zf(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? Xs : zf(Ws.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", o = e.numerals === void 0 ? Xs : jf(Ws.call(e.numerals, String)), s = e.percent === void 0 ? "%" : e.percent + "", a = e.minus === void 0 ? "−" : e.minus + "", c = e.nan === void 0 ? "NaN" : e.nan + "";
  function u(h) {
    h = di(h);
    var d = h.fill, g = h.align, p = h.sign, w = h.symbol, y = h.zero, v = h.width, _ = h.comma, T = h.precision, x = h.trim, E = h.type;
    E === "n" ? (_ = !0, E = "g") : qs[E] || (T === void 0 && (T = 12), x = !0, E = "g"), (y || d === "0" && g === "=") && (y = !0, d = "0", g = "=");
    var N = w === "$" ? n : w === "#" && /[boxX]/.test(E) ? "0" + E.toLowerCase() : "", F = w === "$" ? r : /[%p]/.test(E) ? s : "", U = qs[E], j = /[defgprs%]/.test(E);
    T = T === void 0 ? 6 : /[gprs]/.test(E) ? Math.max(1, Math.min(21, T)) : Math.max(0, Math.min(20, T));
    function H(C) {
      var Y = N, z = F, Q, Zt, qt;
      if (E === "c")
        z = U(C) + z, C = "";
      else {
        C = +C;
        var Xt = C < 0 || 1 / C < 0;
        if (C = isNaN(C) ? c : U(Math.abs(C), T), x && (C = Ff(C)), Xt && +C == 0 && p !== "+" && (Xt = !1), Y = (Xt ? p === "(" ? p : a : p === "-" || p === "(" ? "" : p) + Y, z = (E === "s" ? Gs[8 + Rc / 3] : "") + z + (Xt && p === "(" ? ")" : ""), j) {
          for (Q = -1, Zt = C.length; ++Q < Zt; )
            if (qt = C.charCodeAt(Q), 48 > qt || qt > 57) {
              z = (qt === 46 ? i + C.slice(Q + 1) : C.slice(Q)) + z, C = C.slice(0, Q);
              break;
            }
        }
      }
      _ && !y && (C = t(C, 1 / 0));
      var nn = Y.length + C.length + z.length, Wt = nn < v ? new Array(v - nn + 1).join(d) : "";
      switch (_ && y && (C = t(Wt + C, Wt.length ? v - z.length : 1 / 0), Wt = ""), g) {
        case "<":
          C = Y + C + z + Wt;
          break;
        case "=":
          C = Y + Wt + C + z;
          break;
        case "^":
          C = Wt.slice(0, nn = Wt.length >> 1) + Y + C + z + Wt.slice(nn);
          break;
        default:
          C = Wt + Y + C + z;
          break;
      }
      return o(C);
    }
    return H.toString = function() {
      return h + "";
    }, H;
  }
  function l(h, d) {
    var g = u((h = di(h), h.type = "f", h)), p = Math.max(-8, Math.min(8, Math.floor(Dn(d) / 3))) * 3, w = Math.pow(10, -p), y = Gs[8 + p / 3];
    return function(v) {
      return g(w * v) + y;
    };
  }
  return {
    format: u,
    formatPrefix: l
  };
}
var Sr, Lc, Oc;
qf({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function qf(e) {
  return Sr = Zf(e), Lc = Sr.format, Oc = Sr.formatPrefix, Sr;
}
function Xf(e) {
  return Math.max(0, -Dn(Math.abs(e)));
}
function Wf(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Dn(t) / 3))) * 3 - Dn(Math.abs(e)));
}
function Gf(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, Dn(t) - Dn(e)) + 1;
}
function Vf(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
function Kf(e) {
  return function() {
    return e;
  };
}
function Qf(e) {
  return +e;
}
var Vs = [0, 1];
function dn(e) {
  return e;
}
function po(e, t) {
  return (t -= e = +e) ? function(n) {
    return (n - e) / t;
  } : Kf(isNaN(t) ? NaN : 0.5);
}
function Bf(e, t) {
  var n;
  return e > t && (n = e, e = t, t = n), function(r) {
    return Math.max(e, Math.min(t, r));
  };
}
function Jf(e, t, n) {
  var r = e[0], i = e[1], o = t[0], s = t[1];
  return i < r ? (r = po(i, r), o = n(s, o)) : (r = po(r, i), o = n(o, s)), function(a) {
    return o(r(a));
  };
}
function tm(e, t, n) {
  var r = Math.min(e.length, t.length) - 1, i = new Array(r), o = new Array(r), s = -1;
  for (e[r] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++s < r; )
    i[s] = po(e[s], e[s + 1]), o[s] = n(t[s], t[s + 1]);
  return function(a) {
    var c = al(e, a, 1, r) - 1;
    return o[c](i[c](a));
  };
}
function em(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function nm() {
  var e = Vs, t = Vs, n = Fo, r, i, o, s = dn, a, c, u;
  function l() {
    var d = Math.min(e.length, t.length);
    return s !== dn && (s = Bf(e[0], e[d - 1])), a = d > 2 ? tm : Jf, c = u = null, h;
  }
  function h(d) {
    return d == null || isNaN(d = +d) ? o : (c || (c = a(e.map(r), t, n)))(r(s(d)));
  }
  return h.invert = function(d) {
    return s(i((u || (u = a(t, e.map(r), Vt)))(d)));
  }, h.domain = function(d) {
    return arguments.length ? (e = Array.from(d, Qf), l()) : e.slice();
  }, h.range = function(d) {
    return arguments.length ? (t = Array.from(d), l()) : t.slice();
  }, h.rangeRound = function(d) {
    return t = Array.from(d), n = yd, l();
  }, h.clamp = function(d) {
    return arguments.length ? (s = d ? !0 : dn, l()) : s !== dn;
  }, h.interpolate = function(d) {
    return arguments.length ? (n = d, l()) : n;
  }, h.unknown = function(d) {
    return arguments.length ? (o = d, h) : o;
  }, function(d, g) {
    return r = d, i = g, l();
  };
}
function rm() {
  return nm()(dn, dn);
}
function im(e, t, n, r) {
  var i = dl(e, t, n), o;
  switch (r = di(r ?? ",f"), r.type) {
    case "s": {
      var s = Math.max(Math.abs(e), Math.abs(t));
      return r.precision == null && !isNaN(o = Wf(i, s)) && (r.precision = o), Oc(r, s);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      r.precision == null && !isNaN(o = Gf(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = o - (r.type === "e"));
      break;
    }
    case "f":
    case "%": {
      r.precision == null && !isNaN(o = Xf(i)) && (r.precision = o - (r.type === "%") * 2);
      break;
    }
  }
  return Lc(r);
}
function om(e) {
  var t = e.domain;
  return e.ticks = function(n) {
    var r = t();
    return hl(r[0], r[r.length - 1], n ?? 10);
  }, e.tickFormat = function(n, r) {
    var i = t();
    return im(i[0], i[i.length - 1], n ?? 10, r);
  }, e.nice = function(n) {
    n == null && (n = 10);
    var r = t(), i = 0, o = r.length - 1, s = r[i], a = r[o], c, u, l = 10;
    for (a < s && (u = s, s = a, a = u, u = i, i = o, o = u); l-- > 0; ) {
      if (u = oo(s, a, n), u === c)
        return r[i] = s, r[o] = a, t(r);
      if (u > 0)
        s = Math.floor(s / u) * u, a = Math.ceil(a / u) * u;
      else if (u < 0)
        s = Math.ceil(s * u) / u, a = Math.floor(a * u) / u;
      else
        break;
      c = u;
    }
    return e;
  }, e;
}
function gr() {
  var e = rm();
  return e.copy = function() {
    return em(e, gr());
  }, Vf.apply(e, arguments), om(e);
}
function an(e) {
  return function() {
    return e;
  };
}
function sm(e) {
  let t = 3;
  return e.digits = function(n) {
    if (!arguments.length) return t;
    if (n == null)
      t = null;
    else {
      const r = Math.floor(n);
      if (!(r >= 0)) throw new RangeError(`invalid digits: ${n}`);
      t = r;
    }
    return e;
  }, () => new Pf(t);
}
function am(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Yc(e) {
  this._context = e;
}
Yc.prototype = {
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
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default:
        this._context.lineTo(e, t);
        break;
    }
  }
};
function cm(e) {
  return new Yc(e);
}
function um(e) {
  return e[0];
}
function lm(e) {
  return e[1];
}
function Ic(e, t) {
  var n = an(!0), r = null, i = cm, o = null, s = sm(a);
  e = typeof e == "function" ? e : e === void 0 ? um : an(e), t = typeof t == "function" ? t : t === void 0 ? lm : an(t);
  function a(c) {
    var u, l = (c = am(c)).length, h, d = !1, g;
    for (r == null && (o = i(g = s())), u = 0; u <= l; ++u)
      !(u < l && n(h = c[u], u, c)) === d && ((d = !d) ? o.lineStart() : o.lineEnd()), d && o.point(+e(h, u, c), +t(h, u, c));
    if (g) return o = null, g + "" || null;
  }
  return a.x = function(c) {
    return arguments.length ? (e = typeof c == "function" ? c : an(+c), a) : e;
  }, a.y = function(c) {
    return arguments.length ? (t = typeof c == "function" ? c : an(+c), a) : t;
  }, a.defined = function(c) {
    return arguments.length ? (n = typeof c == "function" ? c : an(!!c), a) : n;
  }, a.curve = function(c) {
    return arguments.length ? (i = c, r != null && (o = i(r)), a) : i;
  }, a.context = function(c) {
    return arguments.length ? (c == null ? r = o = null : o = i(r = c), a) : r;
  }, a;
}
function Wn(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Wn.prototype = {
  constructor: Wn,
  scale: function(e) {
    return e === 1 ? this : new Wn(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Wn(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
Wn.prototype;
const hm = {
  name: "Sigmoid v3",
  description: "Smooth sigmoid curve that travels horizontally first, with limited curve distance",
  render(e) {
    const t = [], n = e.fromX - 5, r = e.toX + 5;
    let i = e.fromY;
    e.toY < e.fromY ? i = e.fromY - 5 : e.toY > e.fromY && (i = e.fromY + 5);
    const o = e.toY, s = Math.abs(r - n), a = 50;
    if (s <= a)
      return dm(n, i, r, o, e);
    const u = r > n ? n + a : n - a, l = Pc(n, i, u, o);
    if (!l) {
      const g = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      return g.setAttribute("d", `M ${n},${i} L ${r},${o}`), g.setAttribute("stroke", e.color), g.setAttribute("stroke-width", "5"), g.setAttribute("fill", "none"), t.push(g), t;
    }
    const h = `${l} L ${r},${o}`, d = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return d.setAttribute("d", h), d.setAttribute("stroke", e.color), d.setAttribute("stroke-width", "5"), d.setAttribute("fill", "none"), e.connectorType === "undefined" ? (d.setAttribute("stroke-dasharray", "5,5"), d.setAttribute("stroke-opacity", "0.5")) : d.setAttribute("stroke-opacity", e.opacity.toString()), t.push(d), t;
  }
};
function dm(e, t, n, r, i) {
  const o = [], s = Pc(e, t, n, r);
  if (!s) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return c.setAttribute("d", `M ${e},${t} L ${n},${r}`), c.setAttribute("stroke", i.color), c.setAttribute("stroke-width", "2"), c.setAttribute("fill", "none"), o.push(c), o;
  }
  const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return a.setAttribute("d", s), a.setAttribute("stroke", i.color), a.setAttribute("stroke-width", "5"), a.setAttribute("fill", "none"), i.connectorType === "undefined" ? (a.setAttribute("stroke-dasharray", "5,5"), a.setAttribute("stroke-opacity", "0.5")) : a.setAttribute("stroke-opacity", i.opacity.toString()), o.push(a), o;
}
function Pc(e, t, n, r) {
  const i = (h) => 1 / (1 + Math.exp(-2 * h)), a = [];
  for (let h = -3; h <= 3; h += 0.1) {
    const d = i(h);
    a.push([d, h]);
  }
  const c = gr().domain([0, 1]).range([e, n]), u = gr().domain([0, 1]).range([t, r]);
  return Ic().x((h) => {
    const d = (h[1] + 3) / 6;
    return c(d);
  }).y((h) => u(h[0]))(a);
}
const fm = {
  name: "Connector v4",
  description: "Limited sigmoid for defined connectors, full sigmoid for undefined connectors",
  render(e) {
    return e.connectorType === "undefined" ? mm(e) : gm(e);
  }
};
function mm(e) {
  const t = [], n = e.fromX - 5, r = e.fromY, i = e.toX + 5, o = e.toY, s = yo(n, r, i, o);
  if (!s) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return c.setAttribute("d", `M ${n},${r} L ${i},${o}`), c.setAttribute("stroke", e.color), c.setAttribute("stroke-width", "3"), c.setAttribute("fill", "none"), c.setAttribute("stroke-dasharray", "5,5"), c.setAttribute("stroke-opacity", "0.5"), t.push(c), t;
  }
  const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return a.setAttribute("d", s), a.setAttribute("stroke", e.color), a.setAttribute("stroke-width", "3"), a.setAttribute("fill", "none"), a.setAttribute("stroke-dasharray", "5,5"), a.setAttribute("stroke-opacity", "0.5"), t.push(a), t;
}
function gm(e) {
  const t = [], n = e.fromX - 5, r = e.toX + 5;
  let i = e.fromY;
  e.toY < e.fromY ? i = e.fromY - 5 : e.toY > e.fromY && (i = e.fromY + 5);
  const o = e.toY, s = Math.abs(r - n), a = 50;
  if (s <= a) {
    const g = yo(n, i, r, o);
    if (!g) {
      const w = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      return w.setAttribute("d", `M ${n},${i} L ${r},${o}`), w.setAttribute("stroke", e.color), w.setAttribute("stroke-width", "5"), w.setAttribute("fill", "none"), w.setAttribute("stroke-opacity", e.opacity.toString()), t.push(w), t;
    }
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return p.setAttribute("d", g), p.setAttribute("stroke", e.color), p.setAttribute("stroke-width", "5"), p.setAttribute("fill", "none"), p.setAttribute("stroke-opacity", e.opacity.toString()), t.push(p), t;
  }
  const u = r > n ? n + a : n - a, l = yo(n, i, u, o);
  if (!l) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return g.setAttribute("d", `M ${n},${i} L ${r},${o}`), g.setAttribute("stroke", e.color), g.setAttribute("stroke-width", "5"), g.setAttribute("fill", "none"), g.setAttribute("stroke-opacity", e.opacity.toString()), t.push(g), t;
  }
  const h = `${l} L ${r},${o}`, d = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", h), d.setAttribute("stroke", e.color), d.setAttribute("stroke-width", "5"), d.setAttribute("fill", "none"), d.setAttribute("stroke-opacity", e.opacity.toString()), t.push(d), t;
}
function yo(e, t, n, r) {
  const i = (h) => 1 / (1 + Math.exp(-2 * h)), a = [];
  for (let h = -3; h <= 3; h += 0.1) {
    const d = i(h);
    a.push([d, h]);
  }
  const c = gr().domain([0, 1]).range([e, n]), u = gr().domain([0, 1]).range([t, r]);
  return Ic().x((h) => {
    const d = (h[1] + 3) / 6;
    return c(d);
  }).y((h) => u(h[0]))(a);
}
const pm = {
  "connector-v4": fm,
  sigmoidHorizontalLimited: hm
}, ym = "sigmoidHorizontalLimited", wm = `
.info-popup {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  min-width: 200px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
}

.info-popup-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.info-popup-close:hover {
  background: #f0f0f0;
  color: #333;
}

.info-popup-content {
  padding: 12px 16px;
  padding-right: 36px;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #333;
}
`;
let Ks = !1;
function vm() {
  if (Ks) return;
  const e = document.createElement("style");
  e.setAttribute("data-thymeline-info-popup", ""), e.textContent = wm, document.head.appendChild(e), Ks = !0;
}
class bm {
  element = null;
  container;
  documentClickHandler = null;
  constructor(t) {
    this.container = t, vm();
  }
  /**
   * Show the popup with the given content at the specified position
   * @param content The text content to display
   * @param x X coordinate relative to the viewport
   * @param y Y coordinate relative to the viewport
   */
  show(t, n, r) {
    this.hide(), this.element = document.createElement("div"), this.element.className = "info-popup";
    const i = document.createElement("button");
    i.className = "info-popup-close", i.innerHTML = "&times;", i.addEventListener("click", (s) => {
      s.stopPropagation(), this.hide();
    });
    const o = document.createElement("div");
    o.className = "info-popup-content", o.textContent = t, this.element.appendChild(i), this.element.appendChild(o), this.container.appendChild(this.element), this.positionPopup(n, r), setTimeout(() => {
      this.documentClickHandler = (s) => {
        this.element && !this.element.contains(s.target) && this.hide();
      }, document.addEventListener("click", this.documentClickHandler);
    }, 0);
  }
  /**
   * Position the popup near the click point, adjusting for container edges
   */
  positionPopup(t, n) {
    if (!this.element) return;
    const r = this.container.getBoundingClientRect(), i = 250, o = 150, s = 10;
    let a = t - r.left + s, c = n - r.top + s;
    a + i > r.width && (a = t - r.left - i - s), c + o > r.height && (c = n - r.top - o - s), a = Math.max(10, a), c = Math.max(10, c), this.element.style.left = `${a}px`, this.element.style.top = `${c}px`;
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
class Dm {
  container;
  svg = null;
  data = null;
  options;
  viewport;
  eventListeners = /* @__PURE__ */ new Map();
  laneAssignments = [];
  rowMapping = /* @__PURE__ */ new Map();
  infoPopup = null;
  constructor(t, n = {}) {
    if (typeof t == "string") {
      const r = document.querySelector(t);
      if (!r || !(r instanceof HTMLElement))
        throw new Error(`Container element not found: ${t}`);
      this.container = r;
    } else
      this.container = t;
    this.container.style.position = "relative", this.options = {
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
        periodHeight: 28,
        laneHeight: 80,
        laneGap: 40
      },
      periodLayoutAlgorithm: n.periodLayoutAlgorithm ?? "succession",
      connectorRenderer: n.connectorRenderer ?? ym,
      showRowNumbers: n.showRowNumbers ?? !1
    }, this.viewport = {
      startTime: B(this.options.initialStartTime),
      endTime: B(this.options.initialEndTime),
      zoomLevel: 1,
      centerTime: 0
    }, this.viewport.centerTime = (this.viewport.startTime + this.viewport.endTime) / 2;
  }
  /**
   * Render timeline with data
   */
  render(t) {
    this.data = t;
    const { minTime: n, maxTime: r } = this.calculateDataTimeRange(t);
    this.viewport.startTime = n, this.viewport.endTime = r, this.viewport.centerTime = (n + r) / 2, this.viewport.zoomLevel = 1;
    const i = nl(
      t.periods,
      t.events,
      this.options.periodLayoutAlgorithm,
      t.connectors
    );
    this.laneAssignments = i, this.rowMapping = this.buildRowMapping(), this.createSVG(), this.renderTimeline();
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
  zoomTo(t, n) {
    this.viewport.startTime = B(t), this.viewport.endTime = B(n), this.viewport.centerTime = (this.viewport.startTime + this.viewport.endTime) / 2, this.viewport.zoomLevel = 1, this.updateView();
  }
  setZoomLevel(t, n) {
    if (!this.data) return;
    const r = this.viewport.zoomLevel, i = this.viewport.endTime - this.viewport.startTime, o = n !== void 0 ? n : this.viewport.centerTime, { minTime: s, maxTime: a } = this.calculateDataTimeRange(this.data), c = a - s, u = this.viewport.endTime - this.viewport.startTime, l = Math.min(
      this.options.minZoom,
      r * (u / c)
    ), h = this.findShortestPeriod();
    let d = this.options.maxZoom;
    if (h !== null) {
      const y = h * 10;
      d = Math.min(
        this.options.maxZoom,
        c / y
      );
    }
    const g = Math.max(
      l,
      Math.min(d, t)
    );
    if (g === r)
      return;
    this.viewport.zoomLevel = g;
    let p = i * (r / g);
    p = Math.min(p, c * 1.05), this.viewport.centerTime = o, this.viewport.startTime = o - p / 2, this.viewport.endTime = o + p / 2, this.clampPanPosition();
    const w = this.viewport.endTime - this.viewport.startTime;
    this.viewport.startTime = this.viewport.centerTime - w / 2, this.viewport.endTime = this.viewport.centerTime + w / 2, this.updateView(), this.emit("zoom", this.viewport.zoomLevel);
  }
  /**
   * Pan controls
   */
  panTo(t) {
    this.viewport.centerTime = B(t), this.clampPanPosition(), this.recalculateViewportBounds(), this.updateView(), this.emit("pan", this.viewport.centerTime);
  }
  panBy(t) {
    const n = this.viewport.endTime - this.viewport.startTime, r = t / this.options.width * n;
    this.viewport.centerTime += r, this.clampPanPosition(), this.recalculateViewportBounds(), this.updateView(), this.emit("pan", this.viewport.centerTime);
  }
  /**
   * Data manipulation
   */
  addEvent(t) {
    this.data && (this.data.events.push(t), this.render(this.data));
  }
  addPeriod(t) {
    this.data && (this.data.periods.push(t), this.render(this.data));
  }
  addConnector(t) {
    this.data && (this.data.connectors.push(t), this.render(this.data));
  }
  removeItem(t) {
    this.data && (this.data.events = this.data.events.filter((n) => n.id !== t), this.data.periods = this.data.periods.filter((n) => n.id !== t), this.data.connectors = this.data.connectors.filter((n) => n.id !== t), this.render(this.data));
  }
  updateItem(t, n) {
    if (!this.data) return;
    const r = this.data.events.find((o) => o.id === t);
    r && Object.assign(r, n);
    const i = this.data.periods.find((o) => o.id === t);
    i && Object.assign(i, n), this.render(this.data);
  }
  /**
   * Toggle row numbers visibility
   */
  setShowRowNumbers(t) {
    this.options.showRowNumbers = t, this.renderTimeline();
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
  on(t, n) {
    this.eventListeners.has(t) || this.eventListeners.set(t, /* @__PURE__ */ new Set()), this.eventListeners.get(t).add(n);
  }
  /**
   * Private methods
   */
  createSVG() {
    this.svg && this.svg.remove(), this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.svg.setAttribute("width", this.options.width.toString());
    const t = this.rowMapping.size > 0 ? Math.max(...this.rowMapping.values()) + 1 : 1, n = this.options.constraints.periodHeight, r = this.options.constraints.laneGap, i = 60, o = r / 3, s = o, a = o * 2, u = i + s + t * (n + r) + a + 20, l = Math.max(this.options.height, u);
    this.svg.setAttribute("height", l.toString()), this.svg.style.border = "1px solid #ccc", this.svg.style.background = "#fff", this.svg.style.cursor = "grab", this.svg.style.userSelect = "none", this.setupDragToPan(), this.container.appendChild(this.svg), this.infoPopup || (this.infoPopup = new bm(this.container));
  }
  /**
   * Set up mouse drag to pan and double-click to zoom
   */
  setupDragToPan() {
    if (!this.svg) return;
    let t = !1, n = 0, r = 0, i = 0;
    this.svg.addEventListener("mousedown", (s) => {
      const a = Date.now();
      if (a - i < 300) {
        this.handleDoubleClick(s), i = 0;
        return;
      }
      i = a, t = !0, n = s.clientX, r = this.viewport.centerTime, this.svg && (this.svg.style.cursor = "grabbing");
    }), this.svg.addEventListener("mousemove", (s) => {
      if (!t) return;
      const a = s.clientX - n, c = this.viewport.endTime - this.viewport.startTime, u = -a / this.options.width * c;
      this.viewport.centerTime = r + u, this.clampPanPosition(), this.recalculateViewportBounds(), this.updateView(), this.emit("pan", this.viewport.centerTime);
    });
    const o = () => {
      t && this.svg && (t = !1, this.svg.style.cursor = "grab");
    };
    this.svg.addEventListener("mouseup", o), this.svg.addEventListener("mouseleave", o), this.svg.addEventListener("wheel", (s) => {
      s.preventDefault(), s.deltaY < 0 ? this.zoomIn() : this.zoomOut();
    });
  }
  /**
   * Handle double-click to zoom in centered on click position
   */
  handleDoubleClick(t) {
    if (!this.svg) return;
    const n = this.svg.getBoundingClientRect(), r = t.clientX - n.left, i = this.xToTime(r), o = this.viewport.zoomLevel * 1.5;
    this.setZoomLevel(o, i);
  }
  /**
   * Convert pixel position to time
   */
  xToTime(t) {
    const n = this.viewport.endTime - this.viewport.startTime, r = t / this.options.width;
    return this.viewport.startTime + n * r;
  }
  updateView() {
    this.data && this.renderTimeline();
  }
  emit(t, ...n) {
    const r = this.eventListeners.get(t);
    r && r.forEach((i) => i(...n));
  }
  /**
   * Calculate the time range that encompasses all data
   */
  calculateDataTimeRange(t) {
    let n = 1 / 0, r = -1 / 0;
    for (const s of t.events) {
      const a = B(s.time);
      n = Math.min(n, a), r = Math.max(r, a);
    }
    for (const s of t.periods) {
      const a = B(s.startTime), c = hr(s.endTime, !1);
      n = Math.min(n, a), r = Math.max(r, c);
    }
    (n === 1 / 0 || r === -1 / 0) && (n = B(this.options.initialStartTime), r = B(this.options.initialEndTime));
    const o = (r - n) * 0.025;
    return {
      minTime: n - o,
      maxTime: r + o
    };
  }
  /**
   * Find the shortest period duration in the data
   * Skips ongoing periods (those without endTime)
   */
  findShortestPeriod() {
    if (!this.data || this.data.periods.length === 0)
      return null;
    let t = 1 / 0;
    for (const n of this.data.periods) {
      if (n.endTime === void 0 || n.endTime === null)
        continue;
      const r = B(n.startTime), o = B(n.endTime) - r;
      o > 0 && (t = Math.min(t, o));
    }
    return t === 1 / 0 ? null : t;
  }
  /**
   * Clamp pan position to prevent excessive empty space (15% max on each side)
   */
  clampPanPosition() {
    if (!this.data) return;
    let t = 1 / 0, n = -1 / 0;
    for (const a of this.data.events) {
      const c = B(a.time);
      t = Math.min(t, c), n = Math.max(n, c);
    }
    for (const a of this.data.periods) {
      const c = B(a.startTime), u = hr(a.endTime, !1);
      t = Math.min(t, c), n = Math.max(n, u);
    }
    if (t === 1 / 0 || n === -1 / 0)
      return;
    const r = this.viewport.endTime - this.viewport.startTime, i = r * 0.15, o = t - i + r / 2, s = n + i - r / 2;
    this.viewport.centerTime = Math.max(
      o,
      Math.min(s, this.viewport.centerTime)
    );
  }
  /**
   * Recalculate viewport start/end times based on center and current range
   */
  recalculateViewportBounds() {
    const t = this.viewport.endTime - this.viewport.startTime;
    this.viewport.startTime = this.viewport.centerTime - t / 2, this.viewport.endTime = this.viewport.centerTime + t / 2;
  }
  /**
   * Convert normalized time to pixel position
   */
  timeToX(t) {
    const n = this.viewport.endTime - this.viewport.startTime, r = this.options.width / n;
    return (t - this.viewport.startTime) * r;
  }
  /**
   * Convert lane assignments to sequential row numbers
   * This normalizes sparse lane assignments (e.g., 0, 1, 5, 10) to dense rows (0, 1, 2, 3)
   */
  buildRowMapping() {
    const t = /* @__PURE__ */ new Map(), n = this.laneAssignments.filter(
      (l) => l.type === "period"
    ), r = this.laneAssignments.filter(
      (l) => l.type === "event"
    ), i = [...new Set(n.map((l) => l.lane))].sort(
      (l, h) => l - h
    );
    n.forEach((l) => {
      const h = i.indexOf(l.lane);
      t.set(l.itemId, h);
    });
    const o = new Set(i), s = r.filter(
      (l) => o.has(l.lane)
    ), a = r.filter(
      (l) => !o.has(l.lane)
    );
    s.forEach((l) => {
      const h = i.indexOf(l.lane);
      t.set(l.itemId, h);
    });
    const c = i.length, u = [
      ...new Set(a.map((l) => l.lane))
    ].sort((l, h) => l - h);
    return a.forEach((l) => {
      const h = u.indexOf(l.lane), d = c + h;
      t.set(l.itemId, d);
    }), t;
  }
  /**
   * Get Y position for a row
   * Simple row-based positioning with configurable gaps
   * Accounts for 1 sub-lane of space above the first period row
   */
  rowToY(t, n) {
    const r = this.options.constraints.periodHeight, i = 20, o = this.options.constraints.laneGap, s = 60, c = o / 3;
    return n === "period" ? s + c + t * (r + o) : s + c + t * (i + o);
  }
  /**
   * Get Y position for an event with sub-lane support
   * @param row The row number (same as period row for related events)
   * @param subLane The sub-lane (0, 1, or 2) within the row's vertical space
   * @param isRelatedEvent Whether this event relates to a period
   */
  eventToY(t, n, r) {
    const i = this.options.constraints.periodHeight, o = this.options.constraints.laneGap, s = 60, a = o / 3, c = a;
    return r ? s + c + t * (i + o) + i + n * a : s + c + t * (20 + o) + n * a;
  }
  /**
   * Main rendering method
   */
  renderTimeline() {
    if (!(!this.svg || !this.data)) {
      this.svg.innerHTML = "", this.options.showRowNumbers && this.renderRowNumbers(), this.renderTimeAxis();
      for (const t of this.data.connectors)
        t.type === "undefined" && this.renderConnector(t);
      for (const t of this.data.connectors)
        t.type !== "undefined" && this.renderConnector(t);
      for (const t of this.data.periods)
        this.renderPeriod(t);
      this.renderEventsWithLabelPositioning(this.data.events);
    }
  }
  /**
   * Render row numbers for debugging
   */
  renderRowNumbers() {
    if (!this.svg) return;
    const t = this.rowMapping.size > 0 ? Math.max(...this.rowMapping.values()) + 1 : 0, n = this.options.constraints.periodHeight;
    for (let r = 0; r < t; r++) {
      let i = !0;
      for (const [c, u] of this.rowMapping.entries())
        if (u === r && this.laneAssignments.find(
          (h) => h.itemId === c
        )?.type === "period") {
          i = !1;
          break;
        }
      const o = this.rowToY(r, i ? "event" : "period"), s = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      s.setAttribute("x", "0"), s.setAttribute("y", o.toString()), s.setAttribute("width", "30"), s.setAttribute("height", n.toString()), s.setAttribute("fill", "#f0f0f0"), s.setAttribute("stroke", "#ccc"), s.setAttribute("stroke-width", "0.5"), this.svg.appendChild(s);
      const a = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      a.setAttribute("x", "15"), a.setAttribute("y", (o + n / 2 + 4).toString()), a.setAttribute("text-anchor", "middle"), a.setAttribute("font-size", "10"), a.setAttribute("fill", "#666"), a.setAttribute("font-family", "monospace"), a.textContent = r.toString(), this.svg.appendChild(a);
    }
  }
  /**
   * Render time axis
   */
  renderTimeAxis() {
    if (!this.svg) return;
    const t = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    t.setAttribute("id", "time-axis-background"), t.setAttribute("x", "0"), t.setAttribute("y", "0"), t.setAttribute("width", this.options.width.toString()), t.setAttribute("height", "40"), t.setAttribute("fill", "#f8f9fa"), this.svg.appendChild(t), this.renderBigBangBoundary();
    const n = document.createElementNS("http://www.w3.org/2000/svg", "line");
    n.setAttribute("x1", "0"), n.setAttribute("y1", "40"), n.setAttribute("x2", this.options.width.toString()), n.setAttribute("y2", "40"), n.setAttribute("stroke", "#666"), n.setAttribute("stroke-width", "2"), this.svg.appendChild(n);
    const r = 40, i = this.options.width - r * 2, o = 10, s = this.viewport.endTime - this.viewport.startTime;
    for (let a = 0; a <= o; a++) {
      const c = r + i / o * a, u = (c - 0) / this.options.width, l = this.viewport.startTime + s * u, h = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      if (h.setAttribute("x1", c.toString()), h.setAttribute("y1", "40"), h.setAttribute("x2", c.toString()), h.setAttribute("y2", "50"), h.setAttribute("stroke", "#666"), h.setAttribute("stroke-width", "1"), this.svg.appendChild(h), l >= tr) {
        const d = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        d.setAttribute("x", c.toString()), d.setAttribute("y", "25"), d.setAttribute("text-anchor", "middle"), d.setAttribute("font-size", "11"), d.setAttribute("fill", "#666"), d.textContent = this.formatTimeLabel(l), this.svg.appendChild(d);
      }
    }
  }
  /**
   * Render Big Bang boundary and static noise
   */
  renderBigBangBoundary() {
    if (!this.svg) return;
    const t = this.timeToX(tr);
    if (t < 0 || t > this.options.width)
      return;
    const n = parseFloat(this.svg.getAttribute("height") || "500"), r = "static-noise-pattern";
    let i = this.svg.querySelector("defs");
    i || (i = document.createElementNS("http://www.w3.org/2000/svg", "defs"), this.svg.insertBefore(i, this.svg.firstChild));
    const o = i.querySelector(`#${r}`);
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
    ), s.appendChild(a), s.appendChild(c), i.appendChild(s), t > 0) {
      const u = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      u.setAttribute("x", "0"), u.setAttribute("y", "40"), u.setAttribute("width", t.toString()), u.setAttribute("height", (n - 40).toString()), u.setAttribute("fill", "#d0d0d0"), u.setAttribute("filter", "url(#noise-filter)"), u.setAttribute("opacity", "0.35"), this.svg.appendChild(u);
      const l = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      l.setAttribute("x1", t.toString()), l.setAttribute("y1", "40"), l.setAttribute("x2", t.toString()), l.setAttribute("y2", n.toString()), l.setAttribute("stroke", "#333"), l.setAttribute("stroke-width", "2"), l.setAttribute("stroke-dasharray", "5,5"), this.svg.appendChild(l);
      const h = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      h.setAttribute("x", (t - 5).toString()), h.setAttribute("y", "55"), h.setAttribute("text-anchor", "end"), h.setAttribute("font-size", "10"), h.setAttribute("fill", "#666"), h.setAttribute("font-style", "italic"), h.textContent = "Big Bang", this.svg.appendChild(h);
    }
  }
  /**
   * Format time for axis labels
   */
  formatTimeLabel(t) {
    return t < -1e6 ? `${(Math.abs(t) / 1e6).toFixed(0)}M BCE` : t < 0 ? `${Math.abs(Math.floor(t))} BCE` : t < 1e3 ? `${Math.floor(t)} CE` : Math.floor(t).toString();
  }
  /**
   * Format TimeInput for display in info popup
   */
  formatTimeForDisplay(t) {
    if (typeof t == "string")
      try {
        return new Date(t).toLocaleDateString(void 0, {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      } catch {
        return t;
      }
    else {
      if (t instanceof Temporal.Instant)
        return new Date(t.epochMilliseconds).toLocaleDateString(void 0, {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      if ("era" in t)
        return `${t.year} ${t.era}`;
      if ("unit" in t)
        return t.unit === "mya" ? `${t.value} million years ago` : `${t.value} years ago`;
      if ("localTime" in t)
        return `${t.localTime} (${t.timezone})`;
    }
    return String(t);
  }
  /**
   * Render a period as a rectangle
   */
  renderPeriod(t) {
    if (!this.svg) return;
    const n = this.laneAssignments.find((d) => d.itemId === t.id);
    if (!n) return;
    const r = this.rowMapping.get(t.id);
    if (r === void 0) return;
    const i = this.timeToX(n.startTime), o = n.endTime === 1 / 0 ? nc() : n.endTime, s = this.timeToX(o), a = this.rowToY(r, "period"), c = Math.max(2, s - i), u = this.options.constraints.periodHeight, l = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    if (l.setAttribute("id", t.id), l.setAttribute("x", i.toString()), l.setAttribute("y", a.toString()), l.setAttribute("width", c.toString()), l.setAttribute("height", u.toString()), l.setAttribute("fill", "#000"), l.setAttribute("fill-opacity", "1"), l.setAttribute("stroke", "#000"), l.setAttribute("stroke-width", "1"), l.setAttribute("rx", "5"), l.setAttribute("ry", (u * 0.35).toString()), l.style.cursor = "pointer", l.addEventListener("click", (d) => {
      if (d.stopPropagation(), this.infoPopup) {
        const g = this.formatTimeForDisplay(t.startTime), p = t.endTime ? this.formatTimeForDisplay(t.endTime) : "ongoing";
        let w = `${t.name}
${g} – ${p}`;
        t.info && (w += `

${t.info}`), this.infoPopup.show(w, d.clientX, d.clientY);
      }
      this.emit("itemClick", t);
    }), this.svg.appendChild(l), !this.renderPeriodLabel(t.name, i, a, c, u)) {
      let d = null;
      l.addEventListener("mouseenter", () => {
        this.svg && (d = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        ), d.setAttribute("x", (i + c / 2).toString()), d.setAttribute("y", (a + u + 14).toString()), d.setAttribute("text-anchor", "middle"), d.setAttribute("font-size", "11"), d.setAttribute("fill", "#000"), d.setAttribute("font-weight", "bold"), d.setAttribute("pointer-events", "none"), d.textContent = t.name, this.svg.appendChild(d));
      }), l.addEventListener("mouseleave", () => {
        d && (d.remove(), d = null);
      });
    }
  }
  /**
   * Render a period label, with two-line layout if needed
   * Returns true if label was shown, false if hidden
   */
  renderPeriodLabel(t, n, r, i, o) {
    if (!this.svg) return !1;
    const a = i - 8 * 2;
    if (a <= 0) return !1;
    const c = n + i / 2, u = 11, l = u + 2, h = (x) => {
      const E = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      E.setAttribute("font-size", u.toString()), E.setAttribute("font-weight", "bold"), E.textContent = x, this.svg.appendChild(E);
      const N = E.getBBox();
      return E.remove(), N.width;
    };
    if (h(t) <= a) {
      const x = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      return x.setAttribute("x", c.toString()), x.setAttribute("y", (r + o / 2 + u / 3).toString()), x.setAttribute("text-anchor", "middle"), x.setAttribute("font-size", u.toString()), x.setAttribute("fill", "#fff"), x.setAttribute("font-weight", "bold"), x.setAttribute("pointer-events", "none"), x.textContent = t, this.svg.appendChild(x), !0;
    }
    const g = t.split(" ");
    if (g.length < 2)
      return !1;
    let p = 1, w = 1 / 0;
    for (let x = 1; x < g.length; x++) {
      const E = g.slice(0, x).join(" "), N = g.slice(x).join(" "), F = Math.max(h(E), h(N));
      F < w && (w = F, p = x);
    }
    if (w > a)
      return !1;
    const y = g.slice(0, p).join(" "), v = g.slice(p).join(" "), _ = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    _.setAttribute("x", c.toString()), _.setAttribute(
      "y",
      (r + o / 2 - l / 2 + u / 3).toString()
    ), _.setAttribute("text-anchor", "middle"), _.setAttribute("font-size", u.toString()), _.setAttribute("fill", "#fff"), _.setAttribute("font-weight", "bold"), _.setAttribute("pointer-events", "none"), _.textContent = y, this.svg.appendChild(_);
    const T = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    return T.setAttribute("x", c.toString()), T.setAttribute(
      "y",
      (r + o / 2 + l / 2 + u / 3).toString()
    ), T.setAttribute("text-anchor", "middle"), T.setAttribute("font-size", u.toString()), T.setAttribute("fill", "#fff"), T.setAttribute("font-weight", "bold"), T.setAttribute("pointer-events", "none"), T.textContent = v, this.svg.appendChild(T), !0;
  }
  /**
   * Render all events with smart label positioning to avoid overlaps
   */
  renderEventsWithLabelPositioning(t) {
    if (!this.svg) return;
    const n = 20, r = 4, i = 8, o = 10, s = 6, a = o + 4, c = [];
    for (const l of t) {
      const h = this.laneAssignments.find(
        (T) => T.itemId === l.id
      );
      if (!h) continue;
      const d = this.rowMapping.get(l.id);
      if (d === void 0) continue;
      const g = this.timeToX(h.startTime), p = h.subLane ?? 1, w = !!l.relates_to, v = this.eventToY(d, p, w) + n / 2, _ = l.name.length * s;
      c.push({
        id: l.id,
        circleX: g,
        circleY: v,
        circleRadius: r,
        labelY: v - a / 2,
        labelHeight: a,
        labelWidth: _,
        rightLabelX: g + i,
        leftLabelX: g - i - _
      });
    }
    const u = /* @__PURE__ */ new Map();
    for (const l of c) {
      if (!this.checkLabelOverlap(
        l,
        "right",
        c,
        u
      )) {
        u.set(l.id, "right");
        continue;
      }
      this.checkLabelOverlap(
        l,
        "left",
        c,
        u
      ) ? u.set(l.id, "hidden") : u.set(l.id, "left");
    }
    for (const l of t) {
      const h = u.get(l.id) ?? "right";
      this.renderEvent(l, h);
    }
  }
  /**
   * Check if a label at the given position would overlap with other events or their labels
   */
  checkLabelOverlap(t, n, r, i) {
    const o = n === "right" ? t.rightLabelX : t.leftLabelX, s = o + t.labelWidth, a = t.labelY, c = t.labelY + t.labelHeight;
    for (const u of r) {
      if (u.id === t.id) continue;
      const l = u.circleX - u.circleRadius, h = u.circleX + u.circleRadius, d = u.circleY - u.circleRadius, g = u.circleY + u.circleRadius;
      if (o < h && s > l && a < g && c > d)
        return !0;
      const p = i.get(u.id);
      if (p && p !== "hidden") {
        const w = p === "right" ? u.rightLabelX : u.leftLabelX, y = w + u.labelWidth, v = u.labelY, _ = u.labelY + u.labelHeight;
        if (o < y && s > w && a < _ && c > v)
          return !0;
      }
    }
    return !1;
  }
  /**
   * Render an event as a marker
   */
  renderEvent(t, n = "right") {
    if (!this.svg) return;
    const r = this.laneAssignments.find((h) => h.itemId === t.id);
    if (!r) return;
    const i = this.rowMapping.get(t.id);
    if (i === void 0) return;
    const o = this.timeToX(r.startTime), s = 20, a = r.subLane ?? 1, c = !!t.relates_to, u = this.eventToY(i, a, c), l = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    if (l.setAttribute("id", t.id), l.setAttribute("cx", o.toString()), l.setAttribute("cy", (u + s / 2).toString()), l.setAttribute("r", "4"), l.setAttribute("fill", "none"), l.setAttribute("stroke", "#000"), l.setAttribute("stroke-width", "2"), l.style.cursor = "pointer", l.addEventListener("click", (h) => {
      if (h.stopPropagation(), this.infoPopup) {
        const d = this.formatTimeForDisplay(t.time);
        let g = `${t.name}
${d}`;
        t.info && (g += `

${t.info}`), this.infoPopup.show(g, h.clientX, h.clientY);
      }
      this.emit("itemClick", t);
    }), this.svg.appendChild(l), n !== "hidden") {
      const h = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      n === "right" ? (h.setAttribute("x", (o + 8).toString()), h.setAttribute("text-anchor", "start")) : (h.setAttribute("x", (o - 8).toString()), h.setAttribute("text-anchor", "end")), h.setAttribute("y", (u + s / 2 + 4).toString()), h.setAttribute("font-size", "10"), h.setAttribute("fill", "#333"), h.setAttribute("pointer-events", "none"), h.textContent = t.name, this.svg.appendChild(h);
    }
  }
  /**
   * Render a connector between periods
   */
  renderConnector(t) {
    if (!this.svg || !this.data) return;
    const n = this.laneAssignments.find(
      (E) => E.itemId === t.fromId
    ), r = this.laneAssignments.find(
      (E) => E.itemId === t.toId
    );
    if (!n || !r) return;
    const i = this.timeToX(n.startTime), s = this.timeToX(n.endTime) - i, a = this.timeToX(r.startTime), u = this.timeToX(r.endTime) - a;
    if (s < 10 || u < 10)
      return;
    const l = this.rowMapping.get(t.fromId), h = this.rowMapping.get(t.toId);
    if (l === void 0 || h === void 0) return;
    const g = this.data.periods.find((E) => E.id === t.fromId) ? "#000" : "#f587f3", p = Math.min(
      n.endTime,
      r.startTime
    ), w = this.timeToX(p), y = this.timeToX(r.startTime), v = this.rowToY(l, n.type) + this.options.constraints.periodHeight / 2, _ = this.rowToY(h, r.type) + this.options.constraints.periodHeight / 2, T = pm[this.options.connectorRenderer];
    if (!T) {
      console.warn(
        `Connector renderer not found: ${this.options.connectorRenderer}`
      );
      return;
    }
    T.render({
      fromX: w,
      fromY: v,
      toX: y,
      toY: _,
      connectorType: t.type,
      color: g,
      opacity: 0.85
    }).forEach((E) => {
      E.setAttribute("id", t.id), this.svg.appendChild(E);
    });
  }
}
typeof globalThis.Temporal > "u" && (globalThis.Temporal = Hu);
export {
  tr as BIG_BANG_TIME,
  pm as CONNECTOR_RENDERERS,
  ym as DEFAULT_CONNECTOR,
  el as DEFAULT_PERIOD_LAYOUT,
  tl as PERIOD_LAYOUT_ALGORITHMS,
  Dm as TimelineRenderer,
  nl as assignLanes,
  Tm as determineTimeScale,
  _m as formatTime,
  xm as formatValidationResult,
  Mm as getLaneCount,
  B as normalizeTime,
  Em as validateTimelineData
};
//# sourceMappingURL=thymeline.js.map
