using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OpenCvSharp;
using OpenCvSharp.Face;
using System.Diagnostics;

namespace Recognizer.Web.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            var browser = Request.Headers["User-Agent"].ToString();
            var scriptname = Request.Headers["SCRIPT_NAME"].ToString();

            return View();
        }

        [NonAction]
        private double getFps(VideoCapture capture)
        {
            using (var image = new Mat())
            {
                while (true)
                {
                    /* start camera */
                    capture.Read(image);
                    if (!image.Empty())
                    {
                        break;
                    }
                }
            }

            using (var image = new Mat())
            {
                double counter = 0;
                double seconds = 0;
                var watch = Stopwatch.StartNew();
                while (true)
                {
                    capture.Read(image);
                    if (image.Empty())
                    {
                        break;
                    }

                    counter++;
                    seconds = watch.ElapsedMilliseconds / (double)1000;
                    if (seconds >= 3)
                    {
                        watch.Stop();
                        break;
                    }
                }
                var fps = counter / seconds;
                return fps;
            }
        }

        public IActionResult Canny()
        {
            using (var capture = new OpenCvSharp.VideoCapture(CaptureDevice.Any,index:0))
            {
                var fps = getFps(capture);
                capture.Fps = fps;
                var interval = (int)(1000 / fps);

                using (Mat image = new Mat()) // Frame image buffer
                {
                    // When the movie playback reaches end, Mat.data becomes NULL.
                    while (true)
                    {

                        var frame = capture.Read(image);

                        if (image.Empty())
                            break;

                        // Load the cascade
                        var haarCascade = new CascadeClassifier("haarcascade_frontalface_alt2.xml");

                        // Load target image
                        var gray = new Mat("faces.png", ImreadModes.GrayScale);


                        // Detect faces
                        Rect[] faces = haarCascade.DetectMultiScale(gray, 1.08, 2, HaarDetectionType.ScaleImage, new Size(30, 30));




                        //byte[] cannyBytes = cannyImage.ToBytes(".png");
                        //string base64 = Convert.ToBase64String(cannyBytes);
                        //// ビュー変数に設定
                        //ViewBag.Base64Image = base64;

                        //window.ShowImage(image);
                        //Cv2.WaitKey(sleepTime);
                    }
                }

               
            }


            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
