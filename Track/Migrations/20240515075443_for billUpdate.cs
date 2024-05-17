using Microsoft.EntityFrameworkCore.Migrations;

namespace Track.Migrations
{
    public partial class forbillUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BillCreated",
                table: "Chalani",
                type: "nvarchar(1)",
                maxLength: 1,
                defaultValue: "N",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BillCreated",
                table: "Chalani");
        }
    }
}
