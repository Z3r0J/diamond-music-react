/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Player from './src/Player'

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    style : isDarkMode?styles.container:styles.containerwhite,
    colortext: isDarkMode?styles.colorwhite:styles.colorblack
  };
  return (
    <View style={backgroundStyle.style}>
      <Player/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerwhite: {
    backgroundColor:'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorwhite:{
    color:'white'
  },
  colorblack:{
    color:'black'
  }
});

export default App;
