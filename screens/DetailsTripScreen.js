import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Button,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, {useContext, useState, useEffect, useRef} from 'react';
import {windowHeight, windowWidth} from '../assets/utils/dimension';
import {useRoute} from '@react-navigation/native';
import {AuthContext} from '../assets/context/AuthContext';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NatureImage from '../assets/images/thirdSliderImage.jpeg';
import ExpenseOptions from '../assets/components/ExpenseOptions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DetailsTripScreen = ({navigation}) => {
  const route = useRoute();
  console.log(route.params.trips_id);

  const {userToken} = useContext(AuthContext);

  const [tripid, setTripId] = useState(null);

  const [singleTripDetails, setSingleTripDetails] = useState('');
  const [memberId, setMemberId] = useState(null);
  const [totalMoney, setTotalMoney] = useState(0);

  const [individualMemberDetails, setIndividualMemberDetails] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const DEFAULT_IMAGE = Image.resolveAssetSource(NatureImage).uri;
  const [image, setImage] = useState(DEFAULT_IMAGE);

  const [showHideButtons, setShowHideButtons] = useState(false);

  //Hide Upload image button for previous Trips
  const [showUploadImageButton, setShowUploadImageButton] = useState(true);

  const checkEndDate = () => {
    if (singleTripDetails && singleTripDetails.endDate) {
      const currentDate = new Date(); // Get current date
      const [day1, month1, year1] = singleTripDetails.endDate.split('/');
      const endingDateString = `${year1}-${month1}-${day1} 23:59:59`;
      const endDateTime = new Date(endingDateString);
      // Convert endDate to Date object

      // Compare endDate with currentDate
      if (endDateTime < currentDate) {
        setShowUploadImageButton(false); // Hide the button if endDate is less than currentDate
      } else {
        setShowUploadImageButton(true); // Show the button otherwise
      }
    } else {
      setShowUploadImageButton(false); // Hide the button if endDate is not available
    }
  };

  useEffect(() => {
    checkEndDate();
  }, [singleTripDetails.endDate]);

  //For Expense BottomSheet
  const snapPointsForOthers = ['54%'];
  const bottomSheetModalRef = useRef(null);

  function handlePresentModalForExpenses() {
    bottomSheetModalRef.current?.present();
    setIsOpen(prevState => !prevState);
  }

  function handleCloseModalForExpenses() {
    bottomSheetModalRef.current?.close();
    setIsOpen(false);
  }

  //For Member BottomSheet
  const bottomSheetModalRef3 = useRef(null);

  function handlePresentModalForMembers() {
    bottomSheetModalRef3.current?.present();
    setIsOpen(prevState => !prevState);
  }

  function handleCloseModalForMembers() {
    bottomSheetModalRef3.current?.close();
    setIsOpen(false);
  }

  //For Money BottomSheet
  const bottomSheetModalRef4 = useRef(null);

  async function handlePresentModalForMoney(memberId) {
    try {
      bottomSheetModalRef4.current?.present();
      setIsOpen(true);
      const response = await axios.get(
        `http://localhost:8080/api/trip/${route.params.trips_id}/members/${memberId}`,
        {
          headers: {
            Authorization: `${userToken}`,
          },
        },
      );
      setIndividualMemberDetails(response.data.member);
    } catch (error) {
      console.log(error, 'in handle money bottom sheet');
    }
  }

  function handleCloseModalForMoney() {
    bottomSheetModalRef4.current?.close();
    setIsOpen(false);
  }

  const getSingleTripsDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/trip/getSingleTrip/${route.params.trips_id}`,
        {
          headers: {
            Authorization: `${userToken}`,
          },
        },
      );
      setTripId(response.data.Single_Trip._id);
      setSingleTripDetails(response.data.Single_Trip);
    } catch (error) {
      console.log(`Single trip Details Error: ${error}`);
    }
  };

  useEffect(() => {
    getSingleTripsDetails();
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
      await ImagePicker.openPicker({
        width: 300,
        height: 300,
        borderRadius: 150,
        cropping: true,
      }).then(image => {
        console.log(image.path);
        setImage(image.path);
        handleCloseModalForCamera();
      });
    } catch (error) {
      console.log(error);
    }
  };

  //For Camera and Library Bottom Sheet
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

  //Show and Hide Buttons
  const handleButtonClick = () => {
    setShowHideButtons(prevState => !prevState);
    setIsOpen(prevState => !prevState);
  };

  const handleHideButtonClick = () => {
    setShowHideButtons(false);
    setIsOpen(prevState => !prevState);
  };

  // Expenses Options In BottomSheet
  const expenseOptions = [
    {label: 'Food Cost', icon: 'fast-food-outline'},
    {label: 'Accommodation', icon: 'bed-outline'},
    {label: 'Transportation', icon: 'car-outline'},
    {label: 'Others Cost', icon: 'ellipsis-horizontal-outline'},
  ];

  const [selectedCategory, setSelectedCategory] = useState(
    expenseOptions[0].label,
  );
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // const handleAddExpense = () => {
  //   // Implement logic to handle adding expense
  //   console.log('Selected category:', selectedCategory);
  //   console.log('Amount:', amount);
  //   console.log('Description:', description);
  // };

  //Dynamic Text Fields for Member List
  const [textFields, setTextFields] = useState([
    {id: 0, name: '', amount: ''},
    {id: 1, name: '', amount: ''},
    {id: 2, name: '', amount: ''},
  ]);

  //Error Message State
  const [errorMessage, setErrorMessage] = useState('');

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

  //Update Member List Function
  const handleUpdateMember = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/trip/updateSingleTrip/addMember/${route.params.trips_id}`,
        {
          newMembers: textFields,
        },
        {
          headers: {
            Authorization: `${userToken}`,
          },
        },
      );
      console.log('Trip details updated:', response.data);

      setSingleTripDetails(prevTripDetails => ({
        ...prevTripDetails,
        members: response.data.updatedTrip.members,
      }));

      setTextFields([
        {id: 0, name: '', amount: ''},
        {id: 1, name: '', amount: ''},
        {id: 2, name: '', amount: ''},
      ]);
      handleCloseModalForMembers();
    } catch (error) {
      console.error('Error updating trip details:', error);
    }
  };

  //handle update additional money function
  const [additionalAmount, setAdditionalAmount] = useState('');

  const handleAddMoney = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/trip//additional-amount/${route.params.trips_id}/members/${memberId}`,
        {additionalAmount},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${userToken}`,
          },
        },
      );

      console.log(response.data.updatedTrip);

      setSingleTripDetails(response.data.updatedTrip);

      setAdditionalAmount('');

      handleCloseModalForMoney();
    } catch (error) {
      console.error('Error adding additional amount:', error);
      // You can handle errors, e.g., show an error message to the user
    }
  };

  // Initialize totalAmount variable
  let totalAmount = 0;

  useEffect(() => {
    // Calculate total amount when tripDetails updates
    if (singleTripDetails) {
      let total = 0;
      singleTripDetails.members.forEach(member => {
        total += member.amount; // Add base amount
        if (member.additionalAmounts.length > 0) {
          total += member.additionalAmounts.reduce(
            (acc, curr) => acc + curr,
            0,
          ); // Add additional amounts
        }
      });
      setTotalMoney(total);
    }
  }, [singleTripDetails]);

  //delete member by Id
  const handleDeleteMember = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/trip/${route.params.trips_id}/members/${memberId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${userToken}`,
          },
        },
      );

      if (singleTripDetails && singleTripDetails.members) {
        setSingleTripDetails(prevTripDetails => ({
          ...prevTripDetails,
          members: prevTripDetails.members.filter(
            member => member._id !== memberId,
          ),
        }));
      }
      handleCloseModalForMoney();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  // Update trip costs

  const handleAddExpense = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/trip/${route.params.trips_id}/costs`,
        {
          category: selectedCategory,
          amount: amount,
          description: description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${userToken}`,
          },
        },
      );
      setAmount('');
      setDescription('');

      handleCloseModalForExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
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
        {/* Image Upload BottomSheet */}
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

        {/* Add Expense BottomSheet */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPointsForOthers}
          backgroundStyle={{borderRadius: 40}}
          onDismiss={() => setIsOpen(false)}>
          <View
            style={{
              width: windowWidth - 40,
              marginHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: '#000', fontWeight: '700', fontSize: 13}}>
              Add Expenses To
            </Text>
            <TouchableOpacity onPress={handleCloseModalForExpenses}>
              <Text style={{color: 'red', fontWeight: '600', fontSize: 12}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

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

          <ScrollView>
            <View style={{marginTop: 10}}>
              <ExpenseOptions
                options={expenseOptions}
                selectedOption={selectedCategory}
                onSelect={setSelectedCategory}
              />

              <Text
                style={{marginHorizontal: 30, fontSize: 12, fontWeight: '700'}}>
                Amount
              </Text>
              <View
                style={{
                  width: windowWidth - 40,
                  marginHorizontal: 20,
                  backgroundColor: '#E3F2FF',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                  marginVertical: 6,
                }}>
                <TextInput
                  placeholder="Amount"
                  value={amount}
                  style={{fontSize: 12}}
                  onChangeText={text => setAmount(text)}
                  onPressIn={() => setErrorMessage(null)}
                />
              </View>

              <Text
                style={{
                  marginHorizontal: 30,
                  fontSize: 12,
                  fontWeight: '700',
                  marginTop: 10,
                }}>
                Description
              </Text>
              <View
                style={{
                  width: windowWidth - 40,
                  marginHorizontal: 20,
                  backgroundColor: '#E3F2FF',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  marginVertical: 6,
                }}>
                <TextInput
                  placeholder="Description About Cost"
                  value={description}
                  style={{fontSize: 12}}
                  onChangeText={text => setDescription(text)}
                  onPressIn={() => setErrorMessage(null)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#0085FF',
                padding: 10,
                alignSelf: 'center',
                borderRadius: 20,
                marginTop: 20,
              }}
              onPress={() => {
                if (amount === null || description === '') {
                  setErrorMessage('All Fields must be Filled');
                } else {
                  handleAddExpense();
                }
              }}>
              <Text style={{fontSize: 12, fontWeight: '600', color: '#fff'}}>
                Add Expense
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </BottomSheetModal>

        {/* New Member Add Bottom Sheet */}
        <BottomSheetModal
          ref={bottomSheetModalRef3}
          index={0}
          snapPoints={snapPointsForOthers}
          backgroundStyle={{borderRadius: 40}}
          onDismiss={() => setIsOpen(false)}>
          {errorMessage ? (
            <Text
              style={{
                color: 'red',
                fontSize: 12,
                fontWeight: '800',
                alignSelf: 'center',
                marginBottom: 20,
              }}>
              {errorMessage}
            </Text>
          ) : null}
          <View
            style={{
              width: windowWidth - 40,
              marginHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: '#000', fontWeight: '700', fontSize: 13}}>
              New Members List
            </Text>
            <TouchableOpacity onPress={handleCloseModalForMembers}>
              <Text style={{color: 'red', fontWeight: '600', fontSize: 12}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            <TouchableOpacity
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                alignSelf: 'flex-end',
              }}
              onPress={addTextField}>
              <Text style={{fontSize: 12, fontWeight: '700', color: '#0085FF'}}>
                Add Members ++
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: windowWidth - 40,
                marginHorizontal: 20,
                marginTop: 10,
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
                    key="member-name-textInput"
                    style={{
                      height: 30,
                      width: '65%',
                      backgroundColor: '#E3F2FF',
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
                    key="amount-textInput"
                    style={{
                      height: 30,
                      width: '30%',
                      backgroundColor: '#E3F2FF',
                      paddingHorizontal: 10,
                      borderRadius: 15,
                      fontSize: 12,
                      color: '#000',
                    }}
                    placeholder="Amount"
                    value={field.amount}
                    onChangeText={text =>
                      onChangeText(text, field.id, 'amount')
                    }
                    onPressIn={() => setErrorMessage(null)}
                  />
                  {textFields.length > 1 && ( // Only render the Remove button if there are multiple fields
                    <TouchableOpacity
                      style={{position: 'absolute', right: 0, top: -5}}
                      onPress={() => removeTextField(field.id)}>
                      <Entypo
                        name="circle-with-cross"
                        size={18}
                        color={'red'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: '#0085FF',
                padding: 10,
                alignSelf: 'center',
                borderRadius: 20,
                marginTop: 20,
              }}
              onPress={() => {
                const hasEmptyFields = textFields.some(
                  member =>
                    member.name.trim() === '' || member.amount.trim() === '',
                );

                if (hasEmptyFields) {
                  setErrorMessage('Some member fields are empty.');
                } else {
                  handleUpdateMember();
                }
              }}>
              <Text style={{fontSize: 12, fontWeight: '600', color: '#fff'}}>
                Update Member List
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </BottomSheetModal>

        {/*  Add Money Bottom Sheet*/}
        <BottomSheetModal
          ref={bottomSheetModalRef4}
          index={0}
          snapPoints={snapPointsForOthers}
          backgroundStyle={{borderRadius: 40}}
          onDismiss={() => setIsOpen(false)}>
          <ScrollView>
            <View
              style={{
                width: windowWidth - 40,
                marginHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{color: '#0085FF', fontWeight: '700', fontSize: 13}}>
                Add Money To
              </Text>
              <TouchableOpacity onPress={handleCloseModalForMoney}>
                <Text style={{color: 'red', fontWeight: '600', fontSize: 12}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>

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

            {individualMemberDetails && (
              <View
                style={{
                  width: windowWidth - 40,
                  marginHorizontal: 20,
                  marginTop: 20,
                }}>
                <Text style={{fontSize: 10, fontWeight: '800', color: '#ccc'}}>
                  Member Name
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderBottomColor: '#0085FF',
                      borderBottomWidth: 1,
                      alignItems: 'center',
                      width: '60%',
                      height: 40,
                    }}>
                    <MaterialCommunityIcons
                      name="rename-box"
                      size={17}
                      color={'#0085FF'}
                    />
                    <TextInput
                      value={individualMemberDetails.name}
                      style={{
                        fontSize: 14,
                        paddingLeft: 20,
                        color: '#000',
                        fontWeight: '700',
                      }}
                      onChangeText={text => {
                        // Handle text change if needed
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      borderBottomColor: '#0085FF',
                      borderBottomWidth: 1,
                      alignItems: 'center',
                      width: '33%',
                      height: 40,
                      marginLeft: 20,
                    }}>
                    <FontAwesome name="money" size={17} color={'#0085FF'} />
                    <TextInput
                      value={additionalAmount}
                      placeholder="Add Money"
                      style={{
                        fontSize: 14,
                        paddingLeft: 10,
                        color: '#000',
                        fontWeight: '700',
                      }}
                      onChangeText={setAdditionalAmount}
                      onPressIn={() => setErrorMessage(null)}
                    />
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={{
                backgroundColor: '#0085FF',
                paddingVertical: 10,
                paddingHorizontal: 15,
                alignSelf: 'center',
                borderRadius: 20,
                marginTop: 20,
              }}
              onPress={() => {
                if (additionalAmount === '') {
                  setErrorMessage('Field is empty');
                } else {
                  handleAddMoney();
                }
              }}>
              <Text style={{fontSize: 12, fontWeight: '600', color: '#fff'}}>
                Add Money
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: windowWidth - 40,
                height: 150,
                marginHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                }}>
                If you want to delete this member, Click on the button..
              </Text>

              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'red',
                  padding: 5,
                  borderRadius: 10,
                  marginTop: 15,
                }}
                onPress={handleDeleteMember}>
                <Text style={{fontSize: 12, fontWeight: '700', color: '#fff'}}>
                  Delete member
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </BottomSheetModal>

        {/* Header Portion */}
        <View
          style={{
            width: windowWidth - 40,
            marginTop: 10,
            justifyContent: 'space-between',
            marginHorizontal: 20,
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
          <Text style={{fontSize: 16, fontWeight: '800'}}>Trip Details</Text>
          <View style={{width: 50, height: 50}}></View>
        </View>

        {/* Full Body Portion */}
        <ScrollView>
          {/* For Image Upload Portion */}
          <View
            style={{
              width: windowWidth - 40,
              marginHorizontal: 20,
              borderRadius: 10,
              backgroundColor: '#fff',
              shadowOffset: {width: -2, height: 2},
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              marginTop: 5,
            }}>
            <Image
              source={{uri: image}}
              resizeMode="cover"
              style={{width: windowWidth - 40, height: 150, borderRadius: 10}}
            />

            {showUploadImageButton && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#0085FF',
                  position: 'absolute',
                  shadowOffset: {width: -2, height: 2},
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  padding: 10,
                  right: 0,
                  borderTopRightRadius: 10,
                  borderBottomLeftRadius: 10,
                }}
                onPress={() => handlePresentModalForCamera()}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: '800',
                  }}>
                  Upload Image
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Trip Basic Information */}
          <View
            style={{
              width: windowWidth - 40,
              marginHorizontal: 20,
              borderRadius: 10,
              backgroundColor: isOpen ? 'rgba(255,255,255,0.6)' : '#fff',
              shadowOffset: {width: -2, height: 2},
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              padding: 15,
              marginTop: 10,
            }}>
            <Text
              style={{
                color: isOpen ? '#777777' : '#0085FF',
                fontSize: 13,
                fontWeight: '800',
                marginBottom: 10,
              }}>
              {singleTripDetails.tripName}
            </Text>
            <Text style={{color: '#777777', fontSize: 12, fontWeight: '600'}}>
              Destination of Trip: {singleTripDetails.tripLocation}
            </Text>
            <Text
              style={{
                color: '#777777',
                fontSize: 12,
                fontWeight: '600',
                marginTop: 5,
              }}>
              Trip Starts From: {singleTripDetails.startingFrom}
            </Text>

            <Text
              style={{
                color: '#777777',
                fontSize: 12,
                fontWeight: '600',
                marginTop: 5,
              }}>
              Trip Starts from {singleTripDetails.startDate} To{' '}
              {singleTripDetails.endDate}
            </Text>
          </View>

          {/* Member List */}
          <View
            key="member"
            style={{
              width: windowWidth - 40,
              marginHorizontal: 20,
              borderRadius: 10,
              backgroundColor: isOpen ? 'rgba(255,255,255,0.6)' : '#fff',
              shadowOffset: {width: -2, height: 2},
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              padding: 15,
              marginTop: 10,
            }}>
            <Text
              style={{
                color: isOpen ? '#777777' : '#0085FF',
                fontSize: 13,
                fontWeight: '800',
                marginBottom: 10,
              }}>
              Member Lists
            </Text>

            {/* {showUploadImageButton && (
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  backgroundColor: '#0085FF',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  borderBottomLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
                onPress={() => {
                  handlePresentModalForMoney();
                }}>
                <Text style={{fontSize: 12, fontWeight: '700', color: '#fff'}}>
                  Add Money
                </Text>
              </TouchableOpacity>
            )} */}

            {singleTripDetails.members &&
            singleTripDetails.members.length > 0 ? (
              singleTripDetails.members.map((member, index) => {
                const memberTotalAmount =
                  member.amount +
                  member.additionalAmounts.reduce((acc, curr) => acc + curr, 0);
                // setIndividualMemberBalance(memberTotalAmount);
                totalAmount += memberTotalAmount;

                return (
                  <View
                    key={member._id}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 2,
                    }}>
                    <Text
                      style={{
                        width: '70%',
                        flex: 1,
                        color: '#777777',
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                      {index + 1}. {member.name}, Amount: {memberTotalAmount}
                    </Text>

                    {showUploadImageButton && !showHideButtons && (
                      <TouchableOpacity
                        key={`button-${member._id}`}
                        style={{
                          width: '29%',
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          backgroundColor: 'rgba(0, 133, 255, 0.4)',
                          marginBottom: 5,
                          borderRadius: 15,
                        }}
                        onPress={() => {
                          handlePresentModalForMoney(member._id);
                          setMemberId(member._id);
                        }}>
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 12,
                            fontWeight: '600',
                          }}>
                          Add money
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            ) : (
              <Text key="no-member">No members found</Text>
            )}
          </View>

          {/* Total Calculation Portion */}
          <View
            style={{
              width: windowWidth - 40,
              marginHorizontal: 20,
              borderRadius: 10,
              backgroundColor: isOpen ? 'rgba(255,255,255,0.6)' : '#fff',
              shadowOffset: {width: -2, height: 2},
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              padding: 15,
              marginTop: 10,
            }}>
            <Text
              style={{
                color: isOpen ? '#777777' : '#0085FF',
                fontSize: 13,
                fontWeight: '800',
                marginBottom: 10,
              }}>
              Total Calculation
            </Text>

            {singleTripDetails.members &&
            singleTripDetails.members.length > 0 ? (
              <Text
                style={{
                  color: '#777777',
                  fontSize: 12,
                  fontWeight: '600',
                  marginBottom: 5,
                }}>
                Total number of members : {singleTripDetails.members.length}
              </Text>
            ) : (
              <Text
                style={{
                  color: 'red',
                  fontSize: 12,
                  fontWeight: '600',
                  marginBottom: 5,
                }}>
                No members found
              </Text>
            )}

            {singleTripDetails.members &&
              singleTripDetails.members.length > 0 && (
                <Text
                  style={{
                    color: '#777777',
                    fontSize: 12,
                    fontWeight: '600',
                  }}>
                  Total Amount:{totalMoney}
                </Text>
              )}
          </View>

          <TouchableOpacity
            style={{
              width: windowWidth - 40,
              marginHorizontal: 20,
              borderRadius: 10,
              backgroundColor: isOpen ? 'rgba(255,255,255,0.5)' : '#ffffff',
              shadowOffset: {width: -2, height: 2},
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginTop: 10,
            }}
            onPress={() => {
              if (tripid) {
                navigation.navigate('TripCost', {
                  trip_id: tripid,
                });
              }
            }}>
            <Text
              style={{
                color: '#0085FF',
                fontSize: 13,
                fontWeight: '800',
              }}>
              Trip Cost Summary ===
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Plus Icon Functionality */}
        {showHideButtons && (
          <View
            style={{
              position: 'absolute',
              bottom: 90,
              right: 40,
              width: 120,
              padding: 5,
              backgroundColor: 'transparent',
              shadowOffset: {width: 0, height: 2},
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}>
            {/* Inside Plus Icon Add Expenses Function */}
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                backgroundColor: '#0085FF',
                borderRadius: 5,
                justifyContent: 'center',
                marginBottom: 10,
                flexDirection: 'row',
              }}
              onPress={() => {
                handlePresentModalForExpenses();
                handleHideButtonClick();
              }}>
              <Text
                style={{
                  fontSize: 10,
                  color: '#fff',
                  fontWeight: '500',
                  marginRight: 6,
                }}>
                Add Expenses
              </Text>
              <MaterialIcons name="payments" size={16} color="#fff" />
            </TouchableOpacity>

            {/* Inside Plus Icon Add Members Function */}
            <TouchableOpacity
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                backgroundColor: '#0085FF',
                borderRadius: 5,
                justifyContent: 'center',
                marginBottom: 10,
                flexDirection: 'row',
              }}
              onPress={() => {
                handlePresentModalForMembers();
                handleHideButtonClick();
              }}>
              <Text
                style={{
                  fontSize: 10,
                  color: '#fff',
                  fontWeight: '500',
                  marginRight: 6,
                }}>
                Add Members
              </Text>

              <Entypo name="users" size={14} color={'#fff'} />
            </TouchableOpacity>
          </View>
        )}

        {/* Main Plus Icon */}
        {showUploadImageButton && (
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#0085FF',
              shadowOffset: {width: -2, height: 4},
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 8,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 20,
              bottom: 30,
            }}
            onPress={handleButtonClick}>
            <Entypo name="plus" size={25} color={'#fff'} />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default DetailsTripScreen;
