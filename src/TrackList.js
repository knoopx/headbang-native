import React, {
  Component,
  View,
  ListView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import ListItem from './ListItem'

export default class TrackList extends Component {
  static defaultProps = {
    tracks: []
  }

  constructor(props) {
    super(props);
    ds = new ListView.DataSource({rowHasChanged: this.rowHasChanged.bind(this) })
    this.state = {
      dataSource: ds.cloneWithRows(props.tracks)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tracks) {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(nextProps.tracks)});
    }
  }

  rowHasChanged(row1, row2) {
    return row1.id !== row2.id;
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

  renderRow(track) {
    return (
      <TouchableOpacity onPress={() => this.props.onPressTrack(track)}>
        <ListItem>
          <Text style={{fontSize: 16, width: 20, textAlign: "right", marginRight: 16}}>{track.number}</Text>
          <Text style={{fontSize: 16, fontWeight: "bold", marginRight: 8}}>{track.name}</Text>
            <Text style={{fontSize: 16, marginRight: 16}}>{track.artistName}</Text>
        </ListItem>
      </TouchableOpacity>
    )
  }
}
