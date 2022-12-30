using System;

namespace API.DTOs.Todos
{
    public class TodoDto
    {
        public DateTime DateDue { get; set; }
        public bool Completed { get; set; }
        public Guid UserID { get; set; }
        public string TodoContent { get; set; }
    }

    public class DeleteTodoRequestDto 
    {
        public Guid ID { get; set; }
        public Guid loggedInUserID { get; set; }
    }
}
