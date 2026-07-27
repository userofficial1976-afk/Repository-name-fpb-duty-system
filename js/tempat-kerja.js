/* =====================================================
   FPB DUTY SYSTEM
   KOD TEMPAT KERJA
   VERSI PENUH — MULTI POS
===================================================== */


/* =====================================================
   TABLE DATABASE
===================================================== */

const TABLE_TEMPAT_KERJA =
    "kod_tempat_kerja";

const TABLE_ANGGOTA =
    "Data_Anggota";


/* =====================================================
   GLOBAL
===================================================== */

let posDipilih = [];

let dataTempatKerja = [];

let idSedangEdit = null;


/* =====================================================
   LOAD PAGE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        muatkanPos();

        muatkanTempatKerja();


        const unit =
            document.getElementById(
                "unit"
            );


        if (unit) {

            unit.addEventListener(
                "change",
                function () {

                    posDipilih = [];

                    paparPosDipilih();

                    muatkanPos();

                }
            );

        }

    }
);


/* =====================================================
   LOAD SENARAI POS
   SUMBER: Data_Anggota.pos
===================================================== */

async function muatkanPos() {


    const dropdown =
        document.getElementById(
            "pos"
        );


    if (!dropdown) {

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

            .from(

                TABLE_ANGGOTA

            )

            .select(

                "pos"

            );


        if (

            error

        ) {

            throw error;

        }


        const senaraiPos =

            [

                ...new Set(

                    (data || [])

                        .map(

                            row =>

                                row.pos

                        )

                        .filter(

                            pos =>

                                pos !== null &&

                                pos !== undefined &&

                                String(

                                    pos

                                )

                                .trim()

                                !== ""

                        )

                        .map(

                            pos =>

                                String(

                                    pos

                                )

                                .trim()

                        )

                )

            ];


        senaraiPos.sort(

            function (

                a,

                b

            ) {

                return a.localeCompare(

                    b,

                    "ms"

                );

            }

        );


        dropdown.innerHTML = `

            <option value="">

                -- Pilih Pos --

            </option>

        `;


        senaraiPos.forEach(

            function (

                pos

            ) {


                const option =

                    document.createElement(

                        "option"

                    );


                option.value =

                    pos;


                option.textContent =

                    pos;


                dropdown.appendChild(

                    option

                );


            }

        );


    }

    catch (

        error

    ) {


        console.error(

            "Gagal memuatkan Pos:",

            error

        );


        dropdown.innerHTML = `

            <option value="">

                Gagal memuatkan Pos

            </option>

        `;


        paparkanMesej(

            "Gagal memuatkan Pos: " +

            error.message,

            "error"

        );

    }

}


/* =====================================================
   TAMBAH POS
===================================================== */

function tambahPos() {


    const dropdown =

        document.getElementById(

            "pos"

        );


    if (!dropdown) {

        return;

    }


    const pos =

        dropdown.value.trim();


    if (!pos) {


        paparkanMesej(

            "Sila pilih Pos dahulu.",

            "error"

        );


        return;

    }


    if (

        posDipilih.includes(

            pos

        )

    ) {


        paparkanMesej(

            "Pos tersebut telah dipilih.",

            "error"

        );


        return;

    }


    posDipilih.push(

        pos

    );


    paparPosDipilih();


    dropdown.value = "";


    paparkanMesej(

        "Pos berjaya ditambah.",

        "success"

    );

}


/* =====================================================
   BUANG POS
===================================================== */

function buangPos(

    index

) {


    posDipilih.splice(

        index,

        1

    );


    paparPosDipilih();

}


/* =====================================================
   PAPAR POS DIPILIH
===================================================== */

function paparPosDipilih() {


    const container =

        document.getElementById(

            "posDipilih"

        );


    if (!container) {

        return;

    }


    if (

        posDipilih.length === 0

    ) {


        container.innerHTML = `

            <span class="empty-pos">

                Belum ada Pos dipilih

            </span>

        `;


        return;

    }


    container.innerHTML =

        posDipilih

            .map(

                function (

                    pos,

                    index

                ) {


                    return `

                        <span

                            class="pos-tag"

                        >

                            ${escapeHTML(

                                pos

                            )}


                            <button

                                type="button"

                                onclick="buangPos(${index})"

                                title="Buang Pos"

                            >

                                ×

                            </button>


                        </span>

                    `;

                }

            )

            .join("");

}


/* =====================================================
   SIMPAN
===================================================== */

async function simpanTempatKerja() {


    const unit =

        document

            .getElementById(

                "unit"

            )

            .value

            .trim();


    const kodTK =

        document

            .getElementById(

                "kodTempatKerja"

            )

            .value

            .trim()

            .toUpperCase();


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


    if (

        posDipilih.length === 0

    ) {


        paparkanMesej(

            "Sila pilih sekurang-kurangnya satu Pos.",

            "error"

        );


        return;

    }


    /*
        CONTOH:

        posDipilih:

        [
            "Pos A",
            "Pos B"
        ]

        AKAN DISIMPAN SEBAGAI:

        "Pos A & Pos B"

        DALAM COLUMN:

        nama_tempat_kerja
    */


    const namaTempatKerja =

        posDipilih.join(

            " & "

        );


    try {


        /* =============================================
           SEMAK KOD TK BERGANDA
        ============================================= */


        let querySemak =

            supabaseClient

                .from(

                    TABLE_TEMPAT_KERJA

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


        if (

            idSedangEdit

        ) {


            querySemak =

                querySemak.neq(

                    "id",

                    idSedangEdit

                );

        }


        const {

            data: semakan,

            error: errorSemakan

        } = await querySemak;


        if (

            errorSemakan

        ) {

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


        /* =============================================
           DATA DATABASE ASAL
        ============================================= */


        const rekod = {


            unit:

                unit,


            kod_tempat_kerja:

                kodTK,


            nama_tempat_kerja:

                namaTempatKerja,


            status:

                "Aktif"

        };


        let response;


        if (

            idSedangEdit

        ) {


            response =

                await supabaseClient

                    .from(

                        TABLE_TEMPAT_KERJA

                    )

                    .update(

                        rekod

                    )

                    .eq(

                        "id",

                        idSedangEdit

                    );

        }

        else {


            response =

                await supabaseClient

                    .from(

                        TABLE_TEMPAT_KERJA

                    )

                    .insert(

                        [

                            rekod

                        ]

                    );

        }


        if (

            response.error

        ) {

            throw response.error;

        }


        paparkanMesej(

            idSedangEdit

                ?

                "Kod Tempat Kerja berjaya dikemaskini."

                :

                "Kod Tempat Kerja berjaya disimpan.",

            "success"

        );


        resetBorang();


        await muatkanTempatKerja();


    }

    catch (

        error

    ) {


        console.error(

            "RALAT SIMPAN:",

            error

        );


        paparkanMesej(

            "Gagal simpan data: " +

            error.message,

            "error"

        );

    }

}


/* =====================================================
   LOAD DATA KOD TEMPAT KERJA
===================================================== */

async function muatkanTempatKerja() {


    const tbody =

        document.getElementById(

            "senaraiTempatKerja"

        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML = `

        <tr>

            <td colspan="6">

                Sedang memuatkan data...

            </td>

        </tr>

    `;


    try {


        const {

            data,

            error

        } = await supabaseClient

            .from(

                TABLE_TEMPAT_KERJA

            )

            .select(

                `

                id,

                unit,

                kod_tempat_kerja,

                nama_tempat_kerja,

                status

                `

            )

            .order(

                "unit",

                {

                    ascending:

                        true

                }

            );


        if (

            error

        ) {

            throw error;

        }


        dataTempatKerja =

            data || [];


        paparSenaraiTempatKerja();


    }

    catch (

        error

    ) {


        console.error(

            "Gagal memuatkan data:",

            error

        );


        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    Gagal memuatkan data:

                    ${escapeHTML(

                        error.message

                    )}

                </td>

            </tr>

        `;

    }

}


/* =====================================================
   PAPAR TABLE
===================================================== */

function paparSenaraiTempatKerja() {


    const tbody =

        document.getElementById(

            "senaraiTempatKerja"

        );


    if (!tbody) {

        return;

    }


    if (

        dataTempatKerja.length === 0

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


    tbody.innerHTML =

        dataTempatKerja

            .map(

                function (

                    item,

                    index

                ) {


                    const status =

                        item.status ||

                        "Aktif";


                    const kelasStatus =

                        String(

                            status

                        )

                        .toLowerCase()

                        ===

                        "aktif"

                            ?

                            "badge-aktif"

                            :

                            "badge-tidak-aktif";


                    return `

                        <tr>


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

                                <span

                                    class="badge ${kelasStatus}"

                                >

                                    ${escapeHTML(

                                        status

                                    )}

                                </span>

                            </td>


                            <td>


                                <button

                                    class="btn-edit"

                                    onclick="editTempatKerja('${escapeJS(

                                        item.id

                                    )}')"

                                >

                                    ✏️ Edit

                                </button>


                                <button

                                    class="btn-danger"

                                    onclick="padamTempatKerja('${escapeJS(

                                        item.id

                                    )}')"

                                >

                                    🗑 Padam

                                </button>


                            </td>


                        </tr>

                    `;

                }

            )

            .join("");

}


/* =====================================================
   EDIT
===================================================== */

function editTempatKerja(

    id

) {


    const item =

        dataTempatKerja.find(

            function (

                row

            ) {


                return String(

                    row.id

                )

                ===

                String(

                    id

                );

            }

        );


    if (!item) {

        return;

    }


    idSedangEdit =

        item.id;


    document

        .getElementById(

            "unit"

        )

        .value =

            item.unit ||

            "";


    document

        .getElementById(

            "kodTempatKerja"

        )

        .value =

            item.kod_tempat_kerja ||

            "";


    /*
        CONTOH DATABASE:

        Pos A & Pos B

        AKAN DIBACA SEMULA MENJADI:

        [
            "Pos A",
            "Pos B"
        ]
    */


    posDipilih =

        String(

            item.nama_tempat_kerja ||

            ""

        )

        .split(

            "&"

        )

        .map(

            function (

                pos

            ) {


                return pos.trim();

            }

        )

        .filter(

            Boolean

        );


    paparPosDipilih();


    muatkanPos();


    paparkanMesej(

        "Mod edit aktif. Ubah data dan klik SIMPAN.",

        "success"

    );


    window.scrollTo(

        {

            top:

                0,

            behavior:

                "smooth"

        }

    );

}


/* =====================================================
   PADAM
===================================================== */

async function padamTempatKerja(

    id

) {


    const item =

        dataTempatKerja.find(

            function (

                row

            ) {


                return String(

                    row.id

                )

                ===

                String(

                    id

                );

            }

        );


    if (!item) {

        return;

    }


    const sah =

        confirm(

            "Padam Kod TK " +

            item.kod_tempat_kerja +

            " untuk Unit " +

            item.unit +

            "?"

        );


    if (!sah) {

        return;

    }


    try {


        const {

            error

        } = await supabaseClient

            .from(

                TABLE_TEMPAT_KERJA

            )

            .delete()

            .eq(

                "id",

                id

            );


        if (

            error

        ) {

            throw error;

        }


        paparkanMesej(

            "Data berjaya dipadam.",

            "success"

        );


        await muatkanTempatKerja();


    }

    catch (

        error

    ) {


        paparkanMesej(

            "Gagal padam data: " +

            error.message,

            "error"

        );

    }

}


/* =====================================================
   RESET
===================================================== */

function resetBorang() {


    idSedangEdit =

        null;


    posDipilih =

        [];


    const unit =

        document.getElementById(

            "unit"

        );


    const kod =

        document.getElementById(

            "kodTempatKerja"

        );


    const pos =

        document.getElementById(

            "pos"

        );


    if (unit) {

        unit.value = "";

    }


    if (kod) {

        kod.value = "";

    }


    if (pos) {

        pos.value = "";

    }


    paparPosDipilih();

}


/* =====================================================
   MESEJ
===================================================== */

function paparkanMesej(

    mesej,

    jenis

) {


    const div =

        document.getElementById(

            "mesej"

        );


    if (!div) {

        return;

    }


    div.className =

        jenis;


    div.textContent =

        mesej;


    div.style.display =

        "block";

}


/* =====================================================
   ESCAPE HTML
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


/* =====================================================
   ESCAPE JAVASCRIPT
===================================================== */

function escapeJS(

    value

) {


    return String(

        value

    )

        .replace(

            /\\/g,

            "\\\\"

        )

        .replace(

            /'/g,

            "\\'"

        );

}
