import React, {
  Component,
  View,
  ListView,
  Text,
  TextInput,
  ToolbarAndroid,
  TouchableOpacity
} from 'react-native';

Spinner = require('react-native-spinkit')

export default class SpinnerOverlay extends Component {
  static defaultProps = {
    isVisible: false
  }

  render() {
    if (this.props.visible) {
      return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
          <Spinner isVisible={true} size={64} color="#ddd"/>
        </View>
      )
    } else {
      return this.props.children
    }
  }
}
