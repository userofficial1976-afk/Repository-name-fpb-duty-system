// =====================================================
// DATA ANGGOTA
// =====================================================

let semuaAnggota = [];

let semuaDuty = [];


// =====================================================
// MULA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await muatAnggota();

        await muatKodDuty();

        await muatKodTempatKerja();

        await muatDuty();

        isiTarikhHariIni();

    }
);


// =====================================================
// MUAT DATA ANGGOTA
// =====================================================

async function muatAnggota() {

    const result =
        await supabaseClient

        .from("Data_Anggota")

        .select(
            `
            no_skb,
            no_anggota,
            nama,
            pangkat,
            wilayah,
            kawasan,
            pos,
            unit,
            jawatan,
            ketua_pos,
            ketua_unit,
            status
            `
        )

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


    if (result.error) {

        paparMesej(
            "Gagal ambil data anggota: "
            + result.error.message,
            "error"
        );

        return;

    }


    semuaAnggota =
        result.data || [];


    isiUnit();

    isiPosAnggota();

    isiPosFilter();

}


// =====================================================
// UNIT
// =====================================================

function isiUnit() {

    const select =
        document.getElementById(
            "unitPilihan"
        );


    const unitUnik = [

        ...new Set(

            semuaAnggota

                .map(
                    x => x.unit
                )

                .filter(
                    Boolean
                )

        )

    ];


    unitUnik.sort();


    unitUnik.forEach(

        function (unit) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                unit;


            option.textContent =
                unit;


            select.appendChild(
                option
            );

        }

    );

}


// =====================================================
// POS ASAL - BORANG DUTY
// =====================================================

function isiPosAnggota() {

    const select =
        document.getElementById(
            "posAsal"
        );


    const posUnik = [

        ...new Set(

            semuaAnggota

                .map(
                    x => x.pos
                )

                .filter(
                    Boolean
                )

        )

    ];


    posUnik.sort();


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
// POS ASAL - FILTER SENARAI DUTY
// =====================================================

function isiPosFilter() {

    const select =
        document.getElementById(
            "filterPos"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">

            Semua Pos

        </option>

    `;


    const posUnik = [

        ...new Set(

            semuaAnggota

                .map(
                    x => x.pos
                )

                .filter(
                    Boolean
                )

        )

    ];


    posUnik.sort();


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
// PILIH UNIT
// =====================================================

document
    .getElementById(
        "unitPilihan"
    )
    .addEventListener(

        "change",

        function () {

            const unit =
                this.value;


            const posSelect =
                document.getElementById(
                    "posAsal"
                );


            posSelect.innerHTML = `

                <option value="">

                    -- Pilih Pos Asal --

                </option>

            `;


            const posUnik = [

                ...new Set(

                    semuaAnggota

                        .filter(
                            x =>
                            x.unit === unit
                        )

                        .map(
                            x => x.pos
                        )

                        .filter(
                            Boolean
                        )

                )

            ];


            posUnik.sort();


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


                    posSelect.appendChild(
                        option
                    );

                }

            );

        }

    );


// =====================================================
// PILIH POS ASAL
// =====================================================

document
    .getElementById(
        "posAsal"
    )
    .addEventListener(

        "change",

        function () {

            const unit =
                document
                .getElementById(
                    "unitPilihan"
                )
                .value;


            const pos =
                this.value;


            const anggotaPos =

                semuaAnggota.filter(

                    function (x) {

                        return (

                            x.pos === pos

                            &&

                            (

                                !unit

                                ||

                                x.unit === unit

                            )

                        );

                    }

                );


            const anggotaSelect =
                document.getElementById(
                    "anggota"
                );


            anggotaSelect.innerHTML = `

                <option value="">

                    -- Pilih Nama Anggota --

                </option>

            `;


            anggotaPos.forEach(

                function (anggota) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        anggota.no_skb;


                    option.textContent =
                        anggota.nama;


                    anggotaSelect.appendChild(
                        option
                    );

                }

            );

        }

    );


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

                    x =>

                    String(
                        x.no_skb
                    )

                    ===

                    String(
                        noSkb
                    )

                );


            if (!anggota) {

                return;

            }


            document
                .getElementById(
                    "noSkb"
                )
                .value =
                anggota.no_skb || "";


            document
                .getElementById(
                    "noAnggota"
                )
                .value =
                anggota.no_anggota || "";


            document
                .getElementById(
                    "kawasan"
                )
                .value =
                anggota.kawasan || "";


            document
                .getElementById(
                    "unit"
                )
                .value =
                anggota.unit || "";


            document
                .getElementById(
                    "ketuaUnit"
                )
                .value =
                anggota.ketua_unit || "";


            document
                .getElementById(
                    "ketuaPos"
                )
                .value =
                anggota.ketua_pos || "";


            document
                .getElementById(
                    "namaPosAsal"
                )
                .value =
                anggota.pos || "";

        }

    );


// =====================================================
// PILIH BULAN - PAPAR DUTY
// =====================================================

function paparDuty() {

    const bulan =
        document
        .getElementById(
            "filterBulan"
        )
        .value;


    const filterPos =
        document
        .getElementById(
            "filterPos"
        )
        .value;


    const cariNama =
        document
        .getElementById(
            "cariNama"
        )
        .value
        .toLowerCase()
        .trim();


    const tbody =
        document
        .getElementById(
            "senaraiDuty"
        );


    if (!bulan) {

        tbody.innerHTML = `

            <tr>

                <td colspan="18">

                    Sila pilih bulan

                </td>

            </tr>

        `;

        return;

    }


    const data =
        semuaDuty.filter(

            function (x) {

                const tarikh =
                    String(
                        x.tarikh
                    );


                const bulanData =
                    tarikh.substring(
                        0,
                        7
                    );


                return (

                    bulanData === bulan

                    &&

                    (

                        !filterPos

                        ||

                        x.pos === filterPos

                    )

                    &&

                    (

                        !cariNama

                        ||

                        String(
                            x.nama
                        )
                        .toLowerCase()
                        .includes(
                            cariNama
                        )

                    )

                );

            }

        );


    tbody.innerHTML = "";


    if (
        data.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="18">

                    Tiada rekod duty untuk bulan ini.

                </td>

            </tr>

        `;

        return;

    }


    data.forEach(

        function (duty) {

            const tr =
                document
                .createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${duty.tarikh || ""}
                </td>

                <td>
                    ${duty.hari || ""}
                </td>

                <td>
                    ${duty.no_skb || ""}
                </td>

                <td>
                    ${duty.no_anggota || ""}
                </td>

                <td>
                    ${duty.nama || ""}
                </td>

                <td>
                    ${duty.kawasan || ""}
                </td>

                <td>
                    ${duty.unit || ""}
                </td>

                <td>
                    ${duty.ketua_unit || ""}
                </td>

                <td>
                    ${duty.ketua_pos || ""}
                </td>

                <td>
                    ${duty.pos || ""}
                </td>

                <td>
                    ${duty.kod_duty || ""}
                </td>

                <td>
                    ${duty.kod_tempat_kerja || ""}
                </td>

                <td>
                    ${duty.jam_klm || 0}
                </td>

                <td>
                    ${duty.hari_offday ? "Ya" : "Tidak"}
                </td>

                <td>
                    ${duty.jam_offday || 0}
                </td>

                <td>
                    ${duty.hari_cutiam ? "Ya" : "Tidak"}
                </td>

                <td>
                    ${duty.jam_cutiam || 0}
                </td>

                <td>

                    <button
                        onclick="padamDuty('${duty.id}')"
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
// MUAT DUTY
// =====================================================

async function muatDuty() {

    const result =
        await supabaseClient

        .from(
            "jadual_duty"
        )

        .select(
            "*"
        )

        .order(
            "tarikh",
            {
                ascending: false
            }
        );


    if (result.error) {

        paparMesej(
            "Gagal ambil data duty: "
            + result.error.message,
            "error"
        );

        return;

    }


    semuaDuty =
        result.data || [];


    paparDuty();

}
