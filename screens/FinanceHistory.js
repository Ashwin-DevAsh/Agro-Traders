import React , {useState,useEffect} from 'react'
import { View , TouchableOpacity , Text, Dimensions , Image , Linking} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import {Activity} from './Finance'
import * as Colors from '../Assets/color'
import { ScrollView } from 'react-native-gesture-handler'


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

const {width,height} = Dimensions.get('window')


export default Finance = (props)=>{
    const history = props.navigation.state.params.history
    const [activity , setActivity] = useState([{amount:'-',date:'-',key:'None1',pending:''}])


    const getData = ()=>{

        var temp = [{amount:'-',date:'-',key:'None1',pending:'',timeStamp:0}]
        var data = history.Activity
        var month = 1;
        for(var i in data){
          var obj = data[i]
          console.log(obj)

          if(obj.pending){
            temp.push({
                amount:obj.amount,  //imp
                date:obj.date,  //imp
                key:month++,
                pending:obj.pending,  //imp
                timeStamp:obj.timeStamp,
            })
          }else{
            temp.push({
                amount:obj.amount,  //imp
                date:obj.date,   //imp
                key:i, 
                timeStamp:obj.timeStamp,
            })
          }
        }

        temp.sort((a,b)=>{
          if(new Date(a.timeStamp)>new Date(b.timeStamp)){
            console.log("\na")
            return 1
          }else{
            console.log("\nb")
            return -1
          }
        })
        setActivity(temp)
    }


    useEffect(()=>{
         getData()
          return ()=>{

          }
    },[])

    return <View
      style={{flex:1,backgroundColor:'white'}}
    >
        <View
          style={{height:60,borderBottomWidth:0.1,flexDirection:'row',alignItems: 'center',
          elevation:2,shadowColor:'#000',shadowOffset:{height:2,width:2},backgroundColor:'white',
                 paddingHorizontal:10,justifyContent:'space-between'}}
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
                      
                  {HISTORY}
                </Text>
             </View>
        </View>
        <ScrollView>
        <View
               style={{height:170,width:width,justifyContent:'center',alignItems:'center',marginBottom:20}}
             >
            <View
                      style={{height:125,width:125,borderRadius:62.5,justifyContent:'center',alignItems:'center',borderWidth:0.5,marginTop:20}}
                        >
                            <Text style={{color:"black",fontSize:25,fontWeight:'bold'}} >
                                {history.amount-history.return}₹
                            </Text>
                                <Text style={{opacity:0.5}} >{PENDING}</Text>
                        </View>
         </View>            
            <View
               style={{
                   flexDirection:'row',justifyContent:'space-evenly',paddingBottom:10,paddingHorizontal:10
               }}
             >
                 <View
                   style={{justifyContent:'center',alignItems:'center',}}
                 >

                     <Text
                       style={{fontSize:15,fontWeight:'bold',color:'purple'}}
                     >
                        {history.amount}₹
                     </Text>
                     
                     <Text style={{fontSize:12,color:'purple',fontWeight:'bold'}}>
                        {OVERALLAMOUNT}
                     </Text>

                 </View>
                 <View
                   style={{justifyContent:'center',alignItems:'center',}}
                 >

                     <Text
                       style={{fontSize:15,fontWeight:'bold',color:'green'}}
                     >
                         {history.actualAmount}₹
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
                          {history.interst}%
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
                          {(history.return)}₹
                      </Text>
                        
                      <Text style={{fontSize:12,color:'orange',fontWeight:'bold'}}>
                          {RETURN}
                      </Text>

                  

              </View>
                 
             </View>
            
             <View style={{width,height:60,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingHorizontal:20}}>
              <Text style={{fontSize:10,opacity:0.5,fontWeight:'bold'}} >{DATE} : {history.date} - {history.status.date} </Text>
             </View> 

             <View style={{height:85,flexDirection:'row',alignItems:`center`,paddingHorizontal:20,justifyContent:'space-between',borderBottomWidth:0.5,paddingBottom:30}} >
                            <View style={{flexDirection:'row',alignItems:`center`}} > 
                            <View>
                                <View
                                style={{height:55,width:55,borderRadius:57.5,borderWidth:0.6,borderColor:'grey',alignItems:'center',justifyContent:'center'}}
                                >
                                    <Image
                                        style={{height:50,width:50,borderRadius:25,padding:10}}
                                        source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSq06v_YeFtM-5YtnSiHIP1vqUsYva3WqKPmXNzb_tpCzwk6E6W'}}
                                    />
                                </View> 
                            </View>
                            <View style={{paddingLeft:20}} >
                                <Text
                                    style={{fontWeight:'bold',fontSize:16,marginTop:2}}
                                >
                                {history.securityPerson}
                                </Text>
                                <Text
                                    style={{fontSize:14,opacity:0.7,marginTop:2}}
                                >
                                {history.location}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                        onPress={()=>{Linking.openURL(`tel:${history.number}`)}}
                          >
                          <MaterialIcon
                          style={{paddingRight:5}}
                          size={23}
                          name={'phone'}
                          color={Colors.primaryColor}
                          />
                      </TouchableOpacity>
                        </View>
        

             <Activity activity={activity} />
             <View
                style={{height:100}}
             >

             </View>
             </ScrollView>

    </View>
}