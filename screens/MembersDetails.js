import React,{useState,useEffect} from 'react'
import { View , Text , Dimensions , Image , Linking, StyleSheet , TouchableWithoutFeedback} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { TouchableOpacity, ScrollView, FlatList, TouchableNativeFeedback } from 'react-native-gesture-handler'
import * as Colors from '../Assets/color'
import { database } from '../database/firebase'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'



const {width,height} = Dimensions.get('window') 
const BANK = "வங்கி விவரங்கள்"
const BUSSINESSLINKS = "வணிக இணைப்புகள்"

const FINANCE = "நிதி"

const MEMBER = "உறுப்பினர்"

const INVERSTMENT = "முதலீடு"
const GOT = "கிடைத்தது"

const SONOF = "மகன்"

const TRACTOR = "டிராக்டர்"

const HARVESTINGMACHINE = "இயந்திரம்"

const AGRICULTURE = "வேளாண்மை"

const LABOUR = "தொழிலாளர்"

const CEREALS = "தானியங்கள்"



export default MembersDetails = (props) => {

   const [member,setMember] = useState(props.navigation.state.params.member)
   const callBack = props.navigation.state.params.callBack

   const [inverstment ,setInverstment] = useState(0)
   const [got,setGot] = useState(0)

   const module = [
     {name:FINANCE,
      imageOffset:{height:65,width:72},
      image:require("../Assets/Images/money.png"),
      isActive:member.Finance && member.Finance.Active,
      onPress:()=>{props.navigation.push("Finance",{member,callBack:getUserStatus});console.log("clicked")}
     },
     {
      imageOffset:{height:57,width:75,}, 
      name:TRACTOR,
      isActive:member.Tractor && member.Tractor.Active,
      image:require("../Assets/Images/tractor.png"),
      onPress:()=>{props.navigation.push("Tractor",{member,callBack:getUserStatus});console.log("clicked")}
     },
     {
      imageOffset:{height:60,width:78,}, 
      name:HARVESTINGMACHINE,
      isActive:member.HarvestingMachine && member.HarvestingMachine.Active,
      image:require("../Assets/Images/machine.png"),
      onPress:()=>{props.navigation.push("HarvestingMachine",{member,callBack:getUserStatus});console.log("clicked")}
     },
     {
      imageOffset:{height:60,width:70,}, 
      name:AGRICULTURE,
      isActive:member.Agriculture && member.Agriculture.Active,
      image:require("../Assets/Images/agriculture.png"),
      onPress:()=>{props.navigation.push("Tracto",{member,callBack:getUserStatus});console.log("clicked")}
     }
     ,
      {
      imageOffset:{height:65,width:73,}, 
      name:LABOUR,
      isActive:member.Labour && member.Labour.Active,
      image:require("../Assets/Images/Labour.png"),
      onPress:()=>{props.navigation.push("Tracto",{member,callBack:getUserStatus});console.log("clicked")}
     },
     {
      imageOffset:{height:65,width:73,}, 
      name:CEREALS,
      isActive:member.Cereals && member.Cereals.Active,
      image:require("../Assets/Images/cereals.png"),
      onPress:()=>{props.navigation.push("Tracto",{member,callBack:getUserStatus});console.log("clicked")}
     }
    ]


   const getUserStatus=async()=>{
        console.log("BackCalled")
        var finData = (await database.ref(`Members/ID${member.personalInfo.number}/Finance`).once('value')).toJSON()
        setInverstment(finData.inverstment)
        setGot(finData.inverstment-finData.pending+finData.overAllProfit) 
        callBack()
   }

   const getUpdate=async(newMember)=>{
      console.log("back memeber is = ",newMember)
      setMember({...newMember,key:`ID${newMember.personalInfo.number}`})
      callBack()
   }

   useEffect(() => {
        if(member.Finance){
            if(member.Finance.inverstment){
                setInverstment(member.Finance.inverstment)
            }
            if(member.Finance.overAllProfit){
                 setGot(member.Finance.inverstment-member.Finance.pending+member.Finance.overAllProfit) 
            }
        }
       return () => {
           
       }
   }, [])


   return <View
     style={{flex:1,backgroundColor:'white'}}
   >
       <View style={{height:60,flexDirection:'row',alignItems:'center',paddingHorizontal:10,
                      elevation:2,shadowColor:'#000',shadowOffset:{height:2,width:2},backgroundColor:'white',
                     borderBottomWidth:0.1,justifyContent:'space-between'}} >

       <View
         style={{flexDirection:'row',alignItems:'center'}}
       >
         <TouchableOpacity
            onPress={()=>props.navigation.goBack()}
         >
           <MaterialIcons
              name={'arrow-back'}
              size={25}

           />
          </TouchableOpacity> 

          <Text
            style={{paddingHorizontal:5,fontSize:19,fontWeight:'bold',marginLeft:15,marginBottom:3}}
                >
              {MEMBER}
          </Text>
       </View>
              <TouchableOpacity
                   //   onPress={()=>refAddMembers.current.open()}   
                   onPress={()=>{props.navigation.push('AddMembers',{member:member,callBack:getUpdate})}}
                >
                    <FontAwesome5
                        style={{paddingRight:5,marginLeft:10}}
                        name="user-edit"
                        size={20}
                        color={"grey"}
                    />
                </TouchableOpacity>   
       </View>

       <ScrollView
         showsVerticalScrollIndicator={false}
       >
             <View
               style={{paddingTop:20,paddingHorizontal:20,paddingBottom:30}}
             >
                <View
                        style={{alignItems:'center',justifyContent:'flex-start',alignItems:'center',flexDirection:'row'}}
                >
                    <Image
                        style={{height:120,width:120,borderRadius:80,marginBottom:10,}}
                        source={require('../Assets/Images/avatar.png')}
                    />

                    
               <View style={{paddingHorizontal:30,justifyContent:'center',alignItems:'center'}}>
                   <Text
                     style={{fontWeight:'bold',fontSize:18,marginBottom:5}}
                   >
                       {parseInt(inverstment)}₹
                   </Text>
                   <Text
                     style={{fontSize:12}}
                   >
                     {INVERSTMENT}
                   </Text>
               </View>

               <View style={{paddingHorizontal:30,justifyContent:'center',alignItems:'center'}}>
                   <Text
                     style={{fontWeight:'bold',fontSize:18,marginBottom:5}}
                   >
                       {parseInt(got)}₹
                   </Text>
                   <Text
                     style={{
                      fontSize:12
                     }}
                   >
                      {GOT}
                   </Text>
               </View>

               </View>

               <View
                 style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}
               >

                <View
                    style={{paddingLeft:10,paddingTop:25,flex:1}}
                >
                    <Text style={{fontWeight:'bold'}}>
                        {member.personalInfo.name}
                    </Text>
                    <Text style={{paddingTop:5,fontSize:13,opacity:0.7}}>
                     {member.personalInfo.dadName} {SONOF} ,  {member.personalInfo.location}
                    </Text>
                    

                </View>

                <TouchableOpacity
                   onPress={()=>{Linking.openURL(`tel:${member.personalInfo.number}`)}}
                >
                    <MaterialIcons
                    style={{paddingRight:5,paddingTop:15}}
                    size={23}
                    name={'phone'}
                    color={Colors.primaryColor}
                    />
                </TouchableOpacity>
               </View>
             </View>
    
             {
                <View
                 style={{marginTop:5,marginHorizontal:10}}
                    >
                    <FlatList
                        data={module}
                        numColumns={3}
                        renderItem={({item})=>{
                            return <Module name={item.name} isActive={item.isActive} image={item.image} onPress={item.onPress} imageOffset={item.imageOffset}/>
                        }}
                    />
               </View>
             }
             <View
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
                     <Text style={{fontWeight:'bold',fontSize:18}} >{member.bankInfo.bankName}</Text>
                     <Text style={{fontWeight:'bold',opacity:0.6}} >{member.bankInfo.branch}</Text>
                     
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
                     >{member.bankInfo.accNumber}</Text>
                      <Text
                        style={{opacity:0.5,marginTop:10,marginLeft:5}}
                     >{member.bankInfo.ifsc}</Text>
                 </View>

             </View>
       </ScrollView>

   </View>
}


const Module = ({name,image,onPress,imageOffset,isActive}) => {
  
    return<View
          style={{width:(width/3)-10,alignItems:'center',justifyContent:'center',marginBottom:20}}
        >
            <View style={{alignItems:'center',justifyContent:'center'}} >
            <TouchableWithoutFeedback
                onPress={()=>{onPress && onPress()}}
            >
                <View
                    style={{height:(width/3)-40,width:(width/3)-40,
                            borderWidth:0.05,borderRadius:10,shadowOffset:{height:2,width:2},
                            shadowColor:'#000',shadowOpacity:0.5,elevation:1,backgroundColor:'white',
                            justifyContent:"center",alignItems:'center'}}
                >
                    <Image source={image} style={{...imageOffset}}/>
                   
                </View>  
                </TouchableWithoutFeedback> 
                <View
                  style={{flexDirection:'row',marginLeft:8}}
                >
                  <Text style={{fontSize:12,fontWeight:'bold',marginTop:15}}>
                        {name!=null?name:"Module"}
                  </Text> 
                  <View
                     style={{height:8,width:8,borderRadius:10,backgroundColor:isActive?"red":'white',
                             marginTop:10,...(!isActive)?{}:{elevation:0.5,shadowColor:'#000',shadowOffset:{height:2,width:2}}}}
                  >

                  </View>

                </View>
                
            
            </View>
         </View>   
    
}




const style = StyleSheet.create({
    moduleBar : {width:(width-60)/2,height:40,borderRadius:20,borderWidth:0.1,justifyContent:'center',alignItems:'center'}
})