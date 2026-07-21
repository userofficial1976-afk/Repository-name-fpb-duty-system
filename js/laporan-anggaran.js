// =====================================================
// LAPORAN ANGGARAN DUTY
// =====================================================

let semuaAnggota = [];
let semuaDuty = [];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("LAPORAN ANGGARAN BERJAYA DIMUAT");

    isiTahun();

    setBulanSemasa();

    await muatAnggota();

    await muatPos();

});


// =====================================================
// ISI SENARAI TAHUN
// =====================================================

function isiTahun() {

    const selectTahun =
        document.getElementById("tahun");

    const tahunSemasa =
        new Date().getFullYear();

    selectTahun.innerHTML = "";

    for (
        let tahun = tahunSemasa - 2;
        tahun <= tahunSemasa + 2;
        tahun++
    ) {

        const option =
            document.createElement("option");

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

        selectTahun.appendChild(option);

    }

}


// =====================================================
// BULAN SEMASA
// =====================================================

function setBulanSemasa() {

    const bulan =
        new Date().getMonth() + 1;

    document
        .getElementById("bulan")
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
        .from("Data_Anggota")
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
        .eq("status", "Aktif")
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

        alert(
            "Gagal ambil data anggota: "
            + error.message
        );

        return;

    }


    semuaAnggota =
        data || [];

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
                        function (anggota) {

                            return anggota.pos;

                        }
                    )
                    .filter(Boolean)

            )
        ];


    posUnik.sort();


    const selectPos =
        document
            .getElementById("pos");


    selectPos.innerHTML = `

        <option value="">

            -- Pilih Pos --

        </option>

    `;


    posUnik.forEach(
        function (pos) {

            const option =
                document.createElement("option");

            option.value =
                pos;

            option.textContent =
                pos;

            selectPos.appendChild(option);

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
                .getElementById("bulan")
                .value
        );


    const tahun =
        Number(
            document
                .getElementById("tahun")
                .value
        );


    const pos =
        document
            .getElementById("pos")
            .value;


    if (!pos) {

        alert(
            "Sila pilih Pos terlebih dahulu."
        );

        return;

    }


    const tarikhMula =

        tahun
        + "-"
        + String(bulan).padStart(2, "0")
        + "-01";


    const tarikhAkhir =

        tahun
        + "-"
        + String(bulan).padStart(2, "0")
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
        .from("jadual_duty")
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


    const anggotaPos =
        semuaAnggota.filter(
            function (anggota) {

                return (

                    anggota.pos
                    ===
                    pos

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
        anggotaPertama.kawasan
        || "-";


    const unit =
        anggotaPertama.unit
        || "-";


    const ketuaUnit =
        anggotaPertama.ketua_unit
        || "-";


    const ketuaPos =
        anggotaPertama.ketua_pos
        || "-";


    let html = `

        <div class="info-header">


            <h2>

                ANGGARAN DUTY

                ${escapeHTML(pos)}

                BULAN

                ${namaBulan}

                ${tahun}

            </h2>


            <table>


                <tr>

                    <td>

                        KAWASAN

                    </td>


                    <td>

                        ${escapeHTML(kawasan)}

                    </td>

                </tr>


                <tr>

                    <td>

                        UNIT

                    </td>


                    <td>

                        ${escapeHTML(unit)}

                    </td>

                </tr>


                <tr>

                    <td>

                        NAMA POS ASAL

                    </td>


                    <td>

                        ${escapeHTML(pos)}

                    </td>

                </tr>


                <tr>

                    <td>

                        NAMA KETUA UNIT

                    </td>


                    <td>

                        ${escapeHTML(ketuaUnit)}

                    </td>

                </tr>


                <tr>

                    <td>

                        NAMA KETUA POS

                    </td>


                    <td>

                        ${escapeHTML(ketuaPos)}

                    </td>

                </tr>


            </table>


        </div>


        <div class="table-wrapper">


        <table class="jadual-bulanan">


            <thead>


                <tr>


                    <th rowspan="2">

                        TARIKH

                    </th>


                    <th rowspan="2">

                        HARI

                    </th>

    `;


    anggotaPos.forEach(

        function (anggota) {


            html += `


                <th

                    colspan="5"

                    class="nama-anggota"

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


    anggotaPos.forEach(

        function () {


            html += `


                <th>

                    KOD WAKTU

                </th>


                <th>

                    JAM KERJA

                </th>


                <th>

                    KOD TEMPAT

                </th>


                <th>

                    JAM KLM

                </th>


                <th>

                    OFF / AM

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


        html += `


            <tr>


                <td class="tarikh">

                    ${hari}

                </td>


                <td class="hari">

                    ${namaHari}

                </td>


        `;


        anggotaPos.forEach(

            function (anggota) {


                const duty =

                    semuaDuty.find(

                        function (row) {


                            return (

                                String(

                                    row.no_skb

                                )

                                ===

                                String(

                                    anggota.no_skb

                                )


                                &&


                                row.tarikh

                                ===

                                tarikh

                            );

                        }

                    );


                if (duty) {


                    const kodWaktu =

                        duty.kod_waktu_kerja

                        ||

                        duty.kod_dutyy

                        ||

                        "-";


                    const jamKerja =

                        duty.jam_kerja

                        ||

                        0;


                    const kodTempat =

                        duty.kod_tempat_kerja

                        ||

                        "-";


                    const jamKLM =

                        duty.jam_klm

                        ||

                        0;


                    const jamOff =

                        duty.jam_offday_bertugas

                        ||

                        0;


                    const jamAM =

                        duty.jam_cutiam_bertugas

                        ||

                        0;


                    let offAM = "";


                    if (

                        Number(

                            jamOff

                        )

                        > 0

                    ) {


                        offAM =

                            "OFF "

                            + jamOff;

                    }


                    if (

                        Number(

                            jamAM

                        )

                        > 0

                    ) {


                        offAM +=


                            (

                                offAM

                                ?

                                " / "

                                :

                                ""

                            )


                            + "AM "

                            + jamAM;

                    }


                    if (

                        !offAM

                    ) {


                        offAM =

                            "-";

                    }


                    html += `


                        <td class="kod">


                            ${escapeHTML(

                                kodWaktu

                            )}


                        </td>


                        <td>


                            ${jamKerja}


                        </td>


                        <td>


                            ${escapeHTML(

                                kodTempat

                            )}


                        </td>


                        <td>


                            ${jamKLM}


                        </td>


                        <td>


                            ${offAM}


                        </td>


                    `;

                }


                else {


                    html += `


                        <td>

                            -

                        </td>


                        <td>

                            0

                        </td>


                        <td>

                            -

                        </td>


                        <td>

                            0

                        </td>


                        <td>

                            -

                        </td>


                    `;

                }

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


    `;


    // =================================================
    // RUMUSAN ANGGOTA
    // =================================================


    html += `


        <br>


        <h3>

            RUMUSAN DUTY ANGGOTA

        </h3>


        <div class="table-wrapper">


        <table class="summary-table">


            <thead>


                <tr>


                    <th>

                        BIL

                    </th>


                    <th>

                        NO. SKB

                    </th>


                    <th>

                        NO. ANGGOTA

                    </th>


                    <th>

                        NAMA

                    </th>


                    <th>

                        JUMLAH DUTY

                    </th>


                    <th>

                        JUMLAH JAM KERJA

                    </th>


                    <th>

                        JUMLAH JAM KLM

                    </th>


                    <th>

                        JUMLAH OFFDAY

                    </th>


                    <th>

                        JUMLAH CUTI AM

                    </th>


                </tr>


            </thead>


            <tbody>


    `;


    anggotaPos.forEach(

        function (

            anggota,

            index

        ) {


            const rekodAnggota =

                semuaDuty.filter(

                    function (row) {


                        return (

                            String(

                                row.no_skb

                            )

                            ===

                            String(

                                anggota.no_skb

                            )

                        );

                    }

                );


            let jumlahDuty = 0;


            let jumlahJamKerja = 0;


            let jumlahKLM = 0;


            let jumlahOff = 0;


            let jumlahAM = 0;


            rekodAnggota.forEach(

                function (row) {


                    jumlahDuty++;


                    jumlahJamKerja +=

                        Number(

                            row.jam_kerja

                            ||

                            0

                        );


                    jumlahKLM +=

                        Number(

                            row.jam_klm

                            ||

                            0

                        );


                    jumlahOff +=

                        Number(

                            row.jam_offday_bertugas

                            ||

                            0

                        );


                    jumlahAM +=

                        Number(

                            row.jam_cutiam_bertugas

                            ||

                            0

                        );

                }

            );


            html += `


                <tr>


                    <td>

                        ${index + 1}

                    </td>


                    <td>

                        ${escapeHTML(

                            anggota.no_skb

                        )}

                    </td>


                    <td>

                        ${escapeHTML(

                            anggota.no_anggota

                        )}

                    </td>


                    <td>

                        ${escapeHTML(

                            anggota.nama

                        )}

                    </td>


                    <td>

                        ${jumlahDuty}

                    </td>


                    <td>

                        ${jumlahJamKerja}

                    </td>


                    <td>

                        ${jumlahKLM}

                    </td>


                    <td>

                        ${jumlahOff}

                    </td>


                    <td>

                        ${jumlahAM}

                    </td>


                </tr>


            `;

        }

    );


    html += `


            </tbody>


        </table>


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
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {


    if (

        value === null

        ||

        value === undefined

    ) {


        return "";

    }


    return String(value)

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
