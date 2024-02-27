import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {windowWidth} from '../utils/dimension';

const TripCard = ({
  startingDate,
  endingDate,
  place,
  children,
  cardViewStyle,
  placeTextStyle,
  dateTextStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity style={cardViewStyle} onPress={onPress}>
      {/* Image viewer Portion */}
      <View
        style={{
          width: '20%',
          height: '100%',
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {children}
      </View>

      <View
        style={{
          width: '80%',
          height: '100%',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Text style={placeTextStyle}>{place}</Text>
        <Text style={dateTextStyle}>
          From {startingDate} To {endingDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TripCard;
