import React,{useState,useContext, createContext,useEffect} from 'react'
import { View ,TouchableOpacity,Text, Dimensions, ScrollView} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {Activity,Tab} from './Tractor'

const TractorHistoryContext = createContext()
const seasonName = ["சம்பா","குருவாய்","பருவம்"]



const HISTORY = "வரலாறு"
const SAAL = "உழவுசால்"


const {width,height} = Dimensions.get('window')

const TRACTOR = "டிராக்டர்"
const ACTIVE = "செயலில்"
const SEASON = "பருவம்"
const DATEOFDRIVEN = "இயக்கி தேதி  YYYY-MM-DD"
const PLACE = "இடம்"
const ACER = "ஏக்கர்"
const POINTS = "புள்ளிகள்"
const INCLUDEROTATOR = "ரோட்டேட்டர்"
const DRIVERNAME = "டிரைவர் பெயர்"
const DONE = "முடிந்தது"
const DATE = "தேதி"
const AMOUNT = "தொகை"
const INVALID = "தவறான சான்றுகள்"
const SUCESSFULLYDONE = "வெற்றிகரமாக முடிந்தது"
const IFINCLUDEROTATOR = "ரோட்டேட்டர் சேர்க்கப்பட்டால்"
const PAID = "செலுத்தப்பட்டது"


const TractorHistoryProvider=(props)=>{

  

  const [isActiveExist,setIsActiveExist] = useState(props.navigation.state.params.history)
  const [activity,setActivity] = useState()
  const goBack=()=>{
    props.navigation.goBack()
  }

  useEffect(()=>{
   
    var activityTemp = []
    for(var i in isActiveExist.Activity){
      activityTemp.push(isActiveExist.Activity[i])
    }
    activityTemp.sort((a,b)=>{
      return a.timeStamp-b.timeStamp
    })
    setActivity(activityTemp)
  },[])


  
     
  return <TractorHistoryContext.Provider value={{
             isActiveExist,setIsActiveExist,goBack,activity
  }} >
         <TractorHistory/>
  </TractorHistoryContext.Provider>
}
export default TractorHistoryProvider


const AppBar=()=>{
  const goBack = useContext(TractorHistoryContext).goBack
  return <View
     style={{height:60,backgroundColor:'white',borderBottomWidth:0.1,alignItems:'center',
     elevation:2,shadowColor:'#000',shadowOffset:{height:2,width:2},backgroundColor:'white',
            flexDirection:'row',paddingHorizontal:10,justifyContent:'space-between'}}
  >
      <View
         style={{flexDirection:'row',alignItems:'center'}}
      >
        <TouchableOpacity
          onPress={()=>goBack()}
        >
            <MaterialIcon
              name={"arrow-back"}
              size={24}              
            />
        </TouchableOpacity>

        <Text
              style={{paddingHorizontal:5,fontSize:19,fontWeight:'bold',marginLeft:15,marginBottom:3}}
          >
                {HISTORY}
        </Text>
      </View> 
       
  </View>
}



const TractorHistory=()=> {
    var {isActiveExist} = useContext(TractorHistoryContext)
    var {activity} = useContext(TractorHistoryContext)
  
   
    return (
      <View
         style={{flex:1,backgroundColor:'white'}}
      >
        
        <AppBar/>
        <ScrollView>
            <OverAll  />
            <Activity activity={activity} />
        </ScrollView>
  
      </View>
    )
}

export const OverAll = ()=>{

  var {isActiveExist} = useContext(TractorHistoryContext)

  return <View>
    <View>
             <View
               style={{height:170,width:width,justifyContent:'center',alignItems:'center',marginBottom:20}}
             >
                     <View
                        style={{height:125,width:125,borderRadius:200,justifyContent:'center',alignItems:'center',borderWidth:0.5,marginTop:20}}
                      >
                          <Text style={{color:"black",fontSize:25,fontWeight:'bold'}} >
                            {isActiveExist.amount}₹
                          </Text>
                            <Text style={{opacity:0.5,fontSize:13}} >{AMOUNT}</Text>
                      </View>
             </View>

             <View
               style={{
                   flexDirection:'row',justifyContent:'space-evenly',paddingBottom:10,paddingHorizontal:10
               }}
             >
                 <View
                   style={{justifyContent:'center',alignItems:'center'}}
                 >

                     <Text
                       style={{fontSize:15,fontWeight:'bold',color:'purple'}}
                     >
                       {isActiveExist.totalAcer}
                     </Text>
                     
                     <Text style={{fontSize:12,color:'purple',fontWeight:'bold'}}>
                         {ACER} 
                     </Text>

                 </View>
                 <View
                   style={{justifyContent:'center',alignItems:'center'}}
                 >

                     <Text
                       style={{fontSize:15,fontWeight:'bold',color:'green'}}
                     >
                        {isActiveExist.points}
                     </Text>
                     
                     <Text style={{fontSize:12,color:'green',fontWeight:'bold'}}>
                        {`${POINTS} (${isActiveExist.pointsPrice}₹)`}
                     </Text>

                 </View>
                 <View
                     style={{justifyContent:'center',alignItems:'center'}}
                 >
                      <Text
                          style={{fontSize:15,fontWeight:'bold',color:'red'}}
                        >
                           {isActiveExist.totalSaal}

                      </Text>
                        
                      <Text style={{fontSize:12,color:'red',fontWeight:'bold'}}>
                        {`${SAAL} (${isActiveExist.saalPrice}₹)`}
                      </Text>

                 </View>
                 <View
                      style={{justifyContent:'center',alignItems:'center'}}
                 >
                   
                      <Text
                          style={{fontSize:10,fontWeight:'bold',color:'orange'}}
                        >
                         {seasonName[isActiveExist.season-1]} 
                      </Text>
                        
                      <Text style={{fontSize:12,color:'orange',fontWeight:'bold'}}>
                         {SEASON}
                      </Text>
                 </View>
               </View>
               <View style={{width,height:60,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingHorizontal:20,borderBottomWidth:0.5,paddingBottom:10}}>
                    <Text style={{fontSize:10,opacity:0.5,fontWeight:'bold'}} >{DATE} : {isActiveExist.date} - {isActiveExist.finishDate}</Text>
               </View> 
             </View>
       </View>
}
