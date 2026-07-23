// =====================================================
// JADUAL-DUTY.JS
// FPB DUTY SYSTEM
// VERSI TERAKHIR
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


        isiSenaraiUnit();


        pasangEventTarikh();


        pasangEventUnit();


        pasangEventPos();


        pasangEventAnggota();


        pasangEventKodDuty();


        pasangEventKodTempatKerja();


        pasangEventFilter();


        await muatAnggota();


        await muatKodDuty();


        await muatKodTempatKerja();


        isiSenaraiFilterKetuaUnit();


        await paparDuty();


    }

);


// =====================================================
// POPUP DI TENGAH SKRIN
// =====================================================

function paparPopup(

    mesej,

    jenis = "success",

    tajuk = ""

) {


    let popup =

        document.getElementById(

            "popupSystem"

        );


    if (!popup) {


        popup =

            document.createElement(

                "div"

            );


        popup.id =

            "popupSystem";


        popup.innerHTML = `

            <div class="popup-box">

                <div

                    id="popupIcon"

                    class="popup-icon"

                >

                </div>


                <h3

                    id="popupTitle"

                >

                </h3>


                <p

                    id="popupMessage"

                >

                </p>


                <button

                    onclick="tutupPopup()"

                >

                    OK

                </button>

            </div>

        `;


        document.body.appendChild(

            popup

        );


        const style =

            document.createElement(

                "style"

            );


        style.innerHTML = `

            #popupSystem {

                position: fixed;

                inset: 0;

                background: rgba(

                    15,

                    23,

                    42,

                    0.55

                );

                display: flex;

                align-items: center;

                justify-content: center;

                z-index: 99999;

                padding: 20px;

            }


            .popup-box {

                width: 100%;

                max-width: 430px;

                background: white;

                border-radius: 18px;

                padding: 30px;

                text-align: center;

                box-shadow:

                    0 20px 60px

                    rgba(

                        0,

                        0,

                        0,

                        0.3

                    );

                animation:

                    popupShow

                    0.25s

                    ease;

            }


            @keyframes popupShow {

                from {

                    opacity: 0;

                    transform: scale(

                        0.85

                    );

                }


                to {

                    opacity: 1;

                    transform: scale(

                        1

                    );

                }

            }


            .popup-icon {

                font-size: 48px;

                margin-bottom: 10px;

            }


            .popup-box h3 {

                margin: 8px 0;

                color: #0f172a;

            }


            .popup-box p {

                color: #475569;

                line-height: 1.6;

                margin: 12px 0 22px;

            }


            .popup-box button {

                border: none;

                padding: 11px 35px;

                border-radius: 8px;

                background: #2563eb;

                color: white;

                font-weight: bold;

                cursor: pointer;

            }


            .popup-box button:hover {

                background: #1d4ed8;

            }

        `;


        document.head.appendChild(

            style

        );

    }


    const icon =

        document.getElementById(

            "popupIcon"

        );


    const title =

        document.getElementById(

            "popupTitle"

        );


    const message =

        document.getElementById(

            "popupMessage"

        );


    if (

        jenis ===

        "success"

    ) {

        icon.textContent =

            "✅";

    }


    else if (

        jenis ===

        "error"

    ) {

        icon.textContent =

            "❌";

    }


    else if (

        jenis ===

        "warning"

    ) {

        icon.textContent =

            "⚠️";

    }


    else {

        icon.textContent =

            "ℹ️";

    }


    title.textContent =

        tajuk || "Makluman";


    message.textContent =

        mesej;


    popup.style.display =

        "flex";

}


function tutupPopup() {


    const popup =

        document.getElementById(

            "popupSystem"

        );


    if (popup)

        popup.remove();

}


// =====================================================
// ISI UNIT
// =====================================================

function isiSenaraiUnit() {


    const select =

        document.getElementById(

            "unitPilihan"

        );


    if (!select)

        return;


    select.innerHTML = `

        <option value="">

            -- Pilih Unit --

        </option>

    `;


    SENARAI_UNIT.forEach(

        function (unit) {


            const option =

                document.createElement(

                    "option"

                );


            option.value =

                unit;


            option.textContent =

                unit;


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// TARIKH
// =====================================================

function pasangEventTarikh() {


    const tarikh =

        document.getElementById(

            "tarikh"

        );


    if (!tarikh)

        return;


    tarikh.addEventListener(

        "change",

        function () {


            if (!this.value) {


                kosongkanTarikh();


                return;

            }


            const date =

                new Date(

                    this.value +

                    "T00:00:00"

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


            const bulan =

                document.getElementById(

                    "bulan"

                );


            const tahun =

                document.getElementById(

                    "tahun"

                );


            const hari =

                document.getElementById(

                    "hari"

                );


            if (bulan)

                bulan.value =

                    namaBulan[

                        date.getMonth()

                    ];


            if (tahun)

                tahun.value =

                    date.getFullYear();


            if (hari)

                hari.value =

                    namaHari[

                        date.getDay()

                    ];

        }

    );

}


function kosongkanTarikh() {


    const ids = [

        "bulan",

        "tahun",

        "hari"

    ];


    ids.forEach(

        function (id) {


            const element =

                document.getElementById(

                    id

                );


            if (element)

                element.value =

                    "";

        }

    );

}


// =====================================================
// EVENT UNIT
// =====================================================

function pasangEventUnit() {


    const unitSelect =

        document.getElementById(

            "unitPilihan"

        );


    if (!unitSelect)

        return;


    unitSelect.addEventListener(

        "change",

        function () {


            const unit =

                this.value;


            kosongkanPos();


            kosongkanAnggota();


            kosongkanMaklumatAnggota();


            kosongkanKodDuty();


            kosongkanKodTempatKerja();


            isiKodDutyIkutUnit(

                unit

            );


            isiKodTempatKerjaIkutUnit(

                unit

            );


            if (!unit)

                return;


            const posList =

                [

                    ...new Set(

                        semuaAnggota

                            .filter(

                                function (a) {

                                    return (

                                        a.unit ===

                                        unit

                                    );

                                }

                            )

                            .map(

                                function (a) {

                                    return a.pos;

                                }

                            )

                            .filter(

                                Boolean

                            )

                    )

                ]

                .sort();


            const posSelect =

                document.getElementById(

                    "posAsal"

                );


            if (!posSelect)

                return;


            posList.forEach(

                function (pos) {


                    const option =

                        document.createElement(

                            "option"

                        );


                    option.value =

                        pos;


                    option.textContent =

                        pos;


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


    const posSelect =

        document.getElementById(

            "posAsal"

        );


    if (!posSelect)

        return;


    posSelect.addEventListener(

        "change",

        function () {


            const unit =

                document.getElementById(

                    "unitPilihan"

                ).value;


            const pos =

                this.value;


            kosongkanAnggota();


            kosongkanMaklumatAnggota();


            if (

                !unit ||

                !pos

            )

                return;


            const anggotaList =

                semuaAnggota

                    .filter(

                        function (a) {


                            return (

                                a.unit ===

                                unit &&

                                a.pos ===

                                pos

                            );

                        }

                    )

                    .sort(

                        function (a, b) {


                            return (

                                (

                                    a.nama ||

                                    ""

                                )

                                    .localeCompare(

                                        b.nama ||

                                        ""

                                    )

                            );

                        }

                    );


            const anggotaSelect =

                document.getElementById(

                    "anggota"

                );


            if (!anggotaSelect)

                return;


            anggotaList.forEach(

                function (anggota) {


                    const option =

                        document.createElement(

                            "option"

                        );


                    option.value =

                        anggota.no_skb;


                    option.textContent =

                        anggota.nama;


                    option.dataset.data =

                        JSON.stringify(

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


    const select =

        document.getElementById(

            "anggota"

        );


    if (!select)

        return;


    select.addEventListener(

        "change",

        function () {


            const option =

                this.options[

                    this.selectedIndex

                ];


            if (

                !option ||

                !option.dataset.data

            ) {


                kosongkanMaklumatAnggota();


                return;

            }


            const anggota =

                JSON.parse(

                    option.dataset.data

                );


            isiMaklumatAnggota(

                anggota

            );

        }

    );

}


// =====================================================
// ISI MAKLUMAT ANGGOTA
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


function setValue(

    id,

    value

) {


    const element =

        document.getElementById(

            id

        );


    if (element)

        element.value =

            value || "";

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

                status

            `)

            .order(

                "nama",

                {

                    ascending:

                        true

                }

            );


        if (error)

            throw error;


        semuaAnggota =

            data || [];


    }

    catch (error) {


        console.error(

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

                    ascending:

                        true

                }

            );


        if (error)

            throw error;


        semuaKodDuty =

            data || [];


    }

    catch (error) {


        console.error(

            error

        );


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


    const select =

        document.getElementById(

            "kodDuty"

        );


    if (!select)

        return;


    select.addEventListener(

        "change",

        function () {


            const unit =

                document.getElementById(

                    "unitPilihan"

                ).value;


            const kod =

                this.value;


            const data =

                semuaKodDuty.find(

                    function (item) {


                        return (

                            item.unit ===

                            unit &&

                            item.kod ===

                            kod

                        );

                    }

                );


            if (data) {

    setValue(
        "jamKlm",
        data.jam_klm
    );

}
else {

    setValue(
        "jamKlm",
        0

    );

}

            else {


                setValue(

                    "jamKlm",

                    0

                );

            }

        }

    );

}


// =====================================================
// ISI KOD DUTY
// =====================================================

function isiKodDutyIkutUnit(

    unit

) {


    const select =

        document.getElementById(

            "kodDuty"

        );


    if (!select)

        return;


    select.innerHTML = `

        <option value="">

            -- Pilih Kod Waktu Kerja --

        </option>

    `;


    semuaKodDuty

        .filter(

            function (item) {


                return (

                    item.unit ===

                    unit

                );

            }

        )

        .forEach(

            function (item) {


                const option =

                    document.createElement(

                        "option"

                    );


                option.value =

                    item.kod;


                option.textContent =

                    item.kod +

                    " - " +

                    item.waktu_tugasan;


                option.dataset.data =

                    JSON.stringify(

                        item

                    );


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

                    ascending:

                        true

                }

            );


        if (error)

            throw error;


        semuaKodTempatKerja =

            data || [];


    }

    catch (error) {


        console.error(

            error

        );


        paparPopup(

            error.message,

            "error",

            "Gagal Ambil Tempat Kerja"

        );

    }

}


// =====================================================
// ISI TEMPAT KERJA
// =====================================================

function isiKodTempatKerjaIkutUnit(

    unit

) {


    const select =

        document.getElementById(

            "kodTempatKerja"

        );


    if (!select)

        return;


    select.innerHTML = `

        <option value="">

            -- Pilih Kod Tempat Kerja --

        </option>

    `;


    semuaKodTempatKerja

        .filter(

            function (item) {


                return (

                    item.unit ===

                    unit

                );

            }

        )

        .forEach(

            function (item) {


                const option =

                    document.createElement(

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


    const select =

        document.getElementById(

            "kodTempatKerja"

        );


    if (!select)

        return;


    select.addEventListener(

        "change",

        function () {


            const option =

                this.options[

                    this.selectedIndex

                ];


            const nama =

                option

                    ? option.dataset.nama

                    : "";


            // Jika ada input tempat_kerja

            setValue(

                "tempatKerja",

                nama

            );

        }

    );

}


// =====================================================
// FILTER KETUA UNIT
// =====================================================

function isiSenaraiFilterKetuaUnit() {


    const select =

        document.getElementById(

            "filterKetuaUnit"

        );


    if (!select)

        return;


    select.innerHTML = `

        <option value="">

            Semua Ketua Unit

        </option>

    `;


    const list =

        [

            ...new Set(

                semuaAnggota

                    .map(

                        function (a) {

                            return a.ketua_unit;

                        }

                    )

                    .filter(

                        Boolean

                    )

            )

        ]

        .sort();


    list.forEach(

        function (nama) {


            const option =

                document.createElement(

                    "option"

                );


            option.value =

                nama;


            option.textContent =

                nama;


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


    const filterKetuaUnit =

        document.getElementById(

            "filterKetuaUnit"

        );


    const filterBulan =

        document.getElementById(

            "filterBulan"

        );


    if (filterKetuaUnit)


        filterKetuaUnit.addEventListener(

            "change",

            paparDuty

        );


    if (filterBulan)


        filterBulan.addEventListener(

            "change",

            paparDuty

        );

}


// =====================================================
// SIMPAN DUTY
// =====================================================

async function simpanDuty() {


    try {


        const tarikh =

            getValue(

                "tarikh"

            );


        const noSkb =

            getValue(

                "noSkb"

            );


        const kodDuty =

            getValue(

                "kodDuty"

            );


        const kodTempatKerja =

            getValue(

                "kodTempatKerja"

            );


        const anggota =

            semuaAnggota.find(

                function (a) {


                    return (

                        String(

                            a.no_skb

                        ) ===

                        String(

                            noSkb

                        )

                    );

                }

            );


        const duty =

            semuaKodDuty.find(

                function (item) {


                    return (

                        item.unit ===

                        getValue(

                            "unitPilihan"

                        ) &&

                        item.kod ===

                        kodDuty

                    );

                }

            );


        const tempatKerja =

            semuaKodTempatKerja.find(

                function (item) {


                    return (

                        item.unit ===

                        getValue(

                            "unitPilihan"

                        ) &&

                        item.kod_tempat_kerja ===

                        kodTempatKerja

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


        const dataDuty = {


            tarikh:

                tarikh,


            bulan:

                getValue(

                    "bulan"

                ),


            tahun:

                Number(

                    getValue(

                        "tahun"

                    )

                ),


            no_skb:

                anggota.no_skb,


            no_anggota:

                anggota.no_anggota,


            nama_anggota:

                anggota.nama,


            kawasan:

                anggota.kawasan,


            unit:

                anggota.unit,


            ketua_unit:

                anggota.ketua_unit,


            ketua_pos:

                anggota.ketua_pos,


            pos:

                anggota.pos,


            nama_pos_asal:

                anggota.pos,


            hari:

                getValue(

                    "hari"

                ),


            waktu_tugasan:

                duty.waktu_tugasan,


            jam_kerja:

                duty.jam_kerja,


            jam_klm:

                Number(

                    duty.jam_klm ||

                    0

                ),


            kod_dutyy:

                duty.kod,


            kod_waktu_kerja:

                duty.kod,


            kod_tempat_kerja:

                tempatKerja.kod_tempat_kerja,


            tempat_kerja:

                tempatKerja.nama_tempat_kerja,


            hari_offday_bertugas:

                document.getElementById(

                    "hariOffday"

                ).checked

                    ? 1

                    : 0,


            jam_offday_bertugas:

                Number(

                    getValue(

                        "jamOffday"

                    ) ||

                    0

                ),


            hari_cutiam_bertugas:

                document.getElementById(

                    "hariCutiam"

                ).checked

                    ? 1

                    : 0,


            jam_cutiam_bertugas:

                Number(

                    getValue(

                        "jamCutiam"

                    ) ||

                    0

                ),


            dikemaskini_oleh:

                "Sistem",


            dikemaskini_pada:

                new Date()

                    .toISOString()

        };


        let result;


        if (

            dutySedangEdit

        ) {


            result =

                await supabaseClient

                    .from(

                        "jadual_duty"

                    )

                    .update(

                        dataDuty

                    )

                    .eq(

                        "id",

                        dutySedangEdit

                    );


        }

        else {


            result =

                await supabaseClient

                    .from(

                        "jadual_duty"

                    )

                    .insert(

                        [

                            dataDuty

                        ]

                    );

        }


        if (

            result.error

        ) {


            console.error(

                result.error

            );


            paparPopup(

                result.error.message,

                "error",

                "Gagal Simpan Duty"

            );


            return;

        }


        paparPopup(

            dutySedangEdit

                ? "Rekod Duty berjaya dikemaskini."

                : "Rekod Duty berjaya disimpan.",

            "success",

            dutySedangEdit

                ? "Duty Dikemaskini"

                : "Duty Berjaya Disimpan"

        );


        dutySedangEdit =

            null;


        // Borang sengaja TIDAK dikosongkan

        await paparDuty();


    }

    catch (error) {


        console.error(

            error

        );


        paparPopup(

            error.message,

            "error",

            "Gagal Simpan"

        );

    }

}


// =====================================================
// PAPAR DUTY
// =====================================================

async function paparDuty() {


    const tbody =

        document.getElementById(

            "senaraiDuty"

        );


    if (!tbody)

        return;


    const filterKetuaUnit =

        getValue(

            "filterKetuaUnit"

        );


    const filterBulan =

        getValue(

            "filterBulan"

        );


    if (

        !filterBulan

    ) {


        tbody.innerHTML = `

            <tr>

                <td colspan="18">

                    Sila pilih Bulan / Tahun

                </td>

            </tr>

        `;


        return;

    }


    const [tahun, bulan] =

        filterBulan.split(

            "-"

        );


    let query =

        supabaseClient

            .from(

                "jadual_duty"

            )

            .select(

                "*"

            )

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

                    ascending:

                        true

                }

            );


    if (

        filterKetuaUnit

    ) {


        query =

            query.eq(

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


    semuaDuty =

        data || [];


    const cariNama =

        getValue(

            "cariNama"

        )

            .toLowerCase();


    let senarai =

        semuaDuty;


    if (

        cariNama

    ) {


        senarai =

            senarai.filter(

                function (item) {


                    return (

                        item.nama_anggota ||

                        ""

                    )

                        .toLowerCase()

                        .includes(

                            cariNama

                        );

                }

            );

    }


    if (

        !senarai.length

    ) {


        tbody.innerHTML = `

            <tr>

                <td colspan="18">

                    Tiada rekod duty ditemui

                </td>

            </tr>

        `;


        return;

    }


    tbody.innerHTML =

        senarai

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

                                ${item.hari || ""}

                            </td>


                            <td>

                                ${item.no_skb || ""}

                            </td>


                            <td>

                                ${item.no_anggota || ""}

                            </td>


                            <td>

                                <strong>

                                    ${item.nama_anggota || ""}

                                </strong>

                            </td>


                            <td>

                                ${item.kawasan || ""}

                            </td>


                            <td>

                                ${item.unit || ""}

                            </td>


                            <td>

                                ${item.ketua_unit || ""}

                            </td>


                            <td>

                                ${item.ketua_pos || ""}

                            </td>


                            <td>

                                ${item.pos || item.nama_pos_asal || ""}

                            </td>


                            <td>

                                ${item.waktu_tugasan || ""}

                            </td>


                            <td>

                                ${item.jam_kerja || 0}

                            </td>


                            <td>

                                ${item.kod_dutyy || item.kod_waktu_kerja || ""}

                            </td>


                            <td>

                                ${item.kod_tempat_kerja || ""}

                            </td>


                            <td>

                                ${item.tempat_kerja || ""}

                            </td>


                            <td>

                                ${item.jam_klm || 0}

                            </td>


                            <td>

                                ${item.hari_offday_bertugas == 1

                                    ? "Ya"

                                    : "Tidak"}

                            </td>


                            <td>

                                ${item.jam_offday_bertugas || 0}

                            </td>


                            <td>

                                ${item.hari_cutiam_bertugas == 1

                                    ? "Ya"

                                    : "Tidak"}

                            </td>


                            <td>

                                ${item.jam_cutiam_bertugas || 0}

                            </td>


                            <td>

                                <button

                                    onclick="editDuty('${

                                        item.id

                                    }')"

                                >

                                    ✏️ Edit

                                </button>


                                <button

                                    class="btn-danger"

                                    onclick="padamDuty('${

                                        item.id

                                    }')"

                                >

                                    🗑️ Padam

                                </button>

                            </td>

                        </tr>

                    `;

                }

            )

            .join(

                ""

            );

}


// =====================================================
// EDIT DUTY
// =====================================================

async function editDuty(

    id

) {


    const duty =

        semuaDuty.find(

            function (item) {


                return String(

                    item.id

                ) ===

                String(

                    id

                );

            }

        );


    if (!duty)

        return;


    dutySedangEdit =

        id;


    setValue(

        "tarikh",

        duty.tarikh

    );


    document

        .getElementById(

            "tarikh"

        )

        .dispatchEvent(

            new Event(

                "change"

            )

        );


    setValue(

        "unitPilihan",

        duty.unit

    );


    document

        .getElementById(

            "unitPilihan"

        )

        .dispatchEvent(

            new Event(

                "change"

            )

        );


    setValue(

        "posAsal",

        duty.pos

    );


    document

        .getElementById(

            "posAsal"

        )

        .dispatchEvent(

            new Event(

                "change"

            )

        );


    setValue(

        "anggota",

        duty.no_skb

    );


    document

        .getElementById(

            "anggota"

        )

        .dispatchEvent(

            new Event(

                "change"

            )

        );


    setValue(

        "kodDuty",

        duty.kod_dutyy ||

        duty.kod_waktu_kerja

    );


    document

        .getElementById(

            "kodDuty"

        )

        .dispatchEvent(

            new Event(

                "change"

            )

        );


    setValue(

        "kodTempatKerja",

        duty.kod_tempat_kerja

    );


    document

        .getElementById(

            "kodTempatKerja"

        )

        .dispatchEvent(

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


    const offday =

        document.getElementById(

            "hariOffday"

        );


    const cutiam =

        document.getElementById(

            "hariCutiam"

        );


    if (offday)

        offday.checked =

            duty.hari_offday_bertugas ==

            1;


    if (cutiam)

        cutiam.checked =

            duty.hari_cutiam_bertugas ==

            1;


    window.scrollTo(

        {

            top: 0,

            behavior: "smooth"

        }

    );


    paparPopup(

        "Rekod Duty telah dimasukkan ke dalam borang untuk diedit.",

        "info",

        "Edit Duty"

    );

}


// =====================================================
// PADAM DUTY
// =====================================================

async function padamDuty(

    id

) {


    const yakin =

        await popupConfirm(

            "Adakah anda pasti mahu memadam rekod Duty ini?"

        );


    if (!yakin)

        return;


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
// CONFIRM POPUP
// =====================================================

function popupConfirm(

    mesej

) {


    return new Promise(

        function (resolve) {


            const popup =

                document.createElement(

                    "div"

                );


            popup.id =

                "popupConfirm";


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

                    >

                        Ya, Padam

                    </button>


                    <button

                        id="btnTidak"

                        style="

                            background:#64748b;

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


            document

                .getElementById(

                    "btnYa"

                )

                .onclick =

                function () {


                    popup.remove();


                    resolve(

                        true

                    );

                };


            document

                .getElementById(

                    "btnTidak"

                )

                .onclick =

                function () {


                    popup.remove();


                    resolve(

                        false

                    );

                };

        }

    );

}


// =====================================================
// GET VALUE
// =====================================================

function getValue(

    id

) {


    const element =

        document.getElementById(

            id

        );


    return element

        ? element.value

        : "";

}


// =====================================================
// KOSONGKAN
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


function kosongkanPos() {


    const select =

        document.getElementById(

            "posAsal"

        );


    if (!select)

        return;


    select.innerHTML = `

        <option value="">

            -- Pilih Pos Asal --

        </option>

    `;

}


function kosongkanAnggota() {


    const select =

        document.getElementById(

            "anggota"

        );


    if (!select)

        return;


    select.innerHTML = `

        <option value="">

            -- Pilih Nama Anggota --

        </option>

    `;

}


function kosongkanKodDuty() {


    const select =

        document.getElementById(

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

        "jamKlm",

        ""

    );

}


function kosongkanKodTempatKerja() {


    const select =

        document.getElementById(

            "kodTempatKerja"

        );


    if (select)


        select.innerHTML = `

            <option value="">

                -- Pilih Kod Tempat Kerja --

            </option>

        `;

}


// =====================================================
// NAMA BULAN
// =====================================================

function getNamaBulan(

    bulan

) {


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

}


// =====================================================
// FORMAT TARIKH
// =====================================================

function formatTarikh(

    tarikh

) {


    if (!tarikh)

        return "";


    const parts =

        tarikh.split(

            "-"

        );


    if (

        parts.length !==

        3

    )

        return tarikh;


    return (

        parts[2] +

        "/" +

        parts[1] +

        "/" +

        parts[0]

    );

}
