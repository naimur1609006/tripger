import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import {AuthContext} from '../assets/context/AuthContext';
import {windowHeight, windowWidth} from '../assets/utils/dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import {interpolate} from 'react-native-reanimated';

const TripCostScreen = ({navigation}) => {
  const route = useRoute();

  const {userToken} = useContext(AuthContext);

  const [tripCosts, setTripCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalFoodCost, setTotalFoodCost] = useState(0);
  const [totalAccommodationCost, setTotalAccommodationCost] = useState(0);
  const [totalTransportationCost, setTotalTransportationCost] = useState(0);
  const [totalOthersCost, setTotalOthersCost] = useState(0);

  const [memberDetails, setMemberDetails] = useState([]);
  const [costPerPerson, setCostPerPerson] = useState(0);
  const [costCalculated, setCostCalculated] = useState(false);

  const getMemberDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/trip/getSingleTrip/${route.params.trip_id}`,
        {
          headers: {
            Authorization: `${userToken}`,
          },
        },
      );
      // console.log(response.data.Single_Trip.members);
      const members = response.data.Single_Trip.members.map(member => {
        const totalAdditionalAmount = member.additionalAmounts.reduce(
          (acc, amount) => acc + amount,
          0,
        );
        const totalAmount = member.amount + totalAdditionalAmount;
        return {...member, totalAmount};
      });
      setMemberDetails(members);
      setLoading(false);
    } catch (error) {
      console.log(`Single trip Details Error: ${error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMemberDetails();
  }, [route.params.trip_id, userToken]);

  useEffect(() => {
    const fetchTripCosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/trip/${route.params.trip_id}/costs`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${userToken}`,
            },
          },
        );
        setTripCosts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTripCosts();
  }, [route.params.trip_id, userToken]);

  useEffect(() => {
    if (!tripCosts.costs || !tripCosts.costs.length) return;

    const foodCost = tripCosts.costs.reduce((total, item) => {
      if (item.category === 'Food Cost') {
        return total + item.amount;
      }
      return total;
    }, 0);

    setTotalFoodCost(foodCost);

    const accommodationCost = tripCosts.costs.reduce((total, item) => {
      if (item.category === 'Accommodation') {
        return total + item.amount;
      }
      return total;
    }, 0);

    setTotalAccommodationCost(accommodationCost);

    const transportationCost = tripCosts.costs.reduce((total, item) => {
      if (item.category === 'Transportation') {
        return total + item.amount;
      }
      return total;
    }, 0);

    setTotalTransportationCost(transportationCost);

    const othersCost = tripCosts.costs.reduce((total, item) => {
      if (item.category === 'Others Cost') {
        return total + item.amount;
      }
      return total;
    }, 0);

    setTotalOthersCost(othersCost);
  }, [tripCosts]);

  useEffect(() => {
    const totalCost =
      totalAccommodationCost +
      totalFoodCost +
      totalOthersCost +
      totalTransportationCost;
    const numberOfMembers = memberDetails.length;

    // Ensure cost is calculated and member details are available
    if (totalCost > 0 && numberOfMembers > 0 && !costCalculated) {
      const costPerPerson = totalCost / numberOfMembers;
      setCostPerPerson(costPerPerson);

      // Subtract costPerPerson from individual member's amount
      const updatedMemberDetails = memberDetails.map(member => ({
        ...member,
        balance: (member.totalAmount - costPerPerson).toFixed(2), // Round to two decimal places
      }));
      setMemberDetails(updatedMemberDetails);

      // Update state variable to indicate cost calculation is done
      setCostCalculated(true);
    }
  }, [
    totalAccommodationCost,
    totalFoodCost,
    totalOthersCost,
    totalTransportationCost,
    memberDetails,
    costCalculated,
  ]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <SafeAreaView
      style={{
        width: windowWidth,
        height: windowHeight,
        backgroundColor: '#f2f2f2',
      }}>
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
          onPress={() =>
            navigation.navigate('SingleTripView', {
              trips_id: route.params.trip_id,
            })
          }>
          <AntDesign name="arrowleft" size={18} />
        </TouchableOpacity>
        <Text style={{fontSize: 16, fontWeight: '800'}}>Trip Cost Details</Text>
        <View style={{width: 50, height: 50}}></View>
      </View>

      <ScrollView>
        <View
          style={{
            width: windowWidth - 40,
            marginHorizontal: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowOffset: {width: -2, height: 2},
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
            padding: 10,
            marginTop: 15,
          }}>
          <Text
            style={{
              alignSelf: 'center',
              marginBottom: 10,
              fontSize: 13,
              fontWeight: '700',
              color: '#0085FF',
            }}>
            Trip Cost Summary
          </Text>

          <View
            style={{
              backgroundColor: '#E7F3FF',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 2,
            }}>
            <Text style={{fontSize: 12, fontWeight: '700', color: '#000'}}>
              Total Food Cost :
            </Text>
            <Text style={{fontSize: 12, fontWeight: '700', color: '#000'}}>
              {totalFoodCost}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#FFF',
              marginTop: 3,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 2,
            }}>
            <Text style={{fontSize: 12, fontWeight: '700', color: '#000'}}>
              Total accommodation Cost :
            </Text>

            <Text style={{fontSize: 12, fontWeight: '700', color: '#000'}}>
              {totalAccommodationCost}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#E7F3FF',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 3,
              padding: 2,
            }}>
            <Text style={{fontSize: 12, fontWeight: '700', color: '#000'}}>
              Total transportation Cost :
            </Text>

            <Text style={{fontSize: 12, fontWeight: '700', color: '#000'}}>
              {totalTransportationCost}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              marginTop: 3,
              padding: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 12, fontWeight: '700', color: '#000'}}>
              Total Others Cost :
            </Text>

            <Text style={{fontSize: 12, fontWeight: '700', color: '#000'}}>
              {totalOthersCost}
            </Text>
          </View>

          <View
            style={{height: 1, backgroundColor: '#ccc', marginTop: 6}}></View>

          <View
            style={{
              backgroundColor: '#fff',
              marginTop: 6,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 2,
            }}>
            <Text style={{fontSize: 12, fontWeight: '700', color: '#0085FF'}}>
              Total Cost :
            </Text>

            <Text style={{fontSize: 12, fontWeight: '700', color: '#0085FF'}}>
              {totalAccommodationCost +
                totalFoodCost +
                totalOthersCost +
                totalTransportationCost}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 2,
            }}>
            <Text style={{fontSize: 12, fontWeight: '700', color: '#0085FF'}}>
              Total Cost Per Person:
            </Text>
            <Text style={{fontSize: 12, fontWeight: '700', color: '#0085FF'}}>
              {costPerPerson.toFixed(2)}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: windowWidth - 40,
            marginHorizontal: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowOffset: {width: -2, height: 2},
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
            padding: 10,
            marginTop: 15,
          }}>
          <Text
            style={{
              alignSelf: 'center',
              marginBottom: 10,
              fontSize: 13,
              fontWeight: '700',
              color: '#0085FF',
            }}>
            Trip Cost Details
          </Text>

          {tripCosts.costs && tripCosts.costs.length > 0 ? (
            <FlatList
              data={tripCosts.costs}
              keyExtractor={item => item._id}
              scrollEnabled={false}
              renderItem={({item, index}) => {
                const backgroundColor = index % 2 === 0 ? '#E7F3FF' : '#ffffff';
                return (
                  <View style={{padding: 2}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: backgroundColor,
                        padding: 2,
                      }}>
                      <Text
                        style={{
                          width: '40%',
                          fontSize: 12,
                          fontWeight: '700',
                        }}>
                        {item.category}
                      </Text>
                      <Text style={{width: '45%', fontSize: 12}}>
                        {item.description}
                      </Text>
                      <Text
                        style={{
                          width: '15%',
                          fontSize: 12,
                          textAlign: 'right',
                        }}>
                        {item.amount}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          ) : (
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: 'red',
                alignSelf: 'center',
              }}>
              No Trip Cost Details Available
            </Text>
          )}
        </View>

        <View
          style={{
            width: windowWidth - 40,
            marginHorizontal: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
            shadowOffset: {width: -2, height: 2},
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
            padding: 10,
            marginTop: 15,
          }}>
          <Text
            style={{
              alignSelf: 'center',
              marginBottom: 10,
              fontSize: 13,
              fontWeight: '700',
              color: '#0085FF',
            }}>
            Member Status
          </Text>
          {memberDetails && memberDetails.length > 0 ? (
            <FlatList
              data={memberDetails}
              keyExtractor={item => item._id}
              scrollEnabled={false}
              renderItem={({item, index}) => {
                const backgroundColor = index % 2 === 0 ? '#E7F3FF' : '#ffffff';
                return (
                  <View style={{padding: 2}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: backgroundColor,
                        padding: 2,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '700',
                          width: '50%',
                        }}>
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          width: '25%',
                          fontSize: 12,
                          textAlign: 'center',
                        }}>
                        {item.totalAmount}
                      </Text>
                      <Text
                        style={{
                          width: '25%',
                          fontSize: 12,
                          color:
                            item.totalAmount - costPerPerson < 0
                              ? 'red'
                              : 'black',
                          overflow: 'visible',
                          textAlign: 'right',
                        }}>
                        {(item.totalAmount - costPerPerson).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              }}
              ListHeaderComponent={() => (
                <View style={{padding: 2}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 2,
                      backgroundColor: '#ccc',
                    }}>
                    <Text
                      style={{
                        width: '50%',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}>
                      Member Name
                    </Text>
                    <Text
                      style={{
                        width: '25%',
                        fontSize: 12,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>
                      Balance
                    </Text>
                    <Text
                      style={{
                        width: '25%',
                        fontSize: 12,
                        fontWeight: 'bold',
                        textAlign: 'right',
                      }}>
                      Status
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text>No member Status Available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TripCostScreen;
