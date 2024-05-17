using Microsoft.EntityFrameworkCore.Migrations;

namespace Track.Migrations
{
    public partial class Billidmadenullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Bill_Billno",
                table: "Bill");

            migrationBuilder.AlterColumn<string>(
                name: "Billno",
                table: "Bill",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Bill_Billno",
                table: "Bill",
                column: "Billno",
                unique: true,
                filter: "[Billno] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Bill_Billno",
                table: "Bill");

            migrationBuilder.AlterColumn<string>(
                name: "Billno",
                table: "Bill",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bill_Billno",
                table: "Bill",
                column: "Billno",
                unique: true);
        }
    }
}
