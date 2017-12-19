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
import { Text } from '@ui'
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

// Actions
import * as LineActions from '@redux/map/actions';

// Components
import Loading from '@components/general/Loading';
import Map from './Map';
import DOMParser from 'react-native-html-parser';
import TxtDecoder from 'text-encoding';

/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  mapLines: state.map.mapLines || [],
  mapLineStops: state.map.mapLineStops || [],
  user: state.user,
  favourites: state.map.favourites ? state.map.favourites : [],
  line: state.map.line ? state.map.line : null,
  favStopToLoad: state.map.stopToLoad ? state.map.stopToLoad : null,
  onPressFavourite: state.map.onPressFavourite,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  getMapLines: LineActions.getMapLines,
  getMapLineStops: LineActions.getMapLineStops,
  getFavourites: LineActions.getFavourites,
  replaceFavourites: LineActions.replaceFavourites,
  loadStop: LineActions.loadStop
};

const baseDomain = 'http://www.vitrasa.es';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  favourite: {
    position: 'absolute',
    top: -45,
    right: 0,
  },
});

/* Component ==================================================================== */
class MapContainer extends Component {
  static componentName = 'MapContainer';

  static propTypes = {
    mapLines: PropTypes.arrayOf(PropTypes.object),
    mapLineStops: PropTypes.arrayOf(PropTypes.object),
    getMapLines: PropTypes.func.isRequired,
    getMapLineStops: PropTypes.func.isRequired,
    getFavourites: PropTypes.func.isRequired,
    onPressFavourite: PropTypes.func,
    isFavourite: PropTypes.bool,
    replaceFavourites: PropTypes.func.isRequired,
    favourites: PropTypes.arrayOf(PropTypes.number),
    user: PropTypes.shape({
      uid: PropTypes.string,
    }),
    loadStop: PropTypes.func.isRequired,
  }

  static defaultProps = {
    mapLines: [],
    mapLineStops: [],
    onPressFavourite: null,
    isFavourite: null,
    favourites: [],
    user: null,
    favStopToLoad: null,
    loadStop: null,
  }

  state = {
    loading: false,
    mapLines: [],
  }

  constructor(props) {
    super(props);

    this.props = props;
    this.state = {
      navigation: {
        index: 0,
        routes: []
      },
      loading: true,
      stop: null,
      isFavourite: null,
      favStopToLoad: null,
      line: null,
      onPressFavourite: this.onPressFavourite
    };
  }

  componentDidMount = () => {
    // this.fetchMapLines();
    this.setState({ error: null, loading: false, mapLines: this.props.mapLines });
  }

  componentWillUnmount = () => {
    // if (this.props.user && this.props.user.uid) {
    //   this.fetchFavourites();
    // }
    this.setState({favStopToLoad: null});
  }
  componentWillReceiveProps = (props) => {
    // console.log(props)
    this.setState({favStopToLoad: props.favStopToLoad});
    // if (props.favStopToLoad && this.state.favStopToLoad && (props.favStopToLoad.id != this.state.favStopToLoad.id)) {
    //   this.setState({favStopToLoad: props.favStopToLoad});
    //   if (this.refs.childrenMap){
    //     this.refs.childrenMap.showStopDetails(props.favStopToLoad, 'fav');
    //   }
    // } else if (props.favStopToLoad && !this.state.favStopToLoad) {
    //   this.setState({favStopToLoad: props.favStopToLoad});
    //   if (this.refs.childrenMap){
    //     this.refs.childrenMap.showStopDetails(props.favStopToLoad, 'fav');
    //   }
    // }
  }

  /**
  * When user taps to favourite a stop
  */
  onPressFavourite = () => {
    if (this.props.user && this.props.user.uid && this.state.stop) {
      const stopId = this.state.stop.id;

      if (stopId) {
        const favs = this.props.favourites;

        // Toggle to/from current list
        if (this.isFavourite(this.state.stop)) {
          favs.splice(favs.indexOf(stopId), 1);
        } else {
          favs.push(stopId);
        }

        // Send new list to API
        this.props.replaceFavourites(favs);

        // Manually trigger a re-render - I wish I knew why this was required...
        this.setStop(this.state.stop);
      }
    }
  }

  /**
    * Check in Redux to find if this stop ID is a Favourite
    */
  isFavourite = (stop) => {
    const { favourites } = this.props;
    const stopId = stop.id;

    if (stopId && favourites) {
      if (favourites.length > 0 && favourites.indexOf(stopId) > -1) return true;
      // if (favourites.length > 0 && favourites.map((favs) => favs.id).indexOf(stopId) > -1) return true;
    }

    return false;
  }

  setStop = (stop) => {
    let isFav = false;
    if (this.props.user && this.props.user.uid) {
      if (stop){
        isFav = this.isFavourite(stop);
        // if (this.state.favStopToLoad) {
        //   isFav = true;
        // }
        this.setState({stop: stop, isFavourite: isFav});
      }
    }
  }

  setFavStopToNull = () => {
    this.setState({favStopToLoad: null});
  }

  setLine = (line) => {
    this.props.line = line;
    this.setState({line: line});
  }

  /**
    * Fetch Data from API
    */
  fetchMapLines = () => this.props.getMapLines()
    .then((response) => this.setState({ error: null, loading: false, mapLines: response }))
    .catch(err => this.setState({ error: err.message, loading: false }))

  // fetchFavourites = () => this.props.getFavourites()
  //   .then((response) => this.setState({ error: null, loading: false, favourites: response }))
  //   .catch(err => this.setState({ error: err.message, loading: false }))

  render = () => {
    if (this.state.loading) return <Loading text={'Cargando...'} />;
    const { mapLines } = this.props;

    return (
      <Map 
      ref="childrenMap"
      mapLines={mapLines} 
      navigationState={this.props.navigationState} 
      getMapLineStops={this.props.getMapLineStops} 
      isFavourite={this.state.isFavourite} 
      onPressFavourite={this.onPressFavourite} 
      replaceFavourites={this.props.replaceFavourites} 
      setStop={this.setStop}
      user={this.props.user}
      favStopToLoad={this.props.favStopToLoad}
      loadStop={this.props.loadStop}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
