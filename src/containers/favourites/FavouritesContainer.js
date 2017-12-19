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
  ListView
} from 'react-native';

import { AppColors, AppStyles } from '@theme/';

// Actions
import * as FavouritesActions from '@redux/favourites/actions';
import * as LineActions from '@redux/map/actions';

// Components
import Loading from '@components/general/Loading';
import FavListItem from './FavouritesListItem';

/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
  favourites: state.map.favourites ? state.map.favourites : [],
});

// Any actions to map to the component?
const mapDispatchToProps = {
  getFavouritesFav: FavouritesActions.getFavouritesFav,
  loadStop: LineActions.loadStop,
  replaceFavourites: LineActions.replaceFavourites,
};

/* Component ==================================================================== */
class FavouritesContainer extends Component {
  static componentName = 'FavouritesContainer';

  constructor(props) {
    super();

    this.props = props;
    this.state = {
      loading: false,
      favsFavCont: null
    };
  }

  componentWillMount() {
    this.setState({loading: true});
    this.fetchFavourites();
  }

  componentWillReceiveProps(props) {
    this.fetchFavourites();
  }

  fetchFavourites = () => {
    this.setState({ favsFavCont: null });
    this.props.getFavouritesFav(this.props.favourites)
    .then((response) => {
      this.setState({ error: null, loading: false, favourites: this.props.favourites, favsFavCont: response.data });
    })
    .catch(err => this.setState({ error: err.message, loading: false }))
  }

  loadFav = (fav) => {
    // Actions.map({favStopToLoad: fav, line: null})
    this.props.loadStop(fav);
    Actions.map();
  }

  /**
  * When user taps to favourite a stop
  */
  onPressFavouriteInside = (stopId) => {
    if (this.props.user && this.props.user.uid && stopId) {

      if (stopId) {
        const favs = this.props.favourites;

        // Toggle to/from current list
        if (this.isFavourite(stopId)) {
          favs.splice(favs.indexOf(stopId), 1);
        } else {
          favs.push(stopId);
        }

        // Send new list to API
        this.props.replaceFavourites(favs);
      }
    }
  }

  /**
    * Check in Redux to find if this stop ID is a Favourite
    */
  isFavourite = (stopId) => {
    const { favourites } = this.props;

    if (stopId && favourites) {
      if (favourites.length > 0 && favourites.indexOf(stopId) > -1) return true;
    }

    return false;
  }


  render = () => {
    const { favsFavCont } = this.state;
    if (this.state.loading) return <Loading text={'Cargando...'} />;
    return (
      <FavListItem
        favsFavCont={favsFavCont}
        loadFav={this.loadFav}
        onPressFavouriteInside={this.onPressFavouriteInside}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FavouritesContainer);
