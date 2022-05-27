import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('simwasdb.db')

db.transaction(tx => {
    // MASTER
    tx.executeSql(
        `create table if not exists ListKodeCLKA(
            Keterangan varchar, 
            Kode varchar UNIQUE)
        ;`
    );
    tx.executeSql(
        `create table if not exists OptionSVKC(
            IdSV varchar UNIQUE,
            NoSV varchar,
            Tahun varchar,
            Tgl varchar,
            approval_by varchar,
            approval_date varchar,
            approval_flag varchar,
            approval_ket varchar,
            auditor varchar,
            keterangan varchar,
            nama_kelompok varchar)
        ;`
    );
    tx.executeSql(
        `create table if not exists OptionSTAM(
            IdST varchar UNIQUE, 
            NoST varchar,
            Tgl varchar,
            keterangan varchar,
            m_Area varchar,
            tahun varchar,
            tglMulai varchar,
            tglSelesai varchar)
        ;`
    );

    // SURAT TUGAS
    tx.executeSql(
        `create table if not exists CabangDiperiksa(
            CabangID varchar UNIQUE, 
            NamaCabang varchar)
        ;`
    );
    tx.executeSql(
        `create table if not exists ListPPM(
            Approval_By varchar, 
            Approval_Date varchar,
            Approval_Flag varchar,
            Approval_Ket varchar,
            IdST varchar UNIQUE,
            JenisAuditor varchar,
            Jenis_Pemeriksaan varchar,
            Keterangan varchar,
            M_RegionId varchar,
            NoST varchar,
            Tahun varchar,
            Tanggal varchar,
            TanggalMulai varchar,
            TanggalSelesai varchar,
            auditor varchar,
            nama_auditor varchar)
        ;`
    );
    tx.executeSql(
        `create table if not exists ListRPM(
            Approval_By varchar, 
            Approval_Date varchar,
            Approval_Flag varchar,
            Approval_Ket varchar,
            IdST varchar UNIQUE,
            JenisAuditor varchar,
            Jenis_Pemeriksaan varchar,
            Keterangan varchar,
            M_RegionId varchar,
            NoST varchar,
            Tahun varchar,
            Tanggal varchar,
            TanggalMulai varchar,
            TanggalSelesai varchar,
            auditor varchar,
            nama_auditor varchar)
        ;`
    );
    tx.executeSql(
        `create table if not exists OptionST(
            IdST varchar UNIQUE, 
            NoST varchar,
            Tgl varchar,
            approval_by varchar,
            approval_date varchar,
            approval_flag varchar,
            approval_ket varchar,
            jenisAuditor varchar,
            keterangan varchar,
            tglMulai varchar,
            tglSelesai varchar)
        ;`
    );
    tx.executeSql(
        `create table if not exists Pemeriksa(
            inisial varchar UNIQUE,
            nama varchar)
        ;`
    );
    tx.executeSql(
        `create table if not exists OptionSTWAKADIF(
            IdST varchar, 
            NoST varchar,
            Tgl varchar,
            approval_by varchar,
            approval_date varchar,
            approval_flag varchar,
            approval_ket varchar,
            auditor varchar,
            jenisAuditor varchar,
            jenis_pemeriksaan varchar,
            keterangan varchar,
            nama_auditor varchar,
            tahun varchar,
            tglMulai varchar,
            tglSelesai varchar)
        ;`
    );

    // tx.executeSql('DROP TABLE IF EXISTS ListKodeCLKA')
    // tx.executeSql('DROP TABLE IF EXISTS OptionSVKC')
    // tx.executeSql('DROP TABLE IF EXISTS OptionSTAM')
    // tx.executeSql('DROP TABLE IF EXISTS CabangDiperiksa')
    // tx.executeSql('DROP TABLE IF EXISTS ListPPM')
    // tx.executeSql('DROP TABLE IF EXISTS ListRPM')
    // tx.executeSql('DROP TABLE IF EXISTS OptionST')
    // tx.executeSql('DROP TABLE IF EXISTS Pemeriksa')
    // tx.executeSql('DROP TABLE IF EXISTS OptionSTWAKADIF')

},function(error) {
    console.log('Transaction ERROR: ' + error.message);
}, function() {
    console.log('Populated database OK');
})

export default db