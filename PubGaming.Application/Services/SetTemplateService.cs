using PubGaming.Domain.Entites;

namespace PubGaming.Application.Services
{
    public class SetTemplateService(
        IRepository<SetTemplate> setTemplateRepository,
        IRepository<QuestionTemplate> questionTemplateRepository
        )
    {
        private readonly IRepository<SetTemplate> setTemplateRepository = setTemplateRepository;
        private readonly IRepository<QuestionTemplate> questionTemplateRepository = questionTemplateRepository;

        public SetTemplate UpdateSetTemplate(SetTemplate setTemplate)
        {
            var persistedSet = setTemplateRepository.Query()
                .Where(x => x.Id == setTemplate.Id).FirstOrDefault();

            persistedSet.Name = setTemplate.Name;
            persistedSet.Description = setTemplate.Description;

            setTemplate.Questions?.ToList().ForEach(question =>
            {
                if (!persistedSet.Questions.Any(x => x.Id == question.Id))
                    persistedSet.Questions.Add(question);
                else
                {
                    var persistedQuestion = persistedSet.Questions.First(x => x.Id == question.Id);

                    persistedQuestion.Text = question.Text;
                    persistedQuestion.Answers = question.Answers;
                }
            });

            persistedSet.Questions?.ToList().ForEach(question =>
            {
                if (!setTemplate.Questions.Any(x => x.Id == question.Id))
                    questionTemplateRepository.Delete(question);
            });

            return persistedSet;
        }

        public SetTemplate CreateNewSetTemplate(SetTemplate setTemplate)
        {
            var newQuizSet = new SetTemplate()
            {
                Name = setTemplate.Name,
                Description = setTemplate.Description,
                Questions = setTemplate.Questions.Where(x => x.Id == default).ToList(),

            };

            newQuizSet.SetTemplatesQuestionTemplates = setTemplate.Questions?
                                                        .Where(x => x.Id != default)
                                                        .Select(x => new SetTemplateQuestionTemplate() { QuestionTemplateId = x.Id, SetTemplateId = newQuizSet.Id })
                                                        .ToList();

            setTemplateRepository.Create(newQuizSet);
            questionTemplateRepository.Commit();
            return newQuizSet;
        }
    }
}
