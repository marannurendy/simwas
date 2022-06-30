import react, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import flashNotification from '../actions/alert'

import getSyncData from '../actions/sync'
import db from '../../config/database'
import { Header } from '../assets/layout'
import { GetOptionSTCLAM } from '../../config/conf'

const Dimension = Dimensions.get('window')

const Home = () => {

    const Navigation = useNavigation()

    let [loading, setLoading] = useState(false)

    //data activity
    let [totalst, setTotalst] = useState()
    let [dtStatus, setDtStatus] = useState({
        total : '',
        disetujui : '',
        belumDisetujui : '',
        baru : '',
        edit : '',
        checklistTotal : ''
    })

    useEffect(() => {
        const unsubscribe = Navigation.addListener('focus', async () => {
            inspectData()
        })
        return unsubscribe
    })

    const inspectData = async () => {
        const status = await getTotal()

        if(status !== 'SUCCESS') {
            flashNotification('Caution !', 'Status Aktifitas tidak dapat di muat', '#FF7900', '#FFF')
        }
    }

    const getTotal = () => (new Promise( async (resolve, reject) => {
        const userdt = await AsyncStorage.getItem('user_data')
        let dt = JSON.parse(userdt)

        console.log(dt)

        let typedt = '0'

        if  (dt.role === 'RPM') {
            typedt = '2'
        } else if (dt.role === 'PPM') {
            typedt = '3'
        }

        //Surat TUgas
        let querystTotal = `SELECT * FROM ListSTSV WHERE type = '` + typedt + `' AND syncBy = '` + dt.username + `';`
        let querystDisetujui = `SELECT * FROM ListSTSV WHERE type = '` + typedt + `' AND syncBy = '` + dt.username + `' AND Approval_Flag = 1;`
        let querystBelumDisetujui = `SELECT * FROM ListSTSV WHERE type = '` + typedt + `' AND syncBy = '` + dt.username + `' AND Approval_Flag != 1;`
        let querystBaru = `SELECT * FROM ListSTSV WHERE type = '` + typedt + `' AND syncBy = '` + dt.username + `' AND stat = '1';`
        let querystEdit = `SELECT * FROM ListSTSV WHERE type = '` + typedt + `' AND syncBy = '` + dt.username + `' AND stat = '2';`

        //Checklist
        let queryChecklistTotal = `SELECT * FROM ListChecklist WHERE type = '` + typedt + `' AND syncBy = '` + dt.username + `';`

        try{
            let dtStatus = {
                total : '',
                disetujui : '',
                belumDisetujui : '',
                baru : '',
                edit : '',
                checklistTotal: ''
            }

            db.transaction(
                tx => {
                    tx.executeSql(querystTotal, [], (tx, results) => {
                        dtStatus.total = results.rows.length
                    })
                    tx.executeSql(querystDisetujui, [], (tx, results) => {
                        dtStatus.disetujui = results.rows.length
                    })
                    tx.executeSql(querystBelumDisetujui, [], (tx, results) => {
                        dtStatus.belumDisetujui = results.rows.length
                    })
                    tx.executeSql(querystBaru, [], (tx, results) => {
                        dtStatus.baru = results.rows.length
                    })
                    tx.executeSql(querystEdit, [], (tx, results) => {
                        dtStatus.edit = results.rows.length
                    })
                    tx.executeSql(queryChecklistTotal, [], (tx, results) => {
                        dtStatus.checklistTotal = results.rows.length
                    })
                }, function(error) {
                    reject('ERROR')
                    console.log(error.message)
                }, function() {
                    setDtStatus(dtStatus)
                    resolve('SUCCESS')
                }
            )
        }catch(error){
            reject('ERROR')
        }
    }))

    const SyncHandler = async () => {

        setLoading(true)

        const syncStatus = await AsyncStorage.getItem('user_data')
        let data = JSON.parse(syncStatus)
        const params = {
            KodeUnit : data.kode_unit,
            Nama : data.nama,
            Username :data.username,
            Userid : data.user_id,
            PositionName :data.position_name,
            Role : data.role,
            Bisnis : data.bisnis
        }
        getSyncData(params).then(async (responseJson) => {
            if(responseJson === 'SUCCESS') {
                flashNotification("Berhasil !", 'Data berhasil di sinkronisasi', "#41BA90", "#fff")
                getTotal()
                setLoading(false)
            }else{
                flashNotification("Caution !", responseJson, "#FF7900", "#fff")
                setLoading(false)
            }
        }).catch((error) => {
            setLoading(false)
            console.log(error)
        })
    }

    const MonitoringSection = () => {
        return(
            <View style={ styles.monitoringCOntainer }>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                        <Image source={require('../assets/icon/Monitoring.png')} />
                        <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Status Aktifitas</Text>
                    </View>

                    <View style={{ flex: 1, marginTop: 10, marginBottom: 20, marginHorizontal: 20 }}>
                        <View style={{ flexDirection:'row', justifyContent: 'space-between', flex: 1 }}>
                            <View style={{ flex: 2.5, marginRight: 5 }}>
                                <View style={[{ flex: 3, borderRadius: 10, padding: 10, marginBottom: 5, backgroundColor: '#FFF' }, styles.statContainer]}>
                                    <Text style={{ fontWeight: 'bold' }}>Surat Tugas</Text>
                                    <View style={{ marginTop: 10, marginLeft: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Total</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.total}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Desetujui</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.disetujui}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Belum disetujui</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.belumDisetujui}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Baru</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.baru}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Edit</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.edit}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[{ flex: 2, borderRadius: 10, padding: 10, marginTop: 5, backgroundColor: '#FFF' }, styles.statContainer]}>
                                    <Text style={{ fontWeight: 'bold' }}>Checklist</Text>
                                    <View style={{ marginTop: 10, marginLeft: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Total</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.checklistTotal}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Desetujui</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.disetujui}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{ flex: 2.5, marginLeft: 5 }}>
                                <View style={[{ flex: 2, borderRadius: 10, padding: 10, marginBottom: 5, backgroundColor: '#FFF' }, styles.statContainer]}>
                                    <Text style={{ fontWeight: 'bold' }}>Tindak Lanjut</Text>
                                    <View style={{ marginTop: 10, marginLeft: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Total</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.total}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Desetujui</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.disetujui}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[{ flex: 2, borderRadius: 10, padding: 10, marginVertical: 5, backgroundColor: '#FFF' }, styles.statContainer]}>
                                    <Text style={{ fontWeight: 'bold' }}>Pembinaan</Text>
                                    <View style={{ marginTop: 10, marginLeft: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Total</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.total}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Desetujui</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.disetujui}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={[{ flex: 2, borderRadius: 10, padding: 10, marginTop: 5, backgroundColor: '#FFF' }, styles.statContainer]}>
                                    <Text style={{ fontWeight: 'bold' }}>Synchronized Data</Text>
                                    <View style={{ marginTop: 10, marginLeft: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Total</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.total}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>Desetujui</Text>
                                            <View>
                                                <Text style={styles.activitystValue}>{dtStatus.disetujui}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
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

                    <View style={{ marginVertical: 10 }}>
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
                            <TouchableOpacity onPress={() => SyncHandler()} style={{ width: Dimension.width/5, alignItems: 'center' }}>
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

                {loading && 
                    <View style={styles.loading} >
                        <ActivityIndicator size={'large'} color="#71CDF1" />
                    </View>
                }
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
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activitystValue: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    statContainer: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
    }
})