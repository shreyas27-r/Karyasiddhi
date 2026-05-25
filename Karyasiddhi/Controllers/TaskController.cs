using Karyasiddhi.Enum;
using Karyasiddhi.Models;
using KaryaSiddhi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KaryaSiddhi.Controllers

{

    [Route("api/[controller]")]

    [ApiController]

    public class TasksController : ControllerBase

    {

        private readonly TaskContext _context;
        public TasksController(TaskContext context)

        {

            _context = context;

        }

        // GET: api/tasks

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tasks>>> GetTasks()
        {
            var tasks = await _context.TasksItem
                                      .Select(t => t)
                                      .ToListAsync();

            return tasks;
        }

        // GET: api/tasks/{id}

        [HttpGet("{id}")]
        public async Task<ActionResult<Tasks>> GetTask(int id)

        {
            var task = await _context.TasksItem
                                      .Select(t=>t)
                                      .Where(t => t.Id == id)
                                      .FirstOrDefaultAsync();

            if (task == null)
            {
                return NotFound();
            }
            return task;
        }

        // POST: api/tasks

        [HttpPost]
        public async Task<ActionResult<Tasks>> PostTask(Tasks task)

        {
            _context.TasksItem.Add(task);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);

        }

        // PUT: api/tasks/{id}


        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, Tasks task)
        {
            if (id != task.Id)
            {
                return BadRequest();
            }

            var existingTask = await _context.TasksItem.FindAsync(id);
            if (existingTask == null)
            {
                return NotFound();
            }

            existingTask.Status = task.Status;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        // DELETE: api/tasks/{id}

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)

        {
            var task = await _context.TasksItem
                                     .Select(t => t)
                                     .Where(t => t.Id == id)
                                     .FirstOrDefaultAsync();
                 
            if (task == null)
            {
                return NotFound();
            }

            _context.TasksItem.Remove(task);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("priorities")]
        public IActionResult GetPriorities()
        {
            var values = System.Enum.GetValues(typeof(PriorityLevel)) 
                .Cast<PriorityLevel>()
                .Select(p => new
                {
                    id = (int)p,
                    name = p.ToString()
                })
                .ToList(); 

            return Ok(values);
        }

    }

}

