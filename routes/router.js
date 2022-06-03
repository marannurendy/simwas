import react from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import AsyncStorage from "@react-native-async-storage/async-storage"

import { Home, SuratTugas, InputSuratTugas, EditSuratTugas, Checklist, TindakLanjut, Pembinaan, Login } from '../source'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Router = () => {

    const DrawerContent = (props) => {

        const Navigation = useNavigation()

        const Logout = async () => {    
            AsyncStorage.removeItem('token');
            AsyncStorage.removeItem('user_data');
    
            Navigation.replace('Login')
        }

        return(
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem label={'Logout'} onPress={() => Logout()} />
            </DrawerContentScrollView>
        )
    }

    const HomeFront = () => {
        return(
            <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
                <Drawer.Screen name='Front Home' component={Home} options={{ headerShown: false }} />
            </Drawer.Navigator>
        )
    }

    return(
        <NavigationContainer>
            <Stack.Navigator>
                {/* LOGIN */}
                <Stack.Screen name='Login' component={Login} options={{ headerShown : false }} />

                {/* HOME */}
                <Stack.Screen name='Home' component={HomeFront} options={{ headerShown : false }} />

                {/* SURAT TUGAS */}
                <Stack.Screen name='SuratTugas' component={SuratTugas} options={{ headerShown : false }} />
                <Stack.Screen name='InputSuratTugas' component={InputSuratTugas} options={{ headerShown : false }} />
                <Stack.Screen name='EditSuratTugas' component={EditSuratTugas} options={{ headerShown : false }} />

                {/* CHECKLIST */}
                <Stack.Screen name='Checklist' component={Checklist} options={{ headerShown : false }} />

                {/* TINDAKLANJUT */}
                <Stack.Screen name='TindakLanjut' component={TindakLanjut} options={{ headerShown : false }} />

                {/* PEMBINAAN */}
                <Stack.Screen name='Pembinaan' component={Pembinaan} options={{ headerShown : false }} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Router