using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController:BaseApiController
    {
        private readonly DataContext _context;

        public BuggyController(DataContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpGet("auth")]

        public ActionResult<string> GetSecret()
        {
            return "Its secret";
        }

        [Authorize]
        [HttpGet("not-found")]

        public ActionResult<AppUser> GetNotFound()
        {
            var thing = _context.Users.Find(-1);
            if(thing == null) return NotFound();

            return Ok(thing);
        }

        
        [HttpGet("server-error")]

        public ActionResult<string> GetServerError()
        {
            try{
                var thing = _context.Users.Find(-1);
                var item = thing.ToString();
                return item;

            }catch(Exception ex)
            {
                return StatusCode(500,ex.Message);

            }
            
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("This is a bad request"); 
                
            
        }
    }
}