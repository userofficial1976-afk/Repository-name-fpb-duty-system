alert("laporan-tampungan.js berjaya load");

/* ==========================================
   ISI DROPDOWN BULAN & TAHUN
========================================== */

function isiBulanTahun(){

    const bulanDropdown =
    document.getElementById(
        "filterBulan"
    );

    const tahunDropdown =
    document.getElementById(
        "filterTahun"
    );

    if(!bulanDropdown || !tahunDropdown){
        console.log(
            "Dropdown Bulan/Tahun tidak dijumpai"
        );
        return;
    }

    const senaraiBulan = [

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

    senaraiBulan.forEach(bulan => {

        bulanDropdown.innerHTML += `

            <option value="${bulan}">
                ${bulan}
            </option>

        `;

    });

    const tahunSemasa =
    new Date().getFullYear();

    for(
        let tahun=tahunSemasa-2;
        tahun<=tahunSemasa+2;
        tahun++
    ){

        tahunDropdown.innerHTML += `

            <option value="${tahun}">
                ${tahun}
            </option>

        `;

    }

    console.log(
        "Dropdown berjaya diisi"
    );

}


/* ==========================================
   PAPAR LAPORAN POS TAMPUNGAN
========================================== */

async function paparLaporanTampungan(){

    const bulan =
    document.getElementById(
        "filterBulan"
    ).value;

    const tahun =
    document.getElementById(
        "filterTahun"
    ).value;

    if(!bulan || !tahun){

        document.getElementById(
            "senaraiTampungan"
        ).innerHTML = `

            <tr>
                <td colspan="8">
                    Sila pilih Bulan dan Tahun
                </td>
            </tr>

        `;

        return;
    }

    console.log(
        "Filter:",
        bulan,
        tahun
    );

    const {
        data,
        error
    } = await supabaseClient

        .from("jadual_duty")

        .select(`
            pos_tampungan,
            no_skb,
            nama_anggota,
            nama_pos_asal,
            jam_tampungan,
            rm_tampung
        `)

        .eq("bulan", bulan)

        .eq("tahun", tahun)

        .not(
            "pos_tampungan",
            "is",
            null
        )

        .neq(
            "pos_tampungan",
            ""
        )

        .order(
            "pos_tampungan",
            {
                ascending:true
            }
        );

    if(error){

        console.error(error);

        document.getElementById(
            "senaraiTampungan"
        ).innerHTML = `

            <tr>
                <td colspan="8">
                    ${error.message}
                </td>
            </tr>

        `;

        return;
    }

    if(!data || data.length===0){

        document.getElementById(
            "senaraiTampungan"
        ).innerHTML = `

            <tr>
                <td colspan="8">
                    Tiada Rekod Pos Tampungan
                </td>
            </tr>

        `;

        document.getElementById(
            "jumlahJam"
        ).textContent = "0";

        document.getElementById(
            "jumlahRm"
        ).textContent = "RM 0.00";

        return;
    }

    const noSkbList = [

        ...new Set(

            data
            .map(x => x.no_skb)
            .filter(Boolean)

        )

    ];

    const {
        data: anggotaData,
        error: anggotaError
    } = await supabaseClient

        .from("Data_Anggota")

        .select(`
            no_skb,
            gaji_pokok
        `)

        .in(
            "no_skb",
            noSkbList
        );

    if(anggotaError){

        console.error(
            anggotaError
        );

    }

    const anggotaMap =
    new Map();

    (anggotaData || [])
    .forEach(a => {

        anggotaMap.set(
            String(a.no_skb),
            a.gaji_pokok
        );

    });

    let html = "";

    let bil = 1;

    let jumlahJam = 0;

    let jumlahRm = 0;

    data.forEach(row => {

        const gaji =

        anggotaMap.get(
            String(row.no_skb)
        ) ?? 0;

        jumlahJam += Number(
            row.jam_tampungan || 0
        );

        jumlahRm += Number(
            row.rm_tampung || 0
        );

        html += `

            <tr>

                <td>${bil++}</td>

                <td>
                    ${row.pos_tampungan ?? "-"}
                </td>

                <td>
                    ${row.no_skb ?? "-"}
                </td>

                <td>
                    ${row.nama_anggota ?? "-"}
                </td>

                <td>
                    ${row.nama_pos_asal ?? "-"}
                </td>

                <td>
                    RM ${Number(gaji)
                        .toFixed(2)}
                </td>

                <td>
                    ${row.jam_tampungan ?? 0}
                </td>

                <td>
                    RM ${Number(
                        row.rm_tampung ?? 0
                    ).toFixed(2)}
                </td>

            </tr>

        `;

    });

    document.getElementById(
        "senaraiTampungan"
    ).innerHTML = html;

    document.getElementById(
        "jumlahJam"
    ).textContent =
    jumlahJam;

    document.getElementById(
        "jumlahRm"
    ).textContent =
    "RM " +
    jumlahRm.toFixed(2);

}


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "DOMContentLoaded OK"
        );

        isiBulanTahun();

    }
);
