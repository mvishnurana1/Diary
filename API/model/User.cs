using System;
using System.Collections.Generic;

namespace API.model
{
    public class User
    {
        public Guid UserID { get; set; }
        public string UserName { get; set; }
        public ICollection<Entry> Entries { get; set; } = new List<Entry>();
    }
}
