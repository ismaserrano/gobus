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
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Card, Text, Spacer } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  favourite: {
    position: 'absolute',
    top: -45,
    right: 0,
  },
});

/* Component ==================================================================== */
class LineCard extends Component {
  static componentName = 'LineCard';

  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    code: PropTypes.string,
    single: PropTypes.string,
    back: PropTypes.string,
    image: PropTypes.string,
    onPress: PropTypes.func,
    onPressFavourite: PropTypes.func,
    isFavourite: PropTypes.bool,
  }

  static defaultProps = {
    onPress: null,
    onPressFavourite: null,
    isFavourite: null,
  }

  render = () => {
    const { title, id, code, image, single, back, onPress, onPressFavourite, isFavourite } = this.props;

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Card image={image && { uri: image }}>
          <View style={[AppStyles.paddingBottomSml]}>
            <Text h3>{code}</Text>
            <Text>{title}</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }
}

/* Export Component ==================================================================== */
export default LineCard;
