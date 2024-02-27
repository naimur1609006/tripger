import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {windowHeight, windowWidth} from '../assets/utils/dimension';
import FormInput from '../assets/components/FormInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormButton from '../assets/components/FormButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../assets/context/AuthContext';

const LoginScreen = ({navigation}) => {
  const {login, userInfo, errorMsg} = useContext(AuthContext);

  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState(errorMsg);

  return (
    <SafeAreaView
      style={{width: '100%', height: '100%', backgroundColor: '#F2F2F2'}}>
      <StatusBar hidden={true} />
      <View
        style={{
          width: windowWidth,
          height: windowHeight / 2,
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/images/login_image.jpeg')}
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
        />

        <View
          style={{
            width: 200,
            height: 100,
            position: 'absolute',
            bottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../assets/images/tripger_logo.png')}
            resizeMode="contain"
            style={{width: '60%'}}
          />
        </View>

        <View>
          <Text
            style={{
              marginTop: windowHeight * 0.02,
              fontWeight: '700',
              fontSize: 16,
            }}>
            Login
          </Text>
        </View>

        {errorMessage ? (
          <View>
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                fontWeight: '800',
                alignSelf: 'center',
                marginTop: 20,
              }}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <View style={{marginTop: windowHeight * 0.03}}>
          <FormInput
            backgroundColor="#fff"
            icon={
              <MaterialCommunityIcons
                name="email"
                size={20}
                color={'#0085FF'}
              />
            }
            textInput={
              <TextInput
                style={{width: '100%', height: '100%', padding: 10}}
                placeholder="Email"
                value={loginInfo.email}
                onChangeText={text => {
                  setLoginInfo({...loginInfo, email: text});
                }}
                autoCapitalize="none"
                secureTextEntry={false}
                onPressIn={() => setErrorMessage(null)}
              />
            }
          />
        </View>

        <View style={{marginTop: windowHeight * 0.016}}>
          <FormInput
            backgroundColor="#fff"
            icon={
              <MaterialCommunityIcons
                name="security"
                size={20}
                color={'#0085FF'}
              />
            }
            textInput={
              <TextInput
                style={{width: '100%', height: '100%', padding: 10}}
                placeholder="Password"
                value={loginInfo.password}
                onChangeText={text => {
                  setLoginInfo({...loginInfo, password: text});
                }}
                autoCapitalize="none"
                secureTextEntry={true}
                onPressIn={() => setErrorMessage(null)}
              />
            }
          />
        </View>

        <View>
          <FormButton
            styles={{
              width: windowWidth / 2.8,
              height: 40,
              backgroundColor: '#0085FF',
              marginTop: 30,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            buttonTitle="Login"
            textStyle={{color: '#fff', fontSize: 15, fontWeight: '700'}}
            onPress={() => login(loginInfo.email, loginInfo.password)}
          />
        </View>

        <View style={{marginTop: 20, flexDirection: 'row'}}>
          <Text style={{color: '#777777', fontSize: 12}}>
            Don't have an Account?
          </Text>
          <TouchableOpacity
            style={{marginLeft: 5}}
            onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#0085FF', fontWeight: '800', fontSize: 12}}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
