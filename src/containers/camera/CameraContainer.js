/**
 * List of Recipes for a Meal Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  Alerts,
  Button,
  Card,
  Spacer,
  Text,
  List,
  ListItem
} from '@components/ui/';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ListView,
} from 'react-native';

import { AppColors, AppStyles } from '@theme/';

// Actions
import * as FavouritesActions from '@redux/favourites/actions';
import * as LineActions from '@redux/map/actions';

// Components
import Loading from '@components/general/Loading';

// Libs
import Camera from 'react-native-camera';
import Sound from 'react-native-sound';
import { AppSizes } from '../../theme/index';


const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
  stopToLoad: state.map.stopToLoad ? state.map.stopToLoad : null,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  loadStop: LineActions.loadStop
};

/* Component ==================================================================== */
class CameraContainer extends Component {
  static componentName = 'CameraContainer';

  static propTypes = {
    user: PropTypes.shape({
      uid: PropTypes.string,
    }),
    loadStop: PropTypes.func.isRequired,
  }

  static defaultProps = {
    user: null,
    loadStop: null,
  }

  constructor(props) {
    super();

    this.props = props;
    this.state = {
      loading: false,
      qrcode: null,
      scanned: false,
      soundFx: null
    };
    Sound.setCategory('Playback');
  }

  componentWillMount(props) {
    console.log(props)
  }

  componentWillReceiveProps(props) {

  }

  onBarCodeRead(e) {
    const self = this;
    if (!this.state.qrcode && e.type === 'org.iso.QRCode') {
      this.setState({qrcode: e.data, scanned: true});      
      // this.state.soundFx.play();
      let soundEff = new Sound('qr-scanned.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          alert(error.message);
        } else {
          // loaded successfully
          soundEff.play();
        }
      });
      let urlStopArray = String(e.data).split("parada=");
      let stopNum = urlStopArray[urlStopArray.length-1];
      this.setState({qrStop: stopNum, loading: true});
      // let stopNum = "14168";
      this.props.loadStop(stopNum)
      .then((response) => {
        if (response.data){
          Actions.map();
        } else {
          alert('¡No corresponde con ninguna parada!')
        }
      });
      setTimeout(function(){
        self.setState({qrcode: null, loading: false});
      }, 3000);
    }
  }

  render = () => {
    const { scanned } = this.state;

    if (this.state.loading) return <Loading text={'Cargando...'} />;
    return (
      <View style={[AppStyles.container]}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          {/* <Text onPress={this.onBarCodeRead.bind(this)}>[SIMULATE]</Text> */}
          {/* <View style={{width: 200, height: 200, position: 'absolute', top: (AppSizes.screen.height / 3) - (AppSizes.tabbarHeight), left: (AppSizes.width / 2) - 50, borderWidth: 3, borderColor: '#FFF000', opacity: 0.5}}></View> */}
        </Camera>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraContainer);
