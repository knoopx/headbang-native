export default class LocalProvider {
  constructor() {
    this.name = "Local"
    this.iconName = "music-note"
  }

  getAlbums(fn) {
    fn(null, [])
  }
}
