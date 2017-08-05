Face detection AMD library
============================

Based on the work of [Jay Salvat](http://facedetection.jaysalvat.com/) and [Liu Liu](https://github.com/liuliu/ccv).

[Download latest build](https://github.com/sprky0/facedetection/raw/master/dist/facedetection.js)

Basic Usage
--------

```javascript
require.config({
	paths:{
		facedetection:"libraries/facedetection.js"
	}
});

require("facedetection",function(){
	var	image = document.getElementById("image_id");
	var results = facedetection(image);
});
```

Settings
--------

Settings can be passed as a second parameter to the face detection function.

**confidence:** Minimum level of confidence

**start:** Callback function trigged just before the process starts. **DOESN'T WORK PROPERLY**

	start:function(img) {
		// ...
	}

**complete:** Callback function trigged after the detection is completed

	complete:function(img, coords) {
		// ...
	}

**error:** Callback function trigged on errors

	error:function(img, code, message) {
		// ...
	}

Results
-------

Returns an array with found faces object:

**x:** Y coord of the face

**y:** Y coord of the face

**width:** Width of the face

**height:** Height of the face

**confidence:** Level of confidence

Version History
-------

* 0.2.0 - Prepared for release as a Bower package.
