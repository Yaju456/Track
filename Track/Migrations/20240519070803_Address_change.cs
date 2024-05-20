using Microsoft.EntityFrameworkCore.Migrations;

namespace Track.Migrations
{
    public partial class Address_change : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Chalani");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "CustomerTable",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "CustomerTable");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Chalani",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
