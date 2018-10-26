using System;
using System.Collections.Generic;

namespace WebApplication3.Models
{
    public partial class Valot
    {
        public int ValoId { get; set; }
        public string ValonNimi { get; set; }
        public int? TaloId { get; set; }
        public bool ValonTila { get; set; }
        public int? ValonMaara { get; set; }

        public Talot Talo { get; set; }
    }
}
