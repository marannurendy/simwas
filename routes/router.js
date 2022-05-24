import react from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { Home, SuratTugas, InputSuratTugas, Checklist, TindakLanjut, Pembinaan } from '../source'

const Stack = createStackNavigator()

const Router = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                {/* HOME */}
                <Stack.Screen name='Home' component={Home} options={{ headerShown : false }} />

                {/* SURAT TUGAS */}
                <Stack.Screen name='SuratTugas' component={SuratTugas} options={{ headerShown : false }} />
                <Stack.Screen name='InputSuratTugas' component={InputSuratTugas} options={{ headerShown : false }} />

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