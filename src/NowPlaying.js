import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  ListView,
  TouchableOpacity,
  DrawerLayoutAndroid,
  ToolbarAndroid
} from 'react-native';

Icon = require('react-native-vector-icons/FontAwesome')

import Artwork from './Artwork'

export default class NowPlaying extends Component {
  static defaultProps = {
    isPlaying: false
  }

  renderButton() {
    if (this.props.isPlaying) {
      return <Icon name="pause" size={24} />
    } else {
      return <Icon name="play" size={24} />
    }
  }

  onPressButton() {
    if (this.props.isPlaying) {
      this.props.onPressPause()
    } else {
      this.props.onPressPlay()
    }
  }

  render() {
    return (
      <View style={{flexDirection: "row", padding: 8, alignItems: "center", borderTopColor: "#ddd", borderTopWidth: 1}}>
        <Artwork album={this.props.active.album} size={64}></Artwork>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: "bold", fontSize: 16}}>{this.props.active.track.name}</Text>
          <Text style={{fontSize: 16}}>{this.props.active.album.name}</Text>
          <Text style={{fontSize: 16}}>{this.props.active.album.artistName}</Text>
        </View>
        <TouchableOpacity style={{width: 64, height: 64, alignItems: "center", justifyContent: "center"}} onPress={this.onPressButton.bind(this)}>{this.renderButton()}</TouchableOpacity>
      </View>
    )
  }
}
