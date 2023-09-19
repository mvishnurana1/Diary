using API.DTOs.Todos;
using API.Helpers.Services;

namespace API.test.Services
{
    public class ToDoServiceTests
    {
        [Fact]
        public async Task GivenToDoIsNotDuplicate_WhenToDoIsAdded_ItIsStoredCorrectly()
        {
            var todoService = new ToDoService();

            var dto = new TodoDto();

            var x = await todoService.AddNewTodo(dto);
            
        }

        [Fact]
        public void GetAllTasksForLoggedInUserOnDate_ReturnsAllTasks()
        {

        }
    }
}
