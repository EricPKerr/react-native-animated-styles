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
import AnimatedStyles from 'react-native-animated-styles'

class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: true
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        active: !this.state.active
      })
    }, 3000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <AnimatedStyles.View
        style={styles.container}
        animatedStyle={styles.containerActive}
        active={this.state.active}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    width: 50,
    height: 50,
    marginLeft: 10
  },

  containerActive: {
    width: 100,
    height: 100,
    backgroundColor: 'green'
  }
})
```
