/* =====================================================
   LAPORAN POS TAMPUNGAN
   FPB DUTY SYSTEM
===================================================== */


async function paparLaporanTampungan(){


    let bulan =
    document.getElementById("filterBulan").value;


    let tahun =
    document.getElementById("filterTahun").value;



    if(!bulan || !tahun){


        document.getElementById("senaraiTampungan").innerHTML = `

        <tr>
            <td colspan="8">
                Sila pilih bulan dan tahun
            </td>
        </tr>

        `;


        return;

    }



    let { data, error } = await supabase


    .from("jadual_duty")


    .select(`

        pos_tampungan,

        no_skb,

        nama_anggota,

        nama_pos_asal,

        jam_tampungan,

        rm_tampung,

        Data_Anggota!no_skb
        (
            gaji_pokok
        )

    `)



    .eq(
        "bulan",
        Number(bulan)
    )


    .eq(
        "tahun",
        Number(tahun)
    )


    .not(
        "pos_tampungan",
        "is",
        null
    )



    .order(
        "pos_tampungan",
        {
            ascending:true
        }
    );




    if(error){


        console.error(error);


        alert(
            error.message
        );


        return;


    }





    let html="";


    let bil=1;



    if(!data || data.length===0){


        html=`

        <tr>

        <td colspan="8">
        Tiada rekod Pos Tampungan
        </td>

        </tr>

        `;


    }



    else {



        data.forEach(row=>{


            let gaji = 
            row.Data_Anggota?.gaji_pokok ?? 0;



            html += `

            <tr>


            <td>
            ${bil++}
            </td>


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
            RM ${Number(gaji).toFixed(2)}
            </td>


            <td>
            ${row.jam_tampungan ?? 0}
            </td>


            <td>
            RM ${Number(row.rm_tampung ?? 0).toFixed(2)}
            </td>


            </tr>

            `;


        });


    }





    document.getElementById(
        "senaraiTampungan"
    ).innerHTML = html;



}







/* =====================================================
   DROPDOWN BULAN & TAHUN
===================================================== */


function isiBulanTahun(){


    let bulan =
    document.getElementById("filterBulan");


    let tahun =
    document.getElementById("filterTahun");




    if(bulan){


        let bulanNama=[

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



        bulan.innerHTML=`

        <option value="">
        -- Pilih Bulan --
        </option>

        `;



        bulanNama.forEach((b,i)=>{


            bulan.innerHTML +=`

            <option value="${i+1}">
            ${b}
            </option>

            `;


        });



    }





    if(tahun){


        tahun.innerHTML=`

        <option value="">
        -- Pilih Tahun --
        </option>

        `;



        let tahunSekarang =
        new Date().getFullYear();



        for(
            let t=tahunSekarang-2;
            t<=tahunSekarang+1;
            t++
        ){


            tahun.innerHTML +=`

            <option value="${t}">
            ${t}
            </option>

            `;


        }


    }



}







document.addEventListener(
"DOMContentLoaded",
()=>{


    isiBulanTahun();


});
