namespace PubGaming.Application.Pipeline.Steps
{
    public class DelayStep : IStep
    {
        private readonly int pauseBetweenSets;
        private readonly object? data;
        public DelayStep(int pauseBetweenSets)
        {
            this.pauseBetweenSets = pauseBetweenSets;
        }

        public DelayStep(int pauseBetweenSets, object data)
        {
            this.pauseBetweenSets = pauseBetweenSets;
            this.data = data;
        }

        public void Run(Func<dynamic, Task> sendToClients)
        {
            if (data != null)
                sendToClients(data);

            Task.Delay(pauseBetweenSets * 1000);
        }
    }

    public enum DelayType
    {
        BeforeStep,
        AfterStep,
        BeforeSet,
        AfterSet,
        BeforeGame,
        AfterGame
    }
}
