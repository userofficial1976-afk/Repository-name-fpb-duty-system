// =====================================================
// LAPORAN-ANGGARAN.JS
// FPB DUTY SYSTEM
// ANGGARAN DUTY BULANAN
// =====================================================


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

                "Supabase tidak berjaya dimuatkan. Sila semak supabase.js.",

                "error"

            );


            return;

        }


        console.log(

            "SUPABASE CLIENT BERJAYA DIJUMPAI"

        );


        // =================================================
        // MUAT POS
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


    if (

        !selectPos

    ) {


        console.error(

            "ERROR: ID pos TIDAK DIJUMPAI"

        );


        paparMesej(

            "Dropdown Pos tidak dijumpai dalam HTML.",

            "error"

        );


        return;

    }


    selectPos.innerHTML = `

        <option value="">

            -- Sedang Memuatkan Pos --

        </option>

    `;


    try {


        // =================================================
        // AMBIL POS DARIPADA JADUAL_DUTY
        // =================================================

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


            console.error(

                "RALAT SUPABASE POS:",

                result.error

            );


            throw result.error;

        }


        const data =

            result.data || [];


        const setPos =

            new Set();


        data.forEach(

            function (

                row

            ) {


                if (

                    row.pos !== null &&

                    row.pos !== undefined

                ) {


                    const nilai =

                        String(

                            row.pos

                        ).trim();


                    if (

                        nilai !== ""

                    ) {


                        setPos.add(

                            nilai

                        );

                    }

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


    }

    catch (

        error

    ) {


        console.error(

            "RALAT AMBIL SENARAI POS:",

            error

        );


        selectPos.innerHTML = `

            <option value="">

                -- Gagal Ambil Pos --

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
// MUAT TAHUN
// =====================================================

function muatSenaraiTahun() {


    const selectTahun =

        document.getElementById(

            "tahun"

        );


    if (

        !selectTahun

    ) {

        return;

    }


    const tahunSekarang =

        new Date()

            .getFullYear();


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

        "MULA JANA LAPORAN"

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


    const posDipilih =

        String(

            posElement.value

        )

        .trim();


    console.log(

        "BULAN:",

        bulan

    );


    console.log(

        "TAHUN:",

        tahun

    );


    console.log(

        "POS DIPILIH:",

        posDipilih

    );


    if (

        !posDipilih

    ) {


        paparMesej(

            "Sila pilih Pos terlebih dahulu.",

            "error"

        );


        return;

    }


    try {


        paparMesej(

            "Sedang mengambil data duty...",

            "success"

        );


        // =================================================
        // 1. AMBIL SEMUA DUTY MENGIKUT BULAN DAN TAHUN
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

                    "bulan",

                    bulan

                )

                .eq(

                    "tahun",

                    tahun

                );


        console.log(

            "DATA DUTY BULAN / TAHUN:",

            resultDuty

        );


        if (

            resultDuty.error

        ) {


            throw resultDuty.error;

        }


        const semuaDataDuty =

            resultDuty.data || [];


        console.log(

            "JUMLAH SEMUA DATA DUTY:",

            semuaDataDuty.length

        );


        // =================================================
        // 2. FILTER POS DI JAVASCRIPT
        // =================================================

        const dataDuty =

            semuaDataDuty.filter(

                function (

                    duty

                ) {


                    const posDuty =

                        String(

                            duty.pos ||

                            ""

                        )

                        .trim();


                    const posDipilihNormal =

                        posDipilih

                        .trim();


                    console.log(

                        "BANDING POS:",

                        posDuty,

                        "===",

                        posDipilihNormal,

                        posDuty ===

                        posDipilihNormal

                    );


                    return (

                        posDuty ===

                        posDipilihNormal

                    );

                }

            );


        console.log(

            "DATA DUTY SELEPAS FILTER POS:",

            dataDuty

        );


        if (

            dataDuty.length === 0

        ) {


            kosongkanLaporan();


            paparMesej(

                "Data duty dijumpai untuk bulan/tahun, tetapi tiada Pos yang sama.",

                "error"

            );


            return;

        }


        // =================================================
        // 3. AMBIL GAJI DARIPADA DATA_ANGGOTA
        // =================================================

        const senaraiNoSKB = [

            ...

            new Set(

                dataDuty

                    .map(

                        function (

                            duty

                        ) {


                            return duty.no_skb;

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

                        no_anggota,

                        nama,

                        gaji_pokok

                        `

                    )

                    .in(

                        "no_skb",

                        senaraiNoSKB

                    );


            console.log(

                "DATA ANGGOTA:",

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
        // 4. MAP DATA ANGGOTA
        // =================================================

        const mapAnggota =

            new Map();


        dataAnggota.forEach(

            function (

                anggota

            ) {


                mapAnggota.set(

                    String(

                        anggota.no_skb

                    ),

                    anggota

                );

            }

        );


        // =================================================
        // 5. PAPAR TAJUK
        // =================================================

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


        if (

            tajukUnit

        ) {


            tajukUnit.textContent =

                dataDuty[0].unit ||

                "WILAYAH TERENGGANU";

        }


        if (

            tajukBulan

        ) {


            tajukBulan.textContent =

                SENARAI_BULAN[bulan]

                + " "

                + tahun;

        }


        if (

            tajukPos

        ) {


            tajukPos.textContent =

                posDipilih;

        }


        // =================================================
        // 6. GROUP DATA MENGIKUT NO SKB
        // =================================================

        const mapDuty =

            new Map();


        dataDuty.forEach(

            function (

                duty

            ) {


                const key =

                    String(

                        duty.no_skb

                    );


                if (

                    !mapDuty.has(

                        key

                    )

                ) {


                    mapDuty.set(

                        key,

                        []

                    );

                }


                mapDuty

                    .get(

                        key

                    )

                    .push(

                        duty

                    );

            }

        );


        // =================================================
        // 7. PAPAR JADUAL
        // =================================================

        const tbody =

            document.getElementById(

                "senaraiAnggaran"

            );


        const tfoot =

            document.getElementById(

                "jumlahAnggaran"

            );


        tbody.innerHTML = "";


        let bil = 1;


        let jumlahJamBiasa = 0;


        let jumlahHariOffKurang4 = 0;


        let jumlahHariOff4Hingga8 = 0;


        let jumlahJamOffLebih8 = 0;


        let jumlahHariCutiKurang8 = 0;


        let jumlahJamCutiLebih8 = 0;


        dataDuty.forEach(

            function (

                dutyPertama

            ) {


                const noSKB =

                    String(

                        dutyPertama.no_skb

                    );


                const dutyAnggota =

                    mapDuty.get(

                        noSKB

                    ) || [];


                const anggota =

                    mapAnggota.get(

                        noSKB

                    ) || {


                        no_skb:

                            noSKB,


                        no_anggota:

                            dutyPertama.no_anggota,


                        nama:

                            dutyPertama.nama_anggota,


                        gaji_pokok:

                            0

                    };


                // =================================================
                // PEMBOLEHUBAH KIRAAN
                // =================================================

                let jamBiasa = 0;


                let hariOffKurang4 = 0;


                let hariOff4Hingga8 = 0;


                let jamOffLebih8 = 0;


                let hariCutiKurang8 = 0;


                let jamCutiLebih8 = 0;


                // =================================================
                // KIRA SETIAP REKOD DUTY
                // =================================================

                dutyAnggota.forEach(

                    function (

                        item

                    ) {


                        const jamKLM =

                            parseFloat(

                                item.jam_klm

                            ) || 0;


                        const hariOff =

                            parseFloat(

                                item.hari_offday_bertugas

                            ) || 0;


                        const jamOff =

                            parseFloat(

                                item.jam_offday_bertugas

                            ) || 0;


                        const hariCuti =

                            parseFloat(

                                item.hari_cutiam_bertugas

                            ) || 0;


                        const jamCuti =

                            parseFloat(

                                item.jam_cutiam_bertugas

                            ) || 0;


                        // =========================================
                        // JAM HARI BIASA
                        // jumlah jam_klm
                        // =========================================

                        jamBiasa +=

                            jamKLM;


                        // =========================================
                        // HARI OFF < 4 JAM
                        // =========================================

                        hariOffKurang4 +=

                            hariOff;


                        // =========================================
                        // HARI OFF 4 - 8 JAM
                        // =========================================

                        hariOff4Hingga8 +=

                            hariOff;


                        // =========================================
                        // HARI OFF > 8 JAM
                        // =========================================

                        jamOffLebih8 +=

                            jamOff;


                        // =========================================
                        // CUTI AM < 8 JAM
                        // =========================================

                        hariCutiKurang8 +=

                            hariCuti;


                        // =========================================
                        // CUTI AM > 8 JAM
                        // =========================================

                        jamCutiLebih8 +=

                            jamCuti;

                    }

                );


                // =================================================
                // PAPAR BARIS
                // =================================================

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

                            anggota.no_skb ||

                            noSKB

                        )}

                    </td>


                    <td class="left">

                        ${escapeHTML(

                            anggota.nama ||

                            dutyPertama.nama_anggota ||

                            ""

                        )}

                    </td>


                    <td class="amount">

                        ${formatRM(

                            anggota.gaji_pokok

                        )}

                    </td>


                    <td>

                        ${formatNombor(

                            jamBiasa

                        )}

                    </td>


                    <td class="amount">

                        RM 0.00

                    </td>


                    <td>

                        ${formatNombor(

                            hariOffKurang4

                        )}

                    </td>


                    <td class="amount">

                        RM 0.00

                    </td>


                    <td>

                        ${formatNombor(

                            hariOff4Hingga8

                        )}

                    </td>


                    <td class="amount">

                        RM 0.00

                    </td>


                    <td>

                        ${formatNombor(

                            jamOffLebih8

                        )}

                    </td>


                    <td class="amount">

                        RM 0.00

                    </td>


                    <td>

                        ${formatNombor(

                            hariCutiKurang8

                        )}

                    </td>


                    <td class="amount">

                        RM 0.00

                    </td>


                    <td>

                        ${formatNombor(

                            jamCutiLebih8

                        )}

                    </td>

                `;


                tbody.appendChild(

                    tr

                );


                bil++;


                jumlahJamBiasa +=

                    jamBiasa;


                jumlahHariOffKurang4 +=

                    hariOffKurang4;


                jumlahHariOff4Hingga8 +=

                    hariOff4Hingga8;


                jumlahJamOffLebih8 +=

                    jamOffLebih8;


                jumlahHariCutiKurang8 +=

                    hariCutiKurang8;


                jumlahJamCutiLebih8 +=

                    jamCutiLebih8;

            }

        );


        // =================================================
        // FOOTER
        // =================================================

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

                    -

                </td>


                <td>

                    ${formatNombor(

                        jumlahHariOffKurang4

                    )}

                </td>


                <td>

                    -

                </td>


                <td>

                    ${formatNombor(

                        jumlahHariOff4Hingga8

                    )}

                </td>


                <td>

                    -

                </td>


                <td>

                    ${formatNombor(

                        jumlahJamOffLebih8

                    )}

                </td>


                <td>

                    -

                </td>


                <td>

                    ${formatNombor(

                        jumlahHariCutiKurang8

                    )}

                </td>


                <td>

                    -

                </td>


                <td>

                    ${formatNombor(

                        jumlahJamCutiLebih8

                    )}

                </td>


            </tr>

        `;


        paparMesej(

            "Laporan berjaya dijana. " +

            dataDuty.length +

            " rekod duty dijumpai.",

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


        kosongkanLaporan();


        paparMesej(

            error.message ||

            "Ralat sistem berlaku.",

            "error"

        );

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

                <td colspan="15">

                    Tiada data untuk dipaparkan.

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

    jenis = "success"

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

        jenis;


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
