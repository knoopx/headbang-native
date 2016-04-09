import React, {
  Component,
  TouchableOpacity,
  Text,
  View,
  Navigator,
  ToastAndroid,
  DrawerLayoutAndroid,
} from 'react-native';

export default class List extends Component {
  render() {
    return (
      <View>{this.props.children}</View>
    )
  }
}
