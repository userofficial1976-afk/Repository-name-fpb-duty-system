```javascript
// =====================================================
// JADUAL DUTY.JS
// =====================================================


// =====================================================
// PEMBOLEHUBAH
// =====================================================

let semuaAnggota = [];

let semuaKodDuty = [];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {


        console.log(
            "JADUAL DUTY BERJAYA DIBUKA"
        );


        // Tarikh hari ini

        const tarikh =
            document.getElementById(
                "tarikh"
            );


        const filterTarikh =
            document.getElementById(
                "filterTarikh"
            );


        if (tarikh) {

            tarikh.valueAsDate =
                new Date();

        }


        if (filterTarikh) {

            filterTarikh.valueAsDate =
                new Date();

        }


        // Muat semua data

        await muatAnggota();

        await muatKodDuty();

        await muatSenaraiPos();

        await paparDuty();


    }
);


// =====================================================
// MUAT DATA ANGGOTA
// =====================================================

async function muatAnggota() {


    console.log(
        "MULA MUAT ANGGOTA"
    );


    const result =
        await supabaseClient

        .from(
            "Data_Anggota"
        )

        .select(
            "*"
        )

        .order(
            "nama",
            {
                ascending: true
            }
        );


    console.log(
        "DATA ANGGOTA:",
        result.data
    );


    console.log(
        "RALAT ANGGOTA:",
        result.error
    );


    if (
        result.error
    ) {


        paparMesej(
            "Gagal ambil anggota: "
            + result.error.message,
            "error"
        );


        return;

    }


    semuaAnggota =
        result.data
        || [];


    const select =
        document.getElementById(
            "anggota"
        );


    if (
        !select
    ) {


        console.error(
            "ID anggota tidak dijumpai"
        );


        return;

    }


    select.innerHTML = `

        <option value="">

            -- Pilih Anggota --

        </option>

    `;


    semuaAnggota.forEach(
        function (anggota) {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                String(
                    anggota.no_skb
                    || ""
                );


            option.textContent =

                String(
                    anggota.no_skb
                    || ""
                )

                + " | "

                + String(
                    anggota.no_anggota
                    || ""
                )

                + " | "

                + String(
                    anggota.nama
                    || ""
                );


            select.appendChild(
                option
            );


        }
    );


    console.log(
        "JUMLAH ANGGOTA:",
        semuaAnggota.length
    );


}


// =====================================================
// MUAT KOD DUTY
// =====================================================

async function muatKodDuty() {


    console.log(
        "MULA MUAT KOD DUTY"
    );


    const result =
        await supabaseClient

        .from(
            "kod_duty"
        )

        .select(
            "*"
        )

        .order(
            "kod",
            {
                ascending: true
            }
        );


    console.log(
        "DATA KOD DUTY:",
        result.data
    );


    console.log(
        "RALAT KOD DUTY:",
        result.error
    );


    if (
        result.error
    ) {


        paparMesej(
            "Gagal ambil kod duty: "
            + result.error.message,
            "error"
        );


        return;

    }


    semuaKodDuty =
        result.data
        || [];


    const select =
        document.getElementById(
            "kodDuty"
        );


    if (
        !select
    ) {


        console.error(
            "ID kodDuty tidak dijumpai"
        );


        return;

    }


    select.innerHTML = `

        <option value="">

            -- Pilih Kod Duty --

        </option>

    `;


    semuaKodDuty.forEach(
        function (duty) {


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                String(
                    duty.kod
                    || ""
                );


            option.textContent =

                String(
                    duty.kod
                    || ""
                )

                + " | "

                + String(
                    duty.waktu_tugasan
                    || ""
                )

                + " | "

                + String(
                    duty.jam_kerja
                    || 0
                )

                + " jam kerja"

                + " | "

                + String(
                    duty.jam_klm
                    || 0
                )

                + " jam KLM";


            select.appendChild(
                option
            );


        }
    );


    console.log(
        "JUMLAH KOD DUTY:",
        semuaKodDuty.length
    );


}


// =====================================================
// PILIH ANGGOTA
// =====================================================

document.addEventListener(
    "change",
    function (event) {


        if (
            event.target.id
            !==
            "anggota"
        ) {


            return;

        }


        const noSkb =
            event.target.value;


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


    }
);


// =====================================================
// PILIH KOD DUTY
// =====================================================

document.addEventListener(
    "change",
    function (event) {


        if (
            event.target.id
            !==
            "kodDuty"
        ) {


            return;

        }


        const kod =
            event.target.value;


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


    const dikemaskiniOleh =
        document
        .getElementById(
            "dikemaskiniOleh"
        )
        .value;


    if (
        !tarikh
        ||
        !noSkb
        ||
        !kodDuty
    ) {


        paparMesej(
            "Sila lengkapkan Tarikh, Anggota dan Kod Duty.",
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
        !duty
    ) {


        paparMesej(
            "Data anggota atau kod duty tidak dijumpai.",
            "error"
        );


        return;

    }


    const tarikhObj =
        new Date(
            tarikh
            + "T00:00:00"
        );


    const result =
        await supabaseClient

        .from(
            "jadual_duty"
        )

        .insert({

            tarikh:
                tarikh,

            bulan:
                tarikhObj.getMonth()
                + 1,

            tahun:
                tarikhObj.getFullYear(),

            no_skb:
                anggota.no_skb,

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

            dikemaskini_oleh:
                dikemaskiniOleh

        });


    if (
        result.error
    ) {


        console.error(
            "RALAT SIMPAN:",
            result.error
        );


        paparMesej(
            "Gagal simpan: "
            + result.error.message,
            "error"
        );


        return;

    }


    paparMesej(
        "Duty berjaya disimpan.",
        "success"
    );


    await paparDuty();


}


// =====================================================
// MUAT SENARAI POS
// =====================================================

async function muatSenaraiPos() {


    const result =
        await supabaseClient

        .from(
            "Data_Anggota"
        )

        .select(
            "pos"
        );


    if (
        result.error
    ) {


        console.error(
            "RALAT POS:",
            result.error
        );


        return;

    }


    const posUnik =
        [

            ...new Set(

                result.data

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


    posUnik.forEach(
        function (pos) {


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
// PAPAR DUTY
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


    const tbody =
        document
        .getElementById(
            "senaraiDuty"
        );


    if (
        !filterTarikh
        ||
        !filterPos
        ||
        !cariNama
        ||
        !tbody
    ) {


        return;

    }


    const tarikh =
        filterTarikh.value;


    const pos =
        filterPos.value;


    const cari =
        cariNama.value
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
                "pos",
                pos
            );


    }


    const result =
        await query;


    if (
        result.error
    ) {


        console.error(
            "RALAT JADUAL:",
            result.error
        );


        return;

    }


    tbody.innerHTML =
        "";


    const data =
        result.data
        || [];


    const filtered =
        data.filter(
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
                    (
                        anggota?.nama
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

                <td colspan="11">

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

                    ${anggota?.no_anggota || ""}

                </td>

                <td>

                    ${anggota?.nama || ""}

                </td>

                <td>

                    ${anggota?.pangkat || ""}

                </td>

                <td>

                    ${row.pos || ""}

                </td>

                <td>

                    <span class="badge">

                        ${row.kod_dutyy || ""}

                    </span>

                </td>

                <td>

                    ${row.waktu_tugasan || ""}

                </td>

                <td>

                    ${row.jam_kerja || 0}

                </td>

                <td>

                    ${row.jam_klm || 0}

                </td>

                <td>

                    <button

                        class="btn-danger"

                        onclick="padamDuty(

                            '${row.no_skb}',

                            '${row.tarikh}'

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
// EVENT FILTER
// =====================================================

document.addEventListener(
    "change",
    function (event) {


        if (
            event.target.id
            ===
            "filterTarikh"
        ) {


            paparDuty();


        }


        if (
            event.target.id
            ===
            "filterPos"
        ) {


            paparDuty();


        }


    }
);


document.addEventListener(
    "keyup",
    function (event) {


        if (
            event.target.id
            ===
            "cariNama"
        ) {


            paparDuty();


        }


    }
);


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


    const result =
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


    if (
        result.error
    ) {


        paparMesej(
            "Gagal padam: "
            + result.error.message,
            "error"
        );


        return;

    }


    paparMesej(
        "Rekod duty telah dipadam.",
        "success"
    );


    await paparDuty();


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
```
