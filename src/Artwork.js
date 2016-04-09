import React, {
  Component,
  Image,
  View,
} from 'react-native';

export default class Artwork extends Component {
  static defaultProps = {
    size: 48
  }

  render() {
    style = {
      width: this.props.size, height: this.props.size,
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
