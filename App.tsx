import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, SafeAreaView, StatusBar, ViewProps, TextInput, ActivityIndicator, FlatList, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Pages/HomeScreen';
import logo from './assets/logo-recife-hospeda.png'
import MapScreen from './Pages/MapScreen';


const MyStatusBar = ({backgroundColor, ...props}: any) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);  

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 56 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor:'#48B',
    height: APPBAR_HEIGHT,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <View style={styles.container}>
      <MyStatusBar backgroundColor="#258" barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          header: () => (
            <View style={styles.appBar}>
              <Image source={logo} style={{width: 32, height: 32}}></Image>
            </View>)
        }}>
          <Stack.Screen name="Home" component={HomeScreen}/>
          <Stack.Screen name="Maps" component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
