import React, { createContext,useContext,useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet,
         Image,
         TouchableNativeFeedback, TouchableWithoutFeedback, FlatList, Dimensions } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import * as Colors from '../Assets/color'
import Snackbar from 'react-native-snackbar'
import {database} from '../database/firebase'


const seasonName = ["சம்பா","குருவாய்","பருவம்"]
const SETTINGS = "அமைப்புகள்"
const SEASON = "பருவம்"
const PERHOUR = "ஒரு மணி நேரத்திற்கு"
const TIRE = "சக்கரம்"
const BELT = "பெல்ட்"
const SUCESSFULLYDONE = "வெற்றிகரமாக முடிந்தது"
const INVALID = "தவறான சான்றுகள்"
const DEALERS = "விநியோகஸ்தர்"
const ORIGINAL = "அசல்"
const COMMISSION = "கமிஷன்"
const DEALERSACCOUNTPENDING = "விநியோகஸ்தர் கணக்கு நிலுவையில் உள்ளது"

const {width,height} = Dimensions.get('screen')


// commission = Actual Price var convincing


export const HarvestingMachineSettingContext = createContext()
const HarvestingMachineSettings = (props) => {
    const goBack=()=>{
        props.navigation.goBack()
    }

    const navigate=(page,data)=>{
      props.navigation.push(page,data)
    }

    const getSettings = async()=>{
        const settings=(await database.ref("HarvestingMachineSettings").once('value')).toJSON()
        setBeltPrice(settings.beltPrice)
        setTirePrice(settings.tirePrice)
        setTirePriceActual(settings.tirePrice-settings.tirePriceActual)
        setBeltPriceActual(settings.beltPrice-settings.beltPriceActual)
        setSeason(settings.season)
        setActualSeason(settings.season)
        setSettings(settings)
    }



    const getDealers = async()=>{
        setIsLoaded(false)
        const dealersDb = ((await database.ref("HarvestingMachineSettings/Members").once('value')).toJSON()) 
        const dealersTemp = []
        for(var i in dealersDb){
          if(dealersDb[i].Active)
               
            dealersTemp.push({
                key:i,
                personalInfo: dealersDb[i]["personalInfo"],
                bankInfo: dealersDb[i]["bankInfo"],
                Active: dealersDb[i]["Active"],
                Active: dealersDb[i]["History"],
             })
        }
        console.log(dealersTemp)
        setDealers(dealersTemp)
        setIsLoaded(true)
    }

    const [season,setSeason] = useState(1)
    const [beltPrice,setBeltPrice] = useState(0)
    const [tirePrice,setTirePrice] = useState(0)
    const [beltPriceActual,setBeltPriceActual] = useState(0)
    const [tirePriceActual,setTirePriceActual] = useState(0)
    const [dealers,setDealers] = useState([])
    const [isLoaded,setIsLoaded] = useState(false)
    const [actualSeason,setActualSeason] = useState(0)
    const [settings,setSettings] = useState(0)


    useEffect(()=>{
        getSettings()
        getDealers()
    },[])

    return (
        <HarvestingMachineSettingContext.Provider
             value={{
                dealers,setDealers,goBack,season,setSeason,setTirePriceActual,
                setBeltPriceActual,beltPriceActual,tirePriceActual,getDealers,settings,
                beltPrice,tirePrice,setBeltPrice,setTirePrice,navigate,actualSeason
             }}          
        >

        <View
          style={{flex:1,backgroundColor:'white'}}
        >
             <AppBar/>
             {
               (isLoaded)?
             <ScrollView>
                 <TopContent/>
                 <Dealers/>
             </ScrollView>:
             <View
             style={{flex:1,justifyContent:'center',alignItems:'center'}}
             >
                 <Text style={{fontSize:13,fontWeight:'bold',opacity:0.5}} >Loading...</Text>
             </View>
             }
        </View>

        </HarvestingMachineSettingContext.Provider>
       
    )
}
export default HarvestingMachineSettings


const AppBar = ()=>{
    const {goBack,beltPrice,tirePrice,season,beltPriceActual,tirePriceActual,dealers} = useContext( HarvestingMachineSettingContext)
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
          
           if(dealers.length){
              Snackbar.show({
                text:DEALERSACCOUNTPENDING,
                textColor:'red'
              })
              return 

           }
            if(!tirePrice || !beltPrice){
                Snackbar.show({
                    text:INVALID,
                    textColor:'red'
                })
                return 
            } 
            await database.ref("HarvestingMachineSettings").update({
                tirePrice:parseFloat(tirePrice),
                beltPrice:parseFloat(beltPrice),season,
                tirePriceActual:-parseFloat(tirePriceActual)+parseFloat(tirePrice),
                beltPriceActual:-parseFloat(beltPriceActual)+parseFloat(beltPrice)
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

const TopContent = ()=>{
    const {season,setSeason,
           tirePrice,beltPrice,setBeltPrice,setTirePrice,setTirePriceActual,setBeltPriceActual,tirePriceActual,beltPriceActual
          } 
    = useContext(HarvestingMachineSettingContext)

    return <View
      style={{paddingHorizontal:10,borderBottomWidth:0.2,paddingBottom:20}}
    >
         <Text style={{marginTop:15,marginLeft:10,fontWeight:'bold',opacity:0.5,fontSize:12}} >{PERHOUR +` (${TIRE} , ${BELT})`}</Text>
         <View
            style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}
         >
            <View
                  style={{...style.textInput,marginTop:10,flex:1,marginLeft:5}}
                >
                      <TextInput
                        returnKeyType="done"
                        value={`${tirePrice}`}
                        onChangeText={(text)=>setTirePrice(text)}
                        keyboardType="number-pad"
                        style={{flex:1,marginLeft:20}}
                      />
            </View>
            <View
               style={{...style.textInput,marginTop:10,flex:1,marginLeft:5}}
             >
                   <TextInput
                     returnKeyType="done"
                     value={`${beltPrice}`}
                     keyboardType="number-pad"
                     onChangeText={(text)=>setBeltPrice(text)}
                     style={{flex:1,marginLeft:20}}
                   />
           </View>
        </View>
      
        
        <Text style={{marginTop:15,marginLeft:10,fontWeight:'bold',opacity:0.5,fontSize:12}} >{COMMISSION +` (${TIRE} , ${BELT})`}</Text>

        <View
            style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}
         >

         <View
               style={{...style.textInput,marginTop:10,flex:1,marginLeft:5}}
             >
                   <TextInput
                     returnKeyType="done"
                     value={`${tirePriceActual}`}
                     onChangeText={(text)=>setTirePriceActual(text)}
                     keyboardType="number-pad"
                     style={{flex:1,marginLeft:20}}
                   />
        </View>
        <View
               style={{...style.textInput,marginTop:10,flex:1,marginLeft:5}}
             >
                   <TextInput
                     returnKeyType="done"
                     value={`${beltPriceActual}`}
                     keyboardType="number-pad"
                     onChangeText={(text)=>setBeltPriceActual(text)}
                     style={{flex:1,marginLeft:20}}
                   />
        </View>

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

const Dealers = ()=>{
    // const {addDriver} = useContext(TractorSettingsContext)
    const {dealers,navigate,getDealers,actualSeason,settings} = useContext(HarvestingMachineSettingContext)
    return <View style={{marginTop:10}} >
      <View
        style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:10,}}
      >
          <Text style={{marginTop:10,marginLeft:10,fontWeight:'bold',fontSize:18,}} >{DEALERS}</Text>
          <TouchableOpacity
            onPress={()=>{navigate("HarvestingMachineLeasingPeople",{callBack:getDealers,season:actualSeason,settings})}}
          >
            <MaterialIcon
             name={"arrow-forward"}
             size={24}              
             style={{marginTop:12}}
            />
          </TouchableOpacity>
      </View>  
      <FlatList
        numColumns={3}
        showsVerticalScrollIndicator={false}
        style={{paddingTop:10,paddingHorizontal:2,marginHorizontal:8}}
        data={dealers}
        renderItem={({index,item})=>{
            return <MemberBox item={item} /> 
           
        }}
      />
    </View>
}

const MemberBox = ({item})=>{
  const refDeleteSheet = useRef() 
  const {navigate,getDealers,settings} = useContext(HarvestingMachineSettingContext)


 
  return <View>
         <TouchableWithoutFeedback
           onLongPress={()=>{
             Vibration.vibrate(50)
             refDeleteSheet.current.open()
           }}
              onPress={()=>navigate("HarvestingMachineLeasingPeopleDetails",{member:item,callBack:getDealers,settings})}
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
                       >{item.personalInfo.name}</Text>
                       <Text
                         style={{fontSize:10,opacity:0.5}}
                       >{item.personalInfo.location}</Text>
                   </View>
                     
             {/* <DeleteSheet number={item.number} refDeleteSheet={refDeleteSheet} item={item} />         */}
 
           </View>
        </TouchableWithoutFeedback> 
       </View>  
 
 }
 

const style = StyleSheet.create({
    textInput:{height:45,borderRadius:5,backgroundColor:Colors.searchBarColor,margin:10,flexDirection:'row',alignItems:'center' },
})