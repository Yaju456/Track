using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Track.Models
{
    public class PaymentClass
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string? Method { get; set; }
        [Required]
        public int Amount { get; set; }

        [Range(0, 100)]
        public float? commissionper { get; set; }

        public float? commission { get; set; }
        [StringLength(450)]

        [Required]
        public string? UserId { get; set; }
        [Required]
        public DateTime? Date {  get; set; }

        [Required]
        public int Bill_id { get; set; }
        [ValidateNever]
        [ForeignKey(nameof(Bill_id))]
        public BillClass? Bill { get; set; }

        [ForeignKey(nameof(UserId))]
        public IdentityUser? User { get; set; }

    }
}
