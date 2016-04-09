Axios = require('axios')

export default class RemoteProvider {
  constructor(name, endpoint) {
    this.name = name
    this.iconName = "cloud"
    this.endpoint = endpoint
  }

  getTrackStreamURL(track) {
    return `${this.endpoint}/tracks/${track.id}/stream`
  }

  getAlbumById(fn) {
  }

  getAlbums(fn) {
    Axios.get(`${this.endpoint}/albums`).then((res) => {
      fn(null, res.data);
    }, (err) => fn(err))
  }

  getAlbumTracks(album, fn) {
    Axios.get(`${this.endpoint}/tracks`, {params: {albumId: album.id}}).then((res) => {
      fn(null, res.data);
    }, (err) => fn(err));
  }
}
