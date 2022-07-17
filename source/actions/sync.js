import db from "../../config/database"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert, ToastAndroid } from "react-native"
import { 
    GetListKodeCLKA,
    GetOptionSVKC,
    OptionSTAM,
    GetCabangDiperiksa,
    GetListPPM,
    GetListRPM,
    GetOptionST,
    GetPemeriksa,
    GetoptionSTWakadiv,
    GetOptionSTCL,
    GetMasterCekList,
    GetListInputanCeklist,
    GetListDetailCL,
    GetListNotYetTL } from "../../config/conf"
import moment from 'moment'

const getSyncData = (params) => new Promise( async (resolve) => {

    const year = moment().format('YYYY')
    // const year = '2021'

    const truncat = (reject, source) => {
        if (__DEV__) console.log('ACTIONS GET SYNC DATA TRUNCAT LOADED');

        return db.transaction(
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
            }, function(error) {
                ToastAndroid.show("SOMETHING WENT WRONG: " + JSON.stringify(error), ToastAndroid.SHORT);
                reject('GAGAL MEMPROSES DATA ' + source);
            }, function() {
                console.log('data di hapus')
                resolve('DATA KOSONG ' + source)
            }
        )
    }

    //SURAT TUGAS

    const InsertST = (responseJson) => new Promise ((resolve, reject) => {
        console.log(responseJson)
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
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERRORn InsertSV:', error)
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
        if(responseJson.responseCode === 200) {
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
                console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR InsertCabangDiperiksa:', error)
                reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
                return
            }
        } else {
            reject('GAGAL INPUT DATA COLLECTION KE LOCALSTORAGE')
            return
        }
        
    })

    const InsertListPPM = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO ListSTSV (
                    Id,
                    No,
                    Tgl,
                    tglMulai,
                    tglSelesai,
                    keterangan,
                    idCabangDiperiksa,
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
                    + responseJson.data[i].Cabang
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
                    + "3"
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
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR InsertListPPM:', error)
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
                    idCabangDiperiksa,
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
                    + responseJson.data[i].Cabang
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
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR InsertListRPM:', error)
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
            console.log('ACTIONS GET SYNC DATA COLLECTION INSERT TRANSACTION TRY CATCH ERROR InsertOptionST:', error)
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

    //CHECKLIST
    const InsertMasterChecklist = (responseJson) => (new Promise((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let queryMasterKategori = `INSERT OR IGNORE INTO MasterKategori (
                    IdKategori,
                    IdTipeCeklist,
                    Nama_Kategori,
                    Type_Ceklist,
                    id_bisnis,
                    nama_bisnis ) values `
                let queryMasterSubKategori = `INSERt OR IGNORE INTO SubKategori (
                    IdKategori,
                    IdSubKategori,
                    Nama_Sub_Kategori ) values `
                let queryMasterTipePemeriksaan = `INSERT OR IGNORE INTO TipePemeriksaan (
                    Id,
                    Tipe_Ceklist ) values `
                let queryMasterPertanyaan = `INSERT OR IGNORE INTO Pertanyaan (
                    IdKategori,
                    IdPertanyaan,
                    IdSubKategori,
                    Pertanyaan ) values `
                let queryMasterJawaban = `INSERT OR IGNORE INTO Jawaban (
                    IdJawaban,
                    Jawaban ) values `

                for(let a = 0; a < responseJson.data.Kategori.length; a++) {
                    queryMasterKategori = queryMasterKategori + "('"
                    + responseJson.data.Kategori[a].IdKategori
                    + "','"
                    + responseJson.data.Kategori[a].IdTipeCeklist
                    + "','"
                    + responseJson.data.Kategori[a].Nama_Kategori
                    + "','"
                    + responseJson.data.Kategori[a].Type_Ceklist
                    + "','"
                    + responseJson.data.Kategori[a].id_bisnis
                    + "','"
                    + responseJson.data.Kategori[a].nama_bisnis
                    + "')"

                    if(a != responseJson.data.Kategori.length - 1) {
                        queryMasterKategori = queryMasterKategori + ","
                    }
                }
                queryMasterKategori = queryMasterKategori + ";"

                for(let a = 0; a < responseJson.data.SubKategori.length; a++) {
                    queryMasterSubKategori = queryMasterSubKategori + "('"
                    + responseJson.data.SubKategori[a].IdKategori
                    + "','"
                    + responseJson.data.SubKategori[a].IdSubKategori
                    + "','"
                    + responseJson.data.SubKategori[a].Nama_Sub_Kategori
                    + "')"

                    if(a != responseJson.data.SubKategori.length - 1) {
                        queryMasterSubKategori = queryMasterSubKategori + ","
                    }
                }
                queryMasterSubKategori = queryMasterSubKategori + ";"

                for(let a = 0; a < responseJson.data.TipePemeriksaan.length; a++) {
                    queryMasterTipePemeriksaan = queryMasterTipePemeriksaan + "('"
                    + responseJson.data.TipePemeriksaan[a].Id
                    + "','"
                    + responseJson.data.TipePemeriksaan[a].Tipe_Ceklist
                    + "')"

                    if(a != responseJson.data.TipePemeriksaan.length - 1) {
                        queryMasterTipePemeriksaan = queryMasterTipePemeriksaan + ","
                    } 
                }
                queryMasterTipePemeriksaan = queryMasterTipePemeriksaan + ";"

                for(let a = 0; a < responseJson.data.Pertanyaan.length; a++) {
                    queryMasterPertanyaan = queryMasterPertanyaan + "('"
                    + responseJson.data.Pertanyaan[a].IdKategori
                    + "','"
                    + responseJson.data.Pertanyaan[a].IdPertanyaan
                    + "','"
                    + responseJson.data.Pertanyaan[a].IdSubKategori
                    + "','"
                    + responseJson.data.Pertanyaan[a].Pertanyaan
                    + "')"

                    if(a != responseJson.data.Pertanyaan.length - 1) {
                        queryMasterPertanyaan = queryMasterPertanyaan + ","
                    }
                }
                queryMasterPertanyaan = queryMasterPertanyaan + ";"

                for(let a = 0; a < responseJson.data.Jawaban.length; a ++) {
                    queryMasterJawaban = queryMasterJawaban + "('"
                    + responseJson.data.Jawaban[a].IdJawaban
                    + "','"
                    + responseJson.data.Jawaban[a].Jawaban
                    +"')"

                    if(a != responseJson.data.Jawaban.length - 1) {
                        queryMasterJawaban = queryMasterJawaban + ","
                    }
                }
                queryMasterJawaban = queryMasterJawaban + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(queryMasterKategori)
                        tx.executeSql(queryMasterSubKategori)
                        tx.executeSql(queryMasterTipePemeriksaan)
                        tx.executeSql(queryMasterPertanyaan)
                        tx.executeSql(queryMasterJawaban)
                    }, function(error) {
                        console.log(error.message)
                        reject('ERROR')
                    }, function() {
                        resolve('SUCCESS')
                    }
                )
            }
        }catch(error){
            console.log(error.message)
            reject('ERROR')
        }
    }))

    const InsertListChecklist = (responseJson) => (new Promise((resolve, reject) => {
        let type = 2
        if(params.Role === 'PPM') {
            type = 3
        }
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO ListChecklist (
                    Cabang,
                    Keterangan,
                    IdST,
                    NoST,
                    TglMulai,
                    TglSelesai,
                    syncBy,
                    type
                ) values `

                for(let a = 0; a < responseJson.data.length; a++) {
                    query = query + "('"
                    + responseJson.data[a].Cabang
                    + "','"
                    + responseJson.data[a].Keterangan
                    + "','"
                    + responseJson.data[a].IdST
                    + "','"
                    + responseJson.data[a].NoST
                    + "','"
                    + responseJson.data[a].TglMulai
                    + "','"
                    + responseJson.data[a].TglSelesai
                    + "','"
                    + params.Username
                    + "','"
                    + type
                    + "')"

                    if(a !== responseJson.data.length - 1) {
                        query = query + ","
                    }
                }

                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('ERROR')
                    }, function() {
                        resolve('SUCCESS')
                    }
                )
            } else {
                resolve('SUCCESS')
            }
        }catch(error){
            console.log(error.message)
            reject('ERROR')
        }
    }))

    const InsertListOptionST = (responseJson) => (new Promise((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO ListSTChecklist (
                    Cabang,
                    IdST,
                    NoST,
                    Tahun,
                    Tgl,
                    keterangan,
                    tglMulai,
                    tglSelesai,
                    syncBy
                ) values `

                for(let a = 0; a < responseJson.data.length; a++) {
                    query = query + "('"
                    + responseJson.data[a].Cabang
                    + "','"
                    + responseJson.data[a].IdST
                    + "','"
                    + responseJson.data[a].NoST
                    + "','"
                    + responseJson.data[a].Tahun
                    + "','"
                    + responseJson.data[a].Tgl
                    + "','"
                    + responseJson.data[a].keterangan
                    + "','"
                    + responseJson.data[a].tglMulai
                    + "','"
                    + responseJson.data[a].tglSelesai
                    + "','"
                    + params.Username
                    + "')"

                    if(a !== responseJson.data.length - 1) {
                        query = query + ","
                    }
                }

                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('ERROR')
                    }, function() {
                        resolve('SUCCESS')
                    }
                )
            }
        }catch(error){
            console.log(error.message)
            reject('ERROR')
        }
    }))

    const InsertListSTApproved = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO ListSTApproved (
                    IdST,
                    NoST,
                    Tgl,
                    Tahun,
                    keterangan,
                    tglMulai,
                    tglSelesai,
                    cabang) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].IdST
                    + "','"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].Tgl
                    + "','"
                    + responseJson.data[i].Tahun
                    + "','"
                    + responseJson.data[i].keterangan
                    + "','"
                    + responseJson.data[i].tglMulai
                    + "','"
                    + responseJson.data[i].tglSelesai
                    + "','"
                    + responseJson.data[i].Cabang
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

    const InsertGetListDetailCL = (responseJson) => new Promise((resolve, reject) => {
        try{
            if(responseJson.data !== 0) {
                let queryInputListChecklist = `INSERT OR IGNORE INTO InputListChecklist (
                    NoST,
                    IdST,
                    DefinisiSample,
                    DefinisiTemuan,
                    IdPemeriksaan,
                    idPertanyaan,
                    Sample,
                    Temuan,
                    DetailTemuan,
                    Rekomendasi,
                    syncBy,
                    stat,
                    type ) values `

                let queryInputListPemeriksaan = `INSERT INTO ListPemeriksaan (
                    NoST,
                    IdST,
                    IdPemeriksaan,
                    JenisPememeriksaan,
                    KategoriPemeriksaan,
                    SubKategori ) values `

                for(let i = 0; i < responseJson.data.length; i++ ) {
                    let idPemeriksaan = responseJson.data[i].IdJenisPemeriksaan + responseJson.data[i].IdKategori + responseJson.data[i].IdSubKategori
                    queryInputListChecklist = queryInputListChecklist + "('"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].IdST
                    + "','"
                    + responseJson.data[i].Definisi1
                    + "','"
                    + responseJson.data[i].Definisi2
                    + "','"
                    + idPemeriksaan
                    + "','"
                    + responseJson.data[i].IdPertanyaan
                    + "','"
                    + responseJson.data[i].Jawaban1
                    + "','"
                    + responseJson.data[i].Jawaban2
                    + "','"
                    + responseJson.data[i].DetailTemuan
                    + "','"
                    + responseJson.data[i].Rekomendasi
                    + "','"
                    + params.Username
                    + "','"
                    + 0
                    + "','"
                    + 1
                    + "')"

                    if (i != responseJson.data.length - 1) queryInputListChecklist = queryInputListChecklist + ","
                }
                queryInputListChecklist = queryInputListChecklist + ';'

                console.log(queryInputListChecklist)

                for(let i = 0; i < responseJson.data.length; i++ ) {
                    let idPemeriksaan = responseJson.data[i].IdJenisPemeriksaan + responseJson.data[i].IdKategori + responseJson.data[i].IdSubKategori
                    queryInputListPemeriksaan = queryInputListPemeriksaan + "('"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].IdST
                    + "','"
                    + idPemeriksaan
                    + "','"
                    + responseJson.data[i].IdJenisPemeriksaan
                    + "','"
                    + responseJson.data[i].IdKategori
                    + "','"
                    + responseJson.data[i].IdSubKategori
                    + "')"

                    if (i != responseJson.data.length - 1) queryInputListPemeriksaan = queryInputListPemeriksaan + ","
                }
                queryInputListPemeriksaan = queryInputListPemeriksaan + ';'

                db.transaction(
                    tx => {
                        tx.executeSql(queryInputListChecklist)
                        tx.executeSql(queryInputListPemeriksaan)
                    }, function(error) {
                        reject('GAGAL INPUT DATA Detail Checklist')
                    }, function() {
                        resolve('BERHASIL')
                    }
                )
                return
            } else {
                resolve('BERHASIL')
                return
            }
        }catch(error){
            reject('ERROR')
        }
    })

    //TINDAK LANJUT
    const InsertNotYetTL = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO ListSiapTL (
                    IdST,
                    NoST,
                    Tgl_Target,
                    Tahun,
                    Keterangan,
                    tindak_lanjut,
                    IdPertanyaan,
                    stat) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].IdST
                    + "','"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].Tgl_Target
                    + "','"
                    + responseJson.data[i].Tahun
                    + "','"
                    + responseJson.data[i].keterangan
                    + "','"
                    + responseJson.data[i].tindak_lanjut
                    + "','"
                    + responseJson.data[i].IdPertanyaan
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
                        reject('GAGAL INPUT DATA ListSiapTL')
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

    const InsertOptionSTCL = (responseJson) => new Promise ((resolve, reject) => {
        try{
            if(responseJson.data !== null) {
                let query = `INSERT OR IGNORE INTO OptionSTCL (
                    IdST,
                    NoST,
                    Tgl,
                    Tahun,
                    Keterangan,
                    tindak_lanjut) values `
                for(let i = 0; i < responseJson.data.length; i++ ) {
                    query = query + "('"
                    + responseJson.data[i].IdST
                    + "','"
                    + responseJson.data[i].NoST
                    + "','"
                    + responseJson.data[i].Tgl
                    + "','"
                    + responseJson.data[i].Tahun
                    + "','"
                    + responseJson.data[i].keterangan
                    + "','"
                    + responseJson.data[i].tindak_lanjut
                    + "')"

                    if (i != responseJson.data.length - 1) query = query + ","
                }
                query = query + ";"

                db.transaction(
                    tx => {
                        tx.executeSql(query)
                    }, function(error) {
                        reject('GAGAL INPUT DATA OptionSTCL')
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

        const responseCabangDiperiksa  = await fetch(GetCabangDiperiksa + '/' + params.KodeUnit + '/' + params.Role, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonCabangDiperiksa = await responseCabangDiperiksa.json(responseCabangDiperiksa)
        await InsertCabangDiperiksa(jsonCabangDiperiksa)
        if (__DEV__) console.log(GetCabangDiperiksa + '/' + params.KodeUnit + '/' + params.Role)
        if (__DEV__) console.log('InsertCabangDiperiksa DONE')

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


        //CHECKLIST
        const responseMasterChecklist  = await fetch(GetMasterCekList + '/' + params.Bisnis, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonMasterChecklist = await responseMasterChecklist.json(responseMasterChecklist)
        await InsertMasterChecklist(jsonMasterChecklist)
        if (__DEV__) console.log(GetMasterCekList + '/' + params.Bisnis)
        if (__DEV__) console.log('InsertMasterChecklist DONE')

        const responseListCheckList  = await fetch(GetListInputanCeklist + '/' + params.Username, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonResponseListCheckList = await responseListCheckList.json(responseListCheckList)
        await InsertListChecklist(jsonResponseListCheckList)
        if (__DEV__) console.log(GetListInputanCeklist + '/' + params.Username)
        if (__DEV__) console.log('InsertListChecklist DONE')

        const reponseOptionSTChecklist  = await fetch(GetOptionST + '/' + params.Username, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonOptionSTChecklist = await reponseOptionSTChecklist.json(reponseOptionSTChecklist)
        await InsertListOptionST(jsonOptionSTChecklist)
        if (__DEV__) console.log(GetOptionST + '/' + params.Username)
        if (__DEV__) console.log('InsertListOptionST DONE')

        const responseListNotYetTL  = await fetch(GetListNotYetTL + '/' + params.Username, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const jsonListNotYetTL = await responseListNotYetTL.json(responseListNotYetTL)
        await InsertNotYetTL(jsonListNotYetTL)
        if (__DEV__) console.log(GetListNotYetTL + '/' + params.Username)
        if (__DEV__) console.log('Insert List Siap Tindak Lanjut DONE')

        const responseOptionSTCL  = await fetch(GetOptionSTCL + '/' + params.Username, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
                }
        })
        const jsonOptionSTCL = await responseOptionSTCL.json(responseOptionSTCL)
        await InsertOptionSTCL(jsonOptionSTCL)
        if (__DEV__) console.log(GetOptionSTCL + '/' + params.Username)
        if (__DEV__) console.log('Insert Ceklist RPM atau PPM DONE')

        const responseGetListDetailCL = await fetch(GetListDetailCL + '/' + params.Username, {
            method: 'GET',
            headers: {
                Authorization: token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const jsonGetListDetailCL = await responseGetListDetailCL.json(responseGetListDetailCL)
        await InsertGetListDetailCL(jsonGetListDetailCL)
        if (__DEV__) console.log(GetListDetailCL + '/' + params.Username)
        if (__DEV__) console.log('Insert Detail Checklist DONE')

        return 'SUCCESS'
    }

    const syncStat = await AsyncStorage.getItem('syncStat')

    if(syncStat === 'true') {
        Alert.alert(
            'Perhatian !',
            'Apakah anda yakin akan melakukan sync data ? semua data yang sudah di input akan di hapus',
            [
                {
                    text: 'Batal',
                    onPress: () => {
                        resolve('Sync batal')
                    }
                },
                {
                    text: 'Ya',
                    onPress: () => {
                        truncat()
                        resolve(syncFetch())
                    }
                }
            ]
        )
    }else{
        AsyncStorage.setItem('syncStat', 'true')
        resolve(syncFetch())
    }
})

export default getSyncData
