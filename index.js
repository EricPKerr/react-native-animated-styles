'use strict';

import React from 'react';

import {
  StyleSheet
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import getDefaultStyleValue from 'react-native-animatable/getDefaultStyleValue';
import flatten from 'react-native-animatable/flattenStyle'

import tinycolor from 'tinycolor2';

function createComponent(WrappedComponent) {
  class AnimatedStylesComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        defaultStyle: this.getDefaultStyle()
      }
    }

    componentDidMount() {
      if(this.props.animateInitial) this.animate();
    }

    componentWillReceiveProps(props) {
      this.animate();
    }

    getDefaultStyle() {
      const { style, active, animatedStyle, animateInitial } = this.props;

      let styles = [style];

      if(active && !animateInitial) styles.push(animatedStyle);

      return Object.assign({}, flatten(styles));
    }

    formatValue(key, value) {
      if(key.toLowerCase().indexOf('color') < 0) return value;
      const color = tinycolor(value);
      return color.toRgbString()
    }

    animate(props) {
      const { style, animatedStyle, duration, active } = this.props;

      const animateKeys = Object.keys(flatten(animatedStyle));
      const flattened = flatten(active ? animatedStyle : style);

      let animateTo = {};
      Object.keys(flattened).forEach(key => {
        const value = flattened[key];
        if(animateKeys.indexOf(key) >= 0) {
          animateTo[key] = this.formatValue(key, value);
        }
      })

      animateKeys.forEach(key => {
        if(!animateTo.hasOwnProperty(key)) {
          animateTo[key] = getDefaultStyleValue(key, flattened);
        }
      })

      this.refs.view.transitionTo(animateTo, duration);
    }

    render() {
      const {style, ref, ...props} = this.props;

      return (
        <WrappedComponent ref="view" {...props} style={this.state.defaultStyle}>
          {this.props.children}
        </WrappedComponent>
      );
    }
  }

  AnimatedStylesComponent.defaultProps = {
    duration: 200,
    animateInitial: false,
    active: false
  }

  return AnimatedStylesComponent;
}

export const View = createComponent(Animatable.View);
export const Text = createComponent(Animatable.Text);
export const Image = createComponent(Animatable.Image);
