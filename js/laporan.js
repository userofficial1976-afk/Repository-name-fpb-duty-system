// =====================================================
// DATA MEMORY
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
            "LAPORAN JS BERJAYA DIMUAT"
        );


        await muatAnggota();

        await muatDuty();

        muatTahun();

        muatPos();

        paparLaporan();

    }
);


// =====================================================
// MUAT ANGGOTA
// =====================================================

async function muatAnggota() {


    const { data, error } =
        await supabaseClient

            .from("Data_Anggota")

            .select(`
                no_skb,
                no_anggota,
                nama,
                pangkat,
                pos,
                unit,
                ketua_pos,
                status
            `);


    if (error) {

        console.error(
            "RALAT ANGGOTA:",
            error
        );

        return;
    }


    semuaAnggota =
        data || [];

}


// =====================================================
// MUAT SEMUA DUTY
// =====================================================

async function muatDuty() {


    const { data, error } =
        await supabaseClient

            .from("jadual_duty")

            .select("*")

            .order(
                "tarikh",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "RALAT DUTY:",
            error
        );

        return;
    }


    semuaDuty =
        data || [];

}


// =====================================================
// MUAT TAHUN
// =====================================================

function muatTahun() {


    const tahunUnik =
        [

            ...new Set(

                semuaDuty

                    .map(function (row) {

                        return row.tahun;

                    })

                    .filter(Boolean)

            )

        ];


    tahunUnik.sort(
        function (a, b) {

            return b - a;

        }
    );


    const selectTahun =
        document
            .getElementById(
                "filterTahun"
            );


    tahunUnik.forEach(
        function (tahun) {


            const option =
                document
                    .createElement(
                        "option"
                    );


            option.value =
                tahun;


            option.textContent =
                tahun;


            selectTahun
                .appendChild(
                    option
                );

        }
    );

}


// =====================================================
// MUAT POS
// =====================================================

function muatPos() {


    const posUnik =
        [

            ...new Set(

                semuaDuty

                    .map(function (row) {

                        return row.pos;

                    })

                    .filter(Boolean)

            )

        ];


    posUnik.sort();


    const selectPos =
        document
            .getElementById(
                "filterPos"
            );


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

}


// =====================================================
// PAPAR LAPORAN
// =====================================================

function paparLaporan() {


    const bulan =
        document
            .getElementById(
                "filterBulan"
            )
            .value;


    const tahun =
        document
            .getElementById(
                "filterTahun"
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


    const filtered =
        semuaDuty.filter(
            function (row) {


                const anggota =
                    semuaAnggota.find(
                        function (x) {

                            return String(
                                x.no_skb
                            )
                            ===
                            String(
                                row.no_skb
                            );

                        }
                    );


                const nama =
                    anggota
                    &&
                    anggota.nama
                    ?

                    anggota.nama
                        .toLowerCase()

                    :

                    "";


                const lulusBulan =
                    !bulan
                    ||
                    String(
                        row.bulan
                    )
                    ===
                    String(
                        bulan
                    );


                const lulusTahun =
                    !tahun
                    ||
                    String(
                        row.tahun
                    )
                    ===
                    String(
                        tahun
                    );


                const lulusPos =
                    !pos
                    ||
                    row.pos
                    ===
                    pos;


                const lulusNama =
                    nama.includes(
                        cari
                    );


                return (

                    lulusBulan
                    &&
                    lulusTahun
                    &&
                    lulusPos
                    &&
                    lulusNama

                );

            }
        );


    kiraStatistik(
        filtered
    );


    paparJadual(
        filtered
    );

}


// =====================================================
// KIRA STATISTIK
// =====================================================

function kiraStatistik(
    data
) {


    const jumlahDuty =
        data.length;


    const jumlahJamKerja =
        data.reduce(
            function (
                jumlah,
                row
            ) {

                return jumlah
                    +
                    Number(
                        row.jam_kerja
                        ||
                        0
                    );

            },
            0
        );


    const jumlahJamKlm =
        data.reduce(
            function (
                jumlah,
                row
            ) {

                return jumlah
                    +
                    Number(
                        row.jam_klm
                        ||
                        0
                    );

            },
            0
        );


    document
        .getElementById(
            "jumlahDuty"
        )
        .textContent =
        jumlahDuty;


    document
        .getElementById(
            "jumlahJamKerja"
        )
        .textContent =
        jumlahJamKerja;


    document
        .getElementById(
            "jumlahJamKlm"
        )
        .textContent =
        jumlahJamKlm;

}


// =====================================================
// PAPAR JADUAL
// =====================================================

function paparJadual(
    data
) {


    const tbody =
        document
            .getElementById(
                "senaraiLaporan"
            );


    tbody.innerHTML =
        "";


    if (
        data.length
        ===
        0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="12"
                >

                    Tiada rekod dijumpai.

                </td>

            </tr>

        `;


        return;

    }


    data.forEach(
        function (
            row,
            index
        ) {


            const anggota =
                semuaAnggota.find(
                    function (x) {

                        return String(
                            x.no_skb
                        )
                        ===
                        String(
                            row.no_skb
                        );

                    }
                );


            const tr =
                document
                    .createElement(
                        "tr"
                    );


            tr.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>
                    ${formatTarikh(
                        row.tarikh
                    )}
                </td>


                <td>
                    ${row.no_skb || ""}
                </td>


                <td>
                    ${
                        anggota
                        &&
                        anggota.no_anggota
                        ||
                        ""
                    }
                </td>


                <td>
                    ${
                        anggota
                        &&
                        anggota.nama
                        ||
                        ""
                    }
                </td>


                <td>
                    ${
                        anggota
                        &&
                        anggota.pangkat
                        ||
                        ""
                    }
                </td>


                <td>
                    ${row.pos || ""}
                </td>


                <td>

                    <span
                        class="badge"
                    >

                        ${
                            row.kod_dutyy
                            ||
                            ""
                        }

                    </span>

                </td>


                <td>
                    ${
                        row.waktu_tugasan
                        ||
                        ""
                    }
                </td>


                <td>
                    ${
                        row.jam_kerja
                        ||
                        0
                    }
                </td>


                <td>
                    ${
                        row.jam_klm
                        ||
                        0
                    }
                </td>


                <td>
                    ${
                        row.Ketua_Pos
                        ||
                        row.ketua_pos
                        ||
                        row.dikemaskini_oleh
                        ||
                        ""
                    }
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
// FORMAT TARIKH
// =====================================================

function formatTarikh(
    tarikh
) {


    if (
        !tarikh
    ) {

        return "";

    }


    const date =
        new Date(
            tarikh
            +
            "T00:00:00"
        );


    return date
        .toLocaleDateString(
            "ms-MY"
        );

}
