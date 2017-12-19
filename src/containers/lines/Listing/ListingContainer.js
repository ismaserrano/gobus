/**
 * List of Recipes for a Meal Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AsyncStorage } from 'react-native';

// Actions
import * as LineActions from '@redux/lines/actions';

// Components
import Loading from '@components/general/Loading';
import LineListingRender from './ListingView';
import DOMParser from 'react-native-html-parser';
import TxtDecoder from 'text-encoding';

/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  lines: state.line.lines || [],
});

// Any actions to map to the component?
const mapDispatchToProps = {
  getLines: LineActions.getLines,
};

const baseDomain = 'http://www.vitrasa.es';

/* Component ==================================================================== */
class LineListing extends Component {
  static componentName = 'LineListing';

  static propTypes = {
    lines: PropTypes.arrayOf(PropTypes.object),
    getLines: PropTypes.func.isRequired,
  }

  static defaultProps = {
    lines: [],
  }

  state = {
    loading: false,
    lines: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      navigation: {
        index: 1,
        routes: []
      },
      loading: true
    };
  }

  componentDidMount = () => {
    this.getThisLines(this.fetchLines());
  }
  componentWillReceiveProps = props => this.getThisLines(props.lines);

  async getHtml(lines, callback) {
    const domain = baseDomain+'/renovaciones-';
    let parser = new DOMParser.DOMParser();
    let counter = 0;

    let refreshWithSite = false;
    let time = new Date();
    let duration = 1; //In Days
    let timestampDay = (86400000 / 3); // Half day
    // let newTime = time.getTime() +  (duration * 24 * 60 * 60 * 1000);
    // 86400000 is 1 day

    let storageLines = await AsyncStorage.getItem('GoBus/lines');
    let jsonStorageLines = JSON.parse(storageLines);
    // console.log((time.getTime() - jsonStorageLines.timestamp), timestampDay);
    if (storageLines === null || ((time.getTime() - jsonStorageLines.timestamp) >= timestampDay)) {
      refreshWithSite = true;
    }

    if (typeof storageLines === null || refreshWithSite){
      return new Promise((accept, reject) => {
        lines.map((element, index) => {
          let single = '';
          let back = '';

          let req = new XMLHttpRequest();
          req.open("GET", domain+element.id, true);
          req.responseType = "arraybuffer";

          req.onload = function(event) {
              var resp = req.response;
              if (resp) {
                let textDecoder = new TxtDecoder.TextDecoder("iso-8859-1");
                let result = textDecoder.decode(resp);
                let htmlToParse = parser.parseFromString(result, 'text/html');
                let bloqueTexto = htmlToParse.getElementsByAttribute('class', 'bloquetexto');
                for (var k in bloqueTexto){
                  for (var i in bloqueTexto[k].childNodes){
                    // if (typeof bloqueTexto[k].childNodes[i] === 'object') {
                      if (typeof bloqueTexto[k].childNodes[i].nodeValue !== 'undefined') {
                        if (typeof bloqueTexto[k].childNodes[i].nodeValue === 'string'){
                          if (k === '0' || k === 0) {
                            if (bloqueTexto[k].childNodes[i].nodeValue!='' && bloqueTexto[k].childNodes[i].nodeValue!=' ' && bloqueTexto[k].childNodes[i].nodeValue!='  '){
                              single = single+'\n'+bloqueTexto[k].childNodes[i].nodeValue;
                            }
                          }
                          if (k === '1' || k === 1) {
                            if (bloqueTexto[k].childNodes[i].nodeValue!='' && bloqueTexto[k].childNodes[i].nodeValue!=' ' && bloqueTexto[k].childNodes[i].nodeValue!='  '){
                              back = back+'\n'+bloqueTexto[k].childNodes[i].nodeValue;
                            }
                          }
                        }
                      }
                    // }
                  }
                }

                let incidenciaText = htmlToParse.querySelect('.incidencia a.inc');
                let incidenciaLink = htmlToParse.querySelect('.incidencia p a');

                if (typeof incidenciaText[0] !== 'undefined'){
                  let incidenceTitle = incidenciaText[0].firstChild.nodeValue;
                  let incidenceLink = '';
                  for (var k in incidenciaLink[0].attributes){
                    if (incidenciaLink[0].attributes[k].nodeName === 'href') {
                      incidenceLink = incidenciaLink[0].attributes[k].nodeValue;
                      break;
                    }
                  }
                  lines[index].incidence = {
                    'title': incidenceTitle,
                    'link': baseDomain+incidenceLink
                  };
                }

                lines[index].single = single;
                lines[index].back = back;
                counter++;

                if (counter >= lines.length) {
                  let data = {
                    data: lines,
                    timestamp: time.getTime()
                  };
                  AsyncStorage.removeItem('GoBus/lines');
                  AsyncStorage.setItem('GoBus/lines', JSON.stringify(data));
                  accept(lines);
                  callback(lines);
                }
              }
          };
          // fetch(domain+element.id)
          // // .then((response) => response.text())
          // .then((response) => response.arrayBuffer())
          // .then((resultBuffer) => {
          //   let textDecoder = new TextDecoder("iso-8859-1");
          //   let result = textDecoder.decode(resultBuffer);
          //   let htmlToParse = parser.parseFromString(result, 'text/html');
          //   let bloqueTexto = htmlToParse.getElementsByAttribute('class', 'bloquetexto');
          //   for (var k in bloqueTexto){
          //     for (var i in bloqueTexto[k].childNodes){
          //       // if (typeof bloqueTexto[k].childNodes[i] === 'object') {
          //         if (typeof bloqueTexto[k].childNodes[i].nodeValue !== 'undefined') {
          //           if (typeof bloqueTexto[k].childNodes[i].nodeValue === 'string'){
          //             if (k === '0' || k === 0) {
          //               if (bloqueTexto[k].childNodes[i].nodeValue!='' && bloqueTexto[k].childNodes[i].nodeValue!=' ' && bloqueTexto[k].childNodes[i].nodeValue!='  '){
          //                 single = single+'\n'+bloqueTexto[k].childNodes[i].nodeValue;
          //               }
          //             }
          //             if (k === '1' || k === 1) {
          //               if (bloqueTexto[k].childNodes[i].nodeValue!='' && bloqueTexto[k].childNodes[i].nodeValue!=' ' && bloqueTexto[k].childNodes[i].nodeValue!='  '){
          //                 back = back+'\n'+bloqueTexto[k].childNodes[i].nodeValue;
          //               }
          //             }
          //           }
          //         }
          //       // }
          //     }
          //   }
          //   lines[index].single = single;
          //   lines[index].back = back;
          // })
          // .catch((error) => {
          //   console.error(error);
          // });
          req.send(null);
        });
      });
    } else {
      callback(jsonStorageLines.data);
    }
  }

  /**
    * Pick out recipes that are in the current meal
    * And hide loading state
    */
  async getThisLines(allLines) {
    if (allLines.length > 0) {
      // const recipes = allRecipes.filter(recipe =>
      //   recipe.category.toString() === this.props.meal.toString(),
      // );
      let self = this;
      let time = new Date();

      this.getHtml(allLines, function(response){
        self.setState({
          lines: response,
          loading: false
        });
        // self.forceUpdate();
      });

      this.setState({
        lines: allLines,
        loading: false
      });
    }
  }

  /**
    * Fetch Data from API
    */
  fetchLines = () => this.props.getLines()
    .then(() => this.setState({ error: null }))
    .catch(err => this.setState({ error: err.message, loading: false }))

  render = () => {
    if (this.state.loading) return <Loading text={'Cargando...'} />;

    return (
      <LineListingRender
        lines={this.state.lines}
        reFetch={this.fetchLines}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LineListing);
