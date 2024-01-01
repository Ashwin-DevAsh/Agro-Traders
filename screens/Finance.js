import React ,{useState,useEffect,useRef} from 'react'
import { View,Text,StyleSheet ,Dimensions ,CheckBox, Image, Button,TouchableNativeFeedback,TouchableOpacity,TouchableWithoutFeedback , Linking, Vibration, Alert} from 'react-native'
import { ScrollView, FlatList, TextInput } from 'react-native-gesture-handler'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { primaryColor, blue } from '../Assets/color';
import Entypo from 'react-native-vector-icons/Entypo'
import {database} from '../database/firebase'
import RBSheet from "react-native-raw-bottom-sheet";
import * as Progress from 'react-native-progress';
import * as Colors from '../Assets/color'
import Snackbar from 'react-native-snackbar'
import ToggleSwitch from 'toggle-switch-react-native'
import Foundation from 'react-native-vector-icons/Foundation'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {width,height} = Dimensions.get('window')
import Dialog, { DialogFooter,DialogContent, DialogButton } from 'react-native-popup-dialog';
import AwesomeAlert from 'react-native-awesome-alerts';


const FINANCE = "நிதி"
const ACTIVE = "செயலில்"
const HISTORY = "வரலாறு"
const PENDING = "நிலுவை"
const INITIALAMOUNT = "ஆரம்ப தொகை"
const RETURN = "திரும்பிய தொகை"
const INTERST = "வட்டி"
const LASTPAYMENT = "கடைசி வைப்பு"
const MONTH = "மாதம்"
const INTEREST = "வட்டி"
const DATE = "தேதி"
const SECURITYPERSON = "பாதுகாப்பு நபர்"
const DONE = "முடிந்தது"
const INVALID = "தவறான சான்றுகள்"
const NOACTIVE = "செயலில் எதுவும் இல்லை"
const NEWLOAN = "புதிய கடன்"
const INTERSTAMOUNT = "வட்டி தொகை"
const AMOUNT = "தொகை"
const PAID = "செலுத்தப்பட்டது"
const SUCESSFULLYDONE = "வெற்றிகரமாக முடிந்தது"
const NUMBER = "தொலைபேசி எண்"
const LOCATION = "இடம்"
const CHANGE = "மாற்றவும்"
const LOANCOMPLETED = "கடன் முடிந்தது"
const AREYOUSURE = "நீங்கள் சொல்வது உறுதியா"
const YES = "ஆம்"
const OLD = "பழைய"
const ORIGINALAMOUNT = "அசல்"
const OVERALLAMOUNT = "ஒட்டுமொத்தம்"
const FINISHTHELOAN = "கடனை முடிக்கவும்"
const FINISHWITHADD = "கடனை முடித்து நிலுவையில் வட்டி சேர்க்கவும்"
const DELETELOAN = "அகற்று"
const ADDINTEREST = "வட்டியை சேர்க்க"
const RENEWLOAN = "கடனை புதுப்பிக்கவும்"
const LOANRENEWED = "கடன் புதுப்பிக்கப்பட்டது"
const INVERSTMENT = "முதலீடு"
const GOT = "கிடைத்தது"
const INTERESTPENDING="வட்டி நிலுவையில் உள்ளது"
const CONFIRMRENEW = (amount,interst)=>`உள்ளிட்ட தொகை ${amount}₹ மற்றும் வட்டி ${interst}% ஆகும்`
const OK = "சரி"
const CANCEL = "ரத்துசெய்" 
const NO = 'இல்லை'
const CONFIRM =  "உறுதிப்படுத்துகிறீர்களா"

                           


const dayDiff=(timeStamp,month=0)=>{
  var msDiff = + new Date() - timeStamp;   
  var daysTill30June2035 = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  var monthTemp = parseInt(daysTill30June2035/30)+1
  return monthTemp-month
}



export default Finance = (props) => {

    const [module,setModule] = useState(1)


    const refRBSheet = useRef()
    const refIntrestSheet = useRef()
    const refReturnSheet = useRef()
    const refCloseSheet = useState()

    const refDeleteSheet = useRef()
    const [isActiveExist,setIsActiveExist] = useState(null)
    const [isHistoryExist,setIsHistoryExist] = useState(null)

    const [amount , setAmount] = useState("")
    const [interst , setInterst] = useState("")
    const [activity , setActivity] = useState([{amount:'-',date:'-',key:'None1',pending:''}])
    const [history,setHiory] = useState([])

    const [number,setNumber] = useState("")
    const [place,setPlace] = useState("")
    

    var today = new Date();

    const [securityPerson,setSecurityPerson] = useState("")
    const date =  today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+ today.getFullYear()

    const [oldPending,setOldPending] = useState(0)

    const [finance,setFinance] = useState(null)

    const [days,setDays] = useState(0)

    const [year,setYear] = useState((new Date()).getFullYear())

    const member = props.navigation.state.params.member
    const callBack =  props.navigation.state.params.callBack

    console.log("the memeber is ",member)

    const [isLoading, setIsLoading] = useState(null)
    

    const [histReturn,setHistReturn] = useState(0)
    const [histAmount,setHistAmount] = useState(0)


 const Badge = ({days})=>{
     if(days==0 || !isActiveExist){
        return <View></View>
     }else{

      return <View
              style={{height:18,width:18,borderRadius:10,elevation:2,marginLeft:15,
                    backgroundColor:'red',justifyContent:'center',alignItems:'center',
                    shadowColor:'#000',shadowOpacity:0.5,shadowOffset:{height:2,width:2}}}
              >
                      <Text
                        style={{fontSize:10,fontWeight:'bold',color:'white',padding:3}}
                      >
                        {days}
                      </Text>
            </View>

     }
  
   } 

  const deleteActive = async()=>{
    refDeleteSheet.current.close()
    getFinanceDetails()
      setTimeout(()=>{
          getFinanceDetails()
          Snackbar.show({
            duration:Snackbar.LENGTH_LONG,
            text:SUCESSFULLYDONE,
            textColor:'white'
          })
      },1000)
   
      await database.ref("Members/").child(member.key).child("Finance").child("Active").remove()
     
    
   }


   const getHistoryDetails = async()=>{

    setIsLoading(null) 
    getFinanceDetails()
    var histAm = 0
    var histRe = 0
    const memberDetails = (await database.ref("Members/"+member.key).once('value')).toJSON()
    if(memberDetails.Finance)
        if(memberDetails.Finance.History){
          setIsHistoryExist(memberDetails.Finance.History)
          const histories = memberDetails.Finance.History
          var temp = [] 
          for(var history in histories){
              if(histories[history].date.endsWith(year)){
                temp.push(histories[history])
                histAm=histAm+histories[history].actualAmount
                histRe=histRe+histories[history].return+histories[history].profit
              }
          }

          temp.sort((a,b)=>{
            if(new Date(b.timeStamp).getTime()>new Date(a.timeStamp).getTime()){
              return 1
            }else{
              return -1
            }
          })
          setHiory(temp)
          
      }else{
          setIsHistoryExist(false)
      }
      setHistReturn(histRe)
      setHistAmount(histAm)    
      setIsLoading(true)

   }


   const getFinanceDetails = async()=>{
    
     const memberDetails = (await database.ref("Members/"+member.key).once('value')).toJSON()
     var daysTimeStamp = 0;
     if(memberDetails.Finance){
      if(memberDetails.Finance.Active){
          daysTimeStamp=memberDetails.Finance.Active.timeStamp
          setDays(dayDiff(daysTimeStamp))
          setIsActiveExist(memberDetails.Finance.Active)
          if(memberDetails.Finance.Active.Activity){
            var temp = [{amount:'-',date:'-',key:'None1',pending:'',timeStamp:0,index:0}]
            var data = memberDetails.Finance.Active.Activity
            var month = 1;
            for(var i in data){
              var obj = data[i]
              if(obj.pending){
                temp.push({
                    amount:obj.amount,  //imp
                    date:obj.date,  //imp
                    key:month++,
                    pending:obj.pending,  //imp
                    timeStamp:obj.timeStamp,
                    id:i
                })
              }else{
                temp.push({
                    amount:obj.amount,  //imp
                    date:obj.date,   //imp
                    key:i, 
                    timeStamp:obj.timeStamp,
                    id:i
                })
              }
            }
            temp.sort((a,b)=>{
              if(new Date(a.timeStamp).getTime()>new Date(b.timeStamp).getTime()){
                return 1
              }else{
                return -1
              }
              
            })
            setDays(dayDiff(daysTimeStamp,month-1))
            setActivity(temp)
          }else{
              setActivity([{amount:'-',date:'-',key:'None1',pending:''}])
          }
          setFinance(memberDetails.Finance)
      }else{
          setIsActiveExist(false)
      }


      if(memberDetails.Finance.pending){
        setOldPending(memberDetails.Finance.pending)
      }
    }else{
        setIsActiveExist(false)
    }
  
   }

    useEffect(() => {
   
      getHistoryDetails()

      return () => {
          setActivity([{}])
      }
    }, [year])


    return <View style={{flex:1,backgroundColor:'white'}} >
        <View
          style={{height:60,borderBottomWidth:0.1,flexDirection:'row',
                 elevation:2,shadowColor:'#000',shadowOffset:{height:2,width:2},backgroundColor:'white',
                 alignItems: 'center',paddingHorizontal:10,justifyContent:'space-between'}}
        >

              <View
                style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
              >


                <TouchableOpacity
                  onPress={()=>props.navigation.goBack()}
                >
                      <MaterialIcon
                          name="arrow-back"
                          size={25}
                      />
                </TouchableOpacity>

                
                <Text
                        style={{paddingHorizontal:5,fontSize:19,fontWeight:'bold',marginLeft:15,marginBottom:3}}
                    >
                      
                  {FINANCE}
                </Text>

             </View>

             {(isActiveExist==null || !isActiveExist )?<View
                 style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
             >

                 {(isActiveExist!=null)? <TouchableOpacity
                        onPress={()=>{refRBSheet.current.open()}}
                      >
                            <Image
                              tintColor={'grey'}
                              style={{height:22,width:22,backgroungColor:'grey',marginHorizontal:10}}
                              source={require('../Assets/Images/appBarRenew.png')}
                            />
                    </TouchableOpacity>
                  :<View/>
                 }

             </View>: <View
               style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}
             >
                
                <TouchableOpacity
                    onPress={()=>{refIntrestSheet.current.open()}}
                  >
                         <Image
                            tintColor={'grey'}
                            style={{height:23,width:23,backgroungColor:'grey',marginHorizontal:10}}
                            source={require('../Assets/Images/appBarInterest.webp')}
                          />

                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>{refReturnSheet.current.open()}}
                  >
                    <Image
                       tintColor={'grey'}
                       style={{height:25,width:25,backgroungColor:'grey',marginHorizontal:10}}
                       source={require('../Assets/Images/appBarReturn.webp')}
                    />

                  </TouchableOpacity>
                 
                  <TouchableOpacity
                    onPress={()=>{
                      refCloseSheet.current.open()
                    }}
                  >
                    <Image
                       tintColor={'grey'}
                       style={{height:22,width:22,backgroungColor:'grey',marginHorizontal:10}}
                       source={require('../Assets/Images/appBarRenew.png')}
                    />

                  </TouchableOpacity>

               

             </View>
             }
            
        </View>
        <ScrollView>

        <View
                style={{height:40,paddingHorizontal:20,flexDirection:'row',justifyContent:'space-between',marginTop:20,marginBottom:10}}
             >

                 
                 <TouchableOpacity
                   onPress={()=>setModule(1)}
                   onLongPress={()=>{
                    if(isActiveExist){
                      Vibration.vibrate(50,false)
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
                                   <Badge days={days} />
                                </View>
                                
                            </View>:<View
                                style={{...style.moduleBar ,flexDirection:'row',alignItems:'center',justifyContent:'center' }}
                            >
                                <Text style={{fontSize:12,fontWeight:'bold',color:'grey',position:'absolute'}} > {ACTIVE} </Text>
                                <View
                                  style={{alignItems:'flex-end',flex:1,marginRight:25}}
                                >
                                   <Badge days={days} />
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


             </View>

            {
            (isActiveExist==null)?
                    <View
                       style={{height:(height-200)/2,justifyContent:'flex-end',alignItems:'center'}}
                    >
                             <Text style={{fontSize:13,fontWeight:'bold',opacity:0.5}} >Loading...</Text>
                    </View>
          
            :

            (module==1)?(isActiveExist)?<View>
             
             <View
               style={{height:170,width:width,justifyContent:'center',alignItems:'center',marginBottom:20}}
               
             >
               {
       
                     <View
                        style={{height:125,width:125,borderRadius:200,justifyContent:'center',alignItems:'center',borderWidth:0.5,marginTop:20}}
                      >
                          <Text style={{color:"black",fontSize:25,fontWeight:'bold'}} >
                              {(isActiveExist.amount-isActiveExist.return).toString().split(".")[0]}₹
                          </Text>
                            <Text style={{opacity:0.5,fontSize:13}} >{PENDING}</Text>
                      </View>
           
               }

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
                        {isActiveExist.amount}₹
                     </Text>
                     
                     <Text style={{fontSize:12,color:'purple',fontWeight:'bold'}}>
                        {OVERALLAMOUNT}
                     </Text>

                 </View>
                 <View
                   style={{justifyContent:'center',alignItems:'center'}}
                 >

                     <Text
                       style={{fontSize:15,fontWeight:'bold',color:'green'}}
                     >
                         {isActiveExist.actualAmount}₹
                     </Text>
                     
                     <Text style={{fontSize:12,color:'green',fontWeight:'bold'}}>
                        {ORIGINALAMOUNT}
                     </Text>

                 </View>
                 <View
                     style={{justifyContent:'center',alignItems:'center',}}

                 >

                      <Text
                          style={{fontSize:15,fontWeight:'bold',color:'red'}}
                        >
                          {isActiveExist.interst}%
                      </Text>
                        
                      <Text style={{fontSize:12,color:'red',fontWeight:'bold'}}>
                          {INTERST}
                      </Text>

                 </View>
                 <View
                      style={{justifyContent:'center',alignItems:'center', }}

                 >


                      <Text
                          style={{fontSize:15,fontWeight:'bold',color:'orange'}}
                        >
                          {((isActiveExist.amount-isActiveExist.return)*isActiveExist.interst/100)*days}
                      </Text>
                        
                      <Text style={{fontSize:12,color:'orange',fontWeight:'bold'}}>
                          {INTERST} {PENDING}
                      </Text>
                 </View>
                 
             </View>

             <View style={{width,height:60,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingHorizontal:20,}}>
              <Text style={{fontSize:10,opacity:0.5,fontWeight:'bold'}} >{DATE} : {isActiveExist.date}</Text>
             </View> 

             <View>
                <View style={{height:85,flexDirection:'row',alignItems:`center`,paddingHorizontal:20,justifyContent:'space-between',borderBottomWidth:0.5,paddingBottom:30}} >
                            <View style={{flexDirection:'row',alignItems:`center`}} > 
                            <View>
                                <View
                                style={{height:55,width:55,borderRadius:57.5,borderWidth:0.6,borderColor:'grey',alignItems:'center',justifyContent:'center'}}
                                >
                                    <Image
                                        style={{height:50,width:50,borderRadius:25,padding:10}}
                                        source={require('../Assets/Images/avatar.png')}
                                    />
                                </View> 
                            </View>
                            <View style={{paddingLeft:20}} >
                                <Text
                                    style={{fontWeight:'bold',fontSize:16,marginTop:2}}
                                >
                                {isActiveExist.securityPerson}
                                </Text>
                                <Text
                                    style={{fontSize:14,opacity:0.7,marginTop:2}}
                                >
                                {isActiveExist.location}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                        onPress={()=>{Linking.openURL(`tel:${isActiveExist.number}`)}}
                          >
                          <MaterialIcon
                          style={{paddingRight:5}}
                          size={23}
                          name={'phone'}
                          color={Colors.primaryColor}
                          />
                      </TouchableOpacity>
                        </View>
              </View>

             <Activity activity={activity} days={days} isActiveExist={isActiveExist} getFinanceDetails={getFinanceDetails} member={member} />

             <View style={{height:100}} />
             
             </View>:<View
                 style={{justifyContent:'center',alignItems:'center'}}
             >
             </View>:




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
                                  {parseInt(histAmount)}₹
                              </Text>
                              <Text
                                style={{}}
                              >
                                {INVERSTMENT}
                              </Text>
                          </View>

                          <View style={{paddingHorizontal:30,justifyContent:'center',alignItems:'center'}}>
                              <Text
                                style={{fontWeight:'bold',fontSize:20,marginBottom:5}}
                              >
                                  {parseInt(histReturn)}₹
                              </Text>
                              <Text
                                style={{

                                }}
                              >
                                  {GOT}
                              </Text>
                          </View>

                          </View>
                            <GestureRecognizer
                             
                              onSwipeLeft={async()=>{
                                setHiory([])

                                setYear(year+1)
                                // setHiory([])
                                // getHistoryDetails()
                              }}
                              onSwipeRight={async()=>{
                                setHiory([])

                                setYear(year-1)
                                // setHiory([])
                                // getHistoryDetails()
                              }}
                            >
                            <View
                                style={{height:45,borderRadius:10,borderWidth:0.1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}
                            >
                              <TouchableOpacity
                                  style={{marginHorizontal:20}}
                                  onPress={async()=>{
                                    setHiory([])

                                    setYear(year-1)
                                    // setHiory([])
                                    // getHistoryDetails()
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
                                    setHiory([])
                                    setYear(year+1)
                                    // setHiory([])
                                    // getHistoryDetails()
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
                              data={history}
                              numColumns={2}
                              renderItem={({item,index})=>{
                              

                                return <View
                                  style={{ width:((width-20)/2),justifyContent:'center',alignItems:'center',overflow:'hidden'}}
                                >
                                  <TouchableWithoutFeedback
                                    onPress={()=>{
                                        props.navigation.push("FinanceHistory",{history:item})
                                    }}
                                  >
                              

                                <View
                                   style={{height:140,borderWidth:0.05,marginVertical:10,borderRadius:10,backgroundColor:'white',justifyContent:'space-between',
                                            width:width/2.5,
                                            shadowColor:"#000",shadowOpacity:0.5,shadowRadius:2,elevation:1,
                                            shadowOffset:{height:2,width:2}}}
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
                                                  {item.actualAmount}₹
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
                                    {(item.status.isCompleted)?
                                    <Foundation
                                        name='sheriff-badge'

                                        size={20}
                                        color={'green'}
                                    />:<View/>
                                    }
                                  </View>
                                     <View
                                      style={{flexDirection:'row',paddingHorizontal:10,height:40,borderWidth:0.04,
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
             }

             </ScrollView>

             <AddIntrestSheet
                  refIntrestSheet={refIntrestSheet} 
                  isActiveExist={isActiveExist} 
                  member={member} 
                  getFinanceDetails={getFinanceDetails}
                  activity={activity}
                  date = {date}
             />
              <DeleteSheet
                  refDeleteSheet={refDeleteSheet} 
                  isActiveExist={isActiveExist} 
                  member={member} 
                  onPress={deleteActive}
                  getFinanceDetails={getFinanceDetails}
                  activity={activity}
                  date = {date}
             />
          
              <ReturnBottomSheet
                   days={days}
                   finance={finance}
                   callBack={callBack}
                   refReturnSheet={refReturnSheet} 
                   isActiveExist={isActiveExist} 
                   member={member} 
                   getFinanceDetails={getFinanceDetails}
                   amount={amount}
                   getHistoryDetails={getHistoryDetails}
                   activity={activity}
                   date = {date}
                   setAmount={setAmount}
              />
              <AddLoanSheet
                   amount={amount}
                   activity={activity}
                   date = {date}
                   setAmount={setAmount}
                   number = {number}
                   setNumber={setNumber}
                   place={place}
                   finance={finance}
                   setPlace={setPlace}
                   securityPerson={securityPerson}
                   setSecurityPerson={setSecurityPerson}
                   interst={interst}
                   setInterst={setInterst}
                   member={member}
                   refRBSheet={refRBSheet}
                   oldPending={oldPending}
                   getFinanceDetails={getFinanceDetails}
              
              />
          
              <RenewSheet 
                    setInterst={setInterst}
                    interst={interst}
                    setAmount={setAmount}
                    amount={amount}
                    refCloseSheet={refCloseSheet} 
                    isActiveExist={isActiveExist} 
                    member={member} 
                    callBack={callBack}
                    history={history}
                    finance = {finance}
                    navigation = {(page,data)=>{props.navigation.push(page,data)}}
                    date={date}
                    days={days}
                    getHistoryDetails={getHistoryDetails}
                    getFinanceDetails={getFinanceDetails} />

    </View>

  

}



const style = StyleSheet.create({
    textInput:{height:45,borderRadius:20,backgroundColor:Colors.searchBarColor,margin:10,flexDirection:'row',alignItems:'center' },
    moduleBar : {width:(width-60)/2,height:40,borderRadius:20,borderWidth:0.1,justifyContent:'center',alignItems:'center'}
})



export const Activity = ({activity,isActiveExist,getFinanceDetails,member})=>{
  
   return   <FlatList
                data = {activity}
                keyExtractor={(item,index)=>item.key}
                renderItem={({index,item})=>{
                  var color = (item.pending || index==0)?'white':'#eeeeee'
                  return <Tab item={item} color={color} index={index} isActiveExist={isActiveExist} getFinanceDetails={getFinanceDetails} member={member} />
                }}
              />
}


const Tab = ({item,color,index,isActiveExist,getFinanceDetails,member})=>{
  const refDeleteAmountSheet = useRef()
  const refDeleteInterestSheet = useRef()
  const deleteAmount = async()=>{

    setTimeout(()=>{
      getFinanceDetails()
      Snackbar.show({
        duration:Snackbar.LENGTH_LONG,
        text:SUCESSFULLYDONE,
        textColor:'white'
      })

    },2000)

  
    refDeleteAmountSheet.current.close()

    await database.ref("Members/").child(member.key).child("Finance").child("Active").child("Activity").child(item.id).remove() 
    await database.ref("Members/").child(member.key).child("Finance").child("Active").update({
      return: isActiveExist.return-item.amount
    })
  }
  const deleteInterest = async()=>{

      setTimeout(()=>{
          getFinanceDetails()
          Snackbar.show({
            duration:Snackbar.LENGTH_LONG,
            text:SUCESSFULLYDONE,
            textColor:'white'
          })
      },1000)

     
      refDeleteInterestSheet.current.close()
      

      await database.ref("Members/").child(member.key).child("Finance").child("Active").update({
          profit : isActiveExist.profit-item.amount
      })
      await database.ref("Members/").child(member.key).child("Finance").child("Active").child("Activity").child(item.id).remove()
  }
  return <View
          style={{flexDirection:'row',alignItems:'center',height:51,backgroundColor:color }}
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
                  {MONTH}
                </Text>
              </View>
            <View
            style={{width:width/4,alignItems:'center',justifyContent:'center'}}
          >
              <Text
              style={{fontWeight:'bold',color:'black',fontSize:14,}}
              >
                {PENDING}
            </Text>
          </View>
            <View
            style={{width:width/4,alignItems:'center',justifyContent:'center'}}
          >
              <Text
              style={{fontWeight:'bold',color:'black',fontSize:14,}}
              >
                {INTEREST}
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
        (!item.pending)?<TouchableOpacity
          onLongPress={()=>{
            if(member){
              Vibration.vibrate(50) 
              refDeleteAmountSheet.current.open()}}
            }
        > 
             <View
                            style={{
                              height:50,width,borderBottomWidth:0.5,flexDirection:'row',alignItems:'center',
                              backgroundColor:'white',backgroundColor:Colors.searchBarColor,justifyContent:'center'
                            }}
                          >
                              <View
                                style={{padding:5,borderRadius:20,paddingHorizontal:10,
                                        justifyContent:'space-around',
                                        flexDirection:'row',alignItems:'center'}}
                                >
                                  <Image
                                      tintColor={'black'}
                                      style={{height:19,width:19,backgroungColor:'grey',marginHorizontal:5}}
                                      source={require('../Assets/Images/appBarReturn.webp')}
                                    />
                  
                              <Text
                                style={{fontSize:13,fontWeight:'bold',marginLeft:5}}
                              >{item.amount}₹    {item.date}</Text>
                  
                              </View>
                            

                          </View> 
        </TouchableOpacity>
        :<TouchableOpacity
            onLongPress={()=>{
              if(member){
                Vibration.vibrate(50) 
                refDeleteInterestSheet.current.open()}}
             }
          >
            <View
              style={{
                height:50,width,borderBottomWidth:0.5,flexDirection:'row',alignItems:'center'
              }}
          >
              <View
              style={{width:width/4,alignItems:'center',justifyContent:'center'}}
              >
                  <Text
                  style={{color:'black',fontSize:14,}}
                  >
                  {item.key}
                </Text>
              </View>
              <View
              style={{width:width/4,alignItems:'center',justifyContent:'center'}}
              >
                  <Text
                  style={{color:'black',fontSize:14,}}
                  >
                  {item.pending}₹
                </Text>
              </View>
              <View
              style={{width:width/4,alignItems:'center',justifyContent:'center'}}
              >
                  <Text
                  style={{color:'black',fontSize:14,}}
                  >
                  {item.amount}₹
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
          }
        <DeleteSheet
          refDeleteSheet={refDeleteAmountSheet} 
          isActiveExist={{amount:item.amount}}
          onPress={deleteAmount}
        />
        <DeleteSheet
          refDeleteSheet={refDeleteInterestSheet} 
          isActiveExist={{amount:item.amount}} 
          onPress={deleteInterest}
        />

        </View>
}





const AddIntrestSheet=({refIntrestSheet,isActiveExist,member,getFinanceDetails,date})=>{
          return <RBSheet             
          ref={refIntrestSheet}
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
                    {parseInt((isActiveExist.amount-isActiveExist.return)*isActiveExist.interst/100)}₹
                </Text>
                <Text
                    style={{marginTop:8,fontSize:17}}
                >
                    {INTERSTAMOUNT}
                </Text>
            </View>

            <TouchableWithoutFeedback
             
              onPress={async()=>{
                  setTimeout(()=>{
                      getFinanceDetails()
                      Snackbar.show({
                        duration:Snackbar.LENGTH_LONG,
                        text:SUCESSFULLYDONE,
                        textColor:'white'
                      })
                  },1000)
               
                  const timeStamp = + new Date()
                  refIntrestSheet.current.close()
                  

                  await database.ref("Members/").child(member.key).child("Finance").child("Active").update({
                      profit : isActiveExist.profit+(isActiveExist.amount-isActiveExist.return)*isActiveExist.interst/100
                  })
                  await database.ref("Members/").child(member.key).child("Finance").child("Active").child("Activity").child("INT"+`${timeStamp}`).set({
                    pending:parseInt(isActiveExist.amount-isActiveExist.return),
                    date,
                    timeStamp,
                    amount:parseInt((isActiveExist.amount-isActiveExist.return)*isActiveExist.interst/100)
                    
                  })
                
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
          </View>:<View/>

        }

        </RBSheet>
}


const AddLoanSheet = ({refRBSheet,oldPending,getFinanceDetails,amount,setAmount,date,number,setNumber,securityPerson,setSecurityPerson,interst,setInterst,place,setPlace,member})=>{

             return <RBSheet
              ref={refRBSheet}
              closeOnDragDown={true}
              closeOnPressMask={true}
              height={520}
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
                        style={{...style.textInput,marginTop:20}}
                      >
                            <TextInput
                            value={amount}
                            keyboardType="number-pad"
                            onChangeText={(text)=>setAmount(text)}
                            style={{flex:1,marginLeft:20}}
                            placeholder={AMOUNT}
                            returnKeyType="done"
                            />
                      </View>
                      <View
                        style={{...style.textInput,marginTop:20}}
                      >
                            <TextInput
                            keyboardType="number-pad"
                            returnKeyType="done"
                            value={interst}
                            onChangeText={(text)=>setInterst(text)}
                            style={{flex:1,marginLeft:20}}
                            placeholder={INTEREST}
                            />
                      </View>
                      <View
                        style={{...style.textInput,marginTop:20}}
                      >
                            <TextInput
                            value={securityPerson}
                            returnKeyType="done"

                            onChangeText={(text)=>setSecurityPerson(text)}
                            style={{flex:1,marginLeft:20}}
                            placeholder={SECURITYPERSON}
                            />
                      </View>
                      <View
                        style={{...style.textInput,marginTop:20}}
                      >
                            <TextInput
                              returnKeyType="done"
                              keyboardType="number-pad"
                              value={number}
                              onChangeText={(text)=>setNumber(text)}
                              style={{flex:1,marginLeft:20}}
                              placeholder={NUMBER}
                            />
                      </View>
                      <View
                        style={{...style.textInput,marginTop:20}}
                      >
                            <TextInput
                              returnKeyType="done"
                              value={place}
                              onChangeText={(text)=>setPlace(text)}
                              style={{flex:1,marginLeft:20}}
                              placeholder={LOCATION}
                            />
                      </View>
                      <TouchableWithoutFeedback
                          
                            onPress={async()=>{
                              try{
                              
                                if(parseFloat(amount)<=0 ||   parseFloat(interst)<0){

                                  Snackbar.show({
                                    text:INVALID,
                                    textColor:'red'
                                  })
                                  return

                                }

                                if(!parseFloat(amount) ||  !parseFloat(interst)){

                                  Snackbar.show({
                                    text:INVALID,
                                    textColor:'red'
                                  })
                                  return

                                }
                                  console.log("ME")
                                if(amount.length==0 || interst.length==0 || securityPerson.length==0 || number.length==0 || place.length==0){
                                  Snackbar.show({
                                    text:INVALID,
                                    textColor:'red'
                                  })
                                  return
                                }
                                
                              }catch{
                                  Snackbar.show({
                                  text:INVALID,
                                  textColor:'red'
                                })
                                return
                              }
                              setTimeout(()=>{
                                Snackbar.show({
                                  text:SUCESSFULLYDONE,
                                  textColor:'white'
                                })
                              },2000)
                            
                              getFinanceDetails()
                              database.ref("Members").child(member.key).child("Finance").child("Active").set({
                                amount:parseFloat(amount)+oldPending,
                                interst:parseFloat(interst),
                                timeStamp : + new Date, //new date(`${date.split("-")[2]}-${date.split("-")[1]}-${date.split("-")[2]}T00:00:00`),
                                date,
                                location:place,
                                number,
                                securityPerson,
                                actualAmount:parseFloat(amount),
                                return:0,
                                profit:0
                              })
                             
                              refRBSheet.current.close()
                            }}                       
                      >

                        <View
                          style={{...style.textInput,marginTop:50,
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



const ReturnBottomSheet = ({refReturnSheet,isActiveExist,member,getFinanceDetails,amount,setAmount,date,finance,callBack,days,getHistoryDetails})=>{
          const [visible,setVisible] = useState(false)
          const onPress=async()=>{
            const timeStamp = + new Date()
            if(isActiveExist.amount-isActiveExist.return==amount){
                setTimeout(()=>{
                    getFinanceDetails()
                    getHistoryDetails()
                    Snackbar.show({
                      duration:Snackbar.LENGTH_LONG,
                      text:LOANCOMPLETED,
                      textColor:'lightgreen'
                    })
                },2000) 

                 refReturnSheet.current.close()
                 
                  await database.ref("Members/").child(member.key).child("Finance").child("Active").update({
                    return: isActiveExist.return+ parseFloat(amount)
                  })

                  await database.ref("Members/").child(member.key).child("Finance").child("Active").child("Activity").child("RET"+`${timeStamp}`).set({
                    date,
                    timeStamp,
                    amount:parseFloat(amount)
                  })

                  await database.ref("Members/").child(member.key).child("Finance").child("History").push({
                    timeStamp : +new Date(),
                    status:{
                        date,
                        isCompleted:true
                    },
                    ... await (await database.ref("Members/").child(member.key).child("Finance").child("Active").once('value')).toJSON()
                  })
                  await database.ref("Members/").child(member.key).child("Finance").update({
                      pending: 0,
                      inverstment:(finance.inverstment)?finance.inverstment+isActiveExist.actualAmount:isActiveExist.actualAmount,
                      overAllProfit:(finance.overAllProfit)?finance.overAllProfit+isActiveExist.profit:isActiveExist.profit,
                  })
                  await database.ref("Members/").child(member.key).child("Finance").child("Active").remove()
                  callBack & callBack()
                  
            }else{
               console.log("return")

                setTimeout(()=>{
                  getFinanceDetails()
                  Snackbar.show({
                    duration:Snackbar.LENGTH_LONG,
                    text:SUCESSFULLYDONE,
                    textColor:'white'
                  })

                },2000)

                refReturnSheet.current.close()

                await database.ref("Members/").child(member.key).child("Finance").child("Active").child("Activity").child("RET"+`${timeStamp}`).set({
                  date,
                  timeStamp,
                  amount:parseFloat(amount)
                })
                

                await database.ref("Members/").child(member.key).child("Finance").child("Active").update({
                  return: isActiveExist.return+ parseFloat(amount)
                })
              
               

            }
          
          }
          
          return  <RBSheet
              ref={refReturnSheet}
              height={320}
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
            {(!isActiveExist)?<View/>:
                  <View>
                      <View
                      style={{justfyContent:'center',alignItems:'center',marginTop:40}}
                    >
                      <Text
                          style={{fontSize:35,color:'black',fontWeight:'bold'}}
                      >
                          {parseInt((isActiveExist.amount-isActiveExist.return))}₹
                      </Text>
                      <Text
                          style={{marginTop:8,fontSize:17}}
                      >
                          {PENDING}
                      </Text>
                </View>
                <View
                    style={{...style.textInput,marginTop:45}}
                  >
                        <TextInput
                            value={amount}
                            keyboardType="number-pad"
                            onChangeText={(text)=>setAmount(text)}
                            style={{flex:1,marginLeft:20}}
                            placeholder={AMOUNT}
                            returnKeyType="done"
                        />
                  </View>

                  <TouchableWithoutFeedback
                            
                            onPress={async()=>{
                              if(!parseFloat(amount)){
                                Snackbar.show({
                                  text:INVALID,
                                  textColor:'red'
                                })
                                return
                              }
                              if(parseFloat(amount)>(isActiveExist.amount-isActiveExist.return)){
                                Snackbar.show({
                                  text:INVALID,
                                  textColor:'red'
                                })
                                return
                              }

                            
                              onPress()
                           
                             // setVisible(true)
                              
                            }}
                  >
                      <View
                          style={{...style.textInput,marginTop:10,
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

            <AlertDialog visible={visible} setVisible={setVisible} amount={amount} onPress={onPress}/>

          </View>


          </RBSheet>

}



const AlertDialog = ({visible,setVisible,amount,onPress})=>{
  console.log("alert sheet",visible)
  return <AwesomeAlert
      show={visible}
      
  
      height={300}
      title={CONFIRM+"?"}
      message={amount+"₹"}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText={NO}
      confirmText={YES}
      confirmButtonColor="#DD6B55"
      cancelButtonStyle={{
        width:width/3.5,
        marginBottom:10,
        justfyContent:'center',
        alignItems:'center'
      }}
      titleStyle={
        {
          fontWeight:'bold',
          color:'black',
          fontSize:15,
        }
     }
     messageStyle={
       {
         fontWeight:'bold',
         marginTop:8,
         
       }
     }
      confirmButtonStyle={{
        marginBottom:10,
        width:width/3.5,
        justfyContent:'center',
        alignItems:'center'
      }}
      onCancelPressed={() => {
        setVisible(false)
      }}
      onConfirmPressed={() => {
        onPress()
        setVisible(false)
      }}
      contentContainerStyle={{
           padding:0,
           paddingHorizontal:3
      }}
  />
}



const RenewSheet=({refCloseSheet,isActiveExist,member,getHistoryDetails,getFinanceDetails,date,finance,callBack,amount,setAmount,setInterst,interst,days})=>{
  const [isInclude,setIsInclude] = useState(false)
  const [alertDialog,setAlertDialog] = useState(false)
  const [visible,setVisible] = useState(false)
  const  onPress=async()=>{
                         
    setTimeout(()=>{
       getFinanceDetails()
       getHistoryDetails()
        Snackbar.show({
           duration:Snackbar.LENGTH_LONG, 
           text:LOANRENEWED,
           textColor:'lightgreen'
          })
    },2000)
    refCloseSheet.current.close()
    await database.ref("Members/").child(member.key).child("Finance").child("History").push({
            status:{
                date,
                isCompleted:false
            },
            ...isActiveExist
    })
  
    await database.ref("Members/").child(member.key).child("Finance").update({
        pending: isActiveExist.amount-isActiveExist.return,
        inverstment:(finance.inverstment)?finance.inverstment+isActiveExist.actualAmount:isActiveExist.actualAmount,
        overAllProfit:(finance.overAllProfit)?finance.overAllProfit+isActiveExist.profit:isActiveExist.profit,
    })
    await database.ref("Members/").child(member.key).child("Finance").child("Active").remove()
    await database.ref("Members").child(member.key).child("Finance").child("Active").set({
      amount:(isInclude)
              ?parseInt(amount)+parseInt(isActiveExist.amount-isActiveExist.return)+parseFloat(((isActiveExist.amount-isActiveExist.return)*isActiveExist.interst/100)*days)
              :
              parseInt(amount)+parseInt(isActiveExist.amount-isActiveExist.return),
      interst:parseFloat(interst),
      timeStamp : + new Date, 
      date,
      location:isActiveExist.location,
      number:isActiveExist.number,
      securityPerson:isActiveExist.securityPerson,
      actualAmount:(isInclude)
                    ?parseInt(amount)+parseInt(((isActiveExist.amount-isActiveExist.return)*isActiveExist.interst/100)*days)
                    :
                    parseInt(amount),
      return:0,
      profit:0
    })
    getFinanceDetails()
    
  
    callBack & callBack()
  }
  return <RBSheet
        ref={refCloseSheet}
      
        height={390}
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

      {(!isActiveExist)?<View/>:
          <View>
           
               <TouchableOpacity
                 onPress={()=>{setIsInclude(!isInclude)}}
               >
                 <View
                      style={{justfyContent:'center',alignItems:'center',marginTop:40,marginBottom:30}}
                    >
                      <Text
                          style={{fontSize:30,color:(isInclude)?blue:'black',fontWeight:'bold'}}
                      >
                          {parseFloat(((isActiveExist.amount-isActiveExist.return)*isActiveExist.interst/100)*days)}₹
                      </Text>
                      <View
                         style={{flexDirection:'row',alignItems:'center',marginLeft:12}}
                      >
                      <Text
                          style={{marginTop:8,fontSize:15,color:(isInclude)?blue:'black'}}
                      >
                          {ADDINTEREST}
                      </Text>

                      <MaterialCommunityIcons
                        style={{marginLeft:10}}
                         name="gesture-tap"
                         size={20}
                         color={(isInclude)?blue:'black'}
                      />

                      </View>
                     
                </View>
               </TouchableOpacity>
              

               <View
                    style={{...style.textInput,marginTop:30}}
                  >
                        <TextInput
                            value={amount}
                            keyboardType="number-pad"
                            onChangeText={(text)=>setAmount(text)}
                            style={{flex:1,marginLeft:20}}
                            placeholder={AMOUNT}
                            returnKeyType="done"
                        />
                  </View>
                  <View
                    style={{...style.textInput,marginTop:15}}
                  >
                        <TextInput
                            value={interst}
                            keyboardType="number-pad"
                            onChangeText={(text)=>setInterst(text)}
                            style={{flex:1,marginLeft:20}}
                            placeholder={INTEREST}
                            returnKeyType="done"
                        />
                  </View>
              <TouchableWithoutFeedback
                    
                     onPress={()=>{  
                    
                        if(amount.length==0 || interst.length==0){
                          Snackbar.show({
                            text:INVALID,
                            textColor:'red'
                          })
                          return
                        }
                        setVisible(true)
                        
                      }} 
              >
                  <View
                      style={{...style.textInput,marginTop:10,
                              backgroundColor:Colors.blue,
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
                        style={{color:'white',fontWeight:'bold',fontSize:14}}
                      >
                        {RENEWLOAN}
                      </Text>
                  </View>
              </TouchableWithoutFeedback>
   
          </View>
          
        }
       <AlertDialog visible={visible} setVisible={setVisible} amount={amount} onPress={onPress}/>
        
      </View>
    
      </RBSheet>
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
            {isActiveExist.amount-isActiveExist.return | isActiveExist.amount}₹
        </Text>
        <Text
            style={{marginTop:8,fontSize:17}}
        >
            {AMOUNT}
        </Text>
    </View>

    <TouchableWithoutFeedback
        onPress={()=>{onPress()}}
     
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
                {DELETELOAN}
              </Text>
      </View>
    </TouchableWithoutFeedback>
  </View>:<View/>

}

</RBSheet>
}