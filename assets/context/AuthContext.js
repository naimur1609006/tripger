import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, useEffect} from 'react';
import axios from 'axios';

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [updatedUser, setUpdatedUser] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    await axios
      .post('http://localhost:8080/api/user/login', {
        email,
        password,
      })
      .then(res => {
        if (res && res.data && res.data.token) {
          let userInfo = res.data;
          // console.log(res.data.savedUser._id);
          setUserInfo(userInfo);
          setUserToken(userInfo.token);

          AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
          AsyncStorage.setItem('userToken', userInfo.token);
        } else {
          if (res.data.message === 'Please add email and password') {
            setErrorMsg(res.data.message);
          }
          if (res.data.message === 'This is not a saved user') {
            setErrorMsg(res.data.message);
          }
          if (res.data.message === 'Wrong Password') {
            setErrorMsg(res.data.message);
          }
        }
      })
      .catch(e => {
        console.log(`login error ${e}`);
      });

    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    await AsyncStorage.removeItem('userInfo');
    await AsyncStorage.removeItem('userToken');
    setIsLoading(false);
  };

  const UpdateProfile = async (
    name,
    country,
    phoneNumber,
    about,
    profession,
    workplace,
  ) => {
    await axios
      .patch(
        `http://localhost:8080/api/user/updateUser/${userInfo.savedUser._id}`,
        {
          name,
          country,
          phoneNumber,
          about,
          profession,
          workplace,
        },
        {
          headers: {
            Authorization: `${userToken}`,
          },
        },
      )
      .then(res => {
        let updatedInfo = res.data;

        setUpdatedUser(updatedInfo);
        // setUserInfo(updatedInfo);

        AsyncStorage.setItem('updateUserInfo', JSON.stringify(updatedInfo));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userInfo = await AsyncStorage.getItem('userInfo');
      let userToken = await AsyncStorage.getItem('userToken');
      //let updatedUser = await AsyncStorage.getItem('updateUserInfo');
      userInfo = JSON.parse(userInfo);
      // updatedUser = JSON.parse(updatedUser);
      // console.log(updatedUser);

      if (userInfo) {
        setUserToken(userToken);
        setUserInfo(userInfo);
      }

      // if (updatedUser) {
      //   setUpdatedUser(updatedUser);
      // }

      setIsLoading(false);
    } catch (error) {
      console.log(`is logged in error ${error}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        UpdateProfile,
        isLoading,
        userToken,
        errorMsg,
        userInfo,
        updatedUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
