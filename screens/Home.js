import React from 'react'
import { View ,ScrollView,Image ,Dimensions,Text,TouchableOpacity,TouchableNativeFeedback,StyleSheet} from 'react-native'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import * as Colors from '../Assets/color'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'




export default Home = (props)=>{


    return <View
     style={{flex:1,backgroundColor:'white'}}
    >
        <View
            style={{height:60,borderBottomWidth:0.1,
                    paddingRight:10,
                    backgroundColor:Colors.appBarColor,
                    flexDirection:'row',alignItems:'center',
                    justifyContent:'space-between',
                    elevation:2,shadowColor:'#000',shadowOffset:{height:2,width:2}
                }}
        >
              <View style={{flexDirection:'row',alignItems:'center',opacity:0.85}} >
                <TouchableOpacity
                  
                >
                    <Entypo
                        style={{padding:15}}
                        name="home"
                        size={25}
                        color={"black"}
                    />
                </TouchableOpacity>   
    
          
                <Text
                    style={{paddingHorizontal:5,fontSize:19,fontWeight:'bold'}}
                >
                    R M Traders
                </Text>
            </View>
        </View>

        <ScrollView
          style={{paddingTop:10}}
        >
               < Module image={require("../Assets/Images/agricultureModule.jpg")}
                        name={"வேளாண்மை"}
                        onPress={()=>{
                          
                        }}
               />
            
               < Module image={require("../Assets/Images/tractorModule.jpg")}
                        name = "டிராக்டர்" 
                        onPress={()=>{props.navigation.push('TractorModule')}}
               />
                  < Module image={require("../Assets/Images/machineModule.jpg")}
                        name="இயந்திரங்கள்"
                        onPress={()=>{props.navigation.push('HarvestingMachineModule')}}
               /> 
               < Module style={{marginBottom:20}} image={require("../Assets/Images/financeModule.jpg")}
                        name="நிதி" 
                        onPress={()=>{}}
                />     
               <View style={{height:20}} ></View> 
        </ScrollView>
    </View>
}


const Module = (props)=>{
    const {width,height} = Dimensions.get('window')
    return <TouchableOpacity
              onPress={()=>props.onPress()}
           ><View
                style={{width:width,paddingTop:10,paddingBottom:20,alignItems:'center',
                      }}
             >
                 <View
                     style={{height:(width/2)-5,width:(width)-21,borderRadius:10,borderWidth:0.1,alignItems:'center',opacity:1,
                            elevation:0.5,shadowColor:'#000',shadowOffset:{height:2,width:2},backgroundColor:'white'
                           }}
                 >
                     <Image
                         
                         style={{height:(width/2)-42,width:(width)-22,borderRadius:9,}}
                         source = {props.image}
                     />   
                     <View
                       style={{flexDirection:'row',flex:1,width:width-20,paddingHorizontal:10,alignItems:'center',justifyContent:'space-between',opacity:0.7}}
                     >
                        <Text
                            style={{fontWeight:'bold',}}
                        >{props.name}</Text>
                        <MaterialIcon
                          name={'arrow-forward'}
                          size={16}
                        />
                     </View>
                   
 
                 </View>
 
                       
           </View></TouchableOpacity> 
 
 }
 
 





