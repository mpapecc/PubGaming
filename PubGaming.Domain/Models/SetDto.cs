﻿namespace PubGaming.Domain.Models
{
    public class SetDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<QuestionDto>? Questions { get; set; }
    }
}