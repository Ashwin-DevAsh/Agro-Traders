import React ,{useState,useEffect,useRef} from 'react'
import { View , TouchableOpacity ,TextInput, ScrollView,  FlatList , Text , Dimensions , Image ,StyleSheet , TouchableNativeFeedback , TouchableWithoutFeedback} from 'react-native'
import * as Colors from '../Assets/color'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {database} from '../database/firebase'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Snackbar from 'react-native-snackbar'




const {height,width} = Dimensions.get('window')


export default Members = (props)=>{

    const SEARCH = "தேடல்"
    const MEMBERS = "உறுப்பினர்கள்"
    const [members , setMembers] = useState(null)
    const [memberTemp , setMembersTemp] = useState([])
    const [refresh,setRefresh] = useState(true)
    const refAddMembers = useRef()
    const [query,setQuery] = useState("")
    

    
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
        const membersData =(await database.ref("Members").once('value')).toJSON()
        var memberObject = []
        for(var member in membersData){
            memberObject.push({ key:member,
                                personalInfo:membersData[member.toString()]["personalInfo"],
                                bankInfo:membersData[member.toString()]["bankInfo"],
                                Finance:membersData[member.toString()]["Finance"],
                                Tractor:membersData[member.toString()]["Tractor"],
                                HarvestingMachine:membersData[member.toString()]["HarvestingMachine"],
                            })
        }
        setMembers(memberObject)
        setMembersTemp(memberObject)
        setRefresh(false)
    }

    useEffect(() => {
       
        getMembers()
        console.log("called")
       
        
    }, [])

   


    return <View style={{flex:1}} >
        <View
            style={{height:60,borderBottomWidth:0.1,backgroundColor:Colors.appBarColor,
                elevation:2,shadowColor:'#000',shadowOffset:{height:2,width:2},
                  alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}
        >
                <View style={{flexDirection:'row',alignItems:'center'}} >
                <TouchableOpacity
                    //onPress={()=>props.navigation.toggleDrawer()}
                >
                    <MaterialIcon
                        style={{padding:15}}
                        name="people"
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

                <View
                 style={{flexDirection:'row',alignItems:'center'}}
                >

                        
                   <TouchableOpacity
                    onPress={()=>getMembers()}   
                    >
                        <MaterialIcons
                            style={{padding:15}}
                            name="refresh"
                            size={25}
                            color={"grey"}
                        />
                    </TouchableOpacity>   
                    
                    <TouchableOpacity
                    //   onPress={()=>refAddMembers.current.open()}   
                        onPress={()=>{props.navigation.push('AddMembers',{callBack:getMembers})}}
                    >
                        <MaterialIcons
                            style={{paddingRight:15,paddingLeft:10}}
                            name="person-add"
                            size={25}
                            color={"grey"}
                        />
                    </TouchableOpacity>   

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
                    (members!=null)?<MembersList members={members} 
                                 onPress={(item)=>props.navigation.push("MembersDetails",{member:item,callBack:getMembers})} />
                   :
                    <View
                       style={{height:(height-200)/2,justifyContent:'flex-end',alignItems:'center'}}
                    >
                       <Text style={{fontSize:13,fontWeight:'bold',opacity:0.5}} >Loading...</Text>
                    </View>
                }
        </ScrollView>
    </View>
    
}

export const MembersList = ({members,onPress,onLongPress})=>{
  return <FlatList
    style={{flex:1}}
    data = {members}
    numColumns={3}
    style={{marginHorizontal:10}}
    keyExtractor = {(item,index)=>item.key}
    renderItem = {({item,index})=>{
        console.log(item)
        return <TouchableWithoutFeedback
                onPress={()=>onPress(item)}
                onLongPress={()=>onLongPress && onLongPress(item)}
                key={item.key}
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
                                style={{height:55,width:55,borderRadius:50}}
                                source={require('../Assets/Images/avatar.png')}
                            />
                        </View> 
                        <View
                        style={{alignItems:'center',justifyContent: 'center',}}
                        >
                            <Text
                            style={{fontSize:13,fontWeight:'bold'}}
                            >{item.personalInfo.name}</Text>
                            <Text
                            style={{fontSize:10,opacity:0.5}}
                            >{item.personalInfo.location}</Text>
                        </View>
                </View>
               
        </TouchableWithoutFeedback>
    }}
    />
}




const style = StyleSheet.create({
    textInput:{height:45,borderRadius:20,borderWidth:0.5,backgroundColor:"lightgrey",margin:10,flexDirection:'row',alignItems:'center'}
 })