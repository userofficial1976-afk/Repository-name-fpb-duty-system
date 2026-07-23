// =====================================================
// LAPORAN-ANGGARAN.JS
// FPB DUTY SYSTEM
// ANGGARAN DUTY BULANAN
// =====================================================


// =====================================================
// PEMBOLEHUBAH GLOBAL
// =====================================================

let semuaPos = [];

let semuaDuty = [];

let semuaAnggota = [];


// =====================================================
// SENARAI BULAN
// =====================================================

const SENARAI_BULAN = [

    "",

    "Januari",

    "Februari",

    "Mac",

    "April",

    "Mei",

    "Jun",

    "Julai",

    "Ogos",

    "September",

    "Oktober",

    "November",

    "Disember"

];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    async function () {

        console.log(
            "===================================="
        );

        console.log(
            "LAPORAN ANGGARAN DIMUATKAN"
        );

        console.log(
            "===================================="
        );


        // =================================================
        // SEMAK SUPABASE CLIENT
        // =================================================

        if (

            typeof supabaseClient ===
            "undefined"

        ) {

            console.error(
                "supabaseClient TIDAK DIJUMPAI"
            );

            paparMesej(
                "Supabase tidak berjaya dimuatkan.",
                "error"
            );

            return;

        }


        // =================================================
        // MUAT SENARAI POS
        // =================================================

        await muatSenaraiPos();


        // =================================================
        // MUAT TAHUN
        // =================================================

        muatSenaraiTahun();

    }

);


// =====================================================
// MUAT SENARAI POS
// SUMBER: jadual_duty
// =====================================================

async function muatSenaraiPos() {

    console.log(
        "MULA AMBIL SENARAI POS..."
    );


    const selectPos =

        document.getElementById(
            "pos"
        );


    if (!selectPos) {

        console.error(
            "ERROR: ID pos TIDAK DIJUMPAI."
        );

        return;

    }


    selectPos.innerHTML = `

        <option value="">

            -- Sedang Memuatkan Pos --

        </option>

    `;


    try {

        const result =

            await supabaseClient

                .from(

                    "jadual_duty"

                )

                .select(

                    "pos"

                );


        console.log(
            "HASIL QUERY POS:",
            result
        );


        if (

            result.error

        ) {

            throw result.error;

        }


        const data =

            result.data || [];


        const setPos =

            new Set();


        data.forEach(

            function (

                item

            ) {

                if (

                    item.pos !== null &&

                    item.pos !== undefined &&

                    String(

                        item.pos

                    ).trim() !== ""

                ) {

                    setPos.add(

                        String(

                            item.pos

                        ).trim()

                    );

                }

            }

        );


        const senaraiPos =

            Array.from(

                setPos

            );


        senaraiPos.sort(

            function (

                a,

                b

            ) {

                return a.localeCompare(

                    b,

                    "ms",

                    {

                        numeric: true

                    }

                );

            }

        );


        semuaPos =

            senaraiPos;


        selectPos.innerHTML = `

            <option value="">

                -- Pilih Pos --

            </option>

        `;


        senaraiPos.forEach(

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


        console.log(

            "JUMLAH POS:",

            senaraiPos.length

        );


        if (

            senaraiPos.length === 0

        ) {

            paparMesej(

                "Tiada Pos dijumpai dalam jadual_duty.",

                "error"

            );

        }

    }

    catch (

        error

    ) {

        console.error(

            "RALAT AMBIL POS:",

            error

        );


        selectPos.innerHTML = `

            <option value="">

                -- Ralat Ambil Pos --

            </option>

        `;


        paparMesej(

            error.message ||

            "Gagal mengambil senarai Pos.",

            "error"

        );

    }

}


// =====================================================
// MUAT SENARAI TAHUN
// =====================================================

function muatSenaraiTahun() {

    const selectTahun =

        document.getElementById(

            "tahun"

        );


    if (!selectTahun) {

        console.warn(

            "Dropdown tahun tidak wujud."

        );

        return;

    }


    const tahunSekarang =

        new Date().getFullYear();


    selectTahun.innerHTML = "";


    for (

        let tahun =

            tahunSekarang - 2;


        tahun <=

        tahunSekarang + 2;


        tahun++

    ) {

        const option =

            document.createElement(

                "option"

            );


        option.value =

            tahun;


        option.textContent =

            tahun;


        if (

            tahun ===

            tahunSekarang

        ) {

            option.selected =

                true;

        }


        selectTahun.appendChild(

            option

        );

    }

}


// =====================================================
// JANA LAPORAN
// =====================================================

async function janaLaporanAnggaran() {

    console.log(

        "===================================="

    );

    console.log(

        "MULA JANA LAPORAN ANGGARAN"

    );

    console.log(

        "===================================="

    );


    const bulanElement =

        document.getElementById(

            "bulan"

        );


    const tahunElement =

        document.getElementById(

            "tahun"

        );


    const posElement =

        document.getElementById(

            "pos"

        );


    const bulan =

        parseInt(

            bulanElement.value,

            10

        );


    const tahun =

        parseInt(

            tahunElement.value,

            10

        );


    const pos =

        posElement.value;


    console.log(

        "FILTER:",

        {

            bulan,

            tahun,

            pos

        }

    );


    if (

        !pos

    ) {

        paparMesej(

            "Sila pilih Pos terlebih dahulu.",

            "error"

        );

        return;

    }


    if (

        !bulan

    ) {

        paparMesej(

            "Sila pilih Bulan terlebih dahulu.",

            "error"

        );

        return;

    }


    paparMesej(

        "Sedang mengambil data duty...",

        "success"

    );


    kosongkanLaporan();


    try {


        // =================================================
        // 1. AMBIL SEMUA DATA DARIPADA JADUAL_DUTY
        // =================================================

        const resultDuty =

            await supabaseClient

                .from(

                    "jadual_duty"

                )

                .select(

                    `

                    tarikh,

                    bulan,

                    tahun,

                    no_skb,

                    kod_duty,

                    waktu_tugasan,

                    jam_kerja,

                    jam_klm,

                    pos,

                    dikemaskini_oleh,

                    dikemaskini_pada,

                    id,

                    ketua_pos,

                    kod_tempat_kerja,

                    tempat_kerja,

                    nama_anggota,

                    no_anggota,

                    kawasan,

                    unit,

                    ketua_unit,

                    nama_ketua_pos,

                    nama_pos_asal,

                    hari,

                    kod_waktu_kerja,

                    hari_offday_bertugas,

                    jam_offday_bertugas,

                    hari_cutiam_bertugas,

                    jam_cutiam_bertugas,

                    pos_tampungan,

                    jam_tampungan

                    `

                )

                .eq(

                    "pos",

                    pos

                )

                .eq(

                    "bulan",

                    bulan

                )

                .eq(

                    "tahun",

                    tahun

                );


        console.log(

            "RESULT JADUAL DUTY:",

            resultDuty

        );


        if (

            resultDuty.error

        ) {

            throw resultDuty.error;

        }


        const dataDuty =

            resultDuty.data || [];


        console.log(

            "JUMLAH DATA DUTY:",

            dataDuty.length

        );


        if (

            dataDuty.length === 0

        ) {

            kosongkanLaporan();


            paparMesej(

                `Tiada data duty bagi Pos: ${pos}`,

                "error"

            );


            return;

        }


        semuaDuty =

            dataDuty;


        // =================================================
        // 2. AMBIL NO SKB
        // =================================================

        const senaraiNoSKB =

            [

                ...new Set(

                    dataDuty

                        .map(

                            function (

                                item

                            ) {

                                return item.no_skb;

                            }

                        )

                        .filter(

                            function (

                                no

                            ) {

                                return (

                                    no !== null &&

                                    no !== undefined &&

                                    String(

                                        no

                                    ).trim() !== ""

                                );

                            }

                        )

                )

            ];


        console.log(

            "SENARAI NO SKB:",

            senaraiNoSKB

        );


        // =================================================
        // 3. AMBIL GAJI POKOK SAHAJA DARI DATA_ANGGOTA
        // =================================================

        let dataAnggota = [];


        if (

            senaraiNoSKB.length > 0

        ) {


            const resultAnggota =

                await supabaseClient

                    .from(

                        "Data_Anggota"

                    )

                    .select(

                        `

                        no_skb,

                        gaji_pokok

                        `

                    )

                    .in(

                        "no_skb",

                        senaraiNoSKB

                    );


            console.log(

                "DATA GAJI:",

                resultAnggota

            );


            if (

                resultAnggota.error

            ) {

                throw resultAnggota.error;

            }


            dataAnggota =

                resultAnggota.data || [];

        }


        // =================================================
        // 4. MAP GAJI
        // =================================================

        const mapGaji =

            new Map();


        dataAnggota.forEach(

            function (

                anggota

            ) {

                mapGaji.set(

                    String(

                        anggota.no_skb

                    ),

                    anggota.gaji_pokok

                );

            }

        );


        // =================================================
        // 5. PAPAR TAJUK
        // =================================================

        paparTajukLaporan(

            dataDuty,

            pos,

            bulan,

            tahun

        );


        // =================================================
        // 6. PAPAR DATA
        // =================================================

        paparJadualAnggaran(

            dataDuty,

            mapGaji

        );


        paparMesej(

            `Laporan berjaya dijana. ${dataDuty.length} rekod duty dijumpai.`,

            "success"

        );

    }

    catch (

        error

    ) {

        console.error(

            "RALAT JANA LAPORAN:",

            error

        );


        paparMesej(

            error.message ||

            "Ralat sistem berlaku.",

            "error"

        );

    }

}


// =====================================================
// PAPAR TAJUK
// =====================================================

function paparTajukLaporan(

    dataDuty,

    pos,

    bulan,

    tahun

) {

    const tajukUnit =

        document.getElementById(

            "tajukUnit"

        );


    const tajukBulan =

        document.getElementById(

            "tajukBulan"

        );


    const tajukPos =

        document.getElementById(

            "tajukPos"

        );


    let unit =

        "WILAYAH TERENGGANU";


    if (

        dataDuty &&

        dataDuty.length > 0 &&

        dataDuty[0].unit

    ) {

        unit =

            dataDuty[0].unit;

    }


    if (

        tajukUnit

    ) {

        tajukUnit.textContent =

            unit;

    }


    if (

        tajukBulan

    ) {

        tajukBulan.textContent =

            `${

                SENARAI_BULAN[bulan]

            } ${tahun}`;

    }


    if (

        tajukPos

    ) {

        tajukPos.textContent =

            pos;

    }

}


// =====================================================
// PAPAR JADUAL ANGGARAN
// =====================================================

function paparJadualAnggaran(

    dataDuty,

    mapGaji

) {

    const tbody =

        document.getElementById(

            "senaraiAnggaran"

        );


    const tfoot =

        document.getElementById(

            "jumlahAnggaran"

        );


    if (

        !tbody

    ) {

        console.error(

            "senaraiAnggaran tidak dijumpai."

        );

        return;

    }


    tbody.innerHTML = "";


    let bil = 1;


    let jumlahJamBiasa = 0;

    let jumlahRMBiasa = 0;

    let jumlahOffKurang4 = 0;

    let jumlahRMOffKurang4 = 0;

    let jumlahOff4Hingga8 = 0;

    let jumlahRMOff4Hingga8 = 0;

    let jumlahOffLebih8 = 0;

    let jumlahRMOffLebih8 = 0;

    let jumlahCutiKurang8 = 0;

    let jumlahRMCutiKurang8 = 0;

    let jumlahCutiLebih8 = 0;

    let jumlahRMCutiLebih8 = 0;


    let jumlahKLM = 0;


    // =================================================
    // PAPAR SETIAP REKOD DUTY
    // =================================================

    dataDuty.forEach(

        function (

            item

        ) {


            // =============================================
            // GAJI POKOK
            // =============================================

            const gajiPokok =

                mapGaji.get(

                    String(

                        item.no_skb

                    )

                ) || 0;


            // =============================================
            // JAM HARI BIASA
            // JUMLAH jam_klm
            // =============================================

            const jamBiasa =

                parseFloat(

                    item.jam_klm

                ) || 0;


            // =============================================
            // HARI OFF
            // =============================================

            const hariOffKurang4 =

                "";


            const hariOff4Hingga8 =

                parseFloat(

                    item.hari_offday_bertugas

                ) || 0;


            const jamOffLebih8 =

                parseFloat(

                    item.jam_offday_bertugas

                ) || 0;


            // =============================================
            // HARI CUTI AM
            // =============================================

            const jamCutiKurang8 =

                parseFloat(

                    item.hari_cutiam_bertugas

                ) || 0;


            const jamCutiLebih8 =

                parseFloat(

                    item.jam_cutiam_bertugas

                ) || 0;


            // =============================================
            // JUMLAH TUNTUTAN KLM
            // KOSONG BUAT MASA INI
            // =============================================

            const jumlahTuntutanKLM =

                "";


            // =============================================
            // BINA BARIS
            // =============================================

            const tr =

                document.createElement(

                    "tr"

                );


            tr.innerHTML = `

                <td>

                    ${bil}

                </td>


                <td>

                    ${escapeHTML(

                        item.no_skb

                    )}

                </td>


                <td class="left">

                    ${escapeHTML(

                        item.nama_anggota

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        gajiPokok

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jamBiasa

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMBiasa

                    )}

                </td>


                <td>

                    ${hariOffKurang4}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMOffKurang4

                    )}

                </td>


                <td>

                    ${formatNombor(

                        hariOff4Hingga8

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMOff4Hingga8

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jamOffLebih8

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMOffLebih8

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jamCutiKurang8

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMCutiKurang8

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jamCutiLebih8

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMCutiLebih8

                    )}

                </td>


                <td>

                    ${jumlahTuntutanKLM}

                </td>

            `;


            tbody.appendChild(

                tr

            );


            bil++;


            jumlahJamBiasa +=

                jamBiasa;


            jumlahOff4Hingga8 +=

                hariOff4Hingga8;


            jumlahOffLebih8 +=

                jamOffLebih8;


            jumlahCutiKurang8 +=

                jamCutiKurang8;


            jumlahCutiLebih8 +=

                jamCutiLebih8;

        }

    );


    // =================================================
    // JUMLAH KESELURUHAN
    // =================================================

    if (

        tfoot

    ) {

        tfoot.innerHTML = `

            <tr class="total-row">

                <td colspan="4">

                    JUMLAH KESELURUHAN

                </td>


                <td>

                    ${formatNombor(

                        jumlahJamBiasa

                    )}

                </td>


                <td>

                    ${formatRM(

                        jumlahRMBiasa

                    )}

                </td>


                <td>

                </td>


                <td>

                    ${formatRM(

                        jumlahRMOffKurang4

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jumlahOff4Hingga8

                    )}

                </td>


                <td>

                    ${formatRM(

                        jumlahRMOff4Hingga8

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jumlahOffLebih8

                    )}

                </td>


                <td>

                    ${formatRM(

                        jumlahRMOffLebih8

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jumlahCutiKurang8

                    )}

                </td>


                <td>

                    ${formatRM(

                        jumlahRMCutiKurang8

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jumlahCutiLebih8

                    )}

                </td>


                <td>

                    ${formatRM(

                        jumlahRMCutiLebih8

                    )}

                </td>


                <td>

                </td>

            </tr>

        `;

    }

}


// =====================================================
// KOSONGKAN LAPORAN
// =====================================================

function kosongkanLaporan() {

    const tbody =

        document.getElementById(

            "senaraiAnggaran"

        );


    const tfoot =

        document.getElementById(

            "jumlahAnggaran"

        );


    if (

        tbody

    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="17">

                    Sila pilih Pos dan Bulan / Tahun

                    kemudian tekan JANA LAPORAN

                </td>

            </tr>

        `;

    }


    if (

        tfoot

    ) {

        tfoot.innerHTML = "";

    }

}


// =====================================================
// PAPAR MESEJ
// =====================================================

function paparMesej(

    mesej,

    jenis

) {

    const element =

        document.getElementById(

            "mesej"

        );


    if (

        !element

    ) {

        console.warn(

            mesej

        );

        return;

    }


    element.className =

        "mesej " +

        (

            jenis === "error"

                ? "error"

                : "success"

        );


    element.textContent =

        mesej;

}


// =====================================================
// FORMAT RM
// =====================================================

function formatRM(

    nilai

) {

    const nombor =

        parseFloat(

            nilai

        ) || 0;


    return (

        "RM " +

        nombor.toLocaleString(

            "ms-MY",

            {

                minimumFractionDigits: 2,

                maximumFractionDigits: 2

            }

        )

    );

}


// =====================================================
// FORMAT NOMBOR
// =====================================================

function formatNombor(

    nilai

) {

    const nombor =

        parseFloat(

            nilai

        ) || 0;


    return nombor.toLocaleString(

        "ms-MY",

        {

            minimumFractionDigits: 2,

            maximumFractionDigits: 2

        }

    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(

    nilai

) {

    if (

        nilai === null ||

        nilai === undefined

    ) {

        return "";

    }


    return String(

        nilai

    )

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

}
