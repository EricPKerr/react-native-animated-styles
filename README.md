# react-native-animated-styles

Easily animate react-native components between two styles.  Similar concept to adding and removing a CSS class to animate HTML Elements for the web.

# Install

`npm install --save react-native-animated-styles`

# Properties

```
<AnimatedStyles.View/Text/Image
  style={}           // Default Element Style
  animatedStyle={}   // Animated Element Style (what the element animates to)
  active={}          // Whether the animated state is active
  duration={}        // Animation Duration
  animateInitial={}  // Whether component should initially animate if it's currently active
  useNativeDriver={} // Use native driver for performance
/>
```

# Example Usage

```
import AnimatedStyles from 'react-native-animated-styles';
import { useEffect, useState } from 'react';

const MyComponent = () => {
  const [ active, setActive ] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setActive((active) => !active);
    }, 3000);
  }, []);

  return (
    <View style={styles.wrap}>
      <AnimatedStyles.View
        style={styles.box}
        animatedStyle={styles.boxActive}
        active={active}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  box: {
    backgroundColor: 'rgb(73, 0, 9)', // normalizes colors
    width: 80,
    height: 80
  },

  boxActive: {
    width: 100,
    height: 100,
    backgroundColor: '#AC0E28',
    transform: [
      { rotate: '45deg' } // uses default values for transform properties
    ]
  }
});
```

![Example](https://github.com/EricPKerr/react-native-animated-styles/blob/master/Example.gif?raw=true)

