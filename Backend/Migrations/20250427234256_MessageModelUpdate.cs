using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartBuy.Migrations
{
    /// <inheritdoc />
    public partial class MessageModelUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add the new column first
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Messages",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            // Copy the data from SenderId to UserId (you may need a custom SQL command if needed)
            migrationBuilder.Sql("UPDATE Messages SET UserId = SenderId");

            // Now drop the old column after the data has been copied
            migrationBuilder.DropColumn(
                name: "SenderId",
                table: "Messages");

            // Create the index for the new UserId column
            migrationBuilder.CreateIndex(
                name: "IX_Messages_UserId",
                table: "Messages",
                column: "UserId");

            // Add the foreign key constraint
            migrationBuilder.AddForeignKey(
                name: "FK_Messages_AspNetUsers_UserId",
                table: "Messages",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_AspNetUsers_UserId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_UserId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "SenderId",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
