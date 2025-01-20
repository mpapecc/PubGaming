namespace PubGaming.Domain.Entites
{
    public class Set : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public IList<Question> Questions { get; set; }
        public Game? Game { get; set; }
        public int? GameId { get; set; }
    }
}
