using Microsoft.EntityFrameworkCore.Migrations;

namespace Track.Migrations
{
    public partial class Order_has_prioduct_add : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderhasProducts_OrderTable_Order_id",
                table: "OrderhasProducts");

            migrationBuilder.AlterColumn<int>(
                name: "Order_id",
                table: "OrderhasProducts",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "User_id",
                table: "OrderhasProducts",
                type: "nvarchar(450)",
                maxLength: 450,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderhasProducts_User_id",
                table: "OrderhasProducts",
                column: "User_id");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderhasProducts_AspNetUsers_User_id",
                table: "OrderhasProducts",
                column: "User_id",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderhasProducts_OrderTable_Order_id",
                table: "OrderhasProducts",
                column: "Order_id",
                principalTable: "OrderTable",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderhasProducts_AspNetUsers_User_id",
                table: "OrderhasProducts");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderhasProducts_OrderTable_Order_id",
                table: "OrderhasProducts");

            migrationBuilder.DropIndex(
                name: "IX_OrderhasProducts_User_id",
                table: "OrderhasProducts");

            migrationBuilder.DropColumn(
                name: "User_id",
                table: "OrderhasProducts");

            migrationBuilder.AlterColumn<int>(
                name: "Order_id",
                table: "OrderhasProducts",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderhasProducts_OrderTable_Order_id",
                table: "OrderhasProducts",
                column: "Order_id",
                principalTable: "OrderTable",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
