'use strict'

var React = require('react-native');
var { Icon, } = require('react-native-icons');
var Dimensions = require('Dimensions');
var {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableHighlight
} = React;

var FS_BASE_URL = 'https://api.foursquare.com/v2/venues/';
var CLIENT_ID = '445GPRYZLBSIKBZQNDSUOWZDKIBDCOXQ5S41HVUNXNPGP1HB';
var CLIENT_SECRET = 'WESL233VHPIYPJV1MC41AGFHHSUCRORBGJIJ3OJGCNGWA3HO';
var MENU_ITEMS = [];

var SubMenuView = React.createClass({
  getInitialState : function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds,
      titletext: ''
    }
  },

  componentDidMount : function() {
    var annotationsarr  = [];
    var self = this;
    MENU_ITEMS = [];
    this.setState({
      titletext: self.props.menucategorytitle
    });
    self.props.menucategory.entries.items.map(function(menuitem) {
      MENU_ITEMS.push(menuitem);
    });
    this.setState({
      dataSource: self.state.dataSource.cloneWithRows(MENU_ITEMS)
    });
  },

  _pressRow: function(rowdata: number) {
    var self = this;
  },

  _renderRow: function(rowData: string, sectionID: number, rowID: number) {
    return (
      <TouchableHighlight underlayColor="rgba(0,0,0,0.2)" onPress={() => this._pressRow(MENU_ITEMS[rowID])}>
        <View style={styles.row}>
          <Text style={styles.text}>
            {MENU_ITEMS[rowID].name}
          </Text>
          <Text style={styles.pricetext}>
            {MENU_ITEMS[rowID].price}
          </Text>
        </View>
      </TouchableHighlight>
    );
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
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container : {
    width : Dimensions.get("window").width,
    height : Dimensions.get("window").height
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.2)',
    height: 40,
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    color: 'black',
    paddingLeft:5,
    fontFamily: 'Helvetica',
  },
  pricetext: {
    fontSize: 14,
    paddingRight:5,
    textAlign: 'right',
    color: 'blue',
    fontFamily: 'Helvetica',
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
  titletext: {
    color: '#fff',
    fontFamily: 'Helvetica',
    marginTop: 10,
    fontSize: 18,
    width: 180,
    textAlign: 'center'
  }
});

module.exports = SubMenuView;
