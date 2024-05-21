using Microsoft.EntityFrameworkCore.Migrations;

namespace Track.Migrations
{
    public partial class addhasChalani : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "hasChalani",
                table: "Bill",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "hasChalani",
                table: "Bill");
        }
    }
}
