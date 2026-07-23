```javascript
// =====================================================
// LAPORAN-ANGGARAN.JS
// FPB DUTY SYSTEM
// ANGgaran Duty Bulanan
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


        await isiSenaraiPos();


        tetapkanBulanSemasa();


        tetapkanTahunSemasa();


    }

);


// =====================================================
// TETAPKAN BULAN SEMASA
// =====================================================

function tetapkanBulanSemasa() {


    const bulan = document.getElementById(

        "bulan"

    );


    if (!bulan) return;


    const bulanSemasa =

        new Date().getMonth() + 1;


    bulan.value = bulanSemasa;


}


// =====================================================
// TETAPKAN TAHUN SEMASA
// =====================================================

function tetapkanTahunSemasa() {


    const tahun = document.getElementById(

        "tahun"

    );


    if (!tahun) return;


    const tahunSemasa =

        new Date().getFullYear();


    tahun.value = tahunSemasa;


}


// =====================================================
// ISI SENARAI POS
// DARIPADA TABLE Data_Anggota
// =====================================================

async function isiSenaraiPos() {


    const selectPos = document.getElementById(

        "pos"

    );


    if (!selectPos) return;


    selectPos.innerHTML = `

        <option value="">

            -- Pilih Pos --

        </option>

    `;


    const {

        data,

        error

    } = await supabaseClient


        .from(

            "Data_Anggota"

        )


        .select(

            "pos"

        )


        .not(

            "pos",

            "is",

            null

        );


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


    const senaraiPos = [


        ...new Set(


            data


                .map(


                    item => item.pos


                )


                .filter(


                    pos =>


                        pos &&


                        pos.trim() !== ""


                )


        )


    ];


    senaraiPos.sort();


    senaraiPos.forEach(


        function (pos) {


            const option =

                document.createElement(

                    "option"

                );


            option.value = pos;


            option.textContent = pos;


            selectPos.appendChild(

                option

            );


        }


    );

}


// =====================================================
// JANA LAPORAN ANGGARAN
// =====================================================

async function janaLaporanAnggaran() {


    const bulan = document.getElementById(

        "bulan"

    ).value;


    const tahun = document.getElementById(

        "tahun"

    ).value;


    const pos = document.getElementById(

        "pos"

    ).value;


    if (!bulan) {


        paparMesej(

            "Sila pilih bulan.",

            "error"

        );


        return;

    }


    if (!tahun) {


        paparMesej(

            "Sila pilih tahun.",

            "error"

        );


        return;

    }


    if (!pos) {


        paparMesej(

            "Sila pilih Pos.",

            "error"

        );


        return;

    }


    paparMesej(

        "Sedang mengambil data duty...",

        "success"

    );


    // =================================================
    // AMBIL DATA JADUAL DUTY
    // FILTER:
    // BULAN + TAHUN + POS
    // =================================================

    const {


        data: dataDuty,


        error: errorDuty


    } = await supabaseClient


        .from(

            "jadual_duty"

        )


        .select(`

            tarikh,

            bulan,

            tahun,

            no_skb,

            kod_duty,

            waktu_tugasan,

            jam_kerja,

            jam_klm,

            pos

        `)


        .eq(

            "bulan",

            Number(bulan)

        )


        .eq(

            "tahun",

            Number(tahun)

        )


        .eq(

            "pos",

            pos

        );


    if (errorDuty) {


        console.error(

            "RALAT AMBIL JADUAL DUTY:",

            errorDuty

        );


        paparMesej(

            errorDuty.message,

            "error"

        );


        return;

    }


    if (


        !dataDuty ||


        dataDuty.length === 0


    ) {


        paparMesej(


            "Tiada rekod duty dijumpai untuk Pos, Bulan dan Tahun yang dipilih.",


            "error"


        );


        kosongkanLaporan();


        return;

    }


    // =================================================
    // AMBIL NO SKB
    // =================================================

    const senaraiNoSKB = [


        ...new Set(


            dataDuty


                .map(


                    item => item.no_skb


                )


                .filter(


                    no =>


                        no !== null &&


                        no !== undefined


                )


        )


    ];


    if (


        senaraiNoSKB.length === 0


    ) {


        paparMesej(


            "Tiada no_skb dijumpai dalam jadual duty.",


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


    } = await supabaseClient


        .from(

            "Data_Anggota"

        )


        .select(`

            no_skb,

            no_anggota,

            nama,

            gaji_pokok,

            pos

        `)


        .in(

            "no_skb",

            senaraiNoSKB

        );


    if (errorAnggota) {


        console.error(

            "RALAT AMBIL DATA ANGGOTA:",

            errorAnggota

        );


        paparMesej(

            errorAnggota.message,

            "error"

        );


        return;

    }


    // =================================================
    // GABUNGKAN DATA
    // ANGGOTA + JADUAL DUTY
    // =================================================

    const dataLaporan = [];


    dataAnggota.forEach(


        function (anggota) {


            const dutyAnggota =

                dataDuty.filter(


                    function (duty) {


                        return String(

                            duty.no_skb

                        ) === String(

                            anggota.no_skb

                        );


                    }


                );


            if (


                dutyAnggota.length === 0


            ) {


                return;


            }


            const rekod = {


                no_skb:


                    anggota.no_skb,


                no_anggota:


                    anggota.no_anggota || "",


                nama:


                    anggota.nama || "",


                gaji_pokok:


                    Number(

                        anggota.gaji_pokok || 0

                    ),


                hari_biasa_jam: 0,


                hari_biasa_rm: 0,


                off_bawah_4_hari: 0,


                off_bawah_4_rm: 0,


                off_4_8_hari: 0,


                off_4_8_rm: 0,


                off_atas_8_hari: 0,


                off_atas_8_rm: 0,


                cuti_bawah_8_jam: 0,


                cuti_bawah_8_rm: 0,


                cuti_atas_8_hari: 0,


                cuti_atas_8_rm: 0,


                jumlah_tuntutan_klm: 0


            };


            // =========================================
            // KIRA SEMUA REKOD DUTY ANGGOTA
            // =========================================

            dutyAnggota.forEach(


                function (duty) {


                    const tarikh = new Date(


                        duty.tarikh

                    );


                    const hari =

                        tarikh.getDay();


                    const jamKerja =

                        Number(


                            duty.jam_kerja || 0

                        );


                    const jamKLM =

                        Number(


                            duty.jam_klm || 0

                        );


                    // =================================
                    // JUMLAH KLM
                    // =================================

                    rekod.jumlah_tuntutan_klm +=

                        jamKLM;


                    // =================================
                    // HARI BIASA
                    // ISNIN - JUMAAT
                    // =================================

                    if (


                        hari >= 1 &&


                        hari <= 5


                    ) {


                        rekod.hari_biasa_jam +=

                            jamKerja;


                    }


                    // =================================
                    // HARI OFF
                    // SABTU / AHAD
                    // =================================

                    else {


                        if (


                            jamKerja < 4


                        ) {


                            rekod.off_bawah_4_hari++;


                        }


                        else if (


                            jamKerja >= 4 &&


                            jamKerja <= 8


                        ) {


                            rekod.off_4_8_hari++;


                        }


                        else if (


                            jamKerja > 8


                        ) {


                            rekod.off_atas_8_hari++;


                        }


                    }


                }


            );


            dataLaporan.push(

                rekod

            );


        }


    );


    // =================================================
    // SUSUN IKUT NAMA
    // =================================================

    dataLaporan.sort(


        function (a, b) {


            return String(


                a.nama


            ).localeCompare(


                String(


                    b.nama


                )


            );


        }


    );


    // =================================================
    // PAPAR LAPORAN
    // =================================================

    paparLaporan(


        dataLaporan,


        bulan,


        tahun,


        pos


    );


    paparMesej(


        `Berjaya memuatkan ${dataLaporan.length} anggota untuk ${SENARAI_BULAN[Number(bulan)]} ${tahun}.`,


        "success"


    );


}


// =====================================================
// PAPAR LAPORAN
// =====================================================

function paparLaporan(


    data,


    bulan,


    tahun,


    pos


) {


    const tbody = document.getElementById(

        "senaraiAnggaran"

    );


    const tfoot = document.getElementById(

        "jumlahAnggaran"

    );


    const tajukUnit = document.getElementById(

        "tajukUnit"

    );


    const tajukBulan = document.getElementById(

        "tajukBulan"

    );


    const tajukPos = document.getElementById(

        "tajukPos"

    );


    // =================================================
    // TAJUK LAPORAN
    // =================================================

    tajukUnit.textContent =

        "WILAYAH TERENGGANU";


    tajukBulan.textContent =


        SENARAI_BULAN[

            Number(bulan)

        ]


        + " "


        + tahun;


    tajukPos.textContent =

        "POS: " + pos;


    tbody.innerHTML = "";


    tfoot.innerHTML = "";


    // =================================================
    // JUMLAH
    // =================================================

    let jumlahGaji = 0;


    let jumlahHariBiasaJam = 0;


    let jumlahOffBawah4 = 0;


    let jumlahOff4hingga8 = 0;


    let jumlahOffAtas8 = 0;


    let jumlahCutiBawah8 = 0;


    let jumlahCutiAtas8 = 0;


    let jumlahKLM = 0;


    // =================================================
    // PAPAR SETIAP ANGGOTA
    // =================================================

    data.forEach(


        function (item, index) {


            jumlahGaji +=

                item.gaji_pokok;


            jumlahHariBiasaJam +=

                item.hari_biasa_jam;


            jumlahOffBawah4 +=

                item.off_bawah_4_hari;


            jumlahOff4hingga8 +=

                item.off_4_8_hari;


            jumlahOffAtas8 +=

                item.off_atas_8_hari;


            jumlahCutiBawah8 +=

                item.cuti_bawah_8_jam;


            jumlahCutiAtas8 +=

                item.cuti_atas_8_hari;


            jumlahKLM +=

                item.jumlah_tuntutan_klm;


            const tr =

                document.createElement(

                    "tr"

                );


            tr.innerHTML = `


                <td>

                    ${index + 1}

                </td>


                <td>

                    ${item.no_skb}

                    <br>

                    <small>

                        ${item.no_anggota}

                    </small>

                </td>


                <td class="left">

                    ${item.nama}

                </td>


                <td class="amount">

                    ${formatRM(

                        item.gaji_pokok

                    )}

                </td>


                <td>

                    ${item.hari_biasa_jam}

                </td>


                <td class="amount">

                    ${formatRM(

                        item.hari_biasa_rm

                    )}

                </td>


                <td>

                    ${item.off_bawah_4_hari}

                </td>


                <td class="amount">

                    ${formatRM(

                        item.off_bawah_4_rm

                    )}

                </td>


                <td>

                    ${item.off_4_8_hari}

                </td>


                <td class="amount">

                    ${formatRM(

                        item.off_4_8_rm

                    )}

                </td>


                <td>

                    ${item.off_atas_8_hari}

                </td>


                <td class="amount">

                    ${formatRM(

                        item.off_atas_8_rm

                    )}

                </td>


                <td>

                    ${item.cuti_bawah_8_jam}

                </td>


                <td class="amount">

                    ${formatRM(

                        item.cuti_bawah_8_rm

                    )}

                </td>


                <td>

                    ${item.cuti_atas_8_hari}

                </td>


                <td class="amount">

                    ${formatRM(

                        item.cuti_atas_8_rm

                    )}

                </td>


                <td class="amount">

                    ${formatRM(

                        item.jumlah_tuntutan_klm

                    )}

                </td>


            `;


            tbody.appendChild(

                tr

            );


        }


    );


    // =================================================
    // JUMLAH KESELURUHAN
    // =================================================

    tfoot.innerHTML = `


        <tr class="total-row">


            <td colspan="3">


                JUMLAH


            </td>


            <td class="amount">


                ${formatRM(

                    jumlahGaji

                )}


            </td>


            <td>


                ${jumlahHariBiasaJam}


            </td>


            <td>


                -


            </td>


            <td>


                ${jumlahOffBawah4}


            </td>


            <td>


                -


            </td>


            <td>


                ${jumlahOff4hingga8}


            </td>


            <td>


                -


            </td>


            <td>


                ${jumlahOffAtas8}


            </td>


            <td>


                -


            </td>


            <td>


                ${jumlahCutiBawah8}


            </td>


            <td>


                -


            </td>


            <td>


                ${jumlahCutiAtas8}


            </td>


            <td>


                -


            </td>


            <td class="amount">


                ${formatRM(

                    jumlahKLM

                )}


            </td>


        </tr>


    `;


}


// =====================================================
// FORMAT RM
// =====================================================

function formatRM(

    nilai

) {


    return Number(

        nilai || 0

    ).toLocaleString(


        "ms-MY",


        {


            minimumFractionDigits: 2,


            maximumFractionDigits: 2


        }


    );


}


// =====================================================
// KOSONGKAN LAPORAN
// =====================================================

function kosongkanLaporan() {


    document.getElementById(

        "senaraiAnggaran"

    ).innerHTML = `


        <tr>


            <td colspan="17">


                Tiada data dijumpai


            </td>


        </tr>


    `;


    document.getElementById(

        "jumlahAnggaran"

    ).innerHTML = "";


}


// =====================================================
// PAPAR MESEJ
// =====================================================

function paparMesej(


    mesej,


    jenis


) {


    const elemen = document.getElementById(

        "mesej"

    );


    if (!elemen) return;


    elemen.innerHTML = `


        <div class="${jenis}">


            ${mesej}


        </div>


    `;


    setTimeout(


        function () {


            elemen.innerHTML = "";


        },


        5000


    );


}
```
