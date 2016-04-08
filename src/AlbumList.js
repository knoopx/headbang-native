import React, {
  Component,
  View,
  ListView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import Artwork from './Artwork'

export default class AlbumList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1.id !== row2.id,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.albums) {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.albums)});
    }
  }

  render() {
    return (
       <ListView
         style={{flex: 1}}
         dataSource={this.state.dataSource}
         renderRow={this.renderRow.bind(this)}
         automaticallyAdjustContentInsets={false}
       />
    )
  }

  renderRow(album) {
    return (
      <TouchableOpacity onPress={() => this.props.onPress(album)}>
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
