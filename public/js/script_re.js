var onloadCallback = function (data) {
    if (data) {
        let btn = document.getElementById('btn')
        btn.disabled = false
    }
    else{
        location.reload();
    }
};