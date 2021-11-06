import React from 'react';
import {VictoryAxis, VictoryChart, VictoryHistogram} from 'victory'

const CurrentHistogram = ({ props }) => {

    if(props == undefined){
        return null
    }

    // console.log(props)
    
    function getBarLabel(datum){
      if(datum.y > 0){
        return datum.y
      }
      return ''

    }

    return (
        <VictoryChart
        domainPadding={20}
      >

        <VictoryHistogram
          style={{ data: { fill: "cyan" } }}
          data={props}
          bins={20}
          x="amount"
          labels={({ datum }) => getBarLabel(datum)}
        />
        <VictoryAxis label="Contribution"/>
        <VictoryAxis dependentAxis label="Wallet Count"/>

      </VictoryChart>
    );
}
 
export default CurrentHistogram;