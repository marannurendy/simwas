import react, { useEffect, useState } from 'react'
import { View, StyleSheet, Image, Text, Dimensions, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
import { Header } from '../../assets/layout'
import AsyncStorage from '@react-native-async-storage/async-storage'
import db from '../../../config/database'
import { useNavigation } from '@react-navigation/native'
import DropDownPicker from 'react-native-dropdown-picker';
const Dimension = Dimensions.get('window')

const EditSuratTugas = (props) => {

    const { register } = props.route.params
    const Navigation = useNavigation()

    let [tanggalMulai, setTanggalMulai] = useState()
    let [tanggalSelesai, setTanggalSelesai] = useState()
    let [cabang, setCabang] = useState()
    let [userName, setUserName] = useState()
    let [nama, setNama] = useState()
    let [jenisAuditor, setJenisAuditor] = useState()
    let [stat, setStat] = useState()

    let [role, setRole] = useState()

    let [date, setDate] = useState(new Date())
    let [showStartDate, setShowStartDate] = useState(false)
    let [showEndDate, setShowEndDate] = useState(false)

    let [loading, setLoading] = useState(false)

    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState()
    const [value, setValue] = useState();
    // const [items, setItems] = useState([
    //     {label: 'cabang test 1', value: 90912},
    //     {label: 'cabang test 2', value: 90913},
    // ])
    const [items, setItems] = useState([])

    const selectDataEdit = (querySelect) => ( new Promise((resolve, reject) => {
        try{
            db.transaction(
                tx => {
                    tx.executeSql(querySelect, [], (tx, results) => {
                        resolve(results.rows.item(0))
                    })
                },function(error) {
                    reject(error)
                }
            )
        }catch(error){
            reject(error)
        }
    }) )

    useEffect(() => {
        const unsubscribe  = Navigation.addListener('focus', async () => {
            fetchData()
        })
        return unsubscribe
    })

    const fetchData = async () => {
        setLoading(true)

        const userdata = await AsyncStorage.getItem('user_data')
        let dt = JSON.parse(userdata)

        const masterData = await getMaster()
        setItems(masterData)

        let query = `SELECT DISTINCT * FROM ListSTSV WHERE `
        if(dt.role === 'RPM' || dt.role === 'PPM') {
            query = query + `No = '` + register + `' AND syncBy = '` + dt.username + `'`
        } else {
            alert('false')
        }

        const data = await selectDataEdit(query)

        // console.log(data.stat)

        setTanggalMulai(data.tglMulai)
        setTanggalSelesai(data.tglSelesai)
        setValue(data.idCabangDiperiksa)
        setUserName(data.auditor)
        setNama(data.nama_auditor)
        setJenisAuditor(data.jenisAuditor)
        setRole(dt.role)
        setStat(data.stat)

        setLoading(false)
    }

    const getMaster = () => ((new Promise((resolve, reject) => {
        let query = 'SELECT * FROM CabangDiperiksa'
        try{
            db.transaction(
                tx => {
                    tx.executeSql(query, [], (tx, results) => {
                        let a = results.rows.length
                        let arr = []

                        for(let i = 0; i < a; i++) {
                            let newdt = results.rows.item(i)

                            newdt['label'] = newdt.CabangID + '-' + newdt.NamaCabang
                            newdt['value'] = newdt.CabangID
                            arr.push(newdt)
                        }
                        // console.log(arr)
                        resolve(arr)
                    },function(error){
                        console.log(error)
                    })
                }
            )
        }catch(error){
            reject(error.message)
        }
    })))

    const PickStartDateHandler = (event, date) => {
        let dateValue = moment(date).format('YYYY-MM-DD');

        setShowStartDate(false)
        setTanggalMulai(dateValue)
    }

    const PickEndDateHandler = (event, date) => {
        let dateValue = moment(date).format('YYYY-MM-DD');

        console.log(dateValue)

        setShowEndDate(false)
        setTanggalSelesai(dateValue)
    }

    const SubmitHandler = () => {
        let today = moment().format('DD-MM-YYYY')

        let query = `UPDATE ListSTSV SET 
        tglMulai = '` + tanggalMulai + `',
        tglSelesai = '` + tanggalSelesai + `',
        idCabangDiperiksa = ` + value + `,
        keterangan = '` + label + `',
        stat = '2'
        WHERE No = ` + register + `;`

        if(stat === '1') {
            query = `UPDATE ListSTSV SET 
                tglMulai = '` + tanggalMulai + `',
                tglSelesai = '` + tanggalSelesai + `',
                idCabangDiperiksa = ` + value + `,
                keterangan = '` + label + `'
                WHERE No = ` + register + `;`
        }

        Alert.alert(
            "Perhatian",
            "Apakah anda yakin akan mengedit data surat tugas ?",
            [
                {
                    text:"Batal",
                },
                {
                    text:"Ya",
                    onPress: () => {
                        try{
                            db.transaction(
                                tx => {
                                    tx.executeSql(query)
                                },function(error) {
                                    alert('Transaction ERROR: ' + error.message);
                                },function() {
                                    Alert.alert(
                                        'Berhasil',
                                        'Update data berhasil, dengan Nomor Register ' + register,
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => {
                                                    Navigation.goBack()
                                                }
                                            }
                                        ]
                                    )
                                }
                            )
                        }catch(error){
                            alert(error.message)
                        }
                    }
                }
            ]
        )
    }

    const Head = () => {
        return(
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    {/* <Image source={require('../assets/icon/Task-small.png')} /> */}
                    <Image source={require('../../assets/icon/Task-small.png')} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Edit Surat Tugas</Text>
                        <Text style={{ marginLeft: 5, fontSize: 14 }}>Nomor Register : {register}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const BodyForm = () => {
        return(
            <SafeAreaView style={{ marginTop: 30 }}>
                {loading && 
                    <View style={styles.loading} >
                        <ActivityIndicator size={'large'} color="#0085E5" />
                    </View>
                }

                {role === 'RPM' || role === 'PPM' ? (
                    <SafeAreaView style={{ marginHorizontal: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Nama Auditor</Text>
                            <View style={{ width: Dimension.width/2 }} >
                                <TextInput
                                    value={nama}
                                    style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10 }}
                                    editable={false}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Username Auditor</Text>
                            <View style={{ width: Dimension.width/2 }} >
                                <TextInput
                                    value={userName}
                                    style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10 }}
                                    editable={false}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Jenis Auditor</Text>
                            <View style={{ width: Dimension.width/2 }} >
                                <TextInput
                                    value={jenisAuditor}
                                    style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10 }}
                                    editable={false}
                                />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Tanggal Awal</Text>
                            <View style={{ width: Dimension.width/2 }} >
                                <TouchableOpacity onPress={() => setShowStartDate(true)}>
                                    <TextInput
                                        value={tanggalMulai}
                                        style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10 }}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                            {showStartDate && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={PickStartDateHandler}
                                    minimumDate={new Date()}
                                />
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Tanggal Akhir</Text>
                            <View style={{ width: Dimension.width/2 }} >
                                <TouchableOpacity onPress={() => setShowEndDate(true)}>
                                    <TextInput
                                        value={tanggalSelesai}
                                        style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10 }}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                            </View>
                            {showEndDate && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    is24Hour={true}
                                    display="default"
                                    onChange={PickEndDateHandler}
                                    minimumDate={new Date()}
                                />
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                            <Text>Nama Cabang</Text>
                            <View style={{ width: Dimension.width/2 }}>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    placeholder={'Silahkan pilih'}
                                    searchable={true}
                                    onSelectItem={(item) => onSelect(item)}
                                    // dropDownContainerStyle={{marginLeft: 30, marginTop: 25, borderColor: "#0E71C4", width: Dimension.width/2, borderWidth: 2}}
                                    // style={{ width: Dimension.width/2.5, borderRadius: 10 }}
                                />
                            </View>
                        </View>
                    </SafeAreaView>
                ) : (
                    <View></View>
                )}

            </SafeAreaView>
        )
    }

    const onSelect = (param) => {
        setLabel(param.NamaCabang)
    }

    const ButtonSUbmit = () => {
        return(
            <View style={{ marginTop: 50 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 50 }}>
                    <TouchableOpacity onPress={() => Navigation.goBack()} style={{ flex: 3, alignItems: 'center', padding: 10, borderBottomStartRadius: 10, borderTopStartRadius: 10, backgroundColor: '#FF6347' }}>
                        <Text style={{ fontWeight: 'bold', color: '#FFF' }}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => SubmitHandler()} style={{ flex: 3, alignItems: 'center', padding:10, borderBottomEndRadius: 10, borderTopEndRadius: 10, backgroundColor: '#0085E5' }}>
                        <Text style={{ fontWeight: 'bold', color: '#FFF' }}>UPDATE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return(
        <View>
            <Header />
            <Head />
            <BodyForm />
            <ButtonSUbmit />
        </View>
    )
}

export default EditSuratTugas

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.7,
        justifyContent: 'center',
        alignItems: 'center'
    }
})