import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {windowHeight, windowWidth} from '../utils/dimension';

const FormInput = props => {
  const {icon, textInput, backgroundColor} = props;

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View
        style={{
          width: '15%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomLeftRadius: 20,
          borderTopLeftRadius: 20,
        }}>
        {/* Icon Code */}
        {icon}
      </View>

      <View style={{width: 1, height: '100%', backgroundColor: '#ccc'}}>
        {/* Only a divider line */}
      </View>

      <View
        style={{
          width: '80%',
          height: '100%',
          borderBottomRightRadius: 20,
          borderTopRightRadius: 20,
        }}>
        {/* Text input Section */}
        {textInput}
      </View>
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  container: {
    width: windowWidth - 60,
    height: windowHeight * 0.053,
    borderRadius: 20,
    marginHorizontal: 30,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
});
