using System;
using System.Collections.Generic;

namespace WebApplication3.Models
{
    public partial class Saunat
    {
        public int SaunaId { get; set; }
        public string SaunanNimi { get; set; }
        public int? TaloId { get; set; }
        public bool SaunanTila { get; set; }
        public int? SaunanNykylampotila { get; set; }
        public DateTime? Mittaushetki { get; set; }

        public Talot Talo { get; set; }
    }
}
