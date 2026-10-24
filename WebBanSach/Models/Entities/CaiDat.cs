using System.ComponentModel.DataAnnotations;

namespace WebBanSach.Models.Entities
{
    public class CaiDat
    {
        [Key]
        public int Uid { get; set; }
        public string SettingKey { get; set; } = string.Empty;
        public string SettingContent { get; set; } = string.Empty;
        public DateTime CreateDate { get; set; }
    }
}
