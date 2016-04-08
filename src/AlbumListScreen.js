import React, {
  Component,
  View,
  ListView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import Artwork from './Artwork'
import AlbumList from './AlbumList'

RCTAudio = require('react-native-player')
Axios = require('axios')
firstBy = require('thenby')
filter = require("./filter")

const orderFn = {
  ascending: firstBy(((a) => a.artistName.length))
    .thenBy(((a) => a.artistName && a.artistName.sort()[0].toLocaleLowerCase()))
    .thenBy("year").thenBy(((a) => a.name.toLocaleLowerCase()))
    .thenBy("id"),
  recent: firstBy("indexedAt", -1).thenBy("id"),
  playCount: firstBy("playCount", -1).thenBy("id")
};

export default class AlbumListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      albums: [],
      matches: []
    }
  }

  componentDidMount() {
    Axios.get("http://192.168.1.216:3366/albums").then((res) => {
      let albums = res.data.sort(orderFn.ascending);
      this.setState({
        albums: albums,
        matches: albums
      });
    }).catch((err) => {
      alert(err)
    });
  }

  handleChangeText(text) {
    let albums = filter(this.state.albums)({artistName: text}).sort(orderFn.ascending);
    this.setState({matches: albums});
  }

  playAlbum(album) {
    Axios.get("http://192.168.1.216:3366/tracks", {params: {albumId: album.id}}).then((res) => {
      tracks = res.data
      RCTAudio.prepare(`http://192.168.1.216:3366/tracks/${tracks[0].id}/stream`, true)
      RCTAudio.start()
    }).catch((err) => {
      alert(err)
    });
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: "column"}}>
        <View style={{padding: 10, backgroundColor: "#eee"}}>
          <TextInput style={{backgroundColor: "white", height: 38}} text={this.state.filter} onChangeText={this.handleChangeText.bind(this)}></TextInput>
        </View>
        <AlbumList albums={this.state.matches} onPress={this.playAlbum}></AlbumList>
      </View>
    )
  }
}
