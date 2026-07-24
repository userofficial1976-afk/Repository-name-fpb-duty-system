// =====================================================
// AUTH GUARD
// FPB DUTY SYSTEM
// =====================================================


// =====================================================
// SEMAK LOGIN
// =====================================================

async function semakLogin() {


    const result = await supabaseClient.auth.getSession();


    if (result.error) {


        console.error(

            "RALAT SEMAK LOGIN:",

            result.error

        );


        window.location.href =

            "login.html";


        return null;

    }


    const session = result.data.session;


    if (!session) {


        window.location.href =

            "login.html";


        return null;

    }


    return session;

}


// =====================================================
// JALANKAN SEMAKAN
// =====================================================

document.addEventListener(

    "DOMContentLoaded",

    async function () {


        await semakLogin();

    }

);


// =====================================================
// AUTO LOGOUT JIKA SESSION TAMAT
// =====================================================

supabaseClient.auth.onAuthStateChange(

    function (

        event,

        session

    ) {


        if (

            event === "SIGNED_OUT" ||

            !session

        ) {


            window.location.href =

                "login.html";

        }

    }

);
