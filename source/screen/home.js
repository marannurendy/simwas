import react from 'react'
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Header } from '../assets/layout'
import Checklist from './checklist'

const Dimension = Dimensions.get('window')

const Home = () => {

    const Navigation = useNavigation()

    const MonitoringSection = () => {
        return(
            <View style={ styles.monitoringCOntainer }>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                        <Image source={require('../assets/icon/Monitoring.png')} />
                        <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Monitoring</Text>
                    </View>
                </View>
            </View>
        )
    }

    const MenuSection = () => {
        return(
            <View style={ styles.menuContainer } >
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                        <Image source={require('../assets/icon/Menu.png')} />
                        <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Menu</Text>
                    </View>

                    <View style={{ marginVertical: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', margin: 10 }}>
                            <TouchableOpacity style={{ width: Dimension.width/5, alignItems: 'center' }} onPress={() => Navigation.navigate('SuratTugas')} >
                                <Image source={require('../assets/icon/Task.png')} />
                                <Text style={styles.menuDetail}>Surat Tugas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: Dimension.width/5, alignItems: 'center' }} onPress={() => Navigation.navigate('Checklist')} >
                                <Image source={require('../assets/icon/Checklist.png')} />
                                <Text style={styles.menuDetail}>Checklist{"\n"}Pemeriksaan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: Dimension.width/5, alignItems: 'center' }} onPress={() => Navigation.navigate('TindakLanjut')}>
                                <Image source={require('../assets/icon/TindakLanjut.png')} />
                                <Text style={styles.menuDetail}>TIndak Lanjut</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', margin: 10 }}>
                            <TouchableOpacity style={{ width: Dimension.width/5, alignItems: 'center' }} onPress={() => Navigation.navigate('Pembinaan')}>
                                <Image source={require('../assets/icon/Pembinaan.png')} />
                                <Text style={styles.menuDetail}>Pembinaan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: Dimension.width/5, alignItems: 'center' }}>
                                <Image source={require('../assets/icon/Report.png')} />
                                <Text style={styles.menuDetail}>Report</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: Dimension.width/5, alignItems: 'center' }}>
                                <Image source={require('../assets/icon/Sync.png')} />
                                <Text style={styles.menuDetail}>Sync</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return(
        <View style={styles.container} >
            <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent={true} />
                <Header />
                <MonitoringSection />
                <MenuSection />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    monitoringCOntainer: {
        flex: 3
    },
    menuContainer: {
        flex: 2
    },
    menuDetail: {
        fontSize: 12,
        textAlign: 'center'
    }
})