# react-native-animate-styles

Easily animate react-native components between two styles

# Install

`npm install --save react-native-animate-styles`

# Usage

```
import AnimateStyles from 'react-native-animate-styles'

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
      <AnimateStyles.View
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
