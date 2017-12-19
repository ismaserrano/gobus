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
} from '@components/ui/';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { AppColors, AppStyles } from '@theme/';

// Actions

// Components
import Loading from '@components/general/Loading';

// Libs
import { AppSizes } from '../../theme/index';


/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = {
};

/* Component ==================================================================== */
class AboutContainer extends Component {
  static componentName = 'AboutContainer';

  static propTypes = {
    user: PropTypes.shape({
      uid: PropTypes.string,
    }),
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
    };
  }

  componentWillMount(props) {
  }

  componentWillReceiveProps(props) {
  }

  render = () => {

    if (this.state.loading) return <Loading text={'Cargando...'} />;
    return (
      <View style={[AppStyles.container]}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={{paddingRight: 10, paddingLeft: 10, marginTop: AppSizes.navbarHeight + 10}}
          >
          <Text>Aplicación sin ánimo de lucro para fomentar y facilitar el uso del transporte público en Vigo.</Text>
          <Text>Creada por el desarrollador independiente Ismael Serrano - info@ismaserrano.com.</Text>
          <Spacer size={10} />
          <Text>Esta aplicación está en contínua mejora y corrección de errores, por lo que si encuentras algúno y/o tienes alguna sugerencia, tu mensaje será bienvenido. Si deseas donar algo para el mantenimiento de los servicios que hacen que esta app funcione a través de PayPal, será genial!</Text>
          <Spacer size={10} />
          <Text>Los datos cedidos a la aplicación serán guardados y protegidos de acuerdo a la Ley de Protección de Datos y no serán compartidos con terceros, siendo meramente utilizados para dar el mejor soporte personalizado posible en el caso de que lo hubiere.</Text>
          <Spacer size={10} />
          <Text>Los datos de paradas y estimaciones en tiempo real son proporcionados por Viguesa de Transportes, S.L a través de la web www.vitrasa.es.</Text>
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutContainer);
