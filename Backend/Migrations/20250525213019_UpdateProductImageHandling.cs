using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartBuy.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductImageHandling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Products",
                newName: "ImageFilePath");

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "ImageFilePath",
                table: "Products",
                newName: "ImageUrl");
        }
    }
}
