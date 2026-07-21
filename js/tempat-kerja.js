```javascript
// =====================================================
// DATA MEMORY
// =====================================================

let semuaTempatKerja = [];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "TEMPAT KERJA JS BERJAYA DIMUAT"
        );

        await muatSenaraiTempatKerja();

        await paparSenaraiTempatKerja();

    }
);


// =====================================================
// MUAT SENARAI TEMPAT KERJA
// DARIPADA Data_Anggota.pos
// =====================================================

async function muatSenaraiTempatKerja() {


    const { data, error } =

        await supabaseClient

            .from(
                "Data_Anggota"
            )

            .select(
                "pos"
            )

            .eq(
                "status",
                "Aktif"
            );


    if (error) {

        console.error(
            "RALAT AMBIL POS:",
            error
        );

        paparMesej(
            "Gagal ambil senarai pos: "
            + error.message,
            "error"
        );

        return;

    }


    const senaraiPos =

        [

            ...new Set(

                (data || [])

                    .map(

                        function (x) {

                            return x.pos;

                        }

                    )

                    .filter(

                        function (pos) {

                            return pos
                            &&
                            pos.trim()
                            !== "";

                        }

                    )

            )

        ];


    senaraiPos.sort();


    const select =

        document
            .getElementById(
                "namaTempatKerja"
            );


    if (!select) {

        console.error(
            "ID namaTempatKerja tidak dijumpai"
        );

        return;

    }


    select.innerHTML = `

        <option value="">

            -- Pilih Tempat Kerja --

        </option>

    `;


    senaraiPos.forEach(

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


    console.log(
        "Jumlah tempat kerja:",
        senaraiPos.length
    );

}


// =====================================================
// SIMPAN KOD TEMPAT KERJA
// =====================================================

async function simpanTempatKerja() {


    const kod =

        document
            .getElementById(
                "kodTempatKerja"
            )
            .value
            .trim();


    const nama =

        document
            .getElementById(
                "namaTempatKerja"
            )
            .value
            .trim();


    if (

        !kod
        ||
        !nama

    ) {

        paparMesej(

            "Sila lengkapkan Kod Tempat Kerja dan Nama Tempat Kerja.",

            "error"

        );

        return;

    }


    const { error } =

        await supabaseClient

            .from(
                "kod_tempat_kerja"
            )

            .insert({

                kod_tempat_kerja:
                    kod,

                nama_tempat_kerja:
                    nama,

                status:
                    "Aktif"

            });


    if (error) {

        console.error(
            "RALAT SIMPAN:",
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

        "Kod tempat kerja berjaya disimpan.",

        "success"

    );


    document
        .getElementById(
            "kodTempatKerja"
        )
        .value =
        "";


    document
        .getElementById(
            "namaTempatKerja"
        )
        .value =
        "";


    await paparSenaraiTempatKerja();

}


// =====================================================
// PAPAR SENARAI KOD TEMPAT KERJA
// =====================================================

async function paparSenaraiTempatKerja() {


    const { data, error } =

        await supabaseClient

            .from(
                "kod_tempat_kerja"
            )

            .select(
                "*"
            )

            .order(

                "kod_tempat_kerja",

                {

                    ascending:
                        true

                }

            );


    if (error) {

        console.error(
            "RALAT SENARAI:",
            error
        );


        paparMesej(

            "Gagal ambil senarai: "
            + error.message,

            "error"

        );

        return;

    }


    semuaTempatKerja =
        data || [];


    const tbody =

        document
            .getElementById(
                "senaraiTempatKerja"
            );


    if (!tbody) {

        console.error(
            "ID senaraiTempatKerja tidak dijumpai"
        );

        return;

    }


    tbody.innerHTML =
        "";


    if (

        semuaTempatKerja.length
        ===
        0

    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="4">

                    Tiada kod tempat kerja.

                </td>

            </tr>

        `;

        return;

    }


    semuaTempatKerja.forEach(

        function (
            tempat,
            index
        ) {


            const tr =

                document
                    .createElement(
                        "tr"
                    );


            tr.innerHTML = `

                <td>

                    ${
                        index + 1
                    }

                </td>


                <td>

                    <span class="badge">

                        ${
                            tempat
                                .kod_tempat_kerja
                            || ""

                        }

                    </span>

                </td>


                <td>

                    ${
                        tempat
                            .nama_tempat_kerja
                        || ""

                    }

                </td>


                <td>

                    ${
                        tempat.status
                        || ""

                    }

                </td>


                <td>

                    <button

                        class="btn-danger"

                        onclick="

                            padamTempatKerja(

                                '${

                                    tempat
                                        .kod_tempat_kerja

                                }'

                            )

                        "

                    >

                        🗑️ Padam

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
// PADAM KOD TEMPAT KERJA
// =====================================================

async function padamTempatKerja(
    kod
) {


    if (

        !confirm(

            "Padam kod tempat kerja ini?"

        )

    ) {

        return;

    }


    const { error } =

        await supabaseClient

            .from(
                "kod_tempat_kerja"
            )

            .delete()

            .eq(

                "kod_tempat_kerja",

                kod

            );


    if (error) {

        console.error(
            "RALAT PADAM:",
            error
        );


        paparMesej(

            "Gagal padam: "
            + error.message,

            "error"

        );

        return;

    }


    paparMesej(

        "Kod tempat kerja berjaya dipadam.",

        "success"

    );


    await paparSenaraiTempatKerja();

}


// =====================================================
// PAPAR MESEJ
// =====================================================

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

        alert(
            mesej
        );

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
```
