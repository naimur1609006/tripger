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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FormButton from '../assets/components/FormButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useRoute} from '@react-navigation/native';

const VerificationScreen = ({navigation}) => {
  const route = useRoute();
  const {userData} = route.params;

  const [errroMessage, setErrorMessage] = useState(null);
  const [verificationOTP, setVerificationOTP] = useState('');
  const [actualOTP, setActualOTP] = useState(null);

  useEffect(() => {
    setActualOTP(userData[0]?.verificationCode);
  }, []);

  const sentCodeToBackend = () => {
    if (verificationOTP == '') {
      setErrorMessage('Please enter the code');
      return;
    } else if (verificationOTP == actualOTP) {
      const user = {
        name: userData[0]?.name,
        email: userData[0]?.email,
        country: userData[0]?.country,
        password: userData[0]?.password,
      };

      fetch('http://localhost:8080/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.message === 'User Created Successfully') {
            alert(data.message);
            navigation.navigate('Login');
          } else {
            alert('Something went wrong !! try again');
          }
        });
    } else if (verificationOTP != actualOTP) {
      setErrorMessage('Incorrect Code');
      return;
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: '#f2f2f2'}}>
      <TouchableOpacity
        style={{
          marginTop: 40,
          height: 35,
          marginLeft: 20,
          width: 40,
          backgroundColor: '#ccc',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
        }}
        onPress={() => navigation.navigate('Register')}>
        <AntDesign name="arrowleft" size={18} />
      </TouchableOpacity>

      <Image
        source={require('../assets/images/tripger_logo_2.png')}
        resizeMode="contain"
        style={{width: windowWidth * 0.25, alignSelf: 'center', marginTop: 0}}
      />

      <Text
        style={{
          alignSelf: 'center',
          marginTop: 70,
          fontSize: 15,
          color: '#0085FF',
          fontWeight: '800',
        }}>
        Email Verification
      </Text>

      <Text
        style={{
          marginTop: 20,
          fontSize: 12,
          marginHorizontal: 20,
          alignItems: 'center',
          fontWeight: '500',
          justifyContent: 'center',
        }}>
        We have sent an OTP to your email. Please verify OTP ...
      </Text>

      {errroMessage ? (
        <Text
          style={{
            alignSelf: 'center',
            color: 'red',
            fontWeight: '800',
            marginTop: 20,
          }}>
          {errroMessage}
        </Text>
      ) : null}

      <View style={{marginTop: 10}}>
        <FormInput
          icon={<MaterialIcons name="verified" size={20} color={'#0085FF'} />}
          textInput={
            <TextInput
              style={{width: '100%', height: '100%', padding: 10}}
              placeholder="Verify your OTP"
              value={verificationOTP}
              onChangeText={text => setVerificationOTP(text)}
              keyboardType="numeric"
            />
          }
        />

        <View
          style={{
            width: windowWidth - 40,
            marginHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text style={{fontSize: 12, color: '#777777'}}>Don't get OTP?</Text>

          <View style={{width: 10}}></View>

          <TouchableOpacity
            style={{
              width: windowWidth * 0.25,
              backgroundColor: '#0085FF',
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
            }}>
            <Text style={{color: '#ffffff', fontSize: 12, fontWeight: '700'}}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>

        <FormButton
          buttonTitle="Verify OTP"
          styles={{
            width: windowWidth - 40,
            marginTop: 60,
            borderRadius: 5,
            backgroundColor: '#0085FF',
            marginHorizontal: 20,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            sentCodeToBackend();
          }}
          textStyle={{fontSize: 14, fontWeight: '800', color: '#ffffff'}}
        />
      </View>
    </SafeAreaView>
  );
};

export default VerificationScreen;
