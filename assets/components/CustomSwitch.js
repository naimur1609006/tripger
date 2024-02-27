import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {windowWidth} from '../utils/dimension';

const CustomSwitch = ({selectionMode, option1, option2, onSelectSwitch}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updateSwitchData = value => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };

  return (
    <View
      style={{
        height: 30,
        width: windowWidth - 40,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        borderColor: '#f2f2f2',
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 15,
        shadowOffset: {width: -2, height: 2},
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(1)}
        style={{
          backgroundColor: getSelectionMode == 1 ? '#0085FF' : '#ffffff',
          width: '50%',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: getSelectionMode == 1 ? '#ffffff' : '#000000',
            fontSize: 12,
            fontWeight: '700',
          }}>
          {option1}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={2}
        onPress={() => updateSwitchData(2)}
        style={{
          backgroundColor: getSelectionMode == 2 ? '#0085FF' : '#ffffff',
          width: '50%',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: getSelectionMode == 2 ? '#ffffff' : '#000000',
            fontSize: 12,
            fontWeight: '700',
          }}>
          {option2}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomSwitch;
