/* =====================================================
   LAPORAN POS TAMPUNGAN
   FPB DUTY SYSTEM
===================================================== */


/* =====================================================
   PAPAR LAPORAN
===================================================== */


async function paparLaporanTampungan(){


    let bulan =
    document.getElementById("filterBulan").value;


    let tahun =
    document.getElementById("filterTahun").value;



    if(!bulan || !tahun){


        document.getElementById(
            "senaraiTampungan"
        ).innerHTML = `

        <tr>
            <td colspan="8">
            Sila pilih bulan dan tahun
            </td>
        </tr>

        `;


        return;

    }




    console.log(
        "FILTER:",
        bulan,
        tahun
    );





let { data, error } = await supabaseClient

.from("jadual_duty")

.select(`

    pos_tampungan,
    no_skb,
    nama_anggota,
    nama_pos_asal,
    jam_tampungan,
    rm_tampung,

    Data_Anggota(
        gaji_pokok
    )

`)

.eq("bulan", bulan)

.eq("tahun", tahun)

.neq(
    "pos_tampungan",
    ""
);





    if(error){


        console.error(
            "ERROR:",
            error
        );


        alert(
            error.message
        );


        return;


    }





    console.log(
        "DATA:",
        data
    );





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
    document.getElementById(
        "filterBulan"
    );



    let tahun =
    document.getElementById(
        "filterTahun"
    );





    if(bulan){



        let senaraiBulan=[


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




        senaraiBulan.forEach(nama=>{


            bulan.innerHTML +=`


            <option value="${nama}">
            ${nama}
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
            let i=tahunSekarang-2;
            i<=tahunSekarang+1;
            i++
        ){



            tahun.innerHTML +=`


            <option value="${i}">
            ${i}
            </option>


            `;


        }



    }



}







/* =====================================================
   LOAD AWAL
===================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


    isiBulanTahun();



});







/* =====================================================
   BUTTON FILTER
===================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


    let bulan =
    document.getElementById(
        "filterBulan"
    );


    let tahun =
    document.getElementById(
        "filterTahun"
    );




    if(bulan){


        bulan.addEventListener(
            "change",
            paparLaporanTampungan
        );


    }





    if(tahun){


        tahun.addEventListener(
            "change",
            paparLaporanTampungan
        );


    }




});
