$(document).on('click','.send_form', function(){
var input_blanter = document.getElementById('email');

/* Whatsapp Settings */
var walink = 'https://web.whatsapp.com/send',
    phone = '6282137760669',
    walink2 = 'Salam Hangat, perkenalkan saya: ',
    text_yes = 'Terkirim.',
    text_no = 'Isi semua Formulir lalu klik Send.';

/* Smartphone Support */
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
var walink = 'whatsapp://send';
}

if("" != input_blanter.value){

 /* Call Input Form */
var input_select1 = $("#select :selected").text(), 
    input_name1 = $("#name").val(),
    input_email1 = $("#email").val(),
    // input_subject1 = $("#subject").val(),
    input_message1 = $("#message").val();

/* Final Whatsapp URL */
var blanter_whatsapp = walink + '?phone=' + phone + '&text=' + walink2 + '%0A%0A' +
    '*Name* : ' + input_name1 + '%0A' +
    '*Email Address* : ' + input_email1 + '%0A' +
    '*Keperluan* : ' + input_select1 + '%0A' +
    '*Isi Message* : ' + input_message1 + '%0A';

/* Whatsapp Window Open */
window.open(blanter_whatsapp,'_blank');
document.getElementById("text-info").innerHTML = '<span class="yes">'+text_yes+'</span>';
} else {
document.getElementById("text-info").innerHTML = '<span class="no">'+text_no+'</span>';
}
});