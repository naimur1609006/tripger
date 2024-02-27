import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import VerificationScreen from '../../screens/VerificationScreen';
import MyDrawer from './DrawerNavigator';
import Createtrip from '../../screens/CreatetripScreen';
import HomeScreen from '../../screens/HomeScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import DetailsTripScreen from '../../screens/DetailsTripScreen';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Verify" component={VerificationScreen} />
      <Stack.Screen name="Home" component={MyDrawer} />
    </Stack.Navigator>
  );
}
