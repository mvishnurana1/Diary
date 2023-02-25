using System;

namespace API.DTOs.Todos
{
    public class TodoDto
    {
        public DateTime DateCreated { get; set; }
        public bool Completed { get; set; }
        public Guid UserID { get; set; }
        public string TodoContent { get; set; }
        public DateTime? DateCompleted { get; set; }
    }

    public class UpdateTodoCompleteStatusDto 
    {
        public Guid DailyTodoID { get; set; }
        public Guid LoggedInUserID { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime UpdateDateTime { get; set; }
    }

    public class DueTasksOnDateDto
    {
        public string Date { get; set; }
        public string UserID { get; set; }
    }
}
