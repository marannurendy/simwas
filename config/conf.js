import react from 'react'

const IS_DEVELOPMENT = true

let MAJOR_VERSION = '0';
let MINOR_VERSION = '0';
let PATCH_VERSION = '0';
let BUILD = '001';
let TANGGAL = '2022-05-26';

let api_version = 'v1';
let base_url = 'http://10.61.3.253:9000';

if (IS_DEVELOPMENT) {
    MAJOR_VERSION = '0';
    MINOR_VERSION = '0';
    PATCH_VERSION = '0';
    BUILD = '001';
    TANGGAL = '2022-05-26';
    
    base_url = 'http://10.61.3.253:9000';

}

// APK VERSION
let VERSION = `${MAJOR_VERSION}.${MINOR_VERSION}.${PATCH_VERSION}-${BUILD}-${IS_DEVELOPMENT ? 'dev' : 'prod'} @ ${TANGGAL}`

// AUTH LOGIN
let AUTHLOGIN = `${base_url}/${api_version}/login/user`

// GET DATA MASTER
let baseMaster = `${base_url}/${api_version}/master`
let GetListKodeCLKA = `${baseMaster}/GetListKodeCLKA`
let GerListTahun = `${baseMaster}/GerListTahun`
let GetOptionSVKC = `${baseMaster}/GetOptionSVKC`
let OptionSTAM = `${baseMaster}/OptionSTAM`

// GET SURAT TUGAS
let baseSuratTugas = `${base_url}/${api_version}/surattugas`
let GetCabangDiperiksa = `${baseSuratTugas}/GetCabangDiperiksa`
let GetLastST = `${baseSuratTugas}/GetLastST`
let GetListPPM = `${baseSuratTugas}/GetListPPM`
let GetListRPM = `${baseSuratTugas}/GetListRPM`
let GetOptionST = `${baseSuratTugas}/GetOptionST`
let GetPemeriksa = `${baseSuratTugas}/GetPemeriksa`
let GetoptionSTWakadiv = `${baseSuratTugas}/GetoptionSTWakadiv`

// GET TINDAK LANJUT
let baseTindakLanjut = `${base_url}/${api_version}/tindaklanjut`
let GetListKKA = `${baseTindakLanjut}/GetListKKA`
let GetListTL = `${baseTindakLanjut}/GetListTL`

// GET CHECKLIST
let baseChecklist = `${base_url}/${api_version}/checklist`
let GetListJawabanCL = `${baseChecklist}/GetListJawabanCL`
let GetListKodeCL = `${baseChecklist}/GetListKodeCL`
let GetListKodeCLKC = `${baseChecklist}/GetListKodeCLKC`
let GetMasterCekList = `${baseChecklist}/GetMasterCekList`
let GetListInputanCeklist = `${baseChecklist}/GetListInputanCeklist`
let GetOptionSTCL = `${baseChecklist}/GetOptionSTCL`
let GetOptionSTCLAM = `${baseChecklist}/GetOptionSTCLAM`
let GetOptionSTCLKC = `${baseChecklist}/GetOptionSTCLKC`

// POST SURAT TUGAS
let PostNoLapAM = `${base_url}/${api_version}/surattugas/PostNoLapAM`
let PostSuratTugas = `${base_url}/${api_version}/surattugas/PostSuratTugas`

// POST CHECKLIST
let PostCheckList = `${base_url}/${api_version}/checklist/PostCheckList`

export {
    VERSION, 
    AUTHLOGIN,
    GetListKodeCLKA,
    GerListTahun,
    GetOptionSVKC,
    OptionSTAM,
    GetCabangDiperiksa,
    GetLastST,
    GetListPPM,
    GetListRPM,
    GetOptionST,
    GetPemeriksa,
    GetoptionSTWakadiv,
    GetListKKA,
    GetListTL,
    GetListJawabanCL,
    GetListKodeCL,
    GetListKodeCLKC,
    GetMasterCekList,
    GetOptionSTCL,
    GetOptionSTCLAM,
    GetOptionSTCLKC,
    PostNoLapAM,
    PostSuratTugas,
    PostCheckList,
    GetListInputanCeklist
}