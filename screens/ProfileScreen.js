import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useContext, useRef, useState, useEffect} from 'react';
import {windowHeight, windowWidth} from '../assets/utils/dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../assets/context/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import FormButton from '../assets/components/FormButton';
import ImagePicker from 'react-native-image-crop-picker';

import userIconImage from '../assets/images/userIcon.png';
import axios from 'axios';

const ProfileScreen = ({navigation}) => {
  const {userInfo, UpdateProfile, userToken} = useContext(AuthContext);

  const DEFAULT_IMAGE = Image.resolveAssetSource(userIconImage).uri;

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [about, setAbout] = useState('');
  const [profession, setProfession] = useState('');
  const [workplace, setWorkplace] = useState('');

  const [image, setImage] = useState(null);

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

      //console.log('dataaaaaaaaaaaa:::::::::::::::', data);
      setName(data?.singleUser.name);
      setEmail(data?.singleUser.email);
      setCountry(data?.singleUser.country);
      setPhoneNumber(data?.singleUser.phoneNumber);
      setAbout(data?.singleUser.about);
      setProfession(data?.singleUser.profession);
      setWorkplace(data?.singleUser.workplace);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    getUserData(userToken);
  }, []);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      borderRadius: 150,
      cropping: true,
    }).then(image => {
      console.log(image);
      setImage(image.path);
      handleCloseModalForCamera();
    });
  };

  const choosePhotoFromLibrary = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      const formData = new FormData();
      formData.append('profileImage', {
        uri: image.path,
        type: image.mime,
        name: image.path.split('/').pop(),
      });

      const response = await axios.patch(
        `http://localhost:8080/api/user/updateUser/${userInfo.savedUser._id}/profileImage`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: userToken,
          },
        },
      );

      //console.log(response.data);

      fetchProfileImage();
      handleCloseModalForCamera();
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const bottomSheetModalRef = useRef(null);

  const snapPoints = ['25%', '50%', '75%'];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setIsOpen(true);
  }

  function handleCloseModal() {
    bottomSheetModalRef.current?.close();
    setIsOpen(false);
  }

  const snapPointsForCamera = ['22%'];
  const bottomSheetModalRef2 = useRef(null);

  function handlePresentModalForCamera() {
    bottomSheetModalRef2.current?.present();
    setIsOpen(true);
  }

  function handleCloseModalForCamera() {
    bottomSheetModalRef2.current?.close();
    setIsOpen(false);
  }

  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/profileImage/${userInfo.savedUser._id}`,
        {
          headers: {
            Authorization: `${userToken}`,
          },
        },
      );
      if (response.data.image) {
        const imageUrl = response.data.image;
        setImage(imageUrl);
      } else {
        setImage(DEFAULT_IMAGE);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={{
          backgroundColor: isOpen ? '#ccc' : '#f2f2f2',
          width: windowWidth,
          height: windowHeight,
        }}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={2}
          snapPoints={snapPoints}
          backgroundStyle={{borderRadius: 40}}
          onDismiss={() => setIsOpen(false)}>
          <View
            style={{
              width: windowWidth - 60,
              marginHorizontal: 30,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 12, fontWeight: '700', color: '#0085FF'}}>
                Update Profile Information
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Text style={{fontSize: 12, fontWeight: '700', color: 'red'}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 20}}></View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Text style={{fontSize: 10, fontWeight: '800', color: '#ccc'}}>
                  Full Name
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: windowWidth - 60,
                    borderBottomColor: '#0085FF',
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    height: 40,
                  }}>
                  <MaterialCommunityIcons
                    name="rename-box"
                    size={17}
                    color={'#0085FF'}
                  />

                  <TextInput
                    placeholder="full name"
                    style={{
                      fontSize: 14,
                      paddingLeft: 20,
                      color: '#000',
                      fontWeight: '700',
                      width: windowWidth - 80,
                    }}
                    value={name}
                    onChangeText={text => setName(text)}
                  />
                </View>
              </View>

              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 10, fontWeight: '800', color: '#ccc'}}>
                  Email ID
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: windowWidth - 60,
                    borderBottomColor: '#0085FF',
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    height: 40,
                  }}>
                  <MaterialCommunityIcons
                    name="email"
                    size={17}
                    color={'#0085FF'}
                  />

                  <View
                    style={{
                      width: windowWidth - 80,
                      marginLeft: 20,
                    }}>
                    <Text
                      style={{fontSize: 14, color: '#000', fontWeight: '700'}}>
                      {userInfo.savedUser.email}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 10, fontWeight: '800', color: '#ccc'}}>
                  Country Name
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: windowWidth - 60,
                    borderBottomColor: '#0085FF',
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    height: 40,
                  }}>
                  <MaterialCommunityIcons
                    name="flag"
                    size={17}
                    color={'#0085FF'}
                  />

                  <TextInput
                    placeholder="Country"
                    style={{
                      fontSize: 14,
                      paddingLeft: 20,
                      color: '#000',
                      fontWeight: '700',
                      width: windowWidth - 80,
                    }}
                    value={country}
                    onChangeText={text => setCountry(text)}
                  />
                </View>
              </View>

              <View
                style={{
                  marginTop: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#0085FF',
                    alignSelf: 'flex-start',
                  }}>
                  Additional Information***
                </Text>

                <View style={{marginTop: 20}}>
                  <Text
                    style={{fontSize: 10, fontWeight: '800', color: '#ccc'}}>
                    Phone Number
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidth - 60,
                      borderBottomColor: '#0085FF',
                      borderBottomWidth: 1,
                      alignItems: 'center',
                      height: 40,
                    }}>
                    <FontAwesome name="phone" size={17} color={'#0085FF'} />

                    <TextInput
                      placeholder="Phone No."
                      style={{
                        fontSize: 14,
                        paddingLeft: 20,
                        color: '#000',
                        fontWeight: '700',
                        width: windowWidth - 80,
                      }}
                      keyboardType="numeric"
                      value={phoneNumber}
                      onChangeText={text => setPhoneNumber(text)}
                    />
                  </View>
                </View>

                <View style={{marginTop: 20}}>
                  <Text
                    style={{fontSize: 10, fontWeight: '800', color: '#ccc'}}>
                    About Me
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidth - 60,
                      borderBottomColor: '#0085FF',
                      borderBottomWidth: 1,
                      alignItems: 'center',
                      height: 40,
                    }}>
                    <MaterialCommunityIcons
                      name="account-details"
                      size={17}
                      color={'#0085FF'}
                    />

                    <TextInput
                      placeholder="About BIO"
                      style={{
                        fontSize: 14,
                        paddingLeft: 20,
                        color: '#000',
                        fontWeight: '700',
                        width: windowWidth - 80,
                      }}
                      value={about}
                      onChangeText={text => setAbout(text)}
                    />
                  </View>
                </View>

                <View style={{marginTop: 20}}>
                  <Text
                    style={{fontSize: 10, fontWeight: '800', color: '#ccc'}}>
                    Profession
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidth - 60,
                      borderBottomColor: '#0085FF',
                      borderBottomWidth: 1,
                      alignItems: 'center',
                      height: 40,
                    }}>
                    <MaterialCommunityIcons
                      name="school"
                      size={17}
                      color={'#0085FF'}
                    />

                    <TextInput
                      placeholder="Profession"
                      style={{
                        fontSize: 14,
                        paddingLeft: 20,
                        color: '#000',
                        fontWeight: '700',
                        width: windowWidth - 80,
                      }}
                      value={profession}
                      onChangeText={text => setProfession(text)}
                    />
                  </View>
                </View>

                <View style={{marginTop: 20}}>
                  <Text
                    style={{fontSize: 10, fontWeight: '800', color: '#ccc'}}>
                    Workplace
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: windowWidth - 60,
                      borderBottomColor: '#0085FF',
                      borderBottomWidth: 1,
                      alignItems: 'center',
                      height: 40,
                    }}>
                    <MaterialCommunityIcons
                      name="office-building-marker"
                      size={17}
                      color={'#0085FF'}
                    />

                    <TextInput
                      placeholder="Workplace"
                      style={{
                        fontSize: 14,
                        paddingLeft: 20,
                        color: '#000',
                        fontWeight: '700',
                        width: windowWidth - 80,
                      }}
                      value={workplace}
                      onChangeText={text => setWorkplace(text)}
                    />
                  </View>
                </View>

                <FormButton
                  styles={{
                    width: windowWidth / 2.9,
                    height: 35,
                    backgroundColor: '#0085FF',
                    marginTop: 20,
                    marginBottom: 50,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  buttonTitle="Update"
                  textStyle={{color: '#fff', fontSize: 14, fontWeight: '700'}}
                  onPress={() => {
                    handleCloseModal();
                    UpdateProfile(
                      name,
                      country,
                      phoneNumber,
                      about,
                      profession,
                      workplace,
                    );
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </BottomSheetModal>

        <BottomSheetModal
          ref={bottomSheetModalRef2}
          index={0}
          snapPoints={snapPointsForCamera}
          backgroundStyle={{borderRadius: 40}}
          onDismiss={() => setIsOpen(false)}>
          <View
            style={{
              width: windowWidth - 60,
              marginHorizontal: 30,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 12, fontWeight: '700'}}>
              Upload Your Photo
            </Text>
            <TouchableOpacity onPress={handleCloseModalForCamera}>
              <Text style={{fontSize: 12, fontWeight: '700', color: 'red'}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: windowWidth - 60,
              marginHorizontal: 30,
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 15,
            }}>
            <View
              style={{
                backgroundColor: '#0085FF',
                borderRadius: 10,
                padding: 10,
                marginRight: 20,
              }}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={takePhotoFromCamera}>
                <Entypo name="camera" size={25} color={'#fff'} />
                <Text style={{fontSize: 11, fontWeight: '600', color: '#fff'}}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                backgroundColor: '#0085FF',
                borderRadius: 10,
                padding: 10,
              }}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={choosePhotoFromLibrary}>
                <FontAwesome name="photo" size={25} color={'#fff'} />
                <Text style={{fontSize: 11, fontWeight: '600', color: '#fff'}}>
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetModal>

        <View
          style={{
            width: windowWidth - 20,
            height: 80,
            justifyContent: 'space-between',
            marginHorizontal: 10,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{
              height: 35,
              width: 40,
              backgroundColor: '#ccc',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}
            onPress={() => {
              navigation.navigate('All Trips');
              handleCloseModal();
            }}>
            <AntDesign name="arrowleft" size={18} color={'#000'} />
          </TouchableOpacity>
          <Text style={{fontSize: 16, fontWeight: '800', color: '#000'}}>
            Profile Screen
          </Text>
          <View style={{width: 50, height: 50}}></View>
        </View>

        <ScrollView>
          {/* Image Upload Portion */}
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}
            onPress={handlePresentModalForCamera}>
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                borderColor: '#0085FF',
                borderWidth: 3,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {image ===
              'http://localhost:8081/assets/assets/images/userIcon.png?platform=ios&hash=6f6bbb16aec97391aefe120ec5a4e6a2' ? (
                <Image
                  source={{uri: image}}
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 65,
                    position: 'absolute',
                  }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={{uri: `http://localhost:8080/${image}`}}
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 65,
                    position: 'absolute',
                  }}
                  resizeMode="contain"
                />
              )}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#0085FF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  top: 45,
                  left: 50,
                }}>
                <Entypo name="camera" size={25} color={'#fff'} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Personal Information Portion */}

          <View
            style={{
              marginTop: 30,
              width: windowWidth - 40,
              marginHorizontal: 20,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: '#000',
                }}>
                Personal Information
              </Text>

              <TouchableOpacity
                style={{
                  width: '30%',
                  height: 30,
                  backgroundColor: '#0085FF',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
                onPress={handlePresentModal}>
                <FontAwesome
                  name="edit"
                  size={14}
                  color={'#fff'}
                  style={{marginRight: 5}}
                />
                <Text style={{fontSize: 11, fontWeight: '700', color: '#fff'}}>
                  Edit profile
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 10}}>
              <View
                style={{
                  width: windowWidth - 40,
                  height: 40,
                  backgroundColor: isOpen ? 'rgba(255,255,255,0.2)' : '#fff',
                  elevation: 7,
                  borderRadius: 10,
                  marginTop: 7,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowOffset: {width: -2, height: 2},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    marginLeft: 20,
                  }}>
                  <FontAwesome
                    name="pencil-square"
                    size={20}
                    color={'#777777'}
                  />
                </View>

                <Text style={{color: '#777777', fontSize: 12, marginRight: 10}}>
                  Full name :
                </Text>

                <Text
                  style={{
                    color: isOpen ? '#777777' : '#0085FF',
                    fontWeight: '600',
                    fontSize: 13,
                  }}>
                  {name}
                </Text>
              </View>
            </View>

            <View style={{marginTop: 5}}>
              <View
                style={{
                  width: windowWidth - 40,
                  height: 40,
                  backgroundColor: isOpen ? 'rgba(255,255,255,0.2)' : '#fff',
                  elevation: 7,
                  borderRadius: 10,
                  marginTop: 7,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowOffset: {width: -2, height: 2},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    marginLeft: 20,
                  }}>
                  <MaterialCommunityIcons
                    name="email"
                    size={20}
                    color={'#777777'}
                  />
                </View>

                <Text style={{color: '#777777', fontSize: 12, marginRight: 10}}>
                  Email ID :
                </Text>

                <Text
                  style={{
                    color: isOpen ? '#777777' : '#0085FF',
                    fontWeight: '600',
                    fontSize: 13,
                  }}>
                  {email}
                </Text>
              </View>
            </View>

            <View style={{marginTop: 5}}>
              <View
                style={{
                  width: windowWidth - 40,
                  height: 40,
                  backgroundColor: isOpen ? 'rgba(255,255,255,0.2)' : '#fff',
                  elevation: 7,
                  borderRadius: 10,
                  marginTop: 7,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowOffset: {width: -2, height: 2},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    marginLeft: 20,
                  }}>
                  <MaterialCommunityIcons
                    name="flag"
                    size={20}
                    color={'#777777'}
                  />
                </View>

                <Text style={{color: '#777777', fontSize: 12, marginRight: 10}}>
                  Country Name :
                </Text>

                <Text
                  style={{
                    color: isOpen ? '#777777' : '#0085FF',
                    fontWeight: '600',
                    fontSize: 13,
                  }}>
                  {country}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: '#000',
                  marginTop: 30,
                }}>
                Additional Information
              </Text>

              <View
                style={{
                  width: windowWidth - 40,
                  height: 40,
                  backgroundColor: isOpen ? 'rgba(255,255,255,0.2)' : '#fff',
                  elevation: 7,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowOffset: {width: -2, height: 2},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    marginLeft: 20,
                  }}>
                  <FontAwesome name="phone" size={20} color={'#777777'} />
                </View>

                <Text style={{color: '#777777', fontSize: 12, marginRight: 10}}>
                  Phone No :
                </Text>

                <Text
                  style={{
                    color: isOpen ? '#777777' : '#000',
                    fontWeight: '500',
                    fontSize: 13,
                  }}>
                  {phoneNumber}
                </Text>
              </View>

              <View
                style={{
                  width: windowWidth - 40,
                  height: 40,
                  backgroundColor: isOpen ? 'rgba(255,255,255,0.2)' : '#fff',
                  elevation: 7,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowOffset: {width: -2, height: 2},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    marginLeft: 20,
                  }}>
                  <MaterialCommunityIcons
                    name="school"
                    size={20}
                    color={'#777777'}
                  />
                </View>

                <Text style={{color: '#777777', fontSize: 12, marginRight: 10}}>
                  Profession :
                </Text>

                <Text
                  style={{
                    color: isOpen ? '#777777' : '#000',
                    fontWeight: '500',
                    fontSize: 13,
                  }}>
                  {profession}
                </Text>
              </View>

              <View
                style={{
                  width: windowWidth - 40,
                  height: 40,
                  backgroundColor: isOpen ? 'rgba(255,255,255,0.2)' : '#fff',
                  elevation: 7,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowOffset: {width: -2, height: 2},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    marginLeft: 20,
                  }}>
                  <MaterialCommunityIcons
                    name="office-building-marker"
                    size={20}
                    color={'#777777'}
                  />
                </View>

                <Text style={{color: '#777777', fontSize: 12, marginRight: 10}}>
                  Workplace :
                </Text>

                <Text
                  style={{
                    color: isOpen ? '#777777' : '#000',
                    fontWeight: '500',
                    fontSize: 13,
                  }}>
                  {workplace}
                </Text>
              </View>

              <View
                style={{
                  width: windowWidth - 40,
                  backgroundColor: isOpen ? 'rgba(255,255,255,0.2)' : '#fff',
                  elevation: 7,
                  borderRadius: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 40,
                  shadowOffset: {width: -2, height: 2},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    marginLeft: 20,
                  }}>
                  <MaterialCommunityIcons
                    name="account-details"
                    size={20}
                    color={'#777777'}
                  />
                </View>

                <Text style={{color: '#777777', fontSize: 12, marginRight: 10}}>
                  About Me:
                </Text>

                <Text
                  style={{
                    color: isOpen ? '#777777' : '#000',
                    fontWeight: '500',
                    fontSize: 13,
                    width: '60%',
                    paddingVertical: 15,
                    textAlign: 'justify',
                  }}>
                  {about}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default ProfileScreen;
