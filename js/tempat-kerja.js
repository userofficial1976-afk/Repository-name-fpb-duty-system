/* =====================================================
   FPB DUTY SYSTEM
   KOD TEMPAT KERJA
===================================================== */


/* =====================================================
   LOAD PAGE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        muatkanPos();

        muatkanTempatKerja();

    }
);


/* =====================================================
   LOAD POS DARIPADA Data_Anggota
===================================================== */

async function muatkanPos() {

    const dropdown =
        document.getElementById("pos");


    if (!dropdown) {

        console.error(
            "Element #pos tidak dijumpai"
        );

        return;

    }


    dropdown.innerHTML = `

        <option value="">

            Sedang memuatkan Pos...

        </option>

    `;


    try {

        const {

            data,

            error

        } = await supabaseClient

            .from("Data_Anggota")

            .select("pos");


        if (error) {

            throw error;

        }


        const senaraiPos = [

            ...new Set(

                data

                    .map(

                        item => item.pos

                    )

                    .filter(

                        pos =>

                            pos !== null &&

                            pos !== undefined &&

                            String(pos).trim() !== ""

                    )

                    .map(

                        pos =>

                            String(pos).trim()

                    )

            )

        ];


        senaraiPos.sort();


        dropdown.innerHTML = `

            <option value="">

                -- Pilih Pos (Tempat Kerja) --

            </option>

        `;


        senaraiPos.forEach(

            function (pos) {

                const option =

                    document.createElement(

                        "option"

                    );


                option.value = pos;


                option.textContent = pos;


                dropdown.appendChild(

                    option

                );

            }

        );


    }

    catch (error) {

        console.error(

            "Gagal ambil Data_Anggota:",

            error

        );


        dropdown.innerHTML = `

            <option value="">

                Gagal memuatkan Pos

            </option>

        `;


        paparkanMesej(

            "Gagal ambil Pos: "

            + error.message,

            "error"

        );

    }

}


/* =====================================================
   SIMPAN DATA
===================================================== */

async function simpanTempatKerja() {


    const unit =

        document

            .getElementById("unit")

            .value

            .trim();


    const kodTK =

        document

            .getElementById("kodTempatKerja")

            .value

            .trim()

            .toUpperCase();


    const namaTempatKerja =

        document

            .getElementById("pos")

            .value

            .trim();


    if (!unit) {

        paparkanMesej(

            "Sila pilih Unit.",

            "error"

        );

        return;

    }


    if (!kodTK) {

        paparkanMesej(

            "Sila masukkan Kod TK.",

            "error"

        );

        return;

    }


    if (!namaTempatKerja) {

        paparkanMesej(

            "Sila pilih Pos.",

            "error"

        );

        return;

    }


    try {


        /* SEMAK DUPLIKAT */

        const {

            data: semakan,

            error: errorSemakan

        } = await supabaseClient

            .from(

                "kod_tempat_kerja"

            )

            .select(

                "id"

            )

            .eq(

                "unit",

                unit

            )

            .eq(

                "kod_tempat_kerja",

                kodTK

            );


        if (errorSemakan) {

            throw errorSemakan;

        }


        if (

            semakan &&

            semakan.length > 0

        ) {

            paparkanMesej(

                "Kod TK tersebut sudah wujud untuk Unit ini.",

                "error"

            );

            return;

        }


        /* =================================================
           PENTING:
           SIMPAN nama_tempat_kerja
           BUKAN pos
        ================================================= */


        const {

            error

        } = await supabaseClient

            .from(

                "kod_tempat_kerja"

            )

            .insert([

                {

                    unit:

                        unit,

                    kod_tempat_kerja:

                        kodTK,

                    nama_tempat_kerja:

                        namaTempatKerja,

                    status:

                        "Aktif"

                }

            ]);


        if (error) {

            throw error;

        }


        paparkanMesej(

            "Kod Tempat Kerja berjaya disimpan.",

            "success"

        );


        document

            .getElementById("unit")

            .value = "";


        document

            .getElementById("kodTempatKerja")

            .value = "";


        document

            .getElementById("pos")

            .value = "";


        muatkanTempatKerja();


    }

    catch (error) {


        console.error(

            "RALAT SIMPAN:",

            error

        );


        paparkanMesej(

            "Gagal simpan data: "

            + error.message,

            "error"

        );

    }

}


/* =====================================================
   PAPAR SENARAI
===================================================== */

async function muatkanTempatKerja() {


    const tbody =

        document

            .getElementById(

                "senaraiTempatKerja"

            );


    if (!tbody) {

        return;

    }


    try {


        const {

            data,

            error

        } = await supabaseClient

            .from(

                "kod_tempat_kerja"

            )

            .select(

                "id, unit, kod_tempat_kerja, nama_tempat_kerja, status"

            )

            .order(

                "unit",

                {

                    ascending:

                        true

                }

            );


        if (error) {

            throw error;

        }


        tbody.innerHTML = "";


        if (

            !data ||

            data.length === 0

        ) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="6">

                        Tiada data.

                    </td>

                </tr>

            `;

            return;

        }


        data.forEach(

            function (

                item,

                index

            ) {


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

                        ${escapeHTML(

                            item.unit

                        )}

                    </td>


                    <td>

                        <strong>

                            ${escapeHTML(

                                item.kod_tempat_kerja

                            )}

                        </strong>

                    </td>


                    <td>

                        ${escapeHTML(

                            item.nama_tempat_kerja

                        )}

                    </td>


                    <td>

                        ${escapeHTML(

                            item.status

                        )}

                    </td>


                    <td>

                        <button

                            class="btn-danger"

                            onclick=

                            "padamTempatKerja('${item.id}')"

                        >

                            🗑 Padam

                        </button>

                    </td>

                `;


                tbody.appendChild(

                    tr

                );

            }

        );

    }

    catch (error) {


        console.error(

            "Gagal memuatkan data:",

            error

        );


        paparkanMesej(

            "Gagal memuatkan senarai: "

            + error.message,

            "error"

        );

    }

}


/* =====================================================
   PADAM DATA
===================================================== */

async function padamTempatKerja(id) {


    if (

        !confirm(

            "Adakah anda pasti mahu memadam data ini?"

        )

    ) {

        return;

    }


    const {

        error

    } = await supabaseClient

        .from(

            "kod_tempat_kerja"

        )

        .delete()

        .eq(

            "id",

            id

        );


    if (error) {

        paparkanMesej(

            "Gagal padam data: "

            + error.message,

            "error"

        );

        return;

    }


    paparkanMesej(

        "Data berjaya dipadam.",

        "success"

    );


    muatkanTempatKerja();

}


/* =====================================================
   MESEJ
===================================================== */

function paparkanMesej(

    mesej,

    jenis

) {


    const div =

        document

            .getElementById(

                "mesej"

            );


    if (!div) {

        return;

    }


    div.className = jenis;


    div.textContent = mesej;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {


    if (

        value === null ||

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
