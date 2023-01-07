using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class UpdatedDailyTodoEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToDoPerformance_User_UserID",
                table: "ToDoPerformance");

            migrationBuilder.RenameColumn(
                name: "DateDue",
                table: "DailyTodo",
                newName: "DateCreated");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserID",
                table: "ToDoPerformance",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCompleted",
                table: "DailyTodo",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ToDoPerformance_User_UserID",
                table: "ToDoPerformance",
                column: "UserID",
                principalTable: "User",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToDoPerformance_User_UserID",
                table: "ToDoPerformance");

            migrationBuilder.DropColumn(
                name: "DateCompleted",
                table: "DailyTodo");

            migrationBuilder.RenameColumn(
                name: "DateCreated",
                table: "DailyTodo",
                newName: "DateDue");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserID",
                table: "ToDoPerformance",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_ToDoPerformance_User_UserID",
                table: "ToDoPerformance",
                column: "UserID",
                principalTable: "User",
                principalColumn: "UserID");
        }
    }
}
