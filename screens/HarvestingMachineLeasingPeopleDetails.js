import React, { createContext ,useContext, useState, useReducer, useRef, useEffect} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Linking,
         ScrollView, TextInput, TouchableWithoutFeedback, FlatList, Vibration } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {blue} from '../Assets/color'
import * as Colors from '../Assets/color' 
import RBSheet from 'react-native-raw-bottom-sheet'
import Snackbar from 'react-native-snackbar'
import {database} from '../database/firebase'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {NativeModules} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


const {width,height} = Dimensions.get('window')
const DETAILS = "விவரங்கள்"
const HISTORY = "வரலாறு"
const ACTIVE = "செயலில்"
const seasonName = ["சம்பா","குருவாய்","பருவம்"]
const SEASON = "பருவம்"
const AMOUNT = "தொகை"
const INVALID = "தவறான சான்றுகள்"
const SUCESSFULLYDONE = "வெற்றிகரமாக முடிந்தது"
const DATE = "தேதி"
const FUELCOAST = "பிற செலவு"
const ACER = "ஏக்கர்"
const TIME = "நேரம்"
const SONOF = "மகன்"
const HARVESTINGMACHINE = "இயந்திரங்கள்"
const MACHINENUMBER = "இயந்திரத்தின் எண்"
const DONE = 'முடிந்தது'
const TIRE = "சக்கரம்"
const BELT = "பெல்ட்"
const MACHINETYPES = [TIRE,BELT]
const NODATAEXIST = 'தரவு எதுவும் இல்லை'
const PAID = "செலுத்தப்பட்டது"
const DELETE="அகற்று"
const OWNER = "உரிமையாளர்"
const DRIVERNUMBER = "டிரைவர் தொலைபேசி எண்"
const DRIVERNAME = "டிரைவர் பெயர்"

const ERROR = "தோல்வி"





const HarvestingMachineLeasingPeopleDetailsContext = createContext()

const HarvestingMachineLeasingPeopleDetails = (props) => {
    const {settings} = props.navigation.state.params
    const goBack =()=>{
        props.navigation.goBack()
    }

    const navigate = (page,data)=>{
      props.navigation.push(page,data)
    }

    const [module,setModule] = useState(1)
    const [isActiveExist,setIsActiveExist] = useState(null)
    const [memberDetails,setMemberDetails] = useState(props.navigation.state.params.member)
    const [amount,setAmount] = useState(0)
    const [petrolAmount,setPetrolAmount] = useState(0)
    const [date,setDate] = useState(`${new Date().getDate()}-0${new Date().getMonth()+1}-${new Date().getFullYear()}`)
    const [season,setSeason] = useState(props.navigation.state.params.season)
    const [totalTime,setTotalTime] = useState("00.00")
    const [totalAcer,setTotalAcer] = useState(0)
    const [machines,setMachines] = useState([])
    const [isLoaded,setIsLoaded] = useState(false)
    const [histories,setHisories] = useState([])
    const [isHistoryLoaded,setIsHistoryLoaded] = useState(false)
    const [isHistoryExist,setIsHistoryExist] = useState(null)
    const [historyAmount,setHisoryAmount] = useState(0)

    const callBack = props.navigation.state.params.callBack

  


    const totalHours=(oldTotalHour,hours)=>{
      return  (parseFloat(hours.split(".")[1])+parseFloat(`${oldTotalHour}`.split(".")[1]))>=60?
               `${parseFloat(hours.split(".")[0])+parseFloat(`${oldTotalHour}`.split(".")[0])+1}`+
               `.${((parseFloat(hours.split(".")[1])+parseFloat(`${oldTotalHour}`.split(".")[1]))-60)}`:
               `${parseFloat(hours.split(".")[0])+parseFloat(`${oldTotalHour}`.split(".")[0])}`+
               `.${((parseFloat(hours.split(".")[1])+parseFloat(`${oldTotalHour}`.split(".")[1])))}`
     }


    const getUpdate=async(updatedMember)=>{
      setMemberDetails(updatedMember)
      callBack()
    } 

    const getMachines=async()=>{
      var tTime = "00.00"
      var tAcer = 0
      var tAmount = 0
      var tPetrolAmount = 0

      const ActiveData = (await database.ref("HarvestingMachineSettings/Members/ID"+`${memberDetails.personalInfo.number}/Active`).once('value')).toJSON()
      const Machines = (ActiveData)?ActiveData.Machine:{}
      var MachineTemp = []
      for(var i in Machines){
         MachineTemp.push({
             ...Machines[i],
             id:i
         })
         if(Machines[i].Active){
           const data = Machines[i].Active;
           tAcer=(tAcer+data.totalAcer)
           tTime = (totalHours(tTime,data.totalHours))
           tAmount = (tAmount+data.amount)
           tPetrolAmount = (data.petrolAmount)?tPetrolAmount+data.petrolAmount:tPetrolAmount
         }
      }

      setMachines(MachineTemp)
      setIsActiveExist(ActiveData)
      setTotalAcer(tAcer)
      setTotalTime(tTime)
      setAmount(tAmount)
      setDate((ActiveData)?ActiveData.date:date)
      setPetrolAmount(tPetrolAmount)
      setSeason((ActiveData)?ActiveData.season:season)
      setIsLoaded(true)
    }

    const getHistoryData = async(year=(new Date()).getFullYear(),season=1)=>{
      setIsHistoryLoaded(false)
      const HistoryData = (await database.ref("HarvestingMachineSettings/Members/ID"+`${memberDetails.personalInfo.number}/History`).once('value')).toJSON()
      console.log(HistoryData)
      setIsHistoryExist(HistoryData)
      const HistoryTemp = []
      var HistAmount = 0;
      if(HistoryData){
         
          for(var i in HistoryData){
              console.log(HistoryData[i].date,'\n')
               if(HistoryData[i].date.endsWith(year) && HistoryData[i].season==season){
                     HistAmount+=HistoryData[i].amount
                     HistoryTemp.push(HistoryData[i])
               }
          }
      }
      setHisories(HistoryTemp)
      setHisoryAmount(HistAmount)
      setIsHistoryLoaded(true)
    }

    useEffect(()=>{
       getMachines()
       getHistoryData()
    },[])

    return (
        <HarvestingMachineLeasingPeopleDetailsContext.Provider
          value={{goBack,module,setModule,isActiveExist,memberDetails,callBack,navigate,histories,isHistoryLoaded,getUpdate,
                  amount,setAmount,petrolAmount,setPetrolAmount,date,setDate,season,getHistoryData,isHistoryExist,settings,
                  totalAcer,setTotalTime,totalTime,setTotalAcer,machines,getMachines,setIsLoaded,setIsHistoryExist,isLoaded,
                  historyAmount,
                }}
        >
           <View
             style={{flex:1,backgroundColor:'white'}}
           >
                <AppBar/>
                <ScrollView>
                <Section/>
                { (module==1)?
                  (isLoaded)?<ScrollView>
                    <OverAll/>
                    <ContactInfo/>
                    <Machines/>
                    <CardDetails/>
                    </ScrollView>:<View
                        style={{justifyContent:'center',alignItems:'center',height:(height/2)-100,justifyContent:'flex-end'}}
                    >
                            <Text style={{fontSize:13,fontWeight:'bold',opacity:0.5}} >Loading...</Text>
                    </View>
                  
                  :<History/>
                
                }</ScrollView>
               
           </View>
        </HarvestingMachineLeasingPeopleDetailsContext.Provider>
      
    )
}


const AppBar=()=>{
    const {goBack,isActiveExist,module,amount,getUpdate,isLoaded,navigate,
         petrolAmount,totalTime,memberDetails} = useContext(HarvestingMachineLeasingPeopleDetailsContext)
    const refReturnSheet = useRef()
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
                  {DETAILS}
          </Text>
        </View> 
        <View 
          style={{flexDirection:'row',alignItems:'center',}}
        > 
         {   
        (isActiveExist && module==1 && amount!=0)?<TouchableOpacity
                      onPress={
                        ()=>{
                          request(PERMISSIONS.ANDROID.SEND_SMS).then((result) => {
                            if(result==="granted"){
                              NativeModules.SendSms.send(
                                `${TIME} = ${totalTime} , ${AMOUNT} = ${amount} , ${FUELCOAST} = ${petrolAmount}`,
                                memberDetails.personalInfo.number)

                              Snackbar.show(
                                {
                                  text:SUCESSFULLYDONE,
                                  textColor:'green'
                                }
                              )  
                            }
                          })
                        }
                      }
                    >
                    <MaterialIcon
                      name={'sms'}
                      color={'grey'}
                      style={{marginTop:7,marginRight:10}}
                      size={23}
                    />

          </TouchableOpacity>:<View/>
          }
         {   
          (isActiveExist && module==1 && amount!=0)?<TouchableOpacity
                        onPress={()=>{refReturnSheet.current.open()}}
                      >
                        <Image
                          tintColor={'grey'}
                          style={{height:25,width:25,backgroungColor:'grey',marginHorizontal:10}}
                          source={require('../Assets/Images/appBarReturn.webp')}
                        />

            </TouchableOpacity>:<View/>
          }
         {  (isLoaded && module==1) &&  <TouchableOpacity
                   //   onPress={()=>refAddMembers.current.open()}   
                   onPress={()=>{navigate('HarvestingMachineAddMembers',{member:memberDetails,callBack:getUpdate,isDealer:true,addPeople:()=>{}})}}
                >
                    <FontAwesome5
                        style={{paddingRight:5,marginLeft:10,marginTop:1}}
                        name="user-edit"
                        size={20}
                        color={"grey"}
                    />
            </TouchableOpacity> 
            }
      
        </View>
         <CompleteSheet complete={refReturnSheet}/>
    </View>
}

const Section = ()=>{
    const {module,setModule} = useContext(HarvestingMachineLeasingPeopleDetailsContext)
  

    // const onPress = async()=>{
    //     refDeleteSheet.current.close()
    //       setTimeout(()=>{
    //           getActiveData()
    //           Snackbar.show({
    //             duration:Snackbar.LENGTH_LONG,
    //             text:SUCESSFULLYDONE,
    //             textColor:'white'
    //           })
    //       },1000)
    //       await database.ref("Members/").child(member.key).child("Tractor").child("Active").remove()
    // }
    
    // const refDeleteSheet = useRef()
    return  <View
                style={{height:40,paddingHorizontal:20,flexDirection:'row',justifyContent:'space-between',marginTop:20,marginBottom:10}}
            >   
                <TouchableOpacity
                   
                    onPress={()=>setModule(1)}
                    onLongPress={()=>{
                    //   if(isActiveExist){
                    //       Vibration.vibrate(50,true)
                    //      refDeleteSheet.current.open()
                    //     }
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
                {/* {
                <DeleteSheet refDeleteSheet={refDeleteSheet} 
                             isActiveExist={isActiveExist} 
                             onPress={onPress}
                         />} */}
            </View>
}

export const OverAll = ()=>{

    var {amount,totalAcer,totalTime,season,petrolAmount,date} = useContext(HarvestingMachineLeasingPeopleDetailsContext)
    return <View>
      <View>
               <View
                 style={{height:170,width:width,justifyContent:'center',alignItems:'center',marginBottom:20}}
               >
                       <View
                          style={{height:125,width:125,borderRadius:200,justifyContent:'center',alignItems:'center',borderWidth:0.5,marginTop:20}}
                        >
                            <Text style={{color:"black",fontSize:25,fontWeight:'bold'}} >
                              {amount}₹
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
                         {totalAcer}
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
                          {totalTime}
                       </Text>
                       
                       <Text style={{fontSize:12,color:'green',fontWeight:'bold'}}>
                       {TIME}
  
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
                           {seasonName[season-1]}
                        </Text>
                          
                        <Text style={{fontSize:12,color:'orange',fontWeight:'bold'}}>
                           {SEASON}
                        </Text>
                   </View>
                 </View>
                 <View style={{width,height:60,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingHorizontal:20,paddingBottom:10}}>
                      <Text style={{fontSize:10,opacity:0.5,fontWeight:'bold'}} >{DATE} : {date}</Text>
                 </View> 
               </View>
         </View>
}

const ContactInfo=()=>{
    const {isActiveExist,memberDetails} = useContext(HarvestingMachineLeasingPeopleDetailsContext)
    return  <View>
                <View style={{height:85,flexDirection:'row',alignItems:`center`,paddingHorizontal:20,justifyContent:'space-between',borderBottomWidth:0.5,paddingBottom:30}} >
                            <View style={{flexDirection:'row',alignItems:`center`}} > 
                            <View>
                                <View
                                style={{height:55,width:55,borderRadius:57.5,borderWidth:0.6,borderColor:'grey',alignItems:'center',justifyContent:'center'}}
                                >
                                    <Image
                                        style={{height:50,width:50,borderRadius:25,padding:10}}
                                        source={require('../Assets/Images/avatar.png')}
                                    />
                                </View> 
                            </View>
                            <View style={{paddingLeft:20}} >
                                <Text
                                    style={{fontWeight:'bold',fontSize:16,marginTop:2}}
                                >
                                {memberDetails.personalInfo.name}
                                </Text>
                                <Text
                                    style={{fontSize:13,opacity:0.7,marginTop:2}}
                                >
                                  {memberDetails.personalInfo.location}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                        onPress={()=>{
                          console.log(memberDetails.personalInfo.location)
                          Linking.openURL(`tel:${memberDetails.personalInfo.number}`)}}
                        >
                        <MaterialIcon
                        style={{paddingRight:5}}
                        size={23}
                        name={'phone'}
                        color={Colors.primaryColor}
                        />
                    </TouchableOpacity>
                        </View>
            </View>
}


const Machines = ()=>{
    const addMachine = useRef()
    const {machines} = useContext(HarvestingMachineLeasingPeopleDetailsContext)
    return <View
       style={{minHeight:200}}
    >

     <View
        style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:10,}}
      >
          <Text style={{marginTop:10,marginLeft:10,fontWeight:'bold',fontSize:18,}} >{HARVESTINGMACHINE}</Text>
          <TouchableOpacity
            onPress={()=>{addMachine.current.open()}}
          >
            <MaterialIcon
             name={"add"}
             size={24}              
             style={{marginTop:12}}
            />
          </TouchableOpacity>
      </View> 
      <FlatList
        numColumns={3}
        showsVerticalScrollIndicator={false}
        style={{paddingTop:10,paddingHorizontal:2,marginHorizontal:8}}
        data={machines}
        renderItem={({index,item})=>{
            return <MemberBox item={item} /> 
        }}
      />

     <AddMachine addMachine={addMachine} />
    </View>
}

const MemberBox = ({item})=>{
    const refDeleteSheet = useRef() 
    const {navigate,season,getMachines,memberDetails} = useContext(HarvestingMachineLeasingPeopleDetailsContext)
    return <View>
           <TouchableWithoutFeedback
             onLongPress={()=>{
               Vibration.vibrate(50)
               refDeleteSheet.current.open()
             }}

             onPress={()=>{
               console.log({machine:{...item.Active,season,ownerId:memberDetails.personalInfo.number,id:item.id}})
               if(item.Active){
                  navigate("HarvestingMachineDetails",{machine:{...item.Active,season,ownerId:memberDetails.personalInfo.number,id:item.id},callBack:getMachines})
               }else{
                 Snackbar.show({
                   text:NODATAEXIST,
                   textColor:'red'
                 })
               }
             }}
             >
            <View
               style={{
                   width:(width/3)-26,height:width/2.7,shadowOffset:{height:2,width:2},elevation:1,shadowColor:'#000',margin:10,
                   backgroundColor:Colors.searchBarColor,borderRadius:10,justifyContent:'space-around',alignItems:'center',marginVertical:15
               }}
             >
             
                   <View
                     style={{height:55,width:55,alignItems:'center',justifyContent:'center'}}
                     >
                         <Image
                             tintColor={'grey'}
                             style={{height:55,width:55,borderRadius:50}}
                             source={require('../Assets/Images/HarvestingMachine.png')}
                         />
                     </View> 
                     <View
                       style={{alignItems:'center',justifyContent: 'center',}}
                     >
                         <Text
                           style={{fontSize:13,fontWeight:'bold'}}
                         >{MACHINETYPES[item.type]}</Text>
                         <Text
                           style={{fontSize:10,opacity:0.5}}
                         >{item.machineName}</Text>
                     </View>
                       
               <DeleteSheet refDeleteSheet={refDeleteSheet} item={item} />        
   
             </View>
          </TouchableWithoutFeedback> 
         </View>  
   
}
   

const CardDetails = ()=>{
  const {memberDetails} = useContext(HarvestingMachineLeasingPeopleDetailsContext)  
  return  <View
                style={{height:200,margin:20,backgroundColor:"#eeeeee",borderRadius:10,shadowOpacity:0.5,shadowColor:"#000",elevation:2,shadowOffset:{height:2,width:2}}}
            >
                <View
                    style={{position:'absolute',opacity:0.3}}
                >
                    <Image
                        
                        source={require('../Assets/Images/map.jpg')}
                        style={{height:200,width:width-40}}

                    />
                </View>
                <View
                    style={{paddingHorizontal:20,paddingTop:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}
                >
                    <Text style={{fontWeight:'bold',fontSize:18}} >{memberDetails.bankInfo.bankName}</Text>
                    <Text style={{fontWeight:'bold',opacity:0.6}} >{memberDetails.bankInfo.branch}</Text>
                    
                </View>

                <View
                    style={{marginLeft:20,marginTop:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}
                >
                    <Image
                        style={{height:70,width:100}}
                        source={{uri:"https://s4i6r5r7.stackpathcdn.com/wp/wp-content/themes/simoptions/assets/img/sim-card-bg-min.png"}}
                    />
                    
                </View>
                
                <View
                    style={{justifyContent:'center',marginTop:10,paddingLeft:20}}
                >
                    <Text
                        style={{fontSize:20,opacity:0.5,letterSpacing:5}}
                    >{memberDetails.bankInfo.accNumber}</Text>
                    <Text
                        style={{opacity:0.5,marginTop:10,marginLeft:5}}
                    >{memberDetails.bankInfo.ifsc}</Text>
                </View>

            </View>
}

const History = ()=>{

  const { histories,isHistoryLoaded,getHistoryData,isHistoryExist,historyAmount,navigate } = useContext(HarvestingMachineLeasingPeopleDetailsContext)
  const [season,setSeason] = useState(1)   
  const [year,setYear] = useState((new Date()).getFullYear())   
  
  
  console.log({ histories,isHistoryLoaded,getHistoryData,isHistoryExist })

  console.log(histories)

   useEffect(()=>{
    getHistoryData(year,season)
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
                                  {historyAmount}₹
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
                            { (!isHistoryLoaded)?<View
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
                                        navigate("HarvestingMachineLeasingPeopleDetailsHistory",{history:item})
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

const AddMachine = ({addMachine})=>{
    // const {addDriver,getDirvers} = useContext(TractorSettingsContext)

    const {memberDetails,date,season,callBack,getMachines,settings} = useContext(HarvestingMachineLeasingPeopleDetailsContext)
    const [type,setType] = useState(0)
    const [machineName,setMachineName] = useState()
    const [driverNumber,setDriverNumber] = useState("")
    const [driverName , setDriverName] = useState("")






    return <RBSheet
    ref = {addMachine}
    closeOnDragDown={true}
    closeOnPressMask={true}
    height={410}
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
         <View style={{flex:1,borderTopLeftRadius:20,borderTopRightRadius:20,backgroundColor:'white'
                        }} >

                     <View
                        style={{...style.textInput,marginTop:20,borderRadius:20,flexDirection:'row',}}
                      >
                          <TouchableOpacity
                            onPress={()=>setType(0)}
                          >
                            <View
                              style={{flex:1,backgroundColor:type==0?blue:'transparent',width:(width/2)-10,borderRadius:20,justifyContent:'center',alignItems:'center'}}
                            >
                                <Text
                                   style={{color:type==0?'white':'black',fontWeight:'bold'}}
                                >
                                    {TIRE}
                                </Text>
                            </View>
                          </TouchableOpacity>
                         

                          <TouchableOpacity
                            onPress={()=>setType(1)}
                          >
                            <View
                              style={{flex:1,backgroundColor:type==1?blue:'transparent',width:(width/2)-10,borderRadius:20,justifyContent:'center',alignItems:'center'}}
                            >
                                <Text
                                   style={{color:type==1?'white':'black',fontWeight:'bold'}}
                                >
                                   {BELT}
                                </Text>
                            </View>
                          </TouchableOpacity>
                      </View>     
                        
                      <View
                        style={{...style.textInput,marginTop:20,borderRadius:20}}
                      >
                            <TextInput
                                value={machineName}
                                onChangeText={(text)=>setMachineName(text)}
                                style={{flex:1,marginLeft:20}}
                                placeholder={MACHINENUMBER}
                                returnKeyType="done"
                            />
                      </View>

                      <View
                        style={{...style.textInput,marginTop:20,borderRadius:20}}
                      >
                            <TextInput
                                value={driverName}
                                onChangeText={(text)=>setDriverName(text)}
                                style={{flex:1,marginLeft:20}}
                                placeholder={DRIVERNAME}
                                returnKeyType="done"
                            />
                      </View>

                      <View
                        style={{...style.textInput,marginTop:20,borderRadius:20}}
                      >
                            <TextInput
                                value={driverNumber}
                                onChangeText={(text)=>setDriverNumber(text)}
                                style={{flex:1,marginLeft:20}}
                                placeholder={DRIVERNUMBER}
                                keyboardType='number-pad'
                                returnKeyType="done"
                            />
                      </View>
                    
                   
                      <TouchableWithoutFeedback
                        onPress={async()=>{

                            if(!machineName && driverNumber.length!=10 && !driverName){
                                Snackbar.show({
                                    text:INVALID,
                                    textColor:'red'
                                })
                                return
                            }

                            database.ref("HarvestingMachineSettings/Members/ID"+`${memberDetails.personalInfo.number}/Active/MachineID/ID`).once('value').then((data)=>{
                                var id = data.val()
                                if(!id){
                                    database.ref("HarvestingMachineSettings/Members/ID"+`${memberDetails.personalInfo.number}/Active`).set({
                                        date,season
                                    })
                                    database.ref("HarvestingMachineSettings/Members/ID"+`${memberDetails.personalInfo.number}/Active/Machine`).push({
                                        machineName,driverNumber,ownerName:memberDetails.personalInfo.name,
                                        type,price:(type==0)?settings.tirePrice:settings.beltPrice,driverName

                                    })

                                    database.ref("HarvestingMachineSettings/Members/ID"+`${memberDetails.personalInfo.number}/Active/MachineID`).update({"ID":[machineName]})
                                }
                                else if(id.includes(machineName)){
                                    Snackbar.show({
                                        text:INVALID,
                                        textColor:'red'
                                    })
                                    return
                                }else{
                                    database.ref("HarvestingMachineSettings/Members/ID"+`${memberDetails.personalInfo.number}/Active/MachineID`).update({"ID":[...id,machineName]})
                                    database.ref("HarvestingMachineSettings/Members/ID"+`${memberDetails.personalInfo.number}/Active/Machine`).push({
                                        machineName,price:(type==0)?settings.tirePrice:settings.beltPrice,
                                        type,driverNumber,driverName,ownerName:memberDetails.personalInfo.name
                                        
                                    })

                                }

                                addMachine.current.close()
                              

                                setTimeout(()=>{
                                    getMachines()
                                    callBack()
                                    Snackbar.show({
                                        text:SUCESSFULLYDONE,
                                        textColor:'green'
                                    })
    
                                },1000)

                                
                            })

                        }}
                      >
                      <View
                          style={{...style.textInput,marginTop:20,
                                  backgroundColor:Colors.blue,
                                  shadowOffset: { width: 0, height: 5 },
                                  shadowOpacity: 0.7,
                                  shadowRadius: 3,
                                  elevation: 3,
                                  borderWidth:0,
                                  justifyContent:'center',
                                  alignItems:'center',borderRadius:20
                                
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

const CompleteSheet =({complete})=>{

  const [date,setDate] = useState(`${new Date().getDate()}-0${new Date().getMonth()+1}-${new Date().getFullYear()}`)
  const {amount,petrolAmount,isActiveExist,memberDetails,totalAcer,totalTime,
        getMachines,callBack,setIsLoaded,getHistoryData} = useContext(HarvestingMachineLeasingPeopleDetailsContext)



  return <RBSheet             
  ref={complete}
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

  


 {<View>
    <View
      style={{justfyContent:'center',alignItems:'center',marginTop:40}}
    >
        <Text
            style={{fontSize:35,color:'black',fontWeight:'bold'}}
        >
            {amount-petrolAmount}₹
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
         await database.ref(`HarvestingMachineSettings/Members/ID${memberDetails.personalInfo.number}/Active`).remove()
         await database.ref(`HarvestingMachineSettings/Members/ID${memberDetails.personalInfo.number}`).child("History").push(
           {...isActiveExist,finishDate:date,amount,petrolAmount,totalTime,totalAcer}
         )
     
         setTimeout(()=>{
          Snackbar.show({
            text:SUCESSFULLYDONE,
            textColor:'white'
          })
          callBack()
          setIsLoaded(false)
          getMachines()
          getHistoryData()
          
            
         },1000)

         console.log(  memberDetails.personalInfo.number)
         request(PERMISSIONS.ANDROID.SEND_SMS).then((result) => {
          if(result==="granted"){
            NativeModules.SendSms.send(
              `${TIME} = ${totalTime} , ${AMOUNT} = ${amount} , ${FUELCOAST} = ${petrolAmount}`,
              memberDetails.personalInfo.number)
          }
        })
        
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

const DeleteSheet=({refDeleteSheet,item})=>{
  const {memberDetails,getMachines} = useContext(HarvestingMachineLeasingPeopleDetailsContext)
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
<View>
    <View
      style={{justfyContent:'center',alignItems:'center',marginTop:20}}
    >
         <View
            style={{
                width:(width/3)-26,margin:10,
                justifyContent:'space-around',alignItems:'center'
            }}
          >
          
                <View
                  style={{height:55,width:55,alignItems:'center',justifyContent:'center',marginBottom:20}}
                  >
                      <Image
                             tintColor={'grey'}
                             style={{height:55,width:55,borderRadius:50}}
                             source={require('../Assets/Images/HarvestingMachine.png')}
                      />
                  </View> 
                  <View
                    style={{alignItems:'center',justifyContent: 'center',}}
                  >
                      <Text
                        style={{fontSize:15,fontWeight:'bold'}}
                      >{MACHINETYPES[item.type]}</Text>
                      <Text
                        style={{fontSize:10,opacity:0.5}}
                      >{item.machineName}</Text>
                  </View>
                    

          </View>
    </View>

    <TouchableWithoutFeedback
        onPress={()=>{
          refDeleteSheet.current.close()
          if(!item.Active){
             database.ref("HarvestingMachineSettings/Members/ID"+`${memberDetails.personalInfo.number}/Active/Machine/${item.id}`).remove()
             setTimeout(()=>{
              Snackbar.show({
                text:SUCESSFULLYDONE,
                textColor:'white'
              })
           
              getMachines()
                
             },1000)
           }else{
            setTimeout(()=>{
              Snackbar.show({
                text:ERROR,
                textColor:'red'
              })
                
             },1000)
         
           }
        }}
    >
    <View
              style={{...style.textInput,marginTop:50,
                      backgroundColor:'red',
                      shadowOffset: { width: 0, height: 5 },
                      shadowOpacity: 0.7,
                      shadowRadius: 3,
                      elevation: 3,
                      borderWidth:0,
                      borderRadius:20,
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
    moduleBar : {width:(width-60)/2,height:40,borderRadius:20,borderWidth:0.1,justifyContent:'center',alignItems:'center'},
    seasonButton : {borderRadius:20,justifyContent:'center',height:43,alignItems:'center',shadowColor:'#000',width:width/3.5,marginVertical:20,backgroundColor:blue}
})

  

export default HarvestingMachineLeasingPeopleDetails
