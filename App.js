import React from 'react';
import { StatusBar ,View , SafeAreaView,Text, Image} from 'react-native';
import Home from './screens/Home';
import { primaryColor } from './Assets/color'
import { MenuProvider } from 'react-native-popup-menu';
import {createAppContainer} from 'react-navigation'
import {createStackNavigator,TransitionPresets} from 'react-navigation-stack'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Members from './screens/Members'
import AddMembers from './screens/AddMembers';
import MembersDetails from './screens/MembersDetails'
import Finance from './screens/Finance'
import FinanceHistory from './screens/FinanceHistory'
import Tractor from './screens/Tractor'
import TractorHistory from './screens/TractorHistory'
import TractorDrivers from './screens/TractorDrivers'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import TractorSettingsProvider from './screens/TractorSettings';
import TractorModuleProvider from './screens/TractorModule';
import HarvestingMachine from './screens/HarvestingMachine'
import HarvestingMachineHistory from './screens/HarvestingMachineHistory';
import HarvestingMachineModule from './screens/HarvestingMachineModule';
import HarvestingMachineSettings from './screens/HarvestingMachineSettings';
import HarvestingMachineLeasingPeople from './screens/HarvestingMachineLeasingPeople';
import HarvestingMachineLeasingPeopleDetails from './screens/HarvestingMachineLeasingPeopleDetails';
import HarvestingMachineSelector from './screens/HarvestingMachineSelector';
import HarvestingMachineDetails from './screens/HarvestingMachineDetails';
import HarvestingMachineLeasingPeopleDetailsHistory from './screens/HarvestingMachineLeasingPeopleDetailsHistory';




const MembersStack = createStackNavigator({
  Members :{screen:Members},
  AddMembers : {screen:AddMembers},
  MembersDetails : {screen: MembersDetails},
  Finance : {screen:Finance},
  FinanceHistory : {screen:FinanceHistory},
  Tractor:{screen:Tractor},
  TractorHistory:{screen:TractorHistory},
  TractorDrivers :{screen:TractorDrivers},
  HarvestingMachine:{screen:HarvestingMachine},
  HarvestingMachineHistory:{screen:HarvestingMachineHistory},
  HarvestingMachineSelector:{screen:HarvestingMachineSelector}
},
{
  headerMode:'none',
  defaultNavigationOptions: {
    ...TransitionPresets.SlideFromRightIOS,
  },
}
)

const HomeModuleStack = createStackNavigator({
  Home:{screen:Home},
  TractorModule:{screen:TractorModuleProvider},
  TractorSettings:{screen:TractorSettingsProvider},
  HarvestingMachineModule:{screen:HarvestingMachineModule},
  HarvestingMachineSettings:{screen:HarvestingMachineSettings},
  HarvestingMachineLeasingPeople:{screen:HarvestingMachineLeasingPeople},
  HarvestingMachineAddMembers : {screen:AddMembers},
  HarvestingMachineLeasingPeopleDetails : {screen:HarvestingMachineLeasingPeopleDetails},
  HarvestingMachineDetails:{screen:HarvestingMachineDetails},
  HarvestingMachineLeasingPeopleDetailsHistory : {screen:HarvestingMachineLeasingPeopleDetailsHistory},

},

{
  headerMode:'none',
  defaultNavigationOptions:{
     ...TransitionPresets.SlideFromRightIOS
  }
}

)



const DrawerNavigator = createBottomTabNavigator({
  Home:{ 
    screen:createAppContainer(HomeModuleStack),
    navigationOptions:{
      title:"முகப்புப்பக்கம்",
      tabBarIcon:({tintColor,focused})=>{
        return <MaterialIcon
           name='home'
           size={(focused)?40:30}
           color={tintColor}
        />
      },
      tabBarOptions:{
        activeTintColor: 'black',
        showLabel:false,
        style:{
          shadowOffset: { width: 2, height: 0 },
          elevation: 10,
          shadowColor:"#000",
          borderTopColor:'transparent',
          backgroundColor:'white',
          height: 55
        },
       }
    }
  },

  Members : {
    screen : createAppContainer(MembersStack),
    navigationOptions:{
     title:"உறுப்பினர்கள்", 
     tabBarIcon : ({tintColor,focused})=>{
      return <MaterialIcon
          name='people'
          size={(focused)?40:30}
          color={tintColor}
      />
    },
    tabBarOptions:{
      activeTintColor: 'black',
      showLabel:false,
      indicatorStyle: { backgroundColor: '', },
      style:{
        shadowOffset: { width: 1, height: 1 },
        shadowColor:"#000",
        elevation: 2,
        borderTopColor:'transparent',
        backgroundColor:'white',
        height: 55,
        
      },
    
     },
  }
  }
},

{
  

  // contentComponent:(props)=>{
  //   return <View>
  //       <View
  //         style={{height:160,alignItems:'center',justifyContent:'center'}}
  //       >
  //         <Image
  //            style={{height:120,width:107}}
  //            source={{uri:'https://www.pngkey.com/png/full/803-8036706_stock-photo-hands-holding-green-plant-isolated-hands.png'}}
  //         />
  //       </View>

  //       <ScrollView>
  //           <DrawerItems {...props} />
  //       </ScrollView>

  //   </View>
  // }
}
)

const DrawerStackContainer = createAppContainer(DrawerNavigator)

const App = () => {
  console.disableYellowBox = true; 
  return (
    <MenuProvider>
      <StatusBar barStyle="dark-content" backgroundColor="white"/>
      <DrawerStackContainer/>
    </MenuProvider>
  );
};

export default App



