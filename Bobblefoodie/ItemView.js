'use strict'

var React = require('react-native');
var { Icon, } = require('react-native-icons');
var Dimensions = require('Dimensions');
var SubMenuView = require('./SubMenuView.js');
var {
  StyleSheet,
  View,
  Text,
  MapView,
  ListView,
  TouchableHighlight
} = React;

var FS_BASE_URL = 'https://api.foursquare.com/v2/venues/';
var CLIENT_ID = '445GPRYZLBSIKBZQNDSUOWZDKIBDCOXQ5S41HVUNXNPGP1HB';
var CLIENT_SECRET = 'WESL233VHPIYPJV1MC41AGFHHSUCRORBGJIJ3OJGCNGWA3HO';
var MENU_CATEGORIES = [];

var ItemView = React.createClass({
  getInitialState : function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds,
      mapannotations : null,
      region: null,
      titletext: ''
    }
  },

  componentDidMount : function() {
      var annotationsarr  = [];
      var self = this;
      MENU_CATEGORIES = [];
      console.log("the item is ", self.props.item);
      self.setState({
        titletext: self.props.item.name
      });
      var MENU_URL = FS_BASE_URL + self.props.item.itemdetails.venue.id + '/menu' + '?client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20130815';
      fetch(MENU_URL)
      .then((response) => response.json())
      .then((responseData) => {
        responseData.response.menu.menus.items.map(function(item){
          item.entries.items.map(function(subitem) {
            console.log(subitem.name);
            MENU_CATEGORIES.push(subitem);
          });
        });
        self.setState({
          dataSource: this.state.dataSource.cloneWithRows(MENU_CATEGORIES)
        });
        self.setState({
          mapannotations : self._getAnnotations(self.props.item.itemdetails.venue),
          region: {
            latitude: parseFloat(self.props.item.itemdetails.venue.location.lat),
            longitude: parseFloat(self.props.item.itemdetails.venue.location.lng),
            title: 'Restaurant',
            latitudeDelta: 0.001,
            longitudeDelta: 0.001
          }
        });
      });
  },

  _pressRow: function(rowdata: number, rowID: number) {
    var self = this;
    this.props.navigator.push({
      component: SubMenuView,
      passProps : {
        navigatorref : self,
        menucategory : rowdata,
        menucategorytitle : MENU_CATEGORIES[rowID].name
      }
    });
  },

  _renderRow: function(rowData: string, sectionID: number, rowID: number) {
    return (
      <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" style={styles.row} onPress={() => this._pressRow(MENU_CATEGORIES[rowID], rowID)}>
        <View style={styles.row}>
          <Text style={styles.text}>
            {MENU_CATEGORIES[rowID].name}
          </Text>
        </View>
      </TouchableHighlight>
    );
  },

  _getAnnotations: function(item) {
    return [{
      longitude: parseFloat(item.location.lat),
      latitude: parseFloat(item.location.lng),
      title: item.name,
      animateDrop: true
    }]
  },

  _goBack: function() {
    this.props.navigator.pop();
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.menubar}>
          <TouchableHighlight
            style={styles.backbutton}
           underlayColor="transparent"
           onPress={this._goBack.bind(this)}>
           <Icon
             name='fontawesome|angle-left'
             size={40}
             color='#fff'
             style={styles.backbutton}
             />
         </TouchableHighlight>
         <Text style={styles.titletext}>
            {this.state.titletext}
         </Text>
         <TouchableHighlight
             style={styles.backbutton}
            underlayColor="transparent"
            onPress={() => alert('Beer!')}>
            <Icon
              name='fontawesome|bars'
              size={20}
              color='#fff'
              style={styles.backbutton}
              />
          </TouchableHighlight>
        </View>
        <MapView style={styles.map}
          annotations={this.state.mapannotations || undefined}
          region={this.state.region || undefined}
          showsUserLocation={false}
          scrollEnabled={true}
          pitchEnabled={true}
        />
        <ListView
          style={styles.listview}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container : {
    flex : 1,
    width : Dimensions.get("window").width,
    height : Dimensions.get("window").height
  },
  map: {
    flex:0,
    width : Dimensions.get("window").width,
    height : Dimensions.get("window").width * 0.6
  },
  listview: {
    flex:1,
  },
  menubar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'#60ab59'
  },
  backbutton: {
    textAlign:'left',
    width: 50,
    height: 50,
    marginTop:3
  },
  row: {
    flexDirection: 'column',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.2)',
    height: 40
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'black',
    fontFamily: 'Helvetica',
    marginLeft: 5,
  },
  titletext: {
    color: '#fff',
    fontFamily: 'Helvetica',
    marginTop: 10,
    fontSize: 18,
    width: 180,
    textAlign: 'center'
  }
});

module.exports = ItemView;
