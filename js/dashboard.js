



// =====================================================
// DASHBOARD FPB DUTY SYSTEM
// =====================================================
let dataDutyHariIni = [];
document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "DASHBOARD JS BERJAYA DIMUAT"
        );

        await muatDashboard();

    }
);

// =====================================================
// MUAT DASHBOARD
// =====================================================

async function muatDashboard() {

    await jumlahAnggotaAktif();

    await statistikDutyHariIni();

    await statusTidakBertugasHariIni();

}

// =====================================================
// JUMLAH ANGGOTA AKTIF
// =====================================================

async function jumlahAnggotaAktif() {

    const {
        count,
        error
    } =
    await supabaseClient
        .from("Data_Anggota")
        .select("*", {
            count: "exact",
            head: true
        })
        .eq(
            "status",
            "Aktif"
        );

    if (error) {

        console.error(
            error
        );

        return;

    }

    document
        .getElementById(
            "jumlahAnggota"
        )
        .textContent =
        count || 0;

}

// =====================================================
// STATISTIK DUTY HARI INI
// =====================================================

async function statistikDutyHariIni() {

    const hariIni =
        new Date()
            .toISOString()
            .split("T")[0];

    const {
        data,
        error
    } =
    await supabaseClient
        .from("jadual_duty")
        .select(`
            jam_kerja,
            jam_klm,
            rm_klm_seluruh
        `)
        .eq(
            "tarikh",
            hariIni
        );

    if (error) {

        console.error(
            error
        );

        return;

    }

    const jumlahDuty =
        data.length;

    const jumlahJamKerja =
        data.reduce(
            (
                total,
                row
            ) =>
                total +
                Number(
                    row.jam_kerja || 0
                ),
            0
        );

    const jumlahJamKlm =
        data.reduce(
            (
                total,
                row
            ) =>
                total +
                Number(
                    row.jam_klm || 0
                ),
            0
        );

    const jumlahRmKlm =
        data.reduce(
            (
                total,
                row
            ) =>
                total +
                Number(
                    row.rm_klm_seluruh || 0
                ),
            0
        );

    document.getElementById(
        "jumlahDutyHariIni"
    ).textContent =
        jumlahDuty;

    document.getElementById(
        "jumlahJamKerja"
    ).textContent =
        jumlahJamKerja;

    document.getElementById(
        "jumlahJamKlm"
    ).textContent =
        jumlahJamKlm;

    document.getElementById(
        "jumlahRmKlm"
    ).textContent =
        "RM " +
        jumlahRmKlm.toFixed(2);

}

// =====================================================
// STATUS TIDAK BERTUGAS HARI INI
// =====================================================

async function statusTidakBertugasHariIni() {

    const hariIni =
        new Date()
            .toISOString()
            .split("T")[0];

    const {
        data,
        error
    } =
    await supabaseClient
        .from("jadual_duty")
        .select(`
            nama_anggota,
            kod_waktu_kerja
        `)
        .eq(
            "tarikh",
            hariIni
        );

    if (error) {

        console.error(
            error
        );

        return;

    }
    dataDutyHariIni = data || [];
    const OFF =
        data.filter(
            x =>
                x.kod_waktu_kerja ===
                    "OFF" ||
                x.kod_waktu_kerja ===
                    "GOFF"
        ).length;

    const CT =
        data.filter(
            x =>
                x.kod_waktu_kerja ===
                "CT"
        ).length;

    const MC =
        data.filter(
            x =>
                x.kod_waktu_kerja ===
                "MC"
        ).length;

    const KUR =
        data.filter(
            x =>
                x.kod_waktu_kerja ===
                "KUR"
        ).length;

    const CA =
        data.filter(
            x =>
                x.kod_waktu_kerja ===
                "CA"
        ).length;

    const CG =
        data.filter(
            x =>
                x.kod_waktu_kerja ===
                "CG"
        ).length;

    const CE =
        data.filter(
            x =>
                x.kod_waktu_kerja ===
                "CE"
        ).length;

    const CTR =
        data.filter(
            x =>
                x.kod_waktu_kerja ===
                "CTR"
        ).length;

    document.getElementById(
        "jumlahOffday"
    ).textContent =
        OFF;

    document.getElementById(
        "jumlahCT"
    ).textContent =
        CT;

    document.getElementById(
        "jumlahMC"
    ).textContent =
        MC;

    document.getElementById(
        "jumlahKUR"
    ).textContent =
        KUR;

    document.getElementById(
        "jumlahCA"
    ).textContent =
        CA;

    document.getElementById(
        "jumlahCG"
    ).textContent =
        CG;

    document.getElementById(
        "jumlahCE"
    ).textContent =
        CE;

    document.getElementById(
        "jumlahCTR"
    ).textContent =
        CTR;

    const jumlahTidakBertugas =
    OFF +
    CT +
    MC +
    KUR +
    CA +
    CG +
    CE +
    CTR;

document.getElementById(
    "jumlahTidakBertugas"
).textContent =
    jumlahTidakBertugas;

const jumlahBertugasHariIni =
    dataDutyHariIni.length;

document.getElementById(
    "jumlahDutyHariIni"
).textContent =
    Math.max(
        0,
        jumlahBertugasHariIni -
        jumlahTidakBertugas
    );

}
function paparSenarai(kategori) {

    const tajukKategori = {

        OFFDAY:
            "Senarai Anggota Offday / Ganti Offday",

        CT:
            "Senarai Anggota Cuti Tahunan",

        MC:
            "Senarai Anggota Cuti Sakit",

        KUR:
            "Senarai Anggota Menghadiri Kursus",

        CA:
            "Senarai Anggota Cuti Am",

        CG:
            "Senarai Anggota Cuti Ganti",

        CE:
            "Senarai Anggota Cuti Ehsan",

        CTR:
            "Senarai Anggota Cuti Tanpa Rekod"

    };

    let senarai = [];

    switch (kategori) {

        case "OFFDAY":

            senarai =
                dataDutyHariIni.filter(
                    x =>
                        x.kod_waktu_kerja === "OFF" ||
                        x.kod_waktu_kerja === "GOFF"
                );

            break;

        case "CT":

            senarai =
                dataDutyHariIni.filter(
                    x =>
                        x.kod_waktu_kerja === "CT"
                );

            break;

        case "MC":

            senarai =
                dataDutyHariIni.filter(
                    x =>
                        x.kod_waktu_kerja === "MC"
                );

            break;

        case "KUR":

            senarai =
                dataDutyHariIni.filter(
                    x =>
                        x.kod_waktu_kerja === "KUR"
                );

            break;

        case "CA":

            senarai =
                dataDutyHariIni.filter(
                    x =>
                        x.kod_waktu_kerja === "CA"
                );

            break;

        case "CG":

            senarai =
                dataDutyHariIni.filter(
                    x =>
                        x.kod_waktu_kerja === "CG"
                );

            break;

        case "CE":

            senarai =
                dataDutyHariIni.filter(
                    x =>
                        x.kod_waktu_kerja === "CE"
                );

            break;

        case "CTR":

            senarai =
                dataDutyHariIni.filter(
                    x =>
                        x.kod_waktu_kerja === "CTR"
                );

            break;

    }

    const namaList =
        senarai.length > 0

            ? senarai.map(
                (x, index) =>

                `
                <li>
                    ${index + 1}. ${x.nama_anggota}
                </li>
                `
            ).join("")

            :

            `
            <li>
                Tiada rekod dijumpai
            </li>
            `;

    const popup =
        document.createElement("div");

    popup.innerHTML = `

        <div
            data-popup
            onclick="this.remove()"
            style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.50);
                display:flex;
                justify-content:center;
                align-items:center;
                z-index:99999;
            "
        >

            <div
                onclick="event.stopPropagation()"
                style="
                    background:#ffffff;
                    width:600px;
                    max-width:95%;
                    border-radius:16px;
                    padding:25px;
                    box-shadow:
                        0 10px 30px
                        rgba(0,0,0,.20);
                "
            >

                <h3
                    style="
                        color:#1e3a5f;
                        margin-bottom:10px;
                        font-size:20px;
                    "
                >
                    ${tajukKategori[kategori]}
                </h3>

                <hr
                    style="
                        margin-bottom:15px;
                    "
                >

                <div
                    style="
                        max-height:300px;
                        overflow-y:auto;
                        border:1px solid #e5e7eb;
                        border-radius:8px;
                        padding:12px;
                        background:#fafafa;
                    "
                >

                    <ol
                        style="
                            margin-left:20px;
                            line-height:1.8;
                        "
                    >
                        ${namaList}
                    </ol>

                </div>

                <div
                    style="
                        margin-top:15px;
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    "
                >

                    <strong
                        style="
                            color:#1e3a5f;
                        "
                    >
                        Jumlah :
                        ${senarai.length}
                        Anggota
                    </strong>

                    <button
                        onclick="
                            this.closest('[data-popup]').remove()
                        "
                        style="
                            background:#dc2626;
                            color:white;
                            border:none;
                            padding:10px 18px;
                            border-radius:8px;
                            cursor:pointer;
                            font-weight:600;
                        "
                    >
                        Tutup
                    </button>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(
        popup
    );

}
// =====================================================
// LOGOUT
// =====================================================

async function logout() {

    const result =
        await supabaseClient
            .auth
            .signOut();

    if (result.error) {

        console.error(
            result.error
        );

        return;

    }

    window.location.href =
        "login.html";

}
