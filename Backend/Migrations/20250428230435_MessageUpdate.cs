using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartBuy.Migrations
{
    /// <inheritdoc />
    public partial class MessageUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ViewedByAdmin",
                table: "Messages",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ViewedByAdmin",
                table: "Messages");
        }
    }
}
