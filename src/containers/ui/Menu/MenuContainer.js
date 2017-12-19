/**
 * Menu Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import MenuRender from './MenuView';

import AboutContainer from '@containers/about/AboutContainer';

// Authenticated User Menu
const authMenu = [
  { title: 'Actualizar perfil', onPress: () => { Actions.updateProfile(); } },
  { title: 'Cambiar contraseña', onPress: () => { Actions.passwordReset(); } },
];

// Unauthenticated User Menu
const unauthMenu = [
  { title: 'Acceder', onPress: () => { Actions.login(); } },
  { title: 'Registrarse', onPress: () => { Actions.signUp(); } },
];

// Unauthenticated User Menu
const additionalMenu = [
  { title: '', onPress: () => {} },
  { title: 'Sobre la app', onPress: () => { Actions.about(); } },
];

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
  unauthMenu,
  authMenu,
  additionalMenu,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  logout: UserActions.logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuRender);
