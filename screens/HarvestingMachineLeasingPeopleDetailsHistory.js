import React, { createContext, useContext, useState, useEffect } from 'react'
import { View, Text , ScrollView, TouchableOpacity, Dimensions, FlatList, TouchableWithoutFeedback, Image} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import * as Colors from '../Assets/color' 



const HISTORY = "வரலாறு"
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
const MACHINENAME = "இயந்திரத்தின் பெயர்"
const DONE = 'முடிந்தது'
const TIRE = "சக்கரம்"
const BELT = "பெல்ட்"
const MACHINETYPES = [TIRE,BELT]
const NODATAEXIST = 'தரவு எதுவும் இல்லை'
const PAID = "செலுத்தப்பட்டது"
const DELETE="அகற்று"
const OWNER = "உரிமையாளர்"
const DRIVERNUMBER = "டிரைவர் தொலைபேசி எண்"
const {width,height} = Dimensions.get('window')
const DETAILS = "விவரங்கள்"


const Context = createContext()
const HarvestingMachineLeasingPeopleDetailsHistory = (props) => {

   const {history} = props.navigation.state.params
   const [machines,setMachines] = useState([])



   const goBack = ()=>{
       props.navigation.goBack()
   }
   const navigate = (page,data)=>{
       props.navigation.push(page,data)
   }

   const getMachines=async()=>{
    const Machines = history.Machine
    var MachineTemp = []
    for(var i in Machines){
       MachineTemp.push({
           ...Machines[i],
           id:i
       })
    }

    setMachines(MachineTemp)

  }


   useEffect(()=>{
      getMachines()
   },[])

    return (
        <Context.Provider
           value={{goBack,history,machines,navigate}}
        >
                <View
                style={{flex:1,backgroundColor:'white'}}
                >
                    <AppBar/>
                     <ScrollView>
                         <OverAll/>
                         <Machines/>
                    </ScrollView>
                    
                </View>
        </Context.Provider>

    )
}


const AppBar=()=>{
    const {goBack} = useContext(Context)
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
                  {HISTORY}
          </Text>
        </View> 
         
    </View>
}

export const OverAll = ()=>{

    var {amount,totalAcer,totalTime,season,petrolAmount,date,finishDate} = useContext(Context).history
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
                 <View style={{width,height:60,flexDirection:'row',justifyContent:'center',alignItems:'center',
                     paddingHorizontal:20,paddingBottom:10,borderBottomWidth:0.5}}>
                      <Text style={{fontSize:10,opacity:0.5,fontWeight:'bold'}} >{DATE} : {date} - {finishDate}</Text>
                 </View> 
               </View>
         </View>
}

const Machines = ()=>{

    const {machines} = useContext(Context)
    return <View
       style={{minHeight:200}}
    >

     <View
        style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:10,}}
      >
          <Text style={{marginTop:10,marginLeft:10,fontWeight:'bold',fontSize:18,}} >{HARVESTINGMACHINE}</Text>
          <TouchableOpacity
          //  onPress={()=>{addMachine.current.open()}}
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

    </View>
}

const MemberBox = ({item})=>{
    const {navigate} = useContext(Context)
    const {season} = useContext(Context).history
    return <View>
           <TouchableWithoutFeedback
             onLongPress={()=>{
            
             }}

             onPress={()=>{
               if(item.Active){
                  navigate("HarvestingMachineDetails",{machine:{...item.Active,season,id:item.id},fromHistory:true})
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
                       
               
             </View>
          </TouchableWithoutFeedback> 
         </View>  
   
}

export default HarvestingMachineLeasingPeopleDetailsHistory
