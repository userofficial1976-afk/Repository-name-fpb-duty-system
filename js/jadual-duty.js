// =====================================================
// JADUAL-DUTY.JS
// FPB DUTY SYSTEM
// =====================================================

// =====================================================
// PEMBOLEHUBAH GLOBAL
// =====================================================

let semuaAnggota = [];
let semuaKodDuty = [];
let semuaKodTempatKerja = [];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("Jadual Duty JS berjaya dimuat.");

    // Tetapkan tarikh hari ini
    const tarikh = document.getElementById("tarikh");

    if (tarikh) {

        tarikh.valueAsDate = new Date();

        kemaskiniTarikh();

    }


    // Tarikh filter hari ini
    const filterTarikh =
        document.getElementById("filterTarikh");

    if (filterTarikh) {

        filterTarikh.valueAsDate = new Date();

    }


    // Muat semua data
    await muatAnggota();

    await muatKodDuty();

    await muatKodTempatKerja();


    // Papar senarai duty
    paparDuty();

});


// =====================================================
// TARIKH → BULAN / TAHUN / HARI
// =====================================================

const inputTarikh =
    document.getElementById("tarikh");


if (inputTarikh) {

    inputTarikh.addEventListener(
        "change",
        kemaskiniTarikh
    );

}


function kemaskiniTarikh() {

    const nilai =
        document.getElementById("tarikh").value;


    if (!nilai) {

        return;

    }


    const tarikh =
        new Date(
            nilai + "T00:00:00"
        );


    const bulan =
        tarikh.getMonth() + 1;


    const tahun =
        tarikh.getFullYear();


    const namaHari = [

        "Ahad",
        "Isnin",
        "Selasa",
        "Rabu",
        "Khamis",
        "Jumaat",
        "Sabtu"

    ];


    const hari =
        namaHari[
            tarikh.getDay()
        ];


    document.getElementById(
        "bulan"
    ).value = bulan;


    document.getElementById(
        "tahun"
    ).value = tahun;


    document.getElementById(
        "hari"
    ).value = hari;

}


// =====================================================
// MUAT DATA ANGGOTA
// =====================================================

async function muatAnggota() {


    const { data, error } =

        await supabaseClient

            .from("Data_Anggota")

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


    if (error) {

        console.error(
            "Gagal ambil Data_Anggota:",
            error
        );


        paparMesej(

            "Gagal ambil Data_Anggota: "
            + error.message,

            "error"

        );


        return;

    }


    semuaAnggota =
        data || [];


    console.log(
        "Jumlah anggota:",
        semuaAnggota.length
    );


    muatSenaraiUnit();

}


// =====================================================
// UNIT
// =====================================================

function muatSenaraiUnit() {


    const selectUnit =
        document.getElementById(
            "unitPilihan"
        );


    if (!selectUnit) {

        console.error(
            "ID unitPilihan tidak dijumpai."
        );

        return;

    }


    const senaraiUnit = [

        ...new Set(

            semuaAnggota

                .map(
                    anggota =>
                    anggota.unit
                )

                .filter(
                    unit =>
                    unit
                )

        )

    ];


    senaraiUnit.sort();


    selectUnit.innerHTML = `

        <option value="">

            -- Pilih Unit --

        </option>

    `;


    senaraiUnit.forEach(

        function (unit) {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                unit;


            option.textContent =
                unit;


            selectUnit.appendChild(
                option
            );

        }

    );


    selectUnit.addEventListener(

        "change",

        function () {

            pilihUnit(
                this.value
            );

        }

    );

}


// =====================================================
// PILIH UNIT
// =====================================================

function pilihUnit(unit) {


    const selectPos =
        document.getElementById(
            "posAsal"
        );


    const selectAnggota =
        document.getElementById(
            "anggota"
        );


    kosongkanSelect(

        selectPos,

        "-- Pilih Pos Asal --"

    );


    kosongkanSelect(

        selectAnggota,

        "-- Pilih Nama Anggota --"

    );


    kosongkanMaklumatAnggota();


    // Kosongkan kod waktu kerja
    kosongkanSelect(

        document.getElementById(
            "kodDuty"
        ),

        "-- Pilih Kod Waktu Kerja --"

    );


    // Kosongkan kod tempat kerja
    kosongkanSelect(

        document.getElementById(
            "kodTempatKerja"
        ),

        "-- Pilih Kod Tempat Kerja --"

    );


    if (!unit) {

        return;

    }


    // Ambil pos untuk unit yang dipilih
    const senaraiPos = [

        ...new Set(

            semuaAnggota

                .filter(

                    anggota =>

                        String(
                            anggota.unit
                        )

                        ===

                        String(
                            unit
                        )

                )

                .map(

                    anggota =>

                        anggota.pos

                )

                .filter(
                    pos =>
                    pos
                )

        )

    ];


    senaraiPos.sort();


    senaraiPos.forEach(

        function (pos) {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                pos;


            option.textContent =
                pos;


            selectPos.appendChild(
                option
            );

        }

    );


    // Kod waktu ikut unit
    muatKodDutyIkutUnit(
        unit
    );


    // Kod tempat kerja ikut unit
    muatKodTempatKerjaIkutUnit(
        unit
    );

}


// =====================================================
// PILIH POS ASAL
// =====================================================

const selectPosAsal =
    document.getElementById(
        "posAsal"
    );


if (selectPosAsal) {


    selectPosAsal.addEventListener(

        "change",

        function () {


            const unit =
                document.getElementById(
                    "unitPilihan"
                ).value;


            const pos =
                this.value;


            muatAnggotaIkutUnitDanPos(

                unit,

                pos

            );

        }

    );

}


// =====================================================
// MUAT ANGGOTA IKUT UNIT + POS
// =====================================================

function muatAnggotaIkutUnitDanPos(

    unit,

    pos

) {


    const selectAnggota =
        document.getElementById(
            "anggota"
        );


    kosongkanSelect(

        selectAnggota,

        "-- Pilih Nama Anggota --"

    );


    kosongkanMaklumatAnggota();


    if (!unit || !pos) {

        return;

    }


    const senaraiAnggota =

        semuaAnggota

            .filter(

                function (anggota) {


                    return (

                        String(
                            anggota.unit
                        )

                        ===

                        String(
                            unit
                        )

                        &&

                        String(
                            anggota.pos
                        )

                        ===

                        String(
                            pos
                        )

                    );

                }

            )

            .sort(

                function (a, b) {


                    return String(

                        a.nama

                    ).localeCompare(

                        String(

                            b.nama

                        )

                    );

                }

            );


    senaraiAnggota.forEach(

        function (anggota) {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                anggota.no_skb;


            option.textContent =

                (

                    anggota.no_anggota
                    || ""

                )

                +

                " | "

                +

                (

                    anggota.nama
                    || ""

                );


            selectAnggota.appendChild(
                option
            );

        }

    );

}


// =====================================================
// PILIH NAMA ANGGOTA
// =====================================================

const selectAnggota =
    document.getElementById(
        "anggota"
    );


if (selectAnggota) {


    selectAnggota.addEventListener(

        "change",

        function () {


            const noSkb =
                this.value;


            const anggota =

                semuaAnggota.find(

                    function (item) {


                        return String(

                            item.no_skb

                        )

                        ===

                        String(

                            noSkb

                        );

                    }

                );


            if (!anggota) {

                kosongkanMaklumatAnggota();

                return;

            }


            // NO SKB
            document.getElementById(
                "noSkb"
            ).value =

                anggota.no_skb
                || "";


            // NO ANGGOTA
            document.getElementById(
                "noAnggota"
            ).value =

                anggota.no_anggota
                || "";


            // KAWASAN
            document.getElementById(
                "kawasan"
            ).value =

                anggota.kawasan
                || "";


            // UNIT
            document.getElementById(
                "unit"
            ).value =

                anggota.unit
                || "";


            // KETUA UNIT
            document.getElementById(
                "ketuaUnit"
            ).value =

                anggota.ketua_unit
                || "";


            // KETUA POS
            document.getElementById(
                "ketuaPos"
            ).value =

                anggota.ketua_pos
                || "";


            // POS ASAL
            document.getElementById(
                "namaPosAsal"
            ).value =

                anggota.pos
                || "";

        }

    );

}


// =====================================================
// KOSONGKAN MAKLUMAT ANGGOTA
// =====================================================

function kosongkanMaklumatAnggota() {


    const senaraiID = [

        "noSkb",

        "noAnggota",

        "kawasan",

        "unit",

        "ketuaUnit",

        "ketuaPos",

        "namaPosAsal"

    ];


    senaraiID.forEach(

        function (id) {


            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.value =
                    "";

            }

        }

    );

}


// =====================================================
// MUAT KOD WAKTU KERJA
// =====================================================

async function muatKodDuty() {


    const { data, error } =

        await supabaseClient

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

            );


    if (error) {


        console.error(

            "Gagal ambil kod_duty:",

            error

        );


        paparMesej(

            "Gagal ambil kod_duty: "

            + error.message,

            "error"

        );


        return;

    }


    semuaKodDuty =
        data || [];

}


// =====================================================
// KOD WAKTU KERJA IKUT UNIT
// =====================================================

function muatKodDutyIkutUnit(unit) {


    const selectKod =
        document.getElementById(
            "kodDuty"
        );


    kosongkanSelect(

        selectKod,

        "-- Pilih Kod Waktu Kerja --"

    );


    const senarai =

        semuaKodDuty

            .filter(

                duty =>

                    String(
                        duty.unit
                    )

                    ===

                    String(
                        unit
                    )

            );


    senarai.forEach(

        function (duty) {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                duty.kod;


            option.textContent =

                duty.kod

                +

                " | "

                +

                duty.waktu_tugasan

                +

                " | "

                +

                duty.jam_kerja

                +

                " jam";


            selectKod.appendChild(
                option
            );

        }

    );

}


// =====================================================
// PILIH KOD WAKTU KERJA
// =====================================================

const selectKodDuty =
    document.getElementById(
        "kodDuty"
    );


if (selectKodDuty) {


    selectKodDuty.addEventListener(

        "change",

        function () {


            const unit =

                document.getElementById(
                    "unitPilihan"
                ).value;


            const kod =
                this.value;


            const duty =

                semuaKodDuty.find(

                    function (item) {


                        return (

                            String(
                                item.unit
                            )

                            ===

                            String(
                                unit
                            )

                            &&

                            String(
                                item.kod
                            )

                            ===

                            String(
                                kod
                            )

                        );

                    }

                );


            if (!duty) {

                document.getElementById(
                    "jamKlm"
                ).value = 0;

                return;

            }


            document.getElementById(
                "jamKlm"
            ).value =

                duty.jam_klm
                || 0;

        }

    );

}


// =====================================================
// MUAT KOD TEMPAT KERJA
// =====================================================

async function muatKodTempatKerja() {


    const { data, error } =

        await supabaseClient

            .from(
                "kod_tempat_kerja"
            )

            .select(`

                unit,

                kod_tempat_kerja,

                nama_tempat_kerja,

                status

            `)

            .eq(

                "status",

                "Aktif"

            );


    if (error) {


        console.error(

            "Gagal ambil kod_tempat_kerja:",

            error

        );


        paparMesej(

            "Gagal ambil kod tempat kerja: "

            + error.message,

            "error"

        );


        return;

    }


    semuaKodTempatKerja =
        data || [];

}


// =====================================================
// KOD TEMPAT KERJA IKUT UNIT
// =====================================================

function muatKodTempatKerjaIkutUnit(unit) {


    const selectTempat =
        document.getElementById(
            "kodTempatKerja"
        );


    kosongkanSelect(

        selectTempat,

        "-- Pilih Kod Tempat Kerja --"

    );


    const senarai =

        semuaKodTempatKerja

            .filter(

                tempat =>

                    String(
                        tempat.unit
                    )

                    ===

                    String(
                        unit
                    )

            );


    senarai.forEach(

        function (tempat) {


            const option =
                document.createElement(
                    "option"
                );


            option.value =

                tempat.kod_tempat_kerja;


            option.textContent =

                tempat.kod_tempat_kerja

                +

                " | "

                +

                tempat.nama_tempat_kerja;


            selectTempat.appendChild(
                option
            );

        }

    );

}


// =====================================================
// SIMPAN DUTY
// =====================================================

async function simpanDuty() {


    const tarikh =

        document.getElementById(
            "tarikh"
        ).value;


    const unit =

        document.getElementById(
            "unitPilihan"
        ).value;


    const posAsal =

        document.getElementById(
            "posAsal"
        ).value;


    const noSkb =

        document.getElementById(
            "anggota"
        ).value;


    const kodDuty =

        document.getElementById(
            "kodDuty"
        ).value;


    const kodTempatKerja =

        document.getElementById(
            "kodTempatKerja"
        ).value;


    if (

        !tarikh

        ||

        !unit

        ||

        !posAsal

        ||

        !noSkb

        ||

        !kodDuty

        ||

        !kodTempatKerja

    ) {


        paparMesej(

            "Sila lengkapkan Tarikh, Unit, Pos Asal, Nama Anggota, Kod Waktu Kerja dan Kod Tempat Kerja.",

            "error"

        );


        return;

    }


    const anggota =

        semuaAnggota.find(

            item =>

                String(
                    item.no_skb
                )

                ===

                String(
                    noSkb
                )

        );


    const duty =

        semuaKodDuty.find(

            item =>

                String(
                    item.unit
                )

                ===

                String(
                    unit
                )

                &&

                String(
                    item.kod
                )

                ===

                String(
                    kodDuty
                )

        );


    const tempat =

        semuaKodTempatKerja.find(

            item =>

                String(
                    item.unit
                )

                ===

                String(
                    unit
                )

                &&

                String(
                    item.kod_tempat_kerja
                )

                ===

                String(
                    kodTempatKerja
                )

        );


    if (!anggota || !duty || !tempat) {


        paparMesej(

            "Data anggota, kod duty atau tempat kerja tidak dijumpai.",

            "error"

        );


        return;

    }


    const tarikhObj =

        new Date(

            tarikh

            +

            "T00:00:00"

        );


    const bulan =

        tarikhObj.getMonth()
        + 1;


    const tahun =

        tarikhObj.getFullYear();


    const namaHari = [

        "Ahad",
        "Isnin",
        "Selasa",
        "Rabu",
        "Khamis",
        "Jumaat",
        "Sabtu"

    ];


    const hari =

        namaHari[
            tarikhObj.getDay()
        ];


    // CHECKBOX OFFDAY = 1 / 0
    const hariOffday =

        document.getElementById(
            "hariOffday"
        ).checked

        ? 1

        : 0;


    // JAM OFFDAY MANUAL
    const jamOffday =

        Number(

            document.getElementById(
                "jamOffday"
            ).value

        )

        || 0;


    // CHECKBOX CUTI AM = 1 / 0
    const hariCutiam =

        document.getElementById(
            "hariCutiam"
        ).checked

        ? 1

        : 0;


    // JAM CUTI AM MANUAL
    const jamCutiam =

        Number(

            document.getElementById(
                "jamCutiam"
            ).value

        )

        || 0;


    const dataSimpan = {


        tarikh:

            tarikh,


        bulan:

            bulan,


        tahun:

            tahun,


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

            hari,


        kod_waktu_kerja:

            duty.kod,


        kod_tempat_kerja:

            tempat.kod_tempat_kerja,


        jam_klm:

            duty.jam_klm,


        hari_offday_bertugas:

            hariOffday,


        jam_offday_bertugas:

            jamOffday,


        hari_cutiam_bertugas:

            hariCutiam,


        jam_cutiam_bertugas:

            jamCutiam

    };


    const { error } =

        await supabaseClient

            .from(
                "jadual_duty"
            )

            .insert(
                dataSimpan
            );


    if (error) {


        console.error(

            "Gagal simpan duty:",

            error

        );


        paparMesej(

            "Gagal simpan: "

            + error.message,

            "error"

        );


        return;

    }


    paparMesej(

        "Duty berjaya disimpan.",

        "success"

    );


    paparDuty();

}


// =====================================================
// PAPAR SENARAI DUTY
// =====================================================

async function paparDuty() {


    const tbody =

        document.getElementById(
            "senaraiDuty"
        );


    if (!tbody) {

        return;

    }


    const tarikh =

        document.getElementById(
            "filterTarikh"
        )?.value;


    const pos =

        document.getElementById(
            "filterPos"
        )?.value;


    const cari =

        document.getElementById(
            "cariNama"
        )?.value
        ?.toLowerCase()
        || "";


    let query =

        supabaseClient

            .from(
                "jadual_duty"
            )

            .select("*")

            .order(

                "tarikh",

                {

                    ascending:
                    true

                }

            );


    if (tarikh) {

        query =

            query.eq(

                "tarikh",

                tarikh

            );

    }


    if (pos) {

        query =

            query.eq(

                "nama_pos_asal",

                pos

            );

    }


    const { data, error } =

        await query;


    if (error) {


        paparMesej(

            "Gagal ambil jadual duty: "

            + error.message,

            "error"

        );


        return;

    }


    tbody.innerHTML = "";


    const senarai =

        (data || [])

            .filter(

                row =>


                    !cari

                    ||

                    String(

                        row.nama_anggota

                    )

                    .toLowerCase()

                    .includes(
                        cari
                    )

            );


    if (
        senarai.length
        ===
        0
    ) {


        tbody.innerHTML = `

            <tr>

                <td colspan="18">

                    Tiada rekod duty.

                </td>

            </tr>

        `;


        return;

    }


    senarai.forEach(

        function (row) {


            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${formatTarikh(row.tarikh)}
                </td>

                <td>
                    ${row.hari || ""}
                </td>

                <td>
                    ${row.no_skb || ""}
                </td>

                <td>
                    ${row.no_anggota || ""}
                </td>

                <td>
                    ${row.nama_anggota || ""}
                </td>

                <td>
                    ${row.kawasan || ""}
                </td>

                <td>
                    ${row.unit || ""}
                </td>

                <td>
                    ${row.ketua_unit || ""}
                </td>

                <td>
                    ${row.ketua_pos || ""}
                </td>

                <td>
                    ${row.nama_pos_asal || ""}
                </td>

                <td>
                    ${row.kod_waktu_kerja || ""}
                </td>

                <td>
                    ${row.kod_tempat_kerja || ""}
                </td>

                <td>
                    ${row.jam_klm || 0}
                </td>

                <td>
                    ${row.hari_offday_bertugas || 0}
                </td>

                <td>
                    ${row.jam_offday_bertugas || 0}
                </td>

                <td>
                    ${row.hari_cutiam_bertugas || 0}
                </td>

                <td>
                    ${row.jam_cutiam_bertugas || 0}
                </td>

                <td>

                    <button

                        class="btn-danger"

                        onclick="padamDuty(

                            '${row.id}',

                            '${row.no_skb}',

                            '${row.tarikh}'

                        )"

                    >

                        Padam

                    </button>

                </td>

            `;


            tbody.appendChild(
                tr
            );

        }

    );

}


// =====================================================
// PADAM DUTY
// =====================================================

async function padamDuty(

    id,

    noSkb,

    tarikh

) {


    if (

        !confirm(

            "Padam rekod duty ini?"

        )

    ) {

        return;

    }


    let query =

        supabaseClient

            .from(
                "jadual_duty"
            )

            .delete();


    if (id) {

        query =

            query.eq(
                "id",
                id
            );

    }

    else {

        query =

            query

                .eq(
                    "no_skb",
                    noSkb
                )

                .eq(
                    "tarikh",
                    tarikh
                );

    }


    const { error } =

        await query;


    if (error) {


        paparMesej(

            "Gagal padam: "

            + error.message,

            "error"

        );


        return;

    }


    paparMesej(

        "Rekod duty berjaya dipadam.",

        "success"

    );


    paparDuty();

}


// =====================================================
// UTILITI SELECT
// =====================================================

function kosongkanSelect(

    select,

    teks

) {


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">

            ${teks}

        </option>

    `;

}


// =====================================================
// PAPAR MESEJ
// =====================================================

function paparMesej(

    mesej,

    jenis

) {


    const div =

        document.getElementById(
            "mesej"
        );


    if (!div) {

        return;

    }


    div.className =
        jenis;


    div.textContent =
        mesej;


    setTimeout(

        function () {


            div.textContent =
                "";


            div.className =
                "";

        },

        5000

    );

}


// =====================================================
// FORMAT TARIKH
// =====================================================

function formatTarikh(

    tarikh

) {


    if (!tarikh) {

        return "";

    }


    const date =

        new Date(

            tarikh

            +

            "T00:00:00"

        );


    return date.toLocaleDateString(

        "ms-MY"

    );

}
