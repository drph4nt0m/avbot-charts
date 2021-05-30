module.exports = {
  arrayIndexString: (i, array) => `[${String(i + 1).padStart(array.length.toString().length, '0')}/${array.length}]`
}