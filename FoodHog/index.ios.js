'use strict';

var React = require('react-native');
var BoBFoodListView = require('./listview.js');
var Dimensions = require('Dimensions');
var {
  AppRegistry,
  NavigatorIOS,
  StyleSheet
} = React;

var FoodHog = React.createClass({
  render: function() {
    return (
       <NavigatorIOS
         style={styles.container}
         initialRoute={{
           component: BoBFoodListView,
           passProps:{
              navigatorref: this
           }
         }}
         navigationBarHidden={true}
       />
     );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

AppRegistry.registerComponent('FoodHog', () => FoodHog);
