// =====================================================
// DATA
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
// ISI TAHUN
// =====================================================

function isiTahun() {

    const select =
        document.getElementById("tahun");

    const tahunSemasa =
        new Date().getFullYear();

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

        select.appendChild(option);

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
// MUAT ANGGOTA
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
            nama_ketua_unit,
            ketua_pos,
            status
        `)
        .eq("status", "Aktif")
        .order("nama", {
            ascending: true
        });

    if (error) {

        console.error(
            "RALAT ANGGOTA:",
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

    const select =
        document.getElementById("pos");

    select.innerHTML = `

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

            select.appendChild(option);

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


    const {
        data,
        error
    } = await supabaseClient
        .from("jadual_duty")
        .select("*")
        .eq("bulan", bulan)
        .eq("tahun", tahun)
        .eq("nama_pos_asal", pos)
        .order("tarikh", {
            ascending: true
        });

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
        anggotaPertama.nama_ketua_unit
        || "-";


    const ketuaPos =
        anggotaPertama.ketua_pos
        || "-";


    let html = `

        <div class="info-header">

            <h2>

                ANGGARAN DUTY

                ${pos}

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
                        ${kawasan}
                    </td>

                </tr>


                <tr>

                    <td>
                        UNIT
                    </td>

                    <td>
                        ${unit}
                    </td>

                </tr>


                <tr>

                    <td>
                        NAMA POS
                    </td>

                    <td>
                        ${pos}
                    </td>

                </tr>


                <tr>

                    <td>
                        NAMA KETUA UNIT
                    </td>

                    <td>
                        ${ketuaUnit}
                    </td>

                </tr>


                <tr>

                    <td>
                        NAMA KETUA POS
                    </td>

                    <td>
                        ${ketuaPos}
                    </td>

                </tr>

            </table>

        </div>


        <div class="table-wrapper">

        <table class="jadual-bulanan">

            <thead>

                <tr>

                    <th
                        rowspan="2"
                    >

                        TARIKH

                    </th>


                    <th
                        rowspan="2"
                    >

                        HARI

                    </th>

    `;


    anggotaPos.forEach(
        function (anggota) {

            html += `

                <th
                    colspan="4"
                    class="nama-anggota"
                >

                    ${anggota.nama}

                    <br>

                    <small>

                        ${anggota.no_anggota}

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
                    KOD
                </th>

                <th>
                    JAM
                </th>

                <th>
                    TEMPAT
                </th>

                <th>
                    KLM
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
            + String(bulan).padStart(2, "0")
            + "-"
            + String(hari).padStart(2, "0");


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


                    const kod =
                        duty.kod_waktu_kerja
                        || "-";


                    const jam =
                        duty.jam_offday_bertugas
                        || duty.jam_cutiam_bertugas
                        || 0;


                    const tempat =
                        duty.kod_tempat_kerja
                        || "-";


                    const klm =
                        duty.jam_klm
                        || 0;


                    html += `

                        <td
                            class="kod"
                        >

                            ${kod}

                        </td>


                        <td>

                            ${jam}

                        </td>


                        <td>

                            ${tempat}

                        </td>


                        <td>

                            ${klm}

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

        <table>

            <thead>

                <tr>

                    <th>
                        BIL
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
        function (anggota, index) {


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


            let jumlahDuty =
                0;


            let jumlahKlm =
                0;


            let jumlahOff =
                0;


            let jumlahAm =
                0;


            rekodAnggota.forEach(
                function (row) {


                    jumlahDuty++;


                    jumlahKlm +=
                        Number(
                            row.jam_klm
                            || 0
                        );


                    jumlahOff +=
                        Number(
                            row.jam_offday_bertugas
                            || 0
                        );


                    jumlahAm +=
                        Number(
                            row.jam_cutiam_bertugas
                            || 0
                        );

                }
            );


            html += `

                <tr>

                    <td>

                        ${index + 1}

                    </td>


                    <td>

                        ${anggota.no_anggota}

                    </td>


                    <td>

                        ${anggota.nama}

                    </td>


                    <td>

                        ${jumlahDuty}

                    </td>


                    <td>

                        ${jumlahKlm}

                    </td>


                    <td>

                        ${jumlahOff}

                    </td>


                    <td>

                        ${jumlahAm}

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
        .getElementById("laporan")
        .innerHTML = html;

}
