import React, {
  Component,
  View,
  ListView,
  Text,
  TextInput,
  ToolbarAndroid,
  TouchableOpacity
} from 'react-native';

import Artwork from './Artwork'
import AlbumList from './AlbumList'
import PlaybackService from './PlaybackService'
import SpinnerOverlay from "./SpinnerOverlay"

Icon = require('react-native-vector-icons/FontAwesome')
filter = require("./filter")
firstBy = require('thenby')

const orderFn = {
  ascending: firstBy(((a) => a.artistName.length))
    .thenBy(((a) => a.artistName && a.artistName.sort()[0].toLocaleLowerCase()))
    .thenBy("year").thenBy(((a) => a.name.toLocaleLowerCase()))
    .thenBy("id"),
  recent: firstBy("indexedAt", -1).thenBy("id"),
  playCount: firstBy("playCount", -1).thenBy("id")
};

export default class AlbumListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        artistName: "",
        starred: undefined
      },
      isSearching: false,
      isLoading: false,
      albums: [],
      matches: []
    }
  }

  componentWillMount() {
    this.fetchAlbums(this.props.provider)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider != this.props.provider) {
      this.fetchAlbums(nextProps.provider)
    }
  }

  fetchAlbums(provider) {
    this.setState({isLoading: true}, () => {
      provider.getAlbums((err, albums) => {
        if (err) {
          this.setState({albums: [], matches: [], isLoading: false});
          ToastAndroid.show(err.toString(), ToastAndroid.LONG);
        } else {
          albums = albums.sort(orderFn.ascending)
          this.setState({albums: albums, matches: albums, isLoading: false});
        }
      });
    });
  }

  onChangeSearchQuery(text) {
    this.applyFilter({artistName: text})
  }

  onClickNavicon() {
    this.props.drawer.openDrawer()
  }

  onPressSearch() {
    if (this.state.isSearching) {
      this.setState({isSearching: false})
    } else {
      this.setState({isSearching: true}, () => {
        this.refs.input.focus()
      })
    }
  }

  onCancelSearch() {
    this.setState({isSearching: false})
    this.applyFilter({artistName: ""})
  }

  applyFilter(nextFilter) {
    nextFilter = Object.assign(Object.assign({}, this.state.filter), nextFilter)
    this.refs.albumList.scrollTo(0)
    this.setState({
      filter: nextFilter,
      matches: filter(this.state.albums)(nextFilter).sort(orderFn.ascending)
    });
  }

  renderSearch(){
    if (this.state.isSearching) {
      return <TextInput ref="input" style={{backgroundColor: "transparent", fontSize: 16}} text={this.state.filter.artistName} onChangeText={this.onChangeSearchQuery.bind(this)}></TextInput>
    } else {
      return <Text style={{fontSize: 22, fontWeight: "bold", color: "black"}}>Headbang</Text>
    }
  }

  onPressStarredToggle() {
    if (this.state.filter.starred) {
      this.applyFilter({starred: null})
    } else {
      this.applyFilter({starred: true})
    }
  }

  renderSearchButon(){
    if (this.state.isSearching) {
      return (
        <TouchableOpacity onPress={this.onCancelSearch.bind(this)} style={{width: 32, height: 32, alignItems: "center", justifyContent: "center"}}>
          <Icon name="times" size={24} />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={this.onPressSearch.bind(this)} style={{width: 32, height: 32, alignItems: "center", justifyContent: "center"}}>
          <Icon name="search" size={24} />
        </TouchableOpacity>
      )
    }
  }

  render() {
    return (
      <SpinnerOverlay visible={this.state.isLoading}>
        <View style={{flex: 1, backgroundColor: "white"}}>
          <View style={{height: 50, flexDirection: "row", paddingHorizontal: 8, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#ddd"}}>
            <TouchableOpacity onPress={this.onClickNavicon.bind(this)} style={{width: 32, height: 32, alignItems: "center", justifyContent: "center"}}>
              <Icon name="navicon" size={24} color="black" />
            </TouchableOpacity>
            <View style={{flex: 1, paddingHorizontal: 8}}>{this.renderSearch()}</View>
            <Text style={{fontStyle: "italic", marginRight: 8}}>{this.state.matches.length} album(s)</Text>
            <TouchableOpacity onPress={this.onPressStarredToggle.bind(this)} style={{width: 32, height: 32, alignItems: "center", justifyContent: "center"}}>
              <Icon name={this.state.filter.starred ? "star" : "star-o"} size={24} />
            </TouchableOpacity>
            {this.renderSearchButon()}
          </View>
          <AlbumList ref="albumList" albums={this.state.matches} onPress={this.props.onPress}></AlbumList>
        </View>
      </SpinnerOverlay>
    )
  }
}
