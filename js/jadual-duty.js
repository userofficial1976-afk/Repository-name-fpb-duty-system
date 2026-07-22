// =====================================================
// JADUAL-DUTY.JS
// FPB DUTY SYSTEM
// VERSI TERKINI
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
// PEMBOLEHUBAH GLOBAL
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
// ISI SENARAI UNIT
// =====================================================

function isiSenaraiUnit() {

    const unitSelect =

        document.getElementById(

            "unitPilihan"

        );


    if (!unitSelect)

        return;


    unitSelect.innerHTML = `

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


            unitSelect.appendChild(

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


            document

                .getElementById(

                    "bulan"

                )

                .value =

                namaBulan[

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

                namaHari[

                    date.getDay()

                ];

        }

    );

}


// =====================================================
// KOSONGKAN TARIKH
// =====================================================

function kosongkanTarikh() {

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

        bulan.value = "";


    if (tahun)

        tahun.value = "";


    if (hari)

        hari.value = "";

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


            isiKodDutyIkutUnit(unit);

            isiKodTempatKerjaIkutUnit(unit);

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


            const pos =

                this.value;


            kosongkanAnggota();

            kosongkanMaklumatAnggota();


            if (!unit || !pos)

                return;


            const anggotaList =

                semuaAnggota

                    .filter(

                        function (a) {

                            return (

                                a.unit === unit &&

                                a.pos === pos

                            );

                        }

                    )

                    .sort(

                        function (a, b) {

                            return (

                                (a.nama || "")

                                    .localeCompare(

                                        b.nama || ""

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


            anggotaSelect.innerHTML = `

                <option value="">

                    -- Pilih Nama Anggota --

                </option>

            `;


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

    const anggotaSelect =

        document.getElementById(

            "anggota"

        );


    if (!anggotaSelect)

        return;


    anggotaSelect.addEventListener(

        "change",

        function () {


            const selected =

                this.options[

                    this.selectedIndex

                ];


            if (

                !selected ||

                !selected.dataset.data

            ) {


                kosongkanMaklumatAnggota();

                return;

            }


            const anggota =

                JSON.parse(

                    selected.dataset.data

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


// =====================================================
// MUAT DATA ANGGOTA
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

            .select(

                `

                no_skb,

                nama,

                no_anggota,

                kawasan,

                unit,

                pos,

                ketua_unit,

                ketua_pos,

                status

                `

            )

            .order(

                "nama",

                {

                    ascending: true

                }

            );


        if (error)

            throw error;


        semuaAnggota =

            data || [];


    }


    catch (error) {


        console.error(error);


        paparPopup(

            "Gagal mengambil data anggota: " +

            error.message,

            "error",

            "Gagal Ambil Data"

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

            .select(

                `

                unit,

                kod,

                waktu_tugasan,

                jam_kerja,

                jam_klm,

                status

                `

            )

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


        console.error(error);


        paparPopup(

            "Gagal mengambil Kod Waktu Kerja: " +

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

    const kodSelect =

        document.getElementById(

            "kodDuty"

        );


    if (!kodSelect)

        return;


    kodSelect.addEventListener(

        "change",

        function () {


            const unit =

                document

                    .getElementById(

                        "unitPilihan"

                    )

                    .value;


            const kod =

                this.value;


            const data =

                (

                    window.semuaKodDuty || []

                )

                .find(

                    function (item) {

                        return (

                            item.unit === unit &&

                            item.kod === kod

                        );

                    }

                );


            setValue(

                "jamKlm",

                data

                    ? data.jam_klm || 0

                    : 0

            );

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


    const list =

        (

            window.semuaKodDuty || []

        )

        .filter(

            function (item) {

                return (

                    item.unit === unit

                );

            }

        );


    list.forEach(

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


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// MUAT KOD TEMPAT KERJA
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

            .select(

                `

                kod_tempat_kerja,

                nama_tempat_kerja,

                unit,

                status

                `

            )

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


        console.error(error);


        paparPopup(

            "Gagal mengambil Kod Tempat Kerja: " +

            error.message,

            "error",

            "Gagal Ambil Tempat Kerja"

        );

    }

}


// =====================================================
// EVENT KOD TEMPAT KERJA
// =====================================================

function pasangEventKodTempatKerja() {

    // Dikendalikan melalui event UNIT

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


    const list =

        (

            window.semuaKodTempatKerja || []

        )

        .filter(

            function (item) {

                return (

                    item.unit === unit

                );

            }

        );


    list.forEach(

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
// EVENT OFFDAY
// =====================================================

function pasangEventOffday() {

    const checkbox =

        document.getElementById(

            "hariOffday"

        );


    const jam =

        document.getElementById(

            "jamOffday"

        );


    if (!checkbox || !jam)

        return;


    checkbox.addEventListener(

        "change",

        function () {


            jam.disabled =

                !this.checked;


            if (!this.checked)

                jam.value = 0;

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


    const jam =

        document.getElementById(

            "jamCutiam"

        );


    if (!checkbox || !jam)

        return;


    checkbox.addEventListener(

        "change",

        function () {


            jam.disabled =

                !this.checked;


            if (!this.checked)

                jam.value = 0;

        }

    );

}


// =====================================================
// SIMPAN DUTY
// =====================================================

async function simpanDuty() {

    try {


        const tarikh =

            getValue("tarikh");


        const bulan =

            getValue("bulan");


        const tahun =

            getValue("tahun");


        const hari =

            getValue("hari");


        const noSkb =

            getValue("noSkb");


        const kodDuty =

            getValue("kodDuty");


        const kodTempatKerja =

            getValue("kodTempatKerja");


        const anggota =

            semuaAnggota.find(

                function (a) {

                    return (

                        String(a.no_skb) ===

                        String(noSkb)

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


        const dataKodDuty =

            (

                window.semuaKodDuty || []

            )

            .find(

                function (item) {

                    return (

                        item.unit === anggota.unit &&

                        item.kod === kodDuty

                    );

                }

            );


        const dataTempatKerja =

            (

                window.semuaKodTempatKerja || []

            )

            .find(

                function (item) {

                    return (

                        item.unit === anggota.unit &&

                        item.kod_tempat_kerja ===

                        kodTempatKerja

                    );

                }

            );


        const optionTempatKerja =

            document

                .getElementById(

                    "kodTempatKerja"

                )

                .selectedOptions[0];


        const dataDuty = {


            // =========================
            // TARIKH
            // =========================

            tarikh: tarikh,

            bulan: bulan,

            tahun: parseInt(tahun),

            hari: hari,


            // =========================
            // ANGGOTA
            // =========================

            no_skb: anggota.no_skb,

            nama_anggota: anggota.nama,

            kawasan: anggota.kawasan,

            unit: anggota.unit,


            // =========================
            // KETUA
            // =========================

            ketua_unit: anggota.ketua_unit,

            ketua_pos: anggota.ketua_pos,

            nama_ketua_pos: anggota.ketua_pos,


            // =========================
            // POS
            // =========================

            pos: anggota.pos,

            nama_pos_asal: anggota.pos,


            // =========================
            // KOD DUTY
            // =========================

            kod_dutyy: kodDuty,

            kod_waktu_kerja: kodDuty,


            // =========================
            // WAKTU TUGASAN
            // =========================

            waktu_tugasan:

                dataKodDuty

                    ? dataKodDuty.waktu_tugasan

                    : null,


            jam_kerja:

                dataKodDuty

                    ? Number(

                        dataKodDuty.jam_kerja || 0

                    )

                    : 0,


            jam_klm:

                dataKodDuty

                    ? Number(

                        dataKodDuty.jam_klm || 0

                    )

                    : 0,


            // =========================
            // TEMPAT KERJA
            // =========================

            kod_tempat_kerja:

                kodTempatKerja,


            tempat_kerja:

                dataTempatKerja

                    ? dataTempatKerja.nama_tempat_kerja

                    : (

                        optionTempatKerja

                            ? optionTempatKerja.dataset.nama

                            : null

                    ),


            // =========================
            // OFFDAY
            // =========================

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

                    getValue(

                        "jamOffday"

                    ) || 0

                ),


            // =========================
            // CUTI AM
            // =========================

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

                    getValue(

                        "jamCutiam"

                    ) || 0

                ),


            // =========================
            // MAKLUMAT KEMASKINI
            // =========================

            dikemaskini_oleh:

                "Ketua Pos",


            dikemaskini_pada:

                new Date().toISOString()

        };


        const {

            data,

            error

        } = await supabaseClient

            .from(

                "jadual_duty"

            )

            .insert(

                [

                    dataDuty

                ]

            )

            .select();


        if (error)

            throw error;


        paparPopup(

            "Rekod Duty berjaya disimpan ke dalam sistem.",

            "success",

            "Duty Berjaya Disimpan"

        );


        kosongkanBorang();


        paparDuty();


    }


    catch (error) {


        console.error(error);


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


    const filterBulan =

        getValue(

            "filterBulan"

        );


    const pos =

        getValue(

            "filterPos"

        );


    const nama =

        getValue(

            "cariNama"

        )

        .toLowerCase();


    if (!filterBulan) {


        tbody.innerHTML = `

            <tr>

                <td colspan="18">

                    Sila pilih bulan

                </td>

            </tr>

        `;


        return;

    }


    const [tahun, bulan] =

        filterBulan.split("-");


    const tarikhMula =

        `${tahun}-${bulan}-01`;


    const tarikhAkhir =

        new Date(

            Number(tahun),

            Number(bulan),

            0

        );


    const tarikhAkhirString =

        tarikhAkhir

            .toISOString()

            .split("T")[0];


    let query =

        supabaseClient

            .from(

                "jadual_duty"

            )

            .select(

                "*"

            )

            .gte(

                "tarikh",

                tarikhMula

            )

            .lte(

                "tarikh",

                tarikhAkhirString

            )

            .order(

                "tarikh",

                {

                    ascending: true

                }

            )

            .order(

                "nama_anggota",

                {

                    ascending: true

                }

            );


    if (pos) {


        query =

            query.eq(

                "pos",

                pos

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


    let filtered =

        semuaDuty;


    if (nama) {


        filtered =

            filtered.filter(

                function (item) {


                    return (

                        item.nama_anggota || ""

                    )

                    .toLowerCase()

                    .includes(

                        nama

                    );

                }

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

                                ${item.nama_anggota || ""}

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

                                ${item.waktu_tugasan || ""}

                            </td>


                            <td>

                                ${item.jam_kerja || 0}

                            </td>


                            <td>

                                ${item.kod_dutyy || ""}

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


    const yakin =

        await paparPopupConfirm(

            "Adakah anda pasti mahu memadam rekod Duty ini?",

            "Padam Rekod Duty"

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

        "Duty Berjaya Dipadam"

    );


    paparDuty();

}


// =====================================================
// KOSONGKAN BORANG
// =====================================================

function kosongkanBorang() {


    setValue(

        "tarikh",

        ""

    );


    kosongkanTarikh();


    setValue(

        "unitPilihan",

        ""

    );


    kosongkanPos();


    kosongkanAnggota();


    kosongkanMaklumatAnggota();


    kosongkanKodDuty();


    kosongkanKodTempatKerja();


    const hariOffday =

        document.getElementById(

            "hariOffday"

        );


    const jamOffday =

        document.getElementById(

            "jamOffday"

        );


    const hariCutiam =

        document.getElementById(

            "hariCutiam"

        );


    const jamCutiam =

        document.getElementById(

            "jamCutiam"

        );


    if (hariOffday)

        hariOffday.checked = false;


    if (jamOffday) {

        jamOffday.value = 0;

        jamOffday.disabled = true;

    }


    if (hariCutiam)

        hariCutiam.checked = false;


    if (jamCutiam) {

        jamCutiam.value = 0;

        jamCutiam.disabled = true;

    }

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


    const ids = [

        "noSkb",

        "noAnggota",

        "kawasan",

        "unit",

        "ketuaUnit",

        "ketuaPos",

        "namaPosAsal"

    ];


    ids.forEach(

        function (id) {

            setValue(

                id,

                ""

            );

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


// =====================================================
// KOSONGKAN TEMPAT KERJA
// =====================================================

function kosongkanKodTempatKerja() {


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

}


// =====================================================
// MUAT SENARAI POS FILTER
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


    const posList =

        [

            ...new Set(

                semuaAnggota

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


// =====================================================
// HELPER GET VALUE
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
// HELPER SET VALUE
// =====================================================

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
// POPUP MESSAGE TENGAH SCREEN
// =====================================================

function paparPopup(

    mesej,

    jenis = "info",

    tajuk = "Makluman"

) {


    const warna = {


        success: "#16a34a",

        error: "#dc2626",

        warning: "#d97706",

        info: "#2563eb"

    };


    const ikon = {


        success: "✅",

        error: "❌",

        warning: "⚠️",

        info: "ℹ️"

    };


    const popup =

        document.createElement(

            "div"

        );


    popup.id =

        "popupMesej";


    popup.innerHTML = `

        <div

            style="

                position: fixed;

                inset: 0;

                background: rgba(15,23,42,0.45);

                display: flex;

                align-items: center;

                justify-content: center;

                z-index: 99999;

                padding: 20px;

            "

        >

            <div

                style="

                    width: min(430px, 100%);

                    background: white;

                    border-radius: 16px;

                    padding: 28px;

                    text-align: center;

                    box-shadow: 0 20px 60px rgba(0,0,0,0.25);

                    border-top: 6px solid ${

                        warna[jenis] ||

                        warna.info

                    };

                "

            >

                <div

                    style="

                        font-size: 45px;

                        margin-bottom: 12px;

                    "

                >

                    ${ikon[jenis] || ikon.info}

                </div>


                <h2

                    style="

                        margin: 0 0 10px;

                        color: #0f172a;

                    "

                >

                    ${tajuk}

                </h2>


                <p

                    style="

                        margin: 0 0 22px;

                        color: #475569;

                        line-height: 1.5;

                    "

                >

                    ${mesej}

                </p>


                <button

                    onclick="

                        document

                            .getElementById(

                                'popupMesej'

                            )

                            .remove()

                    "

                    style="

                        border: none;

                        background: ${

                            warna[jenis] ||

                            warna.info

                        };

                        color: white;

                        padding: 11px 30px;

                        border-radius: 8px;

                        font-weight: 700;

                        cursor: pointer;

                    "

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
// POPUP CONFIRM TENGAH SCREEN
// =====================================================

function paparPopupConfirm(

    mesej,

    tajuk = "Pengesahan"

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

                <div

                    style="

                        position: fixed;

                        inset: 0;

                        background: rgba(15,23,42,0.45);

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        z-index: 99999;

                        padding: 20px;

                    "

                >

                    <div

                        style="

                            width: min(430px, 100%);

                            background: white;

                            border-radius: 16px;

                            padding: 28px;

                            text-align: center;

                            box-shadow:

                                0 20px 60px

                                rgba(0,0,0,0.25);

                        "

                    >

                        <div

                            style="

                                font-size: 45px;

                                margin-bottom: 12px;

                            "

                        >

                            🗑️

                        </div>


                        <h2

                            style="

                                margin: 0 0 10px;

                            "

                        >

                            ${tajuk}

                        </h2>


                        <p

                            style="

                                color: #475569;

                                line-height: 1.5;

                            "

                        >

                            ${mesej}

                        </p>


                        <div

                            style="

                                display: flex;

                                gap: 10px;

                                justify-content: center;

                                margin-top: 20px;

                            "

                        >

                            <button

                                id="btnBatalPopup"

                                style="

                                    border: none;

                                    background: #64748b;

                                    color: white;

                                    padding: 11px 24px;

                                    border-radius: 8px;

                                    font-weight: 700;

                                    cursor: pointer;

                                "

                            >

                                Batal

                            </button>


                            <button

                                id="btnSahPopup"

                                style="

                                    border: none;

                                    background: #dc2626;

                                    color: white;

                                    padding: 11px 24px;

                                    border-radius: 8px;

                                    font-weight: 700;

                                    cursor: pointer;

                                "

                            >

                                Ya, Padam

                            </button>

                        </div>

                    </div>

                </div>

            `;


            document.body.appendChild(

                popup

            );


            document

                .getElementById(

                    "btnBatalPopup"

                )

                .onclick =

                function () {


                    popup.remove();


                    resolve(

                        false

                    );

                };


            document

                .getElementById(

                    "btnSahPopup"

                )

                .onclick =

                function () {


                    popup.remove();


                    resolve(

                        true

                    );

                };

        }

    );

}


// =====================================================
// TAMBAH CSS BUTTON PADAM
// =====================================================

(function tambahStyleButton() {


    const style =

        document.createElement(

            "style"

        );


    style.textContent = `

        .btn-danger {

            border: none;

            background: #dc2626;

            color: white;

            padding: 8px 12px;

            border-radius: 7px;

            font-weight: 700;

            cursor: pointer;

        }


        .btn-danger:hover {

            background: #b91c1c;

        }


        input:disabled {

            background: #e2e8f0;

            cursor: not-allowed;

        }

    `;


    document.head.appendChild(

        style

    );

})();
