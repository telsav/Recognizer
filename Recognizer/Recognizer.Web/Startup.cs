using Lib.AspNetCore.ServerSentEvents;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Recognizer.Web.Services;
using System;
using System.Linq;

namespace Recognizer.Web
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.

            services.AddResponseCompression(options =>
            {
                options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "text/event-stream" });
            });
            services.AddServerSentEvents();
            services.AddServerSentEvents<INotificationsServerSentEventsService, NotificationsServerSentEventsService>();

            services.AddMvc();
            //services.AddWebSocketManager();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IServiceProvider serviceProvider)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseForwardedHeaders(new ForwardedHeadersOptions {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                ForwardedHeaders.XForwardedProto
            });

            app.UseStaticFiles();

            //app.UseWebSockets();
            //app.UseMiddleware<MsgWebSocketMiddleware>();
            //app.MapWebSocketManager("/notifications", serviceProvider.GetService<NotificationsMessageHandler>());

            app.UseResponseCompression()
                .MapServerSentEvents("/notifications")
                .MapServerSentEvents("/sse-notifications", serviceProvider.GetService<NotificationsServerSentEventsService>())
                .UseMvc(routes =>
                {
                    routes.MapRoute(
                        name: "default",
                        template: "{controller=Home}/{action=Index}/{id?}");
                });


            // Only for demo purposes, don't do this kind of thing to your production
            IServerSentEventsService serverSentEventsService = serviceProvider.GetService<IServerSentEventsService>();
            System.Threading.Thread eventsHeartbeatThread = new System.Threading.Thread(new System.Threading.ThreadStart(() =>
            {
                while (true)
                {
                    serverSentEventsService.SendEventAsync($"Recognizer.Web Heartbeat ({DateTime.UtcNow} UTC)").Wait();
                    System.Threading.Thread.Sleep(5000);
                }
            }));
            eventsHeartbeatThread.Start();
        }
    }
}
