using API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Helpers;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    ////184
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void AddGroup(Group group)
        {
            _context.Groups?.Add(group);
        }

        public void AddMessage(Message message)
        {
            _context.Messages?.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages!.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            var result = await _context.Connections!.FindAsync(connectionId);
            return result!;
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            var result = await _context.Groups!.FindAsync(connectionId);
            return result!;
        }

        public async Task<Message> GetMessage(int id)
        {
            var result = await _context.Messages!
                .Include(u => u.Sender)
                .Include(u => u.Recipient)
                .SingleOrDefaultAsync(x => x.Id == id);
            return result!;
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            var result = await _context.Groups!
                .Include(x => x.Connections)
                .FirstOrDefaultAsync(x => x.Name == groupName);
            return result!;
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
             var query = _context.Messages!
                .OrderByDescending(m => m.MessageSent)
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username
                                            && u.RecipientDeleted == false),
                "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username
                                             && u.SenderDeleted == false),
                _ => query.Where(u => u.RecipientUsername ==
                    messageParams.Username && u.RecipientDeleted == false && u.DateRead == null)
            };

            // var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            return await PagedList<MessageDto>.CreatePageAsync(query, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await _context.Messages!
                .Include(u => u.Sender).ThenInclude(p => p!.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p!.Photos)
                .Where(m => m.Recipient!.UserName == currentUsername && m.RecipientDeleted == false
                        && m.Sender!.UserName == recipientUsername
                        || m.Recipient!.UserName == recipientUsername
                        && m.Sender!.UserName == currentUsername && m.SenderDeleted == false
                )
                .OrderBy(m => m.MessageSent)
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null 
                && m.RecipientUsername == currentUsername).ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}