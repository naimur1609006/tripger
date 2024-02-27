import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons for icons
import {windowWidth} from '../utils/dimension';

const ExpenseOptions = ({options, selectedOption, onSelect}) => {
  return (
    <View style={styles.expenseOptionsContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option.label}
          style={styles.expenseOption}
          onPress={() => onSelect(option.label)}>
          <View
            style={{
              backgroundColor:
                option.label === selectedOption ? '#0085FF' : '#E3F2FF',
              padding: 10,
              borderRadius: 30,
            }}>
            <Icon
              name={option.icon}
              size={20}
              color={option.label === selectedOption ? '#fff' : 'black'}
            />
          </View>
          <Text
            style={[
              styles.optionLabel,
              option.label === selectedOption ? styles.selectedLabel : null,
            ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  expenseOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: windowWidth - 40,
    marginHorizontal: 20,
  },
  expenseOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  optionLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },
  selectedLabel: {
    color: '#0085FF',
  },
});

export default ExpenseOptions;
