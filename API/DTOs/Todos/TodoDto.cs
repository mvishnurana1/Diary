﻿using System;

namespace API.DTOs.Todos
{
    public class TodoDto
    {
        public DateTime DateDue { get; set; }
        public bool Completed { get; set; }
        public Guid UserID { get; set; }
        public string TodoContent { get; set; }
    }

    public class UpdateTodoCompleteStatusDto 
    {
        public Guid ID { get; set; }
        public Guid LoggedInUserID { get; set; }
        public bool NewStatus { get; set; }
        public DateTime CompletedDateTime { get; set; }
    }

    public class DueTasksOnDateDto
    {
        public string Date { get; set; }
        public Guid UserID { get; set; }
    }
}
