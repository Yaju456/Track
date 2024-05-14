﻿using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Track.Models
{
    public class ChalaniClass
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public DateTime Send { get; set; }

        [Required]
        public int Customer_id { get; set; }
        [ValidateNever]
        [ForeignKey(nameof(Customer_id))]
        public CustomerClass? Customer { get; set; }

        [Required]
        public string? Address{ get; set;}
        [Range(9800000000, 9899999999)]
        public long? PhoneNumber { get; set;}

        public string? Remarks { get; set; }
    }
}
