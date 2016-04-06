import React, {
  Component,
  Image,
  View,
} from 'react-native';

export default class Artwork extends Component {
  render() {
    style = {
      width: 48, height: 48,
      marginRight: 15, borderRadius: 3,
      borderWidth: 1, borderColor: "gray"
    }
    if (this.props.album.artwork) {
      return <Image source={{uri: this.props.album.artwork}} style={style} />
    } else {
      return <View style={style}></View>
    };
  }
}
