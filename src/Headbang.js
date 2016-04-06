import React, {
  Component,
  Text,
  View,
  DrawerLayoutAndroid,
} from 'react-native';

import AlbumListScreen from './AlbumListScreen'

export default class Headbang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    }
  }

  renderNavigationView() {
    return (
      <View style={{flex: 1, backgroundColor: "white"}}>
        <Text>Hello</Text>
      </View>
    )
  }

  render() {
    return (
      <DrawerLayoutAndroid renderNavigationView={this.renderNavigationView.bind(this)} drawerWidth={300}>
        <AlbumListScreen tabLabel="Albums"></AlbumListScreen>
      </DrawerLayoutAndroid>
    );
  }
}
