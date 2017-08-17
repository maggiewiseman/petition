
(function() {
    const canvas = document.getElementById('canv');
    const ctx = canvas.getContext('2d');
    const hiddenInput = document.getElementById('signature');

    function signature() {

        function pointerDown(e) {
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
            canvas.addEventListener('mousemove', paint);
        }

        function pointerUp(e) {
            canvas.removeEventListener('mousemove', paint);
            paint(e);
        }

        function paint(e) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            saveSig();
        }

        canvas.addEventListener("mousedown", pointerDown);
        canvas.addEventListener("mouseup", pointerUp);
    }

    function saveSig() {
        var sigData = canvas.toDataURL();
        hiddenInput.innerHTML = sigData;
        console.log(sigData);
    }
    signature();


}());



//in the submit form make canvas stuff the value of the hiddent input field.
//canvasElement.toDataURL
