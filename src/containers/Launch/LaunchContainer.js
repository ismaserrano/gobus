/**
 * Launch Screen Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';
import * as MapActions from '@redux/map/actions';

// The component we're mapping to
import AppLaunchRender from './LaunchView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({
});

// Any actions to map to the component?
const mapDispatchToProps = {
  login: UserActions.login,
  getMapLines: MapActions.getMapLines,
  getFavourites: MapActions.getFavourites,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLaunchRender);
