// =====================================================
// LAPORAN ANGGARAN DUTY
// FORMAT:
// 8 ANGGOTA MELINTANG
// SETIAP ANGGOTA = KOD | JAM | OFF | AM
// =====================================================


let semuaAnggota = [];

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


        await muatAnggota();


        await muatPos();


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


        option.value = tahun;


        option.textContent = tahun;


        if (

            tahun === tahunSemasa

        ) {


            option.selected = true;


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


    document

        .getElementById(

            "bulan"

        )

        .value = bulan;


}


// =====================================================
// MUAT DATA ANGGOTA
// =====================================================

async function muatAnggota() {


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "Data_Anggota"

        )

        .select(`

            no_skb,

            no_anggota,

            nama,

            pangkat,

            pos,

            unit,

            kawasan,

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


    if (

        error

    ) {


        console.error(

            "RALAT DATA ANGGOTA:",

            error

        );


        alert(

            "Gagal ambil data anggota: "

            + error.message

        );


        return;


    }


    semuaAnggota = data || [];


}


// =====================================================
// MUAT SENARAI POS
// =====================================================

async function muatPos() {


    const posUnik =

        [

            ...new Set(

                semuaAnggota

                    .map(

                        function (

                            anggota

                        ) {


                            return anggota.pos;


                        }

                    )

                    .filter(Boolean)

            )

        ];


    posUnik.sort();


    const selectPos =

        document.getElementById(

            "pos"

        );


    selectPos.innerHTML = `

        <option value="">

            -- Pilih Pos --

        </option>

    `;


    posUnik.forEach(

        function (

            pos

        ) {


            const option =

                document.createElement(

                    "option"

                );


            option.value = pos;


            option.textContent = pos;


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


    if (

        !pos

    ) {


        alert(

            "Sila pilih Pos terlebih dahulu."

        );


        return;


    }


    const tarikhMula =

        tahun

        + "-"

        + String(

            bulan

        ).padStart(

            2,

            "0"

        )

        + "-01";


    const tarikhAkhir =

        tahun

        + "-"

        + String(

            bulan

        ).padStart(

            2,

            "0"

        )

        + "-"

        + new Date(

            tahun,

            bulan,

            0

        ).getDate();


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "jadual_duty"

        )

        .select("*")

        .gte(

            "tarikh",

            tarikhMula

        )

        .lte(

            "tarikh",

            tarikhAkhir

        )

        .eq(

            "pos",

            pos

        )

        .order(

            "tarikh",

            {

                ascending: true

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

            + error.message

        );


        return;


    }


    semuaDuty = data || [];


    const anggotaPos =

        semuaAnggota.filter(

            function (

                anggota

            ) {


                return (

                    anggota.pos === pos

                );


            }

        );


    if (

        anggotaPos.length === 0

    ) {


        alert(

            "Tiada anggota aktif untuk pos ini."

        );


        return;


    }


    paparLaporan(

        bulan,

        tahun,

        pos,

        anggotaPos,

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

    anggotaPos,

    semuaDuty

) {


    const namaBulan =

        [

            "",

            "JANUARI",

            "FEBRUARI",

            "MAC",

            "APRIL",

            "MEI",

            "JUN",

            "JULAI",

            "OGOS",

            "SEPTEMBER",

            "OKTOBER",

            "NOVEMBER",

            "DISEMBER"

        ][bulan];


    const anggotaPertama =

        anggotaPos[0];


    const kawasan =

        anggotaPertama.kawasan || "-";


    const unit =

        anggotaPertama.unit || "-";


    const ketuaUnit =

        anggotaPertama.ketua_unit || "-";


    const ketuaPos =

        anggotaPertama.ketua_pos || "-";


    const anggotaLaporan =

        anggotaPos.slice(

            0,

            8

        );


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


    const jumlahHari =

        new Date(

            tahun,

            bulan,

            0

        ).getDate();


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

            ).padStart(

                2,

                "0"

            )

            + "-"

            + String(

                hari

            ).padStart(

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

                    weekday: "long"

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

            function (

                anggota

            ) {


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

                        ||

                        duty.kod_duty

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

                    duty.hari_off

                    ||

                    0;


                const hariAM =

                    duty

                    &&

                    duty.hari_am

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

            function (

                anggota

            ) {


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
