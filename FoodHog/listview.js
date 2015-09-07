'use strict';

var React = require('react-native');
var SearchBar = require('react-native-search-bar');
var { Icon, } = require('react-native-icons');
var ItemView = require('./ItemView.js');
var {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
  TextInput
} = React;
var Dimensions = require('Dimensions');
var foursquare_explore_url = "https://api.foursquare.com/v2/venues/explore";

var CLIENT_ID = '445GPRYZLBSIKBZQNDSUOWZDKIBDCOXQ5S41HVUNXNPGP1HB';
var CLIENT_SECRET = 'WESL233VHPIYPJV1MC41AGFHHSUCRORBGJIJ3OJGCNGWA3HO';

var THUMB_URLS = [];

var Bobblefoodie = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds,
    };
  },

  clearListView: function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.setState({
        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
      });
      return resolve(true);
    });
  },

  fetchData: function(lat, long, searchString) {
      searchString = searchString ? searchString : 'restaurants';
      lat = lat ? lat : '34.2077';
      long = long ? long : '-118.2000';
      var foursquare_search_url = foursquare_explore_url + '?client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20130815&ll='+parseFloat(lat).toFixed(2)+','+parseFloat(long).toFixed(2)+'&query='+searchString+'&venuePhotos=1';
      THUMB_URLS = [];
      fetch(foursquare_search_url)
      .then((response) => response.json())
      .then((responseData) => {
        responseData.response.groups.map(function(groups) {
          groups.items.map(function(item){
            item.venue.photos.groups.map(function(imagegroup) {
              imagegroup.items.map(function(itemimage){
                var imageprefix = itemimage.prefix;
                var imagesuffix = itemimage.suffix;
                var width = itemimage.width;
                var height = itemimage.height;
                var imageURL = imageprefix+width+'x'+height+imagesuffix;
                THUMB_URLS.push({
                  name: item.venue.name,
                  photo: imageURL,
                  itemdetails: item
                });
              });
            });
          });
        });
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(THUMB_URLS)
        });
      });
  },

  componentDidMount: function() {
    var self = this;
    this.getCurrentLocation().then(function(location) {
      self.clearListView().then(function(data) {
        self.fetchData(location.coords.latitude, location.coords.longitude);
      });
    }).catch(function(err) {
      console.log(err);
      /*
      *  Getting the data for Santa Momica CA when thereis an error.
      *  Mostly this should not happen as GPS is pretty accurate
      */
      self.clearListView().then(function(data) {
        self.fetchData('34.02', '-118.48');
      });
    });
  },

  getCurrentLocation: function() {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        function(initialPosition) {
          return resolve(initialPosition);
        },
        function(error) {
          return reject(error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
      );
    });
  },

  _renderRow: function(rowData: string, sectionID: number, rowID: number) {
    var imgSource = {
      uri: THUMB_URLS[rowID].photo,
    };
    return (
      <TouchableHighlight style={styles.row} onPress={() => this._pressRow(rowID)}>
        <View style={styles.row}>
          <View style={styles.row}>
            <Image style={styles.thumb} source={imgSource} >
              <Text style={styles.text}>
                {THUMB_URLS[rowID].name}
              </Text>
            </Image>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  },

  _pressRow: function(rowID: number) {
    var self = this;
    this.props.navigator.push({
      component: ItemView,
      passProps : {
        navigatorref : this,
        item : THUMB_URLS[rowID]
      }
    });
  },

  _onChangeText: function(text) {
  },

  _onSearchButtonPressed: function(event) {
    var searchtext = event.nativeEvent.text;
    var self = this;
    this.getCurrentLocation().then(function(location) {
      self.fetchData(location.coords.latitude, location.coords.longitude, searchtext);
    }).catch(function(err) {
      console.log(err);
      /*
      *  Getting the data for Santa Momica CA when thereis an error.
      *  Mostly this should not happen as GPS is pretty accurate
      */
      self.fetchData('34.02', '-118.48', searchtext);
    });
  },

  _onCancelButtonPressed: function() {

  },
  /*
  <SearchBar
    style={styles.seachbar}
    placeholder='Search'
    onChangeText={this._onChangeText}
    onSearchButtonPress={this._onSearchButtonPressed}
    onCancelButtonPress={this._onCancelButtonPressed}
  />
  */
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.menubar}>
          <TouchableHighlight
            style={styles.backbutton}
            underlayColor="transparent">
             <Icon
               name='fontawesome|user'
               size={25}
               color='#fff'
               style={styles.backbutton}
               />
          </TouchableHighlight>
          <TextInput
            style={styles.searchbar}
            placeholder='Search Restaurants'
            placeholderTextColor='#484848'
            autoFocus={true}
            onSubmitEditing={this._onSearchButtonPressed.bind(this)}>
          </TextInput>
        </View>
        <ListView
          style={styles.listview}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  listview: {
    top:0,
  },
  searchbar: {
    height: 26,
    width: Dimensions.get("window").width - 60,
    borderWidth: 0.5,
    borderColor: '#fff',
    fontSize: 13,
    backgroundColor: '#fff',
    marginTop: 22,
    borderRadius: 10,
    padding:5
  },
  thumb: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width/2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menubar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#60ab59',
    width: Dimensions.get("window").width,
  },
  backbutton: {
    width: 50,
    height: 50,
    marginTop:4
  }
});

module.exports = Bobblefoodie;
//AppRegistry.registerComponent('Bobblefoodie', () => Bobblefoodie);
