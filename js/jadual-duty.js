// =====================================================
// DATA MEMORY
// =====================================================

let semuaAnggota = [];
let semuaKodDuty = [];
let semuaKodTempatKerja = [];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("JADUAL DUTY JS BERJAYA DIMUAT");

    const tarikhHariIni = new Date();

    document.getElementById("tarikh").valueAsDate = tarikhHariIni;

    document.getElementById("filterTarikh").valueAsDate = tarikhHariIni;

    await muatAnggota();

    await muatKodDuty();

    await muatKodTempatKerja();

    await muatSenaraiPos();

    paparDuty();

});


// =====================================================
// MUAT ANGGOTA
// =====================================================

async function muatAnggota() {

    const { data, error } = await supabaseClient

        .from("Data_Anggota")

        .select(`
            no_skb,
            no_anggota,
            nama,
            pangkat,
            kawasan,
            unit,
            ketua_unit,
            ketua_pos,
            pos,
            status
        `)

        .eq("status", "Aktif")

        .order("nama", {
            ascending: true
        });


    if (error) {

        console.error(
            "RALAT ANGGOTA:",
            error
        );

        paparMesej(
            "Gagal ambil Data_Anggota: "
            + error.message,
            "error"
        );

        return;

    }


    semuaAnggota = data || [];


    const selectAnggota =
        document.getElementById("anggota");


    selectAnggota.innerHTML = `

        <option value="">

            -- Pilih Nama Anggota --

        </option>

    `;


    semuaAnggota.forEach(function (anggota) {


        const option =
            document.createElement("option");


        option.value =
            String(anggota.no_skb);


        option.textContent =

            (anggota.nama || "")

            + " | "

            + (anggota.no_anggota || "")

            + " | "

            + (anggota.no_skb || "");


        selectAnggota.appendChild(option);


    });


    console.log(

        "Jumlah anggota aktif:",

        semuaAnggota.length

    );

}


// =====================================================
// PILIH ANGGOTA
// =====================================================

document

    .getElementById("anggota")

    .addEventListener(

        "change",

        function () {


            const noSkb =
                this.value;


            const anggota =

                semuaAnggota.find(

                    function (x) {

                        return String(

                            x.no_skb

                        )

                        === String(

                            noSkb

                        );

                    }

                );


            if (!anggota) {


                kosongkanMaklumatAnggota();


                return;

            }


            document

                .getElementById("noSkb")

                .value =

                anggota.no_skb || "";


            document

                .getElementById("noAnggota")

                .value =

                anggota.no_anggota || "";


            document

                .getElementById("kawasan")

                .value =

                anggota.kawasan || "";


            document

                .getElementById("unit")

                .value =

                anggota.unit || "";


            document

                .getElementById("ketuaUnit")

                .value =

                anggota.ketua_unit || "";


            document

                .getElementById("ketuaPos")

                .value =

                anggota.ketua_pos || "";


            document

                .getElementById("namaPosAsal")

                .value =

                anggota.pos || "";


        }

    );


// =====================================================
// KOSONGKAN MAKLUMAT ANGGOTA
// =====================================================

function kosongkanMaklumatAnggota() {


    document

        .getElementById("noSkb")

        .value = "";


    document

        .getElementById("noAnggota")

        .value = "";


    document

        .getElementById("kawasan")

        .value = "";


    document

        .getElementById("unit")

        .value = "";


    document

        .getElementById("ketuaUnit")

        .value = "";


    document

        .getElementById("ketuaPos")

        .value = "";


    document

        .getElementById("namaPosAsal")

        .value = "";

}


// =====================================================
// MUAT KOD WAKTU KERJA
// =====================================================

async function muatKodDuty() {


    const { data, error } =

        await supabaseClient

            .from("kod_duty")

            .select(`

                kod,

                waktu_tugasan,

                jam_kerja,

                jam_klm,

                status

            `)

            .eq(

                "status",

                "Aktif"

            )

            .order(

                "kod",

                {

                    ascending: true

                }

            );


    if (error) {


        console.error(

            "RALAT KOD DUTY:",

            error

        );


        paparMesej(

            "Gagal ambil kod waktu kerja: "

            + error.message,

            "error"

        );


        return;

    }


    semuaKodDuty = data || [];


    const selectKod =

        document

            .getElementById(

                "kodDuty"

            );


    selectKod.innerHTML = `

        <option value="">

            -- Pilih Kod Waktu Kerja --

        </option>

    `;


    semuaKodDuty.forEach(

        function (duty) {


            const option =

                document

                    .createElement(

                        "option"

                    );


            option.value =

                String(

                    duty.kod

                );


            option.textContent =

                duty.kod

                + " | "

                + (

                    duty.waktu_tugasan

                    || ""

                );


            selectKod.appendChild(

                option

            );


        }

    );

}


// =====================================================
// PILIH KOD WAKTU KERJA
// =====================================================

document

    .getElementById("kodDuty")

    .addEventListener(

        "change",

        function () {


            const kod =

                this.value;


            const duty =

                semuaKodDuty.find(

                    function (x) {


                        return String(

                            x.kod

                        )

                        === String(

                            kod

                        );


                    }

                );


            if (!duty) {


                document

                    .getElementById(

                        "jamKlm"

                    )

                    .value = "";


                return;

            }


            document

                .getElementById(

                    "jamKlm"

                )

                .value =

                duty.jam_klm || 0;


        }

    );


// =====================================================
// MUAT KOD TEMPAT KERJA
// =====================================================

async function muatKodTempatKerja() {


    const { data, error } =

        await supabaseClient

            .from(

                "kod_tempat_kerja"

            )

            .select(`

                kod_tempat_kerja,

                nama_tempat_kerja,

                status

            `)

            .eq(

                "status",

                "Aktif"

            )

            .order(

                "kod_tempat_kerja",

                {

                    ascending: true

                }

            );


    if (error) {


        console.error(

            "RALAT TEMPAT KERJA:",

            error

        );


        paparMesej(

            "Gagal ambil kod tempat kerja: "

            + error.message,

            "error"

        );


        return;

    }


    semuaKodTempatKerja =

        data || [];


    const select =

        document

            .getElementById(

                "kodTempatKerja"

            );


    select.innerHTML = `

        <option value="">

            -- Pilih Kod Tempat Kerja --

        </option>

    `;


    semuaKodTempatKerja.forEach(

        function (tempat) {


            const option =

                document

                    .createElement(

                        "option"

                    );


            option.value =

                tempat

                    .kod_tempat_kerja;


            option.textContent =

                tempat

                    .kod_tempat_kerja

                + " | "

                + (

                    tempat

                        .nama_tempat_kerja

                    || ""

                );


            select.appendChild(

                option

            );


        }

    );

}


// =====================================================
// TARIKH BERUBAH
// =====================================================

document

    .getElementById("tarikh")

    .addEventListener(

        "change",

        function () {


            const value =

                this.value;


            if (!value) {


                document

                    .getElementById(

                        "bulan"

                    )

                    .value = "";


                document

                    .getElementById(

                        "tahun"

                    )

                    .value = "";


                document

                    .getElementById(

                        "hari"

                    )

                    .value = "";


                return;

            }


            const date =

                new Date(

                    value

                    + "T00:00:00"

                );


            document

                .getElementById(

                    "bulan"

                )

                .value =

                date.getMonth()

                + 1;


            document

                .getElementById(

                    "tahun"

                )

                .value =

                date.getFullYear();


            document

                .getElementById(

                    "hari"

                )

                .value =

                date.toLocaleDateString(

                    "ms-MY",

                    {

                        weekday:

                            "long"

                    }

                );

        }

    );


// =====================================================
// SIMPAN DUTY
// =====================================================

async function simpanDuty() {


    const tarikh =

        document

            .getElementById(

                "tarikh"

            )

            .value;


    const noSkb =

        document

            .getElementById(

                "noSkb"

            )

            .value;


    const kodDuty =

        document

            .getElementById(

                "kodDuty"

            )

            .value;


    const kodTempatKerja =

        document

            .getElementById(

                "kodTempatKerja"

            )

            .value;


    if (

        !tarikh

        ||

        !noSkb

        ||

        !kodDuty

        ||

        !kodTempatKerja

    ) {


        paparMesej(

            "Sila lengkapkan Tarikh, Anggota, Kod Waktu Kerja dan Kod Tempat Kerja.",

            "error"

        );


        return;

    }


    const anggota =

        semuaAnggota.find(

            function (x) {


                return String(

                    x.no_skb

                )

                === String(

                    noSkb

                );


            }

        );


    const duty =

        semuaKodDuty.find(

            function (x) {


                return String(

                    x.kod

                )

                === String(

                    kodDuty

                );


            }

        );


    if (

        !anggota

        ||

        !duty

    ) {


        paparMesej(

            "Data anggota atau kod waktu kerja tidak dijumpai.",

            "error"

        );


        return;

    }


    const tarikhObj =

        new Date(

            tarikh

            + "T00:00:00"

        );


    const bulan =

        tarikhObj.getMonth()

        + 1;


    const tahun =

        tarikhObj.getFullYear();


    const hari =

        tarikhObj.toLocaleDateString(

            "ms-MY",

            {

                weekday:

                    "long"

            }

        );


    const hariOffday =

        document

            .getElementById(

                "hariOffday"

            )

            .checked

            ? 1

            : 0;


    const jamOffday =

        Number(

            document

                .getElementById(

                    "jamOffday"

                )

                .value

        )

        || 0;


    const hariCutiam =

        document

            .getElementById(

                "hariCutiam"

            )

            .checked

            ? 1

            : 0;


    const jamCutiam =

        Number(

            document

                .getElementById(

                    "jamCutiam"

                )

                .value

        )

        || 0;


    const dataSimpan = {


        tarikh:


            tarikh,


        bulan:


            bulan,


        tahun:


            tahun,


        no_skb:


            anggota.no_skb,


        nama_anggota:


            anggota.nama,


        no_anggota:


            anggota.no_anggota,


        kawasan:


            anggota.kawasan,


        unit:


            anggota.unit,


        ketua_unit:


            anggota.ketua_unit,


        ketua_pos:


            anggota.ketua_pos,


        nama_pos_asal:


            anggota.pos,


        hari:


            hari,


        kod_waktu_kerja:


            duty.kod,


        kod_tempat_kerja:


            kodTempatKerja,


        jam_klm:


            duty.jam_klm || 0,


        hari_offday_bertugas:


            hariOffday,


        jam_offday_bertugas:


            jamOffday,


        hari_cutiam_bertugas:


            hariCutiam,


        jam_cutiam_bertugas:


            jamCutiam

    };


    console.log(

        "DATA YANG AKAN DISIMPAN:",

        dataSimpan

    );


    const { error } =

        await supabaseClient

            .from(

                "jadual_duty"

            )

            .insert(

                dataSimpan

            );


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

        "Duty berjaya disimpan.",

        "success"

    );


    resetBorang();


    paparDuty();

}


// =====================================================
// RESET BORANG
// =====================================================

function resetBorang() {


    document

        .getElementById(

            "anggota"

        )

        .value = "";


    document

        .getElementById(

            "kodDuty"

        )

        .value = "";


    document

        .getElementById(

            "kodTempatKerja"

        )

        .value = "";


    document

        .getElementById(

            "hariOffday"

        )

        .checked = false;


    document

        .getElementById(

            "jamOffday"

        )

        .value = 0;


    document

        .getElementById(

            "hariCutiam"

        )

        .checked = false;


    document

        .getElementById(

            "jamCutiam"

        )

        .value = 0;


    document

        .getElementById(

            "jamKlm"

        )

        .value = "";


    kosongkanMaklumatAnggota();

}


// =====================================================
// MUAT SENARAI POS
// =====================================================

async function muatSenaraiPos() {


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

            "RALAT POS:",

            error

        );


        return;

    }


    const posUnik =

        [

            ...

            new Set(

                (data || [])

                    .map(

                        function (x) {


                            return x.pos;


                        }

                    )

                    .filter(

                        Boolean

                    )

            )

        ];


    posUnik.sort();


    const selectPos =

        document

            .getElementById(

                "filterPos"

            );


    selectPos.innerHTML = `

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


            selectPos.appendChild(

                option

            );


        }

    );

}


// =====================================================
// PAPAR SENARAI DUTY
// =====================================================

async function paparDuty() {


    const tarikh =

        document

            .getElementById(

                "filterTarikh"

            )

            .value;


    const pos =

        document

            .getElementById(

                "filterPos"

            )

            .value;


    const cari =

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

            .select(

                "*"

            )

            .order(

                "tarikh",

                {

                    ascending:

                        true

                }

            );


    if (tarikh) {


        query =

            query.eq(

                "tarikh",

                tarikh

            );

    }


    if (pos) {


        query =

            query.eq(

                "nama_pos_asal",

                pos

            );

    }


    const {

        data,

        error

    } =

        await query;


    if (error) {


        console.error(

            "RALAT JADUAL:",

            error

        );


        paparMesej(

            "Gagal ambil jadual duty: "

            + error.message,

            "error"

        );


        return;

    }


    const tbody =

        document

            .getElementById(

                "senaraiDuty"

            );


    tbody.innerHTML = "";


    const filtered =

        (data || [])

            .filter(

                function (row) {


                    const nama =

                        (

                            row

                                .nama_anggota

                            || ""

                        )

                        .toLowerCase();


                    return nama.includes(

                        cari

                    );

                }

            );


    if (

        filtered.length

        === 0

    ) {


        tbody.innerHTML = `

            <tr>

                <td colspan="18">

                    Tiada rekod duty.

                </td>

            </tr>

        `;


        return;

    }


    filtered.forEach(

        function (row, index) {


            const tr =

                document

                    .createElement(

                        "tr"

                    );


            tr.innerHTML = `


                <td>

                    ${formatTarikh(

                        row.tarikh

                    )}

                </td>


                <td>

                    ${row.hari || ""}

                </td>


                <td>

                    ${row.no_skb || ""}

                </td>


                <td>

                    ${row.no_anggota || ""}

                </td>


                <td>

                    ${row.nama_anggota || ""}

                </td>


                <td>

                    ${row.kawasan || ""}

                </td>


                <td>

                    ${row.unit || ""}

                </td>


                <td>

                    ${row.ketua_unit || ""}

                </td>


                <td>

                    ${row.ketua_pos || ""}

                </td>


                <td>

                    ${row.nama_pos_asal || ""}

                </td>


                <td>

                    <span class="badge">

                        ${row.kod_waktu_kerja || ""}

                    </span>

                </td>


                <td>

                    ${row.kod_tempat_kerja || ""}

                </td>


                <td>

                    ${row.jam_klm || 0}

                </td>


                <td>

                    ${Number(

                        row.hari_offday_bertugas

                    ) === 1

                        ? "Ya"

                        : "Tidak"

                    }

                </td>


                <td>

                    ${row.jam_offday_bertugas || 0}

                </td>


                <td>

                    ${Number(

                        row.hari_cutiam_bertugas

                    ) === 1

                        ? "Ya"

                        : "Tidak"

                    }

                </td>


                <td>

                    ${row.jam_cutiam_bertugas || 0}

                </td>


                <td>


                    <button

                        class="btn-danger"

                        onclick="

                            padamDuty(

                                '${row.no_skb}',

                                '${row.tarikh}'

                            )

                        "

                    >

                        Padam

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
// PADAM DUTY
// =====================================================

async function padamDuty(

    noSkb,

    tarikh

) {


    if (

        !confirm(

            "Padam rekod duty ini?"

        )

    ) {


        return;

    }


    const { error } =

        await supabaseClient

            .from(

                "jadual_duty"

            )

            .delete()

            .eq(

                "no_skb",

                noSkb

            )

            .eq(

                "tarikh",

                tarikh

            );


    if (error) {


        paparMesej(

            "Gagal padam: "

            + error.message,

            "error"

        );


        return;

    }


    paparMesej(

        "Rekod duty telah dipadam.",

        "success"

    );


    paparDuty();

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


            div.textContent = "";


            div.className = "";


        },

        5000

    );

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
