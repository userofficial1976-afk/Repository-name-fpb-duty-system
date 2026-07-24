// =====================================================
// AUTH-GUARD.JS
// FPB DUTY SYSTEM
// KAWAL AKSES SEMUA HALAMAN DALAMAN
// =====================================================


// =====================================================
// SEMAK LOGIN APABILA HALAMAN DIBUKA
// =====================================================

(async function () {


    // -------------------------------------------------
    // PASTIKAN SUPABASE SUDAH ADA
    // -------------------------------------------------

    if (

        typeof supabaseClient === "undefined"

    ) {


        console.error(

            "supabaseClient belum dimuatkan."

        );


        return;

    }


    // -------------------------------------------------
    // DAPATKAN SESSION
    // -------------------------------------------------

    const {

        data,

        error

    } = await supabaseClient.auth.getSession();


    // -------------------------------------------------
    // JIKA ADA ERROR
    // -------------------------------------------------

    if (

        error

    ) {


        console.error(

            "Ralat semak login:",

            error.message

        );


        window.location.replace(

            "login.html"

        );


        return;

    }


    // -------------------------------------------------
    // JIKA TIADA SESSION
    // -------------------------------------------------

    if (

        !data ||

        !data.session

    ) {


        console.log(

            "Pengguna belum login."

        );


        window.location.replace(

            "login.html"

        );


        return;

    }


    // -------------------------------------------------
    // USER SUDAH LOGIN
    // -------------------------------------------------

    const user =

        data.session.user;


    console.log(

        "Pengguna sedang login:",

        user.email

    );


    // -------------------------------------------------
    // PAPAR EMAIL PENGGUNA
    // -------------------------------------------------

    paparEmailPengguna(

        user

    );


})();


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
    // ID userEmail
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
    // CLASS user-email
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
    // DATA ATTRIBUTE
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


        const {

            error

        } = await supabaseClient.auth.signOut();


        if (

            error

        ) {


            console.error(

                "Ralat logout:",

                error.message

            );


            alert(

                "Gagal logout:\n\n" +

                error.message

            );


            return;

        }


        // -------------------------------------------------
        // LOGOUT BERJAYA
        // -------------------------------------------------

        window.location.replace(

            "login.html"

        );


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

supabaseClient.auth.onAuthStateChange(

    function (

        event,

        session

    ) {


        console.log(

            "AUTH EVENT:",

            event

        );


        // -------------------------------------------------
        // JIKA LOGOUT
        // -------------------------------------------------

        if (

            event ===

            "SIGNED_OUT"

        ) {


            window.location.replace(

                "login.html"

            );


            return;

        }


        // -------------------------------------------------
        // JIKA SESSION HILANG
        // -------------------------------------------------

        if (

            !session &&

            event !==

            "INITIAL_SESSION"

        ) {


            window.location.replace(

                "login.html"

            );

        }

    }

);
