using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SmartBuy.Models;

public class Review{


[Key]
[DatabaseGenerated(DatabaseGeneratedOption.Identity)]  
    public int Id { get; set; }
    public string? UserId{ get; set; }
    
    public User? User { get; set; }

    public int ProductId { get; set; }

    public Product?Product { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }



    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

   
    
}

