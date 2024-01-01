import React, { createContext ,useState,useContext} from 'react'
import { View,Text, TouchableOpacity} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'


const TRACTOR = "டிராக்டர்"

const TractorModuleContext = createContext()
const TractorModuleProvider = (props)=>{

    const goBack=()=>{
        props.navigation.goBack()
    }

    const navigate=(page,params)=>{
        props.navigation.push(page,params)
    }

    return <TractorModuleContext.Provider
     value={{
        goBack , navigate
      }}
    >
          <TractorModule/>
    </TractorModuleContext.Provider>
}

export default TractorModuleProvider

const TractorModule = ()=>{
    return <View
      style={{backgroundColor:'white',flex:1}}
    >
      <AppBar/>
    </View>
}

const AppBar=()=>{
    const {goBack,navigate} = useContext(TractorModuleContext)
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
        <TouchableOpacity
                onPress={()=>{navigate("TractorSettings")}}
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