import nanoid from 'nanoid'

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
  constructor (fileList, context, options) {
    this.fileList = fileList
    this.files = []
    this.options = options
    this.setFileList(fileList)
    this.context = context
  }

  /**
   * Produce an array of files and alert the callback.
   * @param {FileList}
   */
  setFileList (fileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i)
      this.files.push({
        progress: 0,
        name: file.name || 'file-upload',
        file: file,
        uuid: nanoid()
      })
    }
  }

  /**
   * Check if the file has an.
   */
  hasUploader () {
    return !!this.context.uploader
  }

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
        return this.getUploader(
          file.file,
          (progress) => { file.progress = progress },
          (error) => reject(new Error(error)),
          this.options
        )
      }))
        .then(results => resolve(results))
        .catch(err => { throw new Error(err) })
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
}

export default FileUpload
