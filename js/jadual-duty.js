// =====================================================
// JADUAL-DUTY.JS
// FPB DUTY SYSTEM
// VERSI PENUH STANDARD
//
// FUNGSI:
// 1. Muat data anggota
// 2. Muat kod duty
// 3. Muat kod tempat kerja
// 4. Key-in duty
// 5. Pengiraan RM Offday
// 6. Pengiraan RM Cuti Am
// 7. Simpan nilai RM ke Supabase
// 8. Edit duty
// 9. Duplicate duty
// 10. Padam duty
// 11. Filter duty
// =====================================================


// =====================================================
// SENARAI UNIT
// =====================================================

const SENARAI_UNIT = [

    "Jerangau",
    "Chador",
    "Terengganu",
    "Setiu",
    "Rantau Abang",
    "Kerteh"

];


// =====================================================
// NAMA BULAN
// =====================================================

const SENARAI_BULAN = [

    "Januari",
    "Februari",
    "Mac",
    "April",
    "Mei",
    "Jun",
    "Julai",
    "Ogos",
    "September",
    "Oktober",
    "November",
    "Disember"

];


// =====================================================
// NAMA HARI
// =====================================================

const SENARAI_HARI = [

    "Ahad",
    "Isnin",
    "Selasa",
    "Rabu",
    "Khamis",
    "Jumaat",
    "Sabtu"

];


// =====================================================
// DATA GLOBAL
// =====================================================

let semuaAnggota = [];

let semuaDuty = [];

let semuaKodDuty = [];

let semuaKodTempatKerja = [];

let dutySedangEdit = null;


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    async function () {

        try {

            isiSenaraiUnit();

            pasangEventTarikh();

            pasangEventUnit();

            pasangEventPos();

            pasangEventAnggota();

            pasangEventKodDuty();

            pasangEventKodTempatKerja();

            pasangEventFilter();

            pasangEventPengiraanRM();

            await muatAnggota();

            isiSenaraiPosTampungan();

            await muatKodDuty();

            await muatKodTempatKerja();

            isiSenaraiFilterKetuaUnit();

            await paparDuty();

        }

        catch (error) {

            console.error(

                "RALAT DOM READY:",

                error

            );

        }

    }

);


// =====================================================
// POPUP MAKLUMAN
// =====================================================

function paparPopup(

    mesej,

    jenis = "success",

    tajuk = ""

) {

    const popupLama = document.getElementById(

        "popupSystem"

    );


    if (popupLama) {

        popupLama.remove();

    }


    let icon = "ℹ️";


    if (jenis === "success") {

        icon = "✅";

    }

    else if (jenis === "error") {

        icon = "❌";

    }

    else if (jenis === "warning") {

        icon = "⚠️";

    }


    if (!tajuk) {

        tajuk =

            jenis === "success"

                ? "Berjaya"

                : jenis === "error"

                    ? "Ralat"

                    : jenis === "warning"

                        ? "Amaran"

                        : "Makluman";

    }


    const popup = document.createElement(

        "div"

    );


    popup.id = "popupSystem";


    popup.innerHTML = `

        <div class="popup-box">

            <div class="popup-icon">

                ${icon}

            </div>

            <h3>

                ${tajuk}

            </h3>

            <p class="popup-message">

                ${mesej || ""}

            </p>

            <button

                type="button"

                class="popup-ok-button"

            >

                OK

            </button>

        </div>

    `;


    document.body.appendChild(

        popup

    );


    if (

        !document.getElementById(

            "popupSystemStyle"

        )

    ) {

        const style = document.createElement(

            "style"

        );


        style.id = "popupSystemStyle";


        style.innerHTML = `

            #popupSystem {

                position: fixed;

                inset: 0;

                background: rgba(15,23,42,.55);

                display: flex;

                align-items: center;

                justify-content: center;

                z-index: 99999;

                padding: 20px;

            }


            #popupSystem .popup-box {

                width: 100%;

                max-width: 430px;

                background: white;

                border-radius: 18px;

                padding: 30px;

                text-align: center;

                box-shadow: 0 20px 60px rgba(0,0,0,.3);

            }


            #popupSystem .popup-icon {

                font-size: 48px;

                margin-bottom: 10px;

            }


            #popupSystem h3 {

                margin: 8px 0;

                color: #0f172a;

            }


            #popupSystem .popup-message {

                color: #475569;

                line-height: 1.6;

                margin: 12px 0 22px;

                white-space: pre-wrap;

            }


            #popupSystem .popup-ok-button {

                border: none;

                padding: 11px 35px;

                border-radius: 8px;

                background: #2563eb;

                color: white;

                font-weight: bold;

                cursor: pointer;

            }


            .tindakan-duty {

                display: flex;

                gap: 5px;

                justify-content: center;

                align-items: center;

            }


            .tindakan-duty button {

                width: 30px;

                height: 30px;

                padding: 0;

                border: none;

                border-radius: 5px;

                cursor: pointer;

            }


            .btn-duplicate {

                background: #e0f2fe;

            }


            .btn-edit {

                background: #fef3c7;

            }


            .btn-delete {

                background: #fee2e2;

            }

        `;


        document.head.appendChild(

            style

        );

    }


    popup.querySelector(

        ".popup-ok-button"

    ).onclick = function () {

        popup.remove();

    };

}


// =====================================================
// UNIT
// =====================================================

function isiSenaraiUnit() {

    const select = document.getElementById(

        "unitPilihan"

    );


    if (!select) return;


    select.innerHTML = `

        <option value="">

            -- Pilih Unit --

        </option>

    `;


    SENARAI_UNIT.forEach(

        function (unit) {

            const option = document.createElement(

                "option"

            );


            option.value = unit;

            option.textContent = unit;


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// EVENT TARIKH
// =====================================================

function pasangEventTarikh() {

    const tarikh = document.getElementById(

        "tarikh"

    );


    if (!tarikh) return;


    tarikh.addEventListener(

        "change",

        function () {

            if (!this.value) {

                kosongkanTarikh();

                return;

            }


            const date = new Date(

                this.value + "T00:00:00"

            );


            setValue(

                "bulan",

                SENARAI_BULAN[

                    date.getMonth()

                ]

            );


            setValue(

                "tahun",

                date.getFullYear()

            );


            setValue(

                "hari",

                SENARAI_HARI[

                    date.getDay()

                ]

            );

        }

    );

}


function kosongkanTarikh() {

    setValue(

        "bulan",

        ""

    );


    setValue(

        "tahun",

        ""

    );


    setValue(

        "hari",

        ""

    );

}


// =====================================================
// EVENT UNIT
// =====================================================

function pasangEventUnit() {

    const unitSelect = document.getElementById(

        "unitPilihan"

    );


    if (!unitSelect) return;


    unitSelect.addEventListener(

        "change",

        function () {

            const unit = this.value;


            kosongkanPos();

            kosongkanAnggota();

            kosongkanMaklumatAnggota();

            kosongkanKodDuty();

            kosongkanKodTempatKerja();

            kosongkanPengiraanRM();


            isiKodDutyIkutUnit(

                unit

            );


            isiKodTempatKerjaIkutUnit(

                unit

            );


            if (!unit) return;


            const posList = [

                ...new Set(

                    semuaAnggota

                        .filter(

                            function (anggota) {

                                return normalisasi(

                                    anggota.unit

                                ) === normalisasi(

                                    unit

                                );

                            }

                        )

                        .map(

                            function (anggota) {

                                return anggota.pos;

                            }

                        )

                        .filter(Boolean)

                )

            ];


            posList.sort();


            const posSelect = document.getElementById(

                "posAsal"

            );


            if (!posSelect) return;


            posList.forEach(

                function (pos) {

                    const option = document.createElement(

                        "option"

                    );


                    option.value = pos;

                    option.textContent = pos;


                    posSelect.appendChild(

                        option

                    );

                }

            );

        }

    );

}


// =====================================================
// EVENT POS
// =====================================================

function pasangEventPos() {

    const posSelect = document.getElementById(

        "posAsal"

    );


    if (!posSelect) return;


    posSelect.addEventListener(

        "change",

        function () {

            const unit = getValue(

                "unitPilihan"

            );


            const pos = this.value;


            kosongkanAnggota();

            kosongkanMaklumatAnggota();

            kosongkanPengiraanRM();


            if (!unit || !pos) return;


            const anggotaList = semuaAnggota

                .filter(

                    function (anggota) {

                        return (

                            normalisasi(

                                anggota.unit

                            ) === normalisasi(

                                unit

                            )

                            &&

                            normalisasi(

                                anggota.pos

                            ) === normalisasi(

                                pos

                            )

                        );

                    }

                )

                .sort(

                    function (a, b) {

                        return (

                            a.nama || ""

                        ).localeCompare(

                            b.nama || ""

                        );

                    }

                );


            const anggotaSelect = document.getElementById(

                "anggota"

            );


            if (!anggotaSelect) return;


            anggotaList.forEach(

                function (anggota) {

                    const option = document.createElement(

                        "option"

                    );


                    option.value = anggota.no_skb;


                    option.textContent = anggota.nama;


                    option.dataset.data = JSON.stringify(

                        anggota

                    );


                    anggotaSelect.appendChild(

                        option

                    );

                }

            );

        }

    );

}


// =====================================================
// EVENT ANGGOTA
// =====================================================

function pasangEventAnggota() {

    const select = document.getElementById(

        "anggota"

    );


    if (!select) return;


    select.addEventListener(

        "change",

        function () {

            const option = this.options[

                this.selectedIndex

            ];


            if (

                !option ||

                !option.dataset.data

            ) {

                kosongkanMaklumatAnggota();

                kosongkanPengiraanRM();

                return;

            }


            const anggota = JSON.parse(

                option.dataset.data

            );


            isiMaklumatAnggota(

                anggota

            );


            kiraSemuaRM();

        }

    );

}


// =====================================================
// MAKLUMAT ANGGOTA
// =====================================================

function isiMaklumatAnggota(

    anggota

) {

    setValue(

        "noSkb",

        anggota.no_skb

    );


    setValue(

        "noAnggota",

        anggota.no_anggota

    );


    setValue(

        "kawasan",

        anggota.kawasan

    );


    setValue(

        "unit",

        anggota.unit

    );


    setValue(

        "ketuaUnit",

        anggota.ketua_unit

    );


    setValue(

        "ketuaPos",

        anggota.ketua_pos

    );


    setValue(

        "namaPosAsal",

        anggota.pos

    );

}


// =====================================================
// MUAT ANGGOTA
// =====================================================

async function muatAnggota() {

    try {

        const {

            data,

            error

        } = await supabaseClient

            .from(

                "Data_Anggota"

            )

            .select(`

                no_skb,

                nama,

                no_anggota,

                kawasan,

                unit,

                pos,

                ketua_unit,

                ketua_pos,

                status,

                gaji_pokok,

                gaji_elaun,

                rm_pehariklmbiasa,

                rm_perharioffday,

                rm_perjamoffday,

                rm_perharicutiam,

                rm_perjamcutiam

            `)

            .order(

                "nama",

                {

                    ascending: true

                }

            );


        if (error) {

            throw error;

        }


        semuaAnggota = data || [];


        console.log(

            "ANGGOTA DIMUATKAN:",

            semuaAnggota.length

        );

    }


    catch (error) {

        console.error(

            "ERROR MUAT ANGGOTA:",

            error

        );


        paparPopup(

            error.message,

            "error",

            "Gagal Ambil Anggota"

        );

    }

}


// =====================================================
// MUAT KOD DUTY
// =====================================================

async function muatKodDuty() {

    try {

        const {

            data,

            error

        } = await supabaseClient

            .from(

                "kod_duty"

            )

            .select(`

                unit,

                kod,

                waktu_tugasan,

                jam_kerja,

                jam_klm,

                status

            `)

            .eq(

                "status",

                "Aktif"

            )

            .order(

                "kod",

                {

                    ascending: true

                }

            );


        if (error) {

            throw error;

        }


        semuaKodDuty = data || [];

    }


    catch (error) {

        paparPopup(

            error.message,

            "error",

            "Gagal Ambil Kod Duty"

        );

    }

}


// =====================================================
// EVENT KOD DUTY
// =====================================================

function pasangEventKodDuty() {

    const select = document.getElementById(

        "kodDuty"

    );


    if (!select) return;


    select.addEventListener(

        "change",

        function () {

            const unit = getValue(

                "unitPilihan"

            );


            const kod = this.value;


            const data = semuaKodDuty.find(

                function (item) {

                    return (

                        normalisasi(

                            item.unit

                        ) === normalisasi(

                            unit

                        )

                        &&

                        normalisasi(

                            item.kod

                        ) === normalisasi(

                            kod

                        )

                    );

                }

            );


            if (!data) {

                setValue(

                    "waktuTugasan",

                    ""

                );


                setValue(

                    "jamKerja",

                    ""

                );


                setValue(

                    "jamKlm",

                    ""

                );


                setValue(

                    "jamTampung",

                    ""

                );


                return;

            }


            setValue(

                "waktuTugasan",

                data.waktu_tugasan

            );


            setValue(

                "jamKerja",

                data.jam_kerja

            );


setValue(
    "jamKlm",
    data.jam_klm
);

setValue(
    "jamTampung",
    data.jam_kerja
);

kiraSemuaRM();
        }

    );

}


// =====================================================
// ISI KOD DUTY IKUT UNIT
// =====================================================

function isiKodDutyIkutUnit(

    unit

) {

    const select = document.getElementById(

        "kodDuty"

    );


    if (!select) return;


    select.innerHTML = `

        <option value="">

            -- Pilih Kod Waktu Kerja --

        </option>

    `;


    if (!unit) return;


    semuaKodDuty

        .filter(

            function (item) {

                return (

                    normalisasi(

                        item.unit

                    ) === normalisasi(

                        unit

                    )

                );

            }

        )

        .forEach(

            function (item) {

                const option = document.createElement(

                    "option"

                );


                option.value = item.kod;


                option.textContent =

                    item.kod +

                    " - " +

                    item.waktu_tugasan;


                select.appendChild(

                    option

                );

            }

        );

}


// =====================================================
// MUAT TEMPAT KERJA
// =====================================================

async function muatKodTempatKerja() {

    try {

        const {

            data,

            error

        } = await supabaseClient

            .from(

                "kod_tempat_kerja"

            )

            .select(`

                kod_tempat_kerja,

                nama_tempat_kerja,

                unit,

                status

            `)

            .eq(

                "status",

                "Aktif"

            )

            .order(

                "kod_tempat_kerja",

                {

                    ascending: true

                }

            );


        if (error) {

            throw error;

        }


        semuaKodTempatKerja = data || [];

    }


    catch (error) {

        paparPopup(

            error.message,

            "error",

            "Gagal Ambil Tempat Kerja"

        );

    }

}


// =====================================================
// ISI TEMPAT KERJA IKUT UNIT
// =====================================================

function isiKodTempatKerjaIkutUnit(

    unit

) {

    const select = document.getElementById(

        "kodTempatKerja"

    );


    if (!select) return;


    select.innerHTML = `

        <option value="">

            -- Pilih Kod Tempat Kerja --

        </option>

    `;


    if (!unit) return;


    semuaKodTempatKerja

        .filter(

            function (item) {

                return (

                    normalisasi(

                        item.unit

                    ) === normalisasi(

                        unit

                    )

                );

            }

        )

        .forEach(

            function (item) {

                const option = document.createElement(

                    "option"

                );


                option.value =

                    item.kod_tempat_kerja;


                option.textContent =

                    item.kod_tempat_kerja +

                    " - " +

                    item.nama_tempat_kerja;


                option.dataset.nama =

                    item.nama_tempat_kerja;


                select.appendChild(

                    option

                );

            }

        );

}


// =====================================================
// EVENT TEMPAT KERJA
// =====================================================

function pasangEventKodTempatKerja() {

    const select = document.getElementById(

        "kodTempatKerja"

    );


    if (!select) return;


    select.addEventListener(

        "change",

        function () {

            const option = this.options[

                this.selectedIndex

            ];


            setValue(

                "tempatKerja",

                option

                    ? option.dataset.nama || ""

                    : ""

            );

        }

    );

}


// =====================================================
// SENARAI POS TAMPUNGAN
// =====================================================

function isiSenaraiPosTampungan() {

    const select = document.getElementById(

        "posTampungan"

    );


    if (!select) return;


    select.innerHTML = `

        <option value="">

            -- Pilih Pos Tampungan --

        </option>

    `;


    const posList = [

        ...new Set(

            semuaAnggota

                .map(

                    function (anggota) {

                        return anggota.pos;

                    }

                )

                .filter(Boolean)

        )

    ];


    posList.sort();


    posList.forEach(

        function (pos) {

            const option = document.createElement(

                "option"

            );


            option.value = pos;

            option.textContent = pos;


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// EVENT PENGIRAAN RM
// =====================================================

function pasangEventPengiraanRM() {

    const ids = [

        "hariOffday",

        "jamOffday",

        "hariCutiam",

        "jamCutiam",

        "jamTampung",

        "jamKlm",

        "anggota"

    ];


    ids.forEach(

        function (id) {

            const element = document.getElementById(

                id

            );


            if (!element) return;


            element.addEventListener(

                "change",

                kiraSemuaRM

            );


            element.addEventListener(

                "input",

                kiraSemuaRM

            );

        }

    );

}


// =====================================================
// DAPATKAN ANGGOTA SEMASA
// =====================================================

function dapatkanAnggotaSemasa() {

    const noSkb = getValue(

        "noSkb"

    );


    return semuaAnggota.find(

        function (anggota) {

            return String(

                anggota.no_skb

            ) === String(

                noSkb

            );

        }

    );

}


// =====================================================
// KIRA SEMUA RM
// =====================================================

function kiraSemuaRM() {

    const anggota =

        dapatkanAnggotaSemasa();


    if (!anggota) {

        kosongkanPengiraanRM();

        return;

    }


    const hariOffday =

        document.getElementById(

            "hariOffday"

        );


    const hariCutiam =

        document.getElementById(

            "hariCutiam"

        );


    const jamOffday = Number(

        getValue(

            "jamOffday"

        ) || 0

    );


    const jamCutiam = Number(

        getValue(

            "jamCutiam"

        ) || 0

    );
    const jamKlm = Number(
    getValue("jamKlm") || 0
);

const jamTampung = Number(
    getValue("jamTampung") || 0
);

const kadarKlm = Number(
    anggota.rm_pehariklmbiasa || 0
);

const rmKlmHariBiasa =
    jamKlm * kadarKlm;

const rmTampung =
    jamTampung * kadarKlm;

    const rmHariOffday =

        hariOffday &&

        hariOffday.checked

            ? Number(

                anggota.rm_perharioffday || 0

            )

            : 0;


    const rmJamOffday =

        jamOffday *

        Number(

            anggota.rm_perjamoffday || 0

        );


    const rmHariCutiam =

        hariCutiam &&

        hariCutiam.checked

            ? Number(

                anggota.rm_perharicutiam || 0

            )

            : 0;


    const rmJamCutiam =

        jamCutiam *

        Number(

            anggota.rm_perjamcutiam || 0

        );


    const jumlahOffday =

        rmHariOffday +

        rmJamOffday;


    const jumlahCutiam =

        rmHariCutiam +

        rmJamCutiam;


    setValue(

        "rmHariOffday",

        formatRM(

            rmHariOffday

        )

    );


    setValue(

        "rmJamOffday",

        formatRM(

            rmJamOffday

        )

    );


    setValue(

        "jumlahOffday",

        formatRM(

            jumlahOffday

        )

    );


    setValue(

        "rmHariCutiam",

        formatRM(

            rmHariCutiam

        )

    );


    setValue(

        "rmJamCutiam",

        formatRM(

            rmJamCutiam

        )

    );


    setValue(

        "jumlahCutiam",

        formatRM(

            jumlahCutiam

        )
        
    );
    setValue(
    "rmKlmHariBiasa",
    formatRM(
        rmKlmHariBiasa
    )
);

setValue(
    "rmTampung",
    formatRM(
        rmTampung
    )
);
}


// =====================================================
// SIMPAN DUTY
// =====================================================

async function simpanDuty() {

    try {

        const tarikh = getValue(

            "tarikh"

        );


        const noSkb = getValue(

            "noSkb"

        );


        const kodDuty = getValue(

            "kodDuty"

        );


        const kodTempatKerja = getValue(

            "kodTempatKerja"

        );


        const posTampungan = getValue(

            "posTampungan"

        );


        const unit = getValue(

            "unitPilihan"

        );


        const anggota = semuaAnggota.find(

            function (anggota) {

                return String(

                    anggota.no_skb

                ) === String(

                    noSkb

                );

            }

        );


        const duty = semuaKodDuty.find(

            function (item) {

                return (

                    normalisasi(

                        item.unit

                    ) === normalisasi(

                        unit

                    )

                    &&

                    normalisasi(

                        item.kod

                    ) === normalisasi(

                        kodDuty

                    )

                );

            }

        );


        const tempatKerja =

            semuaKodTempatKerja.find(

                function (item) {

                    return (

                        normalisasi(

                            item.kod_tempat_kerja

                        ) === normalisasi(

                            kodTempatKerja

                        )

                    );

                }

            );


        if (!tarikh) {

            paparPopup(

                "Sila pilih tarikh duty.",

                "warning",

                "Tarikh Diperlukan"

            );

            return;

        }


        if (!anggota) {

            paparPopup(

                "Sila pilih nama anggota.",

                "warning",

                "Anggota Diperlukan"

            );

            return;

        }


        if (!duty) {

            paparPopup(

                "Sila pilih Kod Waktu Kerja.",

                "warning",

                "Kod Duty Diperlukan"

            );

            return;

        }


        if (!tempatKerja) {

            paparPopup(

                "Sila pilih Kod Tempat Kerja.",

                "warning",

                "Tempat Kerja Diperlukan"

            );

            return;

        }


        const hariOffday =

            document.getElementById(

                "hariOffday"

            );


        const hariCutiam =

            document.getElementById(

                "hariCutiam"

            );


        const jamOffday = Number(

            getValue(

                "jamOffday"

            ) || 0

        );


        const jamCutiam = Number(

            getValue(

                "jamCutiam"

            ) || 0

        );


        const rmHariOffday =

            hariOffday &&

            hariOffday.checked

                ? Number(

                    anggota.rm_perharioffday || 0

                )

                : 0;


        const rmJamOffday =

            jamOffday *

            Number(

                anggota.rm_perjamoffday || 0

            );


        const jumlahOffday =

            rmHariOffday +

            rmJamOffday;


        const rmHariCutiam =

            hariCutiam &&

            hariCutiam.checked

                ? Number(

                    anggota.rm_perharicutiam || 0

                )

                : 0;


        const rmJamCutiam =

            jamCutiam *

            Number(

                anggota.rm_perjamcutiam || 0

            );


        const jumlahCutiam =

            rmHariCutiam +

            rmJamCutiam;


        const dataDuty = {

            tarikh: tarikh,

            bulan: getValue(

                "bulan"

            ),

            tahun: Number(

                getValue(

                    "tahun"

                )

            ),

            hari: getValue(

                "hari"

            ),


            no_skb: anggota.no_skb,

            no_anggota: anggota.no_anggota,

            nama_anggota: anggota.nama,

            kawasan: anggota.kawasan,

            unit: anggota.unit,

            ketua_unit: anggota.ketua_unit,

            ketua_pos: anggota.ketua_pos,
            nama_ketua_pos:   
                anggota.ketua_pos,
            pos: anggota.pos,


            pos_tampungan:

                posTampungan,


            nama_pos_asal:

                anggota.pos,


            jam_tampungan:        
                Number(            
                       getValue("jamTampung") || 0        
                ),

            waktu_tugasan:

                duty.waktu_tugasan,


            jam_kerja:

                duty.jam_kerja,


            jam_klm:

                Number(

                    duty.jam_klm || 0

                ),


            kod_duty:

                duty.kod,


            kod_waktu_kerja:

                duty.kod,


            kod_tempat_kerja:

                tempatKerja.kod_tempat_kerja,


            tempat_kerja:

                tempatKerja.nama_tempat_kerja,


            hari_offday_bertugas:

                hariOffday &&

                hariOffday.checked

                    ? 1

                    : 0,


            jam_offday_bertugas:

                jamOffday,


            hari_cutiam_bertugas:

                hariCutiam &&

                hariCutiam.checked

                    ? 1

                    : 0,


            jam_cutiam_bertugas:

                jamCutiam,


            rm_hari_offday:

                rmHariOffday,


            rm_jam_offday:

                rmJamOffday,


            jumlah_offday:

                jumlahOffday,


            rm_hari_cutiam:

                rmHariCutiam,


            rm_jam_cutiam:

                rmJamCutiam,


jumlah_cutiam:
    jumlahCutiam,

rm_klm_hari_biasa:
    Number(
        getValue(
            "rmKlmHariBiasa"
        ) || 0
    ),

rm_klm_tampungan:
    Number(
        getValue(
            "rmTampung"
        ) || 0
    ),

rm_klm_seluruh:
    Number(
        getValue(
            "rmKlmHariBiasa"
        ) || 0
    ) +
    Number(
        getValue(
            "rmTampung"
        ) || 0
    ),

dikemaskini_oleh:
    "Sistem",


            dikemaskini_pada:

                new Date().toISOString()

        };


        let result;


        if (

            dutySedangEdit !== null

        ) {

            result = await supabaseClient

                .from(

                    "jadual_duty"

                )

                .update(

                    dataDuty

                )

                .eq(

                    "id",

                    dutySedangEdit

                )

                .select();

        }


        else {

            result = await supabaseClient

                .from(

                    "jadual_duty"

                )

                .insert([

                    dataDuty

                ])

                .select();

        }


        if (result.error) {

            throw result.error;

        }


        dutySedangEdit = null;


        paparPopup(

            "Rekod Duty berjaya disimpan dengan pengiraan RM.",

            "success",

            "Berjaya"

        );


        await paparDuty();

    }


    catch (error) {

        console.error(

            "ERROR SIMPAN DUTY:",

            error

        );


        paparPopup(

            error.message,

            "error",

            "Gagal Simpan Duty"

        );

    }

}


// =====================================================
// PAPAR DUTY
// =====================================================

async function paparDuty() {

    const tbody = document.getElementById(

        "senaraiDuty"

    );


    if (!tbody) return;


    const filterBulan = getValue(

        "filterBulan"

    );


    const filterKetuaUnit = getValue(

        "filterKetuaUnit"

    );


    if (!filterBulan) {

        tbody.innerHTML = `

            <tr>

                <td colspan="10">

                    Sila pilih Bulan / Tahun

                </td>

            </tr>

        `;


        return;

    }


    const [

        tahun,

        bulan

    ] = filterBulan.split("-");


    let query = supabaseClient

        .from(

            "jadual_duty"

        )

        .select("*")

        .eq(

            "tahun",

            Number(

                tahun

            )

        )

        .eq(

            "bulan",

            getNamaBulan(

                Number(

                    bulan

                )

            )

        )

        .order(

            "tarikh",

            {

                ascending: true

            }

        );


    if (filterKetuaUnit) {

        query = query.eq(

            "ketua_unit",

            filterKetuaUnit

        );

    }


    const {

        data,

        error

    } = await query;


    if (error) {

        paparPopup(

            error.message,

            "error",

            "Gagal Ambil Duty"

        );

        return;

    }


    semuaDuty = data || [];


    const cariNama = getValue(

        "cariNama"

    ).toLowerCase();


    let senarai = semuaDuty;


    if (cariNama) {

        senarai = senarai.filter(

            function (item) {

                return (

                    item.nama_anggota || ""

                )

                    .toLowerCase()

                    .includes(

                        cariNama

                    );

            }

        );

    }


    if (!senarai.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="10">

                    Tiada rekod duty ditemui

                </td>

            </tr>

        `;


        return;

    }


    tbody.innerHTML = senarai

        .map(

            function (item) {

                return `

                    <tr>

                        <td>

                            ${formatTarikh(

                                item.tarikh

                            )}

                        </td>


                        <td>

                            ${item.nama_anggota || ""}

                        </td>


                        <td>

                            ${item.kod_tempat_kerja || ""}

                        </td>


                        <td>

                            ${

                                item.kod_waktu_kerja ||

                                item.kod_duty ||

                                ""

                            }

                        </td>


                        <td>

                            ${item.jam_klm || 0}

                        </td>


                        <td>

                            ${item.hari_offday_bertugas || 0}

                        </td>


                        <td>

                            ${item.jam_offday_bertugas || 0}

                        </td>


                        <td>

                            ${item.hari_cutiam_bertugas || 0}

                        </td>


                        <td>

                            ${item.jam_cutiam_bertugas || 0}

                        </td>


                        <td>

                            <div class="tindakan-duty">

                                <button

                                    class="btn-duplicate"

                                    onclick="duplicateDuty('${item.id}')"

                                >

                                    📋

                                </button>


                                <button

                                    class="btn-edit"

                                    onclick="editDuty('${item.id}')"

                                >

                                    ✏️

                                </button>


                                <button

                                    class="btn-delete"

                                    onclick="padamDuty('${item.id}')"

                                >

                                    🗑️

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }

        )

        .join("");

}


// =====================================================
// EDIT DUTY
// =====================================================

async function editDuty(

    id

) {

    const duty = semuaDuty.find(

        function (item) {

            return String(

                item.id

            ) === String(

                id

            );

        }

    );


    if (!duty) return;


    dutySedangEdit = id;


    setValue(

        "tarikh",

        duty.tarikh

    );


    document.getElementById(

        "tarikh"

    )?.dispatchEvent(

        new Event(

            "change"

        )

    );


    setValue(

        "unitPilihan",

        duty.unit

    );


    document.getElementById(

        "unitPilihan"

    )?.dispatchEvent(

        new Event(

            "change"

        )

    );


    setValue(

        "posAsal",

        duty.pos

    );


    document.getElementById(

        "posAsal"

    )?.dispatchEvent(

        new Event(

            "change"

        )

    );


    setValue(

        "anggota",

        duty.no_skb

    );


    document.getElementById(

        "anggota"

    )?.dispatchEvent(

        new Event(

            "change"

        )

    );


    setValue(

        "posTampungan",

        duty.pos_tampungan

    );


    setValue(

        "kodDuty",

        duty.kod_duty ||

        duty.kod_waktu_kerja

    );


    document.getElementById(

        "kodDuty"

    )?.dispatchEvent(

        new Event(

            "change"

        )

    );


    setValue(

        "kodTempatKerja",

        duty.kod_tempat_kerja

    );


    document.getElementById(

        "kodTempatKerja"

    )?.dispatchEvent(

        new Event(

            "change"

        )

    );


    setValue(

        "jamOffday",

        duty.jam_offday_bertugas

    );


    setValue(

        "jamCutiam",

        duty.jam_cutiam_bertugas

    );
    
    setValue(
    "jamTampung",
    duty.jam_tampungan || 0
    );

    const offday = document.getElementById(

        "hariOffday"

    );


    const cutiam = document.getElementById(

        "hariCutiam"

    );


    if (offday) {

        offday.checked =

            duty.hari_offday_bertugas == 1;

    }


    if (cutiam) {

        cutiam.checked =

            duty.hari_cutiam_bertugas == 1;

    }


    kiraSemuaRM();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =====================================================
// DUPLICATE DUTY
// =====================================================

async function duplicateDuty(

    id

) {

    await editDuty(

        id

    );


    dutySedangEdit = null;


    paparPopup(

        "Data duty telah disalin ke dalam borang. Tekan Simpan Duty untuk menyimpan sebagai rekod baru.",

        "success",

        "Duplicate Duty"

    );

}


// =====================================================
// PADAM DUTY
// =====================================================

async function padamDuty(

    id

) {

    const yakin = await popupConfirm(

        "Adakah anda pasti mahu memadam rekod Duty ini?"

    );


    if (!yakin) return;


    const {

        error

    } = await supabaseClient

        .from(

            "jadual_duty"

        )

        .delete()

        .eq(

            "id",

            id

        );


    if (error) {

        paparPopup(

            error.message,

            "error",

            "Gagal Padam"

        );


        return;

    }


    paparPopup(

        "Rekod Duty berjaya dipadam.",

        "success",

        "Duty Dipadam"

    );


    await paparDuty();

}


// =====================================================
// FILTER KETUA UNIT
// =====================================================

function isiSenaraiFilterKetuaUnit() {

    const select = document.getElementById(

        "filterKetuaUnit"

    );


    if (!select) return;


    select.innerHTML = `

        <option value="">

            Semua Ketua Unit

        </option>

    `;


    const list = [

        ...new Set(

            semuaAnggota

                .map(

                    function (anggota) {

                        return anggota.ketua_unit;

                    }

                )

                .filter(Boolean)

        )

    ];


    list.sort();


    list.forEach(

        function (nama) {

            const option = document.createElement(

                "option"

            );


            option.value = nama;

            option.textContent = nama;


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// EVENT FILTER
// =====================================================

function pasangEventFilter() {

    const filterKetuaUnit = document.getElementById(

        "filterKetuaUnit"

    );


    const filterBulan = document.getElementById(

        "filterBulan"

    );


    const cariNama = document.getElementById(

        "cariNama"

    );


    if (filterKetuaUnit) {

        filterKetuaUnit.addEventListener(

            "change",

            paparDuty

        );

    }


    if (filterBulan) {

        filterBulan.addEventListener(

            "change",

            paparDuty

        );

    }


    if (cariNama) {

        cariNama.addEventListener(

            "input",

            paparDuty

        );

    }

}


// =====================================================
// CONFIRM POPUP
// =====================================================

function popupConfirm(

    mesej

) {

    return new Promise(

        function (resolve) {

            const popup = document.createElement(

                "div"

            );


            popup.style.cssText = `

                position: fixed;

                inset: 0;

                background: rgba(15,23,42,.55);

                display: flex;

                align-items: center;

                justify-content: center;

                z-index: 99999;

            `;


            popup.innerHTML = `

                <div style="

                    background:white;

                    padding:30px;

                    border-radius:18px;

                    text-align:center;

                ">

                    <h3>

                        ⚠️ Sahkan Padam

                    </h3>


                    <p>

                        ${mesej}

                    </p>


                    <br>


                    <button

                        id="btnYa"

                        style="

                            background:#dc2626;

                            color:white;

                            border:none;

                            padding:10px 20px;

                            border-radius:8px;

                            cursor:pointer;

                        "

                    >

                        Ya, Padam

                    </button>


                    <button

                        id="btnTidak"

                        style="

                            background:#64748b;

                            color:white;

                            border:none;

                            padding:10px 20px;

                            border-radius:8px;

                            margin-left:8px;

                            cursor:pointer;

                        "

                    >

                        Batal

                    </button>

                </div>

            `;


            document.body.appendChild(

                popup

            );


            popup.querySelector(

                "#btnYa"

            ).onclick = function () {

                popup.remove();

                resolve(true);

            };


            popup.querySelector(

                "#btnTidak"

            ).onclick = function () {

                popup.remove();

                resolve(false);

            };

        }

    );

}


// =====================================================
// KOSONGKAN PENGIRAAN RM
// =====================================================

function kosongkanPengiraanRM() {

    [

        "rmHariOffday",

        "rmJamOffday",

        "jumlahOffday",

        "rmHariCutiam",

        "rmJamCutiam",

        "jumlahCutiam",

        "rmKlmHariBiasa",
        
        "rmTampung"

    ]

        .forEach(

            function (id) {

                setValue(

                    id,

                    "0.00"

                );

            }

        );

}


// =====================================================
// FORMAT RM
// =====================================================

function formatRM(

    nilai

) {

    return Number(

        nilai || 0

    ).toFixed(

        2

    );

}


// =====================================================
// KOSONGKAN MAKLUMAT ANGGOTA
// =====================================================

function kosongkanMaklumatAnggota() {

    [

        "noSkb",

        "noAnggota",

        "kawasan",

        "unit",

        "ketuaUnit",

        "ketuaPos",

        "namaPosAsal"

    ]

        .forEach(

            function (id) {

                setValue(

                    id,

                    ""

                );

            }

        );

}


// =====================================================
// KOSONGKAN POS
// =====================================================

function kosongkanPos() {

    const select = document.getElementById(

        "posAsal"

    );


    if (!select) return;


    select.innerHTML = `

        <option value="">

            -- Pilih Pos Asal --

        </option>

    `;

}


// =====================================================
// KOSONGKAN ANGGOTA
// =====================================================

function kosongkanAnggota() {

    const select = document.getElementById(

        "anggota"

    );


    if (!select) return;


    select.innerHTML = `

        <option value="">

            -- Pilih Nama Anggota --

        </option>

    `;

}


// =====================================================
// KOSONGKAN KOD DUTY
// =====================================================

function kosongkanKodDuty() {

    const select = document.getElementById(

        "kodDuty"

    );


    if (select) {

        select.innerHTML = `

            <option value="">

                -- Pilih Kod Waktu Kerja --

            </option>

        `;

    }


    setValue(

        "waktuTugasan",

        ""

    );


    setValue(

        "jamKerja",

        ""

    );


    setValue(

        "jamKlm",

        ""

    );


    setValue(

        "jamTampung",

        ""

    );

}


// =====================================================
// KOSONGKAN TEMPAT KERJA
// =====================================================

function kosongkanKodTempatKerja() {

    const select = document.getElementById(

        "kodTempatKerja"

    );


    if (select) {

        select.innerHTML = `

            <option value="">

                -- Pilih Kod Tempat Kerja --

            </option>

        `;

    }

}


// =====================================================
// GET VALUE
// =====================================================

function getValue(

    id

) {

    const element = document.getElementById(

        id

    );


    return element

        ? element.value

        : "";

}


// =====================================================
// SET VALUE
// =====================================================

function setValue(

    id,

    value

) {

    const element = document.getElementById(

        id

    );


    if (element) {

        element.value =

            value == null

                ? ""

                : value;

    }

}


// =====================================================
// NORMALISASI TEKS
// =====================================================

function normalisasi(

    value

) {

    return String(

        value || ""

    )

        .trim()

        .toLowerCase();

}


// =====================================================
// NAMA BULAN
// =====================================================

function getNamaBulan(

    bulan

) {

    return SENARAI_BULAN[

        bulan - 1

    ] || "";

}


// =====================================================
// FORMAT TARIKH
// =====================================================

function formatTarikh(

    tarikh

) {

    if (!tarikh) return "";


    const parts = tarikh.split(

        "-"

    );


    if (

        parts.length !== 3

    ) {

        return tarikh;

    }


    return (

        parts[2] +

        "/" +

        parts[1] +

        "/" +

        parts[0]

    );

}


// =====================================================
// LOGOUT
// =====================================================

async function logout() {

    const result = await supabaseClient.auth.signOut();


    if (result.error) {

        console.error(

            "RALAT LOGOUT:",

            result.error

        );


        return;

    }


    window.location.href =

        "login.html";

}
