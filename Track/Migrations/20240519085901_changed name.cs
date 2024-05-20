using Microsoft.EntityFrameworkCore.Migrations;

namespace Track.Migrations
{
    public partial class changedname : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Payment",
                newName: "PDate");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PDate",
                table: "Payment",
                newName: "Date");
        }
    }
}
