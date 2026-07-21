// =====================================================
// DATA
// =====================================================

let semuaAnggota = [];

let semuaDuty = [];


// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    async function () {


        console.log(
            "LAPORAN ANGGARAN BERJAYA DIMUAT"
        );


        isiTahun();


        setBulanSemasa();


        await muatAnggota();


        await muatPos();

    }

);


// =====================================================
// ISI TAHUN
// =====================================================

function isiTahun() {


    const select =

        document
            .getElementById(
                "tahun"
            );


    const tahunSemasa =

        new Date()
            .getFullYear();


    for (

        let tahun = tahunSemasa - 2;

        tahun <= tahunSemasa + 2;

        tahun++

    ) {


        const option =

            document
                .createElement(
                    "option"
                );


        option.value =
            tahun;


        option.textContent =
            tahun;


        if (

            tahun === tahunSemasa

        ) {

            option.selected =
                true;

        }


        select
            .appendChild(
                option
            );

    }

}


// =====================================================
// BULAN SEMASA
// =====================================================

function setBulanSemasa() {


    const bulan =

        new Date()
            .getMonth()
            + 1;


    document
        .getElementById(
            "bulan"
        )
        .value =
        bulan;

}


// =====================================================
// MUAT ANGGOTA
// =====================================================

async function muatAnggota() {


    const {

        data,

        error

    } =

        await supabaseClient

            .from(
                "Data_Anggota"
            )

            .select(`

                no_skb,

                no_anggota,

                nama,

                pangkat,

                pos,

                unit,

                ketua_pos,

                status

            `)

            .eq(

                "status",

                "Aktif"

            )

            .order(

                "nama",

                {

                    ascending:

                        true

                }

            );


    if (error) {

        console.error(

            "RALAT ANGGOTA:",

            error

        );

        return;

    }


    semuaAnggota =
        data || [];

}


// =====================================================
// MUAT POS
// =====================================================

async function muatPos() {


    const posUnik =

        [

            ...new Set(

                semuaAnggota

                    .map(

                        function (

                            anggota

                        ) {

                            return anggota.pos;

                        }

                    )

                    .filter(

                        function (

                            pos

                        ) {

                            return pos;

                        }

                    )

            )

        ];


    posUnik.sort();


    const select =

        document
            .getElementById(
                "pos"
            );


    select.innerHTML = `

        <option value="">

            -- Pilih Pos --

        </option>

    `;


    posUnik.forEach(

        function (

            pos

        ) {


            const option =

                document
                    .createElement(
                        "option"
                    );


            option.value =
                pos;


            option.textContent =
                pos;


            select
                .appendChild(
                    option
                );

        }

    );

}


// =====================================================
// JANA LAPORAN
// =====================================================

async function janaLaporan() {


    const bulan =

        Number(

            document
                .getElementById(
                    "bulan"
                )
                .value

        );


    const tahun =

        Number(

            document
                .getElementById(
                    "tahun"
                )
                .value

        );


    const pos =

        document
            .getElementById(
                "pos"
            )
            .value;


    if (!pos) {

        alert(
            "Sila pilih Pos terlebih dahulu."
        );

        return;

    }


    const {

        data,

        error

    } =

        await supabaseClient

            .from(
                "jadual_duty"
            )

            .select("*")

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

            )

            .order(

                "tarikh",

                {

                    ascending:

                        true

                }

            );


    if (error) {

        console.error(

            "RALAT DUTY:",

            error

        );

        alert(

            "Gagal ambil data duty: "

            +

            error.message

        );

        return;

    }


    semuaDuty =
        data || [];


    const anggotaPos =

        semuaAnggota.filter(

            function (

                anggota

            ) {


                return (

                    anggota.pos

                    ===

                    pos

                );

            }

        );


    paparLaporan(

        bulan,

        tahun,

        pos,

        anggotaPos,

        semuaDuty

    );

}


// =====================================================
// PAPAR LAPORAN
// =====================================================

function paparLaporan(

    bulan,

    tahun,

    pos,

    anggotaPos,

    semuaDuty

) {


    const namaBulan =

        [

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

        ][bulan];


    const ketuaPos =

        anggotaPos.find(

            function (

                anggota

            ) {


                return (

                    anggota.ketua_pos

                    &&

                    anggota.ketua_pos
                        .trim()

                    !==

                    ""

                );

            }

        );


    let html = `

        <div class="info-header">

            <h2>

                Anggaran Duty

                ${pos}

                Bulan

                ${namaBulan}

                ${tahun}

            </h2>


            <table>

                <tr>

                    <td>

                        NAMA POS

                    </td>

                    <td>

                        ${pos}

                    </td>

                </tr>


                <tr>

                    <td>

                        NAMA KETUA POS

                    </td>

                    <td>

                        ${(

                            ketuaPos

                            &&

                            ketuaPos.ketua_pos

                        )

                        ||

                        "-"

                        }

                    </td>

                </tr>


                <tr>

                    <td>

                        JUMLAH ANGGOTA

                    </td>

                    <td>

                        ${anggotaPos.length}

                    </td>

                </tr>

            </table>

        </div>


        <div class="table-wrapper">

        <table>

            <thead>

                <tr>

                    <th>

                        TARIKH

                    </th>

                    <th>

                        HARI

                    </th>

    `;


    anggotaPos.forEach(

        function (

            anggota

        ) {


            html += `

                <th>

                    <div class="nama-anggota">

                        ${anggota.nama}

                        <br>

                        ${anggota.no_anggota}

                    </div>

                </th>

            `;

        }

    );


    html += `

                </tr>

            </thead>

            <tbody>

    `;


    const jumlahHari =

        new Date(

            tahun,

            bulan,

            0

        ).getDate();


    for (

        let hari = 1;

        hari <= jumlahHari;

        hari++

    ) {


        const tarikh =

            tahun

            +

            "-"

            +

            String(

                bulan

            ).padStart(

                2,

                "0"

            )

            +

            "-"

            +

            String(

                hari

            ).padStart(

                2,

                "0"

            );


        const date =

            new Date(

                tarikh

                +

                "T00:00:00"

            );


        const namaHari =

            date.toLocaleDateString(

                "ms-MY",

                {

                    weekday:

                        "long"

                }

            );


        html += `

            <tr>

                <td class="tarikh">

                    ${hari}

                </td>


                <td class="hari">

                    ${namaHari}

                </td>

        `;


        anggotaPos.forEach(

            function (

                anggota

            ) {


                const duty =

                    semuaDuty.find(

                        function (

                            row

                        ) {


                            return (

                                String(

                                    row.no_skb

                                )

                                ===

                                String(

                                    anggota.no_skb

                                )

                                &&

                                row.tarikh

                                ===

                                tarikh

                            );

                        }

                    );


                let kod =
                    "";


                if (duty) {

                    kod =

                        duty.kod_dutyy

                        ||

                        "0";

                }


                let kelas =
                    "kode";


                if (

                    kod

                    ===

                    "OFF"

                ) {

                    kelas =
                        "off";

                }


                html += `

                    <td

                        class="${kelas}"

                    >

                        ${kod}

                    </td>

                `;

            }

        );


        html += `

            </tr>

        `;

    }


    html += `

            </tbody>

        </table>

        </div>

    `;


    document

        .getElementById(
            "laporan"
        )

        .innerHTML =
        html;

}
