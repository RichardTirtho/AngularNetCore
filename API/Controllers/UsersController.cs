using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
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
        private readonly IPhotoService _photoService;
        

        public UsersController(IUserRepository userRepository, IMapper mapper,IPhotoService photoService)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _photoService = photoService;
           

            
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTo>>> GetValues()
        {
            var data = await _userRepository.GetMembersAsync();
            //var usersToreturn = _mapper.Map<IEnumerable<MemberDTo>>(data);
            return Ok(data);

        }
         
      
        [HttpGet("{username}", Name ="GetValue")]
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

        [HttpPost("add-photo")]

        public async Task<ActionResult<PhotoDTo>> AddPhoto(IFormFile file)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //var username = User.FindFirstValue(ClaimTypes.Name); 
            string name = "Lisa";
            var user = await _userRepository.GetUserByUsernameAsync(name);

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error != null ) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url =result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0)
            {
                photo.IsMain = true;

            }

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync())
            {
                //return _mapper.Map<PhotoDTo>(photo);
                return CreatedAtRoute("GetValue", new {username = user.UserName}, _mapper.Map<PhotoDTo>(photo));
            }

            return BadRequest("Problem in adding photo");

        }

        
    }
}