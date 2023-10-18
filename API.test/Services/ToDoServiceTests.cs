using API.DTOs.Todos;
using API.Helpers.Services;

namespace API.test.Services
{
    public class ToDoServiceTests
    {
        [Fact]
        public async Task Test()
        {
            var todoService = new ToDoService();
            var newTodo = new TodoDto();
            var returnedToDo = await todoService.AddNewTodo(newTodo);

            Assert.Null(returnedToDo);
        }
    }
}
