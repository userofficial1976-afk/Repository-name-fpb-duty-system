```javascript
// =====================================================
// JADUAL DUTY
// =====================================================


// DATA MEMORY

let semuaAnggota = [];

let semuaKodDuty = [];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {


        document
        .getElementById(
            "tarikh"
        )
        .valueAsDate =
            new Date();


        document
        .getElementById(
            "filterTarikh"
        )
        .valueAsDate =
            new Date();


        await muatAnggota();


        await muatKodDuty();


        await muatSenaraiPos();


        await paparDuty();


    }
);


// =====================================================
// MUAT ANGGOTA
// =====================================================

async function muatAnggota() {


    const result =
        await supabaseClient

        .from(
            "Data_Anggota"
        )

        .select(
            "no_skb,no_anggota,nama,pangkat,pos,unit,status"
        )

        .order(
            "nama",
            {
                ascending: true
            }
        );


    if (
        result.error
    ) {


        console.error(
            "RALAT ANGGOTA:",
            result.error
        );


        paparMesej(
            result.error.message,
            "error"
        );


        return;

    }


    semuaAnggota =
        result.data
        || [];


    const select =
        document
        .getElementById(
            "anggota"
        );


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
                );


            option.textContent =

                anggota.no_skb

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


            select.appendChild(
                option
            );


        }
    );


}


// =====================================================
// MUAT KOD DUTY
// =====================================================

async function muatKodDuty() {


    const result =
        await supabaseClient

        .from(
            "kod_duty"
        )

        .select(
            "kod,waktu_tugasan,jam_kerja,jam_klm,status"
        )

        .order(
            "kod",
            {
                ascending: true
            }
        );


    if (
        result.error
    ) {


        console.error(
            "RALAT KOD DUTY:",
            result.error
        );


        paparMesej(
            result.error.message,
            "error"
        );


        return;

    }


    semuaKodDuty =
        result.data
        || [];


    const select =
        document
        .getElementById(
            "kodDuty"
        );


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
                );


            option.textContent =

                duty.kod

                + " | "

                + duty.waktu_tugasan

                + " | "

                + duty.jam_kerja

                + " jam kerja"

                + " | "

                + duty.jam_klm

                + " jam KLM";


            select.appendChild(
                option
            );


        }
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
            duty.kod;


        document
        .getElementById(
            "infoWaktu"
        )
        .textContent =
            duty.waktu_tugasan;


        document
        .getElementById(
            "infoJamKerja"
        )
        .textContent =
            duty.jam_kerja
            + " jam";


        document
        .getElementById(
            "infoJamKlm"
        )
        .textContent =
            duty.jam_klm
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


    paparDuty();


}


// =====================================================
// MUAT POS
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
                "pos",
                pos
            );


    }


    const result =
        await query;


    if (
        result.error
    ) {


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
        result.data.filter(
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


                return (

                    anggota?.nama
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
                    ${formatTarikh(row.tarikh)}
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
// FILTER
// =====================================================

document
.getElementById(
    "filterTarikh"
)
.addEventListener(
    "change",
    paparDuty
);


document
.getElementById(
    "filterPos"
)
.addEventListener(
    "change",
    paparDuty
);


document
.getElementById(
    "cariNama"
)
.addEventListener(
    "keyup",
    paparDuty
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
            result.error.message,
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
