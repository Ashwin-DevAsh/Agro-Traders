import React, { createContext,useContext, useState, useRef, useEffect, useCallback} from 'react'
import { View, Text ,TouchableOpacity, Vibration, StyleSheet, Dimensions, FlatList,Image, TextInput,TouchableWithoutFeedback, ScrollView, ToastAndroid} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {blue} from '../Assets/color'
import * as Colors from '../Assets/color'
import RBSheet from 'react-native-raw-bottom-sheet'
import Snackbar from 'react-native-snackbar'
import {database} from '../database/firebase'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {NativeModules} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';



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
const TIRE = "சக்கரம்"
const BELT = "பெல்ட்"
const MACHINETYPES = [TIRE,BELT]
const FAILED = "தோல்வி"
const PERSON = "நபர்"




const {height,width} = Dimensions.get('window')
const HarvestingMachineContext = createContext()
const HarvestingMachineProvider = (props) => {

    const [module,setModule] = useState(1)
    const AddTransaction = useRef()
    const [isActiveExist,setIsActiveExist] = useState(null)
    const member = props.navigation.state.params.member
    const [activity,setActivity] = useState()
    const [isLoading,setIsLoading] = useState(null)
    const [historyAmount,setHistoryAmount]= useState(0)
    const [isHistoryExist,setIsHistoryExist] = useState(null)
    const [histories,setHistories] = useState([])
    const [year,setYear] = useState((new Date()).getFullYear())
    const [season,setSeason] = useState(0)
    const [beltPrice,setBeltPrice] = useState(0)
    const [tirePrice,setTirePrice] = useState(0)
    const [beltPriceActual,setBeltPriceActual] = useState(0)
    const [tirePriceActual,setTirePriceActual] = useState(0)





    const goBack = ()=>{
         props.navigation.goBack()
    }

    const navigate = (page,data)=>{
       props.navigation.push(page,data)
    }

    const getSettings = async()=>{
      const settings=(await database.ref("HarvestingMachineSettings").once('value')).toJSON()
      console.log(settings)
      setBeltPrice(settings.beltPrice)
      setTirePrice(settings.tirePrice)
      setTirePriceActual(settings.tirePriceActual)
      setBeltPriceActual(settings.beltPriceActual)
      setSeason(settings.season)
    
    }

    const currentSettings = async()=>{
      const settings=(await database.ref("Members/"+member.key+"/HarvestingMachine/Active").once('value')).toJSON()
      console.log(settings)
      setBeltPrice(settings.beltPrice)
      setTirePrice(settings.tirePrice)
      setTirePriceActual(settings.tirePriceActual)
      setBeltPriceActual(settings.beltPriceActual)
      setSeason(settings.season)
    }

    const getActiveData = async()=>{
        const memberDetails = (await database.ref("Members/"+member.key).once('value')).toJSON()
        if(memberDetails.HarvestingMachine){
            if(memberDetails.HarvestingMachine.Active){
              currentSettings()
              var activityTemp = []
              for(var i in memberDetails.HarvestingMachine.Active.Activity){
                activityTemp.push({...memberDetails.HarvestingMachine.Active.Activity[i],id:i})
              }
              activityTemp.sort((a,b)=>{
                if(new Date(a.timeStamp).getTime()>new Date(b.timeStamp).getTime()){
                  return 1
                }else{
                  return -1
                }
              })
              console.log(activityTemp)
              setActivity(activityTemp)
              currentSettings()
              setIsActiveExist(memberDetails.HarvestingMachine.Active)
            }else{
               getSettings()
               setIsActiveExist(false)
            }
        }else{
           setIsActiveExist(false)
           getSettings()
        }
     }

     const getHistoryData = async(season=1)=>{
      setHistoryAmount(0)
      setIsLoading(null)
      const memberDetails = (await database.ref("Members/"+member.key).once('value')).toJSON()
      if(memberDetails.HarvestingMachine){
          var hisAmount = 0
          if(memberDetails.HarvestingMachine.History){
            setIsHistoryExist(memberDetails.HarvestingMachine.History)
            var historyTemp = []
            for(var i in memberDetails.HarvestingMachine.History){
              if(memberDetails.HarvestingMachine.History[i].date.endsWith(year) && memberDetails.HarvestingMachine.History[i].season==season){
                  historyTemp.push(memberDetails.HarvestingMachine.History[i])
                  hisAmount+=memberDetails.HarvestingMachine.History[i].amount
              }
            }
            historyTemp.sort((a,b)=>{
              if(new Date(a.timeStamp).getTime()>new Date(b.timeStamp).getTime()){
                return -1
              }else{
                return +1
              }
            })
            setHistoryAmount(hisAmount)
            setHistories(historyTemp)
          }else{
            setIsHistoryExist(false)
          }
      }else{
        setIsHistoryExist(false)
     }
     setIsLoading(true)
   }

     useEffect(() => {
         getActiveData()
         getHistoryData()
     }, [])
   
    return (
        <HarvestingMachineContext.Provider
            value={{goBack,module,setModule,isActiveExist,setIsActiveExist,
                  isHistoryExist,isLoading,tirePrice,beltPrice,
                  histories,year,setYear,histAmount:historyAmount,navigate,
                  getHistoryData,season,tirePriceActual,beltPriceActual,
                  member,getActiveData,AddTransaction,getActiveData,activity}}
        >
                <HarvestingMachine/>
        </HarvestingMachineContext.Provider>
    )
}
export default HarvestingMachineProvider


const HarvestingMachine = ()=>{
   const {module} = useContext(HarvestingMachineContext)
    return <View
       style={{flex:1,backgroundColor:'white'}}
    >
         <AppBar/>
         <ScrollView>

         <Section/>
         {
           (module==1)?
               <Active/>
           :
           <History/>

         }
           </ScrollView>
         <AddTransactionSheet/>
         
    </View>
}


export const Active = ({})=>{
 
  
  var {isActiveExist,activity,} = useContext(HarvestingMachineContext)
 
  return <View >
    {
      (isActiveExist==null)?<View style={{
        justifyContent:"flex-end",height:height/3,alignItems:'center'}}>
                                <Text
                                   style={{fontWeight:'bold',fontSize:13,opacity:0.5}}
                                >Loading...</Text>
                            </View>
                         :<View/>
      
    }
    {
      (isActiveExist)?<View>
         <OverAll/>
          <Activity activity={activity} isActiveExist={isActiveExist}/>
          <View style={{height:100}} />
        </View>:<View/>
    }
  </View>
}

export const OverAll = ()=>{

  var {isActiveExist} = useContext(HarvestingMachineContext)
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
                           {isActiveExist.amount-isActiveExist.actualAmount}₹

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
                    <Text style={{fontSize:10,opacity:0.5,fontWeight:'bold'}} >{DATE} : {isActiveExist.date}</Text>
               </View> 
             </View>
       </View>
}
export const Activity = ({activity,isActiveExist})=>{
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
                    <Tab item={item} isActiveExist={isActiveExist}/>
                    }
                 </View>
               }}
             />
}

const History = ()=>{

  const { isHistoryExist,isLoading,
          histories,year,setYear,histAmount,navigate,
          getHistoryData} = useContext(HarvestingMachineContext)
  const [season,setSeason] = useState(1)        


   useEffect(()=>{
    getHistoryData(season)
   },[season,year])

   return <View>
             <ScrollView>
                      <View>
                        {
                          (isHistoryExist)?<View
                             style={{paddingHorizontal:10,paddingTop:20}}
                          >
                          <View
                              style={{height:180,marginHorizontal:15, backgroundColor:'white',
                                       marginBottom:20, borderRadius:10,
                                       shadowColor:'#000',justifyContent:'space-between',
                                       shadowOffset:{height:2,width:2,},borderWidth:0.1,
                                       elevation:1,shadowRadius:0.5}}
                          >
                           <View
                                  style={{alignItems:'center',justifyContent:'space-around',alignItems:'center',flexDirection:'row',flex:1}}
                           >

                          <View style={{paddingHorizontal:30,justifyContent:'center',alignItems:'center'}}>
                              <Text
                                style={{fontWeight:'bold',fontSize:20,marginBottom:5}}
                              >
                                  {histAmount}₹
                              </Text>
                              <Text
                                style={{}}
                              >
                               {AMOUNT}
                              </Text>
                          </View>

                          </View>
                          <View
                             style={{height:60,flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingHorizontal:40}}
                          >

                            <TouchableOpacity
                              onPress={()=>setSeason(1)}
                            >
                                <View
                                  style={{height:30,width:width/6,backgroundColor: (season==1)?blue:'white',borderRadius:20,justifyContent:'center',alignItems:'center'}}
                                >
                                  <Text
                                     style={{fontSize:11,fontWeight:'bold',color: (season==1)?'white':'black'}}
                                  >
                                       {seasonName[0]}
                                  </Text>
                                  
                                </View>

                            </TouchableOpacity>
                           
                            <TouchableOpacity
                               onPress={()=>setSeason(2)}
                            >
                                <View
                                  style={{height:30,width:width/6,backgroundColor: (season==2)?blue:'white',borderRadius:20,justifyContent:'center',alignItems:'center'}}
                                >
                                  <Text
                                     style={{fontSize:11,fontWeight:'bold',color: (season==2)?'white':'black'}}
                                  >
                                      {seasonName[1]}
                                  </Text>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity
                               onPress={()=>setSeason(3)}
                            >
                                <View
                                  style={{height:30,width:width/6,backgroundColor: (season==3)?blue:'white',borderRadius:20,justifyContent:'center',alignItems:'center'}}
                                >
                                  <Text
                                     style={{fontSize:11,fontWeight:'bold',color: (season==3)?'white':'black'}}
                                  >
                                      {seasonName[2]}
                                  </Text>
                                  
                                </View>

                            </TouchableOpacity>
                           
  

                          </View>
                            <GestureRecognizer
                             
                              onSwipeLeft={async()=>{
                            
                                 setYear(year+1)
                              
                              }}
                              onSwipeRight={async()=>{
                                setYear(year-1)
                              }}
                            >
                            <View
                                style={{height:45,borderRadius:10,borderWidth:0.1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}
                            >
                              <TouchableOpacity
                                  style={{marginHorizontal:20}}
                                  onPress={async()=>{
                                    setYear(year-1)
                                  }}
                              >
                                <MaterialIcon
                               
                                  name="keyboard-arrow-left"
                                  size={25}
                                  color={"black"}
                                />
                              </TouchableOpacity>
                            
                             <Text style={{fontSize:18,fontWeight:'bold'}} >{year}</Text>
                              <TouchableOpacity
                                  style={{marginHorizontal:20}}
                                  onPress={()=>{
                                    setYear(year+1)
                                  }}
                              >
                                <MaterialIcon
                                 
                                  name ="keyboard-arrow-right"
                                  size={25}
                                  color={"black"}
                                />
                              </TouchableOpacity>
                            </View>
                            </GestureRecognizer>
                            </View>  
                            { (!isLoading)?<View
                                    style={{height:(height-400)/2,justifyContent:'flex-end',alignItems:'center'}}
                                  >
                                     <Text style={{fontSize:13,fontWeight:'bold',opacity:0.5}} >Loading...</Text>
                                  </View>
                            :
                            <FlatList
                              data={histories}
                              numColumns={2}
                              renderItem={({item,index})=>{
                              

                                return <View
                                  style={{ width:((width-20)/2),justifyContent:'center',alignItems:'center',overflow:'hidden'}}
                                >
                                  <TouchableWithoutFeedback
                                    onPress={()=>{
                                        navigate("HarvestingMachineHistory",{history:item})
                                    }}
                                  >
                                <View
                                   style={{height:140,borderWidth:0.1,marginVertical:10,borderRadius:10,backgroundColor:'white',justifyContent:'space-between',
                                            width:width/2.5,
                                            shadowColor:"#000",shadowOpacity:0.5,shadowRadius:2,elevation:1,
                                            shadowOffset:{height:3,width:0}}}
                                >
                                  <View style={{height:80,position:'absolute'}} >

                                      <View
                                        style={{flexDirection:'row',paddingHorizontal:20,paddingTop:20,alignItems:'center',justifyContent:'space-between'}}
                                      >

                                        <View
                                          style={{justifyContent:'center',alignItems:'center'}}
                                        >
                                            <Text
                                              style={{fontSize:27,fontWeight:'bold'}}
                                            >
                                                  {item.amount}₹
                                            </Text>
                                            <Text style={{fontSize:12,opacity:0.5}} >
                                                {AMOUNT}
                                            </Text>
                                        </View>
                                    
                                      
                                      </View>

                                    </View>

                                  <View>
  
                                </View>

                                <View
                                   style={{flex:1,flexDirection:'column',justifyContent:'space-between'}}
                                >
                                 <View
                                     style={{height:20,paddingRight:10,paddingTop:10,alignItems:'flex-end'}}
                                  >
                                   
                                  </View>
                                     <View
                                      style={{flexDirection:'row',paddingHorizontal:10,height:40,borderWidth:0.1,
                                           alignItems:'center',justifyContent:'space-between',backgroundColor:'white',borderRadius:10}}
                                   >
                                      <Text style={{fontSize:11,opacity:0.5,fontWeight:'bold'}} >
                                               {DATE} : {item.date}
                                        </Text>

                                        <MaterialIcon
                                           style={{opacity:0.5}}
                                          name={'arrow-forward'}
                                          size={18}
                                        />
         
                                   </View>

                                </View>
                                
                                </View>
                                </TouchableWithoutFeedback></View>
                              }}

                            />
                            }
                                  
                          </View>:<View></View>
                        }
                      </View>
             </ScrollView>
  </View>
}

export const Tab = ({item,isActiveExist})=>{
   const informtion = useRef()
   const refDeleteSheet = useRef()

   const [extend,setExtend] = useState(false)
   const getActiveData = useContext(HarvestingMachineContext)?.getActiveData
   const member = useContext(HarvestingMachineContext)?.member

 
 

   const onPress =async()=>{
    const totalHours=(oldTime = isActiveExist.totalHours)=>{
      return  (-parseFloat(item.hours.split(".")[1])+parseFloat(`${oldTime}`.split(".")[1]))<0?

               `${-parseFloat(item.hours.split(".")[0])+parseFloat(`${oldTime}`.split(".")[0])-1}`+
               `.${((-parseFloat(item.hours.split(".")[1])+parseFloat(`${oldTime}`.split(".")[1]))+60)}`:

               `${-parseFloat(item.hours.split(".")[0])+parseFloat(`${oldTime}`.split(".")[0])}`+
               `.${((-parseFloat(item.hours.split(".")[1])+parseFloat(`${oldTime}`.split(".")[1])))}`
    }
    var machineData =  (await database.ref(`HarvestingMachineSettings/Members/${item.machine.ownerId}/Active/Machine/${item.machine.id}`).once('value')).toJSON()

    if(!machineData.Active){
      Snackbar.show({
        text:FAILED,
        textColor:'red'
      })
      return
    }

    var activityData = (await database.
                 ref(`HarvestingMachineSettings/Members/${item.machine.ownerId}/Active/Machine/${item.machine.id}/Active/Activity/ID${member.personalInfo.number}${item.timeStamp}`)
                 .once('value')).toJSON()
    if(!activityData){
      Snackbar.show({
        text:FAILED,
        textColor:'red'
      })
     return
    }

  database
      .ref(`HarvestingMachineSettings/Members/${item.machine.ownerId}/Active/Machine/${item.machine.id}/Active/Activity/ID${member.personalInfo.number}${item.timeStamp}`)
      .remove()




    machineData = machineData.Active
    refDeleteSheet.current.close()


    await database.ref(`HarvestingMachineSettings/Members/${item.machine.ownerId}/Active/Machine/${item.machine.id}`).child("Active").update({
     totalHours:(totalHours(machineData.totalHours).split(".")[1].length==2)?totalHours(machineData.totalHours):totalHours(machineData.totalHours)+"0",
     amount:machineData.amount-item.actualAmount,
     totalAcer:machineData.totalAcer-item.acer
    })


     await database.ref("Members/"+`ID${member.personalInfo.number}/HarvestingMachine`).child("Active").update({
       totalHours:(totalHours().split(".")[1].length==2)?totalHours():totalHours()+"0",
       totalAcer:isActiveExist.totalAcer-item.acer,
       actualAmount:isActiveExist.actualAmount-item.actualAmount,
       amount:isActiveExist.amount-item.amount,
     })

    


     await database.ref("Members/"+`ID${member.personalInfo.number}/HarvestingMachine/Active`).child("Activity").child(item.id).remove()

      setTimeout(()=>{
      Snackbar.show({
        text:SUCESSFULLYDONE,
        textColor:'white'
      })
      },1000)
      getActiveData()
    
    }

    return<View
      style={{backgroundColor:'white'}}
    >
       <TouchableOpacity
       onPress={()=>{
         setExtend(!extend)
        //  informtion.current.open()
        }}
       onLongPress={(isActiveExist)?()=>{
           Vibration.vibrate(50)
           refDeleteSheet.current.open()
       }:()=>{}}
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
             <Image
                      tintColor={'black'}
                      style={{height:15,width:30,opacity:0.9}}
                      source={require('../Assets/Images/HarvestingMachine.png')}
              />

            <Text
              style={{fontSize:13,fontWeight:'bold',marginLeft:5}}
            >{ /* {item.machine.machineName} -  */MACHINETYPES[item.machine.type]}</Text>

           </View>

           <View
              style={{borderWidth:1,padding:5,borderRadius:20,paddingHorizontal:10,opacity:0.5,
                     justifyContent:'space-around',
                     flexDirection:'row',alignItems:'center'}}
              >
           
            <Text
              style={{fontSize:13,fontWeight:'bold',marginLeft:5}}
            >₹ {(item.machine.type==0)?isActiveExist.tirePrice:isActiveExist.beltPrice}</Text>

           </View>

          
         </View>
    }
  <InformtionSheet informtionSheet={informtion} data={item}  />
  <DeleteSheet  refDeleteSheet={refDeleteSheet} 
                isActiveExist={{amount:item.amount}} 
                onPress={onPress}
                         />
  
 </View>
}

export const InformtionSheet = ({informtionSheet,data})=>{
  return <RBSheet
      ref = {informtionSheet}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={170}
      duration={270}
      customStyles={{
        wrapper: {
          backgroundColor: "transparent",
        },
        container:{
            backgroundColor: "transparent",
            borderTopLeftRadius:20,borderTopRightRadius:20,backgroundColor:'white', shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.7,
            shadowRadius: 3,
            elevation: 3,
        },
        draggableIcon: {
          backgroundColor: "#000"
        }
      }
  }
  >
       
    <View
       style={{flex:1,flexDirection:'row',justifyContent:'space-around',alignItems:'center',alignItems:'center',justifyContent:'space-between',}}
    >
      
      <View
         style={{flex:1,width,}}
      >
        <View
          style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}
        >
            <View
              style={{alignItems:'center',justifyContent:'center',marginTop:10,width:width/3}}
            >

                  <View
                  
                    source={require("../Assets/Images/tractor.png")}
                    style={{height:75,width:75,marginBottom:16,borderRadius:50,backgroundColor:'#29b6f6',
                        justifyContent:'center',alignItems:'center',
                           elevation:3,shadowColor:'#000',shadowOffset:{height:2}}}
                  >
                      <MaterialIcon
                      name={'person'}
                      size={35}
                      color={'white'}
                    />

                  </View>
                <Text
                  style={{marginHorizontal:20,fontSize:16,fontWeight:'bold'}}
                >{data.machine}</Text>
            </View> 
            <View
              style={{alignItems:'center',justifyContent:'center',marginTop:10,width:width/3}}
            >
                   <View
                  
                
                  style={{height:75,width:75,marginBottom:16,borderRadius:50,backgroundColor:'#ff9800',
                          justifyContent:'center',alignItems:'center',
                          elevation:3,shadowColor:'#000',shadowOffset:{height:2}}}
                >
                   <MaterialIcon
                     name={'attach-money'}
                     size={35}
                     color={'white'}
                   />
               

                </View>
                <Text
                  style={{marginHorizontal:20,fontSize:16,fontWeight:'bold',marginRight:30}}
                > ₹ {data.amount}</Text>
            </View> 
            <View
              style={{alignItems:'center',justifyContent:'center',marginTop:10,width:width/3}}
            >
                  <View
                  
                 
                  style={{height:75,width:75,marginBottom:16,borderRadius:50,backgroundColor:'#ffd600',
                  justifyContent:'center',alignItems:'center',
                  elevation:3,shadowColor:'#000',shadowOffset:{height:2}}}
                 >
                   <MaterialIcon
                     name={'location-on'}
                     size={35}
                     color={'white'}
                   />
                 </View>
                <Text
                  style={{marginHorizontal:20,fontSize:16,fontWeight:'bold'}}
                >{data.place}</Text>
            </View>  

        </View>

      </View>
     


    </View>

  </RBSheet>
}

const AppBar=()=>{
    const {goBack, isActiveExist ,AddTransaction} = useContext(HarvestingMachineContext)
    const complete = useRef()
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
                  {HARVESTINGMACHINE}
          </Text>
        </View>  
        <View 
          style={{flexDirection:'row'}}
        > 
          {
              (!isActiveExist)?<View/>:
              <TouchableOpacity
              onPress={()=>{complete.current.open()}}
            >
              <Image
                 tintColor={'grey'}
                 style={{height:25,width:25,backgroungColor:'grey',marginHorizontal:10,marginTop:2}}
                 source={require('../Assets/Images/appBarReturn.webp')}
              />
            </TouchableOpacity>
            }
           {
            (isActiveExist==null)?<View/>:<TouchableOpacity
                onPress={()=>{AddTransaction.current.open()}}
                >
                <Image
                      tintColor={'grey'}
                      style={{height:25,width:39,backgroungColor:'grey',marginHorizontal:8,marginTop:1}}
                      source={require('../Assets/Images/HarvestingMachine.png')}
              />
            </TouchableOpacity>
            }        
        </View>
        <CompleteSheet complete={complete} />

    </View>
}



const Section = ()=>{

    const {
        module,setModule,isActiveExist,
        setIsActiveExist,getActiveData,member
    } = useContext(HarvestingMachineContext)
   

    const onPress = async()=>{
        refDeleteSheet.current.close()
       
          const isExist = (await database.ref("Members/").child(member.key).child("HarvestingMachine").child("Active/Activity").once('value')).toJSON()

          if(isExist){
            Snackbar.show({
              text:FAILED,
              textColor:'red'
            })
            return
          }

          
          setTimeout(()=>{
            getActiveData()
             Snackbar.show({
               duration:Snackbar.LENGTH_LONG,
               text:SUCESSFULLYDONE,
               textColor:'white'
             })
         },1000)

      
          await database.ref("Members/").child(member.key).child("HarvestingMachine").child("Active").remove()
    }
    
    const refDeleteSheet = useRef()
    return  <View
                style={{height:40,paddingHorizontal:20,flexDirection:'row',justifyContent:'space-between',marginTop:20,marginBottom:10}}
            >   
                <TouchableOpacity
                   
                    onPress={()=>setModule(1)}
                    onLongPress={()=>{
                      if(isActiveExist){
                          Vibration.vibrate(50,true)
                         refDeleteSheet.current.open()
                        }
                    }}
                >
                    {
                        (module==1)? <View
                                style={{backgroundColor:blue,...style.moduleBar,flexDirection:'row',alignItems:'center',justifyContent:'center'}}
                            >
                                <Text style={{fontSize:12,fontWeight:'bold',color:'white',position:'absolute'}} >{ACTIVE}</Text>
                                    <View
                                    style={{alignItems:'flex-end',flex:1,marginRight:25}}
                                    >
                                </View>
                                
                            </View>:<View
                                style={{...style.moduleBar ,flexDirection:'row',alignItems:'center',justifyContent:'center' }}
                            >
                                <Text style={{fontSize:12,fontWeight:'bold',color:'grey',position:'absolute'}} > {ACTIVE} </Text>
                                <View
                                style={{alignItems:'flex-end',flex:1,marginRight:25}}
                                >
                               
                                </View>
                                    
                            </View>
                    }
                </TouchableOpacity>
                <TouchableOpacity
                 onPress={()=>setModule(2)}
                >
                    {
                        (module==2)? <View
                            style={{backgroundColor:blue,...style.moduleBar}}
                            >
                                <Text style={{fontSize:12,fontWeight:'bold',color:'white'}} >{HISTORY}</Text>
                            </View>:<View
                                style={style.moduleBar}
                            >
                                <Text style={{fontSize:12,fontWeight:'bold',color:'grey'}} > {HISTORY} </Text>
                            </View>
                    }
                </TouchableOpacity>
                {
                <DeleteSheet refDeleteSheet={refDeleteSheet} 
                             isActiveExist={isActiveExist} 
                             onPress={onPress}
                         />}
            </View>
}


const CompleteSheet =({complete})=>{

  const {isActiveExist,member,getActiveData,data} = useContext(HarvestingMachineContext)
  const [date,setDate] = useState(`${new Date().getDate()}-0${new Date().getMonth()+1}-${new Date().getFullYear()}`)

  return <RBSheet             
  ref={complete}
  height={280}
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

  


 {(!isActiveExist)?<View/>:<View>
    <View
      style={{justfyContent:'center',alignItems:'center',marginTop:40}}
    >
        <Text
            style={{fontSize:35,color:'black',fontWeight:'bold'}}
        >
            {parseInt((isActiveExist.amount))}₹
        </Text>
        <Text
            style={{marginTop:8,fontSize:17}}
        >
            {AMOUNT}
        </Text>
    </View>

    <TouchableWithoutFeedback
     
      onPress={async()=>{
         complete.current.close()
         await database.ref(`Members/ID${member.personalInfo.number}/HarvestingMachine`).child("Active").remove()
         await database.ref(`Members/ID${member.personalInfo.number}/HarvestingMachine`).child("History").push(
           {...isActiveExist,finishDate:date}
         )
        getActiveData()
         setTimeout(()=>{
             Snackbar.show({
               text:SUCESSFULLYDONE,
               textColor:'white'
             })
         },1000)
        
      }}
    >
    <View
              style={{...style.textInput,marginTop:70,
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
                {PAID}
              </Text>
      </View>
    </TouchableWithoutFeedback>
  </View>
  }
</RBSheet>
}

const DeleteSheet=({refDeleteSheet,isActiveExist,onPress})=>{
  return <RBSheet             
  ref={refDeleteSheet}
  height={280}
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

  


{(isActiveExist)?<View>
    <View
      style={{justfyContent:'center',alignItems:'center',marginTop:40}}
    >
        <Text
            style={{fontSize:35,color:'black',fontWeight:'bold'}}
        >
            {isActiveExist.amount}₹
        </Text>
        <Text
            style={{marginTop:8,fontSize:17}}
        >
            {AMOUNT}
        </Text>
    </View>

    <TouchableWithoutFeedback
     
       onPress={()=>onPress()}
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
  </View>:<View/>

}

</RBSheet>
}


const AddTransactionSheet = ()=>{

    const [date,setDate] = useState(`${new Date().getDate()}-0${new Date().getMonth()+1}-${new Date().getFullYear()}`)

    const {isActiveExist,member,AddTransaction,getActiveData,tirePrice,
           beltPrice,season,beltPriceActual,tirePriceActual,navigate} = useContext(HarvestingMachineContext)

    const [place,setPlace] = useState("")
    const [hours,setHours] = useState("")
    const [machine,setMachine] = useState("")
    const [acer,setAcer] = useState("")

    console.log(tirePrice,beltPrice)


    return <RBSheet
     ref={AddTransaction}
     closeOnDragDown={true}
     closeOnPressMask={true}
     height={470}
     duration={280}
     customStyles={{
       wrapper: {
         backgroundColor: "transparent",
       },
       container:{
         backgroundColor: "transparent",
         borderTopLeftRadius:20,borderTopRightRadius:20,backgroundColor:'white', shadowColor: '#000',
                 shadowOffset: { width: 0, height: 5 },
                 shadowOpacity: 0.7,
                 shadowRadius: 3,
                 elevation: 3,
       },
       draggableIcon: {
         backgroundColor: "#000"
       }
     }
   }
   >
   <View style={{flex:1,borderTopLeftRadius:20,borderTopRightRadius:20,backgroundColor:'white',
               }} >

           
             <View
               style={{...style.textInput}}
             >
                   <TextInput
                      value={date}
                      keyboardType="number-pad"
                      onChangeText={(text)=>setDate(text)}
                      style={{flex:1,marginLeft:20}}
                       placeholder={DATEOFDRIVEN}
                      returnKeyType="done"
                   />
             </View>
             <TouchableWithoutFeedback
                onPress={()=>{
                    AddTransaction.current.close()
                    setTimeout(()=>{

                      navigate("HarvestingMachineSelector",{season,callBack:(machine)=>{
                        setMachine(machine)
                        setTimeout(()=>{
                          AddTransaction.current.open()
                        },500)
                      }})
                    },500)
                 
                }}
             >
             <View
               style={{...style.textInput,marginTop:20}}
             >
                   <TextInput
                      editable={false}
                      returnKeyType="done"
                      value={machine.machineName}
                      onChangeText={(text)=>setMachine(text)}
                      style={{flex:1,marginLeft:20}}
                       placeholder={SELECTMACHINE}
                   />
             </View>
             </TouchableWithoutFeedback>
             <View
               style={{...style.textInput,marginTop:20}}
             >
                   <TextInput
                  
                   returnKeyType="done"
                   value={place}
                   onChangeText={(text)=>setPlace(text)}
                   style={{flex:1,marginLeft:20}}
                   placeholder={PLACE +" (" +seasonName[season-1]+")"}
                   />
             </View>
             <View
               style={{...style.textInput,marginTop:20}}
             >
                   <TextInput
                  
                   returnKeyType="done"
                   value={acer}
                   keyboardType="number-pad"
                   onChangeText={(text)=>setAcer(text)}
                   style={{flex:1,marginLeft:20}}
                   placeholder={ACER}
                   />
             </View>
            
             <View
               style={{...style.textInput,marginTop:20}}
             >
                   <TextInput
                     returnKeyType="done"
                     keyboardType="number-pad"
                     value={hours}
                     onChangeText={(text)=>setHours(text)}
                     style={{flex:1,marginLeft:20}}
                     placeholder={OVERALLTIME+" HH.MM"}
                   />
             </View>

             <TouchableWithoutFeedback
                
                onPress={async()=>{
                  var timeStamp = +new Date()

                  const totalHours=(oldTotalHour=isActiveExist.totalHours)=>{
                    return  (parseFloat(hours.split(".")[1])+parseFloat(`${oldTotalHour}`.split(".")[1]))>=60?

                             `${parseFloat(hours.split(".")[0])+parseFloat(`${oldTotalHour}`.split(".")[0])+1}`+
                             `.${((parseFloat(hours.split(".")[1])+parseFloat(`${oldTotalHour}`.split(".")[1]))-60)}`:

                             `${parseFloat(hours.split(".")[0])+parseFloat(`${oldTotalHour}`.split(".")[0])}`+
                             `.${((parseFloat(hours.split(".")[1])+parseFloat(`${oldTotalHour}`.split(".")[1])))}`
                  }


                  if(isActiveExist){
                       if(!parseFloat(hours) ||  hours.split(".")[0].length!=2 ||  hours.split(".")[1].length!=2 || !place || !machine || !date || !acer ){
                         Snackbar.show({
                           text:INVALID,
                           textColor:'red'
                         })
                         return
                       }

                       if(!hours.includes(".") || parseInt(hours.split(".")[1])>=60){
                             Snackbar.show({
                               text:INVALID,
                               textColor:'red'
                             })
                             return
                       }

                       



                       AddTransaction.current.close()
                       await database.ref("Members/"+`ID${member.personalInfo.number}/HarvestingMachine`).child("Active").update({
                        
                         totalHours: (totalHours().split(".")[1].length==2)?totalHours():totalHours()+"0",

                         actualAmount:(machine.type==0)?isActiveExist.actualAmount+parseInt((parseFloat(hours.split(".")[0])*tirePriceActual)+(parseFloat(hours.split(".")[1])/60*tirePriceActual)):
                                      isActiveExist.actualAmountt+parseInt((parseFloat(hours.split(".")[0])*beltPriceActual)+(parseFloat(hours.split(".")[1])/60*beltPriceActual)),

                         totalAcer:isActiveExist.totalAcer+parseFloat(acer),
                         amount: (machine.type==0)?isActiveExist.amount+parseInt((parseFloat(hours.split(".")[0])*tirePrice)+(parseFloat(hours.split(".")[1])/60*tirePrice)):
                                  isActiveExist.amount+parseInt((parseFloat(hours.split(".")[0])*beltPrice)+(parseFloat(hours.split(".")[1])/60*beltPrice)),
                       })


                       await database.ref("Members/"+`ID${member.personalInfo.number}/HarvestingMachine/Active`).child("Activity").push(
                         { 
                           date,machine,place,hours,timeStamp,acer:parseFloat(acer),
                           amount: (machine.type==0)?parseInt((parseInt(hours.split(".")[0])*tirePrice)+(parseFloat(hours.split(".")[1])/60*tirePrice))
                                   :parseInt((parseInt(hours.split(".")[0])*beltPrice)+(parseFloat(hours.split(".")[1])/60*beltPrice)),  

                           actualAmount:(machine.type==0)?parseInt((parseInt(hours.split(".")[0])*tirePriceActual)+(parseFloat(hours.split(".")[1])/60*tirePriceActual))
                           :parseInt((parseInt(hours.split(".")[0])*beltPriceActual)+(parseFloat(hours.split(".")[1])/60*beltPriceActual)),   
                         }
                       )


                  }else{
                   if(!parseFloat(hours) || hours.split(".")[0].length!=2 ||  hours.split(".")[1].length!=2 ||  !place || !machine || !date || !acer ){
                       Snackbar.show({
                         text:INVALID,
                         textColor:'red'
                       })
                       return
                     }
                     if(!hours.includes(".") || parseInt(hours.split(".")[1])>=60){
                      Snackbar.show({
                        text:INVALID,
                        textColor:'red'
                      })
                      return
                     }
                     AddTransaction.current.close()

                     await database.ref("Members/"+`ID${member.personalInfo.number}`).child("HarvestingMachine").update({
                       Active:{
                         totalHours:hours,
                         hourPrice:(machine.type==0)?tirePrice:beltPrice,
                         season,
                         date,
                         tirePrice:parseFloat(tirePrice),beltPrice:parseFloat(beltPrice),
                         tirePriceActual:parseFloat(tirePriceActual),beltPriceActual:parseFloat(beltPriceActual),
                         totalAcer:parseFloat(acer),
                         timeStamp,
                         actualAmount:(machine.type==0)?parseInt((parseFloat(hours.split(".")[0])*tirePriceActual)+(parseFloat(hours.split(".")[1])/60*tirePriceActual)):
                                       parseInt((parseFloat(hours.split(".")[0])*beltPriceActual)+(parseFloat(hours.split(".")[1])/60*beltPriceActual)),

                         amount: (machine.type==0)?parseInt((parseFloat(hours.split(".")[0])*tirePrice)+(parseFloat(hours.split(".")[1])/60*tirePrice)):
                                       parseInt((parseFloat(hours.split(".")[0])*beltPrice)+(parseFloat(hours.split(".")[1])/60*beltPrice)),
                         Activity:{Initial:{ date,machine,hours,timeStamp,place,acer:parseFloat(acer),
                          amount: (machine.type==0)?parseInt((parseInt(hours.split(".")[0])*tirePrice)+(parseFloat(hours.split(".")[1])/60*tirePrice))
                                  :parseInt((parseInt(hours.split(".")[0])*beltPrice)+(parseFloat(hours.split(".")[1])/60*beltPrice)),     
                          actualAmount:(machine.type==0)?parseInt((parseFloat(hours.split(".")[0])*tirePriceActual)+(parseFloat(hours.split(".")[1])/60*tirePriceActual)):
                                       parseInt((parseFloat(hours.split(".")[0])*beltPriceActual)+(parseFloat(hours.split(".")[1])/60*beltPriceActual)),
                         }}
                       }
                     })
                     
                  } 

                  if(machine.Active){
                    console.log("\n\nIts Me\n\n")
                    await database.ref(`HarvestingMachineSettings/Members/${machine.ownerId}/Active/Machine/${machine.id}`).child("Active").update({

                      totalHours: (totalHours(machine.Active.totalHours).split(".")[1].length==2)?totalHours(machine.Active.totalHours):totalHours(machine.Active.totalHours)+"0",

                      totalAcer:machine.Active.totalAcer+parseFloat(acer),
                      amount: (machine.type==0)?machine.Active.amount+parseInt((parseFloat(hours.split(".")[0])*tirePrice)+(parseFloat(hours.split(".")[1])/60*tirePrice)):
                                                machine.Active.amount+parseInt((parseFloat(hours.split(".")[0])*beltPrice)+(parseFloat(hours.split(".")[1])/60*beltPrice)),
                    })

                    await database.ref(`HarvestingMachineSettings/Members/${machine.ownerId}/Active/Machine/${machine.id}/Active`)
                                  .child("Activity/ID"+`${member.personalInfo.number}${timeStamp}`).set(
                            { 
                              date,member:member.personalInfo,place,hours,timeStamp,acer:parseFloat(acer),
                              amount:(machine.type==0)?parseInt((parseInt(hours.split(".")[0])*tirePriceActual)+(parseFloat(hours.split(".")[1])/60*tirePriceActual))
                              :parseInt((parseInt(hours.split(".")[0])*beltPriceActual)+(parseFloat(hours.split(".")[1])/60*beltPriceActual)),   
                            }
                    )

                    machine.Active={
                      totalHours: (totalHours(machine.Active.totalHours).split(".")[1].length==2)?totalHours(machine.Active.totalHours):totalHours(machine.Active.totalHours)+"0",
                      totalAcer:machine.Active.totalAcer+parseFloat(acer),
                      amount: (machine.type==0)?machine.Active.amount+parseInt((parseFloat(hours.split(".")[0])*tirePrice)+(parseFloat(hours.split(".")[1])/60*tirePrice)):
                                                machine.Active.amount+parseInt((parseFloat(hours.split(".")[0])*beltPrice)+(parseFloat(hours.split(".")[1])/60*beltPrice)),
                    }

                  
                  }else{
                 

                    await database.ref(`HarvestingMachineSettings/Members/${machine.ownerId}/Active/Machine/${machine.id}`).child("Active").update({
                  
                      totalHours:hours,date,
                      totalAcer:parseFloat(acer),
                      amount: (machine.type==0)?parseInt((parseFloat(hours.split(".")[0])*tirePriceActual)+(parseFloat(hours.split(".")[1])/60*tirePriceActual)):
                                                parseInt((parseFloat(hours.split(".")[0])*beltPriceActual)+(parseFloat(hours.split(".")[1])/60*beltPriceActual)),
                    })

                    await database.ref(`HarvestingMachineSettings/Members/${machine.ownerId}/Active/Machine/${machine.id}/Active`) 
                       .child("Activity/ID"+`${member.personalInfo.number}${timeStamp}`).set(
                      { 
                        date,member:member.personalInfo,place,hours,timeStamp,acer:parseFloat(acer),
                        amount:(machine.type==0)?parseInt((parseInt(hours.split(".")[0])*tirePriceActual)+(parseFloat(hours.split(".")[1])/60*tirePriceActual))
                                                 :parseInt((parseInt(hours.split(".")[0])*beltPriceActual)+(parseFloat(hours.split(".")[1])/60*beltPriceActual)),   
                      }
                    )

                    machine.Active={
                      totalHours:hours,date,
                      totalAcer:parseFloat(acer),
                      amount: (machine.type==0)?parseInt((parseFloat(hours.split(".")[0])*tirePriceActual)+(parseFloat(hours.split(".")[1])/60*tirePriceActual)):
                                                parseInt((parseFloat(hours.split(".")[0])*beltPriceActual)+(parseFloat(hours.split(".")[1])/60*beltPriceActual)),
                    }

                  

                  }

                  request(PERMISSIONS.ANDROID.SEND_SMS).then((result) => {
                    var amount = (machine.type==0)?parseInt((parseInt(hours.split(".")[0])*tirePriceActual)+(parseFloat(hours.split(".")[1])/60*tirePriceActual))
                    :parseInt((parseInt(hours.split(".")[0])*beltPriceActual)+(parseFloat(hours.split(".")[1])/60*beltPriceActual))

                    if(result==="granted"){
                        NativeModules.SendSms.send(
                          `${OVERALLTIME} = ${hours} , ${AMOUNT} = ${amount} , ${PLACE} = ${place} , ${PERSON} = ${member.personalInfo.name}`,
                          machine.driverNumber)
                    }
                  });



                  setTimeout(()=>{
                   Snackbar.show({
                     text:SUCESSFULLYDONE,
                     textColor:'white'
                   })
                  },1000)
                  getActiveData()
                
                 }}
             >

               <View
                 style={{...style.textInput,marginTop:20,
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
   </RBSheet>
}



const style = StyleSheet.create({
    textInput:{height:45,borderRadius:20,backgroundColor:Colors.searchBarColor,margin:10,flexDirection:'row',alignItems:'center' },
    moduleBar : {width:(width-60)/2,height:40,borderRadius:20,borderWidth:0.1,justifyContent:'center',alignItems:'center'},
    seasonButton : {borderRadius:20,justifyContent:'center',height:43,alignItems:'center',shadowColor:'#000',width:width/3.5,marginVertical:20,backgroundColor:blue}
})



