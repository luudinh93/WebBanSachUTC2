using System.ComponentModel.DataAnnotations;

namespace WebBanSach.Models.Entities
{
    public class TinhTrangDonHang
    {
        [Key]
        public string MaTinhTrang { get; set; } = string.Empty;
        public string TenTinhTrang { get; set; } = string.Empty;
        public int Ordering { get; set; }
    }
}
