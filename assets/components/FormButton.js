import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const FormButton = props => {
  const {styles, buttonTitle, textStyle, onPress, icon} = props;
  return (
    <TouchableOpacity style={styles} onPress={onPress}>
      {icon}
      <Text style={textStyle}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default FormButton;
