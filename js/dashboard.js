// =====================================================
// DASHBOARD FPB DUTY SYSTEM
// =====================================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("DASHBOARD JS BERJAYA DIMUAT");

    await muatDashboard();

});


// =====================================================
// MUAT SEMUA DATA DASHBOARD
// =====================================================

async function muatDashboard() {

    await jumlahAnggotaAktif();

    await statistikDutyHariIni();

    await statistikJumlahJam();

    await dutyMengikutPos();

}


// =====================================================
// JUMLAH ANGGOTA AKTIF
// =====================================================

async function jumlahAnggotaAktif() {

    const { count, error } =
        await supabaseClient
            .from("Data_Anggota")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("status", "Aktif");


    if (error) {

        console.error(
            "RALAT JUMLAH ANGGOTA:",
            error
        );

        return;
    }


    document
        .getElementById("jumlahAnggota")
        .textContent =
        count || 0;

}


// =====================================================
// DUTY HARI INI
// =====================================================

async function statistikDutyHariIni() {

    const hariIni =
        new Date()
            .toISOString()
            .split("T")[0];


    const { data, error } =
        await supabaseClient
            .from("jadual_duty")
            .select("jam_kerja, jam_klm")
            .eq(
                "tarikh",
                hariIni
            );


    if (error) {

        console.error(
            "RALAT DUTY HARI INI:",
            error
        );

        return;
    }


    const jumlahDuty =
        data.length;


    const jumlahJamKerja =
        data.reduce(
            function (jumlah, row) {

                return jumlah
                    + Number(row.jam_kerja || 0);

            },
            0
        );


    const jumlahJamKlm =
        data.reduce(
            function (jumlah, row) {

                return jumlah
                    + Number(row.jam_klm || 0);

            },
            0
        );


    document
        .getElementById("jumlahDutyHariIni")
        .textContent =
        jumlahDuty;


    document
        .getElementById("jumlahJamKerja")
        .textContent =
        jumlahJamKerja;


    document
        .getElementById("jumlahJamKlm")
        .textContent =
        jumlahJamKlm;

}


// =====================================================
// JUMLAH JAM KESELURUHAN
// =====================================================

async function statistikJumlahJam() {

    const { data, error } =
        await supabaseClient
            .from("jadual_duty")
            .select("jam_kerja, jam_klm");


    if (error) {

        console.error(
            "RALAT JUMLAH JAM:",
            error
        );

        return;
    }


    const jumlahJamKerja =
        data.reduce(
            function (jumlah, row) {

                return jumlah
                    + Number(row.jam_kerja || 0);

            },
            0
        );


    const jumlahJamKlm =
        data.reduce(
            function (jumlah, row) {

                return jumlah
                    + Number(row.jam_klm || 0);

            },
            0
        );


    console.log(
        "Jumlah semua jam kerja:",
        jumlahJamKerja
    );


    console.log(
        "Jumlah semua jam KLM:",
        jumlahJamKlm
    );

}

// =====================================================
// LOGOUT
// =====================================================

async function logout() {


    const result = await supabaseClient.auth.signOut();


    if (result.error) {


        console.error(

            "RALAT LOGOUT:",

            result.error

        );


        return;

    }


    window.location.href =

        "login.html";

}
// =====================================================
// DUTY MENGIKUT POS
// =====================================================

async function dutyMengikutPos() {

    const { data, error } =
        await supabaseClient
            .from("jadual_duty")
            .select("pos");


    if (error) {

        console.error(
            "RALAT DUTY MENGIKUT POS:",
            error
        );

        return;
    }


    const kiraanPos = {};


    data.forEach(function (row) {

        const pos =
            row.pos || "Tidak Diketahui";


        if (!kiraanPos[pos]) {

            kiraanPos[pos] = 0;

        }


        kiraanPos[pos]++;

    });


    const tbody =
        document
            .getElementById("senaraiPos");


    tbody.innerHTML = "";


    const semuaPos =
        Object.keys(kiraanPos)
            .sort();


    if (semuaPos.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="2">
                    Tiada data duty
                </td>
            </tr>
        `;

        return;
    }


    semuaPos.forEach(function (pos) {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${pos}
            </td>

            <td>
                <strong>
                    ${kiraanPos[pos]}
                </strong>
            </td>

        `;


        tbody.appendChild(tr);

    });

}
