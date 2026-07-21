// =====================================================
// JADUAL DUTY
// =====================================================


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


        const tarikhInput =

            document.getElementById(

                "tarikh"

            );


        const filterTarikh =

            document.getElementById(

                "filterTarikh"

            );


        if (

            tarikhInput

        ) {


            tarikhInput.valueAsDate =

                new Date();


            kemaskiniTarikh();

        }


        if (

            filterTarikh

        ) {


            filterTarikh.valueAsDate =

                new Date();

        }


        await muatAnggota();

        await muatKodDuty();

        await muatTempatKerja();

        await muatSenaraiPos();

        paparDuty();

    }

);


// =====================================================
// TARIKH → BULAN / TAHUN / HARI
// =====================================================

const tarikhInput =

    document.getElementById(

        "tarikh"

    );


if (

    tarikhInput

) {


    tarikhInput.addEventListener(

        "change",

        kemaskiniTarikh

    );

}


function kemaskiniTarikh() {


    const tarikh =

        document

            .getElementById(

                "tarikh"

            )

            .value;


    if (

        !tarikh

    ) {

        return;

    }


    const date =

        new Date(

            tarikh

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

                weekday: "long"

            }

        );

}


// =====================================================
// MUAT DATA ANGGOTA
// =====================================================

async function muatAnggota() {


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "Data_Anggota"

        )

        .select(`

            no_skb,

            no_anggota,

            nama,

            pangkat,

            pos,

            kawasan,

            unit,

            ketua_unit,

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


    if (

        error

    ) {


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

        data

        || [];


    const select =

        document

            .getElementById(

                "anggota"

            );


    select.innerHTML = `

        <option value="">

            -- Pilih Nama Anggota --

        </option>

    `;


    semuaAnggota.forEach(

        function (

            anggota

        ) {


            const option =

                document.createElement(

                    "option"

                );


            option.value =

                anggota.no_skb;


            option.textContent =

                anggota.nama

                + " | "

                + anggota.no_anggota

                + " | SKB "

                + anggota.no_skb;


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// PILIH ANGGOTA → AUTO ISI MAKLUMAT
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

                    function (

                        x

                    ) {


                        return String(

                            x.no_skb

                        )

                        ===

                        String(

                            noSkb

                        );

                    }

                );


            if (

                !anggota

            ) {

                return;

            }


            document

                .getElementById(

                    "noSkb"

                )

                .value =

                anggota.no_skb

                || "";


            document

                .getElementById(

                    "noAnggota"

                )

                .value =

                anggota.no_anggota

                || "";


            document

                .getElementById(

                    "kawasan"

                )

                .value =

                anggota.kawasan

                || "";


            document

                .getElementById(

                    "unit"

                )

                .value =

                anggota.unit

                || "";


            document

                .getElementById(

                    "ketuaUnit"

                )

                .value =

                anggota.ketua_unit

                || "";


            document

                .getElementById(

                    "ketuaPos"

                )

                .value =

                anggota.ketua_pos

                || "";


            document

                .getElementById(

                    "namaPosAsal"

                )

                .value =

                anggota.pos

                || "";

        }

    );


// =====================================================
// MUAT KOD WAKTU KERJA
// =====================================================

async function muatKodDuty() {


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "kod_duty"

        )

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


    if (

        error

    ) {


        paparMesej(

            "Gagal ambil kod_duty: "

            + error.message,

            "error"

        );


        return;

    }


    semuaKodDuty =

        data

        || [];


    const select =

        document

            .getElementById(

                "kodDuty"

            );


    select.innerHTML = `

        <option value="">

            -- Pilih Kod Waktu Kerja --

        </option>

    `;


    semuaKodDuty.forEach(

        function (

            duty

        ) {


            const option =

                document.createElement(

                    "option"

                );


            option.value =

                duty.kod;


            option.textContent =

                duty.kod

                + " | "

                + duty.waktu_tugasan

                + " | "

                + duty.jam_kerja

                + " Jam Kerja"

                + " | KLM "

                + duty.jam_klm;


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// PILIH KOD DUTY → AUTO JAM KLM
// =====================================================

document

    .getElementById(

        "kodDuty"

    )

    .addEventListener(

        "change",

        function () {


            const duty =

                semuaKodDuty.find(

                    function (

                        x

                    ) {


                        return String(

                            x.kod

                        )

                        ===

                        String(

                            this.value

                        );

                    }.bind(

                        this

                    )

                );


            document

                .getElementById(

                    "jamKlm"

                )

                .value =

                duty

                ? duty.jam_klm

                : 0;

        }

    );


// =====================================================
// MUAT KOD TEMPAT KERJA
// =====================================================

async function muatTempatKerja() {


    const {

        data,

        error

    } = await supabaseClient

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


    if (

        error

    ) {


        paparMesej(

            "Gagal ambil kod tempat kerja: "

            + error.message,

            "error"

        );


        return;

    }


    semuaTempatKerja =

        data

        || [];


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

        function (

            tempat

        ) {


            const option =

                document.createElement(

                    "option"

                );


            option.value =

                tempat.kod_tempat_kerja;


            option.textContent =

                tempat.kod_tempat_kerja

                + " | "

                + tempat.nama_tempat_kerja;


            select.appendChild(

                option

            );

        }

    );

}


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


    const anggotaValue =

        document

            .getElementById(

                "anggota"

            )

            .value;


    const kodDutyValue =

        document

            .getElementById(

                "kodDuty"

            )

            .value;


    const kodTempatValue =

        document

            .getElementById(

                "kodTempatKerja"

            )

            .value;


    if (

        !tarikh

        ||

        !anggotaValue

        ||

        !kodDutyValue

        ||

        !kodTempatValue

    ) {


        paparMesej(

            "Sila lengkapkan Tarikh, Nama Anggota, Kod Waktu Kerja dan Kod Tempat Kerja.",

            "error"

        );


        return;

    }


    const anggota =

        semuaAnggota.find(

            function (

                x

            ) {


                return String(

                    x.no_skb

                )

                ===

                String(

                    anggotaValue

                );

            }

        );


    const duty =

        semuaKodDuty.find(

            function (

                x

            ) {


                return String(

                    x.kod

                )

                ===

                String(

                    kodDutyValue

                );

            }

        );


    if (

        !anggota

        ||

        !duty

    ) {


        paparMesej(

            "Maklumat anggota atau kod duty tidak dijumpai.",

            "error"

        );


        return;

    }


    const tarikhObj =

        new Date(

            tarikh

            + "T00:00:00"

        );


    const rekod = {


        tarikh:

            tarikh,


        bulan:

            tarikhObj.getMonth()

            + 1,


        tahun:

            tarikhObj.getFullYear(),


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

            tarikhObj.toLocaleDateString(

                "ms-MY",

                {

                    weekday: "long"

                }

            ),


        kod_waktu_kerja:

            duty.kod,


        kod_tempat_kerja:

            kodTempatValue,


        jam_klm:

            Number(

                duty.jam_klm

                || 0

            ),


        hari_offday_bertugas:

            document

                .getElementById(

                    "hariOffday"

                )

                .value

                .trim()

                || null,


        jam_offday_bertugas:

            Number(

                document

                    .getElementById(

                        "jamOffday"

                    )

                    .value

                )

                || 0,


        hari_cutiam_bertugas:

            document

                .getElementById(

                    "hariCutiam"

                )

                .value

                .trim()

                || null,


        jam_cutiam_bertugas:

            Number(

                document

                    .getElementById(

                        "jamCutiam"

                    )

                    .value

                )

                || 0

    };


    console.log(

        "DATA YANG AKAN DISIMPAN:",

        rekod

    );


    const {

        error

    } = await supabaseClient

        .from(

            "jadual_duty"

        )

        .insert(

            rekod

        );


    if (

        error

    ) {


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
// MUAT SENARAI POS
// =====================================================

async function muatSenaraiPos() {


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "jadual_duty"

        )

        .select(

            "nama_pos_asal"

        );


    if (

        error

    ) {

        return;

    }


    const posUnik =

        [

            ...

            new Set(

                (

                    data

                    || []

                )

                    .map(

                        function (

                            x

                        ) {


                            return x.nama_pos_asal;

                        }

                    )

                    .filter(

                        Boolean

                    )

            )

        ];


    posUnik.sort();


    const select =

        document

            .getElementById(

                "filterPos"

            );


    if (

        !select

    ) {

        return;

    }


    select.innerHTML = `

        <option value="">

            Semua Pos

        </option>

    `;


    posUnik.forEach(

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


            select.appendChild(

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

                    ascending: true

                }

            );


    if (

        tarikh

    ) {


        query =

            query.eq(

                "tarikh",

                tarikh

            );

    }


    if (

        pos

    ) {


        query =

            query.eq(

                "nama_pos_asal",

                pos

            );

    }


    const {

        data,

        error

    } = await query;


    if (

        error

    ) {


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

        (

            data

            || []

        )

            .filter(

                function (

                    row

                ) {


                    return (

                        row.nama_anggota

                        || ""

                    )

                        .toLowerCase()

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

                <td colspan="18">

                    Tiada rekod duty.

                </td>

            </tr>

        `;


        return;

    }


    filtered.forEach(

        function (

            row

        ) {


            const tr =

                document.createElement(

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

                    ${row.hari_offday_bertugas || ""}

                </td>


                <td>

                    ${row.jam_offday_bertugas || 0}

                </td>


                <td>

                    ${row.hari_cutiam_bertugas || ""}

                </td>


                <td>

                    ${row.jam_cutiam_bertugas || 0}

                </td>


                <td>

                    <button

                        class="btn-danger"

                        onclick="padamDuty(

                            '${row.no_skb}',

                            '${row.tarikh}',

                            '${row.kod_waktu_kerja}',

                            '${row.kod_tempat_kerja}'

                        )"

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

    tarikh,

    kodWaktu,

    kodTempat

) {


    if (

        !confirm(

            "Padam rekod duty ini?"

        )

    ) {


        return;

    }


    const {

        error

    } = await supabaseClient

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

            "kod_waktu_kerja",

            kodWaktu

        )

        .eq(

            "kod_tempat_kerja",

            kodTempat

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

        "Rekod duty telah dipadam.",

        "success"

    );


    paparDuty();

}


// =====================================================
// RESET BORANG
// =====================================================

function resetBorang() {


    const ids = [

        "anggota",

        "noSkb",

        "noAnggota",

        "kawasan",

        "unit",

        "ketuaUnit",

        "ketuaPos",

        "namaPosAsal",

        "kodDuty",

        "kodTempatKerja",

        "jamKlm",

        "hariOffday",

        "jamOffday",

        "hariCutiam",

        "jamCutiam"

    ];


    ids.forEach(

        function (

            id

        ) {


            const el =

                document

                    .getElementById(

                        id

                    );


            if (

                el

            ) {


                if (

                    el.tagName

                    ===

                    "SELECT"

                ) {


                    el.selectedIndex =

                        0;

                }

                else {


                    el.value =

                        "";

                }

            }

        }

    );


    document

        .getElementById(

            "jamOffday"

        )

        .value =

        0;


    document

        .getElementById(

            "jamCutiam"

        )

        .value =

        0;


    kemaskiniTarikh();

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


    if (

        !div

    ) {


        alert(

            mesej

        );


        return;

    }


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


    if (

        !tarikh

    ) {


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
