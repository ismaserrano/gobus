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
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { ErrorMessages } from '@constants/';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

// Containers
import LineCard from '@containers/lines/Card/CardContainer';

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

/* Component ==================================================================== */
class MapListItem extends Component {
  static componentName = 'MapListItem';

  static propTypes = {
    mapLines: PropTypes.arrayOf(PropTypes.object).isRequired,
    reFetch: PropTypes.func,
  }

  static defaultProps = {
    reFetch: null,
  }

  constructor(props) {
    super();

    this.props = props;

    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      searchText: '',
      mapLinesFiltered: null,
      liveSearch: false
    };
  }

//   componentWillMount() {
//       if (this.props.loadRoute) {
//           this.props.loadRoute(this.loadRoute);
//       }
//   }
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(props.mapLines),
      isRefreshing: false,
    });
  }

  blurSearchText() {
      this.searchTextInput.blur();
  }

  /**
    * Refetch Data (Pull to Refresh)
    */
  reFetch = () => {
    if (this.props.reFetch) {
      this.setState({ isRefreshing: true });

      this.props.reFetch()
        .then(() => {
          this.setState({ isRefreshing: false });
        });
    }
  }

  /**
  * Each List Item
  */
  renderRow = (data, sectionID) => (
    <ListItem
      key={`list-row-${sectionID}`}
      onPress={Actions.comingSoon}
      title={data.title}
    />
  )

  setSearchText(event) {
    let searchText = event; //event.nativeEvent.text;
    this.setState({liveSearch: true});
    // this.setState({searchText});
    const allLines = this.props.mapLines;

    const mapLinesFiltered = allLines.filter(line => {
        return line.children.some(function(item){
            return item.title.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').indexOf(searchText.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')) > -1;
        });
    //   let returnedValue = 0;
    //   returnedValue = line.title.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').indexOf(searchText.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u'));
    //   if (returnedValue <= -1) {
    //     /* Search for children */
    //     for (let i in line.children) {
    //         // console.log(line.children[i].title)
    //         returnedValue = line.children[i].title.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').indexOf(searchText.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u'));
    //     }
    //   }
    //   return returnedValue > -1
    });

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(mapLinesFiltered),
      searchText: searchText,
      mapLinesFiltered: mapLinesFiltered,
      liveSearch: false
    });
  }

  clearSearchText = () => {
      this.setState({searchText: ''});
  }

  _renderHeader = (data) => {
    return (
      <View>
        <ListItem
        key={data.title}
        title={data.title}
        />
      </View>
    );
  }

  loadParentRoute = (item) => {
    const { loadRoute } = this.props;
    loadRoute(item);
    this.setState({searchText: ''});
  }
 
  _renderContent = (data) => {
      const { loadParentRoute } = this;

      let mapLines = [];
      for (let i in data.children) {
          mapLines.push(data.children[i]);
      }
      return mapLines.map(function(item, index){
          let itemParts = item.id.split("-");
          let titleWay = '';
          if (itemParts[itemParts.length-1]==='0') {
            titleWay = 'IDA';
          } else {
            titleWay = 'VUELTA';
          }
        return (
            <View key={`view-row-${index}`}>
                <ListItem
                key={`list-row-${index}`}
                title={`${item.title} - ${titleWay}`}
                style={{backgroundColor:'#EEE', borderBottomWidth: 1, borderColor: '#DDD', paddingTop: 5, paddingBottom: 5 }}
                titleStyle={{fontSize:12}}
                onPress={() => loadParentRoute(item)}
                />
            </View>
        );
    });
  }

  render = () => {
    const { mapLines, onFocus } = this.props;
    const { isRefreshing, dataSource, mapLinesFiltered } = this.state;

    if (!isRefreshing && (!mapLines || mapLines.length < 1)) {
      return <Error text={ErrorMessages.line404} />;
    }

    let scrollContent = null;
    if (this.state.searchText != '') {
        scrollContent = <ScrollView
            automaticallyAdjustContentInsets={false}
        >
        {/* <List style={{paddingTop: 0}}>
          <ListView
            enableEmptySections={true}
            renderRow={mapLines => this.renderRow(mapLines)}
            dataSource={dataSource}
          />
        </List> */}
        <Accordion
            sections={mapLinesFiltered}
            renderHeader={this._renderHeader}
            renderContent={(this._renderContent)}
        />
      </ScrollView>;
    }

    return (
      <View>
        <TextInput
        ref={searchTextInput => this.searchTextInput = searchTextInput}
        style={[AppStyles.searchBar]}
        value={this.state.searchText}
        onChangeText={this.setSearchText.bind(this)}
        placeholder='Buscar lineas'
        onFocus={onFocus}
        autoCorrect={false}
        />
        {/* <SearchBar
        lightTheme
        ref={searchTextInput => this.searchTextInput = searchTextInput}
        style={[AppStyles.searchBar]}
        value={this.state.searchText}
        onChangeText={this.setSearchText.bind(this)}
        placeholder='Buscar lineas'
        onFocus={onFocus}
        /> */}
        <View style={{position: 'absolute', left: 13, top: 13}}>
            <Icon name="search" size = {20} color = "#CCC" />
        </View>
        { this.state.searchText!='' &&
        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', position: 'absolute', right: 13, top: 13, width: 20, height: 20}} onPress={() => this.clearSearchText()} underlayColor = 'transparent'>
            <View>
                <Icon name="close" size = {20} color = "#CCC" />
            </View>
        </TouchableOpacity> }
        { this.state.liveSearch &&
        <View style={{position: 'absolute', right: 33, top: 13}}>
            <Icon name="sync" size = {20} color = "#CCC" />
        </View>
        }
        { scrollContent }
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default MapListItem;
