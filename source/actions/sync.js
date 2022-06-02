import db from "../../config/database"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ToastAndroid } from "react-native"
import { 
    GetListKodeCLKA,
    GetOptionSVKC,
    OptionSTAM,
    GetCabangDiperiksa,
    GetListPPM,
    GetListRPM,
    GetOptionST,
    GetPemeriksa,
    GetoptionSTWakadiv } from "../../config/conf"
import moment from 'moment'

const getSyncData = (params) => new Promise((resolve) => {

    const year = moment().format('YYYY')

    const truncat = (reject, source) => {
        if (__DEV__) console.log('ACTIONS GET SYNC DATA TRUNCAT LOADED');

        return db.transaction(
            tx => {
                tx.executeSql("DELETE FROM ListKodeCLKA");
                tx.executeSql("DELETE FROM OptionSVKC");
                tx.executeSql("DELETE FROM OptionSTAM");
                tx.executeSql("DELETE FROM CabangDiperiksa");
                tx.executeSql("DELETE FROM ListPPM");
                tx.executeSql("DELETE FROM ListRPM");
                tx.executeSql("DELETE FROM OptionST");
                tx.executeSql("DELETE FROM Pemeriksa");
                tx.executeSql("DELETE FROM OptionSTWAKADIF");
            }, function(error) {
                ToastAndroid.show("SOMETHING WENT WRONG: " + JSON.stringify(error), ToastAndroid.SHORT);
                reject('GAGAL MEMPROSES DATA ' + source);
            }, function() {
                resolve('DATA KOSONG ' + source)
            }
        )
    }

    const InsertST = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO ListSTSV (
                    Id,
                    No,
                    Tgl,
                    tglMulai,
                    tglSelesai,
                    keterangan,
                    Approval_By,
                    Approval_Date,
                    Approval_Flag,
                    Approval_Ket,
                    m_Area,
                    tahun,
                    syncBy,
                    type) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].IdST
                    + "','"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].Tgl
                    + "','"
                    + responseJson.data[i].tglMulai
                    + "','"
                    + responseJson.data[i].tglSelesai
                    + "','"
                    + responseJson.data[i].keterangan
                    + "','"
                    + responseJson.data[i].Approval_By
                    + "','"
                    + responseJson.data[i].Approval_Date
                    + "','"
                    + responseJson.data[i].Approval_Flag
                    + "','"
                    + responseJson.data[i].Approval_Ket
                    + "','"
                    + responseJson.data[i].m_Area
                    + "','"
                    + responseJson.data[i].tahun
                    + "','"
                    + params.Username
                    + "','"
                    + "0"
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT ListKodeCLKA --> ' + error.message)
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })

    const InsertSV = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO ListSTSV (
                    Id,
                    No,
                    Tgl,
                    tglMulai,
                    tglSelesai,
                    nama_kelompok,
                    keterangan,
                    Approval_By,
                    Approval_Date,
                    Approval_Flag,
                    Approval_Ket,
                    auditor,
                    jenisAuditor,
                    tahun,
                    syncBy,
                    type) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].IdSV
                    + "','"
                    + responseJson.data[i].NoSV
                    + "','"
                    + responseJson.data[i].Tgl
                    + "','"
                    + responseJson.data[i].tglMulai
                    + "','"
                    + responseJson.data[i].tglSelesai
                    + "','"
                    + responseJson.data[i].nama_kelompok
                    + "','"
                    + responseJson.data[i].keterangan
                    + "','"
                    + responseJson.data[i].Approval_By
                    + "','"
                    + responseJson.data[i].Approval_Date
                    + "','"
                    + responseJson.data[i].Approval_Flag
                    + "','"
                    + responseJson.data[i].Approval_Ket
                    + "','"
                    + responseJson.data[i].auditor
                    + "','"
                    + responseJson.data[i].jenisAuditor
                    + "','"
                    + responseJson.data[i].tahun
                    + "','"
                    + params.Username
                    + "','"
                    + "1"
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT ListKodeCLKA --> ' + error.message)
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })

    const InsertListKodeCLKA = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO ListKodeCLKA (
                    Keterangan,
                    Kode) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].Keterangan
                    + "','"
                    + responseJson.data[i].Kode
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT ListKodeCLKA --> ' + error.message)
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })
    
    const InsertOptionSVKC = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO OptionSVKC (
                    IdSV,
                    NoSV,
                    Tahun,
                    Tgl,
                    approval_by,
                    approval_date,
                    approval_flag,
                    approval_ket,
                    auditor,
                    keterangan,
                    nama_kelompok) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].IdSV
                    + "','"
                    + responseJson.data[i].NoSV
                    + "','"
                    + responseJson.data[i].Tahun
                    + "','"
                    + responseJson.data[i].Tgl
                    + "','"
                    + responseJson.data[i].approval_by
                    + "','"
                    + responseJson.data[i].approval_date
                    + "','"
                    + responseJson.data[i].approval_flag
                    + "','"
                    + responseJson.data[i].approval_ket
                    + "','"
                    + responseJson.data[i].auditor
                    + "','"
                    + responseJson.data[i].keterangan
                    + "','"
                    + responseJson.data[i].nama_kelompok
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                console.log(query)

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        console.log(error.message)
                        reject('GAGAL INPUT DATA OptionSVKC')
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })

    const InsertOptionSTAM = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO OptionSTAM (
                    IdST,
                    NoST,
                    Tgl,
                    keterangan,
                    m_Area,
                    tahun,
                    tglMulai,
                    tglSelesai) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].IdST
                    + "','"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].Tgl
                    + "','"
                    + responseJson.data[i].keterangan
                    + "','"
                    + responseJson.data[i].m_Area
                    + "','"
                    + responseJson.data[i].tahun
                    + "','"
                    + responseJson.data[i].tglMulai
                    + "','"
                    + responseJson.data[i].tglSelesai
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT DATA OptionSTAM')
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })

    const InsertCabangDiperiksa = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO CabangDiperiksa (
                    CabangID,
                    NamaCabang) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].CabangID
                    + "','"
                    + responseJson.data[i].NamaCabang
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT DATA CabangDiperiksa')
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })

    const InsertListPPM = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO ListPPM (
                    Approval_By,
                    Approval_Date,
                    Approval_Flag,
                    Approval_Ket,
                    IdST,
                    JenisAuditor,
                    Jenis_Pemeriksaan,
                    Keterangan,
                    M_RegionId,
                    NoST,
                    Tahun,
                    Tanggal,
                    TanggalMulai,
                    TanggalSelesai,
                    auditor,
                    nama_auditor) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].Approval_By
                    + "','"
                    + responseJson.data[i].Approval_Date
                    + "','"
                    + responseJson.data[i].Approval_Flag
                    + "','"
                    + responseJson.data[i].Approval_Ket
                    + "','"
                    + responseJson.data[i].IdST
                    + "','"
                    + responseJson.data[i].JenisAuditor
                    + "','"
                    + responseJson.data[i].Jenis_Pemeriksaan
                    + "','"
                    + responseJson.data[i].Keterangan
                    + "','"
                    + responseJson.data[i].M_RegionId
                    + "','"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].Tahun
                    + "','"
                    + responseJson.data[i].Tanggal
                    + "','"
                    + responseJson.data[i].TanggalMulai
                    + "','"
                    + responseJson.data[i].TanggalSelesai
                    + "','"
                    + responseJson.data[i].auditor
                    + "','"
                    + responseJson.data[i].nama_auditor
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT DATA ListPPM')
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })

    const InsertListRPM = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO ListSTSV (
                    Id,
                    No,
                    Tgl,
                    tglMulai,
                    tglSelesai,
                    keterangan,
                    m_RegionId,
                    tahun,
                    Jenis_Pemeriksaan,
                    Approval_By,
                    Approval_Date,
                    Approval_Flag,
                    Approval_Ket,
                    auditor,
                    nama_auditor,
                    jenisAuditor,
                    syncBy,
                    type) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].IdST
                    + "','"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].Tanggal
                    + "','"
                    + responseJson.data[i].TanggalMulai
                    + "','"
                    + responseJson.data[i].TanggalSelesai
                    + "','"
                    + responseJson.data[i].Keterangan
                    + "','"
                    + responseJson.data[i].M_RegionId
                    + "','"
                    + responseJson.data[i].Tahun
                    + "','"
                    + responseJson.data[i].Jenis_Pemeriksaan
                    + "','"
                    + responseJson.data[i].Approval_By
                    + "','"
                    + responseJson.data[i].Approval_Date
                    + "','"
                    + responseJson.data[i].Approval_Flag
                    + "','"
                    + responseJson.data[i].Approval_Ket
                    + "','"
                    + responseJson.data[i].auditor
                    + "','"
                    + responseJson.data[i].nama_auditor
                    + "','"
                    + responseJson.data[i].JenisAuditor
                    + "','"
                    + params.Username
                    + "','"
                    + "2"
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT DATA ListRPM --> ' + error.message)
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })

    const InsertOptionST = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO OptionST (
                    IdST,
                    NoST,
                    Tgl,
                    approval_by,
                    approval_date,
                    approval_flag,
                    approval_ket,
                    jenisAuditor,
                    keterangan,
                    tglMulai,
                    tglSelesai) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].IdST
                    + "','"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].Tgl
                    + "','"
                    + responseJson.data[i].approval_by
                    + "','"
                    + responseJson.data[i].approval_date
                    + "','"
                    + responseJson.data[i].approval_flag
                    + "','"
                    + responseJson.data[i].approval_ket
                    + "','"
                    + responseJson.data[i].jenisAuditor
                    + "','"
                    + responseJson.data[i].keterangan
                    + "','"
                    + responseJson.data[i].tglMulai
                    + "','"
                    + responseJson.data[i].tglSelesai
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT DATA OptionST')
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })

    const InsertPemeriksa = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO Pemeriksa (
                    inisial,
                    nama) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].inisial
                    + "','"
                    + responseJson.data[i].nama
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT DATA Pemeriksa')
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })

    const InsertOptionSTWAKADIF = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO OptionSTWAKADIF (
                    IdST,
                    NoST,
                    Tgl,
                    approval_by,
                    approval_date,
                    approval_flag,
                    approval_ket,
                    auditor,
                    jenisAuditor,
                    jenis_pemeriksaan,
                    keterangan,
                    nama_auditor,
                    tahun,
                    tglMulai,
                    tglSelesai) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].IdST
                    + "','"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].Tgl
                    + "','"
                    + responseJson.data[i].approval_by
                    + "','"
                    + responseJson.data[i].approval_date
                    + "','"
                    + responseJson.data[i].approval_flag
                    + "','"
                    + responseJson.data[i].approval_ket
                    + "','"
                    + responseJson.data[i].auditor
                    + "','"
                    + responseJson.data[i].jenisAuditor
                    + "','"
                    + responseJson.data[i].jenis_pemeriksaan
                    + "','"
                    + responseJson.data[i].keterangan
                    + "','"
                    + responseJson.data[i].nama_auditor
                    + "','"
                    + responseJson.data[i].tahun
                    + "','"
                    + responseJson.data[i].tglMulai
                    + "','"
                    + responseJson.data[i].tglSelesai
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT DATA OptionSTWAKADIF')
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL');
                return;
            }
        }catch(error){
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR:', error)
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
    })

    const syncFetch = async () => {
        const token = await AsyncStorage.getItem('token')

        const responseOptionSVKC = await fetch(GetOptionSVKC + '/' + params.Username, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonOptionSVKC  = await responseOptionSVKC.json(responseOptionSVKC)
        if(params.Role === 'KC') {
            await InsertSV(jsonOptionSVKC)
            if (__DEV__) console.log(GetOptionSVKC + '/' + params.Username)
            if (__DEV__) console.log('InsertOptionSVKC DONE')
        }

        const responseOptionSTAM  = await fetch(OptionSTAM + '/' + params.Username, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonOptionSTAM = await responseOptionSTAM.json(responseOptionSTAM)
        if(params.Role === 'KA') {
            await InsertST(jsonOptionSTAM)
            if (__DEV__) console.log(OptionSTAM + '/' + params.Username)
            if (__DEV__) console.log('InsertOptionSTAM DONE')
        }

        const responseCabangDiperiksa  = await fetch(GetCabangDiperiksa + '/' + params.KodeUnit + '/' + params.PositionName, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonCabangDiperiksa = await responseCabangDiperiksa.json(responseCabangDiperiksa)
        await InsertCabangDiperiksa(jsonCabangDiperiksa)
        if (__DEV__) console.log(GetCabangDiperiksa + '/' + params.KodeUnit + '/' + params.PositionName)
        if (__DEV__) console.log('InsertOptionSTAM DONE')

        const responseListPPM  = await fetch(GetListPPM + '/' + params.Username + '/' + year, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonListPPM = await responseListPPM.json(responseListPPM)
        if(params.Role === 'PPM') {
            await InsertListPPM(jsonListPPM)
            if (__DEV__) console.log(GetListPPM + '/' + params.Username + '/' + year)
            if (__DEV__) console.log('InsertListPPM DONE')
        }

        const responseListRPM  = await fetch(GetListRPM + '/' + params.KodeUnit + '/' + year, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonListRPM = await responseListRPM.json(responseListRPM)
        if(params.Role === 'RPM') {
            await InsertListRPM(jsonListRPM)
            if (__DEV__) console.log(GetListRPM + '/' + params.KodeUnit + '/' + year)
            if (__DEV__) console.log('InsertListRPM DONE')
        }

        const responseOptionST  = await fetch(GetOptionST + '/' + params.Username, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonOptionST = await responseOptionST.json(responseOptionST)
        await InsertOptionST(jsonOptionST)
        if (__DEV__) console.log(GetOptionST + '/' + params.Username)
        if (__DEV__) console.log('InsertOptionST DONE')

        const responseOptionSTWakadiv  = await fetch(GetoptionSTWakadiv + '/' + params.KodeUnit + '/' + year, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonOptionSTWakadiv = await responseOptionSTWakadiv.json(responseOptionSTWakadiv)
        await InsertOptionSTWAKADIF(jsonOptionSTWakadiv)
        if (__DEV__) console.log(GetoptionSTWakadiv + '/' + params.KodeUnit + '/' + year)
        if (__DEV__) console.log('InsertListRPM DONE')

        return 'SUCCESS'
    }

    resolve(syncFetch())
})

export default getSyncData
