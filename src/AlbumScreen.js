import React, {
  Component,
  View,
  ListView,
  Text,
  TextInput,
  ToolbarAndroid,
  TouchableOpacity
} from 'react-native';

import SpinnerOverlay from "./SpinnerOverlay"
import Artwork from './Artwork'
import TrackList from './TrackList'
import PlaybackService from './PlaybackService'

Icon = require('react-native-vector-icons/FontAwesome')


export default class AlbumScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      isLoading: false
    }
  }

  componentWillMount() {
    this.setState({isLoading: true}, () => {
      this.props.provider.getAlbumTracks(this.props.album, (err, tracks) => {
        if (err) {
          ToastAndroid.show(err.toString(), ToastAndroid.LONG)
        } else {
          this.setState({tracks: tracks.sortBy("number"), isLoading: false});
        }
      });
    })
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: "white"}}>
        <View style={{flexDirection: "row", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd", alignItems: "center"}}>
          <Artwork album={this.props.album} size={96} />
          <View>
            <Text style={{fontSize: 20, fontWeight: "bold", color: "black"}}>{this.props.album.name}</Text>
            <Text style={{fontSize: 20, marginBottom: 16}}>{this.props.album.artistName}</Text>
            <Text>{this.props.album.year} {this.props.album.label}</Text>
          </View>
        </View>
        <View style={{flexDirection: "row", paddingHorizontal: 48, borderBottomWidth: 1, borderBottomColor: "#ddd", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fbfbfb"}}>
          <TouchableOpacity onPress={this.props.onPressDownload} style={{width: 48, height: 48, alignItems: "center", justifyContent: "center"}}>
            <Icon name="cloud-download" size={32} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onPressStar} style={{width: 48, height: 48, alignItems: "center", justifyContent: "center"}}>
            <Icon name="star" size={32} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onPressPlay} style={{width: 48, height: 48, alignItems: "center", justifyContent: "center"}}>
            <Icon name="play" size={32} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onPressEnqueue} style={{width: 48, height: 48, alignItems: "center", justifyContent: "center"}}>
            <Icon name="plus" size={32} />
          </TouchableOpacity>
        </View>
        <SpinnerOverlay visible={this.state.isLoading}>
          <TrackList tracks={this.state.tracks} onPressTrack={this.props.onPressTrack} />
        </SpinnerOverlay>
      </View>
    )
  }
}
