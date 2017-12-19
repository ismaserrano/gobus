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
  WebView,
  StyleSheet
} from 'react-native';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppColors, AppStyles } from '@theme/';
import { ErrorMessages } from '@constants/';
import * as Animatable from 'react-native-animatable';
import MapListItem from './MapListItem';
import DOMParser from 'react-native-html-parser';
import TxtDecoder from 'text-encoding';
import Accordion from 'react-native-collapsible/Accordion';

// Components
import Error from '@components/general/Error';
import Loading from '@components/general/Loading';
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

import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { AppSizes } from '../../theme/index';

// const LONGITUDE_DELTA = 0.0421;
// const LATITUDE_DELTA = 0.0922;
const ASPECT_RATIO = AppSizes.screen.width / AppSizes.screen.height;
const LATITUDE_DELTA = 0.08; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_MAP_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
const GMAPS_API_KEY = 'AIzaSyAoP142g232SfgAGOdZ_Zwi_ZBaAcAymJ0';
const domain = 'http://rutasgt.intecoingenieria.com';
// const domain = 'http://rutas.vitrasa.es';

const jsCode = "window.postMessage(document.getElementById('ctl00_ContentPlaceHolder2_TreeView1n0Nodes').innerHTML);";
const jsCodeRemove = "for (var i= document.images.length; i-->0;)document.images[i].parentNode.removeChild(document.images[i]);";

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  favourite: {
    position: 'absolute',
    top: -45,
    right: 0,
  },
});

/* Component ==================================================================== */
class Map extends Component {
  static componentName = 'Map';

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      mapLines: this.props.mapLines,
      initialRegion: {
        latitude: 42.2294476,
        longitude: -8.7150838,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      region: {
        latitude: 42.2294476,
        longitude: -8.7150838,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polyline: [],
      stops: [],
      stopDetails: null,
      selectedLine: null,
      showLinesForStop: false,

      linesForStop: null,
      loadingLinesForStop: false,
      bgUri: domain,

      favStopToLoad: null,
    };
    this.map = null;
    this.props = props;
  }

  componentDidMount() {
    // navigator.geolocation.getCurrentPosition((position) => {
    //     this.setState({
    //       region: {
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //         latitudeDelta: LATITUDE_DELTA,
    //         longitudeDelta: LONGITUDE_DELTA,
    //       }
    //     });
    //   },
    //   (error) => this.setState({ error: error.message }),
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    // );

    if (this.props.favStopToLoad && !this.state.favStopToLoad) {
      // this.setState({favStopToLoad: this.props.favStopToLoad});
      this.showStopDetails(this.props.favStopToLoad, 'fav');
    }

    Animatable.initializeRegistryWithDefinitions({
      'slideOutDownCustom': {
        from: {
          top: AppSizes.screen.height / 2
        },
        to: {
          top: AppSizes.screen.height - 100
        },
      },
      'slideInUpCustom': {
        from: {
          top: AppSizes.screen.height -110
        },
        to: {
          top: AppSizes.screen.height / 2
        },
      },
      'slideRightDownCustom': {
        from: {
          left: AppSizes.screen.width
        },
        to: {
          left: 0
        },
      },
      'slideLeftDownCustom': {
        from: {
          left: 0
        },
        to: {
          left: -AppSizes.screen.width
        },
      }
    });
  }

  componentWillReceiveProps(props) {
    console.log(props)
    if (props.favStopToLoad && this.state.favStopToLoad && (props.favStopToLoad.id != this.state.favStopToLoad.id)) {
      this.setState({favStopToLoad: props.favStopToLoad});
      this.showStopDetails(props.favStopToLoad, 'fav');
    }
  }

  async parseContentToRoute(responseData, callback) {
    const self = this;
    let allContent = String(responseData).split("var marcaParada;");
    let allContentAlso = String(allContent[allContent.length-1]).split("if (sessvars.tamano");
    let contentToParse = String(allContentAlso[0]);
    let regex = new RegExp('LatLng(.*?)marcaParada', 'gm');
    let finalResult = contentToParse.match(regex);
    let finalCoords = [];
    /* Get info details from stop */
    let regex2 = new RegExp('puntoParada,(.*?), marcaParadaOptions', 'gm');
    let detailsResultArray = contentToParse.match(regex2);

    for (let i in finalResult) {
      let tempString = finalResult[i].replace('LatLng(', '').replace(');marcaParada', '');
      let splitstring = tempString.split(",");

      let detailsResult = detailsResultArray[i].replace('puntoParada,', '').replace(', marcaParadaOptions', '')
      let regexTitle = new RegExp('<strong>(.*?)</strong>', 'gm');
      let titleArray = detailsResultArray[i].match(regexTitle);
      let title = titleArray[0].replace('<strong>', '').replace('</strong>', '');
      let regexNum = new RegExp('<hr width="300"/>(.*?)<br/>', 'gm');
      let numStopArray = detailsResultArray[i].match(regexNum);
      let numStop = numStopArray[0].replace('<hr width="300"/>', '').replace('<br/>', '');
      let regexLink = new RegExp('<a href="(.*?)">Panel Informativo', 'gm');
      let linkArray = detailsResultArray[i].match(regexLink);
      let link = linkArray[0].replace('<a href="', '').replace('">Panel Informativo', '');

      let temp = {
        latitude: parseFloat(String(splitstring[0]).trim()),
        longitude: parseFloat(String(splitstring[1]).trim()),
        latitudeDelta: LATITUDE_DELTA * 0.10,
        longitudeDelta: (LATITUDE_DELTA * 0.10) * ASPECT_RATIO,
        title: title.trim(),
        numStop: numStop.trim(),
        link: link
      };
      finalCoords.push(temp);
      if (self.state.stopDetails != null) {
        finalCoords.push(self.state.stopDetails);
      }
      if (finalCoords.length == finalResult.length){
        callback(finalCoords);
      }
    }
  }

  loadRoute = (item) => {
    const self = this;
    this.setState({loading: true, selectedLine: item, stopDetails: null, showLinesForStop: false});
    this.hideStopDetails();
    Actions.refresh({title: item.title});
    this.props.setStop(null);
    this.props.loadStop(null);

    self.props.getMapLineStops(item.id).then((response) => {
      let data = response.data;

        // fetch('http://rutas.vitrasa.es/DisplayParadas.aspx?Linea='+item.id, {
        //   method: 'get'
        // })
        // .then((response) => response.text())
        // .then(async (responseData) => {
        //   this.parseContentToRoute(responseData, function(finalCoords){

          data.map(function(el, index){
            // finalCoords.map(function(elC, indexC){
            //   if (el.latitude === elC.latitude && el.longitude === elC.longitude){
                // data[index].latitude = parseFloat(el.latitude);
                // data[index].longitude = parseFloat(el.longitude);
                data[index].latitudeDelta = parseFloat(LATITUDE_DELTA * 0.04);
                data[index].longitudeDelta = parseFloat((LATITUDE_DELTA * 0.04) * ASPECT_RATIO);
                // data[index].link = elC.link;
                // data[index]['distance'] = self.calculateDistance(data[0].latitude,data[0].longitude,data[index].latitude,data[index].longitude,"K");
            //   }
            // });
          });
          // data.sort(function(a, b) { 
          //   return a.distance - b.distance;
          // });
          self.setState({
            loading: false,
            stops: data
          });
          if (self.state.stopDetails == null){
            self.map.fitToCoordinates(data, {
              edgePadding: DEFAULT_MAP_PADDING,
              animated: true,
            });
          }
      //   });
      // })
      // .catch(function(err) {
      //   // this.setState({loading:false});
      //   alert(err.message);
      //   console.log(err);
      // });
    })
    .catch((err) => {
      console.log(err)
    });
  }

  async parseContentToStop(responseData, callback) {
    let allContent = String(responseData).split("marcaParada.setMap(map);");
    let allContentAlso = String(allContent[allContent.length-1]).split("infoWindowParada.open(map,marcaParada);");
    let contentToParse = String(allContentAlso[0]);
    let finalContent = contentToParse.replace("infoWindowParada.setContent('", "").replace("');", "");
    let regexTitle = new RegExp('<strong>(.*?)</strong>', 'gm');
    let titleArray = finalContent.match(regexTitle);
    let title = '';
    if (titleArray){
      title = titleArray[0].replace('<strong>', '').replace('</strong>', '').replace("<br/>", " ");
    }

    let bodyArray = finalContent.split('<tr class="');
    let tempArray = [];
    for (let i in bodyArray) {
      if (i <= 1){
        if (bodyArray[i].indexOf('No se han encontrado rutas') != -1) {
          let tempNop = {
            'line': '',
            'destiny': 'No se han encontrado rutas',
            'time': '',
          };
          tempArray.push(tempNop);
          callback(title, tempArray);
          break;
        }
      }
      if (i > 1) {
        let cleaned = bodyArray[i].replace('filaimpar">', '').replace('filapar">', '').replace("</tr>", "").replace("</table><br/></div>", "");
        let regexDet = new RegExp('<td(.*?)</td>', 'gm');
        let bodyDet = cleaned.match(regexDet);
        let temp = [];
        for (let k in bodyDet) {
          let cleanedDet = bodyDet[k].replace("<td>", "").replace("</td>", "").replace("<td align=right>", "");
          temp.push(cleanedDet);
        }
        let modelTemp = {
          'line': temp[0],
          'destiny': temp[1],
          'time': temp[2] + (temp[2] != 1 ? ' mins' : ' min'),
        };
        tempArray.push(modelTemp);
        if (tempArray.length == (bodyArray.length-2)){
          callback(title, tempArray);
        }
      }
    }
  }

  showStopDetails = (stop, from) => {
    if (typeof from === 'undefined') from = '';
    const self = this;
    this.hideStopDetails();
    this.child.blurSearchText();
    this.setState({loading: true, linesForStop: null});
    this.props.setStop(stop);

    let linkModified = stop.link.split("&Altura=");
    
    fetch(domain+'/'+linkModified[0]+"&Altura=37112121818633&Zoom=", {
        method: 'get'
    })
    .then((response) => response.text())
    .then(async (responseData) => {
      this.parseContentToStop(responseData, function(title, tempArray){
        var stopDetail = {
          'id': stop.id,
          'latitude': parseFloat(stop.latitude),
          'link': stop.link,
          'longitude': parseFloat(stop.longitude),
          'latitudeDelta': LATITUDE_DELTA * 0.10,
          'longitudeDelta': (LATITUDE_DELTA * 0.10) * ASPECT_RATIO,
          'numStop': stop.numStop,
          'title': stop.title,
          'bodyTitle': title,
          'bodyContent': tempArray
        };
        let regionToAnimate = {
          latitude: stopDetail.latitude,
          longitude: stopDetail.longitude,
          latitudeDelta: stopDetail.latitudeDelta,
          longitudeDelta: stopDetail.longitudeDelta,
        };
        self.setState({
          loading: false,
          stopDetails: stopDetail,
          region: stopDetail,
          showLinesForStop: false
        });
        if (regionToAnimate && self.map){
          self.map.animateToRegion(regionToAnimate, 50);
        }
        if (from === 'fav' && self.refs.favStopToLoadMarker) {
          self.setState({favStopToLoad: self.props.favStopToLoad});
          self.refs.favStopToLoadMarker.showCallout();
        }
      });
    }).catch(function(err) {
      // this.setState({loading:false});
      alert(err.message+'\nVuelva a intentarlo transcurridos unos segundos.');
      console.log(err);
    });
  }

  hideStopDetails = () => {
    const self = this;
    if (this.state.stopDetails != null){
      if (this.refs.detailView){
        this.refs.detailView.fadeOutDown(500).then(function(){
          if (self.refs.detailView){
            self.setState({
              stopDetails: null,
              showLinesForStop: false
            });
          }
        });
      }
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2, unit) {
      var radlat1 = Math.PI * lat1/180
      var radlat2 = Math.PI * lat2/180
      var radlon1 = Math.PI * lon1/180
      var radlon2 = Math.PI * lon2/180
      var theta = lon1-lon2
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist
  }

  viewLinesForStop(state) {
    const self = this;
    let item = this.state.stopDetails;
    if (state) {
      this.refs.detailView.animate('slideOutDownCustom', 500).then(function(){
        if (self.state.linesForStop === null) {
          self.setState({bgUri: domain+'/'+item.link, loadingLinesForStop: true});
        }
        self.setState({showLinesForStop: state});
        // self.parseHtmlForStop(item, function(linesForStop){
        //   self.setState({loadingLinesForStop: false, linesForStop: linesForStop});
        // });
      });
    } else {
      this.refs.linesForStopView.animate('slideOutDownCustom', 500).then(function(){
        self.setState({showLinesForStop: state});
      });
    }
  }

  parseHtmlForStop(item) {
    const self = this;
    if (typeof item !== 'undefined') {
      let parser = new DOMParser.DOMParser();
      let htmlToParse = parser.parseFromString(item, 'text/xhtml');
      let layerContent = htmlToParse.querySelect('span.NodoHijo');
      let linesForStop = [];
      let children = [];
      let isChild = false;
      for (let i in layerContent){
        if (layerContent[i].childNodes[0].nodeValue === 'Horarios'){
          continue;
        }
        let link = '';
        for (let k in layerContent[i].attributes) {
          if (layerContent[i].attributes[k].name === 'onclick') {
            if (String(layerContent[i].attributes[k].nodeValue).indexOf('Linea')!=-1) {
              let tempLink = String(layerContent[i].attributes[k].nodeValue).split("Linea=");
              link = String(tempLink[tempLink.length-1]).replace('"', '');
              let temp = {
                'title': layerContent[i].childNodes[0].nodeValue,
                'id': link,
              };
              linesForStop.push(temp);
              isChild = false;
            } else {
              isChild = true;
            }
            break;
          }
        }
        if (isChild) {
          continue;
        }
      }
      self.setState({loadingLinesForStop: false, linesForStop: linesForStop});
    }
  }

  _renderHeader = (data) => {
    let itemParts = data.id.split("-");
    let titleWay = '';
    if (itemParts[itemParts.length-1]==='0') {
      titleWay = 'IDA';
    } else {
      titleWay = 'VUELTA';
    }
    return (
      <View>
        <ListItem
        key={data.title}
        title={`${data.title} - ${titleWay}`}
        // onPress={() => this.loadRoute(data)}
        />
      </View>
    );
  }
 
  _renderContent = (data) => {
    const self = this;
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
                onPress={() => self.showStopDetails(item)}
                />
            </View>
        );
    });
  }

  render = () => {
    const self = this;
    const { mapLines, isFavourite, onPressFavourite, replaceFavourites } = this.props;
    const { dataSource, stopDetails, showLinesForStop } = this.state;
    const { showStopDetails, hideStopDetails } = this;

    /* Route based in directions */
    // let markersDirections = [];
    // this.state.stops.map(function(marker, index){
    //   if ((index+1) < self.state.stops.length) {
    //     markersDirections.push(<MapViewDirections
    //       key={`marker-direction-${index}`}
    //       origin={{latitude: marker.latitude, longitude: marker.longitude}}
    //       destination={{latitude: self.state.stops[index+1].latitude, longitude: self.state.stops[index+1].longitude}}
    //       apikey={GMAPS_API_KEY}
    //       strokeWidth={3}
    //       strokeColor="red"
    //     />);
    //   }
    // });
    
    return (
      <View style={[AppStyles.container]}>
        <MapView
          ref={map => this.map = map}
          provider={PROVIDER_GOOGLE}
          region={this.state.region}
          // initialRegion={this.state.initialRegion}
          onPress={() => hideStopDetails()}
          showsUserLocation={true}
          followsUserLocation={true}
          zoomEnabled={true}
          scrollEnabled={true}
          showsMyLocationButton={true}
          style={{flex:1,position: 'absolute', top: 0,left: 0,right: 0,bottom: 0}}
        >
          {/* { markersDirections } */}
          {/* {this.state.stops.map((marker, index) => (
            <MapViewDirections
              key={`marker-direction-${index}`}
              origin={{latitude: marker.latitude, longitude: marker.longitude}}
              destination={{latitude: this.state.stops[index+1] ? this.state.stops[index+1].latitude : this.state.stops[0].latitude, longitude: this.state.stops[index+1] ? this.state.stops[index+1].longitude : this.state.stops[0].longitude}}
              apikey={GMAPS_API_KEY}
              strokeWidth={3}
              strokeColor="red"
            />
          ))} */}
          {!this.props.favStopToLoad && this.state.stops.map((marker, index) => (
            <MapView.Marker
              key={`marker-${marker.id}`}
              coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
              image={require('../../images/stop-icon.png')}
              onPress={() => {
                showStopDetails(marker);
                this.child.blurSearchText();
              }}
              // onCalloutPress={() => hideStopDetails()}
              // title={marker.title}
              // description={marker.description}
            >
              <MapView.Callout>
                <Text h3>{marker.title}</Text>
                <Text h6 style={{color: '#333'}}>{marker.numStop}</Text>
                <Spacer size={10} />
              </MapView.Callout>
            </MapView.Marker>
          ))}
          { /* Marker loaded by favs */ }
          {this.props.favStopToLoad && 
            <MapView.Marker
              ref="favStopToLoadMarker"
              key={`marker-${this.props.favStopToLoad.id}`}
              coordinate={{latitude: this.props.favStopToLoad.latitude, longitude: this.props.favStopToLoad.longitude}}
              image={require('../../images/stop-icon.png')}
              onPress={() => {
                showStopDetails(this.props.favStopToLoad);
              }}
            >
              <MapView.Callout>
                <Text h3>{this.props.favStopToLoad.title}</Text>
                <Text h6 style={{color: '#333'}}>{this.props.favStopToLoad.numStop}</Text>
                <Spacer size={10} />
              </MapView.Callout>
            </MapView.Marker>
          }
        </MapView>
        <View style={{position:'absolute', top: 0, left: AppSizes.screen.width, height: 0, width: 0}}>
          <WebView
            ref="webviewBg"
            source={{uri: this.state.bgUri}}
            onShouldStartLoadWithRequest={(event) => { if (event.url.indexOf('DisplayParadas.aspx')!=-1) return true; }}
            onMessage={(event)=> this.parseHtmlForStop(event.nativeEvent.data)}
            injectedJavaScript={jsCode}
          />
        </View>
        <MapListItem
          mapLines={mapLines}
          onFocus={() => hideStopDetails()}
          onRef={ref => (this.child = ref)}
          style={{flex:1, position:'absolute', width: '100%', top: 0, backgroundColor: '#CCC'}}
          loadRoute={this.loadRoute}
        />
        { (stopDetails && !showLinesForStop) &&
        <Animatable.View ref="detailView" animation="slideInUpCustom" style={{flex:1, position:'absolute', top: AppSizes.screen.height / 2, width:'100%', height: (AppSizes.screen.height / 2) - 114, backgroundColor: '#FFF'}}>
          {/* <Button
            small
            title={'Ver lineas que pasan por esta parada'}
            onPress={() => this.viewLinesForStop(true)}
            raised={false}
            backgroundColor={'rgba(61,180,255,0.7)'}
          /> */}
          <Text h5 style={{color: '#333', marginTop: 10, marginBottom: 10, paddingRight: 10, paddingLeft: 10}}>{stopDetails.bodyTitle}</Text>
          {(this.props.user && this.props.user.uid) &&
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressFavourite}
            style={[styles.favourite]}
          >
            <Icon
              raised
              name={'star-border'}
              color={isFavourite ? '#FFFFFF' : '#FDC12D'}
              containerStyle={{
                backgroundColor: isFavourite ? '#FDC12D' : '#FFFFFF',
              }}
            />
          </TouchableOpacity>
          }
          <ScrollView
            automaticallyAdjustContentInsets={false}
            style={{paddingRight: 10, paddingLeft: 10}}
          >
            {stopDetails.bodyContent && stopDetails.bodyContent.map((markerStop, indexStop) => (
              // <TouchableOpacity key={`detail-view-touchable-${indexStop}`} onPress={() => console.log(markerStop)} underlayColor = 'transparent'>
                <View key={`detail-view-text-${indexStop}`} style={{flex: 1, flexDirection: 'row', borderBottomColor: '#EEE', borderBottomWidth: 1, paddingBottom: 10, paddingTop: 10}}>
                  <Text key={`detail1-text-${indexStop}`} style={AppStyles.col1Detail}>{markerStop.line}</Text>
                  <Text key={`detail2-text-${indexStop}`} style={AppStyles.col2Detail}>{markerStop.destiny}</Text>
                  <Text key={`detail3-text-${indexStop}`} style={AppStyles.col3Detail}>{markerStop.time}</Text>
                </View>
              // </TouchableOpacity>
            ))}
          </ScrollView>
        </Animatable.View>
        }
        { showLinesForStop &&
        <Animatable.View ref="linesForStopView" animation="slideInUpCustom" style={{flex:1, position:'absolute', top: AppSizes.screen.height / 2, width:'100%', height: (AppSizes.screen.height / 2) - 114, backgroundColor: '#FFF'}}>
          <Button
            small
            title={'Volver a info de parada'}
            onPress={() => this.viewLinesForStop(false)}
            raised={false}
            backgroundColor={'rgba(61,180,255,0.7)'}
          />
          { this.state.loadingLinesForStop && <Loading text={'Cargando...'} transparent={true} /> }
          { this.state.linesForStop &&
          <ScrollView
            automaticallyAdjustContentInsets={false}
            // style={{paddingRight: 10, paddingLeft: 10}}
          >
            {this.state.linesForStop.map((lineStop, indexLine) => (
              <View key={`lineStop-list-${indexLine}`}>
                <ListItem key={`lineStop-id-${indexLine}`} title={lineStop.title} onPress={() => this.loadRoute(lineStop)} />
                {/* <Accordion
                    sections={this.state.linesForStop}
                    renderHeader={this._renderHeader}
                    renderContent={(this._renderContent)}
                /> */}
              </View>
            ))}
          </ScrollView>
          }
        </Animatable.View>
        }
        { this.state.loading && <Loading text={'Cargando...'} transparent={true} /> }
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default Map;
