// =====================================================
// JADUAL-DUTY.JS
// FPB DUTY SYSTEM
// =====================================================


// =====================================================
// SENARAI 6 UNIT
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


    const tarikhInput =

        document.getElementById(

            "tarikh"

        );


    if (!tarikhInput)

        return;


    tarikhInput.addEventListener(

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


            // PAPAR KOD DUTY IKUT UNIT

            isiKodDutyIkutUnit(

                unit

            );


            // PAPAR KOD TEMPAT KERJA IKUT UNIT

            isiKodTempatKerjaIkutUnit(

                unit

            );


        }

    );

}


// =====================================================
// EVENT POS ASAL
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
// EVENT NAMA ANGGOTA
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
// FUNGSI SET VALUE
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

            .eq(

                "status",

                "Aktif"

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


        console.error(

            error

        );


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


        semuaKodDuty =

            data || [];


    }

    catch (error) {


        console.error(

            error

        );


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

                document.getElementById(

                    "unitPilihan"

                ).value;


            const kod =

                this.value;


            const data =

                semuaKodDuty.find(

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


    if (!unit)

        return;


    const list =

        semuaKodDuty

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


        semuaKodTempatKerja =

            data || [];


    }

    catch (error) {


        console.error(

            error

        );


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


    const unitSelect =

        document.getElementById(

            "unitPilihan"

        );


    if (!unitSelect)

        return;


    // Tidak perlu tambah event lain
    // kerana event Unit sudah menguruskan
    // Kod Duty dan Kod Tempat Kerja.

}


// =====================================================
// ISI KOD TEMPAT KERJA IKUT UNIT
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


    if (!unit)

        return;


    const list =

        semuaKodTempatKerja

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


            select.appendChild(

                option

            );

        }

    );

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


    filterPos.innerHTML = `

        <option value="">

            Semua Pos

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


            filterPos.appendChild(

                option

            );

        }

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


        const bulan =

            getValue(

                "bulan"

            );


        const tahun =

            getValue(

                "tahun"

            );


        const unitPilihan =

            getValue(

                "unitPilihan"

            );


        const posAsal =

            getValue(

                "posAsal"

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


        if (!tarikh) {


            paparPopup(

                "Sila pilih tarikh duty.",

                "warning",

                "Tarikh Diperlukan"

            );


            return;

        }


        if (!unitPilihan) {


            paparPopup(

                "Sila pilih unit.",

                "warning",

                "Unit Diperlukan"

            );


            return;

        }


        if (!posAsal) {


            paparPopup(

                "Sila pilih Pos Asal.",

                "warning",

                "Pos Asal Diperlukan"

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


            tahun:

                parseInt(

                    tahun

                ),


            no_skb:

                anggota.no_skb,


            nama_anggota:

                anggota.nama,


            no_anggota:

                anggota.no_anggota,


            kawasan:

                anggota.kawasan,


            unit:

                anggota.unit,


            ketua_unit:

                anggota.ketua_unit,


            ketua_pos:

                anggota.ketua_pos,


            nama_pos_asal:

                anggota.pos,


            hari:

                getValue(

                    "hari"

                ),


            kod_waktu_kerja:

                kodDuty,


            kod_tempat_kerja:

                kodTempatKerja,


            jam_klm:

                Number(

                    getValue(

                        "jamKlm"

                    ) || 0

                ),


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

                    ) || 0

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

                    ) || 0

                )

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

            "Duty Berjaya Disimpan"

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
// PAPAR DUTY MENGIKUT TARIKH
// =====================================================

async function paparDuty() {


    const tbody =

        document.getElementById(

            "senaraiDuty"

        );


    if (!tbody)

        return;


    const tarikh =

        getValue(

            "filterTarikh"

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


    if (!tarikh) {


        tbody.innerHTML = `

            <tr>

                <td colspan="18">

                    Sila pilih tarikh

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

            .eq(

                "tarikh",

                tarikh

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

                "nama_pos_asal",

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


    setValue(

        "hariOffday",

        ""

    );


    const hariOffday =

        document.getElementById(

            "hariOffday"

        );


    if (hariOffday)

        hariOffday.checked = false;


    setValue(

        "jamOffday",

        0

    );


    const hariCutiam =

        document.getElementById(

            "hariCutiam"

        );


    if (hariCutiam)

        hariCutiam.checked = false;


    setValue(

        "jamCutiam",

        0

    );

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


    const element =

        document.getElementById(

            id

        );


    return element

        ? element.value

        : "";

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
// POPUP TENGAH SCREEN
// =====================================================

function paparPopup(

    mesej,

    jenis = "success",

    tajuk = ""

) {


    let popup =

        document.getElementById(

            "popupMesej"

        );


    if (!popup) {


        popup =

            document.createElement(

                "div"

            );


        popup.id =

            "popupMesej";


        popup.innerHTML = `

            <div id="popupBox">

                <div id="popupIcon"></div>

                <h3 id="popupTajuk"></h3>

                <p id="popupText"></p>

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


            #popupMesej {

                position: fixed;

                inset: 0;

                background:

                    rgba(

                        15,

                        23,

                        42,

                        0.55

                    );

                display: flex;

                align-items: center;

                justify-content: center;

                z-index: 99999;

                backdrop-filter: blur(4px);

            }


            #popupBox {

                width: min(

                    420px,

                    calc(

                        100% - 30px

                    )

                );

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

                        0.25

                    );

                animation:

                    popupMasuk

                    0.25s

                    ease;

            }


            #popupIcon {

                font-size: 50px;

                margin-bottom: 10px;

            }


            #popupTajuk {

                margin: 8px 0;

                color: #0f172a;

            }


            #popupText {

                color: #475569;

                line-height: 1.6;

            }


            #popupBox button {

                width: 100%;

                margin-top: 15px;

                padding: 12px;

                border: none;

                border-radius: 8px;

                background: #2563eb;

                color: white;

                font-weight: bold;

                cursor: pointer;

            }


            @keyframes popupMasuk {

                from {

                    opacity: 0;

                    transform:

                        scale(

                            0.85

                        );

                }

                to {

                    opacity: 1;

                    transform:

                        scale(

                            1

                        );

                }

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


    const tajukElement =

        document.getElementById(

            "popupTajuk"

        );


    const text =

        document.getElementById(

            "popupText"

        );


    if (jenis === "success") {


        icon.textContent = "✅";


        tajukElement.textContent =

            tajuk ||

            "Berjaya";


    }

    else if (jenis === "error") {


        icon.textContent = "❌";


        tajukElement.textContent =

            tajuk ||

            "Ralat";


    }

    else {


        icon.textContent = "⚠️";


        tajukElement.textContent =

            tajuk ||

            "Perhatian";

    }


    text.textContent =

        mesej;


    popup.style.display =

        "flex";

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

        popup.style.display =

            "none";

}


// =====================================================
// EXPORT GLOBAL
// =====================================================

window.simpanDuty =

    simpanDuty;


window.paparDuty =

    paparDuty;


window.padamDuty =

    padamDuty;


window.paparPopup =

    paparPopup;


window.tutupPopup =

    tutupPopup;
