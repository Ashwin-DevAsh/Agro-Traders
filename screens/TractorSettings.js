import React, { createContext,useContext, useState ,useEffect,useRef, useCallback} from 'react'
import { View ,TouchableOpacity,Text,StyleSheet,TextInput, Dimensions ,Image, TouchableNativeFeedback, TouchableWithoutFeedback, ScrollView, FlatList, Vibration} from 'react-native'
import * as Colors from '../Assets/color'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {database} from '../database/firebase'
import Snackbar from 'react-native-snackbar'
import RBSheet from 'react-native-raw-bottom-sheet'
import Ionicons from 'react-native-vector-icons/Ionicons'


const TractorSettingsContext = createContext()


const NAME = "பெயர்"
const NUMBER = "தொலைபேசி எண்"
const LOCATION = "இடம்"
const DONE = "முடிந்தது"
const DELETE="அகற்று"

const seasonName = ["சம்பா","குருவாய்","பருவம்"]
const SETTINGS = "அமைப்புகள்"
const SEASON = "பருவம்"
const SAALPRICE = "ஒரு சால் உழவுக்கு"
const POINTSPRICE = "ஒரு புள்ளிக்கு"
const {height,width} = Dimensions.get('window')
const DRIVERS = "டிரைவர்கள்"
const SUCESSFULLYDONE = "வெற்றிகரமாக முடிந்தது"
const INVALID = "தவறான சான்றுகள்"



const TractorSettingsProvider = (props)=>{

    const addDriver = useRef()
    const [season,setSeason] = useState(1)
    const [saalPrice,setSaalPrice] = useState("")
    const [pointsPrice,setPointsPrice] = useState("")
    const [drivers,setDrivers] = useState([])
    const [isLoaded,setIsLoaded] = useState(false)




    const getSettings = async()=>{
        const settings=(await database.ref("TractorSettings").once('value')).toJSON()
        setSaalPrice(settings.saalPrice)
        setPointsPrice(settings.pointsPrice)
        setSeason(settings.season)
    }

    const getDirvers = async()=>{
        setIsLoaded(false)
        const driversDb = ((await database.ref("TractorSettings/Drivers").once('value')).toJSON()) 
        const driversTemp = []
        for(var i in driversDb){
            driversTemp.push(driversDb[i])
        }
        console.log(driversTemp)
        setDrivers(driversTemp)
        setIsLoaded(true)
    }
  
    const goBack=()=>{
        props.navigation.goBack()
    }
    useEffect(() => {
        getSettings()
        getDirvers()
        return () => {
            
        }
    }, [])
    return <TractorSettingsContext.Provider value={{
       goBack,season,setSeason,season,saalPrice,
       pointsPrice,drivers,getDirvers,
       setPointsPrice,setSaalPrice,addDriver,isLoaded
    }} >
           <TractorSettings/>
    </TractorSettingsContext.Provider>
}

export default TractorSettingsProvider

const TractorSettings=()=>{
  const {isLoaded} = useContext(TractorSettingsContext)
    return<View
       style={{flex:1,backgroundColor:'white'}}
    >
        <AppBar/>
        {(isLoaded)?
          <ScrollView>
              <TopContent/>
              <Drivers/>
              <AddDrivers/>
          </ScrollView>
          :<View
             style={{flex:1,justifyContent:'center',alignItems:'center'}}
          >
                 <Text style={{fontSize:13,fontWeight:'bold',opacity:0.5}} >Loading...</Text>
          </View>
        }
    </View>
}

const TopContent = ()=>{
    const {season,setSeason,
           saalPrice,setSaalPrice
          ,pointsPrice,setPointsPrice} 
    = useContext(TractorSettingsContext)

    return <View
      style={{paddingHorizontal:10,borderBottomWidth:0.2,paddingBottom:20}}
    >
         <Text style={{marginTop:15,marginLeft:10,fontWeight:'bold',opacity:0.5,fontSize:12}} >{POINTSPRICE}</Text>
        <View
               style={{...style.textInput,marginTop:10}}
             >
                   <TextInput
                     returnKeyType="done"
                     value={`${pointsPrice}`}
                     onChangeText={(text)=>setPointsPrice(text)}
                     keyboardType="number-pad"
                     style={{flex:1,marginLeft:20}}
                   />
        </View>
        <Text style={{marginTop:10,marginLeft:10,fontWeight:'bold',opacity:0.5,fontSize:12}} >{SAALPRICE}</Text>
        <View
               style={{...style.textInput,marginTop:10}}
             >
                   <TextInput
                     returnKeyType="done"
                     value={`${saalPrice}`}
                     keyboardType="number-pad"
                     onChangeText={(text)=>setSaalPrice(text)}
                     style={{flex:1,marginLeft:20}}
                   />
        </View>
        <Text style={{marginTop:10,marginLeft:10,fontWeight:'bold',opacity:0.5,fontSize:12}} >{SEASON}</Text>
        <View
               style={{...style.textInput,marginTop:10}}
            >
                <TouchableNativeFeedback
                  onPress={()=>setSeason(1)}
                >
                    <View
                    style={{flex:1,height:45,backgroundColor:(season===1)?Colors.blue:Colors.searchBarColor,
                            borderTopLeftRadius:5,borderBottomLeftRadius:5,alignItems:'center',justifyContent:'center',
                            // elevation:(season==1)?2:0,shadowColor:'#000',shadowOffset:{height:2,width:2}
                          }}
                    >
                        <Text
                          style={{fontWeight:'bold',color:(season===1)?'white':'black'}}
                        >{seasonName[0]}</Text>
                    
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  onPress={()=>setSeason(2)}
                >
                    <View
                    style={{flex:1,height:45,backgroundColor:(season===2)?Colors.blue:Colors.searchBarColor,
                            alignItems:'center',justifyContent:'center',
                            // elevation:(season==2)?2:0,shadowColor:'#000',shadowOffset:{height:2,width:2}
                          }}
                    >
                        <Text
                        style={{fontWeight:'bold',color:(season===2)?'white':'black'}}
                        >{seasonName[1]}</Text>
                    
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  onPress={()=>setSeason(3)}
                >
                    <View
                    style={{flex:1,height:45,backgroundColor:(season===3)?Colors.blue:Colors.searchBarColor,
                            borderTopRightRadius:5,borderBottomRightRadius:5,alignItems:'center',justifyContent:'center',
                            // elevation:(season==3)?2:0,shadowColor:'#000',shadowOffset:{height:2,width:2}
                          }}
                    >
                        <Text
                        style={{fontWeight:'bold',color:(season===3)?'white':'black'}}
                        >{seasonName[2]}</Text>
                    </View>
                </TouchableNativeFeedback>
        </View> 
    </View>
}
const Drivers = ()=>{
    const {addDriver} = useContext(TractorSettingsContext)
    const {drivers} = useContext(TractorSettingsContext)
    return <View style={{marginTop:10}} >
      <View
        style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:10,}}
      >
          <Text style={{marginTop:10,marginLeft:10,fontWeight:'bold',fontSize:18,}} >{DRIVERS}</Text>
          <TouchableOpacity
            onPress={()=>{addDriver.current.open()}}
          >
            <MaterialIcon
                name={'add'}
                color={'grey'}
                size={25}
                style={{marginTop:12}}
            />
          </TouchableOpacity>
      </View>  
      <FlatList
        numColumns={3}
        showsVerticalScrollIndicator={false}
        style={{paddingTop:10,paddingHorizontal:2,marginHorizontal:8}}
        data={drivers}
        renderItem={({index,item})=>{
            return <MemberBox item={item} /> 
        }}
      />
    </View>
}
const AppBar = ()=>{
    const {goBack,callBack,pointsPrice,saalPrice,season} = useContext(TractorSettingsContext)
    return<View
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
               {SETTINGS}
       </Text>
     </View>  
     <TouchableOpacity
         onPress={async()=>{
            if(!saalPrice || !pointsPrice){
                Snackbar.show({
                    text:INVALID,
                    textColor:'green'
                })
                return <MemberBox item={item} />
            } 
            await database.ref("TractorSettings").update({
                pointsPrice,saalPrice,season
            })
            goBack()
            setTimeout(()=>{
                 Snackbar.show({
                     text:SUCESSFULLYDONE,
                     textColor:'green'
                 })
            },1000)
         }}
       >
           <MaterialIcon
             name={"done"}
             size={24}              
           />
       </TouchableOpacity>
 </View>
}

const AddDrivers = ()=>{
    const {addDriver,getDirvers} = useContext(TractorSettingsContext)
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [location, setLocation] = useState("")
    return <RBSheet
    ref = {addDriver}
    closeOnDragDown={true}
    closeOnPressMask={true}
    height={340}
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
                        style={{...style.textInput,marginTop:20,borderRadius:20}}
                      >
                            <TextInput
                            value={name}
                            onChangeText={(text)=>setName(text)}
                            style={{flex:1,marginLeft:20}}
                            placeholder={NAME}
                            returnKeyType="done"
                            />
                      </View>
                      <View
                        style={{...style.textInput,marginTop:20,borderRadius:20}}
                      >
                            <TextInput
                            returnKeyType="done"
                            value={location}
                            onChangeText={(text)=>setLocation(text)}
                            style={{flex:1,marginLeft:20,borderRadius:20}}
                            placeholder={LOCATION}
                            />
                      </View>
                      <View
                        style={{...style.textInput,marginTop:20,borderRadius:20}}
                      >
                            <TextInput
                            value={number}
                            returnKeyType="done"
                            keyboardType="number-pad"
                            onChangeText={(text)=>setNumber(text)}
                            style={{flex:1,marginLeft:20}}
                            placeholder={NUMBER}
                            />
                      </View>
                      <TouchableWithoutFeedback
                        onPress={async()=>{

                            if(!number || !location || !name){
                                Snackbar.show({
                                    text:INVALID,
                                    textColor:'red'
                                })
                                return
                            }
                            addDriver.current.close()
                            database.ref("TractorSettings/Drivers").child(`ID${number}`).set({
                                number,name,location
                            })
                            getDirvers()
                            setTimeout(()=>{
                                Snackbar.show({
                                    text:SUCESSFULLYDONE,
                                    textColor:'green'
                                })

                            },2000)
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


const DeleteSheet=({refDeleteSheet,number,item})=>{
  const {getDirvers} = useContext(TractorSettingsContext)
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
                          style={{height:55,width:55,borderRadius:50}}
                          source={require('../Assets/Images/avatar.png')}
                      />
                  </View> 
                  <View
                    style={{alignItems:'center',justifyContent: 'center',}}
                  >
                      <Text
                        style={{fontSize:15,fontWeight:'bold'}}
                      >{item.name}</Text>
                      <Text
                        style={{fontSize:10,opacity:0.5}}
                      >{item.location}</Text>
                  </View>
                    

          </View>
    </View>

    <TouchableWithoutFeedback
        onPress={()=>{
          refDeleteSheet.current.close()
          database.ref("TractorSettings/Drivers").child(`ID${number}`).remove()
          getDirvers()
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

const MemberBox = ({item})=>{
 const refDeleteSheet = useRef() 

 return <View>
        <TouchableWithoutFeedback
          onLongPress={()=>{
            Vibration.vibrate(50)
            refDeleteSheet.current.open()
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
                          style={{height:55,width:55,borderRadius:50}}
                          source={require('../Assets/Images/avatar.png')}
                      />
                  </View> 
                  <View
                    style={{alignItems:'center',justifyContent: 'center',}}
                  >
                      <Text
                        style={{fontSize:13,fontWeight:'bold'}}
                      >{item.name}</Text>
                      <Text
                        style={{fontSize:10,opacity:0.5}}
                      >{item.location}</Text>
                  </View>
                    
            <DeleteSheet number={item.number} refDeleteSheet={refDeleteSheet} item={item} />        

          </View>
       </TouchableWithoutFeedback> 
      </View>  

}


const style = StyleSheet.create({
    textInput:{height:45,borderRadius:5,backgroundColor:Colors.searchBarColor,margin:10,flexDirection:'row',alignItems:'center' },
})


  