import {View, Text, ActivityIndicator} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import MyDrawer from './DrawerNavigator';
import MyStack from './StackNavigator';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/AuthContext';

const AppNav = () => {
  const {isLoading, userToken, errorMsg} = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken !== null ? <MyDrawer /> : <MyStack />}
    </NavigationContainer>
  );
};

export default AppNav;
