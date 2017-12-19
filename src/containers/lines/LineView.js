/**
 * Line View Screen
 *  - The individual line screen
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  WebView,
  TouchableOpacity,
  Platform
} from 'react-native';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-fetch-blob';

// Components
import { Card, Spacer, Text, Button } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  featuredImage: {
    left: 0,
    right: 0,
    height: AppSizes.screen.height * 0.4,
    resizeMode: 'contain',
    backgroundColor: '#FFF'
  },
  featuredImageExpanded: {
    left: -(AppSizes.screen.width / 2),
    top: 40,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width * 2,
    transform: [{ rotate: '90deg'}],
    resizeMode: 'contain',
    backgroundColor: '#FFF',
    marginBottom: 80
  },
});

/* Component ==================================================================== */
class LineView extends Component {
  static componentName = 'LineView';

  static propTypes = {
    line: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      code: PropTypes.string,
      single: PropTypes.string,
      back: PropTypes.string,
      image: PropTypes.string
    }).isRequired,
  }

  constructor(props) {
    super();

    this.props = props;
    this.state = {
      pdfUri: null,
      imageStyles: styles.featuredImage,
      imageExpanded: false,
      platform: Platform.OS === 'ios' ? 'ios' : 'android'
    }
  }

  componentDidMount(props) {
    // if (this.state.platform === "ios") {
    //   RNFetchBlob.config({
    //     name: 'factura_'+nodeId,
    //     filename: 'factura_'+nodeId+'.pdf',
    //     fileCache : true,
    //     appendExt : 'pdf'
    //   })
    //   .fetch('GET', responseData.uri)
    //   .then((res) => {
    //     // open the document directly
    //     RNFetchBlob.ios.previewDocument(res.path())
    //     // or show options
    //     // RNFetchBlob.ios.openDocument(res.path())
    //   });
    // } else {
    //   RNFetchBlob.config({
    //     name: 'factura_'+nodeId,
    //     filename: 'factura_'+nodeId+'.pdf',
    //     fileCache : true,
    //     appendExt : 'pdf',
    //     notification: true,
    //     path: 'downloads/factura_'+nodeId+'.pdf',
    //     indicator: true,
    //     overwrite: true,
    //     addAndroidDownloads: {
    //       path: RNFetchBlob.fs.dirs.SDCardDir + '/downloads/factura_'+nodeId+'.pdf',
    //       useDownloadManager: true,
    //       notification: true,
    //       overwrite: true,
    //       description: 'downloading content...',
    //       mime: 'application/pdf',
    //       mediaScannable: false
    //   }
    //   })
    //   .fetch('GET', responseData.uri)
    //   .then((res) => {
    //     // open the document directly
    //     // RNFetchBlob.ios.previewDocument(res.path())
    //     // or show options
    //     // RNFetchBlob.ios.openDocument(res.path())
    //   })
    // }
  }

  viewPage(url) {
    this.setState({
      pdfUri: url.replace(/ /g, '%20')
    });
  }

  backToMainSection() {
    this.setState({
      pdfUri: null
    });
  }

  expandImage() {
    if (this.state.imageExpanded){
      this.setState({imageStyles: styles.featuredImage, imageExpanded: false});
    } else {
      this.setState({imageStyles: styles.featuredImageExpanded, imageExpanded: true});
    }
  }

  render = () => {
    const { title, code, image, single, back, incidence } = this.props.line;
    const { pdfUri, imageStyles } = this.state;

    if (pdfUri !== null) {
      if (this.state.platform === "ios") {
        RNFetchBlob.config({
          name: pdfUri,
          filename: pdfUri,
          fileCache : true,
          appendExt : 'pdf'
        })
        .fetch('GET', pdfUri)
        .then((res) => {
          // open the document directly
          RNFetchBlob.ios.previewDocument(res.path())
          // or show options
          // RNFetchBlob.ios.openDocument(res.path())
        });
      } else {
        RNFetchBlob.config({
          name: pdfUri,
          filename: pdfUri,
          fileCache : true,
          appendExt : 'pdf',
          notification: true,
          path: 'downloads/'+pdfUri,
          indicator: true,
          overwrite: true,
          addAndroidDownloads: {
            path: RNFetchBlob.fs.dirs.SDCardDir + '/downloads/'+pdfUri,
            useDownloadManager: true,
            notification: true,
            overwrite: true,
            description: 'Descargando...',
            mime: 'application/pdf',
            mediaScannable: false
        }
        })
        .fetch('GET', pdfUri)
        .then((res) => {
          // open the document directly
          // RNFetchBlob.ios.previewDocument(res.path())
          // or show options
          // RNFetchBlob.ios.openDocument(res.path())
        })
      }
      return (
        <View>
          <Button
            title={'Volver a info de linea'}
            onPress={() => this.backToMainSection()}
            raised={false}
            backgroundColor={'rgba(0,0,0,0.7)'}
            style={{top: (AppSizes.screen.height / 4), width: (AppSizes.screen.width - 100), left: (AppSizes.screen.width / 2)-((AppSizes.screen.width - 100)/2)}}
          />
          <Pdf ref={(pdf)=>{this.pdf = pdf;}}
            source={{uri: pdfUri}}
            page={1}
            scale={1}
            horizontal={false}
            // onLoadComplete={(pageCount)=>{
            //     this.setState({pageCount: pageCount, loading: false});
            //     console.log(`total page count: ${pageCount}`);
            // }}
            // onPageChanged={(page,pageCount)=>{
            //     this.setState({page:page});
            //     console.log(`current page: ${page}`);
            // }}
            onError={(error)=>{
                alert(error);
            }}
            style={AppStyles.pdf}
          />
        </View>
      );
    }
    else {
      let incidenceRender = null;
      if (incidence) {
        incidenceRender = <View><Spacer size={25} /><Text style={[AppStyles.error]}>{incidence.title}</Text>
        <Button
          small
          title={'Ver documento adjunto'}
          onPress={() => this.viewPage(incidence.link)}
          raised={false}
          backgroundColor={'rgba(0,0,0,0.7)'}
        />
        </View>;
      }

      return (
        <ScrollView style={[AppStyles.container]}>
          {image !== '' &&
          <TouchableOpacity onPress={() => this.expandImage()} underlayColor = 'transparent'>
            <Image
              source={{ uri: image }}
              style={[imageStyles]}
            />
          </TouchableOpacity>
          }

          <Card>
            <Text h2>{code}</Text>
            <Text h3>{title}</Text>
            <Spacer size={20} />
            <Text h5 style={{paddingBottom: 0, marginBottom: 0}}>IDA</Text>
            <Text style={{paddingTop: 0, marginTop: 0}}>{single.trim()}</Text>
            <Spacer size={15} />
            <Text h5 style={{paddingBottom: 0, marginBottom: 0}}>VUELTA</Text>
            <Text style={{paddingTop: 0, marginTop: 0}}>{back.trim()}</Text>
            {incidenceRender}
          </Card>

          {/* {ingredients ?
            <Card>
              <Text h2>Ingredients</Text>
              {this.renderIngredients(ingredients)}
            </Card>
          : null}

          {method ?
            <Card>
              <Text h2>Method</Text>
              {this.renderMethod(method)}
            </Card>
          : null} */}

          <Spacer size={55} />
        </ScrollView>
      );
    }
  }
}

/* Export Component ==================================================================== */
export default LineView;
