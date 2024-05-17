using Microsoft.EntityFrameworkCore.Migrations;

namespace Track.Migrations
{
    public partial class OrderhasProductforeignkeyaddedtothetable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockTable_OrderTable_Order_id",
                table: "StockTable");

            migrationBuilder.RenameColumn(
                name: "Order_id",
                table: "StockTable",
                newName: "Order_Products_id");

            migrationBuilder.RenameIndex(
                name: "IX_StockTable_Order_id",
                table: "StockTable",
                newName: "IX_StockTable_Order_Products_id");

            migrationBuilder.AddForeignKey(
                name: "FK_StockTable_OrderhasProducts_Order_Products_id",
                table: "StockTable",
                column: "Order_Products_id",
                principalTable: "OrderhasProducts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockTable_OrderhasProducts_Order_Products_id",
                table: "StockTable");

            migrationBuilder.RenameColumn(
                name: "Order_Products_id",
                table: "StockTable",
                newName: "Order_id");

            migrationBuilder.RenameIndex(
                name: "IX_StockTable_Order_Products_id",
                table: "StockTable",
                newName: "IX_StockTable_Order_id");

            migrationBuilder.AddForeignKey(
                name: "FK_StockTable_OrderTable_Order_id",
                table: "StockTable",
                column: "Order_id",
                principalTable: "OrderTable",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
