// =====================================================
// JADUAL DUTY.JS
// FPB DUTY SYSTEM
// VERSI TERAKHIR
// =====================================================


// =====================================================
// SENARAI UNIT
// =====================================================

const SENARAI_UNIT = [

    "Jerangau",

    "Chador",

    "Terengganu",

    "Setiu",

    "Rantau Abang",

    "Kerteh"

];


// =====================================================
// DATA GLOBAL
// =====================================================

let semuaAnggota = [];

let semuaKodDuty = [];

let semuaKodTempatKerja = [];

let semuaDuty = [];


// =====================================================
// DOM READY
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    async function () {


        isiSenaraiUnit();


        pasangEventTarikh();


        pasangEventUnit();


        pasangEventPos();


        pasangEventAnggota();


        pasangEventKodDuty();


        pasangEventKodTempatKerja();


        await muatAnggota();


        await muatKodDuty();


        await muatKodTempatKerja();


        isiSenaraiKetuaUnit();


    }

);


// =====================================================
// POPUP
// =====================================================

function paparPopup(

    mesej,

    jenis = "success",

    tajuk = "Makluman"

) {


    const overlay =

        document.getElementById(

            "popupOverlay"

        );


    const icon =

        document.getElementById(

            "popupIcon"

        );


    const title =

        document.getElementById(

            "popupTitle"

        );


    const message =

        document.getElementById(

            "popupMessage"

        );


    if (!overlay)

        return;


    if (jenis === "success") {

        icon.textContent = "✅";

    }

    else if (jenis === "error") {

        icon.textContent = "❌";

    }

    else if (jenis === "warning") {

        icon.textContent = "⚠️";

    }

    else {

        icon.textContent = "ℹ️";

    }


    title.textContent = tajuk;


    message.textContent = mesej;


    overlay.style.display = "flex";

}


function tutupPopup() {


    const overlay =

        document.getElementById(

            "popupOverlay"

        );


    if (overlay)

        overlay.style.display = "none";

}


document.addEventListener(

    "click",

    function (event) {


        const overlay =

            document.getElementById(

                "popupOverlay"

            );


        if (

            event.target === overlay

        ) {

            tutupPopup();

        }

    }

);


// =====================================================
// SENARAI UNIT
// =====================================================

function isiSenaraiUnit() {


    const select =

        document.getElementById(

            "unitPilihan"

        );


    if (!select)

        return;


    select.innerHTML = `

        <option value="">

            -- Pilih Unit --

        </option>

    `;


    SENARAI_UNIT.forEach(

        function (unit) {


            const option =

                document.createElement(

                    "option"

                );


            option.value = unit;


            option.textContent = unit;


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// TARIKH
// =====================================================

function pasangEventTarikh() {


    const tarikh =

        document.getElementById(

            "tarikh"

        );


    if (!tarikh)

        return;


    tarikh.addEventListener(

        "change",

        function () {


            if (!this.value) {

                kosongkanTarikh();

                return;

            }


            const date =

                new Date(

                    this.value +

                    "T00:00:00"

                );


            const bulan = [

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


            const hari = [

                "Ahad",

                "Isnin",

                "Selasa",

                "Rabu",

                "Khamis",

                "Jumaat",

                "Sabtu"

            ];


            document.getElementById(

                "bulan"

            ).value =

                bulan[

                    date.getMonth()

                ];


            document.getElementById(

                "tahun"

            ).value =

                date.getFullYear();


            document.getElementById(

                "hari"

            ).value =

                hari[

                    date.getDay()

                ];

        }

    );

}


function kosongkanTarikh() {


    document.getElementById(

        "bulan"

    ).value = "";


    document.getElementById(

        "tahun"

    ).value = "";


    document.getElementById(

        "hari"

    ).value = "";

}


// =====================================================
// UNIT
// =====================================================

function pasangEventUnit() {


    const select =

        document.getElementById(

            "unitPilihan"

        );


    if (!select)

        return;


    select.addEventListener(

        "change",

        function () {


            const unit = this.value;


            kosongkanPos();


            kosongkanAnggota();


            kosongkanMaklumatAnggota();


            kosongkanKodDuty();


            kosongkanKodTempatKerja();


            if (!unit)

                return;


            const posList = [

                ...new Set(

                    semuaAnggota

                        .filter(

                            a =>

                                a.unit === unit

                        )

                        .map(

                            a => a.pos

                        )

                        .filter(Boolean)

                )

            ].sort();


            const posSelect =

                document.getElementById(

                    "posAsal"

                );


            posList.forEach(

                function (pos) {


                    const option =

                        document.createElement(

                            "option"

                        );


                    option.value = pos;


                    option.textContent = pos;


                    posSelect.appendChild(

                        option

                    );

                }

            );


            isiKodDutyIkutUnit(unit);


            isiKodTempatKerjaIkutUnit(unit);

        }

    );

}


// =====================================================
// POS
// =====================================================

function pasangEventPos() {


    const posSelect =

        document.getElementById(

            "posAsal"

        );


    if (!posSelect)

        return;


    posSelect.addEventListener(

        "change",

        function () {


            const unit =

                document.getElementById(

                    "unitPilihan"

                ).value;


            const pos = this.value;


            kosongkanAnggota();


            kosongkanMaklumatAnggota();


            if (!unit || !pos)

                return;


            const list =

                semuaAnggota

                    .filter(

                        a =>

                            a.unit === unit &&

                            a.pos === pos

                    )

                    .sort(

                        (a, b) =>

                            (

                                a.nama || ""

                            ).localeCompare(

                                b.nama || ""

                            )

                    );


            const anggotaSelect =

                document.getElementById(

                    "anggota"

                );


            list.forEach(

                function (anggota) {


                    const option =

                        document.createElement(

                            "option"

                        );


                    option.value =

                        anggota.no_skb;


                    option.textContent =

                        anggota.nama;


                    option.dataset.data =

                        JSON.stringify(

                            anggota

                        );


                    anggotaSelect.appendChild(

                        option

                    );

                }

            );

        }

    );

}


// =====================================================
// ANGGOTA
// =====================================================

function pasangEventAnggota() {


    const select =

        document.getElementById(

            "anggota"

        );


    if (!select)

        return;


    select.addEventListener(

        "change",

        function () {


            const option =

                this.options[

                    this.selectedIndex

                ];


            if (

                !option ||

                !option.dataset.data

            ) {

                kosongkanMaklumatAnggota();

                return;

            }


            const anggota =

                JSON.parse(

                    option.dataset.data

                );


            isiMaklumatAnggota(

                anggota

            );

        }

    );

}


// =====================================================
// ISI MAKLUMAT ANGGOTA
// =====================================================

function isiMaklumatAnggota(

    anggota

) {


    document.getElementById(

        "noSkb"

    ).value =

        anggota.no_skb || "";


    document.getElementById(

        "noAnggota"

    ).value =

        anggota.no_anggota || "";


    document.getElementById(

        "kawasan"

    ).value =

        anggota.kawasan || "";


    document.getElementById(

        "unit"

    ).value =

        anggota.unit || "";


    document.getElementById(

        "ketuaUnit"

    ).value =

        anggota.ketua_unit || "";


    document.getElementById(

        "ketuaPos"

    ).value =

        anggota.ketua_pos || "";


    document.getElementById(

        "namaKetuaPos"

    ).value =

        anggota.nama_ketua_pos || "";


    document.getElementById(

        "namaPosAsal"

    ).value =

        anggota.pos || "";

}


// =====================================================
// MUAT ANGGOTA
// =====================================================

async function muatAnggota() {


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "Data_Anggota"

        )

        .select(

            `

            no_skb,

            no_anggota,

            nama,

            kawasan,

            unit,

            pos,

            ketua_unit,

            ketua_pos,

            nama_ketua_pos,

            status

            `

        )

        .order(

            "nama",

            {

                ascending: true

            }

        );


    if (error) {

        paparPopup(

            error.message,

            "error",

            "Gagal Ambil Anggota"

        );

        return;

    }


    semuaAnggota = data || [];

}


// =====================================================
// SENARAI KETUA UNIT
// =====================================================

function isiSenaraiKetuaUnit() {


    const select =

        document.getElementById(

            "filterKetuaUnit"

        );


    if (!select)

        return;


    const list = [

        ...new Set(

            semuaAnggota

                .map(

                    a => a.ketua_unit

                )

                .filter(Boolean)

        )

    ].sort();


    list.forEach(

        function (ketua) {


            const option =

                document.createElement(

                    "option"

                );


            option.value = ketua;


            option.textContent = ketua;


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// MUAT KOD DUTY
// =====================================================

async function muatKodDuty() {


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "kod_duty"

        )

        .select(

            `

            unit,

            kod,

            waktu_tugasan,

            jam_kerja,

            jam_klm,

            status

            `

        )

        .eq(

            "status",

            "Aktif"

        )

        .order(

            "kod"

        );


    if (error) {

        paparPopup(

            error.message,

            "error",

            "Gagal Ambil Kod Duty"

        );

        return;

    }


    semuaKodDuty = data || [];

}


// =====================================================
// KOD DUTY
// =====================================================

function isiKodDutyIkutUnit(

    unit

) {


    const select =

        document.getElementById(

            "kodDuty"

        );


    const list =

        semuaKodDuty.filter(

            item =>

                item.unit === unit

        );


    list.forEach(

        function (item) {


            const option =

                document.createElement(

                    "option"

                );


            option.value = item.kod;


            option.textContent =

                item.kod +

                " - " +

                item.waktu_tugasan;


            option.dataset.data =

                JSON.stringify(

                    item

                );


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// EVENT KOD DUTY
// =====================================================

function pasangEventKodDuty() {


    const select =

        document.getElementById(

            "kodDuty"

        );


    if (!select)

        return;


    select.addEventListener(

        "change",

        function () {


            const option =

                this.options[

                    this.selectedIndex

                ];


            if (

                !option ||

                !option.dataset.data

            )

                return;


            const data =

                JSON.parse(

                    option.dataset.data

                );


            document.getElementById(

                "waktuTugasan"

            ).value =

                data.waktu_tugasan || "";


            document.getElementById(

                "jamKerja"

            ).value =

                data.jam_kerja || 0;


            document.getElementById(

                "jamKlm"

            ).value =

                data.jam_klm || 0;

        }

    );

}


// =====================================================
// MUAT KOD TEMPAT KERJA
// =====================================================

async function muatKodTempatKerja() {


    const {

        data,

        error

    } = await supabaseClient

        .from(

            "kod_tempat_kerja"

        )

        .select(

            `

            kod_tempat_kerja,

            nama_tempat_kerja,

            unit,

            status

            `

        )

        .eq(

            "status",

            "Aktif"

        )

        .order(

            "kod_tempat_kerja"

        );


    if (error) {

        paparPopup(

            error.message,

            "error",

            "Gagal Ambil Tempat Kerja"

        );

        return;

    }


    semuaKodTempatKerja = data || [];

}


// =====================================================
// TEMPAT KERJA
// =====================================================

function isiKodTempatKerjaIkutUnit(

    unit

) {


    const select =

        document.getElementById(

            "kodTempatKerja"

        );


    const list =

        semuaKodTempatKerja.filter(

            item =>

                item.unit === unit

        );


    list.forEach(

        function (item) {


            const option =

                document.createElement(

                    "option"

                );


            option.value =

                item.kod_tempat_kerja;


            option.textContent =

                item.kod_tempat_kerja +

                " - " +

                item.nama_tempat_kerja;


            option.dataset.data =

                JSON.stringify(

                    item

                );


            select.appendChild(

                option

            );

        }

    );

}


// =====================================================
// EVENT TEMPAT KERJA
// =====================================================

function pasangEventKodTempatKerja() {


    const select =

        document.getElementById(

            "kodTempatKerja"

        );


    if (!select)

        return;


    select.addEventListener(

        "change",

        function () {


            const option =

                this.options[

                    this.selectedIndex

                ];


            if (

                !option ||

                !option.dataset.data

            )

                return;


            const data =

                JSON.parse(

                    option.dataset.data

                );


            document.getElementById(

                "tempatKerja"

            ).value =

                data.nama_tempat_kerja || "";

        }

    );

}


// =====================================================
// SIMPAN DUTY
// =====================================================

async function simpanDuty() {


    const anggota =

        semuaAnggota.find(

            a =>

                String(a.no_skb) ===

                String(

                    document.getElementById(

                        "noSkb"

                    ).value

                )

        );


    const kodDuty =

        semuaKodDuty.find(

            item =>

                item.unit ===

                document.getElementById(

                    "unitPilihan"

                ).value &&

                item.kod ===

                document.getElementById(

                    "kodDuty"

                ).value

        );


    const tempatKerja =

        semuaKodTempatKerja.find(

            item =>

                item.kod_tempat_kerja ===

                document.getElementById(

                    "kodTempatKerja"

                ).value

        );


    if (

        !document.getElementById(

            "tarikh"

        ).value

    ) {

        paparPopup(

            "Sila pilih tarikh duty.",

            "warning",

            "Tarikh Diperlukan"

        );

        return;

    }


    if (!anggota) {

        paparPopup(

            "Sila pilih nama anggota.",

            "warning",

            "Anggota Diperlukan"

        );

        return;

    }


    if (!kodDuty) {

        paparPopup(

            "Sila pilih Kod Duty.",

            "warning",

            "Kod Duty Diperlukan"

        );

        return;

    }


    if (!tempatKerja) {

        paparPopup(

            "Sila pilih tempat kerja.",

            "warning",

            "Tempat Kerja Diperlukan"

        );

        return;

    }


    const sekarang =

        new Date().toISOString();


    const dataDuty = {


        tarikh:

            document.getElementById(

                "tarikh"

            ).value,


        bulan:

            document.getElementById(

                "bulan"

            ).value,


        tahun:

            Number(

                document.getElementById(

                    "tahun"

                ).value

            ),


        no_skb:

            anggota.no_skb,


        no_anggota:

            anggota.no_anggota,


        nama_anggota:

            anggota.nama,


        kawasan:

            anggota.kawasan,


        unit:

            anggota.unit,


        ketua_unit:

            anggota.ketua_unit,


        ketua_pos:

            anggota.ketua_pos,


        nama_ketua_pos:

            anggota.nama_ketua_pos,


        nama_pos_asal:

            anggota.pos,


        pos:

            anggota.pos,


        hari:

            document.getElementById(

                "hari"

            ).value,


        kod_dutyy:

            kodDuty.kod,


        kod_waktu_kerja:

            kodDuty.kod,


        waktu_tugasan:

            kodDuty.waktu_tugasan,


        jam_kerja:

            Number(

                kodDuty.jam_kerja || 0

            ),


        jam_klm:

            Number(

                kodDuty.jam_klm || 0

            ),


        kod_tempat_kerja:

            tempatKerja.kod_tempat_kerja,


        tempat_kerja:

            tempatKerja.nama_tempat_kerja,


        dikemaskini_oleh:

            "Ketua Unit",


        dikemaskini_pada:

            sekarang,


        hari_offday_bertugas:

            document.getElementById(

                "hariOffday"

            ).checked

                ? 1

                : 0,


        jam_offday_bertugas:

            Number(

                document.getElementById(

                    "jamOffday"

                ).value || 0

            ),


        hari_cutiam_bertugas:

            document.getElementById(

                "hariCutiam"

            ).checked

                ? 1

                : 0,


        jam_cutiam_bertugas:

            Number(

                document.getElementById(

                    "jamCutiam"

                ).value || 0

            )

    };


    const {

        error

    } = await supabaseClient

        .from(

            "jadual_duty"

        )

        .insert(

            [dataDuty]

        );


    if (error) {

        paparPopup(

            error.message,

            "error",

            "Gagal Simpan"

        );

        return;

    }


    paparPopup(

        "Rekod Duty berjaya disimpan ke dalam database.",

        "success",

        "Berjaya Disimpan"

    );


    // KEKALKAN BORANG

    // TIDAK kosongkanBorang()


    paparDuty();

}


// =====================================================
// PAPAR DUTY
// =====================================================

async function paparDuty() {


    const tbody =

        document.getElementById(

            "senaraiDuty"

        );


    const ketuaUnit =

        document.getElementById(

            "filterKetuaUnit"

        ).value;


    const bulanTahun =

        document.getElementById(

            "filterBulan"

        ).value;


    const cariNama =

        document.getElementById(

            "cariNama"

        ).value

        .toLowerCase();


    if (

        !ketuaUnit ||

        !bulanTahun

    ) {


        tbody.innerHTML = `

            <tr>

                <td colspan="24">

                    Sila pilih Ketua Unit dan Bulan/Tahun

                </td>

            </tr>

        `;


        return;

    }


    const [

        tahun,

        bulan

    ] = bulanTahun.split("-");


    let query =

        supabaseClient

            .from(

                "jadual_duty"

            )

            .select(

                "*"

            )

            .eq(

                "ketua_unit",

                ketuaUnit

            )

            .eq(

                "tahun",

                Number(tahun)

            )

            .eq(

                "bulan",

                namaBulan(

                    Number(bulan)

                )

            )

            .order(

                "tarikh",

                {

                    ascending: true

                }

            );


    const {

        data,

        error

    } = await query;


    if (error) {

        paparPopup(

            error.message,

            "error",

            "Gagal Ambil Duty"

        );

        return;

    }


    semuaDuty = data || [];


    let filtered = semuaDuty;


    if (cariNama) {

        filtered =

            filtered.filter(

                item =>

                    (

                        item.nama_anggota ||

                        ""

                    )

                    .toLowerCase()

                    .includes(

                        cariNama

                    )

            );

    }


    if (!filtered.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="24">

                    Tiada rekod duty ditemui

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =

        filtered.map(

            function (item) {


                return `

                <tr>

                    <td>

                        ${formatTarikh(

                            item.tarikh

                        )}

                    </td>


                    <td>

                        ${item.bulan || ""}

                    </td>


                    <td>

                        ${item.tahun || ""}

                    </td>


                    <td>

                        ${item.hari || ""}

                    </td>


                    <td>

                        ${item.no_skb || ""}

                    </td>


                    <td>

                        ${item.no_anggota || ""}

                    </td>


                    <td>

                        <strong>

                            ${item.nama_anggota || ""}

                        </strong>

                    </td>


                    <td>

                        ${item.kawasan || ""}

                    </td>


                    <td>

                        <span class="badge">

                            ${item.unit || ""}

                        </span>

                    </td>


                    <td>

                        ${item.ketua_unit || ""}

                    </td>


                    <td>

                        ${item.ketua_pos || ""}

                    </td>


                    <td>

                        ${item.nama_ketua_pos || ""}

                    </td>


                    <td>

                        ${item.pos || ""}

                    </td>


                    <td>

                        ${item.kod_dutyy || ""}

                    </td>


                    <td>

                        ${item.waktu_tugasan || ""}

                    </td>


                    <td>

                        ${item.jam_kerja || 0}

                    </td>


                    <td>

                        ${item.kod_tempat_kerja || ""}

                    </td>


                    <td>

                        ${item.tempat_kerja || ""}

                    </td>


                    <td>

                        ${item.jam_klm || 0}

                    </td>


                    <td>

                        ${item.hari_offday_bertugas == 1

                            ? "Ya"

                            : "Tidak"}

                    </td>


                    <td>

                        ${item.jam_offday_bertugas || 0}

                    </td>


                    <td>

                        ${item.hari_cutiam_bertugas == 1

                            ? "Ya"

                            : "Tidak"}

                    </td>


                    <td>

                        ${item.jam_cutiam_bertugas || 0}

                    </td>


                    <td>

                        <button

                            class="btn-danger"

                            onclick="padamDuty('${

                                item.id

                            }')"

                        >

                            🗑️ Padam

                        </button>

                    </td>

                </tr>

                `;

            }

        )

        .join("");

}


// =====================================================
// PADAM DUTY
// =====================================================

async function padamDuty(

    id

) {


    paparPopup(

        "Adakah anda pasti mahu memadam rekod Duty ini? Tekan OK sekali lagi untuk teruskan.",

        "warning",

        "Pengesahan Padam"

    );


    const teruskan =

        confirm(

            "Adakah anda pasti mahu memadam rekod Duty ini?"

        );


    if (!teruskan)

        return;


    const {

        error

    } = await supabaseClient

        .from(

            "jadual_duty"

        )

        .delete()

        .eq(

            "id",

            id

        );


    if (error) {

        paparPopup(

            error.message,

            "error",

            "Gagal Padam"

        );

        return;

    }


    paparPopup(

        "Rekod Duty berjaya dipadam.",

        "success",

        "Berjaya Dipadam"

    );


    paparDuty();

}


// =====================================================
// KOSONGKAN
// =====================================================

function kosongkanPos() {


    document.getElementById(

        "posAsal"

    ).innerHTML = `

        <option value="">

            -- Pilih Pos Asal --

        </option>

    `;

}


function kosongkanAnggota() {


    document.getElementById(

        "anggota"

    ).innerHTML = `

        <option value="">

            -- Pilih Nama Anggota --

        </option>

    `;

}


function kosongkanMaklumatAnggota() {


    [

        "noSkb",

        "noAnggota",

        "kawasan",

        "unit",

        "ketuaUnit",

        "ketuaPos",

        "namaKetuaPos",

        "namaPosAsal"

    ]

    .forEach(

        function (id) {


            const element =

                document.getElementById(

                    id

                );


            if (element)

                element.value = "";

        }

    );

}


function kosongkanKodDuty() {


    const select =

        document.getElementById(

            "kodDuty"

        );


    select.innerHTML = `

        <option value="">

            -- Pilih Kod Duty --

        </option>

    `;


    document.getElementById(

        "waktuTugasan"

    ).value = "";


    document.getElementById(

        "jamKerja"

    ).value = "";


    document.getElementById(

        "jamKlm"

    ).value = "";

}


function kosongkanKodTempatKerja() {


    document.getElementById(

        "kodTempatKerja"

    ).innerHTML = `

        <option value="">

            -- Pilih Kod Tempat Kerja --

        </option>

    `;


    document.getElementById(

        "tempatKerja"

    ).value = "";

}


// =====================================================
// BULAN
// =====================================================

function namaBulan(

    nombor

) {


    const bulan = [

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


    return bulan[

        nombor - 1

    ];

}


// =====================================================
// FORMAT TARIKH
// =====================================================

function formatTarikh(

    tarikh

) {


    if (!tarikh)

        return "";


    const parts =

        tarikh.split("-");


    if (

        parts.length !== 3

    )

        return tarikh;


    return (

        parts[2] +

        "/" +

        parts[1] +

        "/" +

        parts[0]

    );

}
