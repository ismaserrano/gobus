/**
 * Launch Screen
 *  - Shows a nice loading screen whilst:
 *    - Preloading any specified app content
 *    - Checking if user is logged in, and redirects from there
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Alert,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Text
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  launchImage: {
    width: AppSizes.screen.width,
    height: AppSizes.screen.height,
  },
});

/* Component ==================================================================== */
class AppLaunch extends Component {
  static componentName = 'AppLaunch';

  static propTypes = {
    login: PropTypes.func.isRequired,
    getMapLines: PropTypes.func.isRequired,
    getFavourites: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    console.ignoredYellowBox = ['Setting a timer'];
  }

  componentDidMount = () => {
    // Show status bar on app launch
    StatusBar.setHidden(false, true);

    // Preload content here
    Promise.all([
      this.props.getMapLines(),
    ]).then(() => {
      // Once we've preloaded basic content,
      // - Try to authenticate based on existing token
      this.props.login()
        // Logged in, show index screen
        .then(() => Actions.app({ type: 'reset' }))
        // Not Logged in, show Login screen
        .catch(() => Actions.authenticate({ type: 'reset' }));
    }).catch(err => Alert.alert(err.message));
  }

  render = () => (
    <View style={[AppStyles.container]}>
    {/* <Text>Cargando</Text> */}
      <Image
        source={require('../../images/launch.jpg')}
        style={[styles.launchImage, AppStyles.containerCentered]}
      >
        <ActivityIndicator
          animating
          size={'large'}
          color={'#333'}
        />
      </Image>
    </View>
  );
}

/* Export Component ==================================================================== */
export default AppLaunch;
