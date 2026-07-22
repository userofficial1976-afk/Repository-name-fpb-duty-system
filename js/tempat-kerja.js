/* =====================================================
FPB DUTY SYSTEM
KOD TEMPAT KERJA
WILAYAH TERENGGANU
===================================================== */

/* =====================================================

1. PEMBOLEHUBAH
   ===================================================== */

let senaraiData = [];

/* =====================================================
2. APABILA PAGE SIAP
===================================================== */

document.addEventListener(
"DOMContentLoaded",
function () {

```
    muatkanUnit();

    muatkanTempatKerja();

}
```

);

/* =====================================================
3. MUATKAN SENARAI UNIT
DARIPADA Data_Anggota
===================================================== */

async function muatkanUnit() {

```
const dropdownUnit =
    document.getElementById("unit");


if (!dropdownUnit) {

    return;

}


try {


    const {

        data,

        error

    } = await supabaseClient

        .from("Data_Anggota")

        .select("unit")

        .not(
            "unit",
            "is",
            null
        )

        .neq(
            "unit",
            ""
        );


    if (error) {

        throw error;

    }


    const unitUnik = [

        ...new Set(

            data

                .map(
                    item => item.unit
                )

                .filter(
                    unit => unit
                )

        )

    ];


    unitUnik.sort();


    dropdownUnit.innerHTML = `

        <option value="">

            -- Pilih Unit --

        </option>

    `;


    unitUnik.forEach(

        function (unit) {


            const option =
                document.createElement(
                    "option"
                );


            option.value = unit;

            option.textContent = unit;


            dropdownUnit.appendChild(
                option
            );


        }

    );


}

catch (error) {


    console.error(
        "Gagal memuatkan unit:",
        error
    );


    paparkanMesej(

        "Gagal memuatkan senarai Unit: "
        + error.message,

        "error"

    );


}
```

}

/* =====================================================
4. SIMPAN KOD TEMPAT KERJA
===================================================== */

async function simpanTempatKerja() {

```
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


const nama =
    document

        .getElementById(
            "namaTempatKerja"
        )

        .value

        .trim();


/* VALIDASI */

if (!unit) {


    paparkanMesej(

        "Sila pilih Unit.",

        "error"

    );


    return;

}


if (!kod) {


    paparkanMesej(

        "Sila masukkan Kod Tempat Kerja.",

        "error"

    );


    return;

}


if (!nama) {


    paparkanMesej(

        "Sila pilih Nama Tempat Kerja.",

        "error"

    );


    return;

}


try {


    /* SEMAK DATA SAMA */

    const {

        data: dataSediaAda,

        error: errorSemak

    } = await supabaseClient

        .from(
            "kod_tempat_kerja"
        )

        .select("*")

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

            "Kod tempat kerja ini sudah wujud untuk Unit tersebut.",

            "error"

        );


        return;

    }


    /* SIMPAN */

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

                nama_tempat_kerja:
                    nama,

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


    /* RESET BORANG */

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
            "namaTempatKerja"
        )

        .value = "";


    /* REFRESH TABLE */

    muatkanTempatKerja();


}


catch (error) {


    console.error(
        "Gagal simpan:",
        error
    );


    paparkanMesej(

        "Gagal simpan data: "
        + error.message,

        "error"

    );


}
```

}

/* =====================================================
5. MUATKAN SENARAI TEMPAT KERJA
===================================================== */

async function muatkanTempatKerja() {

```
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

        .select("*")

        .order(

            "unit",

            {

                ascending: true

            }

        )

        .order(

            "kod_tempat_kerja",

            {

                ascending: true

            }

        );


    if (error) {

        throw error;

    }


    senaraiData = data || [];


    if (

        senaraiData.length === 0

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


    senaraiData.forEach(

        function (item, index) {


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

                    <strong>

                        ${escapeHTML(
                            item.unit
                        )}

                    </strong>

                </td>


                <td>

                    <span class="badge">

                        ${escapeHTML(
                            item.kod_tempat_kerja
                        )}

                    </span>

                </td>


                <td>

                    ${escapeHTML(
                        item.nama_tempat_kerja
                    )}

                </td>


                <td>

                    <span class="badge">

                        ${escapeHTML(
                            item.status || "Aktif"
                        )}

                    </span>

                </td>


                <td>

                    <button

                        class="btn-danger"

                        onclick="padamTempatKerja('${item.id}')"

                    >

                        🗑 Padam

                    </button>

                </td>

            `;


            tbody.appendChild(tr);


        }

    );


}


catch (error) {


    console.error(

        "Gagal memuatkan data:",

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
```

}

/* =====================================================
6. PADAM DATA
===================================================== */

async function padamTempatKerja(id) {

```
const sah =
    confirm(

        "Adakah anda pasti mahu memadam Kod Tempat Kerja ini?"

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

        "Kod Tempat Kerja berjaya dipadam.",

        "success"

    );


    muatkanTempatKerja();


}


catch (error) {


    console.error(

        "Gagal padam:",

        error

    );


    paparkanMesej(

        "Gagal padam data: "
        + error.message,

        "error"

    );


}
```

}

/* =====================================================
7. PAPAR MESEJ
===================================================== */

function paparkanMesej(

```
mesej,

jenis
```

) {

```
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
```

}

/* =====================================================
8. KESELAMATAN PAPARAN HTML
===================================================== */

function escapeHTML(value) {

```
if (!value) {

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
```

}
