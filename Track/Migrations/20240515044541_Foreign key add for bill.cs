using Microsoft.EntityFrameworkCore.Migrations;

namespace Track.Migrations
{
    public partial class Foreignkeyaddforbill : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Bill_id",
                table: "Chalani",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Chalani_Bill_id",
                table: "Chalani",
                column: "Bill_id");

            migrationBuilder.AddForeignKey(
                name: "FK_Chalani_Bill_Bill_id",
                table: "Chalani",
                column: "Bill_id",
                principalTable: "Bill",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chalani_Bill_Bill_id",
                table: "Chalani");

            migrationBuilder.DropIndex(
                name: "IX_Chalani_Bill_id",
                table: "Chalani");

            migrationBuilder.DropColumn(
                name: "Bill_id",
                table: "Chalani");
        }
    }
}
