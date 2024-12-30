namespace PubGaming.Domain.Pipeline.Steps
{
    public interface IStep
    {
        void Run(Func<dynamic, Task> sendToClients);
    }
}
