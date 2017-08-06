using ImageSharp;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using OpenCvSharp;
using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;

namespace Recognizer.Web.Controllers
{
    public class HomeController : Controller
    {
        private IHostingEnvironment _env;
        public HomeController(IHostingEnvironment env)
        {
            this._env = env;
        }


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

        [HttpPost]
        public IActionResult ReceiveImgs(string source)
        {
            //https://andrewlock.net/using-imagesharp-to-resize-images-in-asp-net-core-part-4-saving-to-disk/
            var webRoot = _env.WebRootPath;
            var PathWithFolderName = System.IO.Path.Combine(webRoot, "data");

            if (!Directory.Exists(PathWithFolderName))
            {
                // Try to create the directory.
                DirectoryInfo di = Directory.CreateDirectory(PathWithFolderName);
            }

            var base64 = source.Substring(source.IndexOf(',') + 1);
            base64 = base64.Trim('\0');
            byte[] imageBytes = Convert.FromBase64String(base64);

            using (MemoryStream ms = new MemoryStream(imageBytes))
            {
                using (Image<Rgba32> image = Image.Load(ms))
                {
                    image.Resize(image.Width / 2, image.Height / 2)
                          .Grayscale()
                          .Save(PathWithFolderName + "/"+DateTime.Now.ToString("yyyy_MM_dd_HH_mm_ss_") +"avatar.png"); // automatic encoder selected based on extension.
                }
            }

            return Json(new { data=true });

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
