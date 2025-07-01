using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers.Mobile
{
    public static class ReservationMapper
    {
        public static ReservationDto toReservationDto(this Reservation reservation)
        {
            return new ReservationDto
            {
                Id = reservation.Id,
                UserId = reservation.UserId,
                Name = reservation.Name,
                Phone = reservation.Phone,
                Email = reservation.Email,
                ReservationDateTime = reservation.ReservationDateTime,
                Status = reservation.Status,


            };
        }
        public static Reservation toReservationFromCreateDto(this ReservationCreateDto dto)
        {
            return new Reservation
            {
                UserId = dto.UserId,
                Name = dto.Name,
                Phone = dto.Phone,
                Email = dto.Email,
                ReservationDateTime = dto.ReservationDateTime,
                Status = "Pending",
            };
        }
    }
}