using System;
using System.Collections.Generic;

namespace WebApplication3.Models
{
    public partial class Talot
    {
        public Talot()
        {
            Saunat = new HashSet<Saunat>();
            TalonTiedot = new HashSet<TalonTiedot>();
            Valot = new HashSet<Valot>();
        }

        public int TaloId { get; set; }
        public string TalonNimi { get; set; }

        public ICollection<Saunat> Saunat { get; set; }
        public ICollection<TalonTiedot> TalonTiedot { get; set; }
        public ICollection<Valot> Valot { get; set; }
    }
}
