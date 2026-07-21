// =====================================================
// DATA MEMORY
// =====================================================

let semuaAnggota = [];


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


        await muatSenaraiPos();


        await muatSenaraiKodTempatKerja();


        await muatSenaraiKodDuty();


        paparLaporan();

    }
);


// =====================================================
// MUAT ANGGOTA
// =====================================================

async function muatAnggota() {


    const { data, error } =

        await supabaseClient

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
// MUAT SENARAI POS
// =====================================================

async function muatSenaraiPos() {


    const { data, error } =

        await supabaseClient

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

        return;

    }


    const posUnik =

        [

            ...new Set(

                (data || [])

                    .map(
                        x => x.pos
                    )

                    .filter(
                        Boolean
                    )

            )

        ];


    posUnik.sort();


    const select =

        document
            .getElementById(
                "filterPos"
            );


    select.innerHTML = `

        <option value="">

            Semua Pos

        </option>

    `;


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


            select
                .appendChild(
                    option
                );

        }

    );

}


// =====================================================
// MUAT KOD TEMPAT KERJA
// =====================================================

async function muatSenaraiKodTempatKerja() {


    const { data, error } =

        await supabaseClient

            .from(
                "jadual_duty"
            )

            .select(
                "kod_tempat_kerja"
            );


    if (error) {

        console.error(
            "RALAT KOD TEMPAT KERJA:",
            error
        );

        return;

    }


    const kodUnik =

        [

            ...new Set(

                (data || [])

                    .map(
                        x => x.kod_tempat_kerja
                    )

                    .filter(
                        Boolean
                    )

            )

        ];


    kodUnik.sort();


    const select =

        document
            .getElementById(
                "filterKodTempatKerja"
            );


    select.innerHTML = `

        <option value="">

            Semua Kod Tempat Kerja

        </option>

    `;


    kodUnik.forEach(

        function (kod) {


            const option =

                document
                    .createElement(
                        "option"
                    );


            option.value =
                kod;


            option.textContent =
                kod;


            select
                .appendChild(
                    option
                );

        }

    );

}


// =====================================================
// MUAT KOD DUTY
// =====================================================

async function muatSenaraiKodDuty() {


    const { data, error } =

        await supabaseClient

            .from(
                "jadual_duty"
            )

            .select(
                "kod_dutyy"
            );


    if (error) {

        console.error(
            "RALAT KOD DUTY:",
            error
        );

        return;

    }


    const kodUnik =

        [

            ...new Set(

                (data || [])

                    .map(
                        x => x.kod_dutyy
                    )

                    .filter(
                        Boolean
                    )

            )

        ];


    kodUnik.sort();


    const select =

        document
            .getElementById(
                "filterKodDuty"
            );


    select.innerHTML = `

        <option value="">

            Semua Kod Duty

        </option>

    `;


    kodUnik.forEach(

        function (kod) {


            const option =

                document
                    .createElement(
                        "option"
                    );


            option.value =
                kod;


            option.textContent =
                kod;


            select
                .appendChild(
                    option
                );

        }

    );

}


// =====================================================
// PAPAR LAPORAN
// =====================================================

async function paparLaporan() {


    const tarikhMula =

        document
            .getElementById(
                "tarikhMula"
            )
            .value;


    const tarikhAkhir =

        document
            .getElementById(
                "tarikhAkhir"
            )
            .value;


    const filterPos =

        document
            .getElementById(
                "filterPos"
            )
            .value;


    const filterKodTempatKerja =

        document
            .getElementById(
                "filterKodTempatKerja"
            )
            .value;


    const filterKodDuty =

        document
            .getElementById(
                "filterKodDuty"
            )
            .value;


    const cariNama =

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


    if (tarikhMula) {

        query =

            query.gte(
                "tarikh",
                tarikhMula
            );

    }


    if (tarikhAkhir) {

        query =

            query.lte(
                "tarikh",
                tarikhAkhir
            );

    }


    if (filterPos) {

        query =

            query.eq(
                "pos",
                filterPos
            );

    }


    if (filterKodTempatKerja) {

        query =

            query.eq(
                "kod_tempat_kerja",
                filterKodTempatKerja
            );

    }


    if (filterKodDuty) {

        query =

            query.eq(
                "kod_dutyy",
                filterKodDuty
            );

    }


    const { data, error } =

        await query;


    if (error) {

        console.error(
            "RALAT LAPORAN:",
            error
        );

        return;

    }


    const filtered =

        (data || [])

            .filter(

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


                    return nama
                        .includes(
                            cariNama
                        );

                }

            );


    paparJadual(
        filtered
    );


    kiraJumlah(
        filtered
    );

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

                <td colspan="14">

                    Tiada rekod dijumpai.

                </td>

            </tr>

        `;


        return;

    }


    data.forEach(

        function (row, index) {


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
                        (
                            anggota
                            &&
                            anggota.no_anggota
                        )
                        || ""
                    }

                </td>


                <td>

                    ${
                        (
                            anggota
                            &&
                            anggota.nama
                        )
                        || ""
                    }

                </td>


                <td>

                    ${
                        (
                            anggota
                            &&
                            anggota.pangkat
                        )
                        || ""
                    }

                </td>


                <td>

                    ${row.pos || ""}

                </td>


                <td>

                    <span class="badge">

                        ${
                            row.kod_tempat_kerja
                            || ""
                        }

                    </span>

                </td>


                <td>

                    ${
                        row.tempat_kerja
                        || ""
                    }

                </td>


                <td>

                    <span class="badge">

                        ${
                            row.kod_dutyy
                            || ""
                        }

                    </span>

                </td>


                <td>

                    ${
                        row.waktu_tugasan
                        || ""
                    }

                </td>


                <td>

                    ${
                        row.jam_kerja
                        || 0
                    }

                </td>


                <td>

                    ${
                        row.jam_klm
                        || 0
                    }

                </td>


                <td>

                    ${
                        row.ketua_pos
                        || ""
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
// KIRA JUMLAH
// =====================================================

function kiraJumlah(
    data
) {


    document
        .getElementById(
            "jumlahDuty"
        )
        .textContent =

        data.length;


    const jumlahJamKerja =

        data.reduce(

            function (
                jumlah,
                row
            ) {

                return jumlah
                    + Number(
                        row.jam_kerja
                    || 0
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
                    + Number(
                        row.jam_klm
                    || 0
                    );

            },

            0

        );


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

            + "T00:00:00"

        );


    return date.toLocaleDateString(
        "ms-MY"
    );

}
