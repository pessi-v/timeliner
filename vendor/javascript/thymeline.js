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
    const l = i + 3;
    let u = l === 32 ? 0 : a << l;
    u >>>= 12;
    const h = l - 12;
    let d = 12 <= l ? 0 : a << 20 + l, g = 20 + l;
    for (0 < h && 0 < c && (c--, a = t.__digit(c), u |= a >>> 30 - h, d = a << h + 2, g = h + 2); 0 < g && 0 < c; ) c--, a = t.__digit(c), d |= 30 <= g ? a << g - 30 : a >>> 30 - g, g -= 30;
    const p = f.__decideRounding(t, g, c, a);
    if ((p === 1 || p === 0 && (1 & d) == 1) && (d = d + 1 >>> 0, d === 0 && (u++, u >>> 20 != 0 && (u = 0, s++, 1023 < s)))) return t.sign ? -1 / 0 : 1 / 0;
    const w = t.sign ? -2147483648 : 0;
    return s = s + 1023 << 20, f.__kBitConversionInts[f.__kBitConversionIntHigh] = w | s | u, f.__kBitConversionInts[f.__kBitConversionIntLow] = d, f.__kBitConversionDouble[0];
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
      const l = 1 << r % 30;
      return c.__setDigit(s - 1, l), c;
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
      const l = r.__digit(1);
      s |= l << 30, o = l >>> 2, 2 < r.length && (o |= r.__digit(2) << 28);
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
    const c = 20, l = r % 30;
    let u, h = 0;
    if (l < 20) {
      const d = c - l;
      h = d + 32, u = s >>> d, s = s << 32 - d | a >>> d, a <<= 32 - d;
    } else if (l === 20) h = 32, u = s, s = a, a = 0;
    else {
      const d = l - c;
      h = 32 - d, u = s << d | a >>> 32 - d, s = a << d, a = 0;
    }
    o.__setDigit(i - 1, u);
    for (let d = i - 2; 0 <= d; d--) 0 < h ? (h -= 30, u = s >>> 2, s = s << 30 | a >>> 2, a <<= 30) : u = 0, o.__setDigit(d, u);
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
    let c = f.__kMaxBitsPerChar[n], l = f.__kBitsPerCharTableMultiplier - 1;
    if (a > 1073741824 / c) return null;
    const u = c * a + l >>> f.__kBitsPerCharTableShift, h = new f(0 | (u + 29) / 30, !1), d = 10 > n ? n : 10, g = 10 < n ? n - 10 : 0;
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
          const M = v * n;
          if (1073741823 < M) break;
          if (v = M, y = y * n + T, w++, ++o === i) {
            p = !0;
            break;
          }
          s = t.charCodeAt(o);
        }
        l = 30 * f.__kBitsPerCharTableMultiplier - 1;
        const _ = 0 | (c * w + l >>> f.__kBitsPerCharTableShift) / 30;
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
      const c = n[a], l = r[a];
      o |= c << s, s += l, s === 30 ? (t.__setDigit(i++, o), s = 0, o = 0) : 30 < s && (t.__setDigit(i++, 1073741823 & o), s -= 30, o = c >>> l - s);
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
    let l = 0 | (30 * r - c + o - 1) / o;
    if (t.sign && l++, 268435456 < l) throw new Error("string too long");
    const u = Array(l);
    let h = l - 1, d = 0, g = 0;
    for (let w = 0; w < r - 1; w++) {
      const y = t.__digit(w), v = (d | y << g) & s;
      u[h--] = f.__kConversionChars[v];
      const _ = o - g;
      for (d = y >>> _, g = 30 - _; g >= o; ) u[h--] = f.__kConversionChars[d & s], d >>>= o, g -= o;
    }
    const p = (d | a << g) & s;
    for (u[h--] = f.__kConversionChars[p], d = a >>> o - g; d !== 0; ) u[h--] = f.__kConversionChars[d & s], d >>>= o;
    if (t.sign && (u[h--] = "-"), h != -1) throw new Error("implementation bug");
    return u.join("");
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
    const l = c + 1 >> 1, u = f.exponentiate(f.__oneDigit(n, !1), f.__oneDigit(l, !1));
    let h, d;
    const g = u.__unsignedDigit(0);
    if (u.length === 1 && 32767 >= g) {
      h = new f(t.length, !1), h.__initializeDigits();
      let w = 0;
      for (let y = 2 * t.length - 1; 0 <= y; y--) {
        const v = w << 15 | t.__halfDigit(y);
        h.__setHalfDigit(y, 0 | v / g), w = 0 | v % g;
      }
      d = w.toString(n);
    } else {
      const w = f.__absoluteDivLarge(t, u, !0, !0);
      h = w.quotient;
      const y = w.remainder.__trim();
      d = f.__toStringGeneric(y, n, !0);
    }
    h.__trim();
    let p = f.__toStringGeneric(h, n, !0);
    for (; d.length < l; ) d = "0" + d;
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
    const c = f.__clz30(a), l = 30 * s - c, u = o + 1;
    if (l < u) return f.__absoluteLess(r);
    if (l > u) return f.__absoluteGreater(r);
    let h = 1048576 | 1048575 & f.__kBitConversionInts[f.__kBitConversionIntHigh], d = f.__kBitConversionInts[f.__kBitConversionIntLow];
    const g = 20, p = 29 - c;
    if (p !== (0 | (l - 1) % 30)) throw new Error("implementation bug");
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
      const l = t, u = i;
      t = n, i = o, n = l, o = u;
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
      const l = t, u = i;
      t = n, i = o, n = l, o = u;
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
      const l = t, u = i;
      t = n, i = o, n = l, o = u;
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
    for (let l, u = 0; u < t.length; u++, i++) {
      l = r.__digit(i);
      const h = t.__digit(u), d = 32767 & h, g = h >>> 15, p = f.__imul(d, o), w = f.__imul(d, s), y = f.__imul(g, o), v = f.__imul(g, s);
      l += c + p + a, a = l >>> 30, l &= 1073741823, l += ((32767 & w) << 15) + ((32767 & y) << 15), a += l >>> 30, c = v + (w >>> 15) + (y >>> 15), r.__setDigit(i, 1073741823 & l);
    }
    for (; a != 0 || c !== 0; i++) {
      let l = r.__digit(i);
      l += a + c, c = 0, a = l >>> 30, r.__setDigit(i, 1073741823 & l);
    }
  }
  static __internalMultiplyAdd(t, n, r, i, o) {
    let s = r, a = 0;
    for (let c = 0; c < i; c++) {
      const l = t.__digit(c), u = f.__imul(32767 & l, n), h = f.__imul(l >>> 15, n), d = u + ((32767 & h) << 15) + a + s;
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
      const l = this.__digit(c), u = 32767 & l, h = l >>> 15, d = f.__imul(u, i), g = f.__imul(u, o), p = f.__imul(h, i), w = f.__imul(h, o);
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
    const l = new f(o + 2 >>> 1, !1);
    l.__initializeDigits();
    const u = f.__clz15(n.__halfDigit(o - 1));
    0 < u && (n = f.__specialLeftShift(n, u, 0));
    const h = f.__specialLeftShift(t, u, 1), d = n.__halfDigit(o - 1);
    let g = 0;
    for (let p, w = a; 0 <= w; w--) {
      p = 32767;
      const y = h.__halfDigit(w + o);
      if (y !== d) {
        const _ = (y << 15 | h.__halfDigit(w + o - 1)) >>> 0;
        p = 0 | _ / d;
        let T = 0 | _ % d;
        const M = n.__halfDigit(o - 2), E = h.__halfDigit(w + o - 2);
        for (; f.__imul(p, M) >>> 0 > (T << 16 | E) >>> 0 && (p--, T += d, !(32767 < T)); ) ;
      }
      f.__internalMultiplyAdd(n, p, 0, s, l);
      let v = h.__inplaceSub(l, w, o + 1);
      v !== 0 && (v = h.__inplaceAdd(n, w, o), h.__setHalfDigit(w + o, 32767 & h.__halfDigit(w + o) + v), p--), r && (1 & w ? g = p << 15 : c.__setDigit(w >>> 1, g | p));
    }
    if (i) return h.__inplaceRightShift(u), r ? { quotient: c, remainder: h } : h;
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
        const u = t.__digit(a), h = (o >>> 15) - (32767 & u) - i;
        i = 1 & h >>> 15, this.__setDigit(n + a, (32767 & h) << 15 | 32767 & s), o = this.__digit(n + a + 1), s = (32767 & o) - (u >>> 15) - i, i = 1 & s >>> 15;
      }
      const c = t.__digit(a), l = (o >>> 15) - (32767 & c) - i;
      if (i = 1 & l >>> 15, this.__setDigit(n + a, (32767 & l) << 15 | 32767 & s), n + a + 1 >= this.length) throw new RangeError("out of bounds");
      (1 & r) == 0 && (o = this.__digit(n + a + 1), s = (32767 & o) - (c >>> 15) - i, i = 1 & s >>> 15, this.__setDigit(n + t.length, 1073709056 & o | 32767 & s));
    } else {
      n >>= 1;
      let o = 0;
      for (; o < t.length - 1; o++) {
        const u = this.__digit(n + o), h = t.__digit(o), d = (32767 & u) - (32767 & h) - i;
        i = 1 & d >>> 15;
        const g = (u >>> 15) - (h >>> 15) - i;
        i = 1 & g >>> 15, this.__setDigit(n + o, (32767 & g) << 15 | 32767 & d);
      }
      const s = this.__digit(n + o), a = t.__digit(o), c = (32767 & s) - (32767 & a) - i;
      i = 1 & c >>> 15;
      let l = 0;
      (1 & r) == 0 && (l = (s >>> 15) - (a >>> 15) - i, i = 1 & l >>> 15), this.__setDigit(n + o, (32767 & l) << 15 | 32767 & c);
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
    const i = 0 | r / 30, o = r % 30, s = t.length, a = o !== 0 && t.__digit(s - 1) >>> 30 - o != 0, c = s + i + (a ? 1 : 0), l = new f(c, t.sign);
    if (o === 0) {
      let u = 0;
      for (; u < i; u++) l.__setDigit(u, 0);
      for (; u < c; u++) l.__setDigit(u, t.__digit(u - i));
    } else {
      let u = 0;
      for (let h = 0; h < i; h++) l.__setDigit(h, 0);
      for (let h = 0; h < s; h++) {
        const d = t.__digit(h);
        l.__setDigit(h + i, 1073741823 & d << o | u), u = d >>> 30 - o;
      }
      if (a) l.__setDigit(s + i, u);
      else if (u !== 0) throw new Error("implementation bug");
    }
    return l.__trim();
  }
  static __rightShiftByAbsolute(t, n) {
    const r = t.length, i = t.sign, o = f.__toShiftAmount(n);
    if (0 > o) return f.__rightShiftByMaximum(i);
    const s = 0 | o / 30, a = o % 30;
    let c = r - s;
    if (0 >= c) return f.__rightShiftByMaximum(i);
    let l = !1;
    if (i) {
      if ((t.__digit(s) & (1 << a) - 1) != 0) l = !0;
      else for (let h = 0; h < s; h++) if (t.__digit(h) !== 0) {
        l = !0;
        break;
      }
    }
    l && a === 0 && ~t.__digit(r - 1) == 0 && c++;
    let u = new f(c, i);
    if (a === 0) {
      u.__setDigit(c - 1, 0);
      for (let h = s; h < r; h++) u.__setDigit(h - s, t.__digit(h));
    } else {
      let h = t.__digit(s) >>> a;
      const d = r - s - 1;
      for (let g = 0; g < d; g++) {
        const p = t.__digit(g + s + 1);
        u.__setDigit(g, 1073741823 & p << 30 - a | h), h = p >>> a;
      }
      u.__setDigit(d, h);
    }
    return l && (u = f.__absoluteAddOne(u, !0, u)), u.__trim();
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
    let l = 0;
    for (const g = i(c, n.length); a < g; a++) {
      const p = 0 - n.__digit(a) - l;
      l = 1 & p >>> 30, s.__setDigit(a, 1073741823 & p);
    }
    for (; a < c; a++) s.__setDigit(a, 0 | 1073741823 & -l);
    let u = c < n.length ? n.__digit(c) : 0;
    const h = t % 30;
    let d;
    if (h == 0) d = 0 - u - l, d &= 1073741823;
    else {
      const g = 32 - h;
      u = u << g >>> g;
      const p = 1 << 32 - g;
      d = p - u - l, d &= p - 1;
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
const St = f.BigInt(0), rr = f.BigInt(1), To = f.BigInt(2), Uc = f.BigInt(10), Fc = f.BigInt(24), Zc = f.BigInt(60), qc = f.BigInt(1e3), wr = f.BigInt(1e6), Kn = f.BigInt(1e9), na = f.multiply(f.BigInt(3600), Kn), Xc = f.multiply(Zc, Kn), Ie = f.multiply(na, Fc);
function ye(e) {
  return typeof e == "bigint" ? f.BigInt(e.toString(10)) : e;
}
function ra(e) {
  return f.equal(f.remainder(e, To), St);
}
function je(e) {
  return f.lessThan(e, St) ? f.unaryMinus(e) : e;
}
function Gr(e, t) {
  return f.lessThan(e, t) ? -1 : f.greaterThan(e, t) ? 1 : 0;
}
function zn(e, t) {
  return { quotient: f.divide(e, t), remainder: f.remainder(e, t) };
}
var Bo, Jo;
const $ = "slot-epochNanoSeconds", k = "slot-iso-date", X = "slot-iso-date-time", V = "slot-time", x = "slot-calendar", ia = "slot-date-brand", oa = "slot-year-month-brand", sa = "slot-month-day-brand", U = "slot-time-zone", gt = "slot-years", pt = "slot-months", kt = "slot-weeks", yt = "slot-days", wt = "slot-hours", vt = "slot-minutes", bt = "slot-seconds", _t = "slot-milliseconds", Tt = "slot-microseconds", Lt = "slot-nanoseconds", aa = "date", ca = "ym", la = "md", ua = "time", ha = "datetime", da = "instant", nn = "original", un = "timezone-canonical", Ui = "timezone-original", Hn = "calendar-id", fa = "locale", Fi = "options", ma = /* @__PURE__ */ new WeakMap(), Zi = Symbol.for("@@Temporal__GetSlots");
(Bo = globalThis)[Zi] || (Bo[Zi] = function(e) {
  return ma.get(e);
});
const yi = globalThis[Zi], qi = Symbol.for("@@Temporal__CreateSlots");
(Jo = globalThis)[qi] || (Jo[qi] = function(e) {
  ma.set(e, /* @__PURE__ */ Object.create(null));
});
const ke = globalThis[qi];
function Ct(e, ...t) {
  if (!e || typeof e != "object") return !1;
  const n = yi(e);
  return !!n && t.every(((r) => r in n));
}
function m(e, t) {
  const n = yi(e)?.[t];
  if (n === void 0) throw new TypeError(`Missing internal slot ${t}`);
  return n;
}
function N(e, t, n) {
  const r = yi(e);
  if (r === void 0) throw new TypeError("Missing slots for the given container");
  if (r[t]) throw new TypeError(`${t} already has set`);
  r[t] = n;
}
const Xi = {};
function Le(e, t) {
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
  Wi(t, e), Wi(`${t}.prototype`, e.prototype);
}
function Wi(e, t) {
  const n = `%${e}%`;
  if (Xi[n] !== void 0) throw new Error(`intrinsic ${e} already exists`);
  Xi[n] = t;
}
function at(e) {
  return Xi[e];
}
function dn(e, t) {
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
function Ai(e, t, n) {
  let r = e, i = n;
  if (r === 0) return i;
  const o = Math.sign(r) || Math.sign(i);
  r = Math.abs(r), i = Math.abs(i);
  const s = r.toPrecision(Math.trunc(1 + Math.log10(r)));
  if (i === 0) return o * Number.parseInt(s + "0".repeat(t), 10);
  const a = s + i.toPrecision(Math.trunc(1 + Math.log10(i))).padStart(t, "0");
  return o * Number.parseInt(a, 10);
}
function wi(e, t) {
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
function vi(e, t, n, r, i) {
  return i === "zero" ? e : i === "infinity" ? t : n < 0 ? e : n > 0 ? t : i === "half-zero" ? e : i === "half-infinity" ? t : r ? e : t;
}
class A {
  constructor(t) {
    this.totalNs = ye(t), this.sec = f.toNumber(f.divide(this.totalNs, Kn)), this.subsec = f.toNumber(f.remainder(this.totalNs, Kn));
  }
  static validateNew(t, n) {
    if (f.greaterThan(je(t), A.MAX)) throw new RangeError(`${n} of duration time units cannot exceed ${A.MAX} s`);
    return new A(t);
  }
  static fromEpochNsDiff(t, n) {
    const r = f.subtract(ye(t), ye(n));
    return new A(r);
  }
  static fromComponents(t, n, r, i, o, s) {
    const a = f.add(f.add(f.add(f.add(f.add(f.BigInt(s), f.multiply(f.BigInt(o), qc)), f.multiply(f.BigInt(i), wr)), f.multiply(f.BigInt(r), Kn)), f.multiply(f.BigInt(n), Xc)), f.multiply(f.BigInt(t), na));
    return A.validateNew(a, "total");
  }
  abs() {
    return new A(je(this.totalNs));
  }
  add(t) {
    return A.validateNew(f.add(this.totalNs, t.totalNs), "sum");
  }
  add24HourDays(t) {
    return A.validateNew(f.add(this.totalNs, f.multiply(f.BigInt(t), Ie)), "sum");
  }
  addToEpochNs(t) {
    return f.add(ye(t), this.totalNs);
  }
  cmp(t) {
    return Gr(this.totalNs, t.totalNs);
  }
  divmod(t) {
    const { quotient: n, remainder: r } = zn(this.totalNs, f.BigInt(t));
    return { quotient: f.toNumber(n), remainder: new A(r) };
  }
  fdiv(t) {
    const n = ye(t), r = f.BigInt(n);
    let { quotient: i, remainder: o } = zn(this.totalNs, r);
    const s = [];
    let a;
    const c = (f.lessThan(this.totalNs, St) ? -1 : 1) * Math.sign(f.toNumber(n));
    for (; !f.equal(o, St) && s.length < 50; ) o = f.multiply(o, Uc), { quotient: a, remainder: o } = zn(o, r), s.push(Math.abs(f.toNumber(a)));
    return c * +(je(i).toString() + "." + s.join(""));
  }
  isZero() {
    return f.equal(this.totalNs, St);
  }
  round(t, n) {
    const r = ye(t);
    if (f.equal(r, rr)) return this;
    const { quotient: i, remainder: o } = zn(this.totalNs, r), s = f.lessThan(this.totalNs, St) ? "negative" : "positive", a = f.multiply(je(i), r), c = f.add(a, r), l = Gr(je(f.multiply(o, To)), r), u = wi(n, s), h = f.equal(je(this.totalNs), a) ? a : vi(a, c, l, ra(i), u), d = s === "positive" ? h : f.unaryMinus(h);
    return A.validateNew(d, "rounding");
  }
  sign() {
    return this.cmp(new A(St));
  }
  subtract(t) {
    return A.validateNew(f.subtract(this.totalNs, t.totalNs), "difference");
  }
}
A.MAX = f.BigInt("9007199254740991999999999"), A.ZERO = new A(St);
const ts = /[A-Za-z._][A-Za-z._0-9+-]*/, vr = new RegExp(`(?:${/(?:[+-](?:[01][0-9]|2[0-3])(?::?[0-5][0-9])?)/.source}|(?:${ts.source})(?:\\/(?:${ts.source}))*)`), ga = /(?:[+-]\d{6}|\d{4})/, Vr = /(?:0[1-9]|1[0-2])/, Gi = /(?:0[1-9]|[12]\d|3[01])/, Wc = new RegExp(`(${ga.source})(?:-(${Vr.source})-(${Gi.source})|(${Vr.source})(${Gi.source}))`), pa = /(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?|(\d{2})(?:(\d{2})(?:[.,](\d{1,9}))?)?)?/, ya = /((?:[+-])(?:[01][0-9]|2[0-3])(?::?(?:[0-5][0-9])(?::?(?:[0-5][0-9])(?:[.,](?:\d{1,9}))?)?)?)/, wa = new RegExp(`([zZ])|${ya.source}?`), wn = /\[(!)?([a-z_][a-z0-9_-]*)=([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)\]/g, Gc = new RegExp([`^${Wc.source}`, `(?:(?:[tT]|\\s+)${pa.source}(?:${wa.source})?)?`, `(?:\\[!?(${vr.source})\\])?`, `((?:${wn.source})*)$`].join("")), Vc = new RegExp([`^[tT]?${pa.source}`, `(?:${wa.source})?`, `(?:\\[!?${vr.source}\\])?`, `((?:${wn.source})*)$`].join("")), Kc = new RegExp(`^(${ga.source})-?(${Vr.source})(?:\\[!?${vr.source}\\])?((?:${wn.source})*)$`), Qc = new RegExp(`^(?:--)?(${Vr.source})-?(${Gi.source})(?:\\[!?${vr.source}\\])?((?:${wn.source})*)$`), Yi = /(\d+)(?:[.,](\d{1,9}))?/, Bc = new RegExp(`(?:${Yi.source}H)?(?:${Yi.source}M)?(?:${Yi.source}S)?`), Jc = new RegExp(`^([+-])?P${/(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?/.source}(?:T(?!$)${Bc.source})?$`, "i"), Pe = 864e5, Kr = 1e6 * Pe, tl = 6e10, va = 1e8 * Pe, vn = ae(va), ir = f.unaryMinus(vn), el = f.add(f.subtract(ir, Ie), rr), nl = f.subtract(f.add(vn, Ie), rr), rl = 146097 * Pe, es = -271821, ns = 275760, Qn = Date.UTC(1847, 0, 1), il = ["iso8601", "hebrew", "islamic", "islamic-umalqura", "islamic-tbla", "islamic-civil", "islamic-rgsa", "islamicc", "persian", "ethiopic", "ethioaa", "ethiopic-amete-alem", "coptic", "chinese", "dangi", "roc", "indian", "buddhist", "japanese", "gregory"], ol = /* @__PURE__ */ new Set(["ACT", "AET", "AGT", "ART", "AST", "BET", "BST", "CAT", "CNT", "CST", "CTT", "EAT", "ECT", "IET", "IST", "JST", "MIT", "NET", "NST", "PLT", "PNT", "PRT", "PST", "SST", "VST"]);
function K(e) {
  return typeof e == "object" && e !== null || typeof e == "function";
}
function bi(e) {
  if (typeof e == "bigint") throw new TypeError("Cannot convert BigInt to number");
  return Number(e);
}
function _i(e) {
  if (typeof e == "symbol") throw new TypeError("Cannot convert a Symbol value to a String");
  return String(e);
}
function L(e) {
  const t = bi(e);
  if (t === 0) return 0;
  if (Number.isNaN(t) || t === 1 / 0 || t === -1 / 0) throw new RangeError("invalid number value");
  const n = Math.trunc(t);
  return n === 0 ? 0 : n;
}
function rs(e, t) {
  const n = L(e);
  if (n <= 0)
    throw t !== void 0 ? new RangeError(`property '${t}' cannot be a a number less than one`) : new RangeError("Cannot convert a number less than one to a positive integer");
  return n;
}
function Vt(e) {
  const t = bi(e);
  if (Number.isNaN(t)) throw new RangeError("not a number");
  if (t === 1 / 0 || t === -1 / 0) throw new RangeError("infinity is out of range");
  if (!(function(n) {
    if (typeof n != "number" || Number.isNaN(n) || n === 1 / 0 || n === -1 / 0) return !1;
    const r = Math.abs(n);
    return Math.floor(r) === r;
  })(t)) throw new RangeError(`unsupported fractional value ${e}`);
  return t === 0 ? 0 : t;
}
function or(e, t) {
  return String(e).padStart(t, "0");
}
function tt(e) {
  if (typeof e != "string") throw new TypeError(`expected a string, not ${String(e)}`);
  return e;
}
function Vi(e, t) {
  if (K(e)) {
    const n = e?.toString();
    if (typeof n == "string" || typeof n == "number") return n;
    throw new TypeError("Cannot convert object to primitive value");
  }
  return e;
}
const Ki = ["era", "eraYear", "year", "month", "monthCode", "day", "hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset", "timeZone"], sl = { era: _i, eraYear: L, year: L, month: rs, monthCode: function(e) {
  const t = tt(Vi(e));
  if (t.length < 3 || t.length > 4 || t[0] !== "M" || "0123456789".indexOf(t[1]) === -1 || "0123456789".indexOf(t[2]) === -1 || t[1] + t[2] === "00" && t[3] !== "L" || t[3] !== "L" && t[3] !== void 0) throw new RangeError(`bad month code ${t}; must match M01-M99 or M00L-M99L`);
  return t;
}, day: rs, hour: L, minute: L, second: L, millisecond: L, microsecond: L, nanosecond: L, offset: function(e) {
  const t = tt(Vi(e));
  return Nn(t), t;
}, timeZone: xt }, al = { hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }, bn = [["years", "year", "date"], ["months", "month", "date"], ["weeks", "week", "date"], ["days", "day", "date"], ["hours", "hour", "time"], ["minutes", "minute", "time"], ["seconds", "second", "time"], ["milliseconds", "millisecond", "time"], ["microseconds", "microsecond", "time"], ["nanoseconds", "nanosecond", "time"]], is = Object.fromEntries(bn.map(((e) => [e[0], e[1]]))), cl = Object.fromEntries(bn.map((([e, t]) => [t, e]))), Bn = bn.map((([, e]) => e)), _n = { day: Kr, hour: 36e11, minute: 6e10, second: 1e9, millisecond: 1e6, microsecond: 1e3, nanosecond: 1 }, Qr = ["days", "hours", "microseconds", "milliseconds", "minutes", "months", "nanoseconds", "seconds", "weeks", "years"], ll = Intl.DateTimeFormat, os = /* @__PURE__ */ new Map();
function ba(e) {
  const t = ur(e);
  let n = os.get(t);
  return n === void 0 && (n = new ll("en-us", { timeZone: t, hour12: !1, era: "short", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }), os.set(t, n)), n;
}
function it(e) {
  return Ct(e, $) && !Ct(e, U, x);
}
function W(e) {
  return Ct(e, gt, pt, yt, wt, vt, bt, _t, Tt, Lt);
}
function G(e) {
  return Ct(e, ia);
}
function B(e) {
  return Ct(e, V);
}
function q(e) {
  return Ct(e, X);
}
function ot(e) {
  return Ct(e, oa);
}
function Pt(e) {
  return Ct(e, sa);
}
function O(e) {
  return Ct(e, $, U, x);
}
function b(e, t) {
  if (!t(e)) throw new TypeError("invalid receiver: method called with the wrong type of this-object");
}
function kn(e) {
  if (Ct(e, x) || Ct(e, U)) throw new TypeError("with() does not support a calendar or timeZone property");
  if (B(e)) throw new TypeError("with() does not accept Temporal.PlainTime, use withPlainTime() instead");
  if (e.calendar !== void 0) throw new TypeError("with() does not support a calendar property");
  if (e.timeZone !== void 0) throw new TypeError("with() does not support a timeZone property");
}
function br(e, t) {
  return t === "never" || t === "auto" && e === "iso8601" ? "" : `[${t === "critical" ? "!" : ""}u-ca=${e}]`;
}
function Ti(e) {
  let t, n, r = !1;
  for (wn.lastIndex = 0; n = wn.exec(e); ) {
    const { 1: i, 2: o, 3: s } = n;
    if (o === "u-ca") {
      if (t === void 0) t = s, r = i === "!";
      else if (i === "!" || r) throw new RangeError(`Invalid annotations in ${e}: more than one u-ca present with critical flag`);
    } else if (i === "!") throw new RangeError(`Unrecognized annotation: !${o}=${s}`);
  }
  return t;
}
function fe(e) {
  const t = Gc.exec(e);
  if (!t) throw new RangeError(`invalid RFC 9557 string: ${e}`);
  const n = Ti(t[16]);
  let r = t[1];
  if (r === "-000000") throw new RangeError(`invalid RFC 9557 string: ${e}`);
  const i = +r, o = +(t[2] ?? t[4] ?? 1), s = +(t[3] ?? t[5] ?? 1), a = t[6] !== void 0, c = +(t[6] ?? 0), l = +(t[7] ?? t[10] ?? 0);
  let u = +(t[8] ?? t[11] ?? 0);
  u === 60 && (u = 59);
  const h = (t[9] ?? t[12] ?? "") + "000000000", d = +h.slice(0, 3), g = +h.slice(3, 6), p = +h.slice(6, 9);
  let w, y = !1;
  t[13] ? (w = void 0, y = !0) : t[14] && (w = t[14]);
  const v = t[15];
  return $o(i, o, s, c, l, u, d, g, p), { year: i, month: o, day: s, time: a ? { hour: c, minute: l, second: u, millisecond: d, microsecond: g, nanosecond: p } : "start-of-day", tzAnnotation: v, offset: w, z: y, calendar: n };
}
function _a(e) {
  const t = Vc.exec(e);
  let n, r, i, o, s, a, c;
  if (t) {
    c = Ti(t[10]), n = +(t[1] ?? 0), r = +(t[2] ?? t[5] ?? 0), i = +(t[3] ?? t[6] ?? 0), i === 60 && (i = 59);
    const l = (t[4] ?? t[7] ?? "") + "000000000";
    if (o = +l.slice(0, 3), s = +l.slice(3, 6), a = +l.slice(6, 9), t[8]) throw new RangeError("Z designator not supported for PlainTime");
  } else {
    let l, u;
    if ({ time: l, z: u, calendar: c } = fe(e), l === "start-of-day") throw new RangeError(`time is missing in string: ${e}`);
    if (u) throw new RangeError("Z designator not supported for PlainTime");
    ({ hour: n, minute: r, second: i, millisecond: o, microsecond: s, nanosecond: a } = l);
  }
  if (Di(n, r, i, o, s, a), /[tT ][0-9][0-9]/.test(e)) return { hour: n, minute: r, second: i, millisecond: o, microsecond: s, nanosecond: a, calendar: c };
  try {
    const { month: l, day: u } = Eo(e);
    Ve(1972, l, u);
  } catch {
    try {
      const { year: l, month: u } = Mo(e);
      Ve(l, u, 1);
    } catch {
      return { hour: n, minute: r, second: i, millisecond: o, microsecond: s, nanosecond: a, calendar: c };
    }
  }
  throw new RangeError(`invalid RFC 9557 time-only string ${e}; may need a T prefix`);
}
function Mo(e) {
  const t = Kc.exec(e);
  let n, r, i, o;
  if (t) {
    i = Ti(t[3]);
    let s = t[1];
    if (s === "-000000") throw new RangeError(`invalid RFC 9557 string: ${e}`);
    if (n = +s, r = +t[2], o = 1, i !== void 0 && i !== "iso8601") throw new RangeError("YYYY-MM format is only valid with iso8601 calendar");
  } else {
    let s;
    if ({ year: n, month: r, calendar: i, day: o, z: s } = fe(e), s) throw new RangeError("Z designator not supported for PlainYearMonth");
  }
  return { year: n, month: r, calendar: i, referenceISODay: o };
}
function Eo(e) {
  const t = Qc.exec(e);
  let n, r, i, o;
  if (t) {
    if (i = Ti(t[3]), n = +t[1], r = +t[2], i !== void 0 && i !== "iso8601") throw new RangeError("MM-DD format is only valid with iso8601 calendar");
  } else {
    let s;
    if ({ month: n, day: r, calendar: i, year: o, z: s } = fe(e), s) throw new RangeError("Z designator not supported for PlainMonthDay");
  }
  return { month: n, day: r, calendar: i, referenceISOYear: o };
}
const Ta = new RegExp(`^${vr.source}$`, "i"), Ma = new RegExp(`^${/([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])?)?/.source}$`);
function Ea(e) {
  const t = hl.test(e) ? "Seconds not allowed in offset time zone" : "Invalid time zone";
  throw new RangeError(`${t}: ${e}`);
}
function Ye(e) {
  return Ta.test(e) || Ea(e), Ma.test(e) ? { offsetMinutes: Nn(e) / 6e10 } : { tzName: e };
}
function Jn(e, t, n, r) {
  let i = e, o = t, s = n;
  switch (r) {
    case "reject":
      Ve(i, o, s);
      break;
    case "constrain":
      ({ year: i, month: o, day: s } = ja(i, o, s));
  }
  return { year: i, month: o, day: s };
}
function Mi(e, t, n, r, i, o, s) {
  let a = e, c = t, l = n, u = r, h = i, d = o;
  switch (s) {
    case "reject":
      Di(a, c, l, u, h, d);
      break;
    case "constrain":
      a = Mt(a, 0, 23), c = Mt(c, 0, 59), l = Mt(l, 0, 59), u = Mt(u, 0, 999), h = Mt(h, 0, 999), d = Mt(d, 0, 999);
  }
  return { hour: a, minute: c, second: l, millisecond: u, microsecond: h, nanosecond: d };
}
function xa(e) {
  if (!K(e)) throw new TypeError("invalid duration-like");
  const t = { years: void 0, months: void 0, weeks: void 0, days: void 0, hours: void 0, minutes: void 0, seconds: void 0, milliseconds: void 0, microseconds: void 0, nanoseconds: void 0 };
  let n = !1;
  for (let r = 0; r < Qr.length; r++) {
    const i = Qr[r], o = e[i];
    o !== void 0 && (n = !0, t[i] = Vt(o));
  }
  if (!n) throw new TypeError("invalid duration-like");
  return t;
}
function lt({ years: e, months: t, weeks: n, days: r }, i, o, s) {
  return { years: e, months: s ?? t, weeks: o ?? n, days: i ?? r };
}
function H(e, t) {
  return { isoDate: e, time: t };
}
function S(e) {
  return xe(e, "overflow", ["constrain", "reject"], "constrain");
}
function tr(e) {
  return xe(e, "disambiguation", ["compatible", "earlier", "later", "reject"], "compatible");
}
function Bt(e, t) {
  return xe(e, "roundingMode", ["ceil", "floor", "expand", "trunc", "halfCeil", "halfFloor", "halfExpand", "halfTrunc", "halfEven"], t);
}
function Ur(e, t) {
  return xe(e, "offset", ["prefer", "use", "ignore", "reject"], t);
}
function _r(e) {
  return xe(e, "calendarName", ["auto", "always", "never", "critical"], "auto");
}
function Ln(e) {
  let t = e.roundingIncrement;
  if (t === void 0) return 1;
  const n = L(t);
  if (n < 1 || n > 1e9) throw new RangeError(`roundingIncrement must be at least 1 and at most 1e9, not ${t}`);
  return n;
}
function Rn(e, t, n) {
  const r = n ? t : t - 1;
  if (e > r) throw new RangeError(`roundingIncrement must be at least 1 and less than ${r}, not ${e}`);
  if (t % e != 0) throw new RangeError(`Rounding increment must divide evenly into ${t}`);
}
function Tr(e) {
  const t = e.fractionalSecondDigits;
  if (t === void 0) return "auto";
  if (typeof t != "number") {
    if (_i(t) !== "auto") throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${t}`);
    return "auto";
  }
  const n = Math.floor(t);
  if (!Number.isFinite(n) || n < 0 || n > 9) throw new RangeError(`fractionalSecondDigits must be 'auto' or 0 through 9, not ${t}`);
  return n;
}
function Mr(e, t) {
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
const Ce = Symbol("~required~");
function Nt(e, t, n, r, i = []) {
  let o = [];
  for (let l = 0; l < bn.length; l++) {
    const u = bn[l], h = u[1], d = u[2];
    n !== "datetime" && n !== d || o.push(h);
  }
  o = o.concat(i);
  let s = r;
  s === Ce ? s = void 0 : s !== void 0 && o.push(s);
  let a = [];
  a = a.concat(o);
  for (let l = 0; l < o.length; l++) {
    const u = o[l], h = cl[u];
    h !== void 0 && a.push(h);
  }
  let c = xe(e, t, a, s);
  if (c === void 0 && r === Ce) throw new RangeError(`${t} is required`);
  return c && c in is ? is[c] : c;
}
function Ii(e) {
  const t = e.relativeTo;
  if (t === void 0) return {};
  let n, r, i, o, s, a = "option", c = !1;
  if (K(t)) {
    if (O(t)) return { zonedRelativeTo: t };
    if (G(t)) return { plainRelativeTo: t };
    if (q(t)) return { plainRelativeTo: Et(m(t, X).isoDate, m(t, x)) };
    i = $r(t);
    const l = jt(i, t, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset", "timeZone"], []);
    ({ isoDate: n, time: r } = xr(i, l, "constrain")), { offset: s, timeZone: o } = l, s === void 0 && (a = "wall");
  } else {
    let l, u, h, d, g;
    if ({ year: h, month: d, day: g, time: r, calendar: i, tzAnnotation: l, offset: s, z: u } = fe(tt(t)), l) o = xt(l), u ? a = "exact" : s || (a = "wall"), c = !0;
    else if (u) throw new RangeError("Z designator not supported for PlainDate relativeTo; either remove the Z or add a bracketed time zone");
    i || (i = "iso8601"), i = $t(i), n = { year: h, month: d, day: g };
  }
  return o === void 0 ? { plainRelativeTo: Et(n, i) } : { zonedRelativeTo: ct(Br(n, r, a, a === "option" ? Nn(s) : 0, o, "compatible", "reject", c), o, i) };
}
function we(e) {
  return m(e, gt) !== 0 ? "year" : m(e, pt) !== 0 ? "month" : m(e, kt) !== 0 ? "week" : m(e, yt) !== 0 ? "day" : m(e, wt) !== 0 ? "hour" : m(e, vt) !== 0 ? "minute" : m(e, bt) !== 0 ? "second" : m(e, _t) !== 0 ? "millisecond" : m(e, Tt) !== 0 ? "microsecond" : "nanosecond";
}
function Me(e, t) {
  return Bn.indexOf(e) > Bn.indexOf(t) ? t : e;
}
function re(e) {
  return e === "year" || e === "month" || e === "week";
}
function ve(e) {
  return re(e) || e === "day" ? "date" : "time";
}
function ze(e) {
  return at("%calendarImpl%")(e);
}
function Er(e) {
  return at("%calendarImpl%")(m(e, x));
}
function Dt(e, t, n = "date") {
  const r = /* @__PURE__ */ Object.create(null), i = ze(e).isoToDate(t, { year: !0, monthCode: !0, day: !0 });
  return r.monthCode = i.monthCode, n !== "month-day" && n !== "date" || (r.day = i.day), n !== "year-month" && n !== "date" || (r.year = i.year), r;
}
function jt(e, t, n, r, i) {
  const o = ze(e).extraFields(n), s = n.concat(r, o), a = /* @__PURE__ */ Object.create(null);
  let c = !1;
  s.sort();
  for (let l = 0; l < s.length; l++) {
    const u = s[l], h = t[u];
    if (h !== void 0) c = !0, a[u] = (0, sl[u])(h);
    else if (i !== "partial") {
      if (i.includes(u)) throw new TypeError(`required property '${u}' missing or undefined`);
      a[u] = al[u];
    }
  }
  if (i === "partial" && !c) throw new TypeError("no supported properties found");
  return a;
}
function Qi(e, t = "complete") {
  const n = ["hour", "microsecond", "millisecond", "minute", "nanosecond", "second"];
  let r = !1;
  const i = /* @__PURE__ */ Object.create(null);
  for (let o = 0; o < n.length; o++) {
    const s = n[o], a = e[s];
    a !== void 0 ? (i[s] = L(a), r = !0) : t === "complete" && (i[s] = 0);
  }
  if (!r) throw new TypeError("invalid time-like");
  return i;
}
function jn(e, t) {
  if (K(e)) {
    if (G(e)) return S(C(t)), Et(m(e, k), m(e, x));
    if (O(e)) {
      const c = Xt(m(e, U), m(e, $));
      return S(C(t)), Et(c.isoDate, m(e, x));
    }
    if (q(e)) return S(C(t)), Et(m(e, X).isoDate, m(e, x));
    const a = $r(e);
    return Et(Se(a, jt(a, e, ["year", "month", "monthCode", "day"], [], []), S(C(t))), a);
  }
  let { year: n, month: r, day: i, calendar: o, z: s } = fe(tt(e));
  if (s) throw new RangeError("Z designator not supported for PlainDate");
  return o || (o = "iso8601"), o = $t(o), S(C(t)), Et({ year: n, month: r, day: i }, o);
}
function xr(e, t, n) {
  return H(Se(e, t, n), Mi(t.hour, t.minute, t.second, t.millisecond, t.microsecond, t.nanosecond, n));
}
function Un(e, t) {
  let n, r, i;
  if (K(e)) {
    if (q(e)) return S(C(t)), Ut(m(e, X), m(e, x));
    if (O(e)) {
      const a = Xt(m(e, U), m(e, $));
      return S(C(t)), Ut(a, m(e, x));
    }
    if (G(e)) return S(C(t)), Ut(H(m(e, k), { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), m(e, x));
    i = $r(e);
    const o = jt(i, e, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond"], []), s = S(C(t));
    ({ isoDate: n, time: r } = xr(i, o, s));
  } else {
    let o, s, a, c;
    if ({ year: s, month: a, day: c, time: r, calendar: i, z: o } = fe(tt(e)), o) throw new RangeError("Z designator not supported for PlainDateTime");
    r === "start-of-day" && (r = { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), $o(s, a, c, r.hour, r.minute, r.second, r.millisecond, r.microsecond, r.nanosecond), i || (i = "iso8601"), i = $t(i), S(C(t)), n = { year: s, month: a, day: c };
  }
  return Ut(H(n, r), i);
}
function qt(e) {
  const t = at("%Temporal.Duration%");
  if (W(e)) return new t(m(e, gt), m(e, pt), m(e, kt), m(e, yt), m(e, wt), m(e, vt), m(e, bt), m(e, _t), m(e, Tt), m(e, Lt));
  if (!K(e)) return (function(i) {
    const { years: o, months: s, weeks: a, days: c, hours: l, minutes: u, seconds: h, milliseconds: d, microseconds: g, nanoseconds: p } = (function(w) {
      const y = Jc.exec(w);
      if (!y) throw new RangeError(`invalid duration: ${w}`);
      if (y.every(((ht, Gt) => Gt < 2 || ht === void 0))) throw new RangeError(`invalid duration: ${w}`);
      const v = y[1] === "-" ? -1 : 1, _ = y[2] === void 0 ? 0 : L(y[2]) * v, T = y[3] === void 0 ? 0 : L(y[3]) * v, M = y[4] === void 0 ? 0 : L(y[4]) * v, E = y[5] === void 0 ? 0 : L(y[5]) * v, R = y[6] === void 0 ? 0 : L(y[6]) * v, F = y[7], j = y[8], Y = y[9], P = y[10], D = y[11];
      let I = 0, z = 0, Q = 0;
      if (F !== void 0) {
        if (j ?? Y ?? P ?? D) throw new RangeError("only the smallest unit can be fractional");
        Q = 3600 * L((F + "000000000").slice(0, 9)) * v;
      } else if (I = j === void 0 ? 0 : L(j) * v, Y !== void 0) {
        if (P ?? D) throw new RangeError("only the smallest unit can be fractional");
        Q = 60 * L((Y + "000000000").slice(0, 9)) * v;
      } else z = P === void 0 ? 0 : L(P) * v, D !== void 0 && (Q = L((D + "000000000").slice(0, 9)) * v);
      const It = Q % 1e3, Z = Math.trunc(Q / 1e3) % 1e3, rt = Math.trunc(Q / 1e6) % 1e3;
      return z += Math.trunc(Q / 1e9) % 60, I += Math.trunc(Q / 6e10), Ci(_, T, M, E, R, I, z, rt, Z, It), { years: _, months: T, weeks: M, days: E, hours: R, minutes: I, seconds: z, milliseconds: rt, microseconds: Z, nanoseconds: It };
    })(i);
    return new (at("%Temporal.Duration%"))(o, s, a, c, l, u, h, d, g, p);
  })(tt(e));
  const n = { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, microseconds: 0, nanoseconds: 0 };
  let r = xa(e);
  for (let i = 0; i < Qr.length; i++) {
    const o = Qr[i], s = r[o];
    s !== void 0 && (n[o] = s);
  }
  return new t(n.years, n.months, n.weeks, n.days, n.hours, n.minutes, n.seconds, n.milliseconds, n.microseconds, n.nanoseconds);
}
function Fn(e) {
  let t;
  if (K(e)) {
    if (it(e) || O(e)) return oe(m(e, $));
    t = Vi(e);
  } else t = e;
  const { year: n, month: r, day: i, time: o, offset: s, z: a } = (function(w) {
    const y = fe(w);
    if (!y.z && !y.offset) throw new RangeError("Temporal.Instant requires a time zone offset");
    return y;
  })(tt(t)), { hour: c = 0, minute: l = 0, second: u = 0, millisecond: h = 0, microsecond: d = 0, nanosecond: g = 0 } = o === "start-of-day" ? {} : o, p = lr(n, r, i, c, l, u, h, d, g - (a ? 0 : Nn(s)));
  return pn(p.isoDate), oe(st(p));
}
function ss(e, t) {
  if (K(e)) {
    if (Pt(e)) return S(C(t)), fn(m(e, k), m(e, x));
    let a;
    return Ct(e, x) ? a = m(e, x) : (a = e.calendar, a === void 0 && (a = "iso8601"), a = Cr(a)), fn(Jr(a, jt(a, e, ["year", "month", "monthCode", "day"], [], []), S(C(t))), a);
  }
  let { month: n, day: r, referenceISOYear: i, calendar: o } = Eo(tt(e));
  if (o === void 0 && (o = "iso8601"), o = $t(o), S(C(t)), o === "iso8601") return fn({ year: 1972, month: n, day: r }, o);
  let s = { year: i, month: n, day: r };
  return rn(s), s = Jr(o, Dt(o, s, "month-day"), "constrain"), fn(s, o);
}
function Oe(e, t) {
  let n;
  if (K(e)) {
    if (B(e)) return S(C(t)), be(m(e, V));
    if (q(e)) return S(C(t)), be(m(e, X).time);
    if (O(e)) {
      const l = Xt(m(e, U), m(e, $));
      return S(C(t)), be(l.time);
    }
    const { hour: r, minute: i, second: o, millisecond: s, microsecond: a, nanosecond: c } = Qi(e);
    n = Mi(r, i, o, s, a, c, S(C(t)));
  } else n = _a(tt(e)), S(C(t));
  return be(n);
}
function Da(e) {
  return e === void 0 ? { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 } : m(Oe(e), V);
}
function Zn(e, t) {
  if (K(e)) {
    if (ot(e)) return S(C(t)), gn(m(e, k), m(e, x));
    const a = $r(e);
    return gn(sr(a, jt(a, e, ["year", "month", "monthCode"], [], []), S(C(t))), a);
  }
  let { year: n, month: r, referenceISODay: i, calendar: o } = Mo(tt(e));
  o === void 0 && (o = "iso8601"), o = $t(o), S(C(t));
  let s = { year: n, month: r, day: i };
  return ko(s), s = sr(o, Dt(o, s, "year-month"), "constrain"), gn(s, o);
}
function Br(e, t, n, r, i, o, s, a) {
  if (t === "start-of-day") return Re(i, e);
  const c = H(e, t);
  if (n === "wall" || s === "ignore") return ut(i, c, o);
  if (n === "exact" || s === "use") {
    const h = lr(e.year, e.month, e.day, t.hour, t.minute, t.second, t.millisecond, t.microsecond, t.nanosecond - r);
    pn(h.isoDate);
    const d = st(h);
    return he(d), d;
  }
  pn(e);
  const l = st(c), u = ar(i, c);
  for (let h = 0; h < u.length; h++) {
    const d = u[h], g = f.toNumber(f.subtract(l, d)), p = Ae(g, 6e10, "halfExpand");
    if (g === r || a && p === r) return d;
  }
  if (s === "reject") {
    const h = Bi(r), d = cr(c, "iso8601", "auto");
    throw new RangeError(`Offset ${h} is invalid for ${d} in ${i}`);
  }
  return Ya(u, i, c, o);
}
function qn(e, t) {
  let n, r, i, o, s, a, c, l = !1, u = "option";
  if (K(e)) {
    if (O(e)) {
      const w = C(t);
      return tr(w), Ur(w, "reject"), S(w), ct(m(e, $), m(e, U), m(e, x));
    }
    s = $r(e);
    const d = jt(s, e, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset", "timeZone"], ["timeZone"]);
    ({ offset: o, timeZone: i } = d), o === void 0 && (u = "wall");
    const g = C(t);
    a = tr(g), c = Ur(g, "reject");
    const p = S(g);
    ({ isoDate: n, time: r } = xr(s, d, p));
  } else {
    let d, g, p, w, y;
    ({ year: p, month: w, day: y, time: r, tzAnnotation: d, offset: o, z: g, calendar: s } = (function(_) {
      const T = fe(_);
      if (!T.tzAnnotation) throw new RangeError("Temporal.ZonedDateTime requires a time zone ID in brackets");
      return T;
    })(tt(e))), i = xt(d), g ? u = "exact" : o || (u = "wall"), s || (s = "iso8601"), s = $t(s), l = !0;
    const v = C(t);
    a = tr(v), c = Ur(v, "reject"), S(v), n = { year: p, month: w, day: y };
  }
  let h = 0;
  return u === "option" && (h = Nn(o)), ct(Br(n, r, u, h, i, a, c, l), i, s);
}
function Ca(e, t, n) {
  rn(t), ke(e), N(e, k, t), N(e, x, n), N(e, ia, !0);
}
function Et(e, t) {
  const n = at("%Temporal.PlainDate%"), r = Object.create(n.prototype);
  return Ca(r, e, t), r;
}
function $a(e, t, n) {
  Ke(t), ke(e), N(e, X, t), N(e, x, n);
}
function Ut(e, t) {
  const n = at("%Temporal.PlainDateTime%"), r = Object.create(n.prototype);
  return $a(r, e, t), r;
}
function ka(e, t, n) {
  rn(t), ke(e), N(e, k, t), N(e, x, n), N(e, sa, !0);
}
function fn(e, t) {
  const n = at("%Temporal.PlainMonthDay%"), r = Object.create(n.prototype);
  return ka(r, e, t), r;
}
function La(e, t) {
  ke(e), N(e, V, t);
}
function be(e) {
  const t = at("%Temporal.PlainTime%"), n = Object.create(t.prototype);
  return La(n, e), n;
}
function Ra(e, t, n) {
  ko(t), ke(e), N(e, k, t), N(e, x, n), N(e, oa, !0);
}
function gn(e, t) {
  const n = at("%Temporal.PlainYearMonth%"), r = Object.create(n.prototype);
  return Ra(r, e, t), r;
}
function Na(e, t) {
  he(t), ke(e), N(e, $, t);
}
function oe(e) {
  const t = at("%Temporal.Instant%"), n = Object.create(t.prototype);
  return Na(n, e), n;
}
function Oa(e, t, n, r) {
  he(t), ke(e), N(e, $, t), N(e, U, n), N(e, x, r);
}
function ct(e, t, n = "iso8601") {
  const r = at("%Temporal.ZonedDateTime%"), i = Object.create(r.prototype);
  return Oa(i, e, t, n), i;
}
function as(e) {
  return Ki.filter(((t) => e[t] !== void 0));
}
function Ge(e, t, n) {
  const r = as(n), i = ze(e).fieldKeysToIgnore(r), o = /* @__PURE__ */ Object.create(null), s = as(t);
  for (let a = 0; a < Ki.length; a++) {
    let c;
    const l = Ki[a];
    s.includes(l) && !i.includes(l) && (c = t[l]), r.includes(l) && (c = n[l]), c !== void 0 && (o[l] = c);
  }
  return o;
}
function zt(e, t, n, r) {
  const i = ze(e).dateAdd(t, n, r);
  return rn(i), i;
}
function Dr(e, t, n, r) {
  return ze(e).dateUntil(t, n, r);
}
function Cr(e) {
  if (K(e) && Ct(e, x)) return m(e, x);
  const t = tt(e);
  try {
    return $t(t);
  } catch {
  }
  let n;
  try {
    ({ calendar: n } = fe(t));
  } catch {
    try {
      ({ calendar: n } = _a(t));
    } catch {
      try {
        ({ calendar: n } = Mo(t));
      } catch {
        ({ calendar: n } = Eo(t));
      }
    }
  }
  return n || (n = "iso8601"), $t(n);
}
function $r(e) {
  if (Ct(e, x)) return m(e, x);
  const { calendar: t } = e;
  return t === void 0 ? "iso8601" : Cr(t);
}
function ue(e, t) {
  return $t(e) === $t(t);
}
function Se(e, t, n) {
  const r = ze(e);
  r.resolveFields(t, "date");
  const i = r.dateToISO(t, n);
  return rn(i), i;
}
function sr(e, t, n) {
  const r = ze(e);
  r.resolveFields(t, "year-month"), t.day = 1;
  const i = r.dateToISO(t, n);
  return ko(i), i;
}
function Jr(e, t, n) {
  const r = ze(e);
  r.resolveFields(t, "month-day");
  const i = r.monthDayToISOReferenceDate(t, n);
  return rn(i), i;
}
function xt(e) {
  if (K(e) && O(e)) return m(e, U);
  const t = tt(e);
  if (t === "UTC") return "UTC";
  const { tzName: n, offsetMinutes: r } = (function(o) {
    const { tzAnnotation: s, offset: a, z: c } = (function(l) {
      if (Ta.test(l)) return { tzAnnotation: l, offset: void 0, z: !1 };
      try {
        const { tzAnnotation: u, offset: h, z: d } = fe(l);
        if (d || u || h) return { tzAnnotation: u, offset: h, z: d };
      } catch {
      }
      Ea(l);
    })(o);
    return s ? Ye(s) : c ? Ye("UTC") : a ? Ye(a) : void 0;
  })(t);
  if (r !== void 0) return xo(r);
  const i = ti(n);
  if (!i) throw new RangeError(`Unrecognized time zone ${n}`);
  return i.identifier;
}
function Aa(e, t) {
  if (e === t) return !0;
  const n = Ye(e).offsetMinutes, r = Ye(t).offsetMinutes;
  if (n === void 0 && r === void 0) {
    const i = ti(t);
    if (!i) return !1;
    const o = ti(e);
    return !!o && o.primaryIdentifier === i.primaryIdentifier;
  }
  return n === r;
}
function _e(e, t) {
  const n = Ye(e).offsetMinutes;
  return n !== void 0 ? 6e10 * n : Ji(e, t);
}
function Bi(e) {
  const t = e < 0 ? "-" : "+", n = Math.abs(e), r = Math.floor(n / 36e11), i = Math.floor(n / 6e10) % 60, o = Math.floor(n / 1e9) % 60, s = n % 1e9;
  return `${t}${Ei(r, i, o, s, o === 0 && s === 0 ? "minute" : "auto")}`;
}
function Xt(e, t) {
  const n = _e(e, t);
  let { isoDate: { year: r, month: i, day: o }, time: { hour: s, minute: a, second: c, millisecond: l, microsecond: u, nanosecond: h } } = Sa(t);
  return lr(r, i, o, s, a, c, l, u, h + n);
}
function ut(e, t, n) {
  return Ya(ar(e, t), e, t, n);
}
function Ya(e, t, n, r) {
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
  const o = st(n), s = f.subtract(o, Ie);
  he(s);
  const a = _e(t, s), c = f.add(o, Ie);
  he(c);
  const l = _e(t, c) - a;
  switch (r) {
    case "earlier": {
      const u = A.fromComponents(0, 0, 0, 0, 0, -l), h = Tn(n.time, u);
      return ar(t, H(At(n.isoDate.year, n.isoDate.month, n.isoDate.day + h.deltaDays), h))[0];
    }
    case "compatible":
    case "later": {
      const u = A.fromComponents(0, 0, 0, 0, 0, l), h = Tn(n.time, u), d = ar(t, H(At(n.isoDate.year, n.isoDate.month, n.isoDate.day + h.deltaDays), h));
      return d[d.length - 1];
    }
  }
}
function ar(e, t) {
  if (e === "UTC") return pn(t.isoDate), [st(t)];
  const n = Ye(e).offsetMinutes;
  if (n !== void 0) {
    const r = lr(t.isoDate.year, t.isoDate.month, t.isoDate.day, t.time.hour, t.time.minute - n, t.time.second, t.time.millisecond, t.time.microsecond, t.time.nanosecond);
    pn(r.isoDate);
    const i = st(r);
    return he(i), [i];
  }
  return pn(t.isoDate), (function(r, i) {
    let o = st(i), s = f.subtract(o, Ie);
    f.lessThan(s, ir) && (s = o);
    let a = f.add(o, Ie);
    f.greaterThan(a, vn) && (a = o);
    const c = Ji(r, s), l = Ji(r, a);
    return (c === l ? [c] : [c, l]).map(((h) => {
      const d = f.subtract(o, f.BigInt(h)), g = (function(p, w) {
        const { epochMilliseconds: y, time: { millisecond: v, microsecond: _, nanosecond: T } } = Sa(w), { year: M, month: E, day: R, hour: F, minute: j, second: Y } = za(p, y);
        return lr(M, E, R, F, j, Y, v, _, T);
      })(r, d);
      if (Mn(i, g) === 0) return he(d), d;
    })).filter(((h) => h !== void 0));
  })(e, t);
}
function Re(e, t) {
  const n = H(t, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), r = ar(e, n);
  if (r.length) return r[0];
  const i = st(n), o = f.subtract(i, Ie);
  return he(o), Co(e, o);
}
function kr(e) {
  let t;
  return t = e < 0 || e > 9999 ? (e < 0 ? "-" : "+") + or(Math.abs(e), 6) : or(e, 4), t;
}
function Ht(e) {
  return or(e, 2);
}
function Ia(e, t) {
  let n;
  if (t === "auto") {
    if (e === 0) return "";
    n = or(e, 9).replace(/0+$/, "");
  } else {
    if (t === 0) return "";
    n = or(e, 9).slice(0, t);
  }
  return `.${n}`;
}
function Ei(e, t, n, r, i) {
  let o = `${Ht(e)}:${Ht(t)}`;
  return i === "minute" || (o += `:${Ht(n)}`, o += Ia(r, i)), o;
}
function cs(e, t, n) {
  let r = t;
  r === void 0 && (r = "UTC");
  const i = m(e, $), o = cr(Xt(r, i), "iso8601", n, "never");
  let s = "Z";
  return t !== void 0 && (s = Pa(_e(r, i))), `${o}${s}`;
}
function Ir(e, t) {
  const n = m(e, gt), r = m(e, pt), i = m(e, kt), o = m(e, yt), s = m(e, wt), a = m(e, vt), c = ni(e);
  let l = "";
  n !== 0 && (l += `${Math.abs(n)}Y`), r !== 0 && (l += `${Math.abs(r)}M`), i !== 0 && (l += `${Math.abs(i)}W`), o !== 0 && (l += `${Math.abs(o)}D`);
  let u = "";
  s !== 0 && (u += `${Math.abs(s)}H`), a !== 0 && (u += `${Math.abs(a)}M`);
  const h = A.fromComponents(0, 0, m(e, bt), m(e, _t), m(e, Tt), m(e, Lt));
  h.isZero() && !["second", "millisecond", "microsecond", "nanosecond"].includes(we(e)) && t === "auto" || (u += `${Math.abs(h.sec)}${Ia(Math.abs(h.subsec), t)}S`);
  let d = `${c < 0 ? "-" : ""}P${l}`;
  return u && (d = `${d}T${u}`), d;
}
function ls(e, t = "auto") {
  const { year: n, month: r, day: i } = m(e, k);
  return `${kr(n)}-${Ht(r)}-${Ht(i)}${br(m(e, x), t)}`;
}
function us({ hour: e, minute: t, second: n, millisecond: r, microsecond: i, nanosecond: o }, s) {
  return Ei(e, t, n, 1e6 * r + 1e3 * i + o, s);
}
function cr(e, t, n, r = "auto") {
  const { isoDate: { year: i, month: o, day: s }, time: { hour: a, minute: c, second: l, millisecond: u, microsecond: h, nanosecond: d } } = e;
  return `${kr(i)}-${Ht(o)}-${Ht(s)}T${Ei(a, c, l, 1e6 * u + 1e3 * h + d, n)}${br(t, r)}`;
}
function hs(e, t = "auto") {
  const { year: n, month: r, day: i } = m(e, k);
  let o = `${Ht(r)}-${Ht(i)}`;
  const s = m(e, x);
  t !== "always" && t !== "critical" && s === "iso8601" || (o = `${kr(n)}-${o}`);
  const a = br(s, t);
  return a && (o += a), o;
}
function ds(e, t = "auto") {
  const { year: n, month: r, day: i } = m(e, k);
  let o = `${kr(n)}-${Ht(r)}`;
  const s = m(e, x);
  t !== "always" && t !== "critical" && s === "iso8601" || (o += `-${Ht(i)}`);
  const a = br(s, t);
  return a && (o += a), o;
}
function fs(e, t, n = "auto", r = "auto", i = "auto", o = void 0) {
  let s = m(e, $);
  if (o) {
    const { unit: u, increment: h, roundingMode: d } = o;
    s = ro(s, h, u, d);
  }
  const a = m(e, U), c = _e(a, s);
  let l = cr(Xt(a, s), "iso8601", t, "never");
  return i !== "never" && (l += Pa(c)), r !== "never" && (l += `[${r === "critical" ? "!" : ""}${a}]`), l += br(m(e, x), n), l;
}
function ms(e) {
  return Ma.test(e);
}
function Nn(e) {
  const t = dl.exec(e);
  if (!t) throw new RangeError(`invalid time zone offset: ${e}; must match ±HH:MM[:SS.SSSSSSSSS]`);
  return (t[1] === "-" ? -1 : 1) * (1e9 * (60 * (60 * +t[2] + +(t[3] || 0)) + +(t[4] || 0)) + +((t[5] || 0) + "000000000").slice(0, 9));
}
let Yn;
const ul = Object.assign(/* @__PURE__ */ Object.create(null), { "/": !0, "-": !0, _: !0 });
function ti(e) {
  if (Yn === void 0) {
    const o = Intl.supportedValuesOf?.("timeZone");
    if (o) {
      Yn = /* @__PURE__ */ new Map();
      for (let s = 0; s < o.length; s++) {
        const a = o[s];
        Yn.set(ur(a), a);
      }
    } else Yn = null;
  }
  const t = ur(e);
  let n = Yn?.get(t);
  if (n) return { identifier: n, primaryIdentifier: n };
  try {
    n = ba(e).resolvedOptions().timeZone;
  } catch {
    return;
  }
  if (t === "antarctica/south_pole" && (n = "Antarctica/McMurdo"), ol.has(e)) throw new RangeError(`${e} is a legacy time zone identifier from ICU. Use ${n} instead`);
  const r = [...t].map(((o, s) => s === 0 || ul[t[s - 1]] ? o.toUpperCase() : o)).join("").split("/");
  if (r.length === 1) return t === "gb-eire" ? { identifier: "GB-Eire", primaryIdentifier: n } : { identifier: t.length <= 3 || /[-0-9]/.test(t) ? t.toUpperCase() : r[0], primaryIdentifier: n };
  if (r[0] === "Etc") return { identifier: `Etc/${["Zulu", "Greenwich", "Universal"].includes(r[1]) ? r[1] : r[1].toUpperCase()}`, primaryIdentifier: n };
  if (r[0] === "Us") return { identifier: `US/${r[1]}`, primaryIdentifier: n };
  const i = /* @__PURE__ */ new Map([["Act", "ACT"], ["Lhi", "LHI"], ["Nsw", "NSW"], ["Dar_Es_Salaam", "Dar_es_Salaam"], ["Port_Of_Spain", "Port_of_Spain"], ["Port-Au-Prince", "Port-au-Prince"], ["Isle_Of_Man", "Isle_of_Man"], ["Comodrivadavia", "ComodRivadavia"], ["Knox_In", "Knox_IN"], ["Dumontdurville", "DumontDUrville"], ["Mcmurdo", "McMurdo"], ["Denoronha", "DeNoronha"], ["Easterisland", "EasterIsland"], ["Bajanorte", "BajaNorte"], ["Bajasur", "BajaSur"]]);
  return r[1] = i.get(r[1]) ?? r[1], r.length > 2 && (r[2] = i.get(r[2]) ?? r[2]), { identifier: r.join("/"), primaryIdentifier: n };
}
function qe(e, t) {
  const { year: n, month: r, day: i, hour: o, minute: s, second: a } = za(e, t);
  let c = t % 1e3;
  return c < 0 && (c += 1e3), 1e6 * (Do({ isoDate: { year: n, month: r, day: i }, time: { hour: o, minute: s, second: a, millisecond: c } }) - t);
}
function Ji(e, t) {
  return qe(e, Wt(t, "floor"));
}
function xo(e) {
  const t = e < 0 ? "-" : "+", n = Math.abs(e);
  return `${t}${Ei(Math.floor(n / 60), n % 60, 0, 0, "minute")}`;
}
function Pa(e) {
  return xo(Ae(e, tl, "halfExpand") / 6e10);
}
function Do({ isoDate: { year: e, month: t, day: n }, time: { hour: r, minute: i, second: o, millisecond: s } }) {
  const a = e % 400, c = (e - a) / 400, l = /* @__PURE__ */ new Date();
  return l.setUTCHours(r, i, o, s), l.setUTCFullYear(a, t - 1, n), l.getTime() + rl * c;
}
function st(e) {
  const t = Do(e), n = 1e3 * e.time.microsecond + e.time.nanosecond;
  return f.add(ae(t), f.BigInt(n));
}
function Sa(e) {
  let t = Wt(e, "trunc"), n = f.toNumber(f.remainder(e, wr));
  n < 0 && (n += 1e6, t -= 1);
  const r = Math.floor(n / 1e3) % 1e3, i = n % 1e3, o = new Date(t);
  return { epochMilliseconds: t, isoDate: { year: o.getUTCFullYear(), month: o.getUTCMonth() + 1, day: o.getUTCDate() }, time: { hour: o.getUTCHours(), minute: o.getUTCMinutes(), second: o.getUTCSeconds(), millisecond: o.getUTCMilliseconds(), microsecond: r, nanosecond: i } };
}
function Co(e, t) {
  if (e === "UTC") return null;
  const n = Wt(t, "floor");
  if (n < Qn) return Co(e, ae(Qn));
  const r = Date.now(), i = Math.max(n, r) + 366 * Pe * 3;
  let o = n, s = qe(e, o), a = o, c = s;
  for (; s === c && o < i; ) {
    if (a = o + 2 * Pe * 7, a > va) return null;
    c = qe(e, a), s === c && (o = a);
  }
  return s === c ? null : ae(Va(((l) => qe(e, l)), o, a, s, c));
}
function to(e, t) {
  if (e === "UTC") return null;
  const n = Wt(t, "ceil"), r = Date.now(), i = r + 366 * Pe * 3;
  if (n > i) {
    const l = to(e, ae(i));
    if (l === null || f.lessThan(l, ae(r))) return l;
  }
  if (e === "Africa/Casablanca" || e === "Africa/El_Aaiun") {
    const l = Date.UTC(2088, 0, 1);
    if (l < n) return to(e, ae(l));
  }
  let o = n - 1;
  if (o < Qn) return null;
  let s = qe(e, o), a = o, c = s;
  for (; s === c && o > Qn; ) {
    if (a = o - 2 * Pe * 7, a < Qn) return null;
    c = qe(e, a), s === c && (o = a);
  }
  return s === c ? null : ae(Va(((l) => qe(e, l)), a, o, c, s));
}
function za(e, t) {
  return (function(n) {
    const r = n.split(/[^\w]+/);
    if (r.length !== 7) throw new RangeError(`expected 7 parts in "${n}`);
    const i = +r[0], o = +r[1];
    let s = +r[2];
    const a = r[3];
    if (a[0] === "b" || a[0] === "B") s = 1 - s;
    else if (a[0] !== "a" && a[0] !== "A") throw new RangeError(`Unknown era ${a} in "${n}`);
    const c = r[4] === "24" ? 0 : +r[4], l = +r[5], u = +r[6];
    if (!(Number.isFinite(s) && Number.isFinite(i) && Number.isFinite(o) && Number.isFinite(c) && Number.isFinite(l) && Number.isFinite(u))) throw new RangeError(`Invalid number in "${n}`);
    return { year: s, month: i, day: o, hour: c, minute: l, second: u };
  })(ba(e).format(t));
}
function ei(e) {
  return e !== void 0 && !(e % 4 != 0 || e % 100 == 0 && e % 400 != 0);
}
function Xe(e, t) {
  return { standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] }[ei(e) ? "leapyear" : "standard"][t - 1];
}
function ni(e) {
  const t = [m(e, gt), m(e, pt), m(e, kt), m(e, yt), m(e, wt), m(e, vt), m(e, bt), m(e, _t), m(e, Tt), m(e, Lt)];
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    if (r !== 0) return r < 0 ? -1 : 1;
  }
  return 0;
}
function xi(e) {
  const t = ["years", "months", "weeks", "days"];
  for (let n = 0; n < t.length; n++) {
    const r = e[t[n]];
    if (r !== 0) return r < 0 ? -1 : 1;
  }
  return 0;
}
function Ha(e) {
  const t = xi(e.date);
  return t !== 0 ? t : e.time.sign();
}
function Fe(e, t) {
  let n = e, r = t;
  if (!Number.isFinite(n) || !Number.isFinite(r)) throw new RangeError("infinity is out of range");
  return r -= 1, n += Math.floor(r / 12), r %= 12, r < 0 && (r += 12), r += 1, { year: n, month: r };
}
function At(e, t, n) {
  let r = e, i = t, o = n;
  if (!Number.isFinite(o)) throw new RangeError("infinity is out of range");
  ({ year: r, month: i } = Fe(r, i));
  const s = 146097;
  if (Math.abs(o) > s) {
    const l = Math.trunc(o / s);
    r += 400 * l, o -= l * s;
  }
  let a = 0, c = i > 2 ? r : r - 1;
  for (; a = ei(c) ? 366 : 365, o < -a; ) r -= 1, c -= 1, o += a;
  for (c += 1; a = ei(c) ? 366 : 365, o > a; ) r += 1, c += 1, o -= a;
  for (; o < 1; ) ({ year: r, month: i } = Fe(r, i - 1)), o += Xe(r, i);
  for (; o > Xe(r, i); ) o -= Xe(r, i), { year: r, month: i } = Fe(r, i + 1);
  return { year: r, month: i, day: o };
}
function lr(e, t, n, r, i, o, s, a, c) {
  const l = Ne(r, i, o, s, a, c);
  return H(At(e, t, n + l.deltaDays), l);
}
function Ne(e, t, n, r, i, o) {
  let s, a = e, c = t, l = n, u = r, h = i, d = o;
  ({ div: s, mod: d } = dn(d, 3)), h += s, d < 0 && (h -= 1, d += 1e3), { div: s, mod: h } = dn(h, 3), u += s, h < 0 && (u -= 1, h += 1e3), l += Math.trunc(u / 1e3), u %= 1e3, u < 0 && (l -= 1, u += 1e3), c += Math.trunc(l / 60), l %= 60, l < 0 && (c -= 1, l += 60), a += Math.trunc(c / 60), c %= 60, c < 0 && (a -= 1, c += 60);
  let g = Math.trunc(a / 24);
  return a %= 24, a < 0 && (g -= 1, a += 24), g += 0, a += 0, c += 0, l += 0, u += 0, h += 0, d += 0, { deltaDays: g, hour: a, minute: c, second: l, millisecond: u, microsecond: h, nanosecond: d };
}
function gs(e, t) {
  const n = lt(e, 0);
  if (xi(n) === 0) return e.days;
  const r = m(t, k), i = zt(m(t, x), r, n, "constrain"), o = Qe(r.year, r.month - 1, r.day), s = Qe(i.year, i.month - 1, i.day) - o;
  return e.days + s;
}
function Yt(e) {
  return new (at("%Temporal.Duration%"))(-m(e, gt), -m(e, pt), -m(e, kt), -m(e, yt), -m(e, wt), -m(e, vt), -m(e, bt), -m(e, _t), -m(e, Tt), -m(e, Lt));
}
function Mt(e, t, n) {
  return Math.min(n, Math.max(t, e));
}
function ja(e, t, n) {
  const r = Mt(t, 1, 12);
  return { year: e, month: r, day: Mt(n, 1, Xe(e, r)) };
}
function nt(e, t, n) {
  if (e < t || e > n) throw new RangeError(`value out of range: ${t} <= ${e} <= ${n}`);
}
function Ve(e, t, n) {
  nt(t, 1, 12), nt(n, 1, Xe(e, t));
}
function rn(e) {
  Ke(H(e, { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }));
}
function Di(e, t, n, r, i, o) {
  nt(e, 0, 23), nt(t, 0, 59), nt(n, 0, 59), nt(r, 0, 999), nt(i, 0, 999), nt(o, 0, 999);
}
function $o(e, t, n, r, i, o, s, a, c) {
  Ve(e, t, n), Di(r, i, o, s, a, c);
}
function Ke(e) {
  const t = st(e);
  (f.lessThan(t, el) || f.greaterThan(t, nl)) && he(t);
}
function eo(e) {
  st(e);
}
function he(e) {
  if (f.lessThan(e, ir) || f.greaterThan(e, vn)) throw new RangeError("date/time value is outside of supported range");
}
function ko({ year: e, month: t }) {
  nt(e, es, ns), e === es ? nt(t, 4, 12) : e === ns && nt(t, 1, 9);
}
function Ci(e, t, n, r, i, o, s, a, c, l) {
  let u = 0;
  const h = [e, t, n, r, i, o, s, a, c, l];
  for (let v = 0; v < h.length; v++) {
    const _ = h[v];
    if (_ === 1 / 0 || _ === -1 / 0) throw new RangeError("infinite values not allowed as duration fields");
    if (_ !== 0) {
      const T = _ < 0 ? -1 : 1;
      if (u !== 0 && T !== u) throw new RangeError("mixed-sign values not allowed as duration fields");
      u = T;
    }
  }
  if (Math.abs(e) >= 2 ** 32 || Math.abs(t) >= 2 ** 32 || Math.abs(n) >= 2 ** 32) throw new RangeError("years, months, and weeks must be < 2³²");
  const d = dn(a, 3), g = dn(c, 6), p = dn(l, 9), w = dn(1e6 * d.mod + 1e3 * g.mod + p.mod, 9).div, y = 86400 * r + 3600 * i + 60 * o + s + d.div + g.div + p.div + w;
  if (!Number.isSafeInteger(y)) throw new RangeError("total of duration time units cannot exceed 9007199254740991.999999999 s");
}
function hn(e) {
  return { date: { years: m(e, gt), months: m(e, pt), weeks: m(e, kt), days: m(e, yt) }, time: A.fromComponents(m(e, wt), m(e, vt), m(e, bt), m(e, _t), m(e, Tt), m(e, Lt)) };
}
function se(e) {
  const t = A.fromComponents(m(e, wt), m(e, vt), m(e, bt), m(e, _t), m(e, Tt), m(e, Lt)).add24HourDays(m(e, yt));
  return { date: { years: m(e, gt), months: m(e, pt), weeks: m(e, kt), days: 0 }, time: t };
}
function Ua(e) {
  const t = se(e), n = Math.trunc(t.time.sec / 86400);
  return Ci(t.date.years, t.date.months, t.date.weeks, n, 0, 0, 0, 0, 0, 0), { ...t.date, days: n };
}
function Ft(e, t) {
  const n = e.time.sign();
  let r = e.time.abs().subsec, i = 0, o = 0, s = e.time.abs().sec, a = 0, c = 0, l = 0;
  switch (t) {
    case "year":
    case "month":
    case "week":
    case "day":
      i = Math.trunc(r / 1e3), r %= 1e3, o = Math.trunc(i / 1e3), i %= 1e3, s += Math.trunc(o / 1e3), o %= 1e3, a = Math.trunc(s / 60), s %= 60, c = Math.trunc(a / 60), a %= 60, l = Math.trunc(c / 24), c %= 24;
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
      i = Math.trunc(r / 1e3), r %= 1e3, o = Ai(s, 3, Math.trunc(i / 1e3)), i %= 1e3, s = 0;
      break;
    case "microsecond":
      i = Ai(s, 6, Math.trunc(r / 1e3)), r %= 1e3, s = 0;
      break;
    case "nanosecond":
      r = Ai(s, 9, r), s = 0;
  }
  return new (at("%Temporal.Duration%"))(e.date.years, e.date.months, e.date.weeks, e.date.days + n * l, n * c, n * a, n * s, n * o, n * i, n * r);
}
function Ee(e, t) {
  return xi(e), t.sign(), { date: e, time: t };
}
function Qe(e, t, n) {
  return Do({ isoDate: { year: e, month: t + 1, day: n }, time: { hour: 0, minute: 0, second: 0, millisecond: 0 } }) / Pe;
}
function pn({ year: e, month: t, day: n }) {
  if (Math.abs(Qe(e, t - 1, n)) > 1e8) throw new RangeError("date/time value is outside the supported range");
}
function Lo(e, t) {
  const n = t.hour - e.hour, r = t.minute - e.minute, i = t.second - e.second, o = t.millisecond - e.millisecond, s = t.microsecond - e.microsecond, a = t.nanosecond - e.nanosecond;
  return A.fromComponents(n, r, i, o, s, a);
}
function Ro(e, t, n, r, i) {
  let o = A.fromEpochNsDiff(t, e);
  return o = ri(o, n, r, i), Ee({ years: 0, months: 0, weeks: 0, days: 0 }, o);
}
function Fa(e, t, n, r) {
  eo(e), eo(t);
  let i = Lo(e.time, t.time);
  const o = i.sign(), s = de(e.isoDate, t.isoDate);
  let a = t.isoDate;
  s === o && (a = At(a.year, a.month, a.day + o), i = i.add24HourDays(-o));
  const c = Me("day", r), l = Dr(n, e.isoDate, a, c);
  return r !== c && (i = i.add24HourDays(l.days), l.days = 0), Ee(l, i);
}
function Za(e, t, n, r, i) {
  const o = f.subtract(t, e);
  if (f.equal(o, St)) return { date: { years: 0, months: 0, weeks: 0, days: 0 }, time: A.ZERO };
  const s = f.lessThan(o, St) ? -1 : 1, a = Xt(n, e), c = Xt(n, t);
  let l, u = 0, h = s === 1 ? 2 : 1, d = Lo(a.time, c.time);
  for (d.sign() === -s && u++; u <= h; u++) {
    l = H(At(c.isoDate.year, c.isoDate.month, c.isoDate.day - u * s), a.time);
    const p = ut(n, l, "compatible");
    if (d = A.fromEpochNsDiff(t, p), d.sign() !== -s) break;
  }
  const g = Me("day", i);
  return Ee(Dr(r, a.isoDate, l.isoDate, g), d);
}
function qa(e, t, n, r, i, o, s, a, c) {
  let l, u, h, d, g = t;
  switch (a) {
    case "year": {
      const I = Ae(g.date.years, s, "trunc");
      l = I, u = I + s * e, h = { years: l, months: 0, weeks: 0, days: 0 }, d = { ...h, years: u };
      break;
    }
    case "month": {
      const I = Ae(g.date.months, s, "trunc");
      l = I, u = I + s * e, h = lt(g.date, 0, 0, l), d = lt(g.date, 0, 0, u);
      break;
    }
    case "week": {
      const I = lt(g.date, 0, 0), z = zt(o, r.isoDate, I, "constrain"), Q = Dr(o, z, At(z.year, z.month, z.day + g.date.days), "week"), It = Ae(g.date.weeks + Q.weeks, s, "trunc");
      l = It, u = It + s * e, h = lt(g.date, 0, l), d = lt(g.date, 0, u);
      break;
    }
    case "day": {
      const I = Ae(g.date.days, s, "trunc");
      l = I, u = I + s * e, h = lt(g.date, l), d = lt(g.date, u);
      break;
    }
  }
  const p = zt(o, r.isoDate, h, "constrain"), w = zt(o, r.isoDate, d, "constrain");
  let y, v;
  const _ = H(p, r.time), T = H(w, r.time);
  i ? (y = ut(i, _, "compatible"), v = ut(i, T, "compatible")) : (y = st(_), v = st(T));
  const M = A.fromEpochNsDiff(n, y), E = A.fromEpochNsDiff(v, y), R = wi(c, e < 0 ? "negative" : "positive"), F = M.add(M).abs().subtract(E.abs()).sign(), j = Math.abs(l) / s % 2 == 0, Y = M.isZero() ? Math.abs(l) : M.cmp(E) ? vi(Math.abs(l), Math.abs(u), F, j, R) : Math.abs(u), P = new A(f.add(f.multiply(E.totalNs, f.BigInt(l)), f.multiply(M.totalNs, f.BigInt(s * e)))).fdiv(E.totalNs), D = Y === Math.abs(u);
  return g = { date: D ? d : h, time: A.ZERO }, { nudgeResult: { duration: g, nudgedEpochNs: D ? v : y, didExpandCalendarUnit: D }, total: P };
}
function $i(e, t, n, r, i, o, s, a, c) {
  let l = e;
  const u = re(a) || r && a === "day", h = Ha(l) < 0 ? -1 : 1;
  let d;
  return u ? { nudgeResult: d } = qa(h, l, t, n, r, i, s, a, c) : d = r ? (function(g, p, w, y, v, _, T, M) {
    let E = p;
    const R = zt(v, w.isoDate, E.date, "constrain"), F = H(R, w.time), j = H(At(R.year, R.month, R.day + g), w.time), Y = ut(y, F, "compatible"), P = ut(y, j, "compatible"), D = A.fromEpochNsDiff(P, Y);
    if (D.sign() !== g) throw new RangeError("time zone returned inconsistent Instants");
    const I = f.BigInt(_n[T] * _);
    let z = E.time.round(I, M);
    const Q = z.subtract(D), It = Q.sign() !== -g;
    let Z, rt;
    return It ? (Z = g, z = Q.round(I, M), rt = z.addToEpochNs(P)) : (Z = 0, rt = z.addToEpochNs(Y)), { duration: Ee(lt(E.date, E.date.days + Z), z), nudgedEpochNs: rt, didExpandCalendarUnit: It };
  })(h, l, n, r, i, s, a, c) : (function(g, p, w, y, v, _) {
    let T = g;
    const M = T.time.add24HourDays(T.date.days), E = M.round(f.BigInt(y * _n[v]), _), R = E.subtract(M), { quotient: F } = M.divmod(Kr), { quotient: j } = E.divmod(Kr), Y = Math.sign(j - F) === M.sign(), P = R.addToEpochNs(p);
    let D = 0, I = E;
    return ve(w) === "date" && (D = j, I = E.add(A.fromComponents(24 * -j, 0, 0, 0, 0, 0))), { duration: { date: lt(T.date, D), time: I }, nudgedEpochNs: P, didExpandCalendarUnit: Y };
  })(l, t, o, s, a, c), l = d.duration, d.didExpandCalendarUnit && a !== "week" && (l = (function(g, p, w, y, v, _, T, M) {
    let E = p;
    if (M === T) return E;
    const R = Bn.indexOf(T);
    for (let F = Bn.indexOf(M) - 1; F >= R; F--) {
      const j = Bn[F];
      if (j === "week" && T !== "week") continue;
      let Y;
      switch (j) {
        case "year":
          Y = { years: E.date.years + g, months: 0, weeks: 0, days: 0 };
          break;
        case "month": {
          const I = E.date.months + g;
          Y = lt(E.date, 0, 0, I);
          break;
        }
        case "week": {
          const I = E.date.weeks + g;
          Y = lt(E.date, 0, I);
          break;
        }
      }
      const P = H(zt(_, y.isoDate, Y, "constrain"), y.time);
      let D;
      if (D = v ? ut(v, P, "compatible") : st(P), Gr(w, D) === -g) break;
      E = { date: Y, time: A.ZERO };
    }
    return E;
  })(h, l, d.nudgedEpochNs, n, r, i, o, Me(a, "day"))), l;
}
function ps(e, t, n, r, i, o) {
  return re(o) || r && o === "day" ? qa(Ha(e) < 0 ? -1 : 1, e, t, n, r, i, 1, o, "trunc").total : er(e.time.add24HourDays(e.date.days), o);
}
function Xa(e, t, n, r, i, o, s) {
  if (Mn(e, t) == 0) return { date: { years: 0, months: 0, weeks: 0, days: 0 }, time: A.ZERO };
  Ke(e), Ke(t);
  const a = Fa(e, t, n, r);
  return o === "nanosecond" && i === 1 ? a : $i(a, st(t), e, null, n, r, i, o, s);
}
function Wa(e, t, n, r, i, o, s, a) {
  if (ve(i) === "time") return Ro(e, t, o, s, a);
  const c = Za(e, t, n, r, i);
  return s === "nanosecond" && o === 1 ? c : $i(c, t, Xt(n, e), n, r, i, o, s, a);
}
function On(e, t, n, r, i, o) {
  const s = bn.reduce(((g, p) => {
    const w = p[0], y = p[1], v = p[2];
    return n !== "datetime" && v !== n || r.includes(y) || g.push(y, w), g;
  }), []);
  let a = Nt(t, "largestUnit", n, "auto");
  if (r.includes(a)) throw new RangeError(`largestUnit must be one of ${s.join(", ")}, not ${a}`);
  const c = Ln(t);
  let l = Bt(t, "trunc");
  e === "since" && (l = (function(g) {
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
  })(l));
  const u = Nt(t, "smallestUnit", n, i);
  if (r.includes(u)) throw new RangeError(`smallestUnit must be one of ${s.join(", ")}, not ${u}`);
  const h = Me(o, u);
  if (a === "auto" && (a = h), Me(a, u) !== a) throw new RangeError(`largestUnit ${a} cannot be smaller than smallestUnit ${u}`);
  const d = { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[u];
  return d !== void 0 && Rn(c, d, !1), { largestUnit: a, roundingIncrement: c, roundingMode: l, smallestUnit: u };
}
function ys(e, t, n, r) {
  const i = Fn(n), o = On(e, C(r), "time", [], "nanosecond", "second");
  let s = Ft(Ro(m(t, $), m(i, $), o.roundingIncrement, o.smallestUnit, o.roundingMode), o.largestUnit);
  return e === "since" && (s = Yt(s)), s;
}
function ws(e, t, n, r) {
  const i = jn(n), o = m(t, x), s = m(i, x);
  if (!ue(o, s)) throw new RangeError(`cannot compute difference between dates of ${o} and ${s} calendars`);
  const a = On(e, C(r), "date", [], "day", "day"), c = at("%Temporal.Duration%"), l = m(t, k), u = m(i, k);
  if (de(l, u) === 0) return new c();
  let h = { date: Dr(o, l, u, a.largestUnit), time: A.ZERO };
  if (a.smallestUnit !== "day" || a.roundingIncrement !== 1) {
    const g = H(l, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    h = $i(h, st(H(u, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 })), g, null, o, a.largestUnit, a.roundingIncrement, a.smallestUnit, a.roundingMode);
  }
  let d = Ft(h, "day");
  return e === "since" && (d = Yt(d)), d;
}
function vs(e, t, n, r) {
  const i = Un(n), o = m(t, x), s = m(i, x);
  if (!ue(o, s)) throw new RangeError(`cannot compute difference between dates of ${o} and ${s} calendars`);
  const a = On(e, C(r), "datetime", [], "nanosecond", "day"), c = at("%Temporal.Duration%"), l = m(t, X), u = m(i, X);
  if (Mn(l, u) === 0) return new c();
  let h = Ft(Xa(l, u, o, a.largestUnit, a.roundingIncrement, a.smallestUnit, a.roundingMode), a.largestUnit);
  return e === "since" && (h = Yt(h)), h;
}
function bs(e, t, n, r) {
  const i = Oe(n), o = On(e, C(r), "time", [], "nanosecond", "hour");
  let s = Lo(m(t, V), m(i, V));
  s = ri(s, o.roundingIncrement, o.smallestUnit, o.roundingMode);
  let a = Ft(Ee({ years: 0, months: 0, weeks: 0, days: 0 }, s), o.largestUnit);
  return e === "since" && (a = Yt(a)), a;
}
function _s(e, t, n, r) {
  const i = Zn(n), o = m(t, x), s = m(i, x);
  if (!ue(o, s)) throw new RangeError(`cannot compute difference between months of ${o} and ${s} calendars`);
  const a = On(e, C(r), "date", ["week", "day"], "month", "year"), c = at("%Temporal.Duration%");
  if (de(m(t, k), m(i, k)) == 0) return new c();
  const l = Dt(o, m(t, k), "year-month");
  l.day = 1;
  const u = Se(o, l, "constrain"), h = Dt(o, m(i, k), "year-month");
  h.day = 1;
  const d = Se(o, h, "constrain");
  let g = { date: lt(Dr(o, u, d, a.largestUnit), 0, 0), time: A.ZERO };
  if (a.smallestUnit !== "month" || a.roundingIncrement !== 1) {
    const w = H(u, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    g = $i(g, st(H(d, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 })), w, null, o, a.largestUnit, a.roundingIncrement, a.smallestUnit, a.roundingMode);
  }
  let p = Ft(g, "day");
  return e === "since" && (p = Yt(p)), p;
}
function Ts(e, t, n, r) {
  const i = qn(n), o = m(t, x), s = m(i, x);
  if (!ue(o, s)) throw new RangeError(`cannot compute difference between dates of ${o} and ${s} calendars`);
  const a = On(e, C(r), "datetime", [], "nanosecond", "hour"), c = m(t, $), l = m(i, $), u = at("%Temporal.Duration%");
  let h;
  if (ve(a.largestUnit) !== "date") h = Ft(Ro(c, l, a.roundingIncrement, a.smallestUnit, a.roundingMode), a.largestUnit);
  else {
    const d = m(t, U);
    if (!Aa(d, m(i, U))) throw new RangeError("When calculating difference between time zones, largestUnit must be 'hours' or smaller because day lengths can vary between time zones due to DST or time zone offset changes.");
    if (f.equal(c, l)) return new u();
    h = Ft(Wa(c, l, d, o, a.largestUnit, a.roundingIncrement, a.smallestUnit, a.roundingMode), "hour");
  }
  return e === "since" && (h = Yt(h)), h;
}
function Tn({ hour: e, minute: t, second: n, millisecond: r, microsecond: i, nanosecond: o }, s) {
  let a = n, c = o;
  return a += s.sec, c += s.subsec, Ne(e, t, a, r, i, c);
}
function no(e, t) {
  const n = t.addToEpochNs(e);
  return he(n), n;
}
function Xn(e, t, n, r, i = "constrain") {
  if (xi(r.date) === 0) return no(e, r.time);
  const o = Xt(t, e);
  return no(ut(t, H(zt(n, o.isoDate, r.date, i), o.time), "compatible"), r.time);
}
function Ms(e, t, n) {
  let r = qt(n);
  e === "subtract" && (r = Yt(r));
  const i = Me(we(t), we(r));
  if (re(i)) throw new RangeError("For years, months, or weeks arithmetic, use date arithmetic relative to a starting point");
  const o = se(t), s = se(r);
  return Ft(Ee({ years: 0, months: 0, weeks: 0, days: 0 }, o.time.add(s.time)), i);
}
function Es(e, t, n) {
  let r = qt(n);
  e === "subtract" && (r = Yt(r));
  const i = we(r);
  if (ve(i) === "date") throw new RangeError(`Duration field ${i} not supported by Temporal.Instant. Try Temporal.ZonedDateTime instead.`);
  const o = se(r);
  return oe(no(m(t, $), o.time));
}
function xs(e, t, n, r) {
  const i = m(t, x);
  let o = qt(n);
  e === "subtract" && (o = Yt(o));
  const s = Ua(o), a = S(C(r));
  return Et(zt(i, m(t, k), s, a), i);
}
function Ds(e, t, n, r) {
  let i = qt(n);
  e === "subtract" && (i = Yt(i));
  const o = S(C(r)), s = m(t, x), a = se(i), c = m(t, X), l = Tn(c.time, a.time), u = lt(a.date, l.deltaDays);
  return Ci(u.years, u.months, u.weeks, u.days, 0, 0, 0, 0, 0, 0), Ut(H(zt(s, c.isoDate, u, o), l), s);
}
function Cs(e, t, n) {
  let r = qt(n);
  e === "subtract" && (r = Yt(r));
  const i = se(r), { hour: o, minute: s, second: a, millisecond: c, microsecond: l, nanosecond: u } = Tn(m(t, V), i.time);
  return be(Mi(o, s, a, c, l, u, "reject"));
}
function $s(e, t, n, r) {
  let i = qt(n);
  e === "subtract" && (i = Yt(i));
  const o = S(C(r)), s = ni(i), a = m(t, x), c = Dt(a, m(t, k), "year-month");
  c.day = 1;
  let l = Se(a, c, "constrain");
  if (s < 0) {
    const h = zt(a, l, { months: 1 }, "constrain");
    l = At(h.year, h.month, h.day - 1);
  }
  const u = Ua(i);
  return rn(l), gn(sr(a, Dt(a, zt(a, l, u, o), "year-month"), o), a);
}
function ks(e, t, n, r) {
  let i = qt(n);
  e === "subtract" && (i = Yt(i));
  const o = S(C(r)), s = m(t, U), a = m(t, x), c = hn(i);
  return ct(Xn(m(t, $), s, a, c, o), s, a);
}
function Ae(e, t, n) {
  const r = Math.trunc(e / t), i = e % t, o = e < 0 ? "negative" : "positive", s = Math.abs(r), a = s + 1, c = Rt(Math.abs(2 * i) - t), l = s % 2 == 0, u = wi(n, o), h = i === 0 ? s : vi(s, a, c, l, u);
  return t * (o === "positive" ? h : -h);
}
function ro(e, t, n, r) {
  const i = _n[n] * t;
  return (function(o, s, a) {
    const c = ye(o), l = ye(s), u = f.divide(c, l), h = f.remainder(c, l), d = wi(a, "positive");
    let g, p;
    f.lessThan(c, St) ? (g = f.subtract(u, rr), p = u) : (g = u, p = f.add(u, rr));
    const w = Gr(je(f.multiply(h, To)), l) * (f.lessThan(c, St) ? -1 : 1) + 0, y = f.equal(h, St) ? u : vi(g, p, w, ra(g), d);
    return f.multiply(y, l);
  })(e, f.BigInt(i), r);
}
function io(e, t, n, r) {
  eo(e);
  const { year: i, month: o, day: s } = e.isoDate, a = oo(e.time, t, n, r);
  return H(At(i, o, s + a.deltaDays), a);
}
function oo({ hour: e, minute: t, second: n, millisecond: r, microsecond: i, nanosecond: o }, s, a, c) {
  let l;
  switch (a) {
    case "day":
    case "hour":
      l = 1e3 * (1e3 * (1e3 * (60 * (60 * e + t) + n) + r) + i) + o;
      break;
    case "minute":
      l = 1e3 * (1e3 * (1e3 * (60 * t + n) + r) + i) + o;
      break;
    case "second":
      l = 1e3 * (1e3 * (1e3 * n + r) + i) + o;
      break;
    case "millisecond":
      l = 1e3 * (1e3 * r + i) + o;
      break;
    case "microsecond":
      l = 1e3 * i + o;
      break;
    case "nanosecond":
      l = o;
  }
  const u = _n[a], h = Ae(l, u * s, c) / u;
  switch (a) {
    case "day":
      return { deltaDays: h, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 };
    case "hour":
      return Ne(h, 0, 0, 0, 0, 0);
    case "minute":
      return Ne(e, h, 0, 0, 0, 0);
    case "second":
      return Ne(e, t, h, 0, 0, 0);
    case "millisecond":
      return Ne(e, t, n, h, 0, 0);
    case "microsecond":
      return Ne(e, t, n, r, h, 0);
    case "nanosecond":
      return Ne(e, t, n, r, i, h);
    default:
      throw new Error(`Invalid unit ${a}`);
  }
}
function ri(e, t, n, r) {
  const i = _n[n];
  return e.round(f.BigInt(i * t), r);
}
function er(e, t) {
  const n = _n[t];
  return e.fdiv(f.BigInt(n));
}
function de(e, t) {
  return e.year !== t.year ? Rt(e.year - t.year) : e.month !== t.month ? Rt(e.month - t.month) : e.day !== t.day ? Rt(e.day - t.day) : 0;
}
function so(e, t) {
  return e.hour !== t.hour ? Rt(e.hour - t.hour) : e.minute !== t.minute ? Rt(e.minute - t.minute) : e.second !== t.second ? Rt(e.second - t.second) : e.millisecond !== t.millisecond ? Rt(e.millisecond - t.millisecond) : e.microsecond !== t.microsecond ? Rt(e.microsecond - t.microsecond) : e.nanosecond !== t.nanosecond ? Rt(e.nanosecond - t.nanosecond) : 0;
}
function Mn(e, t) {
  const n = de(e.isoDate, t.isoDate);
  return n !== 0 ? n : so(e.time, t.time);
}
function Ga(e) {
  const t = ii(e);
  return globalThis.BigInt !== void 0 ? globalThis.BigInt(t.toString(10)) : t;
}
function Wt(e, t) {
  const n = ye(e), { quotient: r, remainder: i } = zn(n, wr);
  let o = f.toNumber(r);
  return t === "floor" && f.toNumber(i) < 0 && (o -= 1), t === "ceil" && f.toNumber(i) > 0 && (o += 1), o;
}
function ae(e) {
  if (!Number.isInteger(e)) throw new RangeError("epoch milliseconds must be an integer");
  return f.multiply(f.BigInt(e), wr);
}
function ii(e) {
  let t = e;
  if (typeof e == "object") {
    const n = e[Symbol.toPrimitive];
    n && typeof n == "function" && (t = n.call(e, "number"));
  }
  if (typeof t == "number") throw new TypeError("cannot convert number to bigint");
  return typeof t == "bigint" ? f.BigInt(t.toString(10)) : f.BigInt(t);
}
const ao = (() => {
  let e = f.BigInt(Date.now() % 1e6);
  return () => {
    const t = Date.now(), n = f.BigInt(t), r = f.add(ae(t), e);
    return e = f.remainder(n, wr), f.greaterThan(r, vn) ? vn : f.lessThan(r, ir) ? ir : r;
  };
})();
function In() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function Rt(e) {
  return e < 0 ? -1 : e > 0 ? 1 : e;
}
function C(e) {
  if (e === void 0) return /* @__PURE__ */ Object.create(null);
  if (K(e) && e !== null) return e;
  throw new TypeError("Options parameter must be an object, not " + (e === null ? "null" : typeof e));
}
function Be(e, t) {
  const n = /* @__PURE__ */ Object.create(null);
  return n[e] = t, n;
}
function xe(e, t, n, r) {
  let i = e[t];
  if (i !== void 0) {
    if (i = _i(i), !n.includes(i)) throw new RangeError(`${t} must be one of ${n.join(", ")}, not ${i}`);
    return i;
  }
  if (r === Ce) throw new RangeError(`${t} option is required`);
  return r;
}
function $t(e) {
  const t = ur(e);
  if (!il.includes(ur(t))) throw new RangeError(`invalid calendar identifier ${t}`);
  switch (t) {
    case "ethiopic-amete-alem":
      return "ethioaa";
    case "islamicc":
      return "islamic-civil";
  }
  return t;
}
function ur(e) {
  let t = "";
  for (let n = 0; n < e.length; n++) {
    const r = e.charCodeAt(n);
    t += r >= 65 && r <= 90 ? String.fromCharCode(r + 32) : String.fromCharCode(r);
  }
  return t;
}
function He(e) {
  throw new TypeError(`Do not use built-in arithmetic operators with Temporal objects. When comparing, use ${e === "PlainMonthDay" ? "Temporal.PlainDate.compare(obj1.toPlainDate(year), obj2.toPlainDate(year))" : `Temporal.${e}.compare(obj1, obj2)`}, not obj1 > obj2. When coercing to strings, use \`\${obj}\` or String(obj), not '' + obj. When coercing to numbers, use properties or methods of the object, not \`+obj\`. When concatenating with strings, use \`\${str}\${obj}\` or str.concat(obj), not str + obj. In React, coerce to a string before rendering a Temporal object.`);
}
const hl = new RegExp(`^${ya.source}$`), dl = new RegExp(`^${/([+-])([01][0-9]|2[0-3])(?::?([0-5][0-9])(?::?([0-5][0-9])(?:[.,](\d{1,9}))?)?)?/.source}$`);
function Va(e, t, n, r = e(t), i = e(n)) {
  let o = t, s = n, a = r, c = i;
  for (; s - o > 1; ) {
    let l = Math.trunc((o + s) / 2);
    const u = e(l);
    u === a ? (o = l, a = u) : u === c && (s = l, c = u);
  }
  return s;
}
function Ka(e) {
  return [...e];
}
function Qa(e, t) {
  if (e !== "gregory" && e !== "iso8601") return;
  const n = Lr[e];
  let r = t.year;
  const { dayOfWeek: i, dayOfYear: o, daysInYear: s } = n.isoToDate(t, { dayOfWeek: !0, dayOfYear: !0, daysInYear: !0 }), a = n.getFirstDayOfWeek(), c = n.getMinimalDaysInFirstWeek();
  let l = (i + 7 - a) % 7, u = (i - o + 7001 - a) % 7, h = Math.floor((o - 1 + u) / 7);
  if (7 - u >= c && ++h, h == 0) h = (function(d, g, p, w) {
    let y = (w - d - p + 1) % 7;
    y < 0 && (y += 7);
    let v = Math.floor((p + y - 1) / 7);
    return 7 - y >= g && ++v, v;
  })(a, c, o + n.isoToDate(n.dateAdd(t, { years: -1 }, "constrain"), { daysInYear: !0 }).daysInYear, i), r--;
  else if (o >= s - 5) {
    let d = (l + s - o) % 7;
    d < 0 && (d += 7), 6 - d >= c && o + 7 - l > s && (h = 1, r++);
  }
  return { week: h, year: r };
}
function Ls(e, t, n, r, i) {
  if (t !== i.year) {
    if (e * (t - i.year) > 0) return !0;
  } else if (n !== i.month) {
    if (e * (n - i.month) > 0) return !0;
  } else if (r !== i.day && e * (r - i.day) > 0) return !0;
  return !1;
}
const Lr = {};
function Je(e) {
  if (!e.startsWith("M")) throw new RangeError(`Invalid month code: ${e}.  Month codes must start with M.`);
  const t = +e.slice(1);
  if (Number.isNaN(t)) throw new RangeError(`Invalid month code: ${e}`);
  return t;
}
function ce(e, t = !1) {
  return `M${`${e}`.padStart(2, "0")}${t ? "L" : ""}`;
}
function No(e, t = void 0, n = 12) {
  let { month: r, monthCode: i } = e;
  if (i === void 0) {
    if (r === void 0) throw new TypeError("Either month or monthCode are required");
    t === "reject" && nt(r, 1, n), t === "constrain" && (r = Mt(r, 1, n)), i = ce(r);
  } else {
    const o = Je(i);
    if (i !== ce(o)) throw new RangeError(`Invalid month code: ${i}`);
    if (r !== void 0 && r !== o) throw new RangeError(`monthCode ${i} and month ${r} must match if both are present`);
    if (r = o, r < 1 || r > n) throw new RangeError(`Invalid monthCode: ${i}`);
  }
  return { ...e, month: r, monthCode: i };
}
Lr.iso8601 = { resolveFields(e, t) {
  if ((t === "date" || t === "year-month") && e.year === void 0) throw new TypeError("year is required");
  if ((t === "date" || t === "month-day") && e.day === void 0) throw new TypeError("day is required");
  Object.assign(e, No(e));
}, dateToISO: (e, t) => Jn(e.year, e.month, e.day, t), monthDayToISOReferenceDate(e, t) {
  const { month: n, day: r } = Jn(e.year ?? 1972, e.month, e.day, t);
  return { month: n, day: r, year: 1972 };
}, extraFields: () => [], fieldKeysToIgnore(e) {
  const t = /* @__PURE__ */ new Set();
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    t.add(r), r === "month" ? t.add("monthCode") : r === "monthCode" && t.add("month");
  }
  return Ka(t);
}, dateAdd(e, { years: t = 0, months: n = 0, weeks: r = 0, days: i = 0 }, o) {
  let { year: s, month: a, day: c } = e;
  return s += t, a += n, { year: s, month: a } = Fe(s, a), { year: s, month: a, day: c } = Jn(s, a, c, o), c += i + 7 * r, At(s, a, c);
}, dateUntil(e, t, n) {
  const r = -de(e, t);
  if (r === 0) return { years: 0, months: 0, weeks: 0, days: 0 };
  let i, o = 0, s = 0;
  if (n === "year" || n === "month") {
    let u = t.year - e.year;
    for (u !== 0 && (u -= r); !Ls(r, e.year + u, e.month, e.day, t); ) o = u, u += r;
    let h = r;
    for (i = Fe(e.year + o, e.month + h); !Ls(r, i.year, i.month, e.day, t); ) s = h, h += r, i = Fe(i.year, i.month + r);
    n === "month" && (s += 12 * o, o = 0);
  }
  i = Fe(e.year + o, e.month + s);
  const a = ja(i.year, i.month, e.day);
  let c = 0, l = Qe(t.year, t.month - 1, t.day) - Qe(a.year, a.month - 1, a.day);
  return n === "week" && (c = Math.trunc(l / 7), l %= 7), { years: o, months: s, weeks: c, days: l };
}, isoToDate({ year: e, month: t, day: n }, r) {
  const i = { era: void 0, eraYear: void 0, year: e, month: t, day: n, daysInWeek: 7, monthsInYear: 12 };
  if (r.monthCode && (i.monthCode = ce(t)), r.dayOfWeek) {
    const o = t + (t < 3 ? 10 : -2), s = e - (t < 3 ? 1 : 0), a = Math.floor(s / 100), c = s - 100 * a, l = (n + Math.floor(2.6 * o - 0.2) + (c + Math.floor(c / 4)) + (Math.floor(a / 4) - 2 * a)) % 7;
    i.dayOfWeek = l + (l <= 0 ? 7 : 0);
  }
  if (r.dayOfYear) {
    let o = n;
    for (let s = t - 1; s > 0; s--) o += Xe(e, s);
    i.dayOfYear = o;
  }
  return r.weekOfYear && (i.weekOfYear = Qa("iso8601", { year: e, month: t, day: n })), r.daysInMonth && (i.daysInMonth = Xe(e, t)), (r.daysInYear || r.inLeapYear) && (i.inLeapYear = ei(e), i.daysInYear = i.inLeapYear ? 366 : 365), i;
}, getFirstDayOfWeek: () => 1, getMinimalDaysInFirstWeek: () => 4 };
class et {
  constructor(t) {
    if (this.map = /* @__PURE__ */ new Map(), this.calls = 0, this.hits = 0, this.misses = 0, t !== void 0) {
      let n = 0;
      for (const r of t.map.entries()) {
        if (++n > et.MAX_CACHE_ENTRIES) break;
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
    if (et.objectMap.get(t)) throw new RangeError("object already cached");
    et.objectMap.set(t, this), this.report();
  }
  static getCacheForObject(t) {
    let n = et.objectMap.get(t);
    return n || (n = new et(), et.objectMap.set(t, n)), n;
  }
}
function Ba({ isoYear: e, isoMonth: t, isoDay: n }) {
  return `${kr(e)}-${Ht(t)}-${Ht(n)}T00:00Z`;
}
function Pi(e, t) {
  return { years: e.year - t.year, months: e.month - t.month, days: e.day - t.day };
}
et.objectMap = /* @__PURE__ */ new WeakMap(), et.MAX_CACHE_ENTRIES = 1e3;
class on {
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
    const c = Ba({ isoYear: r, isoMonth: i, isoDay: o }), l = this.getCalendarParts(c), u = {};
    for (let d = 0; d < l.length; d++) {
      const { type: g, value: p } = l[d];
      if (g !== "year" && g !== "relatedYear" || (this.hasEra ? u.eraYear = +p : u.year = +p), g === "month") {
        const w = /^([0-9]*)(.*?)$/.exec(p);
        if (!w || w.length != 3 || !w[1] && !w[2]) throw new RangeError(`Unexpected month: ${p}`);
        if (u.month = w[1] ? +w[1] : 1, u.month < 1) throw new RangeError(`Invalid month ${p} from ${c}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10527)`);
        if (u.month > 13) throw new RangeError(`Invalid month ${p} from ${c}[u-ca-${this.id}] (probably due to https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
        w[2] && (u.monthExtra = w[2]);
      }
      g === "day" && (u.day = +p), this.hasEra && g === "era" && p != null && p !== "" && (u.era = p.split(" (")[0].normalize("NFD").replace(/[^-0-9 \p{L}]/gu, "").replace(/ /g, "-").toLowerCase());
    }
    if (this.hasEra && u.eraYear === void 0) throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
    if (this.hasEra) {
      const d = this.eras.find(((g) => u.era === g.genericName));
      d && (u.era = d.code);
    }
    if (this.reviseIntlEra) {
      const { era: d, eraYear: g } = this.reviseIntlEra(u, t);
      u.era = d, u.eraYear = g;
    }
    this.checkIcuBugs && this.checkIcuBugs(t);
    const h = this.adjustCalendarDate(u, n, "constrain", !0);
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
    return { month: a, monthCode: c } = No(o, r, s), { ...o, month: a, monthCode: c };
  }
  regulateMonthDayNaive(t, n, r) {
    const i = this.monthsInYear(t, r);
    let { month: o, day: s } = t;
    return n === "reject" ? (nt(o, 1, i), nt(s, 1, this.maximumMonthLength(t))) : (o = Mt(o, 1, i), s = Mt(s, 1, this.maximumMonthLength({ ...t, month: o }))), { ...t, month: o, day: s };
  }
  calendarToIsoDate(t, n = "constrain", r) {
    const i = t;
    let o = this.adjustCalendarDate(t, r, n, !1);
    o = this.regulateMonthDayNaive(o, n, r);
    const { year: s, month: a, day: c } = o, l = JSON.stringify({ func: "calendarToIsoDate", year: s, month: a, day: c, overflow: n, id: this.id });
    let u, h = r.get(l);
    if (h || i.year !== void 0 && i.month !== void 0 && i.day !== void 0 && (i.year !== o.year || i.month !== o.month || i.day !== o.day) && (u = JSON.stringify({ func: "calendarToIsoDate", year: i.year, month: i.month, day: i.day, overflow: n, id: this.id }), h = r.get(u), h)) return h;
    let d = this.estimateIsoDate({ year: s, month: a, day: c });
    const g = (_) => {
      let T = this.addDaysIso(d, _);
      if (o.day > this.minimumMonthLength(o)) {
        let M = this.isoToCalendarDate(T, r);
        for (; M.month !== a || M.year !== s; ) {
          if (n === "reject") throw new RangeError(`day ${c} does not exist in month ${a} of year ${s}`);
          T = this.addDaysIso(T, -1), M = this.isoToCalendarDate(T, r);
        }
      }
      return T;
    };
    let p = 0, w = this.isoToCalendarDate(d, r), y = Pi(o, w);
    if (y.years !== 0 || y.months !== 0 || y.days !== 0) {
      const _ = 365 * y.years + 30 * y.months + y.days;
      d = this.addDaysIso(d, _), w = this.isoToCalendarDate(d, r), y = Pi(o, w), y.years === 0 && y.months === 0 ? d = g(y.days) : p = this.compareCalendarDates(o, w);
    }
    let v = 8;
    for (; p; ) {
      d = this.addDaysIso(d, p * v);
      const _ = w;
      w = this.isoToCalendarDate(d, r);
      const T = p;
      if (p = this.compareCalendarDates(o, w), p) {
        if (y = Pi(o, w), y.years === 0 && y.months === 0) d = g(y.days), p = 0;
        else if (T && p !== T) if (v > 1) v /= 2;
        else {
          if (n === "reject") throw new RangeError(`Can't find ISO date from calendar date: ${JSON.stringify({ ...i })}`);
          this.compareCalendarDates(w, _) > 0 && (d = this.addDaysIso(d, -1)), p = 0;
        }
      }
    }
    if (r.set(l, d), u && r.set(u, d), o.year === void 0 || o.month === void 0 || o.day === void 0 || o.monthCode === void 0 || this.hasEra && (o.era === void 0 || o.eraYear === void 0)) throw new RangeError("Unexpected missing property");
    return d;
  }
  compareCalendarDates(t, n) {
    return t.year !== n.year ? Rt(t.year - n.year) : t.month !== n.month ? Rt(t.month - n.month) : t.day !== n.day ? Rt(t.day - n.day) : 0;
  }
  regulateDate(t, n = "constrain", r) {
    const i = this.calendarToIsoDate(t, n, r);
    return this.isoToCalendarDate(i, r);
  }
  addDaysIso(t, n) {
    return At(t.year, t.month, t.day + n);
  }
  addDaysCalendar(t, n, r) {
    const i = this.calendarToIsoDate(t, "constrain", r), o = this.addDaysIso(i, n);
    return this.isoToCalendarDate(o, r);
  }
  addMonthsCalendar(t, n, r, i) {
    let o = t;
    const { day: s } = o;
    for (let a = 0, c = Math.abs(n); a < c; a++) {
      const { month: l } = o, u = o, h = n < 0 ? -Math.max(s, this.daysInPreviousMonth(o, i)) : this.daysInMonth(o, i), d = this.calendarToIsoDate(o, "constrain", i);
      let g = this.addDaysIso(d, h);
      if (o = this.isoToCalendarDate(g, i), n > 0) {
        const p = this.monthsInYear(u, i);
        for (; o.month - 1 != l % p; ) g = this.addDaysIso(g, -1), o = this.isoToCalendarDate(g, i);
      }
      o.day !== s && (o = this.regulateDate({ ...o, day: s }, "constrain", i));
    }
    if (r === "reject" && o.day !== s) throw new RangeError(`Day ${s} does not exist in resulting calendar month`);
    return o;
  }
  addCalendar(t, { years: n = 0, months: r = 0, weeks: i = 0, days: o = 0 }, s, a) {
    const { year: c, day: l, monthCode: u } = t, h = this.adjustCalendarDate({ year: c + n, monthCode: u, day: l }, a), d = this.addMonthsCalendar(h, r, s, a), g = o + 7 * i;
    return this.addDaysCalendar(d, g, a);
  }
  untilCalendar(t, n, r, i) {
    let o = 0, s = 0, a = 0, c = 0;
    switch (r) {
      case "day":
        o = this.calendarDaysUntil(t, n, i);
        break;
      case "week": {
        const l = this.calendarDaysUntil(t, n, i);
        o = l % 7, s = (l - o) / 7;
        break;
      }
      case "month":
      case "year": {
        const l = this.compareCalendarDates(n, t);
        if (!l) return { years: 0, months: 0, weeks: 0, days: 0 };
        const u = n.year - t.year, h = n.day - t.day;
        if (r === "year" && u) {
          let p = 0;
          n.monthCode > t.monthCode && (p = 1), n.monthCode < t.monthCode && (p = -1), p || (p = Math.sign(h)), c = p * l < 0 ? u - l : u;
        }
        let d, g = c ? this.addCalendar(t, { years: c }, "constrain", i) : t;
        do
          a += l, d = g, g = this.addMonthsCalendar(d, l, "constrain", i), g.day !== t.day && (g = this.regulateDate({ ...g, day: t.day }, "constrain", i));
        while (this.compareCalendarDates(n, g) * l >= 0);
        a -= l, o = this.calendarDaysUntil(d, n, i);
        break;
      }
    }
    return { years: c, months: a, weeks: s, days: o };
  }
  daysInMonth(t, n) {
    const { day: r } = t, i = this.maximumMonthLength(t), o = this.minimumMonthLength(t);
    if (o === i) return o;
    const s = r <= i - o ? i : o, a = this.calendarToIsoDate(t, "constrain", n), c = this.addDaysIso(a, s), l = this.isoToCalendarDate(c, n), u = this.addDaysIso(c, -l.day);
    return this.isoToCalendarDate(u, n).day;
  }
  daysInPreviousMonth(t, n) {
    const { day: r, month: i, year: o } = t;
    let s = { year: i > 1 ? o : o - 1, month: i, day: 1 };
    const a = i > 1 ? i - 1 : this.monthsInYear(s, n);
    s = { ...s, month: a };
    const c = this.minimumMonthLength(s), l = this.maximumMonthLength(s);
    if (c === l) return l;
    const u = this.calendarToIsoDate(t, "constrain", n), h = this.addDaysIso(u, -r);
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
    return Qe(o.year, o.month - 1, o.day) - Qe(i.year, i.month - 1, i.day);
  }
  monthDaySearchStartYear(t, n) {
    return 1972;
  }
  monthDayFromFields(t, n, r) {
    let i, o, s, a, c, { era: l, eraYear: u, year: h, month: d, monthCode: g, day: p } = t;
    if (d !== void 0 && h === void 0 && (!this.hasEra || l === void 0 || u === void 0)) throw new TypeError("when month is present, year (or era and eraYear) are required");
    (g === void 0 || h !== void 0 || this.hasEra && u !== void 0) && ({ monthCode: g, day: p } = this.isoToCalendarDate(this.calendarToIsoDate(t, n, r), r));
    const w = { year: this.monthDaySearchStartYear(g, p), month: 12, day: 31 }, y = this.isoToCalendarDate(w, r), v = y.monthCode > g || y.monthCode === g && y.day >= p ? y.year : y.year - 1;
    for (let _ = 0; _ < 20; _++) {
      const T = this.adjustCalendarDate({ day: p, monthCode: g, year: v - _ }, r), M = this.calendarToIsoDate(T, "constrain", r), E = this.isoToCalendarDate(M, r);
      if ({ year: i, month: o, day: s } = M, E.monthCode === g && E.day === p) return { month: o, day: s, year: i };
      if (n === "constrain") {
        const R = this.maxLengthOfMonthCodeInAnyYear(E.monthCode);
        if (E.monthCode === g && E.day === R && p > R) return { month: o, day: s, year: i };
        (a === void 0 || E.monthCode === a.monthCode && E.day > a.day) && (a = E, c = M);
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
class fl extends on {
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
    return this.inLeapYear({ year: t }) ? n === 6 ? ce(5, !0) : ce(n < 6 ? n : n - 1) : ce(n);
  }
  adjustCalendarDate(t, n, r = "constrain", i = !1) {
    let { year: o, month: s, monthCode: a, day: c, monthExtra: l } = t;
    if (o === void 0) throw new TypeError("Missing property: year");
    if (i) {
      if (l) {
        const u = this.months[l];
        if (!u) throw new RangeError(`Unrecognized month from formatToParts: ${l}`);
        s = this.inLeapYear({ year: o }) ? u.leap : u.regular;
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
      s = Je(a), this.inLeapYear({ year: o }) && s >= 6 && s++;
      const u = this.monthsInYear({ year: o });
      if (s < 1 || s > u) throw new RangeError(`Invalid monthCode: ${a}`);
    }
    else if (r === "reject" ? (nt(s, 1, this.monthsInYear({ year: o })), nt(c, 1, this.maximumMonthLength({ year: o, month: s }))) : (s = Mt(s, 1, this.monthsInYear({ year: o })), c = Mt(c, 1, this.maximumMonthLength({ year: o, month: s }))), a === void 0) a = this.getMonthCode(o, s);
    else if (this.getMonthCode(o, s) !== a) throw new RangeError(`monthCode ${a} doesn't correspond to month ${s} in Hebrew year ${o}`);
    return { ...t, day: c, month: s, monthCode: a, year: o };
  }
}
class An extends on {
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
class ml extends An {
  constructor() {
    super(...arguments), this.id = "islamic";
  }
}
class gl extends An {
  constructor() {
    super(...arguments), this.id = "islamic-umalqura";
  }
}
class pl extends An {
  constructor() {
    super(...arguments), this.id = "islamic-tbla";
  }
}
class yl extends An {
  constructor() {
    super(...arguments), this.id = "islamic-civil";
  }
}
class wl extends An {
  constructor() {
    super(...arguments), this.id = "islamic-rgsa";
  }
}
class vl extends An {
  constructor() {
    super(...arguments), this.id = "islamicc";
  }
}
class bl extends on {
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
    return Je(t) <= 6 ? 31 : 30;
  }
  estimateIsoDate(t) {
    const { year: n } = this.adjustCalendarDate(t);
    return { year: n + 621, month: 1, day: 1 };
  }
}
class _l extends on {
  constructor() {
    super(...arguments), this.id = "indian", this.calendarType = "solar", this.months = { 1: { length: 30, month: 3, day: 22, leap: { length: 31, month: 3, day: 21 } }, 2: { length: 31, month: 4, day: 21 }, 3: { length: 31, month: 5, day: 22 }, 4: { length: 31, month: 6, day: 22 }, 5: { length: 31, month: 7, day: 23 }, 6: { length: 31, month: 8, day: 23 }, 7: { length: 30, month: 9, day: 23 }, 8: { length: 30, month: 10, day: 23 }, 9: { length: 30, month: 11, day: 22 }, 10: { length: 30, month: 12, day: 22 }, 11: { length: 30, month: 1, nextYear: !0, day: 21 }, 12: { length: 30, month: 2, nextYear: !0, day: 20 } }, this.vulnerableToBceBug = (/* @__PURE__ */ new Date("0000-01-01T00:00Z")).toLocaleDateString("en-US-u-ca-indian", { timeZone: "UTC" }) !== "10/11/-79 Saka";
  }
  inLeapYear(t) {
    return Oo(t.year + 78);
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
    const n = Je(t);
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
    return At(n.year + 78 + (r.nextYear ? 1 : 0), r.month, r.day + n.day - 1);
  }
  checkIcuBugs(t) {
    if (this.vulnerableToBceBug && t.year < 1) throw new RangeError(`calendar '${this.id}' is broken for ISO dates before 0001-01-01 (see https://bugs.chromium.org/p/v8/issues/detail?id=10529)`);
  }
}
function Oo(e) {
  return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
}
class Ja extends on {
  constructor(t, n) {
    super(), this.calendarType = "solar", this.id = t, this.isoEpoch = n;
  }
  inLeapYear(t) {
    const { year: n } = this.estimateIsoDate({ month: 1, day: 1, year: t.year });
    return Oo(n);
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
    return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][Je(t) - 1];
  }
  estimateIsoDate(t) {
    const n = this.adjustCalendarDate(t);
    return Jn(n.year + this.isoEpoch.year, n.month + this.isoEpoch.month, n.day + this.isoEpoch.day, "constrain");
  }
}
class tc extends on {
  constructor(t, n) {
    super(), this.hasEra = !0, this.calendarType = "solar", this.id = t;
    const { eras: r, anchorEra: i } = (function(o) {
      let s, a = o;
      if (a.length === 0) throw new RangeError("Invalid era data: eras are required");
      if (a.length === 1 && a[0].reverseOf) throw new RangeError("Invalid era data: anchor era cannot count years backwards");
      if (a.length === 1 && !a[0].code) throw new RangeError("Invalid era data: at least one named era is required");
      if (a.filter(((l) => l.reverseOf != null)).length > 1) throw new RangeError("Invalid era data: only one era can count years backwards");
      a.forEach(((l) => {
        if (l.isAnchor || !l.anchorEpoch && !l.reverseOf) {
          if (s) throw new RangeError("Invalid era data: cannot have multiple anchor eras");
          s = l, l.anchorEpoch = { year: l.hasYearZero ? 0 : 1 };
        } else if (!l.code) throw new RangeError("If era name is blank, it must be the anchor era");
      })), a = a.filter(((l) => l.code)), a.forEach(((l) => {
        const { reverseOf: u } = l;
        if (u) {
          const h = a.find(((d) => d.code === u));
          if (h === void 0) throw new RangeError(`Invalid era data: unmatched reverseOf era: ${u}`);
          l.reverseOf = h, l.anchorEpoch = h.anchorEpoch, l.isoEpoch = h.isoEpoch;
        }
        l.anchorEpoch.month === void 0 && (l.anchorEpoch.month = 1), l.anchorEpoch.day === void 0 && (l.anchorEpoch.day = 1);
      })), a.sort(((l, u) => {
        if (l.reverseOf) return 1;
        if (u.reverseOf) return -1;
        if (!l.isoEpoch || !u.isoEpoch) throw new RangeError("Invalid era data: missing ISO epoch");
        return u.isoEpoch.year - l.isoEpoch.year;
      }));
      const c = a[a.length - 1].reverseOf;
      if (c && c !== a[a.length - 2]) throw new RangeError("Invalid era data: invalid reverse-sign era");
      return a.forEach(((l, u) => {
        l.genericName = "era" + (a.length - 1 - u);
      })), { eras: a, anchorEra: s || a[0] };
    })(n);
    this.anchorEra = i, this.eras = r;
  }
  inLeapYear(t) {
    const { year: n } = this.estimateIsoDate({ month: 1, day: 1, year: t.year });
    return Oo(n);
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
    return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][Je(t) - 1];
  }
  completeEraYear(t) {
    const n = (a, c, l) => {
      const u = t[a];
      if (u != null && u != c && !(l || []).includes(u)) {
        const h = l?.[0];
        throw new RangeError(`Input ${a} ${u} doesn't match calculated value ${h ? `${c} (also called ${h})` : c}`);
      }
    }, r = (a) => {
      let c;
      const l = { ...t, year: a }, u = this.eras.find(((h, d) => {
        if (d === this.eras.length - 1) {
          if (h.reverseOf) {
            if (a > 0) throw new RangeError(`Signed year ${a} is invalid for era ${h.code}`);
            return c = h.anchorEpoch.year - a, !0;
          }
          return c = a - h.anchorEpoch.year + (h.hasYearZero ? 0 : 1), !0;
        }
        return this.compareCalendarDates(l, h.anchorEpoch) >= 0 && (c = a - h.anchorEpoch.year + (h.hasYearZero ? 0 : 1), !0);
      }));
      if (!u) throw new RangeError(`Year ${a} was not matched by any era`);
      return { eraYear: c, era: u.code, eraNames: u.names };
    };
    let { year: i, eraYear: o, era: s } = t;
    if (i != null) {
      const a = r(i);
      ({ eraYear: o, era: s } = a), n("era", s, a?.eraNames), n("eraYear", o);
    } else {
      if (o == null) throw new RangeError("Either year or eraYear and era are required");
      {
        if (s === void 0) throw new RangeError("era and eraYear must be provided together");
        const a = this.eras.find((({ code: c, names: l = [] }) => c === s || l.includes(s)));
        if (!a) throw new RangeError(`Era ${s} (ISO year ${o}) was not matched by any era`);
        i = a.reverseOf ? a.anchorEpoch.year - o : o + a.anchorEpoch.year - (a.hasYearZero ? 0 : 1), n("year", i), { eraYear: o, era: s } = r(i);
      }
    }
    return { ...t, year: i, eraYear: o, era: s };
  }
  adjustCalendarDate(t, n, r = "constrain") {
    let i = t;
    const { month: o, monthCode: s } = i;
    return o === void 0 && (i = { ...i, month: Je(s) }), this.validateCalendarDate(i), i = this.completeEraYear(i), super.adjustCalendarDate(i, n, r);
  }
  estimateIsoDate(t) {
    const n = this.adjustCalendarDate(t), { year: r, month: i, day: o } = n, { anchorEra: s } = this;
    return Jn(r + s.isoEpoch.year - (s.hasYearZero ? 0 : 1), i, o, "constrain");
  }
}
class Ao extends tc {
  constructor(t, n) {
    super(t, n);
  }
  isoToCalendarDate(t) {
    const { year: n, month: r, day: i } = t, o = ce(r), s = n - this.anchorEra.isoEpoch.year + 1;
    return this.completeEraYear({ year: s, month: r, monthCode: o, day: i });
  }
}
const ie = { inLeapYear(e) {
  const { year: t } = e;
  return (t + 1) % 4 == 0;
}, monthsInYear: () => 13, minimumMonthLength(e) {
  const { month: t } = e;
  return t === 13 ? this.inLeapYear(e) ? 6 : 5 : 30;
}, maximumMonthLength(e) {
  return this.minimumMonthLength(e);
}, maxLengthOfMonthCodeInAnyYear: (e) => e === "M13" ? 6 : 30 };
class Tl extends Ja {
  constructor(t, n) {
    super(t, n), this.inLeapYear = ie.inLeapYear, this.monthsInYear = ie.monthsInYear, this.minimumMonthLength = ie.minimumMonthLength, this.maximumMonthLength = ie.maximumMonthLength, this.maxLengthOfMonthCodeInAnyYear = ie.maxLengthOfMonthCodeInAnyYear;
  }
}
class ec extends tc {
  constructor(t, n) {
    super(t, n), this.inLeapYear = ie.inLeapYear, this.monthsInYear = ie.monthsInYear, this.minimumMonthLength = ie.minimumMonthLength, this.maximumMonthLength = ie.maximumMonthLength, this.maxLengthOfMonthCodeInAnyYear = ie.maxLengthOfMonthCodeInAnyYear;
  }
}
class Ml extends Tl {
  constructor() {
    super("ethioaa", { year: -5492, month: 7, day: 17 });
  }
}
class El extends ec {
  constructor() {
    super("coptic", [{ code: "coptic", isoEpoch: { year: 284, month: 8, day: 29 } }, { code: "coptic-inverse", reverseOf: "coptic" }]);
  }
}
class xl extends ec {
  constructor() {
    super("ethiopic", [{ code: "ethioaa", names: ["ethiopic-amete-alem", "mundi"], isoEpoch: { year: -5492, month: 7, day: 17 } }, { code: "ethiopic", names: ["incar"], isoEpoch: { year: 8, month: 8, day: 27 }, anchorEpoch: { year: 5501 } }]);
  }
}
class Dl extends Ao {
  constructor() {
    super("roc", [{ code: "roc", names: ["minguo"], isoEpoch: { year: 1912, month: 1, day: 1 } }, { code: "roc-inverse", names: ["before-roc"], reverseOf: "roc" }]);
  }
}
class Cl extends Ja {
  constructor() {
    super("buddhist", { year: -543, month: 1, day: 1 });
  }
}
class $l extends Ao {
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
class kl extends Ao {
  constructor() {
    super("japanese", [{ code: "reiwa", isoEpoch: { year: 2019, month: 5, day: 1 }, anchorEpoch: { year: 2019, month: 5, day: 1 } }, { code: "heisei", isoEpoch: { year: 1989, month: 1, day: 8 }, anchorEpoch: { year: 1989, month: 1, day: 8 } }, { code: "showa", isoEpoch: { year: 1926, month: 12, day: 25 }, anchorEpoch: { year: 1926, month: 12, day: 25 } }, { code: "taisho", isoEpoch: { year: 1912, month: 7, day: 30 }, anchorEpoch: { year: 1912, month: 7, day: 30 } }, { code: "meiji", isoEpoch: { year: 1868, month: 9, day: 8 }, anchorEpoch: { year: 1868, month: 9, day: 8 } }, { code: "japanese", names: ["japanese", "gregory", "ad", "ce"], isoEpoch: { year: 1, month: 1, day: 1 } }, { code: "japanese-inverse", names: ["japanese-inverse", "gregory-inverse", "bc", "bce"], reverseOf: "japanese" }]), this.erasBeginMidYear = !0;
  }
  reviseIntlEra(t, n) {
    const { era: r, eraYear: i } = t, { year: o } = n;
    return this.eras.find(((s) => s.code === r)) ? { era: r, eraYear: i } : o < 1 ? { era: "japanese-inverse", eraYear: 1 - o } : { era: "japanese", eraYear: o };
  }
}
class nc extends on {
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
      const _ = Ba({ isoYear: y, isoMonth: 2, isoDay: 1 }), T = new Date(_);
      T.setUTCDate(v + 1);
      const M = o.formatToParts(T), E = M.find(((Y) => Y.type === "month")).value, R = +M.find(((Y) => Y.type === "day")).value, F = M.find(((Y) => Y.type === "relatedYear"));
      let j;
      if (F === void 0) throw new RangeError(`Intl.DateTimeFormat.formatToParts lacks relatedYear in ${this.id} calendar. Try Node 14+ or modern browsers.`);
      return j = +F.value, { calendarMonthString: E, calendarDay: R, calendarYearToVerify: j };
    };
    let a = 17, { calendarMonthString: c, calendarDay: l, calendarYearToVerify: u } = s(t, a);
    c !== "1" && (a += 29, { calendarMonthString: c, calendarDay: l } = s(t, a)), a -= l - 5;
    const h = {};
    let d, g, p = 1, w = !1;
    do
      ({ calendarMonthString: c, calendarDay: l, calendarYearToVerify: u } = s(t, a)), d && (h[g].daysInMonth = d + 30 - l), u !== t ? w = !0 : (h[c] = { monthIndex: p++ }, a += 30), d = l, g = c;
    while (!w);
    return h[g].daysInMonth = d + 30 - l, n.set(r, h), h;
  }
  estimateIsoDate(t) {
    const { year: n, month: r } = t;
    return { year: n, month: r >= 12 ? 12 : r + 1, day: 1 };
  }
  adjustCalendarDate(t, n, r = "constrain", i = !1) {
    let { year: o, month: s, monthExtra: a, day: c, monthCode: l } = t;
    if (o === void 0) throw new TypeError("Missing property: year");
    if (i) {
      if (a && a !== "bis") throw new RangeError(`Unexpected leap month suffix: ${a}`);
      const u = ce(s, a !== void 0), h = `${s}${a || ""}`, d = this.getMonthList(o, n)[h];
      if (d === void 0) throw new RangeError(`Unmatched month ${h} in Chinese year ${o}`);
      return s = d.monthIndex, { year: o, month: s, day: c, monthCode: u };
    }
    if (this.validateCalendarDate(t), s === void 0) {
      const u = this.getMonthList(o, n);
      let h = l.replace(/^M|L$/g, ((g) => g === "L" ? "bis" : ""));
      h[0] === "0" && (h = h.slice(1));
      let d = u[h];
      if (s = d && d.monthIndex, s === void 0 && l.endsWith("L") && l != "M13L" && r === "constrain") {
        const g = +l.replace(/^M0?|L$/g, "");
        d = u[g], d && (s = d.monthIndex, l = ce(g));
      }
      if (s === void 0) throw new RangeError(`Unmatched month ${l} in Chinese year ${o}`);
    } else if (l === void 0) {
      const u = this.getMonthList(o, n), h = Object.entries(u), d = h.length;
      r === "reject" ? (nt(s, 1, d), nt(c, 1, this.maximumMonthLength())) : (s = Mt(s, 1, d), c = Mt(c, 1, this.maximumMonthLength()));
      const g = h.find(((p) => p[1].monthIndex === s));
      if (g === void 0) throw new RangeError(`Invalid month ${s} in Chinese year ${o}`);
      l = ce(+g[0].replace("bis", ""), g[0].indexOf("bis") !== -1);
    } else {
      const u = this.getMonthList(o, n);
      let h = l.replace(/^M|L$/g, ((g) => g === "L" ? "bis" : ""));
      h[0] === "0" && (h = h.slice(1));
      const d = u[h];
      if (!d) throw new RangeError(`Unmatched monthCode ${l} in Chinese year ${o}`);
      if (s !== d.monthIndex) throw new RangeError(`monthCode ${l} doesn't correspond to month ${s} in Chinese year ${o}`);
    }
    return { ...t, year: o, month: s, monthCode: l, day: c };
  }
}
class Ll extends nc {
  constructor() {
    super(...arguments), this.id = "chinese";
  }
}
class Rl extends nc {
  constructor() {
    super(...arguments), this.id = "dangi";
  }
}
class Nl {
  constructor(t) {
    this.helper = t;
  }
  extraFields(t) {
    return this.helper.hasEra && t.includes("year") ? ["era", "eraYear"] : [];
  }
  resolveFields(t) {
    if (this.helper.calendarType !== "lunisolar") {
      const n = new et();
      No(t, void 0, this.helper.monthsInYear({ year: t.year ?? 1972 }, n));
    }
  }
  dateToISO(t, n) {
    const r = new et(), i = this.helper.calendarToIsoDate(t, n, r);
    return r.setObject(i), i;
  }
  monthDayToISOReferenceDate(t, n) {
    const r = new et(), i = this.helper.monthDayFromFields(t, n, r);
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
    return Ka(n);
  }
  dateAdd(t, { years: n, months: r, weeks: i, days: o }, s) {
    const a = et.getCacheForObject(t), c = this.helper.isoToCalendarDate(t, a), l = this.helper.addCalendar(c, { years: n, months: r, weeks: i, days: o }, s, a), u = this.helper.calendarToIsoDate(l, "constrain", a);
    return et.getCacheForObject(u) || new et(a).setObject(u), u;
  }
  dateUntil(t, n, r) {
    const i = et.getCacheForObject(t), o = et.getCacheForObject(n), s = this.helper.isoToCalendarDate(t, i), a = this.helper.isoToCalendarDate(n, o);
    return this.helper.untilCalendar(s, a, r, i);
  }
  isoToDate(t, n) {
    const r = et.getCacheForObject(t), i = this.helper.isoToCalendarDate(t, r);
    if (n.dayOfWeek && (i.dayOfWeek = Lr.iso8601.isoToDate(t, { dayOfWeek: !0 }).dayOfWeek), n.dayOfYear) {
      const o = this.helper.startOfCalendarYear(i), s = this.helper.calendarDaysUntil(o, i, r);
      i.dayOfYear = s + 1;
    }
    if (n.weekOfYear && (i.weekOfYear = Qa(this.helper.id, t)), i.daysInWeek = 7, n.daysInMonth && (i.daysInMonth = this.helper.daysInMonth(i, r)), n.daysInYear) {
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
for (const e of [fl, bl, xl, Ml, El, Ll, Rl, Dl, _l, Cl, $l, kl, ml, gl, pl, yl, wl, vl]) {
  const t = new e();
  Lr[t.id] = new Nl(t);
}
Wi("calendarImpl", (function(e) {
  return Lr[e];
}));
const hr = Intl.DateTimeFormat;
function sn(e, t) {
  let n = m(e, t);
  return typeof n == "function" && (n = new hr(m(e, fa), n(m(e, Fi))), (function(r, i, o) {
    const s = yi(r);
    if (s === void 0) throw new TypeError("Missing slots for the given container");
    if (s[i] === void 0) throw new TypeError(`tried to reset ${i} which was not set`);
    s[i] = o;
  })(e, t, n)), n;
}
function Pn(e) {
  return Ct(e, nn);
}
class dr {
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
      const c = new hr(i, a), l = c.resolvedOptions();
      if (ke(r), s) {
        const h = Object.assign(/* @__PURE__ */ Object.create(null), l);
        for (const d in h) Object.prototype.hasOwnProperty.call(a, d) || delete h[d];
        h.hour12 = a.hour12, h.hourCycle = a.hourCycle, N(r, Fi, h);
      } else N(r, Fi, a);
      N(r, fa, l.locale), N(r, nn, c), N(r, un, l.timeZone), N(r, Hn, l.calendar), N(r, aa, jl), N(r, ca, zl), N(r, la, Hl), N(r, ua, Sl), N(r, ha, Ul), N(r, da, Fl);
      const u = s ? a.timeZone : void 0;
      if (u === void 0) N(r, Ui, l.timeZone);
      else {
        const h = _i(u);
        if (h.startsWith("−")) throw new RangeError("Unicode minus (U+2212) is not supported in time zone offsets");
        N(r, Ui, xt(h));
      }
    })(this, t, n);
  }
  get format() {
    b(this, Pn);
    const t = Al.bind(this);
    return Object.defineProperties(t, { length: { value: 1, enumerable: !1, writable: !1, configurable: !0 }, name: { value: "", enumerable: !1, writable: !1, configurable: !0 } }), t;
  }
  formatRange(t, n) {
    return b(this, Pn), Il.call(this, t, n);
  }
  formatToParts(t, ...n) {
    return b(this, Pn), Yl.call(this, t, ...n);
  }
  formatRangeToParts(t, n) {
    return b(this, Pn), Pl.call(this, t, n);
  }
  resolvedOptions() {
    return b(this, Pn), Ol.call(this);
  }
}
"formatToParts" in hr.prototype || delete dr.prototype.formatToParts, "formatRangeToParts" in hr.prototype || delete dr.prototype.formatRangeToParts;
const Zt = function(e = void 0, t = void 0) {
  return new dr(e, t);
};
function Ol() {
  const e = m(this, nn).resolvedOptions();
  return e.timeZone = m(this, Ui), e;
}
function Al(e, ...t) {
  let n, r, i = En(e, this);
  return i.formatter ? (n = i.formatter, r = [Wt(i.epochNs, "floor")]) : (n = m(this, nn), r = [e, ...t]), n.format(...r);
}
function Yl(e, ...t) {
  let n, r, i = En(e, this);
  return i.formatter ? (n = i.formatter, r = [Wt(i.epochNs, "floor")]) : (n = m(this, nn), r = [e, ...t]), n.formatToParts(...r);
}
function Il(e, t) {
  if (e === void 0 || t === void 0) throw new TypeError("Intl.DateTimeFormat.formatRange requires two values");
  const n = oi(e), r = oi(t);
  let i, o = [n, r];
  if (De(n) !== De(r)) throw new TypeError("Intl.DateTimeFormat.formatRange accepts two values of the same type");
  if (De(n)) {
    if (!rc(n, r)) throw new TypeError("Intl.DateTimeFormat.formatRange accepts two values of the same type");
    const { epochNs: s, formatter: a } = En(n, this), { epochNs: c, formatter: l } = En(r, this);
    a && (i = a, o = [Wt(s, "floor"), Wt(c, "floor")]);
  }
  return i || (i = m(this, nn)), i.formatRange(...o);
}
function Pl(e, t) {
  if (e === void 0 || t === void 0) throw new TypeError("Intl.DateTimeFormat.formatRange requires two values");
  const n = oi(e), r = oi(t);
  let i, o = [n, r];
  if (De(n) !== De(r)) throw new TypeError("Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type");
  if (De(n)) {
    if (!rc(n, r)) throw new TypeError("Intl.DateTimeFormat.formatRangeToParts accepts two values of the same type");
    const { epochNs: s, formatter: a } = En(n, this), { epochNs: c, formatter: l } = En(r, this);
    a && (i = a, o = [Wt(s, "floor"), Wt(c, "floor")]);
  }
  return i || (i = m(this, nn)), i.formatRangeToParts(...o);
}
function Rr(e = {}, t = {}) {
  const n = Object.assign({}, e), r = ["year", "month", "day", "hour", "minute", "second", "weekday", "dayPeriod", "timeZoneName", "dateStyle", "timeStyle"];
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    n[o] = o in t ? t[o] : n[o], n[o] !== !1 && n[o] !== void 0 || delete n[o];
  }
  return n;
}
function Sl(e) {
  const t = Rr(e, { year: !1, month: !1, day: !1, weekday: !1, timeZoneName: !1, dateStyle: !1 });
  if (t.timeStyle !== "long" && t.timeStyle !== "full" || (delete t.timeStyle, Object.assign(t, { hour: "numeric", minute: "2-digit", second: "2-digit" })), !Li(t)) {
    if (Nr(e)) throw new TypeError(`cannot format Temporal.PlainTime with options [${Object.keys(e)}]`);
    Object.assign(t, { hour: "numeric", minute: "numeric", second: "numeric" });
  }
  return t;
}
function zl(e) {
  const t = { short: { year: "2-digit", month: "numeric" }, medium: { year: "numeric", month: "short" }, long: { year: "numeric", month: "long" }, full: { year: "numeric", month: "long" } }, n = Rr(e, { day: !1, hour: !1, minute: !1, second: !1, weekday: !1, dayPeriod: !1, timeZoneName: !1, timeStyle: !1 });
  if ("dateStyle" in n && n.dateStyle) {
    const r = n.dateStyle;
    delete n.dateStyle, Object.assign(n, t[r]);
  }
  if (!("year" in n || "month" in n || "era" in n)) {
    if (Nr(e)) throw new TypeError(`cannot format PlainYearMonth with options [${Object.keys(e)}]`);
    Object.assign(n, { year: "numeric", month: "numeric" });
  }
  return n;
}
function Hl(e) {
  const t = { short: { month: "numeric", day: "numeric" }, medium: { month: "short", day: "numeric" }, long: { month: "long", day: "numeric" }, full: { month: "long", day: "numeric" } }, n = Rr(e, { year: !1, hour: !1, minute: !1, second: !1, weekday: !1, dayPeriod: !1, timeZoneName: !1, timeStyle: !1 });
  if ("dateStyle" in n && n.dateStyle) {
    const r = n.dateStyle;
    delete n.dateStyle, Object.assign(n, t[r]);
  }
  if (!("month" in n) && !("day" in n)) {
    if (Nr(e)) throw new TypeError(`cannot format PlainMonthDay with options [${Object.keys(e)}]`);
    Object.assign(n, { month: "numeric", day: "numeric" });
  }
  return n;
}
function jl(e) {
  const t = Rr(e, { hour: !1, minute: !1, second: !1, dayPeriod: !1, timeZoneName: !1, timeStyle: !1 });
  if (!ki(t)) {
    if (Nr(e)) throw new TypeError(`cannot format PlainDate with options [${Object.keys(e)}]`);
    Object.assign(t, { year: "numeric", month: "numeric", day: "numeric" });
  }
  return t;
}
function Ul(e) {
  const t = Rr(e, { timeZoneName: !1 });
  if ((t.timeStyle === "long" || t.timeStyle === "full") && (delete t.timeStyle, Object.assign(t, { hour: "numeric", minute: "2-digit", second: "2-digit" }), t.dateStyle) && (Object.assign(t, { short: { year: "numeric", month: "numeric", day: "numeric" }, medium: { year: "numeric", month: "short", day: "numeric" }, long: { year: "numeric", month: "long", day: "numeric" }, full: { year: "numeric", month: "long", day: "numeric", weekday: "long" } }[t.dateStyle]), delete t.dateStyle), !Li(t) && !ki(t)) {
    if (Nr(e)) throw new TypeError(`cannot format PlainDateTime with options [${Object.keys(e)}]`);
    Object.assign(t, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
  }
  return t;
}
function Fl(e) {
  let t = e;
  return Li(t) || ki(t) || (t = Object.assign({}, t, { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })), t;
}
function ki(e) {
  return "year" in e || "month" in e || "day" in e || "weekday" in e || "dateStyle" in e || "era" in e;
}
function Li(e) {
  return "hour" in e || "minute" in e || "second" in e || "timeStyle" in e || "dayPeriod" in e || "fractionalSecondDigits" in e;
}
function Nr(e) {
  return ki(e) || Li(e) || "dateStyle" in e || "timeStyle" in e || "timeZoneName" in e;
}
function De(e) {
  return G(e) || B(e) || q(e) || O(e) || ot(e) || Pt(e) || it(e);
}
function oi(e) {
  return De(e) ? e : bi(e);
}
function rc(e, t) {
  return !(!De(e) || !De(t) || B(e) && !B(t) || G(e) && !G(t) || q(e) && !q(t) || O(e) && !O(t) || ot(e) && !ot(t) || Pt(e) && !Pt(t) || it(e) && !it(t));
}
function En(e, t) {
  if (B(e)) {
    const n = { isoDate: { year: 1970, month: 1, day: 1 }, time: m(e, V) };
    return { epochNs: ut(m(t, un), n, "compatible"), formatter: sn(t, ua) };
  }
  if (ot(e)) {
    const n = m(e, x), r = m(t, Hn);
    if (n !== r) throw new RangeError(`cannot format PlainYearMonth with calendar ${n} in locale with calendar ${r}`);
    const i = H(m(e, k), { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    return { epochNs: ut(m(t, un), i, "compatible"), formatter: sn(t, ca) };
  }
  if (Pt(e)) {
    const n = m(e, x), r = m(t, Hn);
    if (n !== r) throw new RangeError(`cannot format PlainMonthDay with calendar ${n} in locale with calendar ${r}`);
    const i = H(m(e, k), { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    return { epochNs: ut(m(t, un), i, "compatible"), formatter: sn(t, la) };
  }
  if (G(e)) {
    const n = m(e, x), r = m(t, Hn);
    if (n !== "iso8601" && n !== r) throw new RangeError(`cannot format PlainDate with calendar ${n} in locale with calendar ${r}`);
    const i = H(m(e, k), { deltaDays: 0, hour: 12, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
    return { epochNs: ut(m(t, un), i, "compatible"), formatter: sn(t, aa) };
  }
  if (q(e)) {
    const n = m(e, x), r = m(t, Hn);
    if (n !== "iso8601" && n !== r) throw new RangeError(`cannot format PlainDateTime with calendar ${n} in locale with calendar ${r}`);
    const i = m(e, X);
    return { epochNs: ut(m(t, un), i, "compatible"), formatter: sn(t, ha) };
  }
  if (O(e)) throw new TypeError("Temporal.ZonedDateTime not supported in DateTimeFormat methods. Use toLocaleString() instead.");
  return it(e) ? { epochNs: m(e, $), formatter: sn(t, da) } : {};
}
function ic(e) {
  const t = /* @__PURE__ */ Object.create(null);
  return t.years = m(e, gt), t.months = m(e, pt), t.weeks = m(e, kt), t.days = m(e, yt), t.hours = m(e, wt), t.minutes = m(e, vt), t.seconds = m(e, bt), t.milliseconds = m(e, _t), t.microseconds = m(e, Tt), t.nanoseconds = m(e, Lt), t;
}
dr.prototype.constructor = Zt, Object.defineProperty(Zt, "prototype", { value: dr.prototype, writable: !1, enumerable: !1, configurable: !1 }), Zt.supportedLocalesOf = hr.supportedLocalesOf, Le(Zt, "Intl.DateTimeFormat");
const { format: Zl, formatToParts: ql } = Intl.DurationFormat?.prototype ?? /* @__PURE__ */ Object.create(null);
function oc(e) {
  Intl.DurationFormat.prototype.resolvedOptions.call(this);
  const t = ic(qt(e));
  return Zl.call(this, t);
}
Intl.DurationFormat?.prototype && (Intl.DurationFormat.prototype.format = oc, Intl.DurationFormat.prototype.formatToParts = function(e) {
  Intl.DurationFormat.prototype.resolvedOptions.call(this);
  const t = ic(qt(e));
  return ql.call(this, t);
});
class Yo {
  constructor(t) {
    if (arguments.length < 1) throw new TypeError("missing argument: epochNanoseconds is required");
    Na(this, ii(t));
  }
  get epochMilliseconds() {
    return b(this, it), Wt(m(this, $), "floor");
  }
  get epochNanoseconds() {
    return b(this, it), Ga(f.BigInt(m(this, $)));
  }
  add(t) {
    return b(this, it), Es("add", this, t);
  }
  subtract(t) {
    return b(this, it), Es("subtract", this, t);
  }
  until(t, n = void 0) {
    return b(this, it), ys("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, it), ys("since", this, t, n);
  }
  round(t) {
    if (b(this, it), t === void 0) throw new TypeError("options parameter is required");
    const n = typeof t == "string" ? Be("smallestUnit", t) : C(t), r = Ln(n), i = Bt(n, "halfExpand"), o = Nt(n, "smallestUnit", "time", Ce);
    return Rn(r, { hour: 24, minute: 1440, second: 86400, millisecond: 864e5, microsecond: 864e8, nanosecond: 864e11 }[o], !0), oe(ro(m(this, $), r, o, i));
  }
  equals(t) {
    b(this, it);
    const n = Fn(t), r = m(this, $), i = m(n, $);
    return f.equal(f.BigInt(r), f.BigInt(i));
  }
  toString(t = void 0) {
    b(this, it);
    const n = C(t), r = Tr(n), i = Bt(n, "trunc"), o = Nt(n, "smallestUnit", "time", void 0);
    if (o === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    let s = n.timeZone;
    s !== void 0 && (s = xt(s));
    const { precision: a, unit: c, increment: l } = Mr(o, r);
    return cs(oe(ro(m(this, $), l, c, i)), s, a);
  }
  toJSON() {
    return b(this, it), cs(this, void 0, "auto");
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, it), new Zt(t, n).format(this);
  }
  valueOf() {
    He("Instant");
  }
  toZonedDateTimeISO(t) {
    b(this, it);
    const n = xt(t);
    return ct(m(this, $), n, "iso8601");
  }
  static fromEpochMilliseconds(t) {
    return oe(ae(bi(t)));
  }
  static fromEpochNanoseconds(t) {
    return oe(ii(t));
  }
  static from(t) {
    return Fn(t);
  }
  static compare(t, n) {
    const r = Fn(t), i = Fn(n), o = m(r, $), s = m(i, $);
    return f.lessThan(o, s) ? -1 : f.greaterThan(o, s) ? 1 : 0;
  }
}
Le(Yo, "Temporal.Instant");
class Io {
  constructor(t, n, r, i = "iso8601") {
    const o = L(t), s = L(n), a = L(r), c = $t(i === void 0 ? "iso8601" : tt(i));
    Ve(o, s, a), Ca(this, { year: o, month: s, day: a }, c);
  }
  get calendarId() {
    return b(this, G), m(this, x);
  }
  get era() {
    return dt(this, "era");
  }
  get eraYear() {
    return dt(this, "eraYear");
  }
  get year() {
    return dt(this, "year");
  }
  get month() {
    return dt(this, "month");
  }
  get monthCode() {
    return dt(this, "monthCode");
  }
  get day() {
    return dt(this, "day");
  }
  get dayOfWeek() {
    return dt(this, "dayOfWeek");
  }
  get dayOfYear() {
    return dt(this, "dayOfYear");
  }
  get weekOfYear() {
    return dt(this, "weekOfYear")?.week;
  }
  get yearOfWeek() {
    return dt(this, "weekOfYear")?.year;
  }
  get daysInWeek() {
    return dt(this, "daysInWeek");
  }
  get daysInMonth() {
    return dt(this, "daysInMonth");
  }
  get daysInYear() {
    return dt(this, "daysInYear");
  }
  get monthsInYear() {
    return dt(this, "monthsInYear");
  }
  get inLeapYear() {
    return dt(this, "inLeapYear");
  }
  with(t, n = void 0) {
    if (b(this, G), !K(t)) throw new TypeError("invalid argument");
    kn(t);
    const r = m(this, x);
    let i = Dt(r, m(this, k));
    return i = Ge(r, i, jt(r, t, ["year", "month", "monthCode", "day"], [], "partial")), Et(Se(r, i, S(C(n))), r);
  }
  withCalendar(t) {
    b(this, G);
    const n = Cr(t);
    return Et(m(this, k), n);
  }
  add(t, n = void 0) {
    return b(this, G), xs("add", this, t, n);
  }
  subtract(t, n = void 0) {
    return b(this, G), xs("subtract", this, t, n);
  }
  until(t, n = void 0) {
    return b(this, G), ws("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, G), ws("since", this, t, n);
  }
  equals(t) {
    b(this, G);
    const n = jn(t);
    return de(m(this, k), m(n, k)) === 0 && ue(m(this, x), m(n, x));
  }
  toString(t = void 0) {
    return b(this, G), ls(this, _r(C(t)));
  }
  toJSON() {
    return b(this, G), ls(this);
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, G), new Zt(t, n).format(this);
  }
  valueOf() {
    He("PlainDate");
  }
  toPlainDateTime(t = void 0) {
    b(this, G);
    const n = Da(t);
    return Ut(H(m(this, k), n), m(this, x));
  }
  toZonedDateTime(t) {
    let n, r;
    if (b(this, G), K(t)) {
      const s = t.timeZone;
      s === void 0 ? n = xt(t) : (n = xt(s), r = t.plainTime);
    } else n = xt(t);
    const i = m(this, k);
    let o;
    return r === void 0 ? o = Re(n, i) : (r = Oe(r), o = ut(n, H(i, m(r, V)), "compatible")), ct(o, n, m(this, x));
  }
  toPlainYearMonth() {
    b(this, G);
    const t = m(this, x);
    return gn(sr(t, Dt(t, m(this, k)), "constrain"), t);
  }
  toPlainMonthDay() {
    b(this, G);
    const t = m(this, x);
    return fn(Jr(t, Dt(t, m(this, k)), "constrain"), t);
  }
  static from(t, n = void 0) {
    return jn(t, n);
  }
  static compare(t, n) {
    const r = jn(t), i = jn(n);
    return de(m(r, k), m(i, k));
  }
}
function dt(e, t) {
  b(e, G);
  const n = m(e, k);
  return Er(e).isoToDate(n, { [t]: !0 })[t];
}
Le(Io, "Temporal.PlainDate");
class Po {
  constructor(t, n, r, i = 0, o = 0, s = 0, a = 0, c = 0, l = 0, u = "iso8601") {
    const h = L(t), d = L(n), g = L(r), p = i === void 0 ? 0 : L(i), w = o === void 0 ? 0 : L(o), y = s === void 0 ? 0 : L(s), v = a === void 0 ? 0 : L(a), _ = c === void 0 ? 0 : L(c), T = l === void 0 ? 0 : L(l), M = $t(u === void 0 ? "iso8601" : tt(u));
    $o(h, d, g, p, w, y, v, _, T), $a(this, { isoDate: { year: h, month: d, day: g }, time: { hour: p, minute: w, second: y, millisecond: v, microsecond: _, nanosecond: T } }, M);
  }
  get calendarId() {
    return b(this, q), m(this, x);
  }
  get year() {
    return ft(this, "year");
  }
  get month() {
    return ft(this, "month");
  }
  get monthCode() {
    return ft(this, "monthCode");
  }
  get day() {
    return ft(this, "day");
  }
  get hour() {
    return an(this, "hour");
  }
  get minute() {
    return an(this, "minute");
  }
  get second() {
    return an(this, "second");
  }
  get millisecond() {
    return an(this, "millisecond");
  }
  get microsecond() {
    return an(this, "microsecond");
  }
  get nanosecond() {
    return an(this, "nanosecond");
  }
  get era() {
    return ft(this, "era");
  }
  get eraYear() {
    return ft(this, "eraYear");
  }
  get dayOfWeek() {
    return ft(this, "dayOfWeek");
  }
  get dayOfYear() {
    return ft(this, "dayOfYear");
  }
  get weekOfYear() {
    return ft(this, "weekOfYear")?.week;
  }
  get yearOfWeek() {
    return ft(this, "weekOfYear")?.year;
  }
  get daysInWeek() {
    return ft(this, "daysInWeek");
  }
  get daysInYear() {
    return ft(this, "daysInYear");
  }
  get daysInMonth() {
    return ft(this, "daysInMonth");
  }
  get monthsInYear() {
    return ft(this, "monthsInYear");
  }
  get inLeapYear() {
    return ft(this, "inLeapYear");
  }
  with(t, n = void 0) {
    if (b(this, q), !K(t)) throw new TypeError("invalid argument");
    kn(t);
    const r = m(this, x), i = m(this, X);
    let o = { ...Dt(r, i.isoDate), ...i.time };
    return o = Ge(r, o, jt(r, t, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond"], "partial")), Ut(xr(r, o, S(C(n))), r);
  }
  withPlainTime(t = void 0) {
    b(this, q);
    const n = Da(t);
    return Ut(H(m(this, X).isoDate, n), m(this, x));
  }
  withCalendar(t) {
    b(this, q);
    const n = Cr(t);
    return Ut(m(this, X), n);
  }
  add(t, n = void 0) {
    return b(this, q), Ds("add", this, t, n);
  }
  subtract(t, n = void 0) {
    return b(this, q), Ds("subtract", this, t, n);
  }
  until(t, n = void 0) {
    return b(this, q), vs("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, q), vs("since", this, t, n);
  }
  round(t) {
    if (b(this, q), t === void 0) throw new TypeError("options parameter is required");
    const n = typeof t == "string" ? Be("smallestUnit", t) : C(t), r = Ln(n), i = Bt(n, "halfExpand"), o = Nt(n, "smallestUnit", "time", Ce, ["day"]), s = { day: 1, hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[o];
    Rn(r, s, s === 1);
    const a = m(this, X);
    return Ut(r === 1 && o === "nanosecond" ? a : io(a, r, o, i), m(this, x));
  }
  equals(t) {
    b(this, q);
    const n = Un(t);
    return Mn(m(this, X), m(n, X)) === 0 && ue(m(this, x), m(n, x));
  }
  toString(t = void 0) {
    b(this, q);
    const n = C(t), r = _r(n), i = Tr(n), o = Bt(n, "trunc"), s = Nt(n, "smallestUnit", "time", void 0);
    if (s === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const { precision: a, unit: c, increment: l } = Mr(s, i), u = io(m(this, X), l, c, o);
    return Ke(u), cr(u, m(this, x), a, r);
  }
  toJSON() {
    return b(this, q), cr(m(this, X), m(this, x), "auto");
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, q), new Zt(t, n).format(this);
  }
  valueOf() {
    He("PlainDateTime");
  }
  toZonedDateTime(t, n = void 0) {
    b(this, q);
    const r = xt(t), i = tr(C(n));
    return ct(ut(r, m(this, X), i), r, m(this, x));
  }
  toPlainDate() {
    return b(this, q), Et(m(this, X).isoDate, m(this, x));
  }
  toPlainTime() {
    return b(this, q), be(m(this, X).time);
  }
  static from(t, n = void 0) {
    return Un(t, n);
  }
  static compare(t, n) {
    const r = Un(t), i = Un(n);
    return Mn(m(r, X), m(i, X));
  }
}
function ft(e, t) {
  b(e, q);
  const n = m(e, X).isoDate;
  return Er(e).isoToDate(n, { [t]: !0 })[t];
}
function an(e, t) {
  return b(e, q), m(e, X).time[t];
}
Le(Po, "Temporal.PlainDateTime");
class xn {
  constructor(t = 0, n = 0, r = 0, i = 0, o = 0, s = 0, a = 0, c = 0, l = 0, u = 0) {
    const h = t === void 0 ? 0 : Vt(t), d = n === void 0 ? 0 : Vt(n), g = r === void 0 ? 0 : Vt(r), p = i === void 0 ? 0 : Vt(i), w = o === void 0 ? 0 : Vt(o), y = s === void 0 ? 0 : Vt(s), v = a === void 0 ? 0 : Vt(a), _ = c === void 0 ? 0 : Vt(c), T = l === void 0 ? 0 : Vt(l), M = u === void 0 ? 0 : Vt(u);
    Ci(h, d, g, p, w, y, v, _, T, M), ke(this), N(this, gt, h), N(this, pt, d), N(this, kt, g), N(this, yt, p), N(this, wt, w), N(this, vt, y), N(this, bt, v), N(this, _t, _), N(this, Tt, T), N(this, Lt, M);
  }
  get years() {
    return b(this, W), m(this, gt);
  }
  get months() {
    return b(this, W), m(this, pt);
  }
  get weeks() {
    return b(this, W), m(this, kt);
  }
  get days() {
    return b(this, W), m(this, yt);
  }
  get hours() {
    return b(this, W), m(this, wt);
  }
  get minutes() {
    return b(this, W), m(this, vt);
  }
  get seconds() {
    return b(this, W), m(this, bt);
  }
  get milliseconds() {
    return b(this, W), m(this, _t);
  }
  get microseconds() {
    return b(this, W), m(this, Tt);
  }
  get nanoseconds() {
    return b(this, W), m(this, Lt);
  }
  get sign() {
    return b(this, W), ni(this);
  }
  get blank() {
    return b(this, W), ni(this) === 0;
  }
  with(t) {
    b(this, W);
    const n = xa(t), { years: r = m(this, gt), months: i = m(this, pt), weeks: o = m(this, kt), days: s = m(this, yt), hours: a = m(this, wt), minutes: c = m(this, vt), seconds: l = m(this, bt), milliseconds: u = m(this, _t), microseconds: h = m(this, Tt), nanoseconds: d = m(this, Lt) } = n;
    return new xn(r, i, o, s, a, c, l, u, h, d);
  }
  negated() {
    return b(this, W), Yt(this);
  }
  abs() {
    return b(this, W), new xn(Math.abs(m(this, gt)), Math.abs(m(this, pt)), Math.abs(m(this, kt)), Math.abs(m(this, yt)), Math.abs(m(this, wt)), Math.abs(m(this, vt)), Math.abs(m(this, bt)), Math.abs(m(this, _t)), Math.abs(m(this, Tt)), Math.abs(m(this, Lt)));
  }
  add(t) {
    return b(this, W), Ms("add", this, t);
  }
  subtract(t) {
    return b(this, W), Ms("subtract", this, t);
  }
  round(t) {
    if (b(this, W), t === void 0) throw new TypeError("options parameter is required");
    const n = we(this), r = typeof t == "string" ? Be("smallestUnit", t) : C(t);
    let i = Nt(r, "largestUnit", "datetime", void 0, ["auto"]), { plainRelativeTo: o, zonedRelativeTo: s } = Ii(r);
    const a = Ln(r), c = Bt(r, "halfExpand");
    let l = Nt(r, "smallestUnit", "datetime", void 0), u = !0;
    l || (u = !1, l = "nanosecond");
    const h = Me(n, l);
    let d = !0;
    if (i || (d = !1, i = h), i === "auto" && (i = h), !u && !d) throw new RangeError("at least one of smallestUnit or largestUnit is required");
    if (Me(i, l) !== i) throw new RangeError(`largestUnit ${i} cannot be smaller than smallestUnit ${l}`);
    const g = { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[l];
    if (g !== void 0 && Rn(a, g, !1), a > 1 && ve(l) === "date" && i !== l) throw new RangeError("For calendar units with roundingIncrement > 1, use largestUnit = smallestUnit");
    if (s) {
      let w = hn(this);
      const y = m(s, U), v = m(s, x), _ = m(s, $);
      return w = Wa(_, Xn(_, y, v, w), y, v, i, a, l, c), ve(i) === "date" && (i = "hour"), Ft(w, i);
    }
    if (o) {
      let w = se(this);
      const y = Tn({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }, w.time), v = m(o, k), _ = m(o, x), T = zt(_, v, lt(w.date, y.deltaDays), "constrain");
      return w = Xa(H(v, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), H(T, y), _, i, a, l, c), Ft(w, i);
    }
    if (re(n)) throw new RangeError(`a starting point is required for ${n}s balancing`);
    if (re(i)) throw new RangeError(`a starting point is required for ${i}s balancing`);
    let p = se(this);
    if (l === "day") {
      const { quotient: w, remainder: y } = p.time.divmod(Kr);
      let v = p.date.days + w + er(y, "day");
      v = Ae(v, a, c), p = Ee({ years: 0, months: 0, weeks: 0, days: v }, A.ZERO);
    } else p = Ee({ years: 0, months: 0, weeks: 0, days: 0 }, ri(p.time, a, l, c));
    return Ft(p, i);
  }
  total(t) {
    if (b(this, W), t === void 0) throw new TypeError("options argument is required");
    const n = typeof t == "string" ? Be("unit", t) : C(t);
    let { plainRelativeTo: r, zonedRelativeTo: i } = Ii(n);
    const o = Nt(n, "unit", "datetime", Ce);
    if (i) {
      const a = hn(this), c = m(i, U), l = m(i, x), u = m(i, $);
      return (function(h, d, g, p, w) {
        return ve(w) === "time" ? er(A.fromEpochNsDiff(d, h), w) : ps(Za(h, d, g, p, w), d, Xt(g, h), g, p, w);
      })(u, Xn(u, c, l, a), c, l, o);
    }
    if (r) {
      const a = se(this);
      let c = Tn({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }, a.time);
      const l = m(r, k), u = m(r, x), h = zt(u, l, lt(a.date, c.deltaDays), "constrain");
      return (function(d, g, p, w) {
        if (Mn(d, g) == 0) return 0;
        Ke(d), Ke(g);
        const y = Fa(d, g, p, w);
        return w === "nanosecond" ? f.toNumber(y.time.totalNs) : ps(y, st(g), d, null, p, w);
      })(H(l, { deltaDays: 0, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }), H(h, c), u, o);
    }
    const s = we(this);
    if (re(s)) throw new RangeError(`a starting point is required for ${s}s total`);
    if (re(o)) throw new RangeError(`a starting point is required for ${o}s total`);
    return er(se(this).time, o);
  }
  toString(t = void 0) {
    b(this, W);
    const n = C(t), r = Tr(n), i = Bt(n, "trunc"), o = Nt(n, "smallestUnit", "time", void 0);
    if (o === "hour" || o === "minute") throw new RangeError('smallestUnit must be a time unit other than "hours" or "minutes"');
    const { precision: s, unit: a, increment: c } = Mr(o, r);
    if (a === "nanosecond" && c === 1) return Ir(this, s);
    const l = we(this);
    let u = hn(this);
    const h = ri(u.time, c, a, i);
    return u = Ee(u.date, h), Ir(Ft(u, Me(l, "second")), s);
  }
  toJSON() {
    return b(this, W), Ir(this, "auto");
  }
  toLocaleString(t = void 0, n = void 0) {
    if (b(this, W), typeof Intl.DurationFormat == "function") {
      const r = new Intl.DurationFormat(t, n);
      return oc.call(r, this);
    }
    return console.warn("Temporal.Duration.prototype.toLocaleString() requires Intl.DurationFormat."), Ir(this, "auto");
  }
  valueOf() {
    He("Duration");
  }
  static from(t) {
    return qt(t);
  }
  static compare(t, n, r = void 0) {
    const i = qt(t), o = qt(n), s = C(r), { plainRelativeTo: a, zonedRelativeTo: c } = Ii(s);
    if (m(i, gt) === m(o, gt) && m(i, pt) === m(o, pt) && m(i, kt) === m(o, kt) && m(i, yt) === m(o, yt) && m(i, wt) === m(o, wt) && m(i, vt) === m(o, vt) && m(i, bt) === m(o, bt) && m(i, _t) === m(o, _t) && m(i, Tt) === m(o, Tt) && m(i, Lt) === m(o, Lt)) return 0;
    const l = we(i), u = we(o), h = hn(i), d = hn(o);
    if (c && (ve(l) === "date" || ve(u) === "date")) {
      const v = m(c, U), _ = m(c, x), T = m(c, $), M = Xn(T, v, _, h), E = Xn(T, v, _, d);
      return Rt(f.toNumber(f.subtract(M, E)));
    }
    let g = h.date.days, p = d.date.days;
    if (re(l) || re(u)) {
      if (!a) throw new RangeError("A starting point is required for years, months, or weeks comparison");
      g = gs(h.date, a), p = gs(d.date, a);
    }
    const w = h.time.add24HourDays(g), y = d.time.add24HourDays(p);
    return w.cmp(y);
  }
}
Le(xn, "Temporal.Duration");
class So {
  constructor(t, n, r = "iso8601", i = 1972) {
    const o = L(t), s = L(n), a = $t(r === void 0 ? "iso8601" : tt(r)), c = L(i);
    Ve(c, o, s), ka(this, { year: c, month: o, day: s }, a);
  }
  get monthCode() {
    return Rs(this, "monthCode");
  }
  get day() {
    return Rs(this, "day");
  }
  get calendarId() {
    return b(this, Pt), m(this, x);
  }
  with(t, n = void 0) {
    if (b(this, Pt), !K(t)) throw new TypeError("invalid argument");
    kn(t);
    const r = m(this, x);
    let i = Dt(r, m(this, k), "month-day");
    return i = Ge(r, i, jt(r, t, ["year", "month", "monthCode", "day"], [], "partial")), fn(Jr(r, i, S(C(n))), r);
  }
  equals(t) {
    b(this, Pt);
    const n = ss(t);
    return de(m(this, k), m(n, k)) === 0 && ue(m(this, x), m(n, x));
  }
  toString(t = void 0) {
    return b(this, Pt), hs(this, _r(C(t)));
  }
  toJSON() {
    return b(this, Pt), hs(this);
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, Pt), new Zt(t, n).format(this);
  }
  valueOf() {
    He("PlainMonthDay");
  }
  toPlainDate(t) {
    if (b(this, Pt), !K(t)) throw new TypeError("argument should be an object");
    const n = m(this, x);
    return Et(Se(n, Ge(n, Dt(n, m(this, k), "month-day"), jt(n, t, ["year"], [], [])), "constrain"), n);
  }
  static from(t, n = void 0) {
    return ss(t, n);
  }
}
function Rs(e, t) {
  b(e, Pt);
  const n = m(e, k);
  return Er(e).isoToDate(n, { [t]: !0 })[t];
}
function Si(e) {
  return Xt(e, ao());
}
Le(So, "Temporal.PlainMonthDay");
const sc = { instant: () => oe(ao()), plainDateTimeISO: (e = In()) => Ut(Si(xt(e)), "iso8601"), plainDateISO: (e = In()) => Et(Si(xt(e)).isoDate, "iso8601"), plainTimeISO: (e = In()) => be(Si(xt(e)).time), timeZoneId: () => In(), zonedDateTimeISO: (e = In()) => {
  const t = xt(e);
  return ct(ao(), t, "iso8601");
}, [Symbol.toStringTag]: "Temporal.Now" };
Object.defineProperty(sc, Symbol.toStringTag, { value: "Temporal.Now", writable: !1, enumerable: !1, configurable: !0 });
class Or {
  constructor(t = 0, n = 0, r = 0, i = 0, o = 0, s = 0) {
    const a = t === void 0 ? 0 : L(t), c = n === void 0 ? 0 : L(n), l = r === void 0 ? 0 : L(r), u = i === void 0 ? 0 : L(i), h = o === void 0 ? 0 : L(o), d = s === void 0 ? 0 : L(s);
    Di(a, c, l, u, h, d), La(this, { hour: a, minute: c, second: l, millisecond: u, microsecond: h, nanosecond: d });
  }
  get hour() {
    return b(this, B), m(this, V).hour;
  }
  get minute() {
    return b(this, B), m(this, V).minute;
  }
  get second() {
    return b(this, B), m(this, V).second;
  }
  get millisecond() {
    return b(this, B), m(this, V).millisecond;
  }
  get microsecond() {
    return b(this, B), m(this, V).microsecond;
  }
  get nanosecond() {
    return b(this, B), m(this, V).nanosecond;
  }
  with(t, n = void 0) {
    if (b(this, B), !K(t)) throw new TypeError("invalid argument");
    kn(t);
    const r = Qi(t, "partial"), i = Qi(this);
    let { hour: o, minute: s, second: a, millisecond: c, microsecond: l, nanosecond: u } = Object.assign(i, r);
    const h = S(C(n));
    return { hour: o, minute: s, second: a, millisecond: c, microsecond: l, nanosecond: u } = Mi(o, s, a, c, l, u, h), new Or(o, s, a, c, l, u);
  }
  add(t) {
    return b(this, B), Cs("add", this, t);
  }
  subtract(t) {
    return b(this, B), Cs("subtract", this, t);
  }
  until(t, n = void 0) {
    return b(this, B), bs("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, B), bs("since", this, t, n);
  }
  round(t) {
    if (b(this, B), t === void 0) throw new TypeError("options parameter is required");
    const n = typeof t == "string" ? Be("smallestUnit", t) : C(t), r = Ln(n), i = Bt(n, "halfExpand"), o = Nt(n, "smallestUnit", "time", Ce);
    return Rn(r, { hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[o], !1), be(oo(m(this, V), r, o, i));
  }
  equals(t) {
    b(this, B);
    const n = Oe(t);
    return so(m(this, V), m(n, V)) === 0;
  }
  toString(t = void 0) {
    b(this, B);
    const n = C(t), r = Tr(n), i = Bt(n, "trunc"), o = Nt(n, "smallestUnit", "time", void 0);
    if (o === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const { precision: s, unit: a, increment: c } = Mr(o, r);
    return us(oo(m(this, V), c, a, i), s);
  }
  toJSON() {
    return b(this, B), us(m(this, V), "auto");
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, B), new Zt(t, n).format(this);
  }
  valueOf() {
    He("PlainTime");
  }
  static from(t, n = void 0) {
    return Oe(t, n);
  }
  static compare(t, n) {
    const r = Oe(t), i = Oe(n);
    return so(m(r, V), m(i, V));
  }
}
Le(Or, "Temporal.PlainTime");
class zo {
  constructor(t, n, r = "iso8601", i = 1) {
    const o = L(t), s = L(n), a = $t(r === void 0 ? "iso8601" : tt(r)), c = L(i);
    Ve(o, s, c), Ra(this, { year: o, month: s, day: c }, a);
  }
  get year() {
    return ge(this, "year");
  }
  get month() {
    return ge(this, "month");
  }
  get monthCode() {
    return ge(this, "monthCode");
  }
  get calendarId() {
    return b(this, ot), m(this, x);
  }
  get era() {
    return ge(this, "era");
  }
  get eraYear() {
    return ge(this, "eraYear");
  }
  get daysInMonth() {
    return ge(this, "daysInMonth");
  }
  get daysInYear() {
    return ge(this, "daysInYear");
  }
  get monthsInYear() {
    return ge(this, "monthsInYear");
  }
  get inLeapYear() {
    return ge(this, "inLeapYear");
  }
  with(t, n = void 0) {
    if (b(this, ot), !K(t)) throw new TypeError("invalid argument");
    kn(t);
    const r = m(this, x);
    let i = Dt(r, m(this, k), "year-month");
    return i = Ge(r, i, jt(r, t, ["year", "month", "monthCode"], [], "partial")), gn(sr(r, i, S(C(n))), r);
  }
  add(t, n = void 0) {
    return b(this, ot), $s("add", this, t, n);
  }
  subtract(t, n = void 0) {
    return b(this, ot), $s("subtract", this, t, n);
  }
  until(t, n = void 0) {
    return b(this, ot), _s("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, ot), _s("since", this, t, n);
  }
  equals(t) {
    b(this, ot);
    const n = Zn(t);
    return de(m(this, k), m(n, k)) === 0 && ue(m(this, x), m(n, x));
  }
  toString(t = void 0) {
    return b(this, ot), ds(this, _r(C(t)));
  }
  toJSON() {
    return b(this, ot), ds(this);
  }
  toLocaleString(t = void 0, n = void 0) {
    return b(this, ot), new Zt(t, n).format(this);
  }
  valueOf() {
    He("PlainYearMonth");
  }
  toPlainDate(t) {
    if (b(this, ot), !K(t)) throw new TypeError("argument should be an object");
    const n = m(this, x);
    return Et(Se(n, Ge(n, Dt(n, m(this, k), "year-month"), jt(n, t, ["day"], [], [])), "constrain"), n);
  }
  static from(t, n = void 0) {
    return Zn(t, n);
  }
  static compare(t, n) {
    const r = Zn(t), i = Zn(n);
    return de(m(r, k), m(i, k));
  }
}
function ge(e, t) {
  b(e, ot);
  const n = m(e, k);
  return Er(e).isoToDate(n, { [t]: !0 })[t];
}
Le(zo, "Temporal.PlainYearMonth");
const Xl = Zt.prototype.resolvedOptions;
class Ho {
  constructor(t, n, r = "iso8601") {
    if (arguments.length < 1) throw new TypeError("missing argument: epochNanoseconds is required");
    const i = ii(t);
    let o = tt(n);
    const { tzName: s, offsetMinutes: a } = Ye(o);
    if (a === void 0) {
      const c = ti(s);
      if (!c) throw new RangeError(`unknown time zone ${s}`);
      o = c.identifier;
    } else o = xo(a);
    Oa(this, i, o, $t(r === void 0 ? "iso8601" : tt(r)));
  }
  get calendarId() {
    return b(this, O), m(this, x);
  }
  get timeZoneId() {
    return b(this, O), m(this, U);
  }
  get year() {
    return mt(this, "year");
  }
  get month() {
    return mt(this, "month");
  }
  get monthCode() {
    return mt(this, "monthCode");
  }
  get day() {
    return mt(this, "day");
  }
  get hour() {
    return cn(this, "hour");
  }
  get minute() {
    return cn(this, "minute");
  }
  get second() {
    return cn(this, "second");
  }
  get millisecond() {
    return cn(this, "millisecond");
  }
  get microsecond() {
    return cn(this, "microsecond");
  }
  get nanosecond() {
    return cn(this, "nanosecond");
  }
  get era() {
    return mt(this, "era");
  }
  get eraYear() {
    return mt(this, "eraYear");
  }
  get epochMilliseconds() {
    return b(this, O), Wt(m(this, $), "floor");
  }
  get epochNanoseconds() {
    return b(this, O), Ga(m(this, $));
  }
  get dayOfWeek() {
    return mt(this, "dayOfWeek");
  }
  get dayOfYear() {
    return mt(this, "dayOfYear");
  }
  get weekOfYear() {
    return mt(this, "weekOfYear")?.week;
  }
  get yearOfWeek() {
    return mt(this, "weekOfYear")?.year;
  }
  get hoursInDay() {
    b(this, O);
    const t = m(this, U), n = ee(this).isoDate, r = At(n.year, n.month, n.day + 1), i = Re(t, n), o = Re(t, r);
    return er(A.fromEpochNsDiff(o, i), "hour");
  }
  get daysInWeek() {
    return mt(this, "daysInWeek");
  }
  get daysInMonth() {
    return mt(this, "daysInMonth");
  }
  get daysInYear() {
    return mt(this, "daysInYear");
  }
  get monthsInYear() {
    return mt(this, "monthsInYear");
  }
  get inLeapYear() {
    return mt(this, "inLeapYear");
  }
  get offset() {
    return b(this, O), Bi(_e(m(this, U), m(this, $)));
  }
  get offsetNanoseconds() {
    return b(this, O), _e(m(this, U), m(this, $));
  }
  with(t, n = void 0) {
    if (b(this, O), !K(t)) throw new TypeError("invalid zoned-date-time-like");
    kn(t);
    const r = m(this, x), i = m(this, U), o = _e(i, m(this, $)), s = ee(this);
    let a = { ...Dt(r, s.isoDate), ...s.time, offset: Bi(o) };
    a = Ge(r, a, jt(r, t, ["year", "month", "monthCode", "day"], ["hour", "minute", "second", "millisecond", "microsecond", "nanosecond", "offset"], "partial"));
    const c = C(n), l = tr(c), u = Ur(c, "prefer"), h = xr(r, a, S(c)), d = Nn(a.offset);
    return ct(Br(h.isoDate, h.time, "option", d, i, l, u, !1), i, r);
  }
  withPlainTime(t = void 0) {
    b(this, O);
    const n = m(this, U), r = m(this, x), i = ee(this).isoDate;
    let o;
    return o = t === void 0 ? Re(n, i) : ut(n, H(i, m(Oe(t), V)), "compatible"), ct(o, n, r);
  }
  withTimeZone(t) {
    b(this, O);
    const n = xt(t);
    return ct(m(this, $), n, m(this, x));
  }
  withCalendar(t) {
    b(this, O);
    const n = Cr(t);
    return ct(m(this, $), m(this, U), n);
  }
  add(t, n = void 0) {
    return b(this, O), ks("add", this, t, n);
  }
  subtract(t, n = void 0) {
    return b(this, O), ks("subtract", this, t, n);
  }
  until(t, n = void 0) {
    return b(this, O), Ts("until", this, t, n);
  }
  since(t, n = void 0) {
    return b(this, O), Ts("since", this, t, n);
  }
  round(t) {
    if (b(this, O), t === void 0) throw new TypeError("options parameter is required");
    const n = typeof t == "string" ? Be("smallestUnit", t) : C(t), r = Ln(n), i = Bt(n, "halfExpand"), o = Nt(n, "smallestUnit", "time", Ce, ["day"]), s = { day: 1, hour: 24, minute: 60, second: 60, millisecond: 1e3, microsecond: 1e3, nanosecond: 1e3 }[o];
    if (Rn(r, s, s === 1), o === "nanosecond" && r === 1) return ct(m(this, $), m(this, U), m(this, x));
    const a = m(this, U), c = m(this, $), l = ee(this);
    let u;
    if (o === "day") {
      const h = l.isoDate, d = At(h.year, h.month, h.day + 1), g = Re(a, h), p = Re(a, d), w = f.subtract(p, g);
      u = A.fromEpochNsDiff(c, g).round(w, i).addToEpochNs(g);
    } else {
      const h = io(l, r, o, i), d = _e(a, c);
      u = Br(h.isoDate, h.time, "option", d, a, "compatible", "prefer", !1);
    }
    return ct(u, a, m(this, x));
  }
  equals(t) {
    b(this, O);
    const n = qn(t), r = m(this, $), i = m(n, $);
    return !!f.equal(f.BigInt(r), f.BigInt(i)) && !!Aa(m(this, U), m(n, U)) && ue(m(this, x), m(n, x));
  }
  toString(t = void 0) {
    b(this, O);
    const n = C(t), r = _r(n), i = Tr(n), o = (function(d) {
      return xe(d, "offset", ["auto", "never"], "auto");
    })(n), s = Bt(n, "trunc"), a = Nt(n, "smallestUnit", "time", void 0);
    if (a === "hour") throw new RangeError('smallestUnit must be a time unit other than "hour"');
    const c = (function(d) {
      return xe(d, "timeZoneName", ["auto", "never", "critical"], "auto");
    })(n), { precision: l, unit: u, increment: h } = Mr(a, i);
    return fs(this, l, r, c, o, { unit: u, increment: h, roundingMode: s });
  }
  toLocaleString(t = void 0, n = void 0) {
    b(this, O);
    const r = C(n), i = /* @__PURE__ */ Object.create(null);
    if ((function(c, l, u, h) {
      if (l == null) return;
      const d = Reflect.ownKeys(l);
      for (let g = 0; g < d.length; g++) {
        const p = d[g];
        if (!u.some(((w) => Object.is(w, p))) && Object.prototype.propertyIsEnumerable.call(l, p)) {
          const w = l[p];
          c[p] = w;
        }
      }
    })(i, r, ["timeZone"]), r.timeZone !== void 0) throw new TypeError("ZonedDateTime toLocaleString does not accept a timeZone option");
    if (i.year === void 0 && i.month === void 0 && i.day === void 0 && i.era === void 0 && i.weekday === void 0 && i.dateStyle === void 0 && i.hour === void 0 && i.minute === void 0 && i.second === void 0 && i.fractionalSecondDigits === void 0 && i.timeStyle === void 0 && i.dayPeriod === void 0 && i.timeZoneName === void 0 && (i.timeZoneName = "short"), i.timeZone = m(this, U), ms(i.timeZone)) throw new RangeError("toLocaleString does not currently support offset time zones");
    const o = new Zt(t, i), s = Xl.call(o).calendar, a = m(this, x);
    if (a !== "iso8601" && s !== "iso8601" && !ue(s, a)) throw new RangeError(`cannot format ZonedDateTime with calendar ${a} in locale with calendar ${s}`);
    return o.format(oe(m(this, $)));
  }
  toJSON() {
    return b(this, O), fs(this, "auto");
  }
  valueOf() {
    He("ZonedDateTime");
  }
  startOfDay() {
    b(this, O);
    const t = m(this, U);
    return ct(Re(t, ee(this).isoDate), t, m(this, x));
  }
  getTimeZoneTransition(t) {
    b(this, O);
    const n = m(this, U);
    if (t === void 0) throw new TypeError("options parameter is required");
    const r = xe(typeof t == "string" ? Be("direction", t) : C(t), "direction", ["next", "previous"], Ce);
    if (r === void 0) throw new TypeError("direction option is required");
    if (ms(n) || n === "UTC") return null;
    const i = m(this, $), o = r === "next" ? Co(n, i) : to(n, i);
    return o === null ? null : ct(o, n, m(this, x));
  }
  toInstant() {
    return b(this, O), oe(m(this, $));
  }
  toPlainDate() {
    return b(this, O), Et(ee(this).isoDate, m(this, x));
  }
  toPlainTime() {
    return b(this, O), be(ee(this).time);
  }
  toPlainDateTime() {
    return b(this, O), Ut(ee(this), m(this, x));
  }
  static from(t, n = void 0) {
    return qn(t, n);
  }
  static compare(t, n) {
    const r = qn(t), i = qn(n), o = m(r, $), s = m(i, $);
    return f.lessThan(f.BigInt(o), f.BigInt(s)) ? -1 : f.greaterThan(f.BigInt(o), f.BigInt(s)) ? 1 : 0;
  }
}
function ee(e) {
  return Xt(m(e, U), m(e, $));
}
function mt(e, t) {
  b(e, O);
  const n = ee(e).isoDate;
  return Er(e).isoToDate(n, { [t]: !0 })[t];
}
function cn(e, t) {
  return b(e, O), ee(e).time[t];
}
Le(Ho, "Temporal.ZonedDateTime");
var Wl = Object.freeze({ __proto__: null, Duration: xn, Instant: Yo, Now: sc, PlainDate: Io, PlainDateTime: Po, PlainMonthDay: So, PlainTime: Or, PlainYearMonth: zo, ZonedDateTime: Ho });
const Gl = [Yo, Io, Po, xn, So, Or, zo, Ho];
for (const e of Gl) {
  const t = Object.getOwnPropertyDescriptor(e, "prototype");
  (t.configurable || t.enumerable || t.writable) && (t.configurable = !1, t.enumerable = !1, t.writable = !1, Object.defineProperty(e, "prototype", t));
}
function J(e) {
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
    return Fr(n);
  }
  if (e instanceof Temporal.Instant)
    return Fr(e);
  if ("value" in e && "unit" in e) {
    const t = Temporal.Now.plainDateISO().year;
    if (e.unit === "mya")
      return -(e.value * 1e6);
    if (e.unit === "years-ago")
      return t - e.value;
    if (e.unit === "bce")
      return -e.value;
    if (e.unit === "ce")
      return e.value;
  }
  if ("localTime" in e && "timezone" in e) {
    const t = Temporal.PlainDateTime.from(e.localTime).toZonedDateTime(e.timezone);
    return Fr(t.toInstant());
  }
  throw new Error(`Unsupported time input format: ${JSON.stringify(e)}`);
}
function Fr(e) {
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
function Ym(e, t) {
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
    return t === "precise" ? Vl(e).toString() : t === "historical" ? `${n} CE` : n.toString();
  }
}
function Vl(e) {
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
function Im(e, t) {
  const n = t - e;
  return n > 1e6 || e < -1e6 ? "geological" : n > 1e4 || e < -1e4 ? "prehistoric" : n > 1e3 ? "historical" : n > 1 ? "modern" : "precise";
}
function jo() {
  return Fr(Temporal.Now.instant());
}
function Ns(e) {
  return e.endTime === void 0 || e.endTime === null;
}
function fr(e, t = !1) {
  return e == null ? t ? 1 / 0 : jo() : J(e);
}
function Kl(e, t) {
  const n = /* @__PURE__ */ new Map();
  e.forEach((y) => {
    n.set(y.id, {
      name: y.name,
      startTime: J(y.startTime),
      endTime: fr(y.endTime, !0)
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
  function l(y) {
    const v = /* @__PURE__ */ new Set();
    let _ = [y];
    for (; _.length > 0; ) {
      const T = [];
      for (const M of _) {
        if (v.has(M)) continue;
        v.add(M);
        const E = o.get(M) || [];
        if (E.length === 0) {
          const R = n.get(M);
          if (R)
            return { rootId: M, rootStartTime: R.startTime };
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
        const M = l(T);
        M && (!_ || M.rootStartTime < _.rootStartTime) && (_ = M);
      }
      _ && c.set(v, _.rootId);
    }
  });
  const u = /* @__PURE__ */ new Set();
  function h(y, v) {
    const _ = n.get(y);
    if (!_ || c.has(y) && c.get(y) !== v || u.has(y))
      return null;
    u.add(y);
    const T = {
      id: y,
      name: _.name,
      startTime: _.startTime,
      endTime: _.endTime,
      children: []
    }, M = i.get(y) || [];
    for (const E of M) {
      const R = h(E, v);
      R && T.children.push(R);
    }
    return T.children.sort((E, R) => E.startTime - R.startTime), T;
  }
  const d = [], g = /* @__PURE__ */ new Set();
  function p(y, v) {
    v.add(y.id), y.children.forEach((_) => p(_, v));
  }
  for (const y of s) {
    u.clear();
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
function co(e) {
  let t = e.endTime;
  for (const n of e.children) {
    const r = co(n);
    r > t && (t = r);
  }
  return t;
}
function Uo(e) {
  const t = [e], n = e.children.filter((a) => a.startTime >= e.endTime);
  if (n.length === 0)
    return t;
  let r = n[0], i = r.startTime, o = co(r);
  for (let a = 1; a < n.length; a++) {
    const c = n[a], l = co(c);
    c.startTime < i ? (r = c, i = c.startTime, o = l) : c.startTime === i && l > o && (r = c, o = l);
  }
  const s = Uo(r);
  return t.push(...s), t;
}
function Ql(e) {
  const t = new Set(e.map((r) => r.id)), n = [];
  for (const r of e)
    for (const i of r.children)
      if (!t.has(i.id)) {
        const o = Uo(i);
        n.push(o);
      }
  return n;
}
function Bl(e, t, n, r) {
  return e < r && n < t;
}
function ac(e, t, n, r) {
  const i = r.find(
    (o) => o.lane === n && Bl(e, t, o.startTime, o.endTime)
  );
  return i ? i.id : null;
}
function Os(e, t, n, r) {
  for (const i of e) {
    const o = ac(i.startTime, i.endTime, t, n);
    if (o)
      return r.get(o), !1;
  }
  return !0;
}
function zi(e, t, n) {
  for (const r of e)
    n.push({
      id: r.id,
      lane: t,
      startTime: r.startTime,
      endTime: r.endTime
    });
}
function Jl(e, t, n, r) {
  const i = [], o = Uo(e.root);
  let s = t;
  const a = 100;
  let c = 0;
  for (; c < a; ) {
    if (s < 0) {
      s = 0, c++;
      continue;
    }
    const w = [...n, ...i];
    if (Os(o, s, w, r)) {
      zi(o, s, i);
      break;
    }
    s++, c++;
  }
  const l = [{ trunk: o, parentLane: s, isAboveParent: null }], u = /* @__PURE__ */ new Map();
  u.set(o[0].id, s);
  let h = 0;
  for (; h < l.length; ) {
    const { trunk: w, parentLane: y, isAboveParent: v } = l[h], _ = v === null, T = Ql(w);
    T.length > 0;
    let M = 1, E = 1, R = _ ? !0 : v;
    for (let F = 0; F < T.length; F++) {
      const j = T[F], Y = j[0].id;
      let P, D = !1;
      for (c = 0; !D && c < a; ) {
        if (R ? P = y + M : P = y - E, P < 0) {
          s++, i.length = 0, zi(o, s, i), l.length = 1, l[0] = { trunk: o, parentLane: s, isAboveParent: null }, u.clear(), u.set(o[0].id, s), h = -1;
          break;
        }
        const I = [...n, ...i];
        if (Os(j, P, I, r)) {
          zi(j, P, i), D = !0, u.set(Y, P);
          const z = P > y;
          l.push({ trunk: j, parentLane: P, isAboveParent: z }), R ? M++ : E++, _ && (R = !R);
        } else
          R ? M++ : E++;
        c++;
      }
    }
    h++;
  }
  const d = i.map((w) => w.lane), g = d.length > 0 ? Math.min(...d) : s, p = d.length > 0 ? Math.max(...d) : s;
  return { placements: i, minLane: g, maxLane: p };
}
function tu(e, t) {
  const n = [], r = Array.from(e.entries()).sort((i, o) => i[1].startTime - o[1].startTime);
  for (const [i, o] of r) {
    let s = 0;
    const a = [...t, ...n];
    for (; ac(o.startTime, o.endTime, s, a); )
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
const eu = {
  name: "Succession-based",
  description: "Periods that succeed each other are placed on the same row",
  layout(e, t = []) {
    if (e.length === 0)
      return [];
    const { trees: n, unconnectedPeriods: r, periodMap: i } = Kl(e, t);
    n.forEach((l, u) => {
    });
    const o = [];
    let s = 0;
    for (let l = 0; l < n.length; l++) {
      const u = n[l], { placements: h, maxLane: d } = Jl(u, s, o, i);
      o.push(...h), s = d + 1;
    }
    const a = tu(r, o);
    o.push(...a);
    const c = o.map((l) => ({
      itemId: l.id,
      lane: l.lane,
      startTime: l.startTime,
      endTime: l.endTime,
      type: "period"
    }));
    return c.forEach((l) => {
    }), c;
  }
};
function cc(e, t) {
  return e < t;
}
function nu(e, t) {
  const n = [0, 1, -1];
  for (const o of n)
    if (!cc(e, t.get(o)))
      return o;
  let r = 0, i = t.get(0);
  for (const o of n) {
    const s = t.get(o);
    s < i && (r = o, i = s);
  }
  return r;
}
function ru(e, t = 0, n = []) {
  const r = [], i = /* @__PURE__ */ new Map();
  for (const u of n)
    i.set(u.itemId, u.lane);
  const o = [], s = [];
  for (const u of e)
    u.relates_to && i.has(u.relates_to) ? o.push(u) : s.push(u);
  const a = /* @__PURE__ */ new Map();
  for (const u of o) {
    const h = i.get(u.relates_to), d = J(u.time);
    a.has(h) || a.set(h, []), a.get(h).push({ event: u, time: d });
  }
  for (const [u, h] of a) {
    h.sort((g, p) => g.time - p.time);
    const d = /* @__PURE__ */ new Map([
      [-1, -1 / 0],
      [0, -1 / 0],
      [1, -1 / 0]
    ]);
    for (const { event: g, time: p } of h) {
      const w = nu(p, d);
      d.set(w, p), r.push({
        itemId: g.id,
        lane: u,
        startTime: p,
        endTime: p,
        type: "event",
        subLane: w
      });
    }
  }
  const c = s.map((u) => {
    const h = J(u.time);
    return {
      id: u.id,
      time: h
    };
  });
  c.sort((u, h) => u.time - h.time);
  const l = [];
  for (const u of c) {
    let h = -1;
    for (let d = 0; d < Math.min(l.length, 3); d++)
      if (!cc(u.time, l[d].endTime)) {
        h = d;
        break;
      }
    if (h === -1 && l.length < 3)
      h = l.length, l.push({ endTime: u.time });
    else if (h === -1) {
      let d = 0, g = l[0].endTime;
      for (let p = 1; p < 3; p++)
        l[p].endTime < g && (d = p, g = l[p].endTime);
      h = d, l[h].endTime = u.time;
    } else
      l[h].endTime = u.time;
    r.push({
      itemId: u.id,
      lane: h + t,
      startTime: u.time,
      endTime: u.time,
      type: "event",
      subLane: h
      // For unrelated events, sub-lane matches their lane index (0, 1, or 2)
    });
  }
  return r;
}
const iu = {
  succession: eu
}, ou = "succession";
function su(e, t, n = ou, r = []) {
  const i = iu[n];
  if (!i)
    throw new Error(`Unknown period layout algorithm: ${n}`);
  const o = i.layout(e, r), a = (o.length > 0 ? Math.max(...o.map((l) => l.lane)) : -1) + 1, c = ru(t, a, o);
  return [...o, ...c];
}
function Pm(e) {
  return e.length === 0 ? 0 : Math.max(...e.map((t) => t.lane)) + 1;
}
function Zr(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function au(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function lc(e) {
  let t, n, r;
  e.length !== 2 ? (t = Zr, n = (a, c) => Zr(e(a), c), r = (a, c) => e(a) - c) : (t = e === Zr || e === au ? e : cu, n = e, r = e);
  function i(a, c, l = 0, u = a.length) {
    if (l < u) {
      if (t(c, c) !== 0) return u;
      do {
        const h = l + u >>> 1;
        n(a[h], c) < 0 ? l = h + 1 : u = h;
      } while (l < u);
    }
    return l;
  }
  function o(a, c, l = 0, u = a.length) {
    if (l < u) {
      if (t(c, c) !== 0) return u;
      do {
        const h = l + u >>> 1;
        n(a[h], c) <= 0 ? l = h + 1 : u = h;
      } while (l < u);
    }
    return l;
  }
  function s(a, c, l = 0, u = a.length) {
    const h = i(a, c, l, u - 1);
    return h > l && r(a[h - 1], c) > -r(a[h], c) ? h - 1 : h;
  }
  return { left: i, center: s, right: o };
}
function cu() {
  return 0;
}
function lu(e) {
  return e === null ? NaN : +e;
}
const uu = lc(Zr), hu = uu.right;
lc(lu).center;
const du = Math.sqrt(50), fu = Math.sqrt(10), mu = Math.sqrt(2);
function si(e, t, n) {
  const r = (t - e) / Math.max(0, n), i = Math.floor(Math.log10(r)), o = r / Math.pow(10, i), s = o >= du ? 10 : o >= fu ? 5 : o >= mu ? 2 : 1;
  let a, c, l;
  return i < 0 ? (l = Math.pow(10, -i) / s, a = Math.round(e * l), c = Math.round(t * l), a / l < e && ++a, c / l > t && --c, l = -l) : (l = Math.pow(10, i) * s, a = Math.round(e / l), c = Math.round(t / l), a * l < e && ++a, c * l > t && --c), c < a && 0.5 <= n && n < 2 ? si(e, t, n * 2) : [a, c, l];
}
function gu(e, t, n) {
  if (t = +t, e = +e, n = +n, !(n > 0)) return [];
  if (e === t) return [e];
  const r = t < e, [i, o, s] = r ? si(t, e, n) : si(e, t, n);
  if (!(o >= i)) return [];
  const a = o - i + 1, c = new Array(a);
  if (r)
    if (s < 0) for (let l = 0; l < a; ++l) c[l] = (o - l) / -s;
    else for (let l = 0; l < a; ++l) c[l] = (o - l) * s;
  else if (s < 0) for (let l = 0; l < a; ++l) c[l] = (i + l) / -s;
  else for (let l = 0; l < a; ++l) c[l] = (i + l) * s;
  return c;
}
function lo(e, t, n) {
  return t = +t, e = +e, n = +n, si(e, t, n)[2];
}
function pu(e, t, n) {
  t = +t, e = +e, n = +n;
  const r = t < e, i = r ? lo(t, e, n) : lo(e, t, n);
  return (r ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
var yu = { value: () => {
} };
function uc() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new qr(n);
}
function qr(e) {
  this._ = e;
}
function wu(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", i = n.indexOf(".");
    if (i >= 0 && (r = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
qr.prototype = uc.prototype = {
  constructor: qr,
  on: function(e, t) {
    var n = this._, r = wu(e + "", n), i, o = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++o < s; ) if ((i = (e = r[o]).type) && (i = vu(n[i], e.name))) return i;
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
    return new qr(e);
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
function vu(e, t) {
  for (var n = 0, r = e.length, i; n < r; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function As(e, t, n) {
  for (var r = 0, i = e.length; r < i; ++r)
    if (e[r].name === t) {
      e[r] = yu, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var uo = "http://www.w3.org/1999/xhtml";
const Ys = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: uo,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Ri(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Ys.hasOwnProperty(t) ? { space: Ys[t], local: e } : e;
}
function bu(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === uo && t.documentElement.namespaceURI === uo ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function _u(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function hc(e) {
  var t = Ri(e);
  return (t.local ? _u : bu)(t);
}
function Tu() {
}
function Fo(e) {
  return e == null ? Tu : function() {
    return this.querySelector(e);
  };
}
function Mu(e) {
  typeof e != "function" && (e = Fo(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var o = t[i], s = o.length, a = r[i] = new Array(s), c, l, u = 0; u < s; ++u)
      (c = o[u]) && (l = e.call(c, c.__data__, u, o)) && ("__data__" in c && (l.__data__ = c.__data__), a[u] = l);
  return new Jt(r, this._parents);
}
function Eu(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function xu() {
  return [];
}
function dc(e) {
  return e == null ? xu : function() {
    return this.querySelectorAll(e);
  };
}
function Du(e) {
  return function() {
    return Eu(e.apply(this, arguments));
  };
}
function Cu(e) {
  typeof e == "function" ? e = Du(e) : e = dc(e);
  for (var t = this._groups, n = t.length, r = [], i = [], o = 0; o < n; ++o)
    for (var s = t[o], a = s.length, c, l = 0; l < a; ++l)
      (c = s[l]) && (r.push(e.call(c, c.__data__, l, s)), i.push(c));
  return new Jt(r, i);
}
function fc(e) {
  return function() {
    return this.matches(e);
  };
}
function mc(e) {
  return function(t) {
    return t.matches(e);
  };
}
var $u = Array.prototype.find;
function ku(e) {
  return function() {
    return $u.call(this.children, e);
  };
}
function Lu() {
  return this.firstElementChild;
}
function Ru(e) {
  return this.select(e == null ? Lu : ku(typeof e == "function" ? e : mc(e)));
}
var Nu = Array.prototype.filter;
function Ou() {
  return Array.from(this.children);
}
function Au(e) {
  return function() {
    return Nu.call(this.children, e);
  };
}
function Yu(e) {
  return this.selectAll(e == null ? Ou : Au(typeof e == "function" ? e : mc(e)));
}
function Iu(e) {
  typeof e != "function" && (e = fc(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var o = t[i], s = o.length, a = r[i] = [], c, l = 0; l < s; ++l)
      (c = o[l]) && e.call(c, c.__data__, l, o) && a.push(c);
  return new Jt(r, this._parents);
}
function gc(e) {
  return new Array(e.length);
}
function Pu() {
  return new Jt(this._enter || this._groups.map(gc), this._parents);
}
function ai(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
ai.prototype = {
  constructor: ai,
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
function Su(e) {
  return function() {
    return e;
  };
}
function zu(e, t, n, r, i, o) {
  for (var s = 0, a, c = t.length, l = o.length; s < l; ++s)
    (a = t[s]) ? (a.__data__ = o[s], r[s] = a) : n[s] = new ai(e, o[s]);
  for (; s < c; ++s)
    (a = t[s]) && (i[s] = a);
}
function Hu(e, t, n, r, i, o, s) {
  var a, c, l = /* @__PURE__ */ new Map(), u = t.length, h = o.length, d = new Array(u), g;
  for (a = 0; a < u; ++a)
    (c = t[a]) && (d[a] = g = s.call(c, c.__data__, a, t) + "", l.has(g) ? i[a] = c : l.set(g, c));
  for (a = 0; a < h; ++a)
    g = s.call(e, o[a], a, o) + "", (c = l.get(g)) ? (r[a] = c, c.__data__ = o[a], l.delete(g)) : n[a] = new ai(e, o[a]);
  for (a = 0; a < u; ++a)
    (c = t[a]) && l.get(d[a]) === c && (i[a] = c);
}
function ju(e) {
  return e.__data__;
}
function Uu(e, t) {
  if (!arguments.length) return Array.from(this, ju);
  var n = t ? Hu : zu, r = this._parents, i = this._groups;
  typeof e != "function" && (e = Su(e));
  for (var o = i.length, s = new Array(o), a = new Array(o), c = new Array(o), l = 0; l < o; ++l) {
    var u = r[l], h = i[l], d = h.length, g = Fu(e.call(u, u && u.__data__, l, r)), p = g.length, w = a[l] = new Array(p), y = s[l] = new Array(p), v = c[l] = new Array(d);
    n(u, h, w, y, v, g, t);
    for (var _ = 0, T = 0, M, E; _ < p; ++_)
      if (M = w[_]) {
        for (_ >= T && (T = _ + 1); !(E = y[T]) && ++T < p; ) ;
        M._next = E || null;
      }
  }
  return s = new Jt(s, r), s._enter = a, s._exit = c, s;
}
function Fu(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Zu() {
  return new Jt(this._exit || this._groups.map(gc), this._parents);
}
function qu(e, t, n) {
  var r = this.enter(), i = this, o = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? o.remove() : n(o), r && i ? r.merge(i).order() : i;
}
function Xu(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, o = r.length, s = Math.min(i, o), a = new Array(i), c = 0; c < s; ++c)
    for (var l = n[c], u = r[c], h = l.length, d = a[c] = new Array(h), g, p = 0; p < h; ++p)
      (g = l[p] || u[p]) && (d[p] = g);
  for (; c < i; ++c)
    a[c] = n[c];
  return new Jt(a, this._parents);
}
function Wu() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], i = r.length - 1, o = r[i], s; --i >= 0; )
      (s = r[i]) && (o && s.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(s, o), o = s);
  return this;
}
function Gu(e) {
  e || (e = Vu);
  function t(h, d) {
    return h && d ? e(h.__data__, d.__data__) : !h - !d;
  }
  for (var n = this._groups, r = n.length, i = new Array(r), o = 0; o < r; ++o) {
    for (var s = n[o], a = s.length, c = i[o] = new Array(a), l, u = 0; u < a; ++u)
      (l = s[u]) && (c[u] = l);
    c.sort(t);
  }
  return new Jt(i, this._parents).order();
}
function Vu(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Ku() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Qu() {
  return Array.from(this);
}
function Bu() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], i = 0, o = r.length; i < o; ++i) {
      var s = r[i];
      if (s) return s;
    }
  return null;
}
function Ju() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function th() {
  return !this.node();
}
function eh(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var i = t[n], o = 0, s = i.length, a; o < s; ++o)
      (a = i[o]) && e.call(a, a.__data__, o, i);
  return this;
}
function nh(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function rh(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function ih(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function oh(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function sh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function ah(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function ch(e, t) {
  var n = Ri(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? rh : nh : typeof t == "function" ? n.local ? ah : sh : n.local ? oh : ih)(n, t));
}
function pc(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function lh(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function uh(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function hh(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function dh(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? lh : typeof t == "function" ? hh : uh)(e, t, n ?? "")) : Dn(this.node(), e);
}
function Dn(e, t) {
  return e.style.getPropertyValue(t) || pc(e).getComputedStyle(e, null).getPropertyValue(t);
}
function fh(e) {
  return function() {
    delete this[e];
  };
}
function mh(e, t) {
  return function() {
    this[e] = t;
  };
}
function gh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function ph(e, t) {
  return arguments.length > 1 ? this.each((t == null ? fh : typeof t == "function" ? gh : mh)(e, t)) : this.node()[e];
}
function yc(e) {
  return e.trim().split(/^|\s+/);
}
function Zo(e) {
  return e.classList || new wc(e);
}
function wc(e) {
  this._node = e, this._names = yc(e.getAttribute("class") || "");
}
wc.prototype = {
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
function vc(e, t) {
  for (var n = Zo(e), r = -1, i = t.length; ++r < i; ) n.add(t[r]);
}
function bc(e, t) {
  for (var n = Zo(e), r = -1, i = t.length; ++r < i; ) n.remove(t[r]);
}
function yh(e) {
  return function() {
    vc(this, e);
  };
}
function wh(e) {
  return function() {
    bc(this, e);
  };
}
function vh(e, t) {
  return function() {
    (t.apply(this, arguments) ? vc : bc)(this, e);
  };
}
function bh(e, t) {
  var n = yc(e + "");
  if (arguments.length < 2) {
    for (var r = Zo(this.node()), i = -1, o = n.length; ++i < o; ) if (!r.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? vh : t ? yh : wh)(n, t));
}
function _h() {
  this.textContent = "";
}
function Th(e) {
  return function() {
    this.textContent = e;
  };
}
function Mh(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Eh(e) {
  return arguments.length ? this.each(e == null ? _h : (typeof e == "function" ? Mh : Th)(e)) : this.node().textContent;
}
function xh() {
  this.innerHTML = "";
}
function Dh(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Ch(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function $h(e) {
  return arguments.length ? this.each(e == null ? xh : (typeof e == "function" ? Ch : Dh)(e)) : this.node().innerHTML;
}
function kh() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Lh() {
  return this.each(kh);
}
function Rh() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Nh() {
  return this.each(Rh);
}
function Oh(e) {
  var t = typeof e == "function" ? e : hc(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Ah() {
  return null;
}
function Yh(e, t) {
  var n = typeof e == "function" ? e : hc(e), r = t == null ? Ah : typeof t == "function" ? t : Fo(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function Ih() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Ph() {
  return this.each(Ih);
}
function Sh() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function zh() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Hh(e) {
  return this.select(e ? zh : Sh);
}
function jh(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Uh(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Fh(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function Zh(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, i = t.length, o; n < i; ++n)
        o = t[n], (!e.type || o.type === e.type) && o.name === e.name ? this.removeEventListener(o.type, o.listener, o.options) : t[++r] = o;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function qh(e, t, n) {
  return function() {
    var r = this.__on, i, o = Uh(t);
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
function Xh(e, t, n) {
  var r = Fh(e + ""), i, o = r.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var c = 0, l = a.length, u; c < l; ++c)
        for (i = 0, u = a[c]; i < o; ++i)
          if ((s = r[i]).type === u.type && s.name === u.name)
            return u.value;
    }
    return;
  }
  for (a = t ? qh : Zh, i = 0; i < o; ++i) this.each(a(r[i], t, n));
  return this;
}
function _c(e, t, n) {
  var r = pc(e), i = r.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Wh(e, t) {
  return function() {
    return _c(this, e, t);
  };
}
function Gh(e, t) {
  return function() {
    return _c(this, e, t.apply(this, arguments));
  };
}
function Vh(e, t) {
  return this.each((typeof t == "function" ? Gh : Wh)(e, t));
}
function* Kh() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], i = 0, o = r.length, s; i < o; ++i)
      (s = r[i]) && (yield s);
}
var Qh = [null];
function Jt(e, t) {
  this._groups = e, this._parents = t;
}
function Ar() {
  return new Jt([[document.documentElement]], Qh);
}
function Bh() {
  return this;
}
Jt.prototype = Ar.prototype = {
  constructor: Jt,
  select: Mu,
  selectAll: Cu,
  selectChild: Ru,
  selectChildren: Yu,
  filter: Iu,
  data: Uu,
  enter: Pu,
  exit: Zu,
  join: qu,
  merge: Xu,
  selection: Bh,
  order: Wu,
  sort: Gu,
  call: Ku,
  nodes: Qu,
  node: Bu,
  size: Ju,
  empty: th,
  each: eh,
  attr: ch,
  style: dh,
  property: ph,
  classed: bh,
  text: Eh,
  html: $h,
  raise: Lh,
  lower: Nh,
  append: Oh,
  insert: Yh,
  remove: Ph,
  clone: Hh,
  datum: jh,
  on: Xh,
  dispatch: Vh,
  [Symbol.iterator]: Kh
};
function qo(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Tc(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function Yr() {
}
var mr = 0.7, ci = 1 / mr, yn = "\\s*([+-]?\\d+)\\s*", gr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", le = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Jh = /^#([0-9a-f]{3,8})$/, td = new RegExp(`^rgb\\(${yn},${yn},${yn}\\)$`), ed = new RegExp(`^rgb\\(${le},${le},${le}\\)$`), nd = new RegExp(`^rgba\\(${yn},${yn},${yn},${gr}\\)$`), rd = new RegExp(`^rgba\\(${le},${le},${le},${gr}\\)$`), id = new RegExp(`^hsl\\(${gr},${le},${le}\\)$`), od = new RegExp(`^hsla\\(${gr},${le},${le},${gr}\\)$`), Is = {
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
qo(Yr, tn, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ps,
  // Deprecated! Use color.formatHex.
  formatHex: Ps,
  formatHex8: sd,
  formatHsl: ad,
  formatRgb: Ss,
  toString: Ss
});
function Ps() {
  return this.rgb().formatHex();
}
function sd() {
  return this.rgb().formatHex8();
}
function ad() {
  return Mc(this).formatHsl();
}
function Ss() {
  return this.rgb().formatRgb();
}
function tn(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Jh.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? zs(t) : n === 3 ? new Ot(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Pr(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Pr(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = td.exec(e)) ? new Ot(t[1], t[2], t[3], 1) : (t = ed.exec(e)) ? new Ot(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = nd.exec(e)) ? Pr(t[1], t[2], t[3], t[4]) : (t = rd.exec(e)) ? Pr(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = id.exec(e)) ? Us(t[1], t[2] / 100, t[3] / 100, 1) : (t = od.exec(e)) ? Us(t[1], t[2] / 100, t[3] / 100, t[4]) : Is.hasOwnProperty(e) ? zs(Is[e]) : e === "transparent" ? new Ot(NaN, NaN, NaN, 0) : null;
}
function zs(e) {
  return new Ot(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Pr(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Ot(e, t, n, r);
}
function cd(e) {
  return e instanceof Yr || (e = tn(e)), e ? (e = e.rgb(), new Ot(e.r, e.g, e.b, e.opacity)) : new Ot();
}
function ho(e, t, n, r) {
  return arguments.length === 1 ? cd(e) : new Ot(e, t, n, r ?? 1);
}
function Ot(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
qo(Ot, ho, Tc(Yr, {
  brighter(e) {
    return e = e == null ? ci : Math.pow(ci, e), new Ot(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? mr : Math.pow(mr, e), new Ot(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ot(We(this.r), We(this.g), We(this.b), li(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Hs,
  // Deprecated! Use color.formatHex.
  formatHex: Hs,
  formatHex8: ld,
  formatRgb: js,
  toString: js
}));
function Hs() {
  return `#${Ze(this.r)}${Ze(this.g)}${Ze(this.b)}`;
}
function ld() {
  return `#${Ze(this.r)}${Ze(this.g)}${Ze(this.b)}${Ze((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function js() {
  const e = li(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${We(this.r)}, ${We(this.g)}, ${We(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function li(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function We(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Ze(e) {
  return e = We(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Us(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Qt(e, t, n, r);
}
function Mc(e) {
  if (e instanceof Qt) return new Qt(e.h, e.s, e.l, e.opacity);
  if (e instanceof Yr || (e = tn(e)), !e) return new Qt();
  if (e instanceof Qt) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), o = Math.max(t, n, r), s = NaN, a = o - i, c = (o + i) / 2;
  return a ? (t === o ? s = (n - r) / a + (n < r) * 6 : n === o ? s = (r - t) / a + 2 : s = (t - n) / a + 4, a /= c < 0.5 ? o + i : 2 - o - i, s *= 60) : a = c > 0 && c < 1 ? 0 : s, new Qt(s, a, c, e.opacity);
}
function ud(e, t, n, r) {
  return arguments.length === 1 ? Mc(e) : new Qt(e, t, n, r ?? 1);
}
function Qt(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
qo(Qt, ud, Tc(Yr, {
  brighter(e) {
    return e = e == null ? ci : Math.pow(ci, e), new Qt(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? mr : Math.pow(mr, e), new Qt(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - r;
    return new Ot(
      Hi(e >= 240 ? e - 240 : e + 120, i, r),
      Hi(e, i, r),
      Hi(e < 120 ? e + 240 : e - 120, i, r),
      this.opacity
    );
  },
  clamp() {
    return new Qt(Fs(this.h), Sr(this.s), Sr(this.l), li(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = li(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Fs(this.h)}, ${Sr(this.s) * 100}%, ${Sr(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Fs(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Sr(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Hi(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Xo = (e) => () => e;
function hd(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function dd(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function fd(e) {
  return (e = +e) == 1 ? Ec : function(t, n) {
    return n - t ? dd(t, n, e) : Xo(isNaN(t) ? n : t);
  };
}
function Ec(e, t) {
  var n = t - e;
  return n ? hd(e, n) : Xo(isNaN(e) ? t : e);
}
const ui = (function e(t) {
  var n = fd(t);
  function r(i, o) {
    var s = n((i = ho(i)).r, (o = ho(o)).r), a = n(i.g, o.g), c = n(i.b, o.b), l = Ec(i.opacity, o.opacity);
    return function(u) {
      return i.r = s(u), i.g = a(u), i.b = c(u), i.opacity = l(u), i + "";
    };
  }
  return r.gamma = e, r;
})(1);
function md(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
  return function(o) {
    for (i = 0; i < n; ++i) r[i] = e[i] * (1 - o) + t[i] * o;
    return r;
  };
}
function gd(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function pd(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = new Array(r), o = new Array(n), s;
  for (s = 0; s < r; ++s) i[s] = Wo(e[s], t[s]);
  for (; s < n; ++s) o[s] = t[s];
  return function(a) {
    for (s = 0; s < r; ++s) o[s] = i[s](a);
    return o;
  };
}
function yd(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Kt(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function wd(e, t) {
  var n = {}, r = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = Wo(e[i], t[i]) : r[i] = t[i];
  return function(o) {
    for (i in n) r[i] = n[i](o);
    return r;
  };
}
var fo = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, ji = new RegExp(fo.source, "g");
function vd(e) {
  return function() {
    return e;
  };
}
function bd(e) {
  return function(t) {
    return e(t) + "";
  };
}
function xc(e, t) {
  var n = fo.lastIndex = ji.lastIndex = 0, r, i, o, s = -1, a = [], c = [];
  for (e = e + "", t = t + ""; (r = fo.exec(e)) && (i = ji.exec(t)); )
    (o = i.index) > n && (o = t.slice(n, o), a[s] ? a[s] += o : a[++s] = o), (r = r[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, c.push({ i: s, x: Kt(r, i) })), n = ji.lastIndex;
  return n < t.length && (o = t.slice(n), a[s] ? a[s] += o : a[++s] = o), a.length < 2 ? c[0] ? bd(c[0].x) : vd(t) : (t = c.length, function(l) {
    for (var u = 0, h; u < t; ++u) a[(h = c[u]).i] = h.x(l);
    return a.join("");
  });
}
function Wo(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Xo(t) : (n === "number" ? Kt : n === "string" ? (r = tn(t)) ? (t = r, ui) : xc : t instanceof tn ? ui : t instanceof Date ? yd : gd(t) ? md : Array.isArray(t) ? pd : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? wd : Kt)(e, t);
}
function _d(e, t) {
  return e = +e, t = +t, function(n) {
    return Math.round(e * (1 - n) + t * n);
  };
}
var Zs = 180 / Math.PI, mo = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Dc(e, t, n, r, i, o) {
  var s, a, c;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (c = e * n + t * r) && (n -= e * c, r -= t * c), (a = Math.sqrt(n * n + r * r)) && (n /= a, r /= a, c /= a), e * r < t * n && (e = -e, t = -t, c = -c, s = -s), {
    translateX: i,
    translateY: o,
    rotate: Math.atan2(t, e) * Zs,
    skewX: Math.atan(c) * Zs,
    scaleX: s,
    scaleY: a
  };
}
var zr;
function Td(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? mo : Dc(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Md(e) {
  return e == null || (zr || (zr = document.createElementNS("http://www.w3.org/2000/svg", "g")), zr.setAttribute("transform", e), !(e = zr.transform.baseVal.consolidate())) ? mo : (e = e.matrix, Dc(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Cc(e, t, n, r) {
  function i(l) {
    return l.length ? l.pop() + " " : "";
  }
  function o(l, u, h, d, g, p) {
    if (l !== h || u !== d) {
      var w = g.push("translate(", null, t, null, n);
      p.push({ i: w - 4, x: Kt(l, h) }, { i: w - 2, x: Kt(u, d) });
    } else (h || d) && g.push("translate(" + h + t + d + n);
  }
  function s(l, u, h, d) {
    l !== u ? (l - u > 180 ? u += 360 : u - l > 180 && (l += 360), d.push({ i: h.push(i(h) + "rotate(", null, r) - 2, x: Kt(l, u) })) : u && h.push(i(h) + "rotate(" + u + r);
  }
  function a(l, u, h, d) {
    l !== u ? d.push({ i: h.push(i(h) + "skewX(", null, r) - 2, x: Kt(l, u) }) : u && h.push(i(h) + "skewX(" + u + r);
  }
  function c(l, u, h, d, g, p) {
    if (l !== h || u !== d) {
      var w = g.push(i(g) + "scale(", null, ",", null, ")");
      p.push({ i: w - 4, x: Kt(l, h) }, { i: w - 2, x: Kt(u, d) });
    } else (h !== 1 || d !== 1) && g.push(i(g) + "scale(" + h + "," + d + ")");
  }
  return function(l, u) {
    var h = [], d = [];
    return l = e(l), u = e(u), o(l.translateX, l.translateY, u.translateX, u.translateY, h, d), s(l.rotate, u.rotate, h, d), a(l.skewX, u.skewX, h, d), c(l.scaleX, l.scaleY, u.scaleX, u.scaleY, h, d), l = u = null, function(g) {
      for (var p = -1, w = d.length, y; ++p < w; ) h[(y = d[p]).i] = y.x(g);
      return h.join("");
    };
  };
}
var Ed = Cc(Td, "px, ", "px)", "deg)"), xd = Cc(Md, ", ", ")", ")"), Cn = 0, Wn = 0, Sn = 0, $c = 1e3, hi, Gn, di = 0, en = 0, Ni = 0, pr = typeof performance == "object" && performance.now ? performance : Date, kc = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Go() {
  return en || (kc(Dd), en = pr.now() + Ni);
}
function Dd() {
  en = 0;
}
function fi() {
  this._call = this._time = this._next = null;
}
fi.prototype = Lc.prototype = {
  constructor: fi,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Go() : +n) + (t == null ? 0 : +t), !this._next && Gn !== this && (Gn ? Gn._next = this : hi = this, Gn = this), this._call = e, this._time = n, go();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, go());
  }
};
function Lc(e, t, n) {
  var r = new fi();
  return r.restart(e, t, n), r;
}
function Cd() {
  Go(), ++Cn;
  for (var e = hi, t; e; )
    (t = en - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Cn;
}
function qs() {
  en = (di = pr.now()) + Ni, Cn = Wn = 0;
  try {
    Cd();
  } finally {
    Cn = 0, kd(), en = 0;
  }
}
function $d() {
  var e = pr.now(), t = e - di;
  t > $c && (Ni -= t, di = e);
}
function kd() {
  for (var e, t = hi, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : hi = n);
  Gn = e, go(r);
}
function go(e) {
  if (!Cn) {
    Wn && (Wn = clearTimeout(Wn));
    var t = e - en;
    t > 24 ? (e < 1 / 0 && (Wn = setTimeout(qs, e - pr.now() - Ni)), Sn && (Sn = clearInterval(Sn))) : (Sn || (di = pr.now(), Sn = setInterval($d, $c)), Cn = 1, kc(qs));
  }
}
function Xs(e, t, n) {
  var r = new fi();
  return t = t == null ? 0 : +t, r.restart((i) => {
    r.stop(), e(i + t);
  }, t, n), r;
}
var Ld = uc("start", "end", "cancel", "interrupt"), Rd = [], Rc = 0, Ws = 1, po = 2, Xr = 3, Gs = 4, yo = 5, Wr = 6;
function Oi(e, t, n, r, i, o) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  Nd(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Ld,
    tween: Rd,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: Rc
  });
}
function Vo(e, t) {
  var n = te(e, t);
  if (n.state > Rc) throw new Error("too late; already scheduled");
  return n;
}
function me(e, t) {
  var n = te(e, t);
  if (n.state > Xr) throw new Error("too late; already running");
  return n;
}
function te(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function Nd(e, t, n) {
  var r = e.__transition, i;
  r[t] = n, n.timer = Lc(o, 0, n.time);
  function o(l) {
    n.state = Ws, n.timer.restart(s, n.delay, n.time), n.delay <= l && s(l - n.delay);
  }
  function s(l) {
    var u, h, d, g;
    if (n.state !== Ws) return c();
    for (u in r)
      if (g = r[u], g.name === n.name) {
        if (g.state === Xr) return Xs(s);
        g.state === Gs ? (g.state = Wr, g.timer.stop(), g.on.call("interrupt", e, e.__data__, g.index, g.group), delete r[u]) : +u < t && (g.state = Wr, g.timer.stop(), g.on.call("cancel", e, e.__data__, g.index, g.group), delete r[u]);
      }
    if (Xs(function() {
      n.state === Xr && (n.state = Gs, n.timer.restart(a, n.delay, n.time), a(l));
    }), n.state = po, n.on.call("start", e, e.__data__, n.index, n.group), n.state === po) {
      for (n.state = Xr, i = new Array(d = n.tween.length), u = 0, h = -1; u < d; ++u)
        (g = n.tween[u].value.call(e, e.__data__, n.index, n.group)) && (i[++h] = g);
      i.length = h + 1;
    }
  }
  function a(l) {
    for (var u = l < n.duration ? n.ease.call(null, l / n.duration) : (n.timer.restart(c), n.state = yo, 1), h = -1, d = i.length; ++h < d; )
      i[h].call(e, u);
    n.state === yo && (n.on.call("end", e, e.__data__, n.index, n.group), c());
  }
  function c() {
    n.state = Wr, n.timer.stop(), delete r[t];
    for (var l in r) return;
    delete e.__transition;
  }
}
function Od(e, t) {
  var n = e.__transition, r, i, o = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        o = !1;
        continue;
      }
      i = r.state > po && r.state < yo, r.state = Wr, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    o && delete e.__transition;
  }
}
function Ad(e) {
  return this.each(function() {
    Od(this, e);
  });
}
function Yd(e, t) {
  var n, r;
  return function() {
    var i = me(this, e), o = i.tween;
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
function Id(e, t, n) {
  var r, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var o = me(this, e), s = o.tween;
    if (s !== r) {
      i = (r = s).slice();
      for (var a = { name: t, value: n }, c = 0, l = i.length; c < l; ++c)
        if (i[c].name === t) {
          i[c] = a;
          break;
        }
      c === l && i.push(a);
    }
    o.tween = i;
  };
}
function Pd(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = te(this.node(), n).tween, i = 0, o = r.length, s; i < o; ++i)
      if ((s = r[i]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? Yd : Id)(n, e, t));
}
function Ko(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var i = me(this, r);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return te(i, r).value[t];
  };
}
function Nc(e, t) {
  var n;
  return (typeof t == "number" ? Kt : t instanceof tn ? ui : (n = tn(t)) ? (t = n, ui) : xc)(e, t);
}
function Sd(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function zd(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Hd(e, t, n) {
  var r, i = n + "", o;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === r ? o : o = t(r = s, n);
  };
}
function jd(e, t, n) {
  var r, i = n + "", o;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === r ? o : o = t(r = s, n);
  };
}
function Ud(e, t, n) {
  var r, i, o;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), c = a + "", s === c ? null : s === r && c === i ? o : (i = c, o = t(r = s, a)));
  };
}
function Fd(e, t, n) {
  var r, i, o;
  return function() {
    var s, a = n(this), c;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), c = a + "", s === c ? null : s === r && c === i ? o : (i = c, o = t(r = s, a)));
  };
}
function Zd(e, t) {
  var n = Ri(e), r = n === "transform" ? xd : Nc;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Fd : Ud)(n, r, Ko(this, "attr." + e, t)) : t == null ? (n.local ? zd : Sd)(n) : (n.local ? jd : Hd)(n, r, t));
}
function qd(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function Xd(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Wd(e, t) {
  var n, r;
  function i() {
    var o = t.apply(this, arguments);
    return o !== r && (n = (r = o) && Xd(e, o)), n;
  }
  return i._value = t, i;
}
function Gd(e, t) {
  var n, r;
  function i() {
    var o = t.apply(this, arguments);
    return o !== r && (n = (r = o) && qd(e, o)), n;
  }
  return i._value = t, i;
}
function Vd(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = Ri(e);
  return this.tween(n, (r.local ? Wd : Gd)(r, t));
}
function Kd(e, t) {
  return function() {
    Vo(this, e).delay = +t.apply(this, arguments);
  };
}
function Qd(e, t) {
  return t = +t, function() {
    Vo(this, e).delay = t;
  };
}
function Bd(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Kd : Qd)(t, e)) : te(this.node(), t).delay;
}
function Jd(e, t) {
  return function() {
    me(this, e).duration = +t.apply(this, arguments);
  };
}
function tf(e, t) {
  return t = +t, function() {
    me(this, e).duration = t;
  };
}
function ef(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Jd : tf)(t, e)) : te(this.node(), t).duration;
}
function nf(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    me(this, e).ease = t;
  };
}
function rf(e) {
  var t = this._id;
  return arguments.length ? this.each(nf(t, e)) : te(this.node(), t).ease;
}
function of(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    me(this, e).ease = n;
  };
}
function sf(e) {
  if (typeof e != "function") throw new Error();
  return this.each(of(this._id, e));
}
function af(e) {
  typeof e != "function" && (e = fc(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var o = t[i], s = o.length, a = r[i] = [], c, l = 0; l < s; ++l)
      (c = o[l]) && e.call(c, c.__data__, l, o) && a.push(c);
  return new $e(r, this._parents, this._name, this._id);
}
function cf(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, i = n.length, o = Math.min(r, i), s = new Array(r), a = 0; a < o; ++a)
    for (var c = t[a], l = n[a], u = c.length, h = s[a] = new Array(u), d, g = 0; g < u; ++g)
      (d = c[g] || l[g]) && (h[g] = d);
  for (; a < r; ++a)
    s[a] = t[a];
  return new $e(s, this._parents, this._name, this._id);
}
function lf(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function uf(e, t, n) {
  var r, i, o = lf(t) ? Vo : me;
  return function() {
    var s = o(this, e), a = s.on;
    a !== r && (i = (r = a).copy()).on(t, n), s.on = i;
  };
}
function hf(e, t) {
  var n = this._id;
  return arguments.length < 2 ? te(this.node(), n).on.on(e) : this.each(uf(n, e, t));
}
function df(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function ff() {
  return this.on("end.remove", df(this._id));
}
function mf(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Fo(e));
  for (var r = this._groups, i = r.length, o = new Array(i), s = 0; s < i; ++s)
    for (var a = r[s], c = a.length, l = o[s] = new Array(c), u, h, d = 0; d < c; ++d)
      (u = a[d]) && (h = e.call(u, u.__data__, d, a)) && ("__data__" in u && (h.__data__ = u.__data__), l[d] = h, Oi(l[d], t, n, d, l, te(u, n)));
  return new $e(o, this._parents, t, n);
}
function gf(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = dc(e));
  for (var r = this._groups, i = r.length, o = [], s = [], a = 0; a < i; ++a)
    for (var c = r[a], l = c.length, u, h = 0; h < l; ++h)
      if (u = c[h]) {
        for (var d = e.call(u, u.__data__, h, c), g, p = te(u, n), w = 0, y = d.length; w < y; ++w)
          (g = d[w]) && Oi(g, t, n, w, d, p);
        o.push(d), s.push(u);
      }
  return new $e(o, s, t, n);
}
var pf = Ar.prototype.constructor;
function yf() {
  return new pf(this._groups, this._parents);
}
function wf(e, t) {
  var n, r, i;
  return function() {
    var o = Dn(this, e), s = (this.style.removeProperty(e), Dn(this, e));
    return o === s ? null : o === n && s === r ? i : i = t(n = o, r = s);
  };
}
function Oc(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function vf(e, t, n) {
  var r, i = n + "", o;
  return function() {
    var s = Dn(this, e);
    return s === i ? null : s === r ? o : o = t(r = s, n);
  };
}
function bf(e, t, n) {
  var r, i, o;
  return function() {
    var s = Dn(this, e), a = n(this), c = a + "";
    return a == null && (c = a = (this.style.removeProperty(e), Dn(this, e))), s === c ? null : s === r && c === i ? o : (i = c, o = t(r = s, a));
  };
}
function _f(e, t) {
  var n, r, i, o = "style." + t, s = "end." + o, a;
  return function() {
    var c = me(this, e), l = c.on, u = c.value[o] == null ? a || (a = Oc(t)) : void 0;
    (l !== n || i !== u) && (r = (n = l).copy()).on(s, i = u), c.on = r;
  };
}
function Tf(e, t, n) {
  var r = (e += "") == "transform" ? Ed : Nc;
  return t == null ? this.styleTween(e, wf(e, r)).on("end.style." + e, Oc(e)) : typeof t == "function" ? this.styleTween(e, bf(e, r, Ko(this, "style." + e, t))).each(_f(this._id, e)) : this.styleTween(e, vf(e, r, t), n).on("end.style." + e, null);
}
function Mf(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function Ef(e, t, n) {
  var r, i;
  function o() {
    var s = t.apply(this, arguments);
    return s !== i && (r = (i = s) && Mf(e, s, n)), r;
  }
  return o._value = t, o;
}
function xf(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, Ef(e, t, n ?? ""));
}
function Df(e) {
  return function() {
    this.textContent = e;
  };
}
function Cf(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function $f(e) {
  return this.tween("text", typeof e == "function" ? Cf(Ko(this, "text", e)) : Df(e == null ? "" : e + ""));
}
function kf(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Lf(e) {
  var t, n;
  function r() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && kf(i)), t;
  }
  return r._value = e, r;
}
function Rf(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, Lf(e));
}
function Nf() {
  for (var e = this._name, t = this._id, n = Ac(), r = this._groups, i = r.length, o = 0; o < i; ++o)
    for (var s = r[o], a = s.length, c, l = 0; l < a; ++l)
      if (c = s[l]) {
        var u = te(c, t);
        Oi(c, e, n, l, s, {
          time: u.time + u.delay + u.duration,
          delay: 0,
          duration: u.duration,
          ease: u.ease
        });
      }
  return new $e(r, this._parents, e, n);
}
function Of() {
  var e, t, n = this, r = n._id, i = n.size();
  return new Promise(function(o, s) {
    var a = { value: s }, c = { value: function() {
      --i === 0 && o();
    } };
    n.each(function() {
      var l = me(this, r), u = l.on;
      u !== e && (t = (e = u).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(c)), l.on = t;
    }), i === 0 && o();
  });
}
var Af = 0;
function $e(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Ac() {
  return ++Af;
}
var pe = Ar.prototype;
$e.prototype = {
  constructor: $e,
  select: mf,
  selectAll: gf,
  selectChild: pe.selectChild,
  selectChildren: pe.selectChildren,
  filter: af,
  merge: cf,
  selection: yf,
  transition: Nf,
  call: pe.call,
  nodes: pe.nodes,
  node: pe.node,
  size: pe.size,
  empty: pe.empty,
  each: pe.each,
  on: hf,
  attr: Zd,
  attrTween: Vd,
  style: Tf,
  styleTween: xf,
  text: $f,
  textTween: Rf,
  remove: ff,
  tween: Pd,
  delay: Bd,
  duration: ef,
  ease: rf,
  easeVarying: sf,
  end: Of,
  [Symbol.iterator]: pe[Symbol.iterator]
};
function Yf(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var If = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Yf
};
function Pf(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function Sf(e) {
  var t, n;
  e instanceof $e ? (t = e._id, e = e._name) : (t = Ac(), (n = If).time = Go(), e = e == null ? null : e + "");
  for (var r = this._groups, i = r.length, o = 0; o < i; ++o)
    for (var s = r[o], a = s.length, c, l = 0; l < a; ++l)
      (c = s[l]) && Oi(c, e, t, l, s, n || Pf(c, t));
  return new $e(r, this._parents, e, t);
}
Ar.prototype.interrupt = Ad;
Ar.prototype.transition = Sf;
const wo = Math.PI, vo = 2 * wo, Ue = 1e-6, zf = vo - Ue;
function Yc(e) {
  this._ += e[0];
  for (let t = 1, n = e.length; t < n; ++t)
    this._ += arguments[t] + e[t];
}
function Hf(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return Yc;
  const n = 10 ** t;
  return function(r) {
    this._ += r[0];
    for (let i = 1, o = r.length; i < o; ++i)
      this._ += Math.round(arguments[i] * n) / n + r[i];
  };
}
class jf {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? Yc : Hf(t);
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
    let s = this._x1, a = this._y1, c = r - t, l = i - n, u = s - t, h = a - n, d = u * u + h * h;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = n}`;
    else if (d > Ue) if (!(Math.abs(h * c - l * u) > Ue) || !o)
      this._append`L${this._x1 = t},${this._y1 = n}`;
    else {
      let g = r - s, p = i - a, w = c * c + l * l, y = g * g + p * p, v = Math.sqrt(w), _ = Math.sqrt(d), T = o * Math.tan((wo - Math.acos((w + d - y) / (2 * v * _))) / 2), M = T / _, E = T / v;
      Math.abs(M - 1) > Ue && this._append`L${t + M * u},${n + M * h}`, this._append`A${o},${o},0,0,${+(h * g > u * p)},${this._x1 = t + E * c},${this._y1 = n + E * l}`;
    }
  }
  arc(t, n, r, i, o, s) {
    if (t = +t, n = +n, r = +r, s = !!s, r < 0) throw new Error(`negative radius: ${r}`);
    let a = r * Math.cos(i), c = r * Math.sin(i), l = t + a, u = n + c, h = 1 ^ s, d = s ? i - o : o - i;
    this._x1 === null ? this._append`M${l},${u}` : (Math.abs(this._x1 - l) > Ue || Math.abs(this._y1 - u) > Ue) && this._append`L${l},${u}`, r && (d < 0 && (d = d % vo + vo), d > zf ? this._append`A${r},${r},0,1,${h},${t - a},${n - c}A${r},${r},0,1,${h},${this._x1 = l},${this._y1 = u}` : d > Ue && this._append`A${r},${r},0,${+(d >= wo)},${h},${this._x1 = t + r * Math.cos(o)},${this._y1 = n + r * Math.sin(o)}`);
  }
  rect(t, n, r, i) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +n}h${r = +r}v${+i}h${-r}Z`;
  }
  toString() {
    return this._;
  }
}
function Uf(e) {
  return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10);
}
function mi(e, t) {
  if ((n = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0) return null;
  var n, r = e.slice(0, n);
  return [
    r.length > 1 ? r[0] + r.slice(2) : r,
    +e.slice(n + 1)
  ];
}
function $n(e) {
  return e = mi(Math.abs(e)), e ? e[1] : NaN;
}
function Ff(e, t) {
  return function(n, r) {
    for (var i = n.length, o = [], s = 0, a = e[0], c = 0; i > 0 && a > 0 && (c + a + 1 > r && (a = Math.max(1, r - c)), o.push(n.substring(i -= a, i + a)), !((c += a + 1) > r)); )
      a = e[s = (s + 1) % e.length];
    return o.reverse().join(t);
  };
}
function Zf(e) {
  return function(t) {
    return t.replace(/[0-9]/g, function(n) {
      return e[+n];
    });
  };
}
var qf = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function gi(e) {
  if (!(t = qf.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new Qo({
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
gi.prototype = Qo.prototype;
function Qo(e) {
  this.fill = e.fill === void 0 ? " " : e.fill + "", this.align = e.align === void 0 ? ">" : e.align + "", this.sign = e.sign === void 0 ? "-" : e.sign + "", this.symbol = e.symbol === void 0 ? "" : e.symbol + "", this.zero = !!e.zero, this.width = e.width === void 0 ? void 0 : +e.width, this.comma = !!e.comma, this.precision = e.precision === void 0 ? void 0 : +e.precision, this.trim = !!e.trim, this.type = e.type === void 0 ? "" : e.type + "";
}
Qo.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};
function Xf(e) {
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
var Ic;
function Wf(e, t) {
  var n = mi(e, t);
  if (!n) return e + "";
  var r = n[0], i = n[1], o = i - (Ic = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1, s = r.length;
  return o === s ? r : o > s ? r + new Array(o - s + 1).join("0") : o > 0 ? r.slice(0, o) + "." + r.slice(o) : "0." + new Array(1 - o).join("0") + mi(e, Math.max(0, t + o - 1))[0];
}
function Vs(e, t) {
  var n = mi(e, t);
  if (!n) return e + "";
  var r = n[0], i = n[1];
  return i < 0 ? "0." + new Array(-i).join("0") + r : r.length > i + 1 ? r.slice(0, i + 1) + "." + r.slice(i + 1) : r + new Array(i - r.length + 2).join("0");
}
const Ks = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: Uf,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => Vs(e * 100, t),
  r: Vs,
  s: Wf,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16)
};
function Qs(e) {
  return e;
}
var Bs = Array.prototype.map, Js = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function Gf(e) {
  var t = e.grouping === void 0 || e.thousands === void 0 ? Qs : Ff(Bs.call(e.grouping, Number), e.thousands + ""), n = e.currency === void 0 ? "" : e.currency[0] + "", r = e.currency === void 0 ? "" : e.currency[1] + "", i = e.decimal === void 0 ? "." : e.decimal + "", o = e.numerals === void 0 ? Qs : Zf(Bs.call(e.numerals, String)), s = e.percent === void 0 ? "%" : e.percent + "", a = e.minus === void 0 ? "−" : e.minus + "", c = e.nan === void 0 ? "NaN" : e.nan + "";
  function l(h) {
    h = gi(h);
    var d = h.fill, g = h.align, p = h.sign, w = h.symbol, y = h.zero, v = h.width, _ = h.comma, T = h.precision, M = h.trim, E = h.type;
    E === "n" ? (_ = !0, E = "g") : Ks[E] || (T === void 0 && (T = 12), M = !0, E = "g"), (y || d === "0" && g === "=") && (y = !0, d = "0", g = "=");
    var R = w === "$" ? n : w === "#" && /[boxX]/.test(E) ? "0" + E.toLowerCase() : "", F = w === "$" ? r : /[%p]/.test(E) ? s : "", j = Ks[E], Y = /[defgprs%]/.test(E);
    T = T === void 0 ? 6 : /[gprs]/.test(E) ? Math.max(1, Math.min(21, T)) : Math.max(0, Math.min(20, T));
    function P(D) {
      var I = R, z = F, Q, It, Z;
      if (E === "c")
        z = j(D) + z, D = "";
      else {
        D = +D;
        var rt = D < 0 || 1 / D < 0;
        if (D = isNaN(D) ? c : j(Math.abs(D), T), M && (D = Xf(D)), rt && +D == 0 && p !== "+" && (rt = !1), I = (rt ? p === "(" ? p : a : p === "-" || p === "(" ? "" : p) + I, z = (E === "s" ? Js[8 + Ic / 3] : "") + z + (rt && p === "(" ? ")" : ""), Y) {
          for (Q = -1, It = D.length; ++Q < It; )
            if (Z = D.charCodeAt(Q), 48 > Z || Z > 57) {
              z = (Z === 46 ? i + D.slice(Q + 1) : D.slice(Q)) + z, D = D.slice(0, Q);
              break;
            }
        }
      }
      _ && !y && (D = t(D, 1 / 0));
      var ht = I.length + D.length + z.length, Gt = ht < v ? new Array(v - ht + 1).join(d) : "";
      switch (_ && y && (D = t(Gt + D, Gt.length ? v - z.length : 1 / 0), Gt = ""), g) {
        case "<":
          D = I + D + z + Gt;
          break;
        case "=":
          D = I + Gt + D + z;
          break;
        case "^":
          D = Gt.slice(0, ht = Gt.length >> 1) + I + D + z + Gt.slice(ht);
          break;
        default:
          D = Gt + I + D + z;
          break;
      }
      return o(D);
    }
    return P.toString = function() {
      return h + "";
    }, P;
  }
  function u(h, d) {
    var g = l((h = gi(h), h.type = "f", h)), p = Math.max(-8, Math.min(8, Math.floor($n(d) / 3))) * 3, w = Math.pow(10, -p), y = Js[8 + p / 3];
    return function(v) {
      return g(w * v) + y;
    };
  }
  return {
    format: l,
    formatPrefix: u
  };
}
var Hr, Pc, Sc;
Vf({
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});
function Vf(e) {
  return Hr = Gf(e), Pc = Hr.format, Sc = Hr.formatPrefix, Hr;
}
function Kf(e) {
  return Math.max(0, -$n(Math.abs(e)));
}
function Qf(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor($n(t) / 3))) * 3 - $n(Math.abs(e)));
}
function Bf(e, t) {
  return e = Math.abs(e), t = Math.abs(t) - e, Math.max(0, $n(t) - $n(e)) + 1;
}
function Jf(e, t) {
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
function tm(e) {
  return function() {
    return e;
  };
}
function em(e) {
  return +e;
}
var ta = [0, 1];
function mn(e) {
  return e;
}
function bo(e, t) {
  return (t -= e = +e) ? function(n) {
    return (n - e) / t;
  } : tm(isNaN(t) ? NaN : 0.5);
}
function nm(e, t) {
  var n;
  return e > t && (n = e, e = t, t = n), function(r) {
    return Math.max(e, Math.min(t, r));
  };
}
function rm(e, t, n) {
  var r = e[0], i = e[1], o = t[0], s = t[1];
  return i < r ? (r = bo(i, r), o = n(s, o)) : (r = bo(r, i), o = n(o, s)), function(a) {
    return o(r(a));
  };
}
function im(e, t, n) {
  var r = Math.min(e.length, t.length) - 1, i = new Array(r), o = new Array(r), s = -1;
  for (e[r] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++s < r; )
    i[s] = bo(e[s], e[s + 1]), o[s] = n(t[s], t[s + 1]);
  return function(a) {
    var c = hu(e, a, 1, r) - 1;
    return o[c](i[c](a));
  };
}
function om(e, t) {
  return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown());
}
function sm() {
  var e = ta, t = ta, n = Wo, r, i, o, s = mn, a, c, l;
  function u() {
    var d = Math.min(e.length, t.length);
    return s !== mn && (s = nm(e[0], e[d - 1])), a = d > 2 ? im : rm, c = l = null, h;
  }
  function h(d) {
    return d == null || isNaN(d = +d) ? o : (c || (c = a(e.map(r), t, n)))(r(s(d)));
  }
  return h.invert = function(d) {
    return s(i((l || (l = a(t, e.map(r), Kt)))(d)));
  }, h.domain = function(d) {
    return arguments.length ? (e = Array.from(d, em), u()) : e.slice();
  }, h.range = function(d) {
    return arguments.length ? (t = Array.from(d), u()) : t.slice();
  }, h.rangeRound = function(d) {
    return t = Array.from(d), n = _d, u();
  }, h.clamp = function(d) {
    return arguments.length ? (s = d ? !0 : mn, u()) : s !== mn;
  }, h.interpolate = function(d) {
    return arguments.length ? (n = d, u()) : n;
  }, h.unknown = function(d) {
    return arguments.length ? (o = d, h) : o;
  }, function(d, g) {
    return r = d, i = g, u();
  };
}
function am() {
  return sm()(mn, mn);
}
function cm(e, t, n, r) {
  var i = pu(e, t, n), o;
  switch (r = gi(r ?? ",f"), r.type) {
    case "s": {
      var s = Math.max(Math.abs(e), Math.abs(t));
      return r.precision == null && !isNaN(o = Qf(i, s)) && (r.precision = o), Sc(r, s);
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      r.precision == null && !isNaN(o = Bf(i, Math.max(Math.abs(e), Math.abs(t)))) && (r.precision = o - (r.type === "e"));
      break;
    }
    case "f":
    case "%": {
      r.precision == null && !isNaN(o = Kf(i)) && (r.precision = o - (r.type === "%") * 2);
      break;
    }
  }
  return Pc(r);
}
function lm(e) {
  var t = e.domain;
  return e.ticks = function(n) {
    var r = t();
    return gu(r[0], r[r.length - 1], n ?? 10);
  }, e.tickFormat = function(n, r) {
    var i = t();
    return cm(i[0], i[i.length - 1], n ?? 10, r);
  }, e.nice = function(n) {
    n == null && (n = 10);
    var r = t(), i = 0, o = r.length - 1, s = r[i], a = r[o], c, l, u = 10;
    for (a < s && (l = s, s = a, a = l, l = i, i = o, o = l); u-- > 0; ) {
      if (l = lo(s, a, n), l === c)
        return r[i] = s, r[o] = a, t(r);
      if (l > 0)
        s = Math.floor(s / l) * l, a = Math.ceil(a / l) * l;
      else if (l < 0)
        s = Math.ceil(s * l) / l, a = Math.floor(a * l) / l;
      else
        break;
      c = l;
    }
    return e;
  }, e;
}
function yr() {
  var e = am();
  return e.copy = function() {
    return om(e, yr());
  }, Jf.apply(e, arguments), lm(e);
}
function ln(e) {
  return function() {
    return e;
  };
}
function um(e) {
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
  }, () => new jf(t);
}
function hm(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function zc(e) {
  this._context = e;
}
zc.prototype = {
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
function dm(e) {
  return new zc(e);
}
function fm(e) {
  return e[0];
}
function mm(e) {
  return e[1];
}
function Hc(e, t) {
  var n = ln(!0), r = null, i = dm, o = null, s = um(a);
  e = typeof e == "function" ? e : e === void 0 ? fm : ln(e), t = typeof t == "function" ? t : t === void 0 ? mm : ln(t);
  function a(c) {
    var l, u = (c = hm(c)).length, h, d = !1, g;
    for (r == null && (o = i(g = s())), l = 0; l <= u; ++l)
      !(l < u && n(h = c[l], l, c)) === d && ((d = !d) ? o.lineStart() : o.lineEnd()), d && o.point(+e(h, l, c), +t(h, l, c));
    if (g) return o = null, g + "" || null;
  }
  return a.x = function(c) {
    return arguments.length ? (e = typeof c == "function" ? c : ln(+c), a) : e;
  }, a.y = function(c) {
    return arguments.length ? (t = typeof c == "function" ? c : ln(+c), a) : t;
  }, a.defined = function(c) {
    return arguments.length ? (n = typeof c == "function" ? c : ln(!!c), a) : n;
  }, a.curve = function(c) {
    return arguments.length ? (i = c, r != null && (o = i(r)), a) : i;
  }, a.context = function(c) {
    return arguments.length ? (c == null ? r = o = null : o = i(r = c), a) : r;
  }, a;
}
function Vn(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Vn.prototype = {
  constructor: Vn,
  scale: function(e) {
    return e === 1 ? this : new Vn(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Vn(this.k, this.x + this.k * e, this.y + this.k * t);
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
Vn.prototype;
const gm = {
  name: "Sigmoid v3",
  description: "Smooth sigmoid curve that travels horizontally first, with limited curve distance",
  render(e) {
    const t = [], n = e.fromX - 5, r = e.toX + 5;
    let i = e.fromY;
    e.toY < e.fromY ? i = e.fromY - 5 : e.toY > e.fromY && (i = e.fromY + 5);
    const o = e.toY, s = Math.abs(r - n), a = 50;
    if (s <= a)
      return pm(n, i, r, o, e);
    const l = r > n ? n + a : n - a, u = jc(n, i, l, o);
    if (!u) {
      const g = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      return g.setAttribute("d", `M ${n},${i} L ${r},${o}`), g.setAttribute("stroke", e.color), g.setAttribute("stroke-width", "5"), g.setAttribute("fill", "none"), t.push(g), t;
    }
    const h = `${u} L ${r},${o}`, d = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return d.setAttribute("d", h), d.setAttribute("stroke", e.color), d.setAttribute("stroke-width", "5"), d.setAttribute("fill", "none"), e.connectorType === "undefined" ? (d.setAttribute("stroke-dasharray", "5,5"), d.setAttribute("stroke-opacity", "0.5")) : d.setAttribute("stroke-opacity", e.opacity.toString()), t.push(d), t;
  }
};
function pm(e, t, n, r, i) {
  const o = [], s = jc(e, t, n, r);
  if (!s) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return c.setAttribute("d", `M ${e},${t} L ${n},${r}`), c.setAttribute("stroke", i.color), c.setAttribute("stroke-width", "2"), c.setAttribute("fill", "none"), o.push(c), o;
  }
  const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return a.setAttribute("d", s), a.setAttribute("stroke", i.color), a.setAttribute("stroke-width", "5"), a.setAttribute("fill", "none"), i.connectorType === "undefined" ? (a.setAttribute("stroke-dasharray", "5,5"), a.setAttribute("stroke-opacity", "0.5")) : a.setAttribute("stroke-opacity", i.opacity.toString()), o.push(a), o;
}
function jc(e, t, n, r) {
  const i = (h) => 1 / (1 + Math.exp(-2 * h)), a = [];
  for (let h = -3; h <= 3; h += 0.1) {
    const d = i(h);
    a.push([d, h]);
  }
  const c = yr().domain([0, 1]).range([e, n]), l = yr().domain([0, 1]).range([t, r]);
  return Hc().x((h) => {
    const d = (h[1] + 3) / 6;
    return c(d);
  }).y((h) => l(h[0]))(a);
}
const ym = {
  name: "Connector v4",
  description: "Limited sigmoid for defined connectors, full sigmoid for undefined connectors",
  render(e) {
    return e.connectorType === "undefined" ? wm(e) : vm(e);
  }
};
function wm(e) {
  const t = [], n = e.fromX - 5, r = e.fromY, i = e.toX + 5, o = e.toY, s = _o(n, r, i, o);
  if (!s) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return c.setAttribute("d", `M ${n},${r} L ${i},${o}`), c.setAttribute("stroke", e.color), c.setAttribute("stroke-width", "3"), c.setAttribute("fill", "none"), c.setAttribute("stroke-dasharray", "5,5"), c.setAttribute("stroke-opacity", "0.5"), t.push(c), t;
  }
  const a = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return a.setAttribute("d", s), a.setAttribute("stroke", e.color), a.setAttribute("stroke-width", "3"), a.setAttribute("fill", "none"), a.setAttribute("stroke-dasharray", "5,5"), a.setAttribute("stroke-opacity", "0.5"), t.push(a), t;
}
function vm(e) {
  const t = [], n = e.fromX - 5, r = e.toX + 5;
  let i = e.fromY;
  e.toY < e.fromY ? i = e.fromY - 5 : e.toY > e.fromY && (i = e.fromY + 5);
  const o = e.toY, s = Math.abs(r - n), a = 50;
  if (s <= a) {
    const g = _o(n, i, r, o);
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
  const l = r > n ? n + a : n - a, u = _o(n, i, l, o);
  if (!u) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "path");
    return g.setAttribute("d", `M ${n},${i} L ${r},${o}`), g.setAttribute("stroke", e.color), g.setAttribute("stroke-width", "5"), g.setAttribute("fill", "none"), g.setAttribute("stroke-opacity", e.opacity.toString()), t.push(g), t;
  }
  const h = `${u} L ${r},${o}`, d = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return d.setAttribute("d", h), d.setAttribute("stroke", e.color), d.setAttribute("stroke-width", "5"), d.setAttribute("fill", "none"), d.setAttribute("stroke-opacity", e.opacity.toString()), t.push(d), t;
}
function _o(e, t, n, r) {
  const i = (h) => 1 / (1 + Math.exp(-2 * h)), a = [];
  for (let h = -3; h <= 3; h += 0.1) {
    const d = i(h);
    a.push([d, h]);
  }
  const c = yr().domain([0, 1]).range([e, n]), l = yr().domain([0, 1]).range([t, r]);
  return Hc().x((h) => {
    const d = (h[1] + 3) / 6;
    return c(d);
  }).y((h) => l(h[0]))(a);
}
const bm = {
  "connector-v4": ym,
  sigmoidHorizontalLimited: gm
}, _m = "sigmoidHorizontalLimited", Tm = `
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
let ea = !1;
function Mm() {
  if (ea) return;
  const e = document.createElement("style");
  e.setAttribute("data-thymeline-info-popup", ""), e.textContent = Tm, document.head.appendChild(e), ea = !0;
}
class Em {
  element = null;
  container;
  documentClickHandler = null;
  constructor(t) {
    this.container = t, Mm();
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
function Te(e, t = {}) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", e);
  return xm(n, t), n;
}
function xm(e, t) {
  for (const [n, r] of Object.entries(t))
    r !== void 0 && e.setAttribute(n, String(r));
}
function ne(e, t) {
  const n = Te("text", {
    "font-size": 11,
    fill: "#666",
    ...t
  });
  return n.textContent = e, n;
}
function jr(e, t, n, r, i = {}) {
  return Te("line", {
    x1: e,
    y1: t,
    x2: n,
    y2: r,
    stroke: "#666",
    "stroke-width": 1,
    ...i
  });
}
function pi(e, t, n, r, i = {}) {
  return Te("rect", {
    x: e,
    y: t,
    width: n,
    height: r,
    ...i
  });
}
function Dm(e, t, n, r = {}) {
  return Te("circle", {
    cx: e,
    cy: t,
    r: n,
    ...r
  });
}
class Cm {
  constructor(t) {
    this.options = t;
    const n = J(t.initialStartTime), r = J(t.initialEndTime);
    this.state = {
      startTime: n,
      endTime: r,
      zoomLevel: 1,
      centerTime: (n + r) / 2
    };
  }
  state;
  data = null;
  /**
   * Get current viewport state (read-only copy)
   */
  getState() {
    return { ...this.state };
  }
  /**
   * Get current start time
   */
  get startTime() {
    return this.state.startTime;
  }
  /**
   * Get current end time
   */
  get endTime() {
    return this.state.endTime;
  }
  /**
   * Get current zoom level
   */
  get zoomLevel() {
    return this.state.zoomLevel;
  }
  /**
   * Get current center time
   */
  get centerTime() {
    return this.state.centerTime;
  }
  /**
   * Update the canvas width (e.g., on resize)
   */
  setWidth(t) {
    this.options.width = t;
  }
  /**
   * Set the timeline data for bounds calculations
   */
  setData(t) {
    this.data = t;
  }
  /**
   * Reset viewport to show the full data range
   */
  fitToData() {
    if (!this.data) return;
    const { minTime: t, maxTime: n } = this.calculateDataTimeRange(this.data);
    this.state.startTime = t, this.state.endTime = n, this.state.centerTime = (t + n) / 2, this.state.zoomLevel = 1;
  }
  /**
   * Convert normalized time to pixel position
   */
  timeToX(t) {
    const n = this.state.endTime - this.state.startTime, r = this.options.width / n;
    return (t - this.state.startTime) * r;
  }
  /**
   * Convert pixel position to time
   */
  xToTime(t) {
    const n = this.state.endTime - this.state.startTime, r = t / this.options.width;
    return this.state.startTime + n * r;
  }
  /**
   * Zoom to a specific time range
   */
  zoomTo(t, n) {
    this.state.startTime = J(t), this.state.endTime = J(n), this.state.centerTime = (this.state.startTime + this.state.endTime) / 2, this.state.zoomLevel = 1;
  }
  /**
   * Set zoom level, optionally centered on a specific time
   * Returns true if zoom changed, false if it hit limits
   */
  setZoomLevel(t, n) {
    if (!this.data) return !1;
    const r = this.state.zoomLevel, i = this.state.endTime - this.state.startTime, o = n ?? this.state.centerTime, { minTime: s, maxTime: a } = this.calculateDataTimeRange(this.data), c = a - s, l = this.state.endTime - this.state.startTime, u = Math.min(
      this.options.minZoom,
      r * (l / c)
    ), h = this.findShortestPeriod();
    let d = this.options.maxZoom;
    if (h !== null) {
      const w = h * 10;
      d = Math.min(
        this.options.maxZoom,
        c / w
      );
    }
    const g = Math.max(
      u,
      Math.min(d, t)
    );
    if (g === r)
      return !1;
    this.state.zoomLevel = g;
    let p = i * (r / g);
    return p = Math.min(p, c * 1.05), this.state.centerTime = o, this.state.startTime = o - p / 2, this.state.endTime = o + p / 2, this.clampPanPosition(), this.recalculateViewportBounds(), !0;
  }
  /**
   * Pan to a specific center time (normalized number or TimeInput)
   */
  panTo(t) {
    this.state.centerTime = typeof t == "number" ? t : J(t), this.clampPanPosition(), this.recalculateViewportBounds();
  }
  /**
   * Pan by a pixel delta
   */
  panBy(t) {
    const n = this.state.endTime - this.state.startTime, r = t / this.options.width * n;
    this.state.centerTime += r, this.clampPanPosition(), this.recalculateViewportBounds();
  }
  /**
   * Calculate the time range that encompasses all data
   */
  calculateDataTimeRange(t) {
    let n = 1 / 0, r = -1 / 0;
    for (const s of t.events) {
      const a = J(s.time);
      n = Math.min(n, a), r = Math.max(r, a);
    }
    for (const s of t.periods) {
      const a = J(s.startTime), c = fr(s.endTime, !1);
      n = Math.min(n, a), r = Math.max(r, c);
    }
    (n === 1 / 0 || r === -1 / 0) && (n = J(this.options.initialStartTime), r = J(this.options.initialEndTime));
    const o = (r - n) * 0.025;
    return {
      minTime: n - o,
      maxTime: r + o
    };
  }
  /**
   * Find the shortest period duration in the data
   */
  findShortestPeriod() {
    if (!this.data || this.data.periods.length === 0)
      return null;
    let t = 1 / 0;
    for (const n of this.data.periods) {
      if (n.endTime === void 0 || n.endTime === null)
        continue;
      const r = J(n.startTime), o = J(n.endTime) - r;
      o > 0 && (t = Math.min(t, o));
    }
    return t === 1 / 0 ? null : t;
  }
  /**
   * Clamp pan position to prevent excessive empty space
   */
  clampPanPosition() {
    if (!this.data) return;
    let t = 1 / 0, n = -1 / 0;
    for (const a of this.data.events) {
      const c = J(a.time);
      t = Math.min(t, c), n = Math.max(n, c);
    }
    for (const a of this.data.periods) {
      const c = J(a.startTime), l = fr(a.endTime, !1);
      t = Math.min(t, c), n = Math.max(n, l);
    }
    if (t === 1 / 0 || n === -1 / 0)
      return;
    const r = this.state.endTime - this.state.startTime, i = r * 0.15, o = t - i + r / 2, s = n + i - r / 2;
    this.state.centerTime = Math.max(
      o,
      Math.min(s, this.state.centerTime)
    );
  }
  /**
   * Recalculate viewport start/end times based on center and current range
   */
  recalculateViewportBounds() {
    const t = this.state.endTime - this.state.startTime;
    this.state.startTime = this.state.centerTime - t / 2, this.state.endTime = this.state.centerTime + t / 2;
  }
}
const nr = -138e8;
function Sm(e) {
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
      const s = J(o.startTime);
      if (!Ns(o)) {
        const c = fr(o.endTime);
        s > c && t.push({
          type: "error",
          message: `Period "${o.name}" has start time after end time`,
          itemId: o.id
        }), c < nr && t.push({
          type: "error",
          message: `Period "${o.name}" ends before the Big Bang (13.8 billion years ago). End time: ${c.toExponential(2)}`,
          itemId: o.id
        });
      }
      s < nr && t.push({
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
      if (!Ns(a)) {
        const c = J(s.startTime), l = fr(a.endTime);
        if (c > l) {
          const u = c - l;
          n.push({
            type: "warning",
            message: `Connector "${o.id}" connects "${s.name}" → "${a.name}", but "${s.name}" starts ${u.toFixed(0)} years after "${a.name}" ends. The periods don't overlap in time.`,
            itemId: o.id
          });
        }
      }
    } catch {
    }
  }
  for (const o of e.events)
    try {
      const s = J(o.time);
      s < nr && t.push({
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
function zm(e) {
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
const $m = {
  width: 800,
  axisHeight: 40,
  tickHeight: 10,
  margin: 40,
  numMarkers: 10
};
class km {
  config;
  constructor(t = {}) {
    this.config = { ...$m, ...t };
  }
  /**
   * Update configuration (e.g., on resize)
   */
  setConfig(t) {
    this.config = { ...this.config, ...t };
  }
  /**
   * Render the complete time axis
   */
  render(t, n) {
    this.renderBackground(t), this.renderBigBangBoundary(t, n), this.renderAxisLine(t), this.renderTicksAndLabels(t, n);
  }
  /**
   * Render the today marker line (called separately after other elements)
   */
  renderTodayLine(t, n) {
    const r = jo(), i = n.timeToX(r);
    if (i < 0 || i > this.config.width)
      return;
    const o = parseFloat(t.getAttribute("height") || "500"), s = jr(
      i,
      this.config.axisHeight,
      i,
      o,
      {
        stroke: "#333",
        "stroke-width": 2,
        "stroke-dasharray": "5,5"
      }
    );
    t.appendChild(s);
    const a = ne("Today", {
      x: i + 5,
      y: this.config.axisHeight + 15,
      "text-anchor": "start",
      "font-size": 10,
      "font-style": "italic"
    });
    t.appendChild(a);
  }
  /**
   * Render axis background
   */
  renderBackground(t) {
    const n = pi(0, 0, this.config.width, this.config.axisHeight, {
      id: "time-axis-background",
      fill: "#f8f9fa"
    });
    t.appendChild(n);
  }
  /**
   * Render main axis line
   */
  renderAxisLine(t) {
    const n = jr(
      0,
      this.config.axisHeight,
      this.config.width,
      this.config.axisHeight,
      {
        "stroke-width": 2
      }
    );
    t.appendChild(n);
  }
  /**
   * Render tick marks and time labels
   */
  renderTicksAndLabels(t, n) {
    const { width: r, axisHeight: i, tickHeight: o, margin: s, numMarkers: a } = this.config, c = r - s * 2, l = n.endTime - n.startTime;
    for (let u = 0; u <= a; u++) {
      const h = s + c / a * u, d = h / r, g = n.startTime + l * d, p = jr(
        h,
        i,
        h,
        i + o
      );
      if (t.appendChild(p), g >= nr) {
        const w = ne(this.formatTimeLabel(g), {
          x: h,
          y: 25,
          "text-anchor": "middle"
        });
        t.appendChild(w);
      }
    }
  }
  /**
   * Render Big Bang boundary and static noise effect
   */
  renderBigBangBoundary(t, n) {
    const r = n.timeToX(nr);
    if (r < 0 || r > this.config.width)
      return;
    const i = parseFloat(t.getAttribute("height") || "500");
    let o = t.querySelector("defs");
    o || (o = Te("defs"), t.insertBefore(o, t.firstChild));
    const s = o.querySelector("#static-noise-pattern");
    s && s.remove();
    const a = Te("filter", {
      id: "noise-filter",
      x: 0,
      y: 0,
      width: "100%",
      height: "100%"
    }), c = Te("feTurbulence", {
      type: "fractalNoise",
      baseFrequency: 2.5,
      numOctaves: 5,
      result: "noise"
    }), l = Te("feColorMatrix", {
      in: "noise",
      type: "matrix",
      values: "0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0"
    });
    if (a.appendChild(c), a.appendChild(l), o.appendChild(a), r > 0) {
      const u = pi(
        0,
        this.config.axisHeight,
        r,
        i - this.config.axisHeight,
        {
          fill: "#d0d0d0",
          filter: "url(#noise-filter)",
          opacity: 0.35
        }
      );
      t.appendChild(u);
      const h = jr(
        r,
        this.config.axisHeight,
        r,
        i,
        {
          stroke: "#333",
          "stroke-width": 2,
          "stroke-dasharray": "5,5"
        }
      );
      t.appendChild(h);
      const d = ne("Big Bang", {
        x: r - 5,
        y: this.config.axisHeight + 15,
        "text-anchor": "end",
        "font-size": 10,
        "font-style": "italic"
      });
      t.appendChild(d);
    }
  }
  /**
   * Format time value for axis labels
   */
  formatTimeLabel(t) {
    return t < -1e6 ? `${(Math.abs(t) / 1e6).toFixed(0)}M BCE` : t < 0 ? `${Math.abs(Math.floor(t))} BCE` : t < 1e3 ? `${Math.floor(t)} CE` : Math.floor(t).toString();
  }
}
const Lm = {
  eventHeight: 20,
  circleRadius: 4,
  labelGap: 8,
  fontSize: 10,
  charWidth: 6
};
class Rm {
  config;
  constructor(t = {}) {
    this.config = { ...Lm, ...t };
  }
  /**
   * Calculate label placements for all events
   */
  calculatePlacements(t, n, r, i) {
    const { eventHeight: o, circleRadius: s, labelGap: a, charWidth: c } = this.config, l = this.config.fontSize + 4, u = [...t].sort(
      (w, y) => w.assignment.startTime - y.assignment.startTime
    ), h = [], d = /* @__PURE__ */ new Map(), g = [], p = [0, 1, -1];
    for (const { event: w, assignment: y, row: v, isRelatedEvent: _ } of u) {
      const T = r.timeToX(y.startTime), M = y.subLane ?? 0, E = w.name.length * c, R = (Z) => {
        const ht = r.eventToY(v, Z, _) + o / 2;
        return {
          id: w.id,
          circleX: T,
          circleY: ht,
          circleRadius: s,
          labelY: ht - l / 2,
          labelHeight: l,
          labelWidth: E,
          rightLabelX: T + a,
          leftLabelX: T - a - E,
          subLane: Z,
          row: v,
          isRelatedEvent: _
        };
      }, F = (Z) => {
        const rt = `${v}:${Z}`, ht = d.get(rt);
        return ht !== void 0 && y.startTime < ht;
      }, j = (Z, rt) => {
        if (F(Z))
          return !1;
        const ht = R(Z);
        return !this.checkOverlap(ht, rt, h, n);
      };
      let Y = M, P = "right", D = !1;
      if (_) {
        if (j(M, "right") && (Y = M, P = "right", D = !0), !D) {
          for (const Z of p)
            if (Z !== M) {
              if (j(Z, "right")) {
                Y = Z, P = "right", D = !0;
                break;
              }
              if (j(Z, "left")) {
                Y = Z, P = "left", D = !0;
                break;
              }
            }
        }
        !D && j(M, "left") && (Y = M, P = "left", D = !0), D || (Y = M, P = "hidden");
      } else {
        const Z = R(M);
        this.checkOverlap(
          Z,
          "right",
          h,
          n
        ) ? P = this.checkOverlap(
          Z,
          "left",
          h,
          n
        ) ? "hidden" : "left" : P = "right", Y = M;
      }
      g.push({
        eventId: w.id,
        subLane: Y,
        labelPosition: P
      });
      const I = R(Y);
      I.labelPosition = P, h.push(I);
      const z = `${v}:${Y}`, Q = d.get(z) ?? -1 / 0, It = y.startTime + (E + a + s * 2) / i.width * (i.endTime - i.startTime);
      d.set(z, Math.max(Q, It));
    }
    return g;
  }
  /**
   * Check if a label at the given position would overlap
   */
  checkOverlap(t, n, r, i) {
    const o = n === "right" ? t.rightLabelX : t.leftLabelX, s = o + t.labelWidth, a = t.labelY, c = t.labelY + t.labelHeight, l = t.circleX - t.circleRadius, u = t.circleX + t.circleRadius, h = t.circleY - t.circleRadius, d = t.circleY + t.circleRadius;
    for (const g of r) {
      if (g.id === t.id) continue;
      const p = g.circleX - g.circleRadius, w = g.circleX + g.circleRadius, y = g.circleY - g.circleRadius, v = g.circleY + g.circleRadius;
      if (l < w && u > p && h < v && d > y || o < w && s > p && a < v && c > y)
        return !0;
      if (g.labelPosition && g.labelPosition !== "hidden") {
        const _ = g.labelPosition === "right" ? g.rightLabelX : g.leftLabelX, T = _ + g.labelWidth, M = g.labelY, E = g.labelY + g.labelHeight;
        if (o < T && s > _ && a < E && c > M)
          return !0;
      }
    }
    for (const g of i) {
      const p = g.x + g.width, w = g.y + g.height;
      if (o < p && s > g.x && a < w && c > g.y || l < p && u > g.x && h < w && d > g.y)
        return !0;
    }
    return !1;
  }
}
function Nm(e, t, n, r, i = 5) {
  const o = [], s = Math.abs(n - e), a = 50, c = i / 2 + 2, l = (g) => 1 / (1 + Math.exp(-2 * g)), u = [], h = 3, d = 20;
  if (s <= a)
    for (let g = 0; g <= d; g++) {
      const p = -h + g / d * (2 * h), w = (p + h) / (2 * h), y = l(p);
      u.push({
        x: e + w * (n - e),
        y: t + y * (r - t)
      });
    }
  else {
    const p = n > e ? e + a : e - a;
    for (let w = 0; w <= d; w++) {
      const y = -h + w / d * (2 * h), v = (y + h) / (2 * h), _ = l(y);
      u.push({
        x: e + v * (p - e),
        y: t + _ * (r - t)
      });
    }
    u.push({ x: n, y: r });
  }
  for (let g = 0; g < u.length - 1; g++) {
    const p = u[g], w = u[g + 1], y = Math.min(p.x, w.x) - c, v = Math.max(p.x, w.x) + c, _ = Math.min(p.y, w.y) - c, T = Math.max(p.y, w.y) + c;
    o.push({
      x: y,
      y: _,
      width: v - y,
      height: T - _
    });
  }
  return o;
}
const Om = {
  zoomSensitivity: 1e-3,
  doubleClickZoomFactor: 1.5,
  doubleClickThreshold: 300
};
class Am {
  svg;
  callbacks;
  config;
  isDragging = !1;
  startX = 0;
  startCenterTime = 0;
  lastClickTime = 0;
  boundHandlers;
  constructor(t, n, r = {}) {
    this.svg = t, this.callbacks = n, this.config = { ...Om, ...r }, this.boundHandlers = {
      mousedown: this.handleMouseDown.bind(this),
      mousemove: this.handleMouseMove.bind(this),
      mouseup: this.handleMouseUp.bind(this),
      mouseleave: this.handleMouseUp.bind(this),
      wheel: this.handleWheel.bind(this)
    }, this.attach();
  }
  /**
   * Attach event listeners to the SVG element
   */
  attach() {
    this.svg.addEventListener("mousedown", this.boundHandlers.mousedown), this.svg.addEventListener("mousemove", this.boundHandlers.mousemove), this.svg.addEventListener("mouseup", this.boundHandlers.mouseup), this.svg.addEventListener("mouseleave", this.boundHandlers.mouseleave), this.svg.addEventListener("wheel", this.boundHandlers.wheel);
  }
  /**
   * Remove event listeners from the SVG element
   */
  detach() {
    this.svg.removeEventListener("mousedown", this.boundHandlers.mousedown), this.svg.removeEventListener("mousemove", this.boundHandlers.mousemove), this.svg.removeEventListener("mouseup", this.boundHandlers.mouseup), this.svg.removeEventListener("mouseleave", this.boundHandlers.mouseleave), this.svg.removeEventListener("wheel", this.boundHandlers.wheel);
  }
  /**
   * Handle mouse down - start drag or detect double-click
   */
  handleMouseDown(t) {
    const n = Date.now();
    if (n - this.lastClickTime < this.config.doubleClickThreshold) {
      this.handleDoubleClick(t), this.lastClickTime = 0;
      return;
    }
    this.lastClickTime = n, this.isDragging = !0, this.startX = t.clientX, this.startCenterTime = this.callbacks.getCenterTime(), this.svg.style.cursor = "grabbing";
  }
  /**
   * Handle mouse move - pan if dragging
   */
  handleMouseMove(t) {
    if (!this.isDragging) return;
    const n = t.clientX - this.startX, r = this.callbacks.getTimeRange(), i = this.callbacks.getWidth(), o = -n / i * r, s = this.startCenterTime + o;
    this.callbacks.onPan(s);
  }
  /**
   * Handle mouse up - stop dragging
   */
  handleMouseUp() {
    this.isDragging && (this.isDragging = !1, this.svg.style.cursor = "grab");
  }
  /**
   * Handle mouse wheel - zoom
   */
  handleWheel(t) {
    t.preventDefault();
    const n = this.svg.getBoundingClientRect(), r = t.clientX - n.left, i = this.callbacks.xToTime(r), o = 1 + Math.abs(t.deltaY) * this.config.zoomSensitivity, s = this.callbacks.getZoomLevel(), a = t.deltaY < 0 ? s * o : s / o;
    this.callbacks.onZoom(a, i);
  }
  /**
   * Handle double-click - zoom in centered on click position
   */
  handleDoubleClick(t) {
    const n = this.svg.getBoundingClientRect(), r = t.clientX - n.left, i = this.callbacks.xToTime(r), s = this.callbacks.getZoomLevel() * this.config.doubleClickZoomFactor;
    this.callbacks.onZoom(s, i);
  }
}
class Hm {
  container;
  svg = null;
  data = null;
  options;
  viewport;
  timeAxisRenderer;
  labelPositioner;
  interactionHandler = null;
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
        laneGap: 39
      },
      periodLayoutAlgorithm: n.periodLayoutAlgorithm ?? "succession",
      connectorRenderer: n.connectorRenderer ?? _m,
      showRowNumbers: n.showRowNumbers ?? !1
    }, this.viewport = new Cm({
      width: this.options.width,
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom,
      initialStartTime: this.options.initialStartTime,
      initialEndTime: this.options.initialEndTime
    }), this.timeAxisRenderer = new km({
      width: this.options.width
    }), this.labelPositioner = new Rm();
  }
  /**
   * Render timeline with data
   */
  render(t) {
    this.data = t, this.viewport.setData(t), this.viewport.fitToData();
    const n = su(
      t.periods,
      t.events,
      this.options.periodLayoutAlgorithm,
      t.connectors
    );
    this.laneAssignments = n, this.rowMapping = this.buildRowMapping(), this.createSVG(), this.renderTimeline();
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
    this.viewport.zoomTo(t, n), this.updateView();
  }
  setZoomLevel(t, n) {
    if (!this.data) return;
    this.viewport.setZoomLevel(t, n) && (this.updateView(), this.emit("zoom", this.viewport.zoomLevel));
  }
  /**
   * Pan controls
   */
  panTo(t) {
    this.viewport.panTo(t), this.updateView(), this.emit("pan", this.viewport.centerTime);
  }
  panBy(t) {
    this.viewport.panBy(t), this.updateView(), this.emit("pan", this.viewport.centerTime);
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
    this.interactionHandler && (this.interactionHandler.detach(), this.interactionHandler = null), this.infoPopup && (this.infoPopup.destroy(), this.infoPopup = null), this.svg && (this.svg.remove(), this.svg = null), this.eventListeners.clear();
  }
  /**
   * Get current viewport state (for debugging)
   */
  getViewport() {
    return this.viewport.getState();
  }
  on(t, n) {
    this.eventListeners.has(t) || this.eventListeners.set(t, /* @__PURE__ */ new Set()), this.eventListeners.get(t).add(n);
  }
  /**
   * Private methods
   */
  createSVG() {
    this.svg && this.svg.remove();
    const t = this.rowMapping.size > 0 ? Math.max(...this.rowMapping.values()) + 1 : 1, n = this.options.constraints.periodHeight, r = this.options.constraints.laneGap, i = 60, o = r / 3, s = o, a = o, c = o * 2, u = i + s + a + t * (n + r) + c + 20, h = Math.max(this.options.height, u);
    this.svg = Te("svg", {
      width: this.options.width,
      height: h
    }), this.svg.style.border = "1px solid #ccc", this.svg.style.background = "#fff", this.svg.style.cursor = "grab", this.svg.style.userSelect = "none", this.interactionHandler && this.interactionHandler.detach(), this.interactionHandler = new Am(this.svg, {
      onPan: (d) => {
        this.viewport.panTo(d), this.updateView(), this.emit("pan", this.viewport.centerTime);
      },
      onZoom: (d, g) => {
        this.setZoomLevel(d, g);
      },
      xToTime: (d) => this.viewport.xToTime(d),
      getZoomLevel: () => this.viewport.zoomLevel,
      getCenterTime: () => this.viewport.centerTime,
      getTimeRange: () => this.viewport.endTime - this.viewport.startTime,
      getWidth: () => this.options.width
    }), this.container.appendChild(this.svg), this.infoPopup || (this.infoPopup = new Em(this.container));
  }
  updateView() {
    this.data && this.renderTimeline();
  }
  emit(t, ...n) {
    const r = this.eventListeners.get(t);
    r && r.forEach((i) => i(...n));
  }
  /**
   * Convert normalized time to pixel position
   */
  timeToX(t) {
    return this.viewport.timeToX(t);
  }
  /**
   * Convert lane assignments to sequential row numbers
   * This normalizes sparse lane assignments (e.g., 0, 1, 5, 10) to dense rows (0, 1, 2, 3)
   */
  buildRowMapping() {
    const t = /* @__PURE__ */ new Map(), n = this.laneAssignments.filter(
      (u) => u.type === "period"
    ), r = this.laneAssignments.filter(
      (u) => u.type === "event"
    ), i = [...new Set(n.map((u) => u.lane))].sort(
      (u, h) => u - h
    );
    n.forEach((u) => {
      const h = i.indexOf(u.lane);
      t.set(u.itemId, h);
    });
    const o = new Set(i), s = r.filter(
      (u) => o.has(u.lane)
    ), a = r.filter(
      (u) => !o.has(u.lane)
    );
    s.forEach((u) => {
      const h = i.indexOf(u.lane);
      t.set(u.itemId, h);
    });
    const c = i.length, l = [
      ...new Set(a.map((u) => u.lane))
    ].sort((u, h) => u - h);
    return a.forEach((u) => {
      const h = l.indexOf(u.lane), d = c + h;
      t.set(u.itemId, d);
    }), t;
  }
  /**
   * Get Y position for a row
   * Simple row-based positioning with configurable gaps
   * Layout: unrelated events lane -> sub-lane -1 -> periods with sub-lanes 0/1
   */
  rowToY(t, n) {
    const r = this.options.constraints.periodHeight, i = 20, o = this.options.constraints.laneGap, s = 60, a = o / 3, c = a, l = a;
    return n === "period" ? s + c + l + t * (r + o) : s + c + l + t * (i + o);
  }
  /**
   * Get Y position for an event with sub-lane support
   * @param row The row number (same as period row for related events)
   * @param subLane The sub-lane (-1, 0, or 1) within the row's vertical space
   * @param isRelatedEvent Whether this event relates to a period
   */
  eventToY(t, n, r) {
    const i = this.options.constraints.periodHeight, o = this.options.constraints.laneGap, s = 60, a = o / 3, c = a, l = a;
    if (r) {
      const u = s + c + l + t * (i + o);
      return n === -1 ? u - a - 4 : u + i + n * a;
    } else
      return s;
  }
  /**
   * Main rendering method
   */
  renderTimeline() {
    if (!(!this.svg || !this.data)) {
      this.svg.innerHTML = "", this.options.showRowNumbers && this.renderRowNumbers(), this.timeAxisRenderer.render(this.svg, this.viewport);
      for (const t of this.data.connectors)
        t.type === "undefined" && this.renderConnector(t);
      for (const t of this.data.connectors)
        t.type !== "undefined" && this.renderConnector(t);
      for (const t of this.data.periods)
        this.renderPeriod(t);
      this.renderEventsWithLabelPositioning(this.data.events), this.timeAxisRenderer.renderTodayLine(this.svg, this.viewport);
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
      for (const [c, l] of this.rowMapping.entries())
        if (l === r && this.laneAssignments.find(
          (h) => h.itemId === c
        )?.type === "period") {
          i = !1;
          break;
        }
      const o = this.rowToY(r, i ? "event" : "period"), s = pi(0, o, 30, n, {
        fill: "#f0f0f0",
        stroke: "#ccc",
        "stroke-width": 0.5
      });
      this.svg.appendChild(s);
      const a = ne(r.toString(), {
        x: 15,
        y: o + n / 2 + 4,
        "text-anchor": "middle",
        "font-size": 10,
        "font-family": "monospace"
      });
      this.svg.appendChild(a);
    }
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
      if ("unit" in t) {
        if (t.unit === "mya")
          return `${t.value} million years ago`;
        if (t.unit === "years-ago")
          return `${t.value} years ago`;
        if (t.unit === "bce")
          return `${t.value} BCE`;
        if (t.unit === "ce")
          return `${t.value} CE`;
      } else if ("localTime" in t)
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
    const i = this.timeToX(n.startTime), o = n.endTime === 1 / 0 ? jo() : n.endTime, s = this.timeToX(o), a = this.rowToY(r, "period"), c = Math.max(2, s - i), l = this.options.constraints.periodHeight, u = pi(i, a, c, l, {
      id: t.id,
      fill: "#000",
      "fill-opacity": 1,
      stroke: "#000",
      "stroke-width": 1,
      rx: 5,
      ry: l * 0.35
    });
    if (u.style.cursor = "pointer", u.addEventListener("click", (d) => {
      if (d.stopPropagation(), this.infoPopup) {
        const g = this.formatTimeForDisplay(t.startTime), p = t.endTime ? this.formatTimeForDisplay(t.endTime) : "ongoing";
        let w = `${t.name}
${g} – ${p}`;
        t.info && (w += `

${t.info}`), this.infoPopup.show(w, d.clientX, d.clientY);
      }
      this.emit("itemClick", t);
    }), this.svg.appendChild(u), !this.renderPeriodLabel(
      t.name,
      i,
      a,
      c,
      l
    )) {
      let d = null;
      u.addEventListener("mouseenter", () => {
        this.svg && (d = ne(t.name, {
          x: i + c / 2,
          y: a + l + 14,
          "text-anchor": "middle",
          fill: "#000",
          "font-weight": "bold",
          "pointer-events": "none"
        }), this.svg.appendChild(d));
      }), u.addEventListener("mouseleave", () => {
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
    const c = n + i / 2, l = 11, u = l + 2, h = (M) => {
      const E = ne(M, {
        x: 0,
        y: 0,
        "font-size": l,
        "font-weight": "bold"
      });
      this.svg.appendChild(E);
      const R = E.getBBox();
      return E.remove(), R.width;
    };
    if (h(t) <= a) {
      const M = ne(t, {
        x: c,
        y: r + o / 2 + l / 3,
        "text-anchor": "middle",
        "font-size": l,
        fill: "#fff",
        "font-weight": "bold",
        "pointer-events": "none"
      });
      return this.svg.appendChild(M), !0;
    }
    const g = t.split(" ");
    if (g.length < 2)
      return !1;
    let p = 1, w = 1 / 0;
    for (let M = 1; M < g.length; M++) {
      const E = g.slice(0, M).join(" "), R = g.slice(M).join(" "), F = Math.max(h(E), h(R));
      F < w && (w = F, p = M);
    }
    if (w > a)
      return !1;
    const y = g.slice(0, p).join(" "), v = g.slice(p).join(" "), _ = ne(y, {
      x: c,
      y: r + o / 2 - u / 2 + l / 3,
      "text-anchor": "middle",
      "font-size": l,
      fill: "#fff",
      "font-weight": "bold",
      "pointer-events": "none"
    });
    this.svg.appendChild(_);
    const T = ne(v, {
      x: c,
      y: r + o / 2 + u / 2 + l / 3,
      "text-anchor": "middle",
      "font-size": l,
      fill: "#fff",
      "font-weight": "bold",
      "pointer-events": "none"
    });
    return this.svg.appendChild(T), !0;
  }
  /**
   * Calculate bounding boxes for all visible connectors for collision detection
   */
  calculateConnectorBounds() {
    if (!this.data) return [];
    const t = [];
    for (const n of this.data.connectors) {
      const r = this.laneAssignments.find(
        (T) => T.itemId === n.fromId
      ), i = this.laneAssignments.find(
        (T) => T.itemId === n.toId
      );
      if (!r || !i) continue;
      const o = this.timeToX(r.startTime), a = this.timeToX(r.endTime) - o, c = this.timeToX(i.startTime), u = this.timeToX(i.endTime) - c;
      if (a < 10 || u < 10) continue;
      const h = this.rowMapping.get(n.fromId), d = this.rowMapping.get(n.toId);
      if (h === void 0 || d === void 0) continue;
      const g = Math.min(
        r.endTime,
        i.startTime
      ), p = this.timeToX(g) - 5, w = this.timeToX(i.startTime) + 5;
      let y = this.rowToY(h, r.type) + this.options.constraints.periodHeight / 2;
      const v = this.rowToY(d, i.type) + this.options.constraints.periodHeight / 2;
      v < y ? y = y - 5 : v > y && (y = y + 5);
      const _ = Nm(p, y, w, v);
      t.push(..._);
    }
    return t;
  }
  /**
   * Render all events with smart label positioning to avoid overlaps
   */
  renderEventsWithLabelPositioning(t) {
    if (!this.svg) return;
    const n = this.calculateConnectorBounds(), r = [];
    for (const s of t) {
      const a = this.laneAssignments.find(
        (l) => l.itemId === s.id
      );
      if (!a) continue;
      const c = this.rowMapping.get(s.id);
      c !== void 0 && r.push({
        event: s,
        assignment: a,
        row: c,
        isRelatedEvent: !!s.relates_to
      });
    }
    const i = this.labelPositioner.calculatePlacements(
      r,
      n,
      {
        timeToX: (s) => this.timeToX(s),
        eventToY: (s, a, c) => this.eventToY(s, a, c)
      },
      {
        width: this.options.width,
        startTime: this.viewport.startTime,
        endTime: this.viewport.endTime
      }
    ), o = new Map(i.map((s) => [s.eventId, s]));
    for (const { event: s, row: a, isRelatedEvent: c } of r) {
      const l = o.get(s.id);
      l && this.renderEventWithSubLane(
        s,
        a,
        l.subLane,
        c,
        l.labelPosition
      );
    }
  }
  /**
   * Render an event with a specific sub-lane position
   * Used by the smart positioning algorithm
   */
  renderEventWithSubLane(t, n, r, i, o = "right") {
    if (!this.svg) return;
    const s = this.laneAssignments.find((h) => h.itemId === t.id);
    if (!s) return;
    const a = this.timeToX(s.startTime), c = 20, l = this.eventToY(n, r, i), u = Dm(a, l + c / 2, 4, {
      id: t.id,
      fill: "none",
      stroke: "#000",
      "stroke-width": 2
    });
    if (u.style.cursor = "pointer", u.addEventListener("click", (h) => {
      if (h.stopPropagation(), this.infoPopup) {
        const d = this.formatTimeForDisplay(t.time);
        let g = `${t.name}
${d}`;
        t.info && (g += `

${t.info}`), this.infoPopup.show(g, h.clientX, h.clientY);
      }
      this.emit("itemClick", t);
    }), this.svg.appendChild(u), o !== "hidden") {
      const h = ne(t.name, {
        x: o === "right" ? a + 8 : a - 8,
        y: l + c / 2 + 4,
        "text-anchor": o === "right" ? "start" : "end",
        "font-size": 10,
        fill: "#333",
        "pointer-events": "none"
      });
      this.svg.appendChild(h);
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
    const i = this.timeToX(n.startTime), s = this.timeToX(n.endTime) - i, a = this.timeToX(r.startTime), l = this.timeToX(r.endTime) - a;
    if (s < 10 || l < 10)
      return;
    const u = this.rowMapping.get(t.fromId), h = this.rowMapping.get(t.toId);
    if (u === void 0 || h === void 0) return;
    const g = this.data.periods.find((E) => E.id === t.fromId) ? "#000" : "#f587f3", p = Math.min(
      n.endTime,
      r.startTime
    ), w = this.timeToX(p), y = this.timeToX(r.startTime), v = this.rowToY(u, n.type) + this.options.constraints.periodHeight / 2, _ = this.rowToY(h, r.type) + this.options.constraints.periodHeight / 2, T = bm[this.options.connectorRenderer];
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
typeof globalThis.Temporal > "u" && (globalThis.Temporal = Wl);
export {
  nr as BIG_BANG_TIME,
  bm as CONNECTOR_RENDERERS,
  _m as DEFAULT_CONNECTOR,
  ou as DEFAULT_PERIOD_LAYOUT,
  iu as PERIOD_LAYOUT_ALGORITHMS,
  Hm as TimelineRenderer,
  su as assignLanes,
  Im as determineTimeScale,
  Ym as formatTime,
  zm as formatValidationResult,
  Pm as getLaneCount,
  J as normalizeTime,
  Sm as validateTimelineData
};
//# sourceMappingURL=thymeline.js.map
