import React,{useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import CurrentLeadersTable from './Components/CurrentLeadersTable';
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react';
import CurrentHistogram from './Components/CurrentHistogram';
import CurrentShowerData from './Components/CurrentShowerData';
import HistoricalPriceChart from './Components/HistoricalPriceChart';
import ClipLoader from "react-spinners/ClipLoader";


function App() {

  const [data, setData] = useState<any[]>([]);
  const [numParticipants, setNumParticipants] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  // const [numRequests, setNumRequests] = useState(0);


  // let DATE = new Date(2021,10,7)
  let DATE = new Date(2021,10,8,8)

  let STARTTIME = DATE.getTime()
  const NUMBEROFSHOWERS = 44;
  const TERRAWALLET = "terra1dax9mddsycvzkc429wwy494vhzhggw3d5594rt"
  const CURRENTSHOWER = getCurrentShowerIndex()

  // let STARTTIME = new Date(2021,10,1,12).getTime()
  // const NUMBEROFSHOWERS = 5;
  // const TERRAWALLET = "terra193xyvyk5c6f46k87x9nq7gcg305dk37nzm7vdt"
  // const REQUESTURL = "https://bombay-fcd.terra.dev/v1/txs?account=terra193xyvyk5c6f46k87x9nq7gcg305dk37nzm7vdt&limit=100"
  console.log("Start time: ",STARTTIME)
  console.log(CURRENTSHOWER)

  useEffect(()=>{
    getData();
  },[]);

  function getCurrentShowerIndex(){
    const currentTime = new Date().getTime()
    const hoursSinceStart = Math.floor((currentTime - STARTTIME)/(60*60*1000))
    if(hoursSinceStart>NUMBEROFSHOWERS){
      return NUMBEROFSHOWERS-1
    }
    return hoursSinceStart
  }

  function createRequest(accString:string,offset?:string){
    var REQUESTURL = "https://fcd.terra.dev/v1/txs?"
    REQUESTURL +=  "account="+accString
    if (offset){
      REQUESTURL += "&offset="+offset
    }
    REQUESTURL += "&limit=100"
    return REQUESTURL
  }

  function compare( a:any, b:any ) {
    if ( a.amount < b.amount ){
      return 1;
    }
    if ( a.amount > b.amount ){
      return -1;
    }
    return 0;
  }

  async function getData(){
    var request = createRequest(TERRAWALLET)
    var tryNext = true;
    var allParsedTxs = [] as any;
    console.log("Starting Querries")
    while(tryNext){
      // setNumRequests(numRequests + 1);
      await axios.get(request).then(
        res => {
          console.log("Number of TXs",allParsedTxs.length)
          var next = res.data.next;
          const unparsedtTxs = res.data.txs;
          // console.log(unparsedtTxs)
          const tempParsedTxs = parseRawTxs(unparsedtTxs)
          // console.log(tempParsedTxs)
          allParsedTxs =  allParsedTxs.concat(tempParsedTxs)
          // console.log(allParsedTxs)
          request = createRequest(TERRAWALLET,next)
          if(tempParsedTxs.length < 100){
            console.log("Stopping Querries")
            tryNext = false
          }
          if(allParsedTxs.length > 700){
            tryNext = false
          }
        }
      )
    } 
    // console.log(allParsedTxs)
    allParsedTxs.reverse();
    console.log("Parsing by shower")
    const parsedTxs = parseByShower(allParsedTxs)
    setData(parsedTxs);
    setIsLoading(false)
    setNumParticipants(parsedTxs[CURRENTSHOWER].length)
    // console.log(parseByShower(allParsedTxs));
  }

  function parseByShower(data:any){
    // Get Parsed Data by Shower, 
    var showerDataArray = [] as any;
    for (var i = 0; i < NUMBEROFSHOWERS; i++){
      showerDataArray.push([])
    }
    // console.log(showerDataArray)

    for (var i = 0; i < data.length; i++){
      const tempCurrentShower = Math.floor((data[i].timestamp - STARTTIME)/(60*60*1000))
      // console.log(tempCurrentShower)
      if(tempCurrentShower<NUMBEROFSHOWERS){

        if(showerDataArray[tempCurrentShower].length == 0 ){
          showerDataArray[tempCurrentShower].push(data[i])
        }
        else{
          // Check for duplicate wallets in same shower and combine if so
          const currentLength = parseInt(showerDataArray[tempCurrentShower].length)
          for (var j = 0; j < currentLength ; j++){
  
            if(showerDataArray[tempCurrentShower][j].from == data[i].from){
              showerDataArray[tempCurrentShower][j].amount += data[i].amount
            } 
            else{
              showerDataArray[tempCurrentShower].push(data[i])
              break
            }

          }
        }
        
      }  

      
    }

  console.log("Sorting!")
    for (var i = 0; i < NUMBEROFSHOWERS; i++){
      showerDataArray[i].sort(compare)
    }  
  return showerDataArray

  }


  function getIsLoading(){
    if(isLoading){
      return <h2> Querying BlockChain <h3> (Can take a few minutes to process)</h3></h2>
    }
    return ""
  }
  function parseRawTxs(unparsedtTxs:any){

    // console.log(unparsedtTxs)
    var parsedArray = [] as any;

    for (var i = 0; i < unparsedtTxs.length; i++){
    
      const tempTx = unparsedtTxs[i];
      const tempTime = Date.parse(tempTx.timestamp);
      const tempFromAddress = tempTx.tx.value.msg[0].value.from_address;
      const tempAmount = tempTx.tx.value.msg[0].value.amount[0];
      
      if (tempAmount.denom == 'uusd' && tempTime > STARTTIME){
        const tempParsedTx = {
          "timestamp":tempTime,
          "from":tempFromAddress,
          "amount": parseFloat((parseFloat(tempAmount.amount)*(10**-6)).toFixed(2))
        }
        parsedArray.push(tempParsedTx)
      }
    }
    return parsedArray
  }

  return (
    <div className="App">
        <Container>
        <h1>
          Meteor Shower Dashboard            
        </h1>
        <h2 id="Sub-Heading">
            Current Shower: {CURRENTSHOWER + 1} / {NUMBEROFSHOWERS}
        </h2>
        <h2 id="Sub-Heading">
            Start Time: {DATE.toString()}
        </h2>
        <h2 id="Sub-Heading">
            Total Wallets in this shower: {numParticipants}
        </h2>
        </Container>
       
       {getIsLoading()}
       <ClipLoader  loading={isLoading} size={150} />

        <Container id="Top-Dashboard">
          <CurrentLeadersTable props = {data[CURRENTSHOWER]}/>
          <Container>
            <div>
              <CurrentHistogram props = {data[CURRENTSHOWER]}/>
            </div>
            <CurrentShowerData props = {data[CURRENTSHOWER]}/>
          </Container>
        </Container>

        <Container>
          <HistoricalPriceChart props = {data}/>
        </Container>
        <p>
        </p>
    </div>
  );
}

export default App;
