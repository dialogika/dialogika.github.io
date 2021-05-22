$(document).on('click','.send_form', function(){
    var input_blanter = document.getElementById('Whatsapp');

    /* Whatsapp Settings */
    var walink = 'https://web.whatsapp.com/send',
        phone = '6282137760669',
        walink2 = 'Salam Hangat, Saya melihat *sudah mentransfer* untuk join di *Program Basic Class*' + '%0A %0A' 
                + 'Berikut adalah data diri saya: ',
        text_yes = 'Terkirim.',
        text_no = 'Isi semua Formulir lalu klik Send.';

    /* Smartphone Support */
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    var walink = 'whatsapp://send';
    }

    if("" != input_blanter.value){

     /* Call Input Form */
    var input_select1 = $("#select :selected").text(), 
        // input_date1 = $("#date :selected").text(), 
        input_name1 = $("#inputName").val(),
        input_job1 = $("#inputWork").val(),
        input_domisili1 = $("#inputLocation").val(),
        input_umur1 = $("#inputAge").val(),

    /* Final Whatsapp URL */
    var blanter_whatsapp = walink + '?phone=' + phone + '&text=' + walink2 + '%0A%0A' +
        '*Name* : ' + input_name1 + '%0A' +
        '*Kota* : ' + input_domisili1 + '%0A' +
        '*Job* : ' + input_job1 + '%0A' ;
        // '*Isi Message* : ' + input_message1 + '%0A';

    /* Whatsapp Window Open */
    window.open(blanter_whatsapp,'_blank');
    document.getElementById("text-info").innerHTML = '<span class="yes">'+text_yes+'</span>';
    } else {
    document.getElementById("text-info").innerHTML = '<span class="no">'+text_no+'</span>';
    }
});


