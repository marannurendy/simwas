import react, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Image, SafeAreaView, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'

import db from '../../../config/database'
import { Model, ModelInsertChecklist, ModelGetDataEditChecklist, ModelEditChecklist } from '../../actions/model'
import { Header } from '../../assets/layout'
import AsyncStorage from '@react-native-async-storage/async-storage'
import flashNotification from '../../actions/alert'

const Dimension = Dimensions.get('window')

const EditChecklist = (props) => {
    const { register } = props.route.params
    const Navigation = useNavigation()
    const scrollRef = useRef()

    let [dataInput, setDataInput] = useState({
        Cabang : '',
        IdST : '',
        Keterangan : '',
        NoST : '',
        TglMulai : date,
        TglSelesai : date,
        stat : '',
        syncBy : '',
        type : ''
    })

    let [inputList, setInputList] = useState([
        {
            idPemeriksaan: 1,
            jenisPemeriksaan: '',
            kategoriPemeriksaan: '',
            subKategori: '',
            pertanyaan: [
                {
                    DetailTemuan: '',
                    IdPemeriksaan: '',
                    IdST: '',
                    NoST: '',
                    Rekomendasi: '',
                    Sample: '',
                    Scoring: '',
                    Temuan: '',
                    idPertanyaan: '',
                    stat: '',
                    syncBy: '',
                    type: ''
                }
            ]
        }
    ])

    let [userInfo, setUserInfo] = useState()

    let [removedItem, setRemovedItem] = useState([])

    let [date, setDate] = useState(new Date())
    const [items, setItems] = useState([])

    const [openListST, setOpenListST] = useState(false);
    const [valueST, setValueST] = useState();

    const [dataTest, setDataTest] = useState([])

    const [listST, setListST] = useState([])
    const [jenisPemeriksaan, setJenisPemeriksaan] = useState([])
    const [dtJenisPemeriksaan, setDtJenisPemeriksaan] = useState([])
    const [kategoriPemeriksaan, setKategoriPemeriksaan] = useState([])
    const [dtKategoriPemeriksaan, setDtKategoriPemeriksaan] = useState([])
    const [subKategori, setSubKategori] = useState([])
    const [dtSubKategori, setDtSubKategori] = useState([])
    const [pertanyaan, setPertanyaan] = useState([])
    const [dtPertanyaan, setDtPertanyaan] = useState([])
    const [jawaban, setJawaban] = useState([])
    const [dtJawaban, setDtJawaban] = useState([])

    const [jnPemeriksaan, setJnPemeriksaan] = useState([])

    useEffect(() => {
        const unsubscribe = Navigation.addListener('focus', async () => {
            const data = await AsyncStorage.getItem('user_data')
            let params = JSON.parse(data)

            setUserInfo(params)
            getMaster(params)

            getDataExist(params)
        })

        return unsubscribe
    })

    const getMaster = async (params) => {
        let queryGetMasterST = await Model('queryGetMasterST', params)
        let queryGetMasterJenisPemeriksaan = await Model('queryGetMasterJenisPemeriksaan', params)
        let queryGetMasterKategoriPemeriksaan = await Model('queryGetMasterKategoriPemeriksaan', params)
        let queryGetMasterSubKategori = await Model('queryGetMasterSubKategori', params)
        let queryGetPertanyaan = await Model('queryGetMasterPertanyaan', params)
        let queryGetMasterJawaban = await Model('queryGetMasterJawaban', params)

        const masterST = await selectMaster(queryGetMasterST)
        if(masterST.status === 'ERROR') {
            alert(masterST.data)
            return false
        }

        const masterJenisPemeriksaan = await selectMaster(queryGetMasterJenisPemeriksaan)
        if(masterJenisPemeriksaan.status === 'ERROR') {
            alert(masterJenisPemeriksaan.data)
            return false
        }

        const masterKategoriPemeriksaan = await selectMaster(queryGetMasterKategoriPemeriksaan)
        if(masterKategoriPemeriksaan.status === 'ERROR') {
            alert(masterJenisPemeriksaan.data)
            return false
        }

        const masterSubKategori = await selectMaster(queryGetMasterSubKategori)
        if(masterSubKategori.status === 'ERROR') {
            alert(masterSubKategori.data)
            return false
        }

        const masterPertanyaan = await selectMaster(queryGetPertanyaan)
        if(masterPertanyaan.status === 'ERROR') {
            alert(masterPertanyaan.data)
            return false
        }

        const masterJawaban = await selectMaster(queryGetMasterJawaban)
        if(masterJawaban.status === 'ERROR') {
            alert(masterJawaban.data)
            return false
        }

        // setJawaban(masterJawaban.data)
        setDtJawaban(masterJawaban.data)
        // setPertanyaan([masterPertanyaan.data])
        setDtPertanyaan(masterPertanyaan.data)
        // setSubKategori([masterSubKategori.data])
        setDtSubKategori(masterSubKategori.data)
        // setKategoriPemeriksaan([masterKategoriPemeriksaan.data])
        setDtKategoriPemeriksaan(masterKategoriPemeriksaan.data)
        // setJenisPemeriksaan([masterJenisPemeriksaan.data])
        setDtJenisPemeriksaan(masterJenisPemeriksaan.data)
        // setListST(masterST.data)

    }

    const getDataExist = async (params) => {
        let queryGetDataDetail = await ModelGetDataEditChecklist('queryGetDataDetail', register, params)
        let queryGetDataQuest = await ModelGetDataEditChecklist('queryGetDataQuest', register, params)

        // let test = `SELECT * FROM ListPemeriksaan`
        // let test1 = await selectMaster(test, register)
        // console.log(test1)

        let queryDetailQuest = `SELECT DISTINCT a.*
                                FROM ListPemeriksaan a
                                INNER JOIN InputListChecklist b ON a.IdPemeriksaan = b.IdPemeriksaan
                                WHERE a.NoST = '` + register + `' AND b.stat <> '1'`
        let detailQuest = await selectMasterDetail(queryDetailQuest, register)
        if(detailQuest.status === 'ERROR') {
            alert(detailQuest.data)
            return false
        }
        // console.log(detailQuest.data)
        // console.log(detailQuest)
        setInputList(detailQuest.data)
        // setDtInputList(detailQuest.data)


        let masterDataDetail = await selectMaster(queryGetDataDetail)
        if(masterDataDetail.status === 'ERROR') {
            alert(masterDataDetail.data)
            return false
        }
        setDataInput(masterDataDetail.data[0])
        setValueST(masterDataDetail.data[0].NoST)

        let masterDataQuest = await selectMaster(queryGetDataQuest)
        if(masterDataQuest.status === 'ERROR') {
            alert(masterDataQuest.data)
            return false
        }

        // console.log(masterDataQuest)
    }

    const selectMasterDetail = (query, register) => (new Promise( async (resolve, reject) => {

        let response = {
            status : '',
            data : []
        }

        let det = {
            idPemeriksaan: '',
            jenisPemeriksaan: '',
            kategoriPemeriksaan: '',
            subKategori: '',
            pertanyaan: []
        }

        const data = await AsyncStorage.getItem('user_data')
        let params = JSON.parse(data)

        let queryGetMasterJenisPemeriksaan = await Model('queryGetMasterJenisPemeriksaan', params)
        let queryGetMasterKategoriPemeriksaan = await Model('queryGetMasterKategoriPemeriksaan', params)
        let queryGetMasterSubKategori = await Model('queryGetMasterSubKategori', params)
        let queryGetPertanyaan = await Model('queryGetMasterPertanyaan', params)
        let queryGetMasterJawaban = await Model('queryGetMasterJawaban', params)

        const masterJenisPemeriksaan = await selectMaster(queryGetMasterJenisPemeriksaan)
        if(masterJenisPemeriksaan.status === 'ERROR') {
            alert(masterJenisPemeriksaan.data)
            return false
        }

        const masterKategoriPemeriksaan = await selectMaster(queryGetMasterKategoriPemeriksaan)
        if(masterKategoriPemeriksaan.status === 'ERROR') {
            alert(masterJenisPemeriksaan.data)
            return false
        }

        const masterSubKategori = await selectMaster(queryGetMasterSubKategori)
        if(masterSubKategori.status === 'ERROR') {
            alert(masterSubKategori.data)
            return false
        }

        const masterPertanyaan = await selectMaster(queryGetPertanyaan)
        if(masterPertanyaan.status === 'ERROR') {
            alert(masterPertanyaan.data)
            return false
        }

        const masterJawaban = await selectMaster(queryGetMasterJawaban)
        if(masterJawaban.status === 'ERROR') {
            alert(masterJawaban.data)
            return false
        }
        
        try{
            db.transaction (
                tx => {
                    tx.executeSql(query, [], async (tx, results) => {
                        let dataLen = results.rows.length
                        let arr = []

                        for(let a = 0; a < dataLen; a++) {
                            let dt = results.rows.item(a)

                            let queryQuest = `SELECT * FROM InputListChecklist WHERE NoST = '` + dt.NoST + `' AND IdPemeriksaan = '` + dt.IdPemeriksaan + `' AND stat != '1'`
                            // let queryQuest = `SELECT * FROM InputListChecklist WHERE AND NoST = '` + dt.NoST + `' AND IdPemeriksaan = '` + dt.IdPemeriksaan + `' AND stat NOT IN (NULL)`
                            // console.log(queryQuest)
                            let quest = await getQuestion(queryQuest)
                            // console.log("pertanyaan")
                            // console.log(quest)

                            if(a == 0) {
                                // console.log("ini pertama")
                                const newJenisPemeriksaan = []
                                const newKategoriPemeriksaan = []
                                const newSubKategori = []
                                const newPertanyaan = []

                                newJenisPemeriksaan.push(masterJenisPemeriksaan.data)
                                newKategoriPemeriksaan.push(masterKategoriPemeriksaan.data)
                                newSubKategori.push(masterSubKategori.data)
                                newPertanyaan.push(masterPertanyaan.data)

                                jenisPemeriksaan.push(newJenisPemeriksaan[0])
                                kategoriPemeriksaan.push(newKategoriPemeriksaan[0])
                                subKategori.push(newSubKategori[0])
                                pertanyaan.push(newPertanyaan[0])
                            }else{
                                // console.log("ini kedua")

                                jenisPemeriksaan.push(masterJenisPemeriksaan.data)
                                kategoriPemeriksaan.push(masterKategoriPemeriksaan.data)
                                subKategori.push(masterSubKategori.data)
                                pertanyaan.push(masterPertanyaan.data)
                            }

                            det = {
                                idPemeriksaan: dt.IdPemeriksaan,
                                jenisPemeriksaan: dt.JenisPememeriksaan,
                                kategoriPemeriksaan: dt.KategoriPemeriksaan,
                                subKategori: dt.SubKategori,
                                pertanyaan: quest
                            }
                            
                            arr.push(det)

                        }

                        // console.log(pertanyaan)

                        response = {
                            status : 'SUCCESS',
                            data: arr
                        }
    
                        resolve(response)

                    })
                }, function(error) {
                    response = {
                        status : 'ERROR',
                        data: error.message
                    }

                    reject(response)
                }
            )
        }catch(error){
            response = {
                status : 'ERROR',
                data : error.message
            }
            reject(response)
        }
    }))

    const getQuestion = (queryQuest) => (new Promise( async (resolve, reject) => {
        db.transaction (
            tx => {
                tx.executeSql(queryQuest, [], (tx, results) => {
                    let dtLen = results.rows.length
                    let arrHelp = []

                    for(let i = 0; i < dtLen; i ++) {
                        let dataQuest = results.rows.item(i)
                        
                        arrHelp.push(dataQuest)
                    }

                    resolve(arrHelp)
                })
            }, function(error) {
                reject('error')
                console.log(error.message)
            }
        )
    }))

    const selectMaster = (query) => (new Promise((resolve, reject) => {
        let response = {
            status : '',
            data : []
        }
        try{
            db.transaction(
                tx => {
                    tx.executeSql(query, [], (tx, results) => {
                        let dataLen = results.rows.length
                        let arr = []

                        for(let a = 0; a < dataLen; a++) {
                            let newDt = results.rows.item(a)
                            arr.push(newDt)
                        }

                        response = {
                            status : 'SUCCESS',
                            data: arr
                        }
                        resolve(response)
                    })
                }, function(error) {
                    response = {
                        status : 'ERROR',
                        data: error.message
                    }
                    reject(response)
                }
            )
        }catch(error){
            response = {
                status : 'ERROR',
                data : error.message
            }
            reject(response)
        }
    }))

    const Head = () => {
        return(
            <View style={{ marginTop: 20, marginHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Image source={require('../assets/icon/Task-small.png')} /> */}
                    <Image source={require('../../assets/icon/Checklist-small.png')} />
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >Edit Checklist</Text>
                </View>
                <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => SaveHandler()} style={{ paddingVertical: 5, paddingHorizontal: 25, justifyContent: 'center', borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#0085E5' }}>
                        <Ionicons name="save" size={18} color="#FFF" style={{ marginHorizontal: 5 }} />
                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Update</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        )
    }

    const jenisPemeriksaanChangeHandler = (val, i) => {
        console.log(val)
        let newData = [...inputList]
        newData[i].jenisPemeriksaan = val
        newData[i].kategoriPemeriksaan = ''
        setInputList(newData)

        let optData = []
        optData = dtKategoriPemeriksaan.filter(function(item) {
            const itemData = item.IdTipeCeklist.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.includes(textData);
        })

        let newdt = [...kategoriPemeriksaan]
        newdt[i] = [...optData]

        setKategoriPemeriksaan([...newdt]);
    }

    const kategoriPemeriksaanChangeHandler = (val, i) => {
        let newData = [...inputList]
        newData[i].kategoriPemeriksaan = val
        newData[i].subKategori = ''
        setInputList(newData)

        let optData = []
        optData = dtSubKategori.filter(function(item) {
            const itemData = item.IdKategori.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.includes(textData);
        })

        let newdt = [...subKategori]
        newdt[i] = [...optData]

        setSubKategori([...newdt]);
    }

    const subKategoriChangeHandler = (val, i) => {
        let newData = [...inputList]
        newData[i].subKategori = val
        newData[i].pertanyaan = [
            {
                DetailTemuan: '',
                IdPemeriksaan: '',
                IdST: '',
                NoST: '',
                Rekomendasi: '',
                Sample: '',
                Scoring: '',
                Temuan: '',
                idPertanyaan: '',
                stat: '',
                syncBy: '',
                type: ''
            }
        ]
        setInputList(newData)

        let optData = []
        optData = dtPertanyaan.filter(function(item) {
            const itemData = item.IdSubKategori.toUpperCase();
            const textData = val.toUpperCase();
            return itemData.includes(textData);
        })

        let newdt = [...pertanyaan]
        newdt[i] = [...optData]

        setPertanyaan([...newdt]);
    }

    const pertanyaanChangeHandler = (val, idx, i) => {
        let newData = [...inputList]
        newData[idx].pertanyaan[i].idPertanyaan = val

        setInputList(newData)
    }

    const jawabanChangeHandler = (val, idx, i) => {
        let newData = [...inputList]
        newData[idx].pertanyaan[i].scoring = val

        setInputList(newData)
    }

    const addFormHandler = () => {
        let lastId = inputList[inputList.length - 1].idPemeriksaan
        let id = Number(lastId) + 1

        let newObj = {
            idPemeriksaan: id,
            jenisPemeriksaan: '',
            kategoriPemeriksaan: '',
            subKategori: '',
            pertanyaan: [
                {
                    DetailTemuan: '',
                    IdPemeriksaan: '',
                    IdST: '',
                    NoST: '',
                    Rekomendasi: '',
                    Sample: '',
                    Scoring: '',
                    Temuan: '',
                    idPertanyaan: '',
                    stat: '',
                    syncBy: '',
                    type: ''
                }
            ]
        }

        jenisPemeriksaan.push(dtJenisPemeriksaan)
        kategoriPemeriksaan.push(dtKategoriPemeriksaan)
        subKategori.push(dtSubKategori)
        pertanyaan.push(dtPertanyaan)

        setInputList([...inputList, newObj])
    }

    const removeHandler = (index, item) => {

        let idx = removedItem.length
        let data = [...removedItem]
        data.push(item)

        for(let a = 0; a < data[idx].pertanyaan.length; a++) {
            data[idx].pertanyaan[a].stat = "1"
        }

        console.log(data)
        setRemovedItem(data)

        //TO REMOVE
        let dt = [...inputList]
        dt.splice(index, 1)
        setInputList(dt)

        // let test = [...jenisPemeriksaan]
        // test.splice(index, 1)
        // console.log(test)

        // let lastIndex = inputList.length - 1

        // if(lastIndex === 0) {
        //     flashNotification('Caution', 'Silakan tambahkan form pemeriksaan', '#FF7900')
        //     return false
        // }

        // let dt = [...inputList]
        // dt.splice(lastIndex, 1)
        // setInputList(dt)

        // let listJenisPemeriksaan = [...jenisPemeriksaan]
        // listJenisPemeriksaan.splice(index, 1)
        // setJenisPemeriksaan(listJenisPemeriksaan)

        // let listKategoriPemeriksaan = [...kategoriPemeriksaan]
        // listKategoriPemeriksaan.splice(index, 1)
        // setJenisPemeriksaan(listKategoriPemeriksaan)

        // let listSubKategori = [...subKategori]
        // listSubKategori.splice(index, 1)
        // setJenisPemeriksaan(listSubKategori)

        // let listPertanyaan = [...pertanyaan]
        // listPertanyaan.splice(index, 1)
        // setJenisPemeriksaan(listPertanyaan)
    }

    const addFormPertanyaanHandler = (i) => {
        let newObj =  {
            DetailTemuan: '',
            IdPemeriksaan: '',
            Rekomendasi: '',
            Sample: '',
            Scoring: '',
            Temuan: '',
            idPertanyaan: '',
        }

        let newData = [...inputList]
        newData[i].pertanyaan.push(newObj)

        setInputList(newData)
    }
    const removeFormPertanyaanHandler = (i) => {
        let newData = [...inputList]
        let lastid = newData[i].pertanyaan.length - 1

        newData[i].pertanyaan.splice(lastid, 1)
        setInputList(newData)
    }

    const onSelectListST = (item) => {
        console.log('ini')
        console.log(item)
        setDataInput(item)
    }

    const SaveHandler = async () => {

        // var difference = dtInputList.filter(x => inputList.indexOf(x) === -1)

        // console.log('diferensiasi')
        // console.log(difference)

        // console.log(inputList)
        // console.log(kategoriPemeriksaan)

        // console.log("here")

        // let newData = [...inputList]
        // for(let a = 0; a < removedItem.length; a++) {
        //     newData.push(removedItem[a])
        // }
        // console.log(newData)
        // console.log(newData)

        // UNCOMMENT
        let dataLength = inputList.length
        // let dataPemeriksaan = inputList
        let dataChecklist = {
            noST : valueST,
            idST : dataInput.IdST,
            cabang : dataInput.Cabang,
            keterangan : dataInput.Keterangan,
            tgl : moment(dataInput.Tgl).format('L'),
            tglMulai : moment(dataInput.TglMulai).format('L'),
            tglSelesai : moment(dataInput.TglSelesai).format('L')

        }

        Alert.alert(
            'Perhatian !',
            'Apakah anda yakin akan mengubah data Checklist ?',
            [
                {
                    text: 'Batal'
                },
                {
                    text: 'Ya',
                    onPress: async () => {
                        let newData = [...inputList]
                        for(let a = 0; a < removedItem.length; a++) {
                            newData.push(removedItem[a])
                        }

                        let dataPemeriksaan = newData
                        // console.log(dataPemeriksaan)

                        const PostData = await ModelEditChecklist(dataChecklist, dataPemeriksaan, userInfo)
        
                        if(PostData.status === 'ERROR') {
                            Alert.alert(
                                'ERROR',
                                'Data gagal disimpan : ' + PostData.data,
                                [
                                    {
                                        text: 'Ok'
                                    }
                                ]
                            )
                        }else if(PostData.status === 'SUCCESS') {
                            Alert.alert(
                                'BERHASIL',
                                'Data Berhasil di simpan',
                                [
                                    {
                                        text: 'Ok',
                                        onPress: () => Navigation.goBack()
                                    }
                                ]
                            )
                        }
                    }
                }
            ]
        )
    }

    return(
        <View style={{ flex: 1 }}>
            <Header />
            <Head />
            <SafeAreaView style={{ marginTop: 10, flex: 1 }}>
                <ScrollView ref={scrollRef} style={{ marginHorizontal: 10 }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Nomor Surat Tugas</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                numberOfLines={1}
                                value={dataInput.NoST}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Nama Unit</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                numberOfLines={1}
                                value={dataInput.Keterangan}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Tanggal Input</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                value={moment(dataInput.Tgl).format('L')}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Tanggal Awal</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                value={moment(dataInput.TglMulai).format("DD-MM-YYYY")}
                                // value={dataInput.TglMulai}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Tanggal Akhir</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                value={moment(dataInput.TglSelesai).format("DD-MM-YYYY")}
                                // value={dataInput.TglSelesai}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Tanggal Target</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                value={moment(dataInput.TglSelesai).add(30, 'days').format("DD-MM-YYYY")}
                                // value={moment(dataInput.tglSelesai).format('L')}
                                style={{ borderWidth: 1, borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#73777F' }}
                                editable={false}
                            />
                        </View>
                    </View>

                    <View style={{ justifyContent: 'space-between', marginTop: 20, flex: 1 } }>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Pemeriksaan</Text>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => addFormHandler()} style={{ marginHorizontal: 2.5, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0085E5' }}>
                                <Ionicons name="md-add-circle" size={26} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeHandler()} style={{ marginHorizontal: 2.5, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 10, backgroundColor: '#FF6347' }}>
                                <Ionicons name="remove-circle-outline" size={26} color="white" />
                            </TouchableOpacity>
                        </View> */}

                        {inputList.map((x, i) => {
                            return(
                                <View key={i} style={{ marginBottom: i === inputList.length - 1 ? 0 : 12, borderColor: 'gray', backgroundColor: '#FFF', borderWidth: 1, borderRadius: 15, marginTop: 10, padding: 15, marginBottom: 20 }} >
                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => addFormHandler()} style={{ marginHorizontal: 2.5, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0085E5' }}>
                                                <Ionicons name="md-add-circle" size={26} color="white" />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => removeHandler(i, inputList[i])} style={{ marginHorizontal: 2.5, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 10, backgroundColor: '#FF6347' }}>
                                                <Ionicons name="remove-circle-outline" size={26} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 15 }}>Jenis Pemeriksaan : </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <View style={{ width: Dimension.width/1.5, borderBottomWidth: 1 }} >
                                                    {jenisPemeriksaan[i] === undefined ? (
                                                        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                            <Text style={{ fontSize: 15 }}>Mohon Tunggu ...</Text>
                                                        </View>
                                                    ) : (
                                                        <Picker
                                                            selectedValue={inputList[i].jenisPemeriksaan}
                                                            onValueChange={(val, idx) => jenisPemeriksaanChangeHandler(val, i)}
                                                            style={{ fontSize: 10 }}
                                                        >
                                                            <Picker.Item label={'Silahkan Pilih'} value={''} />
                                                            {jenisPemeriksaan[i].map((item, index) => (
                                                                <Picker.Item label={item.label} value={item.value} key={index} />
                                                            ))}
                                                        </Picker>
                                                    )}
                                                    
                                                </View>
                                            </View>
                                        </View>
                        
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={{ fontSize: 15 }}>Kategori Pemeriksaan : </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <View style={{ width: Dimension.width/1.5, borderBottomWidth: 1 }} >
                                                    {kategoriPemeriksaan[i] === undefined ? (
                                                        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                            <Text style={{ fontSize: 15 }}>Mohon Tunggu ...</Text>
                                                        </View>
                                                    ) : (
                                                        <Picker
                                                            selectedValue={inputList[i].kategoriPemeriksaan}
                                                            onValueChange={(val, idx) => kategoriPemeriksaanChangeHandler(val, i)}
                                                            onFocus={() => {
                                                                let optData = []
                                                                optData = dtKategoriPemeriksaan.filter(function(item) {
                                                                    const itemData = item.IdTipeCeklist.toUpperCase();
                                                                    const textData = inputList[i].jenisPemeriksaan.toUpperCase();
                                                                    return itemData.includes(textData);
                                                                })

                                                                let newdt = [...kategoriPemeriksaan]
                                                                newdt[i] = [...optData]

                                                                setKategoriPemeriksaan([...newdt]);
                                                            }}
                                                            style={{ fontSize: 10 }}
                                                        >
                                                            <Picker.Item label={'Silahkan Pilih'} value={''} />
                                                            {kategoriPemeriksaan[i].map((item, index) => (
                                                                <Picker.Item label={item.label} value={item.value} key={index} />
                                                            ))}
                                                        </Picker>
                                                    )}
                                                    
                                                </View>
                                            </View>
                                        </View>
                        
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={{ fontSize: 15 }}>Sub Kategori : </Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <View style={{ width: Dimension.width/1.5, borderBottomWidth: 1 }} >
                                                    {subKategori[i] === undefined ? (
                                                        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                            <Text style={{ fontSize: 15 }}>Mohon Tunggu ...</Text>
                                                        </View>
                                                    ) : (
                                                        <Picker
                                                        selectedValue={inputList[i].subKategori}
                                                        onValueChange={(val, idx) => subKategoriChangeHandler(val, i)}
                                                        onFocus={() => {
                                                            let optData = []
                                                            optData = dtSubKategori.filter(function(item) {
                                                                const itemData = item.IdKategori.toUpperCase();
                                                                const textData = inputList[i].kategoriPemeriksaan.toUpperCase();
                                                                return itemData.includes(textData);
                                                            })

                                                            let newdt = [...subKategori]
                                                            newdt[i] = [...optData]

                                                            setSubKategori([...newdt]);
                                                        }}
                                                        style={{ fontSize: 10 }}
                                                    >
                                                        <Picker.Item label={'Silahkan Pilih'} value={''} />
                                                        {subKategori[i].map((item, index) => (
                                                            <Picker.Item label={item.label} value={item.value} key={index} />
                                                        ))}
                                                    </Picker>
                                                    )}
                                                    
                                                </View>
                                            </View>
                                        </View>
                                        
                                        <View style={{ marginTop: 30 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Pertanyaan</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <TouchableOpacity onPress={() => addFormPertanyaanHandler(i)} style={{ marginHorizontal: 2.5, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 10, backgroundColor: '#0085E5' }}>
                                                    <Ionicons name="md-add-circle" size={20} color="white" />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => removeFormPertanyaanHandler(i)} style={{ marginHorizontal: 2.5, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 10, backgroundColor: '#FF6347' }}>
                                                    <Ionicons name="remove-circle-outline" size={20} color="white" />
                                                </TouchableOpacity>
                                            </View>

                                            {inputList[i].pertanyaan.map((y, idx) => {
                                                return(
                                                    <View key={idx}>
                                                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, marginTop: 20, padding: 10 }}>
                                                            <Text style={{ fontSize: 15 }}>Pilih Pertanyaan : </Text>
                                                            <View style={{ ustifyContent: 'flex-end', marginBottom: 20 }}>
                                                                <View style={{ borderBottomWidth: 1, marginLeft: 10 }} >
                                                                    {pertanyaan[i] === undefined ? (
                                                                        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                            <Text style={{ fontSize: 15 }}>Mohon Tunggu ...</Text>
                                                                        </View>
                                                                    ) : (
                                                                        <Picker
                                                                            selectedValue={inputList[i].pertanyaan[idx].idPertanyaan}
                                                                            onValueChange={(val) => pertanyaanChangeHandler(val, i, idx)}
                                                                            onFocus={() => {
                                                                                let optData = []
                                                                                optData = dtPertanyaan.filter(function(item) {
                                                                                    const itemData = item.IdSubKategori.toUpperCase();
                                                                                    const textData = inputList[i].subKategori.toUpperCase();
                                                                                    return itemData.includes(textData);
                                                                                })

                                                                                let newdt = [...pertanyaan]
                                                                                newdt[i] = [...optData]
                                                                            }}
                                                                            style={{ fontSize: 10 }}
                                                                        >
                                                                            <Picker.Item label={'Silahkan Pilih'} value={''} />
                                                                            {pertanyaan[i].map((item, index) => (
                                                                                <Picker.Item label={item.label} value={item.value} key={index} />
                                                                            ))}
                                                                        </Picker>
                                                                    )}
                                                                </View>
                                                            </View>

                                                                <View>
                                                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                                        <View style={{ flex: 2 }}>
                                                                            <Text style={{ fontSize: 15 }}>Jumlah Sample</Text>
                                                                        </View>
                                                                        <View style={{ flex: 3 }} >
                                                                            <View style={{ borderWidth: 1, borderRadius: 5 }}>
                                                                                <TextInput
                                                                                    value={inputList[i].pertanyaan[idx].Sample}
                                                                                    placeholder='Masukkan jumlah sample'
                                                                                    style={{ marginHorizontal: 10 }}
                                                                                    keyboardType={'numeric'}
                                                                                    onChangeText={(val) => {
                                                                                        let newData = [...inputList]
                                                                                        inputList[i].pertanyaan[idx].Sample = val
                                                                                        setInputList(newData)
                                                                                    }}
                                                                                />
                                                                            </View>
                                                                        </View>
                                                                    </View>

                                                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                                        <View style={{ flex: 2 }}>
                                                                            <Text style={{ fontSize: 15 }}>Jumlah Temuan</Text>
                                                                        </View>
                                                                        <View style={{ flex: 3}} >
                                                                            <View style={{ borderWidth: 1, borderRadius: 5 }}>
                                                                                <TextInput
                                                                                    value={inputList[i].pertanyaan[idx].Temuan}
                                                                                    placeholder='Masukkan jumlah temuan'
                                                                                    style={{ marginHorizontal: 10 }}
                                                                                    keyboardType={'numeric'}
                                                                                    onChangeText={(val) => {
                                                                                        let newData = [...inputList]
                                                                                        inputList[i].pertanyaan[idx].Temuan = val
                                                                                        setInputList(newData)
                                                                                    }}
                                                                                />
                                                                            </View>
                                                                        </View>
                                                                    </View>

                                                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                                        <View style={{ flex: 2}} >
                                                                            <Text style={{ fontSize: 15 }}>Detail Temuan</Text>
                                                                        </View>
                                                                        <View style={{ flex: 3}} >
                                                                            <View style={{ borderWidth: 1, borderRadius: 5 }}>
                                                                                <TextInput
                                                                                    value={inputList[i].pertanyaan[idx].DetailTemuan}
                                                                                    placeholder='Masukkan detail temuan'
                                                                                    numberOfLines={10}
                                                                                    multiline={true}
                                                                                    style={{ marginHorizontal: 10 }}
                                                                                    onChangeText={(val) => {
                                                                                        let newData = [...inputList]
                                                                                        inputList[i].pertanyaan[idx].DetailTemuan = val
                                                                                        setInputList(newData)
                                                                                    }}
                                                                                    blurOnSubmit={true}
                                                                                />
                                                                            </View>
                                                                        </View>
                                                                    </View>

                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <View style={{ flex: 2}} >
                                                                            <Text style={{ fontSize: 15 }}>Rekomendasi</Text>
                                                                        </View>
                                                                        <View style={{ flex: 3}} >
                                                                            <View style={{ borderWidth: 1, borderRadius: 5 }}>
                                                                                <TextInput
                                                                                    value={inputList[i].pertanyaan[idx].Rekomendasi}
                                                                                    placeholder='Masukkan rekomendasi'
                                                                                    numberOfLines={5}
                                                                                    multiline={true}
                                                                                    style={{ marginHorizontal: 10 }}
                                                                                    onChangeText={(val) => {
                                                                                        let newData = [...inputList]
                                                                                        inputList[i].pertanyaan[idx].Rekomendasi = val
                                                                                        setInputList(newData)
                                                                                    }}
                                                                                    blurOnSubmit={true}
                                                                                />
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                    
                                                                </View>
                                                            
                                                        </View>
                                                    </View>
                                                )
                                            })}
                        
                                        </View>
                                    </View>
                                </View>
                            )
                        })}

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default EditChecklist

const styles = StyleSheet.create({

})