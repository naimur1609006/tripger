import {View, Text, Image} from 'react-native';
import React from 'react';

const BannerSlider = ({data}) => {
  return (
    <View>
      <Image
        source={data.image}
        style={{height: 150, width: 295, borderRadius: 10}}
      />
    </View>
  );
};

export default BannerSlider;
