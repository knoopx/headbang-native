import React, {
  Component,
  View,
  ListView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import Artwork from './Artwork'
import ListItem from './ListItem'

ProgressBar = require('react-native-progress/Bar')
shallowCompare = require('react-addons-shallow-compare')

DownloadManager = require('./DownloadManager')

export default class DownloadsScreen extends Component {
  constructor(props) {
    super(props);
    ds = new ListView.DataSource({rowHasChanged: this.rowHasChanged.bind(this) })

    this.state = {
      dataSource: ds.cloneWithRows(DownloadManager.active)
    }

    DownloadManager.emitter.addListener("update", this.onUpdate.bind(this))
  }

  onUpdate(){
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(DownloadManager.active)
    })
  }

  rowHasChanged(row1, row2) {
    return shallowCompare(this, row1, row2);
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

  renderRow(item) {
    return (
      <ListItem>
        <Artwork album={item.album} />
        <View ref="container">
          <View style={{flexDirection: "row", alignItems: "center", marginBottom: 2}}>
            <Text style={{fontSize: 14, fontWeight: "bold", marginRight: 8}}>{item.album.name}</Text>
            <Text style={{fontSize: 14}}>{item.album.artistName}</Text>
          </View>

          <Text style={{fontSize: 12, marginBottom: 2}}>Downloading track {item.pending} of {item.tracks.length}</Text>
          <ProgressBar progress={item.pending/item.tracks.length} width={310} />
        </View>
      </ListItem>
    )
  }
}
