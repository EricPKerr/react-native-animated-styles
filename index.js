'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Animated,
  ViewPropTypes
} from 'react-native';

import {
  flattenStyle,
  getDefaultStyleValue,
  wrapTransforms
} from './utils';

import tinycolor from 'tinycolor2';

function createComponent(WrappedComponent) {
  class AnimatedStylesComponent extends PureComponent {
    static propTypes = {
      style: ViewPropTypes.style,
      animatedStyle: ViewPropTypes.style,
      duration: PropTypes.number,
      animateInitial: PropTypes.bool,
      active: PropTypes.bool,
      useNativeDriver: PropTypes.bool
    };

    static defaultProps = {
      duration: 500,
      animateInitial: false,
      active: false,
      useNativeDriver: false
    };

    constructor(props) {
      super(props);

      this.state = {
        defaultStyle: this.getDefaultStyle(),
        active: props.active,
        animatedValue: new Animated.Value(props.active && !props.animateInitial ? 1 : 0)
      }

      this.state.animatedStyle = this.getAnimatedStyle();
    }

    componentDidMount() {
      if(this.props.animateInitial) this.animate();
    }

    componentWillReceiveProps(props) {
      if(props.active != this.state.active) {
        this.setState({
          active: props.active
        }, () => {
          this.animate();
        })
      }
    }

    getDefaultStyle() {
      const { style, active, animatedStyle, animateInitial } = this.props;

      let styles = [style];

      if(active && !animateInitial) styles.push(animatedStyle);

      return Object.assign({}, flattenStyle(styles));
    }

    getAnimatedStyle() {
      const { style, animatedStyle } = this.props;

      const start = flattenStyle(style),
        finish = flattenStyle(animatedStyle);

      let styles = {};

      Object.keys(finish).forEach(key => {
        styles[key] = this.state.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: this.getOutputRange(key, start, finish)
        })
      });

      return styles;
    }

    getOutputRange(key, start, finish) {
      start = start.hasOwnProperty(key) ? start[key] : getDefaultStyleValue(key, start);
      finish = finish[key];

      return [
        this.formatValue(key, start),
        this.formatValue(key, finish)
      ]
    }

    formatValue(key, value) {
      if(key.toLowerCase().indexOf('color') < 0) return value;
      const color = tinycolor(value);
      return color.toRgbString();
    }

    animate() {
      const { active, useNativeDriver, duration } = this.props;

      this.state.animatedValue.stopAnimation(() => {
        Animated.timing(this.state.animatedValue, {
          toValue: active ? 1 : 0,
          useNativeDriver,
          duration
        }).start();
      });
    }

    render() {
      const { style, ref, children, ...props } = this.props;
      const { defaultStyle, animatedStyle } = this.state;

      return (
        <WrappedComponent ref="view" {...props} style={[
          wrapTransforms(defaultStyle),
          wrapTransforms(animatedStyle)
        ]}>
          {children}
        </WrappedComponent>
      );
    }
  }

  return AnimatedStylesComponent;
}

export default {
  View: createComponent(Animated.View),
  Text: createComponent(Animated.Text),
  Image: createComponent(Animated.Image)
}
