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


        // MUAT TAHUN JIKA ADA DROPDOWN TAHUN

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


    // RESET DROPDOWN

    selectPos.innerHTML = `

        <option value="">

            -- Sedang Memuatkan Pos --

        </option>

    `;


    try {


        // =============================================
        // AMBIL DATA DARI DATA_ANGGOTA
        // =============================================

        const result =

            await supabase

                .from(

                    "Data_Anggota"

                )

                .select(

                    "pos"

                );


        console.log(

            "HASIL QUERY POS:",

            result

        );


        // =============================================
        // SEMAK ERROR
        // =============================================

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


        console.log(

            "DATA POS DITERIMA:",

            data

        );


        // =============================================
        // SEMAK DATA KOSONG
        // =============================================

        if (

            !data ||

            data.length === 0

        ) {


            console.warn(

                "TIADA DATA DALAM Data_Anggota"

            );


            selectPos.innerHTML = `

                <option value="">

                    -- Tiada Data Anggota --

                </option>

            `;


            paparMesej(

                "Tiada data dijumpai dalam table Data_Anggota.",

                "error"

            );


            return;

        }


        // =============================================
        // AMBIL POS UNIK
        // =============================================

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


        console.log(

            "POS UNIK:",

            senaraiPos

        );


        // =============================================
        // JIKA TIADA POS
        // =============================================

        if (

            senaraiPos.length === 0

        ) {


            selectPos.innerHTML = `

                <option value="">

                    -- Tiada Pos Dijumpai --

                </option>

            `;


            paparMesej(

                "Column pos dalam Data_Anggota tidak mempunyai data.",

                "error"

            );


            return;

        }


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

                        numeric: true

                    }

                );


            }

        );


        semuaPos =

            senaraiPos;


        // =============================================
        // RESET DROPDOWN
        // =============================================

        selectPos.innerHTML = `

            <option value="">

                -- Pilih Pos --

            </option>

        `;


        // =============================================
        // MASUKKAN SEMUA POS
        // =============================================

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

            "DROPDOWN POS BERJAYA DIISI"

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
// JIKA ELEMENT #tahun WUJUD
// =====================================================

function muatSenaraiTahun() {


    const selectTahun =

        document.getElementById(

            "tahun"

        );


    if (!selectTahun) {


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

        "MULA JANA LAPORAN"

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

        "FILTER:",

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


    try {


        paparMesej(

            "Sedang mengambil data duty...",

            "success"

        );


        // =============================================
        // AMBIL DATA JADUAL DUTY
        // FILTER POS + BULAN + TAHUN
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

                    dikemaskini_pada

                    `

                )

                .eq(

                    "pos",

                    pos

                )

                .eq(

                    "bulan",

                    parseInt(

                        bulan,

                        10

                    )

                )

                .eq(

                    "tahun",

                    parseInt(

                        tahun,

                        10

                    ));


        console.log(

            "DATA JADUAL DUTY:",

            resultDuty

        );


        // =============================================
        // SEMAK ERROR
        // =============================================

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


        // =============================================
        // SEMAK DATA KOSONG
        // =============================================

        if (

            !dataDuty ||

            dataDuty.length === 0

        ) {


            kosongkanLaporan();


            paparMesej(

                `Tiada data duty untuk ${pos}, ${SENARAI_BULAN[parseInt(bulan)]} ${tahun}.`,

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


        if (

            senaraiNoSKB.length === 0

        ) {


            kosongkanLaporan();


            paparMesej(

                "Tiada no_skb dijumpai dalam jadual duty.",

                "error"

            );


            return;

        }


        // =============================================
        // AMBIL DATA ANGGOTA
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

                    unit

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


        // =============================================
        // SEMAK ERROR ANGGOTA
        // =============================================

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

            dataAnggota

        );


        // =============================================
        // GABUNGKAN DATA ANGGOTA + DUTY
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

    anggota

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

        anggota &&

        anggota.length > 0

    ) {


        unit =

            anggota[0].unit ||

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

            `${

                SENARAI_BULAN[

                    parseInt(

                        bulan,

                        10

                    )

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


    let jumlahKLM = 0;


    laporan.forEach(

        function (

            rekod

        ) {


            const anggota =

                rekod.anggota;


            const duty =

                rekod.duty;


            let jamBiasa =

                0;


            let rmBiasa =

                0;


            let jumlahTuntutanKLM =

                0;


            // =========================================
            // KIRA DUTY
            // =========================================

            duty.forEach(

                function (

                    item

                ) {


                    const jam =

                        parseFloat(

                            item.jam_kerja

                        ) || 0;


                    const klm =

                        parseFloat(

                            item.jam_klm

                        ) || 0;


                    jamBiasa +=

                        jam;


                    jumlahTuntutanKLM +=

                        klm;


                }

            );


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

                        rmBiasa

                    )}

                </td>


                <td>

                    0

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


                <td>

                    0

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

                    ${formatNombor(

                        jumlahTuntutanKLM

                    )}

                </td>

            `;


            tbody.appendChild(

                tr

            );


            bil++;


            jumlahJamBiasa +=

                jamBiasa;


            jumlahRMBiasa +=

                rmBiasa;


            jumlahKLM +=

                jumlahTuntutanKLM;


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


                <td colspan="8">

                </td>


                <td class="amount">

                    ${formatNombor(

                        jumlahKLM

                    )}

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
