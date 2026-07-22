// =====================================================
// KOD DUTY.JS
// FPB DUTY SYSTEM
// =====================================================


// =====================================================
// SENARAI 6 UNIT
// =====================================================

const SENARAI_UNIT = [

    "Jerangau",

    "Chador",

    "Terengganu",

    "Setiu",

    "Rantau Abang",

    "Kerteh"

];


// =====================================================
// PEMBOLEH UBAH EDIT
// =====================================================

let unitLama = "";

let kodLama = "";

let sedangEdit = false;


// =====================================================
// APABILA HALAMAN SIAP
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    function () {


        // PAPAR SENARAI KOD DUTY

        paparKodDuty();


    }

);


// =====================================================
// FUNGSI PAPAR MESEJ
// =====================================================

function paparMesej(

    mesej,

    jenis = "success"

) {


    const ruangMesej =

        document.getElementById(

            "mesej"

        );


    if (!ruangMesej) {

        alert(mesej);

        return;

    }


    ruangMesej.innerHTML = `

        <div class="${jenis}">

            ${mesej}

        </div>

    `;


    setTimeout(

        function () {

            ruangMesej.innerHTML = "";

        },

        5000

    );

}


// =====================================================
// FUNGSI SEMAK UNIT
// =====================================================

function semakUnit(unit) {


    if (!unit) {

        paparMesej(

            "❌ Sila pilih Unit",

            "error"

        );

        return false;

    }


    if (

        !SENARAI_UNIT.includes(unit)

    ) {

        paparMesej(

            "❌ Unit tidak sah",

            "error"

        );

        return false;

    }


    return true;

}


// =====================================================
// FUNGSI SIMPAN KOD DUTY
// =====================================================

async function simpanKodDuty() {


    // -----------------------------------------
    // AMBIL NILAI BORANG
    // -----------------------------------------

    const unit = document

        .getElementById(

            "unit"

        )

        .value

        .trim();


    const kod = document

        .getElementById(

            "kod"

        )

        .value

        .trim()

        .toUpperCase();


    const waktuTugasan = document

        .getElementById(

            "waktuTugasan"

        )

        .value

        .trim();


    const jamKerja = document

        .getElementById(

            "jamKerja"

        )

        .value;


    const jamKlm = document

        .getElementById(

            "jamKlm"

        )

        .value;


    const status = document

        .getElementById(

            "status"

        )

        .value;


    // -----------------------------------------
    // SEMAK UNIT
    // -----------------------------------------

    if (

        !semakUnit(unit)

    ) {

        return;

    }


    // -----------------------------------------
    // SEMAK KOD
    // -----------------------------------------

    if (!kod) {


        paparMesej(

            "❌ Sila masukkan Kod Duty",

            "error"

        );


        return;

    }


    // -----------------------------------------
    // SEMAK WAKTU
    // -----------------------------------------

    if (!waktuTugasan) {


        paparMesej(

            "❌ Sila masukkan Waktu Tugasan",

            "error"

        );


        return;

    }


    // -----------------------------------------
    // SEMAK JAM KERJA
    // -----------------------------------------

    if (

        jamKerja === ""

        ||

        jamKerja === null

    ) {


        paparMesej(

            "❌ Sila masukkan Jam Kerja",

            "error"

        );


        return;

    }


    // -----------------------------------------
    // DATA YANG AKAN DISIMPAN
    // -----------------------------------------

    const data = {


        unit: unit,


        kod: kod,


        waktu_tugasan:

            waktuTugasan,


        jam_kerja:

            Number(jamKerja),


        jam_klm:

            Number(jamKlm || 0),


        status:

            status


    };


    let result;


    // =================================================
    // MODE EDIT
    // =================================================

    if (sedangEdit) {


        result = await supabaseClient

            .from("kod_duty")

            .update(data)

            .eq(

                "unit",

                unitLama

            )

            .eq(

                "kod",

                kodLama

            );


    }


    // =================================================
    // MODE TAMBAH
    // =================================================

    else {


        result = await supabaseClient

            .from("kod_duty")

            .insert([

                data

            ]);

    }


    // =================================================
    // SEMAK RALAT
    // =================================================

    if (

        result.error

    ) {


        console.error(

            result.error

        );


        // ---------------------------------------------
        // DUPLICATE KEY
        // ---------------------------------------------

        if (


            result.error.code ===

            "23505"


            ||


            result.error.message.includes(

                "duplicate key value violates unique constraint"

            )


        ) {


            paparMesej(


                `⚠️ Kod Duty ${kod} untuk Unit ${unit} Telah Di Gunakan`,


                "error"


            );


        }


        // ---------------------------------------------
        // RALAT LAIN
        // ---------------------------------------------

        else {


            paparMesej(


                "❌ Gagal simpan: " +

                result.error.message,


                "error"


            );

        }


        return;

    }


    // =================================================
    // BERJAYA
    // =================================================

    paparMesej(


        sedangEdit

            ? "✅ Kod Duty berjaya dikemaskini"

            : "✅ Kod Duty berjaya disimpan",


        "success"


    );


    // KOSONGKAN BORANG

    kosongkanBorang();


    // PAPAR DATA TERKINI

    paparKodDuty();

}


// =====================================================
// FUNGSI PAPAR SENARAI KOD DUTY
// =====================================================

async function paparKodDuty() {


    const ruangSenarai =

        document.getElementById(

            "senaraiKodDuty"

        );


    if (!ruangSenarai) {

        return;

    }


    ruangSenarai.innerHTML = `

        <tr>

            <td colspan="8">

                ⏳ Memuatkan data...

            </td>

        </tr>

    `;


    // -----------------------------------------
    // AMBIL DATA
    // -----------------------------------------

    const {

        data,

        error

    } = await supabaseClient

        .from("kod_duty")

        .select("*")

        .order(

            "unit",

            {

                ascending: true

            }

        )

        .order(

            "kod",

            {

                ascending: true

            }

        );


    // -----------------------------------------
    // SEMAK RALAT
    // -----------------------------------------

    if (error) {


        console.error(error);


        ruangSenarai.innerHTML = `

            <tr>

                <td colspan="8">

                    ❌ Gagal ambil data:

                    ${error.message}

                </td>

            </tr>

        `;


        return;

    }


    // -----------------------------------------
    // AMBIL FILTER UNIT
    // -----------------------------------------

    const filterUnitElement =

        document.getElementById(

            "filterUnit"

        );


    const filterUnit =

        filterUnitElement

            ? filterUnitElement.value

            : "";


    // -----------------------------------------
    // AMBIL CARI KOD
    // -----------------------------------------

    const cariKodElement =

        document.getElementById(

            "cariKod"

        );


    const cariKod =

        cariKodElement

            ? cariKodElement.value

                .trim()

                .toUpperCase()

            : "";


    // -----------------------------------------
    // TAPIS DATA
    // -----------------------------------------

    let senarai = data || [];


    if (filterUnit) {


        senarai = senarai.filter(

            function (item) {


                return (

                    item.unit ===

                    filterUnit

                );


            }

        );

    }


    if (cariKod) {


        senarai = senarai.filter(

            function (item) {


                return (

                    String(

                        item.kod

                    )

                    .toUpperCase()

                    .includes(

                        cariKod

                    )

                );


            }

        );

    }


    // -----------------------------------------
    // TIADA DATA
    // -----------------------------------------

    if (

        senarai.length === 0

    ) {


        ruangSenarai.innerHTML = `

            <tr>

                <td colspan="8">

                    Tiada Kod Duty dijumpai

                </td>

            </tr>

        `;


        return;

    }


    // -----------------------------------------
    // PAPAR DATA
    // -----------------------------------------

    ruangSenarai.innerHTML = "";


    senarai.forEach(

        function (

            item,

            index

        ) {


            const status =

                item.status || "";


            const statusClass =

                status === "Aktif"

                    ? "badge-aktif"

                    : "badge-tidak-aktif";


            const tr =

                document.createElement(

                    "tr"

                );


            tr.innerHTML = `


                <td>

                    ${index + 1}

                </td>


                <td>

                    <strong>

                        ${item.unit || ""}

                    </strong>

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

                    ${item.jam_kerja ?? 0}

                </td>


                <td>

                    ${item.jam_klm ?? 0}

                </td>


                <td>

                    <span

                        class="badge ${statusClass}"

                    >

                        ${status}

                    </span>

                </td>


                <td>


                    <button

                        class="btn-edit"

                        onclick='editKodDuty(

                            ${JSON.stringify(item)}

                        )'

                    >

                        ✏️ Edit

                    </button>


                    <br>


                    <br>


                    <button

                        class="btn-danger"

                        onclick='padamKodDuty(

                            ${JSON.stringify(item)}

                        )'

                    >

                        🗑️ Padam

                    </button>


                </td>


            `;


            ruangSenarai.appendChild(

                tr

            );


        }

    );

}


// =====================================================
// FUNGSI EDIT KOD DUTY
// =====================================================

function editKodDuty(item) {


    sedangEdit = true;


    unitLama = item.unit;


    kodLama = item.kod;


    document

        .getElementById(

            "unit"

        )

        .value =

        item.unit || "";


    document

        .getElementById(

            "kod"

        )

        .value =

        item.kod || "";


    document

        .getElementById(

            "waktuTugasan"

        )

        .value =

        item.waktu_tugasan || "";


    document

        .getElementById(

            "jamKerja"

        )

        .value =

        item.jam_kerja ?? "";


    document

        .getElementById(

            "jamKlm"

        )

        .value =

        item.jam_klm ?? 0;


    document

        .getElementById(

            "status"

        )

        .value =

        item.status || "Aktif";


    const tajuk =

        document.getElementById(

            "tajukBorang"

        );


    if (tajuk) {


        tajuk.innerHTML =

            "✏️ Edit Kod Duty";


    }


    const btnBatal =

        document.getElementById(

            "btnBatal"

        );


    if (btnBatal) {


        btnBatal.style.display =

            "block";


    }


    window.scrollTo(

        {

            top: 0,

            behavior: "smooth"

        }

    );

}


// =====================================================
// FUNGSI BATAL EDIT
// =====================================================

function batalEdit() {


    kosongkanBorang();

}


// =====================================================
// FUNGSI KOSONGKAN BORANG
// =====================================================

function kosongkanBorang() {


    sedangEdit = false;


    unitLama = "";


    kodLama = "";


    document

        .getElementById(

            "unit"

        )

        .value = "";


    document

        .getElementById(

            "kod"

        )

        .value = "";


    document

        .getElementById(

            "waktuTugasan"

        )

        .value = "";


    document

        .getElementById(

            "jamKerja"

        )

        .value = "";


    document

        .getElementById(

            "jamKlm"

        )

        .value = "0";


    document

        .getElementById(

            "status"

        )

        .value = "Aktif";


    const tajuk =

        document.getElementById(

            "tajukBorang"

        );


    if (tajuk) {


        tajuk.innerHTML =

            "➕ Tambah Kod Duty";


    }


    const btnBatal =

        document.getElementById(

            "btnBatal"

        );


    if (btnBatal) {


        btnBatal.style.display =

            "none";


    }

}


// =====================================================
// FUNGSI PADAM KOD DUTY
// =====================================================

async function padamKodDuty(item) {


    const sahkan = confirm(


        `Adakah anda pasti mahu padam Kod Duty ${item.kod} untuk Unit ${item.unit}?`


    );


    if (!sahkan) {


        return;

    }


    const {

        error

    } = await supabaseClient

        .from("kod_duty")

        .delete()

        .eq(

            "unit",

            item.unit

        )

        .eq(

            "kod",

            item.kod

        );


    if (error) {


        console.error(error);


        paparMesej(


            "❌ Gagal padam: " +

            error.message,


            "error"


        );


        return;

    }


    paparMesej(


        "✅ Kod Duty berjaya dipadam",


        "success"


    );


    paparKodDuty();

}
