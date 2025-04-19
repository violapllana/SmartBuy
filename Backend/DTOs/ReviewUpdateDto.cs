using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.dtos
{
    public class ReviewUpdateDto
    {
     public int Id { get; set; }
     public string? UserId{ get; set; }
    
    public int ProductId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }
    }
}