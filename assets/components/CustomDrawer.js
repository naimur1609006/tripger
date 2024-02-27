import {View, Text, TouchableOpacity, Alert} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import React, {useContext, useEffect, useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {windowWidth} from '../utils/dimension';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';

const CustomDrawer = props => {
  const {logout, userInfo, updatedUser, userToken} = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const getUserData = async userToken => {
    try {
      const token = userToken;
      if (!token) {
        throw new Error('User token not found in AsyncStorage');
      }

      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };

      const response = await axios.get(
        `http://localhost:8080/api/user/getSingleUser/${userInfo.savedUser._id}`,
        config,
      );

      const data = response?.data;

      setName(data?.singleUser.name);
      setEmail(data?.singleUser.email);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    getUserData(userToken);
  });

  return (
    <View style={{flex: 1, backgroundColor: '#0085FF'}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: '#0085FF',
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            marginTop: 15,
          }}>
          <MaterialIcon name="supervised-user-circle" color="#fff" size={40} />
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: '#0085FF',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Text style={{color: '#fff', fontSize: 14, fontWeight: '800'}}>
            {name}
          </Text>

          <Text style={{color: '#fff', fontSize: 12}}>{email}</Text>
        </View>

        <View
          style={{
            flex: 1,
            marginTop: 20,
            width: windowWidth / 2,
            alignSelf: 'center',
            height: 0.5,
            marginBottom: 30,
            backgroundColor: '#fff',
          }}></View>

        <View
          style={{
            flex: 1,
            backgroundColor: '#0085FF',
            paddingTop: 10,
          }}>
          <DrawerItemList {...props} />
        </View>

        <View
          style={{
            flex: 1,
            marginTop: 30,
            width: windowWidth / 2,
            alignSelf: 'center',
            height: 0.5,
            marginBottom: 30,
            backgroundColor: '#fff',
          }}></View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              flex: 1,
              width: 150,
              height: 35,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              logout();
            }}>
            <SimpleLineIcons
              name="logout"
              size={15}
              style={{color: '#0085FF'}}
            />

            <Text
              style={{
                fontSize: 12,
                color: '#0085FF',
                marginLeft: 10,
                fontWeight: '800',
              }}>
              Logout
            </Text>
          </TouchableOpacity>

          {/* Test Purpose */}
          {/* <TouchableOpacity
            style={{with: 40, height: 40}}
            onPress={() => {
              getToken();
            }}>
            <Text>Get Data</Text>
          </TouchableOpacity> */}
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;
