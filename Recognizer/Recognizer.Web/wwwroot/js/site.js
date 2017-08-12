var userId;
//# sourceMappingURL=WebSocketManager.js.map
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

//step 3 for receiving msgs from console
// if browser is ver old, https://github.com/gimite/web-socket-js 
//$(document).ready(function () {
//    var protocol = location.protocol === "https:" ? "wss:" : "ws:";
//    var wsUri = protocol + "//" + window.location.host + "/notifications";
//    var connection = new WebSocketManager.Connection(wsUri);
//    connection.enableLogging = true;
//    connection.connectionMethods.onConnected = () => {
//        //optional
//        console.log("You are now connected! Connection ID: " + connection.connectionId);
//        userId = connection.connectionId;
//    }
//    connection.connectionMethods.onDisconnected = () => {
//        //optional
//        console.log("Disconnected!");
//    }
//    connection.clientMethods["receiveMessage"] = (socketId, message) => {
//        var messageText = socketId + " : " + message;
//        console.log(messageText);
//        //$("#messages").append($("<li/>").text(message));
//        appendItem(list, messageText);
//    };
//    connection.start();
//    var list = document.getElementById("messages");
//    var button = document.getElementById("sendButton");
//    function appendItem(list, message) {
//        var item = document.createElement("li");
//        item.appendChild(document.createTextNode(message));
//        list.appendChild(item);
//    }
//    if (button) {
//        button.addEventListener("click", function () {
//            var input = document.getElementById("textInput");
//            connection.invoke("SendMessage", connection.connectionId, input.value);
//            input.value = "";
//        });
//    }
//});

window.onload = function () {

    //get user ip
    var userip;
    var initialFiles = 0;
    var currentFiles = 0;
    var isloaded = false;
    var maxCount = 100;
    var arrayImages = new Array();
    $.getJSON('//freegeoip.net/json/?callback=?', function (data) {
        //console.log(JSON.stringify(data, null, 2));
        userip = data.ip;
        $("#id").text(userip);
        //initial file count
        $.get("/home/GetFilesCount", { ip: userip }, function (result) {
            if (result.count >= maxCount)
                result.count = maxCount;
            var i = (Math.floor(result.count / maxCount) * 100);
            $(".progress-bar").css("width", i + "%").text(i + " %");
            initialFiles = result.count;
            currentFiles = result.count;
            isloaded = true;
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
                if (isloaded) {
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
                        crop.style.display = "none";
                        if (currentFiles == maxCount) {
                            //make sure post once
                            maxCount -= 1;
                            //make sure array length is equal max couunt
                            if (arrayImages.length > maxCount + 1) {
                                arrayImages.splice(0, arrayImages.length - maxCount + 1);
                            }
                            $.post('/home/ReceiveImgs', { ip: userip, sources: arrayImages }, function (result) {
                                trackerTask.stop();
                            });
                        }
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

    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    $("#starttraings").click(function () {

        userId = createGuid();
        $.post("/home/ExecuteTrain", { ip: userip, userid: userId }, function (result)
        {
            console.log(result.data);
        })
    });
}

$(document).ready(function () {

    var notifications = document.getElementById('messages');
    var showNotification = function (data) {
        var preformatedContainer = document.createElement('p');
        preformatedContainer.appendChild(document.createTextNode(data));

        notifications.appendChild(preformatedContainer);
        notifications.appendChild(document.createElement('hr'));
    };

    var source = new EventSource('/sse-notifications');

    source.onmessage = function (event) {
        //var data = event.data;
        //var guid = data.substring(data.IndexOf("!!!"));
        //console.log(guid);
        //if (guid == userId) {
        //    showNotification(event.data);
        //}
        showNotification(event.data);
    };

    source.addEventListener('alert', function (event) {
        alert(event.data);
    });

    function updateNotifications()
    {
        // Prior to getting your messages.
        shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
        /*
         * Get your messages, we'll just simulate it by appending a new one syncronously.
         */
        // After getting your messages.
        if (!shouldScroll) {
            scrollToBottom();
        }
    }

    function scrollToBottom() {
        notifications.scrollTop = notifications.scrollHeight;
    }

    scrollToBottom();

    setInterval(updateNotifications, 100);
})


