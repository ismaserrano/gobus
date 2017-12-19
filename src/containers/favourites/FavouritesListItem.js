/**
 * Line Listing Screen
 *  - Shows a list of lines
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ListView,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

// Consts and Libs
import { AppColors, AppStyles } from '@theme/';
import { ErrorMessages } from '@constants/';

// Components
import Error from '@components/general/Error';
import {
  Alerts,
  Button,
  Card,
  Spacer,
  Text,
  List,
  ListItem
} from '@components/ui/';
import { Icon } from 'react-native-elements';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    favourite: {
      position: 'absolute',
      left: 10,
      top: 13,
    },
  });

/* Component ==================================================================== */
class FavouritesListItem extends Component {
  static componentName = 'FavouritesListItem';

//   static propTypes = {
//     favourites: PropTypes.arrayOf(PropTypes.number).isRequired,
//   }

//   static defaultProps = {
//     reFetch: null,
//   }

  constructor(props) {
    super();

    this.props = props;
    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      favsFavCont: []
    };
  }

  componentWillReceiveProps(props) {
    if (props.favsFavCont){
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(props.favsFavCont),
            isRefreshing: true,
            favsFavCont: props.favsFavCont
        });
    }
  }

  componentDidMount() {
    if (this.props.favsFavCont && this.props.favsFavCont.length > 0) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.props.favsFavCont),
        });
    }
  }

  /**
  * Each List Item
  */
  renderRow = (data, sectionID) => (
    <View>
        <ListItem
        key={`stop-${data.id}`}
        onPress={() => this.props.loadFav(data)}
        title={data.numStop}
        titleStyle={{marginLeft: 33}}
        />
        <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => this.props.onPressFavouriteInside(data.id)}
        style={[styles.favourite]}
        >
        <Icon
            name={'star'}
            color={'#FDC12D'}
        />
        </TouchableOpacity>
    </View>
  )

  render = () => {
    const { isRefreshing, dataSource, favsFavCont } = this.state;

    if (!isRefreshing && (!favsFavCont || favsFavCont.length < 1)) {
        return <Error text={ErrorMessages.line404} />;
      }

    return (
      <View style={[AppStyles.container]}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
        >
          <List style={{paddingTop: 0}}>
            <ListView
              enableEmptySections={true}
              renderRow={(favsFavCont) => this.renderRow(favsFavCont)}
              dataSource={dataSource}
            />
          </List>
        </ScrollView>
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default FavouritesListItem;
