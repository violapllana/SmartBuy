using Backend.dtos;
using Backend.Models;

public static class ReviewMapper
{
    public static ReviewDto toReviewDto(this Review review)
    {
        return new ReviewDto
        {
            Id = review.Id,
            UserId = review.UserId,
            ProductId = review.ProductId,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt,

        };
    }

    public static Review toReviewFromCreateDto(this ReviewCreateDto dto)
    {
        return new Review
        {
            UserId = dto.UserId,
            ProductId = dto.ProductId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };
    }


    public static ReviewDto toReviewDto(this MongoReviews review)
    {
        return new ReviewDto
        {
            Id = review.Id,
            UserId = review.UserId,
            ProductId = review.ProductId,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }
}
