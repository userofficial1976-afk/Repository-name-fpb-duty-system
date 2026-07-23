```javascript
// =====================================================
// LAPORAN-ANGGARAN.JS
// FPB DUTY SYSTEM
// SUMBER DATA: jadual_duty SAHAJA
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


        isiTahun();


        setBulanSemasa();


        await muatPosAsal();

    }

);


// =====================================================
// ISI SENARAI TAHUN
// =====================================================

function isiTahun() {

    const selectTahun =
        document.getElementById(
            "tahun"
        );


    if (!selectTahun)

        return;


    const tahunSemasa =
        new Date().getFullYear();


    selectTahun.innerHTML = `

        <option value="">

            -- Pilih Tahun --

        </option>

    `;


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

}


// =====================================================
// BULAN SEMASA
// =====================================================

function setBulanSemasa() {

    const bulan =
        new Date().getMonth() + 1;


    const selectBulan =
        document.getElementById(
            "bulan"
        );


    if (

        selectBulan

    ) {

        selectBulan.value =
            bulan;

    }

}


// =====================================================
// MUAT POS ASAL
// SUMBER: jadual_duty.nama_pos_asal
// =====================================================

async function muatPosAsal() {

    try {


        const {

            data,

            error

        } = await supabaseClient

            .from(

                "jadual_duty"

            )

            .select(

                "nama_pos_asal"

            )

            .not(

                "nama_pos_asal",

                "is",

                null

            );


        if (

            error

        )

            throw error;


        const senaraiPos =

            [

                ...new Set(

                    (data || [])

                        .map(

                            function (

                                item

                            ) {

                                return (

                                    item.nama_pos_asal

                                );

                            }

                        )

                        .filter(

                            Boolean

                        )

                )

            ]

            .sort();


        const selectPos =

            document.getElementById(

                "pos"

            );


        if (

            !selectPos

        )

            return;


        selectPos.innerHTML = `

            <option value="">

                -- Pilih Pos Asal --

            </option>

        `;


        senaraiPos.forEach(

            function (

                pos

            ) {


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


    catch (

        error

    ) {


        console.error(

            "RALAT MUAT POS ASAL:",

            error

        );


        alert(

            "Gagal ambil senarai Pos Asal: "

            +

            error.message

        );

    }

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


    if (

        !bulan

    ) {


        alert(

            "Sila pilih bulan."

        );


        return;

    }


    if (

        !tahun

    ) {


        alert(

            "Sila pilih tahun."

        );


        return;

    }


    if (

        !pos

    ) {


        alert(

            "Sila pilih Pos Asal."

        );


        return;

    }


    const namaBulan =

        getNamaBulan(

            bulan

        );


    console.log(

        "CARI DATA:",

        {

            bulan:
                namaBulan,

            tahun:
                tahun,

            pos:
                pos

        }

    );


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

            "bulan",

            namaBulan

        )


        .eq(

            "tahun",

            tahun

        )


        .eq(

            "nama_pos_asal",

            pos

        )


        .order(

            "tarikh",

            {

                ascending:
                    true

            }

        );


    if (

        error

    ) {


        console.error(

            "RALAT JADUAL DUTY:",

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

        getNamaBulan(

            bulan

        );


    const anggotaLaporan =

        [];


    const sudahAda =

        new Set();


    semuaDuty.forEach(

        function (

            duty

        ) {


            const noSkb =

                String(

                    duty.no_skb

                );


            if (

                !sudahAda.has(

                    noSkb

                )

            ) {


                sudahAda.add(

                    noSkb

                );


                anggotaLaporan.push(

                    duty

                );

            }

        }

    );


    anggotaLaporan.sort(

        function (

            a,

            b

        ) {


            return (

                (

                    a.nama_anggota ||

                    ""

                )

                    .localeCompare(

                        b.nama_anggota ||

                        ""

                    )

            );

        }

    );


    const anggotaPaparan =

        anggotaLaporan.slice(

            0,

            8

        );


    const pertama =

        anggotaPaparan[0];


    const kawasan =

        pertama.kawasan ||

        "-";


    const unit =

        pertama.unit ||

        "-";


    const ketuaUnit =

        pertama.ketua_unit ||

        "-";


    const ketuaPos =

        pertama.nama_ketua_pos ||

        pertama.ketua_pos ||

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

                    <strong>POS ASAL:</strong>

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


    anggotaPaparan.forEach(

        function (

            anggota

        ) {


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


    anggotaPaparan.forEach(

        function ()

        {


            html += `

                <th

                    class="sub-header"

                >

                    KOD

                </th>


                <th

                    class="sub-header"

                >

                    JAM

                </th>


                <th

                    class="sub-header"

                >

                    OFF

                </th>


                <th

                    class="sub-header"

                >

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

            )

                .padStart(

                    2,

                    "0"

                )

            +

            "-"

            +

            String(

                hari

            )

                .padStart(

                    2,

                    "0"

                );


        const tarikhDate =

            new Date(

                tarikh

                +

                "T00:00:00"

            );


        const namaHari =

            tarikhDate.toLocaleDateString(

                "ms-MY",

                {

                    weekday:

                        "long"

                }

            );


        // =========================================
        // BARIS WK
        // =========================================

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

                        ${escapeHTML(

                            namaHari

                        )}

                    </small>

                </td>

        `;


        anggotaPaparan.forEach(

            function (

                anggota

            ) {


                const duty =

                    cariDuty(

                        anggota.no_skb,

                        tarikh

                    );


                const kodDuty =

                    duty

                    &&

                    (

                        duty.kod_dutyy

                        ||

                        duty.kod_waktu_kerja

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


            <tr>

        `;


        // =========================================
        // BARIS TK
        // =========================================

        anggotaPaparan.forEach(

            function (

                anggota

            ) {


                const duty =

                    cariDuty(

                        anggota.no_skb,

                        tarikh

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

                    <div

                        class="petunjuk-title"

                    >

                        WK

                    </div>


                    KOD = Kod Duty

                    <br>

                    OFF = Hari OFF

                    <br>

                    AM = Hari AM

                </div>


                <div>

                    <div

                        class="petunjuk-title"

                    >

                        TK

                    </div>


                    KOD = Kod Tempat Kerja

                    <br>

                    OFF = Jam OFF

                    <br>

                    AM = Jam AM

                </div>


                <div>

                    <div

                        class="petunjuk-title"

                    >

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

        .innerHTML =

        html;

}


// =====================================================
// CARI DUTY
// =====================================================

function cariDuty(

    noSKB,

    tarikh

) {


    return semuaDuty.find(

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

                row.tarikh

                ===

                tarikh

            );

        }

    );

}


// =====================================================
// NAMA BULAN
// =====================================================

function getNamaBulan(

    bulan

) {


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

    )

        return "";


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
```
