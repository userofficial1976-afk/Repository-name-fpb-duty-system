// =====================================================
// JADUAL-DUTY.JS
// FPB DUTY SYSTEM
// VERSI PENUH
// DENGAN PENGIRAAN OFFDAY & CUTI AM
// =====================================================

// =====================================================
// SENARAI UNIT
// =====================================================

const SENARAI_UNIT = [

```
"Jerangau",
"Chador",
"Terengganu",
"Setiu",
"Rantau Abang",
"Kerteh"
```

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

```
"DOMContentLoaded",

async function () {


    isiSenaraiUnit();


    pasangEventTarikh();


    pasangEventUnit();


    pasangEventPos();


    pasangEventAnggota();


    pasangEventKodDuty();


    pasangEventKodTempatKerja();


    pasangEventFilter();


    pasangEventBayaranKhas();


    await muatAnggota();


    isiSenaraiPosTampungan();


    await muatKodDuty();


    await muatKodTempatKerja();


    isiSenaraiFilterKetuaUnit();


    await paparDuty();


}
```

);

// =====================================================
// POPUP
// =====================================================

function paparPopup(

```
mesej,

jenis = "success",

tajuk = ""
```

) {

```
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


let tajukPopup = tajuk;


if (!tajukPopup) {

    if (jenis === "success") {

        tajukPopup = "Berjaya";

    }

    else if (jenis === "error") {

        tajukPopup = "Ralat";

    }

    else if (jenis === "warning") {

        tajukPopup = "Amaran";

    }

    else {

        tajukPopup = "Makluman";

    }

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

            ${tajukPopup}

        </h3>


        <p class="popup-message">

            ${mesej}

        </p>


        <button

            type="button"

            class="popup-ok-button"

        >

            OK

        </button>

    </div>

`;


document.body.appendChild(popup);


if (!document.getElementById("popupSystemStyle")) {

    const style = document.createElement("style");


    style.id = "popupSystemStyle";


    style.innerHTML = `

        #popupSystem {

            position: fixed;

            inset: 0;

            background: rgba(15,23,42,0.55);

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

            box-shadow: 0 20px 60px rgba(0,0,0,0.3);

        }


        #popupSystem .popup-icon {

            font-size: 48px;

            margin-bottom: 10px;

        }


        #popupSystem h3 {

            margin: 8px 0;

            color: #0f172a;

            font-size: 22px;

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

            font-size: 14px;

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


    document.head.appendChild(style);

}


const button = popup.querySelector(

    ".popup-ok-button"

);


if (button) {

    button.onclick = function () {

        popup.remove();

    };

}
```

}

// =====================================================
// ISI SENARAI UNIT
// =====================================================

function isiSenaraiUnit() {

```
const select = document.getElementById(

    "unitPilihan"

);


if (!select) return;


select.innerHTML = `

    <option value="">

        -- Pilih Unit --

    </option>

`;


SENARAI_UNIT.forEach(function (unit) {


    const option = document.createElement(

        "option"

    );


    option.value = unit;


    option.textContent = unit;


    select.appendChild(option);


});
```

}

// =====================================================
// ISI SENARAI POS TAMPUNGAN
// =====================================================

function isiSenaraiPosTampungan() {

```
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

            .map(function (anggota) {

                return anggota.pos;

            })

            .filter(function (pos) {

                return pos &&

                    pos.toString().trim() !== "";

            })

            .map(function (pos) {

                return pos.toString().trim();

            })

    )

];


posList.sort(function (a, b) {

    return a.localeCompare(

        b,

        "ms",

        {

            numeric: true

        }

    );

});


posList.forEach(function (pos) {


    const option = document.createElement(

        "option"

    );


    option.value = pos;


    option.textContent = pos;


    select.appendChild(option);


});
```

}

// =====================================================
// EVENT TARIKH
// =====================================================

function pasangEventTarikh() {

```
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


        const namaBulan = [

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


        const namaHari = [

            "Ahad",

            "Isnin",

            "Selasa",

            "Rabu",

            "Khamis",

            "Jumaat",

            "Sabtu"

        ];


        setValue(

            "bulan",

            namaBulan[date.getMonth()]

        );


        setValue(

            "tahun",

            date.getFullYear()

        );


        setValue(

            "hari",

            namaHari[date.getDay()]

        );


    }

);
```

}

function kosongkanTarikh() {

```
[

    "bulan",

    "tahun",

    "hari"

]

    .forEach(function (id) {

        setValue(id, "");

    });
```

}

// =====================================================
// EVENT UNIT
// =====================================================

function pasangEventUnit() {

```
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


        isiKodDutyIkutUnit(unit);


        isiKodTempatKerjaIkutUnit(unit);


        if (!unit) return;


        const posList = [

            ...new Set(

                semuaAnggota

                    .filter(function (a) {

                        return String(a.unit)

                            .trim()

                            .toLowerCase() ===

                            String(unit)

                                .trim()

                                .toLowerCase();

                    })

                    .map(function (a) {

                        return a.pos;

                    })

                    .filter(Boolean)

            )

        ]

            .sort();


        const posSelect = document.getElementById(

            "posAsal"

        );


        if (!posSelect) return;


        posList.forEach(function (pos) {


            const option = document.createElement(

                "option"

            );


            option.value = pos;


            option.textContent = pos;


            posSelect.appendChild(option);


        });

    }

);
```

}

// =====================================================
// EVENT POS
// =====================================================

function pasangEventPos() {

```
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


        if (!unit || !pos) return;


        const anggotaList = semuaAnggota

            .filter(function (a) {

                return (

                    String(a.unit)

                        .trim()

                        .toLowerCase() ===

                    String(unit)

                        .trim()

                        .toLowerCase()

                    &&

                    String(a.pos)

                        .trim()

                        .toLowerCase() ===

                    String(pos)

                        .trim()

                        .toLowerCase()

                );

            })

            .sort(function (a, b) {

                return (

                    a.nama || ""

                ).localeCompare(

                    b.nama || ""

                );

            });


        const anggotaSelect = document.getElementById(

            "anggota"

        );


        if (!anggotaSelect) return;


        anggotaList.forEach(function (anggota) {


            const option = document.createElement(

                "option"

            );


            option.value = anggota.no_skb;


            option.textContent = anggota.nama;


            option.dataset.data = JSON.stringify(

                anggota

            );


            anggotaSelect.appendChild(option);


        });

    }

);
```

}

// =====================================================
// EVENT ANGGOTA
// =====================================================

function pasangEventAnggota() {

```
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


            kiraBayaranKhas();


            return;

        }


        const anggota = JSON.parse(

            option.dataset.data

        );


        isiMaklumatAnggota(

            anggota

        );


        kiraBayaranKhas();


    }

);
```

}

// =====================================================
// ISI MAKLUMAT ANGGOTA
// =====================================================

function isiMaklumatAnggota(

```
anggota
```

) {

```
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
```

}

// =====================================================
// MUAT ANGGOTA
// =====================================================

async function muatAnggota() {

```
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

        "ANGGOTA BERJAYA DIMUATKAN:",

        semuaAnggota

    );


}

catch (error) {


    console.error(

        "ERROR ANGGOTA:",

        error

    );


    paparPopup(

        error.message ||

        "Gagal mengambil data anggota.",

        "error",

        "Gagal Ambil Anggota"

    );

}
```

}

// =====================================================
// MUAT KOD DUTY
// =====================================================

async function muatKodDuty() {

```
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


    console.error(

        "ERROR KOD DUTY:",

        error

    );


    paparPopup(

        error.message ||

        "Gagal mengambil Kod Duty.",

        "error",

        "Gagal Ambil Kod Duty"

    );

}
```

}

// =====================================================
// EVENT KOD DUTY
// =====================================================

function pasangEventKodDuty() {

```
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

                    String(item.unit)

                        .trim()

                        .toLowerCase() ===

                    String(unit)

                        .trim()

                        .toLowerCase()

                    &&

                    String(item.kod)

                        .trim()

                        .toLowerCase() ===

                    String(kod)

                        .trim()

                        .toLowerCase()

                );

            }

        );


        if (data) {


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

                "jamTampungan",

                data.jam_kerja

            );


        }

        else {


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

                "jamTampungan",

                ""

            );

        }

    }

);
```

}

// =====================================================
// ISI KOD DUTY IKUT UNIT
// =====================================================

function isiKodDutyIkutUnit(

```
unit
```

) {

```
const select = document.getElementById(

    "kodDuty"

);


if (!select) return;


select.innerHTML = `

    <option value="">

        -- Pilih Kod Waktu Kerja --

    </option>

`;


semuaKodDuty

    .filter(function (item) {


        return String(item.unit)

            .trim()

            .toLowerCase() ===

            String(unit)

                .trim()

                .toLowerCase();

    })

    .forEach(function (item) {


        const option = document.createElement(

            "option"

        );


        option.value = item.kod;


        option.textContent =

            item.kod +

            " - " +

            item.waktu_tugasan;


        option.dataset.data = JSON.stringify(

            item

        );


        select.appendChild(option);


    });
```

}

// =====================================================
// MUAT TEMPAT KERJA
// =====================================================

async function muatKodTempatKerja() {

```
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


    console.error(

        "ERROR TEMPAT KERJA:",

        error

    );


    paparPopup(

        error.message ||

        "Gagal mengambil tempat kerja.",

        "error",

        "Gagal Ambil Tempat Kerja"

    );

}
```

}

// =====================================================
// ISI TEMPAT KERJA
// =====================================================

function isiKodTempatKerjaIkutUnit(

```
unit
```

) {

```
const select = document.getElementById(

    "kodTempatKerja"

);


if (!select) return;


select.innerHTML = `

    <option value="">

        -- Pilih Kod Tempat Kerja --

    </option>

`;


semuaKodTempatKerja

    .filter(function (item) {


        return String(item.unit)

            .trim()

            .toLowerCase() ===

            String(unit)

                .trim()

                .toLowerCase();

    })

    .forEach(function (item) {


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


        select.appendChild(option);


    });
```

}

// =====================================================
// EVENT TEMPAT KERJA
// =====================================================

function pasangEventKodTempatKerja() {

```
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


        const nama = option

            ? option.dataset.nama

            : "";


        setValue(

            "tempatKerja",

            nama

        );

    }

);
```

}

// =====================================================
// PENGIRAAN BAYARAN KHAS
// =====================================================

function kiraBayaranKhas() {

```
const noSkb = getValue(

    "noSkb"

);


const anggota = semuaAnggota.find(

    function (a) {

        return String(

            a.no_skb

        ) === String(

            noSkb

        );

    }

);


if (!anggota) {


    setValue(

        "rmHariOffday",

        "0.00"

    );


    setValue(

        "rmJamOffday",

        "0.00"

    );


    setValue(

        "jumlahOffday",

        "0.00"

    );


    setValue(

        "rmHariCutiam",

        "0.00"

    );


    setValue(

        "rmJamCutiam",

        "0.00"

    );


    setValue(

        "jumlahCutiam",

        "0.00"

    );


    return;

}


const checkboxOffday = document.getElementById(

    "hariOffday"

);


const checkboxCutiam = document.getElementById(

    "hariCutiam"

);


const hariOffday =

    checkboxOffday &&

    checkboxOffday.checked

        ? 1

        : 0;


const hariCutiam =

    checkboxCutiam &&

    checkboxCutiam.checked

        ? 1

        : 0;


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


const kadarHariOffday = Number(

    anggota.rm_perharioffday || 0

);


const kadarJamOffday = Number(

    anggota.rm_perjamoffday || 0

);


const kadarHariCutiam = Number(

    anggota.rm_perharicutiam || 0

);


const kadarJamCutiam = Number(

    anggota.rm_perjamcutiam || 0

);


const jumlahHariOffday =

    hariOffday *

    kadarHariOffday;


const jumlahJamOffday =

    jamOffday *

    kadarJamOffday;


const jumlahOffday =

    jumlahHariOffday +

    jumlahJamOffday;


const jumlahHariCutiam =

    hariCutiam *

    kadarHariCutiam;


const jumlahJamCutiam =

    jamCutiam *

    kadarJamCutiam;


const jumlahCutiam =

    jumlahHariCutiam +

    jumlahJamCutiam;


setValue(

    "rmHariOffday",

    jumlahHariOffday.toFixed(2)

);


setValue(

    "rmJamOffday",

    jumlahJamOffday.toFixed(2)

);


setValue(

    "jumlahOffday",

    jumlahOffday.toFixed(2)

);


setValue(

    "rmHariCutiam",

    jumlahHariCutiam.toFixed(2)

);


setValue(

    "rmJamCutiam",

    jumlahJamCutiam.toFixed(2)

);


setValue(

    "jumlahCutiam",

    jumlahCutiam.toFixed(2)

);
```

}

// =====================================================
// EVENT PENGIRAAN BAYARAN KHAS
// =====================================================

function pasangEventBayaranKhas() {

```
const hariOffday = document.getElementById(

    "hariOffday"

);


const jamOffday = document.getElementById(

    "jamOffday"

);


const hariCutiam = document.getElementById(

    "hariCutiam"

);


const jamCutiam = document.getElementById(

    "jamCutiam"

);


if (hariOffday) {


    hariOffday.addEventListener(

        "change",

        kiraBayaranKhas

    );

}


if (jamOffday) {


    jamOffday.addEventListener(

        "input",

        kiraBayaranKhas

    );

}


if (hariCutiam) {


    hariCutiam.addEventListener(

        "change",

        kiraBayaranKhas

    );

}


if (jamCutiam) {


    jamCutiam.addEventListener(

        "input",

        kiraBayaranKhas

    );

}
```

}

// =====================================================
// FILTER KETUA UNIT
// =====================================================

function isiSenaraiFilterKetuaUnit() {

```
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

            .map(function (a) {

                return a.ketua_unit;

            })

            .filter(Boolean)

    )

]

    .sort();


list.forEach(function (nama) {


    const option = document.createElement(

        "option"

    );


    option.value = nama;


    option.textContent = nama;


    select.appendChild(option);


});
```

}

// =====================================================
// EVENT FILTER
// =====================================================

function pasangEventFilter() {

```
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
```

}

// =====================================================
// SIMPAN DUTY
// =====================================================

async function simpanDuty() {

```
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


    const unitPilihan = getValue(

        "unitPilihan"

    );


    const anggota = semuaAnggota.find(

        function (a) {

            return String(

                a.no_skb

            ) === String(

                noSkb

            );

        }

    );


    const duty = semuaKodDuty.find(

        function (item) {


            return (

                String(item.unit)

                    .trim()

                    .toLowerCase() ===

                String(unitPilihan)

                    .trim()

                    .toLowerCase()

                &&

                String(item.kod)

                    .trim()

                    .toLowerCase() ===

                String(kodDuty)

                    .trim()

                    .toLowerCase()

            );

        }

    );


    const tempatKerja =

        semuaKodTempatKerja.find(

            function (item) {


                return (

                    String(item.unit)

                        .trim()

                        .toLowerCase() ===

                    String(unitPilihan)

                        .trim()

                        .toLowerCase()

                    &&

                    String(

                        item.kod_tempat_kerja

                    )

                        .trim()

                        .toLowerCase() ===

                    String(

                        kodTempatKerja

                    )

                        .trim()

                        .toLowerCase()

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


    // PASTIKAN NILAI TERKINI DIKIRA

    kiraBayaranKhas();


    const hariOffdayElement =

        document.getElementById(

            "hariOffday"

        );


    const hariCutiamElement =

        document.getElementById(

            "hariCutiam"

        );


    const sedangEdit =

        dutySedangEdit !== null;


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


        no_skb: anggota.no_skb,


        no_anggota: anggota.no_anggota,


        nama_anggota: anggota.nama,


        kawasan: anggota.kawasan,


        unit: anggota.unit,


        ketua_unit: anggota.ketua_unit,


        ketua_pos: anggota.ketua_pos,


        pos: anggota.pos,


        pos_tampungan: posTampungan,


        nama_pos_asal: anggota.pos,


        jam_tampungan: duty.jam_kerja,


        hari: getValue(

            "hari"

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

            hariOffdayElement &&

            hariOffdayElement.checked

                ? 1

                : 0,


        jam_offday_bertugas:

            Number(

                getValue(

                    "jamOffday"

                ) || 0

            ),


        hari_cutiam_bertugas:

            hariCutiamElement &&

            hariCutiamElement.checked

                ? 1

                : 0,


        jam_cutiam_bertugas:

            Number(

                getValue(

                    "jamCutiam"

                ) || 0

            ),


        // =========================================
        // NILAI PENGIRAAN RM
        // =========================================

        rm_hari_offday:

            Number(

                getValue(

                    "rmHariOffday"

                ) || 0

            ),


        rm_jam_offday:

            Number(

                getValue(

                    "rmJamOffday"

                ) || 0

            ),


        jumlah_offday:

            Number(

                getValue(

                    "jumlahOffday"

                ) || 0

            ),


        rm_hari_cutiam:

            Number(

                getValue(

                    "rmHariCutiam"

                ) || 0

            ),


        rm_jam_cutiam:

            Number(

                getValue(

                    "rmJamCutiam"

                ) || 0

            ),


        jumlah_cutiam:

            Number(

                getValue(

                    "jumlahCutiam"

                ) || 0

            ),


        dikemaskini_oleh:

            "Sistem",


        dikemaskini_pada:

            new Date().toISOString()

    };


    console.log(

        "DATA YANG AKAN DISIMPAN:"

    );


    console.table(

        dataDuty

    );


    let result;


    if (sedangEdit) {


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


        console.error(

            "RALAT SUPABASE:",

            result.error

        );


        paparPopup(

            result.error.message ||

            "Gagal menyimpan data.",

            "error",

            "Gagal Simpan Duty"

        );


        return;

    }


    dutySedangEdit = null;


    paparPopup(

        sedangEdit

            ? "Rekod Duty berjaya dikemaskini."

            : "Rekod Duty berjaya disimpan.",

        "success",

        sedangEdit

            ? "Duty Dikemaskini"

            : "Duty Berjaya Disimpan"

    );


    await paparDuty();


}


catch (error) {


    console.error(

        "ERROR SISTEM:",

        error

    );


    paparPopup(

        error.message ||

        "Ralat tidak diketahui berlaku.",

        "error",

        "Gagal Simpan"

    );

}
```

}

// =====================================================
// PAPAR DUTY
// =====================================================

async function paparDuty() {

```
const tbody = document.getElementById(

    "senaraiDuty"

);


if (!tbody) return;


const filterKetuaUnit = getValue(

    "filterKetuaUnit"

);


const filterBulan = getValue(

    "filterBulan"

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

] = filterBulan.split(

    "-"

);


let query = supabaseClient

    .from(

        "jadual_duty"

    )

    .select("*")

    .eq(

        "tahun",

        Number(tahun)

    )

    .eq(

        "bulan",

        getNamaBulan(

            Number(bulan)

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

        error.message ||

        "Gagal mengambil data duty.",

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

    .map(function (item) {


        return `

            <tr>

                <td>

                    ${formatTarikh(

                        item.tarikh

                    )}

                </td>


                <td>

                    <strong>

                        ${item.nama_anggota || ""}

                    </strong>

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

                            type="button"

                            class="btn-duplicate"

                            title="Duplicate"

                            onclick="duplicateDuty('${

                                item.id

                            }')"

                        >

                            📋

                        </button>


                        <button

                            type="button"

                            class="btn-edit"

                            title="Edit"

                            onclick="editDuty('${

                                item.id

                            }')"

                        >

                            ✏️

                        </button>


                        <button

                            type="button"

                            class="btn-delete"

                            title="Delete"

                            onclick="padamDuty('${

                                item.id

                            }')"

                        >

                            🗑️

                        </button>


                    </div>

                </td>

            </tr>

        `;

    })

    .join("");
```

}

// =====================================================
// EDIT DUTY
// =====================================================

async function editDuty(

```
id
```

) {

```
const duty = semuaDuty.find(

    function (item) {

        return String(

            item.id

        ) === String(id);

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

    "jamTampungan",

    duty.jam_tampungan

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

    "rmHariOffday",

    duty.rm_hari_offday

);


setValue(

    "rmJamOffday",

    duty.rm_jam_offday

);


setValue(

    "jumlahOffday",

    duty.jumlah_offday

);


setValue(

    "rmHariCutiam",

    duty.rm_hari_cutiam

);


setValue(

    "rmJamCutiam",

    duty.rm_jam_cutiam

);


setValue(

    "jumlahCutiam",

    duty.jumlah_cutiam

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


kiraBayaranKhas();


window.scrollTo({

    top: 0,

    behavior: "smooth"

});


paparPopup(

    "Rekod Duty telah dimasukkan ke dalam borang untuk diedit.",

    "info",

    "Edit Duty"

);
```

}

// =====================================================
// DUPLICATE DUTY
// =====================================================

async function duplicateDuty(

```
id
```

) {

```
const duty = semuaDuty.find(

    function (item) {

        return String(

            item.id

        ) === String(id);

    }

);


if (!duty) return;


dutySedangEdit = null;


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

    "jamTampungan",

    duty.jam_tampungan

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


kiraBayaranKhas();


window.scrollTo({

    top: 0,

    behavior: "smooth"

});


paparPopup(

    "Data duty telah disalin ke dalam borang. Tekan Simpan Duty untuk menyimpan sebagai rekod baru.",

    "success",

    "Duplicate Duty"

);
```

}

// =====================================================
// PADAM DUTY
// =====================================================

async function padamDuty(

```
id
```

) {

```
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

        error.message ||

        "Gagal memadam rekod.",

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
```

}

// =====================================================
// CONFIRM POPUP
// =====================================================

function popupConfirm(

```
mesej
```

) {

```
return new Promise(

    function (resolve) {


        const popup = document.createElement(

            "div"

        );


        popup.id = "popupConfirm";


        popup.style.cssText = `

            position: fixed;

            inset: 0;

            background: rgba(15,23,42,0.55);

            display: flex;

            align-items: center;

            justify-content: center;

            z-index: 99999;

            padding: 20px;

        `;


        popup.innerHTML = `

            <div class="popup-box">

                <div class="popup-icon">

                    ⚠️

                </div>


                <h3>

                    Sahkan Padam

                </h3>


                <p>

                    ${mesej}

                </p>


                <button

                    id="btnYa"

                    style="

                        border:none;

                        padding:11px 20px;

                        border-radius:8px;

                        background:#dc2626;

                        color:white;

                        font-weight:bold;

                        cursor:pointer;

                    "

                >

                    Ya, Padam

                </button>


                <button

                    id="btnTidak"

                    style="

                        border:none;

                        padding:11px 20px;

                        border-radius:8px;

                        background:#64748b;

                        color:white;

                        font-weight:bold;

                        cursor:pointer;

                        margin-left:8px;

                    "

                >

                    Batal

                </button>

            </div>

        `;


        document.body.appendChild(

            popup

        );


        document.getElementById(

            "btnYa"

        ).onclick = function () {


            popup.remove();


            resolve(true);

        };


        document.getElementById(

            "btnTidak"

        ).onclick = function () {


            popup.remove();


            resolve(false);

        };

    }

);
```

}

// =====================================================
// GET VALUE
// =====================================================

function getValue(

```
id
```

) {

```
const element = document.getElementById(

    id

);


return element

    ? element.value

    : "";
```

}

// =====================================================
// SET VALUE
// =====================================================

function setValue(

```
id,

value
```

) {

```
const element = document.getElementById(

    id

);


if (element) {


    element.value =

        value == null

            ? ""

            : value;

}
```

}

// =====================================================
// KOSONGKAN MAKLUMAT ANGGOTA
// =====================================================

function kosongkanMaklumatAnggota() {

```
[

    "noSkb",

    "noAnggota",

    "kawasan",

    "unit",

    "ketuaUnit",

    "ketuaPos",

    "namaPosAsal"

]

    .forEach(function (id) {


        setValue(

            id,

            ""

        );

    });


kiraBayaranKhas();
```

}

// =====================================================
// KOSONGKAN POS
// =====================================================

function kosongkanPos() {

```
const select = document.getElementById(

    "posAsal"

);


if (!select) return;


select.innerHTML = `

    <option value="">

        -- Pilih Pos Asal --

    </option>

`;
```

}

// =====================================================
// KOSONGKAN ANGGOTA
// =====================================================

function kosongkanAnggota() {

```
const select = document.getElementById(

    "anggota"

);


if (!select) return;


select.innerHTML = `

    <option value="">

        -- Pilih Nama Anggota --

    </option>

`;


kiraBayaranKhas();
```

}

// =====================================================
// KOSONGKAN KOD DUTY
// =====================================================

function kosongkanKodDuty() {

```
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

    "jamTampungan",

    ""

);
```

}

// =====================================================
// KOSONGKAN TEMPAT KERJA
// =====================================================

function kosongkanKodTempatKerja() {

```
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
```

}

// =====================================================
// NAMA BULAN
// =====================================================

function getNamaBulan(

```
bulan
```

) {

```
const nama = [

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


return nama[

    bulan - 1

] || "";
```

}

// =====================================================
// FORMAT TARIKH
// =====================================================

function formatTarikh(

```
tarikh
```

) {

```
if (!tarikh) return "";


const parts = tarikh.split(

    "-"

);


if (parts.length !== 3) {

    return tarikh;

}


return (

    parts[2] +

    "/" +

    parts[1] +

    "/" +

    parts[0]

);
```

}

// =====================================================
// LOGOUT
// =====================================================

async function logout() {

```
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
```

}
