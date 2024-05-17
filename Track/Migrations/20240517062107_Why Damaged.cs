using Microsoft.EntityFrameworkCore.Migrations;

namespace Track.Migrations
{
    public partial class WhyDamaged : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Damaged_why",
                table: "StockTable",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Damaged_why",
                table: "StockTable");
        }
    }
}
