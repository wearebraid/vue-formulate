/**
 * A fake uploader used by default.
 *
 * @param {File} file
 * @param {function} progress
 * @param {function} error
 * @param {object} options
 */
export default function (file, progress, error, options) {
  return new Promise((resolve, reject) => {
    const totalTime = (options.fauxUploaderDuration || 2000) * (0.5 + Math.random())
    const start = performance.now()
    /**
     * @todo - remove, intentional failure
     */
    const fail = (Math.random() > 0.5)
    const advance = () => setTimeout(() => {
      const elapsed = performance.now() - start
      const currentProgress = Math.min(100, Math.round(elapsed / totalTime * 100))
      progress(currentProgress)

      /**
       * @todo - remove, intentional failure
       */
      if (fail && currentProgress > 50) {
        return error('There was an error uploading the file.')
      }

      if (currentProgress >= 100) {
        return resolve({
          url: 'http://via.placeholder.com/350x150.png',
          name: file.name
        })
      } else {
        advance()
      }
    }, 20)
    advance()
  })
}
