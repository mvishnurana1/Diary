using API.DTOs.Todos;
using API.model;
using System.Threading.Tasks;

namespace API.Helpers.Services
{
    public interface IToDoService
    {
        Task<DailyTodo> AddNewTodo(TodoDto todo);
        Task<string> DeleteTodo(DeleteTodoRequestDto deleteTodoRequestDto);
    }

    public class ToDoService : IToDoService
    {
        public Task<DailyTodo> AddNewTodo(TodoDto todo)
        {
            throw new System.NotImplementedException();
        }

        public Task<string> DeleteTodo(DeleteTodoRequestDto deleteTodoRequestDto)
        {
            throw new System.NotImplementedException();
        }
    }
}
