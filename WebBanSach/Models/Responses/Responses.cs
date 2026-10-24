namespace WebBanSach.Models.Responses
{
    public class Responses
    {
        public int Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Error { get; set; }
    }
}
