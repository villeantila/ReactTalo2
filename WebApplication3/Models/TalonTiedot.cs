using System;
using System.Collections.Generic;

namespace WebApplication3.Models
{
    public partial class TalonTiedot
    {
        public int TietoId { get; set; }
        public int? TaloId { get; set; }
        public int? TalonTavoitelampotila { get; set; }
        public int? TalonNykylampotila { get; set; }
        public DateTime? Mittaushetki { get; set; }

        public Talot Talo { get; set; }
    }
}
