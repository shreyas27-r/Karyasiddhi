using Karyasiddhi.Enum;

namespace Karyasiddhi.Models
{
    public class Tasks
    {
        public int Id { get; set;  }

        public string? Title { get; set; }

        public string? Description { get; set; }

        public PriorityLevel Priority { get; set; }

        public string? DueDate { get; set; }

        public Boolean Status { get; set; }
    }
}
