using Karyasiddhi.Models;
using KaryaSiddhi.Controllers;
using KaryaSiddhi.Data;
using Microsoft.EntityFrameworkCore;


namespace KaryasiddhiTests.Controllers
{
    public class TasksControllerTests
    {
        private TaskContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<TaskContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // unique DB per test
                .Options;

            var context = new TaskContext(options);

            return context;
        }

        [Fact]
        public async Task GetTasks_ReturnsAllTasks()
        {
            var context = GetDbContext();

            context.TasksItem.Add(new Tasks { Id = 1, Title = "Task 1" });
            context.TasksItem.Add(new Tasks { Id = 2, Title = "Task 2" });
            await context.SaveChangesAsync();

            var controller = new TasksController(context);

            var result = await controller.GetTasks();

            Assert.Equal(2, result.Value.Count());
        }

        [Fact]
        public async Task GetTask_ReturnsTask_WhenExists()
        {
            var context = GetDbContext();

            context.TasksItem.Add(new Tasks { Id = 1, Title = "Task 1" });
            await context.SaveChangesAsync();

            var controller = new TasksController(context);

            var result = await controller.GetTask(1);

            Assert.NotNull(result.Value);
            Assert.Equal("Task 1", result.Value.Title);
        }

        [Fact]
        public async Task PostTask_AddsTask()
        {
            var context = GetDbContext();
            var controller = new TasksController(context);

            var task = new Tasks { Title = "New Task" };

            var result = await controller.PostTask(task);

            Assert.Equal(1, context.TasksItem.Count());
        }

        [Fact]
        public async Task PutTask_UpdatesTask_Clean()
        {
            var context = GetDbContext();

            var task = new Tasks { Title = "Old" };
            context.TasksItem.Add(task);
            await context.SaveChangesAsync();

            var controller = new TasksController(context);

            var updated = new Tasks
            {
                Id = task.Id,
                Title = "Updated"
            };

            await controller.PutTask(task.Id, updated);

            var result = context.TasksItem.First();

            Assert.Equal("Updated", result.Title);
        }

        [Fact]
        public async Task DeleteTask_RemovesTask()
        {
            var context = GetDbContext();

            context.TasksItem.Add(new Tasks { Id = 1, Title = "Task" });
            await context.SaveChangesAsync();

            var controller = new TasksController(context);

            await controller.DeleteTask(1);

            Assert.Empty(context.TasksItem);
        }
    }
}
