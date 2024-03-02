import {createDrawerNavigator} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import ProfileScreen from '../../screens/ProfileScreen';
import TermsAndConditions from '../../screens/TermsAndConditions';
import Notification from '../../screens/Notification';
import FAQs from '../../screens/FAQs';
import CustomDrawer from '../components/CustomDrawer';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import Createtrip from '../../screens/CreatetripScreen';
import AllTripsScreen from '../../screens/AllTripsScreen';
import DetailsTripScreen from '../../screens/DetailsTripScreen';
import TripCostScreen from '../../screens/TripCostScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home2"
        component={HomeScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="CreateTrip"
        component={Createtrip}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ViewAll"
        component={AllTripsScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SingleTripView"
        component={DetailsTripScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="TripCost"
        component={TripCostScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const MyDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#fff',
        drawerInactiveBackgroundColor: '#0085FF',
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#fff',
        drawerLabelStyle: {
          marginLeft: -15,
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Drawer.Screen
        name="All Trips"
        component={HomeStack}
        options={{
          drawerIcon: ({focused}) => (
            <Ionicons
              name="bus-sharp"
              size={18}
              color={focused ? '#000' : '#fff'}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({focused}) => (
            <FontAwesome
              name="user-circle-o"
              size={18}
              color={focused ? '#000' : '#fff'}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Terms & Policies"
        component={TermsAndConditions}
        options={{
          drawerIcon: ({focused}) => (
            <Entypo
              name="clipboard"
              size={18}
              color={focused ? '#000' : '#fff'}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Notification"
        component={Notification}
        options={{
          drawerIcon: ({focused}) => (
            <Ionicons
              name="notifications"
              size={18}
              color={focused ? '#000' : '#fff'}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="FAQs"
        component={FAQs}
        options={{
          drawerIcon: ({focused}) => (
            <MaterialCommunityIcons
              name="chat-question"
              size={18}
              color={focused ? '#000' : '#fff'}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default MyDrawer;
