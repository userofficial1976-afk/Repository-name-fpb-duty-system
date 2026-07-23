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
// SUMBER: jadual_duty
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
        // AMBIL POS TERUS DARIPADA JADUAL DUTY
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

            result.data;


        if (

            !data ||

            data.length === 0

        ) {


            selectPos.innerHTML = `

                <option value="">

                    -- Tiada Data Pos --

                </option>

            `;


            paparMesej(

                "Tiada data Pos dijumpai dalam jadual_duty.",

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

                        )

                            .trim();


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
        // MASUKKAN POS
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


    const bulanValue =

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


    // =============================================
    // NILAI BULAN SEBENAR DALAM DATABASE
    // =============================================

    const bulanNama =

        SENARAI_BULAN[

            parseInt(

                bulanValue,

                10

            )

        ];


    console.log(

        "FILTER YANG DIGUNAKAN:",

        {

            bulanValue,

            bulanNama,

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

        !bulanValue

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
        // QUERY JADUAL DUTY
        //
        // BULAN DATABASE:
        // "Januari"
        // "Februari"
        // "Julai"
        //
        // BUKAN:
        // 1
        // 2
        // 7
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

                    bulanNama

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

            resultDuty.data;


        console.log(

            "JUMLAH DATA DUTY:",

            dataDuty

                ? dataDuty.length

                : 0

        );


        // =============================================
        // JIKA TIADA DATA
        // =============================================

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
        // AMBIL SEMUA NO SKB
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

                                )

                                    .trim() !== ""

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
        //
        // Gaji diambil daripada Data_Anggota
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


            dataAnggota =

                resultAnggota.data ||

                [];

        }


        semuaAnggota =

            dataAnggota;


        // =============================================
        // PAPAR TAJUK
        // =============================================

        paparTajukLaporan(

            pos,

            bulanValue,

            tahun,

            dataDuty

        );


        // =============================================
        // GABUNG DATA
        //
        // UTAMA:
        // data daripada jadual_duty
        //
        // Gaji:
        // data daripada Data_Anggota
        // =============================================

        const senaraiAnggota = [];


        const noSKBUnik = [

            ...

            new Set(

                dataDuty

                    .map(

                        function (

                            item

                        ) {


                            return String(

                                item.no_skb

                            );


                        }

                    )

            )

        ];


        noSKBUnik.forEach(

            function (

                noSKB

            ) {


                const dutyAnggota =

                    dataDuty.filter(

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

                    dutyAnggota.length === 0

                ) {


                    return;

                }


                const anggotaDB =

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


                // =========================================
                // DATA UTAMA DARI JADUAL_DUTY
                // =========================================

                const dataUtama =

                    dutyAnggota[0];


                senaraiAnggota.push(

                    {

                        anggota:

                            anggotaDB ||

                            {},


                        duty:

                            dutyAnggota,


                        dataUtama:

                            dataUtama

                    }

                );

            }

        );


        // =============================================
        // PAPAR JADUAL
        // =============================================

        paparJadualAnggaran(

            senaraiAnggota

        );


        paparMesej(

            `Laporan berjaya dijana. ${senaraiAnggota.length} anggota dijumpai.`,

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


    // =============================================
    // UNIT DARIPADA JADUAL DUTY
    // =============================================

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


            const dataUtama =

                rekod.dataUtama;


            // =========================================
            // JAM HARI BIASA
            //
            // jumlah jam_klm
            // daripada jadual_duty
            // =========================================

            let jamBiasa = 0;


            duty.forEach(

                function (

                    item

                ) {


                    const jamKLM =

                        parseFloat(

                            item.jam_klm

                        ) || 0;


                    jamBiasa +=

                        jamKLM;

                }

            );


            // =========================================
            // GAJI
            //
            // DIAMBIL DARIPADA DATA_ANGGOTA
            // =========================================

            const gaji =

                parseFloat(

                    anggota.gaji

                ) || 0;


            // =========================================
            // HARI OFF
            //
            // < 4 jam = kosong
            // 4 - 8 jam = hari_offday_bertugas
            // > 8 jam = jam_offday_bertugas
            // =========================================

            let hariOff = 0;


            let jumlahHariOff = 0;


            duty.forEach(

                function (

                    item

                ) {


                    const jam =

                        parseFloat(

                            item.jam_offday_bertugas

                        ) || 0;


                    const hari =

                        parseFloat(

                            item.hari_offday_bertugas

                        ) || 0;


                    if (

                        jam < 4

                    ) {


                        return;

                    }


                    if (

                        jam >= 4 &&

                        jam <= 8

                    ) {


                        jumlahHariOff +=

                            hari;

                    }


                    if (

                        jam > 8

                    ) {


                        jumlahHariOff +=

                            jam;

                    }

                }

            );


            hariOff =

                jumlahHariOff;


            // =========================================
            // HARI CUTI AM
            //
            // < 8 jam = hari_cutiam_bertugas
            // > 8 jam = jam_cutiam_bertugas
            // =========================================

            let jumlahCutiAm = 0;


            duty.forEach(

                function (

                    item

                ) {


                    const jam =

                        parseFloat(

                            item.jam_cutiam_bertugas

                        ) || 0;


                    const hari =

                        parseFloat(

                            item.hari_cutiam_bertugas

                        ) || 0;


                    if (

                        jam < 8

                    ) {


                        jumlahCutiAm +=

                            hari;

                    }


                    if (

                        jam > 8

                    ) {


                        jumlahCutiAm +=

                            jam;

                    }

                }

            );


            // =========================================
            // JUMLAH TUNTUTAN KLM
            //
            // KOSONG DAHULU
            // =========================================

            const jumlahTuntutanKLM =

                "";


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

                        dataUtama.no_skb

                    )}

                </td>


                <td class="left">

                    ${escapeHTML(

                        dataUtama.nama_anggota

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


                <td>

                    ${formatNombor(

                        jumlahCutiAm

                    )}

                </td>


                <td>

                    ${escapeHTML(

                        dataUtama.pos_tampungan ||

                        ""

                    )}

                </td>


                <td>

                    ${formatNombor(

                        dataUtama.jam_tampungan

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


            jumlahKLM +=

                jamBiasa;

        }

    );


    // =============================================
    // FOOTER
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


                <td colspan="4">

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
