// =====================================================
// DATA MEMORY
// =====================================================

let semuaAnggota = [];

let semuaKodDuty = [];

let semuaTempatKerja = [];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "JADUAL DUTY JS BERJAYA DIMUAT"
        );


        document
            .getElementById("tarikh")
            .valueAsDate = new Date();


        document
            .getElementById("filterTarikh")
            .valueAsDate = new Date();


        await muatAnggota();


        await muatKodDuty();


        await muatTempatKerja();


        await muatSenaraiPos();


        paparDuty();

    }
);


// =====================================================
// MUAT ANGGOTA
// =====================================================

async function muatAnggota() {

    const { data, error } =

        await supabaseClient

            .from("Data_Anggota")

            .select(`
                no_skb,
                no_anggota,
                nama,
                pangkat,
                pos,
                unit,
                ketua_pos,
                status
            `)

            .eq(
                "status",
                "Aktif"
            )

            .order(
                "nama",
                {
                    ascending: true
                }
            );


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


    semuaAnggota =
        data || [];


    const selectAnggota =
        document
            .getElementById(
                "anggota"
            );


    selectAnggota.innerHTML = `

        <option value="">

            -- Pilih Anggota --

        </option>

    `;


    semuaAnggota.forEach(

        function (anggota) {


            const option =
                document
                    .createElement(
                        "option"
                    );


            option.value =
                String(
                    anggota.no_skb
                );


            option.textContent =

                String(
                    anggota.no_skb
                )

                + " | "

                + (
                    anggota.no_anggota
                    || ""
                )

                + " | "

                + (
                    anggota.nama
                    || ""
                );


            selectAnggota
                .appendChild(
                    option
                );

        }

    );


    console.log(
        "Jumlah anggota aktif:",
        semuaAnggota.length
    );

}


// =====================================================
// MUAT KOD DUTY
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
            "Gagal ambil kod_duty: "
            + error.message,
            "error"
        );


        return;

    }


    semuaKodDuty =
        data || [];


    const selectKod =
        document
            .getElementById(
                "kodDuty"
            );


    selectKod.innerHTML = `

        <option value="">

            -- Pilih Kod Duty --

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
                )

                + " | "

                + (
                    duty.jam_kerja
                    || 0
                )

                + " jam kerja"

                + " | "

                + (
                    duty.jam_klm
                    || 0
                )

                + " jam KLM";


            selectKod
                .appendChild(
                    option
                );

        }

    );

}


// =====================================================
// MUAT KOD TEMPAT KERJA
// =====================================================

async function muatTempatKerja() {

    const { data, error } =

        await supabaseClient

            .from(
                "kod_tempat_kerja"
            )

            .select(`
                id,
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


    semuaTempatKerja =
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


    semuaTempatKerja.forEach(

        function (tempat) {


            const option =
                document
                    .createElement(
                        "option"
                    );


            option.value =
                String(
                    tempat.kod_tempat_kerja
                );


            option.textContent =

                tempat.kod_tempat_kerja

                + " | "

                + (
                    tempat.nama_tempat_kerja
                    || ""
                );


            select
                .appendChild(
                    option
                );

        }

    );


    console.log(
        "Jumlah tempat kerja aktif:",
        semuaTempatKerja.length
    );

}


// =====================================================
// PILIH ANGGOTA
// =====================================================

document

    .getElementById(
        "anggota"
    )

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

                        ===

                        String(
                            noSkb
                        );

                    }

                );


            if (!anggota) {

                document
                    .getElementById(
                        "infoAnggota"
                    )
                    .style.display =
                    "none";


                return;

            }


            document
                .getElementById(
                    "infoAnggota"
                )
                .style.display =
                "block";


            document
                .getElementById(
                    "infoNoSkb"
                )
                .textContent =

                anggota.no_skb
                || "-";


            document
                .getElementById(
                    "infoNoAnggota"
                )
                .textContent =

                anggota.no_anggota
                || "-";


            document
                .getElementById(
                    "infoNama"
                )
                .textContent =

                anggota.nama
                || "-";


            document
                .getElementById(
                    "infoPangkat"
                )
                .textContent =

                anggota.pangkat
                || "-";


            document
                .getElementById(
                    "infoPos"
                )
                .textContent =

                anggota.pos
                || "-";


            document
                .getElementById(
                    "infoUnit"
                )
                .textContent =

                anggota.unit
                || "-";


            document
                .getElementById(
                    "infoKetuaPos"
                )
                .textContent =

                anggota.ketua_pos
                || "-";

        }

    );


// =====================================================
// PILIH TEMPAT KERJA
// =====================================================

document

    .getElementById(
        "kodTempatKerja"
    )

    .addEventListener(

        "change",

        function () {


            const kod =
                this.value;


            const tempat =
                semuaTempatKerja.find(

                    function (x) {

                        return String(
                            x.kod_tempat_kerja
                        )

                        ===

                        String(
                            kod
                        );

                    }

                );


            if (!tempat) {

                document
                    .getElementById(
                        "infoTempatKerja"
                    )
                    .style.display =
                    "none";


                return;

            }


            document
                .getElementById(
                    "infoTempatKerja"
                )
                .style.display =
                "block";


            document
                .getElementById(
                    "infoKodTempatKerja"
                )
                .textContent =

                tempat.kod_tempat_kerja
                || "-";


            document
                .getElementById(
                    "infoNamaTempatKerja"
                )
                .textContent =

                tempat.nama_tempat_kerja
                || "-";

        }

    );


// =====================================================
// PILIH KOD DUTY
// =====================================================

document

    .getElementById(
        "kodDuty"
    )

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

                        ===

                        String(
                            kod
                        );

                    }

                );


            if (!duty) {

                document
                    .getElementById(
                        "infoDuty"
                    )
                    .style.display =
                    "none";


                return;

            }


            document
                .getElementById(
                    "infoDuty"
                )
                .style.display =
                "block";


            document
                .getElementById(
                    "infoKod"
                )
                .textContent =

                duty.kod
                || "-";


            document
                .getElementById(
                    "infoWaktu"
                )
                .textContent =

                duty.waktu_tugasan
                || "-";


            document
                .getElementById(
                    "infoJamKerja"
                )
                .textContent =

                (
                    duty.jam_kerja
                    || 0
                )

                + " jam";


            document
                .getElementById(
                    "infoJamKlm"
                )
                .textContent =

                (
                    duty.jam_klm
                    || 0
                )

                + " jam";

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
                "anggota"
            )
            .value;


    const kodTempatKerja =

        document
            .getElementById(
                "kodTempatKerja"
            )
            .value;


    const kodDuty =

        document
            .getElementById(
                "kodDuty"
            )
            .value;


    if (

        !tarikh

        ||

        !noSkb

        ||

        !kodTempatKerja

        ||

        !kodDuty

    ) {


        paparMesej(

            "Sila lengkapkan Tarikh, Anggota, Kod Tempat Kerja dan Kod Duty.",

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

                ===

                String(
                    noSkb
                );

            }

        );


    const tempatKerja =

        semuaTempatKerja.find(

            function (x) {

                return String(
                    x.kod_tempat_kerja
                )

                ===

                String(
                    kodTempatKerja
                );

            }

        );


    const duty =

        semuaKodDuty.find(

            function (x) {

                return String(
                    x.kod
                )

                ===

                String(
                    kodDuty
                );

            }

        );


    if (

        !anggota

        ||

        !tempatKerja

        ||

        !duty

    ) {


        paparMesej(

            "Data tidak lengkap atau tidak dijumpai.",

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

        tarikhObj
            .getMonth()
        + 1;


    const tahun =

        tarikhObj
            .getFullYear();


    const { error } =

        await supabaseClient

            .from(
                "jadual_duty"
            )

            .insert({

                tarikh:

                    tarikh,

                bulan:

                    bulan,

                tahun:

                    tahun,

                no_skb:

                    anggota.no_skb,

                kod_tempat_kerja:

                    tempatKerja.kod_tempat_kerja,

                tempat_kerja:

                    tempatKerja.nama_tempat_kerja,

                kod_dutyy:

                    duty.kod,

                waktu_tugasan:

                    duty.waktu_tugasan,

                jam_kerja:

                    duty.jam_kerja,

                jam_klm:

                    duty.jam_klm,

                pos:

                    anggota.pos,

                ketua_pos:

                    anggota.ketua_pos,

                dikemaskini_oleh:

                    anggota.ketua_pos,

                dikemaskini_pada:

                    new Date()
                    .toISOString()

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

        "Duty berjaya disimpan.",

        "success"

    );


    kosongkanBorang();


    paparDuty();

}


// =====================================================
// MUAT SENARAI POS ASAL
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

            ...new Set(

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


            selectPos
                .appendChild(
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

            .select("*")

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

                "pos",

                pos

            );

    }


    const { data, error } =

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


    tbody.innerHTML =
        "";


    const filtered =

        (data || [])

            .filter(

                function (row) {


                    const anggota =

                        semuaAnggota.find(

                            function (x) {

                                return String(
                                    x.no_skb
                                )

                                ===

                                String(
                                    row.no_skb
                                );

                            }

                        );


                    const nama =

                        anggota

                        &&

                        anggota.nama

                            ?

                        anggota.nama
                            .toLowerCase()

                            :

                        "";


                    return nama
                        .includes(
                            cari
                        );

                }

            );


    if (

        filtered.length
        ===
        0

    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="14">

                    Tiada rekod duty.

                </td>

            </tr>

        `;


        return;

    }


    filtered.forEach(

        function (row) {


            const anggota =

                semuaAnggota.find(

                    function (x) {

                        return String(
                            x.no_skb
                        )

                        ===

                        String(
                            row.no_skb
                        );

                    }

                );


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

                    ${row.no_skb || ""}

                </td>


                <td>

                    ${
                        (
                            anggota
                            &&
                            anggota.no_anggota
                        )
                        || ""
                    }

                </td>


                <td>

                    ${
                        (
                            anggota
                            &&
                            anggota.nama
                        )
                        || ""
                    }

                </td>


                <td>

                    ${
                        (
                            anggota
                            &&
                            anggota.pangkat
                        )
                        || ""
                    }

                </td>


                <td>

                    ${row.pos || ""}

                </td>


                <td>

                    <span class="badge">

                        ${
                            row.kod_tempat_kerja
                            || ""
                        }

                    </span>

                </td>


                <td>

                    ${
                        row.tempat_kerja
                        || ""
                    }

                </td>


                <td>

                    <span class="badge">

                        ${
                            row.kod_dutyy
                            || ""
                        }

                    </span>

                </td>


                <td>

                    ${
                        row.waktu_tugasan
                        || ""
                    }

                </td>


                <td>

                    ${
                        row.jam_kerja
                        || 0
                    }

                </td>


                <td>

                    ${
                        row.jam_klm
                        || 0
                    }

                </td>


                <td>

                    ${
                        row.ketua_pos
                        || ""
                    }

                </td>


                <td>

                    <button

                        class="btn-danger"

                        onclick="

                            padamDuty(

                                '${row.no_skb}',

                                '${row.tarikh}',

                                '${row.kod_dutyy}',

                                '${row.kod_tempat_kerja}'

                            )

                        "

                    >

                        Padam

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
// PADAM DUTY
// =====================================================

async function padamDuty(

    noSkb,

    tarikh,

    kodDuty,

    kodTempatKerja

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
            )

            .eq(
                "kod_dutyy",
                kodDuty
            )

            .eq(
                "kod_tempat_kerja",
                kodTempatKerja
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
// KOSONGKAN BORANG
// =====================================================

function kosongkanBorang() {


    document
        .getElementById(
            "anggota"
        )
        .value =
        "";


    document
        .getElementById(
            "kodTempatKerja"
        )
        .value =
        "";


    document
        .getElementById(
            "kodDuty"
        )
        .value =
        "";


    document
        .getElementById(
            "infoAnggota"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "infoTempatKerja"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "infoDuty"
        )
        .style.display =
        "none";

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
