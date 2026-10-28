namespace WebBanSach.Models.Responses
{
    public class Responses
    {
        public int Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }
        public int Total { get; set; } = 0;
        public string? Error { get; set; }
    }
}
