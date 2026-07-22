// =====================================================
// JADUAL DUTY.JS
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

let dutySedangEdit = null;

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
// POPUP TENGAH SKRIN
// =====================================================

function paparPopup(

    mesej,

    jenis = "success",

    tajuk = "Makluman"

) {


    const popupLama =

        document.getElementById(

            "popupMesej"

        );


    if (popupLama)

        popupLama.remove();


    let icon = "✅";


    if (jenis === "error")

        icon = "❌";


    if (jenis === "warning")

        icon = "⚠️";


    const popup =

        document.createElement(

            "div"

        );


    popup.id = "popupMesej";


    popup.innerHTML = `

        <div class="popup-overlay">

            <div class="popup-box ${jenis}">

                <div class="popup-icon">

                    ${icon}

                </div>

                <h3>

                    ${tajuk}

                </h3>

                <p>

                    ${mesej}

                </p>

                <button

                    onclick="tutupPopup()"

                >

                    OK

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(popup);


    setTimeout(

        function () {

            tutupPopup();

        },

        5000

    );

}


// =====================================================
// TUTUP POPUP
// =====================================================

function tutupPopup() {

    const popup =

        document.getElementById(

            "popupMesej"

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

    document

        .getElementById(

            "bulan"

        )

        .value = "";


    document

        .getElementById(

            "tahun"

        )

        .value = "";


    document

        .getElementById(

            "hari"

        )

        .value = "";

}


// =====================================================
// EVENT UNIT
// =====================================================

function pasangEventUnit() {

    const select =

        document.getElementById(

            "unitPilihan"

        );


    if (!select)

        return;


    select.addEventListener(

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


            const posSelect =

                document.getElementById(

                    "posAsal"

                );


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

    const select =

        document.getElementById(

            "posAsal"

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


            const pos =

                this.value;


            kosongkanAnggota();

            kosongkanMaklumatAnggota();


            if (!unit || !pos)

                return;


            const list =

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


            list.forEach(

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

            .select(

                `

                no_skb,

                no_anggota,

                nama,

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

            error.message,

            "error",

            "Gagal Ambil Kod Duty"

        );

    }

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

        window.semuaKodDuty

            .filter(

                item =>

                    item.unit === unit

            );


    list.forEach(

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


            const option =

                this.options[

                    this.selectedIndex

                ];


            if (

                !option ||

                !option.dataset.data

            )

                return;


            const data =

                JSON.parse(

                    option.dataset.data

                );


            setValue(

                "jamKlm",

                data.jam_klm || 0

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


    const list =

        window.semuaKodTempatKerja

            .filter(

                item =>

                    item.unit === unit

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
// EVENT KOD TEMPAT KERJA
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


            if (

                !option ||

                !option.dataset.data

            )

                return;


            const data =

                JSON.parse(

                    option.dataset.data

                );


            console.log(

                "Tempat kerja dipilih:",

                data.nama_tempat_kerja

            );

        }

    );

}


// =====================================================
// MUAT POS FILTER
// =====================================================

async function muatSenaraiPos() {

    const select =

        document.getElementById(

            "filterPos"

        );


    if (!select)

        return;


    const list =

        [

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


    list.forEach(

        function (pos) {


            const option =

                document.createElement(

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
// SIMPAN / EDIT DUTY
// =====================================================

async function simpanDuty() {

    try {


        const tarikh =

            getValue(

                "tarikh"

            );


        const anggota =

            semuaAnggota.find(

                function (a) {


                    return String(

                        a.no_skb

                    ) === String(

                        getValue(

                            "noSkb"

                        )

                    );

                }

            );


        const kodDuty =

            getValue(

                "kodDuty"

            );


        const kodTempatKerja =

            getValue(

                "kodTempatKerja"

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

            window.semuaKodDuty.find(

                function (item) {


                    return (

                        item.unit === anggota.unit &&

                        item.kod === kodDuty

                    );

                }

            );


        const dataTempatKerja =

            window.semuaKodTempatKerja.find(

                function (item) {


                    return (

                        item.unit === anggota.unit &&

                        item.kod_tempat_kerja ===

                        kodTempatKerja

                    );

                }

            );


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


            waktu_tugasan:

                dataKodDuty

                    ? dataKodDuty.waktu_tugasan

                    : null,


            jam_kerja:

                dataKodDuty

                    ? dataKodDuty.jam_kerja

                    : null,


            jam_klm:

                Number(

                    getValue(

                        "jamKlm"

                    ) || 0

                ),


            pos:

                anggota.pos,


            dikemaskini_oleh:

                "Ketua Pos",


            dikemaskini_pada:

                new Date()

                    .toISOString(),


            kod_dutyy:

                kodDuty,


            kod_tempat_kerja:

                kodTempatKerja,


            tempat_kerja:

                dataTempatKerja

                    ? dataTempatKerja.nama_tempat_kerja

                    : null,


            ketua_pos:

                anggota.ketua_pos,


            nama_anggota:

                anggota.nama,


            kawasan:

                anggota.kawasan,


            unit:

                anggota.unit,


            nama_ketua_pos:

                anggota.ketua_pos,


            nama_pos_asal:

                anggota.pos,


            hari:

                getValue(

                    "hari"

                ),


            kod_waktu_kerja:

                kodDuty,


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


            ketua_unit:

                anggota.ketua_unit

        };


        console.log(

            "DATA DIHANTAR KE SUPABASE:",

            dataDuty

        );


        let result;


        if (dutySedangEdit) {


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


        if (result.error) {


            console.error(

                result.error

            );


            paparPopup(

                result.error.message,

                "error",

                "Gagal Simpan"

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


        dutySedangEdit = null;


        const filterBulan =

            document.getElementById(

                "filterBulan"

            );


        if (filterBulan && !filterBulan.value)

            filterBulan.value =

                tarikh.substring(

                    0,

                    7

                );


        paparDuty();

        // BORANG KEKAL

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

                filterBulan + "-01"

            )

            .lt(

                "tarikh",

                bulanBerikutnya(

                    filterBulan

                )

            )

            .order(

                "tarikh",

                {

                    ascending: true

                }

            );


    if (pos)

        query =

            query.eq(

                "nama_pos_asal",

                pos

            );


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

                        item.nama_anggota ||

                        ""

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

                                    onclick="editDuty('${

                                        item.id

                                    }')"

                                >

                                    ✏️ Edit

                                </button>


                                <button

                                    onclick="padamDuty('${

                                        item.id

                                    }')"

                                    class="btn-danger"

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


    const item =

        semuaDuty.find(

            function (duty) {


                return String(

                    duty.id

                ) === String(

                    id

                );

            }

        );


    if (!item)

        return;


    dutySedangEdit = id;


    setValue(

        "tarikh",

        item.tarikh

    );


    setValue(

        "bulan",

        item.bulan

    );


    setValue(

        "tahun",

        item.tahun

    );


    setValue(

        "hari",

        item.hari

    );


    setValue(

        "unitPilihan",

        item.unit

    );


    isiKodDutyIkutUnit(

        item.unit

    );


    isiKodTempatKerjaIkutUnit(

        item.unit

    );


    const posSelect =

        document.getElementById(

            "posAsal"

        );


    posSelect.innerHTML = `

        <option value="">

            -- Pilih Pos Asal --

        </option>

    `;


    const posList =

        [

            ...new Set(

                semuaAnggota

                    .filter(

                        a =>

                            a.unit === item.unit

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


    setValue(

        "posAsal",

        item.nama_pos_asal

    );


    const anggotaSelect =

        document.getElementById(

            "anggota"

        );


    anggotaSelect.innerHTML = `

        <option value="">

            -- Pilih Nama Anggota --

        </option>

    `;


    const list =

        semuaAnggota

            .filter(

                a =>

                    a.unit === item.unit &&

                    a.pos === item.nama_pos_asal

            );


    list.forEach(

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


    setValue(

        "anggota",

        item.no_skb

    );


    isiMaklumatAnggota(

        item

    );


    setValue(

        "kodDuty",

        item.kod_dutyy ||

        item.kod_waktu_kerja

    );


    setValue(

        "kodTempatKerja",

        item.kod_tempat_kerja

    );


    setValue(

        "jamKlm",

        item.jam_klm

    );


    document

        .getElementById(

            "hariOffday"

        )

        .checked =

        item.hari_offday_bertugas == 1;


    setValue(

        "jamOffday",

        item.jam_offday_bertugas || 0

    );


    document

        .getElementById(

            "hariCutiam"

        )

        .checked =

        item.hari_cutiam_bertugas == 1;


    setValue(

        "jamCutiam",

        item.jam_cutiam_bertugas || 0

    );


    window.scrollTo(

        {

            top: 0,

            behavior: "smooth"

        }

    );


    paparPopup(

        "Rekod telah dimasukkan ke dalam borang untuk diedit.",

        "warning",

        "Mod Edit"

    );

}


// =====================================================
// PADAM DUTY
// =====================================================

async function padamDuty(

    id

) {


    const yakin =

        confirm(

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

        "Duty Berjaya Dipadam"

    );


    paparDuty();

}


// =====================================================
// HELPER VALUE
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

            value ?? "";

}


// =====================================================
// BULAN BERIKUTNYA
// =====================================================

function bulanBerikutnya(

    bulan

) {


    const [tahun, bulanNo] =

        bulan.split("-")

            .map(Number);


    const date =

        new Date(

            tahun,

            bulanNo,

            1

        );


    const tahunBaru =

        date.getFullYear();


    const bulanBaru =

        String(

            date.getMonth() + 1

        )

        .padStart(

            2,

            "0"

        );


    return (

        tahunBaru +

        "-" +

        bulanBaru +

        "-01"

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

        tarikh.split("-");


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
