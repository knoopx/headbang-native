import React, {
  Component,
  TouchableOpacity,
  Text,
  View,
  Navigator,
  ToastAndroid,
  DrawerLayoutAndroid,
} from 'react-native';

export default class ListItem extends Component {
  render() {
    return (
      <View style={{flexDirection: "row", paddingHorizontal: 16, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: "#ddd", height: 57, alignItems: "center"}} {...this.props}></View>
    )
  }
}
