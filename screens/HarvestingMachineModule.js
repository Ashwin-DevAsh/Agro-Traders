import React, { createContext, useContext} from 'react'
import { View, Text, TouchableOpacity, } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'


const HARVESTINGMACHINE = "இயந்திரம்"



const HarvestingModuleContext = createContext()

const HarvestingMachineModuleProvider = (props) => {

    const goBack = ()=>{
        props.navigation.goBack()
    }

    const navigate = (page,data)=>{
        props.navigation.push(page,data)
    }

    return (
      <HarvestingModuleContext.Provider
         value={{goBack,navigate}}
      >
         <HarvestingMachineModule/>
      </HarvestingModuleContext.Provider>  
    )
}

export default HarvestingMachineModuleProvider


const HarvestingMachineModule = ()=>{
    return  <View
        style={{flex:1,backgroundColor:'white'}}
    >
        <AppBar/>
  </View>
}


const AppBar = ()=>{
    const {goBack,navigate} = useContext(HarvestingModuleContext)
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
        <TouchableOpacity
               onPress={()=>{navigate("HarvestingMachineSettings")}}
                >
                <MaterialIcon
                    style={{marginLeft:10,marginTop:3}}
                     name={"settings"}
                     size={23}
                     color={'grey'}
              />
        </TouchableOpacity>
    </View>
}

