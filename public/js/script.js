
//client side javascript
//handle canvas jonks
(function() {

    function signature() {
        const canvas = document.getElementById('canv');
        const ctx = canvas.getContext('2d');

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
        }

        canvas.addEventListener("mousedown", pointerDown);
        canvas.addEventListener("mouseup", pointerUp);
    }

    signature();
}());



//in the submit form make canvas stuff the value of the hiddent input field.
//canvasElement.toDataURL

console.log('it is getting to the client');
