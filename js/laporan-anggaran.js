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

            "LAPORAN ANGGARAN DIMUATKAN"

        );


        await muatSenaraiPos();


    }

);


// =====================================================
// MUAT SENARAI POS
// DARIPADA TABLE Data_Anggota
// =====================================================

async function muatSenaraiPos() {


    const selectPos =

        document.getElementById(

            "pos"

        );


    if (!selectPos) {


        console.error(

            "Dropdown #pos tidak dijumpai."

        );


        return;

    }


    // =================================================
    // RESET DROPDOWN
    // =================================================

    selectPos.innerHTML = `

        <option value="">

            -- Pilih Pos --

        </option>

    `;


    try {


        // =================================================
        // AMBIL POS DARIPADA Data_Anggota
        // =================================================

        const {

            data,

            error

        } = await supabase

            .from("Data_Anggota")

            .select("pos");


        if (error) {


            console.error(

                "RALAT AMBIL POS:",

                error

            );


            paparMesej(

                error.message,

                "error"

            );


            return;

        }


        if (!data || data.length === 0) {


            console.warn(

                "Tiada data POS dalam Data_Anggota."

            );


            paparMesej(

                "Tiada data Pos dijumpai dalam Data_Anggota.",

                "error"

            );


            return;

        }


        // =================================================
        // BUANG POS KOSONG DAN DUPLIKAT
        // =================================================

        const posUnik = [

            ...new Set(

                data

                    .map(

                        item =>

                            item.pos

                    )

                    .filter(

                        pos =>

                            pos !== null &&

                            pos !== undefined &&

                            String(

                                pos

                            ).trim() !== ""

                    )

            )

        ];


        // =================================================
        // SUSUN SENARAI POS
        // =================================================

        posUnik.sort(

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


        semuaPos = posUnik;


        // =================================================
        // MASUKKAN KE DROPDOWN
        // =================================================

        posUnik.forEach(

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

            "SENARAI POS:",

            semuaPos

        );


    }

    catch (

        error

    ) {


        console.error(

            "RALAT SISTEM:",

            error

        );


        paparMesej(

            "Gagal memuatkan senarai Pos.",

            "error"

        );


    }

}


// =====================================================
// JANA LAPORAN ANGGARAN
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

            ? bulanElement.value

            : "";


    const tahun =

        tahunElement

            ? tahunElement.value

            : "";


    const pos =

        posElement

            ? posElement.value

            : "";


    console.log(

        "FILTER DIPILIH:",

        {

            pos,

            bulan,

            tahun

        }

    );


    // =================================================
    // SEMAK POS
    // =================================================

    if (!pos) {


        paparMesej(

            "Sila pilih Pos terlebih dahulu.",

            "error"

        );


        return;

    }


    // =================================================
    // SEMAK BULAN
    // =================================================

    if (!bulan) {


        paparMesej(

            "Sila pilih Bulan terlebih dahulu.",

            "error"

        );


        return;

    }


    // =================================================
    // SEMAK TAHUN
    // =================================================

    if (!tahun) {


        paparMesej(

            "Sila pilih Tahun terlebih dahulu.",

            "error"

        );


        return;

    }


    try {


        paparMesej(

            "Sedang mengambil data laporan...",

            "success"

        );


        // =================================================
        // AMBIL DATA JADUAL DUTY
        // FILTER:
        //
        // POS
        // BULAN
        // TAHUN
        // =================================================

        const {

            data: dataDuty,

            error: errorDuty

        } = await supabase

            .from("jadual_duty")

            .select(`

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

            `)

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


        if (errorDuty) {


            console.error(

                "RALAT JADUAL DUTY:",

                errorDuty

            );


            paparMesej(

                errorDuty.message,

                "error"

            );


            return;

        }


        // =================================================
        // TIADA DATA DUTY
        // =================================================

        if (

            !dataDuty ||

            dataDuty.length === 0

        ) {


            paparMesej(

                "Tiada data duty untuk Pos, Bulan dan Tahun yang dipilih.",

                "error"

            );


            kosongkanLaporan();


            return;

        }


        semuaDuty = dataDuty;


        // =================================================
        // AMBIL NO SKB
        // DARIPADA JADUAL DUTY
        // =================================================

        const senaraiNoSKB = [

            ...new Set(

                dataDuty

                    .map(

                        duty =>

                            duty.no_skb

                    )

                    .filter(

                        no =>

                            no !== null &&

                            no !== undefined &&

                            String(

                                no

                            ).trim() !== ""

                    )

            )

        ];


        if (

            senaraiNoSKB.length === 0

        ) {


            paparMesej(

                "Data duty dijumpai tetapi tiada no_skb.",

                "error"

            );


            kosongkanLaporan();


            return;

        }


        // =================================================
        // AMBIL DATA ANGGOTA
        // =================================================

        const {

            data: dataAnggota,

            error: errorAnggota

        } = await supabase

            .from("Data_Anggota")

            .select(`

                no_skb,

                no_anggota,

                nama,

                pangkat,

                pos,

                unit

            `)

            .in(

                "no_skb",

                senaraiNoSKB

            );


        if (errorAnggota) {


            console.error(

                "RALAT DATA ANGGOTA:",

                errorAnggota

            );


            paparMesej(

                errorAnggota.message,

                "error"

            );


            return;

        }


        if (

            !dataAnggota ||

            dataAnggota.length === 0

        ) {


            paparMesej(

                "Data duty ada, tetapi data anggota tidak dijumpai.",

                "error"

            );


            kosongkanLaporan();


            return;

        }


        semuaAnggota = dataAnggota;


        // =================================================
        // PAPAR TAJUK
        // =================================================

        paparTajukLaporan(

            pos,

            bulan,

            tahun,

            semuaAnggota

        );


        // =================================================
        // GABUNG DATA ANGGOTA + DUTY
        // =================================================

        const laporan =

            semuaAnggota.map(

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


        // =================================================
        // PAPAR JADUAL
        // =================================================

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

            "Ralat tidak diketahui berlaku.",

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


    // =================================================
    // UNIT
    // =================================================

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


    if (tajukUnit) {


        tajukUnit.textContent =

            unit;


    }


    // =================================================
    // BULAN + TAHUN
    // =================================================

    if (tajukBulan) {


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


    // =================================================
    // POS
    // =================================================

    if (tajukPos) {


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


    if (!tbody) {


        console.error(

            "Element senaraiAnggaran tidak dijumpai."

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

                    Tiada data anggota dijumpai.

                </td>

            </tr>

        `;


        return;

    }


    let bil = 1;


    let jumlahJamBiasa = 0;

    let jumlahRMBiasa = 0;

    let jumlahKLM = 0;


    // =================================================
    // SETIAP ANGGOTA
    // =================================================

    laporan.forEach(

        function (

            rekod

        ) {


            const anggota =

                rekod.anggota;


            const duty =

                rekod.duty;


            let jamBiasa = 0;


            let rmBiasa = 0;


            let jumlahTuntutanKLM = 0;


            // =================================================
            // KIRA DATA DUTY
            // =================================================

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


    // =================================================
    // JUMLAH
    // =================================================

    if (tfoot) {


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


    if (tbody) {


        tbody.innerHTML = `

            <tr>

                <td colspan="15">

                    Tiada data untuk dipaparkan.

                </td>

            </tr>

        `;


    }


    if (tfoot) {


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


    if (!element) {


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
