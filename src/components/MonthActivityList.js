// libraries
import React from 'react';
import { ScrollView } from 'react-native';
// components
import TransactionList from './TransactionList';

const MonthListComponent = ({ formattedData, limit }) => {

  return (
    <>
      <ScrollView>
        {formattedData.map((monthData, index) => (
          <TransactionList
            key={index}
            data={monthData.data}
            limit={limit}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default MonthListComponent;