const {DeviceEventEmitter} = require('react-native')
const RCTAudio = require('react-native-player')
const EventEmitter = require("EventEmitter")

class PlaybackService {
  constructor(){
    this.subscriptions = []
    this.emitter = new EventEmitter()
    this.playlist = []
    this.addListener = this.emitter.addListener.bind(this.emitter)
    // DeviceEventEmitter.addListener('error', this.onError)
    this.subscriptions.push(DeviceEventEmitter.addListener('end', this.onEnd.bind(this)))
    // DeviceEventEmitter.addListener('idle', this.onIdle)
    // DeviceEventEmitter.addListener('buffering', this.onBuffering)
    this.subscriptions.push(DeviceEventEmitter.addListener('ready', this.onReady.bind(this)))
    // DeviceEventEmitter.addListener('preparing', this.onPreparing.bind(this))
  }

  componentWillUnmount() {
    this.subscriptions.forEach((subscription) => subscription.remove())
  }

  onReady() {
  }

  onEnd() {
    this.emitter.emit("pause")
  }

  playTrack(provider, album, track) {
    streamURL = provider.getTrackStreamURL(track)
    this.emitter.emit("play")
    RCTAudio.prepare(streamURL, true)
    this.emitter.emit("next", {track: track, album: album, trackURL: streamURL, provider: provider})
  }

  playAlbum(provider, album) {
    provider.getAlbumTracks(album, (err, tracks) => {
      if (err) {
        ToastAndroid.show(err.toString(), ToastAndroid.LONG)
      } else {
        this.playTrack(provider, album, tracks[0])
      }
    });
  }

  pause() {
    RCTAudio.pause()
    this.emitter.emit("pause")
  }

  play() {
    RCTAudio.start()
    this.emitter.emit("play")
  }
}

module.exports = new PlaybackService();
