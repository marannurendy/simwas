import db from "../../config/database"

const Model = (type, params) => (new Promise((resolve, reject) => {
    if(type === 'queryGetMasterST') {
        let queryGetMasterST = `SELECT DISTINCT 
            Cabang,
            IdST,
            NoST as value,
            NoST as label,
            Tahun,
            Tgl,
            approval_by,
            approval_date,
            approval_flag,
            approval_ket,
            jenisAuditor,
            keterangan,
            tglMulai,
            tglSelesai,
            syncBy,
            stat
            FROM ListSTChecklist WHERE syncBy = '` + params.username + `' AND stat IS NULL`
        resolve(queryGetMasterST)
    }else if(type === 'queryGetMasterJenisPemeriksaan') {
        let queryGetMasterJenisPemeriksaan = `SELECT DISTINCT 
            Id as value,
            Tipe_Ceklist as label FROM TipePemeriksaan`
        resolve(queryGetMasterJenisPemeriksaan)
    }else if(type === 'queryGetMasterKategoriPemeriksaan') {
        let queryGetMasterKategoriPemeriksaan = `SELECT DISTINCT
            IdKategori as value,
            IdTipeCeklist,
            Nama_Kategori as label,
            Type_Ceklist,
            id_bisnis,
            nama_bisnis FROM MasterKategori`
        resolve(queryGetMasterKategoriPemeriksaan)
    }else if(type === 'queryGetMasterSubKategori') {
        let queryGetMasterSubKategori = `SELECT DISTINCT
            IdKategori,
            IdSubKategori as value,
            Nama_Sub_Kategori as label FROM SubKategori`

        resolve(queryGetMasterSubKategori)
    }else if(type === 'queryGetMasterPertanyaan') {
        let queryGetMasterPertanyaan = `SELECT DISTINCT
            IdKategori,
            IdPertanyaan as value,
            IdSubKategori,
            Pertanyaan as label FROM Pertanyaan`

        resolve(queryGetMasterPertanyaan)
    }else if(type === 'queryGetMasterJawaban') {
        let queryGetMasterJawaban = `SELECT DISTINCT
        IdJawaban as value,
        Jawaban as label FROM Jawaban`

        resolve(queryGetMasterJawaban)
    }
}))

const ModelGetDataEditChecklist = (type, register, param) => (new Promise((resolve, reject) => {
    if(type === 'queryGetDataDetail') {
        let queryGetDataDetail = `SELECT DISTINCT 
        Cabang,
        Keterangan,
        IdST,
        NoST,
        TglMulai,
        TglSelesai,
        syncBy,
        type,
        stat FROM ListChecklist WHERE NoST = '` + register + `';`

        resolve(queryGetDataDetail)
    }else if(type === 'queryGetDataQuest') {
        let queryGetDataQuest = `SELECT
        NoST,
        IdST,
        idPertanyaan,
        Sample,
        Temuan,
        DetailTemuan,
        Scoring,
        Rekomendasi,
        syncBy,
        type
        stat FROM InputListChecklist WHERE NoST = '` + register + `';`

        resolve(queryGetDataQuest)
    }
}))

const ModelEditChecklist = (dataChecklist, dataPemeriksaan, param) => (new Promise( async (resolve, reject) => {
    let dataPemeriksaanLength = dataPemeriksaan.length
    let role = param.role === 'RPM' ? 2 : param.role === 'PPM' ? 3 : 1
    let response = {
        status : '',
        data : ''
    }

    let queryInsertQuest = `INSERT INTO InputListChecklist (
        NoST,
        IdST,
        DefinisiSample,
        DefinisiTemuan,
        IdPemeriksaan,
        idPertanyaan,
        Sample,
        Temuan,
        DetailTemuan,
        Scoring,
        Rekomendasi,
        syncBy,
        type,
        stat
    ) values `

    let queryInsertPemeriksaan = `INSERT INTO ListPemeriksaan (
        NoST,
        IdST,
        IdPemeriksaan,
        JenisPememeriksaan,
        KategoriPemeriksaan,
        SubKategori
    ) values `

    let queryDeleteOldDataQuest = `DELETE FROM InputListChecklist WHERE NoST = '` + dataChecklist.noST + `' AND IdST = '` + dataChecklist.idST + `' AND syncBy = '` + param.username + `'`
    let queryDeleteOldDataPemeriksaan = `DELETE FROM ListPemeriksaan WHERE NoST = '` + dataChecklist.noST + `' AND IdST = '` + dataChecklist.idST + `'`

    let deleteFunction = await DeleteFunction(queryDeleteOldDataQuest, queryDeleteOldDataPemeriksaan)

    if(dataPemeriksaanLength === 0) {
        if(deleteFunction.status === 'SUCCESS') {
            response = {
                status : 'SUCCESS',
                data: 'data berhasil di hapus'
            }
            resolve(response)
        }else{
            response = {
                status : 'ERROR',
                data : 'data gagal di hapus'
            }
            reject(response)
        }
    }

    for(let i = 0; i < dataPemeriksaanLength; i++) {
        queryInsertPemeriksaan = queryInsertPemeriksaan + "('"
        + dataChecklist.noST
        + "','"
        + dataChecklist.idST
        + "','"
        + dataPemeriksaan[i].idPemeriksaan
        + "','"
        + dataPemeriksaan[i].jenisPemeriksaan
        + "','"
        + dataPemeriksaan[i].kategoriPemeriksaan
        + "','"
        + dataPemeriksaan[i].subKategori
        + "')"

        if( i !== dataPemeriksaanLength - 1) {
            queryInsertPemeriksaan = queryInsertPemeriksaan + ","
        }
    }

    for(let i = 0; i < dataPemeriksaanLength; i++) {
        let dataPertanyaanLength = dataPemeriksaan[i].pertanyaan.length
        let dt = dataPemeriksaan[i]

        for(let d = 0; d < dataPertanyaanLength; d++) {
            queryInsertQuest = queryInsertQuest + "('"
            queryInsertQuest = queryInsertQuest + dataChecklist.noST
            + "','"
            + dataChecklist.idST
            + "','"
            + dt.pertanyaan[d].DefinisiSample
            + "','"
            + dt.pertanyaan[d].DefinisiTemuan
            + "','"
            + dt.idPemeriksaan
            + "','"
            + dt.pertanyaan[d].idPertanyaan
            + "','"
            + dt.pertanyaan[d].Sample
            + "','"
            + dt.pertanyaan[d].Temuan
            + "','"
            + dt.pertanyaan[d].DetailTemuan
            + "','"
            + dt.pertanyaan[d].Scoring
            + "','"
            + dt.pertanyaan[d].Rekomendasi
            + "','"
            + param.username
            + "','"
            + role
            + "','"
            + dt.pertanyaan[d].stat
            + "')"

            if(d !== dataPertanyaanLength - 1) {
                queryInsertQuest = queryInsertQuest + ","
            }
        }

        if(i !== dataPemeriksaanLength - 1) {
            queryInsertQuest = queryInsertQuest + ","
        }
    }

    if(deleteFunction.status === 'SUCCESS') {
        try{
            db.transaction(
                tx => {
                    tx.executeSql(queryInsertPemeriksaan)
                    tx.executeSql(queryInsertQuest)
                }, function(error) {
                    response = {
                        status: 'ERROR',
                        data: error.message
                    }
                    reject(response)
                }, function() {
                    response = {
                        status: 'SUCCESS',
                        data: 'data berhasil di input'
                    }
                    resolve(response)
                }
            )
        }catch(error){
            response = {
                status: 'ERROR',
                data: error.message
            }
            reject(response)
        }
    }

}))

const DeleteFunction = (queryDeleteOldDataQuest, queryDeleteOldDataPemeriksaan) => (new Promise((resolve, reject) => {
    try{
        db.transaction(
            tx => {
                tx.executeSql(queryDeleteOldDataQuest)
                tx.executeSql(queryDeleteOldDataPemeriksaan)
            }, function(error) {
                response = {
                    status: 'ERROR',
                    data: error.message
                }

                reject(response)
            }, function() {
                response = {
                    status: 'SUCCESS',
                    data: 'delete data success'
                }
                resolve(response)
            }
        )
    }catch(error){
        response = {
            status: 'ERROR',
            data: error.message
        }
        reject(response)
    }
}))

const ModelInsertChecklist = (dataChecklist, dataPemeriksaan, param) => (new Promise((resolve, reject) => {
    let dataPemeriksaanLength = dataPemeriksaan.length
    let role = param.role === 'RPM' ? 2 : param.role === 'PPM' ? 3 : 1
    let response = {
        status: '',
        data: ''
    }

    let queryInsertChecklist = `INSERT OR IGNORE INTO ListChecklist (
        Cabang,
        Keterangan,
        IdST,
        NoST,
        TglMulai,
        TglSelesai,
        syncBy,
        type,
        stat
    ) values (
        '` + dataChecklist.cabang + `',
        '` + dataChecklist.keterangan + `',
        '` + dataChecklist.idST + `',
        '` + dataChecklist.noST + `',
        '` + dataChecklist.tglMulai + `',
        '` + dataChecklist.tglSelesai + `',
        '` + param.username + `',
        '` + role + `',
        '` + '1' + `'
    )`

    let queryInsertQuest = `INSERT INTO InputListChecklist (
        NoST,
        IdST,
        IdPemeriksaan,
        idPertanyaan,
        Sample,
        Temuan,
        DetailTemuan,
        Scoring,
        Rekomendasi,
        syncBy,
        type,
        stat
    ) values `

    let queryInsertPemeriksaan = `INSERT INTO ListPemeriksaan (
        NoST,
        IdST,
        IdPemeriksaan,
        JenisPememeriksaan,
        KategoriPemeriksaan,
        SubKategori
    ) values `

    for(let i = 0; i < dataPemeriksaanLength; i++) {
        queryInsertPemeriksaan = queryInsertPemeriksaan + "('"
        + dataChecklist.noST
        + "','"
        + dataChecklist.idST
        + "','"
        + dataPemeriksaan[i].idPemeriksaan
        + "','"
        + dataPemeriksaan[i].jenisPemeriksaan
        + "','"
        + dataPemeriksaan[i].kategoriPemeriksaan
        + "','"
        + dataPemeriksaan[i].subKategori
        + "')"

        if( i !== dataPemeriksaanLength - 1) {
            queryInsertPemeriksaan = queryInsertPemeriksaan + ","
        }
    }

    for(let i = 0; i < dataPemeriksaanLength; i++) {
        let dataPertanyaanLength = dataPemeriksaan[i].pertanyaan.length
        let dt = dataPemeriksaan[i]

        for(let d = 0; d < dataPertanyaanLength; d++) {
            queryInsertQuest = queryInsertQuest + "('"
            queryInsertQuest = queryInsertQuest + dataChecklist.noST
            + "','"
            + dataChecklist.idST
            + "','"
            + dt.idPemeriksaan
            + "','"
            + dt.pertanyaan[d].idPertanyaan
            + "','"
            + dt.pertanyaan[d].jumlahSample
            + "','"
            + dt.pertanyaan[d].jumlahTemuan
            + "','"
            + dt.pertanyaan[d].detailTemuan
            + "','"
            + dt.pertanyaan[d].scoring
            + "','"
            + dt.pertanyaan[d].rekomendasi
            + "','"
            + param.username
            + "','"
            + role
            + "','"
            + '0'
            + "')"

            if(d !== dataPertanyaanLength - 1) {
                queryInsertQuest = queryInsertQuest + ","
            }
        }

        if(i !== dataPemeriksaanLength - 1) {
            queryInsertQuest = queryInsertQuest + ","
        }
    }

    try{
        db.transaction(
            tx => {
                tx.executeSql(queryInsertPemeriksaan)
                tx.executeSql(queryInsertChecklist)
                tx.executeSql(queryInsertQuest)
            }, function(error) {
                response = {
                    status: 'ERROR',
                    data: error.message
                }
                reject(response)
            }, function() {
                response = {
                    status: 'SUCCESS',
                    data: 'Data berhasil di simpan'
                }
                resolve(response)
            }
        )
    }catch(error) {
        response = {
            status: 'ERROR',
            data: error.message
        }
        reject(response)
    }
}))

export {
    Model,
    ModelInsertChecklist,
    ModelEditChecklist,
    ModelGetDataEditChecklist
}