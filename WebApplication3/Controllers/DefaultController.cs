﻿using System;
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
        public List<Talot> Talot()
        {
            MobiilikantaContext db = new MobiilikantaContext();
            List<Talot> talot = db.Talot.ToList();
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
        public List<Valot> Valot(int id)
        {
            MobiilikantaContext db = new MobiilikantaContext();
            List<Valot> valot = (from v in db.Valot
                                 where v.TaloId == id
                                 select v).ToList();
            db.Dispose();
            return valot;
        }

        [HttpGet]
        [Route("api/Saunat/{id}")]
        public List<Saunat> Saunat(int id)
        {
            MobiilikantaContext db = new MobiilikantaContext();
            List<Saunat> saunat = (from s in db.Saunat
                                   where s.TaloId == id
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
            TalonTiedot dbItem = db.TalonTiedot.Find(tiedot.TaloId);
            if (dbItem != null)
            {
                if (tiedot.TalonTavoitelampotila != null) // jos frontista tulee arvo, niin päivitetään se kantaan
                {
                    dbItem.TalonTavoitelampotila = tiedot.TalonTavoitelampotila;
                }
                else // jos frontista ei tule arvoa, niin "tarkistetaan" (eli asetetaan nykylämpö samaksi kuin tavoite)
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

        public bool MuutaValonTilaa(Valot uusi)
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

        [HttpPost]
        [Route("api/MuutaSaunanTilaa")]

        public bool MuokkaaSaunaa(Saunat uusi)
        {
            bool OK = false;
            MobiilikantaContext db = new MobiilikantaContext();

            Saunat sauna = db.Saunat.Find(uusi.SaunaId);

            sauna.SaunanTila = uusi.SaunanTila;
            try
            {
                db.Entry(sauna).State = EntityState.Modified;
                db.SaveChanges();
                OK = true;
            }
            finally
            {
                db.Dispose();
            }
            return OK;
        }

        [HttpGet]
        [Route("api/MittaaSauna/{id}")]
        public int? MittaaSauna(int id)
        {
            MobiilikantaContext db = new MobiilikantaContext();
            Saunat sauna = db.Saunat.Find(id);
            Random rand = new Random();

            try
            {
                if (sauna.SaunanTila)
                {
                    sauna.SaunanNykylampotila = rand.Next(80, 91);
                }
                else
                {
                    sauna.SaunanNykylampotila = rand.Next(18, 25);
                }
                sauna.Mittaushetki = DateTime.Now;
                db.Entry(sauna).State = EntityState.Modified;
                db.SaveChanges();
            }
            finally
            {
                db.Dispose();
            }
            return sauna.SaunanNykylampotila;
        }
    }
}