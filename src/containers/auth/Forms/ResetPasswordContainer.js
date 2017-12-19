/**
 * Forgot Password Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import FormRender from './FormView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
  formType: 'passwordReset',
  formFields: ['Email'],
  buttonTitle: 'Enviar instrucciones',
  successMessage: 'Te hemos enviado un mail con instrucciones',
  introText: 'Por favor, introduce tu email asociado, te enviaremos un mail con instrucciones',
});

// Any actions to map to the component?
const mapDispatchToProps = {
  submit: UserActions.resetPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormRender);
