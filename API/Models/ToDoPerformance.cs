﻿using System;

namespace API.model
{
    public class ToDoPerformance 
    {
        public Guid ID { get; set; } = new Guid();
        public Guid UserID { get; set; }
        public DateTime Date { get; set; }
        public Double? Achievement { get; set; }
    }
}
