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

            "HALAMAN LAPORAN ANGGARAN SIAP"

        );


        console.log(

            "===================================="


        );


        // =============================================
        // SEMAK SUPABASE
        // =============================================

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


        // =============================================
        // MUAT POS
        // =============================================

        await muatSenaraiPos();


        // =============================================
        // MUAT TAHUN
        // =============================================

        muatSenaraiTahun();


    }

);


// =====================================================
// MUAT SENARAI POS
// SUMBER: jadual_duty
//
//
// PENTING:
// Pos laporan mesti datang daripada jadual_duty
// kerana itulah pos duty yang sebenar.
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

            "ERROR: ELEMENT ID pos TIDAK DIJUMPAI."

        );


        return;

    }


    selectPos.innerHTML = `

        <option value="">

            -- Sedang Memuatkan Pos --

        </option>

    `;


    try {


        // =============================================
        // AMBIL POS DARI JADUAL DUTY
        // =============================================

        const result =

            await supabase

                .from(

                    "jadual_duty"

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

                "RALAT AMBIL POS:",

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

            result.data || [];


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


        // =============================================
        // SUSUN POS
        // =============================================

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

                        numeric:

                            true

                    }

                );

            }

        );


        semuaPos =

            senaraiPos;


        console.log(

            "JUMLAH POS:",

            senaraiPos.length

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


    }

    catch (

        error

    ) {


        console.error(

            "RALAT SISTEM POS:",

            error

        );


        selectPos.innerHTML = `

            <option value="">

                -- Ralat Sistem --

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


    if (

        !selectTahun

    ) {


        console.warn(

            "Dropdown tahun tidak dijumpai."

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
//
// PENTING:
//
// DATABASE:
//
// bulan = "Julai"
// tahun = 2026
//
// Maka query mesti:
//
// .eq("bulan", "Julai")
// .eq("tahun", 2026)
//
// BUKAN:
//
// .eq("bulan", 7)
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


    // =============================================
    // AMBIL ELEMENT
    // =============================================

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


    // =============================================
    // AMBIL NILAI
    // =============================================

    const bulan =

        bulanElement

            ? String(

                bulanElement.value

            ).trim()

            : "";


    const tahun =

        tahunElement

            ? Number(

                tahunElement.value

            )

            : new Date()

                .getFullYear();


    const pos =

        posElement

            ? String(

                posElement.value

            ).trim()

            : "";


    console.log(

        "FILTER LAPORAN:",

        {

            bulan:

                bulan,

            tahun:

                tahun,

            pos:

                pos

        }

    );


    // =============================================
    // SEMAK POS
    // =============================================

    if (

        !pos

    ) {


        paparMesej(

            "Sila pilih Pos terlebih dahulu.",

            "error"

        );


        return;

    }


    // =============================================
    // SEMAK BULAN
    // =============================================

    if (

        !bulan

    ) {


        paparMesej(

            "Sila pilih Bulan terlebih dahulu.",

            "error"

        );


        return;

    }


    // =============================================
    // SEMAK TAHUN
    // =============================================

    if (

        !tahun

    ) {


        paparMesej(

            "Sila pilih Tahun terlebih dahulu.",

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
        // QUERY JADUAL DUTY
        // =============================================

        const resultDuty =

            await supabase

                .from(

                    "jadual_duty"

                )

                .select(

                    "*"

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

            "HASIL QUERY DUTY:",

            resultDuty

        );


        console.log(

            "DATA DUTY:",

            resultDuty.data

        );


        console.log(

            "RALAT DUTY:",

            resultDuty.error

        );


        // =============================================
        // SEMAK ERROR
        // =============================================

        if (

            resultDuty.error

        ) {


            console.error(

                "RALAT SUPABASE DUTY:",

                resultDuty.error

            );


            paparMesej(

                resultDuty.error.message ||

                "Gagal mengambil data duty.",

                "error"

            );


            return;

        }


        // =============================================
        // SIMPAN DATA DUTY
        // =============================================

        const dataDuty =

            resultDuty.data || [];


        semuaDuty =

            dataDuty;


        console.log(

            "JUMLAH DATA DUTY:",

            dataDuty.length

        );


        // =============================================
        // SEMAK DATA KOSONG
        // =============================================

        if (

            dataDuty.length === 0

        ) {


            kosongkanLaporan();


            paparMesej(

                "Tiada data duty bagi Pos: " +

                pos +

                " | Bulan: " +

                bulan +

                " | Tahun: " +

                tahun,

                "error"

            );


            return;

        }


        // =============================================
        // AMBIL SENARAI NO SKB
        // =============================================

        const senaraiNoSKB =

            [

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
        // =============================================

        let dataAnggota = [];


        if (

            senaraiNoSKB.length > 0

        ) {


            const resultAnggota =

                await supabase

                    .from(

                        "Data_Anggota"

                    )

                    .select(

                        "*"

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


            dataAnggota =

                resultAnggota.data || [];


        }


        semuaAnggota =

            dataAnggota;


        console.log(

            "JUMLAH ANGGOTA:",

            dataAnggota.length

        );


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
        // BINA LAPORAN
        // =============================================

        const laporan = [];


        dataDuty.forEach(

            function (

                duty

            ) {


                const anggota =

                    dataAnggota.find(

                        function (

                            item

                        ) {


                            return String(

                                item.no_skb

                            )

                            ===

                            String(

                                duty.no_skb

                            );

                        }

                    );


                laporan.push({

                    anggota:

                        anggota ||

                        {

                            no_skb:

                                duty.no_skb,

                            no_anggota:

                                duty.no_anggota ||

                                "",

                            nama:

                                duty.nama_anggota ||

                                "",

                            pangkat:

                                duty.pangkat ||

                                "",

                            unit:

                                duty.unit ||

                                "",

                            pos:

                                duty.pos ||

                                ""

                        },


                    duty:

                        [

                            duty

                        ]

                });


            }

        );


        console.log(

            "LAPORAN AKHIR:",

            laporan

        );


        // =============================================
        // PAPAR JADUAL
        // =============================================

        paparJadualAnggaran(

            laporan

        );


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

            bulan +

            " " +

            tahun;

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
// HARI OFF
// < 4 jam
// = kosong
//
// HARI OFF
// 4 - 8 jam
// = hari_offday_bertugas
//
// HARI OFF
// > 8 jam
// = jam_offday_bertugas
//
// HARI CUTI AM
// < 8 jam
// = hari_cutiam_bertugas
//
// HARI CUTI AM
// > 8 jam
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

            "ELEMENT senaraiAnggaran TIDAK DIJUMPAI."

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


    let jumlahJamOff = 0;


    let jumlahRMJamOff = 0;


    let jumlahHariCutiAm = 0;


    let jumlahRMHariCutiAm = 0;


    let jumlahJamCutiAm = 0;


    let jumlahRMJamCutiAm = 0;


    laporan.forEach(

        function (

            rekod

        ) {


            const anggota =

                rekod.anggota;


            const duty =

                rekod.duty;


            // =========================================
            // PEMBOLEHUBAH KIRAAN
            // =========================================

            let jamBiasa =

                0;


            let hariOff =

                0;


            let jamOff =

                0;


            let hariCutiAm =

                0;


            let jamCutiAm =

                0;


            // =========================================
            // KIRA SETIAP DUTY
            // =========================================

            duty.forEach(

                function (

                    item

                ) {


                    // ---------------------------------
                    // JAM HARI BIASA
                    // ---------------------------------

                    const jamKLM =

                        parseFloat(

                            item.jam_klm

                        ) || 0;


                    jamBiasa +=

                        jamKLM;


                    // ---------------------------------
                    // HARI OFF
                    // ---------------------------------

                    const nilaiHariOff =

                        parseFloat(

                            item.hari_offday_bertugas

                        ) || 0;


                    const nilaiJamOff =

                        parseFloat(

                            item.jam_offday_bertugas

                        ) || 0;


                    if (

                        nilaiHariOff < 4

                    ) {


                        // KOSONG


                    }

                    else if (

                        nilaiHariOff >= 4 &&

                        nilaiHariOff <= 8

                    ) {


                        hariOff +=

                            nilaiHariOff;

                    }

                    else if (

                        nilaiHariOff > 8

                    ) {


                        jamOff +=

                            nilaiJamOff;

                    }


                    // ---------------------------------
                    // HARI CUTI AM
                    // ---------------------------------

                    const nilaiHariCutiAm =

                        parseFloat(

                            item.hari_cutiam_bertugas

                        ) || 0;


                    const nilaiJamCutiAm =

                        parseFloat(

                            item.jam_cutiam_bertugas

                        ) || 0;


                    if (

                        nilaiHariCutiAm < 8

                    ) {


                        hariCutiAm +=

                            nilaiHariCutiAm;

                    }

                    else if (

                        nilaiHariCutiAm > 8

                    ) {


                        jamCutiAm +=

                            nilaiJamCutiAm;

                    }

                }

            );


            // =========================================
            // RM BUAT MASA INI KOSONG
            // =========================================

            const rmBiasa =

                0;


            const rmHariOff =

                0;


            const rmJamOff =

                0;


            const rmHariCutiAm =

                0;


            const rmJamCutiAm =

                0;


            // =========================================
            // JUMLAH TUNTUTAN KLM
            // KOSONG DAHULU
            // =========================================

            const jumlahTuntutanKLM =

                "";


            // =========================================
            // BINA ROW
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

                    ${formatNombor(

                        jamBiasa

                    )}

                </td>


                <td>

                    ${formatNombor(

                        hariOff

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        rmHariOff

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jamOff

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        rmJamOff

                    )}

                </td>


                <td>

                    ${formatNombor(

                        hariCutiAm

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        rmHariCutiAm

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jamCutiAm

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        rmJamCutiAm

                    )}

                </td>


                <td>

                    -

                </td>


                <td>

                    -

                </td>


                <td class="amount">

                    ${jumlahTuntutanKLM}

                </td>

            `;


            tbody.appendChild(

                tr

            );


            bil++;


            // =========================================
            // JUMLAH
            // =========================================

            jumlahJamBiasa +=

                jamBiasa;


            jumlahRMBiasa +=

                rmBiasa;


            jumlahHariOff +=

                hariOff;


            jumlahRMHariOff +=

                rmHariOff;


            jumlahJamOff +=

                jamOff;


            jumlahRMJamOff +=

                rmJamOff;


            jumlahHariCutiAm +=

                hariCutiAm;


            jumlahRMHariCutiAm +=

                rmHariCutiAm;


            jumlahJamCutiAm +=

                jamCutiAm;


            jumlahRMJamCutiAm +=

                rmJamCutiAm;


        }

    );


    // =============================================
    // PAPAR FOOTER
    // =============================================

    if (

        tfoot

    ) {


        tfoot.innerHTML = `

            <tr class="total-row">


                <td colspan="3">

                    JUMLAH

                </td>


                <td>

                    ${formatNombor(

                        jumlahJamBiasa

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jumlahHariOff

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMHariOff

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jumlahJamOff

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMJamOff

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jumlahHariCutiAm

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMHariCutiAm

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jumlahJamCutiAm

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        jumlahRMJamCutiAm

                    )}

                </td>


                <td>

                    -

                </td>


                <td>

                    -

                </td>


                <td>

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

                minimumFractionDigits:

                    2,

                maximumFractionDigits:

                    2

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


    if (

        nilai === "" ||

        nilai === null ||

        nilai === undefined

    ) {


        return "";

    }


    const nombor =

        parseFloat(

            nilai

        ) || 0;


    return nombor.toLocaleString(

        "ms-MY",

        {

            minimumFractionDigits:

                2,

            maximumFractionDigits:

                2

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
