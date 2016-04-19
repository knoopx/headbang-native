import React, {
  Component,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Navigator,
  ToastAndroid,
  BackAndroid,
  DrawerLayoutAndroid,
} from 'react-native'

import AlbumListScreen from './AlbumListScreen'
import AlbumScreen from './AlbumScreen'
import DownloadsScreen from './DownloadsScreen'

import NowPlaying from './NowPlaying'
import PlaybackService from './PlaybackService'
import LocalProvider from './LocalProvider'
import RemoteProvider from './RemoteProvider'
import List from './List'
import ListItem from './ListItem'

DownloadManager = require('./DownloadManager')
Subscribable = require("Subscribable")
Icon = require('react-native-vector-icons/FontAwesome')


export default class Headbang extends Component {
  static defaultProps = {
    providers: [
      new LocalProvider(),
      new RemoteProvider("Development", "http://192.168.1.216:3366"),
      new RemoteProvider("Home", "http://home.knoopx.net:3366")
    ]
  }

  constructor(props) {
    super(props);
    this.subscribtions = []
    this.subscribtions.push(PlaybackService.addListener("next", this.onNext.bind(this)));
    this.subscribtions.push(PlaybackService.addListener("play", this.onPlay.bind(this)));
    this.subscribtions.push(PlaybackService.addListener("pause", this.onPause.bind(this)));
    this.onPressHardwareBack = this.onPressHardwareBack.bind(this);
    BackAndroid.addEventListener('hardwareBackPress', this.onPressHardwareBack);
    this.state = {
      text: "",
      isPlaying: false
    }
  }

  componentWillMount() {
    this.setProvider(this.props.providers[0])
  }

  componentWillUnmount() {
    subscriptions.forEach((s) => s.remove());
    BackAndroid.removeEventListener('hardwareBackPress', this.onPressHardwareBack);
  }

  onPressHardwareBack() {
    this.refs.navigator.pop();
    return true;
  }

  onPlay() {
    this.setState({isPlaying: true})
  }

  onPause() {
    this.setState({isPlaying: false})
  }

  onNext(item) {
    this.setState({active: item})
  }

  setProvider(provider) {
    this.setState({provider: provider}, () => {
      this.refs.navigator.replace(this.getAlbumListRoute(provider));
    })
  }

  getAlbumListRoute(provider){
    return {
      title: `Albums (${provider.name})`,
      component: AlbumListScreen,
      props: {
        provider: this.state.provider,
        onPress: this.onPressAlbum.bind(this),
      }
    }
  }

  onProviderPress(provider) {
    this.refs.drawer.closeDrawer()
    this.setProvider(provider)
  }

  onPressAlbum(album) {
    this.refs.navigator.push({
      title: album.name,
      component: AlbumScreen,
      props: {
        provider: this.state.provider,
        album: album,
        onPressTrack: (track) => this.onPressPlayTrack(this.state.provider, album, track),
        onPressPlay: () => this.onPressPlayAlbum(this.state.provider, album),
        onPressEnqueue: () => this.onPressEnqueueAlbum(this.state.provider, album),
        onPressDownload: () => this.onPressDownloadAlbum(this.state.provider, album)
      }
    })
  }

  onPressDownloadAlbum(provider, album){
    ToastAndroid.show("Downloading...", ToastAndroid.SHORT);
    DownloadManager.add(provider, album)
  }

  onPressEnqueueAlbum(provider, album){
  }

  onPressPlayAlbum(provider, album) {
    PlaybackService.playAlbum(provider, album)
  }

  onPressPlayTrack(provider, album, track) {
    PlaybackService.playTrack(provider, album, track)
  }

  onPressPause() {
    PlaybackService.pause()
  }

  onPressPlay() {
    PlaybackService.play()
  }

  renderPlaylistItem(item, index) {
    return (
      <ListItem>
        <Text>{item.track.name}</Text>
      </ListItem>
    )
  }

  renderNowPlaying() {
    return (
      <List>{PlaybackService.playlist.map(this.renderPlaylistItem)}</List>
    )
  }

  renderNowPlayingHandler(){
    return (
      <NowPlaying active={this.state.active} isPlaying={this.state.isPlaying} onPressPause={this.onPressPause.bind(this)} onPressPlay={this.onPressPlay.bind(this)}></NowPlaying>
    )
  }

  render() {
    return (
      <DrawerLayoutAndroid ref="drawer" renderNavigationView={this.renderNavigationView.bind(this)} drawerWidth={300}>
        {this.renderNavigator()}
        {this.state.active && this.renderNowPlayingHandler()}
      </DrawerLayoutAndroid>
    );
  }

  renderScene(route, navigator) {
    props = route.props
    return (
      <View style={{flex: 1, backgroundColor: "white"}}>
        <route.component navigator={navigator} drawer={this.refs.drawer} {...props} />
      </View>
    )
  }

  renderNavigator() {
    return (
      <Navigator
        ref='navigator'
        initialRoute={this.getAlbumListRoute(this.state.provider)}
        renderScene={this.renderScene.bind(this)}
      />
    )
  }

  onPressDownloadMenuItem() {
    this.refs.drawer.closeDrawer();
    this.refs.navigator.replace({title: "Downloads", component: DownloadsScreen})
  }

  renderNavigationView() {
    return (
      <View style={{flex: 1, backgroundColor: "white"}}>
        <View style={{flexDirection: "row", backgroundColor: "#eee", paddingHorizontal: 16, alignItems: "center", justifyContent: "space-between"}}>
          <Text style={{fontSize: 16}}>Sources</Text>
          <TouchableOpacity style={{width: 48, height: 48, alignItems: "center", justifyContent: "center", marginRight: -16}}><Icon name="plus" size={24}/></TouchableOpacity>
        </View>
        <List>{this.props.providers.map(this.renderProviderItem.bind(this))}</List>
        <View style={{flexDirection: "row", backgroundColor: "#eee", paddingHorizontal: 16, height: 54, alignItems: "center", justifyContent: "space-between"}}>
          <Text style={{fontSize: 16}}>Other</Text>
        </View>
        <List>
          <TouchableOpacity onPress={this.onPressDownloadMenuItem.bind(this)}>
            <ListItem>
              <Icon name="cloud-download" size={24} style={{marginRight: 16}} />
              <Text style={{fontSize: 18, fontWeight: "bold"}}>Downloads</Text>
            </ListItem>
          </TouchableOpacity>
        </List>
      </View>
    )
  }

  renderProviderItem(provider, index) {
    return (
      <TouchableOpacity key={index} onPress={() => this.onProviderPress(provider)}>
        <ListItem onPress={this.props.onPause}>
          <Icon name={provider.iconName} size={24} style={{marginRight: 16}} />
          <Text style={{fontSize: 18, fontWeight: "bold"}}>{provider.name}</Text>
        </ListItem>
      </TouchableOpacity>
    )
  }
}
