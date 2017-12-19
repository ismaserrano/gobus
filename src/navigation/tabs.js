/**
 * Tabs Scenes
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import { Scene } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';
import { AppStyles, AppSizes } from '@theme/';

// Components
import { TabIcon } from '@ui/';
import { NavbarMenuButton } from '@containers/ui/NavbarMenuButton/NavbarMenuButtonContainer';

// Scenes
import Placeholder from '@components/general/Placeholder';
import Error from '@components/general/Error';

import Lines from '@containers/lines/Listing/ListingContainer';
import LineView from '@containers/lines/LineView';

import MapContainer from '@containers/map/MapContainer';

import FavouritesContainer from '@containers/favourites/FavouritesContainer';

import CameraContainer from '@containers/camera/CameraContainer';

const navbarPropsTabs = {
  ...AppConfig.navbarProps,
  renderLeftButton: () => <NavbarMenuButton />,
  sceneStyle: {
    ...AppConfig.navbarProps.sceneStyle,
    paddingBottom: AppSizes.tabbarHeight,
  },
};

/* Routes ==================================================================== */
const scenes = (
  <Scene key={'tabBar'} tabs tabBarIconContainerStyle={AppStyles.tabbar} pressOpacity={0.95}>
    <Scene
      {...navbarPropsTabs}
      key={'map'}
      title={'Lineas'}
      // component={MapContainer}
      icon={props => TabIcon({ ...props, icon: 'search' })}
    >
      <Scene
        {...navbarPropsTabs}
        key={'linesMap'}
        component={MapContainer}
        title={'Lineas'}
        analyticsDesc={'Map: Browse Lines Map'}
      />
    </Scene>

    <Scene
        {...navbarPropsTabs}
        key={'lines'}
        title={'Lineas'}
        icon={props => TabIcon({ ...props, icon: 'timeline' })}
      >
      <Scene
        {...navbarPropsTabs}
        key={'linesListing'}
        component={Lines}
        title={'Lineas'}
        analyticsDesc={'Lines: Browse Lines'}
      />
      <Scene
        {...AppConfig.navbarProps}
        key={'lineView'}
        component={LineView}
        getTitle={props => ((props.title) ? props.title : 'Detalle linea')}
        analyticsDesc={'LineView: View Line'}
      />
    </Scene>

    <Scene
      key={'favouritesContainer'}
      {...navbarPropsTabs}
      title={'Paradas favoritas'}
      component={FavouritesContainer}
      icon={props => TabIcon({ ...props, icon: 'star' })}
      analyticsDesc={'Favourites: Favourites List'}
    />

    <Scene
      key={'styleGuide'}
      {...navbarPropsTabs}
      title={'Escanear QR'}
      component={CameraContainer}
      icon={props => TabIcon({ ...props, icon: 'qrcode-scan', type: 'material-community' })}
      analyticsDesc={'CameraContainer: Scanning QR'}
    />
  </Scene>
);

export default scenes;
