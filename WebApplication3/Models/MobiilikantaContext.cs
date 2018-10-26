using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WebApplication3.Models
{
    public partial class MobiilikantaContext : DbContext
    {
        public MobiilikantaContext()
        {
        }

        public MobiilikantaContext(DbContextOptions<MobiilikantaContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Saunat> Saunat { get; set; }
        public virtual DbSet<TalonTiedot> TalonTiedot { get; set; }
        public virtual DbSet<Talot> Talot { get; set; }
        public virtual DbSet<Valot> Valot { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=LAPTOP-57O1DPIH\\SQLEXVILLEAN;Database=Mobiilikanta;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Saunat>(entity =>
            {
                entity.HasKey(e => e.SaunaId);

                entity.Property(e => e.Mittaushetki).HasColumnType("datetime");

                entity.Property(e => e.SaunanNimi).HasMaxLength(100);

                entity.HasOne(d => d.Talo)
                    .WithMany(p => p.Saunat)
                    .HasForeignKey(d => d.TaloId)
                    .HasConstraintName("Fk_Saunat_Talot");
            });

            modelBuilder.Entity<TalonTiedot>(entity =>
            {
                entity.HasKey(e => e.TietoId);

                entity.Property(e => e.Mittaushetki).HasColumnType("datetime");

                entity.HasOne(d => d.Talo)
                    .WithMany(p => p.TalonTiedot)
                    .HasForeignKey(d => d.TaloId)
                    .HasConstraintName("Fk_Talontiedot_Talot");
            });

            modelBuilder.Entity<Talot>(entity =>
            {
                entity.HasKey(e => e.TaloId);

                entity.Property(e => e.TalonNimi).HasMaxLength(100);
            });

            modelBuilder.Entity<Valot>(entity =>
            {
                entity.HasKey(e => e.ValoId);

                entity.Property(e => e.ValonNimi).HasMaxLength(100);

                entity.HasOne(d => d.Talo)
                    .WithMany(p => p.Valot)
                    .HasForeignKey(d => d.TaloId)
                    .HasConstraintName("Fk_Valot_Talot");
            });
        }
    }
}
