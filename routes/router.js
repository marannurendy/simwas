import react from 'react'
import { View, Text, Alert } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import AsyncStorage from "@react-native-async-storage/async-storage"

import { Home, SuratTugas, InputSuratTugas, EditSuratTugas, Checklist, TindakLanjut, Pembinaan, Login, InputChecklist, EditChecklist, DetailTindakLanjut } from '../source'
import { DrawerLayoutAndroid } from 'react-native-gesture-handler'

import db from '../config/database'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const Router = () => {

    const DrawerContent = (props) => {

        const Navigation = useNavigation()

        const Logout = async () => {    
            AsyncStorage.removeItem('token');
            AsyncStorage.removeItem('user_data');
            AsyncStorage.removeItem('syncStat');
    
            Navigation.replace('Login')
        }
        const ClearData = () => {
            Alert.alert(
                "Clear Data Alert",
                "Clear Data akan menghapus semua data, termasuk data yang sudah diinput. Apakah Anda yakin untuk melanjutkan?",
                [
                    { text: "OK", onPress: () => {
                        db.transaction(
                            tx => {
                                tx.executeSql('DELETE FROM ListKodeCLKA')
                                tx.executeSql('DELETE FROM OptionSVKC')
                                tx.executeSql('DELETE FROM OptionSTAM')
                                tx.executeSql('DELETE FROM ListSTSV')
                                tx.executeSql('DELETE FROM CabangDiperiksa')
                                tx.executeSql('DELETE FROM ListPPM')
                                tx.executeSql('DELETE FROM ListRPM')
                                tx.executeSql('DELETE FROM OptionST')
                                tx.executeSql('DELETE FROM Pemeriksa')
                                tx.executeSql('DELETE FROM OptionSTWAKADIF')
                                tx.executeSql('DELETE FROM MasterKategori')
                                tx.executeSql('DELETE FROM SubKategori')
                                tx.executeSql('DELETE FROM TipePemeriksaan')
                                tx.executeSql('DELETE FROM Pertanyaan')
                                tx.executeSql('DELETE FROM Jawaban')
                                tx.executeSql('DELETE FROM ListChecklist')
                                tx.executeSql('DELETE FROM ListSTChecklist')
                                tx.executeSql('DELETE FROM InputListChecklist')
                                tx.executeSql('DELETE FROM ListPemeriksaan')
                                tx.executeSql('DELETE FROM ListSiapTL')
                                tx.executeSql('DELETE FROM OptionSTCL')
                            },function(error) {
                                alert('Transaction ERROR: ' + error.message)
                            }, async function() {
                                Logout()
                            }
                        )
                    }}
                ],
                { cancelable: true }
            );
        }

        return(
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem label={'Logout'} onPress={() => Logout()} />
                <DrawerItem label={'ClearData'} onPress={() => ClearData()} />
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
                <Stack.Screen name='InputChecklist' component={InputChecklist} options={{ headerShown : false }} />
                <Stack.Screen name='EditChecklist' component={EditChecklist} options={{ headerShown: false }} />

                {/* TINDAKLANJUT */}
                <Stack.Screen name='TindakLanjut' component={TindakLanjut} options={{ headerShown : false }} />
                <Stack.Screen name='DetailTindakLanjut' component={DetailTindakLanjut} options={{ headerShown : false }} />

                {/* PEMBINAAN */}
                <Stack.Screen name='Pembinaan' component={Pembinaan} options={{ headerShown : false }} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Router