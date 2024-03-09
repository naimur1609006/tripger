import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useRef, useContext} from 'react';
import {windowHeight, windowWidth} from '../assets/utils/dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FormInput from '../assets/components/FormInput';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CalendarPicker from 'react-native-calendar-picker';
import {AuthContext} from '../assets/context/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreatetripScreen = ({navigation}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {userToken} = useContext(AuthContext);

  //textInputs State

  const [createTrip, setCreateTrip] = useState({
    tripName: '',
    tripLocation: '',
    startingFrom: '',
  });
  const [startDate, setStartDate] = useState('DD/MM/YYYY');
  const [endDate, setEndDate] = useState('DD/MM/YYYY');

  //Dynamic Text Fields for Member List
  const [textFields, setTextFields] = useState([
    {id: 0, name: '', amount: ''},
    {id: 1, name: '', amount: ''},
    {id: 2, name: '', amount: ''},
  ]);

  //Date Selection Function -->>> Calendar Picker

  const minDate = new Date();
  const onDateChange = (date, type) => {
    const newDate = JSON.stringify(date);
    const newDate1 = newDate.substring(1, newDate.length - 1);
    const dates = newDate1.split('T');
    const date1 = dates[0].split('-');
    const day = date1[2];
    const month = date1[1];
    const year = date1[0];

    if (type == 'END_DATE') {
      if (day == undefined) {
        setStartDate('DD/MM/YYYY');
      } else {
        setEndDate(day + '/' + month + '/' + year);
      }
    } else {
      setStartDate(day + '/' + month + '/' + year);
      setEndDate('DD/MM/YYYY');
    }
  };

  // Add Text Fields in member list by clicking button

  const addTextField = () => {
    const newTextField = {
      id: textFields.length ? textFields[textFields.length - 1].id + 1 : 0,
      name: '',
      amount: '',
    };

    setTextFields([...textFields, newTextField]);
  };

  //Member List textfield's onChange Text

  const onChangeText = (text, fieldId, key) => {
    const updatedTextFields = textFields.map(field => {
      if (field.id === fieldId) {
        return {...field, [key]: text};
      }
      return field;
    });

    setTextFields(updatedTextFields);
  };

  //remove textfields by clicking remove button in member list

  const removeTextField = fieldId => {
    if (textFields.length === 1) return;
    const updatedTextFields = textFields.filter(field => field.id !== fieldId);
    setTextFields(updatedTextFields);
  };

  // For Bottom sheet open and close

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ['62%'];

  function handlePresentModal() {
    bottomSheetModalRef.current?.present();
    setIsOpen(true);
  }

  function handleCloseModal() {
    bottomSheetModalRef.current?.close();
    setIsOpen(false);
  }

  //Error Message State

  const [errorMessage, setErrorMessage] = useState('');

  //Create trip API CALL

  const fetchCreateTripAPI = async () => {
    try {
      const tripData = {
        tripName: createTrip.tripName,
        tripLocation: createTrip.tripLocation,
        startingFrom: createTrip.startingFrom,
        startDate: startDate,
        endDate: endDate,
        members: textFields,
      };

      const response = await axios.post(
        'http://localhost:8080/api/trip/createTrip',
        tripData,
        {
          headers: {
            Authorization: `${userToken}`,
          },
        },
      );

      await AsyncStorage.setItem('tripId', response.data.tripDetails._id);
      navigation.navigate('Home2');
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  const handleCreateTrip = async () => {
    const hasEmptyFields = textFields.some(
      member => member.name.trim() === '' || member.amount.trim() === '',
    );

    if (
      createTrip.tripName === '' ||
      createTrip.tripLocation === '' ||
      createTrip.startingFrom === ''
    ) {
      setErrorMessage('All Fields must be fulfilled');
      return;
    } else if (startDate === 'DD/MM/YYYY' || endDate === 'DD/MM/YYYY') {
      setErrorMessage(
        'Starting date and ending date not selected. Choose Date.',
      );
      return;
    } else if (hasEmptyFields) {
      setErrorMessage('Some member fields are empty.');
      return;
    } else {
      try {
        await fetchCreateTripAPI();
      } catch (error) {
        console.error('Error creating trip:', error);
      }
    }
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={{
          width: windowWidth,
          height: windowHeight,
          backgroundColor: '#f2f2f2',
        }}>
        <View
          style={{
            width: windowWidth - 20,
            marginTop: 10,
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
            onPress={() => navigation.navigate('Home2')}>
            <AntDesign name="arrowleft" size={18} />
          </TouchableOpacity>
          <Text style={{fontSize: 16, fontWeight: '800'}}>Create New Trip</Text>
          <View style={{width: 50, height: 50}}></View>
        </View>

        {errorMessage ? (
          <Text
            style={{
              color: 'red',
              fontSize: 12,
              fontWeight: '800',
              alignSelf: 'center',
              marginVertical: 10,
            }}>
            {errorMessage}
          </Text>
        ) : null}

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{
            borderRadius: 40,
          }}
          onDismiss={() => setIsOpen(false)}>
          <View
            style={{
              width: windowWidth - 60,
              marginHorizontal: 30,
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 12,
                alignSelf: 'center',
                color: '#0085FF',
                marginBottom: 20,
                fontWeight: '700',
              }}>
              Select Your Start Date and end date together
            </Text>
            <CalendarPicker
              width={windowWidth - 40}
              startFromMonday={true}
              allowRangeSelection={true}
              minDate={minDate}
              todayBackgroundColor="#ccc"
              selectedDayColor="#0086FF"
              selectedDayTextColor="#FFFFFF"
              onDateChange={onDateChange}
            />
          </View>

          <View
            style={{
              width: windowWidth - 60,
              marginHorizontal: 30,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                width: '30%',
                height: 30,
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                flexDirection: 'row',
                marginRight: 25,
              }}
              onPress={() => {
                handleCloseModal();
              }}>
              <Entypo name="cross" size={22} color="#fff" />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: '800',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: '30%',
                height: 30,
                backgroundColor: '#0085FF',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                flexDirection: 'row',
              }}
              onPress={() => {
                handleCloseModal();
              }}>
              <AntDesign name="check" size={22} color="#fff" />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: '800',
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetModal>
        <ScrollView>
          <View style={{marginTop: windowHeight * 0.016}}>
            <FormInput
              backgroundColor={isOpen ? 'rgba(255,255,255,0.5)' : '#fff'}
              icon={
                <FontAwesome name="pencil-square" size={20} color={'#0085FF'} />
              }
              textInput={
                <TextInput
                  style={{width: '100%', height: '100%', padding: 10}}
                  placeholder="Trip Name"
                  value={createTrip.tripName}
                  onChangeText={text => {
                    setCreateTrip({...createTrip, tripName: text});
                  }}
                  secureTextEntry={false}
                  autoCapitalize="none"
                  onPressIn={() => setErrorMessage(null)}
                />
              }
            />
          </View>

          <View style={{marginTop: windowHeight * 0.016}}>
            <FormInput
              backgroundColor={isOpen ? 'rgba(255,255,255,0.5)' : '#fff'}
              icon={<Entypo name="location" size={20} color={'#0085FF'} />}
              textInput={
                <TextInput
                  style={{width: '100%', height: '100%', padding: 10}}
                  placeholder="Trip Location"
                  value={createTrip.tripLocation}
                  secureTextEntry={false}
                  onChangeText={text => {
                    setCreateTrip({...createTrip, tripLocation: text});
                  }}
                  autoCapitalize="none"
                  onPressIn={() => setErrorMessage(null)}
                />
              }
            />
          </View>

          <View style={{marginTop: windowHeight * 0.016}}>
            <FormInput
              backgroundColor={isOpen ? 'rgba(255,255,255,0.5)' : '#fff'}
              icon={<Ionicons name="location" size={20} color={'#0085FF'} />}
              textInput={
                <TextInput
                  style={{width: '100%', height: '100%', padding: 10}}
                  placeholder="Starting from"
                  value={createTrip.startingFrom}
                  secureTextEntry={false}
                  onChangeText={text => {
                    setCreateTrip({...createTrip, startingFrom: text});
                  }}
                  autoCapitalize="none"
                  onPressIn={() => setErrorMessage(null)}
                />
              }
            />
          </View>

          <View
            style={{
              width: windowWidth - 60,
              marginHorizontal: 30,
              marginTop: 30,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}>
            <Text style={{fontSize: 12, fontWeight: '700'}}>Trip Timeline</Text>

            <View>
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 30,
                  borderRadius: 20,

                  backgroundColor: '#0085FF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
                onPress={() => {
                  handlePresentModal();
                  setErrorMessage(null);
                }}>
                <Ionicons name="calendar" size={12} color="#fff" />
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: '#fff',
                    marginLeft: 5,
                  }}>
                  Choose Date
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              width: windowWidth - 60,
              marginHorizontal: 30,
              height: 60,
              backgroundColor: isOpen ? 'rgba(255,255,255,0.5)' : '#fff',
              marginTop: 15,
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '45%',
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 12, fontWeight: '600'}}>
                Tour Starting Date
              </Text>

              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: '#0085FF',
                  marginTop: 5,
                }}>
                {startDate}
              </Text>
            </View>

            <View
              style={{width: 1, height: 60, backgroundColor: '#ccc'}}></View>

            <View
              style={{
                width: '45%',
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 12, fontWeight: '600'}}>
                Tour Ending Date
              </Text>

              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: '#0085FF',
                  marginTop: 5,
                }}>
                {endDate}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: windowWidth - 60,
              marginHorizontal: 30,
              marginTop: 30,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 12, fontWeight: '700'}}>Member List</Text>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={addTextField}>
              <Text style={{fontSize: 12, fontWeight: '700', color: '#0085FF'}}>
                Add Member
              </Text>
              <Entypo name="plus" size={14} color={'#0085FF'} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: windowWidth - 60,
              marginHorizontal: 30,
              marginTop: 10,
              marginBottom: 50,
            }}>
            {textFields.map(field => (
              <View
                key={field.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <TextInput
                  style={{
                    height: 30,
                    width: '65%',
                    backgroundColor: '#fff',
                    paddingHorizontal: 10,
                    borderRadius: 15,
                    fontSize: 12,
                    color: '#000',
                  }}
                  autoCorrect={false}
                  placeholder="Member Name"
                  value={field.name}
                  onChangeText={text => onChangeText(text, field.id, 'name')}
                  onPressIn={() => setErrorMessage(null)}
                />
                <TextInput
                  style={{
                    height: 30,
                    width: '30%',
                    backgroundColor: '#fff',
                    paddingHorizontal: 10,
                    borderRadius: 15,
                    fontSize: 12,
                    color: '#000',
                  }}
                  placeholder="Amount"
                  value={field.amount}
                  onChangeText={text => onChangeText(text, field.id, 'amount')}
                  onPressIn={() => setErrorMessage(null)}
                />
                {textFields.length > 1 && ( // Only render the Remove button if there are multiple fields
                  <TouchableOpacity
                    style={{position: 'absolute', right: 0, top: -5}}
                    onPress={() => removeTextField(field.id)}>
                    <Entypo name="circle-with-cross" size={18} color={'red'} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={{
            width: windowWidth,
            height: 45,
            backgroundColor: '#0085FF',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
          }}
          onPress={() => {
            handleCreateTrip();
          }}>
          <Text style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>
            Create Trip
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default CreatetripScreen;
