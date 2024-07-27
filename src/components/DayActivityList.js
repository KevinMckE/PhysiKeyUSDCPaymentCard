/////////////////////////////////
// DAY ACTIVITY LIST        /////
// List activity by the day    //
// Used in History page        //
//                             //
//                             //
// RegenCard 2024              //
/////////////////////////////////

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
            key={index}
            data={dayData.data}
            limit={limit}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default DayListComponent;