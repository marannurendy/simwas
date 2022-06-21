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
        `create table if not exists ListSTSV(
            Id varchar,
            No INTEGER PRIMARY KEY,
            Tgl varchar,
            tglMulai varchar,
            tglSelesai varchar,
            keterangan varchar,
            nama_kelompok varchar,
            m_Area varchar,
            m_RegionId varchar,
            tahun varchar,
            Jenis_Pemeriksaan varchar,
            Approval_By varchar,
            Approval_Date varchar,
            Approval_Flag varchar,
            Approval_Ket varchar,
            auditor varchar,
            nama_auditor varchar,
            jenisAuditor varchar,
            cabangDiperiksa varchar,
            idCabangDiperiksa varchar,
            cabang,
            syncBy varchar,
            type varchar,
            stat varchar)
        ;`
    );
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

    //CHECKLIST
    tx.executeSql(
        `create table if not exists MasterKategori(
            IdKategori varchar UNIQUE,
            IdTipeCeklist varchar,
            Nama_Kategori varchar,
            Type_Ceklist varchar,
            id_bisnis varchar,
            nama_bisnis varchar
        );`
    )

    tx.executeSql(
        `create table if not exists SubKategori(
            IdKategori varchar,
            IdSubKategori varchar UNIQUE,
            Nama_Sub_Kategori varchar
        );`
    )

    tx.executeSql(
        `create table if not exists TipePemeriksaan(
            Id varchar UNIQUE,
            Tipe_Ceklist varchar
        );`
    )

    tx.executeSql(
        `create table if not exists Pertanyaan(
            IdKategori varchar,
            IdPertanyaan varchar UNIQUE,
            IdSubKategori varchar,
            Pertanyaan varchar
        );`
    )

    tx.executeSql(
        `create table if not exists Jawaban(
            IdJawaban UNIQUE,
            Jawaban varchar
        );`
    )

    tx.executeSql(
        `create table if not exists ListChecklist(
            Cabang varchar,
            Keterangan varchar,
            IdST varchar,
            NoST varchar UNIQUE,
            TglMulai varchar,
            TglSelesai varchar,
            syncBy varchar,
            type varchar,
            stat varchar
        );`
    )

    tx.executeSql(
        `create table if not exists InputListChecklist(
            NoST varchar,
            IdST varchar,
            idPertanyaan varchar,
            Sample varchar,
            Temuan varchar,
            DetailTemuan varchar,
            Scoring varchar,
            syncBy vachar,
            type varchar,
            stat varchar
        );`
    )

    tx.executeSql(
        `create table if not exists ListSTChecklist(
            Cabang varchar,
            IdST varchar,
            NoST varchar,
            Tahun varchar,
            Tgl varchar,
            approval_by varchar,
            approval_date varchar,
            approval_flag varchar,
            approval_ket varchar,
            jenisAuditor varchar,
            keterangan varchar,
            tglMulai varchar,
            tglSelesai varchar,
            syncBy varchar,
            stat varchar
        );`
    )

    // tx.executeSql('DROP TABLE IF EXISTS ListKodeCLKA')
    // tx.executeSql('DROP TABLE IF EXISTS OptionSVKC')
    // tx.executeSql('DROP TABLE IF EXISTS OptionSTAM')
    // tx.executeSql('DROP TABLE IF EXISTS CabangDiperiksa')
    // tx.executeSql('DROP TABLE IF EXISTS ListSTSV')
    // tx.executeSql('DROP TABLE IF EXISTS ListRPM')
    // tx.executeSql('DROP TABLE IF EXISTS OptionST')
    // tx.executeSql('DROP TABLE IF EXISTS Pemeriksa')
    // tx.executeSql('DROP TABLE IF EXISTS OptionSTWAKADIF')
    // tx.executeSql('DROP TABLE IF EXISTS MasterKategori')
    // tx.executeSql('DROP TABLE IF EXISTS SubKategori')
    // tx.executeSql('DROP TABLE IF EXISTS TipePemeriksaan')
    // tx.executeSql('DROP TABLE IF EXISTS Pertanyaan')
    // tx.executeSql('DROP TABLE IF EXISTS Jawaban')
    // tx.executeSql('DROP TABLE IF EXISTS ListChecklist')
    // tx.executeSql('DROP TABLE IF EXISTS ListSTChecklist')
    // tx.executeSql('DROP TABLE IF EXISTS InputListChecklist')

},function(error) {
    console.log('Transaction ERROR: ' + error.message);
}, function() {
    console.log('Populated database OK');
})

export default db