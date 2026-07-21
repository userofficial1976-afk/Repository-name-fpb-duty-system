// =====================================================
// DATA
// =====================================================

let tempatKerjaEditId = null;


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "TEMPAT KERJA JS BERJAYA DIMUAT"
        );

        muatTempatKerja();

    }
);


// =====================================================
// MUAT SENARAI TEMPAT KERJA
// =====================================================

async function muatTempatKerja() {

    const tbody =
        document.getElementById(
            "senaraiTempatKerja"
        );


    tbody.innerHTML = `
        <tr>
            <td colspan="6">
                Memuatkan data...
            </td>
        </tr>
    `;


    const { data, error } =
        await supabaseClient

            .from(
                "kod_tempat_kerja"
            )

            .select("*")

            .order(
                "kod_tempat_kerja",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "RALAT:",
            error
        );


        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    Gagal ambil data:
                    ${error.message}
                </td>
            </tr>
        `;


        return;

    }


    tbody.innerHTML = "";


    if (
        !data
        ||
        data.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    Tiada data tempat kerja.
                </td>
            </tr>
        `;


        return;

    }


    data.forEach(
        function (row, index) {

            const tr =
                document.createElement(
                    "tr"
                );


            const statusClass =
                row.status === "Aktif"
                    ? "badge"
                    : "badge badge-inactive";


            tr.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${row.kod_tempat_kerja}
                    </strong>
                </td>

                <td>
                    ${row.nama_tempat_kerja}
                </td>

                <td>

                    <span
                        class="${statusClass}"
                    >

                        ${row.status}

                    </span>

                </td>

                <td>
                    ${
                        row.dicipta_pada
                        ? new Date(
                            row.dicipta_pada
                        ).toLocaleDateString(
                            "ms-MY"
                        )
                        : ""
                    }
                </td>

                <td>

                    <button
                        class="btn-edit"
                        onclick="
                            editTempatKerja(
                                '${row.id}',
                                '${row.kod_tempat_kerja}',
                                '${row.nama_tempat_kerja}'
                            )
                        "
                    >

                        ✏️ Edit

                    </button>

                    <button
                        class="btn-danger"
                        onclick="
                            padamTempatKerja(
                                '${row.id}'
                            )
                        "
                    >

                        🗑️ Padam

                    </button>

                </td>

            `;


            tbody.appendChild(tr);

        }
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
            .value
            .trim();


    if (
        !kod
        ||
        !nama
    ) {

        paparMesej(
            "Sila isi Kod dan Nama Tempat Kerja.",
            "error"
        );


        return;

    }


    let result;


    if (
        tempatKerjaEditId
    ) {


        result =
            await supabaseClient

                .from(
                    "kod_tempat_kerja"
                )

                .update({

                    kod_tempat_kerja:
                        kod,

                    nama_tempat_kerja:
                        nama

                })

                .eq(
                    "id",
                    tempatKerjaEditId
                );


    } else {


        result =
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

    }


    if (
        result.error
    ) {

        paparMesej(
            "Gagal simpan: "
            + result.error.message,
            "error"
        );


        return;

    }


    paparMesej(
        tempatKerjaEditId
            ? "Data berjaya dikemaskini."
            : "Kod tempat kerja berjaya disimpan.",
        "success"
    );


    kosongkanBorang();


    muatTempatKerja();

}


// =====================================================
// EDIT
// =====================================================

function editTempatKerja(
    id,
    kod,
    nama
) {


    tempatKerjaEditId =
        id;


    document
        .getElementById(
            "kodTempatKerja"
        )
        .value =
        kod;


    document
        .getElementById(
            "namaTempatKerja"
        )
        .value =
        nama;


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


// =====================================================
// PADAM
// =====================================================

async function padamTempatKerja(
    id
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
                "id",
                id
            );


    if (
        error
    ) {

        paparMesej(
            "Gagal padam: "
            + error.message,
            "error"
        );


        return;

    }


    paparMesej(
        "Data berjaya dipadam.",
        "success"
    );


    muatTempatKerja();

}


// =====================================================
// KOSONGKAN BORANG
// =====================================================

function kosongkanBorang() {


    tempatKerjaEditId =
        null;


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
