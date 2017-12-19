/**
 * Auth Scenes
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
import { Scene, ActionConst } from 'react-native-router-flux';

// Consts and Libs
import { AppConfig } from '@constants/';

// Scenes
import Authenticate from '@containers/auth/AuthenticateView';
import LoginForm from '@containers/auth/Forms/LoginContainer';
import SignUpForm from '@containers/auth/Forms/SignUpContainer';
import ResetPasswordForm from '@containers/auth/Forms/ResetPasswordContainer';
import UpdateProfileForm from '@containers/auth/Forms/UpdateProfileContainer';

/* Routes ==================================================================== */
const scenes = (
  <Scene key={'authenticate'}>
    <Scene
      hideNavBar
      key={'authLanding'}
      component={Authenticate}
      type={ActionConst.RESET}
      analyticsDesc={'Authentication'}
    />
    <Scene
      {...AppConfig.navbarProps}
      key={'login'}
      title={'Acceder'}
      clone
      component={LoginForm}
      analyticsDesc={'Login'}
    />
    <Scene
      {...AppConfig.navbarProps}
      key={'signUp'}
      title={'Registrarse'}
      clone
      component={SignUpForm}
      analyticsDesc={'Sign Up'}
    />
    <Scene
      {...AppConfig.navbarProps}
      key={'passwordReset'}
      title={'Generar contraseña'}
      clone
      component={ResetPasswordForm}
      analyticsDesc={'Password Reset'}
    />
    <Scene
      {...AppConfig.navbarProps}
      key={'updateProfile'}
      title={'Actualizar perfil'}
      clone
      component={UpdateProfileForm}
      analyticsDesc={'Update Profile'}
    />
  </Scene>
);

export default scenes;
