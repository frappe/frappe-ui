export default (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result == null) {
        reject(new Error('FileReader result is null'))
      } else if (typeof reader.result === 'string') {
        resolve(reader.result)
      }
    }
    reader.readAsDataURL(file)
  })
}
