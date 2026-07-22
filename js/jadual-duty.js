// =====================================================
// DATA MEMORY
// =====================================================

let semuaAnggota = [];
let semuaKodDuty = [];
let semuaKodTempatKerja = [];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("JADUAL DUTY JS BERJAYA DIMUAT");

    const tarikh = document.getElementById("tarikh");

    if (tarikh) {
        tarikh.valueAsDate = new Date();
        kemaskiniTarikh();
    }

    const filterTarikh =
        document.getElementById("filterTarikh");

    if (filterTarikh) {
        filterTarikh.valueAsDate = new Date();
    }

    await muatAnggota();

    await muatKodDuty();

    await muatKodTempatKerja();

    paparDuty();

});


// =====================================================
// TARIKH → BULAN / TAHUN / HARI
// =====================================================

document
    .getElementById("tarikh")
    .addEventListener("change", function () {

        kemaskiniTarikh();

    });


function kemaskiniTarikh() {

    const nilai =
        document
            .getElementById("tarikh")
            .value;

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


    const hariNama = [

        "Ahad",
        "Isnin",
        "Selasa",
        "Rabu",
        "Khamis",
        "Jumaat",
        "Sabtu"

    ];


    const hari =
        hariNama[
            tarikh.getDay()
        ];


    document
        .getElementById("bulan")
        .value =
        bulan;


    document
        .getElementById("tahun")
        .value =
        tahun;


    document
        .getElementById("hari")
        .value =
        hari;

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
                ketua_pos
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
            "RALAT DATA ANGGOTA:",
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


    muatSenaraiUnit();

}


// =====================================================
// UNIT
// =====================================================

function muatSenaraiUnit() {

    const selectUnit =
        document
            .getElementById("unitPilihan");


    if (!selectUnit) {

        console.error(
            "ID unitPilihan tidak dijumpai"
        );

        return;

    }


    const unitUnik = [

        ...new Set(

            semuaAnggota

                .map(
                    x => x.unit
                )

                .filter(Boolean)

        )

    ];


    unitUnik.sort();


    selectUnit.innerHTML = `

        <option value="">
            -- Pilih Unit --
        </option>

    `;


    unitUnik.forEach(
        function (unit) {

            const option =
                document
                    .createElement(
                        "option"
                    );


            option.value =
                unit;


            option.textContent =
                unit;


            selectUnit
                .appendChild(
                    option
                );

        }
    );


    selectUnit
        .addEventListener(
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
        document
            .getElementById(
                "posAsal"
            );


    const selectAnggota =
        document
            .getElementById(
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


    sembunyikanInfoAnggota();


    if (!unit) {

        return;

    }


    const posUnik = [

        ...new Set(

            semuaAnggota

                .filter(

                    x =>
                    String(x.unit)
                    === String(unit)

                )

                .map(

                    x =>
                    x.pos

                )

                .filter(Boolean)

        )

    ];


    posUnik.sort();


    posUnik.forEach(

        function (pos) {

            const option =
                document
                    .createElement(
                        "option"
                    );


            option.value =
                pos;


            option.textContent =
                pos;


            selectPos
                .appendChild(
                    option
                );

        }

    );


    muatKodDutyIkutUnit(
        unit
    );


    muatKodTempatKerjaIkutUnit(
        unit
    );

}


// =====================================================
// PILIH POS ASAL
// =====================================================

document
    .getElementById(
        "posAsal"
    )
    .addEventListener(
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


            muatAnggotaIkutUnitDanPos(

                unit,

                pos

            );

        }
    );


// =====================================================
// ANGGOTA IKUT UNIT + POS
// =====================================================

function muatAnggotaIkutUnitDanPos(

    unit,

    pos

) {


    const selectAnggota =
        document
            .getElementById(
                "anggota"
            );


    kosongkanSelect(

        selectAnggota,

        "-- Pilih Nama Anggota --"

    );


    sembunyikanInfoAnggota();


    if (!unit || !pos) {

        return;

    }


    const senarai =
        semuaAnggota

            .filter(

                function (x) {

                    return (

                        String(x.unit)
                        === String(unit)

                        &&

                        String(x.pos)
                        === String(pos)

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


    senarai.forEach(

        function (anggota) {

            const option =
                document
                    .createElement(
                        "option"
                    );


            option.value =
                anggota.no_skb;


            option.textContent =

                (

                    anggota.no_anggota
                    || ""

                )

                + " | "

                +

                (

                    anggota.nama
                    || ""

                );


            selectAnggota
                .appendChild(
                    option
                );

        }

    );

}


// =====================================================
// PILIH ANGGOTA
// =====================================================

document
    .getElementById(
        "anggota"
    )
    .addEventListener(
        "change",
        function () {


            const noSkb =
                this.value;


            const anggota =
                semuaAnggota.find(

                    function (x) {

                        return String(
                            x.no_skb
                        )
                        ===
                        String(
                            noSkb
                        );

                    }

                );


            if (!anggota) {

                sembunyikanInfoAnggota();

                return;

            }


            document
                .getElementById(
                    "noSkb"
                )
                .value =
                anggota.no_skb
                || "";


            document
                .getElementById(
                    "noAnggota"
                )
                .value =
                anggota.no_anggota
                || "";


            document
                .getElementById(
                    "kawasan"
                )
                .value =
                anggota.kawasan
                || "";


            document
                .getElementById(
                    "unit"
                )
                .value =
                anggota.unit
                || "";


            document
                .getElementById(
                    "ketuaPos"
                )
                .value =
                anggota.ketua_pos
                || "";


            document
                .getElementById(
                    "namaPosAsal"
                )
                .value =
                anggota.pos
                || "";

        }

    );


// =====================================================
// MUAT KOD DUTY
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
            "RALAT KOD DUTY:",
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
// KOD DUTY IKUT UNIT
// =====================================================

function muatKodDutyIkutUnit(

    unit

) {


    const selectKod =
        document
            .getElementById(
                "kodDuty"
            );


    kosongkanSelect(

        selectKod,

        "-- Pilih Kod Waktu Kerja --"

    );


    const senarai =
        semuaKodDuty

            .filter(

                function (x) {

                    return String(
                        x.unit
                    )
                    ===
                    String(
                        unit
                    );

                }

            )

            .sort(

                function (a, b) {

                    return String(
                        a.kod
                    ).localeCompare(
                        String(
                            b.kod
                        )
                    );

                }

            );


    senarai.forEach(

        function (duty) {

            const option =
                document
                    .createElement(
                        "option"
                    );


            option.value =
                duty.kod;


            option.textContent =

                duty.kod

                + " | "

                + duty.waktu_tugasan

                + " | "

                + duty.jam_kerja

                + " jam kerja";


            selectKod
                .appendChild(
                    option
                );

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
            "RALAT KOD TEMPAT KERJA:",
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

function muatKodTempatKerjaIkutUnit(

    unit

) {


    const selectTempat =
        document
            .getElementById(
                "kodTempatKerja"
            );


    kosongkanSelect(

        selectTempat,

        "-- Pilih Kod Tempat Kerja --"

    );


    const senarai =
        semuaKodTempatKerja

            .filter(

                function (x) {

                    return String(
                        x.unit
                    )
                    ===
                    String(
                        unit
                    );

                }

            );


    senarai.forEach(

        function (tempat) {

            const option =
                document
                    .createElement(
                        "option"
                    );


            option.value =
                tempat.kod_tempat_kerja;


            option.textContent =

                tempat.kod_tempat_kerja

                + " | "

                + tempat.nama_tempat_kerja;


            selectTempat
                .appendChild(
                    option
                );

        }

    );

}


// =====================================================
// PILIH KOD WAKTU KERJA
// =====================================================

document
    .getElementById(
        "kodDuty"
    )
    .addEventListener(
        "change",
        function () {


            const unit =
                document
                    .getElementById(
                        "unitPilihan"
                    )
                    .value;


            const duty =
                semuaKodDuty.find(

                    function (x) {

                        return (

                            String(
                                x.unit
                            )
                            ===
                            String(
                                unit
                            )

                            &&

                            String(
                                x.kod
                            )
                            ===
                            String(
                                document
                                    .getElementById(
                                        "kodDuty"
                                    )
                                    .value
                            )

                        );

                    }

                );


            if (!duty) {

                return;

            }


            document
                .getElementById(
                    "jamKlm"
                )
                .value =
                duty.jam_klm
                || 0;

        }

    );


// =====================================================
// SIMPAN DUTY
// =====================================================

async function simpanDuty() {


    const tarikh =
        document
            .getElementById(
                "tarikh"
            )
            .value;


    const unit =
        document
            .getElementById(
                "unitPilihan"
            )
            .value;


    const posAsal =
        document
            .getElementById(
                "posAsal"
            )
            .value;


    const noSkb =
        document
            .getElementById(
                "anggota"
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

            "Sila lengkapkan Tarikh, Unit, Pos Asal, Anggota, Kod Waktu Kerja dan Kod Tempat Kerja.",

            "error"

        );


        return;

    }


    const anggota =
        semuaAnggota.find(

            function (x) {

                return String(
                    x.no_skb
                )
                ===
                String(
                    noSkb
                );

            }

        );


    const duty =
        semuaKodDuty.find(

            function (x) {

                return (

                    String(
                        x.unit
                    )
                    ===
                    String(
                        unit
                    )

                    &&

                    String(
                        x.kod
                    )
                    ===
                    String(
                        kodDuty
                    )

                );

            }

        );


    const tempat =
        semuaKodTempatKerja.find(

            function (x) {

                return (

                    String(
                        x.unit
                    )
                    ===
                    String(
                        unit
                    )

                    &&

                    String(
                        x.kod_tempat_kerja
                    )
                    ===
                    String(
                        kodTempatKerja
                    )

                );

            }

        );


    const tarikhObj =
        new Date(

            tarikh

            + "T00:00:00"

        );


    const bulan =
        tarikhObj.getMonth()
        + 1;


    const tahun =
        tarikhObj.getFullYear();


    const hariNama = [

        "Ahad",
        "Isnin",
        "Selasa",
        "Rabu",
        "Khamis",
        "Jumaat",
        "Sabtu"

    ];


    const hari =
        hariNama[
            tarikhObj.getDay()
        ];


    const hariOffday =
        document
            .getElementById(
                "hariOffday"
            )
            .checked
            ? 1
            : 0;


    const jamOffday =
        document
            .getElementById(
                "jamOffday"
            )
            .value
            || 0;


    const hariCutiam =
        document
            .getElementById(
                "hariCutiam"
            )
            .checked
            ? 1
            : 0;


    const jamCutiam =
        document
            .getElementById(
                "jamCutiam"
            )
            .value
            || 0;


    const { error } =
        await supabaseClient

            .from(
                "jadual_duty"
            )

            .insert({

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

            });


    if (error) {

        console.error(

            "RALAT SIMPAN DUTY:",

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


    const cari =
        document
            .getElementById(
                "cariNama"
            )
            .value
            .toLowerCase();


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


    const tbody =
        document
            .getElementById(
                "senaraiDuty"
            );


    tbody.innerHTML =
        "";


    const filtered =
        (data || [])
            .filter(

                function (row) {

                    return (

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

                }

            );


    if (
        filtered.length
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


    filtered.forEach(

        function (row) {


            const tr =
                document
                    .createElement(
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
                    <span class="badge">
                        ${row.kod_waktu_kerja || ""}
                    </span>
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

                        onclick="

                            padamDuty(

                                '${row.no_skb}',

                                '${row.tarikh}'

                            )

                        "

                    >

                        Padam

                    </button>

                </td>

            `;


            tbody
                .appendChild(
                    tr
                );

        }

    );

}


// =====================================================
// PADAM DUTY
// =====================================================

async function padamDuty(

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


    const { error } =
        await supabaseClient

            .from(
                "jadual_duty"
            )

            .delete()

            .eq(
                "no_skb",
                noSkb
            )

            .eq(
                "tarikh",
                tarikh
            );


    if (error) {

        paparMesej(

            "Gagal padam: "
            + error.message,

            "error"

        );


        return;

    }


    paparMesej(

        "Rekod duty telah dipadam.",

        "success"

    );


    paparDuty();

}


// =====================================================
// UTILITI
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


function sembunyikanInfoAnggota() {

    const ids = [

        "noSkb",
        "noAnggota",
        "kawasan",
        "unit",
        "ketuaPos",
        "namaPosAsal"

    ];


    ids.forEach(

        function (id) {

            const el =
                document
                    .getElementById(
                        id
                    );


            if (el) {

                el.value =
                    "";

            }

        }

    );

}


function paparMesej(

    mesej,

    jenis

) {


    const div =
        document
            .getElementById(
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


function formatTarikh(

    tarikh

) {


    if (!tarikh) {

        return "";

    }


    const date =
        new Date(

            tarikh
            + "T00:00:00"

        );


    return date.toLocaleDateString(

        "ms-MY"

    );

}
