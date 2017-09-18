import { StyleSheet } from 'react-native';

export function flattenStyle(style) {
  const flatStyle = Object.assign({}, StyleSheet.flatten(style));
  if (flatStyle.transform) {
    flatStyle.transform.forEach(transform => {
      const key = Object.keys(transform)[0];
      flatStyle[key] = transform[key];
    });
    delete flatStyle.transform;
  }
  return flatStyle;
}

const DIRECTIONAL_FALLBACKS = {
  Top: ['Vertical', ''],
  Bottom: ['Vertical', ''],
  Vertical: [''],
  Left: ['Horizontal', ''],
  Right: ['Horizontal', ''],
  Horizontal: [''],
};

const DIRECTIONAL_SUFFICES = Object.keys(DIRECTIONAL_FALLBACKS);

export function getDefaultStyleValue(key, flatStyle) {
  if (key === 'backgroundColor') {
    return 'rgba(0,0,0,0)';
  }
  if (key === 'color' || key.indexOf('Color') !== -1) {
    return 'rgba(0,0,0,1)';
  }
  if (key.indexOf('rotate') === 0 || key.indexOf('skew') === 0) {
    return '0deg';
  }
  if (key === 'opacity' || key.indexOf('scale') === 0) {
    return 1;
  }
  if (key === 'fontSize') {
    return 14;
  }
  if (key.indexOf('margin') === 0 || key.indexOf('padding') === 0) {
    for (let suffix, i = 0; i < DIRECTIONAL_SUFFICES.length; i++) {
      suffix = DIRECTIONAL_SUFFICES[i];
      if (key.substr(-suffix.length) === suffix) {
        const prefix = key.substr(0, key.length - suffix.length);
        const fallbacks = DIRECTIONAL_FALLBACKS[suffix];
        for (let fallback, j = 0; j < fallbacks.length; j++) {
          fallback = prefix + fallbacks[j];
          if (fallback in flatStyle) {
            return flatStyle[fallback];
          }
        }
        break;
      }
    }
  }
  return 0;
}

// These styles need to be nested in a transform array
const TRANSFORM_STYLE_PROPERTIES = [
  'perspective',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'skewX',
  'skewY',
  'translateX',
  'translateY',
];

// Transforms { translateX: 1 } to { transform: [{ translateX: 1 }]}
export function wrapTransforms(style) {
  let wrapped = {};
  Object.keys(style).forEach(key => {
    if (TRANSFORM_STYLE_PROPERTIES.indexOf(key) !== -1) {
      if (!wrapped.transform) {
        wrapped.transform = [];
      }
      wrapped.transform.push({
        [key]: style[key],
      });
    } else {
      wrapped[key] = style[key];
    }
  });
  return wrapped;
}