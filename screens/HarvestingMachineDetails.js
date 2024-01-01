import React, { createContext, useContext, useState, useEffect, useRef,  } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList, Image, TextInput, StyleSheet, TouchableWithoutFeedback, Vibration } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import RBSheet from 'react-native-raw-bottom-sheet'
import * as Colors from '../Assets/color'
import {blue} from '../Assets/color'
import {database} from '../database/firebase'
import Snackbar from 'react-native-snackbar'

const MACHINEDETAILS = "இயந்திர விவரங்கள்"
const HarvestingMachineDetailsContext = createContext()



const {width,height} = Dimensions.get('window')
const seasonName = ["சம்பா","குருவாய்","பருவம்"]
const SEASON = "பருவம்"
const AMOUNT = "தொகை"
const INVALID = "தவறான சான்றுகள்"
const SUCESSFULLYDONE = "வெற்றிகரமாக முடிந்தது"
const DATE = "தேதி"
const FUELCOAST = "பிற செலவு"
const ACER = "ஏக்கர்"
const TIME = "நேரம்"
const TIRE = "சக்கரம்"
const BELT = "பெல்ட்"
const MACHINETYPES = [TIRE,BELT]
const DONE = "முடிந்தது"
const DATEOFDRIVEN = "இயக்கி தேதி"
const PLACE = "இடம்"
const OVERALLTIME = "நேரம்"
const DELETE = "அகற்று"




const HarvestingMachineDetails = (props) => {
    const goBack=()=>{
        props.navigation.goBack()
    }


    const {machine,callBack,fromHistory} = props.navigation.state.params

    const [activity,setActivity] = useState(null)
    const [updateMachine,setUpdateMachine] = useState({})
    const [petrolAmount,setPetrolAmount] = useState(0)

    console.log(machine)
   
    
    const getActivity = async()=>{
       
        const Machine = (await database.ref("HarvestingMachineSettings/Members/"+`ID${machine.ownerId}/Active/Machine/${machine.id}`).once('value')).toJSON()
        const activityTemp = []
        for(var i in Machine.Active.Activity){
            activityTemp.push({...Machine.Active.Activity[i],id:i})
           
        }

        activityTemp.sort((a,b)=>{
          if(new Date(a.timeStamp).getTime()>new Date(b.timeStamp).getTime()){
            return 1
          }else{
            return -1
          }
        })

        Machine.Active.petrolAmount!=undefined && setPetrolAmount(Machine.Active.petrolAmount)
        setUpdateMachine(Machine)
        setActivity(activityTemp)

    } 

    const getHistoryData = async()=>{
      const activityTemp = []
      for(var i in  machine.Activity){
          activityTemp.push({...machine.Activity[i],id:i})
         
      }

      activityTemp.sort((a,b)=>{
        if(new Date(a.timeStamp).getTime()>new Date(b.timeStamp).getTime()){
          return 1
        }else{
          return -1
        }
      })

      setPetrolAmount(machine.petrolAmount)
      setUpdateMachine(machine)
      setActivity(activityTemp)
      
    }

    useEffect(()=>{
      if(fromHistory){
        getHistoryData()
      }else{
        getActivity()
      }
    },[])

    return (
        <HarvestingMachineDetailsContext.Provider
          value={{goBack,machine,callBack,updateMachine,getActivity,petrolAmount,fromHistory,updateMachine}}
        >
            <View
                style={{backgroundColor:'white',flex:1}}
            >
                <AppBar/>
                   { 
                   (activity!=null)?<ScrollView>
                       <OverAll/>
                       <Activity activity={activity} />
                       <View style={{height:100}} />
                    </ScrollView>:<View
                                        style={{flex:1,justifyContent:'center',alignItems:'center'}}
                                    >
                                            <Text style={{fontSize:13,fontWeight:'bold',opacity:0.5}} >Loading...</Text>
                                    </View>
                    }
            </View>
        </HarvestingMachineDetailsContext.Provider>
       
    )
}



const AppBar=()=>{
    const {goBack,fromHistory} = useContext(HarvestingMachineDetailsContext)
    const refFuleSheet = useRef()
    const refAmountSheet = useRef()
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
                  {MACHINEDETAILS}
          </Text>
        </View>  
       { !fromHistory && <View 
          style={{flexDirection:'row',alignItems:'center',}}
        > 
         <TouchableOpacity
                    onPress={()=>{refFuleSheet.current.open()}}
                  >
                         <Image
                            tintColor={'grey'}
                            style={{height:20,width:18,backgroungColor:'grey',marginHorizontal:10}}
                            source={require('../Assets/Images/fuel.png')}
                          />

          </TouchableOpacity>

          <TouchableOpacity
              onPress={()=>{
                refAmountSheet.current.open()
              }}
            >
              <Image
                  tintColor={'grey'}
                  style={{height:22,width:24,backgroungColor:'grey',marginHorizontal:10}}
                  source={require('../Assets/Images/appBarRenew.png')}
              />

       </TouchableOpacity>
              
        </View>
        }
      <FuelSheet refFuelSheet={refFuleSheet} />
      <FuelSheet refFuelSheet={refAmountSheet} isAmount = {true} />

    </View>
}

const FuelSheet = ({refFuelSheet,isAmount})=>{
  const [amount,setAmount] = useState("")
  const date = (`${new Date().getDate()}-0${new Date().getMonth()+1}-${new Date().getFullYear()}`)
  const {callBack,machine,getActivity,updateMachine} = useContext(HarvestingMachineDetailsContext)
  const onPress=async()=>{

    const timeStamp = + new Date()

    refFuelSheet.current.close()

    await  database.ref("HarvestingMachineSettings/Members/"+`ID${machine.ownerId}/Active/Machine/${machine.id}/Active/Activity`).push({
        date,amount:parseFloat(amount),timeStamp,isPetrol:true
    })
    await  database.ref("HarvestingMachineSettings/Members/"+`ID${machine.ownerId}/Active/Machine/${machine.id}/Active`).update({
      petrolAmount:updateMachine.Active.petrolAmount?(parseInt(amount)+updateMachine.Active.petrolAmount):parseInt(amount)
    })

    setTimeout(()=>{
      Snackbar.show({
        text:SUCESSFULLYDONE,
        textColor:'white'
      })
      getActivity()
    },1000)

    callBack()

  }

  const onPressAmount=async()=>{

    const timeStamp = + new Date()
    refFuelSheet.current.close()

    await  database.ref("HarvestingMachineSettings/Members/"+`ID${machine.ownerId}/Active/Machine/${machine.id}/Active/Activity`).push({
        date,amount:parseFloat(amount),timeStamp
    })
    await  database.ref("HarvestingMachineSettings/Members/"+`ID${machine.ownerId}/Active/Machine/${machine.id}/Active`).update({
      petrolAmount:updateMachine.Active.petrolAmount?(parseInt(amount)+updateMachine.Active.petrolAmount):parseInt(amount)
    })

    setTimeout(()=>{
      Snackbar.show({
        text:SUCESSFULLYDONE,
        textColor:'white'
      })
      getActivity()
    },1000)

    callBack()

  }
  
  return  <RBSheet
      ref={refFuelSheet}
      height={320}
      duration={270}
      closeOnDragDown={true}
      closeOnPressBack={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper:{
          backgroundColor:'transparent'
        },
        container:{
          backgroundColor: "transparent",
          borderTopLeftRadius:20,borderTopRightRadius:20,backgroundColor:'white', shadowColor: '#000',
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 0.9,
                  shadowRadius: 8,
                  elevation: 100,
        },
        draggableIcon:{
            backgroundColor:'#000'
        }
      }}
  >

  <View>
    {
          <View>
              <View
              style={{justfyContent:'center',alignItems:'center',marginTop:40}}
            >
              {(isAmount)?

              <Image
              tintColor={'grey'}
              style={{height:80,width:95,backgroungColor:'grey',marginHorizontal:10}}
              source={require('../Assets/Images/appBarRenew.png')}
              />
              
              :<Image
                  tintColor={'grey'}
                  style={{height:85,width:75,backgroungColor:'grey',marginHorizontal:10}}
                  source={require('../Assets/Images/fuel.png')}
                />
                          
              }
        </View>
        <View
            style={{...style.textInput,marginTop:45}}
          >
                <TextInput
                    value={amount}
                    keyboardType="number-pad"
                    onChangeText={(text)=>setAmount(text)}
                    style={{flex:1,marginLeft:20}}
                    placeholder={AMOUNT}
                    returnKeyType="done"
                />
          </View>

          <TouchableWithoutFeedback
                    
                    onPress={async()=>{
                      if(!parseFloat(amount)){
                        Snackbar.show({
                          text:INVALID,
                          textColor:'red'
                        })
                        return
                      }
                      isAmount?onPressAmount():onPress()
                    }}
          >
              <View
                  style={{...style.textInput,marginTop:10,
                          backgroundColor:blue,
                          shadowOffset: { width: 0, height: 5 },
                          shadowOpacity: 0.7,
                          shadowRadius: 3,
                          elevation: 3,
                          borderWidth:0,
                          justifyContent:'center',
                          alignItems:'center'
                        }}
                >

                  <Text
                    style={{color:'white',fontWeight:'bold'}}
                  >
                    {DONE}
                  </Text>
            </View>
          </TouchableWithoutFeedback>
     
         
      </View>
    }

  </View>


  </RBSheet>

}
  


export const OverAll = ()=>{

    var {machine,petrolAmount,updateMachine} = useContext(HarvestingMachineDetailsContext)
    return <View>
      <View>
               <View
                 style={{height:170,width:width,justifyContent:'center',alignItems:'center',marginBottom:20}}
               >
                       <View
                          style={{height:125,width:125,borderRadius:200,justifyContent:'center',alignItems:'center',borderWidth:0.5,marginTop:20}}
                        >
                            <Text style={{color:"black",fontSize:25,fontWeight:'bold'}} >
                              {machine.amount}₹
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
                         {machine.totalAcer}
                       </Text>
                       
                       <Text style={{fontSize:12,color:'purple',fontWeight:'bold'}}>
                           {ACER} 
                       </Text>
  
                   </View>
                   <View
                     style={{justifyContent:'center',alignItems:'center',}}
                   >
  
                       <Text
                         style={{fontSize:15,fontWeight:'bold',color:'green'}}
                       >
                          {machine.totalHours} 
                       </Text>
                       
                       <Text style={{fontSize:12,color:'green',fontWeight:'bold'}}>
                       {TIME} { `( ${updateMachine.price}₹ )` }
  
                       </Text>
  
                   </View>
                   <View
                       style={{justifyContent:'center',alignItems:'center',}}
                   >
                        <Text
                            style={{fontSize:15,fontWeight:'bold',color:'red'}}
                          >
                             {petrolAmount}₹
  
                        </Text>
                          
                        <Text style={{fontSize:12,color:'red',fontWeight:'bold'}}>
                           {FUELCOAST}
  
                        </Text>
  
                   </View>
                   <View
                        style={{justifyContent:'center',alignItems:'center',}}
                   >
                        <Text
                            style={{fontSize:10,fontWeight:'bold',color:'orange'}}
                          >
                           {seasonName[machine.season-1]}
                        </Text>
                          
                        <Text style={{fontSize:12,color:'orange',fontWeight:'bold'}}>
                           {SEASON}
                        </Text>
                   </View>
                 </View>
                 <View style={{width,height:60,flexDirection:'row',justifyContent:'center',
                          alignItems:'center',paddingHorizontal:20,paddingBottom:10,borderBottomWidth:0.5}}>
                      <Text style={{fontSize:10,opacity:0.5,fontWeight:'bold'}} >{DATE} : {machine.date}</Text>
                 </View> 
               </View>
         </View>
}


export const Activity = ({activity})=>{
    console.log(activity)
    return  <FlatList
                 data = {activity}
                 keyExtractor={(item,index)=>item.key}
                 renderItem={({index,item})=>{
                   var color = (item.pending || index==0)?'white': '#eeeeee'
                   return <View
                         style={{alignItems:'center',alignItems:'center',justifyContent:'center',backgroundColor:color }}
                   >
                     {
                       (index==0)?<View
                           style={{
                             height:50,width,backgroundColor:'#eeeeee',borderBottomWidth:0.5,flexDirection:'row',alignItems:'center'
                           }}
                         >
                           <View
                               style={{width:width/4,alignItems:'center',justifyContent:'center'}}
                             >
                               <Text
                                 style={{fontWeight:'bold',color:'black',fontSize:14,}}
                                 >
                                 {OVERALLTIME}
                               </Text>
                          </View>
                          <View
                           style={{width:width/4,alignItems:'center',justifyContent:'center'}}
                         >
                             <Text
                             style={{fontWeight:'bold',color:'black',fontSize:14,}}
                             >
                               {ACER}
                           </Text>
                         </View>
                         <View
                           style={{width:width/4,alignItems:'center',justifyContent:'center'}}
                         >
                             <Text
                             style={{fontWeight:'bold',color:'black',fontSize:14,}}
                             >
                               {AMOUNT}
                           </Text>
  
                         </View>
                           
                         
                         
                           <View
                           style={{width:width/4,alignItems:'center',justifyContent:'center'}}
                         >
                             <Text
                             style={{fontWeight:'bold',color:'black',fontSize:14,}}
                             >
                             {DATE}
                           </Text>
                         </View>
                       </View>:<View/>
                     }
                      {
                        (item.acer)?
                          <Tab item={item} />:
                           (item.isPetrol)?
                              <PetrolTab item={item} />:
                              <AmountTab item={item}/>
                         

                      }
                   </View>
                 }}
               />
}

const PetrolTab = ({item})=>{
  
  const refDeleteSheet = useRef()
  const {updateMachine,machine,fromHistory} = useContext(HarvestingMachineDetailsContext)

  return<View> 
          <TouchableOpacity
            onLongPress={()=>{
              if(!fromHistory){
                  Vibration.vibrate(50)
                  refDeleteSheet.current.open()
              }
            }}
          >
          <View
            style={{
              height:50,width,borderBottomWidth:1,flexDirection:'row',alignItems:'center',
              backgroundColor:'white',backgroundColor:Colors.searchBarColor,justifyContent:'center'
            }}
          >
              <View
                style={{padding:5,borderRadius:20,paddingHorizontal:10,
                        justifyContent:'space-around',
                        flexDirection:'row',alignItems:'center'}}
                >
                <Image
                    tintColor={'black'}
                    style={{height:16,width:15,backgroungColor:'grey',marginHorizontal:5}}
                    source={require('../Assets/Images/fuel.png')}
                  />

              <Text
                style={{fontSize:13,fontWeight:'bold',marginLeft:5}}
              >{item.amount}₹    {item.date}</Text>

              </View>

          </View>  
    </TouchableOpacity>
    <DeleteSheet refDeleteSheet={refDeleteSheet} item={item} updateMachine={updateMachine} machine={machine}/>
    </View>
}

const AmountTab = ({item})=>{
  
  const refDeleteSheet = useRef()
  const {updateMachine,machine,fromHistory} = useContext(HarvestingMachineDetailsContext)

  return<View> 
          <TouchableOpacity
            onLongPress={()=>{
              if(!fromHistory){
                Vibration.vibrate(50)
                refDeleteSheet.current.open()
              }
            }}
          >
          <View
            style={{
              height:50,width,borderBottomWidth:1,flexDirection:'row',alignItems:'center',
              backgroundColor:'white',backgroundColor:Colors.searchBarColor,justifyContent:'center'
            }}
          >
              <View
                style={{padding:5,borderRadius:20,paddingHorizontal:10,
                        justifyContent:'space-around',
                        flexDirection:'row',alignItems:'center'}}
                >
                <Image
                  tintColor={'black'}
                  style={{height:22,width:22,backgroungColor:'grey',marginHorizontal:10}}
                  source={require('../Assets/Images/appBarRenew.png')}
              />

              <Text
                style={{fontSize:13,fontWeight:'bold',marginLeft:5}}
              >{item.amount}₹    {item.date}</Text>

              </View>

          </View>  
    </TouchableOpacity>
    <DeleteSheet refDeleteSheet={refDeleteSheet} item={item} updateMachine={updateMachine} machine={machine}/>
    </View>
}

export const Tab = ({item})=>{
 
 
    const [extend,setExtend] = useState(false)
   
     return<View
       style={{backgroundColor:'white'}}
     >
        <TouchableOpacity
        onPress={()=>{
          setExtend(!extend)
         }}
    
     > 
    <View
       style={{
         height:50,width,borderBottomWidth:(extend)?0:1,flexDirection:'row',alignItems:'center',backgroundColor:'white',
       }}
   >
      <View
       style={{width:width/4,alignItems:'center',justifyContent:'center'}}
       >
           <Text
           style={{color:'black',fontSize:14,}}
           >
           {item.hours}
         </Text>
       </View>
       <View
        style={{width:width/4,alignItems:'center',justifyContent:'center'}}
       >
           <Text
           style={{color:'black',fontSize:14,}}
           >
           {item.acer}
         </Text>
       </View>
        <View
       style={{width:width/4,alignItems:'center',justifyContent:'center'}}
       >
           <Text
           style={{color:'black',fontSize:14,}}
           >
           {item.amount} ₹
         </Text>
       </View>
      
      
       <View
       style={{width:width/4,alignItems:'center',justifyContent:'center'}}
       >
           <Text
           style={{color:'black',fontSize:14,}}
           >
           {item.date}
         </Text>
       </View>
     </View>
    </TouchableOpacity>
 
    {(!extend)?<View/>:
         <View
         style={{
           height:50,width,borderBottomWidth:1,flexDirection:'row',alignItems:'center',backgroundColor:'white',
           alignItems:'center',justifyContent:'space-evenly',flexDirection:'row'
         }}
          >
             <View
               style={{borderWidth:1,padding:5,borderRadius:20,paddingHorizontal:10,opacity:0.5,
                      justifyContent:'space-around',
                      flexDirection:'row',alignItems:'center'}}
            >
              <MaterialIcon
                 name={'location-on'}
                 size={15}
              />
 
             <Text
               style={{fontSize:13,fontWeight:'bold',marginLeft:5}}
             >{item.place}</Text>
 
            </View>
         
             
            <View
               style={{borderWidth:1,padding:5,borderRadius:20,paddingHorizontal:10,opacity:0.5,
                      justifyContent:'space-around',
                      flexDirection:'row',alignItems:'center'}}
               >
                <MaterialIcon
                 name={'person'}
                 size={15}
              />
 
             <Text
               style={{fontSize:13,fontWeight:'bold',marginLeft:5}}
             >{item.member.name} - {item.member.location}</Text>
 
            </View>
          </View>
     }
  </View>
 }

 const DeleteSheet=({refDeleteSheet,item,updateMachine,machine})=>{

  const {getActivity,callBack} = useContext(HarvestingMachineDetailsContext)

  return <RBSheet             
  ref={refDeleteSheet}
  height={270}
  duration={270}
  closeOnDragDown={true}
  closeOnPressBack={true}
  closeOnPressMask={true}
  customStyles={{
    wrapper:{
      backgroundColor:'transparent'
    },
    container:{
        backgroundColor: "transparent",
        borderTopLeftRadius:20,borderTopRightRadius:20,backgroundColor:'white', shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.9,
                shadowRadius: 8,
                elevation: 100,
    },
    draggableIcon:{
        backgroundColor:'#000'
    }
  }}
>



<View>
    <View
      style={{justfyContent:'center',alignItems:'center',marginTop:40}}
    >
        <Text
            style={{fontSize:35,color:'black',fontWeight:'bold'}}
        >
            {item.amount}₹
        </Text>
        <Text
            style={{marginTop:8,fontSize:17}}
        >
            {AMOUNT}
        </Text>
    </View>

    <TouchableWithoutFeedback
        onPress={async()=>{
          refDeleteSheet.current.close()
          await  database.ref("HarvestingMachineSettings/Members/"+`ID${machine.ownerId}/Active/Machine/${machine.id}/Active/Activity/${item.id}`).remove()
          
          await  database.ref("HarvestingMachineSettings/Members/"+`ID${machine.ownerId}/Active/Machine/${machine.id}/Active`).update({
            petrolAmount:(-parseInt(item.amount)+updateMachine.Active.petrolAmount)
          })
      
          getActivity()
          callBack()

        }}
     
    >
    <View
              style={{...style.textInput,marginTop:70,
                      backgroundColor:'red',
                      shadowOffset: { width: 0, height: 5 },
                      shadowOpacity: 0.7,
                      shadowRadius: 3,
                      elevation: 3,
                      borderWidth:0,
                      justifyContent:'center',
                      alignItems:'center'
                    }}
            >
              <Text
                style={{color:'white',fontWeight:'bold'}}
              >
                {DELETE}
              </Text>
      </View>
    </TouchableWithoutFeedback>
  </View>
</RBSheet>
}

const style = StyleSheet.create({
  textInput:{height:45,borderRadius:20,backgroundColor:Colors.searchBarColor,margin:10,flexDirection:'row',alignItems:'center' },
  moduleBar : {width:(width-60)/2,height:40,borderRadius:20,borderWidth:0.1,justifyContent:'center',alignItems:'center'}
})

export default HarvestingMachineDetails
