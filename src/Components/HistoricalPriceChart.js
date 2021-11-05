import React,{useState, useEffect} from 'react';

import {VictoryAxis, VictoryChart, VictoryLegend, VictoryLine} from 'victory'

const HistoricalPriceChart = ({ props }) => {

    const [legendaryData, setLegendaryData] = useState([]);
    const [ancientData, setAncientData] = useState([]);
    const [rareData, setRareData] = useState([]);
    const [commonData, setCommonData] = useState([]);

    useEffect(()=>{
        getHistoricalPrices(props);
      },[props]);

    if(props == undefined){
        return null
    }

    // getHistoricalPrices(props)
    // console.log(props)
    // const legendaryData = getHistoricalPrices(props)
    function getHistoricalPrices(props){
        var legendaryPrices = []
        var ancientPrices = []
        var rarePrices = []
        var commonPrices = []

        for (var i = 0; i < props.length; i++){
            legendaryPrices.push({x:i,y:getLegendaryPrice(props[i])})
            ancientPrices.push({x:i,y:getAncientPrice(props[i])})
            rarePrices.push({x:i,y:getRarePrice(props[i])})
            commonPrices.push({x:i,y:8})
        }

        // console.log(legendaryPrices)
        setLegendaryData(legendaryPrices)
        setAncientData(ancientPrices)
        setRareData(rarePrices)
        setCommonData(commonPrices)
    }
    
    function getLegendaryPrice(showerData){
        if(showerData.length >= 10){
            return showerData[10].amount
        }
        return showerData[showerData.length].amount
    }

    function getAncientPrice(showerData){
        if(showerData.length >= 10){
            const index = Math.floor(showerData.length*0.09 + 10)
            return showerData[index].amount
        }
        return showerData[showerData.length].amount
    }

    function getRarePrice(showerData){
        if(showerData.length >= 10){
            const index = Math.floor(showerData.length*0.31 + 10)
            return showerData[index].amount
        }
        return showerData[showerData.length].amount
    }

    return (
        <VictoryChart
        domainPadding={20}
      >

        <VictoryLine 
            style={{
                data: {
                stroke: "#c43a31",
            }}}
            data={legendaryData} interpolation="natural"/>
        <VictoryLine
            style={{
                data: {
                stroke: "blue",
            }}}
            data={ancientData} interpolation="natural"/>
        <VictoryLine
            style={{
                data: {
                stroke: "orange",
            }}}
            data={rareData} interpolation="natural"/>
        <VictoryLine
            style={{
                data: {
                stroke: "green",
            }}}
            data={commonData} interpolation="natural"/>

        <VictoryLegend x={50} y={10}
            orientation="horizontal"
            gutter={20}
            // style={{ border: { stroke: "black" } }}
            colorScale={[ "#c43a31", "blue", "orange","green" ]}
            data={[
                { name: "Legendary" }, { name: "Ancient" }, { name: "Rare" },{name:"Common"}
            ]}
            />
        <VictoryAxis label="Meteor Shower"/>
        <VictoryAxis dependentAxis/> 

      </VictoryChart>
    );
}
 
export default HistoricalPriceChart;