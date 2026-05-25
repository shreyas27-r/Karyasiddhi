using Karyasiddhi.Models;
using Microsoft.EntityFrameworkCore;

namespace KaryaSiddhi.Data

    {
        public class TaskContext : DbContext
        {
            public TaskContext(DbContextOptions<TaskContext> options) : base(options) { }

            public DbSet<Tasks> TasksItem { get; set; }
        }

    }
