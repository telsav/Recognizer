// Write your Javascript code.

// Activate Next Step

$(document).ready(function() {
    
    var navListItems = $('ul.setup-panel li a'),
        allWells = $('.setup-content');

    allWells.hide();

    navListItems.click(function(e)
    {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this).closest('li');
        
        if (!$item.hasClass('disabled')) {
            navListItems.closest('li').removeClass('active');
            $item.addClass('active');
            allWells.hide();
            $target.show();
        }
    });
    
    $('ul.setup-panel li.active a').trigger('click');
    
    // DEMO ONLY //
    $('#activate-step-2').on('click', function(e) {
        $('ul.setup-panel li:eq(1)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-2"]').trigger('click');
        $(this).remove();
    })
    
    $('#activate-step-3').on('click', function(e) {
        $('ul.setup-panel li:eq(2)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-3"]').trigger('click');
        $(this).remove();
    })
    
    $('#activate-step-4').on('click', function(e) {
        $('ul.setup-panel li:eq(3)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-4"]').trigger('click');
        $(this).remove();
    })
    
    $('#activate-step-3').on('click', function(e) {
        $('ul.setup-panel li:eq(2)').removeClass('disabled');
        $('ul.setup-panel li a[href="#step-3"]').trigger('click');
        $(this).remove();
    })
});

// Add , Dlelete row dynamically

$(document).ready(function(){
    var i=1;
    $("#add_row").click(function(){
        $('#addr'+i).html("<td>"+ (i+1) +"</td><td><input name='name"+i+"' type='text' placeholder='Name' class='form-control input-md'  /> </td><td><input  name='sur"+i+"' type='text' placeholder='Surname'  class='form-control input-md'></td><td><input  name='email"+i+"' type='text' placeholder='Email'  class='form-control input-md'></td>");

        $('#tab_logic').append('<tr id="addr'+(i+1)+'"></tr>');
        i++; 
    });
    $("#delete_row").click(function(){
        if(i>1){
	    $("#addr"+(i-1)).html('');
	    i--;
	    }
    });

});

window.onload = function () {

    //get user ip
    var userip;
    var initialFiles = 0;
    var currentFiles = 0;
    var maxCount = 100;
    var arrayImages = new Array();
    $.getJSON('//freegeoip.net/json/?callback=?', function (data) {
        //console.log(JSON.stringify(data, null, 2));
        userip = data.ip;

        //initial file count
        $.get("/home/GetFilesCount", { ip: userip }, function (result) {
            if (result.count >= maxCount)
                result.count = maxCount;
            var i = (Math.floor(result.count / maxCount) * 100);
            $(".progress-bar").css("width", i + "%").text(i + " %");
            initialFiles = result.count;
            currentFiles = result.count;
        })
    });


    //monitoring of fps
   
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    var objectEmit_ = tracking.ObjectTracker.prototype.emit;
    var colorEmit_ = tracking.ColorTracker.prototype.emit;

    stats.begin();

    tracking.ObjectTracker.prototype.emit = function () {
        stats.end();
        objectEmit_.apply(this, arguments);
    };

    tracking.ColorTracker.prototype.emit = function () {
        stats.end();
        colorEmit_.apply(this, arguments);
    };

    var video = document.getElementById('myVideo');
    var canvas = document.getElementById('snapshotCanvas');
    var context = canvas.getContext('2d');

    var crop = document.getElementById('crop');

    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

    var trackerTask=tracking.track('#myVideo', tracker, { camera: true });

    tracker.on('track', function (event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (event.data.length === 0) {
            // No colors were detected in this frame.
            //crop.style.display = "none";
        } else {
            event.data.forEach(function (rect) {
                context.strokeStyle = '#a64ceb';
                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                context.font = '11px Helvetica';
                context.fillStyle = "#00FF00";
                context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                context.fillText('y: ' + rect.y + 'px', rect.x + rect.height + 5, rect.y + 22);


                
                var snapshotContext = crop.getContext('2d');
                //snapshotContext.clearRect(0, 0, crop.width, crop.height);
                //draw image to canvas. scale to target dimensions
              
               
                //This dataURI is what you would use to get the actual image
                crop.width = rect.width;
                crop.height = rect.height;
                snapshotContext.drawImage(video, rect.x*2, rect.y*2, rect.width*2, rect.height*2, 0,0, rect.width, rect.height);
                //convert to desired file format
                var dataURI = crop.toDataURL('image/jpeg'); // can also use 'image/png'

                if (currentFiles < maxCount) {
                    arrayImages.push(dataURI);
                    //console.log(arrayImages.length);
                    currentFiles++;
                    if (currentFiles > maxCount)
                        currentFiles = maxCount;
                    var i = (Math.floor(currentFiles / maxCount)) * 100;
                    $(".progress-bar").css("width", i + "%").text(i + " %");
                }
                else {
                    console.log('currentFiles: ' + currentFiles + ' maxCount: ' + maxCount)
                    if (currentFiles == maxCount) {
                        //make sure post once
                        maxCount -= 1;
                        //make sure array length is equal max couunt
                        if (arrayImages.length > maxCount + 1)
                        {
                            arrayImages.splice(0, arrayImages.length - maxCount + 1);
                        }
                        $.post('/home/ReceiveImgs', { ip: userip, sources: arrayImages }, function (result) {
                            trackerTask.stop();
                        });
                    }
                }
            });
        }
    });

    //setInterval(function () {
    //    console.log('array Images length is: ' + arrayImages.length + ' maxCount: ' + maxCount)
    //    if (arrayImages.length == maxCount) {
    //        maxCount -= 1;//post one
    //        $.post('/home/ReceiveImgs', { ip: userip, sources: arrayImages }, function (result) {
                
    //        });
    //    }
    //}, 1000);

    //setTimeout(function () {

    //    $("#myVideo").faceDetection({
    //        interval: 1,
    //        async: true,
    //        complete: function (faces) {
    //            console.log(faces);
    //            //$('<div>', {
    //            //    'class': 'face-video',
    //            //    'css': {
    //            //        'left': faces[0].x * faces[0].scaleX + 'px',
    //            //        'top': faces[0].y * faces[0].scaleY + 'px',
    //            //        'width': faces[0].width * faces[0].scaleX + 'px',
    //            //        'height': faces[0].height * faces[0].scaleY + 'px'
    //            //    }
    //            //})
    //            //.insertAfter(this);
    //        }
    //    });
    //}, 500);


    var gui = new dat.GUI();
    gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
    gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
    gui.add(tracker, 'stepSize', 1, 5).step(0.1);



    //add mouse positin
    //function writeMessage(canvas, message) {
    //    var context = canvas.getContext('2d');
    //    context.clearRect(0, 0, canvas.width, canvas.height);
    //    context.font = '18pt Calibri';
    //    context.fillStyle = 'black';
    //    context.fillText(message, 10, 25);
    //}
    //function getMousePos(canvas, evt) {
    //    var rect = canvas.getBoundingClientRect();
    //    return {
    //        x: evt.clientX - rect.left,
    //        y: evt.clientY - rect.top
    //    };
    //}
    //var canvas1 = document.getElementById('crop');
    //var canvas2 = document.getElementById('mouse');
    //canvas1.addEventListener('mousemove', function (evt) {
    //    var mousePos = getMousePos(canvas1, evt);
    //    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    //    writeMessage(canvas2, message);
    //}, false);


    $("#starttraings").click(function () {

        $.post("/home/ExecuteTrain", { ip: userip }, function (result)
        {
            console.log(result.data);
        })

    });
}

