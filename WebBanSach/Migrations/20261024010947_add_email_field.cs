using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebBanSach.Migrations
{
    /// <inheritdoc />
    public partial class add_email_field : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "DonDatHangs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "ThongTinSachs",
                keyColumn: "Uid",
                keyValue: 1,
                column: "TieuDePhu",
                value: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "DonDatHangs");

            migrationBuilder.UpdateData(
                table: "ThongTinSachs",
                keyColumn: "Uid",
                keyValue: 1,
                column: "TieuDePhu",
                value: "Một hành trình đầy cảm hứng về giấc mơ, lòng dũng cảm và việc lắng nghe tiếng gọi của trái tim.");
        }
    }
}
