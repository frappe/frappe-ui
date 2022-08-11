export default (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
