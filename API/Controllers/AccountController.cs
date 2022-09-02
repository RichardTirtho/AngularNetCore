using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    
    public class AccountController : BaseApiController
    {

        private readonly DataContext _context;
        private  readonly ITokenService _tokenService;


        public AccountController(DataContext context, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")]
         public async Task<ActionResult<UserDTo>> Register(RegisterDTo registerDTo)
         {
             if(await UserExists(registerDTo.UserName)) return BadRequest("Username Exists");
             using var hmac = new HMACSHA512();

             var user = new AppUser
             {
                 UserName = registerDTo.UserName.ToLower(),
                 PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDTo.password)),
                 PasswordSalt = hmac.Key

             };
             _context.Users.Add(user);
             await _context.SaveChangesAsync();

             return new UserDTo{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
             };
         }

         [HttpPost("login")]
         public async Task<ActionResult<UserDTo>> Login(LoginDTo loginDTo)
         {
             var user = await _context.Users.SingleOrDefaultAsync(x=> x.UserName == loginDTo.username.ToLower());
             if(user == null) return Unauthorized("Invalid Username");
              using var hmac = new HMACSHA512(user.PasswordSalt);
              var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginDTo.password));
              for(int i =0; i< computedHash.Length; i++)
              {
                  if(computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password");
              }

              return new UserDTo{
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
             };

         }

         public async Task<bool> UserExists(string username)
         {
             return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
         }



        
    }
}