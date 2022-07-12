namespace Backend.Entities
{
    public class ApiExceptions
    {
        public ApiExceptions(int sc, string m = null!, string d = null!)
        {
            StatusCode = sc;
            Message = m;
            Details = d;
        }

        public int StatusCode { get; set; }
        
        public string Message { get; set; }
        
        public string Details { get; set; }
        
    }
}