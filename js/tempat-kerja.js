/* =====================================================
   FPB DUTY SYSTEM
   KOD TEMPAT KERJA
   WILAYAH TERENGGANU
===================================================== */


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        muatkanPos();

        muatkanTempatKerja();

    }
);


/* =====================================================
   MUATKAN POS DARIPADA Data_Anggota
===================================================== */

async function muatkanPos() {

    const dropdownPos =
        document.getElementById("pos");


    if (!dropdownPos) {

        console.error(
            "Dropdown #pos tidak dijumpai."
        );

        return;

    }


    dropdownPos.innerHTML = `

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


        console.log(
            "Data Pos daripada Data_Anggota:",
            data
        );


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


        senaraiPos.sort(

            function (a, b) {

                return a.localeCompare(b);

            }

        );


        dropdownPos.innerHTML = `

            <option value="">

                -- Pilih Pos (Tempat Kerja) --

            </option>

        `;


        if (

            senaraiPos.length === 0

        ) {


            dropdownPos.innerHTML += `

                <option value="">

                    Tiada data Pos

                </option>

            `;


            return;

        }


        senaraiPos.forEach(

            function (pos) {


                const option =

                    document.createElement(

                        "option"

                    );


                option.value = pos;


                option.textContent = pos;


                dropdownPos.appendChild(

                    option

                );

            }

        );


    }


    catch (error) {


        console.error(

            "GAGAL MEMUATKAN POS:",

            error

        );


        dropdownPos.innerHTML = `

            <option value="">

                Gagal memuatkan Pos

            </option>

        `;


        paparkanMesej(

            "Gagal ambil Pos daripada Data_Anggota: "

            + error.message,

            "error"

        );

    }

}


/* =====================================================
   SIMPAN KOD TEMPAT KERJA
===================================================== */

async function simpanTempatKerja() {


    const unit =

        document

            .getElementById(

                "unit"

            )

            .value

            .trim();


    const kod =

        document

            .getElementById(

                "kodTempatKerja"

            )

            .value

            .trim()

            .toUpperCase();


    const pos =

        document

            .getElementById(

                "pos"

            )

            .value

            .trim();


    if (!unit) {


        paparkanMesej(

            "Sila pilih Unit.",

            "error"

        );


        return;

    }


    if (!kod) {


        paparkanMesej(

            "Sila masukkan Kod TK.",

            "error"

        );


        return;

    }


    if (!pos) {


        paparkanMesej(

            "Sila pilih Pos (Tempat Kerja).",

            "error"

        );


        return;

    }


    try {


        const {

            data: dataSediaAda,

            error: errorSemak

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

                kod

            );


        if (errorSemak) {

            throw errorSemak;

        }


        if (

            dataSediaAda &&

            dataSediaAda.length > 0

        ) {


            paparkanMesej(

                "Kod TK ini sudah wujud untuk Unit tersebut.",

                "error"

            );


            return;

        }


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

                        kod,

                    pos:

                        pos,

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

            .getElementById(

                "unit"

            )

            .value = "";


        document

            .getElementById(

                "kodTempatKerja"

            )

            .value = "";


        document

            .getElementById(

                "pos"

            )

            .value = "";


        muatkanTempatKerja();


    }


    catch (error) {


        console.error(

            "Gagal simpan Kod TK:",

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
   PAPAR SENARAI KOD TEMPAT KERJA
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


    tbody.innerHTML = `

        <tr>

            <td colspan="6">

                Sedang memuatkan...

            </td>

        </tr>

    `;


    try {


        const {

            data,

            error

        } = await supabaseClient

            .from(

                "kod_tempat_kerja"

            )

            .select(

                "*"

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


        if (

            !data ||

            data.length === 0

        ) {


            tbody.innerHTML = `

                <tr>

                    <td colspan="6">

                        Tiada data Kod Tempat Kerja.

                    </td>

                </tr>

            `;


            return;

        }


        tbody.innerHTML = "";


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

                        <span

                            class="badge"

                        >

                            ${escapeHTML(

                                item.kod_tempat_kerja

                            )}

                        </span>

                    </td>


                    <td>

                        ${escapeHTML(

                            item.pos

                        )}

                    </td>


                    <td>

                        <span

                            class="badge"

                        >

                            ${escapeHTML(

                                item.status

                            )}

                        </span>

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

            "Gagal memuatkan senarai:",

            error

        );


        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    Gagal memuatkan data.

                </td>

            </tr>

        `;


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


    const sah =

        confirm(

            "Adakah anda pasti mahu memadam data ini?"

        );


    if (!sah) {

        return;

    }


    try {


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

            throw error;

        }


        paparkanMesej(

            "Data berjaya dipadam.",

            "success"

        );


        muatkanTempatKerja();


    }


    catch (error) {


        paparkanMesej(

            "Gagal padam data: "

            + error.message,

            "error"

        );

    }

}


/* =====================================================
   PAPAR MESEJ
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


    setTimeout(

        function () {


            div.textContent = "";


            div.className = "";


        },

        5000

    );

}


/* =====================================================
   KESELAMATAN PAPARAN HTML
===================================================== */

function escapeHTML(

    value

) {


    if (

        value === null ||

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
