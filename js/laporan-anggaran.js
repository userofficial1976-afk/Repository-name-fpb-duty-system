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
        // MUAT SENARAI POS
        // =============================================

        await muatSenaraiPos();


        // =============================================
        // MUAT SENARAI TAHUN
        // =============================================

        muatSenaraiTahun();


    }

);


// =====================================================
// MUAT SENARAI POS
// SUMBER UTAMA: jadual_duty
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


        // =============================================
        // AMBIL POS DARIPADA JADUAL DUTY
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

            "Dropdown tahun tidak wujud dalam HTML."

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

        "FILTER DIPILIH:",

        {

            bulan,

            tahun,

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
    // TUKAR BULAN
    // =============================================

    const nomborBulan =

        parseInt(

            bulan,

            10

        );


    const namaBulan =

        SENARAI_BULAN[

            nomborBulan

        ];


    console.log(

        "NOMBOR BULAN:",

        nomborBulan

    );


    console.log(

        "NAMA BULAN QUERY:",

        namaBulan

    );


    try {


        paparMesej(

            "Sedang mengambil data duty...",

            "success"

        );


        // =============================================
        // AMBIL SEMUA DATA DARIPADA JADUAL DUTY
        //
        // PENTING:
        // COLUMN bulan dalam database ialah:
        //
        // "Januari"
        // "Februari"
        // "Julai"
        //
        // BUKAN 1, 2, 7
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

                    namaBulan

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


        // =============================================
        // SEMAK ERROR
        // =============================================

        if (

            resultDuty.error

        ) {


            console.error(

                "RALAT QUERY DUTY:",

                resultDuty.error

            );


            paparMesej(

                resultDuty.error.message,

                "error"

            );


            return;

        }


        const dataDuty =

            resultDuty.data || [];


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


        // =============================================
        // AMBIL DATA GAJI DARIPADA DATA_ANGGOTA
        //
        // DATA LAIN KEKAL DARIPADA JADUAL_DUTY
        //
        // PENTING:
        // Ubah nama column gaji jika column sebenar
        // dalam Data_Anggota bukan "gaji"
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

                        `

                        no_skb,

                        gaji

                        `

                    )

                    .in(

                        "no_skb",

                        senaraiNoSKB

                    );


            console.log(

                "HASIL DATA GAJI:",

                resultAnggota

            );


            if (

                resultAnggota.error

            ) {


                console.error(

                    "RALAT AMBIL GAJI:",

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


        // =============================================
        // PAPAR TAJUK
        //
        // UNIT DIAMBIL DARIPADA JADUAL_DUTY
        // =============================================

        paparTajukLaporan(

            pos,

            bulan,

            tahun,

            dataDuty

        );


        // =============================================
        // GABUNGKAN DATA
        // =============================================

        const laporan =

            binaLaporan(

                dataDuty,

                dataAnggota

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
// BINA LAPORAN
// =====================================================

function binaLaporan(

    dataDuty,

    dataAnggota

) {


    const kumpulan = {};


    dataDuty.forEach(

        function (

            duty

        ) {


            const noSKB =

                String(

                    duty.no_skb

                );


            if (

                !kumpulan[

                    noSKB

                ]

            ) {


                kumpulan[

                    noSKB

                ] = [];


            }


            kumpulan[

                noSKB

            ].push(

                duty

            );

        }

    );


    const laporan = [];


    Object.keys(

        kumpulan

    ).forEach(

        function (

            noSKB

        ) {


            const dutyAnggota =

                kumpulan[

                    noSKB

                ];


            const dutyPertama =

                dutyAnggota[0];


            const anggota = {


                no_skb:

                    dutyPertama.no_skb,


                nama:

                    dutyPertama.nama_anggota || "",


                no_anggota:

                    dutyPertama.no_anggota || "",


                pangkat:

                    dutyPertama.nama_anggota || "",


                pos:

                    dutyPertama.pos || "",


                unit:

                    dutyPertama.unit || "",


                gaji:

                    ambilGaji(

                        dutyPertama.no_skb,

                        dataAnggota

                    )

            };


            laporan.push(

                {

                    anggota:

                        anggota,

                    duty:

                        dutyAnggota

                }

            );

        }

    );


    return laporan;

}


// =====================================================
// AMBIL GAJI
// =====================================================

function ambilGaji(

    noSKB,

    dataAnggota

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

                    noSKB

                );

            }

        );


    if (

        !anggota

    ) {


        return 0;

    }


    return (

        parseFloat(

            anggota.gaji

        )

        || 0

    );

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

            dataDuty[0].unit

            ||

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


        const nomborBulan =

            parseInt(

                bulan,

                10

            );


        tajukBulan.textContent =

            `${

                SENARAI_BULAN[

                    nomborBulan

                ]

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


    let jumlahJamOff = 0;


    let jumlahRMJamOff = 0;


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

            let jamBiasa = 0;


            let hariOff = 0;


            let jamOff = 0;


            let hariCutiAm = 0;


            let jamCutiAm = 0;


            let jumlahTuntutanKLM = "";


            // =========================================
            // KIRA SETIAP REKOD DUTY
            // =========================================

            duty.forEach(

                function (

                    item

                ) {


                    // ---------------------------------
                    // JAM HARI BIASA
                    // AMBIL jam_klm
                    // ---------------------------------

                    const jamKLM =

                        parseFloat(

                            item.jam_klm

                        )

                        || 0;


                    jamBiasa +=

                        jamKLM;


                    // ---------------------------------
                    // HARI OFF
                    // ---------------------------------

                    const nilaiHariOff =

                        parseFloat(

                            item.hari_offday_bertugas

                        )

                        || 0;


                    const nilaiJamOff =

                        parseFloat(

                            item.jam_offday_bertugas

                        )

                        || 0;


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

                        )

                        || 0;


                    const nilaiJamCutiAm =

                        parseFloat(

                            item.jam_cutiam_bertugas

                        )

                        || 0;


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
            // GAJI
            // =========================================

            const gaji =

                parseFloat(

                    anggota.gaji

                )

                || 0;


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

                    ${formatNombor(

                        gaji

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jamBiasa

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        0

                    )}

                </td>


                <td>

                    ${formatNombor(

                        hariOff

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        0

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jamOff

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        0

                    )}

                </td>


                <td>

                    ${formatNombor(

                        hariCutiAm

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        0

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jamCutiAm

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        0

                    )}

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


            jumlahHariOff +=

                hariOff;


            jumlahJamOff +=

                jamOff;


            jumlahHariCutiAm +=

                hariCutiAm;


            jumlahJamCutiAm +=

                jamCutiAm;

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

                        jumlahRMCutiAm

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

        )

        || 0;


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

        )

        || 0;


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
