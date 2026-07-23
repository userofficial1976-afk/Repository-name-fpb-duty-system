// =====================================================
// LAPORAN ANGGARAN DUTY
// FPB DUTY SYSTEM
// DATA 100% DARIPADA jadual_duty
//
// FORMAT:
// 8 ANGGOTA MELINTANG
// SETIAP ANGGOTA:
// BARIS WK = KOD | JAM | OFF | AM
// BARIS TK = KOD | OFF | AM
// =====================================================

// =====================================================
// DATA GLOBAL
// =====================================================

let semuaDuty = [];

// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(

```
"DOMContentLoaded",

function () {

    console.log(
        "LAPORAN ANGGARAN DUTY BERJAYA DIMUAT"
    );


    isiBulan();


    isiTahun();


    setBulanSemasa();


    janaLaporanAutomatik();

}
```

);

// =====================================================
// SENARAI BULAN
// =====================================================

function isiBulan() {

```
const selectBulan =
    document.getElementById(
        "bulan"
    );


if (!selectBulan)

    return;


const senaraiBulan = [

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


selectBulan.innerHTML = `

    <option value="">

        -- Pilih Bulan --

    </option>

`;


senaraiBulan.forEach(

    function (

        namaBulan,

        index

    ) {


        const option =
            document.createElement(
                "option"
            );


        option.value =
            index + 1;


        option.textContent =
            namaBulan;


        selectBulan.appendChild(
            option
        );

    }

);
```

}

// =====================================================
// ISI TAHUN
// =====================================================

function isiTahun() {

```
const selectTahun =
    document.getElementById(
        "tahun"
    );


if (!selectTahun)

    return;


const tahunSemasa =
    new Date().getFullYear();


selectTahun.innerHTML = "";


for (

    let tahun =
        tahunSemasa - 2;

    tahun <=
        tahunSemasa + 2;

    tahun++

) {


    const option =
        document.createElement(
            "option"
        );


    option.value =
        tahun;


    option.textContent =
        tahun;


    if (

        tahun ===
        tahunSemasa

    ) {


        option.selected =
            true;

    }


    selectTahun.appendChild(
        option
    );

}
```

}

// =====================================================
// SET BULAN SEMASA
// =====================================================

function setBulanSemasa() {

```
const bulanSemasa =
    new Date().getMonth() + 1;


const selectBulan =
    document.getElementById(
        "bulan"
    );


if (selectBulan) {

    selectBulan.value =
        bulanSemasa;

}
```

}

// =====================================================
// JANA AUTOMATIK
// =====================================================

function janaLaporanAutomatik() {

```
const bulan =
    document.getElementById(
        "bulan"
    );


const tahun =
    document.getElementById(
        "tahun"
    );


if (bulan) {

    bulan.addEventListener(

        "change",

        function () {

            janaLaporan();

        }

    );

}


if (tahun) {

    tahun.addEventListener(

        "change",

        function () {

            janaLaporan();

        }

    );

}
```

}

// =====================================================
// JANA LAPORAN
// =====================================================

async function janaLaporan() {

```
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


if (

    !bulan ||
    !tahun

) {


    alert(
        "Sila pilih bulan dan tahun."
    );


    return;

}


console.log(
    "BULAN:",
    bulan
);


console.log(
    "TAHUN:",
    tahun
);


// =================================================
// AMBIL DATA DARIPADA jadual_duty SAHAJA
// =================================================

const {

    data,

    error

} = await supabaseClient

    .from(
        "jadual_duty"
    )

    .select("*")

    .eq(
        "bulan",
        getNamaBulan(
            bulan
        )
    )

    .eq(
        "tahun",
        tahun
    )

    .order(

        "pos",

        {

            ascending:
                true

        }

    )

    .order(

        "no_skb",

        {

            ascending:
                true

        }

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
        "RALAT:",
        error
    );


    alert(
        "Gagal ambil data duty: "
        +
        error.message
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

            <div class="tiada-data">

                Tiada rekod duty bagi

                ${getNamaBulan(bulan)}

                ${tahun}

            </div>

        `;


    return;

}


paparSemuaPos(

    bulan,

    tahun,

    semuaDuty

);
```

}

// =====================================================
// PAPAR SEMUA POS
// =====================================================

function paparSemuaPos(

```
bulan,

tahun,

semuaDuty
```

) {

```
const laporan =
    document.getElementById(
        "laporan"
    );


if (!laporan)

    return;


// =================================================
// SENARAI POS DARIPADA jadual_duty SAHAJA
// =================================================

const senaraiPos = [

    ...

    new Set(

        semuaDuty

            .map(

                function (

                    item

                ) {


                    return item.pos;


                }

            )

            .filter(Boolean)

    )

];


senaraiPos.sort();


let html = "";


senaraiPos.forEach(

    function (

        pos

    ) {


        const dutyPos =

            semuaDuty.filter(

                function (

                    item

                ) {


                    return (

                        item.pos ===
                        pos

                    );

                }

            );


        html +=

            binaLaporanPos(

                bulan,

                tahun,

                pos,

                dutyPos

            );

    }

);


laporan.innerHTML =
    html;
```

}

// =====================================================
// BINA LAPORAN SATU POS
// =====================================================

function binaLaporanPos(

```
bulan,

tahun,

pos,

semuaDutyPos
```

) {

```
const namaBulan =
    getNamaBulan(
        bulan
    ).toUpperCase();


// =================================================
// DAPATKAN ANGGOTA UNIK DARIPADA jadual_duty
// =================================================

const anggotaUnik = [];


semuaDutyPos.forEach(

    function (

        duty

    ) {


        const sudahAda =

            anggotaUnik.find(

                function (

                    anggota

                ) {


                    return (

                        String(

                            anggota.no_skb

                        )

                        ===

                        String(

                            duty.no_skb

                        )

                    );

                }

            );


        if (

            !sudahAda

        ) {


            anggotaUnik.push({

                no_skb:
                    duty.no_skb,

                no_anggota:
                    duty.no_anggota,

                nama:
                    duty.nama_anggota,

                kawasan:
                    duty.kawasan,

                unit:
                    duty.unit,

                ketua_unit:
                    duty.ketua_unit,

                ketua_pos:
                    duty.nama_ketua_pos

                    ||

                    duty.ketua_pos,

                pos:
                    duty.pos

            });

        }

    }

);


anggotaUnik.sort(

    function (

        a,

        b

    ) {


        return (

            String(

                a.nama

                ||

                ""

            )

                .localeCompare(

                    String(

                        b.nama

                        ||

                        ""

                    )

                )

        );

    }

);


// =================================================
// MAKSIMUM 8 ANGGOTA
// =================================================

const anggotaLaporan =

    anggotaUnik.slice(

        0,

        8

    );


if (

    anggotaLaporan.length === 0

)

    return "";


const anggotaPertama =
    anggotaLaporan[0];


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

    function (

        anggota

    ) {


        html += `

            <th

                colspan="4"

                class="header-anggota"

            >

                ${escapeHTML(

                    anggota.nama

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

    function ()

    {


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


const jumlahHari =

    new Date(

        tahun,

        bulan,

        0

    ).getDate();


// =================================================
// LOOP SETIAP HARI
// =================================================

for (

    let hari = 1;

    hari <=
        jumlahHari;

    hari++

) {


    const tarikh =

        tahun

        +

        "-"

        +

        String(

            bulan

        ).padStart(

            2,

            "0"

        )

        +

        "-"

        +

        String(

            hari

        ).padStart(

            2,

            "0"

        );


    const date =

        new Date(

            tarikh

            +

            "T00:00:00"

        );


    const namaHari =

        [

            "AHAD",

            "ISNIN",

            "SELASA",

            "RABU",

            "KHAMIS",

            "JUMAAT",

            "SABTU"

        ][

            date.getDay()

        ];


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

        function (

            anggota

        ) {


            const duty =

                cariDuty(

                    anggota.no_skb,

                    tarikh,

                    semuaDutyPos

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

                <td class="kod wk">

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


                <td class="off wk">

                    ${hariOff}

                </td>


                <td class="am wk">

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

        function (

            anggota

        ) {


            const duty =

                cariDuty(

                    anggota.no_skb,

                    tarikh,

                    semuaDutyPos

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

                <td class="kod tk">

                    ${escapeHTML(

                        kodTempatKerja

                    )}

                </td>


                <td class="off tk">

                    ${jamOff}

                </td>


                <td class="am tk">

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


                KOD = Kod Waktu Kerja

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


                JAM = Jam KLM

            </div>


        </div>


    </div>

`;


return html;
```

}

// =====================================================
// CARI DUTY
// =====================================================

function cariDuty(

```
noSKB,

tarikh,

semuaDuty
```

) {

```
return (

    semuaDuty.find(

        function (

            row

        ) {


            return (

                String(

                    row.no_skb

                )

                ===

                String(

                    noSKB

                )

                &&

                String(

                    row.tarikh

                )

                ===

                String(

                    tarikh

                )

            );

        }

    )

);
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


return (

    nama[bulan]

    ||

    ""

);
```

}

// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(

```
value
```

) {

```
if (

    value ===

    null

    ||

    value ===

    undefined

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
```

}
