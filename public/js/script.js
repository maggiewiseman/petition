
(function() {
    const canvas = document.getElementById('canv');
    if(canvas) {
        const ctx = canvas.getContext('2d');

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

        signature();
    }

    function saveSig() {
        var sigData = canvas.toDataURL();
        const hiddenInput = document.getElementById('signature');
        hiddenInput.value = sigData;
        console.log(sigData);
    }

    var deleteLink = document.getElementById('delete');
    if(deleteLink) {
        console.log('deleteLinlk: ', deleteLink);
        deleteLink.addEventListener('click', function(e) {
            console.log('in delete sig function');
            e.preventDefault(); //cancel the navigation
            document.getElementById('deleteSigForm').submit();
        });
    }

})();


//in the submit form make canvas stuff the value of the hiddent input field.
//canvasElement.toDataURL
