// =====================================================
// AUTH-GUARD.JS
// FPB DUTY SYSTEM
// KAWAL AKSES SEMUA HALAMAN DALAMAN
// =====================================================


// =====================================================
// SEMAK LOGIN APABILA HALAMAN DIBUKA
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    async function () {


        // -------------------------------------------------
        // PASTIKAN SUPABASE SUDAH ADA
        // -------------------------------------------------

        if (

            typeof supabase === "undefined"

        ) {

            console.error(

                "Supabase belum dimuatkan."

            );

            return;

        }


        // -------------------------------------------------
        // DAPATKAN USER YANG SEDANG LOGIN
        // -------------------------------------------------

        const {

            data,

            error

        } = await supabase.auth.getUser();


        // -------------------------------------------------
        // JIKA ADA ERROR
        // -------------------------------------------------

        if (error) {


            console.error(

                "Ralat semak login:",

                error.message

            );


            window.location.href =

                "login.html";


            return;

        }


        // -------------------------------------------------
        // JIKA TIADA USER
        // MAKA HANTAR KE LOGIN
        // -------------------------------------------------

        if (

            !data ||

            !data.user

        ) {


            window.location.href =

                "login.html";


            return;

        }


        // -------------------------------------------------
        // USER SUDAH LOGIN
        // -------------------------------------------------

        const user = data.user;


        console.log(

            "Pengguna sedang login:",

            user.email

        );


        // -------------------------------------------------
        // PAPARKAN EMAIL PENGGUNA
        // -------------------------------------------------

        paparEmailPengguna(

            user

        );


    }

);


// =====================================================
// FUNGSI PAPAR EMAIL PENGGUNA
// =====================================================

function paparEmailPengguna(

    user

) {


    if (

        !user

    ) return;


    const email =

        user.email ||


        "Pengguna";


    // -------------------------------------------------
    // CARI ELEMEN YANG BOLEH PAPAR EMAIL
    // -------------------------------------------------

    const elemenEmail =

        document.getElementById(

            "userEmail"

        );


    if (

        elemenEmail

    ) {


        elemenEmail.textContent =

            email;


    }


    // -------------------------------------------------
    // JIKA ADA ELEMEN NAMA user-email
    // -------------------------------------------------

    const elemenEmailClass =

        document.querySelector(

            ".user-email"

        );


    if (

        elemenEmailClass

    ) {


        elemenEmailClass.textContent =

            email;


    }


    // -------------------------------------------------
    // JIKA ADA ELEMEN USER EMAIL
    // -------------------------------------------------

    const elemenUserEmail =

        document.querySelector(

            "[data-user-email]"

        );


    if (

        elemenUserEmail

    ) {


        elemenUserEmail.textContent =

            email;


    }

}


// =====================================================
// FUNGSI LOGOUT
// =====================================================

async function logout() {


    try {


        // -------------------------------------------------
        // LOGOUT DARI SUPABASE
        // -------------------------------------------------

        const {

            error

        } = await supabase.auth.signOut();


        // -------------------------------------------------
        // JIKA ADA ERROR
        // -------------------------------------------------

        if (

            error

        ) {


            console.error(

                "Ralat logout:",

                error.message

            );


            alert(

                "Gagal logout: " +

                error.message

            );


            return;

        }


        // -------------------------------------------------
        // LOGOUT BERJAYA
        // -------------------------------------------------

        window.location.href =

            "login.html";


    }

    catch (

        error

    ) {


        console.error(

            "Ralat sistem logout:",

            error

        );


        alert(

            "Berlaku ralat semasa logout."

        );

    }

}


// =====================================================
// AUTO SEMAK PERUBAHAN SESSION
// =====================================================

if (

    typeof supabase !== "undefined"

) {


    supabase.auth.onAuthStateChange(

        function (

            event,

            session

        ) {


            console.log(

                "Auth Event:",

                event

            );


            // -------------------------------------------------
            // JIKA LOGOUT
            // -------------------------------------------------

            if (

                event ===

                "SIGNED_OUT"

            ) {


                window.location.href =

                    "login.html";


                return;

            }


            // -------------------------------------------------
            // JIKA SESSION TAMAT
            // -------------------------------------------------

            if (

                event ===

                "TOKEN_REFRESHED" &&

                !session

            ) {


                window.location.href =

                    "login.html";


            }

        }

    );

}
