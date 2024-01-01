import React,{useState,useEffect,useRef} from 'react'
import { View , TouchableOpacity ,  FlatList , Text ,TextInput ,ScrollView,Dimensions , Image ,StyleSheet , TouchableNativeFeedback , TouchableWithoutFeedback, Linking, Vibration} from 'react-native'
import * as Colors from '../Assets/color'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {database} from '../database/firebase'
import {MembersList} from './Members'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Snackbar from 'react-native-snackbar'

const {height,width} = Dimensions.get('window')


const SELECTDRIVERS = "ஓட்டுனர்கள்"
const SEARCH = "தேடல்"
const DIAL = "டயல் செய்ய நீண்ட நேரம் அழுத்தவும்"



export default TractorDrivers = (props)=>{

    const [members , setMembers] = useState(null)
    const [memberTemp , setMembersTemp] = useState([])
    const [refresh,setRefresh] = useState(true)
    const [query,setQuery] = useState("")
    const callBack = props.navigation.state.params.callBack


    const doSearch = (query)=>{
        setMembers(null)
        const filteredMember = []
        memberTemp.forEach((item)=>{
            "".toLowerCase
            if(item.personalInfo.name.toLowerCase().includes(query.toLowerCase())){
                 filteredMember.push(item)
            }
        })
        setMembers(filteredMember)
        setQuery(query)
        setRefresh(false)

        return 
    }


    const getMembers=async()=>{
        setMembers(null)   
        const membersData =(await database.ref("TractorSettings/Drivers").once('value')).toJSON()
        var memberObject = []
        for(var member in membersData){
            memberObject.push({ key:membersData[member].number,
                               personalInfo:{ name:membersData[member].name,
                                number:membersData[member].number,
                                location:membersData[member].location
                                },
                              })
        }
        setMembers(memberObject)
        setMembersTemp(memberObject)
        setRefresh(false)
    }
    useEffect(() => {
        Snackbar.show({
            text:DIAL,
            textColor:'white',
            duration:Snackbar.LENGTH_LONG
        })
        getMembers()
    }, [])


    return <View style={{flex:1}} >
      <View
     style={{height:60,backgroundColor:'white',borderBottomWidth:0.1,alignItems:'center',
     elevation:2,shadowColor:'#000',shadowOffset:{height:2,width:2},backgroundColor:'white',
           flexDirection:'row',paddingHorizontal:10,justifyContent:'space-between'}}
  >
      <View
         style={{flexDirection:'row',alignItems:'center'}}
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
              {SELECTDRIVERS}
        </Text>
      </View> 
       
    </View>

    <ScrollView
        style={{backgroundColor:'white',flex:1}}
        showsVerticalScrollIndicator={false}
    >
            <View
              style={{paddingLeft:10,paddingRight:10}}
            >
                <View
                style={{marginTop:25,height:40,marginHorizontal:10,borderRadius:10,paddingLeft:10,marginBottom:10,
                        backgroundColor:Colors.searchBarColor,flexDirection:'row',alignItems:'center'}}
                >

                    <MaterialIcons
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
            {
                (members!=null)?
                 <MembersList members={members} onPress={(item)=>{
                     props.navigation.goBack()
                     callBack(item.personalInfo)
                 }} 

                 onLongPress={(item)=>{
                    Vibration.vibrate(50) 
                    Linking.openURL(`tel:${item.personalInfo.number}`)
                 }}
                 
                 
                 />:
                <View
                   style={{height:(height-200)/2,justifyContent:'flex-end',alignItems:'center'}}
                >
                   <Text style={{fontSize:13,fontWeight:'bold',opacity:0.5}} >Loading...</Text>
                </View>
            }
    </ScrollView>


  
   

</View>
}