let EventEmitter = require("EventEmitter")
let Async = require("async")
let FS = require('react-native-fs')

import {ToastAndroid} from 'react-native'

class DownloadManager extends EventEmitter {
  constructor(queue) {
    super()

    this.active = []
    this.emitter = new EventEmitter();

    this.trackQueue = Async.queue((item) => {
      streamURL = item.download.provider.getTrackStreamURL(item.track)
      path = ["/sdcard/Music", item.download.album.basename, item.track.basename].join("/")
      FS.mkdir(["/sdcard/Music", item.download.album.basename].join("/"))
      .then(() => {
        return FS.downloadFile(streamURL, path).then((res) => {
          item.download.pending = item.item.pending - 1;
          this.emitter.emit("update")
        })
      }, (err) => {
        alert(err)
      });
    }, 4)

    this.albumQueue = Async.queue((item) => {
      this.active.push(item)
      this.emitter.emit("update")

      item.provider.getAlbumTracks(item.album, (err, tracks) => {
        Object.assign(item, {
          tracks: tracks,
          pending: tracks.length
        })
        this.emitter.emit("update")

        if (err) {
          ToastAndroid.show(err.data, ToastAndroid.LONG)
        } else {
          tracks.map((track) => this.trackQueue.push({download: item, track: track}))
        }
      });
    }, 1)
  }

  add(provider, album) {
    item = {
      provider: provider,
      album: album,
      tracks: 0,
      pending: -1
    }

    this.albumQueue.push(item)
  }
}

module.exports = new DownloadManager()
