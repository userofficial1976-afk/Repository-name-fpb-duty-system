// =====================================================
// JADUAL DUTY.JS
// FPB DUTY SYSTEM
// VERSI AKHIR
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

window.semuaKodDuty = [];

window.semuaKodTempatKerja = [];


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

        pasangEventOffday();

        pasangEventCutiAm();

        await muatAnggota();

        await muatKodDuty();

        await muatKodTempatKerja();

        await muatSenaraiPos();

    }

);


// =====================================================
// PAPAR POPUP TENGAH SCREEN
// =====================================================

function paparPopup(

    mesej,

    jenis = "info",

    tajuk = "Makluman"

) {


    const popupLama =

        document.getElementById(

            "popupMessage"

        );


    if (popupLama)

        popupLama.remove();


    let ikon = "ℹ️";

    let warna = "#2563eb";


    if (jenis === "success") {

        ikon = "✅";

        warna = "#16a34a";

    }


    if (jenis === "error") {

        ikon = "❌";

        warna = "#dc2626";

    }


    if (jenis === "warning") {

        ikon = "⚠️";

        warna = "#ea580c";

    }


    const popup =

        document.createElement(

            "div"

        );


    popup.id = "popupMessage";


    popup.innerHTML = `

        <div class="popup-overlay">

            <div class="popup-box">

                <div class="popup-icon"

                     style="color:${warna}">

                    ${ikon}

                </div>

                <h3>${tajuk}</h3>

                <p>${mesej}</p>

                <button

                    onclick="tutupPopup()"

                    style="background:${warna}"

                >

                    OK

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(

        popup

    );

}


// =====================================================
// TUTUP POPUP
// =====================================================

function tutupPopup() {


    const popup =

        document.getElementById(

            "popupMessage"

        );


    if (popup)

        popup.remove();

}


// =====================================================
// CSS POPUP
// =====================================================

(function tambahCSSPopup() {


    const style =

        document.createElement(

            "style"

        );


    style.innerHTML = `

        .popup-overlay {

            position: fixed;

            inset: 0;

            background: rgba(15,23,42,0.55);

            display: flex;

            align-items: center;

            justify-content: center;

            z-index: 99999;

            padding: 20px;

        }


        .popup-box {

            width: min(430px, 100%);

            background: white;

            border-radius: 16px;

            padding: 28px;

            text-align: center;

            box-shadow: 0 20px 60px rgba(0,0,0,0.25);

            animation: popupMasuk .2s ease-out;

        }


        .popup-icon {

            font-size: 48px;

            margin-bottom: 10px;

        }


        .popup-box h3 {

            margin: 0 0 10px;

            color: #0f172a;

        }


        .popup-box p {

            margin: 0 0 22px;

            color: #475569;

            line-height: 1.5;

        }


        .popup-box button {

            border: none;

            color: white;

            padding: 11px 30px;

            border-radius: 8px;

            font-weight: bold;

            cursor: pointer;

            font-size: 14px;

        }


        @keyframes popupMasuk {

            from {

                opacity: 0;

                transform: scale(.85);

            }

            to {

                opacity: 1;

                transform: scale(1);

            }

        }

    `;


    document.head.appendChild(

        style

    );

})();


// =====================================================
// ISI SENARAI UNIT
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


            const bulan = [

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


            const hari = [

                "Ahad",

                "Isnin",

                "Selasa",

                "Rabu",

                "Khamis",

                "Jumaat",

                "Sabtu"

            ];


            document

                .getElementById(

                    "bulan"

                )

                .value =

                bulan[

                    date.getMonth()

                ];


            document

                .getElementById(

                    "tahun"

                )

                .value =

                date.getFullYear();


            document

                .getElementById(

                    "hari"

                )

                .value =

                hari[

                    date.getDay()

                ];

        }

    );

}


// =====================================================
// KOSONGKAN TARIKH
// =====================================================

function kosongkanTarikh() {


    [

        "bulan",

        "tahun",

        "hari"

    ]

    .forEach(

        function (id) {


            const element =

                document.getElementById(

                    id

                );


            if (element)

                element.value = "";

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


            const unit = this.value;


            kosongkanPos();

            kosongkanAnggota();

            kosongkanMaklumatAnggota();

            kosongkanKodDuty();

            kosongkanKodTempatKerja();


            if (!unit)

                return;


            isiPosIkutUnit(

                unit

            );


            isiKodDutyIkutUnit(

                unit

            );


            isiKodTempatKerjaIkutUnit(

                unit

            );

        }

    );

}


// =====================================================
// ISI POS IKUT UNIT
// =====================================================

function isiPosIkutUnit(

    unit

) {


    const posSelect =

        document.getElementById(

            "posAsal"

        );


    if (!posSelect)

        return;


    const posList = [

        ...new Set(

            semuaAnggota

                .filter(

                    a =>

                        a.unit === unit

                )

                .map(

                    a => a.pos

                )

                .filter(

                    Boolean

                )

        )

    ]

    .sort();


    posSelect.innerHTML = `

        <option value="">

            -- Pilih Pos Asal --

        </option>

    `;


    posList.forEach(

        function (pos) {


            const option =

                document.createElement(

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

                document

                    .getElementById(

                        "unitPilihan"

                    )

                    .value;


            const pos = this.value;


            kosongkanAnggota();

            kosongkanMaklumatAnggota();


            if (!unit || !pos)

                return;


            const anggotaList =

                semuaAnggota

                    .filter(

                        a =>

                            a.unit === unit &&

                            a.pos === pos

                    )

                    .sort(

                        (

                            a,

                            b

                        ) =>

                            (

                                a.nama || ""

                            )

                            .localeCompare(

                                b.nama || ""

                            )

                    );


            const anggotaSelect =

                document.getElementById(

                    "anggota"

                );


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


            isiMaklumatAnggota(

                JSON.parse(

                    option.dataset.data

                )

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


    const map = {


        noSkb: anggota.no_skb,

        noAnggota: anggota.no_anggota,

        kawasan: anggota.kawasan,

        unit: anggota.unit,

        ketuaUnit: anggota.ketua_unit,

        ketuaPos: anggota.ketua_pos,

        namaPosAsal: anggota.pos

    };


    Object.keys(

        map

    )

    .forEach(

        function (id) {


            const element =

                document.getElementById(

                    id

                );


            if (element)

                element.value =

                    map[id] || "";

        }

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

                status

            `)

            .order(

                "nama",

                {

                    ascending: true

                }

            );


        if (error)

            throw error;


        semuaAnggota = data || [];


    }

    catch (error) {


        paparPopup(

            error.message,

            "error",

            "Gagal Ambil Data Anggota"

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


        if (error)

            throw error;


        window.semuaKodDuty =

            data || [];


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

                document

                    .getElementById(

                        "unitPilihan"

                    )

                    .value;


            const kod = this.value;


            const data =

                window.semuaKodDuty.find(

                    item =>

                        item.unit === unit &&

                        item.kod === kod

                );


            const jamKlm =

                document.getElementById(

                    "jamKlm"

                );


            if (jamKlm)

                jamKlm.value =

                    data

                        ? data.jam_klm || 0

                        : 0;

        }

    );

}


// =====================================================
// ISI KOD DUTY IKUT UNIT
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


    window.semuaKodDuty

        .filter(

            item =>

                item.unit === unit

        )

        .forEach(

            function (item) {


                const option =

                    document.createElement(

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


        if (error)

            throw error;


        window.semuaKodTempatKerja =

            data || [];


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


    window.semuaKodTempatKerja

        .filter(

            item =>

                item.unit === unit

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


            // Nama tempat kerja dibaca terus
            // semasa simpan Duty

        }

    );

}


// =====================================================
// EVENT OFFDAY
// =====================================================

function pasangEventOffday() {


    const checkbox =

        document.getElementById(

            "hariOffday"

        );


    const input =

        document.getElementById(

            "jamOffday"

        );


    if (!checkbox || !input)

        return;


    checkbox.addEventListener(

        "change",

        function () {


            if (!this.checked)

                input.value = 0;

        }

    );

}


// =====================================================
// EVENT CUTI AM
// =====================================================

function pasangEventCutiAm() {


    const checkbox =

        document.getElementById(

            "hariCutiam"

        );


    const input =

        document.getElementById(

            "jamCutiam"

        );


    if (!checkbox || !input)

        return;


    checkbox.addEventListener(

        "change",

        function () {


            if (!this.checked)

                input.value = 0;

        }

    );

}


// =====================================================
// SIMPAN DUTY
// =====================================================

async function simpanDuty() {


    try {


        const tarikh =

            document

                .getElementById(

                    "tarikh"

                )

                .value;


        const bulan =

            document

                .getElementById(

                    "bulan"

                )

                .value;


        const tahun =

            document

                .getElementById(

                    "tahun"

                )

                .value;


        const noSkb =

            document

                .getElementById(

                    "noSkb"

                )

                .value;


        const kodDuty =

            document

                .getElementById(

                    "kodDuty"

                )

                .value;


        const kodTempatKerja =

            document

                .getElementById(

                    "kodTempatKerja"

                )

                .value;


        const anggota =

            semuaAnggota.find(

                a =>

                    String(

                        a.no_skb

                    ) ===

                    String(

                        noSkb

                    )

            );


        const dataKodDuty =

            window.semuaKodDuty.find(

                item =>

                    item.unit ===

                    anggota.unit &&

                    item.kod ===

                    kodDuty

            );


        const optionTempatKerja =

            document

                .getElementById(

                    "kodTempatKerja"

                )

                .selectedOptions[0];


        const namaTempatKerja =

            optionTempatKerja

                ? optionTempatKerja.dataset.nama

                : "";


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


        if (!kodDuty) {


            paparPopup(

                "Sila pilih Kod Waktu Kerja.",

                "warning",

                "Kod Duty Diperlukan"

            );


            return;

        }


        if (!kodTempatKerja) {


            paparPopup(

                "Sila pilih Kod Tempat Kerja.",

                "warning",

                "Tempat Kerja Diperlukan"

            );


            return;

        }


        const dataDuty = {


            tarikh: tarikh,

            bulan: bulan,

            tahun: parseInt(

                tahun

            ),


            no_skb: anggota.no_skb,

            no_anggota: anggota.no_anggota,

            nama_anggota: anggota.nama,

            kawasan: anggota.kawasan,

            unit: anggota.unit,


            waktu_tugasan:

                dataKodDuty

                    ? dataKodDuty.waktu_tugasan

                    : null,


            jam_kerja:

                dataKodDuty

                    ? dataKodDuty.jam_kerja

                    : 0,


            jam_klm:

                dataKodDuty

                    ? dataKodDuty.jam_klm

                    : 0,


            pos: anggota.pos,

            nama_pos_asal: anggota.pos,


            ketua_pos: anggota.ketua_pos,

            nama_ketua_pos: anggota.ketua_pos,

            ketua_unit: anggota.ketua_unit,


            kod_dutyy: kodDuty,

            kod_waktu_kerja: kodDuty,


            kod_tempat_kerja:

                kodTempatKerja,

            tempat_kerja:

                namaTempatKerja,


            hari:

                document

                    .getElementById(

                        "hari"

                    )

                    .value,


            hari_offday_bertugas:

                document

                    .getElementById(

                        "hariOffday"

                    )

                    .checked

                    ? 1

                    : 0,


            jam_offday_bertugas:

                Number(

                    document

                        .getElementById(

                            "jamOffday"

                        )

                        .value || 0

                ),


            hari_cutiam_bertugas:

                document

                    .getElementById(

                        "hariCutiam"

                    )

                    .checked

                    ? 1

                    : 0,


            jam_cutiam_bertugas:

                Number(

                    document

                        .getElementById(

                            "jamCutiam"

                        )

                        .value || 0

                ),


            dikemaskini_oleh:

                "Admin",


            dikemaskini_pada:

                new Date()

                    .toISOString()

        };


        const {

            error

        } = await supabaseClient

            .from(

                "jadual_duty"

            )

            .insert(

                [

                    dataDuty

                ]

            );


        if (error)

            throw error;


        paparPopup(

            "Rekod Duty berjaya disimpan ke dalam sistem.",

            "success",

            "Berjaya Disimpan"

        );


        kosongkanBorang();


        paparDuty();


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


    const filterBulan =

        document.getElementById(

            "filterBulan"

        );


    const filterPos =

        document.getElementById(

            "filterPos"

        );


    const cariNama =

        document.getElementById(

            "cariNama"

        );


    if (!tbody)

        return;


    const bulanDipilih =

        filterBulan

            ? filterBulan.value

            : "";


    const posDipilih =

        filterPos

            ? filterPos.value

            : "";


    const namaDicari =

        cariNama

            ? cariNama.value.toLowerCase()

            : "";


    if (!bulanDipilih) {


        tbody.innerHTML = `

            <tr>

                <td colspan="18">

                    Sila pilih bulan

                </td>

            </tr>

        `;


        return;

    }


    const [

        tahun,

        bulan

    ] =

        bulanDipilih.split(

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

                parseInt(

                    tahun

                )

            )

            .eq(

                "bulan",

                namaBulan(

                    parseInt(

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


    if (posDipilih) {


        query =

            query.eq(

                "nama_pos_asal",

                posDipilih

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


    let filtered = semuaDuty;


    if (namaDicari) {


        filtered =

            filtered.filter(

                item =>

                    (

                        item.nama_anggota || ""

                    )

                    .toLowerCase()

                    .includes(

                        namaDicari

                    )

            );

    }


    if (!filtered.length) {


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

        filtered

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

                                <span class="badge">

                                    ${item.unit || ""}

                                </span>

                            </td>

                            <td>

                                ${item.ketua_unit || ""}

                            </td>

                            <td>

                                ${item.ketua_pos || ""}

                            </td>

                            <td>

                                ${item.nama_pos_asal || ""}

                            </td>

                            <td>

                                ${item.kod_waktu_kerja || ""}

                            </td>

                            <td>

                                ${item.kod_tempat_kerja || ""}

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
// PADAM DUTY
// =====================================================

async function padamDuty(

    id

) {


    paparPopup(

        "Adakah anda pasti mahu memadam rekod Duty ini?",

        "warning",

        "Sahkan Padam"

    );


    const popup =

        document.getElementById(

            "popupMessage"

        );


    if (!popup)

        return;


    const button =

        popup.querySelector(

            "button"

        );


    button.textContent =

        "PADAM";


    button.onclick =

        async function () {


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

                "Berjaya Dipadam"

            );


            paparDuty();

        };

}


// =====================================================
// KOSONGKAN BORANG
// =====================================================

function kosongkanBorang() {


    const ids = [

        "tarikh",

        "bulan",

        "tahun",

        "hari",

        "unit",

        "noSkb",

        "noAnggota",

        "kawasan",

        "ketuaUnit",

        "ketuaPos",

        "namaPosAsal",

        "jamKlm"

    ];


    ids.forEach(

        function (id) {


            const element =

                document.getElementById(

                    id

                );


            if (element)

                element.value = "";

        }

    );


    const unit =

        document.getElementById(

            "unitPilihan"

        );


    if (unit)

        unit.value = "";


    kosongkanPos();

    kosongkanAnggota();

    kosongkanMaklumatAnggota();

    kosongkanKodDuty();

    kosongkanKodTempatKerja();


    const offday =

        document.getElementById(

            "hariOffday"

        );


    const jamOffday =

        document.getElementById(

            "jamOffday"

        );


    const cutiam =

        document.getElementById(

            "hariCutiam"

        );


    const jamCutiam =

        document.getElementById(

            "jamCutiam"

        );


    if (offday)

        offday.checked = false;


    if (jamOffday)

        jamOffday.value = 0;


    if (cutiam)

        cutiam.checked = false;


    if (jamCutiam)

        jamCutiam.value = 0;

}


// =====================================================
// KOSONGKAN POS
// =====================================================

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


// =====================================================
// KOSONGKAN ANGGOTA
// =====================================================

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


            const element =

                document.getElementById(

                    id

                );


            if (element)

                element.value = "";

        }

    );

}


// =====================================================
// KOSONGKAN KOD DUTY
// =====================================================

function kosongkanKodDuty() {


    const select =

        document.getElementById(

            "kodDuty"

        );


    if (select)


        select.innerHTML = `

            <option value="">

                -- Pilih Kod Waktu Kerja --

            </option>

        `;


    const jamKlm =

        document.getElementById(

            "jamKlm"

        );


    if (jamKlm)

        jamKlm.value = "";

}


// =====================================================
// KOSONGKAN TEMPAT KERJA
// =====================================================

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
// SENARAI POS FILTER
// =====================================================

async function muatSenaraiPos() {


    const filterPos =

        document.getElementById(

            "filterPos"

        );


    if (!filterPos)

        return;


    filterPos.innerHTML = `

        <option value="">

            Semua Pos

        </option>

    `;


    const posList = [

        ...new Set(

            semuaAnggota

                .map(

                    a => a.pos

                )

                .filter(

                    Boolean

                )

        )

    ]

    .sort();


    posList.forEach(

        function (pos) {


            const option =

                document.createElement(

                    "option"

                );


            option.value = pos;

            option.textContent = pos;


            filterPos.appendChild(

                option

            );

        }

    );

}


// =====================================================
// NAMA BULAN
// =====================================================

function namaBulan(

    bulan

) {


    const senarai = [

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


    return senarai[

        bulan - 1

    ];

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

        parts.length !== 3

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
