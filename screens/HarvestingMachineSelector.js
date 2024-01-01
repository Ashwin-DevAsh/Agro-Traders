import React, { createContext,  useContext, useState, useEffect, } from 'react'
import { View, Text, TouchableOpacity, ScrollView, TextInput,FlatList,StyleSheet,
          Dimensions,TouchableWithoutFeedback,Image} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import * as Colors from '../Assets/color'
import {blue} from '../Assets/color'
import {database} from '../database/firebase'



const SEARCH = "தேடல்"
const SELECTMACHINE = "இயந்திரத்தைத் தேர்வுசெய்"
const TIRE = "சக்கரம்"
const BELT = "பெல்ட்"
const MACHINETYPES = [TIRE,BELT]

const {width,height} = Dimensions.get('window')

const HarvestingMachineSelectorContext = createContext()
const HarvestingMachineSelector = (props) => {


    const {callBack,season} = props.navigation.state.params

    const goBack=()=>{
        props.navigation.goBack()
    }

    const getMachines=async()=>{
        setIsLoaded(false)
        const Machines = (await database.ref("HarvestingMachineSettings/Members/").once('value')).toJSON()
        var beltMachineTemp = []
        var tireMachineTemp = []

     
        for( var i in Machines){
          if(Machines[i].Active && Machines[i].Active.season==season){
            const allMachines = Machines[i].Active.Machine
            for(var machine in allMachines) {
              if(allMachines[machine].type===0)
                tireMachineTemp.push({
                    ...allMachines[machine],
                    id:machine,
                    ownerId:i
                })
              else
                beltMachineTemp.push({
                  ...allMachines[machine],
                  id:machine,
                  ownerId:i
                })
                  
            }
          }  
        }
        setTireMachines(tireMachineTemp)
        setTireMachinesTemp(tireMachineTemp)
        setBeltMachines(beltMachineTemp)
        setBeltMachinesTemp(beltMachineTemp)
        setIsLoaded(true)
    }

    const doSearch = (query)=>{
        setIsLoaded(false)
        const filteredMember = []
        const filterMachine = []
        beltMachineTemp.forEach((item)=>{
            if(item.ownerName.toLowerCase().includes(query.toLowerCase())){
                 filteredMember.push(item)
            }
        })
        tireMachineTemp.forEach((item)=>{
          if(item.ownerName.toLowerCase().includes(query.toLowerCase())){
               filterMachine.push(item)
          }
      } )
        setBeltMachines(filteredMember)
        setTireMachines(filterMachine)
        setQuery(query)
        setIsLoaded(true)
        return 
    }


    useEffect(()=>{
        getMachines()
    },[])

    const [isLoaded,setIsLoaded] = useState(false)
    const [query,setQuery] = useState("")

    const [tireMachine,setTireMachines] = useState([])
    const [tireMachineTemp,setTireMachinesTemp] = useState([])

    const [beltMachine,setBeltMachines] = useState([])
    const [beltMachineTemp,setBeltMachinesTemp] = useState([])

    const [module,setModule] = useState(1)




    return (
        <HarvestingMachineSelectorContext.Provider
           value={{goBack,query,setQuery,tireMachine,beltMachine,doSearch,callBack,module,setModule}}
        >
            <View
              style={{flex:1,backgroundColor:'white'}}
            >
               <AppBar/>
              
               {(isLoaded)?
               <ScrollView>
                  <SearchBar/>

                 { 
                  (!tireMachine.length)?<View/>:
                  <View
                          style={{marginHorizontal:25,marginTop:10,
                            flexDirection:'row',justifyContent:'space-between',alignItems:'center',
                            
                          }}
                        >
                            <Text
                               style={{fontWeight:'bold',color:'black',fontSize:14,
                                
                              }}
                            >{TIRE}</Text>
                             <TouchableOpacity
                                      
                                      >
                                          <MaterialIcon
                                          name={"more-horiz"}
                                          size={22}              
                                          style={{}}
                                      />
                              </TouchableOpacity>
                  </View>
                  }
                  <Machines machines={tireMachine} />
                 {
                  (!beltMachine.length)?<View/>: 
                  <View
                          style={{marginHorizontal:25,flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}
                        >
                            <Text
                               style={{fontWeight:'bold',color:'black',fontSize:14,marginTop:9,
                              }}
                            >{BELT}</Text>
                            <TouchableOpacity
                                      
                                      >
                                          <MaterialIcon
                                          name={"more-horiz"}
                                          size={22}              
                                          style={{}}
                                      />
                              </TouchableOpacity>
                  </View>
                  }
                  <Machines machines={beltMachine}/>
               </ScrollView>:
                            <View
                                style={{flex:1,justifyContent:'center',alignItems:'center'}}
                            >
                                    <Text style={{fontSize:13,fontWeight:'bold',opacity:0.5}} >Loading...</Text>
                            </View>
               }
            </View>
        </HarvestingMachineSelectorContext.Provider>

    )
}


const SearchBar=()=>{

    const {query,doSearch} = useContext(HarvestingMachineSelectorContext)

    return  <View
        style={{paddingLeft:10,paddingRight:10}}
     >
      <View
      style={{marginTop:25,height:40,marginHorizontal:10,borderRadius:10,paddingLeft:10,marginBottom:10,
              backgroundColor:Colors.searchBarColor,flexDirection:'row',alignItems:'center'}}
      >

          <MaterialIcon
              style={{opacity:0.5}}
              name={'search'}
              size={20}
          />

          <TextInput
              value={query}
              onChangeText={(text)=>{doSearch(text)}}
              style={{fontSize:15,flex:1,marginLeft:10}}
              placeholder={SEARCH}
          />
      </View>
     
   </View> 
}






const AppBar=()=>{
    const {goBack} = useContext(HarvestingMachineSelectorContext)
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
                style={{paddingHorizontal:5,fontSize:19,fontWeight:'bold',marginLeft:15,marginBottom:3,overflow:'hidden'}}
            >
                  {SELECTMACHINE}
          </Text>
        </View> 
         
    </View>
  }

const Machines = ({machines})=>{
   
    return <View
       style={{}}
    >

      <FlatList
        numColumns={3}
        showsVerticalScrollIndicator={false}
        style={{paddingTop:10,paddingHorizontal:2,marginHorizontal:8}}
        data={machines}
        renderItem={({index,item})=>{
            return <MemberBox item={item} /> 
        }}
      />

     
    </View>
}

const MemberBox = ({item})=>{
    // const refDeleteSheet = useRef() 
   
    const {callBack,goBack} = useContext(HarvestingMachineSelectorContext)
    return <View>
           <TouchableWithoutFeedback
             onLongPress={()=>{
               Vibration.vibrate(50)
               refDeleteSheet.current.open()
             }}
             onPress={()=>{
                 console.log(item)
                 goBack()
                 callBack(item)
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
                       style={{alignItems:'center',justifyContent: 'center'}}
                     >
                         <Text
                           style={{fontSize:13,fontWeight:'bold'}}
                         >{item.ownerName}</Text>
                         <Text
                           style={{fontSize:8,opacity:0.5,marginTop:3}}
                         >{item.machineName} - {item.driverName}</Text>
                     </View>
                       
   
             </View>
          </TouchableWithoutFeedback> 
         </View>  
   
}


export default HarvestingMachineSelector
