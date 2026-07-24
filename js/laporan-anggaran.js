// =====================================================
// LAPORAN-ANGGARAN.JS
// FPB DUTY SYSTEM
// LAPORAN ANGGARAN DUTY
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
// HALAMAN DIMUATKAN
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    async function () {


        console.log(

            "SUPABASE BERJAYA DISAMBUNG"

        );


        console.log(

            "HALAMAN LAPORAN ANGGARAN SIAP"

        );


        await muatSenaraiPos();


        muatSenaraiTahun();


    }

);


// =====================================================
// MUAT SENARAI POS
// SUMBER: jadual_duty
// =====================================================

async function muatSenaraiPos() {


    const selectPos =

        document.getElementById(

            "pos"

        );


    if (

        !selectPos

    ) {


        console.error(

            "ELEMENT #pos TIDAK DIJUMPAI"

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

                "RALAT POS:",

                result.error

            );


            return;

        }


        const setPos =

            new Set();


        (

            result.data ||

            []

        )

            .forEach(

                function (

                    item

                ) {


                    if (

                        item.pos !== null &&

                        item.pos !== undefined

                    ) {


                        const nilai =

                            String(

                                item.pos

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


        semuaPos =

            Array.from(

                setPos

            );


        semuaPos.sort(

            function (

                a,

                b

            ) {


                return a.localeCompare(

                    b,

                    "ms",

                    {

                        numeric:

                            true

                    }

                );

            }

        );


        selectPos.innerHTML = `

            <option value="">

                -- Pilih Pos --

            </option>

        `;


        semuaPos.forEach(

            function (

                nilaiPos

            ) {


                const option =

                    document.createElement(

                        "option"

                    );


                option.value =

                    nilaiPos;


                option.textContent =

                    nilaiPos;


                selectPos.appendChild(

                    option

                );

            }

        );


        console.log(

            "JUMLAH POS:",

            semuaPos.length

        );


    }

    catch (

        error

    ) {


        console.error(

            "RALAT MUAT POS:",

            error

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

            "ELEMENT #tahun TIDAK DIJUMPAI"

        );


        return;

    }


    const tahunSemasa =

        new Date()

            .getFullYear();


    selectTahun.innerHTML = "";


    for (

        let tahun =

            tahunSemasa - 2;


        tahun <=

        tahunSemasa + 2;


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

            tahunSemasa

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

            ? String(

                bulanElement.value

            ).trim()

            : "";


    const tahun =

        tahunElement

            ? Number(

                tahunElement.value

            )

            : 2026;


    const pos =

        posElement

            ? String(

                posElement.value

            ).trim()

            : "";


    console.log(

        "===================================="

    );


    console.log(

        "FILTER DIPILIH"

    );


    console.log(

        "BULAN:",

        JSON.stringify(

            bulan

        )

    );


    console.log(

        "TAHUN:",

        JSON.stringify(

            tahun

        )

    );


    console.log(

        "POS:",

        JSON.stringify(

            pos

        )

    );


    console.log(

        "===================================="

    );


    if (

        !bulan

    ) {


        paparMesej(

            "Sila pilih Bulan.",

            "error"

        );


        return;

    }


    if (

        !pos

    ) {


        paparMesej(

            "Sila pilih Pos.",

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
        // QUERY 1
        // FILTER BULAN + TAHUN + POS
        // =================================================

        let resultDuty =

            await supabase

                .from(

                    "jadual_duty"

                )

                .select(

                    "*"

                )

                .eq(

                    "bulan",

                    bulan

                )

                .eq(

                    "tahun",

                    tahun

                )

                .eq(

                    "pos",

                    pos

                );


        console.log(

            "QUERY PENUH:",

            resultDuty

        );


        let dataDuty =

            resultDuty.data || [];


        // =================================================
        // JIKA 0
        // TEST BULAN + TAHUN
        // =================================================

        if (

            dataDuty.length === 0

        ) {


            console.warn(

                "QUERY PENUH = 0"

            );


            const testBulanTahun =

                await supabase

                    .from(

                        "jadual_duty"

                    )

                    .select(

                        "id,bulan,tahun,pos"

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

                "TEST BULAN + TAHUN:",

                testBulanTahun

            );


            if (

                testBulanTahun.data &&

                testBulanTahun.data.length > 0

            ) {


                const posSama =

                    testBulanTahun.data.filter(

                        function (

                            item

                        ) {


                            return (

                                String(

                                    item.pos

                                ).trim()

                                ===

                                String(

                                    pos

                                ).trim()

                            );

                        }

                    );


                console.log(

                    "POS YANG SAMA:",

                    posSama

                );


                if (

                    posSama.length > 0

                ) {


                    const idList =

                        posSama.map(

                            function (

                                item

                            ) {

                                return item.id;

                            }

                        );


                    const resultById =

                        await supabase

                            .from(

                                "jadual_duty"

                            )

                            .select(

                                "*"

                            )

                            .in(

                                "id",

                                idList

                            );


                    dataDuty =

                        resultById.data || [];


                }

            }

        }


        // =================================================
        // JIKA MASIH 0
        // CUBA AMBIL SEMUA DATA POS
        // =================================================

        if (

            dataDuty.length === 0

        ) {


            const testPos =

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

                    );


            console.log(

                "TEST POS SAHAJA:",

                testPos

            );


            if (

                testPos.data &&

                testPos.data.length > 0

            ) {


                dataDuty =

                    testPos.data.filter(

                        function (

                            item

                        ) {


                            return (

                                String(

                                    item.bulan

                                ).trim()

                                ===

                                String(

                                    bulan

                                ).trim()

                                &&

                                Number(

                                    item.tahun

                                )

                                ===

                                Number(

                                    tahun

                                )

                            );

                        }

                    );

            }

        }


        console.log(

            "JUMLAH DATA DUTY AKHIR:",

            dataDuty.length

        );


        // =================================================
        // JIKA TIADA DATA
        // =================================================

        if (

            dataDuty.length === 0

        ) {


            kosongkanLaporan();


            paparMesej(

                "Tiada data duty dijumpai untuk: " +

                pos +

                " | " +

                bulan +

                " " +

                tahun,

                "error"

            );


            return;

        }


        semuaDuty =

            dataDuty;


        // =================================================
        // AMBIL DATA ANGGOTA
        // =================================================

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

                                item

                            ) {


                                return (

                                    item !== null &&

                                    item !== undefined &&

                                    String(

                                        item

                                    ).trim() !== ""

                                );

                            }

                        )

                )

            ];


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

                "DATA ANGGOTA:",

                resultAnggota

            );


            if (

                !resultAnggota.error

            ) {


                dataAnggota =

                    resultAnggota.data || [];

            }

        }


        semuaAnggota =

            dataAnggota;


        // =================================================
        // PAPAR TAJUK
        // =================================================

        paparTajukLaporan(

            pos,

            bulan,

            tahun,

            dataDuty

        );


        // =================================================
        // GABUNG DATA
        // =================================================

        const laporan =

            dataDuty.map(

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


                    return {


                        duty:

                            duty,


                        anggota:

                            anggota ||

                            duty

                    };

                }

            );


        // =================================================
        // PAPAR
        // =================================================

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
// PAPAR TAJUK
// =====================================================

function paparTajukLaporan(

    pos,

    bulan,

    tahun,

    data

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


    const unit =

        data &&

        data.length > 0

            ? data[0].unit ||

                "Unit"

            : "Unit";


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
// PAPAR JADUAL
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

            "senaraiAnggaran TIDAK DIJUMPAI"

        );


        return;

    }


    tbody.innerHTML = "";


    let bil = 1;


    let jumlahJamBiasa = 0;


    let jumlahHariOff = 0;


    let jumlahJamOff = 0;


    let jumlahHariCutiAm = 0;


    let jumlahJamCutiAm = 0;


    laporan.forEach(

        function (

            rekod

        ) {


            const duty =

                rekod.duty;


            const anggota =

                rekod.anggota;


            // =================================================
            // JAM HARI BIASA
            // JUMLAH jam_klm
            // =================================================

            const jamBiasa =

                parseFloat(

                    duty.jam_klm

                ) || 0;


            // =================================================
            // NILAI HARI OFF
            // =================================================

            const nilaiHariOff =

                parseFloat(

                    duty.hari_offday_bertugas

                ) || 0;


            const nilaiJamOff =

                parseFloat(

                    duty.jam_offday_bertugas

                ) || 0;


            let paparanHariOff =

                0;


            let paparanJamOff =

                0;


            if (

                nilaiHariOff < 4

            ) {


                paparanHariOff =

                    0;


                paparanJamOff =

                    0;

            }

            else if (

                nilaiHariOff >= 4 &&

                nilaiHariOff <= 8

            ) {


                paparanHariOff =

                    nilaiHariOff;

            }

            else if (

                nilaiHariOff > 8

            ) {


                paparanJamOff =

                    nilaiJamOff;

            }


            // =================================================
            // CUTI AM
            // =================================================

            const nilaiHariCutiAm =

                parseFloat(

                    duty.hari_cutiam_bertugas

                ) || 0;


            const nilaiJamCutiAm =

                parseFloat(

                    duty.jam_cutiam_bertugas

                ) || 0;


            let paparanHariCutiAm =

                0;


            let paparanJamCutiAm =

                0;


            if (

                nilaiHariCutiAm < 8

            ) {


                paparanHariCutiAm =

                    nilaiHariCutiAm;

            }

            else if (

                nilaiHariCutiAm > 8

            ) {


                paparanJamCutiAm =

                    nilaiJamCutiAm;

            }


            // =================================================
            // BINA BARIS
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

                        duty.no_skb ||

                        ""

                    )}

                </td>


                <td class="left">

                    ${escapeHTML(

                        anggota.nama ||

                        duty.nama_anggota ||

                        ""

                    )}

                </td>


                <td>

                    ${formatNombor(

                        jamBiasa

                    )}

                </td>


                <td>

                    ${formatNombor(

                        paparanHariOff

                    )}

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td>

                    ${formatNombor(

                        paparanJamOff

                    )}

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td>

                    ${formatNombor(

                        paparanHariCutiAm

                    )}

                </td>


                <td class="amount">

                    RM 0.00

                </td>


                <td>

                    ${formatNombor(

                        paparanJamCutiAm

                    )}

                </td>


                <td class="amount">

                    RM 0.00

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

            `;


            tbody.appendChild(

                tr

            );


            bil++;


            jumlahJamBiasa +=

                jamBiasa;


            jumlahHariOff +=

                paparanHariOff;


            jumlahJamOff +=

                paparanJamOff;


            jumlahHariCutiAm +=

                paparanHariCutiAm;


            jumlahJamCutiAm +=

                paparanJamCutiAm;


        }

    );


    // =================================================
    // FOOTER
    // =================================================

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


                <td>

                    RM 0.00

                </td>


                <td>

                    ${formatNombor(

                        jumlahJamOff

                    )}

                </td>


                <td>

                    RM 0.00

                </td>


                <td>

                    ${formatNombor(

                        jumlahHariCutiAm

                    )}

                </td>


                <td>

                    RM 0.00

                </td>


                <td>

                    ${formatNombor(

                        jumlahJamCutiAm

                    )}

                </td>


                <td>

                    RM 0.00

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
// JAM / HARI TANPA PERPULUHAN
// =====================================================

function formatNombor(

    nilai

) {


    if (

        nilai === null ||

        nilai === undefined ||

        nilai === ""

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

                0,

            maximumFractionDigits:

                0

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
