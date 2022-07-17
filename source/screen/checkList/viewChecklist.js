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

const ViewChecklist = (props) => {
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

        let queryDetailQuest = `    SELECT DISTINCT 
                                        a.*,
                                        b.Tipe_Ceklist,
                                        c.Nama_Kategori,
                                        d.Nama_Sub_Kategori
                                    FROM ListPemeriksaan a
                                    INNER JOIN TipePemeriksaan b ON a.JenisPememeriksaan = b.Id
                                    INNER JOIN MasterKategori c ON a.KategoriPemeriksaan = c.IdKategori
                                    INNER JOIN SubKategori d ON a.SubKategori = d.IdSubKategori
                                    WHERE NoST = '` + register + `'`
        let detailQuest = await selectMasterDetail(queryDetailQuest, register)
        if(detailQuest.status === 'ERROR') {
            alert(detailQuest.data)
            return false
        }
        console.log(detailQuest.data)
        // console.log(detailQuest)
        setInputList(detailQuest.data)


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

                            let queryQuest = `  SELECT
                                                    a.*,
                                                    b.Pertanyaan
                                                FROM InputListChecklist a
                                                INNER JOIN Pertanyaan b ON a.idPertanyaan = b.IdPertanyaan
                                                WHERE NoST = '` + dt.NoST + `' AND IdPemeriksaan = '` + dt.IdPemeriksaan + `' AND stat != '1'`
                            let quest = await getQuestion(queryQuest)

                            if(a == 0) {
                                console.log("ini pertama")
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
                                console.log("ini kedua")

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
                                namaJenisPemeriksaan: dt.Tipe_Ceklist,
                                namaKategoriPemeriksaan: dt.Nama_Kategori,
                                namaSubKategori: dt.Nama_Sub_Kategori,
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
                    <Text style={{ marginLeft: 5, fontWeight: 'bold', fontSize: 16 }} >View data Checklist</Text>
                </View>
            </View>
        )
    }

    const jenisPemeriksaanChangeHandler = (val, i) => {
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

    const removeHandler = (index) => {

        console.log(index)

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

        // console.log(inputList)

        // console.log(kategoriPemeriksaan)
        let dataLength = inputList.length
        let dataPemeriksaan = inputList
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
                                style={{ borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#0C0B0B' }}
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
                                style={{ borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#0C0B0B' }}
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } }>
                        <Text>Tanggal Awal</Text>
                        <View style={{ width: Dimension.width/2 }} >
                            <TextInput
                                value={moment(dataInput.TglMulai).format("DD-MM-YYYY")}
                                // value={dataInput.TglMulai}
                                style={{ borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#0C0B0B' }}
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
                                style={{ borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#0C0B0B' }}
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
                                style={{ borderRadius: 10, padding: 5, backgroundColor: '#FFF', paddingHorizontal: 10, color: '#0C0B0B' }}
                                editable={false}
                            />
                        </View>
                    </View>

                    <View style={{ justifyContent: 'space-between', marginTop: 20, flex: 1 } }>
                        {inputList.map((x, i) => {
                            return(
                                <View key={i} style={{ marginBottom: i === inputList.length - 1 ? 0 : 12, borderColor: 'gray', backgroundColor: '#FFF', borderWidth: 1, borderRadius: 15, marginTop: 10, padding: 15, marginBottom: 20 }} >
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Pemeriksaan {i + 1}</Text>
                                    <View style={{ marginTop: 15 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
                                            <Text style={{ fontSize: 15 }}>Jenis Pemeriksaan</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <View style={{ width: Dimension.width/2.5 }} >
                                                    {jenisPemeriksaan[i] === undefined ? (
                                                        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                            <Text style={{ fontSize: 15 }}>Mohon Tunggu ...</Text>
                                                        </View>
                                                    ) : (
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text>:</Text>
                                                            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                <Text style={{ fontSize: 15 }}>{inputList[i].namaJenisPemeriksaan}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    
                                                </View>
                                            </View>
                                        </View>
                        
                                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 15 }}>Kategori Pemeriksaan</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <View style={{ width: Dimension.width/2.5 }} >
                                                    {kategoriPemeriksaan[i] === undefined ? (
                                                        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                            <Text style={{ fontSize: 15 }}>Mohon Tunggu ...</Text>
                                                        </View>
                                                    ) : (
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text>:</Text>
                                                            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                <Text style={{ fontSize: 15 }}>{inputList[i].namaKategoriPemeriksaan}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    
                                                </View>
                                            </View>
                                        </View>
                        
                                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 15 }}>Sub Kategori</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <View style={{ width: Dimension.width/2.5 }} >
                                                    {subKategori[i] === undefined ? (
                                                        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                            <Text style={{ fontSize: 15 }}>Mohon Tunggu ...</Text>
                                                        </View>
                                                    ) : (
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text>:</Text>
                                                            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                <Text style={{ fontSize: 15 }}>{inputList[i].namaSubKategori}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    
                                                </View>
                                            </View>
                                        </View>
                                        
                                        <View style={{ marginTop: 30 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Pertanyaan</Text>

                                            {inputList[i].pertanyaan.map((y, idx) => {
                                                return(
                                                    <View key={idx}>
                                                        <View style={{ flex: 1, borderWidth: 1, borderRadius: 10, marginTop: 20, padding: 10 }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                <Text style={{ fontSize: 15 }}>Pertanyaan</Text>
                                                                <View style={{ width: Dimension.width/2.5 }} >
                                                                    {pertanyaan[i] === undefined ? (
                                                                        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                            <Text style={{ fontSize: 15 }}>Mohon Tunggu ...</Text>
                                                                        </View>
                                                                    ) : (
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                            <Text>:</Text>
                                                                            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                                <Text style={{ fontSize: 15 }}>{inputList[i].pertanyaan[idx].Pertanyaan}</Text>
                                                                            </View>
                                                                        </View>
                                                                    )}
                                                                </View>
                                                            </View>

                                                                <View>
                                                                    <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <View style={{ width: Dimension.width/2.5 }}>
                                                                            <Text style={{ fontSize: 15 }}>{inputList[i].pertanyaan[idx].DefinisiSample}</Text>
                                                                        </View>
                                                                        <View style={{ width: Dimension.width/2.5 }} >
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                <Text>:</Text>
                                                                                <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                                    <Text style={{ fontSize: 15 }}>{inputList[i].pertanyaan[idx].Sample}</Text>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    </View>

                                                                    <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <View style={{ width: Dimension.width/2.5 }}>
                                                                            <Text style={{ fontSize: 15 }}>{inputList[i].pertanyaan[idx].DefinisiTemuan}</Text>
                                                                        </View>
                                                                        <View style={{ width: Dimension.width/2.5 }} >
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                <Text>:</Text>
                                                                                <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                                    <Text style={{ fontSize: 15 }}>{inputList[i].pertanyaan[idx].Temuan}</Text>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    </View>

                                                                    <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <View>
                                                                            <Text style={{ fontSize: 15 }}>Detail Temuan</Text>
                                                                        </View>
                                                                        <View style={{ width: Dimension.width/2.5 }} >
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                <Text>:</Text>
                                                                                <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                                    <Text style={{ fontSize: 15 }}>{inputList[i].pertanyaan[idx].DetailTemuan}</Text>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    </View>

                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <View>
                                                                            <Text style={{ fontSize: 15 }}>Rekomendasi</Text>
                                                                        </View>
                                                                        <View style={{ width: Dimension.width/2.5 }} >
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                                <Text>:</Text>
                                                                                <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                                    <Text style={{ fontSize: 15 }}>{inputList[i].pertanyaan[idx].Rekomendasi}</Text>
                                                                                </View>
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

export default ViewChecklist

const styles = StyleSheet.create({

})