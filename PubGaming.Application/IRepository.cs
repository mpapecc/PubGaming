namespace PubGaming.Application
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> Query();
        void Create(T entity);
        void CreateRange(IEnumerable<T> entities);
        void Update(T entity);
        void UpdateRange(IEnumerable<T> entities);
        void Delete(T entity);
        void DeleteRange(IEnumerable<T> entities);
        void Commit();
    }
}
