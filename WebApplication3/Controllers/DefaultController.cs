using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using WebApplication3.Models;


namespace WebApplication3.Controllers
{

    public class DefaultController : Controller
    {

        [HttpGet]
        [Route("api/Talot")]
        public IEnumerable<Talot> Talot()
        {
            MobiilikantaContext db = new MobiilikantaContext();
            IEnumerable<Talot> talot = db.Talot.ToList();
            db.Dispose();
            return talot;
        }

        [HttpGet]
        [Route("api/TalonTiedot/{id}")]
        public TalonTiedot TalonTiedot(int id)
        {
            MobiilikantaContext db = new MobiilikantaContext();
            TalonTiedot tiedot = db.TalonTiedot.Find(id);
            db.Dispose();
            return tiedot;
        }

        [HttpGet]
        [Route("api/Valot/{id}")]
        public IEnumerable<Valot> Valot(int id)
        {
            MobiilikantaContext db = new MobiilikantaContext();
            IEnumerable<Valot> valot = (from v in db.Valot
                                        where v.TaloId == id
                                        orderby v.ValoId ascending
                                        select v).ToList();
            db.Dispose();
            return valot;
        }

        [HttpGet]
        [Route("api/Saunat/{id}")]
        public IEnumerable<Saunat> Saunat(int id)
        {
            MobiilikantaContext db = new MobiilikantaContext();
            IEnumerable<Saunat> saunat = (from s in db.Saunat
                                          where s.TaloId == id
                                          orderby s.SaunaId ascending
                                          select s).ToList();
            db.Dispose();
            return saunat;
        }

        [HttpPost]
        [Route("api/MuutaTalonTietoja")]

        public bool MuutaTalonTietoja(TalonTiedot tiedot)
        {
            bool OK = false;
            MobiilikantaContext db = new MobiilikantaContext();
            TalonTiedot dbItem = (from c in db.TalonTiedot
                                  where c.TaloId == tiedot.TaloId
                                  select c).FirstOrDefault();

            if (dbItem != null)
            {
                if (tiedot.TalonTavoitelampotila != null)
                {
                    dbItem.TalonTavoitelampotila = tiedot.TalonTavoitelampotila;
                }
                else
                {
                    dbItem.TalonNykylampotila = dbItem.TalonTavoitelampotila;
                    dbItem.Mittaushetki = DateTime.Now;
                }
                db.SaveChanges();
                OK = true;
            }

            db.Dispose();
            return OK;
        }

        [HttpPost]
        [Route("api/MuutaValonTilaa")]

        public bool MuokkaaValoa(Valot uusi)
        {
            bool OK = false;
            MobiilikantaContext db = new MobiilikantaContext();

            Valot valo = db.Valot.Find(uusi.ValoId);
            valo.ValonMaara = uusi.ValonMaara;
            try
            {
                db.Entry(valo).State = EntityState.Modified;
                db.SaveChanges();
                OK = true;
            }

            finally
            {
                db.Dispose();
            }
            return OK;

        }
    }
}