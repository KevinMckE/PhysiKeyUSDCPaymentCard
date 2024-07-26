// libraries
import React from 'react';
import { ScrollView } from 'react-native';
// components
import TransactionList from './TransactionList';

const DayListComponent = ({ formattedData, limit }) => {
  return (
    <>
      <ScrollView>
        {formattedData.map((dayData, index) => (
          <TransactionList
            data={dayData.data}
            limit={limit}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default DayListComponent;