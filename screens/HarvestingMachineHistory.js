import React, { createContext, useContext, useState, useEffect } from 'react'
import { View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {Activity} from './HarvestingMachine'




const {width,height} = Dimensions.get('window')

const HARVESTINGMACHINE = "இயந்திரம்"
const HISTORY = "வரலாறு"
const ACTIVE = "செயலில்"
const DONE = "முடிந்தது"
const DATEOFDRIVEN = "இயக்கி தேதி"
const PLACE = "இடம்"
const seasonName = ["சம்பா","குருவாய்","பருவம்"]
const SELECTMACHINE = 'இயந்திரத்தைத் தேர்ந்தெடுக்கவும்'
const OVERALLTIME = "நேரம்"
const INVALID = "தவறான சான்றுகள்"
const SUCESSFULLYDONE = "வெற்றிகரமாக முடிந்தது"
const AMOUNT = "தொகை"
const DATE = "தேதி"
const SEASON = "பருவம்"
const ACTUALAMOUNT = "அசல் தொகை"
const PROFIT = "லாபம்"
const PAID = "செலுத்தப்பட்டது"
const DELETE = "அகற்று"
const ACER = "ஏக்கர்"



const HarvestingMachineHistoryContext = createContext()
const HarvestingMachineHistoryProvider = (props) => {

    const isActiveExist = useState(props.navigation.state.params.history)[0]
    const [activity,setActivity] = useState()

    const goBack=()=>{
        props.navigation.goBack()
    }

    console.log("\n\n",activity)

    useEffect(()=>{
        var activityTemp = []
        for(var i in isActiveExist.Activity){
          activityTemp.push(isActiveExist.Activity[i])
        }
        activityTemp.sort((a,b)=>{
          if(new Date(a.timeStamp).getTime()>new Date(b.timeStamp).getTime()){
            return 1
          }else{
            return -1
          }
        })
        setActivity(activityTemp)
    },[])

    return (
       <HarvestingMachineHistoryContext.Provider
          value={{goBack,isActiveExist,activity,setActivity}}
       >
            <HarvestingMachineHistory/>
       </HarvestingMachineHistoryContext.Provider>
    )
}

export default HarvestingMachineHistoryProvider


const HarvestingMachineHistory = ()=>{
    const {activity,isActiveExist} = useContext(HarvestingMachineHistoryContext)
    return <View
       style={{flex:1,backgroundColor:'white'}}
    >
        <AppBar/>
        <ScrollView>
            <OverAll/>
            <Activity activity={activity} isActiveExist={isActiveExist} />
            <View style={{height:100}} />
        </ScrollView>
    </View>
}



const AppBar=()=>{
  const {goBack} = useContext(HarvestingMachineHistoryContext)
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

const OverAll = ()=>{

    const {isActiveExist} = useContext(HarvestingMachineHistoryContext)
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
                         {isActiveExist.totalHours}
                       </Text>
                       
                       <Text style={{fontSize:12,color:'purple',fontWeight:'bold'}}>
                              {`${OVERALLTIME}`}
                       </Text>
  
                   </View>
                   <View
                   style={{justifyContent:'center',alignItems:'center',}}
                 >

                     <Text
                       style={{fontSize:15,fontWeight:'bold',color:'green'}}
                     >
                        {isActiveExist.totalAcer}
                     </Text>
                     
                     <Text style={{fontSize:12,color:'green',fontWeight:'bold'}}>
                     {ACER}

                     </Text>

                 </View>
                   <View
                       style={{justifyContent:'center',alignItems:'center',}}
                   >
                        <Text
                            style={{fontSize:15,fontWeight:'bold',color:'red'}}
                          >
                             {isActiveExist.amount-isActiveExist.actualAmount}
  
                        </Text>
                          
                        <Text style={{fontSize:12,color:'red',fontWeight:'bold'}}>
                             {PROFIT}
                        </Text>
  
                   </View>
                   <View
                        style={{justifyContent:'center',alignItems:'center',}}
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

