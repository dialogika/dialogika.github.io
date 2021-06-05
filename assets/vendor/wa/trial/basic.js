$(document).on('click','.send_form', function(){
    var input_blanter = document.getElementById('inputName');

    /* Whatsapp Settings */
    var walink = 'https://web.whatsapp.com/send',
        phone = '6282137760669',
        walink2 = 'Saya ingin mendaftar kelas Trial Dialogika.' + '%0A%0A' 
                + 'Berikut Data diri Saya: ',
        text_yes = 'Terkirim.',
        text_no = 'Isi semua Formulir lalu klik Send.';

    /* Smartphone Support */
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    var walink = 'whatsapp://send';
    }

    if("" != input_blanter.value){

     /* Call Input Form */
    var input_name2 = $("#inputName").val(),
        input_whatsapp2 = $("#inputWhatsapp").val(),
        input_work2 = $("#inputWork").val(),
        input_location2 = $("#inputLocation").val(),
        input_sex2 = $("#inputSex :selected").val(),
        input_age2 = $("#inputAge :selected").text(),
        input_program2 = $("#inputProgram").text(),  
        input_reason2 = $("#inputReason").val();

    /* Final Whatsapp URL */
    var blanter_whatsapp = walink + '?phone=' + phone + '&text=' + walink2 + '%0A%0A' +
        '*Nama* : ' + input_name2 + '%0A' +
        '*WA* : ' + input_whatsapp2 + '%0A' +
        '*Jenis Kelamin* : ' + input_sex2 + '%0A' +
        '*Rentang Umur* : ' + input_age2 + '%0A' +
        '*Perkerjaan* : ' + input_work2 + '%0A' +
        '*Domisili* : ' + input_location2 + '%0A' +
        '*Programs* : ' + input_program2 + '%0A' +
        '*Kesulitan* : ' + input_reason2 + '%0A';

    /* Whatsapp Window Open */
    window.open(blanter_whatsapp,'_blank');
    document.getElementById("text-info").innerHTML = '<span class="yes">'+text_yes+'</span>';
    } else {
    document.getElementById("text-info").innerHTML = '<span class="no">'+text_no+'</span>';
    }
});