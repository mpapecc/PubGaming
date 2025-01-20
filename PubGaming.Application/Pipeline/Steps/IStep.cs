namespace PubGaming.Application.Pipeline.Steps
{
    public interface IStep
    {
        void Run(Func<dynamic, Task> sendToClients);
    }
}
