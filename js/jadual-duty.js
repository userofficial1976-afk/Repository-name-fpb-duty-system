// =====================================================
// JADUAL DUTY.JS
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
// DATA SEMENTARA
// =====================================================

let semuaAnggota = [];

let semuaDuty = [];


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


    if (!unitSelect) return;


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


    if (!tarikh) return;


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

    const unitSelect =

        document.getElementById(

            "unitPilihan"

        );


    if (!unitSelect) return;


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


            if (!unit) return;


            const posList =

                [

                    ...new Set(

                        semuaAnggota

                            .filter(

                                a =>

                                    a.unit ===

                                    unit

                            )

                            .map(

                                a =>

                                    a.pos

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


            posSelect.innerHTML = `

                <option value="">

                    -- Pilih Pos Asal --

                </option>

            `;


            posList.forEach(

                function (pos) {


                    const option =

                        document

                            .createElement(

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

    const posSelect =

        document.getElementById(

            "posAsal"

        );


    if (!posSelect) return;


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


            if (!unit || !pos) return;


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


            anggotaSelect.innerHTML = `

                <option value="">

                    -- Pilih Nama Anggota --

                </option>

            `;


            anggotaList.forEach(

                function (anggota) {


                    const option =

                        document

                            .createElement(

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


    if (!anggotaSelect) return;


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


    document

        .getElementById(

            "noSkb"

        )

        .value =

        anggota.no_skb || "";


    document

        .getElementById(

            "noAnggota"

        )

        .value =

        anggota.no_anggota || "";


    document

        .getElementById(

            "kawasan"

        )

        .value =

        anggota.kawasan || "";


    document

        .getElementById(

            "unit"

        )

        .value =

        anggota.unit || "";


    document

        .getElementById(

            "ketuaUnit"

        )

        .value =

        anggota.ketua_unit || "";


    document

        .getElementById(

            "ketuaPos"

        )

        .value =

        anggota.ketua_pos || "";


    document

        .getElementById(

            "namaPosAsal"

        )

        .value =

        anggota.pos || "";

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


        window.semuaKodDuty =

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


    if (!kodSelect) return;


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

                    window.semuaKodDuty ||

                    []

                )

                .find(

                    function (item) {


                        return (

                            item.unit === unit &&

                            item.kod === kod

                        );

                    }

                );


            document

                .getElementById(

                    "jamKlm"

                )

                .value =

                data

                    ? data.jam_klm || 0

                    : 0;

        }

    );

}


// =====================================================
// MUAT KOD DUTY BERDASARKAN UNIT
// =====================================================

function isiKodDutyIkutUnit(

    unit

) {


    const select =

        document.getElementById(

            "kodDuty"

        );


    if (!select) return;


    select.innerHTML = `

        <option value="">

            -- Pilih Kod Waktu Kerja --

        </option>

    `;


    const list =

        (

            window.semuaKodDuty ||

            []

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

                document

                    .createElement(

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


    if (!unitSelect) return;


    unitSelect.addEventListener(

        "change",

        function () {


            isiKodDutyIkutUnit(

                this.value

            );


            isiKodTempatKerjaIkutUnit(

                this.value

            );

        }

    );

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


    if (!select) return;


    select.innerHTML = `

        <option value="">

            -- Pilih Kod Tempat Kerja --

        </option>

    `;


    const list =

        (

            window.semuaKodTempatKerja ||

            []

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

                document

                    .createElement(

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
// MUAT SENARAI POS UNTUK FILTER
// =====================================================

async function muatSenaraiPos() {


    const filterPos =

        document.getElementById(

            "filterPos"

        );


    if (!filterPos) return;


    const posList =

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


    posList.forEach(

        function (pos) {


            const option =

                document

                    .createElement(

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


        const anggotaSelect =

            document

                .getElementById(

                    "anggota"

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

            nama_anggota: anggota.nama,

            no_anggota: anggota.no_anggota,

            kawasan: anggota.kawasan,

            unit: anggota.unit,

            ketua_unit: anggota.ketua_unit,

            ketua_pos: anggota.ketua_pos,

            nama_pos_asal: anggota.pos,

            hari:

                document

                    .getElementById(

                        "hari"

                    )

                    .value,


            kod_waktu_kerja:

                kodDuty,


            kod_tempat_kerja:

                kodTempatKerja,


            jam_klm:

                Number(

                    document

                        .getElementById(

                            "jamKlm"

                        )

                        .value ||

                    0

                ),


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

                        .value ||

                    0

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

                        .value ||

                    0

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


        if (error) {


            console.error(

                error

            );


            paparPopup(

                error.message,

                "error",

                "Gagal Simpan"

            );


            return;

        }


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
// PAPAR DUTY
// =====================================================

async function paparDuty() {


    const tbody =

        document

            .getElementById(

                "senaraiDuty"

            );


    const tarikh =

        document

            .getElementById(

                "filterTarikh"

            )

            .value;


    const pos =

        document

            .getElementById(

                "filterPos"

            )

            .value;


    const nama =

        document

            .getElementById(

                "cariNama"

            )

            .value

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


    document

        .getElementById(

            "tarikh"

        )

        .value = "";


    kosongkanTarikh();


    document

        .getElementById(

            "unitPilihan"

        )

        .value = "";


    kosongkanPos();


    kosongkanAnggota();


    kosongkanMaklumatAnggota();


    kosongkanKodDuty();


    kosongkanKodTempatKerja();


    document

        .getElementById(

            "hariOffday"

        )

        .checked = false;


    document

        .getElementById(

            "jamOffday"

        )

        .value = 0;


    document

        .getElementById(

            "hariCutiam"

        )

        .checked = false;


    document

        .getElementById(

            "jamCutiam"

        )

        .value = 0;

}


// =====================================================
// KOSONGKAN POS
// =====================================================

function kosongkanPos() {


    const select =

        document.getElementById(

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


    const select =

        document.getElementById(

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


    if (select) {


        select.innerHTML = `

            <option value="">

                -- Pilih Kod Waktu Kerja --

            </option>

        `;

    }


    const jam =

        document.getElementById(

            "jamKlm"

        );


    if (jam)

        jam.value = "";

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
