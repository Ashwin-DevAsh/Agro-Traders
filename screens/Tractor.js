import React , {createContext,useEffect,useState,useContext,useRef} from 'react'
import { View,Text,TouchableOpacity,StyleSheet, Dimensions ,TextInput,TouchableNativeFeedback,Image,FlatList,ScrollView,TouchableWithoutFeedback, Vibration, Linking} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {blue} from "../Assets/color"
import RBSheet from 'react-native-raw-bottom-sheet'
import {database} from '../database/firebase'
import Snackbar from 'react-native-snackbar'
import { Tooltip } from 'react-native-elements';
import * as Colors from '../Assets/color'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Autocomplete from 'react-native-autocomplete-input'



const TRACTOR = "டிராக்டர்"
const HISTORY = "வரலாறு"
const ACTIVE = "செயலில்"
const SEASON = "பருவம்"
const DATEOFDRIVEN = "இயக்கி தேதி"
const PLACE = "இடம்"
const ACER = "ஏக்கர்"
const POINTS = "புள்ளிகள்"
const INCLUDEROTATOR = "ரோட்டேட்டர்"
const DELETE = "அகற்று"
const DRIVERNAME = "ஓட்டுனர் பெயர்"
const DONE = "முடிந்தது"
const DATE = "தேதி"
const AMOUNT = "தொகை"
const INVALID = "தவறான சான்றுகள்"
const SUCESSFULLYDONE = "வெற்றிகரமாக முடிந்தது"
const SAAL = "உழவுசால்"
const IFINCLUDEROTATOR = "ரோட்டேட்டர் சேர்க்கப்பட்டால்"
const PAID = "செலுத்தப்பட்டது"
const {width,height} = Dimensions.get('window')
export const TractorContext = createContext()
const seasonName = ["சம்பா","குருவாய்","பருவம்"]

const TractorProvider = (props)=>{
       const [module , setModule] = useState(1)
       const AddTransaction = useRef()
       const [season,setSeason] = useState(1)
       const member = props.navigation.state.params.member
       const callBack =  props.navigation.state.params.callBack
       const [isActiveExist,setIsActiveExist] = useState(null)
       const [driverName,setDriverName] = useState("")
       const [isHistoryExist,setIsHistoryExist] = useState(null)
       const [histories,setHistories] = useState()
       const [activity , setActivity] = useState({})
       const [saalPrice,setSaalPrice] = useState(0)
       const [pointsPrice,setPointsPrice] = useState()
       const complete = useRef()
       const [year,setYear] = useState((new Date()).getFullYear())
       const [isLoading,setIsLoading] = useState(null)
       const [historyAmount , setHistoryAmount] = useState(0)
      

       const goBack=()=>{
            props.navigation.goBack()
       }

       const navigate=(page,params)=>{
         props.navigation.push(page,params)
       }

       const callCallBack=()=>{
         callBack()
       }

       const getSettings = async()=>{
          const settings=(await database.ref("TractorSettings").once('value')).toJSON()
          console.log(settings,settings.saalPrice)
          setSaalPrice(settings.saalPrice)
          setPointsPrice(settings.pointsPrice)
          setSeason(settings.season)
        
       }

       const currentSettings = async()=>{
          const settings=(await database.ref("Members/"+member.key+"/Tractor/Active").once('value')).toJSON()
          console.log(settings,settings.saalPrice)
          setSaalPrice(settings.saalPrice)
          setPointsPrice(settings.pointsPrice)
          setSeason(settings.season)
       }

       const getHistoryData = async(season)=>{
          setHistoryAmount(0)
          setIsLoading(null)
          const memberDetails = (await database.ref("Members/"+member.key).once('value')).toJSON()
          if(memberDetails.Tractor){
              var hisAmount = 0
              if(memberDetails.Tractor.History){
                setIsHistoryExist(memberDetails.Tractor.History)
                var historyTemp = []
                for(var i in memberDetails.Tractor.History){
                  if(memberDetails.Tractor.History[i].date.endsWith(year) && memberDetails.Tractor.History[i].season==season){
                      historyTemp.push(memberDetails.Tractor.History[i])
                      hisAmount+=memberDetails.Tractor.History[i].amount
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

       const getActiveData = async()=>{
          const memberDetails = (await database.ref("Members/"+member.key).once('value')).toJSON()
          if(memberDetails.Tractor){
              if(memberDetails.Tractor.Active){
                currentSettings()
                setIsActiveExist(memberDetails.Tractor.Active)
                var activityTemp = []
                for(var i in memberDetails.Tractor.Active.Activity){
                  activityTemp.push({...memberDetails.Tractor.Active.Activity[i],id:i})
                }
                activityTemp.sort((a,b)=>{
                  if(new Date(a.timeStamp).getTime()>new Date(b.timeStamp).getTime()){
                    return 1
                  }else{
                    return -1
                  }
                })
                 setActivity(activityTemp)
              }else{
                 getSettings()
                 setIsActiveExist(false)
              }
          }else{
            setIsActiveExist(false)
            getSettings()
          }
       }

       useEffect(()=>{
          getActiveData()
          getHistoryData()
          return()=>{

          }
       },[])
   
       return<TractorContext.Provider value = {
                                {
                                    module:[module,setModule],
                                    goBack,AddTransaction,member,
                                    season:[season,setSeason],
                                    activeExist:[isActiveExist,setIsActiveExist],
                                    driverName:[driverName,setDriverName],
                                    getActiveData,historyAmount,
                                    callBack:callCallBack,navigate,
                                    activity:[activity,setActivity],getSettings,
                                    pointsPrice:[pointsPrice,setPointsPrice],
                                    saalPrice:[saalPrice,setSaalPrice],complete,
                                    historyExist:[isHistoryExist,setIsHistoryExist],getHistoryData,
                                    histories:[histories,setHistories],year:[year,setYear],isLoading
                                }
                                } >
                   <Tractor/>
            </TractorContext.Provider>
}


const AppBar=()=>{
    const goBack = useContext(TractorContext).goBack
    const {AddTransaction} = useContext(TractorContext)
    const [isActiveExist] = useContext(TractorContext).activeExist
    const complete = useContext(TractorContext).complete
    const {navigate} = useContext(TractorContext)
    const {getSettings} = useContext(TractorContext)
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
                  {TRACTOR}
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
                 style={{height:25,width:25,backgroungColor:'grey',marginHorizontal:10}}
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
                      style={{height:22,width:29,backgroungColor:'grey',marginHorizontal:10,marginTop:1}}
                      source={require('../Assets/Images/tractorSheet.png')}
              />
            </TouchableOpacity>
            }
          
            
        </View>
    </View>
}

const Section = ()=>{
    const [module,setModule] = useContext(TractorContext).module
    const [isActiveExist,setIsActiveExist] = useContext(TractorContext).activeExist
    const {getActiveData,member} = useContext(TractorContext)
  

    const onPress = async()=>{
        refDeleteSheet.current.close()
       
          setTimeout(()=>{
             getActiveData()
              Snackbar.show({
                duration:Snackbar.LENGTH_LONG,
                text:SUCESSFULLYDONE,
                textColor:'white'
              })
          },1000)
      
          await database.ref("Members/").child(member.key).child("Tractor").child("Active").remove()
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


export const Active = ({TractorHistoryContext})=>{
 
  
  var [isActiveExist,setIsActiveExist] = useContext(TractorContext).activeExist
  var [activity,setActivity] = useContext(TractorContext).activity

  if(TractorHistoryContext){
    var [isActiveExist,setIsActiveExist] = useContext(TractorHistoryContext).activeExist
    var [activity,setActivity] = useContext(TractorHistoryContext).activity
  
  }

  return <View>
    {
      (isActiveExist==null)?<View style={{flex:1,justifyContent:"flex-end",height:height/3,alignItems:'center'}}>
                                <Text
                                   style={{fontWeight:'bold',fontSize:13,opacity:0.5}}
                                >Loading...</Text>
                            </View>
                            :<View/>
      
    }
    {
      (isActiveExist)?<View>
         <OverAll/>
            <Activity activity={activity} />
            <View style={{height:100}} />
        </View>:<View/>
    }
  </View>
}

const History = ()=>{
  const [isHistoryExist] = useContext(TractorContext).historyExist
  const [histories,setHistories] = useContext(TractorContext).histories 
  const [year,setYear] = useContext(TractorContext).year
  const isLoading = useContext(TractorContext).isLoading
  const getHistoryData = useContext(TractorContext).getHistoryData
  const [season,setSeason] = useState(1)
  const histAmount = useContext(TractorContext).historyAmount
  const navigate = useContext(TractorContext).navigate

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
                                        navigate("TractorHistory",{history:item})
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

export const OverAll = ()=>{

  var [isActiveExist] = useContext(TractorContext).activeExist
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
                   style={{justifyContent:'center',alignItems:'center',}}
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
                     style={{justifyContent:'center',alignItems:'center',}}
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








const Tractor=()=>{

    const [module,setModule] = useContext(TractorContext).module
    const complete = useContext(TractorContext).complete

     return <View
         style={{backgroundColor:'white',flex:1}}
     >
               <AppBar/>
               <ScrollView>
                    <Section/>
                    {
                      (module==1)?<Active/>:<History/>
                    }
               </ScrollView>
         <AddTransactionSheet/>
         <CompleteSheet complete = {complete} />
         </View>
  
}


const AddTransactionSheet = ()=>{
    const {AddTransaction} = useContext(TractorContext)

    const [includeRotator,setIncludeRotator] = useState(false)
    const [season,setSeason] = useContext(TractorContext).season
    const member = useContext(TractorContext).member
    const [date,setDate] = useState(`${new Date().getDate()}-0${new Date().getMonth()+1}-${new Date().getFullYear()}`)
    const [driverName,setDriverName] = useContext(TractorContext).driverName
    const {navigate} = useContext(TractorContext)
   
    const [acer,setAcer] = useState()
    const [saal,setSaal] = useState()
    const [points,setPoints] = useState(0)
    const [place,setPlace] = useState("")

    const callBack = useContext(TractorContext).callBack
    const getActiveData = useContext(TractorContext).getActiveData

    const [saalPrice] = useContext(TractorContext).saalPrice
    const [pointsPrice] = useContext(TractorContext).pointsPrice

    const [isActiveExist,setIsActiveExist] = useContext(TractorContext).activeExist
    return <RBSheet
     ref={AddTransaction}
     closeOnDragDown={true}
     closeOnPressMask={true}
     height={550}
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

                    navigate("TractorDrivers",{callBack:(name)=>{
                      setDriverName(name)
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
                      value={driverName.name}
                      onChangeText={(text)=>setDriverName(text)}
                      style={{flex:1,marginLeft:20}}
                      placeholder={DRIVERNAME}
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
                     keyboardType="number-pad"
                     value={acer}
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
                     value={saal}
                     onChangeText={(text)=>setSaal(text)}
                     style={{flex:1,marginLeft:20}}
                     placeholder={SAAL + ` (${saalPrice}₹)`}
                   />
             </View>


        
            <View
              style={{...style.textInput,marginTop:20}}
            >
                  <TextInput
                      returnKeyType="done"
                      keyboardType={'number-pad'}
                      value={points}
                      onChangeText={(text)=>setPoints( text.length>0?text:0)}
                      style={{flex:1,marginLeft:20}}
                      placeholder={POINTS+ ` (${pointsPrice}₹)` + " - " + IFINCLUDEROTATOR}
                  />
            </View>
           
            
            
             <TouchableWithoutFeedback
                
                  onPress={async()=>{
                   var timeStamp = +new Date()


                   if(isActiveExist){
                    if(!parseFloat(acer) && !parseFloat(saal) && !parseFloat(points) && date.length==0 && driverName.length==0 && place.length==0){
                      Snackbar.show({
                        text:INVALID,
                        textColor:'red'
                      })
                      return
                    }
                    AddTransaction.current.close()
                    await database.ref("Members/"+`ID${member.personalInfo.number}/Tractor`).child("Active").update({
                      totalAcer:parseFloat(acer)+isActiveExist.totalAcer,
                      totalSaal:parseFloat(saal)+isActiveExist.totalSaal,
                      points:parseFloat(points)+isActiveExist.points,
                      amount:((parseFloat(points)>0))?isActiveExist.amount+(parseFloat(acer)*parseFloat(saal)*saalPrice)+(parseInt(points)*pointsPrice):isActiveExist.amount+(parseFloat(acer)*parseFloat(saal)*saalPrice),
                    })
                    await database.ref("Members/"+`ID${member.personalInfo.number}/Tractor/Active`).child("Activity").push(
                      { date,driverName, acer : parseFloat(acer),saal:parseInt(saal),includeRotator:(parseFloat(points)>0), points:parseFloat(points),timeStamp,place,
                        amount: ((parseFloat(points)>0))?(parseFloat(acer)*parseFloat(saal)*saalPrice)+(parseInt(points)*pointsPrice):(parseFloat(acer)*parseFloat(saal)*saalPrice),       
                      }
                    )

                   }else{
                      if(!parseFloat(acer) && !parseFloat(saal) && !parseFloat(points) && date.length==0 && driverName.length==0 && place.length==0){
                        Snackbar.show({
                          text:INVALID,
                          textColorr:'red'
                        })
                        return
                      }
                      AddTransaction.current.close()

                      await database.ref("Members/"+`ID${member.personalInfo.number}`).child("Tractor").update({
                        Active:{
                          totalAcer:parseFloat(acer),
                          totalSaal:parseFloat(saal),
                          points:parseFloat(points),
                          saalPrice,pointsPrice,
                          season:season,
                          date,
                          timeStamp,
                          amount:(parseFloat(points)>0)?(parseFloat(acer)*parseFloat(saal)*saalPrice)+(parseInt(points)*pointsPrice):(parseFloat(acer)*parseFloat(saal)*saalPrice),
                          Activity:{Initial:{ date,driverName, acer : parseFloat(acer),saal:parseInt(saal),includeRotator:(parseFloat(points)>0),points:parseFloat(points),timeStamp,place,
                            amount:(parseFloat(points)>0)?(parseFloat(acer)*parseFloat(saal)*saalPrice)+(parseInt(points)*pointsPrice):(parseFloat(acer)*parseFloat(saal)*saalPrice),       
                          }}
                        }
                      })
                      
                   } 
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


export const Activity = ({activity})=>{
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
                               {ACER}
                             </Text>
                        </View>
                       <View
                         style={{width:width/4,alignItems:'center',justifyContent:'center'}}
                       >
                           <Text
                           style={{fontWeight:'bold',color:'black',fontSize:14,}}
                           >
                             {SAAL}
                         </Text>

                       </View>
                         
                         <View
                         style={{width:width/4,alignItems:'center',justifyContent:'center'}}
                       >
                           <Text
                           style={{fontWeight:'bold',color:'black',fontSize:14,}}
                           >
                             {POINTS}
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
                    <Tab item={item} />
                    }
                 </View>
               }}
             />
}

export const Tab = ({item})=>{
   const informtion = useRef()
   const refDeleteSheet = useRef()

   const isActiveExist = useContext(TractorContext)?.activeExist[0]
   const getActiveData = useContext(TractorContext)?.getActiveData
   const saalPrice = useContext(TractorContext)?.saalPrice
   const member = useContext(TractorContext)?.member
   const pointsPrice =  useContext(TractorContext)?.pointsPrice
   const [extend,setExtend] = useState(false)
 
 

   const onPress =async()=>{
    refDeleteSheet.current.close()
     await database.ref("Members/"+`ID${member.personalInfo.number}/Tractor`).child("Active").update({
       totalAcer:isActiveExist.totalAcer-item.acer,
       totalSaal:isActiveExist.totalSaal-item.saal,
       points:isActiveExist.points-item.points,
       amount:((item.points>0))?isActiveExist.amount-(item.acer*item.saal*saalPrice[0])-(item.points*pointsPrice[0]):isActiveExist.amount-(item.acer*item.saal*saalPrice[0]),
     })
     await database.ref("Members/"+`ID${member.personalInfo.number}/Tractor/Active`).child("Activity").child(item.id).remove()

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
        // informtion.current.open()
      }}
       onLongPress={(isActiveExist)?()=>{
           Vibration.vibrate(50)
           refDeleteSheet.current.open()
       }:()=>{}}
    > 
   <View
      style={{
        height:50,width,borderBottomWidth:(!extend)?1:0,flexDirection:'row',alignItems:'center',backgroundColor:'white',
      }}
  >
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
          {item.saal}
        </Text>
      </View>
     
      <View
      style={{width:width/4,alignItems:'center',justifyContent:'center'}}
      >
          <Text
          style={{color:'black',fontSize:14,}}
          >
          {item.points}
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
          alignItems:'center',justifyContent:'space-evenly',flexDirection:'row',
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
          
            <Text
             style={{fontSize:13,fontWeight:'bold',opacity:0.5,borderWidth:1,padding:5,borderRadius:20,paddingHorizontal:10}}
           >{item.amount} ₹</Text>

             <TouchableOpacity
               onPress={()=>{
                  Linking.openURL(`tel:${item.driverName.number}`)
               }}
              >
        
            <View
              style={{borderWidth:1,padding:5,borderRadius:20,paddingHorizontal:10,opacity:0.5,
                       flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}
            >
              <MaterialIcon
                  name={'person'}
                  size={15}
              />
             

                  <Text
                    style={{fontSize:13,fontWeight:'bold',marginLeft:5}}
                  >{item.driverName.name}</Text>

           </View>
           </TouchableOpacity>

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
                >{data.driverName}</Text>
            </View> 
            <View
              style={{alignItems:'center',justifyContent:'center',marginTop:10,width:width/3}}
            >
                   <View
                  
                  source={require("../Assets/Images/tractor.png")}
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
                  
                  source={require("../Assets/Images/tractor.png")}
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

const CompleteSheet =({complete})=>{

  const [isActiveExist] = useContext(TractorContext).activeExist
  const {member} = useContext(TractorContext)
  const {getActiveData} = useContext(TractorContext)
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
         await database.ref(`Members/ID${member.personalInfo.number}/Tractor`).child("Active").remove()
         await database.ref(`Members/ID${member.personalInfo.number}/Tractor`).child("History").push(
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


const style = StyleSheet.create({
    textInput:{height:45,borderRadius:20,backgroundColor:Colors.searchBarColor,margin:10,flexDirection:'row',alignItems:'center' },
    moduleBar : {width:(width-60)/2,height:40,borderRadius:20,borderWidth:0.1,justifyContent:'center',alignItems:'center'},
    seasonButton : {borderRadius:20,justifyContent:'center',height:43,alignItems:'center',shadowColor:'#000',width:width/3.5,marginVertical:20,backgroundColor:blue}
})


export default TractorProvider