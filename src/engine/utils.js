const defaultHash = (...a) => a.reduce((acc, cur) => cur.toString() + '_' + acc, '')

export const memoize = (fn, hash = defaultHash) => {
  let cache = {}
  const memoized = (...args) => {
    const hsh = hash(...args)
    const cacheVal = cache[hsh]
    if (cacheVal) {
      return cacheVal
    } else {
      cache[hsh] = fn(...args)
      return cache[hsh]
    }
  }
  memoized._memoizeCache = cache
  return memoized
}
