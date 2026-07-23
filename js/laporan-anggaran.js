// =====================================================
// LAPORAN ANGGARAN DUTY
// SUMBER DATA: jadual_duty SAHAJA
//
// FORMAT:
// 8 ANGGOTA MELINTANG
// SETIAP ANGGOTA = KOD | JAM | OFF | AM
// =====================================================


// =====================================================
// DATA GLOBAL
// =====================================================

let semuaDuty = [];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    async function () {

        console.log(
            "LAPORAN ANGGARAN BERJAYA DIMUAT"
        );


        // Tahun daripada jadual_duty
        await isiTahun();


        // Bulan semasa
        setBulanSemasa();


        // Pos daripada jadual_duty
        await muatPos();


    }

);


// =====================================================
// NAMA BULAN
// =====================================================

const SENARAI_BULAN = [

    "",

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
// ISI TAHUN
// AMBIL DARI jadual_duty
// =====================================================

async function isiTahun() {


    const selectTahun =

        document.getElementById(

            "tahun"

        );


    if (!selectTahun)

        return;


    selectTahun.innerHTML = `

        <option value="">

            -- Pilih Tahun --

        </option>

    `;


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "jadual_duty"

        )

        .select(

            "tahun"

        );


    if (error) {


        console.error(

            "RALAT TAHUN:",

            error

        );


        alert(

            "Gagal ambil senarai tahun: "

            + error.message

        );


        return;

    }


    const tahunUnik =

        [

            ...new Set(

                (data || [])

                    .map(

                        function (item) {


                            return Number(

                                item.tahun

                            );


                        }

                    )

                    .filter(

                        function (tahun) {


                            return (

                                tahun > 0

                            );

                        }

                    )

            )

        ]

        .sort(

            function (a, b) {


                return b - a;

            }

        );


    const tahunSemasa =

        new Date()

            .getFullYear();


    // Jika tahun semasa belum ada dalam database,
    // tetap masukkan tahun semasa

    if (

        !tahunUnik.includes(

            tahunSemasa

        )

    ) {


        tahunUnik.unshift(

            tahunSemasa

        );

    }


    tahunUnik.forEach(

        function (tahun) {


            const option =

                document.createElement(

                    "option"

                );


            option.value =

                tahun;


            option.textContent =

                tahun;


            if (

                tahun === tahunSemasa

            ) {


                option.selected =

                    true;

            }


            selectTahun.appendChild(

                option

            );

        }

    );

}


// =====================================================
// BULAN SEMASA
// =====================================================

function setBulanSemasa() {


    const bulan =

        document.getElementById(

            "bulan"

        );


    if (!bulan)

        return;


    bulan.value =

        new Date()

            .getMonth()

            + 1;

}


// =====================================================
// MUAT POS
// SUMBER: jadual_duty SAHAJA
// =====================================================

async function muatPos() {


    const selectPos =

        document.getElementById(

            "pos"

        );


    if (!selectPos)

        return;


    selectPos.innerHTML = `

        <option value="">

            -- Pilih Pos --

        </option>

    `;


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "jadual_duty"

        )

        .select(

            "pos"

        );


    if (error) {


        console.error(

            "RALAT POS:",

            error

        );


        alert(

            "Gagal ambil senarai Pos: "

            + error.message

        );


        return;

    }


    const posUnik =

        [

            ...new Set(

                (data || [])

                    .map(

                        function (item) {


                            return item.pos;

                        }

                    )

                    .filter(

                        Boolean

                    )

            )

        ]

        .sort();


    posUnik.forEach(

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

}


// =====================================================
// JANA LAPORAN
// =====================================================

async function janaLaporan() {


    const bulan =

        Number(

            document

                .getElementById(

                    "bulan"

                )

                .value

        );


    const tahun =

        Number(

            document

                .getElementById(

                    "tahun"

                )

                .value

        );


    const pos =

        document

            .getElementById(

                "pos"

            )

            .value;


    if (!bulan) {


        alert(

            "Sila pilih bulan."

        );


        return;

    }


    if (!tahun) {


        alert(

            "Sila pilih tahun."

        );


        return;

    }


    if (!pos) {


        alert(

            "Sila pilih Pos Asal terlebih dahulu."

        );


        return;

    }


    // =================================================
    // AMBIL DATA DARI jadual_duty SAHAJA
    // =================================================


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "jadual_duty"

        )

        .select(

            "*"

        )

        .eq(

            "tahun",

            tahun

        )

        .eq(

            "bulan",

            SENARAI_BULAN[bulan]

        )

        .eq(

            "pos",

            pos

        )

        .order(

            "tarikh",

            {

                ascending:

                    true

            }

        );


    if (error) {


        console.error(

            "RALAT JADUAL DUTY:",

            error

        );


        alert(

            "Gagal ambil data duty: "

            + error.message

        );


        return;

    }


    semuaDuty =

        data || [];


    if (

        semuaDuty.length === 0

    ) {


        document

            .getElementById(

                "laporan"

            )

            .innerHTML = `

                <p>

                    Tiada rekod duty ditemui.

                </p>

            `;


        return;

    }


    paparLaporan(

        bulan,

        tahun,

        pos,

        semuaDuty

    );

}


// =====================================================
// PAPAR LAPORAN
// =====================================================

function paparLaporan(

    bulan,

    tahun,

    pos,

    semuaDuty

) {


    const namaBulan =

        SENARAI_BULAN[

            bulan

        ]

            .toUpperCase();


    // =================================================
    // AMBIL ANGGOTA UNIK DARIPADA jadual_duty
    // =================================================


    const anggotaUnik =

        [];


    const mapAnggota =

        new Map();


    semuaDuty.forEach(

        function (duty) {


            const noSkb =

                String(

                    duty.no_skb

                );


            if (

                !mapAnggota.has(

                    noSkb

                )

            ) {


                mapAnggota.set(

                    noSkb,

                    duty

                );

            }

        }

    );


    mapAnggota.forEach(

        function (duty) {


            anggotaUnik.push(

                duty

            );

        }

    );


    // =================================================
    // SUSUN NAMA
    // =================================================


    anggotaUnik.sort(

        function (a, b) {


            return (

                a.nama_anggota || ""

            )

                .localeCompare(

                    b.nama_anggota || ""

                );

        }

    );


    // =================================================
    // MAKSIMUM 8 ANGGOTA MELINTANG
    // =================================================


    const anggotaLaporan =

        anggotaUnik.slice(

            0,

            8

        );


    if (

        anggotaLaporan.length === 0

    ) {


        document

            .getElementById(

                "laporan"

            )

            .innerHTML = `

                <p>

                    Tiada anggota ditemui dalam jadual duty.

                </p>

            `;


        return;

    }


    const anggotaPertama =

        anggotaLaporan[

            0

        ];


    const kawasan =

        anggotaPertama.kawasan

        ||

        "-";


    const unit =

        anggotaPertama.unit

        ||

        "-";


    const ketuaUnit =

        anggotaPertama.ketua_unit

        ||


        "-";


    const ketuaPos =

        anggotaPertama.nama_ketua_pos

        ||


        anggotaPertama.ketua_pos

        ||


        "-";


    let html = `

        <div class="laporan-a4">


            <div class="laporan-tajuk">


                ANGGARAN DUTY -

                ${escapeHTML(pos)}

                -

                ${namaBulan}

                ${tahun}


            </div>


            <div class="laporan-maklumat">


                <div>

                    <strong>KAWASAN:</strong>

                    ${escapeHTML(kawasan)}

                </div>


                <div>

                    <strong>UNIT:</strong>

                    ${escapeHTML(unit)}

                </div>


                <div>

                    <strong>POS:</strong>

                    ${escapeHTML(pos)}

                </div>


                <div>

                    <strong>KETUA UNIT:</strong>

                    ${escapeHTML(ketuaUnit)}

                </div>


                <div>

                    <strong>KETUA POS:</strong>

                    ${escapeHTML(ketuaPos)}

                </div>


            </div>


            <div class="table-wrapper">


            <table class="jadual-bulanan">


                <thead>


                    <tr>


                        <th

                            rowspan="2"

                            class="tarikh-hari"

                        >

                            TARIKH / HARI

                        </th>


    `;


    // =================================================
    // HEADER NAMA ANGGOTA
    // =================================================


    anggotaLaporan.forEach(

        function (anggota) {


            html += `

                <th

                    colspan="4"

                    class="header-anggota"

                >


                    ${escapeHTML(

                        anggota.nama_anggota

                    )}


                    <br>


                    <small>


                        ${escapeHTML(

                            anggota.no_anggota

                        )}


                    </small>


                </th>

            `;

        }

    );


    html += `

                    </tr>


                    <tr>

    `;


    anggotaLaporan.forEach(

        function () {


            html += `

                <th class="sub-header">

                    KOD

                </th>


                <th class="sub-header">

                    JAM

                </th>


                <th class="sub-header">

                    OFF

                </th>


                <th class="sub-header">

                    AM

                </th>

            `;

        }

    );


    html += `

                    </tr>

                </thead>


                <tbody>

    `;


    // =================================================
    // JUMLAH HARI DALAM BULAN
    // =================================================


    const jumlahHari =

        new Date(

            tahun,

            bulan,

            0

        )

            .getDate();


    for (

        let hari = 1;

        hari <= jumlahHari;

        hari++

    ) {


        const tarikh =

            tahun

            + "-"

            + String(

                bulan

            )

                .padStart(

                    2,

                    "0"

                )

            + "-"

            + String(

                hari

            )

                .padStart(

                    2,

                    "0"

                );


        const date =

            new Date(

                tarikh

                + "T00:00:00"

            );


        const namaHari =

            date.toLocaleDateString(

                "ms-MY",

                {

                    weekday:

                        "long"

                }

            );


        // =================================================
        // BARIS WK
        // =================================================


        html += `

            <tr>


                <td

                    rowspan="2"

                    class="tarikh-hari"

                >


                    <strong>

                        ${hari}

                    </strong>


                    <br>


                    <small>

                        ${namaHari}

                    </small>


                </td>

        `;


        anggotaLaporan.forEach(

            function (anggota) {


                const duty =

                    cariDuty(

                        anggota.no_skb,

                        tarikh,

                        semuaDuty

                    );


                const kodDuty =

                    duty

                    &&

                    (

                        duty.kod_waktu_kerja

                        ||

                        duty.kod_dutyy

                    )

                    ||

                    "-";


                const jamKLM =

                    duty

                    &&

                    duty.jam_klm

                    ||

                    0;


                const hariOff =

                    duty

                    &&

                    duty.hari_offday_bertugas

                    ||

                    0;


                const hariAM =

                    duty

                    &&

                    duty.hari_cutiam_bertugas

                    ||

                    0;


                html += `

                    <td

                        class="kod wk"

                    >

                        ${escapeHTML(

                            kodDuty

                        )}

                    </td>


                    <td

                        rowspan="2"

                        class="jam-klm-cell"

                    >

                        ${jamKLM}

                    </td>


                    <td

                        class="off wk"

                    >

                        ${hariOff}

                    </td>


                    <td

                        class="am wk"

                    >

                        ${hariAM}

                    </td>

                `;

            }

        );


        html += `

            </tr>

        `;


        // =================================================
        // BARIS TK
        // =================================================


        html += `

            <tr>

        `;


        anggotaLaporan.forEach(

            function (anggota) {


                const duty =

                    cariDuty(

                        anggota.no_skb,

                        tarikh,

                        semuaDuty

                    );


                const kodTempatKerja =

                    duty

                    &&

                    duty.kod_tempat_kerja

                    ||

                    "-";


                const jamOff =

                    duty

                    &&

                    duty.jam_offday_bertugas

                    ||

                    0;


                const jamAM =

                    duty

                    &&

                    duty.jam_cutiam_bertugas

                    ||

                    0;


                html += `

                    <td

                        class="kod tk"

                    >

                        ${escapeHTML(

                            kodTempatKerja

                        )}

                    </td>


                    <td

                        class="off tk"

                    >

                        ${jamOff}

                    </td>


                    <td

                        class="am tk"

                    >

                        ${jamAM}

                    </td>

                `;

            }

        );


        html += `

            </tr>

        `;

    }


    html += `

                </tbody>


            </table>


            </div>


            <div class="petunjuk">


                <div>


                    <div class="petunjuk-title">

                        WK

                    </div>


                    KOD = Kod Duty

                    <br>


                    OFF = Hari OFF

                    <br>


                    AM = Hari AM


                </div>


                <div>


                    <div class="petunjuk-title">

                        TK

                    </div>


                    KOD = Kod Tempat Kerja

                    <br>


                    OFF = Jam OFF

                    <br>


                    AM = Jam AM


                </div>


                <div>


                    <div class="petunjuk-title">

                        JAM

                    </div>


                    JAM = JAM KLM


                </div>


            </div>


        </div>

    `;


    document

        .getElementById(

            "laporan"

        )

        .innerHTML = html;

}


// =====================================================
// CARI DUTY
// =====================================================

function cariDuty(

    noSKB,

    tarikh,

    semuaDuty

) {


    return semuaDuty.find(

        function (row) {


            return (

                String(

                    row.no_skb

                )

                ===

                String(

                    noSKB

                )

                &&

                row.tarikh

                ===

                tarikh

            );

        }

    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(

    value

) {


    if (

        value === null

        ||

        value === undefined

    ) {


        return "";

    }


    return String(

        value

    )

        .replace(

            /&/g,

            "&amp;"

        )

        .replace(

            /</g,

            "&lt;"

        )

        .replace(

            />/g,

            "&gt;"

        )

        .replace(

            /"/g,

            "&quot;"

        )

        .replace(

            /'/g,

            "&#039;"

        );

}
