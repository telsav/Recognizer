using Lib.AspNetCore.ServerSentEvents;


namespace Recognizer.Web.Services
{
    public class NotificationsServerSentEventsService : ServerSentEventsService, INotificationsServerSentEventsService
    {
        public NotificationsServerSentEventsService()
        {
            ChangeReconnectIntervalAsync(5000);
        }
    }
}
