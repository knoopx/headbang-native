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

export default class ConnectScreen extends Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
        <Text style={{fontSize: 18}}>Host</Text>
        <TextInput
          style={{borderWidth: 1, borderColor: 'gray'}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text} />
      </View>
    )
  }
}
