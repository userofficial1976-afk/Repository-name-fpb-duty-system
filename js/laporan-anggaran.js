```javascript
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
// DATABASE MENGGUNAKAN NAMA BULAN
// CONTOH: Julai
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
// DAPATKAN NAMA BULAN
// BOLEH TERIMA:
//
// 7       -> Julai
// "7"     -> Julai
// Julai   -> Julai
// =====================================================

function dapatkanNamaBulan(nilai) {


    if (

        nilai === null ||

        nilai === undefined ||

        nilai === ""

    ) {

        return "";

    }


    const nilaiString =

        String(

            nilai

        ).trim();


    // JIKA SUDAH NAMA BULAN

    if (

        SENARAI_BULAN.includes(

            nilaiString

        )

    ) {

        return nilaiString;

    }


    // JIKA NOMBOR BULAN

    const nomborBulan =

        parseInt(

            nilaiString,

            10

        );


    if (

        nomborBulan >= 1 &&

        nomborBulan <= 12

    ) {

        return SENARAI_BULAN[

            nomborBulan

        ];

    }


    return nilaiString;

}


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


        // SEMAK SUPABASE

        if (

            typeof supabase ===

            "undefined"

        ) {


            console.error(

                "SUPABASE TIDAK DIJUMPAI"

            );


            paparMesej(

                "Supabase tidak berjaya dimuatkan.",

                "error"

            );


            return;

        }


        // MUAT POS

        await muatSenaraiPos();


        // MUAT TAHUN

        muatSenaraiTahun();


    }

);


// =====================================================
// MUAT SENARAI POS
// SUMBER: Data_Anggota
// COLUMN: pos
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

            await supabase

                .from(

                    "Data_Anggota"

                )

                .select(

                    "pos"

                );


        console.log(

            "HASIL POS:",

            result

        );


        if (

            result.error

        ) {


            console.error(

                "RALAT SUPABASE POS:",

                result.error

            );


            selectPos.innerHTML = `

                <option value="">

                    -- Ralat Ambil Pos --

                </option>

            `;


            paparMesej(

                result.error.message,

                "error"

            );


            return;

        }


        const data =

            result.data;


        if (

            !data ||

            data.length === 0

        ) {


            selectPos.innerHTML = `

                <option value="">

                    -- Tiada Data Anggota --

                </option>

            `;


            paparMesej(

                "Tiada data Pos dalam Data_Anggota.",

                "error"

            );


            return;

        }


        const senaraiPos = [];


        data.forEach(

            function (

                item

            ) {


                if (

                    item.pos !== null &&

                    item.pos !== undefined

                ) {


                    const pos =

                        String(

                            item.pos

                        ).trim();


                    if (

                        pos !== "" &&

                        !senaraiPos.includes(

                            pos

                        )

                    ) {


                        senaraiPos.push(

                            pos

                        );

                    }

                }

            }

        );


        senaraiPos.sort(

            function (

                a,

                b

            ) {


                return String(

                    a

                ).localeCompare(

                    String(

                        b

                    ),

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

    }


    catch (

        error

    ) {


        console.error(

            "RALAT SISTEM POS:",

            error

        );


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
// JANA LAPORAN ANGGARAN
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

        bulanElement

            ? bulanElement.value

            : "";


    const tahun =

        tahunElement

            ? tahunElement.value

            : new Date()

                .getFullYear();


    const pos =

        posElement

            ? posElement.value

            : "";


    console.log(

        "BULAN DROPDOWN:",

        bulan

    );


    console.log(

        "TAHUN DROPDOWN:",

        tahun

    );


    console.log(

        "POS DROPDOWN:",

        pos

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


    try {


        paparMesej(

            "Sedang mengambil data duty...",

            "success"

        );


        // =============================================
        // DAPATKAN NAMA BULAN UNTUK DATABASE
        // =============================================

        const namaBulanDatabase =

            dapatkanNamaBulan(

                bulan

            );


        console.log(

            "BULAN UNTUK DATABASE:",

            namaBulanDatabase

        );


        console.log(

            "TAHUN UNTUK DATABASE:",

            parseInt(

                tahun,

                10

            )

        );


        console.log(

            "POS UNTUK DATABASE:",

            pos

        );


        // =============================================
        // QUERY JADUAL DUTY
        //
        // DATABASE:
        //
        // bulan = "Julai"
        // tahun = 2026
        // pos = "F102-01(SS)Kilang Sawit Jerangau"
        // =============================================

        const resultDuty =

            await supabase

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

                    namaBulanDatabase

                )

                .eq(

                    "tahun",

                    parseInt(

                        tahun,

                        10

                    ));


        console.log(

            "HASIL QUERY DUTY:",

            resultDuty

        );


        console.log(

            "JUMLAH DATA DUTY:",

            resultDuty.data

                ? resultDuty.data.length

                : 0

        );


        if (

            resultDuty.error

        ) {


            console.error(

                "RALAT JADUAL DUTY:",

                resultDuty.error

            );


            paparMesej(

                resultDuty.error.message,

                "error"

            );


            return;

        }


        const dataDuty =

            resultDuty.data;


        if (

            !dataDuty ||

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


        // =============================================
        // AMBIL NO SKB
        // =============================================

        const senaraiNoSKB = [

            ...

            new Set(

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


        // =============================================
        // AMBIL DATA ANGGOTA
        // Gaji hanya dari Data_Anggota
        // =============================================

        const resultAnggota =

            await supabase

                .from(

                    "Data_Anggota"

                )

                .select(

                    `

                    no_skb,

                    no_anggota,

                    nama,

                    pangkat,

                    pos,

                    unit,

                    gaji

                    `

                )

                .in(

                    "no_skb",

                    senaraiNoSKB

                );


        console.log(

            "HASIL DATA ANGGOTA:",

            resultAnggota

        );


        if (

            resultAnggota.error

        ) {


            console.error(

                "RALAT DATA ANGGOTA:",

                resultAnggota.error

            );


            paparMesej(

                resultAnggota.error.message,

                "error"

            );


            return;

        }


        const dataAnggota =

            resultAnggota.data;


        if (

            !dataAnggota ||

            dataAnggota.length === 0

        ) {


            kosongkanLaporan();


            paparMesej(

                "Data anggota tidak dijumpai berdasarkan no_skb.",

                "error"

            );


            return;

        }


        semuaAnggota =

            dataAnggota;


        // =============================================
        // PAPAR TAJUK
        // =============================================

        paparTajukLaporan(

            pos,

            bulan,

            tahun,

            dataDuty

        );


        // =============================================
        // GABUNG DATA DUTY + ANGGOTA
        // =============================================

        const laporan =

            dataAnggota.map(

                function (

                    anggota

                ) {


                    const dutyAnggota =

                        dataDuty.filter(

                            function (

                                duty

                            ) {


                                return String(

                                    duty.no_skb

                                )

                                ===

                                String(

                                    anggota.no_skb

                                );

                            }

                        );


                    return {

                        anggota:

                            anggota,

                        duty:

                            dutyAnggota

                    };

                }

            );


        // =============================================
        // PAPAR JADUAL
        // =============================================

        paparJadualAnggaran(

            laporan

        );


        paparMesej(

            `Laporan berjaya dijana. ${laporan.length} anggota dijumpai.`,

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
// PAPAR TAJUK LAPORAN
// =====================================================

function paparTajukLaporan(

    pos,

    bulan,

    tahun,

    dataDuty

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

        "Unit";


    if (

        dataDuty &&

        dataDuty.length > 0

    ) {


        unit =

            dataDuty[0].unit ||

            "Unit";

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

            `${dapatkanNamaBulan(bulan)} ${tahun}`;

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
//
// LOGIK:
//
// JAM HARI BIASA
// = jumlah jam_klm daripada jadual_duty
//
// Hari Off < 4 jam
// = kosong
//
// Hari Off 4–8 jam
// = hari_offday_bertugas
//
// Hari Off > 8 jam
// = jam_offday_bertugas
//
// Hari Cuti Am < 8 jam
// = hari_cutiam_bertugas
//
// Hari Cuti Am > 8 jam
// = jam_cutiam_bertugas
//
// JUMLAH TUNTUTAN KLM
// = kosong dahulu
// =====================================================

function paparJadualAnggaran(

    laporan

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


    if (

        !laporan ||

        laporan.length === 0

    ) {


        tbody.innerHTML = `

            <tr>

                <td colspan="15">

                    Tiada data untuk dipaparkan.

                </td>

            </tr>

        `;


        return;

    }


    let bil = 1;


    let jumlahJamBiasa = 0;


    let jumlahRMBiasa = 0;


    let jumlahHariOff = 0;


    let jumlahRMHariOff = 0;


    let jumlahHariCutiAm = 0;


    let jumlahRMCutiAm = 0;


    let jumlahHariTampungan = 0;


    let jumlahRMTampungan = 0;


    laporan.forEach(

        function (

            rekod

        ) {


            const anggota =

                rekod.anggota;


            const duty =

                rekod.duty;


            // =========================================
            // JAM HARI BIASA
            // JUMLAH jam_klm
            // =========================================

            let jamBiasa =

                0;


            // =========================================
            // HARI OFF
            // =========================================

            let hariOff =

                0;


            // =========================================
            // CUTI AM
            // =========================================

            let hariCutiAm =

                0;


            // =========================================
            // TAMPUNGAN
            // =========================================

            let hariTampungan =

                0;


            duty.forEach(

                function (

                    item

                ) {


                    const jamKLM =

                        parseFloat(

                            item.jam_klm

                        ) || 0;


                    const hariOffData =

                        parseFloat(

                            item.hari_offday_bertugas

                        ) || 0;


                    const jamOffData =

                        parseFloat(

                            item.jam_offday_bertugas

                        ) || 0;


                    const hariCutiData =

                        parseFloat(

                            item.hari_cutiam_bertugas

                        ) || 0;


                    const jamCutiData =

                        parseFloat(

                            item.jam_cutiam_bertugas

                        ) || 0;


                    const jamTampungan =

                        parseFloat(

                            item.jam_tampungan

                        ) || 0;


                    // JAM BIASA
                    jamBiasa +=

                        jamKLM;


                    // HARI OFF
                    if (

                        jamOffData < 4

                    ) {


                        hariOff +=

                            0;

                    }

                    else if (

                        jamOffData >= 4 &&

                        jamOffData <= 8

                    ) {


                        hariOff +=

                            hariOffData;

                    }

                    else if (

                        jamOffData > 8

                    ) {


                        hariOff +=

                            jamOffData;

                    }


                    // CUTI AM
                    if (

                        jamCutiData < 8

                    ) {


                        hariCutiAm +=

                            hariCutiData;

                    }

                    else if (

                        jamCutiData > 8

                    ) {


                        hariCutiAm +=

                            jamCutiData;

                    }


                    // TAMPUNGAN
                    hariTampungan +=

                        jamTampungan;

                }

            );


            // =========================================
            // Gaji dari Data_Anggota
            // =========================================

            const gaji =

                parseFloat(

                    anggota.gaji

                ) || 0;


            // =========================================
            // BINA BARIS
            // =========================================

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

                        anggota.no_skb

                    )}

                </td>


                <td class="left">

                    ${escapeHTML(

                        anggota.nama

                    )}

                </td>


                <td>

                    -

                </td>


                <td>

                    ${formatNombor(

                        jamBiasa

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        gaji

                    )}

                </td>


                <td>

                    ${formatNombor(

                        hariOff

                    )}

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td>

                    ${formatNombor(

                        hariCutiAm

                    )}

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td>

                    ${formatNombor(

                        hariTampungan

                    )}

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td>

                    0

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td class="amount">

                    -

                </td>

            `;


            tbody.appendChild(

                tr

            );


            bil++;


            jumlahJamBiasa +=

                jamBiasa;


            jumlahRMBiasa +=

                gaji;


            jumlahHariOff +=

                hariOff;


            jumlahHariCutiAm +=

                hariCutiAm;


            jumlahHariTampungan +=

                hariTampungan;

        }

    );


    // =============================================
    // FOOTER JUMLAH
    // =============================================

    if (

        tfoot

    ) {


        tfoot.innerHTML = `

            <tr class="total-row">


                <td colspan="4">

                    JUMLAH

                </td>


                <td>

                    ${formatNombor(

                        jumlahJamBiasa

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMBiasa

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jumlahHariOff

                    )}

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td>

                    ${formatNombor(

                        jumlahHariCutiAm

                    )}

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td>

                    ${formatNombor(

                        jumlahHariTampungan

                    )}

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td>

                    0

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td class="amount">

                    -

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
```
