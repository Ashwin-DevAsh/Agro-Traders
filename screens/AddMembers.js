import React , {useState , useEffect} from 'react'
import { View , Text , StyleSheet ,ScrollView ,Dimensions , Image } from 'react-native'
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import * as Colors from '../Assets/color'
import Snackbar from 'react-native-snackbar'
import { database } from '../database/firebase'

const {height,width} = Dimensions.get('window')



const JOIN = "சேரு"

const NAME = "பெயர்"
const NUMBER = "தொலைபேசி எண்"
const LOCATION = "இடம்"

const BANK = "வங்கி விவரங்கள்"
const PERSONALDETAILS = "சொந்த விவரங்கள்"
const BUSSINESSLINKS = "வணிக இணைப்புகள்"

const ADDED = "சேர்க்கப்பட்டது"
const INVALID = "தவறான சான்றுகள்"
const EXIST = "பயனர் ஏற்கனவே உள்ளார்"
const UNDO = "செயல்தவிர்"

const ACCOUNTNUMBER = "கணக்கு எண்"
const IFSC = "ஐ.எஃப்.எஸ்.சி."
const RECNAME = "கணக்கின் பெயர்"
const BANKNAME = "வங்கி பெயர்"
const BRANCH = "வங்கிக்கிளை"

const DADNAME = "தந்தையின் பெயர்"
const UPDATED = "புதுப்பிக்கப்பட்டது"

const DETAILS = "விவரங்கள்"

const OWNERNAME = "உரிமையாளர் பெயர்"
const OWNERNUMBER = "உரிமையாளர் எண்"
const OWNERINFO = "உரிமையாளர் தகவல்"
const OWNERPLACE = "உரிமையாளர் இடம்"

export default AddMembers = (props)=>{



    const [name,setName] = useState("")
    const [number,setNumber] = useState("")
    const [location,setLocation] = useState("")
    const [dadName,setDadName] = useState("")
    const [ownerNumber,setOwnerNumber] = useState("")



    const [accNumber,setAccNumber] = useState("")
    const [ifsc,setIfsc] = useState("")

    const [bankName,setBankName] = useState("")
    const [branch,setBranch] = useState("")




    const {callBack,member,addPeople,isDealer} = props.navigation.state.params
    

    const onPress = async()=>{

      if(name!=="" && number!=="" && number.length==10 && location!=="" && accNumber!=="" && ifsc!=="" && dadName!=="" && bankName!=null && branch!=null){

        database.ref("MembersID").once('value',async(snapshot)=>{
              const membersID = await snapshot.val().ID
              console.log("this is member id  1",membersID)
           
              if(!member){
                 if(membersID.includes(number)){
                   Snackbar.show({
                     text: INVALID,
                     textColor:"white",
                     duration: Snackbar.LENGTH_LONG,
                   });  
                   return
                 }
                 membersID.push(number)
                 database.ref("MembersID").update({ID:membersID})
                 database.ref("Members").child("ID"+number).set({
                   personalInfo:{name,number,location,dadName},
                   bankInfo:{accNumber,ifsc,bankName,branch}
                 })

                 setTimeout(()=>{
                   Snackbar.show({
                     text: ADDED,
                     textColor:"white",
                     duration: Snackbar.LENGTH_LONG,
                   });  
               },1000)
               callBack && callBack()
               props.navigation.goBack()


             }else{
               
                 var newMember
                 if(number===member.personalInfo.number){
                   database.ref("Members").child("ID"+member.personalInfo.number).update({
                     personalInfo:{name,number,location,dadName},
                     bankInfo:{accNumber,ifsc,bankName,branch}
                   })
                   newMember = (await database.ref("Members").child("ID"+number).once('value')).toJSON()
                 }
                
                 
                 if(number!==member.personalInfo.number){
                     console.log("this is member id  1",membersID)
                     
                     if(membersID.includes(number)){
                       Snackbar.show({
                         text: INVALID,
                         textColor:"white",
                         duration: Snackbar.LENGTH_LONG,
                       });  
                       return
                     }

                     await database.ref("Members").child("ID"+member.personalInfo.number).update({
                       personalInfo:{name,number,location,dadName},
                       bankInfo:{accNumber,ifsc,bankName,branch}
                     })

                     newMember = (await database.ref("Members").child("ID"+member.personalInfo.number).once('value')).toJSON()

                     membersID.splice( membersID.indexOf(member.personalInfo.number))
                     membersID.push(number)
                     await database.ref("MembersID").update({ID:membersID})
                     await database.ref("Members").child("ID"+number).set({
                       ...newMember
                     }).then((a)=>{
                       database.ref("Members").child("ID"+member.personalInfo.number).remove()
                     })
                    

                     newMember = (await database.ref("Members").child("ID"+number).once('value')).toJSON()
                 }
                 console.log("The Member is = ",newMember)
                 callBack && callBack(newMember)
                 setTimeout(()=>{
                   Snackbar.show({
                     text: UPDATED,
                     textColor:"white",
                     duration: Snackbar.LENGTH_LONG,
                   });  
                 },1000)
                 props.navigation.goBack()

            }
         })



       

      } else{
         Snackbar.show({
               
           text: INVALID,
           textColor:"red",
           duration: Snackbar.LENGTH_LONG,

         });
      }


   
      }

    console.log(callBack)

    useEffect(() => {
      setTimeout(()=>{
        if(member){
          setName(member.personalInfo.name)
          setNumber(member.personalInfo.number)
          setLocation(member.personalInfo.location)
          setDadName(member.personalInfo.dadName)
          setAccNumber(member.bankInfo.accNumber)
          setIfsc(member.bankInfo.ifsc)
          setBankName(member.bankInfo.bankName)
          setBranch(member.bankInfo.branch)
      }

      },250)
     
      return () => {
       
      }
    }, [])




    return <View style={{flex:1,backgroundColor:'white'}}>
      <View
         style={{
             backgroundColor:'white',borderBottomWidth:0.1,flexDirection:'row',
             height:60,paddingHorizontal:10,alignItems:'center',justifyContent:'space-between',
             elevation:2,shadowColor:'#000',shadowOffset:{height:2,width:2}
         }}
      >
        <View
            style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
        >
          <TouchableOpacity
            onPress={()=>props.navigation.goBack()}
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
         

          <TouchableOpacity
             onPress={async()=>{

               if(addPeople){
                if(name!=="" && number!=="" && number.length==10 && location!=="" && accNumber!=="" && ifsc!=="" 
                   && bankName!=null && branch!=null ){
                     database.ref("HarvestingMachineSettings/MembersID").once('value',async(snapshot)=>{ 
                      const membersID = await snapshot.val().ID
                      
                        if(member){
                          var newMember
                          if(number===member.personalInfo.number){
                            database.ref("HarvestingMachineSettings/Members").child("ID"+member.personalInfo.number).update({
                              personalInfo:{name,number,location},
                              bankInfo:{accNumber,ifsc,bankName,branch}
                            })
                            newMember = (await database.ref("HarvestingMachineSettings/Members").child("ID"+number).once('value')).toJSON()
                          }

                          if(number!==member.personalInfo.number){

                          
                              
                              if(membersID.includes(number)){
                                Snackbar.show({
                                  text: INVALID,
                                  textColor:"white",
                                  duration: Snackbar.LENGTH_LONG,
                                });  
                                return
                              }

                              await database.ref("HarvestingMachineSettings/Members").child("ID"+member.personalInfo.number).update({
                                personalInfo:{name,number,location},
                                bankInfo:{accNumber,ifsc,branch,bankName}
                              })

                              newMember = (await database.ref("HarvestingMachineSettings/Members").child("ID"+member.personalInfo.number).once('value')).toJSON()

                              membersID.splice(membersID.indexOf(member.personalInfo.number))
                              membersID.push(number)
                              await database.ref("HarvestingMachineSettings/MembersID").update({ID:membersID})
                              await database.ref("HarvestingMachineSettings/Members").child("ID"+number).set({
                                ...newMember
                              }).then((a)=>{
                                database.ref("HarvestingMachineSettings/Members").child("ID"+member.personalInfo.number).remove()
                              })
                            

                              newMember = (await database.ref("HarvestingMachineSettings/Members").child("ID"+number).once('value')).toJSON()
                          }

                        callBack(newMember)
                        props.navigation.goBack()
                        return
                      }

                      if(!member){
                        if(membersID.includes(number)){
                          Snackbar.show({
                            text: INVALID,
                            textColor:"white",
                            duration: Snackbar.LENGTH_LONG,
                          });  
                          return
                        }
                        membersID.push(number)
                        database.ref("HarvestingMachineSettings/MembersID").update({ID:membersID})
                        database.ref("HarvestingMachineSettings/Members").child("ID"+number).set({
                          personalInfo:{name,number,location},
                          bankInfo:{accNumber,ifsc,bankName,branch}
                        })
       
                        setTimeout(()=>{
                          Snackbar.show({
                            text: ADDED,
                            textColor:"white",
                            duration: Snackbar.LENGTH_LONG,
                          });  
                      },1000)
                      callBack && callBack()
                      props.navigation.goBack()
       
       
                     }  
 
                      })

                } else{
                  Snackbar.show({
                    text: INVALID,
                    textColor:"red",
                    duration: Snackbar.LENGTH_LONG,

                  });
                }
                  

             }else onPress()}}
          >
             <MaterialIcon
                name={'done'}
                size={25}
                color={'black'}
             />
          </TouchableOpacity>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingTop:10}}
      >
          
           <View style={{flexDirection:'row',alignItems:'center',paddingLeft:10,opacity:0.8}}>
            
          </View>

          {/* <Text
                style={{paddingHorizontal:5,fontSize:14,fontWeight:'bold',marginLeft:15,marginTop:20,marginBottom:5}}
            >
                  {isDealer?OWNERINFO:PERSONALDETAILS}
          </Text> */}

          
          <View
            style={style.textInput}
          >
                <MaterialIcon
                    name={"person"}
                    size={20}
                    style={{marginHorizontal:10,opacity:0.5}}
                />
                <TextInput
                  value={name}
                  onChangeText={(text)=>setName(text)}
                  style={{flex:1}}
                  placeholder={isDealer?OWNERNAME:NAME}
                />
          </View>

          <View
            style={style.textInput}
           >
                <MaterialIcon
                    name={"location-on"}
                    size={20}
                    style={{marginHorizontal:10,opacity:0.5}}
                />
                <TextInput
                value={location}
                onChangeText={(text)=>setLocation(text)}
                style={{flex:1}}
                placeholder={isDealer?OWNERPLACE:LOCATION}
                />
          </View>

          
          <View
            style={style.textInput}
           >
                <MaterialIcon
                    name={"call"}
                    size={20}
                    style={{marginHorizontal:10,opacity:0.5}}
                />
                <TextInput
                value={number}
                keyboardType="number-pad"
                onChangeText={(text)=>setNumber(text)}
                style={{flex:1}}
                placeholder={isDealer?OWNERNUMBER:NUMBER}
                />
          </View>
          {
           !isDealer && <View
            style={style.textInput}
           >
                
                <MaterialIcon
                    name={"people"}
                    size={20}
                    style={{marginHorizontal:10,opacity:0.5}}
                />
                
                <TextInput
                  value={dadName}
                  onChangeText={(text)=>setDadName(text)}
                  style={{flex:1}}
                  placeholder={ DADNAME}
                />
          </View>
          }
         

          <View style={{flexDirection:'row',alignItems:'center',paddingLeft:10,opacity:0.8}}>
        
           
          </View>
          {/* <Text
                style={{paddingHorizontal:5,fontSize:14,fontWeight:'bold',marginLeft:15,marginTop:20,marginBottom:5}}
            >
                  {BANK}
          </Text> */}
          <View
            style={style.textInput}
           >
                <TextInput
                  value={bankName}
                  onChangeText={(text)=>setBankName(text)}
                  style={{flex:1,marginLeft:20}}
                  placeholder={BANKNAME}
                />
          </View>
          <View
            style={style.textInput}
           >
               
                <TextInput
                  value={branch}
                  onChangeText={(text)=>setBranch(text)}
                  style={{flex:1,marginLeft:20}}
                  placeholder={BRANCH}
                />
          </View>

         
          <View
            style={style.textInput}
          >
                <TextInput
                value={accNumber}
                keyboardType="number-pad"
                onChangeText={(text)=>setAccNumber(text)}
                style={{flex:1,marginLeft:20}}
                placeholder={ACCOUNTNUMBER}
                />
          </View>

          <View
            style={style.textInput}
           >
                <TextInput
                value={ifsc}
                onChangeText={(text)=>setIfsc(text)}
                style={{flex:1,marginLeft:20}}
                placeholder={IFSC}
                />
          </View>
          <View style={{height:40}} ></View>
      </ScrollView>
    </View>
}



const style = StyleSheet.create({
   textInput:{height:45,borderRadius:10,backgroundColor:Colors.searchBarColor,margin:15,flexDirection:'row',alignItems:'center'}
})