using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    //[Authorize]
    
        public class UsersController : BaseApiController
    {
        
       
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper )
        {
            _mapper = mapper;
            _userRepository = userRepository;
            
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTo>>> GetValues()
        {
            var data = await _userRepository.GetMembersAsync();
            //var usersToreturn = _mapper.Map<IEnumerable<MemberDTo>>(data);
            return Ok(data);

        }
         
      
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDTo>> GetValue (string username)
        {
            return await _userRepository.GetMemberAsync(username);
            //return _mapper.Map<MemberDTo>(user);
            

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTo memberUpdateDTo)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);

            _mapper.Map(memberUpdateDTo,user);
            _userRepository.Update(user);

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed To update user");

        }

        
    }
}