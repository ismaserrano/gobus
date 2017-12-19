/**
 * Individual Line Card Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Actions
import * as LineActions from '@redux/lines/actions';

// Components
import LineCardRender from './CardView';

/* Redux ==================================================================== */
// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  replaceFavourites: LineActions.replaceFavourites,
};

/* Component ==================================================================== */
class LineCard extends Component {
  static componentName = 'LineCard';

  static propTypes = {
    line: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      code: PropTypes.string,
      single: PropTypes.string,
      back: PropTypes.string,
      image: PropTypes.string
    }).isRequired,
    replaceFavourites: PropTypes.func.isRequired,
    user: PropTypes.shape({
      uid: PropTypes.string,
    }),
  }

  static defaultProps = {
    favourites: null,
    user: null,
  }

  constructor(props) {
    super(props);

    this.state = { line: props.line };
  }

  componentWillReceiveProps(props) {
    if (props.line) {
      this.setState({ line: props.line });
    }
  }

  /**
    * On Press of Card
    */
  onPressCard = () => {
    Actions.lineView({
      title: this.props.line.title,
      line: this.props.line,
    });
  }

  render = () => {
    const { line } = this.state;
    const { user } = this.props;

    return (
      <LineCardRender
        title={line.title}
        id={line.id}
        code={line.code}
        image={line.image}
        single={line.single}
        back={line.back}
        onPress={this.onPressCard}
      />
    );
  }
}

/* Export Component ==================================================================== */
export default connect(mapStateToProps, mapDispatchToProps)(LineCard);
