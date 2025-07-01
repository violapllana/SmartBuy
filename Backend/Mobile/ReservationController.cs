using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartBuy.Data;

namespace Backend.Controllers.Mobile
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReservationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> GetReservations()
        {
            var reservations = await _context.Reservations.ToListAsync();

            if (reservations == null || reservations.Count == 0)
                return NotFound("No reservations found.");

            var reservationDtos = reservations.Select(r => r.toReservationDto()).ToList();

            return Ok(reservationDtos);
        }









        [HttpGet("{id}")]
        public async Task<ActionResult> GetReservation(int id)
        {
            var reservation = _context.Reservations.Find(id);
            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(reservation.toReservationDto());
        }











        [HttpPost]
        public async Task<ActionResult> CreateReservation([FromBody] ReservationCreateDto reservationDto)
        {
            if (reservationDto == null)
                return BadRequest("Reservation data is required.");

            var reservation = reservationDto.toReservationFromCreateDto();

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservation.toReservationDto());
        }



        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateReservation([FromBody] ReservationDto reservationDto, [FromRoute] int id)
        {
            var reservation = _context.Reservations.Find(id);

            reservation.UserId = reservationDto.UserId;
            reservation.Name = reservationDto.Name;
            reservation.Phone = reservationDto.Phone;
            reservation.Email = reservationDto.Email;
            reservation.ReservationDateTime = reservationDto.ReservationDateTime;
            reservation.Status = reservationDto.Status;


            await _context.SaveChangesAsync();

            return Ok(reservation.toReservationDto());


        }








        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReservation([FromRoute] int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }





    }
}
