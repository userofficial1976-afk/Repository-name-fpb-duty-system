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
// MUAT ANGGOTA
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

            unit,

            kawasan,

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

        data || [];


    const selectAnggota =

        document.getElementById(

            "anggota"

        );


    if (

        !selectAnggota

    ) {

        return;

    }


    selectAnggota.innerHTML = `

        <option value="">

            -- Pilih Anggota --

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


            selectAnggota.appendChild(

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

        document.getElementById(

            "kodDuty"

        );


    if (

        !selectKod

    ) {

        return;

    }


    selectKod.innerHTML = `

        <option value="">

            -- Pilih Kod Duty --

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


            selectKod.appendChild(

                option

            );


        }

    );

}


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


    const selectTempatKerja =

        document.getElementById(

            "kodTempatKerja"

        );


    if (

        !selectTempatKerja

    ) {

        return;

    }


    selectTempatKerja.innerHTML = `

        <option value="">

            -- Pilih Tempat Kerja --

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


            selectTempatKerja.appendChild(

                option

            );


        }

    );

}


// =====================================================
// PILIH ANGGOTA
// =====================================================

const selectAnggota =

    document.getElementById(

        "anggota"

    );


if (

    selectAnggota

) {


    selectAnggota.addEventListener(

        "change",

        function () {


            const noSkb =

                this.value;


            const anggota =

                semuaAnggota.find(

                    function (

                        x

                    ) {


                        return (

                            String(

                                x.no_skb

                            )

                            ===

                            String(

                                noSkb

                            )

                        );

                    }

                );


            if (

                !anggota

            ) {


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


            const ketuaPos =

                document

                    .getElementById(

                        "dikemaskiniOleh"

                    );


            if (

                ketuaPos

            ) {


                ketuaPos.value =

                    anggota.ketua_pos

                    || "";

            }

        }

    );

}


// =====================================================
// PILIH KOD DUTY
// =====================================================

const selectKodDuty =

    document.getElementById(

        "kodDuty"

    );


if (

    selectKodDuty

) {


    selectKodDuty.addEventListener(

        "change",

        function () {


            const kod =

                this.value;


            const duty =

                semuaKodDuty.find(

                    function (

                        x

                    ) {


                        return (

                            String(

                                x.kod

                            )

                            ===

                            String(

                                kod

                            )

                        );

                    }

                );


            if (

                !duty

            ) {


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


    const noSkb =

        document

            .getElementById(

                "anggota"

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

            "Sila lengkapkan Tarikh, Anggota, Kod Duty dan Kod Tempat Kerja.",

            "error"

        );


        return;

    }


    const anggota =

        semuaAnggota.find(

            function (

                x

            ) {


                return (

                    String(

                        x.no_skb

                    )

                    ===

                    String(

                        noSkb

                    )

                );

            }

        );


    const duty =

        semuaKodDuty.find(

            function (

                x

            ) {


                return (

                    String(

                        x.kod

                    )

                    ===

                    String(

                        kodDuty

                    )

                );

            }

        );


    const tempat =

        semuaTempatKerja.find(

            function (

                x

            ) {


                return (

                    String(

                        x.kod_tempat_kerja

                    )

                    ===

                    String(

                        kodTempatKerja

                    )

                );

            }

        );


    if (

        !anggota

        ||

        !duty

        ||

        !tempat

    ) {


        paparMesej(

            "Data anggota, duty atau tempat kerja tidak dijumpai.",

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


    const namaHari =

        tarikhObj.toLocaleDateString(

            "ms-MY",

            {

                weekday: "long"

            }

        );


    const rekod = {


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

            namaHari,


        kod_waktu_kerja:

            duty.kod,


        kod_tempat_kerja:

            tempat.kod_tempat_kerja,


        jam_klm:

            Number(

                duty.jam_klm

                || 0

            ),


        hari_offday_bertugas:

            null,


        jam_offday_bertugas:

            0,


        hari_cutiam_bertugas:

            null,


        jam_cutiam_bertugas:

            0

    };


    console.log(

        "REKOD YANG AKAN DISIMPAN:",

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

            "Data_Anggota"

        )

        .select(

            "pos"

        )

        .eq(

            "status",

            "Aktif"

        );


    if (

        error

    ) {


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

                (

                    data

                    || []

                )

                    .map(

                        function (

                            x

                        ) {


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


    if (

        !selectPos

    ) {

        return;

    }


    selectPos.innerHTML = `

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


    const filterTarikh =

        document

            .getElementById(

                "filterTarikh"

            );


    const filterPos =

        document

            .getElementById(

                "filterPos"

            );


    const cariNama =

        document

            .getElementById(

                "cariNama"

            );


    const tarikh =

        filterTarikh

        ?

        filterTarikh.value

        :

        "";


    const pos =

        filterPos

        ?

        filterPos.value

        :

        "";


    const cari =

        cariNama

        ?

        cariNama.value

            .toLowerCase()

        :

        "";


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


    if (

        !tbody

    ) {

        return;

    }


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


                    const nama =

                        (

                            row.nama_anggota

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

        ===

        0

    ) {


        tbody.innerHTML = `

            <tr>

                <td colspan="12">

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

                    ${row.no_skb || ""}

                </td>


                <td>

                    ${row.no_anggota || ""}

                </td>


                <td>

                    ${row.nama_anggota || ""}

                </td>


                <td>

                    ${row.nama_pos_asal || ""}

                </td>


                <td>

                    ${row.kod_waktu_kerja || ""}

                </td>


                <td>

                    ${row.kod_tempat_kerja || ""}

                </td>


                <td>

                    ${row.jam_klm || 0}

                </td>


                <td>

                    ${row.ketua_pos || ""}

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


    const anggota =

        document.getElementById(

            "anggota"

        );


    const kodDuty =

        document.getElementById(

            "kodDuty"

        );


    const tempat =

        document.getElementById(

            "kodTempatKerja"

        );


    if (

        anggota

    ) {


        anggota.value =

            "";

    }


    if (

        kodDuty

    ) {


        kodDuty.value =

            "";

    }


    if (

        tempat

    ) {


        tempat.value =

            "";

    }


    const infoAnggota =

        document.getElementById(

            "infoAnggota"

        );


    const infoDuty =

        document.getElementById(

            "infoDuty"

        );


    if (

        infoAnggota

    ) {


        infoAnggota.style.display =

            "none";

    }


    if (

        infoDuty

    ) {


        infoDuty.style.display =

            "none";

    }


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
