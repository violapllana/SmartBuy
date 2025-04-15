using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CardCreateDto
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Type { get; set; }
}