using Microsoft.EntityFrameworkCore.Migrations;

namespace Track.Migrations
{
    public partial class forextrabillitems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Extra_items",
                table: "billhasProduct",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Extra_items",
                table: "billhasProduct");
        }
    }
}
