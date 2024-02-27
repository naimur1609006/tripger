import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {windowWidth} from '../assets/utils/dimension';
import FormInput from '../assets/components/FormInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FormButton from '../assets/components/FormButton';

const RegisterScreen = ({navigation}) => {
  const [registrationInfo, setRegistrationInfo] = useState({
    name: '',
    email: '',
    country: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState(null);

  const sendRegistrationInfoToBackend = () => {
    if (
      registrationInfo.name == '' ||
      registrationInfo.email == '' ||
      registrationInfo.country == '' ||
      registrationInfo.password == '' ||
      registrationInfo.confirmPassword == ''
    ) {
      setErrorMessage('All fields must be filled');
    } else {
      if (registrationInfo.password != registrationInfo.confirmPassword) {
        setErrorMessage('Password and confirm password does not match');
        return;
      } else {
        //Api call for verify the email
        fetch('http://localhost:8080/api/user/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationInfo),
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.message === 'This email is already exists') {
              setErrorMessage(data.message);
            } else if (
              data.message === 'Verification code sent to your email'
            ) {
              navigation.navigate('Verify', {userData: data.uData});
            }
          });
      }
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#f2f2f2'}}>
      <Image
        source={require('../assets/images/tripger_logo_2.png')}
        resizeMode="contain"
        style={{
          width: windowWidth * 0.25,
          alignSelf: 'center',
          marginVertical: 40,
        }}
      />
      <Text style={{alignSelf: 'center', fontWeight: '700', fontSize: 16}}>
        Register
      </Text>

      {errorMessage ? (
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
      ) : null}

      <View style={{marginTop: 20}}>
        <FormInput
          backgroundColor="#fff"
          icon={
            <MaterialCommunityIcons
              name="rename-box"
              size={20}
              color={'#0085FF'}
            />
          }
          textInput={
            <TextInput
              style={{width: '100%', height: '100%', padding: 10}}
              placeholder="Name"
              value={registrationInfo.name}
              onChangeText={text => {
                setRegistrationInfo({...registrationInfo, name: text});
              }}
              autoCapitalize="none"
              onPressIn={() => setErrorMessage(null)}
            />
          }
        />
      </View>

      <View style={{marginTop: 10}}>
        <FormInput
          backgroundColor="#fff"
          icon={
            <MaterialCommunityIcons name="email" size={20} color={'#0085FF'} />
          }
          textInput={
            <TextInput
              style={{width: '100%', height: '100%', padding: 10}}
              placeholder="Email"
              value={registrationInfo.email}
              onChangeText={text => {
                setRegistrationInfo({...registrationInfo, email: text});
              }}
              autoCapitalize="none"
              onPressIn={() => setErrorMessage(null)}
            />
          }
        />
      </View>

      <View style={{marginTop: 10}}>
        <FormInput
          backgroundColor="#fff"
          icon={
            <MaterialCommunityIcons name="flag" size={20} color={'#0085FF'} />
          }
          textInput={
            <TextInput
              style={{width: '100%', height: '100%', padding: 10}}
              placeholder="Country"
              value={registrationInfo.country}
              onChangeText={text => {
                setRegistrationInfo({...registrationInfo, country: text});
              }}
              autoCapitalize="none"
              onPressIn={() => setErrorMessage(null)}
            />
          }
        />
      </View>

      <View style={{marginTop: 10}}>
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
              value={registrationInfo.password}
              onChangeText={text => {
                setRegistrationInfo({...registrationInfo, password: text});
              }}
              autoCapitalize="none"
              secureTextEntry={true}
              onPressIn={() => setErrorMessage(null)}
            />
          }
        />
      </View>

      <View style={{marginTop: 10}}>
        <FormInput
          backgroundColor="#fff"
          icon={
            <MaterialCommunityIcons
              name="lock-check"
              size={20}
              color={'#0085FF'}
            />
          }
          textInput={
            <TextInput
              style={{width: '100%', height: '100%', padding: 10}}
              placeholder="Confirm Password"
              value={registrationInfo.confirmPassword}
              onChangeText={text => {
                setRegistrationInfo({
                  ...registrationInfo,
                  confirmPassword: text,
                });
              }}
              autoCapitalize="none"
              secureTextEntry={true}
              onPressIn={() => setErrorMessage(null)}
            />
          }
        />
      </View>

      <View style={{alignItems: 'center'}}>
        <FormButton
          styles={{
            width: windowWidth / 2.9,
            height: 35,
            backgroundColor: '#0085FF',
            marginTop: 30,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          buttonTitle="Register"
          textStyle={{color: '#fff', fontSize: 14, fontWeight: '700'}}
          onPress={() => sendRegistrationInfoToBackend()}
        />
      </View>

      <View style={{marginTop: 30, alignItems: 'center'}}>
        <Text style={{fontSize: 12, color: '#777777'}}>
          Already have an account?
        </Text>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                color: '#0085FF',
                marginTop: 5,
                fontSize: 12,
                fontWeight: '700',
              }}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
