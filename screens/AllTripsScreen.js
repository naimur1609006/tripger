import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {windowHeight, windowWidth} from '../assets/utils/dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AuthContext} from '../assets/context/AuthContext';
import axios from 'axios';
import TripCard from '../assets/components/TripCard';
import CustomSwitch2 from '../assets/components/CustomSwitch2';
import Entypo from 'react-native-vector-icons/Entypo';
import {useFocusEffect} from '@react-navigation/native';

const AllTripsScreen = ({navigation}) => {
  const {userToken, userInfo} = useContext(AuthContext);
  const DEFAULT_IMAGE =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO58GTfinMVl3rGnFyh5tX1yoBQIVzqoLduw&usqp=CAU';

  const [switchState, setSwitchState] = useState(1);

  const [loading, setLoading] = useState(true);

  const [tripDetails, setTripDetails] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/trip/getAllTripsById/${userInfo.savedUser._id}`,
        {
          headers: {
            Authorization: `${userToken}`,
          },
        },
      );

      const tripsData = response.data.All_Trips;

      // Convert date strings to Date objects and categorize trips
      const categorizedTrips = categorizeTrips(tripsData);

      // Set the categorized and sorted trips in state
      setTripDetails(categorizedTrips);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Convert date strings to Date objects and categorize trips
  const categorizeTrips = tripsData => {
    const currentDate = new Date();
    const ongoingTrips = [];
    const upcomingTrips = [];
    const pastTrips = [];

    tripsData.forEach(trip => {
      const {startDate, endDate, ...rest} = trip;
      const [day, month, year] = startDate.split('/');
      const startingdateString = `${year}-${month}-${day}`;
      const startDateTime = new Date(startingdateString);

      const [day1, month1, year1] = endDate.split('/');
      const endingDateString = `${year1}-${month1}-${day1} 23:59:59`;
      const endDateTime = new Date(endingDateString);

      if (startDateTime <= currentDate && endDateTime >= currentDate) {
        ongoingTrips.push({
          ...rest,
          startDate,
          endDate,
        });
      } else if (startDateTime > currentDate) {
        upcomingTrips.push({
          ...rest,
          startDate,
          endDate,
        });
      } else {
        pastTrips.push({
          ...rest,
          startDate,
          endDate,
        });
      }
    });

    // Sort trips by start date
    ongoingTrips.sort((a, b) => a.startDate.localeCompare(b.startDate));
    upcomingTrips.sort((a, b) => a.startDate.localeCompare(b.startDate));
    pastTrips.sort((a, b) => b.endDate.localeCompare(a.endDate));
    return {ongoingTrips, upcomingTrips, pastTrips};
  };

  const [tripImages, setTripImages] = useState({});
  const getAllTripsByUserId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/trip/getAllTripsById/${userInfo.savedUser._id}`,
        {
          headers: {
            Authorization: `${userToken}`,
          },
        },
      );

      // Map over each trip and fetch its image
      await Promise.all(
        response.data.All_Trips.map(async item => {
          try {
            const tripId = item._id;
            const tripImageResponse = await axios.get(
              `http://localhost:8080/api/trip/tripsImage/${tripId}`,
              {
                headers: {
                  Authorization: `${userToken}`,
                },
              },
            );

            // Update tripImages state with the fetched image
            if (tripImageResponse.data.image) {
              setTripImages(prevState => ({
                ...prevState,
                [tripId]: tripImageResponse.data.image,
              }));
            }
          } catch (error) {
            console.log(error, 'image getting error for individual trip card');
          }
        }),
      );
    } catch (error) {
      console.log(error, 'All trips Id getting problem');
      return DEFAULT_IMAGE;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAllTripsByUserId();
    }, []),
  );

  const onSelectSwitch = value => {
    setSwitchState(value);
  };

  const Ongoing = () => {
    if (loading) {
      return <ActivityIndicator size="large" />;
    }
    return (
      <FlatList
        data={tripDetails.ongoingTrips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    );
  };

  const Upcoming = () => {
    if (loading) {
      return <ActivityIndicator size="large" />;
    }
    return (
      <FlatList
        data={tripDetails.upcomingTrips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    );
  };

  const Previous = () => {
    if (loading) {
      return <ActivityIndicator size="large" />;
    }
    return (
      <FlatList
        data={tripDetails.pastTrips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    );
  };

  const renderItem = ({item}) => {
    const tripId = item._id;
    const tripImageUrl = tripImages[tripId] || DEFAULT_IMAGE;
    return (
      <TripCard
        cardViewStyle={{
          width: windowWidth - 40,
          marginHorizontal: 20,
          borderRadius: 10,
          height: 60,
          flexDirection: 'row',
          marginBottom: 10,
          backgroundColor: '#fff',
          shadowOffset: {width: -2, height: 4},
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
        onPress={() =>
          navigation.navigate('SingleTripView', {trips_id: item._id})
        }
        placeTextStyle={{
          color: '#000',
          fontSize: 13,
          fontWeight: '800',
        }}
        place={item.tripName}
        startingDate={item.startDate}
        endingDate={item.endDate}
        dateTextStyle={{
          fontSize: 11,
          marginTop: 3,
          fontWeight: '600',
        }}>
        {tripImageUrl ===
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO58GTfinMVl3rGnFyh5tX1yoBQIVzqoLduw&usqp=CAU' ? (
          <Image
            source={{uri: tripImageUrl}}
            style={{width: 40, height: 40, borderRadius: 20}}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={{uri: `http://localhost:8080/${tripImageUrl}`}}
            style={{width: 40, height: 40, borderRadius: 20}}
            resizeMode="cover"
          />
        )}
      </TripCard>
    );
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#f2f2f2',
        width: windowWidth,
        height: windowHeight,
      }}>
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
            navigation.navigate('Home2');
          }}>
          <AntDesign name="arrowleft" size={18} color={'#000'} />
        </TouchableOpacity>
        <Text style={{fontSize: 16, fontWeight: '800', color: '#000'}}>
          All Trips Details
        </Text>
        <View style={{width: 50, height: 50}}></View>
      </View>

      <View style={{width: windowWidth - 40}}>
        <CustomSwitch2
          selectionMode={1}
          option1="Ongoing"
          option2="Upcoming"
          option3="Previous"
          onSelectSwitch={onSelectSwitch}
        />
      </View>

      {switchState == 1 && (
        <ScrollView>
          <View
            style={{
              width: windowWidth - 30,
            }}>
            <Text
              style={{
                fontSize: 12,
                paddingLeft: 20,
                marginBottom: 10,
                fontWeight: '800',
              }}>
              Ongoing trips Details
            </Text>
          </View>

          {tripDetails.ongoingTrips && tripDetails.ongoingTrips.length > 0 ? (
            <Ongoing />
          ) : (
            <View
              style={{
                width: windowWidth - 40,
                marginHorizontal: 20,
                backgroundColor: '#fff',
                shadowOffset: {width: -2, height: 2},
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 3,
                alignItems: 'center',
                paddingVertical: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'red',
                  fontWeight: '700',
                  fontSize: 12,
                  marginBottom: 10,
                }}>
                No Ongoing Trips Availabe
              </Text>
              <Entypo name="circle-with-cross" size={100} color={'red'} />
            </View>
          )}
        </ScrollView>
      )}

      {switchState == 2 && (
        <ScrollView>
          <View
            style={{
              width: windowWidth - 30,
            }}>
            <Text
              style={{
                fontSize: 12,
                paddingLeft: 20,
                marginBottom: 10,
                fontWeight: '800',
              }}>
              Upcoming trips Details
            </Text>
          </View>
          {tripDetails.upcomingTrips && tripDetails.upcomingTrips.length > 0 ? (
            <Upcoming />
          ) : (
            <View
              style={{
                width: windowWidth - 40,
                marginHorizontal: 20,
                backgroundColor: '#fff',
                shadowOffset: {width: -2, height: 2},
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 3,
                alignItems: 'center',
                paddingVertical: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'red',
                  fontWeight: '700',
                  fontSize: 12,
                  marginBottom: 10,
                }}>
                No Upcoming Trips Availabe
              </Text>
              <Entypo name="circle-with-cross" size={100} color={'red'} />
            </View>
          )}
        </ScrollView>
      )}
      {switchState == 3 && (
        <ScrollView>
          <View
            style={{
              width: windowWidth - 30,
            }}>
            <Text
              style={{
                fontSize: 12,
                paddingLeft: 20,
                marginBottom: 10,
                fontWeight: '800',
              }}>
              Previous trips Details
            </Text>
          </View>

          {tripDetails.pastTrips && tripDetails.pastTrips.length > 0 ? (
            <Previous />
          ) : (
            <View
              style={{
                width: windowWidth - 40,
                marginHorizontal: 20,
                backgroundColor: '#fff',
                shadowOffset: {width: -2, height: 2},
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 3,
                alignItems: 'center',
                paddingVertical: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: 'red',
                  fontWeight: '700',
                  fontSize: 12,
                  marginBottom: 10,
                }}>
                No Past Trips Availabe
              </Text>
              <Entypo name="circle-with-cross" size={100} color={'red'} />
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AllTripsScreen;
