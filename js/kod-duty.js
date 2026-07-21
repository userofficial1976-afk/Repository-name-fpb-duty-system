// =====================================================
// KOD-DUTY.JS
// FPB DUTY SYSTEM
// =====================================================

// =====================================================
// APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(

```
"DOMContentLoaded",

function() {

    muatKodDuty();

}
```

);

// =====================================================
// MUAT KOD DUTY
// =====================================================

async function muatKodDuty() {

```
const result =

    await supabaseClient

    .from("kod_duty")

    .select(

        "kod,waktu_tugasan,jam_kerja,jam_klm,status"

    )

    .order(

        "kod",

        {

            ascending: true

        }

    );


if (result.error) {


    console.error(

        "RALAT KOD DUTY:",

        result.error

    );


    document

    .getElementById(

        "senaraiKodDuty"

    )

    .innerHTML = `

        <tr>

            <td colspan="5">

                Gagal memuatkan data kod duty.

            </td>

        </tr>

    `;


    return;

}


const data =

    result.data || [];


const tbody =

    document

    .getElementById(

        "senaraiKodDuty"

    );


tbody.innerHTML = "";


if (

    data.length === 0

) {


    tbody.innerHTML = `

        <tr>

            <td colspan="5">

                Tiada data kod duty.

            </td>

        </tr>

    `;


    return;

}


data.forEach(

    function(duty) {


        const tr =

            document.createElement(

                "tr"

            );


        let statusHTML = "";


        if (

            duty.status === "Aktif"

        ) {


            statusHTML = `

                <span

                    class="status-aktif"

                >

                    Aktif

                </span>

            `;


        } else {


            statusHTML = `

                <span

                    class="status-tidak"

                >

                    ${duty.status || ""}

                </span>

            `;

        }


        tr.innerHTML = `

            <td>

                <span class="badge">

                    ${duty.kod || ""}

                </span>

            </td>


            <td>

                ${duty.waktu_tugasan || ""}

            </td>


            <td>

                ${duty.jam_kerja || 0}

                jam

            </td>


            <td>

                ${duty.jam_klm || 0}

                jam

            </td>


            <td>

                ${statusHTML}

            </td>

        `;


        tbody.appendChild(

            tr

        );


    }

);
```

}
