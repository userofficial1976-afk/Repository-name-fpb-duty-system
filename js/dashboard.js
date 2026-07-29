// =====================================================
// DASHBOARD FPB DUTY SYSTEM
// =====================================================

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
        .select(
            "kod_waktu_kerja"
        )
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

    document.getElementById(
        "jumlahTidakBertugas"
    ).textContent =
        OFF +
        CT +
        MC +
        KUR +
        CA +
        CG +
        CE +
        CTR;

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
