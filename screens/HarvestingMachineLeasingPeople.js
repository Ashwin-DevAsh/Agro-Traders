import React,{createContext, useContext, useState, useEffect} from 'react'
import { View, Text, Image, TouchableOpacity,ScrollView, TextInput, Dimensions } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import * as Colors from '../Assets/color'
import {database} from '../database/firebase'
import { MembersList } from './Members'


const DEALERS = "விநியோகஸ்தர்"
const SEARCH = "தேடல்"
const INACTIVE = "செயலற்றது"
const ACTIVE = "செயலில்"


const {height,width} = Dimensions.get('window')
const HarvestingMachineLeasingPeopleContext = createContext()
const HarvestingMachineLeasingPeople = (props) => {

    const goBack = ()=>{
        props.navigation.goBack()
    }

    const navigate = (page,data)=>{
        props.navigation.push(page,data)
    }

    const {callBack,season,settings} = props.navigation.state.params

    const getPeople=async()=>{
        setMembers(null)
        const membersData =(await database.ref("HarvestingMachineSettings/Members").once('value')).toJSON()
        var memberObject = []
        var memberObjectActive = []
        for(var member in membersData){
            if(membersData[member.toString()]["Active"]){

                memberObjectActive.push({ 
                       key:member,
                        personalInfo:membersData[member.toString()]["personalInfo"],
                        bankInfo:membersData[member.toString()]["bankInfo"],
                        Active:membersData[member.toString()]["Active"],
                        History:membersData[member.toString()]["History"],

                    })
            }else{
                memberObject.push({ 
                        key:member,
                        personalInfo:membersData[member.toString()]["personalInfo"],
                        bankInfo:membersData[member.toString()]["bankInfo"],
                        Active:membersData[member.toString()]["Active"],
                        History:membersData[member.toString()]["History"],

                    })
            }
        }

        setMembers(memberObject)
        setMembersTemp(memberObject)
        setMembersActive(memberObjectActive)
        setMembersTempActive(memberObjectActive)
        console.log(memberObject)
    }

    const doSearch = (query)=>{
        setMembers(null)
        const filteredMember = []
        memberTemp.forEach((item)=>{
            if(item.personalInfo.name.toLowerCase().includes(query.toLowerCase())){
                 filteredMember.push(item)
            }
        })
        const filteredMemberActive = []
        memberTempActive.forEach((item)=>{
            if(item.personalInfo.name.toLowerCase().includes(query.toLowerCase())){
                 filteredMemberActive.push(item)
            }
        })
        setMembers(filteredMember)
        setMembersActive(filteredMemberActive)
        setQuery(query)
        return 
    }


    const [membersActive,setMembersActive] = useState(null)
    const [memberTempActive,setMembersTempActive] = useState(null)
    const [members,setMembers] = useState(null)
    const [memberTemp,setMembersTemp] = useState(null)
    const [query,setQuery] = useState("")

    useEffect(()=>{
        getPeople()
    },[])

    return (
        <HarvestingMachineLeasingPeopleContext.Provider
          value={{goBack,navigate,getPeople,members,setMembers,setMembersTemp,
                  memberTemp,query,setQuery,doSearch,getPeople,callBack,season,settings
                }}
        >
            <View
              style={{flex:1,backgroundColor:'white'}}
            >
                <AppBar/>
                {(members!=null)?<ScrollView
                  
                >
                    <Members members={membersActive} heading={ACTIVE} />
                    <Members members={members} heading={INACTIVE} />
                </ScrollView>:<View
                            style={{flex:1,justifyContent:'center',alignItems:'center',height:(height/2)-150}}
                        >
                                <Text style={{fontSize:13,fontWeight:'bold',opacity:0.5}} >Loading...</Text>
                        </View>
                }
            </View>
        </HarvestingMachineLeasingPeopleContext.Provider>
    )
}


const AppBar=()=>{
    const {goBack,navigate,getPeople,season} = useContext(HarvestingMachineLeasingPeopleContext)
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
                  {DEALERS}
          </Text>
        </View>  
        <View 
          style={{flexDirection:'row'}}
        > 
            <TouchableOpacity
                        onPress={()=>{navigate('HarvestingMachineAddMembers',{callBack:getPeople,season,isDealer:true,
                                                                           addPeople:()=>{}})
                         }}
            >
                        <MaterialIcon
                            style={{paddingRight:15,paddingLeft:10}}
                            name="person-add"
                            size={25}
                            color={"grey"}
                        /> 
            </TouchableOpacity>   
            
        </View>
    </View>
}


const Members=({members,heading})=>{
    const {query,doSearch,navigate,getPeople,callBack,season,settings} = useContext(HarvestingMachineLeasingPeopleContext)
    return <ScrollView
                style={{backgroundColor:'white',flex:1}}
                showsVerticalScrollIndicator={false}
            >
                {
                   (heading==ACTIVE)&&
                    <View
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
                    {
                        (members && members.length)?<View
                          style={{marginHorizontal:25,marginTop:10,marginBottom:6,
                            flexDirection:'row',justifyContent:'space-between',alignItems:'center',
                        }}
                        >
                            <Text
                               style={{fontWeight:'bold',color:'black',fontSize:14}}
                            >{heading}</Text>

                            <TouchableOpacity
                                      
                                    >
                                        <MaterialIcon
                                        name={"more-horiz"}
                                        size={22}              
                                        style={{}}
                                    />
                            </TouchableOpacity>
                        </View>:<View/>
                    }
                
                    
                    <MembersList members={members} 
                                    onPress={(item)=>navigate("HarvestingMachineLeasingPeopleDetails",{member:item,season,settings,callBack:()=>{getPeople();callBack()}})}/>
                  
                       
                    
                </ScrollView>
}

export default HarvestingMachineLeasingPeople
