// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "TEMPAT KERJA JS BERJAYA"
        );


        await muatSenaraiPos();


        await paparSenaraiTempatKerja();

    }
);


// =====================================================
// MUAT POS DARIPADA Data_Anggota
// =====================================================

async function muatSenaraiPos() {


    const result =

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


    const data =
        result.data;


    const error =
        result.error;


    if (error) {

        console.error(
            "RALAT DATA ANGGOTA:",
            error
        );

        paparMesej(
            error.message,
            "error"
        );

        return;

    }


    const senaraiPos = [];


    (data || []).forEach(

        function (item) {


            if (

                item.pos

                &&

                !senaraiPos.includes(
                    item.pos
                )

            ) {

                senaraiPos.push(
                    item.pos
                );

            }

        }

    );


    senaraiPos.sort();


    const dropdown =

        document
            .getElementById(
                "namaTempatKerja"
            );


    dropdown.innerHTML = `

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


            dropdown
                .appendChild(
                    option
                );

        }

    );


    console.log(
        "Jumlah POS:",
        senaraiPos.length
    );

}


// =====================================================
// SIMPAN
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
            .value;


    if (

        kod === ""

        ||

        nama === ""

    ) {

        paparMesej(

            "Sila isi Kod dan pilih Nama Tempat Kerja.",

            "error"

        );

        return;

    }


    const result =

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


    if (result.error) {

        console.error(
            "RALAT SIMPAN:",
            result.error
        );


        paparMesej(

            "Gagal simpan: "

            +

            result.error.message,

            "error"

        );

        return;

    }


    paparMesej(

        "Kod Tempat Kerja berjaya disimpan.",

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
// PAPAR SENARAI
// =====================================================

async function paparSenaraiTempatKerja() {


    const result =

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


    if (result.error) {

        console.error(
            "RALAT PAPAR:",
            result.error
        );

        return;

    }


    const data =
        result.data;


    const tbody =

        document
            .getElementById(
                "senaraiTempatKerja"
            );


    tbody.innerHTML =
        "";


    if (

        !data

        ||

        data.length === 0

    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="5">

                    Tiada data.

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
                            row
                                .kod_tempat_kerja

                        }

                    </span>

                </td>


                <td>

                    ${
                        row
                            .nama_tempat_kerja

                    }

                </td>


                <td>

                    ${
                        row.status

                    }

                </td>


                <td>

                    <button

                        class="btn-danger"

                        onclick="

                            padamTempatKerja(

                                '${

                                    row
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
// PADAM
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


    const result =

        await supabaseClient

            .from(
                "kod_tempat_kerja"
            )

            .delete()

            .eq(

                "kod_tempat_kerja",

                kod

            );


    if (result.error) {

        paparMesej(

            "Gagal padam: "

            +

            result.error.message,

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
// MESEJ
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
