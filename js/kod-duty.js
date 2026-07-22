// =====================================================
// KOD DUTY.JS
// FPB DUTY SYSTEM
// =====================================================


// =====================================================
// PEMBOLEHUBAH
// =====================================================

let semuaKodDuty = [];

let idEdit = null;


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    function () {

        paparKodDuty();

    }

);


// =====================================================
// SIMPAN / UPDATE KOD DUTY
// =====================================================

async function simpanKodDuty() {


    const unit =

        document

            .getElementById(

                "unit"

            )

            .value;


    const kod =

        document

            .getElementById(

                "kod"

            )

            .value

            .trim()

            .toUpperCase();


    const waktuTugasan =

        document

            .getElementById(

                "waktuTugasan"

            )

            .value

            .trim();


    const jamKerja =

        Number(

            document

                .getElementById(

                    "jamKerja"

                )

                .value

        )

        || 0;


    const jamKlm =

        Number(

            document

                .getElementById(

                    "jamKlm"

                )

                .value

        )

        || 0;


    const status =

        document

            .getElementById(

                "status"

            )

            .value;


    // SEMAK MAKLUMAT

    if (

        !unit

        ||

        !kod

        ||

        !waktuTugasan

    ) {


        paparMesej(

            "Sila lengkapkan Unit, Kod Duty dan Waktu Tugasan.",

            "error"

        );


        return;

    }


    const dataSimpan = {


        unit:

            unit,


        kod:

            kod,


        waktu_tugasan:

            waktuTugasan,


        jam_kerja:

            jamKerja,


        jam_klm:

            jamKlm,


        status:

            status

    };


    let result;


    // =================================================
    // UPDATE
    // =================================================

    if (

        idEdit

    ) {


        result =

            await supabaseClient

                .from(

                    "kod_duty"

                )

                .update(

                    dataSimpan

                )

                .eq(

                    "id",

                    idEdit

                );

    }


    // =================================================
    // INSERT
    // =================================================

    else {


        result =

            await supabaseClient

                .from(

                    "kod_duty"

                )

                .insert(

                    dataSimpan

                );

    }


    if (

        result.error

    ) {


        console.error(

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

        idEdit

        ?

        "Kod Duty berjaya dikemaskini."

        :

        "Kod Duty berjaya disimpan.",

        "success"

    );


    kosongkanBorang();


    paparKodDuty();

}


// =====================================================
// PAPAR SENARAI KOD DUTY
// =====================================================

async function paparKodDuty() {


    const tbody =

        document

            .getElementById(

                "senaraiKodDuty"

            );


    if (

        !tbody

    ) {

        return;

    }


    const filterUnit =

        document

            .getElementById(

                "filterUnit"

            )

            .value;


    const cariKod =

        document

            .getElementById(

                "cariKod"

            )

            .value

            .toLowerCase();


    let query =

        supabaseClient


            .from(

                "kod_duty"

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


    if (

        filterUnit

    ) {


        query =

            query.eq(

                "unit",

                filterUnit

            );

    }


    const {

        data,

        error

    } = await query;


    if (

        error

    ) {


        console.error(

            error

        );


        tbody.innerHTML = `

            <tr>

                <td colspan="8">

                    Gagal ambil data:

                    ${error.message}

                </td>

            </tr>

        `;


        return;

    }


    semuaKodDuty =

        data

        ||

        [];


    const senarai =

        semuaKodDuty.filter(

            function (

                item

            ) {


                return (

                    !cariKod

                    ||

                    String(

                        item.kod

                    )

                    .toLowerCase()

                    .includes(

                        cariKod

                    )

                );

            }

        );


    tbody.innerHTML = "";


    if (

        senarai.length

        ===

        0

    ) {


        tbody.innerHTML = `

            <tr>

                <td colspan="8">

                    Tiada data Kod Duty.

                </td>

            </tr>

        `;


        return;

    }


    senarai.forEach(

        function (

            item,

            index

        ) {


            const tr =

                document

                    .createElement(

                        "tr"

                    );


            const statusBadge =

                item.status

                ===

                "Aktif"

                ?

                `

                    <span

                        class="badge badge-aktif"

                    >

                        Aktif

                    </span>

                `

                :

                `

                    <span

                        class="badge badge-tidak-aktif"

                    >

                        Tidak Aktif

                    </span>

                `;


            tr.innerHTML = `

                <td>

                    ${index + 1}

                </td>


                <td>

                    ${item.unit || ""}

                </td>


                <td>

                    <strong>

                        ${item.kod || ""}

                    </strong>

                </td>


                <td>

                    ${item.waktu_tugasan || ""}

                </td>


                <td>

                    ${item.jam_kerja || 0}

                </td>


                <td>

                    ${item.jam_klm || 0}

                </td>


                <td>

                    ${statusBadge}

                </td>


                <td>


                    <button

                        class="btn-edit"

                        onclick="editKodDuty(

                            '${item.id}'

                        )"

                    >

                        ✏️ Edit

                    </button>


                    <br>


                    <br>


                    <button

                        class="btn-danger"

                        onclick="padamKodDuty(

                            '${item.id}'

                        )"

                    >

                        🗑️ Padam

                    </button>


                </td>

            `;


            tbody.appendChild(

                tr

            );

        }

    );

}


// =====================================================
// EDIT KOD DUTY
// =====================================================

function editKodDuty(

    id

) {


    const item =

        semuaKodDuty.find(

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


    if (

        !item

    ) {


        return;

    }


    idEdit =

        id;


    document

        .getElementById(

            "unit"

        )

        .value =

        item.unit

        ||

        "";


    document

        .getElementById(

            "kod"

        )

        .value =

        item.kod

        ||

        "";


    document

        .getElementById(

            "waktuTugasan"

        )

        .value =

        item.waktu_tugasan

        ||

        "";


    document

        .getElementById(

            "jamKerja"

        )

        .value =

        item.jam_kerja

        ||

        0;


    document

        .getElementById(

            "jamKlm"

        )

        .value =

        item.jam_klm

        ||

        0;


    document

        .getElementById(

            "status"

        )

        .value =

        item.status

        ||

        "Aktif";


    document

        .getElementById(

            "tajukBorang"

        )

        .textContent =

        "✏️ Edit Kod Duty";


    document

        .getElementById(

            "btnBatal"

        )

        .style

        .display =

        "block";


    window.scrollTo(

        {

            top:

                0,

            behavior:

                "smooth"

        }

    );

}


// =====================================================
// BATAL EDIT
// =====================================================

function batalEdit() {


    kosongkanBorang();

}


// =====================================================
// KOSONGKAN BORANG
// =====================================================

function kosongkanBorang() {


    idEdit =

        null;


    document

        .getElementById(

            "unit"

        )

        .value =

        "";


    document

        .getElementById(

            "kod"

        )

        .value =

        "";


    document

        .getElementById(

            "waktuTugasan"

        )

        .value =

        "";


    document

        .getElementById(

            "jamKerja"

        )

        .value =

        "";


    document

        .getElementById(

            "jamKlm"

        )

        .value =

        "0";


    document

        .getElementById(

            "status"

        )

        .value =

        "Aktif";


    document

        .getElementById(

            "tajukBorang"

        )

        .textContent =

        "➕ Tambah Kod Duty";


    document

        .getElementById(

            "btnBatal"

        )

        .style

        .display =

        "none";

}


// =====================================================
// PADAM KOD DUTY
// =====================================================

async function padamKodDuty(

    id

) {


    const sahkan =

        confirm(

            "Adakah anda pasti mahu padam Kod Duty ini?"

        );


    if (

        !sahkan

    ) {


        return;

    }


    const {

        error

    } =

        await supabaseClient


            .from(

                "kod_duty"

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

            +

            error.message,

            "error"

        );


        return;

    }


    paparMesej(

        "Kod Duty berjaya dipadam.",

        "success"

    );


    paparKodDuty();

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
