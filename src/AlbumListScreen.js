import React, {
  Component,
  View,
  ListView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import Artwork from './Artwork'

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
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1.id !== row2.id,
      })
    }
  }

  componentDidMount() {
    Axios.get("http://192.168.1.216:3366/albums").then((res) => {
      let albums = res.data.sort(orderFn.ascending);
      this.setState({
        albums: albums,
        dataSource: this.state.dataSource.cloneWithRows(albums)
      });
    }).catch((err) => {
      alert(err)
    });
  }

  handleChangeText(text) {
    let albums = filter(this.state.albums)({artistName: text}).sort(orderFn.ascending);
    this.setState({dataSource: this.state.dataSource.cloneWithRows(albums)});
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: "column"}}>
        <View style={{padding: 10, backgroundColor: "#eee"}}>
          <TextInput style={{backgroundColor: "white", height: 38}} text={this.state.filter} onChangeText={this.handleChangeText.bind(this)}></TextInput>
        </View>

         <ListView
           style={{flex: 1}}
           dataSource={this.state.dataSource}
           renderRow={this.renderRow}
           automaticallyAdjustContentInsets={false}
         />
      </View>
    )
  }

  renderRow(album) {
    return (
      <TouchableOpacity>
        <View style={{flex: 1, flexDirection: "row", paddingHorizontal: 8, paddingVertical: 4}}>
          <Artwork album={album} />
          <View>
            <Text style={{fontSize: 16, fontWeight: "bold"}}>{album.name}</Text>
            <Text style={{fontSize: 14}}>{album.artistName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
