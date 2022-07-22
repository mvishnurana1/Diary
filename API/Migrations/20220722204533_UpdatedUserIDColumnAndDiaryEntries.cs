using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class UpdatedUserIDColumnAndDiaryEntries : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entries_User_UserID",
                table: "Entries");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "User",
                newName: "ID");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Entries",
                newName: "UserIDID");

            migrationBuilder.RenameIndex(
                name: "IX_Entries_UserID",
                table: "Entries",
                newName: "IX_Entries_UserIDID");

            migrationBuilder.AddForeignKey(
                name: "FK_Entries_User_UserIDID",
                table: "Entries",
                column: "UserIDID",
                principalTable: "User",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entries_User_UserIDID",
                table: "Entries");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "User",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "UserIDID",
                table: "Entries",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Entries_UserIDID",
                table: "Entries",
                newName: "IX_Entries_UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Entries_User_UserID",
                table: "Entries",
                column: "UserID",
                principalTable: "User",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
