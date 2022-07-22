using System;

namespace API.DTOs.AuthDto
{
    public class SignUpDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}
