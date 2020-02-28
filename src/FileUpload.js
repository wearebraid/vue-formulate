import nanoid from 'nanoid/non-secure'

/**
 * The file upload class holds and represents a file’s upload state durring
 * the upload flow.
 */
class FileUpload {
  /**
   * Create a file upload object.
   * @param {FileList} fileList
   * @param {object} context
   */
  constructor (input, context, options) {
    this.input = input
    this.fileList = input.files
    this.files = []
    this.options = options
    this.addFileList(this.fileList)
    this.context = context
  }

  /**
   * Produce an array of files and alert the callback.
   * @param {FileList}
   */
  addFileList (fileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const uuid = nanoid()
      const removeFile = function () {
        this.removeFile(uuid)
      }
      this.files.push({
        progress: false,
        error: false,
        complete: false,
        justFinished: false,
        name: file.name || 'file-upload',
        file,
        uuid,
        path: false,
        removeFile: removeFile.bind(this),
        previewData: false
      })
    }
  }

  /**
   * Check if the file has an.
   */
  hasUploader () {
    return !!this.context.uploader
  }

  /**
   * Check if the given uploader is axios instance.
   */
  uploaderIsAxios () {
    if (
      this.hasUploader &&
      typeof this.hasUploader.request === 'function' &&
      typeof this.hasUploader.get === 'function' &&
      typeof this.hasUploader.delete === 'function' &&
      typeof this.hasUploader.post === 'function'
    ) {
      return true
    }
    return false
  }

  /**
   * Get a new uploader function.
   */
  getUploader (...args) {
    if (this.uploaderIsAxios()) {
      const formData = new FormData()
      formData.append(this.context.name || 'file', args[0])
      return this.uploader.post(this.context.uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          args[1](Math.round((progressEvent.loaded * 100) / progressEvent.total))
        }
      })
        .catch(err => args[2](err))
    }
    return this.context.uploader(...args)
  }

  /**
   * Perform the file upload.
   */
  upload () {
    return new Promise((resolve, reject) => {
      if (!this.hasUploader) {
        return reject(new Error('No uploader has been defined'))
      }
      Promise.all(this.files.map(file => {
        return file.path ? Promise.resolve(file.path) : this.getUploader(
          file.file,
          (progress) => {
            file.progress = progress
            if (progress >= 100) {
              if (!file.complete) {
                file.justFinished = true
                setTimeout(() => { file.justFinished = false }, this.options.uploadJustCompleteDuration)
              }
              file.complete = true
            }
          },
          (error) => {
            file.progress = 0
            file.error = error
            file.complete = true
          },
          this.options
        )
      }))
        .then(results => resolve(results))
        .catch(err => { throw new Error(err) })
    })
  }

  /**
   * Remove a file from the uploader (and the file list)
   * @param {string} uuid
   */
  removeFile (uuid) {
    this.files = this.files.filter(file => file.uuid !== uuid)
    if (window) {
      const transfer = new DataTransfer()
      this.files.map(file => transfer.items.add(file.file))
      this.fileList = transfer.files
      this.input.files = this.fileList
    }
  }

  /**
   * load image previews for all uploads.
   */
  loadPreviews () {
    this.files.map(file => {
      if (!file.previewData && window && window.FileReader && /^image\//.test(file.file.type)) {
        const reader = new FileReader()
        reader.onload = e => Object.assign(file, { previewData: e.target.result })
        reader.readAsDataURL(file.file)
      }
    })
  }

  /**
   * Get the files.
   */
  getFileList () {
    return this.fileList
  }

  /**
   * Get the files.
   */
  getFiles () {
    return this.files
  }

  toString () {
    const descriptor = this.files.length ? this.files.length + ' files' : 'empty'
    return `FileUpload(${descriptor})`
  }
}

export default FileUpload
