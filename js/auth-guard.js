// =====================================================
// AUTH GUARD
// FPB DUTY SYSTEM
// KUNCI SEMUA HALAMAN DALAMAN
// =====================================================

(async function () {

    // Pastikan Supabase sudah tersedia
    if (!window.supabaseClient) {

        console.error(
            "supabaseClient tidak dijumpai."
        );

        window.location.href = "login.html";

        return;

    }


    // Semak pengguna yang sedang login
    const {

        data: {

            user

        },

        error

    } = await supabaseClient.auth.getUser();


    // Jika ada ralat ATAU tiada user
    if (

        error ||

        !user

    ) {

        window.location.href = "login.html";

        return;

    }


    // Pengguna sah
    console.log(

        "Pengguna telah login:",

        user.email

    );

})();
