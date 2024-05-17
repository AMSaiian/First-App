﻿// <auto-generated />
using System;
using First_App.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace First_App.Infrastructure.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("First_App.Core.Entities.Board", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.HasKey("Id");

                    b.ToTable("Boards");
                });

            modelBuilder.Entity("First_App.Core.Entities.Card", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(2000)
                        .HasColumnType("character varying(2000)");

                    b.Property<DateOnly>("DueDate")
                        .HasColumnType("date");

                    b.Property<int?>("GroupId")
                        .HasColumnType("integer");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<int>("PriorityId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("GroupId");

                    b.HasIndex("PriorityId");

                    b.ToTable("Cards");
                });

            modelBuilder.Entity("First_App.Core.Entities.Change", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("AffectedBoardId")
                        .HasColumnType("integer");

                    b.Property<int>("AffectedCardId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("Time")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("TypeId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("AffectedBoardId");

                    b.HasIndex("AffectedCardId");

                    b.HasIndex("TypeId");

                    b.ToTable("Changes");
                });

            modelBuilder.Entity("First_App.Core.Entities.ChangeParameter", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("ChangeId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.HasKey("Id");

                    b.HasIndex("ChangeId");

                    b.HasIndex("Name", "ChangeId")
                        .IsUnique();

                    b.ToTable("ChangeParameters");
                });

            modelBuilder.Entity("First_App.Core.Entities.ChangeType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("ChangeTypes");
                });

            modelBuilder.Entity("First_App.Core.Entities.GroupList", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("BoardId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.HasKey("Id");

                    b.HasIndex("BoardId");

                    b.ToTable("GroupLists");
                });

            modelBuilder.Entity("First_App.Core.Entities.Priority", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)");

                    b.HasKey("Id");

                    b.HasIndex("Title")
                        .IsUnique();

                    b.ToTable("Priorities");
                });

            modelBuilder.Entity("First_App.Core.Entities.Card", b =>
                {
                    b.HasOne("First_App.Core.Entities.GroupList", "Group")
                        .WithMany("Cards")
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("First_App.Core.Entities.Priority", "Priority")
                        .WithMany("Cards")
                        .HasForeignKey("PriorityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Group");

                    b.Navigation("Priority");
                });

            modelBuilder.Entity("First_App.Core.Entities.Change", b =>
                {
                    b.HasOne("First_App.Core.Entities.Board", "AffectedBoard")
                        .WithMany("Changes")
                        .HasForeignKey("AffectedBoardId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("First_App.Core.Entities.Card", "AffectedCard")
                        .WithMany("ChangeHistory")
                        .HasForeignKey("AffectedCardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("First_App.Core.Entities.ChangeType", "Type")
                        .WithMany("Changes")
                        .HasForeignKey("TypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AffectedBoard");

                    b.Navigation("AffectedCard");

                    b.Navigation("Type");
                });

            modelBuilder.Entity("First_App.Core.Entities.ChangeParameter", b =>
                {
                    b.HasOne("First_App.Core.Entities.Change", "Change")
                        .WithMany("Parameters")
                        .HasForeignKey("ChangeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Change");
                });

            modelBuilder.Entity("First_App.Core.Entities.GroupList", b =>
                {
                    b.HasOne("First_App.Core.Entities.Board", "Board")
                        .WithMany("GroupLists")
                        .HasForeignKey("BoardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Board");
                });

            modelBuilder.Entity("First_App.Core.Entities.Board", b =>
                {
                    b.Navigation("Changes");

                    b.Navigation("GroupLists");
                });

            modelBuilder.Entity("First_App.Core.Entities.Card", b =>
                {
                    b.Navigation("ChangeHistory");
                });

            modelBuilder.Entity("First_App.Core.Entities.Change", b =>
                {
                    b.Navigation("Parameters");
                });

            modelBuilder.Entity("First_App.Core.Entities.ChangeType", b =>
                {
                    b.Navigation("Changes");
                });

            modelBuilder.Entity("First_App.Core.Entities.GroupList", b =>
                {
                    b.Navigation("Cards");
                });

            modelBuilder.Entity("First_App.Core.Entities.Priority", b =>
                {
                    b.Navigation("Cards");
                });
#pragma warning restore 612, 618
        }
    }
}
