export default class LocalProvider {
  constructor() {
    this.name = "Local"
    this.iconName = "music"
  }

  getAlbums(fn) {
    fn(null, [])
  }
}
