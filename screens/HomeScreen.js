import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {windowHeight, windowWidth} from '../assets/utils/dimension';
import {StatusBar} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import sliderData from '../assets/data/sliderData';
import BannerSlider from '../assets/components/BannerSlider';
import Carousel from 'react-native-snap-carousel';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomSwitch from '../assets/components/CustomSwitch';
import TripCard from '../assets/components/TripCard';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import {AuthContext} from '../assets/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const {userToken, userInfo} = useContext(AuthContext);
  const DEFAULT_IMAGE =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO58GTfinMVl3rGnFyh5tX1yoBQIVzqoLduw&usqp=CAU';
  const isFocused = useIsFocused();

  const [searchinfo, setSearchInfo] = useState('');
  const [tripsId, setTripsId] = useState();

  const [allTrips, setAllTrips] = useState(1);

  //Most Recent Trips Finding State
  const [apiData, setApiData] = useState({});

  const [loading, setLoading] = useState(true);
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

  //API
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

      //Most recent Times Findings
      const sortedData = response.data.All_Trips.slice().sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      const mostRecentItems = sortedData.slice(0, 5);
      const mostRecentItemsData = mostRecentItems.map(item => item);
      setApiData(mostRecentItemsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  const renderSlider = ({item, index}) => {
    return <BannerSlider data={item} />;
  };

  const onSelectSwitch = value => {
    setAllTrips(value);
  };

  const FlatListComponent = () => {
    if (loading) {
      return <ActivityIndicator size="large" />;
    }
    return (
      <FlatList
        data={apiData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    );
  };

  const renderItem = ({item}) => {
    const tripId = item._id;
    const tripImageUrl = tripImages[tripId] || DEFAULT_IMAGE;
    //console.log(item._id);
    return (
      <TripCard
        onPress={() => {
          const memberIds = [];
          item.members.forEach(member => {
            memberIds.push(member._id);
          });
          navigation.navigate('SingleTripView', {
            trips_id: item._id,
            memberIds: memberIds,
          });
        }}
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
        width: windowWidth,
        height: windowHeight,
        backgroundColor: '#f2f2f2',
        flex: 1,
      }}>
      <StatusBar hidden={true} />

      {/* Header portion */}

      <View
        style={{
          width: windowWidth,
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <AntDesign
            name="menu-unfold"
            size={18}
            color="#000000"
            style={{marginLeft: 20}}
          />
        </TouchableOpacity>

        <Text style={{fontSize: 14, color: '#000000', fontWeight: '800'}}>
          Trip List
        </Text>

        <TouchableOpacity>
          <AntDesign
            name="infocirlceo"
            size={16}
            color="#000000"
            style={{marginRight: 20}}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar Portion */}

      <View
        style={{
          width: windowWidth - 30,
          height: 35,
          borderColor: '#ccc',
          borderWidth: 0.5,
          marginTop: 10,
          marginBottom: 15,
          marginHorizontal: 15,
          borderRadius: 20,
          flexDirection: 'row',
          backgroundColor: '#fff',
          shadowOffset: {width: -2, height: 2},
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}>
        <View
          style={{
            width: '15%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomLeftRadius: 20,
            borderTopLeftRadius: 20,
          }}>
          <Ionicons name="search" size={20} color="#0085FF" />
        </View>

        <View
          style={{width: 1, height: '100%', backgroundColor: '#ccc'}}></View>

        <View
          style={{
            width: '80%',
            height: '100%',
            borderBottomRightRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <TextInput
            style={{
              width: '100%',
              height: '100%',
              padding: 10,
              color: '#0085FF',
            }}
            placeholder="Search"
            value={searchinfo}
            onChangeText={() => {
              setSearchInfo();
            }}
          />
        </View>
      </View>

      {/* Caousel Portion */}

      <View
        style={{height: 150, width: windowWidth - 30, marginHorizontal: 15}}>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={sliderData}
          renderItem={renderSlider}
          sliderWidth={windowWidth - 30}
          itemWidth={295}
          loop={true}
        />
      </View>

      {/* Switch button portion */}

      <View>
        <CustomSwitch
          selectionMode={1}
          option1="All Trips"
          option2="Community"
          onSelectSwitch={onSelectSwitch}
        />
      </View>

      {allTrips == 1 && (
        <ScrollView style={{marginTop: 20}}>
          <View
            style={{
              width: windowWidth - 30,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 12,
                paddingLeft: 20,
                marginBottom: 10,
                fontWeight: '800',
              }}>
              All trips Details
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('ViewAll')}>
              <Text style={{fontSize: 12, fontWeight: '800', color: '#0085FF'}}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <FlatListComponent />
        </ScrollView>
      )}
      {allTrips == 2 && <Text>Community</Text>}

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
          right: 30,
          bottom: 30,
        }}
        onPress={() => navigation.navigate('CreateTrip')}>
        <Entypo name="plus" size={25} color={'#fff'} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
