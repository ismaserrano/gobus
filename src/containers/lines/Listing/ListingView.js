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
import { AppColors, AppStyles } from '@theme/';
import { ErrorMessages } from '@constants/';

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
class LineListing extends Component {
  static componentName = 'LineListing';

  static propTypes = {
    lines: PropTypes.arrayOf(PropTypes.object).isRequired,
    reFetch: PropTypes.func,
  }

  static defaultProps = {
    reFetch: null,
  }

  constructor() {
    super();

    this.state = {
      isRefreshing: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      searchText: ''
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(props.lines),
      isRefreshing: false,
    });
  }

  componentWillUnmount() {
    this.setSearchText('');
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
    // this.setState({searchText});
    const allLines = this.props.lines;

    const linesFiltered = allLines.filter(line => {
      let returnedValue = 0;
      returnedValue = line.title.toLowerCase().indexOf(searchText.toLowerCase());
      if (returnedValue <= -1) {
        returnedValue = line.id.toLowerCase().indexOf(searchText.toLowerCase());
      }
      return returnedValue > -1
    });

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(linesFiltered),
      searchText: searchText
    });
    // this.forceUpdate();
   
    // base.fetch('notes', {
    //   context: this,
    //   asArray: true,
    //   then(data){
    //     let filteredData = this.filterNotes(searchText, data);
    //     this.setState({
    //       dataSource: this.ds.cloneWithRows(filteredData),
    //       rawData: data,
    //     });
    //   }
    // });
  }

  filterNotes(searchText, notes) {
    let text = searchText.toLowerCase();
  
    return filter(notes, (n) => {
      let note = n.body.toLowerCase();
      return note.search(text) !== -1;
    });
  }

  render = () => {
    const { lines } = this.props;
    const { isRefreshing, dataSource } = this.state;

    if (!isRefreshing && (!lines || lines.length < 1)) {
      return <Error text={ErrorMessages.line404} />;
    }

    return (
      <View style={[AppStyles.container]}>
        <TextInput
        style={[AppStyles.searchBar]}
        value={this.state.searchText}
        onChangeText={this.setSearchText.bind(this)}
        placeholder='Buscar'
        autoCorrect={false}
        />
        <View style={{position: 'absolute', left: 13, top: 13}}>
            <Icon name="search" size = {20} color = "#CCC" />
        </View>
        { this.state.searchText!='' &&
        <TouchableOpacity style={{alignItems:'center', justifyContent:'center', position: 'absolute', right: 13, top: 13, width: 20, height: 20}} onPress={() => this.setSearchText('')} underlayColor = 'transparent'>
            <View>
                <Icon name="close" size = {20} color = "#CCC" />
            </View>
        </TouchableOpacity> }
        <ScrollView
          automaticallyAdjustContentInsets={false}
        >
          <List style={{paddingTop: 0}}>
            <ListView
              enableEmptySections={true}
              renderRow={lines => <LineCard line={lines} />}
              // renderRow={this.renderRow}
              dataSource={dataSource}
            />
          </List>
        </ScrollView>
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default LineListing;
